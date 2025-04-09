// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/HU/gemini/HU-06-gemini.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '../../../pages/Home';
import api from '../../../../api';
import { BrowserRouter } from 'react-router-dom';

vi.mock('../../../../api');

describe('HU-06: Eliminar tarea', () => {
  it('Al eliminar una tarea, esta debe desaparecer de la lista.', async () => {
    const mockTareas = [
      { id: 1, titulo: 'Tarea 1', descripcion: 'Descripcion 1', estado: 'pendiente', prioridad: 'media', fecha_vencimiento: '2024-01-01' },
      { id: 2, titulo: 'Tarea 2', descripcion: 'Descripcion 2', estado: 'en_progreso', prioridad: 'alta', fecha_vencimiento: '2024-01-02' },
    ];

    api.get.mockResolvedValue({ data: mockTareas });
    api.delete.mockResolvedValue({ status: 204 });

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    await waitFor(() => expect(api.get).toHaveBeenCalledTimes(1));

    const deleteButton = await screen.findByRole('button', { name: /eliminar/i, id: 'delete-task-1' }); // Asegúrate de que el botón tenga un role y name accesibles
    fireEvent.click(deleteButton);

    await waitFor(() => expect(api.delete).toHaveBeenCalledWith('/api/tareas/delete/1/'));

    // Simula la respuesta después de la eliminación, excluyendo la tarea eliminada
    api.get.mockResolvedValue({ data: [mockTareas[1]] });
    await waitFor(() => expect(api.get).toHaveBeenCalledTimes(2));
    
    await waitFor(() => {
            const tareaEliminada = screen.queryByText('Tarea 1');
            expect(tareaEliminada).toBeNull();
        });
  });

  it('El sistema debe mostrar un mensaje si se ha borrado la tarea.', async () => {
    const mockTareas = [{ id: 1, titulo: 'Tarea 1', descripcion: 'Descripcion 1', estado: 'pendiente', prioridad: 'media', fecha_vencimiento: '2024-01-01' }];
    api.get.mockResolvedValue({ data: mockTareas });
    api.delete.mockResolvedValue({ status: 204 });

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    await waitFor(() => expect(api.get).toHaveBeenCalledTimes(1));

    const deleteButton = await screen.findByRole('button', { name: /eliminar/i, id: 'delete-task-1' });
    fireEvent.click(deleteButton);

    await waitFor(() => expect(api.delete).toHaveBeenCalledWith('/api/tareas/delete/1/'));

    await waitFor(() => {
      expect(screen.getByText(/tarea eliminada exitosamente/i)).toBeVisible();
    });
  });

  it('En caso de error, el sistema debe mostrar un mensaje de error.', async () => {
    const mockTareas = [{ id: 1, titulo: 'Tarea 1', descripcion: 'Descripcion 1', estado: 'pendiente', prioridad: 'media', fecha_vencimiento: '2024-01-01' }];
    api.get.mockResolvedValue({ data: mockTareas });
    api.delete.mockRejectedValue(new Error('Error al eliminar la tarea'));

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    await waitFor(() => expect(api.get).toHaveBeenCalledTimes(1));

    const deleteButton = await screen.findByRole('button', { name: /eliminar/i, id: 'delete-task-1' });
    fireEvent.click(deleteButton);

    await waitFor(() => expect(api.delete).toHaveBeenCalledWith('/api/tareas/delete/1/'));

    await waitFor(() => {
      expect(screen.getByText(/error al eliminar la tarea/i)).toBeVisible();
    });
  });
});