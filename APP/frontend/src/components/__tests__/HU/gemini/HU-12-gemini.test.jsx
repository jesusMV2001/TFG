// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/HU/gemini/HU-12-gemini.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TareaForm from '../../../TareaForm';
import api from '../../../../api';
import { BrowserRouter } from 'react-router-dom';

vi.mock('../../../../api');

describe('HU-12: Eliminar Etiquetas', () => {
    it('El usuario puede eliminar etiquetas para cada tarea y se muestra un mensaje', async () => {
        const mockEtiquetas = [
            { id: 1, nombre: 'Etiqueta 1' },
            { id: 2, nombre: 'Etiqueta 2' },
        ];

        api.get.mockResolvedValue({ data: mockEtiquetas });
        api.delete.mockResolvedValue({});

        const showToastMock = vi.fn();
        render(
            <BrowserRouter>
                <TareaForm initialData={{ id: 1, etiquetas: mockEtiquetas }} showToast={showToastMock} />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith('/api/etiquetas/?tarea_id=1');
        });

        const eliminarButtons = await screen.findAllByText('Eliminar');
        expect(eliminarButtons.length).toBe(2);

        await fireEvent.click(eliminarButtons[0]);

        expect(api.delete).toHaveBeenCalledWith('/api/etiquetas/delete/1/');
        expect(showToastMock).toHaveBeenCalledWith('Etiqueta eliminada exitosamente');
    });

    it('Maneja el error al eliminar una etiqueta', async () => {
        const mockEtiquetas = [
            { id: 1, nombre: 'Etiqueta 1' },
        ];

        api.get.mockResolvedValue({ data: mockEtiquetas });
        api.delete.mockRejectedValue(new Error('Error al eliminar etiqueta'));

        const showToastMock = vi.fn();
        render(
            <BrowserRouter>
                <TareaForm initialData={{ id: 1, etiquetas: mockEtiquetas }} showToast={showToastMock} />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith('/api/etiquetas/?tarea_id=1');
        });

        const eliminarButtons = await screen.findAllByText('Eliminar');
        expect(eliminarButtons.length).toBe(1);

        await fireEvent.click(eliminarButtons[0]);

        expect(api.delete).toHaveBeenCalledWith('/api/etiquetas/delete/1/');
        // Ajusta la aserción del toast si muestra el error de la API
        // o un mensaje genérico de error.
        // En este caso, verificamos que se llame con un mensaje de error.
        expect(showToastMock).toHaveBeenCalledWith('No se pudo eliminar la etiqueta.', undefined);
    });
});