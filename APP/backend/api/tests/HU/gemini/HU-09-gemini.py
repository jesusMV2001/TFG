# /home/jesus/python/TFG/APP/frontend/src/components/__tests__/HU/gemini/HU-09-gemini.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '../../../pages/Home';
import api from '../../../../api';
import { BrowserRouter } from 'react-router-dom';

vi.mock('../../../../api');

describe('HU-09: Busqueda de Tareas', () => {
    it('Debería filtrar las tareas por titulo al ingresar una palabra clave', async () => {
        const tareasMock = [
            { id: 1, titulo: 'Tarea urgente', descripcion: 'Descripción de la tarea urgente', estado: 'pendiente', prioridad: 'alta', fecha_vencimiento: '2024-12-31' },
            { id: 2, titulo: 'Tarea importante', descripcion: 'Descripción de la tarea importante', estado: 'en_progreso', prioridad: 'media', fecha_vencimiento: '2024-12-25' },
            { id: 3, titulo: 'Tarea sencilla', descripcion: 'Descripción de la tarea sencilla', estado: 'completada', prioridad: 'baja', fecha_vencimiento: '2024-12-20' },
        ];
        api.get.mockResolvedValue({ data: tareasMock });

        render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        );

        await waitFor(() => expect(api.get).toHaveBeenCalled());

        const inputBusqueda = screen.getByPlaceholderText('Buscar tareas...');
        fireEvent.change(inputBusqueda, { target: { value: 'urgente' } });

        await waitFor(() => {
            expect(screen.getByText('Tarea urgente')).toBeVisible();
            expect(screen.queryByText('Tarea importante')).toBeNull();
            expect(screen.queryByText('Tarea sencilla')).toBeNull();
        });
    });

    it('Debería filtrar las tareas por descripcion al ingresar una palabra clave', async () => {
        const tareasMock = [
            { id: 1, titulo: 'Tarea urgente', descripcion: 'Descripción de la tarea urgente', estado: 'pendiente', prioridad: 'alta', fecha_vencimiento: '2024-12-31' },
            { id: 2, titulo: 'Tarea importante', descripcion: 'Descripción de la tarea importante', estado: 'en_progreso', prioridad: 'media', fecha_vencimiento: '2024-12-25' },
            { id: 3, titulo: 'Tarea sencilla', descripcion: 'Descripción de la tarea sencilla', estado: 'completada', prioridad: 'baja', fecha_vencimiento: '2024-12-20' },
        ];
        api.get.mockResolvedValue({ data: tareasMock });

        render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        );

        await waitFor(() => expect(api.get).toHaveBeenCalled());

        const inputBusqueda = screen.getByPlaceholderText('Buscar tareas...');
        fireEvent.change(inputBusqueda, { target: { value: 'importante' } });

        await waitFor(() => {
            expect(screen.getByText('Tarea importante')).toBeVisible();
            expect(screen.queryByText('Tarea urgente')).toBeNull();
            expect(screen.queryByText('Tarea sencilla')).toBeNull();
        });
    });

    it('Debería mostrar todas las tareas cuando el input de búsqueda está vacio', async () => {
        const tareasMock = [
            { id: 1, titulo: 'Tarea urgente', descripcion: 'Descripción de la tarea urgente', estado: 'pendiente', prioridad: 'alta', fecha_vencimiento: '2024-12-31' },
            { id: 2, titulo: 'Tarea importante', descripcion: 'Descripción de la tarea importante', estado: 'en_progreso', prioridad: 'media', fecha_vencimiento: '2024-12-25' },
            { id: 3, titulo: 'Tarea sencilla', descripcion: 'Descripción de la tarea sencilla', estado: 'completada', prioridad: 'baja', fecha_vencimiento: '2024-12-20' },
        ];
        api.get.mockResolvedValue({ data: tareasMock });

        render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        );

        await waitFor(() => expect(api.get).toHaveBeenCalled());

        const inputBusqueda = screen.getByPlaceholderText('Buscar tareas...');
        fireEvent.change(inputBusqueda, { target: { value: '' } });

        await waitFor(() => {
            expect(screen.getByText('Tarea urgente')).toBeVisible();
            expect(screen.getByText('Tarea importante')).toBeVisible();
            expect(screen.getByText('Tarea sencilla')).toBeVisible();
        });
    });
});