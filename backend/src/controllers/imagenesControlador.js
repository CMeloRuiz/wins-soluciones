import multer from 'multer'
import { config } from '../config/entorno.js'
import { subir, borrar } from '../config/imagenes.js'
import { leer, guardarSeccion } from '../models/almacen.js'

/* Las claves que el panel puede reemplazar */
const RANURAS = {
	heroFondo: 'Fondo del hero',
	nosotrosEquipo: 'Imagen de Nosotros',
	contactoFondo: 'Fondo de Contacto',
}

const TIPOS = ['image/jpeg', 'image/png', 'image/webp']

/*
 * El archivo se queda en memoria y de ahi va a Cloudinary. Antes se escribia
 * en disco, pero en Render ese disco se vacia en cada despliegue. Ademas, al
 * no tocar el sistema de archivos desaparecen los casos raros que habia que
 * cuidar: nombres con "../", archivos huerfanos si la peticion fallaba a
 * mitad, y la carpeta uploads creciendo sin control.
 */
export const subida = multer({
	storage: multer.memoryStorage(),
	limits: { fileSize: config.maxImagenMb * 1024 * 1024, files: 1 },
	fileFilter: (req, file, cb) => {
		if (!TIPOS.includes(file.mimetype)) {
			const error = new Error('Solo se aceptan imagenes JPG, PNG o WEBP')
			error.status = 400
			return cb(error)
		}
		cb(null, true)
	},
}).single('imagen')

function exigirRanura(ranura) {
	if (RANURAS[ranura]) return

	const error = new Error(`"${ranura}" no es una imagen editable`)
	error.status = 400
	throw error
}

export async function reemplazarImagen(req, res) {
	const { ranura } = req.params

	exigirRanura(ranura)

	if (!req.file) {
		const error = new Error('No llego ninguna imagen')
		error.status = 400
		throw error
	}

	/*
	 * Se sube antes de tocar la base: si Cloudinary falla, se propaga el error
	 * y el contenido guardado sigue apuntando a la imagen anterior, que sigue
	 * existiendo. Nunca queda una ruta escrita hacia una imagen que no esta.
	 */
	const url = await subir(req.file.buffer, ranura)

	const contenido = await leer()
	const imagenes = { ...contenido.imagenes, [ranura]: url }
	const guardadas = await guardarSeccion('imagenes', imagenes)

	res.json({ ranura, ruta: guardadas[ranura], imagenes: guardadas })
}

/** Vuelve a la imagen que viene empaquetada con el sitio */
export async function restablecerImagen(req, res) {
	const { ranura } = req.params

	exigirRanura(ranura)

	const contenido = await leer()

	/* Solo hay algo que borrar si esta ranura tenia imagen propia */
	if (contenido.imagenes[ranura]) await borrar(ranura)

	const imagenes = { ...contenido.imagenes, [ranura]: null }
	res.json({ ranura, ruta: null, imagenes: await guardarSeccion('imagenes', imagenes) })
}

export { RANURAS }
export default { subida, reemplazarImagen, restablecerImagen }
