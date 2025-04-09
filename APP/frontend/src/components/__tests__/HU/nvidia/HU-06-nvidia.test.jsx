// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/HU/nvidia/HU-06-nvidia.test.jsx

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Tarea from '../../../Tarea';
import api from '../../../../api';
import { BrowserRouter } from 'react-router-dom';
import { Toast } from '../../../Toast';

vi.mock('../../../../api');
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => vi.fn(),
    };
});

describe('HU-06: Eliminar tarea', () => {
    const tarea = {
        id: 1,
        titulo: 'Tarea de ejemplo',
        descripcion: 'Descripción de ejemplo',
        fecha_vencimiento: '2024-03-16T14:30:00',
        estado: 'pendiente',
        prioridad: 'alta',
        usuario: 'usuario1',
    };

    it('Eliminar tarea - Exitoso', async () => {
        // Mock API delete
        const deleteTareaMock = vi.fn(() => Promise.resolve({ status: 204 }));
        api.delete.mockImplementation(deleteTareaMock);

        render(
            <BrowserRouter>
                <Tarea
                    tarea={tarea}
                    onDelete={vi.fn()}
                    onDragStart={vi.fn()}
                    onUpdate={vi.fn()}
                />
            </BrowserRouter>
        );

        // Simular clic en botón de eliminar
        const eliminarBtn = screen.getByRole('button', { name: 'Eliminar' });
        fireEvent.click(eliminarBtn);

        // Esperar mensaje de éxito
        await waitFor(() => expect(screen.getByText('Tarea eliminada exitosamente')).toBeInTheDocument());
    });

    it('Eliminar tarea - Error', async () => {
        // Mock API delete con error
        const deleteTareaMock = vi.fn(() => Promise.reject(new Error('Error al eliminar tarea')));
        api.delete.mockImplementation(deleteTareaMock);

        render(
            <BrowserRouter>
                <Tarea
                    tarea={tarea}
                    onDelete={vi.fn()}
                    onDragStart={vi.fn()}
                    onUpdate={vi.fn()}
                />
            </BrowserRouter>
        );

        // Simular clic en botón de eliminar
        const eliminarBtn = screen.getByRole('button', { name: 'Eliminar' });
        fireEvent.click(eliminarBtn);

        // Esperar mensaje de error
        await waitFor(() => expect(screen.getByText('Error al eliminar la tarea')).toBeInTheDocument());
    });

    it('Eliminar tarea - Desaparece de la lista', async () => {
        // Render con lista de tareas
        const tareas = [tarea, { id: 2, titulo: 'Otra tarea' }];
        render(
            <BrowserRouter>
                <div>
                    {tareas.map((t) => (
                        <Tarea
                            key={t.id}
                            tarea={t}
                            onDelete={vi.fn()}
                            onDragStart={vi.fn()}
                            onUpdate={vi.fn()}
                        />
                    ))}
                    <Toast message="" type="success" onClose={vi.fn()} />
                </div>
            </BrowserRouter>
        );

        // Simular clic en botón de eliminar
        const eliminarBtn = screen.getAllByRole('button', { name: 'Eliminar' })[0];
        fireEvent.click(eliminarBtn);

        // Mock API delete con éxito
        const deleteTareaMock = vi.fn(() => Promise.resolve({ status: 204 }));
        api.delete.mockImplementation(deleteTareaMock);

        // Esperar que la tarea desaparezca
        await waitFor(() => expect(screen.queryByText(tarea.titulo)).not.toBeInTheDocument());
    });
});