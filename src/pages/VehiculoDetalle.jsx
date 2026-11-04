import { useState, useEffect, useContext } from "react";
import { Outlet, useParams, Link, NavLink } from "react-router-dom";
import { FavoritosContext } from "../context/FavoritosContext";
import { ThemeContext } from "../context/ThemeContext";

export default function VehiculoDetalle() {
  const { id } = useParams();
  const [vehiculo, setVehiculo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { esFavorito, toggleFavorito } = useContext(FavoritosContext);
  const { isDark } = useContext(ThemeContext);

  const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`${API_URL}/vehiculos/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Unidad no localizada (código ${res.status})`);
        }
        return res.json();
      })
      .then((data) => {
        setVehiculo(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al obtener la unidad:", err);
        setError(err.message || "Error al sincronizar con el backend");
        setLoading(false);
      });
  }, [id, API_URL]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-32 text-center">
        <div className="inline-block animate-spin rounded-full h-10 w-10 border-2 border-blue-500 border-t-transparent mb-4"></div>
        <p className="text-xs font-semibold tracking-widest uppercase text-zinc-500">
          Cargando especificaciones de la unidad #{id}...
        </p>
      </div>
    );
  }

  if (error || !vehiculo) {
    return (
      <div
        className={`max-w-xl mx-auto my-20 p-8 rounded-2xl border text-center ${
          isDark
            ? "bg-zinc-900 border-zinc-800 text-zinc-300"
            : "bg-white border-slate-200 text-slate-800 shadow-lg"
        }`}
      >
        <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-lg font-bold mb-2">Unidad No Disponible</h2>
        <p className="text-xs text-zinc-500 mb-6">{error || "El vehículo consultado no existe en la base de datos."}</p>
        <Link
          to="/vehiculos"
          className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-2.5 rounded-lg inline-block text-xs uppercase tracking-wider transition-colors"
        >
          ← Regresar al Catálogo
        </Link>
      </div>
    );
  }

  const favorito = esFavorito(vehiculo.id);

  return (
    <div className="max-w-5xl mx-auto pt-2 w-full space-y-8">
      {/* Breadcrumb de navegación */}
      <nav className="flex items-center gap-2 text-xs font-medium text-zinc-500 uppercase tracking-wider">
        <Link to="/" className="hover:text-blue-500">Inicio</Link>
        <span>/</span>
        <Link to="/vehiculos" className="hover:text-blue-500">Catálogo</Link>
        <span>/</span>
        <span className={isDark ? "text-zinc-300" : "text-slate-800"}>{vehiculo.nombre}</span>
      </nav>

      {/* Ficha Principal de Presentación */}
      <div
        className={`rounded-2xl overflow-hidden border flex flex-col md:flex-row shadow-xl ${
          isDark
            ? "bg-zinc-900 border-zinc-800"
            : "bg-white border-slate-200"
        }`}
      >
        {/* Imagen del Vehículo */}
        <div className="md:w-1/2 bg-zinc-950 flex items-center justify-center relative min-h-72">
          {vehiculo.url_image ? (
            <img
              src={vehiculo.url_image}
              alt={vehiculo.nombre}
              className="w-full h-full object-cover max-h-96"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80";
              }}
            />
          ) : (
            <div className="text-zinc-700 flex flex-col items-center">
              <svg className="w-16 h-16 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 19H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2z" />
              </svg>
              <span className="text-xs uppercase tracking-widest text-zinc-600">Sin Fotografía</span>
            </div>
          )}

          <span className="absolute top-4 left-4 px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-black/70 backdrop-blur-md text-white border border-white/10">
            {vehiculo.estado_uso || "Certificado"}
          </span>
        </div>

        {/* Datos Principales */}
        <div className="p-8 md:w-1/2 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex justify-between items-start gap-4">
              <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                REF #{vehiculo.id}
              </span>

              {/* Botón Guardar Favorito */}
              <button
                onClick={() => toggleFavorito(vehiculo)}
                className={`cursor-pointer px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                  favorito
                    ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                    : isDark
                    ? "bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700"
                    : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                }`}
              >
                <svg
                  className={`w-3.5 h-3.5 ${favorito ? "fill-rose-500" : ""}`}
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
                <span>{favorito ? "En Favoritos" : "Guardar"}</span>
              </button>
            </div>

            <h1
              className={`text-3xl font-black tracking-tight mt-3 ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              {vehiculo.nombre}
            </h1>

            <div className="mt-3">
              <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 block">
                Valor de Plaza
              </span>
              <p className="text-3xl font-black text-blue-500 mt-0.5">
                USD ${Number(vehiculo.precio).toLocaleString("en-US")}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-zinc-800 text-xs">
              <div>
                <span className="text-zinc-500 block uppercase text-[10px] font-bold">Año Modelo</span>
                <span className="font-semibold text-zinc-200">{vehiculo.modelo || "2024"}</span>
              </div>
              <div>
                <span className="text-zinc-500 block uppercase text-[10px] font-bold">Stock Físico</span>
                <span className="font-semibold text-zinc-200">{vehiculo.stock} unidades</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800 text-xs text-zinc-500">
            Unidad inspeccionada por Alboriena Motors. Documentación lista para transferencia.
          </div>
        </div>
      </div>

      {/* Subrutas Anidadas con <Outlet /> (Requisito R1) */}
      <div className="space-y-4">
        <div className="flex gap-4 border-b border-zinc-800">
          <NavLink
            to=""
            end
            className={({ isActive }) =>
              `pb-3 font-semibold text-xs uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                isActive
                  ? "border-blue-500 text-blue-500"
                  : "border-transparent text-zinc-500 hover:text-zinc-300"
              }`
            }
          >
            Ficha Técnica & Estado
          </NavLink>

          <NavLink
            to="fabricante"
            className={({ isActive }) =>
              `pb-3 font-semibold text-xs uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                isActive
                  ? "border-blue-500 text-blue-500"
                  : "border-transparent text-zinc-500 hover:text-zinc-300"
              }`
            }
          >
            Datos de Marca & Clasificación
          </NavLink>
        </div>

        {/* El Outlet inyecta el componente de la subpestaña */}
        <Outlet context={vehiculo} />
      </div>
    </div>
  );
}
