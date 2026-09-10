/**
 * Contenido de arranque.
 *
 * Es una copia del texto que hoy esta escrito en los componentes del sitio
 * publico. Sirve para dos cosas: sembrar el almacen la primera vez que corre
 * el servidor, y hacer de referencia si el archivo de datos se borra.
 *
 * A partir de aqui la fuente de verdad es data/contenido.json, que es lo que
 * edita el panel administrativo.
 */
export const CONTENIDO_INICIAL = {
	hero: {
		badge: 'Disfruta de una conexion de Internet potente y confiable en tu hogar',
		tituloLinea1: 'Una conexion',
		tituloLinea2: 'veloz y sin fronteras.',
		subtitulo: 'Donde la velocidad y la confiabilidad se encuentran',
		descripcion:
			'Conectate al mundo de forma rapida, segura y confiable. Descubre lo que el mundo digital puede ofrecerte y navega sin limites con nuestro ISP.',
		botonPrimario: 'Contacto',
		botonSecundario: 'Cobertura',
		estadisticas: [
			{ valor: 500, sufijo: '+', etiqueta: 'Clientes conectados' },
			{ valor: 5, sufijo: '+', etiqueta: 'Municipios con cobertura' },
			{ valor: 99, sufijo: '%', etiqueta: 'Tiempo de actividad' },
		],
	},

	/*
	 * Imagenes de las secciones principales. En null significa "usa la que
	 * viene empaquetada con el sitio"; al subir una nueva se guarda aqui la
	 * ruta publica que sirve este mismo servidor.
	 */
	imagenes: {
		heroFondo: null,
		nosotrosEquipo: null,
		contactoFondo: null,
	},

	/* Mismos municipios y veredas que hoy tiene frontend/src/data/cobertura.js */
	cobertura: [
		{
			id: 'villapinzon',
			municipio: 'Villapinzon',
			departamento: 'Cundinamarca',
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
			veredas: [
				'Tibita el carmen', 'Tibita centro', 'Tibita hatico', 'Estancia alisal',
				'Espinal carrizal', 'Espinal alisal', 'Faracia retamo', 'Faracia pantanos',
			],
		},
		{
			id: 'ventaquemada',
			municipio: 'Ventaquemada',
			departamento: 'Boyaca',
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
			veredas: [],
		},
		{
			id: 'nuevo-colon',
			municipio: 'Nuevo Colon',
			departamento: 'Boyaca',
			veredas: [],
		},
	],
}

export default CONTENIDO_INICIAL
