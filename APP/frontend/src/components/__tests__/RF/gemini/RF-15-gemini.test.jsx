// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/RF/gemini/RF-15-gemini.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TareaForm from '../../../TareaForm';
import api from '../../../../api';

vi.mock('../../../../api');

describe('RF-15: Eliminar etiquetas de una tarea', () => {
    it('Debería permitir eliminar etiquetas de una tarea', async () => {
        const initialData = {
            id: 1,
            titulo: 'Tarea de prueba',
            descripcion: 'Descripción de prueba',
            estado: 'pendiente',
            prioridad: 'media',
            fecha_vencimiento: '2024-12-31',
            etiquetas: [{ id: 1, nombre: 'Etiqueta 1' }, { id: 2, nombre: 'Etiqueta 2' }],
        };

        api.get.mockResolvedValueOnce({ data: [{ id: 1, nombre: 'Etiqueta 1' }, { id: 2, nombre: 'Etiqueta 2' }] });
        api.delete.mockResolvedValue({ status: 204 });
        const showToastMock = vi.fn();

        render(<TareaForm initialData={initialData} onAddTarea={vi.fn()} showToast={showToastMock} />);

        const deleteButton1 = await screen.findByRole('button', { name: 'Eliminar' });
        fireEvent.click(deleteButton1);

        await waitFor(() => {
            expect(api.delete).toHaveBeenCalledWith('/api/etiquetas/delete/1/');
        });

        expect(showToastMock).toHaveBeenCalledWith("Etiqueta eliminada exitosamente");
    });

    it('Debería mostrar un error si falla la eliminación de la etiqueta', async () => {
        const initialData = {
            id: 1,
            titulo: 'Tarea de prueba',
            descripcion: 'Descripción de prueba',
            estado: 'pendiente',
            prioridad: 'media',
            fecha_vencimiento: '2024-12-31',
            etiquetas: [{ id: 1, nombre: 'Etiqueta 1' }],
        };

        api.get.mockResolvedValueOnce({ data: [{ id: 1, nombre: 'Etiqueta 1' }] });
        api.delete.mockRejectedValue(new Error('Error al eliminar etiqueta'));
        const showToastMock = vi.fn();

        render(<TareaForm initialData={initialData} onAddTarea={vi.fn()} showToast={showToastMock} />);

        const deleteButton = await screen.findByRole('button', { name: 'Eliminar' });
        fireEvent.click(deleteButton);

        await waitFor(() => {
            expect(api.delete).toHaveBeenCalledWith('/api/etiquetas/delete/1/');
        });
    });
});