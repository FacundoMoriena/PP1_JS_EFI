import { useContext } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";

export default function Home() {
  const { isDark } = useContext(ThemeContext);

  return (
    <div className="max-w-6xl mx-auto space-y-16 py-6">
      {/* Sección Hero Ejecutiva */}
      <section
        className={`relative rounded-3xl p-8 sm:p-14 overflow-hidden border transition-all ${
          isDark
            ? "bg-gradient-to-b from-zinc-900 to-zinc-950 border-zinc-800 shadow-2xl shadow-black/50"
            : "bg-gradient-to-b from-slate-50 to-white border-slate-200 shadow-xl"
        }`}
      >
        {/* Glow de fondo sutil */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-3/4 h-56 bg-blue-600/10 blur-3xl pointer-events-none rounded-full"></div>

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-blue-500/10 text-blue-500 border border-blue-500/20">
            <span>Colección Seleccionada 2024 • Concesionaria Oficial</span>
          </div>

          <h1
            className={`text-4xl sm:text-6xl font-black tracking-tight leading-none ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Excelencia Automotriz al Alcance de tus Manos
          </h1>

          <p
            className={`text-base sm:text-lg leading-relaxed ${
              isDark ? "text-zinc-400" : "text-slate-600"
            }`}
          >
            En <strong>Alboriena Motors</strong> disponemos de un inventario exclusivo
            de vehículos 0km y usados certificados. Inspeccioná fichas técnicas, filtrá por
            categoría o marca y reservá tus unidades preferidas.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/vehiculos"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-7 py-3.5 rounded-xl transition-all shadow-lg shadow-blue-600/25 flex items-center gap-2 text-sm uppercase tracking-wide cursor-pointer"
            >
              <span>Ver Catálogo Completo</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>

            <Link
              to="/favoritos"
              className={`font-semibold px-6 py-3.5 rounded-xl transition-all text-sm uppercase tracking-wide border cursor-pointer ${
                isDark
                  ? "bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-700/80"
                  : "bg-white hover:bg-slate-100 text-slate-700 border-slate-300 shadow-sm"
              }`}
            >
              Unidades Guardadas
            </Link>
          </div>
        </div>
      </section>

      {/* Las 2 Cards de Categorías (Autos y Motos) */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b pb-4 border-zinc-800">
          <div>
            <h2
              className={`text-2xl font-black tracking-tight ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              Segmentos Principales
            </h2>
            <p
              className={`text-sm mt-0.5 ${
                isDark ? "text-zinc-400" : "text-slate-500"
              }`}
            >
              Seleccioná un segmento para explorar el inventario filtrado automáticamente.
            </p>
          </div>

          <Link
            to="/vehiculos"
            className="text-xs font-semibold text-blue-500 hover:text-blue-400 flex items-center gap-1 uppercase tracking-wider"
          >
            <span>Ver todo el stock</span>
            <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: Automóviles */}
          <Link
            to="/vehiculos?tipo=1"
            className={`group rounded-2xl p-8 border transition-all duration-300 hover:scale-[1.01] hover:shadow-xl flex flex-col justify-between ${
              isDark
                ? "bg-zinc-900/80 hover:bg-zinc-900 border-zinc-800 hover:border-blue-500/60"
                : "bg-white hover:bg-slate-50 border-slate-200 hover:border-blue-400 shadow-md"
            }`}
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                </svg>
              </div>

              <h3
                className={`text-2xl font-bold tracking-tight ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                Automóviles & SUVs
              </h3>

              <p
                className={`text-sm mt-3 leading-relaxed ${
                  isDark ? "text-zinc-400" : "text-slate-600"
                }`}
              >
                Gama completa de berlinas, SUVs compactos y deportivos de alta gama.
                Modelos de fabricantes líderes como Toyota, Audi y Ferrari con historial
                de mantenimiento garantizado.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-zinc-800 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-blue-500">
              <span>Explorar Automóviles</span>
              <span className="group-hover:translate-x-1.5 transition-transform">→</span>
            </div>
          </Link>

          {/* Card 2: Motocicletas */}
          <Link
            to="/vehiculos?tipo=2"
            className={`group rounded-2xl p-8 border transition-all duration-300 hover:scale-[1.01] hover:shadow-xl flex flex-col justify-between ${
              isDark
                ? "bg-zinc-900/80 hover:bg-zinc-900 border-zinc-800 hover:border-blue-500/60"
                : "bg-white hover:bg-slate-50 border-slate-200 hover:border-blue-400 shadow-md"
            }`}
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>

              <h3
                className={`text-2xl font-bold tracking-tight ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                Motocicletas & Deportivas
              </h3>

              <p
                className={`text-sm mt-3 leading-relaxed ${
                  isDark ? "text-zinc-400" : "text-slate-600"
                }`}
              >
                Unidades urbanas y de pista de alta cilindrada. Máxima agilidad,
                aerodinámica y rendimiento de marcas destacadas como Yamaha y Honda.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-zinc-800 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-blue-500">
              <span>Explorar Motocicletas</span>
              <span className="group-hover:translate-x-1.5 transition-transform">→</span>
            </div>
          </Link>
        </div>
      </section>

      {/* Pilares Institucionales */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div
          className={`p-6 rounded-2xl border transition-colors ${
            isDark ? "bg-zinc-900/60 border-zinc-800" : "bg-white border-slate-200"
          }`}
        >
          <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h4 className={`font-bold text-base ${isDark ? "text-white" : "text-slate-900"}`}>
            Certificación Oficial
          </h4>
          <p className={`text-xs mt-1.5 leading-relaxed ${isDark ? "text-zinc-400" : "text-slate-500"}`}>
            Todas las unidades son revisadas mecánicamente con peritaje integral antes de su publicación.
          </p>
        </div>

        <div
          className={`p-6 rounded-2xl border transition-colors ${
            isDark ? "bg-zinc-900/60 border-zinc-800" : "bg-white border-slate-200"
          }`}
        >
          <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h4 className={`font-bold text-base ${isDark ? "text-white" : "text-slate-900"}`}>
            Disponibilidad en Tiempo Real
          </h4>
          <p className={`text-xs mt-1.5 leading-relaxed ${isDark ? "text-zinc-400" : "text-slate-500"}`}>
            Conexión asíncrona directa con la base de datos de stock para consultar unidades vigentes.
          </p>
        </div>

        <div
          className={`p-6 rounded-2xl border transition-colors ${
            isDark ? "bg-zinc-900/60 border-zinc-800" : "bg-white border-slate-200"
          }`}
        >
          <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <h4 className={`font-bold text-base ${isDark ? "text-white" : "text-slate-900"}`}>
            Gestión y Control
          </h4>
          <p className={`text-xs mt-1.5 leading-relaxed ${isDark ? "text-zinc-400" : "text-slate-500"}`}>
            Panel administrativo integrado con validaciones en cliente y persistencia completa.
          </p>
        </div>
      </section>
    </div>
  );
}
