// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/RF/gemini/RF-06-gemini.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import Home from '../../../pages/Home';
import api from '../../../../api';
import { BrowserRouter } from 'react-router-dom';

vi.mock('../../../../api');

describe('RF-06: Visualizar lista de tareas', () => {
    it('Debería mostrar "Loading..." mientras se cargan las tareas', () => {
        api.get.mockResolvedValue(Promise.resolve({ data: [] }));
        render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        );
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('Debería mostrar las tareas del usuario cuando se obtienen de la API', async () => {
        const mockTareas = [
            { id: 1, titulo: 'Tarea 1', descripcion: 'Descripción 1', estado: 'pendiente', prioridad: 'alta', fecha_vencimiento: '2024-12-31', fecha_creacion: '2024-01-01' },
            { id: 2, titulo: 'Tarea 2', descripcion: 'Descripción 2', estado: 'en_progreso', prioridad: 'media', fecha_vencimiento: '2024-12-31', fecha_creacion: '2024-01-01' },
            { id: 3, titulo: 'Tarea 3', descripcion: 'Descripción 3', estado: 'completada', prioridad: 'baja', fecha_vencimiento: '2024-12-31', fecha_creacion: '2024-01-01' },
        ];

        api.get.mockResolvedValue({ data: mockTareas });

        render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Tarea 1')).toBeInTheDocument();
            expect(screen.getByText('Tarea 2')).toBeInTheDocument();
            expect(screen.getByText('Tarea 3')).toBeInTheDocument();
        });
    });

    it('Debería mostrar un mensaje de error si falla la llamada a la API', async () => {
        api.get.mockRejectedValue(new Error('Error al obtener las tareas'));

        render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith("/api/tareas/");
        });

        // Verificar que se muestra el Toast con el mensaje de error.  Asumiendo que el Toast se muestra inmediatamente.
        await waitFor(() => {
            expect(screen.getByText('Error al obtener las tareas')).toBeVisible();
        }, { timeout: 3500 }); // Tiempo de espera ajustado para el toast.
    });

    it('Debería mostrar las tareas en las columnas correspondientes según su estado', async () => {
        const mockTareas = [
            { id: 1, titulo: 'Tarea Pendiente', descripcion: 'Descripción 1', estado: 'pendiente', prioridad: 'alta', fecha_vencimiento: '2024-12-31', fecha_creacion: '2024-01-01' },
            { id: 2, titulo: 'Tarea En Progreso', descripcion: 'Descripción 2', estado: 'en_progreso', prioridad: 'media', fecha_vencimiento: '2024-12-31', fecha_creacion: '2024-01-01' },
            { id: 3, titulo: 'Tarea Completada', descripcion: 'Descripción 3', estado: 'completada', prioridad: 'baja', fecha_vencimiento: '2024-12-31', fecha_creacion: '2024-01-01' },
        ];

        api.get.mockResolvedValue({ data: mockTareas });

        render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Tarea Pendiente')).toBeInTheDocument();
            expect(screen.getByText('Tarea En Progreso')).toBeInTheDocument();
            expect(screen.getByText('Tarea Completada')).toBeInTheDocument();
        });

        const pendienteColumn = screen.getByText('Pendientes').closest('div');
        const enProgresoColumn = screen.getByText('En Progreso').closest('div');
        const completadaColumn = screen.getByText('Completadas').closest('div');

        expect(pendienteColumn).toContain(screen.getByText('Tarea Pendiente'));
        expect(enProgresoColumn).toContain(screen.getByText('Tarea En Progreso'));
        expect(completadaColumn).toContain(screen.getByText('Tarea Completada'));
    });
});