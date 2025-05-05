// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/HU/mistral/HU-12-mistral.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TareaForm from '../../../TareaForm';
import api from '../../../../api';
import Toast from '../../../Toast';

vi.mock('../../../../api');

describe('Eliminar etiquetas', () => {
    it('Debe permitir al usuario eliminar etiquetas de una tarea', async () => {
        const initialData = {
            id: 1,
            titulo: 'Tarea de prueba',
            descripcion: 'Descripción de prueba',
            estado: 'pendiente',
            prioridad: 'media',
            fecha_vencimiento: '2023-12-31',
            etiquetas: [
                { id: 1, nombre: 'Etiqueta 1' },
                { id: 2, nombre: 'Etiqueta 2' }
            ]
        };

        const showToast = vi.fn();

        api.delete.mockResolvedValue({});

        render(
            <>
                <TareaForm onAddTarea={vi.fn()} initialData={initialData} showToast={showToast} />
                <Toast message="" type="success" onClose={vi.fn()} />
            </>
        );

        // Verificar que las etiquetas se rendericen correctamente
        expect(screen.getByText('Etiqueta 1')).toBeInTheDocument();
        expect(screen.getByText('Etiqueta 2')).toBeInTheDocument();

        // Eliminar la primera etiqueta
        fireEvent.click(screen.getAllByText('Eliminar')[0]);

        await waitFor(() => {
            expect(api.delete).toHaveBeenCalledWith('/api/etiquetas/delete/1/');
            expect(showToast).toHaveBeenCalledWith('Etiqueta eliminada exitosamente');
        });

        // Verificar que la etiqueta eliminada ya no esté en el DOM
        expect(screen.queryByText('Etiqueta 1')).not.toBeInTheDocument();
    });

    it('Debe mostrar un mensaje de éxito al eliminar una etiqueta', async () => {
        const initialData = {
            id: 1,
            titulo: 'Tarea de prueba',
            descripcion: 'Descripción de prueba',
            estado: 'pendiente',
            prioridad: 'media',
            fecha_vencimiento: '2023-12-31',
            etiquetas: [
                { id: 1, nombre: 'Etiqueta 1' }
            ]
        };

        const showToast = vi.fn();

        api.delete.mockResolvedValue({});

        render(
            <>
                <TareaForm onAddTarea={vi.fn()} initialData={initialData} showToast={showToast} />
                <Toast message="" type="success" onClose={vi.fn()} />
            </>
        );

        // Eliminar la etiqueta
        fireEvent.click(screen.getByText('Eliminar'));

        await waitFor(() => {
            expect(api.delete).toHaveBeenCalledWith('/api/etiquetas/delete/1/');
            expect(showToast).toHaveBeenCalledWith('Etiqueta eliminada exitosamente');
        });

        // Verificar que el mensaje de éxito se muestre
        expect(screen.getByText('Etiqueta eliminada exitosamente')).toBeInTheDocument();
    });
});