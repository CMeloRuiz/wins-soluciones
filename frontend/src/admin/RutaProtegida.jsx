import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { api, sesion, cerrarSesion, EVENTO_SESION } from './api'
import { useInactividad } from './useInactividad'

/**
 * Envuelve las paginas privadas del panel.
 *
 * Concentra aqui las tres formas en que se pierde la sesion, para que ninguna
 * pagina privada tenga que ocuparse de ello:
 *
 *  1. Al entrar: no basta con que haya un token guardado, podria estar
 *     caducado o venir de otro despliegue, asi que se pregunta al servidor.
 *  2. Durante el uso: cualquier peticion que responda 401 o 403 dispara el
 *     evento de sesion caducada y se sale al login.
 *  3. Sin uso: pasados unos minutos sin actividad se cierra sola.
 *
 * El cuarto caso, cerrar la pestana, lo resuelve el propio sessionStorage
 * donde vive el token (ver api.js).
 */
function RutaProtegida({ children }) {
	/*
	 * Sin token ni siquiera hace falta preguntar al servidor, asi que se parte
	 * ya de "fuera". Resolverlo en el estado inicial y no dentro del efecto
	 * evita un render de mas.
	 */
	const [estado, setEstado] = useState(() => (sesion.leer() ? 'comprobando' : 'fuera'))

	/*
	 * Solo se rellena cuando la sesion se cae estando dentro. Al llegar sin
	 * token no hay nada que explicar: el usuario simplemente no habia entrado.
	 */
	const [motivo, setMotivo] = useState(null)

	useEffect(() => {
		if (estado !== 'comprobando') return

		let vigente = true

		api.verificarSesion()
			.then(() => vigente && setEstado('dentro'))
			.catch(() => {
				sesion.borrar()
				if (vigente) setEstado('fuera')
			})

		/* Evita avisar de un cambio de estado si el componente ya se desmonto */
		return () => { vigente = false }
	}, [estado])

	/* Cualquier peticion que reciba un 401 o un 403 acaba aqui */
	useEffect(() => {
		const alCaducar = () => {
			setMotivo((previo) => previo ?? 'caducada')
			setEstado('fuera')
		}

		window.addEventListener(EVENTO_SESION, alCaducar)
		return () => window.removeEventListener(EVENTO_SESION, alCaducar)
	}, [])

	/*
	 * Y si el panel se queda abierto sin que nadie lo toque, se cierra solo.
	 * El motivo se marca antes de cerrar, para que gane al del evento.
	 */
	useInactividad(() => {
		setMotivo('inactividad')
		cerrarSesion()
	}, estado === 'dentro')

	if (estado === 'comprobando') {
		return (
			<div className="admin-cargando">
				<span className="admin-spinner" aria-hidden="true"></span>
				<p>Comprobando la sesion...</p>
			</div>
		)
	}

	/* El motivo viaja al login para poder explicarle al usuario que paso */
	if (estado === 'fuera') {
		return <Navigate to="/admin" replace state={motivo ? { motivo } : undefined} />
	}

	return children
}

export default RutaProtegida
