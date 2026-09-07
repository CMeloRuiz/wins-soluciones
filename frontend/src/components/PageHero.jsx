import { Link } from 'react-router-dom'
import '../styles/PageHero.css'

/**
 * Hero compacto para paginas internas (Nosotros, Cobertura, Contacto...).
 * Patron reutilizable: se coloca siempre debajo del Header del sitio.
 *
 * Props:
 *  - titulo       (string, requerido) Titulo principal de la pagina.
 *  - breadcrumb   (array | string)    Ruta de navegacion. Acepta "Inicio / Nosotros"
 *                                     o [{ texto, href }, ...] para enlaces reales.
 *  - descripcion  (string, opcional)  Bajada corta debajo del titulo.
 *  - badge        (string, opcional)  Etiqueta destacada sobre el titulo.
 *  - badgeVariante(string, opcional)  Modificador visual del badge, p. ej. 'premium'.
 *  - imagen       (string, opcional)  Imagen de fondo. Sin ella usa solo el gradiente.
 *  - fondo        (string, opcional)  Color base, por defecto el azul del sitio.
 *  - alineacion   ('izquierda' | 'centro')  Por defecto 'izquierda'.
 */
function PageHero({
	titulo,
	breadcrumb,
	descripcion,
	badge,
	badgeVariante,
	imagen,
	fondo = '#0a1128',
	alineacion = 'izquierda',
}) {
	// Se admite string ("Inicio / Nosotros") o array de objetos con enlace
	const migas = typeof breadcrumb === 'string'
		? breadcrumb.split('/').map((t) => ({ texto: t.trim() }))
		: breadcrumb || []

	const estilo = {
		backgroundColor: fondo,
		...(imagen && { backgroundImage: `url(${imagen})` }),
	}

	return (
		<section
			className={`page-hero page-hero--${alineacion}${imagen ? ' page-hero--con-imagen' : ''}`}
			style={estilo}
		>
			<div className="page-hero-content">
				{migas.length > 0 && (
					<nav className="page-hero-breadcrumb" aria-label="Ruta de navegacion">
						<ol>
							{migas.map((miga, i) => {
								const ultima = i === migas.length - 1
								return (
									<li key={miga.texto}>
										{miga.href && !ultima
											? <Link to={miga.href}>{miga.texto}</Link>
											: <span aria-current={ultima ? 'page' : undefined}>{miga.texto}</span>}
									</li>
								)
							})}
						</ol>
					</nav>
				)}

				{/* Etiqueta destacada: va dentro del flujo del hero, no superpuesta,
				    para que no la recorte su propio overflow */}
				{badge && (
					<span className={`page-hero-badge${badgeVariante ? ` page-hero-badge--${badgeVariante}` : ''}`}>
						<span className="page-hero-badge-icon" aria-hidden="true">&#9670;</span>
						{badge}
					</span>
				)}

				<h1 className="page-hero-title">{titulo}</h1>

				{descripcion && <p className="page-hero-description">{descripcion}</p>}
			</div>
		</section>
	)
}

export default PageHero
