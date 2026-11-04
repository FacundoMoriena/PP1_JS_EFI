import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { FavoritosContext } from "../context/FavoritosContext";

const operadoresConcesionaria = [
  { id: 1, nombre: "Facundo Albornoz", rol: "Administrador / Desarrollador", email: "facundo.albornoz@itecriocuarto.org.ar" },
  { id: 2, nombre: "Facundo Moriena", rol: "Administrador / Desarrollador", email: "facundo.moriena@itecriocuarto.org.ar" },
  { id: 3, nombre: "Valentino Arballo", rol: "Docente Evaluador", email: "v.arballo@itecriocuarto.org.ar" },
];

export default function Home() {
  const { user, toggleAdmin } = useContext(UserContext);
  const { totalFavoritos } = useContext(FavoritosContext);

  return (
    <div className="max-w-5xl mx-auto space-y-12 py-4">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-zinc-800 via-zinc-850 to-zinc-900 border border-zinc-700/80 rounded-3xl p-8 sm:p-12 text-center shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-green-500/10 blur-3xl pointer-events-none"></div>

        <span className="inline-block px-3.5 py-1 text-xs font-semibold bg-green-500/20 text-green-400 rounded-full border border-green-500/30 mb-4">
          Trabajo Integrador Final - ITEC Río Cuarto
        </span>

        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          Concesionaria de Vehículos
        </h1>

        <p className="text-zinc-300 text-base sm:text-lg max-w-2xl mx-auto mt-4 leading-relaxed">
          Plataforma web en <strong>React</strong> integrada asíncronamente con una API REST en <strong>FastAPI</strong> y base de datos relacional.
        </p>

        {/* Botones de Acción */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
          <Link
            to="/vehiculos"
            className="bg-green-400 hover:bg-green-500 text-zinc-950 font-bold px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-green-500/20 cursor-pointer"
          >
            🚗 Explorar Catálogo
          </Link>

          <Link
            to="/favoritos"
            className="bg-zinc-800 hover:bg-zinc-700 text-white font-semibold px-6 py-3 rounded-xl border border-zinc-600 transition-all cursor-pointer flex items-center gap-2"
          >
            <span>❤️ Favoritos</span>
            {totalFavoritos > 0 && (
              <span className="bg-rose-600 text-xs px-2 py-0.5 rounded-full font-bold">
                {totalFavoritos}
              </span>
            )}
          </Link>

          <Link
            to="/gestion"
            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white font-semibold px-6 py-3 rounded-xl border border-zinc-600 transition-all cursor-pointer"
          >
            ⚙️ Panel de Gestión
          </Link>
        </div>

        {/* Selector de Rol Simulado (Requisito y patrón del docente Valentino) */}
        <div className="mt-10 pt-8 border-t border-zinc-700/60 flex flex-col items-center">
          <p className="text-xs text-zinc-400 mb-2">Simulación de Estado Global de Usuario:</p>
          <button
            onClick={toggleAdmin}
            className={`cursor-pointer text-xs font-bold px-4 py-2 rounded-full transition-all flex items-center gap-2 ${
              user.admin
                ? "bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-900/50"
                : "bg-zinc-700 hover:bg-zinc-600 text-zinc-300"
            }`}
          >
            <span>{user.admin ? "👑 Rol Actual: Administrador" : "👤 Rol Actual: Usuario Estándar"}</span>
            <span className="text-zinc-300 text-[10px] underline">(Haz clic para alternar)</span>
          </button>
        </div>
      </section>

      {/* Panel Condicional según Rol (Igual que en el repo del profesor) */}
      <section className="bg-zinc-800 rounded-2xl p-6 sm:p-8 border border-zinc-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>👥</span> Equipo y Operadores de la Concesionaria
          </h2>
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
              user.admin
                ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                : "bg-amber-950 text-amber-400 border border-amber-800"
            }`}
          >
            {user.admin ? "Permisos Completos" : "Vista Pública"}
          </span>
        </div>

        {user.admin ? (
          <div className="space-y-3">
            <p className="text-xs text-zinc-400 mb-2">
              Panel Administrativo visible únicamente con rol activo:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {operadoresConcesionaria.map((op) => (
                <div
                  key={op.id}
                  className="bg-zinc-900/80 p-4 rounded-xl border border-zinc-700/60 flex flex-col justify-between"
                >
                  <div>
                    <h3 className="font-bold text-white text-sm">{op.nombre}</h3>
                    <p className="text-xs text-green-400 mt-0.5">{op.rol}</p>
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-2 truncate font-mono">
                    {op.email}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-4 bg-zinc-900/60 rounded-xl border border-zinc-700 text-center">
            <p className="text-sm text-zinc-400">
              Inicia con rol <strong>Administrador</strong> para visualizar el listado de operadores internos y acceder a la creación/baja de unidades en el panel de Gestión.
            </p>
          </div>
        )}
      </section>

      {/* Características del Sistema Integrado */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-zinc-800/60 p-6 rounded-2xl border border-zinc-700/60">
          <span className="text-3xl mb-3 block">⚡</span>
          <h3 className="font-bold text-white text-base">Rutas Dinámicas & Anidadas</h3>
          <p className="text-zinc-400 text-xs mt-2 leading-relaxed">
            Navegación completa con React Router DOM v7, parámetros dinámicos con <code>useParams</code> y subrutas con <code>&lt;Outlet /&gt;</code>.
          </p>
        </div>

        <div className="bg-zinc-800/60 p-6 rounded-2xl border border-zinc-700/60">
          <span className="text-3xl mb-3 block">🔄</span>
          <h3 className="font-bold text-white text-base">Context API Global</h3>
          <p className="text-zinc-400 text-xs mt-2 leading-relaxed">
            Almacenamiento global de favoritos sincronizado en <code>localStorage</code> y simulación de roles de usuario.
          </p>
        </div>

        <div className="bg-zinc-800/60 p-6 rounded-2xl border border-zinc-700/60">
          <span className="text-3xl mb-3 block">🛡️</span>
          <h3 className="font-bold text-white text-base">Validación y Operaciones CRUD</h3>
          <p className="text-zinc-400 text-xs mt-2 leading-relaxed">
            Consumo asíncrono con <code>fetch</code> para lectura, creación y eliminación con validaciones obligatorias en el cliente.
          </p>
        </div>
      </section>
    </div>
  );
}