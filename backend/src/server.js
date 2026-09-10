import express from 'express'
import cors from 'cors'
import { config } from './config/entorno.js'
import { CARPETA_SUBIDAS } from './controllers/imagenesControlador.js'
import { leer } from './models/almacen.js'
import { noEncontrado, manejadorErrores } from './middleware/errores.js'

import rutasAuth from './routes/auth.js'
import rutasContenido from './routes/contenido.js'
import rutasCobertura from './routes/cobertura.js'

const app = express()

/*
 * Solo se aceptan peticiones desde los origenes declarados en el .env. Las
 * herramientas sin origen (curl, health checks) se dejan pasar.
 */
app.use(cors({
	origin: (origen, cb) => {
		if (!origen || config.origenes.includes(origen)) return cb(null, true)
		cb(new Error(`Origen no permitido: ${origen}`))
	},
}))

app.use(express.json({ limit: '1mb' }))

/* Imagenes subidas desde el panel */
app.use('/uploads', express.static(CARPETA_SUBIDAS, { maxAge: '7d' }))

app.get('/api/salud', (req, res) => res.json({ ok: true, hora: new Date().toISOString() }))

app.use('/api/auth', rutasAuth)
app.use('/api/contenido', rutasContenido)
app.use('/api/cobertura', rutasCobertura)

app.use(noEncontrado)
app.use(manejadorErrores)

/* Se toca el almacen al arrancar para sembrar el JSON y fallar pronto si no se puede escribir */
await leer()

app.listen(config.puerto, () => {
	console.log(`\n  WINS API escuchando en http://localhost:${config.puerto}`)
	console.log(`  Origenes permitidos: ${config.origenes.join(', ')}\n`)
})
