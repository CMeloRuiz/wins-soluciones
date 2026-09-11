import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api, sesion } from './api'
import Toast from './Toast'
import BotonRestaurar from './BotonRestaurar'
import PanelHero from './paneles/PanelHero'
import PanelImagenes from './paneles/PanelImagenes'
import PanelCobertura from './paneles/PanelCobertura'
import '../styles/Admin.css'
import logo from '../assets/images/wins_logo.png'

const SECCIONES = [
	{ id: 'hero', etiqueta: 'Hero' },
	{ id: 'imagenes', etiqueta: 'Imagenes' },
	{ id: 'cobertura', etiqueta: 'Cobertura' },
]

/** Panel principal: carga el contenido una vez y lo reparte entre las pestanas */
function AdminDashboard() {
	const navegar = useNavigate()

	const [contenido, setContenido] = useState(null)
	const [seccion, setSeccion] = useState('hero')
	const [cargando, setCargando] = useState(true)
	const [fallo, setFallo] = useState('')
	const [aviso, setAviso] = useState(null)

	/*
	 * Cambia al restaurar y se usa como "key" de los paneles, para obligarles a
	 * montarse de nuevo. Cada panel copia su contenido a un borrador propio con
	 * useState, que no se reinicia porque cambien las props: sin esto, tras
	 * restaurar seguirian mostrando lo que habia antes.
	 */
	const [version, setVersion] = useState(0)

	useEffect(() => {
		let vigente = true

		api.obtenerContenido()
			.then((datos) => vigente && setContenido(datos))
			.catch((error) => vigente && setFallo(error.message))
			.finally(() => vigente && setCargando(false))

		return () => { vigente = false }
	}, [])

	const salir = () => {
		sesion.borrar()
		navegar('/admin', { replace: true })
	}

	/* Cada panel devuelve solo su parte; aqui se integra en el contenido completo */
	const actualizar = (clave) => (valor) =>
		setContenido((c) => ({ ...c, [clave]: valor }))

	/* Restaurar reemplaza el contenido entero, no una seccion */
	const alRestaurar = (nuevo) => {
		setContenido(nuevo)
		setVersion((n) => n + 1)
	}

	if (cargando) {
		return (
			<div className="admin-cargando">
				<span className="admin-spinner" aria-hidden="true"></span>
				<p>Cargando el contenido...</p>
			</div>
		)
	}

	return (
		<div className="admin-layout">
			<aside className="admin-sidebar">
				<Link to="/" className="admin-sidebar-marca">
					<img src={logo} alt="WINS Soluciones" />
				</Link>

				<nav className="admin-nav" aria-label="Secciones del panel">
					{SECCIONES.map((s) => (
						<button
							key={s.id}
							type="button"
							className={`admin-nav-btn${seccion === s.id ? ' is-activo' : ''}`}
							aria-current={seccion === s.id ? 'page' : undefined}
							onClick={() => setSeccion(s.id)}
						>
							{s.etiqueta}
						</button>
					))}
				</nav>

				<div className="admin-sidebar-pie">
					<Link to="/" className="admin-sidebar-enlace">Ver el sitio</Link>
					<button type="button" className="admin-sidebar-enlace" onClick={salir}>
						Cerrar sesion
					</button>

					{/* Separado del resto: es la unica accion que no se puede deshacer */}
					<div className="admin-sidebar-peligro">
						<BotonRestaurar alRestaurar={alRestaurar} avisar={setAviso} />
					</div>
				</div>
			</aside>

			<main className="admin-contenido">
				{fallo ? (
					<div className="admin-panel">
						<h2>No se pudo cargar el contenido</h2>
						<p className="admin-error">{fallo}</p>
						<p className="admin-nota">
							Comprueba que el servidor de la API este encendido y vuelve a intentarlo.
						</p>
					</div>
				) : (
					<>
						{seccion === 'hero' && (
							<PanelHero
								key={version}
								hero={contenido.hero}
								alGuardar={actualizar('hero')}
								avisar={setAviso}
							/>
						)}

						{seccion === 'imagenes' && (
							<PanelImagenes
								key={version}
								imagenes={contenido.imagenes}
								alGuardar={actualizar('imagenes')}
								avisar={setAviso}
							/>
						)}

						{seccion === 'cobertura' && (
							<PanelCobertura
								key={version}
								cobertura={contenido.cobertura}
								alGuardar={actualizar('cobertura')}
								avisar={setAviso}
							/>
						)}
					</>
				)}
			</main>

			{/*
			 * Fuera de <main>: es flotante y lo comparten las tres pestanas, asi
			 * que el aviso de guardado se ve igual en todas.
			 */}
			<Toast aviso={aviso} alCerrar={() => setAviso(null)} />
		</div>
	)
}

export default AdminDashboard
