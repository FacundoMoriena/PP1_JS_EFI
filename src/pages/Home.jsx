import { useContext } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";

export default function Home() {
  const { isDark } = useContext(ThemeContext);

  return (
    <div className="max-w-5xl mx-auto space-y-12 py-4">
      {/* Sección Hero */}
      <section
        className={`rounded-3xl p-8 sm:p-12 text-center shadow-2xl relative overflow-hidden transition-colors border ${
          isDark
            ? "bg-gradient-to-br from-zinc-800 via-zinc-850 to-zinc-900 border-zinc-700/80"
            : "bg-gradient-to-br from-white via-zinc-50 to-zinc-100 border-zinc-200 text-zinc-900"
        }`}
      >
        <span className="inline-block px-3.5 py-1 text-xs font-semibold bg-green-500/20 text-green-500 rounded-full border border-green-500/30 mb-4">
          Concesionaria Multimarca Oficial
        </span>

        <h1
          className={`text-4xl sm:text-5xl font-black tracking-tight leading-tight ${
            isDark ? "text-white" : "text-zinc-900"
          }`}
        >
          Encontrá el Vehículo que Buscás
        </h1>

        <p
          className={`text-base sm:text-lg max-w-2xl mx-auto mt-4 leading-relaxed ${
            isDark ? "text-zinc-300" : "text-zinc-600"
          }`}
        >
          Descubrí las mejores unidades 0km y usados certificados con garantía oficial.
          Filtrá por categoría, marca o modelo y reservá tus favoritos.
        </p>

        {/* Botón principal al catálogo completo */}
        <div className="mt-8">
          <Link
            to="/vehiculos"
            className="bg-green-400 hover:bg-green-500 text-zinc-950 font-extrabold px-8 py-3.5 rounded-xl transition-all shadow-lg hover:shadow-green-500/25 inline-flex items-center gap-2 cursor-pointer text-base"
          >
            <span>🚗</span>
            <span>Ver Catálogo Completo</span>
            <span>→</span>
          </Link>
        </div>
      </section>

      {/* Las 2 Cards de Categorías Principales (Autos y Motos) */}
      <section>
        <div className="text-center mb-6">
          <h2
            className={`text-2xl font-bold ${
              isDark ? "text-white" : "text-zinc-900"
            }`}
          >
            Explorar por Categoría
          </h2>
          <p
            className={`text-sm mt-1 ${
              isDark ? "text-zinc-400" : "text-zinc-500"
            }`}
          >
            Seleccioná la categoría que más te interese para ir directamente al catálogo filtrado.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: Autos */}
          <Link
            to="/vehiculos?tipo=1"
            className={`group rounded-2xl p-6 sm:p-8 border transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl flex flex-col justify-between ${
              isDark
                ? "bg-zinc-800/80 hover:bg-zinc-800 border-zinc-700 hover:border-green-400"
                : "bg-white hover:bg-zinc-50 border-zinc-200 hover:border-green-500 shadow-md"
            }`}
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
                🚘
              </div>
              <h3
                className={`text-2xl font-extrabold ${
                  isDark ? "text-white" : "text-zinc-900"
                }`}
              >
                Autos y Camionetas
              </h3>
              <p
                className={`text-sm mt-2 leading-relaxed ${
                  isDark ? "text-zinc-400" : "text-zinc-600"
                }`}
              >
                Sedanes, hatchbacks, SUVs y pickups. Modelos 0km y usados garantizados de las mejores marcas como Toyota, Audi, Ford y Ferrari.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-700/40 flex items-center justify-between text-green-500 font-bold text-sm">
              <span>Explorar catálogo de autos</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>

          {/* Card 2: Motos */}
          <Link
            to="/vehiculos?tipo=2"
            className={`group rounded-2xl p-6 sm:p-8 border transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl flex flex-col justify-between ${
              isDark
                ? "bg-zinc-800/80 hover:bg-zinc-800 border-zinc-700 hover:border-green-400"
                : "bg-white hover:bg-zinc-50 border-zinc-200 hover:border-green-500 shadow-md"
            }`}
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
                🏍️
              </div>
              <h3
                className={`text-2xl font-extrabold ${
                  isDark ? "text-white" : "text-zinc-900"
                }`}
              >
                Motos y Scooters
              </h3>
              <p
                className={`text-sm mt-2 leading-relaxed ${
                  isDark ? "text-zinc-400" : "text-zinc-600"
                }`}
              >
                Deportivas, urbanas y touring de marcas líderes como Yamaha y Honda. Máxima agilidad y rendimiento garantizado.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-700/40 flex items-center justify-between text-green-500 font-bold text-sm">
              <span>Explorar catálogo de motos</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}