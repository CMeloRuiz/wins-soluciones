import { useState, useEffect } from 'react'
import { API } from '../admin/api'
import { ContenidoContexto } from '../hooks/useContenido'

/**
 * Trae de la API el contenido que se haya editado desde el panel.
 *
 * Es deliberadamente tolerante a fallos: si el backend no esta desplegado,
 * esta apagado o tarda demasiado, no pasa nada. Se queda en null y cada
 * seccion se pinta con el contenido que ya lleva escrito, que es exactamente
 * como se comportaba el sitio antes de que existiera el panel.
 */
function ProveedorContenido({ children }) {
	const [contenido, setContenido] = useState(null)

	useEffect(() => {
		let vigente = true

		/* Mas alla de este tiempo no vale la pena seguir esperando a la API */
		const corte = new AbortController()
		const reloj = setTimeout(() => corte.abort(), 4000)

		fetch(`${API}/api/contenido`, { signal: corte.signal })
			.then((respuesta) => (respuesta.ok ? respuesta.json() : null))
			.then((datos) => {
				if (vigente && datos) setContenido(datos)
			})
			.catch(() => {
				/* Sin API el sitio funciona igual: no hay nada que avisarle al visitante */
			})
			.finally(() => clearTimeout(reloj))

		return () => {
			vigente = false
			clearTimeout(reloj)
			corte.abort()
		}
	}, [])

	return (
		<ContenidoContexto.Provider value={contenido}>
			{children}
		</ContenidoContexto.Provider>
	)
}

export default ProveedorContenido
