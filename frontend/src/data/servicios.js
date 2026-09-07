/**
 * Fuente unica de las paginas de servicio.
 * La consumen el dropdown del Header y la columna "Servicios" del Footer,
 * para que una ruta nueva o renombrada no haya que actualizarla en dos sitios.
 */
export const SERVICIOS = [
	{ texto: 'Internet hogar', to: '/servicios/internet-hogar' },
	{ texto: 'Fibra optica', to: '/servicios/fibra-optica' },
	{ texto: 'Internet empresarial', to: '/servicios/internet-empresarial' },
	{ texto: 'Television', to: '/servicios/television' },
	{ texto: 'CCTV y seguridad', to: '/servicios/cctv-seguridad' },
]

export default SERVICIOS
