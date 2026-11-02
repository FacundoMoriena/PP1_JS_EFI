import { Routes, Route } from "react-router-dom";




import Navbar from "./components/Navbar";
import Vehiculos from "./pages/Vehiculos";
import Favoritos from "./pages/Favoritos";
import Home from "./pages/Home";
import Gestion from "./pages/Gestion";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-white-900 text-zinc-100">
      <Navbar />
      <main className="flex-1 max-w-6xl w-full mx-auto p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/vehiculos" element={<Vehiculos />} />
          <Route path="/favoritos" element={<Favoritos />} />
          <Route path="/gestion" element={<Gestion />} />
        </Routes>
      </main>
    </div>
  );
}

export default App
