import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * React Router conserva la posicion del scroll al cambiar de ruta, asi que al
 * navegar desde el pie del Home a otra pagina se llegaria a la mitad de ella.
 * Este componente sube al inicio en cada cambio de ruta, salvo que la URL
 * traiga un ancla (/#cobertura): entonces baja hasta esa seccion.
 *
 * Se vigila "key" ademas de la ruta porque cambia en cada navegacion. Sin eso
 * el enlace no haria nada cuando el usuario ya esta en la pagina de destino,
 * que es justo el caso del enlace "cobertura" pulsado desde el propio Home.
 */
function ScrollToTop() {
	const { pathname, hash, key } = useLocation()

	useEffect(() => {
		const destino = hash ? document.getElementById(hash.slice(1)) : null

		if (!destino) {
			window.scrollTo(0, 0)
			return
		}

		const suave = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
		destino.scrollIntoView({ behavior: suave ? 'smooth' : 'auto' })
	}, [pathname, hash, key])

	return null
}

export default ScrollToTop
