// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/HU/mistral/HU-07-mistral.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '../../../Home';
import Tarea from '../../../Tarea';
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

describe('HU-07: Marcado de Tareas Completadas', () => {
    const mockTareas = [
        { id: 1, titulo: 'Tarea 1', estado: 'pendiente', prioridad: 'media', fecha_vencimiento: '2023-12-01' },
        { id: 2, titulo: 'Tarea 2', estado: 'en_progreso', prioridad: 'alta', fecha_vencimiento: '2023-11-25' },
    ];

    it('Debe cambiar el estado de una tarea a "completada" al marcarla como completada', async () => {
        api.get.mockResolvedValue({ data: mockTareas });
        api.put.mockResolvedValue({ status: 200 });

        render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        );

        // Esperar a que las tareas se carguen
        await waitFor(() => {
            expect(screen.getByText('Tarea 1')).toBeInTheDocument();
            expect(screen.getByText('Tarea 2')).toBeInTheDocument();
        });

        // Simular el arrastre de la tarea a la columna de completadas
        const tarea1 = screen.getByText('Tarea 1').closest('div');
        fireEvent.dragStart(tarea1, { dataTransfer: { setData: vi.fn(), dropEffect: 'move' } });

        const columnCompletadas = screen.getByText('Completadas').closest('div');
        fireEvent.drop(columnCompletadas);

        // Esperar a que la tarea se actualice
        await waitFor(() => {
            expect(api.put).toHaveBeenCalledWith('/api/tareas/update/1/', {
                titulo: 'Tarea 1',
                estado: 'completada',
                prioridad: 'media',
                fecha_vencimiento: '2023-12-01',
            });
        });

        // Verificar que la tarea se haya movido a la columna de completadas
        expect(screen.getByText('Tarea 1').closest('div')).toBeInTheDocument();
        expect(screen.getByText('Tarea 1').closest('div').parentElement).toHaveTextContent('Completadas');
    });
});