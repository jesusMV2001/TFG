// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/HU/gemini/HU-13-gemini.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ComentariosList from '../../../ComentariosList';
import api from '../../../../api';

vi.mock('../../../../api');

describe('HU-13: Crear Comentarios', () => {
    const tareaId = 1;

    it('Debería renderizar el componente ComentariosList', () => {
        render(<ComentariosList tareaId={tareaId} />);
        expect(screen.getByPlaceholderText('Escribe un comentario...')).toBeInTheDocument();
    });

    it('Debería mostrar un mensaje de error si el comentario está vacío', async () => {
        render(<ComentariosList tareaId={tareaId} />);
        const textareaElement = screen.getByPlaceholderText('Escribe un comentario...');
        const comentarButton = screen.getByText('Comentar');

        fireEvent.change(textareaElement, { target: { value: '' } });
        fireEvent.click(comentarButton);

        await waitFor(() => {
            expect(screen.getByText('El comentario no puede estar vacío')).toBeInTheDocument();
        });
    });

    it('Debería llamar a la API para crear un comentario y mostrarlo si la creación es exitosa', async () => {
        const mockComentario = { id: 1, texto: 'Este es un comentario de prueba', usuario: 'testuser', fecha_creacion: new Date().toISOString() };
        api.post.mockResolvedValue({ data: mockComentario });
        api.get.mockResolvedValue({ data: [mockComentario] });

        render(<ComentariosList tareaId={tareaId} />);
        const textareaElement = screen.getByPlaceholderText('Escribe un comentario...');
        const comentarButton = screen.getByText('Comentar');

        fireEvent.change(textareaElement, { target: { value: 'Este es un comentario de prueba' } });
        fireEvent.click(comentarButton);

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith(`/api/tareas/${tareaId}/comentarios/`, { texto: 'Este es un comentario de prueba', tarea: tareaId });
            expect(screen.getByText('Este es un comentario de prueba')).toBeInTheDocument();
        });
    });

    it('Debería mostrar los comentarios existentes al cargar el componente', async () => {
        const mockComentarios = [{ id: 1, texto: 'Comentario 1', usuario: 'user1', fecha_creacion: new Date().toISOString() }, { id: 2, texto: 'Comentario 2', usuario: 'user2', fecha_creacion: new Date().toISOString() }];
        api.get.mockResolvedValue({ data: mockComentarios });

        render(<ComentariosList tareaId={tareaId} />);

        await waitFor(() => {
            expect(screen.getByText('Comentario 1')).toBeInTheDocument();
            expect(screen.getByText('Comentario 2')).toBeInTheDocument();
        });
    });
});