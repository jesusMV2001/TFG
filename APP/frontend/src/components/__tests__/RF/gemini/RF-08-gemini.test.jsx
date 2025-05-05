// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/RF/gemini/RF-08-gemini.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '../../../../pages/Home';
import api from '../../../../api';
import { BrowserRouter } from 'react-router-dom';

vi.mock('../../../../api');

describe('RF-08: Eliminar tareas', () => {
  it('Debería eliminar una tarea de la lista', async () => {
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

    await waitFor(() => expect(screen.getByText('Tarea 1')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('Tarea 2')).toBeInTheDocument());

    const deleteButtons = screen.getAllByRole('button', {
        name: /eliminar/i,
    });
    
    expect(deleteButtons.length).toBeGreaterThanOrEqual(2);

    await fireEvent.click(deleteButtons[0]);

    expect(api.delete).toHaveBeenCalledWith('/api/tareas/delete/1/');
  });

  it('Debería actualizar la lista de tareas después de eliminar una tarea', async () => {
    const mockTareasIniciales = [
      { id: 1, titulo: 'Tarea 1', descripcion: 'Descripcion 1', estado: 'pendiente', prioridad: 'media', fecha_vencimiento: '2024-01-01' },
      { id: 2, titulo: 'Tarea 2', descripcion: 'Descripcion 2', estado: 'en_progreso', prioridad: 'alta', fecha_vencimiento: '2024-01-02' },
    ];

    const mockTareasActualizadas = [
      { id: 2, titulo: 'Tarea 2', descripcion: 'Descripcion 2', estado: 'en_progreso', prioridad: 'alta', fecha_vencimiento: '2024-01-02' },
    ];

    api.get.mockResolvedValueOnce({ data: mockTareasIniciales }).mockResolvedValueOnce({ data: mockTareasActualizadas });
    api.delete.mockResolvedValue({ status: 204 });

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    await waitFor(() => expect(screen.getByText('Tarea 1')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('Tarea 2')).toBeInTheDocument());

    const deleteButtons = screen.getAllByRole('button', {
        name: /eliminar/i,
    });
      
    expect(deleteButtons.length).toBeGreaterThanOrEqual(2);

    await fireEvent.click(deleteButtons[0]);

    await waitFor(() => expect(api.get).toHaveBeenCalledTimes(2));
    await waitFor(() => expect(screen.queryByText('Tarea 1')).toBeNull());
    await waitFor(() => expect(screen.getByText('Tarea 2')).toBeInTheDocument());
  });

    it('Debería mostrar un mensaje de error si falla la eliminación de la tarea', async () => {
        const mockTareas = [
            { id: 1, titulo: 'Tarea 1', descripcion: 'Descripcion 1', estado: 'pendiente', prioridad: 'media', fecha_vencimiento: '2024-01-01' },
            { id: 2, titulo: 'Tarea 2', descripcion: 'Descripcion 2', estado: 'en_progreso', prioridad: 'alta', fecha_vencimiento: '2024-01-02' },
        ];

        api.get.mockResolvedValue({ data: mockTareas });
        api.delete.mockRejectedValue(new Error('Error al eliminar la tarea'));

        render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        );

        await waitFor(() => expect(screen.getByText('Tarea 1')).toBeInTheDocument());
        await waitFor(() => expect(screen.getByText('Tarea 2')).toBeInTheDocument());

        const deleteButtons = screen.getAllByRole('button', {
            name: /eliminar/i,
        });

        expect(deleteButtons.length).toBeGreaterThanOrEqual(2);

        await fireEvent.click(deleteButtons[0]);

        await waitFor(() => expect(api.delete).toHaveBeenCalledWith('/api/tareas/delete/1/'));
    });
});