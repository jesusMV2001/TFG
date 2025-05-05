// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/HU/nvidia/HU-13-nvidia.test.jsx
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

describe('HU-13: Crear comentarios', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('Cada tarea debe contar con un espacio para que los usuarios anadan comentarios', async () => {
        render(
            <BrowserRouter>
                <ComentariosList tareaId={1} />
            </BrowserRouter>
        );
        
        await waitFor(() => expect(screen.getByPlaceholderText('Escribe un comentario...')).toBeInTheDocument());
    });

    it('El comentario no debe estar vacio', async () => {
        render(
            <BrowserRouter>
                <ComientosList tareaId={1} />
            </BrowserRouter>
        );
        
        const comentarioInput = await screen.findByPlaceholderText('Escribe un comentario...');
        const comentarioButton = await screen.findByText('Comentar');
        
        fireEvent.change(comentarioInput, { target: { value: '' } });
        fireEvent.click(comentarioButton);
        
        await waitFor(() => expect(screen.getByText('El comentario no puede estar vacío')).toBeInTheDocument());
    });

    it('El sistema debe mostrar el comentario cuando se cree', async () => {
        const comentarMock = vi.fn(() => Promise.resolve({ data: { texto: 'Comentario de prueba', userid: 1 } }));
        api.post.mockResolvedValueOnce({ status: 201, data: { texto: 'Comentario de prueba', userid: 1 } });
        
        render(
            <BrowserRouter>
                <ComentariosList tareaId={1} />
            </BrowserRouter>
        );
        
        const comentarioInput = await screen.findByPlaceholderText('Escribe un comentario...');
        const comentarioButton = await screen.findByText('Comentar');
        
        fireEvent.change(comentarioInput, { target: { value: 'Comentario de prueba' } });
        fireEvent.click(comentarioButton);
        
        await waitFor(() => expect(screen.getByText('Comentario de prueba')).toBeInTheDocument());
    });

    it('El sistema debe mostrar un mensaje de error cuando el comentario este vacio', async () => {
        api.post.mockRejectedValueOnce({ response: { data: { detail: 'Error al crear el comentario' } } });
        
        render(
            <BrowserRouter>
                <ComentariosList tareaId={1} />
            </BrowserRouter>
        );
        
        const comentarioInput = await screen.findByPlaceholderText('Escribe un comentario...');
        const comentarioButton = await screen.findByText('Comentar');
        
        fireEvent.change(comentarioInput, { target: { value: '' } });
        fireEvent.click(comentarioButton);
        
        await waitFor(() => expect(screen.getByText('El comentario no puede estar vacío')).toBeInTheDocument());
    });
});