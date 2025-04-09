// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/HU/gemini/HU-08-gemini.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '../../../pages/Home';
import api from '../../../../api';
import { BrowserRouter } from 'react-router-dom';

vi.mock('../../../../api');

describe('HU-08: Ordenar Tareas', () => {
    const mockTareas = [
        { id: 1, titulo: 'Tarea 1', prioridad: 'alta', fecha_vencimiento: '2024-12-31', estado: 'pendiente' },
        { id: 2, titulo: 'Tarea 2', prioridad: 'baja', fecha_vencimiento: '2024-12-25', estado: 'pendiente' },
        { id: 3, titulo: 'Tarea 3', prioridad: 'media', fecha_vencimiento: '2025-01-05', estado: 'pendiente' },
    ];

    it('Debería ordenar las tareas por prioridad al hacer clic en el botón de prioridad', async () => {
        api.get.mockResolvedValue({ data: mockTareas });

        render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        );

        await waitFor(() => expect(api.get).toHaveBeenCalled());

        const prioridadButton = screen.getByText(/Ordenar por Prioridad/i);
        fireEvent.click(prioridadButton);

        await waitFor(() => {
            const tareasRenderizadas = screen.getAllByText(/Tarea/);
            expect(tareasRenderizadas[0].textContent).toBe('Tarea 1');
            expect(tareasRenderizadas[1].textContent).toBe('Tarea 3');
            expect(tareasRenderizadas[2].textContent).toBe('Tarea 2');
        });
    });

    it('Debería ordenar las tareas por fecha al hacer clic en el botón de fecha', async () => {
        api.get.mockResolvedValue({ data: mockTareas });

        render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        );

        await waitFor(() => expect(api.get).toHaveBeenCalled());

        const fechaButton = screen.getByText(/Ordenar por Fecha/i);
        fireEvent.click(fechaButton);

        await waitFor(() => {
            const tareasRenderizadas = screen.getAllByText(/Tarea/);
             expect(tareasRenderizadas[0].textContent).toBe('Tarea 2');
             expect(tareasRenderizadas[1].textContent).toBe('Tarea 1');
             expect(tareasRenderizadas[2].textContent).toBe('Tarea 3');
        });
    });

    it('Debería cambiar la dirección del ordenamiento de prioridad al hacer clic en el botón de prioridad dos veces', async () => {
        api.get.mockResolvedValue({ data: mockTareas });

        render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        );

        await waitFor(() => expect(api.get).toHaveBeenCalled());

        const prioridadButton = screen.getByText(/Ordenar por Prioridad/i);
        fireEvent.click(prioridadButton);
        fireEvent.click(prioridadButton);

        await waitFor(() => {
            const tareasRenderizadas = screen.getAllByText(/Tarea/);
            expect(tareasRenderizadas[0].textContent).toBe('Tarea 2');
            expect(tareasRenderizadas[1].textContent).toBe('Tarea 3');
            expect(tareasRenderizadas[2].textContent).toBe('Tarea 1');
        });
    });

    it('Debería cambiar la dirección del ordenamiento de fecha al hacer clic en el botón de fecha dos veces', async () => {
         api.get.mockResolvedValue({ data: mockTareas });

         render(
             <BrowserRouter>
                 <Home />
             </BrowserRouter>
         );

         await waitFor(() => expect(api.get).toHaveBeenCalled());

         const fechaButton = screen.getByText(/Ordenar por Fecha/i);
         fireEvent.click(fechaButton);
         fireEvent.click(fechaButton);

         await waitFor(() => {
             const tareasRenderizadas = screen.getAllByText(/Tarea/);
             expect(tareasRenderizadas[0].textContent).toBe('Tarea 3');
             expect(tareasRenderizadas[1].textContent).toBe('Tarea 1');
             expect(tareasRenderizadas[2].textContent).toBe('Tarea 2');
         });
     });
});