import Header from '../components/Header';
import Hero from '../components/Hero';
import Nosotros from '../components/Nosotros';
import ServiciosDestacados from '../components/ServiciosDestacados';
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
      {/* Fondo blanco: Servicios destacados ya usa el gris claro */}
      <Planes fondo="claro" />
      <Testimonios />
      <TestVelocidad />
      <Footer />
    </>
  )
}

export default Home
