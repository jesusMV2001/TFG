import { useState } from "react";
import "../styles/TareaForm.css";

function TareaForm({ onAddTarea }) {
    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [estado, setEstado] = useState("pendiente");
    const [prioridad, setPrioridad] = useState("media");
    const [fechaVencimiento, setFechaVencimiento] = useState("");
    const [error, setError] = useState(""); // Estado para manejar errores

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(""); // Limpiar errores previos

        // Validar que la fecha de vencimiento no sea menor a la fecha actual
        const hoy = new Date();
        const fechaSeleccionada = new Date(fechaVencimiento);
        hoy.setHours(0, 0, 0, 0); // Eliminar la hora para comparar solo la fecha

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
        onAddTarea(payload); // Llama a la función pasada como prop
        setTitulo("");
        setDescripcion("");
        setEstado("pendiente");
        setPrioridad("media");
        setFechaVencimiento("");
    };

    return (
        <form onSubmit={handleSubmit} className="tarea-form">
            {error && <p className="tarea-form-error">{error}</p>} {/* Mostrar mensaje de error */}
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

            <button type="submit" className="tarea-form-button">Añadir Tarea</button>
        </form>
    );
}

export default TareaForm;