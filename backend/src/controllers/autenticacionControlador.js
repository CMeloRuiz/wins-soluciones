import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { config } from '../config/entorno.js'

/**
 * Login del administrador.
 *
 * Hay un unico usuario, definido por variables de entorno. La respuesta a un
 * usuario inexistente y a una clave incorrecta es la misma a proposito: si se
 * distinguieran, se podria averiguar que usuarios existen probando nombres.
 */
export async function iniciarSesion(req, res) {
	const { usuario, clave } = req.body ?? {}

	if (!usuario || !clave) {
		return res.status(400).json({ error: 'Escribe el usuario y la clave' })
	}

	const usuarioValido = usuario === config.admin.usuario
	/* Se compara siempre, exista o no el usuario, para no delatarlo por el tiempo de respuesta */
	const claveValida = await bcrypt.compare(clave, config.admin.claveHash)

	if (!usuarioValido || !claveValida) {
		return res.status(401).json({ error: 'Usuario o clave incorrectos' })
	}

	const token = jwt.sign(
		{ usuario, rol: 'admin' },
		config.jwtSecreto,
		{ expiresIn: config.jwtDuracion }
	)

	res.json({ token, usuario, expiraEn: config.jwtDuracion })
}

/** Permite al panel comprobar si el token que guarda sigue sirviendo */
export function verificarSesion(req, res) {
	res.json({ valido: true, usuario: req.usuario.usuario })
}

export default { iniciarSesion, verificarSesion }
