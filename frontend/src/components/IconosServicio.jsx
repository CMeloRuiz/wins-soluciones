/**
 * Iconos compartidos por las paginas de servicio.
 * Trazo de 1.7, mismo estilo que los del resto del sitio.
 * Se dibujan sobre un viewBox de 24 y heredan el color del contenedor.
 */

const base = {
	viewBox: '0 0 24 24',
	fill: 'none',
	stroke: 'currentColor',
	strokeWidth: 1.7,
	strokeLinecap: 'round',
	strokeLinejoin: 'round',
	'aria-hidden': true,
}

export const IconWifi = () => (
	<svg {...base}>
		<path d="M2 8.5a15 15 0 0 1 20 0" />
		<path d="M5 12a10.5 10.5 0 0 1 14 0" />
		<path d="M8.2 15.4a6 6 0 0 1 7.6 0" />
		<circle cx="12" cy="19" r="1.1" fill="currentColor" stroke="none" />
	</svg>
)

export const IconReloj = () => (
	<svg {...base}>
		<circle cx="12" cy="12" r="9.2" />
		<path d="M12 6.6V12l3.4 2" />
	</svg>
)

export const IconStreaming = () => (
	<svg {...base}>
		<rect x="2.5" y="4" width="19" height="13" rx="2.5" />
		<path d="M10.2 8.4v4.2l3.6-2.1z" />
		<path d="M8.5 20.5h7" />
	</svg>
)

export const IconDispositivos = () => (
	<svg {...base}>
		<rect x="2.5" y="5" width="12.5" height="9.5" rx="1.8" />
		<rect x="16.5" y="9.5" width="5" height="9.5" rx="1.5" />
		<path d="M6.5 18.5h5" />
	</svg>
)

export const IconEscudo = () => (
	<svg {...base}>
		<path d="M12 2.7 4.5 5.9v5.4c0 4.6 3.2 8.4 7.5 9.9 4.3-1.5 7.5-5.3 7.5-9.9V5.9z" />
		<path d="m9 11.8 2.1 2.1 4-4" />
	</svg>
)

export const IconSoporte = () => (
	<svg {...base}>
		<path d="M4 14v-2a8 8 0 0 1 16 0v2" />
		<path d="M4 14h2.5a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z" />
		<path d="M20 14h-2.5a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1H19a1 1 0 0 0 1-1z" />
	</svg>
)

export const IconFibra = () => (
	<svg {...base}>
		<path d="M3 20c0-6 5-9 9-9s9-3 9-9" />
		<circle cx="20" cy="4" r="1.6" fill="currentColor" stroke="none" />
		<circle cx="4" cy="20" r="1.6" fill="currentColor" stroke="none" />
	</svg>
)

export const IconIP = () => (
	<svg {...base}>
		<circle cx="12" cy="12" r="9.2" />
		<path d="M2.9 12h18.2" />
		<path d="M12 2.8a14 14 0 0 1 0 18.4 14 14 0 0 1 0-18.4z" />
	</svg>
)

export const IconRedundancia = () => (
	<svg {...base}>
		<path d="M3.5 9.5a8.5 8.5 0 0 1 14.4-4.3l2.6 2.4" />
		<path d="M20.5 14.5a8.5 8.5 0 0 1-14.4 4.3l-2.6-2.4" />
		<path d="M20.8 3.4v4.3h-4.3M3.2 20.6v-4.3h4.3" />
	</svg>
)

export const IconMonitoreo = () => (
	<svg {...base}>
		<path d="M2.5 12.5h4l2-5 3.5 9 2.5-6 1.8 3h5.2" />
	</svg>
)

export const IconAjustes = () => (
	<svg {...base}>
		<path d="M4 7h10M18 7h2M4 17h2M10 17h10" />
		<circle cx="16" cy="7" r="2.2" />
		<circle cx="8" cy="17" r="2.2" />
	</svg>
)

export const IconVelocidad = () => (
	<svg {...base}>
		<path d="M7 8.5 3.5 12 7 15.5" />
		<path d="M17 8.5 20.5 12 17 15.5" />
		<path d="M3.5 12h17" />
	</svg>
)

export const IconRayo = () => (
	<svg {...base}>
		<path d="M13 2.5 4.5 13.5h6L11 21.5 19.5 10.5h-6z" />
	</svg>
)

export const IconCandado = () => (
	<svg {...base}>
		<rect x="4.5" y="10.5" width="15" height="10" rx="2.2" />
		<path d="M8 10.5V7.4a4 4 0 0 1 8 0v3.1" />
	</svg>
)

export const IconClima = () => (
	<svg {...base}>
		<path d="M7 17.5a4.2 4.2 0 0 1-.3-8.4 5.6 5.6 0 0 1 10.7 1.4 3.6 3.6 0 0 1-.6 7z" />
	</svg>
)

export const IconAntena = () => (
	<svg {...base}>
		<path d="M12 13.5V21" />
		<path d="M8.5 21h7" />
		<path d="M8.4 10.1a5 5 0 0 1 7.2 0" />
		<path d="M5.7 7.3a9 9 0 0 1 12.6 0" />
		<circle cx="12" cy="12.6" r="1.4" fill="currentColor" stroke="none" />
	</svg>
)

export const IconCanales = () => (
	<svg {...base}>
		<rect x="2.5" y="7" width="19" height="13" rx="2.2" />
		<path d="m8 7 3-4M16 7l-3-4" />
	</svg>
)

export const IconHD = () => (
	<svg {...base}>
		<rect x="2.5" y="5.5" width="19" height="13" rx="2.2" />
		<path d="M7 10v4M7 12h3M10 10v4" />
		<path d="M13.5 10v4h1.6a2 2 0 0 0 2-2v0a2 2 0 0 0-2-2z" />
	</svg>
)

export const IconCasa = () => (
	<svg {...base}>
		<path d="M3.5 10.5 12 3.5l8.5 7" />
		<path d="M5.5 9.8V20h13V9.8" />
		<path d="M9.8 20v-5.5h4.4V20" />
	</svg>
)

export const IconCamara = () => (
	<svg {...base}>
		<path d="M3 7.6 18.6 4l1.2 5.2L4.2 12.8z" />
		<path d="M4.2 12.8 5 16.4" />
		<path d="M3.5 20.5h6l-1.4-4.3" />
		<path d="M15.5 5.2 16.6 10" />
	</svg>
)

export const IconMovil = () => (
	<svg {...base}>
		<rect x="7" y="2.5" width="10" height="19" rx="2.2" />
		<path d="M10.8 18.4h2.4" />
	</svg>
)

export const IconAnalitica = () => (
	<svg {...base}>
		<rect x="4.5" y="4.5" width="15" height="15" rx="3" />
		<circle cx="12" cy="12" r="2.6" />
		<path d="M9.5 1.5v3M14.5 1.5v3M9.5 19.5v3M14.5 19.5v3M1.5 9.5h3M1.5 14.5h3M19.5 9.5h3M19.5 14.5h3" />
	</svg>
)

export const IconCableado = () => (
	<svg {...base}>
		<path d="M6.5 3v5.5M6.5 8.5a3 3 0 0 0 3 3h5a3 3 0 0 1 3 3V21" />
		<rect x="4" y="1.5" width="5" height="3" rx="1" />
		<rect x="15" y="19.5" width="5" height="3" rx="1" />
	</svg>
)

export const IconMantenimiento = () => (
	<svg {...base}>
		<path d="M14.7 6.3a3.9 3.9 0 0 1 5.1 5.1l-8.4 8.4a2.5 2.5 0 0 1-3.5-3.5z" />
		<path d="M8.5 3.5 5 7l-2-2 3.5-3.5z" />
	</svg>
)

export const IconPin = () => (
	<svg {...base}>
		<path d="M20 10c0 6-8 11.5-8 11.5S4 16 4 10a8 8 0 0 1 16 0z" />
		<circle cx="12" cy="10" r="2.8" />
	</svg>
)

export const IconCheck = () => (
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
		<path d="m4.5 12.5 5 5 10-10" />
	</svg>
)
