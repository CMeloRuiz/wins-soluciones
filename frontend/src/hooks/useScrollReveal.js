import { useEffect, useRef, useState } from 'react'

/**
 * Revela un elemento cuando entra en el viewport.
 * Mismo patron de Intersection Observer ya usado en los contadores del sitio.
 *
 * Devuelve [ref, visible]: se asigna el ref al elemento y "visible" pasa a
 * true una sola vez, cuando aparece en pantalla.
 *
 * @param {object}  opciones
 * @param {number}  opciones.threshold  Porcion visible necesaria (0-1).
 * @param {string}  opciones.rootMargin Margen para adelantar el disparo.
 */
export function useScrollReveal({ threshold = 0.15, rootMargin = '0px 0px -60px 0px' } = {}) {
	const ref = useRef(null)
	// Si el navegador no soporta el observer, nace visible y no se anima:
	// el contenido nunca debe quedar oculto por falta de soporte.
	const [visible, setVisible] = useState(() => typeof IntersectionObserver === 'undefined')

	useEffect(() => {
		const node = ref.current
		if (!node || typeof IntersectionObserver === 'undefined') return

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setVisible(true)
					observer.disconnect() // se revela una sola vez
				}
			},
			{ threshold, rootMargin }
		)

		observer.observe(node)

		return () => observer.disconnect()
	}, [threshold, rootMargin])

	return [ref, visible]
}

export default useScrollReveal
