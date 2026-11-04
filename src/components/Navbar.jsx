import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { FavoritosContext } from "../context/FavoritosContext";
import { UserContext } from "../context/UserContext";
import { ThemeContext } from "../context/ThemeContext";

export default function Navbar() {
  const { totalFavoritos } = useContext(FavoritosContext);
  const { user, toggleAdmin } = useContext(UserContext);
  const { isDark, toggleTheme } = useContext(ThemeContext);

  const linkStyle = ({ isActive }) =>
    `cursor-pointer px-3 py-1.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
      isActive
        ? isDark
          ? "bg-zinc-900 text-green-400 shadow-inner"
          : "bg-white text-green-700 shadow"
        : "text-zinc-950/80 hover:text-zinc-950 hover:bg-green-500/30"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-green-400 px-4 sm:px-8 py-3 shadow-md transition-colors">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <NavLink to="/" className="flex items-center gap-2">
          <span className="text-2xl">🚘</span>
          <span className="text-xl font-black text-zinc-950 tracking-tight">
            Concesionaria{" "}
            <span className="text-xs uppercase bg-zinc-950 text-green-400 px-2 py-0.5 rounded font-mono">
              EFI
            </span>
          </span>
        </NavLink>

        {/* Enlaces de Navegación */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <NavLink to="/" className={linkStyle}>
            Inicio
          </NavLink>

          <NavLink to="/vehiculos" className={linkStyle}>
            Vehículos
          </NavLink>

          {/* Gestión de BD: Visible únicamente si está activado el Modo Admin */}
          {user.admin && (
            <NavLink to="/gestion" className={linkStyle}>
              <span>⚙️ Gestión</span>
              <span className="text-[10px] bg-purple-900 text-purple-200 px-1.5 py-0.2 rounded font-bold uppercase">
                Admin
              </span>
            </NavLink>
          )}

          <NavLink to="/favoritos" className={linkStyle}>
            <span>Favoritos</span>
            {totalFavoritos > 0 && (
              <span className="bg-rose-600 text-white text-[11px] font-bold px-1.5 py-0.2 rounded-full">
                {totalFavoritos}
              </span>
            )}
          </NavLink>
        </nav>

        {/* Acciones de Contexto: Modo Admin y Selector de Tema */}
        <div className="flex items-center gap-2">
          {/* Botón Modo Admin */}
          <button
            onClick={toggleAdmin}
            className={`cursor-pointer text-xs font-bold px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
              user.admin
                ? "bg-purple-900 hover:bg-purple-800 text-purple-100 shadow"
                : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
            }`}
            title="Alternar permisos de Administrador para gestionar la BD"
          >
            <span>{user.admin ? "👑 Admin: ON" : "👤 Admin: OFF"}</span>
          </button>

          {/* Botón Tema Claro / Oscuro */}
          <button
            onClick={toggleTheme}
            className="cursor-pointer bg-zinc-900 hover:bg-zinc-800 text-zinc-100 p-2 rounded-full text-sm transition-all"
            title={isDark ? "Cambiar a Modo Claro" : "Cambiar a Modo Oscuro"}
          >
            {isDark ? "☀️" : "🌙"}
          </button>
        </div>
      </div>
    </header>
  );
}
