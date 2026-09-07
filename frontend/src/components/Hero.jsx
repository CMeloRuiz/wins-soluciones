import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import '../styles/Hero.css'

/**
 * Custom hook: anima un conteo desde 0 hasta "target".
 * Solo arranca cuando "start" es true (lo dispara el Intersection Observer).
 */
function useCountUp(target, duration = 1800, start = false) {
	const [value, setValue] = useState(0)

	useEffect(() => {
		if (!start) return

		let frameId
		let startTime = null

		// Easing "ease-out" para que el conteo desacelere al final
		const easeOut = (t) => 1 - Math.pow(1 - t, 3)

		const step = (timestamp) => {
			if (startTime === null) startTime = timestamp

			const progress = Math.min((timestamp - startTime) / duration, 1)
			setValue(Math.round(easeOut(progress) * target))

			if (progress < 1) {
				frameId = requestAnimationFrame(step)
			}
		}

		frameId = requestAnimationFrame(step)

		return () => cancelAnimationFrame(frameId)
	}, [target, duration, start])

	return value
}

// Datos de la barra de estadisticas
const STATS = [
	{ value: 500, suffix: '+', label: 'Clientes conectados' },
	{ value: 5, suffix: '+', label: 'Municipios con cobertura' },
	{ value: 99, suffix: '%', label: 'Tiempo de actividad' },
]

/** Una columna de la barra de estadisticas */
function StatItem({ value, suffix, label, isVisible }) {
	const count = useCountUp(value, 1800, isVisible)

	return (
		<div className="hero-stat">
			<span className="hero-stat-number">
				{count}
				{suffix}
			</span>
			<span className="hero-stat-label">{label}</span>
		</div>
	)
}

function Hero() {
	const statsRef = useRef(null)
	const [isVisible, setIsVisible] = useState(false)

	// Dispara la animacion cuando la barra de stats entra en el viewport
	useEffect(() => {
		const node = statsRef.current
		if (!node) return

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setIsVisible(true)
					observer.disconnect() // se anima una sola vez
				}
			},
			{ threshold: 0.3 }
		)

		observer.observe(node)

		return () => observer.disconnect()
	}, [])

	return (
		<section className="hero">
			<div className="hero-content">
				<span className="hero-badge">
					<span className="hero-badge-icon" aria-hidden="true">⚡</span>
					Disfruta de una conexión de Internet potente y confiable en tu hogar
				</span>

				<h1 className="hero-title">
					Una conexion
					<br />
					veloz y sin fronteras.
				</h1>

				<p className="hero-subtitle">
					Donde la velocidad y la confiabilidad se encuentran
				</p>

				<p className="hero-description">
					Conéctate al mundo de forma rápida, segura y confiable. Descubre lo que el mundo digital puede ofrecerte  y navega sin límites con nuestro ISP.
				</p>

				<div className="hero-actions">
					<Link to="/contacto" className="hero-btn hero-btn-primary">
						Contacto <span aria-hidden="true">&rarr;</span>
					</Link>
					<a href="#cobertura" className="hero-btn hero-btn-secondary">
						Cobertura
					</a>
				</div>

				<div className="hero-stats" ref={statsRef}>
					{STATS.map((stat) => (
						<StatItem
							key={stat.label}
							value={stat.value}
							suffix={stat.suffix}
							label={stat.label}
							isVisible={isVisible}
						/>
					))}
				</div>
			</div>
		</section>
	)
}

export default Hero
