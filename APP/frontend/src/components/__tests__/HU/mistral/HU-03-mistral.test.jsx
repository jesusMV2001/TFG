// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/HU/mistral/HU-03-mistral.test.jsx
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

describe('HU-03: Crear tarea', () => {
    it('debe permitir al usuario crear una tarea con título, descripción, fecha de vencimiento, prioridad y estado inicial', async () => {
        api.post.mockResolvedValue({ status: 201 });

        render(
            <BrowserRouter>
                <TareaForm onAddTarea={vi.fn()} />
            </BrowserRouter>
        );

        const tituloInput = screen.getByLabelText(/Título/i);
        const descripcionInput = screen.getByLabelText(/Descripción/i);
        const fechaVencimientoInput = screen.getByLabelText(/Fecha de Vencimiento/i);
        const prioridadSelect = screen.getByLabelText(/Prioridad/i);
        const estadoSelect = screen.getByLabelText(/Estado/i);

        fireEvent.change(tituloInput, { target: { value: 'Nueva Tarea' } });
        fireEvent.change(descripcionInput, { target: { value: 'Descripción de la tarea' } });
        fireEvent.change(fechaVencimientoInput, { target: { value: '2023-12-31' } });
        fireEvent.change(prioridadSelect, { target: { value: 'alta' } });
        fireEvent.change(estadoSelect, { target: { value: 'pendiente' } });

        fireEvent.submit(screen.getByText(/Guardar Cambios/i));

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith('/api/tareas/', {
                titulo: 'Nueva Tarea',
                descripcion: 'Descripción de la tarea',
                estado: 'pendiente',
                prioridad: 'alta',
                fecha_vencimiento: '2023-12-31',
                etiquetas: []
            });
        });
    });

    it('debe mostrar un error si el título está vacío', async () => {
        render(
            <BrowserRouter>
                <TareaForm onAddTarea={vi.fn()} />
            </BrowserRouter>
        );

        const tituloInput = screen.getByLabelText(/Título/i);
        const descripcionInput = screen.getByLabelText(/Descripción/i);
        const fechaVencimientoInput = screen.getByLabelText(/Fecha de Vencimiento/i);
        const prioridadSelect = screen.getByLabelText(/Prioridad/i);
        const estadoSelect = screen.getByLabelText(/Estado/i);

        fireEvent.change(tituloInput, { target: { value: '' } });
        fireEvent.change(descripcionInput, { target: { value: 'Descripción de la tarea' } });
        fireEvent.change(fechaVencimientoInput, { target: { value: '2023-12-31' } });
        fireEvent.change(prioridadSelect, { target: { value: 'alta' } });
        fireEvent.change(estadoSelect, { target: { value: 'pendiente' } });

        fireEvent.submit(screen.getByText(/Guardar Cambios/i));

        await waitFor(() => {
            expect(screen.getByText('The title cannot be empty.')).toBeInTheDocument();
        });
    });

    it('debe mostrar un error si la fecha de vencimiento está vacía', async () => {
        render(
            <BrowserRouter>
                <TareaForm onAddTarea={vi.fn()} />
            </BrowserRouter>
        );

        const tituloInput = screen.getByLabelText(/Título/i);
        const descripcionInput = screen.getByLabelText(/Descripción/i);
        const fechaVencimientoInput = screen.getByLabelText(/Fecha de Vencimiento/i);
        const prioridadSelect = screen.getByLabelText(/Prioridad/i);
        const estadoSelect = screen.getByLabelText(/Estado/i);

        fireEvent.change(tituloInput, { target: { value: 'Nueva Tarea' } });
        fireEvent.change(descripcionInput, { target: { value: 'Descripción de la tarea' } });
        fireEvent.change(fechaVencimientoInput, { target: { value: '' } });
        fireEvent.change(prioridadSelect, { target: { value: 'alta' } });
        fireEvent.change(estadoSelect, { target: { value: 'pendiente' } });

        fireEvent.submit(screen.getByText(/Guardar Cambios/i));

        await waitFor(() => {
            expect(screen.getByText('The due date cannot be empty.')).toBeInTheDocument();
        });
    });

    it('debe mostrar un error si la fecha de vencimiento es anterior a la fecha actual', async () => {
        render(
            <BrowserRouter>
                <TareaForm onAddTarea={vi.fn()} />
            </BrowserRouter>
        );

        const tituloInput = screen.getByLabelText(/Título/i);
        const descripcionInput = screen.getByLabelText(/Descripción/i);
        const fechaVencimientoInput = screen.getByLabelText(/Fecha de Vencimiento/i);
        const prioridadSelect = screen.getByLabelText(/Prioridad/i);
        const estadoSelect = screen.getByLabelText(/Estado/i);

        fireEvent.change(tituloInput, { target: { value: 'Nueva Tarea' } });
        fireEvent.change(descripcionInput, { target: { value: 'Descripción de la tarea' } });
        fireEvent.change(fechaVencimientoInput, { target: { value: '2020-01-01' } });
        fireEvent.change(prioridadSelect, { target: { value: 'alta' } });
        fireEvent.change(estadoSelect, { target: { value: 'pendiente' } });

        fireEvent.submit(screen.getByText(/Guardar Cambios/i));

        await waitFor(() => {
            expect(screen.getByText('The due date cannot be less than the current date.')).toBeInTheDocument();
        });
    });
});