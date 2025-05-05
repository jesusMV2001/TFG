// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/HU/gemini/HU-09-gemini.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '../../../../pages/Home';
import api from '../../../../api';
import { BrowserRouter } from 'react-router-dom';

vi.mock('../../../../api');

describe('HU-09 - Busqueda de Tareas', () => {
  const mockTareas = [
    { id: 1, titulo: 'Tarea con palabra clave', descripcion: 'Esta tarea incluye la palabra clave.', estado: 'pendiente', prioridad: 'media', fecha_vencimiento: '2024-12-31' },
    { id: 2, titulo: 'Otra tarea', descripcion: 'Descripcion sin la palabra clave.', estado: 'en_progreso', prioridad: 'alta', fecha_vencimiento: '2024-11-30' },
    { id: 3, titulo: 'Tarea relacionada', descripcion: 'Esta tarea tiene relacion con la palabra clave en su descripcion.', estado: 'completada', prioridad: 'baja', fecha_vencimiento: '2024-10-31' },
  ];

  it('Al ingresar una palabra clave en la busqueda, se mostraran unicamente las tareas cuyo titulo o descripcion contiene dicha palabra.', async () => {
    api.get.mockResolvedValue({ data: mockTareas });

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    await waitFor(() => expect(api.get).toHaveBeenCalledTimes(1));

    const searchInput = screen.getByPlaceholderText('Buscar tareas...');
    fireEvent.change(searchInput, { target: { value: 'clave' } });

    await waitFor(() => {
      expect(screen.getByText('Tarea con palabra clave')).toBeInTheDocument();
      expect(screen.getByText('Tarea relacionada')).toBeInTheDocument();
      expect(screen.queryByText('Otra tarea')).not.toBeInTheDocument();
    });
  });

  it('Si no hay tareas que coincidan con la busqueda, no se muestra nada', async () => {
    api.get.mockResolvedValue({ data: mockTareas });

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    await waitFor(() => expect(api.get).toHaveBeenCalledTimes(1));

    const searchInput = screen.getByPlaceholderText('Buscar tareas...');
    fireEvent.change(searchInput, { target: { value: 'palabra inexistente' } });

    await waitFor(() => {
      expect(screen.queryByText('Tarea con palabra clave')).not.toBeInTheDocument();
      expect(screen.queryByText('Tarea relacionada')).not.toBeInTheDocument();
      expect(screen.queryByText('Otra tarea')).not.toBeInTheDocument();
    });
  });

  it('La búsqueda es case-insensitive', async () => {
    api.get.mockResolvedValue({ data: mockTareas });

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    await waitFor(() => expect(api.get).toHaveBeenCalledTimes(1));

    const searchInput = screen.getByPlaceholderText('Buscar tareas...');
    fireEvent.change(searchInput, { target: { value: 'CLAVE' } });

    await waitFor(() => {
      expect(screen.getByText('Tarea con palabra clave')).toBeInTheDocument();
      expect(screen.getByText('Tarea relacionada')).toBeInTheDocument();
      expect(screen.queryByText('Otra tarea')).not.toBeInTheDocument();
    });
  });
});