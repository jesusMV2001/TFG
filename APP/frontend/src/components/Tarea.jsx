import React from "react";
import "../styles/Tareas.css";

function Tarea({ tarea, onDelete }) {
    const formartDate = (date) => {
        const options = { year: "numeric", month: "long", day: "numeric" };
        return new Date(date).toLocaleDateString("es-ES", options);
    };

    return <div className="tarea-container">
        <div className="tarea-titulo">{tarea.titulo}</div>
        <div className="tarea-descripcion">{tarea.descripcion}</div>
        <div className="tarea-fecha">{formartDate(tarea.fecha_vencimiento)}</div>
        <button onClick={() => onDelete(tarea.id)}>Eliminar</button>
    </div>
}

export default Tarea;