import { readFile, writeFile, rename, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { CONTENIDO_INICIAL } from './contenidoInicial.js'

/**
 * ===== Almacen de contenido =====
 *
 * VERSION INICIAL: la persistencia es un unico archivo JSON. Es suficiente
 * para un solo administrador y un volumen de contenido pequeno, y evita
 * arrastrar una base de datos antes de necesitarla.
 *
 * Todo el acceso al disco pasa por este modulo, asi que migrar a SQLite o a
 * Postgres mas adelante es reescribir "leer" y "guardar" sin tocar el resto
 * del backend. Ver la nota de migracion en el README.
 */

const AQUI = dirname(fileURLToPath(import.meta.url))
const ARCHIVO = join(AQUI, '..', '..', 'data', 'contenido.json')

/* Copia en memoria: se lee del disco una vez y se sirve desde aqui */
let cache = null

/* Cola de escrituras: evita que dos guardados simultaneos se pisen */
let escribiendo = Promise.resolve()

async function asegurarCarpeta() {
	const carpeta = dirname(ARCHIVO)
	if (!existsSync(carpeta)) await mkdir(carpeta, { recursive: true })
}

/**
 * Escritura atomica: se escribe en un temporal y se renombra encima.
 * Si el proceso muere a mitad, el archivo bueno sigue intacto en lugar de
 * quedar truncado.
 */
async function escribir(datos) {
	await asegurarCarpeta()

	const temporal = `${ARCHIVO}.tmp`
	await writeFile(temporal, JSON.stringify(datos, null, 2), 'utf8')
	await rename(temporal, ARCHIVO)
}

/** Devuelve todo el contenido; siembra el archivo la primera vez */
export async function leer() {
	if (cache) return cache

	try {
		const crudo = await readFile(ARCHIVO, 'utf8')
		cache = JSON.parse(crudo)
	} catch (error) {
		if (error.code !== 'ENOENT') {
			console.error('[almacen] El archivo de contenido no se pudo leer:', error.message)
			console.error('[almacen] Se arranca con el contenido inicial.')
		}

		cache = structuredClone(CONTENIDO_INICIAL)
		await escribir(cache)
	}

	return cache
}

/** Reemplaza una seccion completa y la deja guardada en disco */
export async function guardarSeccion(seccion, valor) {
	const actual = await leer()
	const siguiente = { ...actual, [seccion]: valor }

	/* Encadenar mantiene el orden aunque lleguen dos peticiones a la vez */
	escribiendo = escribiendo.then(() => escribir(siguiente)).catch((error) => {
		console.error('[almacen] Fallo al guardar:', error.message)
		throw error
	})

	await escribiendo
	cache = siguiente

	return siguiente[seccion]
}

/** Vuelve a dejar el contenido como venia de fabrica */
export async function restaurar() {
	cache = structuredClone(CONTENIDO_INICIAL)
	await escribir(cache)

	return cache
}

export default { leer, guardarSeccion, restaurar }
