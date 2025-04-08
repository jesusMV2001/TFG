# /home/jesus/python/TFG/APP/frontend/src/components/__tests__/HU/gemini/HU-08-gemini.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '../../../pages/Home';
import api from '../../../../api';

vi.mock('../../../../api');

describe('HU-08: Ordenar Tareas', () => {
    it('Debería renderizar los botones de ordenamiento', () => {
        api.get.mockResolvedValue({ data: [] });
        render(<Home />);
        expect(screen.getByText(/Ordenar por Prioridad/i)).toBeInTheDocument();
        expect(screen.getByText(/Ordenar por Fecha/i)).toBeInTheDocument();
    });

    it('Debería cambiar la dirección del ordenamiento de prioridad al hacer click', async () => {
        api.get.mockResolvedValue({ data: [] });
        render(<Home />);
        const prioridadButton = screen.getByText(/Ordenar por Prioridad/i);
        
        fireEvent.click(prioridadButton);
        await waitFor(() => expect(prioridadButton.textContent).toContain('▼'));

        fireEvent.click(prioridadButton);
        await waitFor(() => expect(prioridadButton.textContent).toContain('▲'));
    });

    it('Debería cambiar la dirección del ordenamiento de fecha al hacer click', async () => {
        api.get.mockResolvedValue({ data: [] });
        render(<Home />);
        const fechaButton = screen.getByText(/Ordenar por Fecha/i);

        fireEvent.click(fechaButton);
        await waitFor(() => expect(fechaButton.textContent).toContain('▼'));

        fireEvent.click(fechaButton);
        await waitFor(() => expect(fechaButton.textContent).toContain('▲'));
    });

    it('Debería ordenar las tareas por prioridad correctamente', async () => {
        const mockTareas = [
            { id: 1, titulo: 'Tarea Baja', prioridad: 'baja', fecha_vencimiento: '2024-12-31', estado: 'pendiente' },
            { id: 2, titulo: 'Tarea Alta', prioridad: 'alta', fecha_vencimiento: '2024-12-31', estado: 'pendiente' },
            { id: 3, titulo: 'Tarea Media', prioridad: 'media', fecha_vencimiento: '2024-12-31', estado: 'pendiente' },
        ];
        api.get.mockResolvedValue({ data: mockTareas });
        render(<Home />);

        const prioridadButton = screen.getByText(/Ordenar por Prioridad/i);
        fireEvent.click(prioridadButton);
        await waitFor(() => {
            const tareas = screen.getAllByText(/Tarea/i);
            expect(tareas[0].textContent).toContain('Tarea Alta');
            expect(tareas[1].textContent).toContain('Tarea Media');
            expect(tareas[2].textContent).toContain('Tarea Baja');
        });

        fireEvent.click(prioridadButton);
        await waitFor(() => {
            const tareas = screen.getAllByText(/Tarea/i);
            expect(tareas[0].textContent).toContain('Tarea Baja');
            expect(tareas[1].textContent).toContain('Tarea Media');
            expect(tareas[2].textContent).toContain('Tarea Alta');
        });
    });

    it('Debería ordenar las tareas por fecha correctamente', async () => {
        const mockTareas = [
            { id: 1, titulo: 'Tarea 2025', prioridad: 'media', fecha_vencimiento: '2025-01-01', estado: 'pendiente' },
            { id: 2, titulo: 'Tarea 2023', prioridad: 'media', fecha_vencimiento: '2023-01-01', estado: 'pendiente' },
            { id: 3, titulo: 'Tarea 2024', prioridad: 'media', fecha_vencimiento: '2024-01-01', estado: 'pendiente' },
        ];
        api.get.mockResolvedValue({ data: mockTareas });
        render(<Home />);

        const fechaButton = screen.getByText(/Ordenar por Fecha/i);
        fireEvent.click(fechaButton);

        await waitFor(() => {
            const tareas = screen.getAllByText(/Tarea/i);
            expect(tareas[0].textContent).toContain('Tarea 2023');
            expect(tareas[1].textContent).toContain('Tarea 2024');
            expect(tareas[2].textContent).toContain('Tarea 2025');
        });

        fireEvent.click(fechaButton);
        await waitFor(() => {
            const tareas = screen.getAllByText(/Tarea/i);
            expect(tareas[0].textContent).toContain('Tarea 2025');
            expect(tareas[1].textContent).toContain('Tarea 2024');
            expect(tareas[2].textContent).toContain('Tarea 2023');
        });
    });
});