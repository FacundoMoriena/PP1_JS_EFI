import { Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Vehiculos from "./pages/Vehiculos";
import VehiculoDetalle from "./pages/VehiculoDetalle";
import VehiculoFicha from "./components/VehiculoFicha";
import VehiculoFabricante from "./components/VehiculoFabricante";
import Gestion from "./pages/Gestion";
import Favoritos from "./pages/Favoritos";
import { FavoritosProvider } from "./context/FavoritosContext";
import { UserProvider } from "./context/UserContext";

function NotFound() {
  return (
    <div className="py-24 text-center">
      <p className="text-5xl mb-4">🚧</p>
      <h2 className="text-2xl font-bold text-white mb-2">Página no encontrada (404)</h2>
      <p className="text-zinc-400 mb-6">La dirección a la que intentas acceder no existe.</p>
      <Link
        to="/"
        className="bg-green-400 hover:bg-green-500 text-zinc-950 font-bold px-5 py-2.5 rounded-lg inline-block"
      >
        Volver al Inicio
      </Link>
    </div>
  );
}

function App() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-zinc-900 text-zinc-100">
      <FavoritosProvider>
        <UserProvider>
          <Navbar />

          <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6">
            <Routes>
              {/* Rutas Base (R1) */}
              <Route path="/" element={<Home />} />
              <Route path="/vehiculos" element={<Vehiculos />} />

              {/* Ruta Dinámica y Ruta Anidada con subrutas (R1 - según patrón Valentino) */}
              <Route path="/vehiculos/:id" element={<VehiculoDetalle />}>
                <Route index element={<VehiculoFicha />} />
                <Route path="fabricante" element={<VehiculoFabricante />} />
              </Route>

              <Route path="/gestion" element={<Gestion />} />
              <Route path="/favoritos" element={<Favoritos />} />

              {/* Manejo de ruta no encontrada */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          <Footer />
        </UserProvider>
      </FavoritosProvider>
    </div>
  );
}

export default App;
