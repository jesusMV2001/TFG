// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/HU/mistral/HU-08-mistral.test.jsx
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

describe('HU-08: Ordenar Tareas', () => {
    it('El usuario puede ordenar por prioridad y fecha de vencimiento las tareas en la lista de tareas.', async () => {
        // Mock de las tareas
        const mockTareas = [
            { id: 1, titulo: 'Tarea 1', prioridad: 'alta', fecha_vencimiento: '2023-12-01', estado: 'pendiente' },
            { id: 2, titulo: 'Tarea 2', prioridad: 'media', fecha_vencimiento: '2023-11-01', estado: 'en_progreso' },
            { id: 3, titulo: 'Tarea 3', prioridad: 'baja', fecha_vencimiento: '2023-10-01', estado: 'completada' },
        ];

        api.get.mockResolvedValue({ data: mockTareas });

        render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Tarea 1')).toBeInTheDocument();
            expect(screen.getByText('Tarea 2')).toBeInTheDocument();
            expect(screen.getByText('Tarea 3')).toBeInTheDocument();
        });

        // Ordenar por prioridad
        fireEvent.click(screen.getByText('Ordenar por Prioridad ▲'));
        await waitFor(() => {
            const tareas = screen.getAllByRole('listitem');
            expect(tareas[0]).toHaveTextContent('Tarea 1');
            expect(tareas[1]).toHaveTextContent('Tarea 2');
            expect(tareas[2]).toHaveTextContent('Tarea 3');
        });

        // Ordenar por fecha de vencimiento
        fireEvent.click(screen.getByText('Ordenar por Fecha ▲'));
        await waitFor(() => {
            const tareas = screen.getAllByRole('listitem');
            expect(tareas[0]).toHaveTextContent('Tarea 3');
            expect(tareas[1]).toHaveTextContent('Tarea 2');
            expect(tareas[2]).toHaveTextContent('Tarea 1');
        });
    });
});