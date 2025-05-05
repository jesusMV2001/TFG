// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/RF/gemini/RF-07-gemini.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TareaForm from '../../../../components/TareaForm';
import api from '../../../../api';

vi.mock('../../../../api');

describe('RF-07: Editar tarea existente', () => {
  it('Debería permitir a los usuarios editar cualquier campo visible de una tarea existente y guardar los cambios', async () => {
    const initialData = {
      id: 1,
      titulo: 'Tarea inicial',
      descripcion: 'Descripción inicial',
      estado: 'pendiente',
      prioridad: 'media',
      fecha_vencimiento: '2024-12-31',
      etiquetas: [],
    };

    const onAddTareaMock = vi.fn();
    const showToastMock = vi.fn();

    render(<TareaForm onAddTarea={onAddTareaMock} initialData={initialData} showToast={showToastMock} />);

    const tituloInput = screen.getByLabelText('Título');
    const descripcionInput = screen.getByLabelText('Descripción');
    const estadoSelect = screen.getByLabelText('Estado');
    const prioridadSelect = screen.getByLabelText('Prioridad');
    const fechaVencimientoInput = screen.getByLabelText('Fecha de Vencimiento');

    fireEvent.change(tituloInput, { target: { value: 'Tarea modificada' } });
    fireEvent.change(descripcionInput, { target: { value: 'Descripción modificada' } });
    fireEvent.change(estadoSelect, { target: { value: 'en_progreso' } });
    fireEvent.change(prioridadSelect, { target: { value: 'alta' } });
    fireEvent.change(fechaVencimientoInput, { target: { value: '2025-01-15' } });

    const guardarCambiosButton = screen.getByText('Guardar Cambios');
    fireEvent.click(guardarCambiosButton);

    expect(onAddTareaMock).toHaveBeenCalledWith({
      titulo: 'Tarea modificada',
      descripcion: 'Descripción modificada',
      estado: 'en_progreso',
      prioridad: 'alta',
      fecha_vencimiento: '2025-01-15',
      etiquetas: [],
    });
  });

  it('Debería mostrar un mensaje de error si la fecha de vencimiento es anterior a la fecha actual', async () => {
    const initialData = {
      id: 1,
      titulo: 'Tarea inicial',
      descripcion: 'Descripción inicial',
      estado: 'pendiente',
      prioridad: 'media',
      fecha_vencimiento: '2024-12-31',
      etiquetas: [],
    };

    const onAddTareaMock = vi.fn();
    const showToastMock = vi.fn();

    render(<TareaForm onAddTarea={onAddTareaMock} initialData={initialData} showToast={showToastMock} />);

    const fechaVencimientoInput = screen.getByLabelText('Fecha de Vencimiento');
    fireEvent.change(fechaVencimientoInput, { target: { value: '2023-01-01' } });

    const guardarCambiosButton = screen.getByText('Guardar Cambios');
    fireEvent.click(guardarCambiosButton);

    await waitFor(() => {
      expect(screen.getByText('La fecha de vencimiento no puede ser menor a la fecha actual.')).toBeInTheDocument();
    });

    expect(onAddTareaMock).not.toHaveBeenCalled();
  });

    it('deberia poder añadir etiquetas a la tarea existente', async () => {
        const initialData = {
            id: 1,
            titulo: 'Tarea inicial',
            descripcion: 'Descripción inicial',
            estado: 'pendiente',
            prioridad: 'media',
            fecha_vencimiento: '2024-12-31',
            etiquetas: [],
        };

        const onAddTareaMock = vi.fn();
        const showToastMock = vi.fn();

        api.post.mockResolvedValue({ data: { id: 1, nombre: 'Etiqueta 1' } });
        api.get.mockResolvedValue({ data: [] });
        render(<TareaForm onAddTarea={onAddTareaMock} initialData={initialData} showToast={showToastMock} />);

        const nuevaEtiquetaInput = screen.getByPlaceholderText('Nueva etiqueta');
        fireEvent.change(nuevaEtiquetaInput, { target: { value: 'Etiqueta 1' } });
        const crearEtiquetaButton = screen.getByText('Crear Etiqueta');
        fireEvent.click(crearEtiquetaButton);

        const guardarCambiosButton = screen.getByText('Guardar Cambios');
        fireEvent.click(guardarCambiosButton);
        await waitFor(() => {
            expect(onAddTareaMock).toHaveBeenCalled();
        });

    });

    it('deberia poder eliminar etiquetas a la tarea existente', async () => {
        const initialData = {
            id: 1,
            titulo: 'Tarea inicial',
            descripcion: 'Descripción inicial',
            estado: 'pendiente',
            prioridad: 'media',
            fecha_vencimiento: '2024-12-31',
            etiquetas: [{ id: 1, nombre: 'Etiqueta 1' }],
        };

        const onAddTareaMock = vi.fn();
        const showToastMock = vi.fn();
        api.get.mockResolvedValue({ data: [{ id: 1, nombre: 'Etiqueta 1' }] });

        render(<TareaForm onAddTarea={onAddTareaMock} initialData={initialData} showToast={showToastMock} />);

        const eliminarEtiquetaButton = screen.getAllByText('Eliminar')[0];
        fireEvent.click(eliminarEtiquetaButton);

        const guardarCambiosButton = screen.getByText('Guardar Cambios');
        fireEvent.click(guardarCambiosButton);

        await waitFor(() => {
            expect(onAddTareaMock).toHaveBeenCalled();
        });

    });
});