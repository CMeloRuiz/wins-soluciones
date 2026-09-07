import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * React Router conserva la posicion del scroll al cambiar de ruta, asi que al
 * navegar desde el pie del Home a otra pagina se llegaria a la mitad de ella.
 * Este componente sube al inicio en cada cambio de ruta.
 */
function ScrollToTop() {
	const { pathname } = useLocation()

	useEffect(() => {
		window.scrollTo(0, 0)
	}, [pathname])

	return null
}

export default ScrollToTop
