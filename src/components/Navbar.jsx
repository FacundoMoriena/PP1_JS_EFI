import { NavLink } from "react-router-dom";

export default function Navbar() {
  const linkStyle = ({ isActive }) =>
    isActive
      ? "text-white font-black"
      : "cursor-pointer text-white/90 hover:text-white transition-colors";

  return (
    <nav className="relative flex items-center justify-between bg-green-400 px-6 py-3 shadow-md">
      <h1 className="text-xl font-bold text-white">Concesionaria</h1>

      <ul className="absolute left-1/2 -translate-x-1/2 flex items-center gap-6 text-sm font-medium">
        <NavLink to={"/"} className={linkStyle}>Home</NavLink>
        <NavLink to={"/vehiculos"} className={linkStyle}>Vehiculos</NavLink>
        <NavLink to={"/gestion"} className={linkStyle}>Gestion</NavLink>
        <NavLink to={"/favoritos"} className={linkStyle}>Favoritos</NavLink>
      </ul>
    </nav>
  );
}


