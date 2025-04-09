// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/HU/nvidia/HU-08-nvidia.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '../../../Home';
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
    it(' ordena tareas por prioridad', async () => {
        // Mock API response con tareas
        api.get.mockResolvedValue({
            data: [
                { id: 1, titulo: 'Tarea 1', prioridad: 'alta' },
                { id: 2, titulo: 'Tarea 2', prioridad: 'media' },
                { id: 3, titulo: 'Tarea 3', prioridad: 'baja' },
            ],
        });

        render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        );

        // Esperar a que se carguen las tareas
        await waitFor(() => screen.getByText('Tarea 1'));

        // Click en el botón de ordenar por prioridad
        const prioridadButton = screen.getByText('Ordenar por Prioridad');
        fireEvent.click(prioridadButton);

        // Verificar que las tareas estén ordenadas por prioridad
        const tareaList = screen.getAllByRole('article');
        expect(tareaList[0]).toHaveTextContent('Tarea 1 - Alta');
        expect(tareaList[1]).toHaveTextContent('Tarea 2 - Media');
        expect(tareaList[2]).toHaveTextContent('Tarea 3 - Baja');
    });

    it('ordena tareas por fecha de vencimiento', async () => {
        // Mock API response con tareas
        api.get.mockResolvedValue({
            data: [
                { id: 1, titulo: 'Tarea 1', fecha_vencimiento: '2024-03-15' },
                { id: 2, titulo: 'Tarea 2', fecha_vencimiento: '2024-03-10' },
                { id: 3, titulo: 'Tarea 3', fecha_vencimiento: '2024-03-20' },
            ],
        });

        render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        );

        // Esperar a que se carguen las tareas
        await waitFor(() => screen.getByText('Tarea 1'));

        // Click en el botón de ordenar por fecha de vencimiento
        const fechaButton = screen.getByText('Ordenar por Fecha');
        fireEvent.click(fechaButton);

        // Verificar que las tareas estén ordenadas por fecha de vencimiento
        const tareaList = screen.getAllByRole('article');
        expect(tareaList[0]).toHaveTextContent('Tarea 2 - 2024-03-10');
        expect(tareaList[1]).toHaveTextContent('Tarea 1 - 2024-03-15');
        expect(tareaList[2]).toHaveTextContent('Tarea 3 - 2024-03-20');
    });
});