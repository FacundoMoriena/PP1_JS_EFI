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

  // Estados de filtros
  const [busqueda, setBusqueda] = useState("");
  const [marcaFiltro, setMarcaFiltro] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState(tipoParam);
  const [modeloFiltro, setModeloFiltro] = useState("");

  const { esFavorito, toggleFavorito } = useContext(FavoritosContext);
  const { isDark } = useContext(ThemeContext);

  const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

  // Sincronizar parámetro de URL con estado
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
        setError("No fue posible establecer conexión con el servidor de datos.");
        setLoading(false);
      });
  }, [API_URL]);

  const obtenerNombreMarca = (id) =>
    marcas.find((m) => m.id === id)?.nombre || "General";

  const obtenerNombreTipo = (id) =>
    tiposVehiculos.find((t) => t.id === id)?.nombre || "Vehículo";

  const aniosDisponibles = Array.from(
    new Set(vehiculos.map((v) => v.modelo).filter(Boolean))
  ).sort((a, b) => b - a);

  // Filtro reactivo múltiple
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
      <div className="py-32 text-center">
        <div className="inline-block animate-spin rounded-full h-10 w-10 border-2 border-blue-500 border-t-transparent mb-4"></div>
        <p className="text-sm font-medium tracking-wide uppercase text-zinc-500">
          Cargando inventario automotriz...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`max-w-md mx-auto my-16 p-8 rounded-2xl border text-center ${
          isDark
            ? "bg-zinc-900 border-red-900/40 text-zinc-300"
            : "bg-white border-red-200 text-slate-700 shadow-lg"
        }`}
      >
        <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold mb-2">Error de Sincronización</h3>
        <p className="text-xs text-zinc-500 mb-6 leading-relaxed">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
        >
          Reintentar conexión
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Cabecera y Contador */}
      <div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-6 border-zinc-800">
          <div>
            <span className="text-[11px] font-bold tracking-widest uppercase text-blue-500">
              Inventario Disponible
            </span>
            <h1
              className={`text-3xl font-black tracking-tight mt-1 ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              Catálogo de Unidades
            </h1>
            <p
              className={`text-xs mt-1 ${
                isDark ? "text-zinc-400" : "text-slate-500"
              }`}
            >
              Exhibiendo {vehiculosFiltrados.length} de {vehiculos.length} vehículos verificados
            </p>
          </div>

          {(busqueda || marcaFiltro || tipoFiltro || modeloFiltro) && (
            <button
              onClick={limpiarFiltros}
              className="text-xs font-semibold text-blue-500 hover:text-blue-400 cursor-pointer flex items-center gap-1.5 uppercase tracking-wider"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Restablecer Filtros</span>
            </button>
          )}
        </div>

        {/* Barra de Filtros Profesional */}
        <div
          className={`p-4 rounded-2xl border grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-6 ${
            isDark
              ? "bg-zinc-900/90 border-zinc-800"
              : "bg-white border-slate-200 shadow-sm"
          }`}
        >
          {/* Búsqueda por Nombre */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5">
              Búsqueda por Modelo
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Ej: Corolla, Ranger..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className={`w-full pl-9 pr-3 py-2 rounded-lg text-xs font-medium border focus:outline-none focus:border-blue-500 ${
                  isDark
                    ? "bg-zinc-950 border-zinc-800 text-white placeholder-zinc-600"
                    : "bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400"
                }`}
              />
              <svg
                className="w-4 h-4 absolute left-3 top-2.5 text-zinc-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Filtro por Categoría */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5">
              Categoría
            </label>
            <select
              value={tipoFiltro}
              onChange={(e) => {
                setTipoFiltro(e.target.value);
                setSearchParams(e.target.value ? { tipo: e.target.value } : {});
              }}
              className={`w-full px-3 py-2 rounded-lg text-xs font-medium border focus:outline-none focus:border-blue-500 cursor-pointer ${
                isDark
                  ? "bg-zinc-950 border-zinc-800 text-white"
                  : "bg-slate-50 border-slate-300 text-slate-900"
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

          {/* Filtro por Marca */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5">
              Fabricante / Marca
            </label>
            <select
              value={marcaFiltro}
              onChange={(e) => setMarcaFiltro(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg text-xs font-medium border focus:outline-none focus:border-blue-500 cursor-pointer ${
                isDark
                  ? "bg-zinc-950 border-zinc-800 text-white"
                  : "bg-slate-50 border-slate-300 text-slate-900"
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

          {/* Filtro por Año */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5">
              Año de Fabricación
            </label>
            <select
              value={modeloFiltro}
              onChange={(e) => setModeloFiltro(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg text-xs font-medium border focus:outline-none focus:border-blue-500 cursor-pointer ${
                isDark
                  ? "bg-zinc-950 border-zinc-800 text-white"
                  : "bg-slate-50 border-slate-300 text-slate-900"
              }`}
            >
              <option value="">Todos los años</option>
              {aniosDisponibles.map((anio) => (
                <option key={anio} value={anio}>
                  Modelo {anio}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid de Vehículos */}
      {vehiculosFiltrados.length === 0 ? (
        <div
          className={`text-center py-24 rounded-2xl border p-8 ${
            isDark
              ? "bg-zinc-900/50 border-zinc-800"
              : "bg-white border-slate-200"
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mx-auto mb-4 text-zinc-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3
            className={`text-base font-bold ${
              isDark ? "text-white" : "text-slate-800"
            }`}
          >
            No se hallaron vehículos coincidentes
          </h3>
          <p className="text-xs text-zinc-500 mt-1 mb-6 max-w-sm mx-auto">
            Ajustá los parámetros del filtro o restablecé la búsqueda para ver todas las unidades.
          </p>
          <button
            onClick={limpiarFiltros}
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg text-xs uppercase tracking-wider transition-colors cursor-pointer"
          >
            Ver Todas las Unidades
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehiculosFiltrados.map((auto) => {
            const favorito = esFavorito(auto.id);
            return (
              <div
                key={auto.id}
                className={`rounded-2xl overflow-hidden border flex flex-col justify-between transition-all duration-300 group ${
                  isDark
                    ? "bg-zinc-900 border-zinc-800 hover:border-zinc-700 hover:shadow-xl hover:shadow-black/40"
                    : "bg-white border-slate-200 hover:border-blue-400 hover:shadow-lg"
                }`}
              >
                {/* Imagen y Botón Favorito */}
                <div className="relative overflow-hidden aspect-video bg-zinc-950 flex items-center justify-center">
                  <Link to={`/vehiculos/${auto.id}`} className="w-full h-full block">
                    {auto.url_image ? (
                      <img
                        src={auto.url_image}
                        alt={auto.nombre}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-700">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 19H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                    )}
                  </Link>

                  {/* Estado Uso Badge */}
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-white border border-white/10">
                    {auto.estado_uso || "Certificado"}
                  </span>

                  {/* Botón Guardar Favorito (SVG Heart) */}
                  <button
                    onClick={() => toggleFavorito(auto)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md transition-all cursor-pointer"
                    title={favorito ? "Quitar de favoritos" : "Guardar en favoritos"}
                  >
                    <svg
                      className={`w-4 h-4 transition-colors ${
                        favorito ? "fill-rose-500 text-rose-500" : "text-white"
                      }`}
                      fill={favorito ? "currentColor" : "none"}
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </button>
                </div>

                {/* Detalles de la Tarjeta */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                      <span>{obtenerNombreMarca(auto.marca_id)}</span>
                      <span>•</span>
                      <span>{obtenerNombreTipo(auto.tipo_vehiculo_id)}</span>
                      {auto.modelo && (
                        <>
                          <span>•</span>
                          <span>{auto.modelo}</span>
                        </>
                      )}
                    </div>

                    <Link to={`/vehiculos/${auto.id}`}>
                      <h2
                        className={`text-lg font-bold mt-1.5 transition-colors group-hover:text-blue-500 ${
                          isDark ? "text-white" : "text-slate-900"
                        }`}
                      >
                        {auto.nombre}
                      </h2>
                    </Link>

                    {auto.descripcion && (
                      <p className="text-xs text-zinc-500 line-clamp-2 mt-1">
                        {auto.descripcion}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 block">
                        Precio Oficial
                      </span>
                      <p className="text-xl font-black text-blue-500">
                        USD ${Number(auto.precio).toLocaleString("en-US")}
                      </p>
                    </div>

                    <Link
                      to={`/vehiculos/${auto.id}`}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors border ${
                        isDark
                          ? "bg-zinc-800 hover:bg-blue-600 hover:text-white border-zinc-700/80 text-zinc-300"
                          : "bg-slate-100 hover:bg-blue-600 hover:text-white border-slate-200 text-slate-800"
                      }`}
                    >
                      Ficha →
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
