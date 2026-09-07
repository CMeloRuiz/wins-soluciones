import '../styles/Testimonios.css'
import foto1 from '../assets/images/testimonio_1.jpg'
import foto2 from '../assets/images/testimonio_2.jpg'
import foto3 from '../assets/images/testimonio_3.jpg'
import foto4 from '../assets/images/testimonio_4.jpg'
import foto5 from '../assets/images/testimonio_5.jpg'

const TESTIMONIOS = [
	{
		foto: foto1,
		nombre: 'Carolina Restrepo',
		detalle: 'Cliente residencial',
		texto: 'Cambiamos a la fibra de WINS y la diferencia fue inmediata. Trabajo desde casa en videollamadas todo el dia y nunca se me ha caido la conexion.',
	},
	{
		foto: foto2,
		nombre: 'Andres Mosquera',
		detalle: 'Cliente empresarial',
		texto: 'El internet dedicado nos permitio abrir dos sedes nuevas sin preocuparnos por la red. El soporte responde rapido y eso para un negocio vale mucho.',
	},
	{
		foto: foto3,
		nombre: 'Gerardo Villamil',
		detalle: 'Cliente residencial',
		texto: 'Contrate el combo de internet y television. La programacion se ve muy bien y la instalacion la hicieron el mismo dia que llame.',
	},
	{
		foto: foto4,
		nombre: 'Daniela Fonseca',
		detalle: 'Cliente residencial',
		texto: 'En casa somos cinco conectados al tiempo entre series, juegos y estudio. La velocidad se mantiene estable y ya no peleamos por el wifi.',
	},
	{
		foto: foto5,
		nombre: 'Ricardo Beltran',
		detalle: 'Cliente empresarial',
		texto: 'Llevamos dos anos con WINS en la oficina. Cero interrupciones y cuando hemos necesitado ampliar el ancho de banda lo resuelven en poco tiempo.',
	},
]

/** 5 estrellas en SVG */
function Estrellas() {
	return (
		<div className="testimonio-estrellas" role="img" aria-label="Calificacion de 5 sobre 5 estrellas">
			{Array.from({ length: 5 }, (_, i) => (
				<svg key={i} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
					<path d="M12 2.5l2.9 5.9 6.5.95-4.7 4.58 1.11 6.47L12 17.35 6.19 20.4l1.11-6.47-4.7-4.58 6.5-.95z" />
				</svg>
			))}
		</div>
	)
}

/** Tarjeta individual */
function TestimonioCard({ testimonio }) {
	return (
		<article className="testimonio-card">
			<header className="testimonio-header">
				<img className="testimonio-foto" src={testimonio.foto} alt={testimonio.nombre} loading="lazy" decoding="async" />
				<div>
					<p className="testimonio-nombre">{testimonio.nombre}</p>
					<p className="testimonio-detalle">{testimonio.detalle}</p>
				</div>
			</header>

			<Estrellas />

			<p className="testimonio-texto">{testimonio.texto}</p>
		</article>
	)
}

function Testimonios() {
	return (
		<section className="testimonios" id="testimonios">
			<div className="testimonios-header">
				<span className="testimonios-badge">
					<span className="testimonios-badge-icon" aria-hidden="true">◆</span>
					Casos de exito y testimonios
				</span>

				<h2 className="testimonios-title">Lo que dicen nuestros clientes</h2>

				<p className="testimonios-subtitle">
					Miles de hogares y empresas ya confian en nosotros
				</p>
			</div>

			{/* Marquee infinito: el track lleva el set duplicado y se desplaza
			    exactamente el ancho de un grupo mas su separacion (ver CSS). */}
			<div className="testimonios-marquee">
				<div className="testimonios-track">
					<div className="testimonios-grupo">
						{TESTIMONIOS.map((t) => (
							<TestimonioCard key={t.nombre} testimonio={t} />
						))}
					</div>

					{/* Copia visual: oculta para lectores de pantalla para no repetir el contenido */}
					<div className="testimonios-grupo" aria-hidden="true">
						{TESTIMONIOS.map((t) => (
							<TestimonioCard key={`${t.nombre}-copia`} testimonio={t} />
						))}
					</div>
				</div>
			</div>
		</section>
	)
}

export default Testimonios
