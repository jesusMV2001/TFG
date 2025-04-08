# /home/jesus/python/TFG/APP/frontend/src/components/__tests__/HU/gemini/HU-10-gemini.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import Tarea from '../../../Tarea';
import api from '../../../../api';

vi.mock('../../../../api');

describe('HU-10: Historial de Actividades', () => {
  const mockTarea = {
    id: 1,
    titulo: 'Tarea de prueba',
    descripcion: 'Descripción de prueba',
    estado: 'pendiente',
    prioridad: 'media',
    fecha_vencimiento: '2024-12-31',
    fecha_creacion: '2024-01-01',
    etiquetas: [],
  };

  const mockHistorial = [
    {
      id: 1,
      tarea: 'Tarea de prueba',
      accion: 'Creación de la tarea',
      fecha_cambio: '2024-01-01',
      usuario: 'usuario_prueba',
    },
    {
      id: 2,
      tarea: 'Tarea de prueba',
      accion: 'Cambio de estado a En Progreso',
      fecha_cambio: '2024-01-02',
      usuario: 'usuario_prueba',
    },
  ];

  it('Debería mostrar el historial de cambios al hacer clic en el botón de detalles', async () => {
    api.get.mockResolvedValue({ data: mockHistorial });

    render(<Tarea tarea={mockTarea} onDelete={() => {}} onUpdate={() => {}} onDragStart={() => {}} />);

    const detallesButton = screen.getByText('Ver');
    detallesButton.click();

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith(`/api/tareas/${mockTarea.id}/historial/`);
    });

    await waitFor(() => {
        expect(screen.getByText('Historial de Cambios')).toBeVisible();
    });

    expect(screen.getByText('Creación de la tarea')).toBeVisible();
    expect(screen.getByText('Cambio de estado a En Progreso')).toBeVisible();
  });

  it('Debería mostrar un mensaje si no hay historial de cambios', async () => {
    api.get.mockResolvedValue({ data: [] });

    render(<Tarea tarea={mockTarea} onDelete={() => {}} onUpdate={() => {}} onDragStart={() => {}} />);

    const detallesButton = screen.getByText('Ver');
    detallesButton.click();

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith(`/api/tareas/${mockTarea.id}/historial/`);
    });

     await waitFor(() => {
        expect(screen.getByText('Historial de Cambios')).toBeVisible();
    });
    expect(screen.getByText('No hay historial de cambios.')).toBeVisible();
  });
});