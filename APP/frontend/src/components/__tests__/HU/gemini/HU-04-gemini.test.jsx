# /home/jesus/python/TFG/APP/frontend/src/components/__tests__/HU/gemini/HU-04-gemini.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import Home from '../../../pages/Home';
import api from '../../../../api';
import { BrowserRouter } from 'react-router-dom';

vi.mock('../../../../api');

describe('HU-04: Ver tareas', () => {
  it('Debe mostrar todas las tareas asociadas al usuario', async () => {
    const mockTareas = [
      { id: 1, titulo: 'Tarea 1', descripcion: 'Descripcion 1', estado: 'pendiente', prioridad: 'alta', fecha_vencimiento: '2024-12-31' },
      { id: 2, titulo: 'Tarea 2', descripcion: 'Descripcion 2', estado: 'en_progreso', prioridad: 'media', fecha_vencimiento: '2024-11-30' },
      { id: 3, titulo: 'Tarea 3', descripcion: 'Descripcion 3', estado: 'completada', prioridad: 'baja', fecha_vencimiento: '2024-10-31' },
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

  it('Cada tarea debe estar agrupada segun su estado', async () => {
    const mockTareas = [
      { id: 1, titulo: 'Tarea Pendiente', descripcion: 'Descripcion 1', estado: 'pendiente', prioridad: 'alta', fecha_vencimiento: '2024-12-31' },
      { id: 2, titulo: 'Tarea En Progreso', descripcion: 'Descripcion 2', estado: 'en_progreso', prioridad: 'media', fecha_vencimiento: '2024-11-30' },
      { id: 3, titulo: 'Tarea Completada', descripcion: 'Descripcion 3', estado: 'completada', prioridad: 'baja', fecha_vencimiento: '2024-10-31' },
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
      expect(screen.getByText('Tarea Pendiente')).toBeInTheDocument();
      expect(screen.getByText('Tarea En Progreso')).toBeInTheDocument();
      expect(screen.getByText('Tarea Completada')).toBeInTheDocument();
    });
  });
});