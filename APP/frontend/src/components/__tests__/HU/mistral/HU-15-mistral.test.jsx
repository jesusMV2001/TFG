// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/HU/mistral/HU-15-mistral.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ComentariosList from '../../../../components/ComentariosList';
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

describe('HU-15: Eliminar comentarios', () => {
    it('El usuario debe poder eliminar un comentario de una tarea', async () => {
        const tareaId = 1;
        const comentarioId = 1;
        const comentarios = [
            { id: comentarioId, texto: 'Comentario a eliminar', usuario: 'Usuario1', fecha_creacion: '2023-10-01T00:00:00Z' },
            { id: 2, texto: 'Otro comentario', usuario: 'Usuario2', fecha_creacion: '2023-10-02T00:00:00Z' }
        ];

        api.get.mockResolvedValue({ data: comentarios });
        api.delete.mockResolvedValue({ status: 200 });

        render(
            <BrowserRouter>
                <ComentariosList tareaId={tareaId} />
            </BrowserRouter>
        );

        // Esperar a que los comentarios se carguen
        await waitFor(() => {
            expect(screen.getByText('Comentario a eliminar')).toBeInTheDocument();
        });

        // Simular la eliminación del comentario
        fireEvent.click(screen.getAllByRole('button', { name: /Eliminar/i })[0]);

        // Confirmar la eliminación
        window.confirm = () => true;

        // Esperar a que el comentario se elimine
        await waitFor(() => {
            expect(screen.queryByText('Comentario a eliminar')).not.toBeInTheDocument();
        });
    });

    it('El sistema debe mostrar un mensaje cuando se elimine correctamente el comentario', async () => {
        const tareaId = 1;
        const comentarioId = 1;
        const comentarios = [
            { id: comentarioId, texto: 'Comentario a eliminar', usuario: 'Usuario1', fecha_creacion: '2023-10-01T00:00:00Z' },
            { id: 2, texto: 'Otro comentario', usuario: 'Usuario2', fecha_creacion: '2023-10-02T00:00:00Z' }
        ];

        api.get.mockResolvedValue({ data: comentarios });
        api.delete.mockResolvedValue({ status: 200 });

        render(
            <BrowserRouter>
                <ComentariosList tareaId={tareaId} />
            </BrowserRouter>
        );

        // Esperar a que los comentarios se carguen
        await waitFor(() => {
            expect(screen.getByText('Comentario a eliminar')).toBeInTheDocument();
        });

        // Simular la eliminación del comentario
        fireEvent.click(screen.getAllByRole('button', { name: /Eliminar/i })[0]);

        // Confirmar la eliminación
        window.confirm = () => true;

        // Esperar a que el mensaje de éxito se muestre
        await waitFor(() => {
            expect(screen.getByText('Comentario eliminado exitosamente')).toBeInTheDocument();
        });
    });
});