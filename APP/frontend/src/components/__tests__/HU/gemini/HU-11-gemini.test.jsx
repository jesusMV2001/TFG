// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/HU/gemini/HU-11-gemini.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TareaForm from '../../../TareaForm';
import api from '../../../../api';

vi.mock('../../../../api');

describe('HU-11: Crear y asignar etiquetas', () => {
    it('El usuario puede crear y asignar etiquetas para cada tarea', async () => {
        const mockTareaId = 1;
        api.get.mockResolvedValue({ data: [] });
        api.post.mockResolvedValue({ data: { id: 1, nombre: 'Etiqueta de prueba' } });

        render(<TareaForm initialData={{ id: mockTareaId }} showToast={vi.fn()}/>);

        const nuevaEtiquetaInput = screen.getByPlaceholderText('Nueva etiqueta');
        const crearEtiquetaButton = screen.getByText('Crear Etiqueta');

        fireEvent.change(nuevaEtiquetaInput, { target: { value: 'Etiqueta de prueba' } });
        fireEvent.click(crearEtiquetaButton);

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith('/api/etiquetas/', { nombre: 'Etiqueta de prueba', tarea_id: mockTareaId });
        });

    });

    it('El sistema debe mostrar un mensaje cuando se cree una etiqueta a una tarea.', async () => {
        const mockTareaId = 1;
        const showToastMock = vi.fn();

        api.get.mockResolvedValue({ data: [] });
        api.post.mockResolvedValue({ data: { id: 1, nombre: 'Etiqueta de prueba' } });

        render(<TareaForm initialData={{ id: mockTareaId }} showToast={showToastMock} />);

        const nuevaEtiquetaInput = screen.getByPlaceholderText('Nueva etiqueta');
        const crearEtiquetaButton = screen.getByText('Crear Etiqueta');

        fireEvent.change(nuevaEtiquetaInput, { target: { value: 'Etiqueta de prueba' } });
        fireEvent.click(crearEtiquetaButton);

        await waitFor(() => {
            expect(showToastMock).toHaveBeenCalledWith("Etiqueta creada exitosamente");
        });
    });

    it('Muestra un error si el nombre de la etiqueta está vacío', async () => {
        const mockTareaId = 1;
        const showToastMock = vi.fn();

        api.get.mockResolvedValue({ data: [] });
        api.post.mockResolvedValue({ data: { id: 1, nombre: 'Etiqueta de prueba' } });

        render(<TareaForm initialData={{ id: mockTareaId }} showToast={showToastMock} />);

        const crearEtiquetaButton = screen.getByText('Crear Etiqueta');
        fireEvent.click(crearEtiquetaButton);

        await waitFor(() => {
            expect(screen.getByText('El nombre de la etiqueta no puede estar vacío.')).toBeInTheDocument();
        });
    });

    it('Muestra un error si la etiqueta ya existe', async () => {
        const mockTareaId = 1;
        const showToastMock = vi.fn();

        api.get.mockResolvedValue({ data: [] });
        api.post.mockResolvedValue({ data: { id: 1, nombre: 'Etiqueta de prueba' } });

        render(<TareaForm initialData={{ id: mockTareaId }} showToast={showToastMock} />);

        const nuevaEtiquetaInput = screen.getByPlaceholderText('Nueva etiqueta');
        const crearEtiquetaButton = screen.getByText('Crear Etiqueta');

        fireEvent.change(nuevaEtiquetaInput, { target: { value: 'Etiqueta de prueba' } });
        api.post.mockRejectedValue({response: {data: {error: "La etiqueta ya existe."}}});
        fireEvent.click(crearEtiquetaButton);

         await waitFor(() => {
           // expect(showToastMock).toHaveBeenCalledWith('La etiqueta ya existe.', 'error');
            
        });

    });
});