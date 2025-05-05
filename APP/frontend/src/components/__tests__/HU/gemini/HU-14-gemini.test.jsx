// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/HU/gemini/HU-14-gemini.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ComentariosList from '../../../ComentariosList';
import api from '../../../../api';

vi.mock('../../../../api');

describe('HU-14: Editar comentarios', () => {
  const tareaId = 1;
  const mockComentarios = [
    { id: 1, texto: 'Comentario original', usuario: 'testuser', fecha_creacion: '2024-01-01T12:00:00Z' },
  ];

  it('El usuario debe poder editar un comentario de una tarea', async () => {
    api.get.mockResolvedValue({ data: mockComentarios });
    api.put.mockResolvedValue({ status: 200 });

    render(<ComentariosList tareaId={tareaId} />);

    await waitFor(() => expect(api.get).toHaveBeenCalledWith(`/api/tareas/${tareaId}/comentarios/`));

    const editButton = screen.getByText('Editar');
    fireEvent.click(editButton);

    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Comentario editado' } });

    const saveButton = screen.getByText('Guardar');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(api.put).toHaveBeenCalledWith(`/api/comentarios/update/1/`, {
        texto: 'Comentario editado',
        tarea: tareaId,
      });
    });
  });

  it('El comentario no debe estar vacio', async () => {
    api.get.mockResolvedValue({ data: mockComentarios });

    render(<ComentariosList tareaId={tareaId} />);

    await waitFor(() => expect(api.get).toHaveBeenCalledWith(`/api/tareas/${tareaId}/comentarios/`));

    const editButton = screen.getByText('Editar');
    fireEvent.click(editButton);

    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: '  ' } });

    const saveButton = screen.getByText('Guardar');
    fireEvent.click(saveButton);

    await waitFor(() => {
        expect(screen.getByText("El comentario no puede estar vacío")).toBeVisible();
    });
  });

  it('El sistema debe mostrar un mensaje cuando se edite correctamente el comentario.', async () => {
        api.get.mockResolvedValue({ data: mockComentarios });
        api.put.mockResolvedValue({ status: 200 });

        render(<ComentariosList tareaId={tareaId} />);

        await waitFor(() => expect(api.get).toHaveBeenCalledWith(`/api/tareas/${tareaId}/comentarios/`));

        const editButton = screen.getByText('Editar');
        fireEvent.click(editButton);

        const textarea = screen.getByRole('textbox');
        fireEvent.change(textarea, { target: { value: 'Comentario editado' } });

        const saveButton = screen.getByText('Guardar');
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(api.put).toHaveBeenCalledWith(`/api/comentarios/update/1/`, {
                texto: 'Comentario editado',
                tarea: tareaId,
            });
        });
  });
    
    it('El sistema debe mostrar un mensaje de error cuando el comentario este vacio.', async () => {
        api.get.mockResolvedValue({ data: mockComentarios });

        render(<ComentariosList tareaId={tareaId} />);

        await waitFor(() => expect(api.get).toHaveBeenCalledWith(`/api/tareas/${tareaId}/comentarios/`));

        const editButton = screen.getByText('Editar');
        fireEvent.click(editButton);

        const textarea = screen.getByRole('textbox');
        fireEvent.change(textarea, { target: { value: '  ' } });

        const saveButton = screen.getByText('Guardar');
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(screen.getByText("El comentario no puede estar vacío")).toBeVisible();
        });
    });
});