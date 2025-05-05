// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/RF/mistral/RF-17-mistral.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ComentariosList from '../../../ComentariosList';
import api from '../../../../api';

vi.mock('../../../../api');

describe('RF-17: Comprobación de comentarios vacíos', () => {
    it('muestra un mensaje de error si el comentario está vacío', async () => {
        const tareaId = 1;
        render(<ComentariosList tareaId={tareaId} />);

        const comentarioInput = screen.getByPlaceholderText('Escribe un comentario...');
        const submitButton = screen.getByText('Comentar');

        // Simulamos el envío de un comentario vacío
        fireEvent.change(comentarioInput, { target: { value: '' } });
        fireEvent.click(submitButton);

        // Esperamos a que el mensaje de error se muestre
        const errorMessage = await screen.findByText('El comentario no puede estar vacío');
        expect(errorMessage).toBeInTheDocument();
    });

    it('no muestra un mensaje de error si el comentario no está vacío', async () => {
        const tareaId = 1;
        render(<ComentariosList tareaId={tareaId} />);

        const comentarioInput = screen.getByPlaceholderText('Escribe un comentario...');
        const submitButton = screen.getByText('Comentar');

        // Simulamos el envío de un comentario no vacío
        fireEvent.change(comentarioInput, { target: { value: 'Este es un comentario' } });
        fireEvent.click(submitButton);

        // Esperamos a que el mensaje de error no se muestre
        await waitFor(() => {
            const errorMessage = screen.queryByText('El comentario no puede estar vacío');
            expect(errorMessage).not.toBeInTheDocument();
        });
    });
});