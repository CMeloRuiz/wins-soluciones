import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { SERVICIOS } from '../data/servicios'
import '../styles/Header.css'
import logo from '../assets/images/wins_logo2.png'

const MOBILE_BREAKPOINT = 900

function Header() {
	const [menuOpen, setMenuOpen] = useState(false)
	const [servicesOpen, setServicesOpen] = useState(false)

	// Si la pantalla vuelve a tamano escritorio, cerramos el menu movil
	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth > MOBILE_BREAKPOINT) {
				setMenuOpen(false)
				setServicesOpen(false)
			}
		}

		window.addEventListener('resize', handleResize)

		return () => window.removeEventListener('resize', handleResize)
	}, [])

	// Cierra todo al navegar (util en movil)
	const closeMenu = () => {
		setMenuOpen(false)
		setServicesOpen(false)
	}

	// En movil el dropdown se abre por click; en escritorio sigue siendo hover (CSS)
	const toggleServices = (e) => {
		e.preventDefault()
		setServicesOpen((prev) => !prev)
	}

	return (
		<header className='site-header'>
			<div className="logo-container">
				<Link to="/" onClick={closeMenu}>
					<img src={logo} alt="logo wins" className="logo-img" />
				</Link>
			</div>

			{/* Boton hamburguesa: solo visible en pantallas pequenas */}
			<button
				type="button"
				className={`menu-toggle${menuOpen ? ' is-open' : ''}`}
				onClick={() => setMenuOpen((prev) => !prev)}
				aria-label="Abrir menu de navegacion"
				aria-expanded={menuOpen}
			>
				<span></span>
				<span></span>
				<span></span>
			</button>

			{/* En escritorio este contenedor es "display: contents" (no altera el layout).
			    En movil se convierte en el panel desplegable. */}
			<div className={`header-collapse${menuOpen ? ' is-open' : ''}`}>
				<nav className="nav-links">
					<li className={`dropdown${servicesOpen ? ' is-open' : ''}`}>
						<a href="#" onClick={toggleServices}>servicios</a>
						<ul className="dropdown-menu">
							{SERVICIOS.map((servicio) => (
								<li key={servicio.to}>
									<Link to={servicio.to} onClick={closeMenu}>{servicio.texto}</Link>
								</li>
							))}
						</ul>
					</li>
					{/* Ancla al bloque de cobertura del Home; ScrollToTop la resuelve */}
					<Link to="/#cobertura" onClick={closeMenu}>cobertura</Link>
					<Link to="/nosotros" onClick={closeMenu}>nosotros</Link>
					<a href="#" onClick={closeMenu}>pqr y soporte</a>
					<a href="#" onClick={closeMenu}>pago en linea</a>
				</nav>

				<div className="contact-btn">
					<Link to="/contacto" onClick={closeMenu}>Contactenos</Link>
				</div>
			</div>
		</header>
	)
}

export default Header
