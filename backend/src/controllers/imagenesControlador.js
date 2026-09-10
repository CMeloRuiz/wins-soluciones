import multer from 'multer'
import { extname, join, dirname, basename } from 'node:path'
import { fileURLToPath } from 'node:url'
import { randomUUID } from 'node:crypto'
import { unlink } from 'node:fs/promises'
import { existsSync, mkdirSync } from 'node:fs'
import { config } from '../config/entorno.js'
import { leer, guardarSeccion } from '../models/almacen.js'

const AQUI = dirname(fileURLToPath(import.meta.url))
export const CARPETA_SUBIDAS = join(AQUI, '..', '..', 'uploads')

if (!existsSync(CARPETA_SUBIDAS)) mkdirSync(CARPETA_SUBIDAS, { recursive: true })

/* Las claves que el panel puede reemplazar */
const RANURAS = {
	heroFondo: 'Fondo del hero',
	nosotrosEquipo: 'Imagen de Nosotros',
	contactoFondo: 'Fondo de Contacto',
}

const TIPOS = ['image/jpeg', 'image/png', 'image/webp']

/**
 * Guarda con un nombre generado, nunca con el que trae el archivo: un nombre
 * de origen podria contener rutas ("../") y escribir fuera de la carpeta.
 */
const almacenamiento = multer.diskStorage({
	destination: (req, file, cb) => cb(null, CARPETA_SUBIDAS),
	filename: (req, file, cb) => {
		const extension = extname(file.originalname).toLowerCase().slice(0, 5) || '.jpg'
		cb(null, `${Date.now()}-${randomUUID().slice(0, 8)}${extension}`)
	},
})

export const subida = multer({
	storage: almacenamiento,
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

/** Borra el archivo anterior para que la carpeta no crezca sin control */
async function borrarAnterior(ruta) {
	if (!ruta || !ruta.startsWith('/uploads/')) return

	try {
		await unlink(join(CARPETA_SUBIDAS, basename(ruta)))
	} catch {
		/* Si ya no esta, no hay nada que limpiar */
	}
}

/** Borra un archivo recien subido que al final no se va a usar */
async function descartar(archivo) {
	if (!archivo) return

	try {
		await unlink(archivo.path)
	} catch {
		/* Si no llego a escribirse, no hay nada que descartar */
	}
}

export async function reemplazarImagen(req, res) {
	const { ranura } = req.params

	/*
	 * Multer guarda el archivo antes de que corra este controlador, asi que
	 * si la ranura no vale hay que borrar lo que acaba de escribir: de lo
	 * contrario quedaria en uploads sin que nadie lo referencie.
	 */
	if (!RANURAS[ranura]) {
		await descartar(req.file)

		const error = new Error(`"${ranura}" no es una imagen editable`)
		error.status = 400
		throw error
	}

	if (!req.file) {
		const error = new Error('No llego ninguna imagen')
		error.status = 400
		throw error
	}

	const contenido = await leer()
	await borrarAnterior(contenido.imagenes[ranura])

	const imagenes = { ...contenido.imagenes, [ranura]: `/uploads/${req.file.filename}` }
	const guardadas = await guardarSeccion('imagenes', imagenes)

	res.json({ ranura, ruta: guardadas[ranura], imagenes: guardadas })
}

/** Vuelve a la imagen que viene empaquetada con el sitio */
export async function restablecerImagen(req, res) {
	const { ranura } = req.params

	if (!RANURAS[ranura]) {
		const error = new Error(`"${ranura}" no es una imagen editable`)
		error.status = 400
		throw error
	}

	const contenido = await leer()
	await borrarAnterior(contenido.imagenes[ranura])

	const imagenes = { ...contenido.imagenes, [ranura]: null }
	res.json({ ranura, ruta: null, imagenes: await guardarSeccion('imagenes', imagenes) })
}

export { RANURAS }
export default { subida, reemplazarImagen, restablecerImagen }
