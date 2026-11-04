import { useEffect, useState, useContext } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FavoritosContext } from "../context/FavoritosContext";
import { ThemeContext } from "../context/ThemeContext";

export default function Vehiculos() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tipoParam = searchParams.get("tipo") || "";

  const [vehiculos, setVehiculos] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [tiposVehiculos, setTiposVehiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para filtros
  const [busqueda, setBusqueda] = useState("");
  const [marcaFiltro, setMarcaFiltro] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState(tipoParam);
  const [modeloFiltro, setModeloFiltro] = useState("");

  const { esFavorito, toggleFavorito } = useContext(FavoritosContext);
  const { isDark } = useContext(ThemeContext);

  const API_URL = import.meta.env.VITE_API_URL;

  // Si cambia el parámetro en la URL (?tipo=1), sincronizar el filtro
  useEffect(() => {
    if (tipoParam !== tipoFiltro) {
      setTipoFiltro(tipoParam);
    }
  }, [tipoParam]);

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
        setError("No pudimos conectar con el servidor local o remoto.");
        setLoading(false);
      });
  }, [API_URL]);

  const obtenerNombreMarca = (id) =>
    marcas.find((m) => m.id === id)?.nombre || "Marca general";

  const obtenerNombreTipo = (id) =>
    tiposVehiculos.find((t) => t.id === id)?.nombre || "General";

  // Lista única de años/modelos disponibles para el selector
  const aniosDisponibles = Array.from(
    new Set(vehiculos.map((v) => v.modelo).filter(Boolean))
  ).sort((a, b) => b - a);

  // Filtrado reactivo en base a todos los criterios
  const vehiculosFiltrados = vehiculos.filter((auto) => {
    const coincideNombre = auto.nombre
      ?.toLowerCase()
      .includes(busqueda.toLowerCase());
    const coincideMarca =
      marcaFiltro === "" || String(auto.marca_id) === String(marcaFiltro);
    const coincideTipo =
      tipoFiltro === "" || String(auto.tipo_vehiculo_id) === String(tipoFiltro);
    const coincideModelo =
      modeloFiltro === "" || String(auto.modelo) === String(modeloFiltro);

    return coincideNombre && coincideMarca && coincideTipo && coincideModelo;
  });

  const limpiarFiltros = () => {
    setBusqueda("");
    setMarcaFiltro("");
    setTipoFiltro("");
    setModeloFiltro("");
    setSearchParams({});
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-400 border-t-transparent mb-4"></div>
        <p className="text-xl text-zinc-400">Cargando catálogo de vehículos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 bg-red-950/40 border border-red-800 rounded-xl text-center">
        <p className="text-3xl mb-2">⚠️</p>
        <p className="text-red-400 font-semibold mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium cursor-pointer"
        >
          Reintentar conexión
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Encabezado y Filtros */}
      <div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1
              className={`text-3xl font-black ${
                isDark ? "text-white" : "text-zinc-900"
              }`}
            >
              Catálogo de Vehículos
            </h1>
            <p
              className={`text-sm mt-1 ${
                isDark ? "text-zinc-400" : "text-zinc-600"
              }`}
            >
              Mostrando {vehiculosFiltrados.length} de {vehiculos.length} unidades disponibles
            </p>
          </div>

          {(busqueda || marcaFiltro || tipoFiltro || modeloFiltro) && (
            <button
              onClick={limpiarFiltros}
              className="text-xs text-rose-400 hover:underline cursor-pointer flex items-center gap-1 font-semibold"
            >
              <span>✕</span> Limpiar todos los filtros
            </button>
          )}
        </div>

        {/* Barra Modular de Filtros (Nombre, Tipo, Marca, Modelo) */}
        <div
          className={`p-4 rounded-2xl border grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 ${
            isDark
              ? "bg-zinc-800/80 border-zinc-700"
              : "bg-white border-zinc-200 shadow-sm"
          }`}
        >
          {/* 1. Búsqueda por Nombre */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
              Nombre / Modelo
            </label>
            <input
              type="text"
              placeholder="Buscar vehículo..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg text-sm border focus:outline-none focus:border-green-400 ${
                isDark
                  ? "bg-zinc-900 border-zinc-700 text-white"
                  : "bg-zinc-50 border-zinc-300 text-zinc-900"
              }`}
            />
          </div>

          {/* 2. Filtro por Tipo de Vehículo */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
              Categoría
            </label>
            <select
              value={tipoFiltro}
              onChange={(e) => {
                setTipoFiltro(e.target.value);
                setSearchParams(e.target.value ? { tipo: e.target.value } : {});
              }}
              className={`w-full px-3 py-2 rounded-lg text-sm border focus:outline-none focus:border-green-400 cursor-pointer ${
                isDark
                  ? "bg-zinc-900 border-zinc-700 text-white"
                  : "bg-zinc-50 border-zinc-300 text-zinc-900"
              }`}
            >
              <option value="">Todas las categorías</option>
              {tiposVehiculos.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Filtro por Marca */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
              Marca
            </label>
            <select
              value={marcaFiltro}
              onChange={(e) => setMarcaFiltro(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg text-sm border focus:outline-none focus:border-green-400 cursor-pointer ${
                isDark
                  ? "bg-zinc-900 border-zinc-700 text-white"
                  : "bg-zinc-50 border-zinc-300 text-zinc-900"
              }`}
            >
              <option value="">Todas las marcas</option>
              {marcas.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Filtro por Año / Modelo */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
              Año del Modelo
            </label>
            <select
              value={modeloFiltro}
              onChange={(e) => setModeloFiltro(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg text-sm border focus:outline-none focus:border-green-400 cursor-pointer ${
                isDark
                  ? "bg-zinc-900 border-zinc-700 text-white"
                  : "bg-zinc-50 border-zinc-300 text-zinc-900"
              }`}
            >
              <option value="">Todos los años</option>
              {aniosDisponibles.map((anio) => (
                <option key={anio} value={anio}>
                  Año {anio}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid de Vehículos */}
      {vehiculosFiltrados.length === 0 ? (
        <div
          className={`text-center py-20 rounded-2xl border p-8 ${
            isDark
              ? "bg-zinc-800/40 border-zinc-700/60"
              : "bg-white border-zinc-200"
          }`}
        >
          <p className="text-5xl mb-3">🔎</p>
          <h3
            className={`text-xl font-bold ${
              isDark ? "text-zinc-200" : "text-zinc-800"
            }`}
          >
            No encontramos vehículos con esos filtros
          </h3>
          <p className="text-sm text-zinc-500 mt-1 mb-6">
            Intenta seleccionar otra categoría, marca o limpiar la búsqueda.
          </p>
          <button
            onClick={limpiarFiltros}
            className="bg-green-400 hover:bg-green-500 text-zinc-950 font-bold px-5 py-2 rounded-xl text-sm transition-colors cursor-pointer"
          >
            Restablecer Filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehiculosFiltrados.map((auto) => {
            const favorito = esFavorito(auto.id);
            return (
              <div
                key={auto.id}
                className={`rounded-2xl overflow-hidden shadow-lg border flex flex-col justify-between transition-all duration-300 hover:border-green-400/60 group ${
                  isDark
                    ? "bg-zinc-800 border-zinc-700"
                    : "bg-white border-zinc-200"
                }`}
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
                      <div className="w-full h-48 bg-zinc-900 flex items-center justify-center text-5xl">
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

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex gap-2 text-xs font-bold text-zinc-400 uppercase tracking-wide">
                      <span>{obtenerNombreMarca(auto.marca_id)}</span>
                      <span>•</span>
                      <span>{obtenerNombreTipo(auto.tipo_vehiculo_id)}</span>
                    </div>

                    <Link to={`/vehiculos/${auto.id}`}>
                      <h2
                        className={`text-xl font-extrabold mt-1 group-hover:text-green-500 transition-colors ${
                          isDark ? "text-white" : "text-zinc-900"
                        }`}
                      >
                        {auto.nombre}
                      </h2>
                    </Link>

                    {auto.modelo && (
                      <p className="text-xs text-zinc-400 mt-1">
                        Año {auto.modelo} •{" "}
                        <span className="capitalize">{auto.estado_uso || "Usado"}</span>
                      </p>
                    )}
                  </div>

                  <div className="mt-5 pt-3 border-t border-zinc-700/40 flex items-center justify-between">
                    <p className="text-green-500 font-black text-2xl">
                      ${Number(auto.precio).toLocaleString("es-AR")}
                    </p>

                    <Link
                      to={`/vehiculos/${auto.id}`}
                      className={`text-xs font-bold px-3.5 py-2 rounded-xl transition-colors ${
                        isDark
                          ? "bg-zinc-700 hover:bg-green-500 hover:text-zinc-950 text-white"
                          : "bg-zinc-100 hover:bg-green-500 hover:text-white text-zinc-800"
                      }`}
                    >
                      Ver Detalle →
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