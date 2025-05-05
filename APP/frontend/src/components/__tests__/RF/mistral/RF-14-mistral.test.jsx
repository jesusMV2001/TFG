// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/RF/mistral/RF-14-mistral.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TareaForm from '../../../TareaForm';
import api from '../../../../api';
import { BrowserRouter } from 'react-router-dom';

vi.mock('../../../../api');

describe('RF-14: Crear y asignar nuevas etiquetas a una tarea', () => {
    const initialData = {
        id: 1,
        titulo: 'Tarea de prueba',
        descripcion: 'Descripción de la tarea',
        estado: 'pendiente',
        prioridad: 'media',
        fecha_vencimiento: '2023-12-31',
        etiquetas: []
    };

    const onAddTarea = vi.fn();
    const showToast = vi.fn();

    it('Debería permitir crear una nueva etiqueta', async () => {
        render(
            <BrowserRouter>
                <TareaForm initialData={initialData} onAddTarea={onAddTarea} showToast={showToast} />
            </BrowserRouter>
        );

        const nuevaEtiquetaInput = screen.getByPlaceholderText('Nueva etiqueta');
        const crearEtiquetaButton = screen.getByText('Crear Etiqueta');

        fireEvent.change(nuevaEtiquetaInput, { target: { value: 'Nueva Etiqueta' } });
        fireEvent.click(crearEtiquetaButton);

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith('/api/etiquetas/', { nombre: 'Nueva Etiqueta', tarea_id: initialData.id });
            expect(showToast).toHaveBeenCalledWith('Etiqueta creada exitosamente');
        });
    });

    it('Debería mostrar un mensaje de error si la etiqueta ya existe', async () => {
        api.post.mockResolvedValueOnce({ data: { nombre: 'Etiqueta Existente', id: 2 } });

        render(
            <BrowserRouter>
                <TareaForm initialData={initialData} onAddTarea={onAddTarea} showToast={showToast} />
            </BrowserRouter>
        );

        const nuevaEtiquetaInput = screen.getByPlaceholderText('Nueva etiqueta');
        const crearEtiquetaButton = screen.getByText('Crear Etiqueta');

        fireEvent.change(nuevaEtiquetaInput, { target: { value: 'Etiqueta Existente' } });
        fireEvent.click(crearEtiquetaButton);

        await waitFor(() => {
            expect(screen.getByText('La etiqueta ya existe.')).toBeInTheDocument();
        });
    });

    it('Debería permitir eliminar una etiqueta existente', async () => {
        api.get.mockResolvedValueOnce({ data: [{ id: 1, nombre: 'Etiqueta a Eliminar' }] });

        render(
            <BrowserRouter>
                <TareaForm initialData={initialData} onAddTarea={onAddTarea} showToast={showToast} />
            </BrowserRouter>
        );

        const eliminarEtiquetaButton = screen.getByText('Eliminar');

        fireEvent.click(eliminarEtiquetaButton);

        await waitFor(() => {
            expect(api.delete).toHaveBeenCalledWith('/api/etiquetas/delete/1/');
            expect(showToast).toHaveBeenCalledWith('Etiqueta eliminada exitosamente');
        });
    });
});