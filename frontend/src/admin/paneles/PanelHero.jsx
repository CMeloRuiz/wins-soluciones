import { useState } from 'react'
import { api } from '../api'
import BotonGuardar from '../BotonGuardar'
import { conDuracionMinima } from '../duracionMinima'

/* Los mismos limites que valida el backend, para avisar antes de enviar */
const CAMPOS = [
	{ clave: 'badge', etiqueta: 'Etiqueta superior', max: 200, largo: true },
	{ clave: 'tituloLinea1', etiqueta: 'Titulo, primera linea', max: 80 },
	{ clave: 'tituloLinea2', etiqueta: 'Titulo, segunda linea', max: 80 },
	{ clave: 'subtitulo', etiqueta: 'Subtitulo', max: 160 },
	{ clave: 'descripcion', etiqueta: 'Descripcion', max: 600, largo: true },
	{ clave: 'botonPrimario', etiqueta: 'Texto del boton principal', max: 40 },
	{ clave: 'botonSecundario', etiqueta: 'Texto del boton secundario', max: 40 },
]

function PanelHero({ hero, alGuardar, avisar }) {
	const [borrador, setBorrador] = useState(hero)
	const [guardando, setGuardando] = useState(false)

	const cambiar = (clave, valor) => setBorrador((b) => ({ ...b, [clave]: valor }))

	const cambiarStat = (indice, clave, valor) =>
		setBorrador((b) => ({
			...b,
			estadisticas: b.estadisticas.map((s, i) => (i === indice ? { ...s, [clave]: valor } : s)),
		}))

	const enviar = async (evento) => {
		evento.preventDefault()
		setGuardando(true)

		try {
			const guardado = await conDuracionMinima(() =>
				api.guardarHero({
					...borrador,
					/* El input numerico devuelve texto; el backend espera un numero */
					estadisticas: borrador.estadisticas.map((s) => ({ ...s, valor: Number(s.valor) })),
				})
			)

			alGuardar(guardado)
			avisar({ tipo: 'ok', texto: 'Hero actualizado' })
		} catch (error) {
			avisar({ tipo: 'error', texto: error.message })
		} finally {
			setGuardando(false)
		}
	}

	return (
		<form className="admin-panel" onSubmit={enviar}>
			<header className="admin-panel-head">
				<h2>Textos del hero</h2>
				<p>Es lo primero que ve el visitante al entrar al sitio.</p>
			</header>

			<div className="admin-grid">
				{CAMPOS.map(({ clave, etiqueta, max, largo }) => (
					<label
						className={`admin-campo${largo ? ' admin-campo--ancho' : ''}`}
						key={clave}
					>
						<span>
							{etiqueta}
							<em className="admin-contador">{(borrador[clave] || '').length}/{max}</em>
						</span>

						{largo ? (
							<textarea
								value={borrador[clave] || ''}
								maxLength={max}
								rows={clave === 'descripcion' ? 4 : 2}
								onChange={(e) => cambiar(clave, e.target.value)}
								required
							/>
						) : (
							<input
								type="text"
								value={borrador[clave] || ''}
								maxLength={max}
								onChange={(e) => cambiar(clave, e.target.value)}
								required
							/>
						)}
					</label>
				))}
			</div>

			<h3 className="admin-subtitulo">Barra de estadisticas</h3>
			<p className="admin-nota">
				El numero se anima contando desde cero cuando la barra entra en pantalla.
			</p>

			<div className="admin-stats">
				{borrador.estadisticas.map((stat, i) => (
					<fieldset className="admin-stat" key={i}>
						<legend>Estadistica {i + 1}</legend>

						<label className="admin-campo">
							<span>Numero</span>
							<input
								type="number"
								min="0"
								max="1000000"
								value={stat.valor}
								onChange={(e) => cambiarStat(i, 'valor', e.target.value)}
								required
							/>
						</label>

						<label className="admin-campo">
							<span>Simbolo</span>
							<input
								type="text"
								maxLength={4}
								placeholder="+"
								value={stat.sufijo}
								onChange={(e) => cambiarStat(i, 'sufijo', e.target.value)}
							/>
						</label>

						<label className="admin-campo admin-campo--ancho">
							<span>Etiqueta</span>
							<input
								type="text"
								maxLength={60}
								value={stat.etiqueta}
								onChange={(e) => cambiarStat(i, 'etiqueta', e.target.value)}
								required
							/>
						</label>
					</fieldset>
				))}
			</div>

			<div className="admin-acciones">
				<BotonGuardar ocupado={guardando} etiqueta="Guardar cambios" enCurso="Guardando..." />
			</div>
		</form>
	)
}

export default PanelHero
