// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/HU/gemini/HU-14-gemini.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ComentariosList from '../../../ComentariosList';
import api from '../../../../api';

vi.mock('../../../../api');

describe('HU-14: Editar comentarios', () => {
    it('El usuario debe poder editar un comentario de una tarea.', async () => {
        const mockComentarios = [
            { id: 1, texto: 'Comentario inicial', usuario: 'testUser', fecha_creacion: '2024-01-01T00:00:00Z' },
        ];
        api.get.mockResolvedValue({ data: mockComentarios });
        api.put.mockResolvedValue({ status: 200 });

        render(<ComentariosList tareaId={1} onClose={() => { }} />);

        await waitFor(() => screen.getByText('Comentario inicial'));

        const editButton = screen.getByRole('button', { name: /editar/i });
        fireEvent.click(editButton);

        const textarea = screen.getByRole('textbox');
        fireEvent.change(textarea, { target: { value: 'Comentario editado' } });

        const saveButton = screen.getByRole('button', { name: /guardar/i });
        fireEvent.click(saveButton);

        await waitFor(() => expect(api.put).toHaveBeenCalledWith('/api/comentarios/update/1/', {
            texto: 'Comentario editado',
            tarea: 1
        }));
    });

    it('El comentario no debe estar vacio.', async () => {
        const mockComentarios = [
            { id: 1, texto: 'Comentario inicial', usuario: 'testUser', fecha_creacion: '2024-01-01T00:00:00Z' },
        ];
        api.get.mockResolvedValue({ data: mockComentarios });

        render(<ComentariosList tareaId={1} onClose={() => { }} />);

        await waitFor(() => screen.getByText('Comentario inicial'));

        const editButton = screen.getByRole('button', { name: /editar/i });
        fireEvent.click(editButton);

        const textarea = screen.getByRole('textbox');
        fireEvent.change(textarea, { target: { value: ' ' } });

        const saveButton = screen.getByRole('button', { name: /guardar/i });
        fireEvent.click(saveButton);

        await waitFor(() => expect(screen.getByText('El comentario no puede estar vacío')).toBeVisible());
    });

    it('El sistema debe mostrar un mensaje cuando se edite correctamente el comentario.', async () => {
        const mockComentarios = [
            { id: 1, texto: 'Comentario inicial', usuario: 'testUser', fecha_creacion: '2024-01-01T00:00:00Z' },
        ];
        api.get.mockResolvedValue({ data: mockComentarios });
        api.put.mockResolvedValue({ status: 200 });

        render(<ComentariosList tareaId={1} onClose={() => { }} />);

        await waitFor(() => screen.getByText('Comentario inicial'));

        const editButton = screen.getByRole('button', { name: /editar/i });
        fireEvent.click(editButton);

        const textarea = screen.getByRole('textbox');
        fireEvent.change(textarea, { target: { value: 'Comentario editado' } });

        const saveButton = screen.getByRole('button', { name: /guardar/i });
        fireEvent.click(saveButton);
        expect(api.put).toHaveBeenCalled();
    });

    it('El sistema debe mostrar un mensaje de error cuando el comentario este vacio.', async () => {
         const mockComentarios = [
            { id: 1, texto: 'Comentario inicial', usuario: 'testUser', fecha_creacion: '2024-01-01T00:00:00Z' },
        ];
        api.get.mockResolvedValue({ data: mockComentarios });

        render(<ComentariosList tareaId={1} onClose={() => { }} />);

        await waitFor(() => screen.getByText('Comentario inicial'));

        const editButton = screen.getByRole('button', { name: /editar/i });
        fireEvent.click(editButton);

        const textarea = screen.getByRole('textbox');
        fireEvent.change(textarea, { target: { value: '  ' } });

        const saveButton = screen.getByRole('button', { name: /guardar/i });
        fireEvent.click(saveButton);

        await waitFor(() => expect(screen.getByText('El comentario no puede estar vacío')).toBeVisible());
    });
});