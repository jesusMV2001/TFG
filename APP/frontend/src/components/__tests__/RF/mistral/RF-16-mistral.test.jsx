// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/RF/mistral/RF-16-mistral.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ComentariosList from '../../../ComentariosList';
import api from '../../../../api';
import { BrowserRouter } from 'react-router-dom';

vi.mock('../../../../api');

describe('RF-16: Comentarios', () => {
    const tareaId = 1;
    const comentariosMock = [
        { id: 1, texto: 'Comentario 1', usuario: 'Usuario 1', fecha_creacion: '2023-10-01T12:00:00Z' },
        { id: 2, texto: 'Comentario 2', usuario: 'Usuario 2', fecha_creacion: '2023-10-02T12:00:00Z' },
    ];

    beforeEach(() => {
        api.get.mockResolvedValue({ data: comentariosMock });
        api.post.mockResolvedValue({ data: { id: 3, texto: 'Nuevo comentario', usuario: 'Usuario 3', fecha_creacion: '2023-10-03T12:00:00Z' } });
        api.put.mockResolvedValue({});
        api.delete.mockResolvedValue({});
    });

    it('debería renderizar la lista de comentarios', async () => {
        render(
            <BrowserRouter>
                <ComentariosList tareaId={tareaId} />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Comentario 1')).toBeInTheDocument();
            expect(screen.getByText('Comentario 2')).toBeInTheDocument();
        });
    });

    it('debería permitir crear un nuevo comentario', async () => {
        render(
            <BrowserRouter>
                <ComentariosList tareaId={tareaId} />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByPlaceholderText('Escribe un comentario...'), { target: { value: 'Nuevo comentario' } });
        fireEvent.click(screen.getByText('Comentar'));

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith(`/api/tareas/${tareaId}/comentarios/`, { texto: 'Nuevo comentario', tarea: tareaId });
            expect(screen.getByText('Nuevo comentario')).toBeInTheDocument();
        });
    });

    it('debería permitir editar un comentario existente', async () => {
        render(
            <BrowserRouter>
                <ComentariosList tareaId={tareaId} />
            </BrowserRouter>
        );

        fireEvent.click(screen.getAllByTestId('edit-button')[0]);
        fireEvent.change(screen.getByPlaceholderText('Escribe un comentario...'), { target: { value: 'Comentario editado' } });
        fireEvent.click(screen.getByText('Guardar'));

        await waitFor(() => {
            expect(api.put).toHaveBeenCalledWith(`/api/comentarios/update/${comentariosMock[0].id}/`, { texto: 'Comentario editado', tarea: tareaId });
            expect(screen.getByText('Comentario editado')).toBeInTheDocument();
        });
    });

    it('debería permitir eliminar un comentario', async () => {
        render(
            <BrowserRouter>
                <ComentariosList tareaId={tareaId} />
            </BrowserRouter>
        );

        fireEvent.click(screen.getAllByTestId('delete-button')[0]);
        window.confirm = vi.fn(() => true);

        await waitFor(() => {
            expect(api.delete).toHaveBeenCalledWith(`/api/comentarios/delete/${comentariosMock[0].id}/`);
            expect(screen.queryByText('Comentario 1')).not.toBeInTheDocument();
        });
    });
});