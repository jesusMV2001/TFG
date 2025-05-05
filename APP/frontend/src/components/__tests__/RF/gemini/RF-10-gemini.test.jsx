// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/RF/gemini/RF-10-gemini.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '../../../../pages/Home';
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

describe('RF-10: Ordenar tareas por prioridad y fecha', () => {
    const mockTareas = [
        { id: 1, titulo: 'Tarea 1', prioridad: 'alta', fecha_vencimiento: '2024-01-05', estado: 'pendiente' },
        { id: 2, titulo: 'Tarea 2', prioridad: 'baja', fecha_vencimiento: '2024-01-10', estado: 'pendiente' },
        { id: 3, titulo: 'Tarea 3', prioridad: 'media', fecha_vencimiento: '2024-01-01', estado: 'pendiente' },
    ];

    it('Debería ordenar las tareas por prioridad ascendente al hacer clic en el botón de prioridad', async () => {
        api.get.mockResolvedValue({ data: mockTareas });

        render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        );

        await waitFor(() => expect(api.get).toHaveBeenCalledTimes(1));

        const prioridadButton = screen.getByText(/Ordenar por Prioridad/i);
        fireEvent.click(prioridadButton);

        const prioridadButton2 = screen.getByText(/Ordenar por Prioridad/i);
        fireEvent.click(prioridadButton2);

        await waitFor(() => {
            const tareaElements = screen.getAllByText(/Tarea/i);
            expect(tareaElements[0]).toHaveTextContent(/Tarea 1/i);
            expect(tareaElements[1]).toHaveTextContent(/Tarea 3/i);
            expect(tareaElements[2]).toHaveTextContent(/Tarea 2/i);
        });
    });

    it('Debería ordenar las tareas por fecha ascendente al hacer clic en el botón de fecha', async () => {
        api.get.mockResolvedValue({ data: mockTareas });

        render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        );

        await waitFor(() => expect(api.get).toHaveBeenCalledTimes(1));

        const fechaButton = screen.getByText(/Ordenar por Fecha/i);
        fireEvent.click(fechaButton);

        await waitFor(() => {
          const tareaElements = screen.getAllByText(/Tarea/i);
          expect(tareaElements[0]).toHaveTextContent(/Tarea 3/i);
          expect(tareaElements[1]).toHaveTextContent(/Tarea 1/i);
          expect(tareaElements[2]).toHaveTextContent(/Tarea 2/i);
        });
    });

    it('Debería cambiar la dirección del ordenamiento de prioridad al hacer clic varias veces', async () => {
        api.get.mockResolvedValue({ data: mockTareas });

        render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        );

        await waitFor(() => expect(api.get).toHaveBeenCalledTimes(1));

        const prioridadButton = screen.getByText(/Ordenar por Prioridad/i);
        fireEvent.click(prioridadButton);
        fireEvent.click(prioridadButton);

        await waitFor(() => {
            const tareaElements = screen.getAllByText(/Tarea/i);
            expect(tareaElements[0]).toHaveTextContent(/Tarea 1/i);
            expect(tareaElements[1]).toHaveTextContent(/Tarea 3/i);
            expect(tareaElements[2]).toHaveTextContent(/Tarea 2/i);
        });
    });

    it('Debería cambiar la dirección del ordenamiento de fecha al hacer clic varias veces', async () => {
         api.get.mockResolvedValue({ data: mockTareas });

        render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        );

        await waitFor(() => expect(api.get).toHaveBeenCalledTimes(1));

        const fechaButton = screen.getByText(/Ordenar por Fecha/i);
        fireEvent.click(fechaButton);
        fireEvent.click(fechaButton);

        await waitFor(() => {
            const tareaElements = screen.getAllByText(/Tarea/i);
            expect(tareaElements[0]).toHaveTextContent(/Tarea 2/i);
            expect(tareaElements[1]).toHaveTextContent(/Tarea 1/i);
            expect(tareaElements[2]).toHaveTextContent(/Tarea 3/i);
        });
    });
});