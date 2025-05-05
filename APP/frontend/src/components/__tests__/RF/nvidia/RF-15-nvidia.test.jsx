// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/RF/nvidia/RF-15-nvidia.test.jsx
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

vi.mock('../../../../api', () => ({
    delete: vi.fn().mockResolvedValueOnce({ status: 200 }),
    post: vi.fn().mockResolvedValueOnce({ status: 201, data: { id: 1, nombre: 'Nueva Etiqueta' } }),
}));

describe('RF-15: Eliminar etiquetas de una tarea', () => {
    beforeEach(() => {
        const tarea = { id: 1, etiquetas: [{ id: 1, nombre: 'Etiqueta 1' }, { id: 2, nombre: 'Etiqueta 2' }] };
        render(
            <BrowserRouter>
                <TareaForm onAddTarea={vi.fn()} initialData={tarea} />
            </BrowserRouter>
        );
    });

    it('debería mostrar una lista de etiquetas', () => {
        const etiquetasList = screen.getByRole('list');
        expect(etiquetasList).toBeInTheDocument();
        expect(etiquetasList.children.length).toBe(2);
    });

    it('debería mostrar el botón de eliminar para cada etiqueta', async () => {
        const eliminarBotones = screen.getAllByText('Eliminar');
        expect(eliminarBotones.length).toBe(2);
    });

    it('al hacer clic en el botón de eliminar, debería llamar a la API para eliminar la etiqueta', async () => {
        const eliminarButton = screen.getAllByText('Eliminar')[0];
        fireEvent.click(eliminarButton);

        await waitFor(() => expect(api.delete).toHaveBeenCalledTimes(1));
        expect(api.delete).toHaveBeenCalledWith('/api/etiquetas/delete/1/');
    });

    it('al eliminar una etiqueta, debería actualizar la lista de etiquetas', async () => {
        const eliminarButton = screen.getAllByText('Eliminar')[0];
        fireEvent.click(eliminarButton);

        await waitFor(() => {
            const etiquetasList = screen.getByRole('list');
            expect(etiquetasList.children.length).toBe(1);
        });
    });

    it('al eliminar una etiqueta, debería mostrar un mensaje de éxito', async () => {
        const eliminarButton = screen.getAllByText('Eliminar')[0];
        fireEvent.click(eliminarButton);

        await waitFor(() => {
            const successMessage = screen.getByText('Etiqueta eliminada exitosamente');
            expect(successMessage).toBeInTheDocument();
        });
    });
});