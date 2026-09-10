import { v2 as cloudinary } from 'cloudinary'
import { config } from './entorno.js'

/**
 * ===== Almacenamiento de imagenes (Cloudinary) =====
 *
 * Las imagenes que se suben desde el panel no pueden vivir en el disco del
 * servidor: en Render el sistema de archivos de un Web Service es efimero y
 * se vacia en cada despliegue, dejando la base apuntando a archivos que ya no
 * existen. Se guardan en Cloudinary, que ademas las sirve desde su CDN.
 *
 * Cada ranura tiene un identificador fijo ("wins-soluciones/heroFondo"), asi
 * que subir una imagen nueva sobrescribe la anterior. No hacen falta borrados
 * previos ni queda nada huerfano. La URL que devuelve Cloudinary lleva dentro
 * un numero de version que cambia con cada subida, de modo que el navegador
 * nunca sirve la imagen vieja desde su cache.
 */

const CARPETA = 'wins-soluciones'

/** Configurado solo si estan las tres credenciales */
export const hayCloudinary = Boolean(
	config.cloudinary.nombre && config.cloudinary.clave && config.cloudinary.secreto
)

if (hayCloudinary) {
	cloudinary.config({
		cloud_name: config.cloudinary.nombre,
		api_key: config.cloudinary.clave,
		api_secret: config.cloudinary.secreto,
		secure: true,
	})
}

/**
 * Error de configuracion o del servicio de imagenes.
 *
 * Lleva status para que el manejador de errores lo devuelva tal cual y el
 * panel pueda explicarle al administrador que pasa, en vez de un 500 mudo.
 */
export class ErrorImagenes extends Error {
	constructor(mensaje, status = 503, causa) {
		super(mensaje)
		this.name = 'ErrorImagenes'
		this.status = status
		this.causa = causa
	}
}

function exigirConfiguracion() {
	if (hayCloudinary) return

	throw new ErrorImagenes(
		'El almacenamiento de imagenes no esta configurado en el servidor. ' +
		'Faltan las credenciales de Cloudinary.'
	)
}

/**
 * Sube el contenido de un archivo y devuelve su URL.
 *
 * Recibe el buffer en memoria, no una ruta: nunca llega a tocar el disco.
 *
 * @param {Buffer} contenido
 * @param {string} ranura   Da nombre al identificador dentro de Cloudinary
 */
export function subir(contenido, ranura) {
	exigirConfiguracion()

	return new Promise((resolver, rechazar) => {
		const flujo = cloudinary.uploader.upload_stream(
			{
				public_id: `${CARPETA}/${ranura}`,
				overwrite: true,
				/* Purga la copia que la CDN tuviera de la imagen anterior */
				invalidate: true,
				resource_type: 'image',
			},
			(error, resultado) => {
				if (error) {
					console.error('[imagenes] Fallo al subir:', error.message)
					return rechazar(new ErrorImagenes('No se pudo subir la imagen. Intenta de nuevo.', 503, error))
				}
				resolver(resultado.secure_url)
			}
		)

		flujo.end(contenido)
	})
}

/**
 * Borra la imagen de una ranura.
 *
 * Que no exista no es un fallo: el objetivo es que despues no este, y si ya
 * no estaba, el objetivo se cumple igual.
 */
export async function borrar(ranura) {
	exigirConfiguracion()

	try {
		await cloudinary.uploader.destroy(`${CARPETA}/${ranura}`, { invalidate: true })
	} catch (error) {
		console.error('[imagenes] Fallo al borrar:', error.message)
		throw new ErrorImagenes('No se pudo borrar la imagen. Intenta de nuevo.', 503, error)
	}
}

export default { subir, borrar, hayCloudinary, ErrorImagenes }
