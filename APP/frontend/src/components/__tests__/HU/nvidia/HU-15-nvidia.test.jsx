// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/HU/nvidia/HU-15-nvidia.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ComentariosList from '../../../ComentariosList';
import api from '../../../../api';

vi.mock('../../../../api');

describe('HU-15: Eliminar comentarios', () => {
  it('El usuario debe poder eliminar un comentario de una tarea', async () => {
    // Mockear la respuesta de la API para obtener comentarios
    const comentariosMock = [
      { id: 1, texto: 'Comentario 1', tarea: 1 },
      { id: 2, texto: 'Comentario 2', tarea: 1 },
    ];
    vi.mocked(api.get).mockResolvedValueOnce({ data: comentariosMock });

    // Mockear la respuesta de la API para eliminar un comentario
    vi.mocked(api.delete).mockResolvedValueOnce({ status: 200 });

    // Renderizar el componente ComentariosList
    const { container } = render(<ComentariosList tareaId={1} />);
    await waitFor(() => screen.getByText('Comentario 1'));
    await waitFor(() => screen.getByText('Comentario 2'));

    // Simular el clic en el botón de eliminar comentario
    const eliminarBoton = screen.getAllByRole('button', { name: 'Eliminar' })[0];
    fireEvent.click(eliminarBoton);

    // Verificar que el comentario se eliminó de la lista
    await waitFor(() => expect(screen.queryByText('Comentario 1')).not.toBeInTheDocument());
  });

  it('El sistema debe mostrar un mensaje cuando se elimine correctamente el comentario', async () => {
    // Mockear la respuesta de la API para obtener comentarios
    const comentariosMock = [
      { id: 1, texto: 'Comentario 1', tarea: 1 },
      { id: 2, texto: 'Comentario 2', tarea: 1 },
    ];
    vi.mocked(api.get).mockResolvedValueOnce({ data: comentariosMock });

    // Mockear la respuesta de la API para eliminar un comentario
    vi.mocked(api.delete).mockResolvedValueOnce({ status: 200, data: { message: 'Comentario eliminado correctamente' } });

    // Renderizar el componente ComentariosList
    const { container } = render(<ComentariosList tareaId={1} />);
    await waitFor(() => screen.getByText('Comentario 1'));
    await waitFor(() => screen.getByText('Comentario 2'));

    // Simular el clic en el botón de eliminar comentario
    const eliminarBoton = screen.getAllByRole('button', { name: 'Eliminar' })[0];
    fireEvent.click(eliminarBoton);

    // Verificar que se muestre el mensaje de éxito
    await waitFor(() => expect(screen.getByText('Comentario eliminado correctamente')).toBeInTheDocument());
  });
});