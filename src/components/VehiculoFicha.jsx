import { useOutletContext } from "react-router-dom";

export default function VehiculoFicha() {
  const vehiculo = useOutletContext();

  if (!vehiculo) return null;

  return (
    <div className="bg-zinc-800/60 p-6 rounded-lg border border-zinc-700/60 mt-4 space-y-4">
      <h3 className="text-xl font-bold text-green-400 border-b border-zinc-700 pb-2">
        Ficha Técnica y Estado
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <div className="bg-zinc-900/70 p-3 rounded">
          <span className="text-zinc-400 block text-xs uppercase font-semibold">Año de Modelo</span>
          <span className="text-lg font-bold">{vehiculo.modelo || "No especificado"}</span>
        </div>

        <div className="bg-zinc-900/70 p-3 rounded">
          <span className="text-zinc-400 block text-xs uppercase font-semibold">Estado de Uso</span>
          <span className="text-lg font-bold capitalize">{vehiculo.estado_uso || "Usado seleccionado"}</span>
        </div>

        <div className="bg-zinc-900/70 p-3 rounded">
          <span className="text-zinc-400 block text-xs uppercase font-semibold">Unidades en Stock</span>
          <span className="text-lg font-bold">{vehiculo.stock} unidades</span>
        </div>

        <div className="bg-zinc-900/70 p-3 rounded">
          <span className="text-zinc-400 block text-xs uppercase font-semibold">Disponibilidad</span>
          <span className={`text-lg font-bold ${vehiculo.activo ? "text-emerald-400" : "text-rose-400"}`}>
            {vehiculo.activo ? "Disponible para entrega" : "No disponible"}
          </span>
        </div>
      </div>

      <div className="bg-zinc-900/70 p-4 rounded mt-4">
        <span className="text-zinc-400 block text-xs uppercase font-semibold mb-1">Descripción del Vehículo</span>
        <p className="text-zinc-200 leading-relaxed">
          {vehiculo.descripcion || "Este vehículo no cuenta con descripción detallada cargada aún."}
        </p>
      </div>
    </div>
  );
}
