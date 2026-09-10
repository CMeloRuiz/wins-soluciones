import { useState } from 'react'
import { api, API } from '../api'
import BotonGuardar from '../BotonGuardar'
import { conDuracionMinima } from '../duracionMinima'

/* Las mismas ranuras que acepta el backend */
const RANURAS = [
	{
		clave: 'heroFondo',
		titulo: 'Fondo del hero',
		nota: 'Se ve detras del texto principal del inicio. Formato horizontal, minimo 1920px de ancho.',
	},
	{
		clave: 'nosotrosEquipo',
		titulo: 'Imagen de Nosotros',
		nota: 'Acompana al texto de la seccion "Quienes somos".',
	},
	{
		clave: 'contactoFondo',
		titulo: 'Fondo de Contacto',
		nota: 'Se ve detras del formulario de contacto.',
	},
]

const MAX_MB = 4

function Ranura({ ranura, ruta, alCambiar, avisar }) {
	const [ocupado, setOcupado] = useState('')

	const subir = async (evento) => {
		const archivo = evento.target.files?.[0]
		if (!archivo) return

		/* Se comprueba aqui tambien para no gastar una subida que el servidor rechazaria */
		if (archivo.size > MAX_MB * 1024 * 1024) {
			avisar({ tipo: 'error', texto: `La imagen pesa mas de ${MAX_MB} MB` })
			evento.target.value = ''
			return
		}

		setOcupado('subiendo')

		try {
			const { imagenes } = await conDuracionMinima(() => api.subirImagen(ranura.clave, archivo))
			alCambiar(imagenes)
			avisar({ tipo: 'ok', texto: `Imagen actualizada: ${ranura.titulo.toLowerCase()}` })
		} catch (error) {
			avisar({ tipo: 'error', texto: error.message })
		} finally {
			setOcupado('')
			/* Permite volver a elegir el mismo archivo si hizo falta reintentar */
			evento.target.value = ''
		}
	}

	const restablecer = async () => {
		setOcupado('restableciendo')

		try {
			const { imagenes } = await conDuracionMinima(() => api.restablecerImagen(ranura.clave))
			alCambiar(imagenes)
			avisar({ tipo: 'ok', texto: `Se restablecio la imagen original: ${ranura.titulo.toLowerCase()}` })
		} catch (error) {
			avisar({ tipo: 'error', texto: error.message })
		} finally {
			setOcupado('')
		}
	}

	return (
		<article className="admin-imagen">
			<div className="admin-imagen-vista">
				{ruta ? (
					<img src={`${API}${ruta}`} alt={ranura.titulo} />
				) : (
					<span className="admin-imagen-vacia">Se usa la imagen original del sitio</span>
				)}
			</div>

			<div className="admin-imagen-cuerpo">
				<h3>{ranura.titulo}</h3>
				<p>{ranura.nota}</p>

				<div className="admin-imagen-acciones">
					<label className="admin-btn admin-btn--secundario" aria-busy={ocupado === 'subiendo'}>
						{ocupado === 'subiendo' && <span className="admin-btn-spinner" aria-hidden="true"></span>}
						{ocupado === 'subiendo' ? 'Subiendo...' : 'Cambiar imagen'}
						<input
							type="file"
							accept="image/jpeg,image/png,image/webp"
							onChange={subir}
							disabled={Boolean(ocupado)}
							hidden
						/>
					</label>

					{ruta && (
						<BotonGuardar
							variante="texto"
							tipo="button"
							ocupado={ocupado === 'restableciendo'}
							etiqueta="Volver a la original"
							enCurso="Restableciendo..."
							onClick={restablecer}
						/>
					)}
				</div>
			</div>
		</article>
	)
}

function PanelImagenes({ imagenes, alGuardar, avisar }) {
	return (
		<section className="admin-panel">
			<header className="admin-panel-head">
				<h2>Imagenes de las secciones</h2>
				<p>
					Se aceptan JPG, PNG o WEBP de hasta {MAX_MB} MB. Sube imagenes ya optimizadas:
					una foto sin comprimir hace que el sitio cargue lento.
				</p>
			</header>

			<div className="admin-imagenes">
				{RANURAS.map((ranura) => (
					<Ranura
						key={ranura.clave}
						ranura={ranura}
						ruta={imagenes[ranura.clave]}
						alCambiar={alGuardar}
						avisar={avisar}
					/>
				))}
			</div>
		</section>
	)
}

export default PanelImagenes
