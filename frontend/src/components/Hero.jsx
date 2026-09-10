import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useContenido, urlDeImagen } from '../hooks/useContenido'
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

/*
 * Contenido de respaldo: es lo que se pinta mientras llega la respuesta de la
 * API y lo que queda si el backend no esta disponible. Al editar el hero
 * desde el panel administrativo, estos valores se sustituyen en caliente.
 */
const HERO_LOCAL = {
	badge: 'Disfruta de una conexión de Internet potente y confiable en tu hogar',
	tituloLinea1: 'Una conexion',
	tituloLinea2: 'veloz y sin fronteras.',
	subtitulo: 'Donde la velocidad y la confiabilidad se encuentran',
	descripcion:
		'Conéctate al mundo de forma rápida, segura y confiable. Descubre lo que el mundo digital puede ofrecerte  y navega sin límites con nuestro ISP.',
	botonPrimario: 'Contacto',
	botonSecundario: 'Cobertura',
	estadisticas: [
		{ valor: 500, sufijo: '+', etiqueta: 'Clientes conectados' },
		{ valor: 5, sufijo: '+', etiqueta: 'Municipios con cobertura' },
		{ valor: 99, sufijo: '%', etiqueta: 'Tiempo de actividad' },
	],
}

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

	/* Lo que haya editado el administrador; si no hay API, el texto de siempre */
	const remoto = useContenido()
	const hero = remoto?.hero ?? HERO_LOCAL
	const fondo = urlDeImagen(remoto?.imagenes?.heroFondo)

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
		/* El estilo en linea solo se pone si hay imagen subida; si no, manda el CSS */
		<section className="hero" style={fondo ? { backgroundImage: `url(${fondo})` } : undefined}>
			<div className="hero-content">
				<span className="hero-badge">
					<span className="hero-badge-icon" aria-hidden="true">⚡</span>
					{hero.badge}
				</span>

				<h1 className="hero-title">
					{hero.tituloLinea1}
					<br />
					{hero.tituloLinea2}
				</h1>

				<p className="hero-subtitle">{hero.subtitulo}</p>

				<p className="hero-description">{hero.descripcion}</p>

				<div className="hero-actions">
					<Link to="/contacto" className="hero-btn hero-btn-primary">
						{hero.botonPrimario} <span aria-hidden="true">&rarr;</span>
					</Link>
					<a href="#cobertura" className="hero-btn hero-btn-secondary">
						{hero.botonSecundario}
					</a>
				</div>

				<div className="hero-stats" ref={statsRef}>
					{hero.estadisticas.map((stat) => (
						<StatItem
							key={stat.etiqueta}
							value={stat.valor}
							suffix={stat.sufijo}
							label={stat.etiqueta}
							isVisible={isVisible}
						/>
					))}
				</div>
			</div>
		</section>
	)
}

export default Hero
