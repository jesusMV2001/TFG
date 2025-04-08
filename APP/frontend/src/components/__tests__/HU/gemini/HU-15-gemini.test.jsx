// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/HU/gemini/HU-15-gemini.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ComentariosList from '../../../ComentariosList';
import api from '../../../../api';

vi.mock('../../../../api');

describe('HU-15: Eliminar comentarios', () => {
  it('El usuario debe poder eliminar un comentario de una tarea.', async () => {
    const tareaId = 1;
    const comentarioId = 10;

    api.get.mockResolvedValue({ data: [{ id: comentarioId, texto: 'Comentario de prueba', usuario: 'testuser', fecha_creacion: new Date() }] });
    api.delete.mockResolvedValue({ status: 204 });

    render(<ComentariosList tareaId={tareaId} onClose={() => {}} />);

    await waitFor(() => screen.getByText('Comentario de prueba'));

    const deleteButton = screen.getByRole('button', {name: /eliminar/i});
    fireEvent.click(deleteButton);

    expect(api.delete).toHaveBeenCalledWith(`/api/comentarios/delete/${comentarioId}/`);
  });

  it('El sistema debe mostrar un mensaje cuando se elimine correctamente el comentario.', async () => {
    const tareaId = 1;
    const comentarioId = 10;
    const mockFetchComentarios = vi.fn().mockResolvedValue({ data: [] });

    api.get.mockResolvedValue({ data: [{ id: comentarioId, texto: 'Comentario de prueba', usuario: 'testuser', fecha_creacion: new Date() }] });
    api.delete.mockResolvedValue({ status: 204 });
    api.get.mockImplementation(mockFetchComentarios);

    render(<ComentariosList tareaId={tareaId} onClose={() => {}} />);

    await waitFor(() => screen.getByText('Comentario de prueba'));

    const deleteButton = screen.getByRole('button', {name: /eliminar/i});
    fireEvent.click(deleteButton);

    await waitFor(() => expect(api.get).toHaveBeenCalledTimes(2));
    expect(api.delete).toHaveBeenCalledWith(`/api/comentarios/delete/${comentarioId}/`);

  });

  it('Maneja errores al eliminar el comentario', async () => {
    const tareaId = 1;
    const comentarioId = 10;
    api.get.mockResolvedValue({ data: [{ id: comentarioId, texto: 'Comentario de prueba', usuario: 'testuser', fecha_creacion: new Date() }] });
    api.delete.mockRejectedValue(new Error('Error al eliminar el comentario'));

    render(<ComentariosList tareaId={tareaId} onClose={() => {}} />);

    await waitFor(() => screen.getByText('Comentario de prueba'));

    const deleteButton = screen.getByRole('button', {name: /eliminar/i});
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.getByText('Error al eliminar el comentario')).toBeInTheDocument();
    });

    expect(api.delete).toHaveBeenCalledWith(`/api/comentarios/delete/${comentarioId}/`);
  });

});