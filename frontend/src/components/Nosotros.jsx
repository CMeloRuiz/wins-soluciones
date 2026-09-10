import { Link } from 'react-router-dom'
import Reveal from './Reveal'
import '../styles/Nosotros.css'
import equipo from '../assets/images/nosotros_equipo.jpg'

/* Iconos inline (SVG) para no depender de librerias externas ni de emojis */
const IconCobertura = () => (
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
		<path d="M12 12h.01" />
		<path d="M8.5 15.5a5 5 0 0 1 0-7" />
		<path d="M15.5 8.5a5 5 0 0 1 0 7" />
		<path d="M5.5 18.5a9 9 0 0 1 0-13" />
		<path d="M18.5 5.5a9 9 0 0 1 0 13" />
	</svg>
)

const IconSoporte = () => (
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
		<path d="M4 14v-2a8 8 0 0 1 16 0v2" />
		<path d="M4 14h2.5a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z" />
		<path d="M20 14h-2.5a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1H19a1 1 0 0 0 1-1z" />
	</svg>
)

const IconFibra = () => (
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
		<path d="M3 20c0-6 5-9 9-9s9-3 9-9" />
		<circle cx="20" cy="4" r="1.6" fill="currentColor" stroke="none" />
		<circle cx="4" cy="20" r="1.6" fill="currentColor" stroke="none" />
	</svg>
)

// Valores clave que acompanan al texto
const VALORES = [
	{ Icon: IconCobertura, texto: 'Cobertura en expansion' },
	{ Icon: IconSoporte, texto: 'Soporte tecnico especializado' },
	{ Icon: IconFibra, texto: 'Tecnologia de fibra optica' },
]

function Nosotros() {
	return (
		<section className="nosotros" id="nosotros">
			<div className="nosotros-container">
				{/* Columna de texto */}
				<Reveal className="nosotros-texto">
					<span className="nosotros-badge">
						<span className="nosotros-badge-icon" aria-hidden="true">◆</span>
						Quienes somos
					</span>

					<h2 className="nosotros-title">
						Conectividad pensada para las personas
					</h2>

					<p className="nosotros-description">
						En WINS Soluciones llevamos internet y television de calidad a hogares
						y empresas, con tecnologia de punta y un equipo humano comprometido con
						brindar la mejor experiencia de conexion en cada rincon que atendemos.
					</p>

					<ul className="nosotros-valores">
						{VALORES.map(({ Icon, texto }) => (
							<li className="nosotros-valor" key={texto}>
								<span className="nosotros-valor-icon" aria-hidden="true">
									<Icon />
								</span>
								{texto}
							</li>
						))}
					</ul>

					{/* Lleva a la pagina completa /nosotros */}
					<Link to="/nosotros" className="nosotros-btn">
						Conocer mas sobre nosotros
						<span className="nosotros-btn-arrow" aria-hidden="true">&rarr;</span>
					</Link>
				</Reveal>

				{/* Columna de imagen: entra despues del texto, como en Planes */}
				<Reveal className="nosotros-imagen" delay={110}>
					<img src={equipo} alt="Equipo tecnico de WINS Soluciones trabajando con fibra optica" loading="lazy" decoding="async" />
				</Reveal>
			</div>
		</section>
	)
}

export default Nosotros
