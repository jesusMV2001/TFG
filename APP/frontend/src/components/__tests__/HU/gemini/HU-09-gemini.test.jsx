// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/HU/gemini/HU-09-gemini.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '../../../pages/Home';
import api from '../../../../api';

vi.mock('../../../../api');

describe('HU-09: Busqueda de Tareas', () => {
    const mockTareas = [
        { id: 1, titulo: 'Tarea con palabra clave', descripcion: 'Esta tarea tiene la palabra clave en la descripción', estado: 'pendiente', prioridad: 'alta', fecha_vencimiento: '2024-01-01' },
        { id: 2, titulo: 'Otra tarea', descripcion: 'Descripción sin la palabra clave', estado: 'pendiente', prioridad: 'media', fecha_vencimiento: '2024-01-02' },
        { id: 3, titulo: 'Tarea con palabra clave en titulo', descripcion: 'Descripción de otra tarea', estado: 'pendiente', prioridad: 'baja', fecha_vencimiento: '2024-01-03' },
    ];

    it('Al ingresar una palabra clave en la busqueda, se mostraran unicamente las tareas cuyo titulo o descripcion contiene dicha palabra', async () => {
        api.get.mockResolvedValue({ data: mockTareas });

        render(<Home />);

        await waitFor(() => expect(api.get).toHaveBeenCalledWith("/api/tareas/"));

        const searchInput = screen.getByPlaceholderText('Buscar tareas...');
        fireEvent.change(searchInput, { target: { value: 'palabra clave' } });

        await waitFor(() => {
            expect(screen.getAllByText(/palabra clave/i).length).toBeGreaterThan(0);
            expect(screen.queryByText(/Otra tarea/i)).toBeNull();
        });
    });

    it('Debería mostrar todas las tareas si el campo de búsqueda está vacío', async () => {
        api.get.mockResolvedValue({ data: mockTareas });

        render(<Home />);

        await waitFor(() => expect(api.get).toHaveBeenCalledWith("/api/tareas/"));

        const searchInput = screen.getByPlaceholderText('Buscar tareas...');
        fireEvent.change(searchInput, { target: { value: '' } });

        await waitFor(() => {
            expect(screen.getAllByText(/Tarea con palabra clave/i).length).toBeGreaterThan(0);
            expect(screen.getAllByText(/Otra tarea/i).length).toBeGreaterThan(0);
            expect(screen.getAllByText(/Tarea con palabra clave en titulo/i).length).toBeGreaterThan(0);
        });
    });

    it('Debería mostrar "No hay tareas" si no se encuentran tareas con la palabra clave', async () => {
        api.get.mockResolvedValue({ data: mockTareas });

        render(<Home />);

        await waitFor(() => expect(api.get).toHaveBeenCalledWith("/api/tareas/"));

        const searchInput = screen.getByPlaceholderText('Buscar tareas...');
        fireEvent.change(searchInput, { target: { value: 'nonexistentkeyword' } });

        await waitFor(() => {
            expect(screen.queryByText(/Tarea con palabra clave/i)).toBeNull();
            expect(screen.queryByText(/Otra tarea/i)).toBeNull();
            expect(screen.queryByText(/Tarea con palabra clave en titulo/i)).toBeNull();
        });
    });
});