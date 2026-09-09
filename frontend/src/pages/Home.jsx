import Header from '../components/Header';
import Hero from '../components/Hero';
import Nosotros from '../components/Nosotros';
import ServiciosDestacados from '../components/ServiciosDestacados';
import Cobertura from '../components/Cobertura';
import Planes from '../components/Planes';
import Testimonios from '../components/Testimonios';
import TestVelocidad from '../components/TestVelocidad';
import Footer from '../components/Footer';


function Home() {
  return (
    <>
      <Header />
      <Hero />
      <Nosotros />
      <ServiciosDestacados />
      <Cobertura />
      {/* Fondo blanco: Cobertura y Servicios destacados usan gris y azul oscuro */}
      <Planes fondo="claro" />
      <Testimonios />
      <TestVelocidad />
      <Footer />
    </>
  )
}

export default Home
