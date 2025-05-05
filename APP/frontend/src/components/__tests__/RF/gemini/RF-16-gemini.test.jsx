// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/RF/gemini/RF-16-gemini.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ComentariosList from '../../../ComentariosList';
import api from '../../../../api';

vi.mock('../../../../api');

describe('RF-16: Los usuarios podrán crear y editar comentarios.', () => {
    const tareaId = 1;

    it('Debería renderizar el componente ComentariosList', () => {
        render(<ComentariosList tareaId={tareaId} />);
        expect(screen.getByPlaceholderText('Escribe un comentario...')).toBeInTheDocument();
    });

    it('Debería permitir a los usuarios escribir un comentario', () => {
        render(<ComentariosList tareaId={tareaId} />);
        const textareaElement = screen.getByPlaceholderText('Escribe un comentario...');
        fireEvent.change(textareaElement, { target: { value: 'Este es un nuevo comentario' } });
        expect(textareaElement.value).toBe('Este es un nuevo comentario');
    });

    it('Debería llamar a la API al enviar un nuevo comentario', async () => {
        api.post.mockResolvedValue({ data: { id: 1, texto: 'Este es un nuevo comentario', tarea: tareaId } });

        render(<ComentariosList tareaId={tareaId} />);
        const textareaElement = screen.getByPlaceholderText('Escribe un comentario...');
        fireEvent.change(textareaElement, { target: { value: 'Este es un nuevo comentario' } });

        const submitButton = screen.getByText('Comentar');
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith(`/api/tareas/${tareaId}/comentarios/`, { texto: 'Este es un nuevo comentario', tarea: tareaId });
        });
    });

    it('Debería mostrar un error si el comentario está vacío', async () => {
        render(<ComentariosList tareaId={tareaId} />);
        const submitButton = screen.getByText('Comentar');
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText('El comentario no puede estar vacío')).toBeInTheDocument();
        });
    });

    it('Debería permitir a los usuarios eliminar un comentario', async () => {
        const comentarioId = 1;
        api.get.mockResolvedValue({ data: [{ id: comentarioId, texto: 'Comentario existente', tarea: tareaId, usuario: 'testuser', fecha_creacion: new Date() }] });
        api.delete.mockResolvedValue({});

        render(<ComentariosList tareaId={tareaId} />);

        await waitFor(() => {
            expect(screen.getByText('Comentario existente')).toBeInTheDocument();
        });
        
        const deleteButton = screen.getByRole('button', {name: /delete/i});
        
        vi.spyOn(window, 'confirm').mockImplementation(() => true);

        fireEvent.click(deleteButton);

        await waitFor(() => {
            expect(api.delete).toHaveBeenCalledWith(`/api/comentarios/delete/${comentarioId}/`);
        });

    });
        
    it('Debería permitir a los usuarios editar un comentario', async () => {
        const comentarioId = 1;
        api.get.mockResolvedValue({ data: [{ id: comentarioId, texto: 'Comentario existente', tarea: tareaId, usuario: 'testuser', fecha_creacion: new Date() }] });
        api.put.mockResolvedValue({});
    
        render(<ComentariosList tareaId={tareaId} />);
    
        await waitFor(() => {
            expect(screen.getByText('Comentario existente')).toBeInTheDocument();
        });
        
        const editButton = screen.getByRole('button', {name: /edit/i});
        fireEvent.click(editButton);
    
        const textareaElement = screen.getByDisplayValue('Comentario existente');
        fireEvent.change(textareaElement, { target: { value: 'Comentario editado' } });
    
        const saveButton = screen.getByText('Guardar');
        fireEvent.click(saveButton);
    
        await waitFor(() => {
            expect(api.put).toHaveBeenCalledWith(`/api/comentarios/update/${comentarioId}/`, { texto: 'Comentario editado', tarea: tareaId });
        });
    });
});