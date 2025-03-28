import React, { useState } from "react";
import "../styles/Tareas.css";
import TareaForm from "./TareaForm";
import ModalTarea from "./ModalTarea";

function Tarea({ tarea, onDelete, onUpdate }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleUpdate = (updatedTarea) => {
        onUpdate(tarea.id, updatedTarea);
        setIsModalOpen(false); // Cerrar el modal después de actualizar
    };

    return (
        <div>
            <div className="tarea-container">
                <div className="tarea-titulo">{tarea.titulo}</div>
                <div className="tarea-descripcion">{tarea.descripcion}</div>
                <div className="tarea-fecha">{new Date(tarea.fecha_vencimiento).toLocaleDateString()}</div>
                <div className="tarea-buttons">
                    <button className="btn-modificar" onClick={() => setIsModalOpen(true)}>Modificar</button>
                    <button className="btn-borrar" onClick={() => onDelete(tarea.id)}>Eliminar</button>
                </div>
            </div>
            <ModalTarea isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <TareaForm
                    onAddTarea={handleUpdate}
                    initialData={tarea} // Pasar los datos actuales de la tarea
                />
            </ModalTarea>
        </div>
        
    );
}

export default Tarea;