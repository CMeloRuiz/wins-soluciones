import { Router } from 'express'
import {
	obtenerTodo,
	obtenerHero,
	actualizarHero,
	obtenerImagenes,
	restaurarTodo,
} from '../controllers/contenidoControlador.js'
import { subida, reemplazarImagen, restablecerImagen } from '../controllers/imagenesControlador.js'
import { requiereSesion } from '../middleware/autenticacion.js'

const router = Router()

/* --- Publicas: las consume el sitio para pintarse --- */
router.get('/', obtenerTodo)
router.get('/hero', obtenerHero)
router.get('/imagenes', obtenerImagenes)

/* --- Privadas: solo el panel, con sesion iniciada --- */
router.put('/hero', requiereSesion, actualizarHero)
router.post('/imagenes/:ranura', requiereSesion, subida, reemplazarImagen)
router.delete('/imagenes/:ranura', requiereSesion, restablecerImagen)
router.post('/restaurar', requiereSesion, restaurarTodo)

export default router
