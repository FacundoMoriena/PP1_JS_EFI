import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { ThemeContext } from "../context/ThemeContext";

export default function Gestion() {
  const { user } = useContext(UserContext);
  const { isDark } = useContext(ThemeContext);

  const [vehiculos, setVehiculos] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [tiposVehiculos, setTiposVehiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estado para saber si estamos editando (id o null)
  const [editandoId, setEditandoId] = useState(null);

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

        if (!editandoId) {
          setForm((prev) => ({
            ...prev,
            marca_id: prev.marca_id || (marcasList[0]?.id ? String(marcasList[0].id) : ""),
            tipo_vehiculo_id:
              prev.tipo_vehiculo_id || (tiposList[0]?.id ? String(tiposList[0].id) : ""),
          }));
        }

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!form.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio.";
    } else if (form.nombre.trim().length < 3) {
      newErrors.nombre = "Debe tener al menos 3 caracteres.";
    }

    if (!form.precio) {
      newErrors.precio = "El precio es obligatorio.";
    } else if (Number(form.precio) <= 0) {
      newErrors.precio = "Debe ser mayor a 0.";
    }

    if (!form.stock && form.stock !== 0) {
      newErrors.stock = "El stock es obligatorio.";
    } else if (Number(form.stock) < 0) {
      newErrors.stock = "No puede ser negativo.";
    }

    if (form.modelo && (Number(form.modelo) < 1900 || Number(form.modelo) > 2030)) {
      newErrors.modelo = "Año inválido.";
    }

    if (!form.marca_id) {
      newErrors.marca_id = "Selecciona una marca.";
    }

    if (!form.tipo_vehiculo_id) {
      newErrors.tipo_vehiculo_id = "Selecciona un tipo.";
    }

    return newErrors;
  };

  // Activar modo edición: carga el vehículo en el formulario
  const iniciarEdicion = (auto) => {
    setEditandoId(auto.id);
    setForm({
      nombre: auto.nombre || "",
      precio: auto.precio ? String(auto.precio) : "",
      stock: auto.stock !== undefined ? String(auto.stock) : "1",
      modelo: auto.modelo ? String(auto.modelo) : "",
      url_image: auto.url_image || "",
      descripcion: auto.descripcion || "",
      estado_uso: auto.estado_uso || "usado",
      marca_id: auto.marca_id ? String(auto.marca_id) : "",
      tipo_vehiculo_id: auto.tipo_vehiculo_id ? String(auto.tipo_vehiculo_id) : "",
    });
    setFormErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setForm({
      nombre: "",
      precio: "",
      stock: "1",
      modelo: new Date().getFullYear().toString(),
      url_image: "",
      descripcion: "",
      estado_uso: "usado",
      marca_id: marcas[0]?.id ? String(marcas[0].id) : "",
      tipo_vehiculo_id: tiposVehiculos[0]?.id ? String(tiposVehiculos[0].id) : "",
    });
    setFormErrors({});
  };

  // Guardar (POST para nuevo, PUT para editar)
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

      const url = editandoId
        ? `${API_URL}/vehiculos/${editandoId}`
        : `${API_URL}/vehiculos/`;

      const method = editandoId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.detail?.[0]?.msg || errorData.detail || "Error en la petición a la API"
        );
      }

      setFeedback({
        tipo: "exito",
        mensaje: editandoId
          ? `¡Vehículo #${editandoId} actualizado con éxito (PUT)!`
          : `¡Vehículo "${form.nombre}" creado exitosamente (POST)!`,
      });

      cancelarEdicion();
      cargarDatos();
    } catch (err) {
      console.error("Error al guardar:", err);
      setFeedback({
        tipo: "error",
        mensaje: err.message || "No se pudo procesar la operación.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Eliminar vehículo (DELETE)
  const handleEliminar = async (id, nombre) => {
    const confirmar = window.confirm(
      `¿Deseas eliminar definitivamente el vehículo "${nombre}" (ID #${id})?`
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
      if (editandoId === id) cancelarEdicion();

      setFeedback({
        tipo: "exito",
        mensaje: `Vehículo "${nombre}" eliminado correctamente (DELETE).`,
      });
    } catch (err) {
      console.error("Error al eliminar:", err);
      alert("Error al eliminar: " + err.message);
    }
  };

  const obtenerNombreMarca = (id) =>
    marcas.find((m) => m.id === id)?.nombre || "General";

  const obtenerNombreTipo = (id) =>
    tiposVehiculos.find((t) => t.id === id)?.nombre || "General";

  // Si no es admin, mostrar bloqueo
  if (!user.admin) {
    return (
      <section className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-6xl mb-4">🔒</p>
        <h2 className="text-3xl font-extrabold text-red-500 mb-2">
          Acceso Restringido a Administradores
        </h2>
        <p className="text-zinc-400 max-w-md mb-6">
          Esta vista permite gestionar la base de datos de vehículos. Puedes activar el modo administrador desde el botón en la barra superior.
        </p>
      </section>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <div>
        <h1
          className={`text-3xl font-black ${
            isDark ? "text-white" : "text-zinc-900"
          }`}
        >
          Gestión de Base de Datos
        </h1>
        <p
          className={`text-sm mt-1 ${
            isDark ? "text-zinc-400" : "text-zinc-600"
          }`}
        >
          Panel de administración para registrar (POST), modificar (PUT) y dar de baja (DELETE) vehículos.
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

      {/* Formulario (Crear / Editar) */}
      <div
        className={`p-6 sm:p-8 rounded-2xl border shadow-xl ${
          isDark
            ? "bg-zinc-800 border-zinc-700"
            : "bg-white border-zinc-200"
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2
            className={`text-xl font-bold flex items-center gap-2 ${
              editandoId ? "text-amber-400" : "text-green-500"
            }`}
          >
            <span>{editandoId ? "✏️" : "➕"}</span>
            <span>
              {editandoId
                ? `Editando Vehículo #${editandoId}`
                : "Registrar Nuevo Vehículo"}
            </span>
          </h2>

          {editandoId && (
            <button
              onClick={cancelarEdicion}
              className="text-xs text-zinc-400 hover:text-white bg-zinc-700 px-3 py-1.5 rounded-lg cursor-pointer"
            >
              ✕ Cancelar Edición
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* Nombre */}
            <div>
              <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">
                Nombre / Modelo *
              </label>
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Ej: Toyota Hilux"
                className={`w-full px-3 py-2 rounded-lg text-sm border focus:outline-none focus:border-green-400 ${
                  isDark
                    ? "bg-zinc-900 border-zinc-700 text-white"
                    : "bg-zinc-50 border-zinc-300 text-zinc-900"
                }`}
              />
              {formErrors.nombre && (
                <p className="text-xs text-rose-400 mt-1">{formErrors.nombre}</p>
              )}
            </div>

            {/* Precio */}
            <div>
              <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">
                Precio *
              </label>
              <input
                type="number"
                name="precio"
                value={form.precio}
                onChange={handleChange}
                placeholder="Ej: 32000"
                className={`w-full px-3 py-2 rounded-lg text-sm border focus:outline-none focus:border-green-400 ${
                  isDark
                    ? "bg-zinc-900 border-zinc-700 text-white"
                    : "bg-zinc-50 border-zinc-300 text-zinc-900"
                }`}
              />
              {formErrors.precio && (
                <p className="text-xs text-rose-400 mt-1">{formErrors.precio}</p>
              )}
            </div>

            {/* Marca */}
            <div>
              <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">
                Marca *
              </label>
              <select
                name="marca_id"
                value={form.marca_id}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded-lg text-sm border focus:outline-none focus:border-green-400 cursor-pointer ${
                  isDark
                    ? "bg-zinc-900 border-zinc-700 text-white"
                    : "bg-zinc-50 border-zinc-300 text-zinc-900"
                }`}
              >
                {marcas.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Tipo */}
            <div>
              <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">
                Tipo / Categoría *
              </label>
              <select
                name="tipo_vehiculo_id"
                value={form.tipo_vehiculo_id}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded-lg text-sm border focus:outline-none focus:border-green-400 cursor-pointer ${
                  isDark
                    ? "bg-zinc-900 border-zinc-700 text-white"
                    : "bg-zinc-50 border-zinc-300 text-zinc-900"
                }`}
              >
                {tiposVehiculos.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Año / Modelo */}
            <div>
              <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">
                Año de Modelo
              </label>
              <input
                type="number"
                name="modelo"
                value={form.modelo}
                onChange={handleChange}
                placeholder="Ej: 2023"
                className={`w-full px-3 py-2 rounded-lg text-sm border focus:outline-none focus:border-green-400 ${
                  isDark
                    ? "bg-zinc-900 border-zinc-700 text-white"
                    : "bg-zinc-50 border-zinc-300 text-zinc-900"
                }`}
              />
            </div>

            {/* Stock */}
            <div>
              <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">
                Stock *
              </label>
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                min="0"
                className={`w-full px-3 py-2 rounded-lg text-sm border focus:outline-none focus:border-green-400 ${
                  isDark
                    ? "bg-zinc-900 border-zinc-700 text-white"
                    : "bg-zinc-50 border-zinc-300 text-zinc-900"
                }`}
              />
            </div>

            {/* URL Imagen */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">
                URL de Imagen
              </label>
              <input
                type="url"
                name="url_image"
                value={form.url_image}
                onChange={handleChange}
                placeholder="https://..."
                className={`w-full px-3 py-2 rounded-lg text-sm border focus:outline-none focus:border-green-400 ${
                  isDark
                    ? "bg-zinc-900 border-zinc-700 text-white"
                    : "bg-zinc-50 border-zinc-300 text-zinc-900"
                }`}
              />
            </div>

            {/* Estado Uso */}
            <div>
              <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">
                Condición
              </label>
              <select
                name="estado_uso"
                value={form.estado_uso}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded-lg text-sm border focus:outline-none focus:border-green-400 cursor-pointer ${
                  isDark
                    ? "bg-zinc-900 border-zinc-700 text-white"
                    : "bg-zinc-50 border-zinc-300 text-zinc-900"
                }`}
              >
                <option value="nuevo">Nuevo / 0 Km</option>
                <option value="usado">Usado Certificado</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className={`w-full py-3 rounded-xl font-bold transition-all cursor-pointer ${
                editandoId
                  ? "bg-amber-400 hover:bg-amber-500 text-zinc-950"
                  : "bg-green-400 hover:bg-green-500 text-zinc-950"
              }`}
            >
              {submitting
                ? "Guardando..."
                : editandoId
                ? "Guardar Modificaciones (PUT)"
                : "Crear Vehículo (POST)"}
            </button>
          </div>
        </form>
      </div>

      {/* Lista Compacta de Productos para Gestión (con lápiz y basurero) */}
      <div
        className={`p-6 sm:p-8 rounded-2xl border shadow-xl ${
          isDark
            ? "bg-zinc-800 border-zinc-700"
            : "bg-white border-zinc-200"
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2
            className={`text-xl font-bold ${
              isDark ? "text-white" : "text-zinc-900"
            }`}
          >
            📋 Listado de Vehículos Registrados
          </h2>
          <button
            onClick={cargarDatos}
            className="text-xs text-zinc-400 hover:text-white bg-zinc-700 px-3 py-1.5 rounded-lg cursor-pointer"
          >
            🔄 Actualizar
          </button>
        </div>

        {loading ? (
          <p className="text-center py-8 text-zinc-400">Cargando unidades...</p>
        ) : vehiculos.length === 0 ? (
          <p className="text-center py-8 text-zinc-400">No hay vehículos en la base de datos.</p>
        ) : (
          <div className="divide-y divide-zinc-700/50">
            {vehiculos.map((v) => (
              <div
                key={v.id}
                className={`py-3.5 px-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl transition-colors ${
                  editandoId === v.id
                    ? isDark
                      ? "bg-amber-950/30 border border-amber-600/40"
                      : "bg-amber-50 border border-amber-300"
                    : isDark
                    ? "hover:bg-zinc-750"
                    : "hover:bg-zinc-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-zinc-400 bg-zinc-900 px-2 py-1 rounded">
                    #{v.id}
                  </span>
                  <div>
                    <h3
                      className={`font-bold text-base ${
                        isDark ? "text-white" : "text-zinc-900"
                      }`}
                    >
                      {v.nombre}
                    </h3>
                    <p className="text-xs text-zinc-400">
                      <span>{obtenerNombreMarca(v.marca_id)}</span> •{" "}
                      <span>{obtenerNombreTipo(v.tipo_vehiculo_id)}</span> • Año{" "}
                      <span>{v.modelo || "-"}</span> • Stock:{" "}
                      <span className="font-semibold text-zinc-300">{v.stock}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-auto">
                  <span className="font-extrabold text-green-500 text-lg">
                    ${Number(v.precio).toLocaleString("es-AR")}
                  </span>

                  {/* Botón Lápiz: Editar */}
                  <button
                    onClick={() => iniciarEdicion(v)}
                    className="p-2 bg-amber-500/20 hover:bg-amber-500/40 text-amber-400 rounded-lg cursor-pointer transition-colors"
                    title="Editar datos de este vehículo (PUT)"
                  >
                    ✏️
                  </button>

                  {/* Botón Basurero: Eliminar */}
                  <button
                    onClick={() => handleEliminar(v.id, v.nombre)}
                    className="p-2 bg-rose-500/20 hover:bg-rose-500/40 text-rose-400 rounded-lg cursor-pointer transition-colors"
                    title="Eliminar este vehículo de la BD (DELETE)"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}