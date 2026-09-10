import { createContext, useContext } from 'react'
import { API } from '../admin/api'

/**
 * ===== Contenido editable del sitio =====
 *
 * Aqui viven el contexto y los ayudantes; el componente que hace la peticion
 * es ProveedorContenido, en components/. Van separados porque un archivo que
 * exporta un componente no puede exportar tambien funciones sueltas sin
 * romper el refresco en caliente de Vite.
 */

export const ContenidoContexto = createContext(null)

/**
 * Devuelve lo que el administrador haya editado desde el panel, o null si
 * todavia no llego o no hay backend. Cada seccion decide su respaldo, de modo
 * que el sitio publico nunca depende de que la API responda.
 */
export function useContenido() {
	return useContext(ContenidoContexto)
}

/**
 * URL de una imagen subida desde el panel, o null si no hay ninguna y el
 * componente debe usar la suya.
 *
 * Hoy el backend guarda la URL completa de Cloudinary, asi que se devuelve
 * tal cual. Se sigue aceptando una ruta relativa ("/uploads/x.jpg") porque es
 * lo que guardaba la version anterior, cuando las imagenes vivian en el disco
 * del servidor: asi un contenido antiguo no se queda sin imagen.
 */
export function urlDeImagen(ruta) {
	if (!ruta) return null
	return /^https?:\/\//.test(ruta) ? ruta : `${API}${ruta}`
}

export default useContenido
