import '../styles/ServiciosDestacados.css'
import internetHogar from '../assets/images/servicio_internet_hogar.jpg'
import television from '../assets/images/servicio_television.jpg'
import internetEmpresarial from '../assets/images/servicio_internet_empresarial.jpg'

const SERVICIOS = [
	{
		imagen: internetHogar,
		alt: 'Router de internet en una sala de estar',
		titulo: 'Internet hogar',
		descripcion:
			'Navega, transmite y trabaja desde casa con una conexion estable y de alta velocidad.',
	},
	{
		imagen: television,
		alt: 'Familia disfrutando de television en casa',
		titulo: 'Television',
		descripcion:
			'Disfruta de la mejor programacion nacional e internacional con calidad HD.',
	},
	{
		imagen: internetEmpresarial,
		alt: 'Infraestructura de red en una oficina moderna',
		titulo: 'Internet empresarial',
		descripcion:
			'Conectividad dedicada y escalable para que tu negocio nunca se detenga.',
	},
]

function ServiciosDestacados() {
	return (
		<section className="servicios" id="servicios">
			<div className="servicios-container">
				{/* Encabezado centrado */}
				<div className="servicios-header">
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
				</div>

				{/* Grilla de tarjetas */}
				<div className="servicios-grid">
					{SERVICIOS.map((servicio) => (
						<article className="servicio-card" key={servicio.titulo}>
							<div className="servicio-card-media">
								<img src={servicio.imagen} alt={servicio.alt} loading="lazy" decoding="async" />
							</div>

							<div className="servicio-card-body">
								<h3 className="servicio-card-title">{servicio.titulo}</h3>
								<p className="servicio-card-text">{servicio.descripcion}</p>

								<a href="#servicios" className="servicio-card-link">
									Conocer mas
									<span className="servicio-card-arrow" aria-hidden="true">&rarr;</span>
								</a>
							</div>
						</article>
					))}
				</div>
			</div>
		</section>
	)
}

export default ServiciosDestacados
