// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/HU/gemini/HU-15-gemini.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ComentariosList from '../../../ComentariosList';
import api from '../../../../api';

vi.mock('../../../../api');

describe('HU-15: Eliminar comentarios', () => {
    it('El usuario debe poder eliminar un comentario de una tarea.', async () => {
        const tareaId = 1;
        const comentarioId = 1;
        const comentarios = [{ id: comentarioId, texto: 'Comentario de prueba', usuario: 'testuser', fecha_creacion: new Date() }];

        api.get.mockResolvedValue({ data: comentarios });
        api.delete.mockResolvedValue({});

        render(<ComentariosList tareaId={tareaId} />);

        await waitFor(() => expect(api.get).toHaveBeenCalledWith(`/api/tareas/${tareaId}/comentarios/`));

        const deleteButton = screen.getByRole('button', {
            name: /eliminar/i
        });

        fireEvent.click(deleteButton);

        expect(window.confirm).toHaveBeenCalled();

        await waitFor(() => expect(api.delete).toHaveBeenCalledWith(`/api/comentarios/delete/${comentarioId}/`));
    });

    it('El sistema debe mostrar un mensaje cuando se elimine correctamente el comentario.', async () => {
        const tareaId = 1;
        const comentarioId = 1;
        const comentarios = [{ id: comentarioId, texto: 'Comentario de prueba', usuario: 'testuser', fecha_creacion: new Date() }];

        api.get.mockResolvedValue({ data: comentarios });
        api.delete.mockResolvedValue({});
        window.confirm = vi.fn(() => true);
        const consoleLogSpy = vi.spyOn(console, 'log');
        consoleLogSpy.mockImplementation(() => {});

        render(<ComentariosList tareaId={tareaId} />);

        await waitFor(() => expect(api.get).toHaveBeenCalledWith(`/api/tareas/${tareaId}/comentarios/`));

        const deleteButton = screen.getByRole('button', {
            name: /eliminar/i
        });

        fireEvent.click(deleteButton);

        expect(window.confirm).toHaveBeenCalled();

        await waitFor(() => expect(api.delete).toHaveBeenCalledWith(`/api/comentarios/delete/${comentarioId}/`));
        consoleLogSpy.mockRestore();
    });
});