import { useScrollReveal } from '../hooks/useScrollReveal'
import '../styles/Reveal.css'

/**
 * Envuelve contenido para que aparezca con un fade-in y un leve desplazamiento
 * hacia arriba cuando entra en el viewport.
 *
 * Props:
 *  - delay  (number)  Retardo en ms. Sirve para escalonar tarjetas de una grilla.
 *  - as     (string)  Etiqueta a renderizar. Por defecto "div".
 *  - className        Clases propias del elemento; se suman a las del reveal.
 */
function Reveal({ children, delay = 0, as: Tag = 'div', className = '', ...resto }) {
	const [ref, visible] = useScrollReveal()

	return (
		<Tag
			ref={ref}
			className={`reveal${visible ? ' is-visible' : ''}${className ? ' ' + className : ''}`}
			style={delay ? { transitionDelay: `${delay}ms` } : undefined}
			{...resto}
		>
			{children}
		</Tag>
	)
}

export default Reveal
