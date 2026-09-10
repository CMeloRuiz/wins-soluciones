import { Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import BotonWhatsApp from './components/BotonWhatsApp';
import ProveedorContenido from './components/ProveedorContenido';
import Home from './pages/Home';
import PaginaNosotros from './pages/PaginaNosotros';
import PaginaContacto from './pages/PaginaContacto';
import PaginaInternetHogar from './pages/PaginaInternetHogar';
import PaginaFibraOptica from './pages/PaginaFibraOptica';
import PaginaInternetEmpresarial from './pages/PaginaInternetEmpresarial';
import PaginaTelevision from './pages/PaginaTelevision';
import PaginaCCTVSeguridad from './pages/PaginaCCTVSeguridad';

/* Panel privado: vive en src/admin, aparte de las paginas del sitio publico */
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import RutaProtegida from './admin/RutaProtegida';


function App() {
  return (
    /*
     * El proveedor trae de la API los textos e imagenes que se editen desde
     * el panel. Si la API no responde, cada seccion se pinta con el contenido
     * que ya lleva escrito, asi que el sitio no depende de que este encendida.
     */
    <ProveedorContenido>
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

        {/* Panel administrativo */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <RutaProtegida>
              <AdminDashboard />
            </RutaProtegida>
          }
        />
      </Routes>

      {/* Fuera de las rutas: acompana al usuario por todo el sitio */}
      <BotonWhatsApp />
    </ProveedorContenido>
  )
}

export default App
