import { Link } from 'react-router-dom'
import Reveal from './Reveal'
import { IconCheck } from './IconosServicio'
import '../styles/Planes.css'

/* Planes por defecto: los que se muestran en el Home */
const PLANES_HOME = [
	{
		nombre: 'Basico',
		precio: '59.900',
		caracteristicas: [
			'Velocidad de 100 Mbps',
			'Hasta 6 dispositivos conectados',
			'Wifi incluido',
			'Soporte tecnico en horario habil',
		],
	},
	{
		nombre: 'Estandar',
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
	},
	{
		nombre: 'Premium',
		precio: '129.900',
		caracteristicas: [
			'Velocidad de 600 Mbps',
			'Dispositivos ilimitados',
			'Wifi de alto alcance',
			'Instalacion gratis',
			'Soporte prioritario 7x24',
		],
	},
]

/**
 * Grilla de tarjetas de plan.
 * Se usa en el Home y tambien en la pagina de Internet Hogar, para que ambos
 * compartan exactamente el mismo tratamiento visual.
 *
 * Props:
 *  - titulo, subtitulo  Encabezado. Si se omiten, no se renderiza.
 *  - planes             Lista de planes. Por defecto, los del Home.
 *  - fondo              'gris' | 'claro' | 'ninguno' (cuando ya va dentro de
 *                       una seccion con su propio fondo).
 *  - destino            Ruta del boton de cada tarjeta.
 */
function Planes({
	titulo = 'Elige tu plan ideal',
	subtitulo = 'Planes pensados para acompanar el ritmo de tu hogar: elige la velocidad que necesitas y cambia cuando quieras.',
	planes = PLANES_HOME,
	fondo = 'gris',
	destino = '/contacto',
}) {
	return (
		<section className={`planes planes--${fondo}`} id="planes">
			<div className="planes-container">
				{titulo && (
					<Reveal className="planes-header">
						<h2 className="planes-title">{titulo}</h2>
						{subtitulo && <p className="planes-sub">{subtitulo}</p>}
					</Reveal>
				)}

				<div className="planes-grid">
					{planes.map((plan, i) => (
						<Reveal
							key={plan.nombre}
							/* Escalona la aparicion de izquierda a derecha */
							delay={i * 110}
							className={`plan-card${plan.destacado ? ' plan-card--destacado' : ''}`}
						>
							{plan.etiqueta && <span className="plan-etiqueta">{plan.etiqueta}</span>}

							<h3 className="plan-nombre">{plan.nombre}</h3>

							<p className="plan-precio">
								<span className="plan-precio-moneda">$</span>
								{plan.precio}
								<span className="plan-precio-periodo">/mes</span>
							</p>

							<ul className="plan-lista">
								{plan.caracteristicas.map((c) => (
									<li key={c}>
										<span className="plan-check" aria-hidden="true"><IconCheck /></span>
										{c}
									</li>
								))}
							</ul>

							<Link to={destino} className="plan-btn">
								{plan.textoBoton || 'Elegir plan'}
							</Link>
						</Reveal>
					))}
				</div>
			</div>
		</section>
	)
}

export default Planes
