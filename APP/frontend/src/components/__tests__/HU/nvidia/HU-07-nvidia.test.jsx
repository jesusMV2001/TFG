// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/HU/nvidia/HU-07-nvidia.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Tarea from '../../../Tarea';
import api from '../../../../api';
import { BrowserRouter } from 'react-router-dom';

vi.mock('../../../../api');
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => vi.fn(),
    };
});

const tarea = {
    id: 1,
    titulo: 'Tarea de Ejemplo',
    estado: 'en_progreso',
    prioridad: 'media',
    fecha_vencimiento: '2024-03-16',
    descripcion: 'Descripción de la tarea',
    etiquetas: []
};

describe('HU-07 - Marcado de Tareas Completadas', () => {
    it('Should change task state to "completada" when marked as completed', async () => {
        // Mockear la función de actualización de tarea
        const updateTareaSpy = vi.spyOn(api, 'put').mockResolvedValue({ status: 200 });

        render(
            <BrowserRouter>
                <Tarea tarea={tarea} onDelete={() => { }} onDragStart={() => { }} onUpdate={(id, updatedTarea) => updateTareaSpy(id, updatedTarea)} />
            </BrowserRouter>
        );

        // Simular el clic en el botón de marcar como completada
        const completarBoton = screen.getByRole('button', { name: /completada/i });
        fireEvent.click(completarBoton);

        // Verificar que la solicitud de actualización se_envió con el estado correcto
        await waitFor(() => expect(updateTareaSpy).toHaveBeenCalledTimes(1));
        expect(updateTareaSpy).toHaveBeenCalledWith(`/api/tareas/update/${tarea.id}/`, expect.objectContaining({ estado: 'completada' }));
    });

    it('Should reflect the updated state in the task list', async () => {
        // Renderizar la tarea con el estado initial 'en_progreso'
        render(
            <BrowserRouter>
                <Tarea tarea={tarea} onDelete={() => { }} onDragStart={() => { }} onUpdate={() => { }} />
            </BrowserRouter>
        );

        // Verificar que el estado inicial es 'en_progreso'
        const estadoInicial = screen.getByText('En Progreso');
        expect(estadoInicial).toBeInTheDocument();

        // Simular el cambio de estado a 'completada'
        tarea.estado = 'completada';
        render(
            <BrowserRouter>
                <Tarea tarea={tarea} onDelete={() => { }} onDragStart={() => { }} onUpdate={() => { }} />
            </BrowserRouter>
        );

        // Verificar que el estado ahora es 'completada'
        const estadoCompletada = screen.getByText('Completada');
        expect(estadoCompletada).toBeInTheDocument();
    });
});