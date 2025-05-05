// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/HU/gemini/HU-06-gemini.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '../../../../pages/Home';
import api from '../../../../api';
import { BrowserRouter } from 'react-router-dom';

vi.mock('../../../../api');

describe('HU-06: Eliminar tarea', () => {
  it('Al eliminar una tarea, esta debe desaparecer de la lista.', async () => {
    const mockTareas = [
      { id: 1, titulo: 'Tarea 1', descripcion: 'Descripcion 1', estado: 'pendiente', prioridad: 'alta', fecha_vencimiento: '2024-12-31' },
      { id: 2, titulo: 'Tarea 2', descripcion: 'Descripcion 2', estado: 'pendiente', prioridad: 'media', fecha_vencimiento: '2024-12-30' },
    ];
    api.get.mockResolvedValue({ data: mockTareas });
    api.delete.mockResolvedValue({ status: 204 });

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    await waitFor(() => expect(screen.getByText('Tarea 1')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('Tarea 2')).toBeInTheDocument());

    const deleteButton = screen.getAllByRole('button', { hidden: true })[5]; // El quinto boton de eliminar, hay que tener cuidado con este index si se modifican componentes

    fireEvent.click(deleteButton);

    await waitFor(() => expect(api.delete).toHaveBeenCalledWith('/api/tareas/delete/1/'));

    api.get.mockResolvedValue({data: [{ id: 2, titulo: 'Tarea 2', descripcion: 'Descripcion 2', estado: 'pendiente', prioridad: 'media', fecha_vencimiento: '2024-12-30' }]});
    
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    await waitFor(() => expect(screen.queryByText('Tarea 1')).not.toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('Tarea 2')).toBeInTheDocument());
  });

  it('El sistema debe mostrar un mensaje si se ha borrado la tarea.', async () => {
    const mockTareas = [
      { id: 1, titulo: 'Tarea 1', descripcion: 'Descripcion 1', estado: 'pendiente', prioridad: 'alta', fecha_vencimiento: '2024-12-31' },
    ];
    api.get.mockResolvedValue({ data: mockTareas });
    api.delete.mockResolvedValue({ status: 204 });

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    await waitFor(() => expect(screen.getByText('Tarea 1')).toBeInTheDocument());

    const deleteButton = screen.getAllByRole('button', { hidden: true })[5]; // El quinto boton de eliminar, hay que tener cuidado con este index si se modifican componentes
    fireEvent.click(deleteButton);

    await waitFor(() => expect(api.delete).toHaveBeenCalledWith('/api/tareas/delete/1/'));
    await waitFor(() => expect(screen.getByText('Tarea eliminada exitosamente')).toBeVisible());
  });

  it('En caso de error, el sistema debe mostrar un mensaje de error.', async () => {
    const mockTareas = [
      { id: 1, titulo: 'Tarea 1', descripcion: 'Descripcion 1', estado: 'pendiente', prioridad: 'alta', fecha_vencimiento: '2024-12-31' },
    ];
    api.get.mockResolvedValue({ data: mockTareas });
    api.delete.mockRejectedValue(new Error('Error al eliminar la tarea'));

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    await waitFor(() => expect(screen.getByText('Tarea 1')).toBeInTheDocument());

    const deleteButton = screen.getAllByRole('button', { hidden: true })[5]; // El quinto boton de eliminar, hay que tener cuidado con este index si se modifican componentes
    fireEvent.click(deleteButton);

    await waitFor(() => expect(api.delete).toHaveBeenCalledWith('/api/tareas/delete/1/'));
    await waitFor(() => expect(screen.getByText('Error al eliminar la tarea')).toBeVisible());
  });
});