import { useContext } from "react";
import { Link } from "react-router-dom";
import { FavoritosContext } from "../context/FavoritosContext";

export default function Favoritos() {
  const { favoritos, removerFavorito, limpiarFavoritos, totalFavoritos } =
    useContext(FavoritosContext);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Mis Vehículos Favoritos</h1>
          <p className="text-zinc-400 text-sm mt-1">
            Unidades guardadas en tu lista personal para comparar y revisar luego.
          </p>
        </div>

        {totalFavoritos > 0 && (
          <button
            onClick={limpiarFavoritos}
            className="text-xs text-rose-400 hover:text-rose-300 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/50 px-3.5 py-2 rounded-lg cursor-pointer transition-colors"
          >
            Vaciar lista de favoritos ({totalFavoritos})
          </button>
        )}
      </div>

      {totalFavoritos === 0 ? (
        <div className="text-center py-20 bg-zinc-800/40 rounded-2xl border border-zinc-700/60 p-8">
          <p className="text-6xl mb-4">🤍</p>
          <h2 className="text-2xl font-bold text-white mb-2">
            Aún no has guardado favoritos
          </h2>
          <p className="text-zinc-400 text-sm max-w-md mx-auto mb-6">
            Recorre nuestro catálogo y haz clic en el corazón de cualquier vehículo para tenerlo a mano aquí.
          </p>
          <Link
            to="/vehiculos"
            className="bg-green-500 hover:bg-green-600 text-zinc-950 font-bold px-6 py-3 rounded-xl inline-block transition-colors"
          >
            Explorar Catálogo →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoritos.map((auto) => (
            <div
              key={auto.id}
              className="bg-zinc-800 rounded-xl overflow-hidden shadow-lg border border-zinc-700 flex flex-col justify-between"
            >
              <div className="relative">
                <Link to={`/vehiculos/${auto.id}`}>
                  {auto.url_image ? (
                    <img
                      src={auto.url_image}
                      alt={auto.nombre}
                      className="w-full h-48 object-cover hover:opacity-90 transition-opacity"
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

                <button
                  onClick={() => removerFavorito(auto.id)}
                  className="absolute top-3 right-3 bg-rose-600 hover:bg-rose-700 text-white p-2 rounded-full cursor-pointer transition-colors shadow"
                  title="Eliminar de favoritos"
                >
                  ✕
                </button>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white mt-1">
                    {auto.nombre}
                  </h3>
                  {auto.modelo && (
                    <p className="text-xs text-zinc-400 mt-1">Año {auto.modelo}</p>
                  )}
                  <p className="text-green-400 font-extrabold text-xl mt-3">
                    ${Number(auto.precio).toLocaleString("es-AR")}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-700/60 flex items-center justify-between">
                  <Link
                    to={`/vehiculos/${auto.id}`}
                    className="text-xs font-semibold text-green-400 hover:underline"
                  >
                    Ver detalles completos
                  </Link>
                  <button
                    onClick={() => removerFavorito(auto.id)}
                    className="text-xs text-zinc-400 hover:text-rose-400 cursor-pointer"
                  >
                    Quitar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}