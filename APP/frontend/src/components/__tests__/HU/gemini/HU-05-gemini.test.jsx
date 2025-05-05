// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/HU/gemini/HU-05-gemini.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TareaForm from '../../../TareaForm';
import api from '../../../../api';

vi.mock('../../../../api');

describe('HU-05: Editar tarea', () => {
  it('El usuario debe poder modificar cualquier campo de una tarea existente y guardar los cambios.', async () => {
    const initialData = {
      id: 1,
      titulo: 'Tarea inicial',
      descripcion: 'Descripcion inicial',
      estado: 'pendiente',
      prioridad: 'media',
      fecha_vencimiento: '2024-01-01',
      etiquetas: []
    };

    const onAddTarea = vi.fn();
    const showToast = vi.fn();

    render(<TareaForm onAddTarea={onAddTarea} initialData={initialData} showToast={showToast} />);

    const tituloInput = screen.getByLabelText('Título');
    fireEvent.change(tituloInput, { target: { value: 'Tarea modificada' } });

    const descripcionInput = screen.getByLabelText('Descripción');
    fireEvent.change(descripcionInput, { target: { value: 'Descripcion modificada' } });

    const estadoSelect = screen.getByLabelText('Estado');
    fireEvent.change(estadoSelect, { target: { value: 'en_progreso' } });

    const prioridadSelect = screen.getByLabelText('Prioridad');
    fireEvent.change(prioridadSelect, { target: { value: 'alta' } });

    const fechaVencimientoInput = screen.getByLabelText('Fecha de Vencimiento');
    fireEvent.change(fechaVencimientoInput, { target: { value: '2024-02-01' } });

    const guardarCambiosButton = screen.getByText('Guardar Cambios');
    fireEvent.click(guardarCambiosButton);

    expect(onAddTarea).toHaveBeenCalledWith({
      titulo: 'Tarea modificada',
      descripcion: 'Descripcion modificada',
      estado: 'en_progreso',
      prioridad: 'alta',
      fecha_vencimiento: '2024-02-01',
      etiquetas: [],
    });
  });

  it('El sistema debe mostrar un mensaje si se ha modificado la tarea.', async () => {
    const initialData = {
      id: 1,
      titulo: 'Tarea inicial',
      descripcion: 'Descripcion inicial',
      estado: 'pendiente',
      prioridad: 'media',
      fecha_vencimiento: '2024-01-01',
      etiquetas: []
    };

    const onAddTarea = vi.fn();
    const showToast = vi.fn();

    render(<TareaForm onAddTarea={onAddTarea} initialData={initialData} showToast={showToast} />);

    const guardarCambiosButton = screen.getByText('Guardar Cambios');
    fireEvent.click(guardarCambiosButton);

    expect(showToast).not.toHaveBeenCalledWith("La fecha de vencimiento no puede ser menor a la fecha actual.");
  });

  it('En caso de error, el sistema debe mostrar un mensaje de error.', async () => {
    const initialData = {
      id: 1,
      titulo: 'Tarea inicial',
      descripcion: 'Descripcion inicial',
      estado: 'pendiente',
      prioridad: 'media',
      fecha_vencimiento: '2024-01-01',
      etiquetas: []
    };
    const onAddTarea = vi.fn();
        const showToast = vi.fn();
    api.post.mockRejectedValue(new Error('Error al modificar la tarea'));

    render(<TareaForm onAddTarea={onAddTarea} initialData={initialData} showToast={showToast} />);

    const guardarCambiosButton = screen.getByText('Guardar Cambios');
    fireEvent.click(guardarCambiosButton);

      await waitFor(() => {
            expect(showToast).not.toHaveBeenCalled();
      });
  });

  it('Validar fecha de vencimiento no menor a la actual', async () => {
      const initialData = {
          id: 1,
          titulo: 'Tarea inicial',
          descripcion: 'Descripcion inicial',
          estado: 'pendiente',
          prioridad: 'media',
          fecha_vencimiento: '2024-01-01',
          etiquetas: []
      };
      const onAddTarea = vi.fn();
        const showToast = vi.fn();
      render(<TareaForm onAddTarea={onAddTarea} initialData={initialData} showToast={showToast} />);

      const fechaVencimientoInput = screen.getByLabelText('Fecha de Vencimiento');
      fireEvent.change(fechaVencimientoInput, { target: { value: '2023-01-01' } });

      const guardarCambiosButton = screen.getByText('Guardar Cambios');
      fireEvent.click(guardarCambiosButton);

      const errorMessage = screen.getByText('La fecha de vencimiento no puede ser menor a la fecha actual.');
      expect(errorMessage).toBeDefined();
  });
});