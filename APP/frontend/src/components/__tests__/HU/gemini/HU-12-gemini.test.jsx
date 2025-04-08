// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/HU/gemini/HU-12-gemini.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TareaForm from '../../../TareaForm';
import api from '../../../../api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

vi.mock('../../../../api');
vi.mock('react-toastify', () => {
    const actual = vi.importActual('react-toastify');
    return {
        ...actual,
        toast: {
            success: vi.fn(),
            error: vi.fn(),
        },
    };
});

describe('HU-12: Eliminar etiquetas', () => {
    const mockTarea = {
        id: 1,
        titulo: 'Test Tarea',
        descripcion: 'Test Description',
        estado: 'pendiente',
        prioridad: 'media',
        fecha_vencimiento: '2024-12-31',
        etiquetas: [{ id: 101, nombre: 'Etiqueta 1' }, { id: 102, nombre: 'Etiqueta 2' }],
    };

    it('El usuario puede eliminar etiquetas para cada tarea.', async () => {
        api.get.mockResolvedValue({ data: [{ id: 101, nombre: 'Etiqueta 1' }, { id: 102, nombre: 'Etiqueta 2' }] });
        api.delete.mockResolvedValue({});

        render(
            <>
                <TareaForm initialData={mockTarea} showToast={toast.success} />
                <ToastContainer />
            </>
        );

        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith(`/api/etiquetas/?tarea_id=${mockTarea.id}`);
        });

        const deleteButton = await screen.findByText('Eliminar');
        fireEvent.click(deleteButton);

        await waitFor(() => {
            expect(api.delete).toHaveBeenCalled();
        });

    });

    it('El sistema debe mostrar un mensaje cuando se elimine una etiqueta de una tarea.', async () => {
        api.get.mockResolvedValue({ data: [{ id: 101, nombre: 'Etiqueta 1' }, { id: 102, nombre: 'Etiqueta 2' }] });
        api.delete.mockResolvedValue({});
        const showToastMock = vi.fn();

        render(
            <>
                <TareaForm initialData={mockTarea} showToast={showToastMock} />
                <ToastContainer />
            </>
        );

        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith(`/api/etiquetas/?tarea_id=${mockTarea.id}`);
        });

        const deleteButton = await screen.findByText('Eliminar');
        fireEvent.click(deleteButton);

        await waitFor(() => {
            expect(api.delete).toHaveBeenCalled();
        });

        await waitFor(() => {
            expect(showToastMock).toHaveBeenCalledWith('Etiqueta eliminada exitosamente');
        });
    });

    it('Maneja el error al eliminar una etiqueta', async () => {
        api.get.mockResolvedValue({ data: [{ id: 101, nombre: 'Etiqueta 1' }, { id: 102, nombre: 'Etiqueta 2' }] });
        api.delete.mockRejectedValue(new Error('Failed to delete'));
        const showToastMock = vi.fn();

        render(
            <>
                <TareaForm initialData={mockTarea} showToast={showToastMock} />
                <ToastContainer />
            </>
        );

        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith(`/api/etiquetas/?tarea_id=${mockTarea.id}`);
        });

        const deleteButton = await screen.findByText('Eliminar');
        fireEvent.click(deleteButton);

        await waitFor(() => {
            expect(api.delete).toHaveBeenCalled();
        });
    });

});