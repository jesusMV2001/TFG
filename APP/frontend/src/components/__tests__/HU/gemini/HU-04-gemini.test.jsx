// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/HU/gemini/HU-04-gemini.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import Home from '../../../../pages/Home';
import api from '../../../../api';
import { BrowserRouter } from 'react-router-dom';

vi.mock('../../../../api');

describe('HU-04: Ver tareas', () => {
  it('Al acceder a la lista de tareas, se deben mostrar todas las tareas asociadas al usuario.', async () => {
    const mockTareas = [
      { id: 1, titulo: 'Tarea 1', descripcion: 'Descripción 1', estado: 'pendiente', prioridad: 'alta', fecha_vencimiento: '2024-01-01' },
      { id: 2, titulo: 'Tarea 2', descripcion: 'Descripción 2', estado: 'en_progreso', prioridad: 'media', fecha_vencimiento: '2024-01-02' },
    ];

    api.get.mockResolvedValue({ data: mockTareas });

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/api/tareas/');
    });

    await waitFor(() => {
      expect(screen.getByText('Tarea 1')).toBeInTheDocument();
      expect(screen.getByText('Tarea 2')).toBeInTheDocument();
    });
  });

  it('Cada tarea debe estar agrupada segun su estado.', async () => {
    const mockTareas = [
      { id: 1, titulo: 'Tarea 1', descripcion: 'Descripción 1', estado: 'pendiente', prioridad: 'alta', fecha_vencimiento: '2024-01-01' },
      { id: 2, titulo: 'Tarea 2', descripcion: 'Descripción 2', estado: 'en_progreso', prioridad: 'media', fecha_vencimiento: '2024-01-02' },
      { id: 3, titulo: 'Tarea 3', descripcion: 'Descripción 3', estado: 'completada', prioridad: 'baja', fecha_vencimiento: '2024-01-03' },
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
    
    await waitFor(() => {
        expect(screen.getByText('Tarea 1')).toBeInTheDocument();
        expect(screen.getByText('Tarea 2')).toBeInTheDocument();
        expect(screen.getByText('Tarea 3')).toBeInTheDocument();
    });
  });
});