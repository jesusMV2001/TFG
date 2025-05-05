// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/RF/gemini/RF-11-gemini.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '../../../../pages/Home';
import api from '../../../../api';
import { BrowserRouter } from 'react-router-dom';

vi.mock('../../../../api');

describe('RF-11 - Funcionalidad de Búsqueda', () => {
  it('Debería filtrar las tareas por título', async () => {
    api.get.mockResolvedValue({
      data: [
        { id: 1, titulo: 'Tarea de prueba 1', descripcion: 'Descripción de prueba 1', estado: 'pendiente', prioridad: 'alta', fecha_vencimiento: '2024-12-31' },
        { id: 2, titulo: 'Tarea de prueba 2', descripcion: 'Descripción de prueba 2', estado: 'en_progreso', prioridad: 'media', fecha_vencimiento: '2024-12-30' },
        { id: 3, titulo: 'Otra tarea', descripcion: 'Descripción sin coincidencias', estado: 'completada', prioridad: 'baja', fecha_vencimiento: '2024-12-29' },
      ],
    });

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    const searchInput = screen.getByPlaceholderText('Buscar tareas...');
    fireEvent.change(searchInput, { target: { value: 'prueba' } });

    await waitFor(() => {
      expect(screen.getByText('Tarea de prueba 1')).toBeInTheDocument();
      expect(screen.getByText('Tarea de prueba 2')).toBeInTheDocument();
      expect(screen.queryByText('Otra tarea')).not.toBeInTheDocument();
    });
  });

  it('Debería filtrar las tareas por descripción', async () => {
    api.get.mockResolvedValue({
      data: [
        { id: 1, titulo: 'Tarea de prueba 1', descripcion: 'Descripción de prueba 1', estado: 'pendiente', prioridad: 'alta', fecha_vencimiento: '2024-12-31' },
        { id: 2, titulo: 'Tarea de prueba 2', descripcion: 'Descripción de prueba 2', estado: 'en_progreso', prioridad: 'media', fecha_vencimiento: '2024-12-30' },
        { id: 3, titulo: 'Otra tarea', descripcion: 'Descripción sin coincidencias', estado: 'completada', prioridad: 'baja', fecha_vencimiento: '2024-12-29' },
      ],
    });

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    const searchInput = screen.getByPlaceholderText('Buscar tareas...');
    fireEvent.change(searchInput, { target: { value: 'coincidencias' } });

    await waitFor(() => {
      expect(screen.queryByText('Tarea de prueba 1')).not.toBeInTheDocument();
      expect(screen.queryByText('Tarea de prueba 2')).not.toBeInTheDocument();
      expect(screen.getByText('Otra tarea')).toBeInTheDocument();
    });
  });

  it('Debería mostrar todas las tareas si el campo de búsqueda está vacío', async () => {
    api.get.mockResolvedValue({
      data: [
        { id: 1, titulo: 'Tarea de prueba 1', descripcion: 'Descripción de prueba 1', estado: 'pendiente', prioridad: 'alta', fecha_vencimiento: '2024-12-31' },
        { id: 2, titulo: 'Tarea de prueba 2', descripcion: 'Descripción de prueba 2', estado: 'en_progreso', prioridad: 'media', fecha_vencimiento: '2024-12-30' },
        { id: 3, titulo: 'Otra tarea', descripcion: 'Descripción sin coincidencias', estado: 'completada', prioridad: 'baja', fecha_vencimiento: '2024-12-29' },
      ],
    });

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    const searchInput = screen.getByPlaceholderText('Buscar tareas...');
    fireEvent.change(searchInput, { target: { value: '' } });

    await waitFor(() => {
      expect(screen.getByText('Tarea de prueba 1')).toBeInTheDocument();
      expect(screen.getByText('Tarea de prueba 2')).toBeInTheDocument();
      expect(screen.getByText('Otra tarea')).toBeInTheDocument();
    });
  });

  it('Debería realizar la búsqueda sin distinguir mayúsculas y minúsculas', async () => {
    api.get.mockResolvedValue({
      data: [
        { id: 1, titulo: 'Tarea de Prueba 1', descripcion: 'Descripción de Prueba 1', estado: 'pendiente', prioridad: 'alta', fecha_vencimiento: '2024-12-31' },
      ],
    });

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    const searchInput = screen.getByPlaceholderText('Buscar tareas...');
    fireEvent.change(searchInput, { target: { value: 'prueba' } });

    await waitFor(() => {
      expect(screen.getByText('Tarea de Prueba 1')).toBeInTheDocument();
    });
  });
});