// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/HU/gemini/HU-07-gemini.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '../../../../pages/Home';
import api from '../../../../api';
import { BrowserRouter } from 'react-router-dom';

vi.mock('../../../../api');

describe('HU-07: Marcado de Tareas Completadas', () => {
    it('Debe cambiar el estado de la tarea a "completada" y reflejarse en la lista de tareas', async () => {
        const mockTareas = [
            { id: 1, titulo: 'Tarea 1', estado: 'pendiente', prioridad: 'alta', fecha_vencimiento: '2024-12-31' },
            { id: 2, titulo: 'Tarea 2', estado: 'en_progreso', prioridad: 'media', fecha_vencimiento: '2024-12-31' },
            { id: 3, titulo: 'Tarea 3', estado: 'completada', prioridad: 'baja', fecha_vencimiento: '2024-12-31' },
        ];

        api.get.mockResolvedValue({ data: mockTareas });
        api.put.mockImplementation((url, data) => {
            const id = parseInt(url.split('/')[3]);
            return Promise.resolve({ status: 200, data: { id, ...data } });
        });

        render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        );

        await waitFor(() => expect(api.get).toHaveBeenCalledTimes(1));

        const tareaEnProgresoElement = screen.getByText('Tarea 2');
        expect(tareaEnProgresoElement).toBeInTheDocument();

        const dropTarget = screen.getByText('Completadas');
        expect(dropTarget).toBeInTheDocument();

        const dragStartEvent = new DragEvent('dragstart', {
            dataTransfer: {
                setData: (type, value) => {
                    dragStartEvent.dataTransfer[type] = value;
                },
                getData: (type) => {
                    return dragStartEvent.dataTransfer[type];
                }
            }
        });

        fireEvent(tareaEnProgresoElement, dragStartEvent);

        const dragOverEvent = new DragEvent('dragover', {
            bubbles: true,
            cancelable: true,
        });
        fireEvent(dropTarget, dragOverEvent);

        const dropEvent = new DragEvent('drop', {
            bubbles: true,
            cancelable: true,
            dataTransfer: dragStartEvent.dataTransfer,
        });
        fireEvent(dropTarget, dropEvent);

        await waitFor(() => expect(api.put).toHaveBeenCalledTimes(1));

        expect(api.put).toHaveBeenCalledWith(
            '/api/tareas/update/2/',
            expect.objectContaining({ estado: 'completada' })
        );
    });
});