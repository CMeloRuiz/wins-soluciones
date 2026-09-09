/**
 * Cobertura actual de WINS Soluciones.
 *
 * Las coordenadas son las reales de cada municipio (OpenStreetMap) y se
 * proyectan al lienzo del SVG, de modo que las posiciones relativas en el mapa
 * corresponden a la geografia y no a una colocacion manual. Si se agrega un
 * municipio nuevo basta con su lat/lng: el mapa se reencuadra solo.
 */

export const COBERTURA = [
	{
		id: 'villapinzon',
		municipio: 'Villapinzon',
		departamento: 'Cundinamarca',
		lat: 5.2215207,
		lng: -73.58989,
		veredas: [
			'Soatama', 'La Merced', 'Quincha', 'Chasquez', 'Bosavita', 'Sonsa',
			'San Pablo', 'San Pedro', 'La Joya', 'Tibita', 'El Salitre', 'Chiguala',
			'Guanguita', 'Casa Blanca', 'Nemoconcito', 'Chinquira',
		],
	},
	{
		id: 'choconta',
		municipio: 'Choconta',
		departamento: 'Cundinamarca',
		lat: 5.1459409,
		lng: -73.6839512,
		veredas: [
			'Chingacio', 'Retiro de blancos', 'Retiro de indios', 'El tejar',
			'Veracruz', 'Cruces', 'Pueblo viejo', 'Tablon', 'Agua caliente',
			'Aposentos', 'Capellania', 'Guanguita', 'Boqueron', 'Atofiero',
		],
	},
	{
		id: 'lenguazaque',
		municipio: 'Lenguazaque',
		departamento: 'Cundinamarca',
		lat: 5.3026458,
		lng: -73.6923453,
		veredas: [
			'Tibita el carmen', 'Tibita centro', 'Tibita hatico', 'Estancia alisal',
			'Espinal carrizal', 'Espinal alisal', 'Faracia retamo', 'Faracia pantanos',
		],
	},
	{
		id: 'ventaquemada',
		municipio: 'Ventaquemada',
		departamento: 'Boyaca',
		lat: 5.3666155,
		lng: -73.5216361,
		veredas: [
			'Choquira', 'Compromiso', 'Parroquia vieja', 'Frutillo', 'Boqueron',
			'Saita', 'El carmen', 'Jurpa', 'Estancia grande', 'Montoya', 'Supata',
			'Capellania', 'Puente piedra',
		],
	},
	{
		id: 'turmeque',
		municipio: 'Turmeque',
		departamento: 'Boyaca',
		lat: 5.3014558,
		lng: -73.5115863,
		veredas: [],
	},
	{
		id: 'nuevo-colon',
		municipio: 'Nuevo Colon',
		departamento: 'Boyaca',
		lat: 5.3528931,
		lng: -73.4476892,
		veredas: [],
	},
]

/** Texto que reemplaza a la lista cuando un municipio aun no tiene veredas cargadas */
export const SIN_VEREDAS = 'Cobertura en el casco urbano y zona rural cercana'

/* ===== Proyeccion al lienzo del SVG ===== */

export const MAPA = { ancho: 620, alto: 500, margen: 74 }

const lats = COBERTURA.map((m) => m.lat)
const lngs = COBERTURA.map((m) => m.lng)
const minLat = Math.min(...lats)
const maxLat = Math.max(...lats)
const minLng = Math.min(...lngs)
const maxLng = Math.max(...lngs)

/**
 * Proyeccion equirectangular simple. A esta latitud (~5 grados) la correccion
 * por coseno es de apenas un 0.4%, asi que no compensa complicarla.
 * El eje Y se invierte porque la latitud crece hacia el norte.
 */
function proyectar(lat, lng) {
	const util = { w: MAPA.ancho - MAPA.margen * 2, h: MAPA.alto - MAPA.margen * 2 }
	return {
		x: MAPA.margen + ((lng - minLng) / (maxLng - minLng)) * util.w,
		y: MAPA.margen + ((maxLat - lat) / (maxLat - minLat)) * util.h,
	}
}

/** Municipios con sus coordenadas ya proyectadas al SVG */
export const PUNTOS = COBERTURA.map((m) => ({ ...m, ...proyectar(m.lat, m.lng) }))

/**
 * Enlaces de la red entre municipios vecinos. Son ilustrativos: representan la
 * idea de una red interconectada, no el trazado real de la fibra.
 */
export const ENLACES = [
	['choconta', 'villapinzon'],
	['villapinzon', 'lenguazaque'],
	['villapinzon', 'turmeque'],
	['turmeque', 'ventaquemada'],
	['turmeque', 'nuevo-colon'],
]

export default COBERTURA
