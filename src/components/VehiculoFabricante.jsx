import { useOutletContext } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

export default function VehiculoFabricante() {
  const vehiculo = useOutletContext();
  const { isDark } = useContext(ThemeContext);

  if (!vehiculo) return null;

  const marca = vehiculo.marca;
  const tipo = vehiculo.tipo_vehiculo;

  return (
    <div
      className={`p-6 sm:p-8 rounded-2xl border space-y-6 ${
        isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-slate-200"
      }`}
    >
      <div className="border-b pb-3 border-zinc-800">
        <h3
          className={`text-base font-bold uppercase tracking-wider ${
            isDark ? "text-white" : "text-slate-900"
          }`}
        >
          Procedencia & Clasificación de Fábrica
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div
          className={`p-5 rounded-xl border ${
            isDark ? "bg-zinc-950 border-zinc-800/80" : "bg-slate-50 border-slate-200"
          }`}
        >
          <span className="text-zinc-500 block uppercase text-[10px] font-bold tracking-wider">
            Marca Registrada
          </span>
          <p
            className={`text-2xl font-black mt-1 ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            {marca?.nombre || "No especificada"}
          </p>
          {marca?.origen && (
            <p className="text-xs text-zinc-500 mt-1">
              País de ensamblaje / origen:{" "}
              <strong className="text-zinc-300">{marca.origen}</strong>
            </p>
          )}
        </div>

        <div
          className={`p-5 rounded-xl border ${
            isDark ? "bg-zinc-950 border-zinc-800/80" : "bg-slate-50 border-slate-200"
          }`}
        >
          <span className="text-zinc-500 block uppercase text-[10px] font-bold tracking-wider">
            Segmento Oficial
          </span>
          <p
            className={`text-2xl font-black mt-1 ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            {tipo?.nombre || "General / Estándar"}
          </p>
          {tipo?.descripcion && (
            <p className="text-xs text-zinc-500 mt-1">
              {tipo.descripcion}
            </p>
          )}
        </div>
      </div>

      <div
        className={`p-3 rounded-xl border text-[11px] flex items-center gap-2 ${
          isDark
            ? "bg-blue-500/5 border-blue-500/20 text-blue-400"
            : "bg-blue-50 border-blue-200 text-blue-700"
        }`}
      >
        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>
          Datos verificados a través de las relaciones foráneas de la base de datos de Alboriena Motors.
        </span>
      </div>
    </div>
  );
}
