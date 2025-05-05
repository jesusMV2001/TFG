// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/RF/nvidia/RF-12-nvidia.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Tarea from '../../../Tarea';
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

const tareaMock = {
    id: 1,
    titulo: "Tarea de Ejemplo",
    descripcion: "Esta es una tarea de ejemplo",
    estado: "pendiente",
    prioridad: "media",
    fecha_vencimiento: "2024-03-20",
    etiquetas: [{ id: 1, nombre: "Ejemplo" }]
};

const historialMock = [
    { id: 1, accion: "Creación de tarea", usuario: "Usuario de Ejemplo", fecha_cambio: "2024-03-15" },
    { id: 2, accion: "Edición de tarea", usuario: "Usuario de Ejemplo", fecha_cambio: "2024-03-16" },
    { id: 3, accion: "Cambio de estado a En Progreso", usuario: "Usuario de Ejemplo", fecha_cambio: "2024-03-17" }
];

describe('RF-12 - Registro de acciones sobre tareas', () => {
    it('should display task creation in history', async () => {
        // Mock API responses
        vi.spyOn(api, 'get').mockImplementation((url) => {
            if (url.includes(`tareas/${tareaMock.id}/historial/`)) {
                return Promise.resolve({ data: historialMock });
            }
        });

        // Render Tarea component with historial view
        render(
            <BrowserRouter>
                <Tarea
                    tarea={tareaMock}
                    onDelete={() => {}}
                    onUpdate={() => {}}
                    onDragStart={() => {}}
                />
            </BrowserRouter>
        );

        // Open detalles modal
        const detallesButton = screen.getByText('Ver Detalles');
        fireEvent.click(detallesButton);

        // Wait for historial to be loaded
        await waitFor(() => screen.getByText('Historial de Cambios'));

        // Check if creation action is displayed in historial
        expect(screen.getByText('Creación de tarea')).toBeInTheDocument();
    });

    it('should display task edition in history', async () => {
        // Mock API responses
        vi.spyOn(api, 'get').mockImplementation((url) => {
            if (url.includes(`tareas/${tareaMock.id}/historial/`)) {
                return Promise.resolve({ data: historialMock });
            }
        });

        // Render Tarea component with historial view
        render(
            <BrowserRouter>
                <Tarea
                    tarea={tareaMock}
                    onDelete={() => {}}
                    onUpdate={() => {}}
                    onDragStart={() => {}}
                />
            </BrowserRouter>
        );

        // Open detalles modal
        const detallesButton = screen.getByText('Ver Detalles');
        fireEvent.click(detallesButton);

        // Wait for historial to be loaded
        await waitFor(() => screen.getByText('Historial de Cambios'));

        // Check if edition action is displayed in historial
        expect(screen.getByText('Edición de tarea')).toBeInTheDocument();
    });

    it('should display state change in history', async () => {
        // Mock API responses
        vi.spyOn(api, 'get').mockImplementation((url) => {
            if (url.includes(`tareas/${tareaMock.id}/historial/`)) {
                return Promise.resolve({ data: historialMock });
            }
        });

        // Render Tarea component with historial view
        render(
            <BrowserRouter>
                <Tarea
                    tarea={tareaMock}
                    onDelete={() => {}}
                    onUpdate={() => {}}
                    onDragStart={() => {}}
                />
            </BrowserRouter>
        );

        // Open detalles modal
        const detallesButton = screen.getByText('Ver Detalles');
        fireEvent.click(detallesButton);

        // Wait for historial to be loaded
        await waitFor(() => screen.getByText('Historial de Cambios'));

        // Check if state change action is displayed in historial
        expect(screen.getByText('Cambio de estado a En Progreso')).toBeInTheDocument();
    });

    it('should register new comment as action in history', async () => {
        // Mock API responses
        const newComment = { id: 4, texto: "Nuevo comentario", usuario: "Usuario de Ejemplo" };
        const updatedHistorial = [...historialMock, { id: 4, accion: "Nuevo comentario", usuario: "Usuario de Ejemplo", fecha_cambio: "2024-03-20" }];

        vi.spyOn(api, 'get').mockImplementation((url) => {
            if (url.includes(`tareas/${tareaMock.id}/historial/`)) {
                return Promise.resolve({ data: updatedHistorial });
            }
            if (url.includes(`tareas/${tareaMock.id}/comentarios/`)) {
                return Promise.resolve({ data: [newComment] });
            }
        });

        vi.spyOn(api, 'post').mockImplementation((url, data) => {
            if (url.includes(`tareas/${tareaMock.id}/comentarios/`)) {
                return Promise.resolve({ data: newComment });
            }
        });

        // Render Tarea component with comentarios view
        render(
            <BrowserRouter>
                <Tarea
                    tarea={tareaMock}
                    onDelete={() => {}}
                    onUpdate={() => {}}
                    onDragStart={() => {}}
                />
            </BrowserRouter>
        );

        // Open comentarios modal
        const comentariosButton = screen.getByText('Ver Comentarios');
        fireEvent.click(comentariosButton);

        // Wait for comentarios to be loaded
        await waitFor(() => screen.getByText('Comentarios'));

        // Create new comment
        const comentariosList = screen.getByTestId('comentarios-list');
        const textarea = comentariosList.querySelector('textarea');
        const submitButton = comentariosList.querySelector('button[type="submit"]');

        fireEvent.change(textarea, { target: { value: newComment.texto } });
        fireEvent.click(submitButton);

        // Wait for new comment to be registered
        await waitFor(() => screen.getByText(newComment.texto));

        // Open detalles modal to check historial
        const detallesButton = screen.getByText('Ver Detalles');
        fireEvent.click(detallesButton);

        // Wait for historial to be loaded
        await waitFor(() => screen.getByText('Historial de Cambios'));

        // Check if new comment is registered in historial
        expect(screen.getByText('Nuevo comentario')).toBeInTheDocument();
    });
});