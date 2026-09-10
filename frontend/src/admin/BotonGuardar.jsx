/**
 * Boton de accion con estado de carga.
 *
 * Existe para que las tres pestanas del panel se comporten igual al guardar:
 * mismo giro, mismo texto en gerundio y, sobre todo, el boton deshabilitado
 * mientras se espera al servidor, que es lo que evita el doble envio.
 *
 * @param {boolean} ocupado    Si hay una peticion en curso
 * @param {string}  etiqueta   Texto en reposo
 * @param {string}  enCurso    Texto mientras se espera
 */
function BotonGuardar({ ocupado, etiqueta, enCurso, tipo = 'submit', onClick, variante = 'primario' }) {
	return (
		<button
			className={`admin-btn admin-btn--${variante}`}
			type={tipo}
			onClick={onClick}
			disabled={ocupado}
			/* Avisa al lector de pantalla de que la accion sigue en marcha */
			aria-busy={ocupado}
		>
			{ocupado && <span className="admin-btn-spinner" aria-hidden="true"></span>}
			{ocupado ? enCurso : etiqueta}
		</button>
	)
}

export default BotonGuardar
