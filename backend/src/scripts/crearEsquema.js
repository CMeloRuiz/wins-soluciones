import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { consultar, cerrarPool } from '../config/db.js'

/**
 * Aplica db/schema.sql sobre la base configurada en DATABASE_URL.
 *
 *   npm run db:crear
 *
 * Alternativa a pegar el SQL en el editor del panel de Neon. El esquema usa
 * "CREATE TABLE IF NOT EXISTS", asi que repetirlo no borra ni altera datos.
 */

const AQUI = dirname(fileURLToPath(import.meta.url))
const ESQUEMA = join(AQUI, '..', '..', 'db', 'schema.sql')

try {
	const sql = await readFile(ESQUEMA, 'utf8')

	console.log('\n  Aplicando db/schema.sql...')
	await consultar(sql)

	/* Se comprueba con el catalogo, no con la ausencia de error */
	const { rows } = await consultar(
		`SELECT column_name, data_type
		 FROM information_schema.columns
		 WHERE table_name = 'contenido'
		 ORDER BY ordinal_position`
	)

	if (rows.length === 0) {
		console.error('\n  La tabla "contenido" no aparece despues de aplicar el esquema.\n')
		process.exitCode = 1
	} else {
		console.log('\n  Tabla "contenido" lista:')
		for (const c of rows) console.log(`    - ${c.column_name.padEnd(15)} ${c.data_type}`)
		console.log('\n  Siguiente paso:  npm run migrar\n')
	}
} catch (error) {
	console.error(`\n  No se pudo aplicar el esquema: ${error.message}\n`)
	process.exitCode = 1
} finally {
	await cerrarPool()
}
