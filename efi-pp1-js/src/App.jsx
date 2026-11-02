import { Routes, Route } from "react-router-dom";




import Vehiculos from "./pages/Vehiculos"
import Favoritos from "./pages/Favoritos"
import Home from "./pages/Home"
import Gestion from "./pages/Gestion"


function App() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-zinc-900 text-zinc-100">
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/vehiculos" element={<Vehiculos />} />
      <Route path="/favoritos" element={<Favoritos />} />
      <Route path="/gestion" element={<Gestion />} />
    </Routes>

    </div>
  )
}

export default App
