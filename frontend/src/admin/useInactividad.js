import { useEffect, useRef } from 'react'

/* Tiempo sin usar el panel tras el cual se cierra la sesion */
export const MINUTOS_INACTIVIDAD = 15

/*
 * Senales que cuentan como "el usuario sigue ahi". Se escuchan en captura y
 * de forma pasiva para no interferir con el resto de la pagina.
 */
const SENALES = ['mousedown', 'keydown', 'wheel', 'touchstart', 'pointermove']

/**
 * Cierra la sesion tras un rato sin actividad.
 *
 * El temporizador se reinicia con cada senal del usuario. Para no rearmarlo
 * cientos de veces al mover el raton, se ignoran las senales que llegan en el
 * mismo segundo que la anterior.
 *
 * @param {() => void} alCaducar  Que hacer cuando se agota el tiempo
 * @param {boolean}    activo     Solo cuenta mientras haya sesion abierta
 */
export function useInactividad(alCaducar, activo = true) {
	/*
	 * En un ref para que cambiar de callback no vuelva a montar el temporizador:
	 * si dependiera de "alCaducar", cada render reiniciaria la cuenta y el
	 * plazo no se cumpliria nunca. Se actualiza en su propio efecto, porque
	 * escribir en un ref durante el render no esta permitido.
	 */
	const avisar = useRef(alCaducar)

	useEffect(() => {
		avisar.current = alCaducar
	}, [alCaducar])

	useEffect(() => {
		if (!activo) return

		const LIMITE = MINUTOS_INACTIVIDAD * 60 * 1000
		let reloj
		let ultima = 0

		const rearmar = () => {
			clearTimeout(reloj)
			reloj = setTimeout(() => avisar.current(), LIMITE)
		}

		const alHaberActividad = () => {
			const ahora = Date.now()
			if (ahora - ultima < 1000) return // se limita a una vez por segundo
			ultima = ahora
			rearmar()
		}

		rearmar()
		for (const senal of SENALES) {
			window.addEventListener(senal, alHaberActividad, { passive: true })
		}

		return () => {
			clearTimeout(reloj)
			for (const senal of SENALES) {
				window.removeEventListener(senal, alHaberActividad)
			}
		}
	}, [activo])
}

export default useInactividad
