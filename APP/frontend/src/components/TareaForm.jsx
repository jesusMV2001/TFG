import { useState, useEffect } from "react";
import api from "../api";

/**
 * Componente formulario para crear y editar tareas
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Function} props.onAddTarea - Función para manejar la creación/actualización de la tarea
 * @param {Object} [props.initialData={}] - Datos iniciales de la tarea para edición
 * @returns {JSX.Element}
 */
function TareaForm({ onAddTarea, initialData = {}, showToast }) {
    /**
     * Formatea una fecha al formato YYYY-MM-DD requerido por el input type="date"
     * 
     * @param {string|Date} date - Fecha a formatear
     * @returns {string} Fecha formateada
     */
    const formatDate = (date) => {
        if (!date) return "";
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const [titulo, setTitulo] = useState(initialData.titulo || "");
    const [descripcion, setDescripcion] = useState(initialData.descripcion || "");
    const [estado, setEstado] = useState(initialData.estado || "pendiente");
    const [prioridad, setPrioridad] = useState(initialData.prioridad || "media");
    const [fechaVencimiento, setFechaVencimiento] = useState(formatDate(initialData.fecha_vencimiento));
    const [etiquetas, setEtiquetas] = useState(initialData.etiquetas || []);
    const [todasEtiquetas, setTodasEtiquetas] = useState([]);
    const [nuevaEtiqueta, setNuevaEtiqueta] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (initialData.id) {
            api.get(`/api/tareas/${initialData.id}/etiquetas/`)
                .then((response) => {
                    setTodasEtiquetas(response.data);
                })
                .catch((error) => {
                    console.error("Error al obtener etiquetas:", error);
                    setError("Error al cargar las etiquetas.");
                });
        }
    }, [initialData.id]);

    useEffect(() => {
        if (initialData.etiquetas) {
            setEtiquetas(initialData.etiquetas);
            setTodasEtiquetas(initialData.etiquetas);
        }
    }, [initialData.etiquetas]);

    /**
     * Maneja el envío del formulario
     * 
     * @param {Event} e - Evento del formulario
     * @returns {void}
     */
    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        const hoy = new Date();
        const fechaSeleccionada = new Date(fechaVencimiento);
        hoy.setHours(0, 0, 0, 0);

        if (fechaSeleccionada < hoy) {
            setError("La fecha de vencimiento no puede ser menor a la fecha actual.");
            return;
        }

        // Extraer solo los IDs de las etiquetas
        const etiquetasIds = todasEtiquetas.map(etiqueta => etiqueta.id);

        const payload = {
            titulo,
            descripcion,
            estado,
            prioridad,
            fecha_vencimiento: fechaVencimiento || null,
            etiquetas: etiquetasIds,
        };
        onAddTarea(payload);
    };

    /**
     * Maneja la creación de una nueva etiqueta
     * 
     * @returns {Promise<void>}
     */
    const handleCrearEtiqueta = () => {
        if (!nuevaEtiqueta.trim()) {
            setError("El nombre de la etiqueta no puede estar vacío.");
            return;
        }
        if (todasEtiquetas.some((etiqueta) => etiqueta.nombre === nuevaEtiqueta)) {
            setError("La etiqueta ya existe.");
            return;
        }

        api.post("/api/etiquetas/", { nombre: nuevaEtiqueta, tarea_id: initialData.id })
            .then((response) => {
                setTodasEtiquetas((prev) => [...prev, response.data]);
                setEtiquetas((prev) => [...prev, response.data]);
                setNuevaEtiqueta("");
                showToast("Etiqueta creada exitosamente");
            })
            .catch((error) => {
                console.error("Error al crear etiqueta:", error);
                setError("No se pudo crear la etiqueta.");
            });
    };

    /**
     * Maneja la eliminación de una etiqueta
     * 
     * @param {number} etiquetaId - ID de la etiqueta a eliminar
     * @returns {Promise<void>}
     */
    const handleEliminarEtiqueta = (etiquetaId) => {
        api.delete(`/api/etiquetas/delete/${etiquetaId}/`)
            .then(() => {
                setTodasEtiquetas((prev) => prev.filter((etiqueta) => etiqueta.id !== etiquetaId));
                setEtiquetas((prev) => prev.filter((etiqueta) => etiqueta.id !== etiquetaId));
                showToast("Etiqueta eliminada exitosamente");
            })
            .catch((error) => {
                console.error("Error al eliminar etiqueta:", error);
                setError("No se pudo eliminar la etiqueta.");
            });
    };

    return (
        // Formulario para crear o editar una tarea
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
            {error && (
                <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                    {error}
                </p>
            )}

            {/* Tiutlo */}
            <div className="space-y-1">
                <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">
                    Título
                </label>
                <input
                    type="text"
                    id="titulo"
                    name="titulo"
                    placeholder="Título"
                    required
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                />
            </div>

            {/* Descripción */}
            <div className="space-y-1">
                <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">
                    Descripción
                </label>
                <textarea
                    id="descripcion"
                    name="descripcion"
                    placeholder="Descripción"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 min-h-[80px] max-h-[150px] resize-y"
                />
            </div>

            {/* Estado*/}
            <div className="space-y-1">
                <label htmlFor="estado" className="block text-sm font-medium text-gray-700">
                    Estado
                </label>
                <select
                    id="estado"
                    name="estado"
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                >
                    <option value="pendiente">Pendiente</option>
                    <option value="en_progreso">En Progreso</option>
                    <option value="completada">Completada</option>
                </select>
            </div>

            {/* Prioridad */}
            <div className="space-y-1">
                <label htmlFor="prioridad" className="block text-sm font-medium text-gray-700">
                    Prioridad
                </label>
                <select
                    id="prioridad"
                    name="prioridad"
                    value={prioridad}
                    onChange={(e) => setPrioridad(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                >
                    <option value="alta">Alta</option>
                    <option value="media">Media</option>
                    <option value="baja">Baja</option>
                </select>
            </div>

            {/* Fecha de Vencimiento */}
            <div className="space-y-1">
                <label htmlFor="fechaVencimiento" className="block text-sm font-medium text-gray-700">
                    Fecha de Vencimiento
                </label>
                <input
                    type="date"
                    id="fechaVencimiento"
                    name="fechaVencimiento"
                    value={fechaVencimiento}
                    required
                    onChange={(e) => setFechaVencimiento(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                />
            </div>

            {/* Etiquetas */}
            {initialData.id && (
                <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">
                        Etiquetas
                    </label>
                    <ul className="flex flex-wrap gap-2 p-2 border border-gray-200 rounded-lg max-h-32 overflow-y-auto">
                        {todasEtiquetas.map((etiqueta, index) => {
                            // Verificar que la etiqueta tenga id y nombre válidos
                            if (!etiqueta || !etiqueta.id || !etiqueta.nombre) {
                                return null;
                            }

                            return (
                                <li
                                    key={etiqueta.id}
                                    className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-md text-sm"
                                >
                                    {etiqueta.nombre}
                                    <button
                                        type="button"
                                        onClick={() => handleEliminarEtiqueta(etiqueta.id)}
                                        className="text-xs px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                    >
                                        Eliminar
                                    </button>
                                </li>
                            );
                        })}
                    </ul>

                    <div className="flex gap-3">
                        <input
                            type="text"
                            placeholder="Nueva etiqueta"
                            value={nuevaEtiqueta}
                            onChange={(e) => setNuevaEtiqueta(e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                        />
                        <button
                            type="button"
                            onClick={handleCrearEtiqueta}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors whitespace-nowrap"
                        >
                            Crear Etiqueta
                        </button>
                    </div>
                </div>
            )}

            <button
                type="submit"
                className="self-end px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors mt-4 sticky bottom-6"
            >
                Guardar Cambios
            </button>
        </form>
    );
}

export default TareaForm;