// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/RF/gemini/RF-17-gemini.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ComentariosList from '../../../ComentariosList';
import api from '../../../../api';

vi.mock('../../../../api');

describe('ComentariosList', () => {
    it('muestra un mensaje de error si el comentario está vacío', async () => {
        api.get.mockResolvedValue({ data: [] });
        render(<ComentariosList tareaId={1} />);

        const textareaElement = screen.getByPlaceholderText('Escribe un comentario...');
        const comentarButton = screen.getByText('Comentar');

        fireEvent.change(textareaElement, { target: { value: '' } });
        fireEvent.click(comentarButton);

        await waitFor(() => {
            expect(screen.getByText('El comentario no puede estar vacío')).toBeInTheDocument();
        });
    });

    it('no muestra un mensaje de error inicialmente', async () => {
        api.get.mockResolvedValue({ data: [] });
        render(<ComentariosList tareaId={1} />);

        expect(screen.queryByText('El comentario no puede estar vacío')).toBeNull();
    });

    it('limpia el mensaje de error al intentar enviar un comentario no vacío', async () => {
        api.get.mockResolvedValue({ data: [] });
        render(<ComentariosList tareaId={1} />);

        const textareaElement = screen.getByPlaceholderText('Escribe un comentario...');
        const comentarButton = screen.getByText('Comentar');

        fireEvent.change(textareaElement, { target: { value: '' } });
        fireEvent.click(comentarButton);

        await waitFor(() => {
            expect(screen.getByText('El comentario no puede estar vacío')).toBeInTheDocument();
        });

        fireEvent.change(textareaElement, { target: { value: 'Este es un comentario' } });
        fireEvent.click(comentarButton);

        await waitFor(() => {
            expect(screen.queryByText('El comentario no puede estar vacío')).toBeNull();
        });

    });
});