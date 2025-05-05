// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/RF/mistral/RF-15-mistral.test.jsx
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

describe('RF-15: Los usuarios podrán eliminar etiquetas de una tarea', () => {
    it('debe eliminar una etiqueta existente de una tarea', async () => {
        const initialData = {
            id: 1,
            titulo: 'Tarea de prueba',
            descripcion: 'Descripción de la tarea',
            estado: 'pendiente',
            prioridad: 'media',
            fecha_vencimiento: '2023-12-31',
            etiquetas: [{ id: 1, nombre: 'Etiqueta 1' }, { id: 2, nombre: 'Etiqueta 2' }],
        };

        const showToast = vi.fn();

        render(
            <BrowserRouter>
                <TareaForm onAddTarea={vi.fn()} initialData={initialData} showToast={showToast} />
            </BrowserRouter>
        );

        // Simular la eliminación de una etiqueta
        const deleteButton = screen.getByText('Eliminar');
        fireEvent.click(deleteButton);

        // Verificar que la API fue llamada con la ruta correcta
        expect(api.delete).toHaveBeenCalledWith(`/api/etiquetas/delete/1/`);

        // Esperar a que la promesa se resuelva
        await waitFor(() => {
            expect(showToast).toHaveBeenCalledWith('Etiqueta eliminada exitosamente');
        });
    });

    it('debe manejar el error al eliminar una etiqueta', async () => {
        const initialData = {
            id: 1,
            titulo: 'Tarea de prueba',
            descripcion: 'Descripción de la tarea',
            estado: 'pendiente',
            prioridad: 'media',
            fecha_vencimiento: '2023-12-31',
            etiquetas: [{ id: 1, nombre: 'Etiqueta 1' }, { id: 2, nombre: 'Etiqueta 2' }],
        };

        const showToast = vi.fn();

        // Simular un error en la API
        api.delete.mockRejectedValue(new Error('Error al eliminar la etiqueta'));

        render(
            <BrowserRouter>
                <TareaForm onAddTarea={vi.fn()} initialData={initialData} showToast={showToast} />
            </BrowserRouter>
        );

        // Simular la eliminación de una etiqueta
        const deleteButton = screen.getByText('Eliminar');
        fireEvent.click(deleteButton);

        // Esperar a que la promesa se resuelva
        await waitFor(() => {
            expect(showToast).toHaveBeenCalledWith('No se pudo eliminar la etiqueta.');
        });
    });
});