import React, { useState } from "react";
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
        }).catch((error) => {
            alert("Error al obtener el historial de cambios");
            console.log(error);
        });
    };

    const handleViewDetails = () => {
        fetchHistorial();
        setIsModalVerOpen(true);
    };

    const handleUpdate = (updatedTarea) => {
        onUpdate(tarea.id, updatedTarea);
        setIsModalModificarOpen(false);
    };

    const prioridadColor = {
        alta: 'text-red-600',
        media: 'text-yellow-600',
        baja: 'text-green-600'
    };

    return (
        <div>
            <div 
                className="flex items-center justify-between p-4 mb-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-200"
                draggable 
                onDragStart={(e) => onDragStart(e, tarea.id)}
            >
                <div className="flex flex-col gap-1">
                    <h3 className="text-base font-semibold text-gray-800">
                        {tarea.titulo}
                    </h3>
                    <span className="text-sm text-gray-500">
                        {new Date(tarea.fecha_vencimiento).toLocaleDateString()}
                    </span>
                    <span className={`text-sm font-medium ${prioridadColor[tarea.prioridad]}`}>
                        Prioridad: {tarea.prioridad.charAt(0).toUpperCase() + tarea.prioridad.slice(1)}
                    </span>
                </div>
                
                <div className="flex items-center gap-2">
                    <button 
                        onClick={handleViewDetails}
                        className="px-3 py-1.5 text-sm text-white bg-cyan-600 hover:bg-cyan-700 rounded transition-colors"
                    >
                        Ver Detalles
                    </button>
                    <button 
                        onClick={() => setIsModalModificarOpen(true)}
                        className="px-3 py-1.5 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                    >
                        Modificar
                    </button>
                    <button 
                        onClick={() => onDelete(tarea.id)}
                        className="px-3 py-1.5 text-sm text-white bg-red-600 hover:bg-red-700 rounded transition-colors"
                    >
                        Eliminar
                    </button>
                </div>
            </div>

            <ModalTarea isOpen={isModalModificarOpen} onClose={() => setIsModalModificarOpen(false)}>
                <TareaForm onAddTarea={handleUpdate} initialData={tarea} />
            </ModalTarea>

            <ModalTarea isOpen={isModalVerOpen} onClose={() => setIsModalVerOpen(false)}>
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-800">Detalles de la Tarea</h2>
                    
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        <p className="flex gap-2">
                            <span className="font-semibold text-gray-700 min-w-[120px]">Título:</span>
                            <span>{tarea.titulo}</span>
                        </p>
                        <p className="flex gap-2">
                            <span className="font-semibold text-gray-700 min-w-[120px]">Estado:</span>
                            <span>{tarea.estado.charAt(0).toUpperCase() + tarea.estado.slice(1)}</span>
                        </p>
                        <p className="flex gap-2">
                            <span className="font-semibold text-gray-700 min-w-[120px]">Prioridad:</span>
                            <span className={prioridadColor[tarea.prioridad]}>
                                {tarea.prioridad.charAt(0).toUpperCase() + tarea.prioridad.slice(1)}
                            </span>
                        </p>
                        <p className="flex gap-2">
                            <span className="font-semibold text-gray-700 min-w-[120px]">Fecha Creación:</span>
                            <span>{new Date(tarea.fecha_creacion).toLocaleDateString()}</span>
                        </p>
                        <p className="flex gap-2">
                            <span className="font-semibold text-gray-700 min-w-[120px]">Vencimiento:</span>
                            <span>{new Date(tarea.fecha_vencimiento).toLocaleDateString()}</span>
                        </p>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                        <p className="flex gap-2">
                            <span className="font-semibold text-gray-700 min-w-[120px]">Descripción:</span>
                            <span>{tarea.descripcion || "Sin descripción"}</span>
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-800">Historial de Cambios</h3>
                        {historial.length > 0 ? (
                            <ul className="space-y-3">
                                {historial.map((cambio) => (
                                    <li key={cambio.id} className="bg-white border border-gray-200 rounded-lg p-4 space-y-2">
                                        <p className="flex gap-2">
                                            <span className="font-semibold text-gray-700 min-w-[80px]">Acción:</span>
                                            <span>{cambio.accion}</span>
                                        </p>
                                        <p className="flex gap-2">
                                            <span className="font-semibold text-gray-700 min-w-[80px]">Fecha:</span>
                                            <span>{new Date(cambio.fecha_cambio).toLocaleDateString()}</span>
                                        </p>
                                        <p className="flex gap-2">
                                            <span className="font-semibold text-gray-700 min-w-[80px]">Usuario:</span>
                                            <span>{cambio.usuario || "Desconocido"}</span>
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500 italic">No hay historial de cambios.</p>
                        )}
                    </div>
                </div>
            </ModalTarea>
        </div>
    );
}

export default Tarea;