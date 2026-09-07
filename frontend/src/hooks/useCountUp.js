import { useState, useEffect } from 'react'

/**
 * Anima un conteo desde 0 hasta "target".
 * Mismo patron tecnico usado en el Hero del Home: requestAnimationFrame con
 * easing, sin librerias externas. Solo arranca cuando "start" es true, para
 * poder dispararlo desde un Intersection Observer.
 */
export function useCountUp(target, duration = 1800, start = false) {
	const [value, setValue] = useState(0)

	useEffect(() => {
		if (!start) return

		let frameId
		let startTime = null
		const easeOut = (t) => 1 - Math.pow(1 - t, 3)

		const step = (timestamp) => {
			if (startTime === null) startTime = timestamp
			const progress = Math.min((timestamp - startTime) / duration, 1)
			setValue(Math.round(easeOut(progress) * target))
			if (progress < 1) frameId = requestAnimationFrame(step)
		}

		frameId = requestAnimationFrame(step)
		return () => cancelAnimationFrame(frameId)
	}, [target, duration, start])

	return value
}

export default useCountUp
