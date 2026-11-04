import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/UserContext";

export default function Gestion() {
  const { user } = useContext(UserContext);

  const [vehiculos, setVehiculos] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [tiposVehiculos, setTiposVehiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estado del formulario
  const [form, setForm] = useState({
    nombre: "",
    precio: "",
    stock: "1",
    modelo: new Date().getFullYear().toString(),
    url_image: "",
    descripcion: "",
    estado_uso: "usado",
    marca_id: "",
    tipo_vehiculo_id: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ tipo: "", mensaje: "" });

  const API_URL = import.meta.env.VITE_API_URL;

  // Cargar datos iniciales
  const cargarDatos = () => {
    setLoading(true);
    Promise.all([
      fetch(`${API_URL}/vehiculos/`).then((res) => res.json()),
      fetch(`${API_URL}/marcas/`).then((res) => res.json()),
      fetch(`${API_URL}/tipo_vehiculos/`).then((res) => res.json()),
    ])
      .then(([vehiculosData, marcasData, tiposData]) => {
        setVehiculos(vehiculosData.items || vehiculosData || []);
        const marcasList = marcasData.items || marcasData || [];
        const tiposList = tiposData.items || tiposData || [];

        setMarcas(marcasList);
        setTiposVehiculos(tiposList);

        // Preseleccionar primera marca y tipo si no están seleccionados
        setForm((prev) => ({
          ...prev,
          marca_id: prev.marca_id || (marcasList[0]?.id ? String(marcasList[0].id) : ""),
          tipo_vehiculo_id:
            prev.tipo_vehiculo_id || (tiposList[0]?.id ? String(tiposList[0].id) : ""),
        }));

        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar datos:", err);
        setError("Error al comunicar con la API.");
        setLoading(false);
      });
  };

  useEffect(() => {
    cargarDatos();
  }, [API_URL]);

  // Manejo de inputs del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Limpiar error del campo específico mientras escribe
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Validación obligatoria del formulario
  const validate = () => {
    const newErrors = {};

    if (!form.nombre.trim()) {
      newErrors.nombre = "El nombre del vehículo es obligatorio.";
    } else if (form.nombre.trim().length < 3) {
      newErrors.nombre = "Debe tener al menos 3 caracteres.";
    }

    if (!form.precio) {
      newErrors.precio = "El precio es obligatorio.";
    } else if (Number(form.precio) <= 0) {
      newErrors.precio = "El precio debe ser un número mayor a 0.";
    }

    if (!form.stock && form.stock !== 0) {
      newErrors.stock = "El stock es obligatorio.";
    } else if (Number(form.stock) < 0) {
      newErrors.stock = "El stock no puede ser negativo.";
    }

    if (form.modelo && (Number(form.modelo) < 1900 || Number(form.modelo) > 2030)) {
      newErrors.modelo = "Ingresa un año válido (ej: 2018).";
    }

    if (form.descripcion && form.descripcion.length > 500) {
      newErrors.descripcion = "La descripción no puede superar los 500 caracteres.";
    }

    if (!form.marca_id) {
      newErrors.marca_id = "Debes seleccionar una marca.";
    }

    if (!form.tipo_vehiculo_id) {
      newErrors.tipo_vehiculo_id = "Debes seleccionar un tipo de vehículo.";
    }

    return newErrors;
  };

  // Envío del formulario para CREAR vehículo (POST)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ tipo: "", mensaje: "" });

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        nombre: form.nombre.trim(),
        precio: Number(form.precio),
        stock: Number(form.stock),
        modelo: form.modelo ? Number(form.modelo) : null,
        url_image: form.url_image.trim() || null,
        descripcion: form.descripcion.trim() || null,
        estado_uso: form.estado_uso,
        activo: true,
        marca_id: Number(form.marca_id),
        tipo_vehiculo_id: Number(form.tipo_vehiculo_id),
      };

      const res = await fetch(`${API_URL}/vehiculos/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.detail?.[0]?.msg || errorData.detail || "Error al crear el vehículo en el servidor"
        );
      }

      setFeedback({
        tipo: "exito",
        mensaje: `¡Vehículo "${form.nombre}" creado exitosamente!`,
      });

      // Resetear campos del form manteniendo marcas
      setForm((prev) => ({
        ...prev,
        nombre: "",
        precio: "",
        stock: "1",
        url_image: "",
        descripcion: "",
      }));
      setFormErrors({});
      cargarDatos();
    } catch (err) {
      console.error("Error al guardar:", err);
      setFeedback({
        tipo: "error",
        mensaje: err.message || "No se pudo crear el vehículo.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Función para ELIMINAR vehículo (DELETE)
  const handleEliminar = async (id, nombre) => {
    const confirmar = window.confirm(
      `¿Estás seguro de que deseas eliminar permanentemente el vehículo "${nombre}" (ID #${id})?`
    );

    if (!confirmar) return;

    try {
      const res = await fetch(`${API_URL}/vehiculos/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("No se pudo eliminar el vehículo.");
      }

      setVehiculos((prev) => prev.filter((item) => item.id !== id));
      setFeedback({
        tipo: "exito",
        mensaje: `Vehículo "${nombre}" eliminado con éxito.`,
      });
    } catch (err) {
      console.error("Error al eliminar:", err);
      alert("Error al eliminar el vehículo: " + err.message);
    }
  };

  // Guardia de rol Admin (según patrón de Valentino en AgregarProducto)
  if (!user.admin) {
    return (
      <section className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-6xl mb-4">🔒</p>
        <h2 className="text-3xl font-extrabold text-red-500 mb-2">
          Acceso Restringido
        </h2>
        <p className="text-zinc-400 max-w-md mb-6">
          Esta vista es el panel de gestión administrativa para crear y dar de baja vehículos en la base de datos.
        </p>
        <p className="text-xs text-zinc-500 bg-zinc-800 px-4 py-2 rounded-lg border border-zinc-700">
          💡 Puedes activar el modo <strong>Admin</strong> desde el botón de la página de <strong>Home</strong>.
        </p>
      </section>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Panel de Gestión</h1>
        <p className="text-zinc-400 text-sm mt-1">
          Administración de base de datos de vehículos (Operaciones de creación y eliminación).
        </p>
      </div>

      {/* Alerta de Feedback */}
      {feedback.mensaje && (
        <div
          className={`p-4 rounded-xl text-sm font-semibold flex items-center justify-between transition-all ${
            feedback.tipo === "exito"
              ? "bg-emerald-950/70 border border-emerald-600 text-emerald-300"
              : "bg-rose-950/70 border border-rose-600 text-rose-300"
          }`}
        >
          <span>{feedback.mensaje}</span>
          <button
            onClick={() => setFeedback({ tipo: "", mensaje: "" })}
            className="text-xs underline cursor-pointer ml-4"
          >
            Cerrar
          </button>
        </div>
      )}

      {/* Formulario de Creación */}
      <div className="bg-zinc-800 rounded-2xl p-6 sm:p-8 border border-zinc-700 shadow-xl">
        <h2 className="text-xl font-bold text-green-400 mb-6 flex items-center gap-2">
          <span>➕</span> Registrar Nuevo Vehículo
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                Nombre del Vehículo / Modelo *
              </label>
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Ej: Ford Ranger Raptor"
                className={`w-full px-4 py-2.5 rounded-lg bg-zinc-900 border text-white text-sm focus:outline-none ${
                  formErrors.nombre ? "border-rose-500" : "border-zinc-700 focus:border-green-400"
                }`}
              />
              {formErrors.nombre && (
                <p className="text-xs text-rose-400 mt-1 animate-pulse">{formErrors.nombre}</p>
              )}
            </div>

            {/* Precio */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                Precio (USD / ARS) *
              </label>
              <input
                type="number"
                name="precio"
                value={form.precio}
                onChange={handleChange}
                placeholder="Ej: 35000"
                className={`w-full px-4 py-2.5 rounded-lg bg-zinc-900 border text-white text-sm focus:outline-none ${
                  formErrors.precio ? "border-rose-500" : "border-zinc-700 focus:border-green-400"
                }`}
              />
              {formErrors.precio && (
                <p className="text-xs text-rose-400 mt-1 animate-pulse">{formErrors.precio}</p>
              )}
            </div>

            {/* Marca (Select) */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                Marca Fabricante *
              </label>
              <select
                name="marca_id"
                value={form.marca_id}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-sm focus:outline-none focus:border-green-400 cursor-pointer"
              >
                {marcas.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nombre}
                  </option>
                ))}
              </select>
              {formErrors.marca_id && (
                <p className="text-xs text-rose-400 mt-1 animate-pulse">{formErrors.marca_id}</p>
              )}
            </div>

            {/* Tipo de Vehículo (Select) */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                Tipo / Categoría *
              </label>
              <select
                name="tipo_vehiculo_id"
                value={form.tipo_vehiculo_id}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-sm focus:outline-none focus:border-green-400 cursor-pointer"
              >
                {tiposVehiculos.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.nombre}
                  </option>
                ))}
              </select>
              {formErrors.tipo_vehiculo_id && (
                <p className="text-xs text-rose-400 mt-1 animate-pulse">{formErrors.tipo_vehiculo_id}</p>
              )}
            </div>

            {/* Año / Modelo */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                Año de Modelo
              </label>
              <input
                type="number"
                name="modelo"
                value={form.modelo}
                onChange={handleChange}
                placeholder="Ej: 2024"
                className="w-full px-4 py-2.5 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-sm focus:outline-none focus:border-green-400"
              />
              {formErrors.modelo && (
                <p className="text-xs text-rose-400 mt-1 animate-pulse">{formErrors.modelo}</p>
              )}
            </div>

            {/* Stock */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                Stock Inicial *
              </label>
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-2.5 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-sm focus:outline-none focus:border-green-400"
              />
              {formErrors.stock && (
                <p className="text-xs text-rose-400 mt-1 animate-pulse">{formErrors.stock}</p>
              )}
            </div>

            {/* Condición de Uso */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                Condición de Uso
              </label>
              <select
                name="estado_uso"
                value={form.estado_uso}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-sm focus:outline-none focus:border-green-400 cursor-pointer"
              >
                <option value="nuevo">0 Km / Nuevo</option>
                <option value="usado">Usado Certificado</option>
              </select>
            </div>

            {/* URL Imagen */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                URL de Fotografía
              </label>
              <input
                type="url"
                name="url_image"
                value={form.url_image}
                onChange={handleChange}
                placeholder="https://ejemplo.com/auto.jpg"
                className="w-full px-4 py-2.5 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-sm focus:outline-none focus:border-green-400"
              />
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">
              Descripción y Detalles ({form.descripcion.length}/500)
            </label>
            <textarea
              name="descripcion"
              rows="3"
              value={form.descripcion}
              onChange={handleChange}
              placeholder="Detalla equipamiento, motorización, tapizado, etc."
              className="w-full px-4 py-2.5 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-sm focus:outline-none focus:border-green-400"
            ></textarea>
            {formErrors.descripcion && (
              <p className="text-xs text-rose-400 mt-1 animate-pulse">{formErrors.descripcion}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className={`w-full py-3.5 px-6 rounded-xl font-bold text-zinc-950 transition-colors cursor-pointer ${
              submitting
                ? "bg-zinc-600 cursor-not-allowed"
                : "bg-green-400 hover:bg-green-500"
            }`}
          >
            {submitting ? "Guardando en Base de Datos..." : "Guardar Vehículo en la API"}
          </button>
        </form>
      </div>

      {/* Tabla de Eliminación de Vehículos */}
      <div className="bg-zinc-800 rounded-2xl p-6 sm:p-8 border border-zinc-700 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>📋</span> Listado Actual para Mantenimiento
            </h2>
            <p className="text-zinc-400 text-xs mt-1">
              Operación DELETE con actualización en tiempo real del estado.
            </p>
          </div>
          <button
            onClick={cargarDatos}
            className="text-xs text-zinc-300 hover:text-white bg-zinc-700 hover:bg-zinc-600 px-3 py-1.5 rounded-lg cursor-pointer"
          >
            🔄 Refrescar lista
          </button>
        </div>

        {loading ? (
          <p className="text-center py-8 text-zinc-400">Cargando unidades...</p>
        ) : vehiculos.length === 0 ? (
          <p className="text-center py-8 text-zinc-400">No hay vehículos registrados en la base de datos.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-300">
              <thead className="bg-zinc-900/80 text-xs uppercase text-zinc-400 border-b border-zinc-700">
                <tr>
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Vehículo</th>
                  <th className="py-3 px-4">Precio</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-700/60">
                {vehiculos.map((v) => (
                  <tr key={v.id} className="hover:bg-zinc-750 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs text-zinc-400">#{v.id}</td>
                    <td className="py-3 px-4 font-semibold text-white">{v.nombre}</td>
                    <td className="py-3 px-4 text-green-400 font-bold">
                      ${Number(v.precio).toLocaleString("es-AR")}
                    </td>
                    <td className="py-3 px-4">{v.stock} un.</td>
                    <td className="py-3 px-4">
                      <span className="capitalize text-xs px-2 py-0.5 rounded bg-zinc-700 text-zinc-300">
                        {v.estado_uso || "Usado"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleEliminar(v.id, v.nombre)}
                        className="bg-rose-900/40 hover:bg-rose-700 text-rose-300 hover:text-white border border-rose-700/60 text-xs px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
                      >
                        🗑️ Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}