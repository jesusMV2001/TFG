// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/RF/mistral/RF-08-mistral.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '../../../../pages/Home';
import api from '../../../../api';
import { BrowserRouter } from 'react-router-dom';

vi.mock('../../../../api');

describe('RF-08: Eliminar tareas', () => {
    it('debe eliminar una tarea de la lista de tareas', async () => {
        const mockTareas = [
            { id: 1, titulo: 'Tarea 1', prioridad: 'alta', estado: 'pendiente', fecha_vencimiento: '2023-12-31' },
            { id: 2, titulo: 'Tarea 2', prioridad: 'media', estado: 'pendiente', fecha_vencimiento: '2023-12-31' },
        ];

        api.get.mockResolvedValue({ data: mockTareas });
        api.delete.mockResolvedValue({ status: 204 });

        render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        );

        // Esperar a que las tareas se carguen
        await waitFor(() => {
            expect(screen.getByText('Tarea 1')).toBeInTheDocument();
            expect(screen.getByText('Tarea 2')).toBeInTheDocument();
        });

        // Eliminar la primera tarea
        fireEvent.click(screen.getAllByText('Eliminar')[0]);

        // Esperar a que la tarea se elimine
        await waitFor(() => {
            expect(screen.queryByText('Tarea 1')).not.toBeInTheDocument();
            expect(screen.getByText('Tarea 2')).toBeInTheDocument();
        });

        // Verificar que la API de eliminación fue llamada
        expect(api.delete).toHaveBeenCalledWith(`/api/tareas/delete/1/`);
    });

    it('debe mostrar un mensaje de error si la eliminación falla', async () => {
        const mockTareas = [
            { id: 1, titulo: 'Tarea 1', prioridad: 'alta', estado: 'pendiente', fecha_vencimiento: '2023-12-31' },
        ];

        api.get.mockResolvedValue({ data: mockTareas });
        api.delete.mockRejectedValue(new Error('Error de eliminación'));

        render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        );

        // Esperar a que las tareas se carguen
        await waitFor(() => {
            expect(screen.getByText('Tarea 1')).toBeInTheDocument();
        });

        // Eliminar la primera tarea
        fireEvent.click(screen.getByText('Eliminar'));

        // Esperar a que el mensaje de error aparezca
        await waitFor(() => {
            expect(screen.getByText('Error al eliminar la tarea')).toBeInTheDocument();
        });

        // Verificar que la API de eliminación fue llamada
        expect(api.delete).toHaveBeenCalledWith(`/api/tareas/delete/1/`);
    });
});