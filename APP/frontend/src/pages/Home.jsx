import { useState, useEffect } from "react";
import api from "../api";
import TareaForm from "../components/TareaForm";
import Tarea from "../components/Tarea";
import ModalTarea from "../components/ModalTarea";

/**
 * Componente principal que muestra y gestiona la lista de tareas
 * 
 * @returns {JSX.Element}
 */
function Home() {
    const [tareas, setTareas] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar el modal
    const [sortType, setSortType] = useState("prioridad"); // Estado para el tipo de ordenamiento
    const [priorityDirection, setPriorityDirection] = useState("asc");
    const [dateDirection, setDateDirection] = useState("asc");
    const [searchText, setSearchText] = useState(""); // Estado para el texto de búsqueda

    useEffect(() => {
        getTareas();
    }, []);

    /**
     * Obtiene todas las tareas del usuario desde la API
     * 
     * @returns {Promise<void>}
     */
    const getTareas = async () => {
        api.get("/api/tareas/").then((response) => {
            setTareas(response.data);
        }).catch((error) => {
            alert("Error al obtener las tareas");
            console.log(error);
        });
    };

    /**
     * Elimina una tarea específica
     * 
     * @param {number} id - ID de la tarea a eliminar
     * @returns {Promise<void>}
     */
    const deleteTarea = async (id) => {
        api.delete(`/api/tareas/delete/${id}/`).then((response) => {
            if (response.status === 204) alert("Tarea eliminada");
            getTareas();
        }).catch((error) => {
            alert("Error al eliminar la tarea");
            console.log(error);
        });
    };

    /**
     * Añade una nueva tarea
     * 
     * @param {Object} payload - Datos de la nueva tarea
     * @returns {Promise<void>}
     */
    const addTarea = async (payload) => {
        api.post("/api/tareas/", payload).then((response) => {
            if (response.status === 201) alert("Tarea agregada");
            getTareas();
            setIsModalOpen(false); // Cerrar el modal después de agregar la tarea
        }).catch((error) => {
            alert("Error al agregar la tarea");
            console.log(error);
        });
    };

    /**
     * Actualiza una tarea existente
     * 
     * @param {number} id - ID de la tarea a actualizar
     * @param {Object} updatedTarea - Datos actualizados de la tarea
     * @returns {Promise<void>}
     */
    const updateTarea = async (id, updatedTarea) => {
        api.put(`/api/tareas/update/${id}/`, updatedTarea).then((response) => {
            if (response.status === 200) {
                alert("Tarea actualizada");
                setTareas((prevTareas) =>
                    prevTareas.map((t) =>
                        t.id === id ? { ...t, ...updatedTarea } : t
                    )
                );
            }
        }).catch((error) => {
            alert("Error al actualizar la tarea");
            console.log(error);
        });
    };

    /**
     * Actualiza el estado de una tarea
     * 
     * @param {number} id - ID de la tarea
     * @param {string} nuevoEstado - Nuevo estado de la tarea
     * @returns {Promise<void>}
     */
    const updateTareaEstado = async (id, nuevoEstado) => {
        const tarea = tareas.find((t) => t.id === id);
        if (!tarea) return;

        const updatedTarea = { ...tarea, estado: nuevoEstado };
        api.put(`/api/tareas/update/${id}/`, updatedTarea).then((response) => {
            if (response.status === 200) {
                setTareas((prevTareas) =>
                    prevTareas.map((t) =>
                        t.id === id ? { ...t, estado: nuevoEstado } : t
                    )
                );
            }
        }).catch((error) => {
            alert("Error al actualizar el estado de la tarea");
            console.log(error);
        });
    };

    /**
     * Maneja el inicio del arrastre de una tarea
     * 
     * @param {DragEvent} e - Evento de arrastre
     * @param {number} id - ID de la tarea
     */
    const handleDragStart = (e, id) => {
        e.dataTransfer.setData("tareaId", id);
    };

    /**
     * Maneja la suelta de una tarea en una columna
     * 
     * @param {DragEvent} e - Evento de soltar
     * @param {string} nuevoEstado - Nuevo estado de la tarea
     */
    const handleDrop = (e, nuevoEstado) => {
        const id = e.dataTransfer.getData("tareaId");
        updateTareaEstado(parseInt(id), nuevoEstado);
    };

    /**
     * Permite el evento de soltar
     * 
     * @param {DragEvent} e - Evento de arrastre sobre
     */
    const handleDragOver = (e) => {
        e.preventDefault(); // Permitir el drop
    };

    // Cambia la dirección del ordenamiento
    const toggleSortDirection = () => {
        setSortDirection((prevDirection) => (prevDirection === "asc" ? "desc" : "asc"));
    };

    /**
     * Ordena las tareas por prioridad o fecha
     * 
     * @param {Array<Object>} tareas - Array de tareas a ordenar
     * @returns {Array<Object>} Tareas ordenadas
     */
    const sortTareas = (tareas) => {
        const prioridadOrden = { alta: 0, media: 1, baja: 2 };
        const direction = sortType === "prioridad" ? priorityDirection : dateDirection;

        return tareas.sort((a, b) => {
            let comparison = 0;

            if (sortType === "prioridad") {
                comparison = prioridadOrden[a.prioridad] - prioridadOrden[b.prioridad];
            } else if (sortType === "fecha") {
                comparison = new Date(a.fecha_vencimiento) - new Date(b.fecha_vencimiento);
            }

            return direction === "asc" ? comparison : -comparison;
        });
    };

    // Filtrar las tareas por texto de búsqueda
    const filteredTareas = tareas.filter((tarea) =>
        tarea.titulo.toLowerCase().includes(searchText.toLowerCase()) ||
        (tarea.descripcion && tarea.descripcion.toLowerCase().includes(searchText.toLowerCase()))
    );

    // Filtrar y ordenar las tareas por estado
    const tareasPendientes = sortTareas(filteredTareas.filter((tarea) => tarea.estado === "pendiente"));
    const tareasEnProgreso = sortTareas(filteredTareas.filter((tarea) => tarea.estado === "en_progreso"));
    const tareasCompletadas = sortTareas(filteredTareas.filter((tarea) => tarea.estado === "completada"));

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Lista de Tareas</h2>

            {/* Buscador */}
            <input
                type="text"
                placeholder="Buscar tareas..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full max-w-md px-4 py-2 mb-6 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none"
            />

            {/* Botones de ordenar */}
            <div className="flex gap-4 mb-6">
                <button
                    onClick={() => {
                        setSortType("prioridad");
                        setPriorityDirection(prev => prev === "asc" ? "desc" : "asc");
                    }}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                    Ordenar por Prioridad {priorityDirection === "asc" ? "▲" : "▼"}
                </button>
                <button
                    onClick={() => {
                        setSortType("fecha");
                        setDateDirection(prev => prev === "asc" ? "desc" : "asc");
                    }}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                    Ordenar por Fecha {dateDirection === "asc" ? "▲" : "▼"}
                </button>
            </div>

            {/* Boton de Crear Tarea */}
            <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-3 mb-8 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition-all transform hover:-translate-y-0.5"
            >
                Crear Tarea
            </button>

            {/* Modal para crear Tarea */}
            <ModalTarea isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <TareaForm onAddTarea={addTarea} />
            </ModalTarea>

            {/* Listado de Tareas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Columna de Pendientes */}
                <div
                    className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, "pendiente")}
                >
                    <h3 className="text-lg font-semibold text-center mb-4">Pendientes</h3>
                    <div className="space-y-4">
                        {tareasPendientes.map((tarea) => (
                            <Tarea
                                key={tarea.id}
                                tarea={tarea}
                                onDelete={deleteTarea}
                                onDragStart={handleDragStart}
                                onUpdate={updateTarea}
                            />
                        ))}
                    </div>
                </div>

                {/* Columna de En Progreso */}
                <div
                    className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, "en_progreso")}
                >
                    <h3 className="text-lg font-semibold text-center mb-4">En Progreso</h3>
                    <div className="space-y-4">
                        {tareasEnProgreso.map((tarea) => (
                            <Tarea
                                key={tarea.id}
                                tarea={tarea}
                                onDelete={deleteTarea}
                                onDragStart={handleDragStart}
                                onUpdate={updateTarea}
                            />
                        ))}
                    </div>
                </div>

                {/* Columna de Completadas */}
                <div
                    className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, "completada")}
                >
                    <h3 className="text-lg font-semibold text-center mb-4">Completadas</h3>
                    <div className="space-y-4">
                        {tareasCompletadas.map((tarea) => (
                            <Tarea
                                key={tarea.id}
                                tarea={tarea}
                                onDelete={deleteTarea}
                                onDragStart={handleDragStart}
                                onUpdate={updateTarea}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;