import { useEffect } from 'react'
import '../styles/Toast.css'

/*
 * Cuanto se queda en pantalla, segun el tipo. El error dura mas porque hay que
 * leerlo y decidir que hacer, mientras que la confirmacion solo se ojea.
 */
const DURACION = { ok: 3000, error: 5000 }

function IconoExito() {
	return (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"
			strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
			<path d="M20 6 9 17l-5-5" />
		</svg>
	)
}

function IconoError() {
	return (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"
			strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
			<circle cx="12" cy="12" r="9" />
			<path d="M12 7.5v5.5M12 16.5h.01" />
		</svg>
	)
}

/**
 * Aviso flotante de resultado de una accion.
 *
 * Se muestra cuando "aviso" trae algo y se retira solo pasados unos segundos.
 * El componente no guarda estado propio: quien lo usa decide cuando aparece,
 * y recibe el aviso de cierre por "alCerrar".
 *
 * @param {{tipo: 'ok'|'error', texto: string}|null} aviso
 * @param {() => void} alCerrar
 */
function Toast({ aviso, alCerrar }) {
	/*
	 * El temporizador se reinicia con cada aviso nuevo: si llegan dos seguidos,
	 * el segundo se ve completo en vez de heredar lo que quedaba del primero.
	 * La clave del texto entra en las dependencias para que dos avisos iguales
	 * consecutivos tambien reinicien la cuenta.
	 */
	useEffect(() => {
		if (!aviso) return

		const reloj = setTimeout(alCerrar, DURACION[aviso.tipo] ?? DURACION.ok)
		return () => clearTimeout(reloj)
	}, [aviso, alCerrar])

	/*
	 * La region existe siempre, aunque este vacia: los lectores de pantalla solo
	 * anuncian los cambios dentro de un aria-live que ya estaba en el documento.
	 * Con "assertive" el error interrumpe; el exito espera su turno.
	 */
	return (
		<div
			className="toast-zona"
			role="status"
			aria-live={aviso?.tipo === 'error' ? 'assertive' : 'polite'}
		>
			{aviso && (
				<div className={`toast toast--${aviso.tipo}`}>
					<span className="toast-icono" aria-hidden="true">
						{aviso.tipo === 'error' ? <IconoError /> : <IconoExito />}
					</span>

					<p className="toast-texto">{aviso.texto}</p>

					<button
						type="button"
						className="toast-cerrar"
						onClick={alCerrar}
						aria-label="Cerrar aviso"
					>
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
							strokeLinecap="round" aria-hidden="true">
							<path d="M6 6l12 12M18 6 6 18" />
						</svg>
					</button>
				</div>
			)}
		</div>
	)
}

export default Toast
