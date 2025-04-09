// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/HU/gemini/HU-10-gemini.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Tarea from '../../../components/Tarea';
import api from '../../../../api';

vi.mock('../../../../api');

describe('HU-10: Historial de Actividades', () => {
  const mockTarea = {
    id: 1,
    titulo: 'Tarea de prueba',
    descripcion: 'Descripción de la tarea',
    fecha_creacion: '2024-01-01T12:00:00Z',
    fecha_vencimiento: '2024-01-08T12:00:00Z',
    estado: 'pendiente',
    prioridad: 'media'
  };

  const mockHistorial = [
    { id: 1, accion: 'Tarea creada', fecha_cambio: '2024-01-01T12:00:00Z', usuario: 'usuario1' },
    { id: 2, accion: 'Estado cambiado a en progreso', fecha_cambio: '2024-01-02T12:00:00Z', usuario: 'usuario1' }
  ];

  const mockOnDelete = vi.fn();
  const mockOnUpdate = vi.fn();
  const mockOnDragStart = vi.fn();

  it('Debería mostrar el botón para ver los detalles de la tarea', () => {
    render(
      <Tarea
        tarea={mockTarea}
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
        onDragStart={mockOnDragStart}
      />
    );
    const detallesButton = screen.getByRole('button', { name: /ver detalles/i });
    expect(detallesButton).toBeInTheDocument();
  });

  it('Debería cargar y mostrar el historial de actividades al hacer clic en el botón de detalles', async () => {
    api.get.mockResolvedValue({ data: mockHistorial });

    render(
      <Tarea
        tarea={mockTarea}
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
        onDragStart={mockOnDragStart}
      />
    );

    const detallesButton = screen.getByRole('button', { name: /ver detalles/i });
    fireEvent.click(detallesButton);

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith(`/api/tareas/${mockTarea.id}/historial/`);
    });

    await waitFor(() => {
      expect(screen.getByText('Tarea creada')).toBeInTheDocument();
      expect(screen.getByText('Estado cambiado a en progreso')).toBeInTheDocument();
    });
  });

  it('Debería mostrar "No hay historial de cambios" si no hay historial', async () => {
    api.get.mockResolvedValue({ data: [] });

    render(
      <Tarea
        tarea={mockTarea}
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
        onDragStart={mockOnDragStart}
      />
    );

    const detallesButton = screen.getByRole('button', { name: /ver detalles/i });
    fireEvent.click(detallesButton);

    await waitFor(() => {
      expect(screen.getByText('No hay historial de cambios.')).toBeInTheDocument();
    });
  });
});