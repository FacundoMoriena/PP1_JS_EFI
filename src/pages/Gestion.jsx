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

  const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

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
        setError("Error de comunicación con el backend.");
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
      newErrors.nombre = "El nombre de la unidad es requerido.";
    } else if (form.nombre.trim().length < 3) {
      newErrors.nombre = "Debe tener al menos 3 caracteres.";
    }

    if (!form.precio) {
      newErrors.precio = "El valor de plaza es obligatorio.";
    } else if (Number(form.precio) <= 0) {
      newErrors.precio = "Debe ser un importe mayor a cero.";
    }

    if (!form.stock && form.stock !== 0) {
      newErrors.stock = "El stock es requerido.";
    } else if (Number(form.stock) < 0) {
      newErrors.stock = "No puede registrar stock negativo.";
    }

    if (form.modelo && (Number(form.modelo) < 1900 || Number(form.modelo) > 2030)) {
      newErrors.modelo = "Año de modelo inválido.";
    }

    if (form.descripcion && form.descripcion.length > 500) {
      newErrors.descripcion = "La descripción no puede superar los 500 caracteres.";
    }

    if (!form.marca_id) {
      newErrors.marca_id = "Seleccioná una marca fabricante.";
    }

    if (!form.tipo_vehiculo_id) {
      newErrors.tipo_vehiculo_id = "Seleccioná la categoría correspondiente.";
    }

    return newErrors;
  };

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
          errorData.detail?.[0]?.msg || errorData.detail || "Error en la operación del servidor"
        );
      }

      setFeedback({
        tipo: "exito",
        mensaje: editandoId
          ? `Unidad #${editandoId} actualizada con éxito (operación PUT).`
          : `Vehículo "${form.nombre}" registrado en inventario (operación POST).`,
      });

      cancelarEdicion();
      cargarDatos();
    } catch (err) {
      console.error("Error al guardar:", err);
      setFeedback({
        tipo: "error",
        mensaje: err.message || "No se pudo procesar la solicitud.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEliminar = async (id, nombre) => {
    const confirmar = window.confirm(
      `Confirmación requerida:\n¿Deseas dar de baja definitivamente el vehículo "${nombre}" (ID #${id}) de la base de datos?`
    );
    if (!confirmar) return;

    try {
      const res = await fetch(`${API_URL}/vehiculos/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("No fue posible procesar la baja.");
      }

      setVehiculos((prev) => prev.filter((item) => item.id !== id));
      if (editandoId === id) cancelarEdicion();

      setFeedback({
        tipo: "exito",
        mensaje: `Unidad "${nombre}" dada de baja correctamente (operación DELETE).`,
      });
    } catch (err) {
      console.error("Error al eliminar:", err);
      alert("Error al eliminar: " + err.message);
    }
  };

  const obtenerNombreMarca = (id) =>
    marcas.find((m) => m.id === id)?.nombre || "General";

  const obtenerNombreTipo = (id) =>
    tiposVehiculos.find((t) => t.id === id)?.nombre || "Vehículo";

  // Guardia de Acceso de Administrador
  if (!user.admin) {
    return (
      <section className="flex flex-col items-center justify-center py-28 text-center max-w-md mx-auto">
        <div className="w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center mb-5 text-zinc-400">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2
          className={`text-xl font-bold tracking-tight mb-2 ${
            isDark ? "text-white" : "text-slate-900"
          }`}
        >
          Acceso Restringido
        </h2>
        <p className="text-xs text-zinc-500 leading-relaxed mb-6">
          El panel de gestión de base de datos está reservado para personal autorizado.
          Puedes alternar el modo administrador desde el botón en la barra superior.
        </p>
      </section>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      {/* Cabecera del Panel */}
      <div className="border-b pb-6 border-zinc-800">
        <span className="text-[11px] font-bold tracking-widest uppercase text-blue-500">
          Administración de Base de Datos
        </span>
        <h1
          className={`text-3xl font-black tracking-tight mt-1 ${
            isDark ? "text-white" : "text-slate-900"
          }`}
        >
          Panel de Control de Inventario
        </h1>
        <p
          className={`text-xs mt-1 ${
            isDark ? "text-zinc-400" : "text-slate-500"
          }`}
        >
          Operaciones CRUD directas sobre la base de datos de Alboriena Motors.
        </p>
      </div>

      {/* Alerta de Feedback */}
      {feedback.mensaje && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center justify-between border transition-all ${
            feedback.tipo === "exito"
              ? isDark
                ? "bg-blue-950/40 border-blue-500/40 text-blue-300"
                : "bg-blue-50 border-blue-300 text-blue-800"
              : isDark
              ? "bg-rose-950/40 border-rose-500/40 text-rose-300"
              : "bg-rose-50 border-rose-300 text-rose-800"
          }`}
        >
          <span>{feedback.mensaje}</span>
          <button
            onClick={() => setFeedback({ tipo: "", mensaje: "" })}
            className="text-[11px] underline cursor-pointer ml-4 font-bold"
          >
            Cerrar
          </button>
        </div>
      )}

      {/* Formulario Modular (Crear / Editar) */}
      <div
        className={`p-6 sm:p-8 rounded-2xl border ${
          isDark
            ? "bg-zinc-900 border-zinc-800 shadow-xl shadow-black/30"
            : "bg-white border-slate-200 shadow-md"
        }`}
      >
        <div className="flex justify-between items-center mb-6 border-b pb-4 border-zinc-800">
          <div>
            <h2
              className={`text-base font-bold uppercase tracking-wider ${
                editandoId ? "text-amber-500" : "text-blue-500"
              }`}
            >
              {editandoId ? `Modificar Unidad #${editandoId}` : "Registrar Nueva Unidad"}
            </h2>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              {editandoId
                ? "Actualizá los campos y confirmá la petición PUT a la API."
                : "Completá los datos obligatorios para emitir la petición POST a la base de datos."}
            </p>
          </div>

          {editandoId && (
            <button
              onClick={cancelarEdicion}
              className="text-xs text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded-lg border border-zinc-700 cursor-pointer transition-colors"
            >
              Cancelar Edición
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* Nombre */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">
                Nombre de la Unidad *
              </label>
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Ej: Toyota Corolla XEI"
                className={`w-full px-3 py-2 rounded-lg text-xs font-medium border focus:outline-none focus:border-blue-500 ${
                  formErrors.nombre
                    ? "border-rose-500"
                    : isDark
                    ? "bg-zinc-950 border-zinc-800 text-white"
                    : "bg-slate-50 border-slate-300 text-slate-900"
                }`}
              />
              {formErrors.nombre && (
                <p className="text-[10px] text-rose-400 mt-1">{formErrors.nombre}</p>
              )}
            </div>

            {/* Precio */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">
                Precio (USD) *
              </label>
              <input
                type="number"
                name="precio"
                value={form.precio}
                onChange={handleChange}
                placeholder="Ej: 28500"
                className={`w-full px-3 py-2 rounded-lg text-xs font-medium border focus:outline-none focus:border-blue-500 ${
                  formErrors.precio
                    ? "border-rose-500"
                    : isDark
                    ? "bg-zinc-950 border-zinc-800 text-white"
                    : "bg-slate-50 border-slate-300 text-slate-900"
                }`}
              />
              {formErrors.precio && (
                <p className="text-[10px] text-rose-400 mt-1">{formErrors.precio}</p>
              )}
            </div>

            {/* Marca */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">
                Marca Fabricante *
              </label>
              <select
                name="marca_id"
                value={form.marca_id}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded-lg text-xs font-medium border focus:outline-none focus:border-blue-500 cursor-pointer ${
                  isDark
                    ? "bg-zinc-950 border-zinc-800 text-white"
                    : "bg-slate-50 border-slate-300 text-slate-900"
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
              <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">
                Segmento / Categoría *
              </label>
              <select
                name="tipo_vehiculo_id"
                value={form.tipo_vehiculo_id}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded-lg text-xs font-medium border focus:outline-none focus:border-blue-500 cursor-pointer ${
                  isDark
                    ? "bg-zinc-950 border-zinc-800 text-white"
                    : "bg-slate-50 border-slate-300 text-slate-900"
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
              <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">
                Año de Modelo
              </label>
              <input
                type="number"
                name="modelo"
                value={form.modelo}
                onChange={handleChange}
                placeholder="Ej: 2024"
                className={`w-full px-3 py-2 rounded-lg text-xs font-medium border focus:outline-none focus:border-blue-500 ${
                  isDark
                    ? "bg-zinc-950 border-zinc-800 text-white"
                    : "bg-slate-50 border-slate-300 text-slate-900"
                }`}
              />
            </div>

            {/* Stock */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">
                Stock Inicial *
              </label>
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                min="0"
                className={`w-full px-3 py-2 rounded-lg text-xs font-medium border focus:outline-none focus:border-blue-500 ${
                  isDark
                    ? "bg-zinc-950 border-zinc-800 text-white"
                    : "bg-slate-50 border-slate-300 text-slate-900"
                }`}
              />
            </div>

            {/* URL Imagen */}
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">
                URL de Fotografía
              </label>
              <input
                type="url"
                name="url_image"
                value={form.url_image}
                onChange={handleChange}
                placeholder="https://..."
                className={`w-full px-3 py-2 rounded-lg text-xs font-medium border focus:outline-none focus:border-blue-500 ${
                  isDark
                    ? "bg-zinc-950 border-zinc-800 text-white"
                    : "bg-slate-50 border-slate-300 text-slate-900"
                }`}
              />
            </div>

            {/* Condición */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">
                Condición
              </label>
              <select
                name="estado_uso"
                value={form.estado_uso}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded-lg text-xs font-medium border focus:outline-none focus:border-blue-500 cursor-pointer ${
                  isDark
                    ? "bg-zinc-950 border-zinc-800 text-white"
                    : "bg-slate-50 border-slate-300 text-slate-900"
                }`}
              >
                <option value="nuevo">0 Km / Nuevo</option>
                <option value="usado">Usado Certificado</option>
              </select>
            </div>

            {/* Descripción de la Unidad */}
            <div className="sm:col-span-2 md:col-span-3">
              <div className="flex justify-between items-center mb-1">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  Descripción Técnica y Equipamiento
                </label>
                <span className="text-[10px] text-zinc-500 font-mono">
                  {form.descripcion.length}/500
                </span>
              </div>
              <textarea
                name="descripcion"
                rows="3"
                value={form.descripcion}
                onChange={handleChange}
                placeholder="Detallá el motor, estado general, equipamiento o características relevantes de la unidad..."
                className={`w-full px-3 py-2 rounded-lg text-xs font-medium border focus:outline-none focus:border-blue-500 ${
                  formErrors.descripcion
                    ? "border-rose-500"
                    : isDark
                    ? "bg-zinc-950 border-zinc-800 text-white"
                    : "bg-slate-50 border-slate-300 text-slate-900"
                }`}
              ></textarea>
              {formErrors.descripcion && (
                <p className="text-[10px] text-rose-400 mt-1">{formErrors.descripcion}</p>
              )}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                editandoId
                  ? "bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/20"
                  : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20"
              }`}
            >
              {submitting
                ? "Sincronizando..."
                : editandoId
                ? "Guardar Cambios (Operación PUT)"
                : "Registrar Vehículo (Operación POST)"}
            </button>
          </div>
        </form>
      </div>

      {/* Lista Compacta de Inventario (con botones Lápiz y Basurero) */}
      <div
        className={`p-6 sm:p-8 rounded-2xl border ${
          isDark
            ? "bg-zinc-900 border-zinc-800"
            : "bg-white border-slate-200 shadow-sm"
        }`}
      >
        <div className="flex justify-between items-center mb-6 border-b pb-4 border-zinc-800">
          <div>
            <h2
              className={`text-base font-bold uppercase tracking-wider ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              Inventario Registrado ({vehiculos.length} unidades)
            </h2>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              Acciones de modificación (PUT) y eliminación (DELETE) por fila.
            </p>
          </div>
          <button
            onClick={cargarDatos}
            className="text-xs text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded-lg border border-zinc-700 cursor-pointer transition-colors"
          >
            Actualizar
          </button>
        </div>

        {loading ? (
          <p className="text-center py-10 text-xs text-zinc-500">Actualizando lista...</p>
        ) : vehiculos.length === 0 ? (
          <p className="text-center py-10 text-xs text-zinc-500">No hay registros cargados en la base de datos.</p>
        ) : (
          <div className="divide-y divide-zinc-800/80">
            {vehiculos.map((v) => (
              <div
                key={v.id}
                className={`py-3.5 px-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl transition-colors ${
                  editandoId === v.id
                    ? isDark
                      ? "bg-amber-500/10 border border-amber-500/30"
                      : "bg-amber-50 border border-amber-300"
                    : isDark
                    ? "hover:bg-zinc-850"
                    : "hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] text-zinc-500 bg-zinc-950 px-2 py-1 rounded border border-zinc-800">
                    #{v.id}
                  </span>
                  <div>
                    <h3
                      className={`font-bold text-sm tracking-tight ${
                        isDark ? "text-white" : "text-slate-900"
                      }`}
                    >
                      {v.nombre}
                    </h3>
                    <p className="text-[11px] text-zinc-500 mt-0.5">
                      <span>{obtenerNombreMarca(v.marca_id)}</span> •{" "}
                      <span>{obtenerNombreTipo(v.tipo_vehiculo_id)}</span> • Año{" "}
                      <span>{v.modelo || "-"}</span> • Stock:{" "}
                      <span className="font-semibold text-zinc-400">{v.stock}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-auto">
                  <span className="font-black text-blue-500 text-base">
                    USD ${Number(v.precio).toLocaleString("en-US")}
                  </span>

                  {/* Botón Lápiz: Editar (PUT) */}
                  <button
                    onClick={() => iniciarEdicion(v)}
                    className="p-2 rounded-lg bg-zinc-800 hover:bg-amber-500/20 text-zinc-400 hover:text-amber-400 border border-zinc-700/80 transition-colors cursor-pointer"
                    title="Editar datos de este vehículo (operación PUT)"
                    aria-label="Editar"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>

                  {/* Botón Basurero: Eliminar (DELETE) */}
                  <button
                    onClick={() => handleEliminar(v.id, v.nombre)}
                    className="p-2 rounded-lg bg-zinc-800 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 border border-zinc-700/80 transition-colors cursor-pointer"
                    title="Eliminar este vehículo de la BD (operación DELETE)"
                    aria-label="Eliminar"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
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
