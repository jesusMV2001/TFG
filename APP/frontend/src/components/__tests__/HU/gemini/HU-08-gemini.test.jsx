// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/HU/gemini/HU-08-gemini.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '../../../../pages/Home';
import api from '../../../../api';
import { BrowserRouter } from 'react-router-dom';

vi.mock('../../../../api');

describe('HU-08: Ordenar Tareas', () => {
    const mockTareas = [
        { id: 1, titulo: 'Tarea 1', prioridad: 'baja', fecha_vencimiento: '2024-01-20', estado: 'pendiente' },
        { id: 2, titulo: 'Tarea 2', prioridad: 'alta', fecha_vencimiento: '2024-01-15', estado: 'pendiente' },
        { id: 3, titulo: 'Tarea 3', prioridad: 'media', fecha_vencimiento: '2024-01-25', estado: 'pendiente' },
    ];

    it('Debería ordenar las tareas por prioridad ascendente al hacer clic en el botón de prioridad', async () => {
        api.get.mockResolvedValue({ data: mockTareas });

        render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        );

        const prioridadButton = screen.getByText(/Ordenar por Prioridad/i);
        fireEvent.click(prioridadButton);

        await waitFor(() => {
            expect(screen.getByText('Tarea 2')).toBeInTheDocument();
        });

        const tareasOrdenadas = screen.getAllByText(/Tarea/i).map(tarea => tarea.textContent);
        expect(tareasOrdenadas[0]).toContain("Tarea 2");
        expect(tareasOrdenadas[1]).toContain("Tarea 3");
        expect(tareasOrdenadas[2]).toContain("Tarea 1");
    });

    it('Debería ordenar las tareas por prioridad descendente al hacer clic en el botón de prioridad dos veces', async () => {
        api.get.mockResolvedValue({ data: mockTareas });

        render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        );

        const prioridadButton = screen.getByText(/Ordenar por Prioridad/i);
        fireEvent.click(prioridadButton);
        fireEvent.click(prioridadButton);

        await waitFor(() => {
            expect(screen.getByText('Tarea 1')).toBeInTheDocument();
        });

        const tareasOrdenadas = screen.getAllByText(/Tarea/i).map(tarea => tarea.textContent);
        expect(tareasOrdenadas[0]).toContain("Tarea 1");
        expect(tareasOrdenadas[1]).toContain("Tarea 3");
        expect(tareasOrdenadas[2]).toContain("Tarea 2");
    });

    it('Debería ordenar las tareas por fecha ascendente al hacer clic en el botón de fecha', async () => {
        api.get.mockResolvedValue({ data: mockTareas });

        render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        );

        const fechaButton = screen.getByText(/Ordenar por Fecha/i);
        fireEvent.click(fechaButton);

        await waitFor(() => {
            expect(screen.getByText('Tarea 2')).toBeInTheDocument();
        });

        const tareasOrdenadas = screen.getAllByText(/Tarea/i).map(tarea => tarea.textContent);
        expect(tareasOrdenadas[0]).toContain("Tarea 2");
        expect(tareasOrdenadas[1]).toContain("Tarea 1");
        expect(tareasOrdenadas[2]).toContain("Tarea 3");
    });

    it('Debería ordenar las tareas por fecha descendente al hacer clic en el botón de fecha dos veces', async () => {
        api.get.mockResolvedValue({ data: mockTareas });

        render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        );

        const fechaButton = screen.getByText(/Ordenar por Fecha/i);
        fireEvent.click(fechaButton);
        fireEvent.click(fechaButton);

        await waitFor(() => {
            expect(screen.getByText('Tarea 3')).toBeInTheDocument();
        });

        const tareasOrdenadas = screen.getAllByText(/Tarea/i).map(tarea => tarea.textContent);
        expect(tareasOrdenadas[0]).toContain("Tarea 3");
        expect(tareasOrdenadas[1]).toContain("Tarea 1");
        expect(tareasOrdenadas[2]).toContain("Tarea 2");
    });
});