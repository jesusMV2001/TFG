// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/HU/mistral/HU-09-mistral.test.jsx
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

describe('HU-09: Búsqueda de Tareas', () => {
    it('debe mostrar solo las tareas que contienen la palabra clave en el título o descripción', async () => {
        const tareas = [
            { id: 1, titulo: 'Tarea 1', descripcion: 'Descripción de la tarea 1', estado: 'pendiente', prioridad: 'alta', fecha_vencimiento: '2023-12-31' },
            { id: 2, titulo: 'Tarea 2', descripcion: 'Descripción de la tarea 2', estado: 'pendiente', prioridad: 'media', fecha_vencimiento: '2023-12-31' },
            { id: 3, titulo: 'Tarea 3', descripcion: 'Descripción de la tarea 3', estado: 'pendiente', prioridad: 'baja', fecha_vencimiento: '2023-12-31' },
        ];

        api.get.mockResolvedValue({ data: tareas });

        render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        );

        await waitFor(() => expect(screen.getAllByText(/Tarea/i)).toHaveLength(3));

        const searchInput = screen.getByPlaceholderText('Buscar tareas...');
        fireEvent.change(searchInput, { target: { value: 'Tarea 1' } });

        await waitFor(() => expect(screen.getAllByText(/Tarea/i)).toHaveLength(1));
        expect(screen.getByText('Tarea 1')).toBeInTheDocument();

        fireEvent.change(searchInput, { target: { value: 'Descripción de la tarea 2' } });

        await waitFor(() => expect(screen.getAllByText(/Tarea/i)).toHaveLength(1));
        expect(screen.getByText('Tarea 2')).toBeInTheDocument();

        fireEvent.change(searchInput, { target: { value: 'Tarea 3' } });

        await waitFor(() => expect(screen.getAllByText(/Tarea/i)).toHaveLength(1));
        expect(screen.getByText('Tarea 3')).toBeInTheDocument();
    });
});