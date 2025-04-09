// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/HU/nvidia/HU-03-nvidia.test.jsx
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
    beforeEach(() => {
        render(
            <BrowserRouter>
                <TareaForm onAddTarea={vi.fn()} />
            </BrowserRouter>
        );
    });

    it('El usuario puede crear una tarea ingresando titulo, descripcion, fecha de vencimiento, prioridad y estado inicial.', async () => {
        const tituloInput = screen.getByPlaceholderText('Título');
        const descripcionInput = screen.getByPlaceholderText('Descripción');
        const fechaVencimientoInput = screen.getByPlaceholderText('Fecha de Vencimiento');
        const prioridadSelect = screen.getByRole('combobox', { name: 'Prioridad' });
        const estadoSelect = screen.getByRole('combobox', { name: 'Estado' });
        const submitButton = screen.getByRole('button', { name: 'Guardar Cambios' });

        fireEvent.change(tituloInput, { target: { value: 'Nueva Tarea' } });
        fireEvent.change(descripcionInput, { target: { value: 'Descripción de la tarea' } });
        fireEvent.change(fechaVencimientoInput, { target: { value: '2030-01-01' } });
        fireEvent.change(prioridadSelect, { target: { value: 'alta' } });
        fireEvent.change(estadoSelect, { target: { value: 'pendiente' } });

        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledTimes(1);
            expect(api.post).toHaveBeenCalledWith('/api/tareas/', expect.any(Object));
        });
    });

    it('El titulo, fecha de vencimiento y prioridad no pueden estar vacios.', async () => {
        const submitButton = screen.getByRole('button', { name: 'Guardar Cambios' });

        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.queryByText('El título es obligatorio.')).toBeInTheDocument();
            expect(screen.queryByText('La fecha de vencimiento es obligatoria.')).toBeInTheDocument();
            expect(screen.queryByText('La prioridad es obligatoria.')).toBeInTheDocument();
        });
    });

    it('La fecha de vencimiento no debe ser anterior a la fecha actual.', async () => {
        const fechaVencimientoInput = screen.getByPlaceholderText('Fecha de Vencimiento');
        const submitButton = screen.getByRole('button', { name: 'Guardar Cambios' });

        fireEvent.change(fechaVencimientoInput, { target: { value: '2020-01-01' } });

        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.queryByText('La fecha de vencimiento no puede ser anterior a la fecha actual.')).toBeInTheDocument();
        });
    });
});