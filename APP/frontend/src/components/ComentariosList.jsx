import React, { useState, useEffect } from 'react';
import api from '../api';

/**
 * Componente para mostrar y gestionar los comentarios de una tarea
 * 
 * @param {Object} props - Propiedades del componente
 * @param {number} props.tareaId - ID de la tarea
 * @returns {JSX.Element}
 */
function ComentariosList({ tareaId }) {
    const [comentarios, setComentarios] = useState([]);
    const [nuevoComentario, setNuevoComentario] = useState('');
    const [error, setError] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editingText, setEditingText] = useState('');

    useEffect(() => {
        fetchComentarios();
    }, [tareaId]);

    /**
     * Obtiene los comentarios de una tarea desde la API
     * 
     * @returns {Promise<void>}
     */
    const fetchComentarios = async () => {
        try {
            const response = await api.get(`/api/tareas/${tareaId}/comentarios/`);
            setComentarios(response.data);
        } catch (error) {
            setError('Error al cargar los comentarios');
            console.error(error);
        }
    };

    /**
     * Maneja el envío del formulario para crear un nuevo comentario
     * 
     * @param {Event} e - Evento del formulario
     * @returns {Promise<void>}
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Limpiar errores previos
        if (!nuevoComentario.trim()) {
            setError('El comentario no puede estar vacío');
            return;
        }

        try {
            const payload = {
                texto: nuevoComentario,
                tarea: tareaId
            };


            const response = await api.post(`/api/tareas/${tareaId}/comentarios/`, payload);
            setNuevoComentario('');
            fetchComentarios();
        } catch (error) {
            console.error('Error completo:', error);
            console.error('Respuesta del servidor:', error.response?.data);

            setError(error.response?.data?.detail || 'Error al crear el comentario');
        }
    };

    /**
     * Maneja la eliminación de un comentario
     * 
     * @param {number} comentarioId - ID del comentario a eliminar
     * @returns {Promise<void>}
     */
    const handleDelete = async (comentarioId) => {
        if (!window.confirm('¿Estás seguro de que quieres eliminar este comentario?')) {
            return;
        }

        try {
            await api.delete(`/api/comentarios/delete/${comentarioId}/`);
            // Actualizar la lista de comentarios
            fetchComentarios();
        } catch (error) {
            setError('Error al eliminar el comentario');
            console.error(error);
        }
    };

    /**
     * Prepara la interfaz para editar un comentario
     * 
     * @param {Object} comentario - Objeto comentario con id y texto
     * @returns {void}
     */
    const handleEdit = (comentario) => {
        setEditingId(comentario.id);
        setEditingText(comentario.texto);
    };

    /**
     * Cancela la edición del comentario actual
     * 
     * @returns {void}
     */
    const handleCancelEdit = () => {
        setEditingId(null);
        setEditingText('');
    };

    /**
     * Guarda los cambios realizados en un comentario
     * 
     * @param {number} comentarioId - ID del comentario a actualizar
     * @returns {Promise<void>}
     */
    const handleSaveEdit = async (comentarioId) => {
        if (!editingText.trim()) {
            setError('El comentario no puede estar vacío');
            return;
        }

        try {
            await api.put(`/api/comentarios/update/${comentarioId}/`, {
                texto: editingText,
                tarea: tareaId
            });
            setEditingId(null);
            setEditingText('');
            fetchComentarios();
        } catch (error) {
            setError('Error al actualizar el comentario');
            console.error(error);
        }
    };

    return (
        <div className="p-4 space-y-4">

            {/* Mensaje de error */}
            {error && (
                <p className="text-red-500 text-sm">{error}</p>
            )}

            {/* Introducir comentario y boton de enviar */}
            <form onSubmit={handleSubmit} className="space-y-2">
                <textarea
                    value={nuevoComentario}
                    onChange={(e) => setNuevoComentario(e.target.value)}
                    placeholder="Escribe un comentario..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows="3"
                />
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                    Comentar
                </button>
            </form>

            {/* Lista de comentarios */}
            <div className="space-y-4 mt-6">
                {comentarios.map((comentario) => (
                    <div
                        key={comentario.id}
                        className="bg-gray-50 p-4 rounded-lg space-y-2"
                    >
                        <div className="flex justify-between items-start">
                            <div className="flex flex-col">
                                <span className="font-medium text-gray-700">
                                    {comentario.usuario}
                                </span>
                                <span className="text-sm text-gray-500">
                                    {new Date(comentario.fecha_creacion).toLocaleString()}
                                </span>
                            </div>
                            <div className="flex gap-2">
                                {!editingId && (
                                    <button
                                        onClick={() => handleEdit(comentario)}
                                        className="text-blue-500 hover:text-blue-700 transition-colors"
                                    >
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                            />
                                        </svg>
                                    </button>
                                )}

                                {/* Botón de eliminar comentario */}
                                <button
                                    onClick={() => handleDelete(comentario.id)}
                                    className="text-red-500 hover:text-red-700 transition-colors"
                                >
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        {editingId === comentario.id ? (
                            <div className="space-y-2">
                                <textarea
                                    value={editingText}
                                    onChange={(e) => setEditingText(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                    rows="3"
                                />
                                <div className="flex gap-2 justify-end">
                                    <button
                                        onClick={handleCancelEdit}
                                        className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={() => handleSaveEdit(comentario.id)}
                                        className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                    >
                                        Guardar
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-600">{comentario.texto}</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ComentariosList;