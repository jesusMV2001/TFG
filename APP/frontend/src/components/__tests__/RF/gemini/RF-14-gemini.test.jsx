// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/RF/gemini/RF-14-gemini.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TareaForm from '../../../../components/TareaForm';
import api from '../../../../api';

vi.mock('../../../../api');

describe('RF-14: Crear y asignar etiquetas a una tarea', () => {

    it('debería permitir crear una nueva etiqueta y mostrarla en la lista de etiquetas', async () => {
        const mockTareaId = 1;
        const mockEtiquetaNombre = 'Nueva Etiqueta';
        const mockNuevaEtiquetaResponse = { id: 4, nombre: mockEtiquetaNombre };
        const mockExistingEtiquetas = [{ id: 1, nombre: 'Etiqueta 1' }, { id: 2, nombre: 'Etiqueta 2' }];

        api.post.mockResolvedValue({ data: mockNuevaEtiquetaResponse });
        api.get.mockResolvedValue({ data: mockExistingEtiquetas });

        render(<TareaForm initialData={{ id: mockTareaId }} />);

        const nuevaEtiquetaInput = screen.getByPlaceholderText('Nueva etiqueta');
        fireEvent.change(nuevaEtiquetaInput, { target: { value: mockEtiquetaNombre } });

        const crearEtiquetaButton = screen.getByText('Crear Etiqueta');
        fireEvent.click(crearEtiquetaButton);

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith('/api/etiquetas/', { nombre: mockEtiquetaNombre, tarea_id: mockTareaId });
        });
        
        await waitFor(() => {
            expect(screen.getByText(mockEtiquetaNombre)).toBeInTheDocument();
        });

    });

    it('debería mostrar un error si el nombre de la etiqueta está vacío', async () => {
        const mockTareaId = 1;
        render(<TareaForm initialData={{ id: mockTareaId }} />);

        const crearEtiquetaButton = screen.getByText('Crear Etiqueta');
        fireEvent.click(crearEtiquetaButton);

        await waitFor(() => {
            expect(screen.getByText('El nombre de la etiqueta no puede estar vacío.')).toBeInTheDocument();
        });
    });

    it('debería mostrar un error si la etiqueta ya existe', async () => {
        const mockTareaId = 1;
        const mockEtiquetaNombre = 'Etiqueta Existente';
        const mockExistingEtiquetas = [{ id: 1, nombre: mockEtiquetaNombre }];

        api.get.mockResolvedValue({ data: mockExistingEtiquetas });

        render(<TareaForm initialData={{ id: mockTareaId, etiquetas: mockExistingEtiquetas }} />);

        const nuevaEtiquetaInput = screen.getByPlaceholderText('Nueva etiqueta');
        fireEvent.change(nuevaEtiquetaInput, { target: { value: mockEtiquetaNombre } });

        const crearEtiquetaButton = screen.getByText('Crear Etiqueta');
        fireEvent.click(crearEtiquetaButton);

        await waitFor(() => {
            expect(screen.getByText('La etiqueta ya existe.')).toBeInTheDocument();
        });
    });

    it('debería permitir eliminar una etiqueta existente', async () => {
        const mockTareaId = 1;
        const mockEtiquetaIdToDelete = 2;
        const mockExistingEtiquetas = [{ id: 1, nombre: 'Etiqueta 1' }, { id: mockEtiquetaIdToDelete, nombre: 'Etiqueta 2' }];

        api.get.mockResolvedValue({ data: mockExistingEtiquetas });
        api.delete.mockResolvedValue({});

        render(<TareaForm initialData={{ id: mockTareaId, etiquetas: mockExistingEtiquetas }} />);

        const deleteButton = screen.getAllByText('Eliminar').find(btn => btn.closest('li')?.textContent.includes("Etiqueta 2"));
        fireEvent.click(deleteButton);

        await waitFor(() => {
            expect(api.delete).toHaveBeenCalledWith(`/api/etiquetas/delete/${mockEtiquetaIdToDelete}/`);
        });

    });
});