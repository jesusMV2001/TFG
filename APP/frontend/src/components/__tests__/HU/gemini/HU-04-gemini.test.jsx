// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/HU/gemini/HU-04-gemini.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import Home from '../../../pages/Home';
import api from '../../../../api';
import { BrowserRouter } from 'react-router-dom';

vi.mock('../../../../api');

describe('HU-04: Ver tareas', () => {
    it('Al acceder a la lista de tareas, se deben mostrar todas las tareas asociadas al usuario.', async () => {
        const mockTareas = [
            { id: 1, titulo: 'Tarea 1', descripcion: 'Descripcion 1', estado: 'pendiente', prioridad: 'alta', fecha_vencimiento: '2024-01-01' },
            { id: 2, titulo: 'Tarea 2', descripcion: 'Descripcion 2', estado: 'en_progreso', prioridad: 'media', fecha_vencimiento: '2024-01-02' },
            { id: 3, titulo: 'Tarea 3', descripcion: 'Descripcion 3', estado: 'completada', prioridad: 'baja', fecha_vencimiento: '2024-01-03' },
        ];

        api.get.mockResolvedValue({ data: mockTareas });

        render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith("/api/tareas/");
        });

        await waitFor(() => {
            expect(screen.getByText('Tarea 1')).toBeInTheDocument();
            expect(screen.getByText('Tarea 2')).toBeInTheDocument();
            expect(screen.getByText('Tarea 3')).toBeInTheDocument();
        });

    });

    it('Cada tarea debe estar agrupada segun su estado.', async () => {
        const mockTareas = [
            { id: 1, titulo: 'Tarea 1', descripcion: 'Descripcion 1', estado: 'pendiente', prioridad: 'alta', fecha_vencimiento: '2024-01-01' },
            { id: 2, titulo: 'Tarea 2', descripcion: 'Descripcion 2', estado: 'en_progreso', prioridad: 'media', fecha_vencimiento: '2024-01-02' },
            { id: 3, titulo: 'Tarea 3', descripcion: 'Descripcion 3', estado: 'completada', prioridad: 'baja', fecha_vencimiento: '2024-01-03' },
        ];

        api.get.mockResolvedValue({ data: mockTareas });

        render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Pendientes')).toBeInTheDocument();
            expect(screen.getByText('En Progreso')).toBeInTheDocument();
            expect(screen.getByText('Completadas')).toBeInTheDocument();
        });


        const pendienteColumn = screen.getByText('Pendientes').closest('.bg-gray-50');
        const enProgresoColumn = screen.getByText('En Progreso').closest('.bg-gray-50');
        const completadaColumn = screen.getByText('Completadas').closest('.bg-gray-50');

        await waitFor(() => {
            expect(pendienteColumn).toContain(screen.getByText('Tarea 1'));
            expect(enProgresoColumn).toContain(screen.getByText('Tarea 2'));
            expect(completadaColumn).toContain(screen.getByText('Tarea 3'));
        });

    });

    it('Maneja el caso en que no hay tareas', async () => {
        api.get.mockResolvedValue({ data: [] });

        render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith("/api/tareas/");
        });

        // Puedes agregar una aserción para verificar que se muestra un mensaje de "No hay tareas" o similar.
        // Por ejemplo, si tu componente muestra un mensaje cuando no hay tareas:
       // await waitFor(() => {
       //     expect(screen.getByText('No hay tareas')).toBeInTheDocument();
       // });
    });

    it('Maneja el error al obtener las tareas', async () => {
        api.get.mockRejectedValue(new Error('Error al obtener las tareas'));

        render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith("/api/tareas/");
        });

        // Puedes agregar una aserción para verificar que se muestra un mensaje de error.
        // Por ejemplo, si tu componente muestra un mensaje de error:
        // await waitFor(() => {
        //    expect(screen.getByText('Error al obtener las tareas')).toBeInTheDocument();
        // });
    });
});