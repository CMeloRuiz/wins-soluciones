/*
 * Duracion minima que se le da a una accion de guardado.
 *
 * El backend escribe en un archivo JSON local y responde en pocos
 * milisegundos, asi que el estado "Guardando..." aparecia y desaparecia sin
 * que diera tiempo a verlo: el usuario pulsaba y no percibia que hubiera
 * pasado nada. Esperar un poco antes de dar por terminada la accion no hace
 * mas lento el guardado, que ya ocurrio, solo hace visible que ocurrio.
 */
const MINIMO = 700

/**
 * Ejecuta la tarea y no la da por terminada antes de "minimo" milisegundos.
 *
 * Si la peticion tarda mas que ese minimo no se anade ninguna espera: el
 * retardo solo rellena lo que le falte para llegar, nunca se suma encima.
 *
 * Tanto el resultado como el error salen igual que sin envolver, solo que
 * despues de la espera, para que el aviso de exito o de fallo aparezca cuando
 * el boton deja de estar en "Guardando...".
 *
 * @param {() => Promise<any>} tarea   Lo que se quiere ejecutar
 * @param {number} minimo              Milisegundos minimos
 */
export async function conDuracionMinima(tarea, minimo = MINIMO) {
	const inicio = Date.now()

	try {
		return await tarea()
	} finally {
		const restante = minimo - (Date.now() - inicio)
		if (restante > 0) await new Promise((seguir) => setTimeout(seguir, restante))
	}
}

export default conDuracionMinima
