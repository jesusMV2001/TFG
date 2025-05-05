// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/HU/gemini/HU-12-gemini.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TareaForm from '../../../TareaForm';
import api from '../../../../api';
import toast from '../../../Toast';

vi.mock('../../../../api');
vi.mock('sonner', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

describe('HU-12: Eliminar etiquetas', () => {
    const initialData = {
        id: 1,
        titulo: 'Tarea de prueba',
        descripcion: 'Descripción de prueba',
        estado: 'pendiente',
        prioridad: 'media',
        fecha_vencimiento: '2024-12-31',
        etiquetas: [{ id: 1, nombre: 'Etiqueta 1' }, { id: 2, nombre: 'Etiqueta 2' }],
    };

    it('El usuario puede eliminar etiquetas para cada tarea.', async () => {
        api.get.mockResolvedValue({ data: initialData.etiquetas });
        api.delete.mockResolvedValue({});

        render(<TareaForm initialData={initialData} onAddTarea={() => { }} showToast={() => { }}/>);

        const deleteButton = await screen.findByText('Eliminar');
        fireEvent.click(deleteButton);

        expect(api.delete).toHaveBeenCalledWith(`/api/etiquetas/delete/${initialData.etiquetas[0].id}/`);
    });

    it('El sistema debe mostrar un mensaje cuando se elimine una etiqueta de una tarea.', async () => {
         api.get.mockResolvedValue({ data: initialData.etiquetas });
        api.delete.mockResolvedValue({});

        render(<TareaForm initialData={initialData} onAddTarea={() => { }} showToast={() => { }}/>);

        const deleteButton = await screen.findByText('Eliminar');
        fireEvent.click(deleteButton);

        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith('Etiqueta eliminada exitosamente');
        });
    });
});