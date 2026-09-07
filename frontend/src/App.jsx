import { Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import PaginaNosotros from './pages/PaginaNosotros';
import PaginaContacto from './pages/PaginaContacto';
import PaginaInternetHogar from './pages/PaginaInternetHogar';
import PaginaFibraOptica from './pages/PaginaFibraOptica';
import PaginaInternetEmpresarial from './pages/PaginaInternetEmpresarial';
import PaginaTelevision from './pages/PaginaTelevision';
import PaginaCCTVSeguridad from './pages/PaginaCCTVSeguridad';


function App() {
  return (
    <>
      {/* Al cambiar de ruta la vista vuelve al inicio de la pagina */}
      <ScrollToTop />

      {/* Las paginas completas del nav usan el prefijo "Pagina" */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/nosotros" element={<PaginaNosotros />} />
        <Route path="/contacto" element={<PaginaContacto />} />

        {/* Servicios */}
        <Route path="/servicios/internet-hogar" element={<PaginaInternetHogar />} />
        <Route path="/servicios/fibra-optica" element={<PaginaFibraOptica />} />
        <Route path="/servicios/internet-empresarial" element={<PaginaInternetEmpresarial />} />
        <Route path="/servicios/television" element={<PaginaTelevision />} />
        <Route path="/servicios/cctv-seguridad" element={<PaginaCCTVSeguridad />} />
      </Routes>
    </>
  )
}

export default App
