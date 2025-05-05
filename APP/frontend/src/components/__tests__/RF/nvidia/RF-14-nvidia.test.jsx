// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/RF/nvidia/RF-14-nvidia.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TareaForm from '../../../TareaForm';
import api from '../../../../api';

vi.mock('../../../../api');

describe('RF-14: Crear y asignar nuevas etiquetas a una tarea', () => {
  const inicialData = {
    id: 1,
    titulo: 'Tarea de prueba',
    descripcion: 'Descripción de la tarea',
    estado: 'pendiente',
    prioridad: 'media',
    fecha_vencimiento: '2024-03-16',
    etiquetas: []
  };

  it('debe mostrar el campo para crear una nueva etiqueta', async () => {
    render(<TareaForm onAddTarea={vi.fn()} initialData={inicialData} />);
    const nuevaEtiquetaInput = await screen.getByPlaceholderText('Nueva etiqueta');
    expect(nuevaEtiquetaInput).toBeInTheDocument();
  });

  it('debe crear una nueva etiqueta cuando se envía el formulario de crear etiqueta', async () => {
    const createEtiquetaMock = vi.fn(() => Promise.resolve({ id: 1, nombre: 'Nueva Etiqueta' }));
    api.post.mockImplementation((url) => {
      if (url === '/api/etiquetas/') return createEtiquetaMock();
      return Promise.resolve({});
    });

    render(<TareaForm onAddTarea={vi.fn()} initialData={inicialData} />);
    const nuevaEtiquetaInput = await screen.getByPlaceholderText('Nueva etiqueta');
    const crearEtiquetaButton = await screen.getByText('Crear Etiqueta');

    fireEvent.change(nuevaEtiquetaInput, { target: { value: 'Nueva Etiqueta' } });
    fireEvent.click(crearEtiquetaButton);

    await waitFor(() => expect(createEtiquetaMock).toHaveBeenCalledTimes(1));
    expect(screen.getByText('Nueva Etiqueta')).toBeInTheDocument();
  });

  it('debe eliminar una etiqueta cuando se hace clic en el botón de eliminar', async () => {
    const deleteEtiquetaMock = vi.fn(() => Promise.resolve({}));
    api.delete.mockImplementation((url) => {
      if (url === '/api/etiquetas/delete/1/') return deleteEtiquetaMock();
      return Promise.resolve({});
    });

    const etiqueta = { id: 1, nombre: 'Etiqueta Existente' };
    const inicialDataConEtiquetas = { ...inicialData, etiquetas: [etiqueta] };

    render(<TareaForm onAddTarea={vi.fn()} initialData={inicialDataConEtiquetas} />);
    const eliminarEtiquetaButton = await screen.getAllByText('Eliminar')[0];

    fireEvent.click(eliminarEtiquetaButton);

    await waitFor(() => expect(deleteEtiquetaMock).toHaveBeenCalledTimes(1));
    expect(screen.queryByText('Etiqueta Existente')).not.toBeInTheDocument();
  });
});