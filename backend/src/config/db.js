import pg from 'pg'
import { config } from './entorno.js'

/**
 * ===== Conexion a PostgreSQL (Neon) =====
 *
 * Aqui vive todo lo que sabe de la base de datos: la conexion, el pool y la
 * traduccion de fallos de red a un error que el resto del backend entiende.
 * Los controladores no importan "pg" en ningun sitio; hablan con el almacen,
 * y el almacen habla con este modulo.
 */

const { Pool } = pg

/*
 * Con Neon se usa la cadena "Pooled connection", que apunta a su pooler
 * (el host lleva "-pooler"). Aun asi se abre un pool aqui: el de Neon reparte
 * conexiones entre clientes, y este reaprovecha las de este proceso sin
 * reconectar en cada consulta.
 */
const POOL = {
	/* Neon corta las conexiones inactivas, y un pool grande no aporta nada
	   con un solo administrador. Cinco sobra y deja margen al plan gratuito. */
	max: 5,
	idleTimeoutMillis: 30_000,
	/* Su plan gratuito suspende el compute al rato; despertarlo tarda unos
	   segundos, asi que el plazo de conexion es holgado a proposito. */
	connectionTimeoutMillis: 10_000,
}

let pool = null

/** Neon siempre pide TLS; un Postgres local normalmente no lo tiene montado */
function necesitaSsl(url) {
	return !/@(localhost|127\.0\.0\.1)/.test(url)
}

/*
 * Parametros de TLS que trae la cadena de Neon y que aqui sobran.
 *
 * "sslmode" lo interpreta pg-connection-string, que hoy trata "require" como
 * "verify-full" y avisa por consola de que en pg v9 pasara a la semantica de
 * libpq, mas debil. Para no depender de ese cambio, se quitan de la cadena y
 * el TLS se configura abajo de forma explicita: certificado verificado
 * siempre. "channel_binding" node-postgres no lo usa, asi que solo estorba.
 */
function sinParametrosTls(url) {
	try {
		const direccion = new URL(url)
		direccion.searchParams.delete('sslmode')
		direccion.searchParams.delete('channel_binding')
		return direccion.toString()
	} catch {
		/* Si no parsea, se deja tal cual y que falle la conexion con su motivo */
		return url
	}
}

/**
 * Error de infraestructura, no del usuario.
 *
 * Lleva status 503 para que el manejador de errores responda "servicio no
 * disponible" y el panel pueda explicarlo, en vez de un 500 generico.
 */
export class ErrorBaseDatos extends Error {
	constructor(mensaje, causa) {
		super(mensaje)
		this.name = 'ErrorBaseDatos'
		this.status = 503
		this.causa = causa
	}
}

/** Crea el pool la primera vez que hace falta */
function obtenerPool() {
	if (pool) return pool

	if (!config.baseDatos.url) {
		throw new ErrorBaseDatos(
			'La base de datos no esta configurada. Falta DATABASE_URL en el servidor.'
		)
	}

	pool = new Pool({
		connectionString: sinParametrosTls(config.baseDatos.url),
		/*
		 * rejectUnauthorized valida la cadena del certificado y el nombre del
		 * host, que es lo que Neon necesita y equivale a sslmode=verify-full.
		 */
		ssl: necesitaSsl(config.baseDatos.url) ? { rejectUnauthorized: true } : false,
		...POOL,
	})

	/*
	 * Un cliente inactivo puede fallar fuera de toda consulta (Neon lo cierra,
	 * se cae la red). Sin este oyente, "pg" lo emite como error no capturado y
	 * tumba el proceso entero.
	 */
	pool.on('error', (error) => {
		console.error('[db] Conexion inactiva perdida:', error.message)
	})

	return pool
}

/**
 * Lanza una consulta y devuelve el resultado.
 *
 * Los fallos de conexion se envuelven en ErrorBaseDatos con un mensaje que se
 * le puede ensenar a alguien; los de SQL se dejan pasar tal cual, porque son
 * errores de programacion y deben verse enteros en el log.
 *
 * @param {string} sql
 * @param {Array} parametros  Siempre parametrizado ($1, $2...), nunca concatenado
 */
export async function consultar(sql, parametros = []) {
	let cliente

	try {
		cliente = await obtenerPool().connect()
	} catch (error) {
		if (error instanceof ErrorBaseDatos) throw error

		console.error('[db] No se pudo conectar:', error.message)
		throw new ErrorBaseDatos('No se pudo conectar a la base de datos', error)
	}

	try {
		return await cliente.query(sql, parametros)
	} catch (error) {
		/* Sin conexion o conexion caida a mitad: tambien es indisponibilidad */
		if (['ECONNRESET', 'ETIMEDOUT', 'ENOTFOUND', 'ECONNREFUSED', '57P01'].includes(error.code)) {
			console.error('[db] Conexion interrumpida:', error.message)
			throw new ErrorBaseDatos('Se perdio la conexion con la base de datos', error)
		}

		throw error
	} finally {
		cliente.release()
	}
}

/**
 * Comprueba al arrancar que la base responde.
 *
 * No corta el arranque si falla: el servidor tiene que quedar en pie para
 * poder responder 503 con una explicacion. Devuelve si hubo conexion.
 */
export async function verificarConexion() {
	try {
		const { rows } = await consultar('SELECT NOW() AS ahora')
		console.log(`  Base de datos conectada (${rows[0].ahora.toISOString()})`)
		return true
	} catch (error) {
		console.error('\n[db] AVISO: la base de datos no responde.')
		console.error(`[db] ${error.message}`)
		console.error('[db] La API arranca igual, pero el contenido respondera 503')
		console.error('[db] hasta que la conexion funcione. Revisa DATABASE_URL.\n')
		return false
	}
}

/** Cierra el pool. Solo lo usan los scripts, para que el proceso termine */
export async function cerrarPool() {
	if (!pool) return

	await pool.end()
	pool = null
}

export default { consultar, verificarConexion, cerrarPool, ErrorBaseDatos }
