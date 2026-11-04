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
    `cursor-pointer px-3.5 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-all uppercase ${
      isActive
        ? isDark
          ? "bg-zinc-800 text-blue-400 border border-zinc-700/80 shadow-sm"
          : "bg-slate-100 text-blue-600 border border-slate-200 shadow-sm"
        : isDark
        ? "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"
        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
    }`;

  return (
    <header
      className={`sticky top-0 z-50 transition-colors backdrop-blur-md border-b ${
        isDark
          ? "bg-zinc-950/90 border-zinc-800/80 text-zinc-100"
          : "bg-white/90 border-slate-200 text-slate-900 shadow-sm"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <NavLink to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-sm tracking-wider shadow-md shadow-blue-600/20 group-hover:bg-blue-500 transition-colors">
            AM
          </div>
          <div className="flex flex-col">
            <span className="text-base font-black tracking-wider uppercase leading-none font-sans">
              Alboriena <span className="text-blue-500 font-light">Motors</span>
            </span>
            <span className="text-[10px] tracking-widest uppercase text-zinc-500 font-medium">
              Automotive Group
            </span>
          </div>
        </NavLink>

        {/* Enlaces de Navegación */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <NavLink to="/" className={linkStyle}>
            Inicio
          </NavLink>

          <NavLink to="/vehiculos" className={linkStyle}>
            Catálogo
          </NavLink>

          {/* Gestión: Solo visible si el usuario tiene rol Admin */}
          {user.admin && (
            <NavLink to="/gestion" className={linkStyle}>
              <span className="flex items-center gap-1.5">
                <span>Gestión</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded font-bold uppercase bg-blue-500/15 text-blue-400 border border-blue-500/30">
                  Admin
                </span>
              </span>
            </NavLink>
          )}

          <NavLink to="/favoritos" className={linkStyle}>
            <span className="flex items-center gap-1.5">
              <span>Favoritos</span>
              {totalFavoritos > 0 && (
                <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full min-w-4 text-center">
                  {totalFavoritos}
                </span>
              )}
            </span>
          </NavLink>
        </nav>

        {/* Botones de Control: Modo Admin y Selector de Tema */}
        <div className="flex items-center gap-2.5">
          {/* Botón Modo Admin */}
          <button
            onClick={toggleAdmin}
            className={`cursor-pointer text-xs font-semibold px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 border ${
              user.admin
                ? isDark
                  ? "bg-blue-500/10 text-blue-400 border-blue-500/30 hover:bg-blue-500/20"
                  : "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                : isDark
                ? "bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200"
                : "bg-slate-100 text-slate-500 border-slate-200 hover:text-slate-800"
            }`}
            title="Alternar permisos de Administrador para gestionar la base de datos"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            <span className="hidden sm:inline">
              {user.admin ? "Admin Activo" : "Usuario"}
            </span>
          </button>

          {/* Botón Tema Claro / Oscuro con iconos SVG */}
          <button
            onClick={toggleTheme}
            className={`cursor-pointer p-2 rounded-md transition-all border ${
              isDark
                ? "bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800"
                : "bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-200"
            }`}
            title={isDark ? "Activar Modo Claro" : "Activar Modo Oscuro"}
            aria-label="Cambiar tema"
          >
            {isDark ? (
              /* Sol SVG */
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              /* Luna SVG */
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
