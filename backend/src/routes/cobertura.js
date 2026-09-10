import { Router } from 'express'
import { obtenerCobertura, actualizarCobertura } from '../controllers/coberturaControlador.js'
import { requiereSesion } from '../middleware/autenticacion.js'

const router = Router()

router.get('/', obtenerCobertura)
router.put('/', requiereSesion, actualizarCobertura)

export default router
