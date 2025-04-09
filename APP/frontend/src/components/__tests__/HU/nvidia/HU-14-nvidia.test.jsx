// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/HU/nvidia/HU-14-nvidia.test.jsx

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ComentariosList from '../../../ComentariosList';
import api from '../../../../api';
import { BrowserRouter } from 'react-router-dom';
import { within } from '@testing-library/react';

vi.mock('../../../../api');
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => vi.fn(),
    };
});

describe('HU-14: Editar comentarios', () => {
    const tareaId = 1;
    const comentarios = [
        { id: 1, texto: 'Comentario original', usuario: 'Usuario 1' },
        { id: 2, texto: 'Otro comentario', usuario: 'Usuario 2' },
    ];

    vi.mocked(api.get).mockResolvedValueOnce({ data: comentarios });
    vi.mocked(api.put).mockResolvedValueOnce({ status: 200 });

    it('El usuario debe poder editar un comentario de una tarea.', async () => {
        render(
            <BrowserRouter>
                <ComentariosList tareaId={tareaId} onClose={() => { }} />
            </BrowserRouter>
        );

        await waitFor(() => screen.getByText('Comentario original'));

        const comentarioOriginal = screen.getByText('Comentario original');
        const editarButton = within(comentarioOriginal.parentNode).getByText('Editar');

        fireEvent.click(editarButton);

        const textarea = screen.getByRole('textarea');
        const nuevoComentario = 'Comentario editado';
        fireEvent.change(textarea, { target: { value: nuevoComentario } });

        const guardarButton = within(textarea.parentNode).getByText('Guardar');
        fireEvent.click(guardarButton);

        await waitFor(() => screen.getByText(nuevoComentario));
    });

    it('El comentario no debe estar vacio.', async () => {
        render(
            <BrowserRouter>
                <ComentariosList tareaId={tareaId} onClose={() => { }} />
            </BrowserRouter>
        );

        await waitFor(() => screen.getByText('Comentario original'));

        const comentarioOriginal = screen.getByText('Comentario original');
        const editarButton = within(comentarioOriginal.parentNode).getByText('Editar');

        fireEvent.click(editarButton);

        const textarea = screen.getByRole('textarea');
        fireEvent.change(textarea, { target: { value: '' } });

        const guardarButton = within(textarea.parentNode).getByText('Guardar');
        fireEvent.click(guardarButton);

        await waitFor(() => screen.getByText('El comentario no puede estar vacío'));
    });

    it('El sistema debe mostrar un mensaje cuando se edite correctamente el comentario.', async () => {
        render(
            <BrowserRouter>
                <ComentariosList tareaId={tareaId} onClose={() => { }} />
            </BrowserRouter>
        );

        await waitFor(() => screen.getByText('Comentario original'));

        const comentarioOriginal = screen.getByText('Comentario original');
        const editarButton = within(comentarioOriginal.parentNode).getByText('Editar');

        fireEvent.click(editarButton);

        const textarea = screen.getByRole('textarea');
        const nuevoComentario = 'Comentario editado';
        fireEvent.change(textarea, { target: { value: nuevoComentario } });

        const guardarButton = within(textarea.parentNode).getByText('Guardar');
        fireEvent.click(guardarButton);

        await waitFor(() => screen.getByText('Comentario actualizado exitosamente'));
    });

    it('El sistema debe mostrar un mensaje de error cuando el comentario este vacio.', async () => {
        render(
            <BrowserRouter>
                <ComentariosList tareaId={tareaId} onClose={() => { }} />
            </BrowserRouter>
        );

        await waitFor(() => screen.getByText('Comentario original'));

        const comentarioOriginal = screen.getByText('Comentario original');
        const editarButton = within(comentarioOriginal.parentNode).getByText('Editar');

        fireEvent.click(editarButton);

        const textarea = screen.getByRole('textarea');
        fireEvent.change(textarea, { target: { value: '' } });

        const guardarButton = within(textarea.parentNode).getByText('Guardar');
        fireEvent.click(guardarButton);

        await waitFor(() => screen.getByText('Error al actualizar el comentario'));
    });
});