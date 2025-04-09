# /home/jesus/python/TFG/APP/frontend/src/components/__tests__/HU/gemini/HU-05-gemini.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Tarea from '../../../Tarea';
import api from '../../../../api';

vi.mock('../../../../api');

describe('HU-05: Editar tarea', () => {
  const tareaMock = {
    id: 1,
    titulo: 'Tarea de prueba',
    descripcion: 'Descripción de prueba',
    estado: 'pendiente',
    prioridad: 'media',
    fecha_vencimiento: '2024-12-31',
    etiquetas: [],
  };

  it('El usuario debe poder modificar cualquier campo de una tarea existente y guardar los cambios.', async () => {
    api.put.mockResolvedValue({ status: 200 });

    render(<Tarea tarea={tareaMock} onDelete={() => {}} onUpdate={() => {}} onDragStart={() => {}} />);

    fireEvent.click(screen.getByText(/Editar/i));

    await waitFor(() => {
      expect(screen.getByLabelText('Título')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText('Título'), { target: { value: 'Tarea editada' } });

    fireEvent.click(screen.getByText(/Guardar Cambios/i));

    await waitFor(() => {
      expect(api.put).toHaveBeenCalledWith(`/api/tareas/update/1/`, expect.objectContaining({ titulo: 'Tarea editada' }));
    });
  });

  it('El sistema debe mostrar un mensaje si se ha modificado la tarea.', async () => {
    api.put.mockResolvedValue({ status: 200 });
    const showToastMock = vi.fn();

    render(<Tarea tarea={tareaMock} onDelete={() => {}} onUpdate={() => {}} onDragStart={() => {}} showToast={showToastMock} />);

    fireEvent.click(screen.getByText(/Editar/i));

    await waitFor(() => {
      expect(screen.getByLabelText('Título')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText('Título'), { target: { value: 'Tarea editada' } });

    fireEvent.click(screen.getByText(/Guardar Cambios/i));

    await waitFor(() => {
      expect(showToastMock).toHaveBeenCalledWith("Tarea actualizada exitosamente");
    });
  });

  it('En caso de error, el sistema debe mostrar un mensaje de error.', async () => {
    api.put.mockRejectedValue(new Error('Error al actualizar la tarea'));
    const showToastMock = vi.fn();
    render(<Tarea tarea={tareaMock} onDelete={() => {}} onUpdate={() => {}} onDragStart={() => {}} showToast={showToastMock}/>);

    fireEvent.click(screen.getByText(/Editar/i));

    await waitFor(() => {
      expect(screen.getByLabelText('Título')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText('Título'), { target: { value: 'Tarea editada' } });

    fireEvent.click(screen.getByText(/Guardar Cambios/i));

    await waitFor(() => {
      expect(showToastMock).toHaveBeenCalledWith("Error al actualizar la tarea", "error");
    });
  });
});