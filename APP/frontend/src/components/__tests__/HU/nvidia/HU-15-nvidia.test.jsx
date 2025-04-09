// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/HU/nvidia/HU-15-nvidia.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ComentariosList from '../../../ComentariosList';
import api from '../../../../api';
import { BrowserRouter } from 'react-router-dom';
import { within } from '@testing-library/dom';

vi.mock('../../../../api');
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => vi.fn(),
    };
});

describe('HU-15: Eliminar comentarios', () => {
    const tareaId = 1;
    const comentarios = [
        { id: 1, texto: 'Comentario 1', usuario: 'Usuario 1' },
        { id: 2, texto: 'Comentario 2', usuario: 'Usuario 2' },
    ];

    beforeEach(() => {
        vi.spyOn(api, 'get').mockImplementation((url) => {
            if (url.includes(`/api/tareas/${tareaId}/comentarios/`)) {
                return Promise.resolve({ data: comentarios });
            }
            return Promise.resolve({});
        });

        vi.spyOn(api, 'delete').mockImplementation((url) => {
            if (url.includes('/api/comentarios/delete/')) {
                return Promise.resolve({ status: 204 });
            }
            return Promise.resolve({});
        });
    });

    it('El usuario debe poder eliminar un comentario de una tarea.', async () => {
        render(
            <BrowserRouter>
                <ComentariosList tareaId={tareaId} onClose={vi.fn()} />
            </BrowserRouter>
        );

       (await waitFor(() => screen.getByText('Comentario 1'))).\FoundationFocusVisible();
        const deleteButton = within(screen.getByText('Comentario 1')).getByRole('button', { name: 'Eliminar' });
        fireEvent.click(deleteButton);

        await waitFor(() => expect(api.delete).toHaveBeenCalledTimes(1));
        expect(api.delete).toHaveBeenCalledWith(`/api/comentarios/delete/1/`);
    });

    it('El sistema debe mostrar un mensaje cuando se elimine correctamente el comentario.', async () => {
        render(
            <BrowserRouter>
                <ComentariosList tareaId={tareaId} onClose={vi.fn()} />
            </BrowserRouter>
        );

        (await waitFor(() => screen.getByText('Comentario 1'))).FoundationFocusVisible();
        const deleteButton = within(screen.getByText('Comentario 1')).getByRole('button', { name: 'Eliminar' });
        fireEvent.click(deleteButton);

        await waitFor(() => screen.getByText('Comentario eliminado correctamente.'));
    });
});