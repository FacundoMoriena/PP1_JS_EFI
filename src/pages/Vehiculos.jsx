import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { FavoritosContext } from "../context/FavoritosContext";

export default function Vehiculos() {
  const [vehiculos, setVehiculos] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [tiposVehiculos, setTiposVehiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para filtros
  const [busqueda, setBusqueda] = useState("");
  const [marcaFiltro, setMarcaFiltro] = useState("");

  const { esFavorito, toggleFavorito } = useContext(FavoritosContext);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    setLoading(true);
    setError(null);

    Promise.all([
      fetch(`${API_URL}/vehiculos/`).then((res) => {
        if (!res.ok) throw new Error("Error al obtener vehículos");
        return res.json();
      }),
      fetch(`${API_URL}/marcas/`).then((res) => {
        if (!res.ok) throw new Error("Error al obtener marcas");
        return res.json();
      }),
      fetch(`${API_URL}/tipo_vehiculos/`).then((res) => {
        if (!res.ok) throw new Error("Error al obtener tipos de vehículos");
        return res.json();
      }),
    ])
      .then(([vehiculosData, marcasData, tiposData]) => {
        setVehiculos(vehiculosData.items || vehiculosData || []);
        setMarcas(marcasData.items || marcasData || []);
        setTiposVehiculos(tiposData.items || tiposData || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al traer los datos:", err);
        setError("No pudimos conectar con el servidor. Revisa tu conexión o la API.");
        setLoading(false);
      });
  }, [API_URL]);

  const obtenerNombreMarca = (id) =>
    marcas.find((m) => m.id === id)?.nombre || "Marca general";

  const obtenerNombreTipo = (id) =>
    tiposVehiculos.find((t) => t.id === id)?.nombre || "General";

  // Filtrado reactivo en base a búsqueda y marca
  const vehiculosFiltrados = vehiculos.filter((auto) => {
    const coincideNombre = auto.nombre
      ?.toLowerCase()
      .includes(busqueda.toLowerCase());
    const coincideMarca =
      marcaFiltro === "" || String(auto.marca_id) === String(marcaFiltro);
    return coincideNombre && coincideMarca;
  });

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-400 border-t-transparent mb-4"></div>
        <p className="text-xl text-zinc-300">Cargando catálogo de vehículos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 bg-red-950/40 border border-red-800 rounded-lg text-center">
        <p className="text-3xl mb-2">⚠️</p>
        <p className="text-red-400 font-semibold mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded text-sm font-medium cursor-pointer"
        >
          Reintentar conexión
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Catálogo de Vehículos</h1>
          <p className="text-zinc-400 text-sm mt-1">
            Explora las unidades disponibles en nuestra concesionaria.
          </p>
        </div>

        {/* Barra de Filtros */}
        <div className="flex flex-wrap sm:flex-nowrap gap-3">
          <input
            type="text"
            placeholder="Buscar por modelo..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="px-3.5 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-sm focus:outline-none focus:border-green-400 text-white placeholder-zinc-500 w-full sm:w-48"
          />

          <select
            value={marcaFiltro}
            onChange={(e) => setMarcaFiltro(e.target.value)}
            className="px-3.5 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-sm focus:outline-none focus:border-green-400 text-white cursor-pointer w-full sm:w-44"
          >
            <option value="">Todas las marcas</option>
            {marcas.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {vehiculosFiltrados.length === 0 ? (
        <div className="text-center py-16 bg-zinc-800/40 rounded-xl border border-zinc-700/50">
          <p className="text-4xl mb-3">🔎</p>
          <h3 className="text-xl font-bold text-zinc-300">No encontramos vehículos</h3>
          <p className="text-sm text-zinc-500 mt-1 mb-4">
            No hay unidades que coincidan con los criterios de búsqueda seleccionados.
          </p>
          <button
            onClick={() => {
              setBusqueda("");
              setMarcaFiltro("");
            }}
            className="text-xs text-green-400 hover:underline cursor-pointer"
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehiculosFiltrados.map((auto) => {
            const favorito = esFavorito(auto.id);
            return (
              <div
                key={auto.id}
                className="bg-zinc-800 rounded-xl overflow-hidden shadow-lg border border-zinc-700 flex flex-col justify-between hover:border-green-400/50 transition-all group"
              >
                <div className="relative">
                  <Link to={`/vehiculos/${auto.id}`}>
                    {auto.url_image ? (
                      <img
                        src={auto.url_image}
                        alt={auto.nombre}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80";
                        }}
                      />
                    ) : (
                      <div className="w-full h-48 bg-zinc-900 flex items-center justify-center text-4xl">
                        🚘
                      </div>
                    )}
                  </Link>

                  {/* Botón de Favoritos en la tarjeta */}
                  <button
                    onClick={() => toggleFavorito(auto)}
                    className="absolute top-3 right-3 bg-zinc-900/80 hover:bg-zinc-900 backdrop-blur-sm p-2 rounded-full cursor-pointer transition-colors shadow"
                    title={favorito ? "Quitar de favoritos" : "Añadir a favoritos"}
                  >
                    <span className="text-base">{favorito ? "❤️" : "🤍"}</span>
                  </button>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex gap-2 text-xs font-semibold text-zinc-400 uppercase tracking-wide">
                      <span>{obtenerNombreMarca(auto.marca_id)}</span>
                      <span>•</span>
                      <span>{obtenerNombreTipo(auto.tipo_vehiculo_id)}</span>
                    </div>

                    <Link to={`/vehiculos/${auto.id}`}>
                      <h2 className="text-xl font-bold text-white hover:text-green-400 transition-colors mt-1">
                        {auto.nombre}
                      </h2>
                    </Link>

                    {auto.modelo && (
                      <p className="text-xs text-zinc-400 mt-1">Modelo {auto.modelo}</p>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-700/60 flex items-center justify-between">
                    <p className="text-green-400 font-extrabold text-xl">
                      ${Number(auto.precio).toLocaleString("es-AR")}
                    </p>

                    <Link
                      to={`/vehiculos/${auto.id}`}
                      className="text-xs font-bold text-zinc-300 hover:text-white bg-zinc-700 hover:bg-green-600 hover:text-zinc-950 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Ver detalle →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}