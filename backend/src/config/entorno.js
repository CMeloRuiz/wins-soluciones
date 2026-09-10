import 'dotenv/config'
import bcrypt from 'bcryptjs'

/**
 * Lee y valida la configuracion del servidor.
 *
 * Nada de credenciales en el codigo: todo llega por variables de entorno,
 * documentadas en .env.example.
 */

function requerida(nombre) {
	const valor = process.env[nombre]

	if (!valor) {
		console.error(`\n[config] Falta la variable de entorno ${nombre}.`)
		console.error('[config] Copia .env.example a .env y completalo antes de arrancar.\n')
		process.exit(1)
	}

	return valor
}

/**
 * Devuelve el hash de la clave del administrador.
 *
 * Lo recomendado es guardar ya el hash en ADMIN_CLAVE_HASH (generalo con
 * "npm run hash -- tuClave"). Como alternativa para empezar rapido se acepta
 * ADMIN_CLAVE en texto plano y se hashea aqui en memoria, pero se avisa por
 * consola porque deja la clave legible en el archivo .env.
 */
function resolverClave() {
	if (process.env.ADMIN_CLAVE_HASH) return process.env.ADMIN_CLAVE_HASH

	if (process.env.ADMIN_CLAVE) {
		console.warn('\n[config] Estas usando ADMIN_CLAVE en texto plano.')
		console.warn('[config] Para produccion genera el hash con "npm run hash -- tuClave"')
		console.warn('[config] y guardalo en ADMIN_CLAVE_HASH.\n')

		return bcrypt.hashSync(process.env.ADMIN_CLAVE, 10)
	}

	console.error('\n[config] Falta ADMIN_CLAVE_HASH (o ADMIN_CLAVE) en el .env.\n')
	process.exit(1)
}

export const config = {
	puerto: Number(process.env.PORT) || 4000,

	/* Origenes permitidos por CORS, separados por coma en el .env */
	origenes: (process.env.ORIGENES_PERMITIDOS || 'http://localhost:5173')
		.split(',')
		.map((o) => o.trim())
		.filter(Boolean),

	jwtSecreto: requerida('JWT_SECRETO'),
	jwtDuracion: process.env.JWT_DURACION || '8h',

	admin: {
		usuario: requerida('ADMIN_USUARIO'),
		claveHash: resolverClave(),
	},

	/* Limite de subida de imagenes, en megabytes */
	maxImagenMb: Number(process.env.MAX_IMAGEN_MB) || 4,

	baseDatos: {
		/*
		 * Cadena de conexion de Neon. No se usa requerida(): si falta, el
		 * servidor tiene que arrancar igual para poder responder 503 con una
		 * explicacion, en vez de morir sin que nadie vea por que.
		 */
		url: process.env.DATABASE_URL || '',
	},
}

export default config
