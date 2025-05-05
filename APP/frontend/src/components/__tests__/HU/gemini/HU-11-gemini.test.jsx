// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/HU/gemini/HU-11-gemini.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TareaForm from '../../../TareaForm';
import api from '../../../../api';

vi.mock('../../../../api');

describe('HU-11: Crear y asignar etiquetas', () => {
  it('El usuario puede crear etiquetas y asignar a una tarea existente', async () => {
    const mockTareaId = 1;
    const mockEtiquetaNombre = 'Etiqueta de prueba';
    const mockEtiquetaResponse = { id: 1, nombre: mockEtiquetaNombre };
    const showToastMock = vi.fn();
    api.post.mockResolvedValue({ data: mockEtiquetaResponse });
    api.delete.mockResolvedValue({});

    render(<TareaForm initialData={{ id: mockTareaId }} onAddTarea={() => {}} showToast={showToastMock} />);

    const nuevaEtiquetaInput = screen.getByPlaceholderText('Nueva etiqueta');
    fireEvent.change(nuevaEtiquetaInput, { target: { value: mockEtiquetaNombre } });

    const crearEtiquetaButton = screen.getByText('Crear Etiqueta');
    fireEvent.click(crearEtiquetaButton);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/api/etiquetas/', { nombre: mockEtiquetaNombre, tarea_id: mockTareaId });
      expect(screen.getByText(mockEtiquetaNombre)).toBeInTheDocument();
      expect(showToastMock).toHaveBeenCalledWith("Etiqueta creada exitosamente");
    });

    const eliminarEtiquetaButton = screen.getByText('Eliminar');
    fireEvent.click(eliminarEtiquetaButton);

    await waitFor(() => {
      expect(api.delete).toHaveBeenCalledWith(`/api/etiquetas/delete/${mockEtiquetaResponse.id}/`);
      expect(showToastMock).toHaveBeenCalledWith("Etiqueta eliminada exitosamente");
    });

  });

  it('Muestra un mensaje de error si el nombre de la etiqueta esta vacio', async () => {
    const showToastMock = vi.fn();
    const setErrorMock = vi.fn();
    render(<TareaForm initialData={{ id: 1 }} onAddTarea={() => {}} showToast={showToastMock} />);

    const crearEtiquetaButton = screen.getByText('Crear Etiqueta');
    fireEvent.click(crearEtiquetaButton);

    await waitFor(() => {
      expect(screen.getByText('El nombre de la etiqueta no puede estar vacío.')).toBeInTheDocument();
    });
  });

  it('Muestra un mensaje de error si la etiqueta ya existe', async () => {
    const mockTareaId = 1;
    const mockEtiquetaNombre = 'Etiqueta de prueba';
    const mockEtiquetaResponse = { id: 1, nombre: mockEtiquetaNombre };
    const showToastMock = vi.fn();
    api.post.mockResolvedValue({ data: mockEtiquetaResponse });
    api.delete.mockResolvedValue({});

    render(<TareaForm initialData={{ id: mockTareaId, etiquetas: [{id:1, nombre:mockEtiquetaNombre}] }} onAddTarea={() => {}} showToast={showToastMock} />);

    const nuevaEtiquetaInput = screen.getByPlaceholderText('Nueva etiqueta');
    fireEvent.change(nuevaEtiquetaInput, { target: { value: mockEtiquetaNombre } });

    const crearEtiquetaButton = screen.getByText('Crear Etiqueta');
    fireEvent.click(crearEtiquetaButton);

    await waitFor(() => {
      expect(screen.getByText('La etiqueta ya existe.')).toBeInTheDocument();
    });
  });
});