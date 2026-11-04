import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { FavoritosContext } from "../context/FavoritosContext";
import { UserContext } from "../context/UserContext";

export default function Navbar() {
  const { totalFavoritos } = useContext(FavoritosContext);
  const { user } = useContext(UserContext);

  const linkStyle = ({ isActive }) =>
    `cursor-pointer px-3 py-1.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
      isActive
        ? "bg-zinc-900 text-green-400 shadow-inner"
        : "text-zinc-950/80 hover:text-zinc-950 hover:bg-green-500/30"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-green-400 px-4 sm:px-8 py-3 shadow-md">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <NavLink to="/" className="flex items-center gap-2">
          <span className="text-2xl">🚘</span>
          <span className="text-xl font-black text-zinc-950 tracking-tight">
            Concesionaria <span className="text-xs uppercase bg-zinc-950 text-green-400 px-2 py-0.5 rounded font-mono">EFI</span>
          </span>
        </NavLink>

        <nav className="flex items-center gap-1 sm:gap-2">
          <NavLink to="/" className={linkStyle}>
            Inicio
          </NavLink>

          <NavLink to="/vehiculos" className={linkStyle}>
            Vehículos
          </NavLink>

          <NavLink to="/gestion" className={linkStyle}>
            Gestión
          </NavLink>

          <NavLink to="/favoritos" className={linkStyle}>
            <span>Favoritos</span>
            {totalFavoritos > 0 && (
              <span className="bg-rose-600 text-white text-[11px] font-bold px-1.5 py-0.2 rounded-full">
                {totalFavoritos}
              </span>
            )}
          </NavLink>
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
            user.admin
              ? "bg-zinc-950 text-purple-300 border border-purple-500/40"
              : "bg-zinc-950 text-zinc-300"
          }`}>
            {user.admin ? "👑 Admin" : "👤 Usuario"}
          </span>
        </div>
      </div>
    </header>
  );
}
