import React, { useState } from "react";
import "../styles/Tareas.css";
import TareaForm from "./TareaForm";
import ModalTarea from "./ModalTarea";
import api from "../api";

function Tarea({ tarea, onDelete, onUpdate, onDragStart }) {
    const [isModalModificarOpen, setIsModalModificarOpen] = useState(false);
    const [isModalVerOpen, setIsModalVerOpen] = useState(false);
    const [historial, setHistorial] = useState([]);

    const fetchHistorial = async () => {
        api.get(`/api/tareas/${tarea.id}/historial/`).then((response) => {
            setHistorial(response.data);
        }
        ).catch((error) => {
            alert("Error al obtener el historial de cambios");
            console.log(error);
        });
    };

    const handleViewDetails = () => {
        fetchHistorial(); // Obtener el historial de cambios
        setIsModalVerOpen(true); // Abrir el modal
    };
    const handleUpdate = (updatedTarea) => {
        onUpdate(tarea.id, updatedTarea);
        setIsModalModificarOpen(false); // Cerrar el modal después de actualizar
    };

    return (
        <div>
            <div className="tarea-container" draggable onDragStart={(e) => onDragStart(e, tarea.id)}>
                <div className="tarea-titulo">{tarea.titulo}</div>
                <div className="tarea-fecha">{new Date(tarea.fecha_vencimiento).toLocaleDateString()}</div>
                <div className={`tarea-prioridad prioridad-${tarea.prioridad}`}>
                    Prioridad: {tarea.prioridad.charAt(0).toUpperCase() + tarea.prioridad.slice(1)}
                </div>
                <div className="tarea-buttons">
                    <button className="btn-ver" onClick={handleViewDetails}>Ver Detalles</button>
                    <button className="btn-modificar" onClick={() => setIsModalModificarOpen(true)}>Modificar</button>
                    <button className="btn-borrar" onClick={() => onDelete(tarea.id)}>Eliminar</button>
                </div>
            </div>
            <ModalTarea isOpen={isModalModificarOpen} onClose={() => setIsModalModificarOpen(false)}>
                <TareaForm
                    onAddTarea={handleUpdate}
                    initialData={tarea} // Pasar los datos actuales de la tarea
                />
            </ModalTarea>
            <ModalTarea isOpen={isModalVerOpen} onClose={() => setIsModalVerOpen(false)}>
                <div className="tarea-detalles">
                    <h2>Detalles de la Tarea</h2>
                    <div className="info-section">
                        <p><strong>Título:</strong> {tarea.titulo}</p>
                        <p><strong>Estado:</strong> {tarea.estado.charAt(0).toUpperCase() + tarea.estado.slice(1)}</p>
                        <p><strong>Prioridad:</strong> {tarea.prioridad.charAt(0).toUpperCase() + tarea.prioridad.slice(1)}</p>
                        <p><strong>Fecha Creación:</strong> {new Date(tarea.fecha_creacion).toLocaleDateString()}</p>
                        <p><strong>Vencimiento:</strong> {new Date(tarea.fecha_vencimiento).toLocaleDateString()}</p>
                    </div>
                    
                    <div className="info-section">
                        <p><strong>Descripción:</strong> {tarea.descripcion || "Sin descripción"}</p>
                    </div>

                    <h3>Historial de Cambios</h3>
                    {historial.length > 0 ? (
                        <ul>
                            {historial.map((cambio) => (
                                <li key={cambio.id}>
                                    <p><strong>Acción:</strong> {cambio.accion}</p>
                                    <p><strong>Fecha:</strong> {new Date(cambio.fecha_cambio).toLocaleDateString()}</p>
                                    <p><strong>Usuario:</strong> {cambio.usuario || "Desconocido"}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="no-historial">No hay historial de cambios.</p>
                    )}
                </div>
            </ModalTarea>
        </div>
    );
}

export default Tarea;