import { useOutletContext } from "react-router-dom";

export default function VehiculoFabricante() {
  const vehiculo = useOutletContext();

  if (!vehiculo) return null;

  const marca = vehiculo.marca;
  const tipo = vehiculo.tipo_vehiculo;

  return (
    <div className="bg-zinc-800/60 p-6 rounded-lg border border-zinc-700/60 mt-4 space-y-4">
      <h3 className="text-xl font-bold text-indigo-400 border-b border-zinc-700 pb-2">
        Datos del Fabricante y Clasificación
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-zinc-900/70 p-4 rounded">
          <span className="text-zinc-400 block text-xs uppercase font-semibold">Marca Registrada</span>
          <p className="text-xl font-bold text-white mt-1">
            {marca?.nombre || "No especificada"}
          </p>
          {marca?.origen && (
            <p className="text-sm text-zinc-400 mt-1">
              País de origen: <span className="text-zinc-200">{marca.origen}</span>
            </p>
          )}
        </div>

        <div className="bg-zinc-900/70 p-4 rounded">
          <span className="text-zinc-400 block text-xs uppercase font-semibold">Tipo y Categoría</span>
          <p className="text-xl font-bold text-white mt-1">
            {tipo?.nombre || "General / Estándar"}
          </p>
          {tipo?.descripcion && (
            <p className="text-sm text-zinc-400 mt-1">
              {tipo.descripcion}
            </p>
          )}
        </div>
      </div>

      <div className="p-3 bg-indigo-950/40 border border-indigo-800/40 rounded text-xs text-indigo-300">
        ℹ️ Datos verificados oficialmente a través de las relaciones foráneas de la API de concesionaria.
      </div>
    </div>
  );
}
