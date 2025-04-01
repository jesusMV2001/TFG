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
    <div className="space-y-8">
        {/* Header */}
        <div className="border-b border-gray-200 pb-4">
            <h2 className="text-2xl font-bold text-gray-800">
                {tarea.titulo}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
                Creada el {new Date(tarea.fecha_creacion).toLocaleDateString()}
            </p>
        </div>
        
        {/* Main Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Status Info */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span className="text-sm font-medium text-gray-600">Estado</span>
                </div>
                <p className="text-lg font-semibold">
                    {tarea.estado.charAt(0).toUpperCase() + tarea.estado.slice(1)}
                </p>
                
                <div className="flex items-center gap-2 mt-6">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span className="text-sm font-medium text-gray-600">Prioridad</span>
                </div>
                <p className={`text-lg font-semibold ${prioridadColor[tarea.prioridad]}`}>
                    {tarea.prioridad.charAt(0).toUpperCase() + tarea.prioridad.slice(1)}
                </p>
            </div>

            {/* Right Column - Dates Info */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span className="text-sm font-medium text-gray-600">Fecha de Vencimiento</span>
                </div>
                <p className="text-lg font-semibold">
                    {new Date(tarea.fecha_vencimiento).toLocaleDateString()}
                </p>

                <div className="flex items-center gap-2 mt-6">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span className="text-sm font-medium text-gray-600">Tiempo Restante</span>
                </div>
                <p className="text-lg font-semibold">
                    {Math.ceil((new Date(tarea.fecha_vencimiento) - new Date()) / (1000 * 60 * 60 * 24))} días
                </p>
            </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className="text-sm font-medium text-gray-600">Descripción</span>
            </div>
            <p className="text-gray-700 leading-relaxed">
                {tarea.descripcion || "Sin descripción"}
            </p>
        </div>

        {/* History Section */}
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <h3 className="text-lg font-semibold text-gray-800">Historial de Cambios</h3>
            </div>
            {historial.length > 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <ul className="divide-y divide-gray-200">
                        {historial.map((cambio) => (
                            <li key={cambio.id} className="p-4 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-gray-800">{cambio.accion}</p>
                                        <p className="text-sm text-gray-500">
                                            Por: {cambio.usuario || "Desconocido"}
                                        </p>
                                    </div>
                                    <span className="text-sm text-gray-500">
                                        {new Date(cambio.fecha_cambio).toLocaleDateString()}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p className="text-gray-500 italic bg-gray-50 p-4 rounded-lg">
                    No hay historial de cambios.
                </p>
            )}
        </div>
    </div>
</ModalTarea>
        </div>
    );
}

export default Tarea;