import Reveal from './Reveal'
import '../styles/TestVelocidad.css'
import speedTest from '../assets/images/speed_test.jpg'

/*
 * Speedtest de Ookla responde con "X-Frame-Options: DENY" y
 * "Content-Security-Policy: frame-ancestors 'none'", asi que el sitio no se
 * puede embeber en un iframe. El embed oficial requiere un ID registrado por
 * dominio. Por eso el test se abre en una pestana nueva.
 */
const URL_SPEEDTEST = 'https://www.speedtest.net'

function TestVelocidad() {
	return (
		<section className="test-velocidad" id="test-velocidad">
			<div className="test-container">
				{/* Imagen a la izquierda: alterna respecto a "Nosotros",
				    que lleva el texto de ese lado */}
				<Reveal className="test-imagen">
					<img
						src={speedTest}
						alt="Medicion de velocidad de conexion a internet"
						loading="lazy"
						decoding="async"
					/>
				</Reveal>

				<Reveal className="test-texto" delay={110}>
					<span className="test-badge">
						<span className="test-badge-icon" aria-hidden="true">◆</span>
						Test de velocidad
					</span>

					<h2 className="test-title">Comprueba la velocidad de tu conexion</h2>

					<p className="test-description">
						Verifica en segundos la velocidad real de tu internet y confirma que
						estas recibiendo el servicio que contrataste con WINS Soluciones.
					</p>

					<a
						className="test-btn"
						href={URL_SPEEDTEST}
						target="_blank"
						rel="noopener noreferrer"
					>
						Iniciar test de velocidad
						<span className="test-btn-arrow" aria-hidden="true">&rarr;</span>
					</a>

					<p className="test-nota">Se abre en una pestana nueva</p>
				</Reveal>
			</div>
		</section>
	)
}

export default TestVelocidad
