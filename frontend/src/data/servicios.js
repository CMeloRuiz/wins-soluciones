/**
 * Fuente unica de las paginas de servicio.
 *
 * La consumen el dropdown del Header, la columna "Servicios" del Footer y el
 * carrusel de "Servicios destacados", para que una ruta nueva o renombrada no
 * haya que actualizarla en varios sitios.
 *
 * "texto" y "to" son lo unico que necesitan Header y Footer. El resto de
 * campos los usa la tarjeta del carrusel, y las descripciones estan tomadas
 * del encabezado de cada pagina para que el mensaje no se contradiga.
 */
import imgInternetHogar from '../assets/images/servicios/home_internet_service.jpg'
import imgFibraOptica from '../assets/images/servicios/fiber_optic_service.jpg'
import imgInternetEmpresarial from '../assets/images/servicios/enterprise_internet_service.jpg'
import imgTelevision from '../assets/images/servicios/tv_service.jpg'
import imgCctv from '../assets/images/servicios/cctv_service.jpg'

/* Imagenes propias de las tarjetas destacadas del inicio */
import imgDestacadoHogar from '../assets/images/destacados/servicio_internet_hogar.jpg'
import imgDestacadoEmpresarial from '../assets/images/destacados/servicio_internet_empresarial.jpg'
import imgDestacadoTelevision from '../assets/images/destacados/servicio_television.jpg'

export const SERVICIOS = [
	{
		texto: 'Internet hogar',
		to: '/servicios/internet-hogar',
		imagen: imgInternetHogar,
		alt: 'Familia usando internet en casa',
		descripcion:
			'Una conexion estable para que en casa todos naveguen, trabajen y vean lo que quieran al mismo tiempo.',
	},
	{
		texto: 'Fibra optica',
		to: '/servicios/fibra-optica',
		imagen: imgFibraOptica,
		alt: 'Hilos de fibra optica iluminados',
		descripcion:
			'La tecnologia que sostiene nuestra red, con mayor velocidad y estabilidad que el cobre.',
	},
	{
		texto: 'Internet empresarial',
		to: '/servicios/internet-empresarial',
		imagen: imgInternetEmpresarial,
		alt: 'Infraestructura de red en una oficina moderna',
		descripcion:
			'Conectividad dedicada, con respaldo contractual y soporte permanente, para operaciones que no pueden detenerse.',
	},
	{
		texto: 'Television',
		to: '/servicios/television',
		imagen: imgTelevision,
		alt: 'Familia disfrutando de television en casa',
		descripcion:
			'Television por cable con senal estable en toda la vivienda y una parrilla amplia de canales.',
	},
	{
		texto: 'CCTV y seguridad',
		to: '/servicios/cctv-seguridad',
		imagen: imgCctv,
		alt: 'Camara de videovigilancia instalada en un edificio',
		descripcion:
			'Videovigilancia profesional, con analitica inteligente y acompanamiento tecnico permanente.',
	},
]

/**
 * Las tres tarjetas de "Servicios destacados" del inicio.
 *
 * Es un subconjunto de SERVICIOS: se destacan los servicios masivos, y fibra
 * optica y CCTV se dejan fuera a proposito para no repetir en el inicio lo que
 * ya esta en el menu "Servicios".
 *
 * Las imagenes son propias, de la carpeta "destacados": estan recortadas a 3:2,
 * la misma proporcion que usa la tarjeta, asi que no se deforma nada.
 */
const IMAGENES_DESTACADAS = {
	'/servicios/internet-hogar': imgDestacadoHogar,
	'/servicios/internet-empresarial': imgDestacadoEmpresarial,
	'/servicios/television': imgDestacadoTelevision,
}

export const DESTACADOS = [
	'/servicios/internet-hogar',
	'/servicios/internet-empresarial',
	'/servicios/television',
].map((ruta) => ({
	...SERVICIOS.find((s) => s.to === ruta),
	imagen: IMAGENES_DESTACADAS[ruta],
}))

export default SERVICIOS
