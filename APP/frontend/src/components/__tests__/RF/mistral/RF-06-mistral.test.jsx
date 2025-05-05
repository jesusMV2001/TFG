// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/RF/mistral/RF-06-mistral.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
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

describe('RF-06: Visualizar una lista de todas las tareas creadas por el usuario', () => {
    it('debería mostrar una lista de tareas creadas por el usuario', async () => {
        const tareasMock = [
            { id: 1, titulo: 'Tarea 1', estado: 'pendiente', prioridad: 'alta', fecha_vencimiento: '2023-12-01' },
            { id: 2, titulo: 'Tarea 2', estado: 'en_progreso', prioridad: 'media', fecha_vencimiento: '2023-12-10' },
            { id: 3, titulo: 'Tarea 3', estado: 'completada', prioridad: 'baja', fecha_vencimiento: '2023-12-15' },
        ];

        api.get.mockResolvedValue({ data: tareasMock });

        render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith('/api/tareas/');
        });

        tareasMock.forEach((tarea) => {
            expect(screen.getByText(tarea.titulo)).toBeInTheDocument();
            expect(screen.getByText(new Date(tarea.fecha_vencimiento).toLocaleDateString())).toBeInTheDocument();
        });
    });

    it('debería mostrar un mensaje de error si falla la carga de tareas', async () => {
        api.get.mockRejectedValue(new Error('Error al cargar tareas'));

        render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith('/api/tareas/');
        });

        expect(screen.getByText('Error al obtener las tareas')).toBeInTheDocument();
    });
});