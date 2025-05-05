// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/HU/mistral/HU-05-mistral.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TareaForm from '../../../TareaForm';
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

describe('HU-05: Editar tarea', () => {
    const initialData = {
        id: 1,
        titulo: 'Tarea de ejemplo',
        descripcion: 'Descripción de ejemplo',
        estado: 'pendiente',
        prioridad: 'media',
        fecha_vencimiento: '2023-12-31',
        etiquetas: [],
    };

    const updatedData = {
        id: 1,
        titulo: 'Tarea modificada',
        descripcion: 'Descripción modificada',
        estado: 'en_progreso',
        prioridad: 'alta',
        fecha_vencimiento: '2024-01-01',
        etiquetas: [],
    };

    it('El usuario debe poder modificar cualquier campo de una tarea existente y guardar los cambios.', async () => {
        api.post.mockResolvedValue({ data: updatedData });

        render(
            <BrowserRouter>
                <TareaForm initialData={initialData} onAddTarea={vi.fn()} />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByLabelText(/Título/), { target: { value: updatedData.titulo } });
        fireEvent.change(screen.getByLabelText(/Descripción/), { target: { value: updatedData.descripcion } });
        fireEvent.change(screen.getByLabelText(/Estado/), { target: { value: updatedData.estado } });
        fireEvent.change(screen.getByLabelText(/Prioridad/), { target: { value: updatedData.prioridad } });
        fireEvent.change(screen.getByLabelText(/Fecha de Vencimiento/), { target: { value: updatedData.fecha_vencimiento } });

        fireEvent.submit(screen.getByText(/Guardar Cambios/));

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith(expect.any(String), expect.objectContaining(updatedData));
        });
    });

    it('El sistema debe mostrar un mensaje si se ha modificado la tarea.', async () => {
        api.post.mockResolvedValue({ data: updatedData });

        render(
            <BrowserRouter>
                <TareaForm initialData={initialData} onAddTarea={vi.fn()} />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByLabelText(/Título/), { target: { value: updatedData.titulo } });
        fireEvent.change(screen.getByLabelText(/Descripción/), { target: { value: updatedData.descripcion } });
        fireEvent.change(screen.getByLabelText(/Estado/), { target: { value: updatedData.estado } });
        fireEvent.change(screen.getByLabelText(/Prioridad/), { target: { value: updatedData.prioridad } });
        fireEvent.change(screen.getByLabelText(/Fecha de Vencimiento/), { target: { value: updatedData.fecha_vencimiento } });

        fireEvent.submit(screen.getByText(/Guardar Cambios/));

        await waitFor(() => {
            expect(screen.getByText(/Tarea creada exitosamente/)).toBeInTheDocument();
        });
    });

    it('En caso de error, el sistema debe mostrar un mensaje de error.', async () => {
        api.post.mockRejectedValue({ response: { data: { error: 'Error al crear la tarea' } } });

        render(
            <BrowserRouter>
                <TareaForm initialData={initialData} onAddTarea={vi.fn()} />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByLabelText(/Título/), { target: { value: updatedData.titulo } });
        fireEvent.change(screen.getByLabelText(/Descripción/), { target: { value: updatedData.descripcion } });
        fireEvent.change(screen.getByLabelText(/Estado/), { target: { value: updatedData.estado } });
        fireEvent.change(screen.getByLabelText(/Prioridad/), { target: { value: updatedData.prioridad } });
        fireEvent.change(screen.getByLabelText(/Fecha de Vencimiento/), { target: { value: updatedData.fecha_vencimiento } });

        fireEvent.submit(screen.getByText(/Guardar Cambios/));

        await waitFor(() => {
            expect(screen.getByText(/Error al crear la tarea/)).toBeInTheDocument();
        });
    });
});