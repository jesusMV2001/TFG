// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/HU/gemini/HU-07-gemini.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '../../../pages/Home';
import api from '../../../../api';
import { BrowserRouter } from 'react-router-dom';

vi.mock('../../../../api');

describe('HU-07: Marcado de Tareas Completadas', () => {
    it('Debería cambiar el estado de una tarea a "completada" y reflejarse en la lista de tareas', async () => {
        // Mock de la respuesta de la API al obtener las tareas
        api.get.mockResolvedValue({
            data: [
                { id: 1, titulo: 'Tarea 1', descripcion: 'Descripcion 1', estado: 'pendiente', prioridad: 'media', fecha_vencimiento: '2024-12-31' },
                { id: 2, titulo: 'Tarea 2', descripcion: 'Descripcion 2', estado: 'en_progreso', prioridad: 'alta', fecha_vencimiento: '2024-12-30' },
                { id: 3, titulo: 'Tarea 3', descripcion: 'Descripcion 3', estado: 'completada', prioridad: 'baja', fecha_vencimiento: '2024-12-29' },
            ],
        });

        // Mock de la respuesta de la API al actualizar el estado de una tarea
        api.put.mockImplementation((url, data) => {
            const id = parseInt(url.match(/update\/(\d+)\//)[1]);
            return Promise.resolve({ status: 200, data: { id, ...data } });
        });

        render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        );

        // Esperar a que las tareas se carguen
        await waitFor(() => expect(api.get).toHaveBeenCalledTimes(1));

        // Simular el drag and drop de la tarea 1 a la columna de completadas
        const tarea1 = screen.getByText('Tarea 1');
        const columnaCompletadas = screen.getByText('Completadas').closest('div'); //Encontrar el div contenedor de la columna completadas

        fireEvent.dragStart(tarea1);
        fireEvent.dragOver(columnaCompletadas);
        fireEvent.drop(columnaCompletadas);

        // Verificar que la API put fue llamada para actualizar el estado de la tarea
        await waitFor(() => {
            expect(api.put).toHaveBeenCalledWith(
                '/api/tareas/update/1/',
                expect.objectContaining({ estado: 'completada' })
            );
        });
    });
});