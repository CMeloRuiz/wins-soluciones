import { consultar } from '../config/db.js'
import { CONTENIDO_INICIAL } from './contenidoInicial.js'

/**
 * ===== Almacen de contenido =====
 *
 * La persistencia vive en PostgreSQL (Neon), en la tabla "contenido": una
 * fila por seccion editable, con el JSON de la seccion en una columna JSONB.
 * Ver db/schema.sql.
 *
 * Antes esto era un archivo local, data/contenido.json. Se migro porque en
 * Render el disco de un Web Service es efimero y el archivo se perdia en cada
 * despliegue. Ese archivo sigue en el repositorio como respaldo historico,
 * pero el backend ya no lo lee ni lo escribe.
 *
 * La interfaz publica no cambio con la migracion: leer, guardarSeccion y
 * restaurar reciben y devuelven lo mismo que antes, asi que los controladores
 * y el panel no se enteraron.
 */

/* Las tres secciones que maneja el panel, y el orden en que se siembran */
const SECCIONES = Object.keys(CONTENIDO_INICIAL)

/*
 * Copia en memoria, igual que en la version de archivo: el sitio publico pide
 * el contenido en cada visita y no tiene sentido ir a la base cada vez. Se
 * invalida al guardar, asi que un cambio del panel se ve al instante.
 *
 * Con una sola instancia del servidor esto es exacto. Si algun dia corren
 * varias a la vez, cada una tendria su copia y un cambio tardaria en verse en
 * las demas; entonces habria que quitar el cache o darle un tiempo de vida.
 */
let cache = null

/** Convierte las filas de la tabla al objeto que espera el resto del backend */
function aObjeto(filas) {
	return Object.fromEntries(filas.map((f) => [f.clave, f.datos]))
}

/**
 * Escribe una seccion. Si la clave ya existe se actualiza, y si no se crea.
 *
 * El JSON se manda como parametro y se convierte con ::jsonb dentro de la
 * consulta: asi nunca se concatena contenido del usuario en el SQL.
 */
async function escribirSeccion(clave, valor) {
	await consultar(
		`INSERT INTO contenido (clave, datos)
		 VALUES ($1, $2::jsonb)
		 ON CONFLICT (clave)
		 DO UPDATE SET datos = EXCLUDED.datos, actualizado_en = NOW()`,
		[clave, JSON.stringify(valor)]
	)
}

/**
 * Siembra las secciones que falten con el contenido de fabrica.
 *
 * Pasa la primera vez, con la tabla recien creada y sin migrar. El
 * "DO NOTHING" es lo que lo hace seguro: si la seccion ya existe no la toca,
 * asi que esto nunca pisa lo que haya editado el administrador.
 */
async function sembrarLoQueFalte(presentes) {
	const faltan = SECCIONES.filter((clave) => !presentes.includes(clave))
	if (faltan.length === 0) return false

	for (const clave of faltan) {
		await consultar(
			`INSERT INTO contenido (clave, datos)
			 VALUES ($1, $2::jsonb)
			 ON CONFLICT (clave) DO NOTHING`,
			[clave, JSON.stringify(CONTENIDO_INICIAL[clave])]
		)
	}

	console.log(`[almacen] Secciones sembradas con el contenido inicial: ${faltan.join(', ')}`)
	return true
}

/** Devuelve todo el contenido, con las tres secciones garantizadas */
export async function leer() {
	if (cache) return cache

	const { rows } = await consultar('SELECT clave, datos FROM contenido')

	if (await sembrarLoQueFalte(rows.map((f) => f.clave))) {
		const completo = await consultar('SELECT clave, datos FROM contenido')
		cache = aObjeto(completo.rows)
	} else {
		cache = aObjeto(rows)
	}

	return cache
}

/** Reemplaza una seccion completa y devuelve como quedo */
export async function guardarSeccion(seccion, valor) {
	await escribirSeccion(seccion, valor)

	/*
	 * El cache se actualiza despues de que la base confirme. Si la escritura
	 * falla, se propaga el error y el cache se queda como estaba, sin mostrar
	 * como guardado algo que no llego a guardarse.
	 */
	cache = { ...(cache ?? {}), [seccion]: valor }

	return valor
}

/** Vuelve a dejar el contenido como venia de fabrica */
export async function restaurar() {
	for (const clave of SECCIONES) {
		await escribirSeccion(clave, CONTENIDO_INICIAL[clave])
	}

	cache = structuredClone(CONTENIDO_INICIAL)
	return cache
}

export default { leer, guardarSeccion, restaurar }
