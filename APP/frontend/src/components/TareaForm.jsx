import { useState } from "react";
import "../styles/TareaForm.css";

function TareaForm({ onAddTarea, initialData = {} }) {
    // Función para formatear la fecha al formato "YYYY-MM-DD"
    const formatDate = (date) => {
        if (!date) return "";
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0"); // Asegurar que el mes tenga 2 dígitos
        const day = String(d.getDate()).padStart(2, "0"); // Asegurar que el día tenga 2 dígitos
        return `${year}-${month}-${day}`;
    };

    const [titulo, setTitulo] = useState(initialData.titulo || "");
    const [descripcion, setDescripcion] = useState(initialData.descripcion || "");
    const [estado, setEstado] = useState(initialData.estado || "pendiente");
    const [prioridad, setPrioridad] = useState(initialData.prioridad || "media");
    const [fechaVencimiento, setFechaVencimiento] = useState(formatDate(initialData.fecha_vencimiento));
    const [error, setError] = useState("");

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
        };
        onAddTarea(payload);
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

            <button type="submit" className="tarea-form-button">Guardar Cambios</button>
        </form>
    );
}

export default TareaForm;