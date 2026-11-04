import { useState, useEffect, useContext } from "react";
import { Outlet, useParams, Link, NavLink } from "react-router-dom";
import { FavoritosContext } from "../context/FavoritosContext";

export default function VehiculoDetalle() {
  const { id } = useParams();
  const [vehiculo, setVehiculo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { esFavorito, toggleFavorito } = useContext(FavoritosContext);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`${API_URL}/vehiculos/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Vehículo no encontrado (código ${res.status})`);
        }
        return res.json();
      })
      .then((data) => {
        setVehiculo(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al obtener el vehículo:", err);
        setError(err.message || "Error al conectar con la API");
        setLoading(false);
      });
  }, [id, API_URL]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-400 border-t-transparent mb-4"></div>
        <p className="text-xl text-zinc-300">Cargando detalles del vehículo #{id}...</p>
      </div>
    );
  }

  if (error || !vehiculo) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center bg-zinc-800/80 rounded-xl p-8 border border-red-800/40">
        <p className="text-4xl mb-3">🚗💨</p>
        <h2 className="text-2xl font-bold text-red-400 mb-2">No pudimos cargar este vehículo</h2>
        <p className="text-zinc-400 mb-6">{error || "El vehículo solicitado no existe en la base de datos."}</p>
        <Link
          to="/vehiculos"
          className="bg-green-500 hover:bg-green-600 text-zinc-950 font-bold px-6 py-2.5 rounded-lg inline-block transition-colors"
        >
          ← Volver al Catálogo
        </Link>
      </div>
    );
  }

  const favorito = esFavorito(vehiculo.id);

  return (
    <div className="max-w-4xl mx-auto pt-4 px-2 w-full">
      <Link
        to="/vehiculos"
        className="text-sm text-green-400 hover:text-green-300 flex items-center gap-1 font-medium mb-4 w-fit"
      >
        ← Volver a vehículos
      </Link>

      {/* Tarjeta Principal */}
      <div className="bg-zinc-800 rounded-xl overflow-hidden border border-zinc-700 shadow-xl flex flex-col md:flex-row">
        <div className="md:w-1/2 bg-zinc-900 flex items-center justify-center p-2">
          {vehiculo.url_image ? (
            <img
              src={vehiculo.url_image}
              alt={vehiculo.nombre}
              className="w-full h-72 md:h-full max-h-80 object-cover rounded-lg"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80";
              }}
            />
          ) : (
            <div className="w-full h-64 flex flex-col items-center justify-center text-zinc-500 bg-zinc-900">
              <span className="text-5xl mb-2">🚘</span>
              <span>Sin fotografía cargada</span>
            </div>
          )}
        </div>

        <div className="p-6 md:w-1/2 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start gap-4">
              <span className="text-xs uppercase font-bold tracking-widest px-2.5 py-1 rounded bg-zinc-700 text-zinc-300">
                ID #{vehiculo.id}
              </span>
              <button
                onClick={() => toggleFavorito(vehiculo)}
                className={`cursor-pointer px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-all ${
                  favorito
                    ? "bg-rose-600/30 text-rose-300 border border-rose-500"
                    : "bg-zinc-700 hover:bg-zinc-600 text-zinc-200"
                }`}
                title={favorito ? "Quitar de favoritos" : "Guardar en favoritos"}
              >
                <span>{favorito ? "❤️" : "🤍"}</span>
                <span>{favorito ? "Guardado" : "Favorito"}</span>
              </button>
            </div>

            <h1 className="text-3xl font-extrabold text-white mt-3">
              {vehiculo.nombre}
            </h1>

            <p className="text-3xl font-black text-green-400 mt-2">
              ${Number(vehiculo.precio).toLocaleString("es-AR")}
            </p>

            <div className="mt-4 space-y-1.5 text-sm text-zinc-300">
              <p>
                <strong className="text-zinc-400">Año / Modelo:</strong> {vehiculo.modelo || "2024"}
              </p>
              <p>
                <strong className="text-zinc-400">Stock disponible:</strong> {vehiculo.stock} unidades
              </p>
              <p>
                <strong className="text-zinc-400">Condición:</strong>{" "}
                <span className="capitalize">{vehiculo.estado_uso || "Usado Certificado"}</span>
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-zinc-700/60 mt-6">
            <span className="text-xs text-zinc-400 block mb-1">
              Garantía oficial y transferencia inmediata incluida.
            </span>
          </div>
        </div>
      </div>

      {/* Subrutas anidadas (Ruta anidada con Outlet según Valentino) */}
      <div className="mt-8">
        <div className="flex gap-4 border-b border-zinc-700">
          <NavLink
            to=""
            end
            className={({ isActive }) =>
              `pb-2.5 font-semibold text-sm border-b-2 transition-colors cursor-pointer ${
                isActive
                  ? "border-green-400 text-green-400"
                  : "border-transparent text-zinc-400 hover:text-zinc-200"
              }`
            }
          >
            📋 Ficha Técnica y Estado
          </NavLink>

          <NavLink
            to="fabricante"
            className={({ isActive }) =>
              `pb-2.5 font-semibold text-sm border-b-2 transition-colors cursor-pointer ${
                isActive
                  ? "border-green-400 text-green-400"
                  : "border-transparent text-zinc-400 hover:text-zinc-200"
              }`
            }
          >
            🏭 Fabricante y Marca
          </NavLink>
        </div>

        {/* Outlet inyecta el componente anidado pasándole el vehículo */}
        <Outlet context={vehiculo} />
      </div>
    </div>
  );
}
