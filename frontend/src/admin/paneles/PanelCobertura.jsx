import { useState } from 'react'
import { api } from '../api'
import BotonGuardar from '../BotonGuardar'
import { conDuracionMinima } from '../duracionMinima'

const DEPARTAMENTOS = ['Cundinamarca', 'Boyaca']

/* Una vereda por linea: es la forma mas comoda de pegar un listado largo */
const aTexto = (veredas) => veredas.join('\n')
const aLista = (texto) => texto.split('\n').map((v) => v.trim()).filter(Boolean)

function PanelCobertura({ cobertura, alGuardar, avisar }) {
	/* Se trabaja sobre una copia: hasta pulsar Guardar no se toca el servidor */
	const [borrador, setBorrador] = useState(
		cobertura.map((m) => ({ ...m, veredasTexto: aTexto(m.veredas) }))
	)
	const [guardando, setGuardando] = useState(false)

	const cambiar = (indice, clave, valor) =>
		setBorrador((b) => b.map((m, i) => (i === indice ? { ...m, [clave]: valor } : m)))

	const anadir = () =>
		setBorrador((b) => [
			...b,
			{ id: '', municipio: '', departamento: DEPARTAMENTOS[0], veredas: [], veredasTexto: '' },
		])

	const quitar = (indice) =>
		setBorrador((b) => b.filter((_, i) => i !== indice))

	const enviar = async (evento) => {
		evento.preventDefault()
		setGuardando(true)

		try {
			const guardado = await conDuracionMinima(() =>
				api.guardarCobertura(
					borrador.map(({ veredasTexto, ...municipio }) => ({
						...municipio,
						veredas: aLista(veredasTexto),
					}))
				)
			)

			/* Se recarga del servidor: el backend normaliza ids y quita repetidas */
			setBorrador(guardado.map((m) => ({ ...m, veredasTexto: aTexto(m.veredas) })))
			alGuardar(guardado)
			avisar({ tipo: 'ok', texto: 'Cobertura actualizada' })
		} catch (error) {
			avisar({ tipo: 'error', texto: error.message })
		} finally {
			setGuardando(false)
		}
	}

	const totalVeredas = borrador.reduce((suma, m) => suma + aLista(m.veredasTexto).length, 0)

	return (
		<form className="admin-panel" onSubmit={enviar}>
			<header className="admin-panel-head">
				<h2>Municipios y veredas</h2>
				<p>
					Alimenta la seccion de cobertura del inicio. {borrador.length} municipios y{' '}
					{totalVeredas} veredas.
				</p>
			</header>

			<p className="admin-aviso">
				El dibujo de los mapas no se edita aqui. Son coordenadas reales del IGAC y el DANE,
				y viven en el codigo del sitio. Aqui se cambian los nombres y los listados.
			</p>

			<div className="admin-municipios">
				{borrador.map((municipio, i) => (
					<fieldset className="admin-municipio" key={i}>
						<legend>{municipio.municipio || 'Municipio nuevo'}</legend>

						<div className="admin-municipio-fila">
							<label className="admin-campo">
								<span>Nombre</span>
								<input
									type="text"
									maxLength={60}
									value={municipio.municipio}
									onChange={(e) => cambiar(i, 'municipio', e.target.value)}
									required
								/>
							</label>

							<label className="admin-campo">
								<span>Departamento</span>
								<select
									value={municipio.departamento}
									onChange={(e) => cambiar(i, 'departamento', e.target.value)}
								>
									{DEPARTAMENTOS.map((d) => <option key={d} value={d}>{d}</option>)}
								</select>
							</label>

							<button
								className="admin-btn admin-btn--peligro"
								type="button"
								onClick={() => quitar(i)}
							>
								Quitar
							</button>
						</div>

						<label className="admin-campo">
							<span>
								Veredas, una por linea
								<em className="admin-contador">{aLista(municipio.veredasTexto).length}</em>
							</span>
							<textarea
								rows={6}
								value={municipio.veredasTexto}
								placeholder={'Soatama\nLa Merced\nQuincha'}
								onChange={(e) => cambiar(i, 'veredasTexto', e.target.value)}
							/>
						</label>
					</fieldset>
				))}
			</div>

			<div className="admin-acciones">
				<button className="admin-btn admin-btn--secundario" type="button" onClick={anadir}>
					Anadir municipio
				</button>

				<BotonGuardar ocupado={guardando} etiqueta="Guardar cambios" enCurso="Guardando..." />
			</div>
		</form>
	)
}

export default PanelCobertura
