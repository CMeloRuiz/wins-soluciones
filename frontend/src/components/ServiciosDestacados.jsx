import { Link } from 'react-router-dom'
import Reveal from './Reveal'
import { DESTACADOS } from '../data/servicios'
import '../styles/ServiciosDestacados.css'

/*
 * Grilla estatica de tres tarjetas: tres columnas en escritorio y apiladas en
 * movil. Sin carrusel ni desplazamiento horizontal, para que los tres
 * servicios masivos se vean de un vistazo.
 *
 * Fibra optica y CCTV no salen aqui a proposito: tienen su propia pagina y se
 * llega a ellas desde el menu "Servicios".
 */
function ServiciosDestacados() {
	return (
		<section className="servicios" id="servicios">
			<div className="servicios-container">
				{/* Encabezado centrado */}
				<Reveal className="servicios-header">
					<span className="servicios-badge">
						<span className="servicios-badge-icon" aria-hidden="true">◆</span>
						Servicios destacados
					</span>

					<h2 className="servicios-title">
						Soluciones disenadas para tu conexion
					</h2>

					<p className="servicios-subtitle">
						Elige el servicio que se adapta a lo que necesitas, en casa o en tu empresa
					</p>
				</Reveal>

				{/* Grilla de tarjetas */}
				<div className="servicios-grid">
					{DESTACADOS.map((servicio, i) => (
						<Reveal
							as="article"
							className="servicio-card"
							key={servicio.to}
							/* Mismo escalonado que las tarjetas de Planes */
							delay={i * 110}
						>
							<div className="servicio-card-media">
								<img src={servicio.imagen} alt={servicio.alt} loading="lazy" decoding="async" />
							</div>

							<div className="servicio-card-body">
								<h3 className="servicio-card-title">{servicio.texto}</h3>
								<p className="servicio-card-text">{servicio.descripcion}</p>

								<Link to={servicio.to} className="servicio-card-link">
									Conocer mas
									<span className="servicio-card-arrow" aria-hidden="true">&rarr;</span>
								</Link>
							</div>
						</Reveal>
					))}
				</div>
			</div>
		</section>
	)
}

export default ServiciosDestacados
