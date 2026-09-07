import Header from '../components/Header'
import Footer from '../components/Footer'
import PageHero from '../components/PageHero'
import Reveal from '../components/Reveal'
import MiniFormulario from '../components/MiniFormulario'
import {
	IconCamara, IconMovil, IconAnalitica, IconCableado, IconMantenimiento, IconCheck,
} from '../components/IconosServicio'
import '../styles/ServicioBase.css'
import '../styles/PaginaCCTVSeguridad.css'

import imagenCctv from '../assets/images/servicios/cctv_service.jpg'

const CARACTERISTICAS = [
	{
		Icon: IconCamara,
		titulo: 'Camaras IP de alta definicion',
		texto: 'Equipos de ultima generacion con vision nocturna y grabacion en alta resolucion, para que un detalle no se pierda.',
	},
	{
		Icon: IconMovil,
		titulo: 'Monitoreo remoto en tiempo real',
		texto: 'Revisa lo que ocurre desde tu celular o computador, en cualquier momento y desde cualquier lugar.',
	},
	{
		Icon: IconAnalitica,
		titulo: 'Analitica de video',
		texto: 'Deteccion de movimiento, reconocimiento de patrones y alertas inteligentes que avisan solo cuando importa.',
	},
	{
		Icon: IconCableado,
		titulo: 'Cableado estructurado profesional',
		texto: 'Instalaciones ordenadas y certificadas, pensadas para durar y para poder ampliarse sin rehacer el trabajo.',
	},
	{
		Icon: IconMantenimiento,
		titulo: 'Mantenimiento especializado',
		texto: 'Revisiones programadas y soporte tecnico dedicado, con un equipo que ya conoce tu instalacion.',
	},
]

const A_MEDIDA = [
	'Visita tecnica previa para definir puntos y angulos de cobertura',
	'Dimensionamiento del almacenamiento segun los dias de grabacion que necesites',
	'Configuracion de alertas segun tus horarios y zonas sensibles',
	'Capacitacion al usuario final sobre el uso del sistema',
]

function PaginaCCTVSeguridad() {
	return (
		<>
			<Header />

			<PageHero
				titulo="CCTV y Seguridad"
				breadcrumb={[
					{ texto: 'Inicio', href: '/' },
					{ texto: 'Servicios' },
					{ texto: 'CCTV y seguridad' },
				]}
				descripcion="Videovigilancia profesional, con analitica inteligente y acompanamiento tecnico permanente."
				badge="Servicio Premium"
				badgeVariante="premium"
				fondo="#070b16"
			/>

			{/* ===== Caracteristicas ===== */}
			<section className="srv srv--oscuro cctv-seccion">
				<div className="srv-container">
					<Reveal className="srv-header">
						<span className="srv-badge cctv-badge">
							<span className="srv-badge-icon" aria-hidden="true">&#9670;</span>
							Caracteristicas
						</span>
						<h2 className="srv-title">Un sistema pensado para no fallar</h2>
						<p className="srv-sub">
							Equipos, instalacion y soporte del mismo nivel. Un sistema de seguridad vale lo
							que vale su componente mas debil.
						</p>
					</Reveal>

					<div className="srv-grid cctv-grid">
						{CARACTERISTICAS.map(({ Icon, titulo, texto }, i) => (
							<Reveal key={titulo} delay={i * 90} className="srv-card cctv-card">
								<span className="srv-card-icon"><Icon /></span>
								<h3 className="srv-card-title">{titulo}</h3>
								<p className="srv-card-text">{texto}</p>
							</Reveal>
						))}
					</div>
				</div>
			</section>

			{/* ===== Seguridad a la medida ===== */}
			<section className="srv srv--oscuro cctv-seccion cctv-seccion--alt">
				<div className="srv-container">
					<div className="srv-split">
						<Reveal className="srv-imagen">
							<img src={imagenCctv} alt="Camara de seguridad instalada" loading="lazy" decoding="async" />
						</Reveal>

						<div>
							<Reveal className="srv-header srv-header--izq">
								<span className="srv-badge cctv-badge">
									<span className="srv-badge-icon" aria-hidden="true">&#9670;</span>
									A tu medida
								</span>
								<h2 className="srv-title">Seguridad a la medida de tu hogar o empresa</h2>
								<p className="srv-parrafo">
									No existe una instalacion estandar. Un local comercial, una bodega y una
									casa de familia tienen puntos criticos distintos, y el sistema debe
									responder a eso desde el diseno, no despues.
								</p>
							</Reveal>

							<Reveal delay={120}>
								<ul className="srv-lista">
									{A_MEDIDA.map((item) => (
										<li key={item}>
											<span className="srv-lista-check cctv-check" aria-hidden="true"><IconCheck /></span>
											{item}
										</li>
									))}
								</ul>
							</Reveal>
						</div>
					</div>
				</div>
			</section>

			<MiniFormulario
				servicio="CCTV y seguridad"
				titulo="Agenda tu visita tecnica"
				descripcion="Un especialista evalua el sitio y propone la configuracion adecuada."
				textoBoton="Quiero este servicio"
				campoExtra={{
					nombre: 'propiedad',
					etiqueta: 'Tipo de propiedad',
					tipo: 'opciones',
					opciones: ['Residencial', 'Empresarial'],
				}}
				variante="oscuro"
			/>

			<Footer />
		</>
	)
}

export default PaginaCCTVSeguridad
