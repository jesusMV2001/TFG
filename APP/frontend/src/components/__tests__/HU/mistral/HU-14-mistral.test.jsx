// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/HU/mistral/HU-14-mistral.test.jsx
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

describe('HU-14: Editar comentarios', () => {
    const tareaId = 1;
    const comment = { id: 1, texto: 'Comentario de prueba', usuario: 'Usuario1', fecha_creacion: '2023-10-01T12:00:00Z' };

    beforeEach(() => {
        api.get.mockResolvedValue({ data: [comment] });
        api.put.mockResolvedValue({});
    });

    it('El usuario debe poder editar un comentario de una tarea.', async () => {
        render(
            <BrowserRouter>
                <ComentariosList tareaId={tareaId} />
            </BrowserRouter>
        );

        // Simular la edición de un comentario
        fireEvent.click(screen.getByText('Editar'));
        fireEvent.change(screen.getByPlaceholderText('Escribe un comentario...'), { target: { value: 'Comentario editado' } });
        fireEvent.click(screen.getByText('Guardar'));

        await waitFor(() => {
            expect(api.put).toHaveBeenCalledWith(`/api/comentarios/update/${comment.id}/`, {
                texto: 'Comentario editado',
                tarea: tareaId
            });
        });
    });

    it('El comentario no debe estar vacio.', async () => {
        render(
            <BrowserRouter>
                <ComentariosList tareaId={tareaId} />
            </BrowserRouter>
        );

        // Simular la edición de un comentario con texto vacío
        fireEvent.click(screen.getByText('Editar'));
        fireEvent.change(screen.getByPlaceholderText('Escribe un comentario...'), { target: { value: '' } });
        fireEvent.click(screen.getByText('Guardar'));

        await waitFor(() => {
            expect(screen.getByText('El comentario no puede estar vacío')).toBeInTheDocument();
        });
    });

    it('El sistema debe mostrar un mensaje cuando se edite correctamente el comentario.', async () => {
        render(
            <BrowserRouter>
                <ComentariosList tareaId={tareaId} />
            </BrowserRouter>
        );

        // Simular la edición de un comentario
        fireEvent.click(screen.getByText('Editar'));
        fireEvent.change(screen.getByPlaceholderText('Escribe un comentario...'), { target: { value: 'Comentario editado' } });
        fireEvent.click(screen.getByText('Guardar'));

        await waitFor(() => {
            expect(api.put).toHaveBeenCalledWith(`/api/comentarios/update/${comment.id}/`, {
                texto: 'Comentario editado',
                tarea: tareaId
            });
        });
    });

    it('El sistema debe mostrar un mensaje de error cuando el comentario este vacio.', async () => {
        render(
            <BrowserRouter>
                <ComentariosList tareaId={tareaId} />
            </BrowserRouter>
        );

        // Simular la edición de un comentario con texto vacío
        fireEvent.click(screen.getByText('Editar'));
        fireEvent.change(screen.getByPlaceholderText('Escribe un comentario...'), { target: { value: '' } });
        fireEvent.click(screen.getByText('Guardar'));

        await waitFor(() => {
            expect(screen.getByText('El comentario no puede estar vacío')).toBeInTheDocument();
        });
    });
});