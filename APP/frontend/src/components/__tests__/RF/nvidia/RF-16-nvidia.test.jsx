// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/RF/nvidia/RF-16-nvidia.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ComentariosList from '../../../ComentariosList';
import api from '../../../../api';
import { BrowserRouter } from 'react-router-dom';

vi.mock('../../../../api');
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => vi.fn(),
    };
});

vi.mock('../../../../api', () => ({
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
}));

describe('RF-16 - Crear y editar comentarios', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('Debe renderizar el formulario para crear un nuevo comentario', async () => {
        // Mockear la respuesta de la API para obtener comentarios
        api.get.mockResolvedValueOnce({
            data: [],
        });

        // Renderizar el componente ComentariosList
        render(
            <BrowserRouter>
                <ComentariosList tareaId={1} />
            </BrowserRouter>
        );

        // Verificar que el formulario esté presente
        expect(screen.getByPlaceholderText('Escribe un comentario...')).toBeInTheDocument();
    });

    it('Debe crear un nuevo comentario al enviar el formulario', async () => {
        // Mockear la respuesta de la API para obtener comentarios
        api.get.mockResolvedValueOnce({
            data: [],
        });

        // Mockear la respuesta de la API para crear un comentario
        api.post.mockResolvedValueOnce({
            data: {
                id: 1,
                texto: 'Nuevo comentario',
                usuario: 'Usuario de prueba',
            },
        });

        // Renderizar el componente ComentariosList
        render(
            <BrowserRouter>
                <ComentariosList tareaId={1} />
            </BrowserRouter>
        );

        // Rellenar el formulario con un comentario
        const textarea = screen.getByPlaceholderText('Escribe un comentario...');
        fireEvent.change(textarea, { target: { value: 'Nuevo comentario' } });

        // Enviar el formulario
        const btnEnviar = screen.getByText('Comentar');
        fireEvent.click(btnEnviar);

        // Verificar que se haya llamado a la API para crear el comentario
        await waitFor(() => expect(api.post).toHaveBeenCalledTimes(1));
        expect(api.post).toHaveBeenCalledWith('/api/tareas/1/comentarios/', expect.anything());
    });

    it('Debe editar un comentario existente al guardar los cambios', async () => {
        // Mockear la respuesta de la API para obtener comentarios
        api.get.mockResolvedValueOnce({
            data: [
                {
                    id: 1,
                    texto: 'Comentario existente',
                    usuario: 'Usuario de prueba',
                },
            ],
        });

        // Mockear la respuesta de la API para editar un comentario
        api.put.mockResolvedValueOnce({
            data: {
                id: 1,
                texto: 'Comentario editado',
                usuario: 'Usuario de prueba',
            },
        });

        // Renderizar el componente ComentariosList
        render(
            <BrowserRouter>
                <ComentariosList tareaId={1} />
            </BrowserRouter>
        );

        // EDITAR un comentario
        const editButton = screen.getAllByText('')[0]; // Revisar el texto del botón editar
        fireEvent.click(editButton);

        // Rellenar el formulario con el nuevo texto
        const textarea = screen.getByDisplayValue('Comentario existente');
        fireEvent.change(textarea, { target: { value: 'Comentario editado' } });

        // Guardar los cambios
        const btnSave = screen.getByText('Guardar');
        fireEvent.click(btnSave);

        // Verificar que se haya llamado a la API para editar el comentario
        await waitFor(() => expect(api.put).toHaveBeenCalledTimes(1));
        expect(api.put).toHaveBeenCalledWith('/api/comentarios/update/1/', expect.anything());
    });

    it('Debe eliminar un comentario existente al presionar el botón eliminar', async () => {
        // Mockear la respuesta de la API para obtener comentarios
        api.get.mockResolvedValueOnce({
            data: [
                {
                    id: 1,
                    texto: 'Comentario existente',
                    usuario: 'Usuario de prueba',
                },
            ],
        });

        // Mockear la respuesta de la API para eliminar un comentario
        api.delete.mockResolvedValueOnce({
            status: 204,
        });

        // Renderizar el componente ComentariosList
        render(
            <BrowserRouter>
                <ComentariosList tareaId={1} />
            </BrowserRouter>
        );

        // Eliminar un comentario
        const deleteButton = screen.getAllByText('')[0]; // Revisar el texto del botón eliminar
        fireEvent.click(deleteButton);

        // Verificar el diálogo de confirmación
        const confirmDialog = screen.getByRole('alertdialog');
        expect(confirmDialog).toBeInTheDocument();

        // Confirmar la eliminación
        const confirmButton = screen.getByText('σία');
        fireEvent.click(confirmButton);

        // Verificar que se haya llamado a la API para eliminar el comentario
        await waitFor(() => expect(api.delete).toHaveBeenCalledTimes(1));
        expect(api.delete).toHaveBeenCalledWith('/api/comentarios/delete/1/');
    });
});