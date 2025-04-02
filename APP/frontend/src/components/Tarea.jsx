import React, { useState } from "react";
import TareaForm from "./TareaForm";
import ModalTarea from "./ModalTarea";
import api from "../api";
import ComentariosList from "./ComentariosList";

function Tarea({ tarea, onDelete, onUpdate, onDragStart }) {
    const [isModalModificarOpen, setIsModalModificarOpen] = useState(false);
    const [isModalVerOpen, setIsModalVerOpen] = useState(false);
    const [historial, setHistorial] = useState([]);
    const [isComentariosOpen, setIsComentariosOpen] = useState(false);

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
                className="flex items-center p-4 mb-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-200"
                draggable
                onDragStart={(e) => onDragStart(e, tarea.id)}
            >
                {/* Información de la tarea */}
                <div className="flex-grow">
                    <h3 className="text-base font-semibold text-gray-800 truncate max-w-[500px]">
                        {tarea.titulo}
                    </h3>
                    <div className="flex items-center gap-3 text-sm mt-1">
                        <span className="text-gray-500 whitespace-nowrap">
                            {new Date(tarea.fecha_vencimiento).toLocaleDateString()}
                        </span>
                        <span className={`font-medium whitespace-nowrap ${prioridadColor[tarea.prioridad]}`}>
                            {tarea.prioridad.charAt(0).toUpperCase() + tarea.prioridad.slice(1)}
                        </span>
                    </div>
                </div>

                {/* Botones */}
                <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                        onClick={handleViewDetails}
                        className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium text-white bg-cyan-600 hover:bg-cyan-700 rounded transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    </button>
                    <button
                        onClick={() => setIsComentariosOpen(true)}
                        className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium text-white bg-purple-600 hover:bg-purple-700 rounded transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </button>
                    <button
                        onClick={() => setIsModalModificarOpen(true)}
                        className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>
                    <button
                        onClick={() => onDelete(tarea.id)}
                        className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
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
            <ModalTarea isOpen={isComentariosOpen} onClose={() => setIsComentariosOpen(false)}>
                <ComentariosList tareaId={tarea.id} onClose={() => setIsComentariosOpen(false)} />
            </ModalTarea>
        </div>
    );
}

export default Tarea;