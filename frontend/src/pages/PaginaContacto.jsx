import { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import PageHero from '../components/PageHero'
import { useContenido, urlDeImagen } from '../hooks/useContenido'
import '../styles/PaginaContacto.css'

import fondoContacto from '../assets/images/contact/contact_background.jpg'
import { WHATSAPP, WHATSAPP_VISIBLE } from '../data/contacto'

/* ===== Datos de contacto =====
 * La ubicacion corresponde a la sede real enlazada en Google Maps
 * (Villapinzon, Cundinamarca). Telefonos y correos son de ejemplo.
 */


const MAPA_ENLACE = 'https://maps.app.goo.gl/tthmn7WQsRmUMiQu8'
// Coordenadas de la sede; "output=embed" permite incrustar sin clave de API
const MAPA_EMBED =
	'https://www.google.com/maps?q=5.2144159,-73.594459&hl=es&z=17&output=embed'

const SERVICIOS = [
	'Internet hogar',
	'Internet empresarial',
	'Television',
	'CCTV y seguridad',
	'Otro',
]

/* ===== Iconos inline, mismo trazo que el resto del sitio ===== */

const IconWhatsapp = () => (
	<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
		<path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.5-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3M12 21.8h-.1c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4a9.9 9.9 0 0 1-1.5-5.3C2.1 6.5 6.6 2 12 2c2.6 0 5.1 1 7 2.9a9.8 9.8 0 0 1 2.9 7c0 5.4-4.4 9.9-9.9 9.9M20.5 3.5A11.8 11.8 0 0 0 12 0C5.5 0 .2 5.3.2 11.9c0 2.1.5 4.1 1.6 5.9L0 24l6.3-1.7c1.7 1 3.7 1.4 5.7 1.4 6.5 0 11.9-5.3 11.9-11.9 0-3.2-1.2-6.2-3.4-8.4Z" />
	</svg>
)

const IconTelefono = () => (
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
		<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .3 1.9.6 2.8a2 2 0 0 1-.4 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.5 2.8.6a2 2 0 0 1 1.8 2.1z" />
	</svg>
)

const IconOficina = () => (
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
		<path d="M21 10c0 6.5-9 12-9 12s-9-5.5-9-12a9 9 0 0 1 18 0z" />
		<circle cx="12" cy="10" r="3" />
	</svg>
)

const IconCorreo = () => (
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
		<rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
		<path d="m3 7 8.1 5.4a1.6 1.6 0 0 0 1.8 0L21 7" />
	</svg>
)

const IconHorario = () => (
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
		<circle cx="12" cy="12" r="9.2" />
		<path d="M12 6.6V12l3.4 2" />
	</svg>
)

function PaginaContacto() {
	/* El fondo que haya subido el administrador; si no, el del propio sitio */
	const remoto = useContenido()
	const fondo = urlDeImagen(remoto?.imagenes?.contactoFondo) ?? fondoContacto

	const [form, setForm] = useState({
		nombre: '',
		apellido: '',
		correo: '',
		telefono: '',
		servicio: SERVICIOS[0],
		mensaje: '',
	})
	const [enviado, setEnviado] = useState(false)

	const actualizar = (campo) => (e) =>
		setForm((prev) => ({ ...prev, [campo]: e.target.value }))

	// Sin backend por ahora: se simula el envio con un mensaje de confirmacion
	const enviar = (e) => {
		e.preventDefault()
		setEnviado(true)
	}

	const nuevoMensaje = () => {
		setForm({ nombre: '', apellido: '', correo: '', telefono: '', servicio: SERVICIOS[0], mensaje: '' })
		setEnviado(false)
	}

	return (
		<>
			<Header />

			<PageHero
				titulo="Contactenos"
				breadcrumb={[{ texto: 'Inicio', href: '/' }, { texto: 'Contacto' }]}
				descripcion="Estamos para resolver tus dudas y ayudarte a elegir el servicio que necesitas."
			/>

			{/* ===== Bloque principal: informacion + formulario ===== */}
			<section
				className="contacto-principal"
				style={{ backgroundImage: `url(${fondo})` }}
			>
				<div className="contacto-container">
					{/* --- Columna de informacion --- */}
					<div className="contacto-info">
						<h2 className="contacto-title">Tienes preguntas, tenemos respuestas</h2>

						<p className="contacto-intro">
							Escribenos por el canal que prefieras. Nuestro equipo de atencion
							responde en horario habil y te acompana desde la cotizacion hasta la
							instalacion.
						</p>

						{/* Accion directa destacada sobre el resto de datos */}
						<a
							className="contacto-whatsapp"
							href={`https://wa.me/${WHATSAPP}`}
							target="_blank"
							rel="noopener noreferrer"
						>
							<span className="contacto-whatsapp-icon" aria-hidden="true"><IconWhatsapp /></span>
							<span className="contacto-whatsapp-texto">
								<strong>Escribenos por WhatsApp</strong>
								<span>{WHATSAPP_VISIBLE}</span>
							</span>
							<span className="contacto-whatsapp-arrow" aria-hidden="true">&rarr;</span>
						</a>

						{/* Grilla de datos, como en la referencia */}
						<div className="contacto-datos">
							<div className="contacto-dato">
								<span className="contacto-dato-icon" aria-hidden="true"><IconTelefono /></span>
								<h3>Telefono</h3>
								<p>
									<a href={`tel:+${WHATSAPP}`}>{WHATSAPP_VISIBLE}</a>
								</p>
							</div>

							<div className="contacto-dato">
								<span className="contacto-dato-icon" aria-hidden="true"><IconCorreo /></span>
								<h3>Correos</h3>
								<p>
									<a href="mailto:contacto@winssoluciones.com">contacto@winssoluciones.com</a>
									<br />
									<a href="mailto:soporte@winssoluciones.com">soporte@winssoluciones.com</a>
								</p>
							</div>

							<div className="contacto-dato">
								<span className="contacto-dato-icon" aria-hidden="true"><IconOficina /></span>
								<h3>Oficina</h3>
								<p>
									Carrera 4 # 3-45
									<br />
									Villapinzon, Cundinamarca
								</p>
							</div>

							<div className="contacto-dato">
								<span className="contacto-dato-icon" aria-hidden="true"><IconHorario /></span>
								<h3>Horarios de atencion</h3>
								<p>
									Lunes a viernes: 8:00 am - 6:00 pm
									<br />
									Sabados: 9:00 am - 1:00 pm
								</p>
							</div>
						</div>
					</div>

					{/* --- Columna del formulario --- */}
					<div className="contacto-form-card">
						{enviado ? (
							/* Confirmacion tras el envio simulado */
							<div className="contacto-exito" role="status">
								<span className="contacto-exito-icon" aria-hidden="true">
									<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
										<path d="m4.5 12.5 5 5 10-10" />
									</svg>
								</span>
								<h2 className="contacto-form-title">Gracias por escribirnos</h2>
								<p className="contacto-form-sub">
									Recibimos tu mensaje y te contactaremos pronto al correo o telefono
									que nos dejaste.
								</p>
								<button type="button" className="contacto-btn contacto-btn--secundario" onClick={nuevoMensaje}>
									Enviar otro mensaje
								</button>
							</div>
						) : (
							<form className="contacto-form" onSubmit={enviar} noValidate={false}>
								<h2 className="contacto-form-title">Cuentanos que necesitas</h2>
								<p className="contacto-form-sub">Nuestro equipo te respondera a la brevedad</p>

								<div className="contacto-fila">
									<div className="contacto-campo">
										<label htmlFor="nombre">Nombre</label>
										<input id="nombre" name="nombre" type="text" autoComplete="given-name"
											value={form.nombre} onChange={actualizar('nombre')} required />
									</div>

									<div className="contacto-campo">
										<label htmlFor="apellido">Apellido</label>
										<input id="apellido" name="apellido" type="text" autoComplete="family-name"
											value={form.apellido} onChange={actualizar('apellido')} required />
									</div>
								</div>

								<div className="contacto-fila">
									<div className="contacto-campo">
										<label htmlFor="correo">Correo electronico</label>
										<input id="correo" name="correo" type="email" autoComplete="email"
											value={form.correo} onChange={actualizar('correo')} required />
									</div>

									<div className="contacto-campo">
										<label htmlFor="telefono">Telefono</label>
										<input id="telefono" name="telefono" type="tel" autoComplete="tel"
											value={form.telefono} onChange={actualizar('telefono')} required />
									</div>
								</div>

								{/* Chips en lugar de un select: las opciones quedan a la vista */}
								<fieldset className="contacto-campo contacto-chips-grupo">
									<legend>Servicio de interes</legend>
									<div className="contacto-chips">
										{SERVICIOS.map((servicio) => (
											<label
												key={servicio}
												className={`contacto-chip${form.servicio === servicio ? ' is-activo' : ''}`}
											>
												<input
													type="radio"
													name="servicio"
													value={servicio}
													checked={form.servicio === servicio}
													onChange={actualizar('servicio')}
												/>
												{servicio}
											</label>
										))}
									</div>
								</fieldset>

								<div className="contacto-campo">
									<label htmlFor="mensaje">Mensaje</label>
									<textarea id="mensaje" name="mensaje" rows="4"
										value={form.mensaje} onChange={actualizar('mensaje')} required />
								</div>

								<button type="submit" className="contacto-btn">
									Enviar mensaje
									<span className="contacto-btn-arrow" aria-hidden="true">&rarr;</span>
								</button>
							</form>
						)}
					</div>
				</div>
			</section>

			{/* ===== Bloque de Google Maps ===== */}
			<section className="contacto-mapa" id="ubicacion">
				<div className="contacto-mapa-container">
					<div className="contacto-mapa-header">
						<span className="contacto-badge">
							<span className="contacto-badge-icon" aria-hidden="true">&#9670;</span>
							Nuestra ubicacion
						</span>

						<h2 className="contacto-mapa-title">Encuentranos facilmente</h2>

						<p className="contacto-mapa-sub">
							Visitanos en nuestra sede principal en Villapinzon, Cundinamarca.
						</p>
					</div>

					<div className="contacto-mapa-marco">
						<iframe
							title="Ubicacion de WINS Soluciones en Google Maps"
							src={MAPA_EMBED}
							loading="lazy"
							allowFullScreen
							referrerPolicy="no-referrer-when-downgrade"
						/>
					</div>

					<a
						className="contacto-mapa-link"
						href={MAPA_ENLACE}
						target="_blank"
						rel="noopener noreferrer"
					>
						Abrir en Google Maps
						<span aria-hidden="true">&rarr;</span>
					</a>
				</div>
			</section>

			<Footer />
		</>
	)
}

export default PaginaContacto
