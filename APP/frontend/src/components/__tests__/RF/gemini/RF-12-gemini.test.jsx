// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/RF/gemini/RF-12-gemini.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Tarea from '../../../components/Tarea';
import api from '../../../../api';

vi.mock('../../../../api');

describe('RF-12: Registro detallado de acciones sobre tareas', () => {
    const tarea = {
        id: 1,
        titulo: 'Tarea de prueba',
        descripcion: 'Descripción de la tarea de prueba',
        estado: 'pendiente',
        prioridad: 'media',
        fecha_vencimiento: '2024-12-31',
        fecha_creacion: '2024-01-01'
    };

    const mockOnDelete = vi.fn();
    const mockOnUpdate = vi.fn();
    const mockOnDragStart = vi.fn();

    it('Debería llamar a la API para obtener el historial al visualizar los detalles', async () => {
        api.get.mockResolvedValue({ data: [] });

        render(<Tarea tarea={tarea} onDelete={mockOnDelete} onUpdate={mockOnUpdate} onDragStart={mockOnDragStart} />);

        const viewDetailsButton = screen.getByText(/ver/i);
        fireEvent.click(viewDetailsButton);

        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith(`/api/tareas/${tarea.id}/historial/`);
        });
    });

    it('Debería mostrar el historial de cambios si está disponible', async () => {
        const historialData = [
            { id: 1, accion: 'Tarea creada', usuario: 'usuario1', fecha_cambio: '2024-01-01' },
            { id: 2, accion: 'Estado cambiado a en progreso', usuario: 'usuario2', fecha_cambio: '2024-01-02' },
        ];
        api.get.mockResolvedValue({ data: historialData });

        render(<Tarea tarea={tarea} onDelete={mockOnDelete} onUpdate={mockOnUpdate} onDragStart={mockOnDragStart} />);

        const viewDetailsButton = screen.getByText(/ver/i);
        fireEvent.click(viewDetailsButton);

        await waitFor(() => {
            expect(screen.getByText('Tarea creada')).toBeVisible();
            expect(screen.getByText('Estado cambiado a en progreso')).toBeVisible();
        });
    });

    it('Debería mostrar un mensaje si no hay historial de cambios', async () => {
        api.get.mockResolvedValue({ data: [] });

        render(<Tarea tarea={tarea} onDelete={mockOnDelete} onUpdate={mockOnUpdate} onDragStart={mockOnDragStart} />);

        const viewDetailsButton = screen.getByText(/ver/i);
        fireEvent.click(viewDetailsButton);

        await waitFor(() => {
            expect(screen.getByText(/No hay historial de cambios./i)).toBeVisible();
        });
    });
});