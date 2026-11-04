import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

export default function Footer() {
  const { isDark } = useContext(ThemeContext);

  return (
    <footer
      className={`border-t py-8 text-xs transition-colors mt-16 ${
        isDark
          ? "bg-zinc-950 border-zinc-800/80 text-zinc-500"
          : "bg-white border-slate-200 text-slate-500"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div>
          <p className="font-semibold text-sm tracking-wide text-zinc-300">
            Alboriena <span className="text-blue-500 font-normal">Motors</span>
          </p>
          <p className="text-[11px] mt-0.5 text-zinc-500">
            Plataforma de Gestión y Catálogo Automotriz • Evaluación Final Integradora
          </p>
        </div>

        <div className="text-[11px] space-y-0.5">
          <p>
            Desarrollo: <strong className={isDark ? "text-zinc-300" : "text-slate-800"}>Facundo Albornoz</strong> &{" "}
            <strong className={isDark ? "text-zinc-300" : "text-slate-800"}>Facundo Moriena</strong>
          </p>
          <p>ITEC Río Cuarto — Práctica Profesionalizante I</p>
        </div>
      </div>
    </footer>
  );
}
