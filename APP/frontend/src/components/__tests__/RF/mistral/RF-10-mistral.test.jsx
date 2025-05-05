// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/RF/mistral/RF-10-mistral.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '../../../../pages/Home';
import { BrowserRouter } from 'react-router-dom';

vi.mock('../../../../api');

describe('RF-10: Ordenar tareas por prioridad o fecha de vencimiento', () => {
    it('Debe ordenar las tareas por prioridad en orden ascendente', async () => {
        render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        );

        // Simular que hay tareas y ordenarlas por prioridad
        fireEvent.click(screen.getByText(/Ordenar por Prioridad/));

        // Esperar a que las tareas se ordenen
        await waitFor(() => {
            const tareas = screen.getAllByTestId('tarea');
            const prioridades = tareas.map(tarea => tarea.getAttribute('data-prioridad'));
            const prioridadesOrdenadas = [...prioridades].sort();
            expect(prioridades).toEqual(prioridadesOrdenadas);
        });
    });

    it('Debe ordenar las tareas por prioridad en orden descendente', async () => {
        render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        );

        // Simular que hay tareas y ordenarlas por prioridad en orden descendente
        fireEvent.click(screen.getByText(/Ordenar por Prioridad/));
        fireEvent.click(screen.getByText(/Ordenar por Prioridad/));

        // Esperar a que las tareas se ordenen
        await waitFor(() => {
            const tareas = screen.getAllByTestId('tarea');
            const prioridades = tareas.map(tarea => tarea.getAttribute('data-prioridad'));
            const prioridadesOrdenadas = [...prioridades].sort().reverse();
            expect(prioridades).toEqual(prioridadesOrdenadas);
        });
    });

    it('Debe ordenar las tareas por fecha de vencimiento en orden ascendente', async () => {
        render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        );

        // Simular que hay tareas y ordenarlas por fecha de vencimiento
        fireEvent.click(screen.getByText(/Ordenar por Fecha/));

        // Esperar a que las tareas se ordenen
        await waitFor(() => {
            const tareas = screen.getAllByTestId('tarea');
            const fechas = tareas.map(tarea => tarea.getAttribute('data-fecha-vencimiento'));
            const fechasOrdenadas = [...fechas].sort();
            expect(fechas).toEqual(fechasOrdenadas);
        });
    });

    it('Debe ordenar las tareas por fecha de vencimiento en orden descendente', async () => {
        render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        );

        // Simular que hay tareas y ordenarlas por fecha de vencimiento en orden descendente
        fireEvent.click(screen.getByText(/Ordenar por Fecha/));
        fireEvent.click(screen.getByText(/Ordenar por Fecha/));

        // Esperar a que las tareas se ordenen
        await waitFor(() => {
            const tareas = screen.getAllByTestId('tarea');
            const fechas = tareas.map(tarea => tarea.getAttribute('data-fecha-vencimiento'));
            const fechasOrdenadas = [...fechas].sort().reverse();
            expect(fechas).toEqual(fechasOrdenadas);
        });
    });
});