import { useOutletContext } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

export default function VehiculoFicha() {
  const vehiculo = useOutletContext();
  const { isDark } = useContext(ThemeContext);

  if (!vehiculo) return null;

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
          Especificaciones Técnicas & Disponibilidad
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        <div className={`p-4 rounded-xl border ${isDark ? "bg-zinc-950 border-zinc-800/80" : "bg-slate-50 border-slate-200"}`}>
          <span className="text-zinc-500 block uppercase text-[10px] font-bold tracking-wider mb-1">
            Año de Fabricación
          </span>
          <span className="text-base font-bold text-blue-500">
            {vehiculo.modelo || "No especificado"}
          </span>
        </div>

        <div className={`p-4 rounded-xl border ${isDark ? "bg-zinc-950 border-zinc-800/80" : "bg-slate-50 border-slate-200"}`}>
          <span className="text-zinc-500 block uppercase text-[10px] font-bold tracking-wider mb-1">
            Condición del Vehículo
          </span>
          <span className="text-base font-bold capitalize text-zinc-300">
            {vehiculo.estado_uso || "Usado Certificado"}
          </span>
        </div>

        <div className={`p-4 rounded-xl border ${isDark ? "bg-zinc-950 border-zinc-800/80" : "bg-slate-50 border-slate-200"}`}>
          <span className="text-zinc-500 block uppercase text-[10px] font-bold tracking-wider mb-1">
            Inventario en Concesionaria
          </span>
          <span className="text-base font-bold text-zinc-300">
            {vehiculo.stock} unidades
          </span>
        </div>

        <div className={`p-4 rounded-xl border ${isDark ? "bg-zinc-950 border-zinc-800/80" : "bg-slate-50 border-slate-200"}`}>
          <span className="text-zinc-500 block uppercase text-[10px] font-bold tracking-wider mb-1">
            Estado de Operación
          </span>
          <span className={`text-base font-bold ${vehiculo.activo ? "text-emerald-500" : "text-rose-500"}`}>
            {vehiculo.activo ? "Activo para Venta" : "Baja temporal"}
          </span>
        </div>
      </div>

      <div className={`p-5 rounded-xl border ${isDark ? "bg-zinc-950 border-zinc-800/80" : "bg-slate-50 border-slate-200"}`}>
        <span className="text-zinc-500 block uppercase text-[10px] font-bold tracking-wider mb-2">
          Memoria Descriptiva
        </span>
        <p className="text-xs text-zinc-300 leading-relaxed">
          {vehiculo.descripcion || "Esta unidad no registra observaciones complementarias en el sistema de gestión."}
        </p>
      </div>
    </div>
  );
}
