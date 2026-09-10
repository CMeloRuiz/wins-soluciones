import bcrypt from 'bcryptjs'
import { createInterface } from 'node:readline'
import { stdin, stdout } from 'node:process'

/**
 * Genera el hash de la clave del administrador, o comprueba si una clave
 * coincide con el hash que ya esta en el .env.
 *
 *   npm run hash              genera un hash nuevo
 *   npm run hash -- --probar  comprueba la clave contra ADMIN_CLAVE_HASH
 *
 * La clave se pide por teclado y no como argumento. Pasandola en la linea de
 * comandos quedaba guardada en texto plano en el historial de la terminal
 * (en Windows, ConsoleHost_history.txt), y ademas PowerShell interpreta
 * caracteres como "$" antes de que Node los vea, con lo que se podia hashear
 * algo distinto de lo que se habia escrito.
 */

const PROBAR = process.argv.includes('--probar')

/** Pide una linea sin mostrarla en pantalla */
function pedirClave(texto) {
	return new Promise((resolver) => {
		const consola = createInterface({ input: stdin, output: stdout, terminal: true })

		/* Se sustituye la escritura del eco para que no se vea lo tecleado */
		const escribir = stdout.write.bind(stdout)
		consola._writeToOutput = (cadena) => {
			if (cadena.includes(texto)) escribir(cadena)
		}

		consola.question(texto, (respuesta) => {
			consola.close()
			escribir('\n')
			resolver(respuesta)
		})
	})
}

function salir(mensaje, codigo = 1) {
	console.error(`\n  ${mensaje}\n`)
	process.exit(codigo)
}

if (!stdin.isTTY) {
	salir('Este comando necesita una terminal interactiva para pedir la clave.')
}

/* ===== Comprobar una clave contra el hash del .env ===== */
if (PROBAR) {
	const { config } = await import('../config/entorno.js')
	const clave = await pedirClave('  Clave a comprobar: ')

	if (bcrypt.compareSync(clave, config.admin.claveHash)) {
		console.log(`\n  Correcta. Entra con el usuario "${config.admin.usuario}".\n`)
	} else {
		console.log('\n  No coincide con ADMIN_CLAVE_HASH.')
		console.log('  Genera un hash nuevo con "npm run hash" y pegalo en el .env.\n')
		process.exitCode = 1
	}
} else {
	/* ===== Generar un hash nuevo ===== */
	const clave = await pedirClave('  Clave nueva: ')

	if (clave.length < 8) salir('La clave deberia tener al menos 8 caracteres.')

	const repetida = await pedirClave('  Repitela: ')
	if (clave !== repetida) salir('Las dos claves no coinciden.')

	console.log('\n  Pega esta linea en tu archivo .env (reemplaza la que haya):\n')
	console.log(`ADMIN_CLAVE_HASH=${bcrypt.hashSync(clave, 10)}\n`)
	console.log('  Despues reinicia la API: lee el .env solo al arrancar.\n')
}
