// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/HU/nvidia/HU-09-nvidia.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '../../../../pages/Home';
import api from '../../../../api';

vi.mock('../../../../api');

describe('HU-09: Busqueda de Tareas', () => {
  beforeEach(() => {
    // Mockear la respuesta de la API para obtener tareas
    vi.mocked(api.get).mockResolvedValue({
      data: [
        { id: 1, titulo: 'Tarea 1', descripcion: 'Descripción de la tarea 1' },
        { id: 2, titulo: 'Otra Tarea', descripcion: 'Esta es otra tarea' },
        { id: 3, titulo: 'Tarea con palabra clave', descripcion: 'Esta tarea contiene la palabra clave "clave"' },
      ],
    });
  });

  it('Muestra solo las tareas que contienen la palabra clave en el título o descripción', async () => {
    render(<Home />);
    await waitFor(() => screen.getByPlaceholderText('Buscar tareas...'));

    const searchInput = screen.getByPlaceholderText('Buscar tareas...');
    fireEvent.change(searchInput, { target: { value: 'clave' } });

    await waitFor(() => screen.getAllByRole('article'));

    const tareaElements = screen.getAllByRole('article');
    expect(tareaElements).toHaveLength(1);
    expect(tareaElements[0]).toHaveTextContent('Tarea con palabra clave');
    expect(screen.queryByRole('article', { name: 'Tarea 1' })).not.toBeInTheDocument();
    expect(screen.queryByRole('article', { name: 'Otra Tarea' })).not.toBeInTheDocument();
  });

  it('Muestra todas las tareas cuando la búsqueda está vacía', async () => {
    render(<Home />);
    await waitFor(() => screen.getByPlaceholderText('Buscar tareas...'));

    const searchInput = screen.getByPlaceholderText('Buscar tareas...');
    fireEvent.change(searchInput, { target: { value: '' } });

    await waitFor(() => screen.getAllByRole('article'));

    const tareaElements = screen.getAllByRole('article');
    expect(tareaElements).toHaveLength(3);
    expect(tareaElements[0]).toHaveTextContent('Tarea 1');
    expect(tareaElements[1]).toHaveTextContent('Otra Tarea');
    expect(tareaElements[2]).toHaveTextContent('Tarea con palabra clave');
  });
});