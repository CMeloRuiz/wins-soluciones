import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Reveal from './Reveal'
import { IconWifi, IconCheck } from './IconosServicio'
import { COBERTURA, SIN_VEREDAS } from '../data/cobertura'
import { CUNDINAMARCA_DATA, BOYACA_DATA } from '../data/coberturaDeptData'
import '../styles/Cobertura.css'

const DEPARTAMENTOS = [
	{ id: 'cundinamarca', nombre: 'Cundinamarca', datos: CUNDINAMARCA_DATA },
	{ id: 'boyaca', nombre: 'Boyaca', datos: BOYACA_DATA },
]

/* Veredas indexadas por municipio, para cruzarlas con la geometria */
const VEREDAS_POR_MUNICIPIO = Object.fromEntries(
	COBERTURA.map((m) => [m.municipio, m])
)

const MARGEN_DEPTO = 0.03 // aire alrededor del departamento

/** Caja que engloba un path. Usan solo M/L/Z con coordenadas absolutas. */
function cajaDePath(d) {
	const n = d.match(/-?\d+(?:\.\d+)?/g).map(Number)
	let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity

	for (let i = 0; i + 1 < n.length; i += 2) {
		if (n[i] < x0) x0 = n[i]
		if (n[i] > x1) x1 = n[i]
		if (n[i + 1] < y0) y0 = n[i + 1]
		if (n[i + 1] > y1) y1 = n[i + 1]
	}
	return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 }
}

/** Ventana que encuadra el departamento entero */
function encuadrar(datos) {
	const d = cajaDePath(datos.deptPath)
	const mx = d.w * MARGEN_DEPTO
	const my = d.h * MARGEN_DEPTO
	const x = d.x - mx, y = d.y - my
	const ancho = d.w + mx * 2, alto = d.h + my * 2
	return { viewBox: `${x} ${y} ${ancho} ${alto}`, x, y, ancho, alto }
}

/* Se calculan una sola vez: los datasets son estaticos */
const ENCUADRES = {
	cundinamarca: encuadrar(CUNDINAMARCA_DATA),
	boyaca: encuadrar(BOYACA_DATA),
}

/**
 * Degradados del mapa. Se declaran por SVG con un sufijo propio, porque los
 * ids de <defs> son globales al documento.
 */
function Degradados({ sufijo }) {
	return (
		<defs>
			<linearGradient id={`cob-g-muni-${sufijo}`} x1="0" y1="0" x2="0.3" y2="1">
				<stop offset="0%" stopColor="#2e9d5c" />
				<stop offset="100%" stopColor="#155e34" />
			</linearGradient>

			<linearGradient id={`cob-g-muni-act-${sufijo}`} x1="0" y1="0" x2="0.3" y2="1">
				<stop offset="0%" stopColor="#4ec97f" />
				<stop offset="100%" stopColor="#1d8348" />
			</linearGradient>
		</defs>
	)
}

/** Ficha del municipio seleccionado */
function FichaMunicipio({ nombre }) {
	const datos = VEREDAS_POR_MUNICIPIO[nombre]
	const veredas = datos?.veredas ?? []

	return (
		<>
			<header className="cob-ficha-head">
				<h4 className="cob-ficha-titulo">{nombre}</h4>
				{datos?.departamento && <p className="cob-ficha-depto">{datos.departamento}</p>}

				<span className="cob-ficha-badge">
					<span className="cob-ficha-badge-icon" aria-hidden="true"><IconCheck /></span>
					Cobertura activa
				</span>
			</header>

			{veredas.length > 0 ? (
				<>
					<p className="cob-ficha-conteo">{veredas.length} veredas con cobertura</p>
					{/* Sin scroll: el panel es ancho y las reparte en columnas */}
					<ul className="cob-veredas">
						{veredas.map((v) => <li key={v}>{v}</li>)}
					</ul>
				</>
			) : (
				<p className="cob-ficha-nota">{SIN_VEREDAS}</p>
			)}
		</>
	)
}

/** Estado del panel cuando no hay municipio seleccionado */
function PanelVacio({ total }) {
	return (
		<div className="cob-panel-vacio">
			<span className="cob-panel-vacio-icon" aria-hidden="true"><IconWifi /></span>
			<h4 className="cob-ficha-titulo">Selecciona un municipio</h4>
			<p className="cob-panel-vacio-texto">
				Este departamento tiene {total} municipios con cobertura activa. Senalalos en
				el mapa para ver sus veredas.
			</p>
		</div>
	)
}

function Cobertura() {
	const [deptId, setDeptId] = useState(DEPARTAMENTOS[0].id)
	const [fase, setFase] = useState('entrada')
	const [activo, setActivo] = useState(null)
	const temporizador = useRef(null)

	/*
	 * En dispositivos sin hover real la ficha se abre con tap y se cierra al
	 * tocar fuera. Se consulta una sola vez: el tipo de puntero no cambia
	 * durante la sesion.
	 */
	const [puedeHover] = useState(
		() => typeof window === 'undefined' || window.matchMedia('(hover: hover)').matches
	)

	useEffect(() => () => clearTimeout(temporizador.current), [])

	const departamento = DEPARTAMENTOS.find((d) => d.id === deptId)
	const { municipios, municipiosBase = [] } = departamento.datos
	const encuadre = ENCUADRES[deptId]

	/*
	 * El cambio de departamento se encadena en dos tiempos para que el mapa
	 * anterior se desvanezca antes de que entre el nuevo. Se hace desde el
	 * manejador del evento y no desde un efecto, para no encadenar renders.
	 */
	const cambiarDepto = (id) => {
		if (id === deptId) return

		clearTimeout(temporizador.current)
		setActivo(null)
		setFase('salida')

		temporizador.current = setTimeout(() => {
			setDeptId(id)
			setFase('entrada')
		}, 180)
	}

	const alternar = (nombre) =>
		setActivo((prev) => (prev === nombre ? null : nombre))

	/* Handlers de seleccion de un municipio */
	const handlers = (nombre) => ({
		onMouseEnter: puedeHover ? () => setActivo(nombre) : undefined,
		onMouseLeave: puedeHover ? () => setActivo(null) : undefined,
		onClick: puedeHover ? undefined : (e) => { e.stopPropagation(); alternar(nombre) },
	})

	return (
		<section className="cobertura" id="cobertura">
			<div className="cob-container">
				{/* ===== Encabezado ===== */}
				<Reveal className="cob-header">
					<h2 className="cob-title">
						Encuentra la cobertura de internet
						<br />y television en tu zona
					</h2>

					<p className="cob-sub">
						Explora los municipios de Cundinamarca y Boyaca donde WINS Soluciones ya
						tiene cobertura activa de internet, television y CCTV
					</p>
				</Reveal>

				{/* ===== Selector de departamento ===== */}
				<Reveal className="cob-tabs" role="tablist" aria-label="Departamento">
					{DEPARTAMENTOS.map((d) => (
						<button
							key={d.id}
							type="button"
							role="tab"
							aria-selected={d.id === deptId}
							className={`cob-tab${d.id === deptId ? ' is-activo' : ''}`}
							onClick={() => cambiarDepto(d.id)}
						>
							{d.nombre}
						</button>
					))}
				</Reveal>

				{/* ===== Mapa + panel ===== */}
				<Reveal className="cob-bloque">
					<figure className={`cob-mapa-card cob-mapa-card--${fase}`}>
						<div
							className="cob-mapa-zona"
							/* En tactil, tocar fuera de un municipio cierra la ficha */
							onClick={() => !puedeHover && setActivo(null)}
						>
							<svg
								className="cob-mapa"
								viewBox={encuadre.viewBox}
								preserveAspectRatio="xMidYMid meet"
								role="img"
								aria-label={`Mapa de cobertura en ${departamento.nombre}`}
							>
								<Degradados sufijo="m" />

								{/*
								 * Todos los municipios del departamento, en gris. Son 113-120
								 * paths que no cambian al pasar el mouse; el React Compiler los
								 * memoriza porque solo dependen del departamento activo.
								 */}
								<g className="cob-base">
									{municipiosBase.map((m) => (
										<path key={m.nombre} className="cob-muni-base" d={m.path} />
									))}
								</g>

								{/* Municipios con cobertura */}
								<g className="cob-municipios">
									{municipios.map((m) => (
										<path
											key={m.nombre}
											className={`cob-muni${activo === m.nombre ? ' is-activo' : ''}`}
											d={m.path}
											role="button"
											tabIndex={0}
											aria-label={`Cobertura en ${m.nombre}`}
											{...handlers(m.nombre)}
											onFocus={() => setActivo(m.nombre)}
											onBlur={() => setActivo(null)}
											onKeyDown={(e) => {
												if (e.key === 'Enter' || e.key === ' ') {
													e.preventDefault()
													alternar(m.nombre)
												}
											}}
										/>
									))}
								</g>
							</svg>
						</div>

						{/*
						 * Panel fijo a la derecha, no flotante: el usuario puede leerlo sin
						 * que se cierre al mover el mouse, y cabe sin barra de scroll.
						 */}
						<div className="cob-panel">
							{/*
							 * Selector siempre visible. A escala de departamento completo los
							 * municipios de Boyaca quedan muy pequenos y sus marcadores se
							 * solapan, asi que el mapa por si solo no da una forma fiable de
							 * elegirlos.
							 */}
							<div className="cob-selector">
								{municipios.map((m) => (
									<button
										key={`sel-${m.nombre}`}
										type="button"
										className={`cob-selector-btn${activo === m.nombre ? ' is-activo' : ''}`}
										aria-pressed={activo === m.nombre}
										onMouseEnter={puedeHover ? () => setActivo(m.nombre) : undefined}
										onClick={() => alternar(m.nombre)}
									>
										{m.nombre}
									</button>
								))}
							</div>

							<div className="cob-panel-cuerpo" aria-live="polite">
								{activo
									? <FichaMunicipio nombre={activo} />
									: <PanelVacio total={municipios.length} />}
							</div>
						</div>
					</figure>

					<figcaption className="cob-pie">
						<span className="cob-pie-depto">{departamento.nombre}</span>
						<span className="cob-pie-ayuda">
							{puedeHover
								? 'Pasa el mouse sobre un municipio para ver sus veredas'
								: 'Toca un municipio para ver sus veredas'}
						</span>
					</figcaption>
				</Reveal>

				{/* ===== Cierre ===== */}
				<Reveal className="cob-cierre">
					<p>No encuentras tu zona? Contactanos y te contamos si estamos cerca de llegar.</p>
					<Link to="/contacto" className="cob-cierre-btn">
						Consultar cobertura
						<span aria-hidden="true">&rarr;</span>
					</Link>
				</Reveal>
			</div>
		</section>
	)
}

export default Cobertura
