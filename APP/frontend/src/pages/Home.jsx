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

    // Filtrar las tareas por estado
    const tareasPendientes = tareas.filter((tarea) => tarea.estado === "pendiente");
    const tareasEnProgreso = tareas.filter((tarea) => tarea.estado === "en_progreso");
    const tareasCompletadas = tareas.filter((tarea) => tarea.estado === "completada");

    return (
        <div>
            <h2>Lista de Tareas</h2>
            <button onClick={() => setIsModalOpen(true)}>Crear Tarea</button>
            <ModalTarea isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <TareaForm onAddTarea={addTarea} />
            </ModalTarea>
            <div className="tareas-container">
                <div className="tareas-column">
                    <h3>Pendientes</h3>
                    {tareasPendientes.map((tarea) => (
                        <Tarea tarea={tarea} key={tarea.id} onDelete={deleteTarea} onUpdate={updateTarea} />
                    ))}
                </div>
                <div className="tareas-column">
                    <h3>En Progreso</h3>
                    {tareasEnProgreso.map((tarea) => (
                        <Tarea tarea={tarea} key={tarea.id} onDelete={deleteTarea} onUpdate={updateTarea} />
                    ))}
                </div>
                <div className="tareas-column">
                    <h3>Completadas</h3>
                    {tareasCompletadas.map((tarea) => (
                        <Tarea tarea={tarea} key={tarea.id} onDelete={deleteTarea} onUpdate={updateTarea} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Home;