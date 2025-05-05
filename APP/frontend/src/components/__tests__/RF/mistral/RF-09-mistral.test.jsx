// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/RF/mistral/RF-09-mistral.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Tarea from '../../../Tarea';
import api from '../../../../api';
import { BrowserRouter } from 'react-router-dom';

vi.mock('../../../../api');

describe('RF-09: Marcar una tarea como completada', () => {
    const tareaMock = {
        id: 1,
        titulo: 'Tarea de prueba',
        descripcion: 'Esta es una tarea de prueba',
        estado: 'pendiente',
        prioridad: 'media',
        fecha_vencimiento: '2023-12-31',
    };

    it('Debe actualizar el estado de la tarea a "completada" y mostrar un mensaje toast', async () => {
        // Mock de la función de actualización de tarea en la API
        api.put.mockResolvedValueOnce({ status: 200 });

        // Mock de la función de actualización de tareas
        const updateTareaMock = vi.fn();

        // Renderizar el componente Tarea
        render(
            <BrowserRouter>
                <Tarea
                    tarea={tareaMock}
                    onDelete={vi.fn()}
                    onUpdate={updateTareaMock}
                    onDragStart={vi.fn()}
                />
            </BrowserRouter>
        );

        // Simular el arrastre y soltar de la tarea en la columna de "completada"
        fireEvent.dragStart(screen.getByText('Tarea de prueba'), { dataTransfer: { setData: vi.fn() } });
        fireEvent.drop(screen.getByText('Completadas'), { dataTransfer: { getData: () => '1' } });

        // Esperar a que la tarea se actualice
        await waitFor(() => {
            expect(updateTareaMock).toHaveBeenCalledWith(1, { ...tareaMock, estado: 'completada' });
        });

        // Verificar que se muestre el mensaje toast
        expect(screen.getByText('Tarea actualizada exitosamente')).toBeInTheDocument();
    });

    it('Debe mostrar un mensaje de error si falla la actualización del estado de la tarea', async () => {
        // Mock de la función de actualización de tarea en la API para simular un error
        api.put.mockRejectedValueOnce(new Error('Error al actualizar la tarea'));

        // Mock de la función de actualización de tareas
        const updateTareaMock = vi.fn();

        // Renderizar el componente Tarea
        render(
            <BrowserRouter>
                <Tarea
                    tarea={tareaMock}
                    onDelete={vi.fn()}
                    onUpdate={updateTareaMock}
                    onDragStart={vi.fn()}
                />
            </BrowserRouter>
        );

        // Simular el arrastre y soltar de la tarea en la columna de "completada"
        fireEvent.dragStart(screen.getByText('Tarea de prueba'), { dataTransfer: { setData: vi.fn() } });
        fireEvent.drop(screen.getByText('Completadas'), { dataTransfer: { getData: () => '1' } });

        // Esperar a que se muestre el mensaje de error
        await waitFor(() => {
            expect(screen.getByText('Error al actualizar el estado de la tarea')).toBeInTheDocument();
        });
    });
});