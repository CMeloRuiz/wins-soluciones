import Header from '../components/Header'
import Footer from '../components/Footer'
import PageHero from '../components/PageHero'
import Reveal from '../components/Reveal'
import Planes from '../components/Planes'
import MiniFormulario from '../components/MiniFormulario'
import { IconWifi, IconReloj, IconStreaming, IconDispositivos, IconCheck } from '../components/IconosServicio'
import '../styles/ServicioBase.css'

import imagenHogar from '../assets/images/servicios/home_internet_service.jpg'

const BENEFICIOS = [
	{
		Icon: IconWifi,
		titulo: 'Wifi de alto alcance',
		texto: 'Equipos que cubren toda la vivienda, incluidos los rincones donde la senal solia caerse.',
	},
	{
		Icon: IconReloj,
		titulo: 'Conexion estable las 24 horas',
		texto: 'Red monitoreada de forma permanente para sostener la velocidad a cualquier hora del dia.',
	},
	{
		Icon: IconStreaming,
		titulo: 'Streaming sin cortes en 4K',
		texto: 'Ancho de banda suficiente para ver series y peliculas en maxima calidad, sin pausas de carga.',
	},
	{
		Icon: IconDispositivos,
		titulo: 'Ideal para varios dispositivos',
		texto: 'Televisores, celulares, consolas y computadores conectados al tiempo sin perder rendimiento.',
	},
]

/* Planes de hogar, con el mismo formato que los del Home */
const PLANES_HOGAR = [
	{
		nombre: 'Basico',
		precio: '59.900',
		caracteristicas: [
			'Velocidad de 100 Mbps',
			'Hasta 6 dispositivos conectados',
			'Wifi incluido',
			'Soporte tecnico en horario habil',
		],
		textoBoton: 'Quiero este plan',
	},
	{
		nombre: 'Recomendado',
		precio: '89.900',
		destacado: true,
		etiqueta: 'Mas elegido',
		caracteristicas: [
			'Velocidad de 300 Mbps',
			'Hasta 12 dispositivos conectados',
			'Wifi de alto alcance',
			'Instalacion gratis',
			'Soporte tecnico prioritario',
		],
		textoBoton: 'Quiero este plan',
	},
	{
		nombre: 'Premium',
		precio: '129.900',
		caracteristicas: [
			'Velocidad de 600 Mbps',
			'Dispositivos ilimitados',
			'Wifi de alto alcance en toda la casa',
			'Instalacion gratis',
			'Soporte prioritario 7x24',
		],
		textoBoton: 'Quiero este plan',
	},
]

const EXPERIENCIA = [
	'Cobertura pareja en todas las habitaciones, sin zonas muertas',
	'Compatible con las plataformas de streaming que ya usas',
	'Videollamadas y teletrabajo sin cortes ni congelamientos',
	'Juegos en linea con baja latencia',
]

function PaginaInternetHogar() {
	return (
		<>
			<Header />

			<PageHero
				titulo="Internet Hogar"
				breadcrumb={[
					{ texto: 'Inicio', href: '/' },
					{ texto: 'Servicios' },
					{ texto: 'Internet hogar' },
				]}
				descripcion="Una conexion estable para que en casa todos naveguen, trabajen y vean lo que quieran al mismo tiempo."
			/>

			{/* ===== Beneficios ===== */}
			<section className="srv srv--claro">
				<div className="srv-container">
					<Reveal className="srv-header">
						<span className="srv-badge srv-badge--claro">
							<span className="srv-badge-icon" aria-hidden="true">&#9670;</span>
							Beneficios
						</span>
						<h2 className="srv-title srv-title--oscuro">Todo lo que tu casa necesita conectado</h2>
						<p className="srv-sub srv-sub--oscuro">
							Un servicio pensado para el uso real de un hogar, no para una cifra en el papel.
						</p>
					</Reveal>

					<div className="srv-grid srv-grid--4">
						{BENEFICIOS.map(({ Icon, titulo, texto }, i) => (
							<Reveal key={titulo} delay={i * 100} className="srv-card">
								<span className="srv-card-icon"><Icon /></span>
								<h3 className="srv-card-title">{titulo}</h3>
								<p className="srv-card-text">{texto}</p>
							</Reveal>
						))}
					</div>
				</div>
			</section>

			{/* ===== Planes: se reutiliza el componente del Home ===== */}
			<Planes
				titulo="Planes de internet hogar"
				subtitulo="Elige la velocidad segun como usan internet en tu casa. Puedes cambiar de plan cuando lo necesites."
				planes={PLANES_HOGAR}
				fondo="gris"
			/>

			{/* ===== Experiencia wifi y streaming ===== */}
			<section className="srv srv--claro">
				<div className="srv-container">
					<div className="srv-split">
						<div>
							<Reveal className="srv-header srv-header--izq">
								<span className="srv-badge srv-badge--claro">
									<span className="srv-badge-icon" aria-hidden="true">&#9670;</span>
									Wifi y streaming
								</span>
								<h2 className="srv-title srv-title--oscuro">Buena senal en cada rincon de la casa</h2>
								<p className="srv-parrafo srv-parrafo--oscuro">
									Instalamos el equipo en el punto adecuado de la vivienda y verificamos la
									cobertura habitacion por habitacion antes de terminar la visita. La idea es
									simple: que la senal sea igual de buena en la sala que en el cuarto del fondo.
								</p>
							</Reveal>

							<Reveal delay={120}>
								<ul className="srv-lista">
									{EXPERIENCIA.map((item) => (
										<li key={item}>
											<span className="srv-lista-check" aria-hidden="true"><IconCheck /></span>
											{item}
										</li>
									))}
								</ul>
							</Reveal>
						</div>

						<Reveal delay={100} className="srv-imagen">
							<img src={imagenHogar} alt="Familia conectada a internet en casa" loading="lazy" decoding="async" />
						</Reveal>
					</div>
				</div>
			</section>

			<MiniFormulario
				servicio="Internet hogar"
				titulo="Solicita tu instalacion"
				descripcion="Dejanos tus datos y verificamos la cobertura en tu direccion."
				textoBoton="Quiero este servicio"
				variante="oscuro"
			/>

			<Footer />
		</>
	)
}

export default PaginaInternetHogar
