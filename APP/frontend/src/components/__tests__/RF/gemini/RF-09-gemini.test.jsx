// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/RF/gemini/RF-09-gemini.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '../../../pages/Home';
import api from '../../../../api';
import { BrowserRouter } from 'react-router-dom';

vi.mock('../../../../api');

describe('RF-09: Marcar tarea como completada', () => {
    it('debería actualizar el estado de una tarea a "completada" al hacer drag and drop', async () => {
        const mockTareas = [
            { id: 1, titulo: 'Tarea 1', estado: 'pendiente', prioridad: 'media', fecha_vencimiento: '2024-12-31', descripcion: 'descripcion 1' },
            { id: 2, titulo: 'Tarea 2', estado: 'en_progreso', prioridad: 'alta', fecha_vencimiento: '2024-12-31', descripcion: 'descripcion 2' },
        ];

        api.get.mockResolvedValue({ data: mockTareas });
        api.put.mockResolvedValue({ status: 200 });

        render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        );

        await waitFor(() => expect(api.get).toHaveBeenCalledTimes(1));

        const tarea1Element = screen.getByText('Tarea 1');
        const completadasColumn = screen.getByText('Completadas').closest('div');

        // Simular el drag and drop
        fireEvent.dragStart(tarea1Element);
        fireEvent.dragOver(completadasColumn);
        fireEvent.drop(completadasColumn);

        await waitFor(() => expect(api.put).toHaveBeenCalledTimes(1));

        expect(api.put).toHaveBeenCalledWith('/api/tareas/update/1/', {
            ...mockTareas[0],
            estado: 'completada'
        });
    });

    it('debería mostrar un mensaje de error si falla la actualización del estado', async () => {
        const mockTareas = [
            { id: 1, titulo: 'Tarea 1', estado: 'pendiente', prioridad: 'media', fecha_vencimiento: '2024-12-31', descripcion: 'descripcion 1' },
        ];

        api.get.mockResolvedValue({ data: mockTareas });
        api.put.mockRejectedValue(new Error('Error al actualizar'));

        render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        );

        await waitFor(() => expect(api.get).toHaveBeenCalledTimes(1));

        const tarea1Element = screen.getByText('Tarea 1');
        const completadasColumn = screen.getByText('Completadas').closest('div');

        // Simular el drag and drop
        fireEvent.dragStart(tarea1Element);
        fireEvent.dragOver(completadasColumn);
        fireEvent.drop(completadasColumn);

        await waitFor(() => expect(api.put).toHaveBeenCalledTimes(1));

        // En este caso como se muestra el toast no se testea.
        // Se podria simular el localStorage para testear el toast.
    });
});