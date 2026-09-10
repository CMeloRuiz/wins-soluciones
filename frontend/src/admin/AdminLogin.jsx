import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { api, sesion } from './api'
import BotonGuardar from './BotonGuardar'
import '../styles/Admin.css'
import logo from '../assets/images/wins_logo.png'

/* Por que se cerro la sesion, para avisar al volver al login */
const MOTIVOS = {
	inactividad: 'La sesion se cerro despues de un rato sin actividad. Vuelve a entrar.',
	caducada: 'La sesion caduco. Vuelve a entrar.',
}

/** Formulario de acceso al panel administrativo */
function AdminLogin() {
	const navegar = useNavigate()
	const { state } = useLocation()
	const motivo = MOTIVOS[state?.motivo]

	const [usuario, setUsuario] = useState('')
	const [clave, setClave] = useState('')
	const [error, setError] = useState('')
	const [enviando, setEnviando] = useState(false)

	/* Si ya hay sesion, no tiene sentido pedir la clave otra vez */
	useEffect(() => {
		if (!sesion.leer()) return

		let vigente = true
		api.verificarSesion()
			.then(() => vigente && navegar('/admin/dashboard', { replace: true }))
			.catch(() => sesion.borrar())

		return () => { vigente = false }
	}, [navegar])

	const enviar = async (evento) => {
		evento.preventDefault()
		setError('')
		setEnviando(true)

		try {
			const { token } = await api.login(usuario.trim(), clave)
			sesion.guardar(token)
			navegar('/admin/dashboard', { replace: true })
		} catch (fallo) {
			setError(fallo.message)
		} finally {
			setEnviando(false)
		}
	}

	return (
		<main className="admin-login">
			<form className="admin-login-card" onSubmit={enviar}>
				<img className="admin-login-logo" src={logo} alt="WINS Soluciones" />

				<h1 className="admin-login-titulo">Panel administrativo</h1>
				<p className="admin-login-sub">Accede para editar el contenido del sitio</p>

				<label className="admin-campo">
					<span>Usuario</span>
					<input
						type="text"
						value={usuario}
						onChange={(e) => setUsuario(e.target.value)}
						autoComplete="username"
						required
						autoFocus
					/>
				</label>

				<label className="admin-campo">
					<span>Clave</span>
					<input
						type="password"
						value={clave}
						onChange={(e) => setClave(e.target.value)}
						autoComplete="current-password"
						required
					/>
				</label>

				{/* Explica una salida automatica; el error del formulario manda sobre el */}
				{motivo && !error && <p className="admin-nota admin-nota--aviso">{motivo}</p>}

				{/* role="alert" hace que el lector de pantalla lo anuncie al aparecer */}
				{error && <p className="admin-error" role="alert">{error}</p>}

				<BotonGuardar ocupado={enviando} etiqueta="Entrar" enCurso="Entrando..." />

				<Link className="admin-login-volver" to="/">&larr; Volver al sitio</Link>
			</form>
		</main>
	)
}

export default AdminLogin
