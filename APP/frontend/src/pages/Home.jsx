import { useState, useEffect } from "react";
import api from "../api";
import TareaForm from "../components/TareaForm";
import Tarea from "../components/Tarea";
import ModalTarea from "../components/ModalTarea";

function Home() {
    const [tareas, setTareas] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar el modal
    const [sortType, setSortType] = useState("prioridad"); // Estado para el tipo de ordenamiento
    const [sortDirection, setSortDirection] = useState("asc"); // Estado para la dirección del orden
    const [searchText, setSearchText] = useState(""); // Estado para el texto de búsqueda

    useEffect(() => {
        getTareas();
    }, []);

    const getTareas = async () => {
        api.get("/api/tareas/").then((response) => {
            setTareas(response.data);
        }).catch((error) => {
            alert("Error al obtener las tareas");
            console.log(error);
        });
    };

    const deleteTarea = async (id) => {
        api.delete(`/api/tareas/delete/${id}/`).then((response) => {
            if (response.status === 204) alert("Tarea eliminada");
            getTareas();
        }).catch((error) => {
            alert("Error al eliminar la tarea");
            console.log(error);
        });
    };

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

    const handleDragStart = (e, id) => {
        e.dataTransfer.setData("tareaId", id);
    };

    const handleDrop = (e, nuevoEstado) => {
        const id = e.dataTransfer.getData("tareaId");
        updateTareaEstado(parseInt(id), nuevoEstado);
    };

    const handleDragOver = (e) => {
        e.preventDefault(); // Permitir el drop
    };

    const toggleSortDirection = () => {
        setSortDirection((prevDirection) => (prevDirection === "asc" ? "desc" : "asc"));
    };

    const sortTareas = (tareas) => {
        const prioridadOrden = { alta: 0, media: 1, baja: 2 };

        return tareas.sort((a, b) => {
            let comparison = 0;

            if (sortType === "prioridad") {
                // Ordenar por prioridad
                comparison = prioridadOrden[a.prioridad] - prioridadOrden[b.prioridad];
            } else if (sortType === "fecha") {
                // Ordenar por fecha de vencimiento
                const fechaA = new Date(a.fecha_vencimiento);
                const fechaB = new Date(b.fecha_vencimiento);
                comparison = fechaA - fechaB;
            }

            // Invertir el orden si la dirección es descendente
            return sortDirection === "asc" ? comparison : -comparison;
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
            
            {/* Search input */}
            <input
                type="text"
                placeholder="Buscar tareas..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full max-w-md px-4 py-2 mb-6 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none"
            />
            
            {/* Sort buttons */}
            <div className="flex gap-4 mb-6">
                <button
                    onClick={() => {
                        setSortType("prioridad");
                        toggleSortDirection();
                    }}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                    Ordenar por Prioridad {sortDirection === "asc" ? "▲" : "▼"}
                </button>
                <button
                    onClick={() => {
                        setSortType("fecha");
                        toggleSortDirection();
                    }}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                    Ordenar por Fecha {sortDirection === "asc" ? "▲" : "▼"}
                </button>
            </div>
            
            {/* Create task button */}
            <button 
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-3 mb-8 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition-all transform hover:-translate-y-0.5"
            >
                Crear Tarea
            </button>
            
            {/* Create task modal */}
            <ModalTarea isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <TareaForm onAddTarea={addTarea} />
            </ModalTarea>
            
            {/* Tasks container */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Pending tasks column */}
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

                {/* In progress tasks column */}
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

                {/* Completed tasks column */}
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