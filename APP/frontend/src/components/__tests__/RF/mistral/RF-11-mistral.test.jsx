// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/RF/mistral/RF-11-mistral.test.jsx
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

describe('RF-11: Funcionalidad de búsqueda de tareas', () => {
    it('debe filtrar tareas basadas en palabras clave en el título', async () => {
        const mockTareas = [
            { id: 1, titulo: 'Tarea 1', descripcion: 'Descripción de la tarea 1', estado: 'pendiente', prioridad: 'alta', fecha_vencimiento: '2023-12-31' },
            { id: 2, titulo: 'Tarea 2', descripcion: 'Descripción de la tarea 2', estado: 'pendiente', prioridad: 'media', fecha_vencimiento: '2023-11-30' },
            { id: 3, titulo: 'Tarea 3', descripcion: 'Descripción de la tarea 3', estado: 'completada', prioridad: 'baja', fecha_vencimiento: '2023-10-30' },
        ];

        api.get.mockResolvedValueOnce({ data: mockTareas });

        render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        );

        // Esperar a que las tareas se carguen
        await waitFor(() => expect(screen.getByText('Tarea 1')).toBeInTheDocument());

        // Introducir texto de búsqueda
        fireEvent.change(screen.getByPlaceholderText('Buscar tareas...'), { target: { value: 'Tarea 1' } });

        // Verificar que solo la tarea con título "Tarea 1" se muestra
        expect(screen.getByText('Tarea 1')).toBeInTheDocument();
        expect(screen.queryByText('Tarea 2')).not.toBeInTheDocument();
        expect(screen.queryByText('Tarea 3')).not.toBeInTheDocument();
    });

    it('debe filtrar tareas basadas en palabras clave en la descripción', async () => {
        const mockTareas = [
            { id: 1, titulo: 'Tarea 1', descripcion: 'Descripción de la tarea 1', estado: 'pendiente', prioridad: 'alta', fecha_vencimiento: '2023-12-31' },
            { id: 2, titulo: 'Tarea 2', descripcion: 'Descripción de la tarea 2', estado: 'pendiente', prioridad: 'media', fecha_vencimiento: '2023-11-30' },
            { id: 3, titulo: 'Tarea 3', descripcion: 'Descripción de la tarea 3', estado: 'completada', prioridad: 'baja', fecha_vencimiento: '2023-10-30' },
        ];

        api.get.mockResolvedValueOnce({ data: mockTareas });

        render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        );

        // Esperar a que las tareas se carguen
        await waitFor(() => expect(screen.getByText('Tarea 1')).toBeInTheDocument());

        // Introducir texto de búsqueda
        fireEvent.change(screen.getByPlaceholderText('Buscar tareas...'), { target: { value: 'Descripción de la tarea 2' } });

        // Verificar que solo la tarea con descripción "Descripción de la tarea 2" se muestra
        expect(screen.getByText('Tarea 2')).toBeInTheDocument();
        expect(screen.queryByText('Tarea 1')).not.toBeInTheDocument();
        expect(screen.queryByText('Tarea 3')).not.toBeInTheDocument();
    });

    it('debe mostrar todas las tareas si el campo de búsqueda está vacío', async () => {
        const mockTareas = [
            { id: 1, titulo: 'Tarea 1', descripcion: 'Descripción de la tarea 1', estado: 'pendiente', prioridad: 'alta', fecha_vencimiento: '2023-12-31' },
            { id: 2, titulo: 'Tarea 2', descripcion: 'Descripción de la tarea 2', estado: 'pendiente', prioridad: 'media', fecha_vencimiento: '2023-11-30' },
            { id: 3, titulo: 'Tarea 3', descripcion: 'Descripción de la tarea 3', estado: 'completada', prioridad: 'baja', fecha_vencimiento: '2023-10-30' },
        ];

        api.get.mockResolvedValueOnce({ data: mockTareas });

        render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        );

        // Esperar a que las tareas se carguen
        await waitFor(() => expect(screen.getByText('Tarea 1')).toBeInTheDocument());

        // Introducir texto de búsqueda y luego vaciar el campo
        fireEvent.change(screen.getByPlaceholderText('Buscar tareas...'), { target: { value: 'Tarea 1' } });
        fireEvent.change(screen.getByPlaceholderText('Buscar tareas...'), { target: { value: '' } });

        // Verificar que todas las tareas se muestran
        expect(screen.getByText('Tarea 1')).toBeInTheDocument();
        expect(screen.getByText('Tarea 2')).toBeInTheDocument();
        expect(screen.getByText('Tarea 3')).toBeInTheDocument();
    });
});