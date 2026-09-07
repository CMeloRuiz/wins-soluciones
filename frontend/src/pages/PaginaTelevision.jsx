import Header from '../components/Header'
import Footer from '../components/Footer'
import PageHero from '../components/PageHero'
import Reveal from '../components/Reveal'
import MiniFormulario from '../components/MiniFormulario'
import {
	IconAntena, IconCanales, IconHD, IconCasa, IconEscudo, IconCheck,
} from '../components/IconosServicio'
import '../styles/ServicioBase.css'

import imagenTv from '../assets/images/servicios/tv_service.jpg'

const BENEFICIOS = [
	{
		Icon: IconAntena,
		titulo: 'Senal estable en todos los televisores',
		texto: 'La misma calidad de imagen en cada punto de la vivienda, sin cortes ni pixelado en horas de mayor audiencia.',
	},
	{
		Icon: IconCanales,
		titulo: 'Amplia variedad de canales',
		texto: 'Programacion nacional e internacional: noticias, deportes, series, peliculas y contenido infantil.',
	},
	{
		Icon: IconHD,
		titulo: 'Calidad de imagen HD',
		texto: 'Los canales principales se transmiten en alta definicion, con mejor nitidez y color.',
	},
	{
		Icon: IconCasa,
		titulo: 'Compatible con varios televisores',
		texto: 'Habilitamos multiples puntos por vivienda para que cada televisor reciba su propia senal.',
	},
	{
		Icon: IconEscudo,
		titulo: 'Funciona sin depender de internet',
		texto: 'La senal viaja por la red de cable, asi que el servicio sigue disponible aunque el internet falle.',
	},
]

const EXPERIENCIA = [
	'Instalacion de los puntos de television en la misma visita',
	'Sin consumo de datos de tu plan de internet',
	'Guia de canales organizada por categorias',
	'Soporte tecnico para ajustes y nuevos puntos',
]

function PaginaTelevision() {
	return (
		<>
			<Header />

			<PageHero
				titulo="Television"
				breadcrumb={[
					{ texto: 'Inicio', href: '/' },
					{ texto: 'Servicios' },
					{ texto: 'Television' },
				]}
				descripcion="Television por cable con senal estable en toda la vivienda y una parrilla amplia de canales."
			/>

			{/* ===== Como funciona el servicio ===== */}
			<section className="srv srv--claro">
				<div className="srv-container">
					<Reveal className="srv-header">
						<span className="srv-badge srv-badge--claro">
							<span className="srv-badge-icon" aria-hidden="true">&#9670;</span>
							El servicio
						</span>
						<h2 className="srv-title srv-title--oscuro">Television por tecnologia RF CATV</h2>
						<p className="srv-parrafo srv-parrafo--oscuro">
							Nuestro servicio de television funciona con tecnologia <strong>RF CATV</strong>:
							la senal se transmite por radiofrecuencia sobre una red de cable coaxial e
							hibrida, la misma tecnologia que sostiene la television por cable tradicional.
						</p>
						<p className="srv-parrafo srv-parrafo--oscuro">
							Esto tiene una ventaja practica importante: al no depender del ancho de banda de
							internet, la calidad de la imagen se mantiene constante aunque en casa haya
							varias personas navegando al mismo tiempo.
						</p>
					</Reveal>
				</div>
			</section>

			{/* ===== Beneficios ===== */}
			<section className="srv srv--gris">
				<div className="srv-container">
					<Reveal className="srv-header">
						<span className="srv-badge srv-badge--claro">
							<span className="srv-badge-icon" aria-hidden="true">&#9670;</span>
							Beneficios
						</span>
						<h2 className="srv-title srv-title--oscuro">Lo que incluye tu servicio</h2>
					</Reveal>

					<div className="srv-grid">
						{BENEFICIOS.map(({ Icon, titulo, texto }, i) => (
							<Reveal key={titulo} delay={i * 90} className="srv-card">
								<span className="srv-card-icon"><Icon /></span>
								<h3 className="srv-card-title">{titulo}</h3>
								<p className="srv-card-text">{texto}</p>
							</Reveal>
						))}
					</div>
				</div>
			</section>

			{/* ===== Experiencia de entretenimiento ===== */}
			<section className="srv srv--claro">
				<div className="srv-container">
					<div className="srv-split srv-split--invertido">
						<div>
							<Reveal className="srv-header srv-header--izq">
								<span className="srv-badge srv-badge--claro">
									<span className="srv-badge-icon" aria-hidden="true">&#9670;</span>
									En casa
								</span>
								<h2 className="srv-title srv-title--oscuro">
									El plan de la noche, sin sorpresas
								</h2>
								<p className="srv-parrafo srv-parrafo--oscuro">
									Una buena noche de television no deberia depender de la suerte. Dejamos los
									puntos instalados y verificados, revisamos la senal en cada televisor y te
									explicamos como esta organizada la guia antes de irnos.
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
							<img src={imagenTv} alt="Familia disfrutando television en casa" loading="lazy" decoding="async" />
						</Reveal>
					</div>
				</div>
			</section>

			<MiniFormulario
				servicio="Television"
				titulo="Solicita tu servicio de television"
				descripcion="Dejanos tus datos y te contamos que planes hay disponibles en tu zona."
				textoBoton="Quiero este servicio"
				variante="oscuro"
			/>

			<Footer />
		</>
	)
}

export default PaginaTelevision
