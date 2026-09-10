import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createInterface } from 'node:readline/promises'
import { consultar, cerrarPool } from '../config/db.js'

/**
 * ===== Migracion del contenido del archivo JSON a PostgreSQL =====
 *
 *   npm run migrar
 *
 * Lee data/contenido.json y escribe cada seccion como una fila de la tabla
 * "contenido". Se ejecuta una sola vez, al pasar del almacenamiento en
 * archivo al de base de datos.
 *
 * Es seguro repetirlo: si la tabla ya tiene esas secciones, avisa de cuales y
 * pide confirmacion antes de sobrescribir. Con --forzar no pregunta, para
 * poder lanzarlo sin alguien delante.
 */

const AQUI = dirname(fileURLToPath(import.meta.url))
const ARCHIVO = join(AQUI, '..', '..', 'data', 'contenido.json')

const FORZAR = process.argv.includes('--forzar')

/* Las unicas claves que se aceptan: evita meter basura si el JSON trae de mas */
const SECCIONES_VALIDAS = ['hero', 'imagenes', 'cobertura']

function abortar(mensaje) {
	console.error(`\n  ${mensaje}\n`)
	process.exitCode = 1
}

async function preguntar(texto) {
	/* Sin terminal interactiva no se puede confirmar: mejor parar que adivinar */
	if (!process.stdin.isTTY) {
		console.log('\n  No hay terminal interactiva para confirmar.')
		console.log('  Vuelve a lanzarlo con --forzar si quieres sobrescribir.')
		return false
	}

	const consola = createInterface({ input: process.stdin, output: process.stdout })
	const respuesta = await consola.question(texto)
	consola.close()

	return respuesta.trim().toLowerCase() === 'si'
}

async function main() {
	console.log('\n  Migracion de contenido a PostgreSQL\n')

	/* ===== 1. El archivo de origen ===== */
	let contenido

	try {
		contenido = JSON.parse(await readFile(ARCHIVO, 'utf8'))
	} catch (error) {
		if (error.code === 'ENOENT') {
			return abortar(
				'No existe data/contenido.json, asi que no hay nada que migrar.\n' +
				'  Si es una instalacion nueva no hace falta: el backend siembra\n' +
				'  las secciones con el contenido inicial al arrancar.'
			)
		}
		return abortar(`data/contenido.json no se pudo leer: ${error.message}`)
	}

	const secciones = Object.keys(contenido).filter((c) => SECCIONES_VALIDAS.includes(c))
	const ignoradas = Object.keys(contenido).filter((c) => !SECCIONES_VALIDAS.includes(c))

	if (secciones.length === 0) {
		return abortar('El archivo no tiene ninguna seccion conocida (hero, imagenes, cobertura).')
	}

	console.log(`  Origen: data/contenido.json`)
	for (const clave of secciones) {
		const valor = contenido[clave]
		const detalle = Array.isArray(valor)
			? `${valor.length} elementos`
			: `${Object.keys(valor).length} campos`
		console.log(`    - ${clave.padEnd(10)} ${detalle}`)
	}
	if (ignoradas.length) console.log(`  Se ignoran claves desconocidas: ${ignoradas.join(', ')}`)

	/* ===== 2. Que hay ya en la base ===== */
	let existentes
	try {
		const { rows } = await consultar('SELECT clave FROM contenido')
		existentes = rows.map((f) => f.clave)
	} catch (error) {
		if (error.code === '42P01') {
			return abortar(
				'La tabla "contenido" no existe todavia.\n' +
				'  Crea el esquema primero:  npm run db:crear'
			)
		}
		return abortar(`No se pudo consultar la base de datos: ${error.message}`)
	}

	const chocan = secciones.filter((c) => existentes.includes(c))

	if (chocan.length > 0 && !FORZAR) {
		console.log(`\n  La tabla ya tiene estas secciones: ${chocan.join(', ')}`)
		console.log('  Continuar las SOBRESCRIBE con lo que hay en el archivo.')
		console.log('  Si ya has editado contenido desde el panel, perderias esos cambios.')

		if (!await preguntar('\n  Escribe "si" para sobrescribir: ')) {
			console.log('\n  Cancelado. No se toco nada.\n')
			return
		}
	}

	/* ===== 3. Escribir, todo o nada ===== */
	let migradas = 0

	try {
		await consultar('BEGIN')

		for (const clave of secciones) {
			await consultar(
				`INSERT INTO contenido (clave, datos)
				 VALUES ($1, $2::jsonb)
				 ON CONFLICT (clave)
				 DO UPDATE SET datos = EXCLUDED.datos, actualizado_en = NOW()`,
				[clave, JSON.stringify(contenido[clave])]
			)
			migradas++
		}

		await consultar('COMMIT')
	} catch (error) {
		await consultar('ROLLBACK').catch(() => {})
		return abortar(`Fallo al escribir, no se migro nada: ${error.message}`)
	}

	/* ===== 4. Resumen ===== */
	const { rows } = await consultar(
		'SELECT clave, actualizado_en FROM contenido ORDER BY clave'
	)

	console.log(`\n  Migradas ${migradas} de ${secciones.length} secciones.\n`)
	console.log('  Estado de la tabla:')
	for (const fila of rows) {
		const marca = secciones.includes(fila.clave) ? 'migrada' : 'ya estaba'
		console.log(`    - ${fila.clave.padEnd(10)} ${marca.padEnd(10)} ${fila.actualizado_en.toISOString()}`)
	}

	console.log('\n  data/contenido.json se conserva como respaldo. El backend ya no lo usa.\n')
}

try {
	await main()
} catch (error) {
	abortar(`Error inesperado: ${error.message}`)
} finally {
	await cerrarPool()
}
