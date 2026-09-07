import Header from '../components/Header'
import Footer from '../components/Footer'
import PageHero from '../components/PageHero'
import Reveal from '../components/Reveal'
import MiniFormulario from '../components/MiniFormulario'
import {
	IconVelocidad, IconRayo, IconEscudo, IconCandado,
	IconClima, IconDispositivos, IconFibra, IconWifi, IconCasa, IconCheck,
} from '../components/IconosServicio'
import '../styles/ServicioBase.css'
import '../styles/PaginaFibraOptica.css'

import imagenFibra from '../assets/images/servicios/fiber_optic_service.jpg'

const VENTAJAS = [
	{
		Icon: IconVelocidad,
		titulo: 'Velocidades simetricas',
		texto: 'La misma capacidad de subida que de bajada, hasta varios Gbps. Subir un archivo pesado deja de ser el cuello de botella.',
	},
	{
		Icon: IconRayo,
		titulo: 'Menor latencia',
		texto: 'El retardo de la senal baja de forma notable, algo que se nota en videojuegos, videollamadas y trabajo remoto.',
	},
	{
		Icon: IconEscudo,
		titulo: 'Mayor estabilidad',
		texto: 'Al transmitir con senales de luz, la fibra es practicamente inmune a las interferencias electromagneticas que si afectan al cobre.',
	},
	{
		Icon: IconCandado,
		titulo: 'Mayor seguridad',
		texto: 'Intervenir un hilo de fibra altera la senal de inmediato, por lo que una intrusion resulta mucho mas facil de detectar.',
	},
	{
		Icon: IconClima,
		titulo: 'Resistencia al clima',
		texto: 'No la afectan la humedad ni las tormentas electricas como al cobre, y la senal se degrada mucho menos con la distancia.',
	},
	{
		Icon: IconDispositivos,
		titulo: 'Muchos dispositivos a la vez',
		texto: 'Soporta decenas de equipos conectados de forma simultanea sin que el rendimiento de cada uno se resienta.',
	},
]

/* Recorrido de la senal, simplificado a cuatro pasos */
const RECORRIDO = [
	{ Icon: IconFibra, titulo: 'Central de WINS', texto: 'La senal sale de nuestro nodo principal convertida en pulsos de luz.' },
	{ Icon: IconVelocidad, titulo: 'Red de fibra', texto: 'Viaja por hilos de vidrio hasta la acometida de tu direccion.' },
	{ Icon: IconWifi, titulo: 'Router en tu sitio', texto: 'Un equipo optico traduce la luz en la conexion que usan tus dispositivos.' },
	{ Icon: IconCasa, titulo: 'Tus dispositivos', texto: 'Navegas por cable o por wifi con la capacidad completa del plan.' },
]

const DIFERENCIAS = [
	'La fibra llega completa hasta tu sitio, sin tramos de cobre intermedios',
	'En una red hibrida HFC el ultimo tramo es coaxial y limita la velocidad',
	'El rendimiento no depende de que tan lejos estes del nodo',
	'La capacidad contratada se mantiene en las horas de mayor demanda',
]

function PaginaFibraOptica() {
	return (
		<>
			<Header />

			<PageHero
				titulo="Fibra Optica"
				breadcrumb={[
					{ texto: 'Inicio', href: '/' },
					{ texto: 'Servicios' },
					{ texto: 'Fibra optica' },
				]}
				descripcion="La tecnologia que sostiene nuestra red, explicada sin tecnicismos innecesarios."
			/>

			{/* ===== Que es FTTH ===== */}
			<section className="srv srv--claro">
				<div className="srv-container">
					<div className="srv-split">
						<div>
							<Reveal className="srv-header srv-header--izq">
								<span className="srv-badge srv-badge--claro">
									<span className="srv-badge-icon" aria-hidden="true">&#9670;</span>
									La tecnologia
								</span>
								<h2 className="srv-title srv-title--oscuro">Que es la fibra optica FTTH</h2>
								<p className="srv-parrafo srv-parrafo--oscuro">
									FTTH significa <strong>Fiber To The Home</strong>: fibra hasta el hogar. En
									WINS Soluciones llevamos el hilo de fibra directamente hasta tu vivienda o
									tu negocio, sin tramos de cobre en el camino.
								</p>
								<p className="srv-parrafo srv-parrafo--oscuro">
									Es la diferencia con las redes hibridas HFC, donde la fibra solo llega hasta
									un nodo del barrio y el ultimo tramo se recorre en cable coaxial. Ese tramo
									final es el que impone el techo de velocidad y el que mas se degrada.
								</p>
							</Reveal>

							<Reveal delay={120}>
								<ul className="srv-lista">
									{DIFERENCIAS.map((item) => (
										<li key={item}>
											<span className="srv-lista-check" aria-hidden="true"><IconCheck /></span>
											{item}
										</li>
									))}
								</ul>
							</Reveal>
						</div>

						<Reveal delay={100} className="srv-imagen">
							<img src={imagenFibra} alt="Hilos de fibra optica" loading="lazy" decoding="async" />
						</Reveal>
					</div>
				</div>
			</section>

			{/* ===== Ventajas ===== */}
			<section className="srv srv--gris">
				<div className="srv-container">
					<Reveal className="srv-header">
						<span className="srv-badge srv-badge--claro">
							<span className="srv-badge-icon" aria-hidden="true">&#9670;</span>
							Ventajas
						</span>
						<h2 className="srv-title srv-title--oscuro">Por que la fibra rinde mejor</h2>
						<p className="srv-sub srv-sub--oscuro">
							No es solo cuestion de velocidad: cambia como se comporta la conexion en el uso diario.
						</p>
					</Reveal>

					<div className="srv-grid srv-grid--3">
						{VENTAJAS.map(({ Icon, titulo, texto }, i) => (
							<Reveal key={titulo} delay={i * 90} className="srv-card">
								<span className="srv-card-icon"><Icon /></span>
								<h3 className="srv-card-title">{titulo}</h3>
								<p className="srv-card-text">{texto}</p>
							</Reveal>
						))}
					</div>
				</div>
			</section>

			{/* ===== Como funciona ===== */}
			<section className="srv srv--oscuro">
				<div className="srv-container">
					<Reveal className="srv-header">
						<span className="srv-badge">
							<span className="srv-badge-icon" aria-hidden="true">&#9670;</span>
							Como funciona
						</span>
						<h2 className="srv-title">El recorrido de la senal</h2>
						<p className="srv-sub">
							De nuestra central a tus dispositivos, en cuatro pasos.
						</p>
					</Reveal>

					<ol className="fibra-recorrido">
						{RECORRIDO.map(({ Icon, titulo, texto }, i) => (
							<Reveal key={titulo} delay={i * 130} as="li" className="fibra-paso">
								<span className="fibra-paso-numero">{i + 1}</span>
								<span className="fibra-paso-icon" aria-hidden="true"><Icon /></span>
								<h3 className="fibra-paso-title">{titulo}</h3>
								<p className="fibra-paso-text">{texto}</p>
							</Reveal>
						))}
					</ol>
				</div>
			</section>

			<MiniFormulario
				servicio="Fibra optica"
				titulo="Consulta la cobertura de fibra"
				descripcion="Dejanos tus datos y verificamos si la red de fibra ya llega a tu direccion."
				textoBoton="Solicitar informacion"
				variante="claro"
			/>

			<Footer />
		</>
	)
}

export default PaginaFibraOptica
