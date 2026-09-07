import { useState } from 'react'
import Reveal from './Reveal'
import '../styles/MiniFormulario.css'

/**
 * Formulario de contacto contextualizado al servicio de cada pagina.
 * Reutiliza el lenguaje visual del formulario de PaginaContacto.
 *
 * Props:
 *  - servicio    (string)   Servicio de interes. Viaja en el estado y se
 *                           muestra como dato fijo, no editable.
 *  - titulo      (string)   Encabezado del formulario.
 *  - descripcion (string)   Bajada corta bajo el titulo.
 *  - textoBoton  (string)   Texto del boton de envio.
 *  - campoExtra  (object)   Campo adicional opcional del servicio:
 *                           { nombre, etiqueta, tipo: 'texto' | 'opciones',
 *                             opciones: [] }
 *  - variante    ('claro' | 'oscuro') Fondo sobre el que se monta la seccion.
 */
function MiniFormulario({
	servicio,
	titulo = 'Solicita mas informacion',
	descripcion = 'Dejanos tus datos y un asesor se comunica contigo.',
	textoBoton = 'Solicitar informacion',
	campoExtra = null,
	variante = 'claro',
}) {
	const estadoInicial = {
		nombre: '',
		correo: '',
		telefono: '',
		mensaje: '',
		servicio,
		// El campo extra arranca en la primera opcion si es de tipo lista
		...(campoExtra && {
			[campoExtra.nombre]: campoExtra.tipo === 'opciones' ? campoExtra.opciones[0] : '',
		}),
	}

	const [form, setForm] = useState(estadoInicial)
	const [enviado, setEnviado] = useState(false)

	const actualizar = (campo) => (e) =>
		setForm((prev) => ({ ...prev, [campo]: e.target.value }))

	// Sin backend por ahora: se simula el envio con una confirmacion
	const enviar = (e) => {
		e.preventDefault()
		setEnviado(true)
	}

	const reiniciar = () => {
		setForm(estadoInicial)
		setEnviado(false)
	}

	return (
		<section className={`miniform miniform--${variante}`}>
			<div className="miniform-container">
				<Reveal className="miniform-card">
					{enviado ? (
						<div className="miniform-exito" role="status">
							<span className="miniform-exito-icon" aria-hidden="true">
								<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
									<path d="m4.5 12.5 5 5 10-10" />
								</svg>
							</span>

							<h2 className="miniform-title">Gracias por escribirnos</h2>
							<p className="miniform-sub">
								Recibimos tu solicitud sobre {servicio}. Un asesor te contactara pronto.
							</p>

							<button type="button" className="miniform-btn miniform-btn--secundario" onClick={reiniciar}>
								Enviar otra solicitud
							</button>
						</div>
					) : (
						<form className="miniform-form" onSubmit={enviar}>
							<header className="miniform-head">
								{/* El servicio preseleccionado va como pastilla junto al titulo:
								    ocupa una linea en vez de un bloque completo */}
								<span className="miniform-pill">{form.servicio}</span>
								<h2 className="miniform-title">{titulo}</h2>
								<p className="miniform-sub">{descripcion}</p>
							</header>

							<input type="hidden" name="servicio" value={form.servicio} />

							<div className="miniform-campos">
								<div className="miniform-campo">
									<label htmlFor={`nombre-${servicio}`}>Nombre</label>
									<input id={`nombre-${servicio}`} type="text" autoComplete="name"
										value={form.nombre} onChange={actualizar('nombre')} required />
								</div>

								<div className="miniform-campo">
									<label htmlFor={`telefono-${servicio}`}>Telefono</label>
									<input id={`telefono-${servicio}`} type="tel" autoComplete="tel"
										value={form.telefono} onChange={actualizar('telefono')} required />
								</div>

								{/* Sin campo extra, el correo ocupa las dos columnas */}
								<div className={`miniform-campo${campoExtra ? '' : ' miniform-campo--ancho'}`}>
									<label htmlFor={`correo-${servicio}`}>Correo electronico</label>
									<input id={`correo-${servicio}`} type="email" autoComplete="email"
										value={form.correo} onChange={actualizar('correo')} required />
								</div>

								{campoExtra && (
									<div className="miniform-campo">
										<label htmlFor={`extra-${servicio}`}>{campoExtra.etiqueta}</label>

										{campoExtra.tipo === 'opciones' ? (
											<select id={`extra-${servicio}`}
												value={form[campoExtra.nombre]} onChange={actualizar(campoExtra.nombre)}>
												{campoExtra.opciones.map((op) => (
													<option key={op} value={op}>{op}</option>
												))}
											</select>
										) : (
											<input id={`extra-${servicio}`} type="text"
												value={form[campoExtra.nombre]} onChange={actualizar(campoExtra.nombre)} required />
										)}
									</div>
								)}

								<div className="miniform-campo miniform-campo--ancho">
									<label htmlFor={`mensaje-${servicio}`}>Mensaje</label>
									<textarea id={`mensaje-${servicio}`} rows="3"
										value={form.mensaje} onChange={actualizar('mensaje')} required />
								</div>
							</div>

							<button type="submit" className="miniform-btn">
								{textoBoton}
								<span className="miniform-btn-arrow" aria-hidden="true">&rarr;</span>
							</button>
						</form>
					)}
				</Reveal>
			</div>
		</section>
	)
}

export default MiniFormulario
