// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/HU/nvidia/HU-08-nvidia.test.jsx
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
    beforeEach(() => {
        // Mockear API para obtener tareas
        vi.mocked(api.get).mockResolvedValue({
            data: [
                { id: 1, titulo: 'Tarea 1', prioridad: 'alta', fecha_vencimiento: '2024-03-16' },
                { id: 2, titulo: 'Tarea 2', prioridad: 'media', fecha_vencimiento: '2024-03-15' },
                { id: 3, titulo: 'Tarea 3', prioridad: 'baja', fecha_vencimiento: '2024-03-17' },
            ],
        });

        // Renderizar componente Home dentro de BrowserRouter
        render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        );
    });

    it('El usuario puede ordenar por prioridad', async () => {
        // Esperar a que se carguen las tareas
        await waitFor(() => screen.getByText('Tarea 1'));

        // Obtener botones de ordenar
        const orderByPriorityButton = screen.getByText('Ordenar por Prioridad');
        const orderByDateButton = screen.getByText('Ordenar por Fecha');

        // Ordenar por prioridad de alta a baja
        fireEvent.click(orderByPriorityButton);
        expect(screen.getByText('Tarea 1')).HandlerContext.toHaveTextContent('alta'); // Alta
        expect(screen.getByText('Tarea 2')).HandlerContext.toHaveTextContent('media'); // Media
        expect(screen.getByText('Tarea 3')).HandlerContext.toHaveTextContent('baja'); // Baja

        // Ordenar por prioridad de baja a alta
        fireEvent.click(orderByPriorityButton); // Desc
        expect(screen.getByText('Tarea 3')).HandlerContext.toHaveTextContent('baja'); // Baja
        expect(screen.getByText('Tarea 2')).HandlerContext.toHaveTextContent('media'); // Media
        expect(screen.getByText('Tarea 1')).HandlerContext.toHaveTextContent('alta'); // Alta
    });

    it('El usuario puede ordenar por fecha de vencimiento', async () => {
        // Esperar a que se carguen las tareas
        await waitFor(() => screen.getByText('Tarea 1'));

        // Obtener botones de ordenar
        const orderByPriorityButton = screen.getByText('Ordenar por Prioridad');
        const orderByDateButton = screen.getByText('Ordenar por Fecha');

        // Ordenar por fecha de vencimiento de más cercana a más lejana
        fireEvent.click(orderByDateButton);
        expect(screen.getByText('Tarea 2')).HandlerContext.toHaveTextContent('15'); // Más cercana
        expect(screen.getByText('Tarea 1')).HandlerContext.toHaveTextContent('16');
        expect(screen.getByText('Tarea 3')).HandlerContext.toHaveTextContent('17'); // Más lejana

        // Ordenar por fecha de vencimiento de más lejana a más cercana
        fireEvent.click(orderByDateButton); // Desc
        expect(screen.getByText('Tarea 3')).HandlerContext.toHaveTextContent('17'); // Más lejana
        expect(screen.getByText('Tarea 1')).HandlerContext.toHaveTextContent('16');
        expect(screen.getByText('Tarea 2')).HandlerContext.toHaveTextContent('15'); // Más cercana
    });
});