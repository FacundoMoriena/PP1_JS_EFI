import { useContext } from "react";
import { Link } from "react-router-dom";
import { FavoritosContext } from "../context/FavoritosContext";
import { ThemeContext } from "../context/ThemeContext";

export default function Favoritos() {
  const { favoritos, removerFavorito, limpiarFavoritos, totalFavoritos } =
    useContext(FavoritosContext);
  const { isDark } = useContext(ThemeContext);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b pb-6 border-zinc-800">
        <div>
          <span className="text-[11px] font-bold tracking-widest uppercase text-blue-500">
            Seguimiento de Unidades
          </span>
          <h1
            className={`text-3xl font-black tracking-tight mt-1 ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Vehículos Guardados
          </h1>
          <p
            className={`text-xs mt-1 ${
              isDark ? "text-zinc-400" : "text-slate-500"
            }`}
          >
            Colección personal de unidades seleccionadas para consulta y cotización.
          </p>
        </div>

        {totalFavoritos > 0 && (
          <button
            onClick={limpiarFavoritos}
            className="text-xs font-semibold text-rose-500 hover:text-rose-400 border border-rose-500/20 hover:border-rose-500/40 px-3 py-1.5 rounded-lg transition-all cursor-pointer uppercase tracking-wider"
          >
            Vaciar Lista ({totalFavoritos})
          </button>
        )}
      </div>

      {totalFavoritos === 0 ? (
        <div
          className={`text-center py-28 rounded-2xl border p-8 ${
            isDark
              ? "bg-zinc-900/50 border-zinc-800 text-zinc-300"
              : "bg-white border-slate-200 text-slate-800 shadow-sm"
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mx-auto mb-4 text-zinc-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h3 className="text-base font-bold mb-1">Tu lista está vacía</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto mb-6">
            Recorré el catálogo de Alboriena Motors y guardá las unidades de tu preferencia para compararlas aquí.
          </p>
          <Link
            to="/vehiculos"
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-2.5 rounded-lg inline-block text-xs uppercase tracking-wider transition-colors"
          >
            Explorar Catálogo →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoritos.map((auto) => (
            <div
              key={auto.id}
              className={`rounded-2xl overflow-hidden border flex flex-col justify-between transition-all group ${
                isDark
                  ? "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
                  : "bg-white border-slate-200 shadow-sm"
              }`}
            >
              <div className="relative aspect-video bg-zinc-950 flex items-center justify-center">
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
                    <div className="text-zinc-700">
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 19H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  )}
                </Link>

                {/* Botón Quitar */}
                <button
                  onClick={() => removerFavorito(auto.id)}
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-black/70 hover:bg-rose-600 text-white transition-colors cursor-pointer"
                  title="Quitar de la lista"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3
                    className={`font-bold text-base mt-1 ${
                      isDark ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {auto.nombre}
                  </h3>
                  {auto.modelo && (
                    <p className="text-xs text-zinc-500 mt-0.5">Modelo {auto.modelo}</p>
                  )}
                  <p className="text-lg font-black text-blue-500 mt-2">
                    USD ${Number(auto.precio).toLocaleString("en-US")}
                  </p>
                </div>

                <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-xs">
                  <Link
                    to={`/vehiculos/${auto.id}`}
                    className="font-semibold text-blue-500 hover:text-blue-400 uppercase tracking-wider text-[11px]"
                  >
                    Ver Ficha Completa →
                  </Link>
                  <button
                    onClick={() => removerFavorito(auto.id)}
                    className="text-zinc-500 hover:text-rose-500 cursor-pointer text-[11px]"
                  >
                    Remover
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
