// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/HU/mistral/HU-11-mistral.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TareaForm from '../../../TareaForm';
import api from '../../../../api';
import { BrowserRouter } from 'react-router-dom';

vi.mock('../../../../api');
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => vi.fn(),
    };
});

describe('HU-11: Crear y asignar etiquetas', () => {
    it('El usuario puede asignar y crear etiquetas para cada tarea', async () => {
        const mockTarea = { id: 1, titulo: 'Tarea de prueba', descripcion: 'Descripción de prueba', estado: 'pendiente', prioridad: 'media', fecha_vencimiento: '2023-12-31' };
        const mockEtiqueta = { id: 1, nombre: 'Etiqueta de prueba' };
        const onAddTarea = vi.fn();
        const showToast = vi.fn();

        api.get.mockResolvedValue({ data: [mockEtiqueta] });
        api.post.mockResolvedValue({ data: mockEtiqueta });
        api.delete.mockResolvedValue({});

        render(
            <BrowserRouter>
                <TareaForm onAddTarea={onAddTarea} initialData={mockTarea} showToast={showToast} />
            </BrowserRouter>
        );

        // Crear una nueva etiqueta
        const nuevaEtiquetaInput = screen.getByPlaceholderText('Nueva etiqueta');
        fireEvent.change(nuevaEtiquetaInput, { target: { value: 'Nueva etiqueta' } });
        const crearEtiquetaButton = screen.getByText('Crear Etiqueta');
        fireEvent.click(crearEtiquetaButton);

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith('/api/etiquetas/', { nombre: 'Nueva etiqueta', tarea_id: mockTarea.id });
            expect(showToast).toHaveBeenCalledWith('Etiqueta creada exitosamente');
        });

        // Eliminar una etiqueta
        const eliminarEtiquetaButton = screen.getByText('Eliminar');
        fireEvent.click(eliminarEtiquetaButton);

        await waitFor(() => {
            expect(api.delete).toHaveBeenCalledWith(`/api/etiquetas/delete/${mockEtiqueta.id}/`);
            expect(showToast).toHaveBeenCalledWith('Etiqueta eliminada exitosamente');
        });
    });

    it('El sistema debe mostrar un mensaje cuando se cree y asigne una etiqueta a una tarea', async () => {
        const mockTarea = { id: 1, titulo: 'Tarea de prueba', descripcion: 'Descripción de prueba', estado: 'pendiente', prioridad: 'media', fecha_vencimiento: '2023-12-31' };
        const mockEtiqueta = { id: 1, nombre: 'Etiqueta de prueba' };
        const onAddTarea = vi.fn();
        const showToast = vi.fn();

        api.get.mockResolvedValue({ data: [mockEtiqueta] });
        api.post.mockResolvedValue({ data: mockEtiqueta });

        render(
            <BrowserRouter>
                <TareaForm onAddTarea={onAddTarea} initialData={mockTarea} showToast={showToast} />
            </BrowserRouter>
        );

        // Crear una nueva etiqueta
        const nuevaEtiquetaInput = screen.getByPlaceholderText('Nueva etiqueta');
        fireEvent.change(nuevaEtiquetaInput, { target: { value: 'Nueva etiqueta' } });
        const crearEtiquetaButton = screen.getByText('Crear Etiqueta');
        fireEvent.click(crearEtiquetaButton);

        await waitFor(() => {
            expect(showToast).toHaveBeenCalledWith('Etiqueta creada exitosamente');
        });
    });
});