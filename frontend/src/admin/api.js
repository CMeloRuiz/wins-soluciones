/**
 * Cliente de la API administrativa.
 *
 * Concentra en un solo sitio la URL base, el token y el manejo de errores,
 * para que los paneles solo se ocupen de su formulario.
 */

/* En desarrollo apunta al backend local; en produccion se define en el .env */
export const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

const LLAVE_TOKEN = 'wins_admin_token'

/* Aviso interno de que la sesion dejo de valer, para redirigir al login */
export const EVENTO_SESION = 'wins:sesion-caducada'

/**
 * Token de la sesion administrativa.
 *
 * Se guarda en sessionStorage y no en localStorage a proposito: asi el token
 * vive solo mientras la pestana este abierta. Al cerrarla, el navegador lo
 * descarta sin que haya que hacer nada, que es justo lo que se espera de un
 * panel de administracion en un equipo que puede ser compartido. Con
 * localStorage la sesion sobrevivia al cierre del navegador.
 *
 * El precio es que hay que volver a entrar en cada pestana nueva. Para un
 * panel que se usa de vez en cuando, es un cambio menor frente a dejar una
 * sesion abierta de forma indefinida.
 */
export const sesion = {
	leer: () => sessionStorage.getItem(LLAVE_TOKEN),
	guardar: (token) => sessionStorage.setItem(LLAVE_TOKEN, token),
	borrar: () => sessionStorage.removeItem(LLAVE_TOKEN),
}

/** Cierra la sesion y avisa para que la vista privada mande al login */
export function cerrarSesion() {
	sesion.borrar()
	window.dispatchEvent(new CustomEvent(EVENTO_SESION))
}

/** Error con el mensaje que devolvio el servidor, para poder mostrarlo tal cual */
export class ErrorApi extends Error {
	constructor(mensaje, estado) {
		super(mensaje)
		this.name = 'ErrorApi'
		this.estado = estado
		/* El panel usa esto para mandar al login sin preguntar nada mas */
		this.sesionCaducada = estado === 401 || estado === 403
	}
}

/**
 * Llama a la API.
 *
 * Si "cuerpo" es un FormData se deja pasar sin tocar: el navegador tiene que
 * poner el Content-Type con el boundary del multipart, y fijarlo a mano
 * romperia la subida.
 */
export async function llamar(ruta, { metodo = 'GET', cuerpo, autenticado = true } = {}) {
	const cabeceras = {}
	const esFormulario = cuerpo instanceof FormData

	if (autenticado) {
		const token = sesion.leer()
		if (token) cabeceras.Authorization = `Bearer ${token}`
	}

	if (cuerpo && !esFormulario) cabeceras['Content-Type'] = 'application/json'

	let respuesta
	try {
		respuesta = await fetch(`${API}${ruta}`, {
			method: metodo,
			headers: cabeceras,
			body: esFormulario ? cuerpo : cuerpo ? JSON.stringify(cuerpo) : undefined,
		})
	} catch {
		/* Ni siquiera se pudo conectar: casi siempre el backend esta apagado */
		throw new ErrorApi('No se pudo conectar con el servidor. Revisa que la API este encendida.', 0)
	}

	if (respuesta.status === 204) return null

	const datos = await respuesta.json().catch(() => null)

	if (!respuesta.ok) {
		/*
		 * El token caduco o dejo de ser valido. Se avisa aqui, en el unico sitio
		 * por el que pasan todas las peticiones, para no tener que acordarse de
		 * comprobarlo en cada panel.
		 */
		if (respuesta.status === 401 || respuesta.status === 403) cerrarSesion()
		throw new ErrorApi(datos?.error || `Error ${respuesta.status}`, respuesta.status)
	}

	return datos
}

/* ===== Atajos por recurso ===== */

export const api = {
	login: (usuario, clave) =>
		llamar('/api/auth/login', { metodo: 'POST', cuerpo: { usuario, clave }, autenticado: false }),

	verificarSesion: () => llamar('/api/auth/verificar'),

	obtenerContenido: () => llamar('/api/contenido', { autenticado: false }),

	guardarHero: (hero) => llamar('/api/contenido/hero', { metodo: 'PUT', cuerpo: hero }),

	subirImagen: (ranura, archivo) => {
		const formulario = new FormData()
		formulario.append('imagen', archivo)
		return llamar(`/api/contenido/imagenes/${ranura}`, { metodo: 'POST', cuerpo: formulario })
	},

	restablecerImagen: (ranura) =>
		llamar(`/api/contenido/imagenes/${ranura}`, { metodo: 'DELETE' }),

	guardarCobertura: (municipios) =>
		llamar('/api/cobertura', { metodo: 'PUT', cuerpo: municipios }),

	restaurarTodo: () => llamar('/api/contenido/restaurar', { metodo: 'POST' }),
}

export default api
