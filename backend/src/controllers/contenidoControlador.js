import { leer, guardarSeccion, restaurar } from '../models/almacen.js'
import { borrar } from '../config/imagenes.js'

/* ===== Validacion =====
 * El contenido llega de un formulario, asi que se comprueba forma y limites
 * antes de guardarlo. No se confia en que el panel ya lo haya validado.
 */

const LIMITES = {
	badge: 200,
	tituloLinea1: 80,
	tituloLinea2: 80,
	subtitulo: 160,
	descripcion: 600,
	botonPrimario: 40,
	botonSecundario: 40,
}

function malaPeticion(mensaje) {
	const error = new Error(mensaje)
	error.status = 400
	return error
}

function texto(valor, campo, maximo) {
	if (typeof valor !== 'string') throw malaPeticion(`El campo "${campo}" debe ser texto`)

	const limpio = valor.trim()
	if (!limpio) throw malaPeticion(`El campo "${campo}" no puede quedar vacio`)
	if (limpio.length > maximo) throw malaPeticion(`El campo "${campo}" supera ${maximo} caracteres`)

	return limpio
}

function validarHero(datos) {
	if (!datos || typeof datos !== 'object') throw malaPeticion('Faltan los datos del hero')

	const hero = {}
	for (const [campo, maximo] of Object.entries(LIMITES)) {
		hero[campo] = texto(datos[campo], campo, maximo)
	}

	if (!Array.isArray(datos.estadisticas) || datos.estadisticas.length !== 3) {
		throw malaPeticion('El hero necesita exactamente tres estadisticas')
	}

	hero.estadisticas = datos.estadisticas.map((stat, i) => {
		const valor = Number(stat?.valor)

		if (!Number.isFinite(valor) || valor < 0 || valor > 1_000_000) {
			throw malaPeticion(`La estadistica ${i + 1} necesita un numero entre 0 y 1000000`)
		}

		return {
			valor: Math.round(valor),
			sufijo: typeof stat.sufijo === 'string' ? stat.sufijo.trim().slice(0, 4) : '',
			etiqueta: texto(stat?.etiqueta, `etiqueta de la estadistica ${i + 1}`, 60),
		}
	})

	return hero
}

/* ===== Rutas ===== */

/** Todo el contenido. Es publico: lo consume tambien el sitio. */
export async function obtenerTodo(req, res) {
	res.json(await leer())
}

export async function obtenerHero(req, res) {
	const contenido = await leer()
	res.json(contenido.hero)
}

export async function actualizarHero(req, res) {
	const hero = validarHero(req.body)
	res.json(await guardarSeccion('hero', hero))
}

export async function obtenerImagenes(req, res) {
	const contenido = await leer()
	res.json(contenido.imagenes)
}

/**
 * Restablece el contenido de fabrica. Util si una edicion sale mal.
 *
 * Ademas de devolver los textos a su estado original, borra de Cloudinary las
 * imagenes que se hubieran subido. El contenido de fabrica las deja en null,
 * asi que si no se borrasen aqui quedarian alojadas para siempre sin que nada
 * las referencie, gastando cuota y sin forma de llegar a ellas desde el panel.
 */
export async function restaurarTodo(req, res) {
	const contenido = await leer()

	/*
	 * Se borra antes de tocar la base. Si Cloudinary fallara a mitad, el
	 * contenido sigue apuntando a las imagenes que queden, que es un estado
	 * coherente; al reves quedarian huerfanas y sin rastro de cuales eran.
	 */
	for (const [ranura, ruta] of Object.entries(contenido.imagenes ?? {})) {
		if (ruta) await borrar(ranura)
	}

	res.json(await restaurar())
}

export default { obtenerTodo, obtenerHero, actualizarHero, obtenerImagenes, restaurarTodo }
