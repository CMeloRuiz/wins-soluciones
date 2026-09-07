import { Link } from 'react-router-dom'
import { SERVICIOS } from '../data/servicios'
import '../styles/Footer.css'
import logo from '../assets/images/wins_logo.png'

/* Marcas sociales: se usan iconos solidos porque los logos de marca se leen
   mejor asi en tamano pequeno que en version de trazo. */
const REDES = [
	{
		nombre: 'Facebook',
		path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
	},
	{
		nombre: 'Instagram',
		path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z',
	},
	{
		nombre: 'X',
		path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.451-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644z',
	},
	{
		nombre: 'WhatsApp',
		path: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z',
	},
]

const COLUMNAS = [
	{
		titulo: 'Servicios',
		// Misma fuente que el dropdown del Header
		enlaces: SERVICIOS,
	},
	{
		titulo: 'Empresa',
		// "to" convierte el elemento en un enlace de router; sin el queda como
		// marcador de posicion hasta que exista la pagina correspondiente.
		enlaces: [
			{ texto: 'Quienes somos', to: '/nosotros' },
			'Cobertura',
			'Trabaja con nosotros',
			{ texto: 'Contactenos', to: '/contacto' },
		],
	},
	{
		titulo: 'Soporte',
		enlaces: ['PQR y soporte', 'Pago en linea', 'Preguntas frecuentes', 'Terminos y condiciones'],
	},
]

function Footer() {
	return (
		<footer className="footer">
			<div className="footer-container">
				{/* Marca */}
				<div className="footer-brand">
					<Link to="/" className="footer-logo">
						<img src={logo} alt="WINS Soluciones" />
					</Link>

					<p className="footer-tagline">
						Conectividad confiable para hogares y empresas en toda la region.
					</p>

					<ul className="footer-redes">
						{REDES.map((red) => (
							<li key={red.nombre}>
								<a href="#" className="footer-red" aria-label={red.nombre}>
									<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
										<path d={red.path} />
									</svg>
								</a>
							</li>
						))}
					</ul>
				</div>

				{/* Columnas de enlaces */}
				{COLUMNAS.map((col) => (
					<nav className="footer-col" key={col.titulo}>
						<h3 className="footer-col-title">{col.titulo}</h3>
						<ul className="footer-col-list">
							{col.enlaces.map((enlace) => {
								// Los enlaces pueden ser texto plano o { texto, to }
								const texto = typeof enlace === 'string' ? enlace : enlace.texto
								const to = typeof enlace === 'string' ? null : enlace.to

								return (
									<li key={texto}>
										{to ? <Link to={to}>{texto}</Link> : <a href="#">{texto}</a>}
									</li>
								)
							})}
						</ul>
					</nav>
				))}
			</div>

			<div className="footer-bottom">
				<p>&copy; 2026 WINS Soluciones. Todos los derechos reservados.</p>
			</div>
		</footer>
	)
}

export default Footer
