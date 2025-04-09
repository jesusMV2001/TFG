// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/HU/gemini/HU-09-gemini.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '../../../pages/Home';
import api from '../../../../api';
import { BrowserRouter } from 'react-router-dom';

vi.mock('../../../../api');

describe('HU-09: Búsqueda de Tareas', () => {
  const mockTareas = [
    { id: 1, titulo: 'Tarea con palabra clave', descripcion: 'Esta tarea tiene la palabra clave en la descripción', estado: 'pendiente', prioridad: 'alta', fecha_vencimiento: '2024-12-31' },
    { id: 2, titulo: 'Otra tarea', descripcion: 'Descripción sin la palabra clave', estado: 'pendiente', prioridad: 'media', fecha_vencimiento: '2024-12-25' },
    { id: 3, titulo: 'Tarea diferente con palabra clave', descripcion: 'Más descripción con la palabra clave', estado: 'completada', prioridad: 'baja', fecha_vencimiento: '2024-12-20' },
  ];

  it('Debería filtrar las tareas por palabra clave en el título o descripción', async () => {
    api.get.mockResolvedValue({ data: mockTareas });

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    await waitFor(() => expect(api.get).toHaveBeenCalledWith("/api/tareas/"));

    const searchInput = screen.getByPlaceholderText('Buscar tareas...');
    fireEvent.change(searchInput, { target: { value: 'palabra clave' } });

    await waitFor(() => {
      expect(screen.getByText('Tarea con palabra clave')).toBeInTheDocument();
      expect(screen.queryByText('Otra tarea')).toBeNull();
      expect(screen.getByText('Tarea diferente con palabra clave')).toBeInTheDocument();
    });
  });

  it('Debería mostrar todas las tareas si el campo de búsqueda está vacío', async () => {
    api.get.mockResolvedValue({ data: mockTareas });

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    await waitFor(() => expect(api.get).toHaveBeenCalledWith("/api/tareas/"));

    const searchInput = screen.getByPlaceholderText('Buscar tareas...');
    fireEvent.change(searchInput, { target: { value: '' } });

    await waitFor(() => {
      expect(screen.getByText('Tarea con palabra clave')).toBeInTheDocument();
      expect(screen.getByText('Otra tarea')).toBeInTheDocument();
      expect(screen.getByText('Tarea diferente con palabra clave')).toBeInTheDocument();
    });
  });
});