import Header from '../components/Header'
import Footer from '../components/Footer'
import PageHero from '../components/PageHero'
import Reveal from '../components/Reveal'
import MiniFormulario from '../components/MiniFormulario'
import {
	IconEscudo, IconSoporte, IconFibra, IconIP,
	IconRedundancia, IconMonitoreo, IconAjustes, IconCheck,
} from '../components/IconosServicio'
import '../styles/ServicioBase.css'
import '../styles/PaginaInternetEmpresarial.css'

import imagenEmpresa from '../assets/images/servicios/enterprise_internet_service.jpg'

const CARACTERISTICAS = [
	{
		Icon: IconEscudo,
		titulo: 'SLA garantizado',
		texto: 'Acuerdo de nivel de servicio con tiempos de respuesta y disponibilidad comprometidos por contrato.',
	},
	{
		Icon: IconSoporte,
		titulo: 'Soporte 7x24',
		texto: 'Equipo tecnico disponible todos los dias del ano, a cualquier hora, con canal directo de atencion.',
	},
	{
		Icon: IconFibra,
		titulo: 'Fibra dedicada',
		texto: 'Ancho de banda exclusivo para tu empresa: no se comparte ni se degrada en horas pico.',
	},
	{
		Icon: IconIP,
		titulo: 'IP publica',
		texto: 'Direccion IP fija para servidores, VPN, camaras y servicios que deban publicarse a internet.',
	},
	{
		Icon: IconRedundancia,
		titulo: 'Redundancia',
		texto: 'Rutas alternas que entran de forma automatica ante una falla, sin intervencion manual.',
	},
	{
		Icon: IconMonitoreo,
		titulo: 'Monitoreo proactivo',
		texto: 'Supervision permanente de la red: detectamos y atendemos el incidente antes de que lo reportes.',
	},
	{
		Icon: IconAjustes,
		titulo: 'Soluciones a la medida',
		texto: 'Disenamos la topologia y la capacidad segun la operacion real de tu negocio y sus sedes.',
	},
]

const RAZONES = [
	'Capacidad garantizada de extremo a extremo, sin sobreventa',
	'Instalacion planificada para no interrumpir tu operacion',
	'Ampliacion de ancho de banda sin cambiar la infraestructura',
	'Un unico interlocutor tecnico para toda tu red',
]

function PaginaInternetEmpresarial() {
	return (
		<>
			<Header />

			<PageHero
				titulo="Internet Empresarial"
				breadcrumb={[
					{ texto: 'Inicio', href: '/' },
					{ texto: 'Servicios' },
					{ texto: 'Internet empresarial' },
				]}
				descripcion="Conectividad dedicada, con respaldo contractual y soporte permanente, para operaciones que no pueden detenerse."
			/>

			{/* ===== Caracteristicas empresariales =====
			    Tratamiento corporativo: fondo oscuro solido y tarjetas con
			    borde iluminado al hover. */}
			<section className="srv srv--oscuro emp-caracteristicas">
				<div className="srv-container">
					<Reveal className="srv-header">
						<span className="srv-badge">
							<span className="srv-badge-icon" aria-hidden="true">&#9670;</span>
							Servicio corporativo
						</span>
						<h2 className="srv-title">Infraestructura de nivel empresarial</h2>
						<p className="srv-sub">
							Cada componente del servicio esta pensado para sostener la continuidad de tu
							negocio, con compromisos verificables y no con promesas.
						</p>
					</Reveal>

					<div className="srv-grid emp-grid">
						{CARACTERISTICAS.map(({ Icon, titulo, texto }, i) => (
							<Reveal key={titulo} delay={i * 80} className="srv-card emp-card">
								<span className="srv-card-icon"><Icon /></span>
								<h3 className="srv-card-title">{titulo}</h3>
								<p className="srv-card-text">{texto}</p>
							</Reveal>
						))}
					</div>
				</div>
			</section>

			{/* ===== Por que elegirnos ===== */}
			<section className="srv srv--claro">
				<div className="srv-container">
					<div className="srv-split">
						<Reveal className="srv-imagen">
							<img src={imagenEmpresa} alt="Infraestructura de red empresarial" loading="lazy" decoding="async" />
						</Reveal>

						<div>
							<Reveal className="srv-header srv-header--izq">
								<span className="srv-badge srv-badge--claro">
									<span className="srv-badge-icon" aria-hidden="true">&#9670;</span>
									Por que elegirnos
								</span>
								<h2 className="srv-title srv-title--oscuro">
									Una red que responde cuando mas importa
								</h2>
								<p className="srv-parrafo srv-parrafo--oscuro">
									Trabajamos con empresas que dependen de su conexion para facturar, atender
									clientes y coordinar sedes. Por eso dimensionamos cada enlace sobre la
									operacion real del negocio y dejamos capacidad de sobra antes de que se
									necesite, no despues.
								</p>
							</Reveal>

							<Reveal delay={120}>
								<ul className="srv-lista">
									{RAZONES.map((item) => (
										<li key={item}>
											<span className="srv-lista-check" aria-hidden="true"><IconCheck /></span>
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
				servicio="Internet empresarial"
				titulo="Cotiza tu enlace dedicado"
				descripcion="Cuentanos sobre tu operacion y un asesor corporativo preparara una propuesta."
				textoBoton="Solicitar informacion"
				campoExtra={{ nombre: 'empresa', etiqueta: 'Nombre de la empresa', tipo: 'texto' }}
				variante="claro"
			/>

			<Footer />
		</>
	)
}

export default PaginaInternetEmpresarial
