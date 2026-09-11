import { useState } from 'react'
import { api } from './api'
import { conDuracionMinima } from './duracionMinima'
import BotonGuardar from './BotonGuardar'

/**
 * Devuelve todo el contenido del sitio a como venia de fabrica.
 *
 * Es la unica accion del panel que no se puede deshacer, asi que pide
 * confirmacion en dos pasos en lugar de ejecutarse al primer clic. Se hace
 * aqui dentro y no con un window.confirm para que el aviso pueda explicar
 * exactamente que se va a perder.
 *
 * @param {(contenido: object) => void} alRestaurar  Recibe el contenido nuevo
 * @param {(aviso: object) => void} avisar
 */
function BotonRestaurar({ alRestaurar, avisar }) {
	const [confirmando, setConfirmando] = useState(false)
	const [ocupado, setOcupado] = useState(false)

	const restaurar = async () => {
		setOcupado(true)

		try {
			const contenido = await conDuracionMinima(() => api.restaurarTodo())

			alRestaurar(contenido)
			setConfirmando(false)
			avisar({ tipo: 'ok', texto: 'Se restauro el contenido original' })
		} catch (error) {
			avisar({ tipo: 'error', texto: error.message })
		} finally {
			setOcupado(false)
		}
	}

	if (!confirmando) {
		return (
			<button
				type="button"
				className="admin-sidebar-enlace admin-sidebar-enlace--peligro"
				onClick={() => setConfirmando(true)}
			>
				Restaurar contenido original
			</button>
		)
	}

	return (
		<div className="admin-restaurar">
			<p className="admin-restaurar-aviso">
				Se perderan los textos y los listados que hayas editado, y las imagenes
				que hayas subido. No se puede deshacer.
			</p>

			<div className="admin-restaurar-acciones">
				<BotonGuardar
					variante="peligro"
					tipo="button"
					ocupado={ocupado}
					etiqueta="Si, restaurar"
					enCurso="Restaurando..."
					onClick={restaurar}
				/>

				<button
					type="button"
					className="admin-btn admin-btn--texto"
					onClick={() => setConfirmando(false)}
					disabled={ocupado}
				>
					Cancelar
				</button>
			</div>
		</div>
	)
}

export default BotonRestaurar
