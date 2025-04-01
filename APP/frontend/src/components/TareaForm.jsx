import { useState, useEffect } from "react";
import "../styles/TareaForm.css";
import api from "../api";

function TareaForm({ onAddTarea, initialData = {} }) {
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
            api.get(`/api/etiquetas/?tarea_id=${initialData.id}`)
                .then((response) => {
                    setTodasEtiquetas(response.data);
                })
                .catch((error) => {
                    console.error("Error al obtener etiquetas:", error);
                    setError("Error al cargar las etiquetas.");
                });
        }
    }, [initialData.id]);

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

        const payload = {
            titulo,
            descripcion,
            estado,
            prioridad,
            fecha_vencimiento: fechaVencimiento || null,
            etiquetas,
        };
        onAddTarea(payload);
    };

    const handleEtiquetaChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions);
        const selectedIds = selectedOptions.map((option) => option.value);
        setEtiquetas(selectedIds);
    };

    const handleCrearEtiqueta = () => {
        if (!nuevaEtiqueta.trim()) {
            setError("El nombre de la etiqueta no puede estar vacío.");
            return;
        }
    
        api.post("/api/etiquetas/", { nombre: nuevaEtiqueta, tarea_id: initialData.id })
            .then((response) => {
                setTodasEtiquetas((prev) => [...prev, response.data]);
                setNuevaEtiqueta("");
            })
            .catch((error) => {
                console.error("Error al crear etiqueta:", error);
                setError("No se pudo crear la etiqueta.");
            });
    };

    const handleEliminarEtiqueta = (etiquetaId) => {
        api.delete(`/api/etiquetas/delete/${etiquetaId}/`)
            .then(() => {
                setTodasEtiquetas((prev) => prev.filter((etiqueta) => etiqueta.id !== etiquetaId));
            })
            .catch((error) => {
                console.error("Error al eliminar etiqueta:", error);
                setError("No se pudo eliminar la etiqueta.");
            });
    };

    return (
        <form onSubmit={handleSubmit} className="tarea-form">
            {error && <p className="tarea-form-error">{error}</p>}
            <label htmlFor="titulo" className="tarea-form-label">Título</label>
            <input
                type="text"
                id="titulo"
                name="titulo"
                placeholder="Título"
                required
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="tarea-form-input"
            />

            <label htmlFor="descripcion" className="tarea-form-label">Descripción</label>
            <textarea
                id="descripcion"
                name="descripcion"
                placeholder="Descripción"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="tarea-form-textarea"
            />

            <label htmlFor="estado" className="tarea-form-label">Estado</label>
            <select
                id="estado"
                name="estado"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                className="tarea-form-select"
            >
                <option value="pendiente">Pendiente</option>
                <option value="en_progreso">En Progreso</option>
                <option value="completada">Completada</option>
            </select>

            <label htmlFor="prioridad" className="tarea-form-label">Prioridad</label>
            <select
                id="prioridad"
                name="prioridad"
                value={prioridad}
                onChange={(e) => setPrioridad(e.target.value)}
                className="tarea-form-select"
            >
                <option value="alta">Alta</option>
                <option value="media">Media</option>
                <option value="baja">Baja</option>
            </select>

            <label htmlFor="fechaVencimiento" className="tarea-form-label">Fecha de Vencimiento</label>
            <input
                type="date"
                id="fechaVencimiento"
                name="fechaVencimiento"
                value={fechaVencimiento}
                required
                onChange={(e) => setFechaVencimiento(e.target.value)}
                className="tarea-form-input"
            />

            {initialData.id && (
                <>
                    <label htmlFor="etiquetas" className="tarea-form-label">Etiquetas</label>
                    <ul>
                        {todasEtiquetas.map((etiqueta) => (
                            <li key={etiqueta.id}>
                                {etiqueta.nombre}
                                <button
                                    type="button"
                                    onClick={() => handleEliminarEtiqueta(etiqueta.id)}
                                    className="eliminar-etiqueta-button"
                                >
                                    Eliminar
                                </button>
                            </li>
                        ))}
                    </ul>

                    <div className="crear-etiqueta">
                        <input
                            type="text"
                            placeholder="Nueva etiqueta"
                            value={nuevaEtiqueta}
                            onChange={(e) => setNuevaEtiqueta(e.target.value)}
                            className="tarea-form-input"
                        />
                        <button type="button" onClick={handleCrearEtiqueta} className="tarea-form-button">
                            Crear Etiqueta
                        </button>
                    </div>
                </>
            )}

            <button type="submit" className="tarea-form-button">Guardar Cambios</button>
        </form>
    );
}

export default TareaForm;