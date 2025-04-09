// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/HU/gemini/HU-07-gemini.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '../../../pages/Home';
import api from '../../../../api';
import { BrowserRouter } from 'react-router-dom';

vi.mock('../../../../api');

describe('HU-07: Marcar Tareas Completadas', () => {
  it('Debe cambiar el estado de la tarea a "completada" y reflejarse en la lista de tareas', async () => {
    const mockTareas = [
      { id: 1, titulo: 'Tarea 1', estado: 'pendiente', prioridad: 'media', fecha_vencimiento: '2024-12-31' },
      { id: 2, titulo: 'Tarea 2', estado: 'en_progreso', prioridad: 'alta', fecha_vencimiento: '2024-12-25' },
    ];

    api.get.mockResolvedValue({ data: mockTareas });
    api.put.mockImplementation((url, data) => Promise.resolve({ status: 200 }));

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    await waitFor(() => expect(api.get).toHaveBeenCalled());

    const tareaPendiente = screen.getByText('Tarea 1');
    expect(tareaPendiente).toBeInTheDocument();

    const tareaEnProgreso = screen.getByText('Tarea 2');
    expect(tareaEnProgreso).toBeInTheDocument();

    const columnaCompletadas = screen.getByText('Completadas').closest('div');

    const tareaIdToUpdate = 1;
    const handleDragStart = (e, id) => {
      e.dataTransfer.setData("tareaId", id);
    };

    const dragStartEvent = new DragEvent('dragstart', { dataTransfer: new DataTransfer() });
    handleDragStart(dragStartEvent, tareaIdToUpdate);

    const dropEvent = new DragEvent('drop', {
      bubbles: true,
      cancelable: true,
      dataTransfer: new DataTransfer(),
    });

    dragStartEvent.dataTransfer.setData("tareaId", tareaIdToUpdate);

    fireEvent(columnaCompletadas, dropEvent);

    await waitFor(() => {
      expect(api.put).toHaveBeenCalledWith(`/api/tareas/update/${tareaIdToUpdate}/`, {
        ...mockTareas[0],
        estado: 'completada',
      });
    });
  });
});