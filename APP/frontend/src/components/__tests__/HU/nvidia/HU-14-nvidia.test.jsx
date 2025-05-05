// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/HU/nvidia/HU-14-nvidia.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ComentariosList from '../../../ComentariosList';
import api from '../../../../api';

vi.mock('../../../../api');

describe('HU-14: Editar comentarios', () => {
  const tareaId = 1;
  const comentarios = [
    { id: 1, texto: 'Comentario 1', usuario: 'Usuario 1' },
    { id: 2, texto: 'Comentario 2', usuario: 'Usuario 2' },
  ];

  const defaultProps = {
    tareaId,
    comentarios,
  };

  vi.mocked(api.get).mockResolvedValue({ data: comentarios });
  vi.mocked(api.put).mockResolvedValue({ status: 200 });

  it('El usuario debe poder editar un comentario de una tarea.', async () => {
    render(<ComentariosList {...defaultProps} />);
    const editarButton = await screen.findAllByText('Editar');
    expect(editarButton).toHaveLength(2);

    fireEvent.click(editarButton[0]);
    const textoInput = await screen.findByLabelText('texto');
    expect(textoInput).toBeInTheDocument();

    const nuevoTexto = 'Comentario editado';
    fireEvent.change(textoInput, { target: { value: nuevoTexto } });
    const guardarButton = await screen.findByText('Guardar');
    fireEvent.click(guardarButton);

    await waitFor(() => expect(api.put).toHaveBeenCalledTimes(1));
    expect(api.put).toHaveBeenCalledWith(`/api/comentarios/update/${comentarios[0].id}/`, {
      texto: nuevoTexto,
      tarea: tareaId,
    });
  });

  it('El comentario no debe estar vacio.', async () => {
    render(<ComentariosList {...defaultProps} />);
    const editarButton = await screen.findAllByText('Editar');
    fireEvent.click(editarButton[0]);
    const textoInput = await screen.findByLabelText('texto');
    fireEvent.change(textoInput, { target: { value: '' } });
    const guardarButton = await screen.findByText('Guardar');
    fireEvent.click(guardarButton);

    const errorMensaje = await screen.findByText('El comentario no puede estar vacío.');
    expect(errorMensaje).toBeInTheDocument();

    await waitFor(() => expect(api.put).not.toHaveBeenCalled());
  });

  it('El sistema debe mostrar un mensaje cuando se edite correctamente el comentario.', async () => {
    render(<ComentariosList {...defaultProps} />);
    const editarButton = await screen.findAllByText('Editar');
    fireEvent.click(editarButton[0]);
    const textoInput = await screen.findByLabelText('texto');
    const nuevoTexto = 'Comentario editado';
    fireEvent.change(textoInput, { target: { value: nuevoTexto } });
    const guardarButton = await screen.findByText('Guardar');
    fireEvent.click(guardarButton);

    const successMensaje = await screen.findByText('Comentario actualizado exitosamente');
    expect(successMensaje).toBeInTheDocument();
  });

  it('El sistema debe mostrar un mensaje de error cuando el comentario este vacio.', async () => {
    vi.mocked(api.put).mockRejectedValue({ response: { data: { detail: 'Error al actualizar el comentario' } } });
    render(<ComentariosList {...defaultProps} />);
    const editarButton = await screen.findAllByText('Editar');
    fireEvent.click(editarButton[0]);
    const textoInput = await screen.findByLabelText('texto');
    fireEvent.change(textoInput, { target: { value: '' } });
    const guardarButton = await screen.findByText('Guardar');
    fireEvent.click(guardarButton);

    const errorMensaje = await screen.findByText('Error al actualizar el comentario');
    expect(errorMensaje).toBeInTheDocument();
  });
});