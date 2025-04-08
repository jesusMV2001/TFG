// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/HU/gemini/HU-08-gemini.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '../../../pages/Home';
import api from '../../../../api';

vi.mock('../../../../api');

const mockTareas = [
    { id: 1, titulo: 'Tarea 1', prioridad: 'alta', fecha_vencimiento: '2024-01-05', estado: 'pendiente', descripcion: 'descripcion 1' },
    { id: 2, titulo: 'Tarea 2', prioridad: 'baja', fecha_vencimiento: '2024-01-10', estado: 'pendiente', descripcion: 'descripcion 2' },
    { id: 3, titulo: 'Tarea 3', prioridad: 'media', fecha_vencimiento: '2024-01-01', estado: 'pendiente', descripcion: 'descripcion 3' },
];

describe('HU-08: Ordenar Tareas', () => {

    it('Debería ordenar las tareas por prioridad al hacer clic en el botón "Ordenar por Prioridad"', async () => {
        api.get.mockResolvedValue({ data: mockTareas });

        render(<Home />);

        await waitFor(() => expect(api.get).toHaveBeenCalledWith("/api/tareas/"));

        const ordenarPrioridadButton = screen.getByText(/Ordenar por Prioridad/i);
        fireEvent.click(ordenarPrioridadButton);

        const tarea1 = screen.getByText('Tarea 1');
        const tarea2 = screen.getByText('Tarea 2');
        const tarea3 = screen.getByText('Tarea 3');

        const tareasContainer = tarea1.closest('.space-y-4');

        const children = [...tareasContainer.children];
        const indexTarea1 = children.findIndex(child => child.textContent.includes('Tarea 1'));
        const indexTarea2 = children.findIndex(child => child.textContent.includes('Tarea 2'));
        const indexTarea3 = children.findIndex(child => child.textContent.includes('Tarea 3'));

        expect(indexTarea1).toBeLessThan(indexTarea3); // Alta antes de Media
        expect(indexTarea3).toBeLessThan(indexTarea2); // Media antes de Baja
    });

    it('Debería ordenar las tareas por fecha al hacer clic en el botón "Ordenar por Fecha"', async () => {
        api.get.mockResolvedValue({ data: mockTareas });

        render(<Home />);

        await waitFor(() => expect(api.get).toHaveBeenCalledWith("/api/tareas/"));

        const ordenarFechaButton = screen.getByText(/Ordenar por Fecha/i);
        fireEvent.click(ordenarFechaButton);

        const tarea1 = screen.getByText('Tarea 1');
        const tarea2 = screen.getByText('Tarea 2');
        const tarea3 = screen.getByText('Tarea 3');

        const tareasContainer = tarea1.closest('.space-y-4');

        const children = [...tareasContainer.children];
        const indexTarea1 = children.findIndex(child => child.textContent.includes('Tarea 1'));
        const indexTarea2 = children.findIndex(child => child.textContent.includes('Tarea 2'));
        const indexTarea3 = children.findIndex(child => child.textContent.includes('Tarea 3'));

        expect(indexTarea3).toBeLessThan(indexTarea1); // 2024-01-01 antes de 2024-01-05
        expect(indexTarea1).toBeLessThan(indexTarea2); // 2024-01-05 antes de 2024-01-10
    });

    it('Debería invertir el orden de la prioridad al hacer doble clic en el botón "Ordenar por Prioridad"', async () => {
        api.get.mockResolvedValue({ data: mockTareas });

        render(<Home />);

        await waitFor(() => expect(api.get).toHaveBeenCalledWith("/api/tareas/"));

        const ordenarPrioridadButton = screen.getByText(/Ordenar por Prioridad/i);
        fireEvent.click(ordenarPrioridadButton);
        fireEvent.click(ordenarPrioridadButton);

        const tarea1 = screen.getByText('Tarea 1');
        const tarea2 = screen.getByText('Tarea 2');
        const tarea3 = screen.getByText('Tarea 3');

        const tareasContainer = tarea1.closest('.space-y-4');

        const children = [...tareasContainer.children];
        const indexTarea1 = children.findIndex(child => child.textContent.includes('Tarea 1'));
        const indexTarea2 = children.findIndex(child => child.textContent.includes('Tarea 2'));
        const indexTarea3 = children.findIndex(child => child.textContent.includes('Tarea 3'));
        expect(indexTarea2).toBeLessThan(indexTarea3); // Baja antes de Media
        expect(indexTarea3).toBeLessThan(indexTarea1); // Media antes de Alta
    });

    it('Debería invertir el orden de la fecha al hacer doble clic en el botón "Ordenar por Fecha"', async () => {
        api.get.mockResolvedValue({ data: mockTareas });

        render(<Home />);

        await waitFor(() => expect(api.get).toHaveBeenCalledWith("/api/tareas/"));

        const ordenarFechaButton = screen.getByText(/Ordenar por Fecha/i);
        fireEvent.click(ordenarFechaButton);
        fireEvent.click(ordenarFechaButton);

        const tarea1 = screen.getByText('Tarea 1');
        const tarea2 = screen.getByText('Tarea 2');
        const tarea3 = screen.getByText('Tarea 3');

        const tareasContainer = tarea1.closest('.space-y-4');

        const children = [...tareasContainer.children];
        const indexTarea1 = children.findIndex(child => child.textContent.includes('Tarea 1'));
        const indexTarea2 = children.findIndex(child => child.textContent.includes('Tarea 2'));
        const indexTarea3 = children.findIndex(child => child.textContent.includes('Tarea 3'));

        expect(indexTarea2).toBeLessThan(indexTarea1); // 2024-01-10 antes de 2024-01-05
        expect(indexTarea1).toBeLessThan(indexTarea3); // 2024-01-05 antes de 2024-01-01
    });
});