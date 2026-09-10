import { leer, guardarSeccion } from '../models/almacen.js'

/**
 * Municipios y veredas con cobertura.
 *
 * Ojo: aqui solo se editan los nombres y el listado de veredas. La geometria
 * de los mapas (los paths SVG de coberturaDeptData.js) no se toca desde el
 * panel: son coordenadas reales del IGAC/DANE y editarlas a mano deformaria
 * el dibujo.
 */

const DEPARTAMENTOS = ['Cundinamarca', 'Boyaca']

function malaPeticion(mensaje) {
	const error = new Error(mensaje)
	error.status = 400
	return error
}

/**
 * Convierte un nombre en identificador: "Nuevo Colon" -> "nuevo-colon".
 *
 * El NFD separa cada letra de su acento y el rango ̀-ͯ borra esas
 * marcas sueltas. Sin ese paso, "Colón" acabaria como "col-n": la "o" acentuada
 * no entra en [a-z0-9] y se convertiria en guion.
 */
function aIdentificador(nombre) {
	return nombre
		.toLowerCase()
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
}

function validarMunicipio(entrada, indice) {
	const municipio = typeof entrada?.municipio === 'string' ? entrada.municipio.trim() : ''

	if (!municipio) throw malaPeticion(`El municipio ${indice + 1} no tiene nombre`)
	if (municipio.length > 60) throw malaPeticion(`El nombre de "${municipio}" es demasiado largo`)

	if (!DEPARTAMENTOS.includes(entrada.departamento)) {
		throw malaPeticion(`"${municipio}" necesita un departamento valido (${DEPARTAMENTOS.join(' o ')})`)
	}

	if (!Array.isArray(entrada.veredas)) {
		throw malaPeticion(`Las veredas de "${municipio}" deben venir en una lista`)
	}

	/* Se limpian espacios, se descartan vacias y se quitan repetidas */
	const veredas = [...new Set(
		entrada.veredas
			.filter((v) => typeof v === 'string')
			.map((v) => v.trim())
			.filter(Boolean)
	)]

	if (veredas.some((v) => v.length > 80)) {
		throw malaPeticion(`Alguna vereda de "${municipio}" supera los 80 caracteres`)
	}

	return {
		id: entrada.id || aIdentificador(municipio),
		municipio,
		departamento: entrada.departamento,
		veredas,
	}
}

export async function obtenerCobertura(req, res) {
	const contenido = await leer()
	res.json(contenido.cobertura)
}

export async function actualizarCobertura(req, res) {
	if (!Array.isArray(req.body)) {
		throw malaPeticion('Se espera una lista de municipios')
	}

	const cobertura = req.body.map(validarMunicipio)

	const ids = cobertura.map((m) => m.id)
	if (new Set(ids).size !== ids.length) {
		throw malaPeticion('Hay dos municipios con el mismo nombre')
	}

	res.json(await guardarSeccion('cobertura', cobertura))
}

export default { obtenerCobertura, actualizarCobertura }
