import { useEffect, useState } from "react";

export default function Vehiculos() {
  const [vehiculos, setVehiculos] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [tiposVehiculos, setTiposVehiculos] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    // Pedimos las 3 cosas en paralelo con Promise.all
    Promise.all([
      fetch(`${API_URL}/vehiculos/`).then((res) => res.json()),
      fetch(`${API_URL}/marcas/`).then((res) => res.json()),
      fetch(`${API_URL}/tipo_vehiculos/`).then((res) => res.json()),
    ])
      .then(([vehiculosData, marcasData, tiposData]) => {
        setVehiculos(vehiculosData.items || []);
        setMarcas(marcasData.items || []);
        setTiposVehiculos(tiposData.items || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al traer los datos:", err);
        setLoading(false);
      });
  }, []);

  // Funciones de ayuda para obtener el nombre a partir del ID
  const obtenerNombreMarca = (id) =>
    marcas.find((m) => m.id === id)?.nombre || "Desconocida";

  const obtenerNombreTipo = (id) =>
    tiposVehiculos.find((t) => t.id === id)?.nombre || "General";

  if (loading) {
    return <p className="text-center text-xl py-10">Cargando vehículos...</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Catálogo de Vehículos</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {vehiculos.map((auto) => (
          <div
            key={auto.id}
            className="bg-zinc-800 rounded-lg overflow-hidden shadow p-4 flex flex-col justify-between"
          >
            {auto.url_image && (
              <img
                src={auto.url_image}
                alt={auto.nombre}
                className="w-full h-48 object-cover rounded mb-3"
              />
            )}
            <div>
              <div className="flex gap-2 text-xs font-semibold text-zinc-400 uppercase tracking-wide">
                <span>{obtenerNombreMarca(auto.marca_id)}</span>
                <span>•</span>
                <span>{obtenerNombreTipo(auto.tipo_vehiculo_id)}</span>
              </div>
              <h2 className="text-xl font-bold mt-1">{auto.nombre}</h2>
              <p className="text-green-400 font-semibold text-lg mt-2">
                ${auto.precio}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}