import { useState, useEffect } from "react";
import api from "../api";
import TareaForm from "../components/TareaForm";
import Tarea from "../components/Tarea";
import ModalTarea from "../components/ModalTarea";
import "../styles/Home.css";

function Home() {
    const [tareas, setTareas] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar el modal

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

    // Actualizar el estado de la tarea al arrastrar
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

    // Actualizar la tarea (boton modificar)
    const updateTarea = async (id, updatedTarea) => {
        api.put(`/api/tareas/update/${id}/`, updatedTarea).then((response) => {
            if (response.status === 200) {
                alert("Tarea actualizada");
                getTareas(); // Actualizar la lista de tareas
            }
        }).catch((error) => {
            alert("Error al actualizar la tarea");
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
    
    const sortTareas = (tareas) => {
        const prioridadOrden = { alta: 0, media: 1, baja: 2 };
    
        return tareas.sort((a, b) => {
            // Ordenar por prioridad
            if (prioridadOrden[a.prioridad] !== prioridadOrden[b.prioridad]) {
                return prioridadOrden[a.prioridad] - prioridadOrden[b.prioridad];
            }
            // Si tienen la misma prioridad, ordenar por fecha de vencimiento
            const fechaA = new Date(a.fecha_vencimiento);
            const fechaB = new Date(b.fecha_vencimiento);
            return fechaA - fechaB;
        });
    };
    
    // Filtrar y ordenar las tareas por estado
    const tareasPendientes = sortTareas(tareas.filter((tarea) => tarea.estado === "pendiente"));
    const tareasEnProgreso = sortTareas(tareas.filter((tarea) => tarea.estado === "en_progreso"));
    const tareasCompletadas = sortTareas(tareas.filter((tarea) => tarea.estado === "completada"));

    return (
        <div>
            <h2>Lista de Tareas</h2>
            <button className="btn-crear-tarea" onClick={() => setIsModalOpen(true)}>Crear Tarea</button>
            <ModalTarea isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <TareaForm onAddTarea={addTarea} />
            </ModalTarea>
            <div className="tareas-container">
                <div className="tareas-column" onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, "pendiente")} >
                    <h3>Pendientes</h3>
                    {tareasPendientes.map((tarea) => (
                        <Tarea tarea={tarea} key={tarea.id} onDelete={deleteTarea} onUpdate={updateTarea} onDragStart={handleDragStart} />
                    ))}
                </div>
                <div className="tareas-column"  onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, "en_progreso")} >
                    <h3>En Progreso</h3>
                    {tareasEnProgreso.map((tarea) => (
                        <Tarea tarea={tarea} key={tarea.id} onDelete={deleteTarea} onUpdate={updateTarea} onDragStart={handleDragStart} />
                    ))}
                </div>
                <div className="tareas-column"  onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, "completada")} >
                    <h3>Completadas</h3>
                    {tareasCompletadas.map((tarea) => (
                        <Tarea tarea={tarea} key={tarea.id} onDelete={deleteTarea} onUpdate={updateTarea} onDragStart={handleDragStart} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Home;