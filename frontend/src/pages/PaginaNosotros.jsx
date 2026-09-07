import { useState, useEffect, useRef } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import PageHero from '../components/PageHero'
import { useCountUp } from '../hooks/useCountUp'
import '../styles/PaginaNosotros.css'

import team from '../assets/images/nosotros/team.jpg'
import globalConnection from '../assets/images/nosotros/global_connection.jpg'
import fiberOptic from '../assets/images/nosotros/fiber_optic.jpg'

/* ===== Iconos inline, mismo trazo que los de la miniseccion del Home ===== */

const IconVision = () => (
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
		<path d="M1.5 12S5 5.5 12 5.5 22.5 12 22.5 12 19 18.5 12 18.5 1.5 12 1.5 12z" />
		<circle cx="12" cy="12" r="3.2" />
	</svg>
)

const IconMision = () => (
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
		<circle cx="12" cy="12" r="9" />
		<circle cx="12" cy="12" r="4.6" />
		<circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
	</svg>
)

const IconValores = () => (
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
		<path d="M12 20.5S3.8 15.6 3.8 9.8a4.3 4.3 0 0 1 8.2-1.8 4.3 4.3 0 0 1 8.2 1.8c0 5.8-8.2 10.7-8.2 10.7z" />
	</svg>
)

const VMV = [
	{
		Icon: IconVision,
		titulo: 'Vision',
		texto: 'Ser el referente en conectividad confiable de la region, reconocidos por llevar internet y television de calidad a cada hogar y cada empresa que atendemos, sin importar que tan lejos esten del centro.',
	},
	{
		Icon: IconMision,
		titulo: 'Mision',
		texto: 'Brindar servicios de internet y television accesibles, estables y respaldados por un soporte cercano, que le permitan a nuestros clientes trabajar, estudiar y disfrutar sin interrupciones.',
	},
	{
		Icon: IconValores,
		titulo: 'Valores',
		texto: 'Los principios que sostienen cada decision que tomamos y cada instalacion que entregamos.',
		chips: ['Confiabilidad', 'Cercania', 'Innovacion', 'Compromiso'],
	},
]

const ESTADISTICAS = [
	// "Años" conserva la enie: es una letra del alfabeto, no una vocal acentuada.
	// Escribirlo "anos" cambia por completo el significado de la palabra.
	{ value: 10, suffix: '+', label: 'Años de experiencia' },
	{ value: 15, suffix: '+', label: 'Ciudades con cobertura' },
	{ value: 500, suffix: '+', label: 'Clientes conectados' },
	{ value: 99, suffix: '%', label: 'Tiempo de actividad' },
]

/** Una cifra de la franja de estadisticas */
function Estadistica({ value, suffix, label, visible }) {
	const count = useCountUp(value, 1800, visible)

	return (
		<div className="infra-stat">
			<span className="infra-stat-number">{count}{suffix}</span>
			<span className="infra-stat-label">{label}</span>
		</div>
	)
}

function PaginaNosotros() {
	const statsRef = useRef(null)
	const [visible, setVisible] = useState(false)

	// Dispara el conteo cuando la franja entra en el viewport
	useEffect(() => {
		const node = statsRef.current
		if (!node) return

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setVisible(true)
					observer.disconnect() // se anima una sola vez
				}
			},
			{ threshold: 0.3 }
		)

		observer.observe(node)

		return () => observer.disconnect()
	}, [])

	return (
		<>
			<Header />

			<PageHero
				titulo="Quienes somos"
				breadcrumb={[{ texto: 'Inicio', href: '/' }, { texto: 'Nosotros' }]}
				descripcion="Historia, infraestructura y valores de la empresa que conecta hogares y negocios en toda la region."
			/>

			{/* ===== 1. Nuestra historia ===== */}
			<section className="historia" id="historia">
				<div className="historia-container">
					<div className="historia-imagen">
						<img src={team} alt="Equipo de WINS Soluciones" loading="lazy" decoding="async" />
					</div>

					<div className="historia-texto">
						<span className="np-badge np-badge--claro">
							<span className="np-badge-icon" aria-hidden="true">&#9670;</span>
							Nuestra historia
						</span>

						<h2 className="np-title np-title--oscuro">Crecemos conectando personas</h2>

						<p className="historia-parrafo">
							WINS Soluciones nacio como un proveedor local con una idea simple: que
							una buena conexion no deberia ser un privilegio. Empezamos instalando
							servicio casa por casa, escuchando de primera mano lo que cada familia
							y cada negocio necesitaba.
						</p>

						<p className="historia-parrafo">
							Ese contacto directo definio nuestra forma de trabajar. Fuimos creciendo
							barrio por barrio y municipio por municipio, ampliando la red de fibra
							optica sin perder el trato cercano que nos dio a conocer.
						</p>

						<p className="historia-parrafo">
							Hoy llevamos internet y television a mas ciudades, con la misma
							conviccion del primer dia: la calidad de un servicio se mide en la
							experiencia de quien lo usa todos los dias.
						</p>
					</div>
				</div>
			</section>

			{/* ===== 2. Compromiso humano y tecnologico ===== */}
			<section className="compromiso" id="compromiso">
				<div className="compromiso-container">
					<div className="compromiso-izq">
						<blockquote className="compromiso-cita">
							<span className="compromiso-comillas" aria-hidden="true">&ldquo;</span>
							Detras de cada conexion hay un equipo humano comprometido con tu
							tranquilidad y la de tu negocio.
						</blockquote>

						<p className="compromiso-parrafo">
							La tecnologia sostiene el servicio, pero son las personas quienes lo
							hacen confiable. Nuestros tecnicos, asesores y equipo de soporte
							conocen la red a fondo y conocen tambien a los clientes que la usan.
						</p>

						<div className="compromiso-imagen">
							<img src={globalConnection} alt="Red de conectividad" loading="lazy" decoding="async" />
						</div>
					</div>

					{/* Tarjeta oscura: el contrapunto de color de una seccion clara */}
					<aside className="compromiso-card">
						<span className="np-badge">
							<span className="np-badge-icon" aria-hidden="true">&#9670;</span>
							Sobre nosotros
						</span>

						<p className="compromiso-card-texto">
							Trabajamos uniendo infraestructura tecnologica de punta con una atencion
							cercana y personalizada. Invertimos en equipos, fibra y monitoreo
							continuo, y al mismo tiempo cuidamos que cada solicitud tenga una
							respuesta clara y en el menor tiempo posible.
						</p>

						<p className="compromiso-card-texto">
							El compromiso con la calidad y la innovacion continua guia nuestras
							decisiones. Evaluamos nuevas tecnologias de forma constante, ampliamos
							capacidad antes de que haga falta y ajustamos nuestros procesos con lo
							que aprendemos de cada cliente.
						</p>
					</aside>
				</div>
			</section>

			{/* ===== 3. Infraestructura y tecnologia ===== */}
			<section className="infra" id="infraestructura">
				<div className="infra-container">
					{/* Texto a la izquierda: invierte el orden de "Historia" */}
					<div className="infra-texto">
						<span className="np-badge">
							<span className="np-badge-icon" aria-hidden="true">&#9670;</span>
							Infraestructura
						</span>

						<h2 className="np-title">Tecnologia solida para una conexion confiable</h2>

						<p className="infra-parrafo">
							Nuestra red esta construida sobre fibra optica de alta capacidad, con
							nodos distribuidos y monitoreo permanente. Ampliamos la cobertura de
							forma planificada e invertimos de manera continua en equipos y
							redundancia, para que la velocidad que contrataste se mantenga estable
							incluso en las horas de mayor demanda.
						</p>
					</div>

					<div className="infra-imagen">
						<img src={fiberOptic} alt="Fibra optica de la red de WINS Soluciones" loading="lazy" decoding="async" />
					</div>
				</div>

				{/* Franja de estadisticas con conteo animado */}
				<div className="infra-stats" ref={statsRef}>
					{ESTADISTICAS.map((e) => (
						<Estadistica key={e.label} {...e} visible={visible} />
					))}
				</div>
			</section>

			{/* ===== 4. Vision, mision y valores ===== */}
			<section className="vmv" id="vision-mision-valores">
				<div className="vmv-container">
					<div className="vmv-header">
						<span className="np-badge np-badge--claro">
							<span className="np-badge-icon" aria-hidden="true">&#9670;</span>
							Lo que nos guia
						</span>

						<h2 className="np-title np-title--oscuro">Vision, mision y valores</h2>
					</div>

					<div className="vmv-grid">
						{VMV.map(({ Icon, titulo, texto, chips }) => (
							<article className="vmv-card" key={titulo}>
								<span className="vmv-card-icon" aria-hidden="true"><Icon /></span>

								<h3 className="vmv-card-title">{titulo}</h3>
								<p className="vmv-card-text">{texto}</p>

								{chips && (
									<ul className="vmv-chips">
										{chips.map((chip) => (
											<li className="vmv-chip" key={chip}>{chip}</li>
										))}
									</ul>
								)}
							</article>
						))}
					</div>
				</div>
			</section>

			<Footer />
		</>
	)
}

export default PaginaNosotros
