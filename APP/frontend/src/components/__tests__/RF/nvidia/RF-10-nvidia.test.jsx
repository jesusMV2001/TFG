// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/RF/nvidia/RF-10-nvidia.test.jsx
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

describe('RF-10: Ordenar tareas por prioridad o fecha de vencimiento', () => {
    beforeEach(() => {
        // Mockear API para devolver tareas con distintas prioridades y fechas
        api.get.mockResolvedValue({
            data: [
                { id: 1, titulo: 'Tarea 1', prioridad: 'alta', fecha_vencimiento: '2024-03-15' },
                { id: 2, titulo: 'Tarea 2', prioridad: 'media', fecha_vencimiento: '2024-03-10' },
                { id: 3, titulo: 'Tarea 3', prioridad: 'baja', fecha_vencimiento: '2024-03-20' },
            ],
        });
    });

    it('Debe mostrar botones para ordenar por prioridad y fecha de vencimiento', () => {
        render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        );

        expect(screen.getByText('Ordenar por Prioridad')).toBeInTheDocument();
        expect(screen.getByText('Ordenar por Fecha')).toBeInTheDocument();
    });

    it('Debe ordenar tareas por prioridad de manera ascendente por defecto', async () => {
        render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        );

        await waitFor(() => screen.getByText('Tarea 3')); // Esperar a que las tareas se carguen

        const tareas = screen.getAllByTestId('tarea'); // Asumir que cada tarea tiene un testId="tarea"

        expect(tareas[0].textContent).toContain('Tarea 3'); // Baja prioridad primera
        expect(tareas[1].textContent).toContain('Tarea 2'); // Media prioridad segunda
        expect(tareas[2].textContent).toContain('Tarea 1'); // Alta prioridad tercera
    });

    it('Debe ordenar tareas por prioridad de manera descendente al hacer clic en el botón de prioridad', async () => {
        render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        );

        await waitFor(() => screen.getByText('Tarea 3')); // Esperar a que las tareas se carguen

        const prioridadButton = screen.getByText('Ordenar por Prioridad');
        fireEvent.click(prioridadButton); // Hacer clic en el botón de prioridad

        const tareas = screen.getAllByTestId('tarea'); // Asumir que cada tarea tiene un testId="tarea"

        expect(tareas[0].textContent).toContain('Tarea 1'); // Alta prioridad primera
        expect(tareas[1].textContent).toContain('Tarea 2'); // Media prioridad segunda
        expect(tareas[2].textContent).toContain('Tarea 3'); // Baja prioridad tercera
    });

    it('Debe ordenar tareas por fecha de vencimiento de manera ascendente al hacer clic en el botón de fecha', async () => {
        render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        );

        await waitFor(() => screen.getByText('Tarea 3')); // Esperar a que las tareas se carguen

        const fechaButton = screen.getByText('Ordenar por Fecha');
        fireEvent.click(fechaButton); // Hacer clic en el botón de fecha

        const tareas = screen.getAllByTestId('tarea'); // Asumir que cada tarea tiene un testId="tarea"

        expect(tareas[0].textContent).toContain('Tarea 2'); // Fecha más cercana primera
        expect(tareas[1].textContent).toContain('Tarea 1'); // Fecha intermedia segunda
        expect(tareas[2].textContent).toContain('Tarea 3'); // Fecha más lejana tercera
    });

    it('Debe ordenar tareas por fecha de vencimiento de manera descendente al hacer clic nuevamente en el botón de fecha', async () => {
        render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        );

        await waitFor(() => screen.getByText('Tarea 3')); // Esperar a que las tareas se carguen

        const fechaButton = screen.getByText('Ordenar por Fecha');
        fireEvent.click(fechaButton); // Hacer clic en el botón de fecha
        fireEvent.click(fechaButton); // Hacer clic nuevamente en el botón de fecha

        const tareas = screen.getAllByTestId('tarea'); // Asumir que cada tarea tiene un testId="tarea"

        expect(tareas[0].textContent).toContain('Tarea 3'); // Fecha más lejana primera
        expect(tareas[1].textContent).toContain('Tarea 1'); // Fecha intermedia segunda
        expect(tareas[2].textContent).toContain('Tarea 2'); // Fecha más cercana tercera
    });
});