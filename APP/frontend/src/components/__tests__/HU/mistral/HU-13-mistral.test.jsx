// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/HU/mistral/HU-13-mistral.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ComentariosList from '../../../ComentariosList';
import api from '../../../../api';

vi.mock('../../../../api');

describe('HU-13: Crear comentarios', () => {
    it('debe mostrar un espacio para agregar comentarios', () => {
        render(<ComentariosList tareaId={1} />);
        const textarea = screen.getByPlaceholderText(/Escribe un comentario.../i);
        expect(textarea).toBeInTheDocument();
    });

    it('debe mostrar un mensaje de error cuando el comentario está vacío', async () => {
        render(<ComentariosList tareaId={1} />);
        const textarea = screen.getByPlaceholderText(/Escribe un comentario.../i);
        const button = screen.getByText(/Comentar/i);

        fireEvent.change(textarea, { target: { value: '' } });
        fireEvent.click(button);

        await waitFor(() => {
            const errorMessage = screen.getByText(/El comentario no puede estar vacío/i);
            expect(errorMessage).toBeInTheDocument();
        });
    });

    it('debe crear un comentario y mostrarlo en la lista', async () => {
        const mockComentario = { id: 1, texto: 'Nuevo comentario', usuario: 'Usuario1', fecha_creacion: '2023-10-01T00:00:00Z' };
        api.post.mockResolvedValueOnce({ data: mockComentario });
        api.get.mockResolvedValueOnce({ data: [mockComentario] });

        render(<ComentariosList tareaId={1} />);
        const textarea = screen.getByPlaceholderText(/Escribe un comentario.../i);
        const button = screen.getByText(/Comentar/i);

        fireEvent.change(textarea, { target: { value: 'Nuevo comentario' } });
        fireEvent.click(button);

        await waitFor(() => {
            const comentario = screen.getByText(/Nuevo comentario/i);
            expect(comentario).toBeInTheDocument();
        });
    });
});