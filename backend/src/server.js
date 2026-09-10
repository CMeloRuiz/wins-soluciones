import express from 'express'
import cors from 'cors'
import { config } from './config/entorno.js'
import { CARPETA_SUBIDAS } from './controllers/imagenesControlador.js'
import { verificarConexion } from './config/db.js'
import { noEncontrado, manejadorErrores } from './middleware/errores.js'

import rutasAuth from './routes/auth.js'
import rutasContenido from './routes/contenido.js'
import rutasCobertura from './routes/cobertura.js'

const app = express()

/*
 * Solo se aceptan peticiones desde los origenes declarados en el .env. Las
 * herramientas sin origen (curl, health checks) se dejan pasar.
 *
 * Al rechazar no se lanza un error: eso acababa en el manejador final y
 * devolvia un 500 "Error interno del servidor", que hace pensar que el backend
 * se rompio cuando en realidad la configuracion es correcta y lo que sobra es
 * el origen. Se responde 403 explicando cual es y donde se arregla, y se deja
 * constancia en el log, que es la unica pista que llega al navegador: ahi solo
 * se ve una peticion fallida.
 */
app.use(cors({
	origin: (origen, cb) => cb(null, !origen || config.origenes.includes(origen)),
}))

app.use((req, res, siguiente) => {
	const origen = req.get('Origin')
	if (!origen || config.origenes.includes(origen)) return siguiente()

	console.warn(`[cors] Rechazado ${origen}. Permitidos: ${config.origenes.join(', ')}`)

	res.status(403).json({
		error: `El origen ${origen} no esta autorizado. Agregalo a ORIGENES_PERMITIDOS en el .env del servidor.`,
	})
})

app.use(express.json({ limit: '1mb' }))

/* Imagenes subidas desde el panel */
app.use('/uploads', express.static(CARPETA_SUBIDAS, { maxAge: '7d' }))

app.get('/api/salud', (req, res) => res.json({ ok: true, hora: new Date().toISOString() }))

app.use('/api/auth', rutasAuth)
app.use('/api/contenido', rutasContenido)
app.use('/api/cobertura', rutasCobertura)

app.use(noEncontrado)
app.use(manejadorErrores)

/*
 * Se comprueba la base al arrancar para enterarse pronto si algo falla, pero
 * sin cortar el arranque: si la base no responde, la API tiene que quedar en
 * pie para poder contestar 503 con un motivo, y para que /api/salud siga
 * sirviendo al health check de Render.
 */
app.listen(config.puerto, async () => {
	console.log(`\n  WINS API escuchando en http://localhost:${config.puerto}`)
	console.log(`  Origenes permitidos: ${config.origenes.join(', ')}`)

	await verificarConexion()
	console.log('')
})
