import bcrypt from 'bcryptjs'

/**
 * Genera el hash de una clave para pegarlo en ADMIN_CLAVE_HASH.
 *
 *   npm run hash -- miClaveSegura
 */
const clave = process.argv[2]

if (!clave) {
	console.error('\nUso: npm run hash -- tuClave\n')
	process.exit(1)
}

if (clave.length < 8) {
	console.error('\nLa clave deberia tener al menos 8 caracteres.\n')
	process.exit(1)
}

console.log('\nPega esto en tu archivo .env:\n')
console.log(`ADMIN_CLAVE_HASH=${bcrypt.hashSync(clave, 10)}\n`)
