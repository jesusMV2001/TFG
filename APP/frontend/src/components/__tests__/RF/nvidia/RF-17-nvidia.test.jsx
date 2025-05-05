// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/RF/nvidia/RF-17-nvidia.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ComentariosList from '../../../ComentariosList';
import api from '../../../../api';

vi.mock('../../../../api');

describe('RF-17: Comentario vacío muestra mensaje de error', () => {
  it('Muestra error cuando se envía un comentario vacío', async () => {
    // Configuración de la API mockeada
    const errorResponse = { detail: 'El comentario no puede estar vacío' };
    vi.mocked(api.post).mockRejectedValueOnce({ response: { data: errorResponse } });

    // Renderizar el componente ComentariosList
    render(<ComentariosList tareaId={1} />);

    // Encontrar el formulario de comentarios
    const comentarioInput = await screen.findByPlaceholderText('Escribe un comentario...');
    const comentarioForm = comentarioInput.closest('form');

    // Enviar el formulario vacío
    fireEvent.submit(comentarioForm);

    // Esperar a que aparezca el mensaje de error
    const errorMessage = await screen.findByText('El comentario no puede estar vacío');
    expect(errorMessage).toBeInTheDocument();
  });

  it('No muestra error cuando se envía un comentario no vacío', async () => {
    // Configuración de la API mockeada con éxito
    const successResponse = { message: 'Comentario creado exitosamente' };
    vi.mocked(api.post).mockResolvedValueOnce({ data: successResponse });

    // Renderizar el componente ComentariosList
    render(<ComentariosList tareaId={1} />);

    // Encontrar el formulario de comentarios
    const comentarioInput = await screen.findByPlaceholderText('Escribe un comentario...');
    const comentarioForm = comentarioInput.closest('form');

    // Enviar el formulario con un comentario no vacío
    fireEvent.change(comentarioInput, { target: { value: 'Un comentario ejemplo' } });
    fireEvent.submit(comentarioForm);

    // Esperar a que no aparezca ningún mensaje de error
    await waitFor(() => expect(screen.queryByText('El comentario no puede estar vacío')).not.toBeInTheDocument());
  });
});