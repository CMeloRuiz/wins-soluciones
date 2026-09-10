import multer from 'multer'

/** Ruta que no existe */
export function noEncontrado(req, res) {
	res.status(404).json({ error: `No existe ${req.method} ${req.originalUrl}` })
}

/**
 * Manejador final de errores.
 *
 * Al cliente solo le llega un mensaje util; el detalle queda en el log del
 * servidor para no filtrar rutas internas ni trazas.
 */
export function manejadorErrores(error, req, res, next) {
	if (res.headersSent) return next(error)

	/* Multer avisa aparte cuando la imagen supera el limite */
	if (error instanceof multer.MulterError) {
		const grande = error.code === 'LIMIT_FILE_SIZE'

		return res.status(400).json({
			error: grande ? 'La imagen supera el tamano maximo permitido' : 'No se pudo procesar el archivo',
		})
	}

	if (error.status === 400) {
		return res.status(400).json({ error: error.message })
	}

	console.error('[error]', error)
	res.status(500).json({ error: 'Error interno del servidor' })
}

export default { noEncontrado, manejadorErrores }
