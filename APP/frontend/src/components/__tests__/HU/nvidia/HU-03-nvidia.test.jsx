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

describe('HU-03 - Crear tarea', () => {
    beforeEach(() => {
        render(
            <BrowserRouter>
                <TareaForm onAddTarea={vi.fn()} />
            </BrowserRouter>
        );
    });

    it('renders form with required fields', () => {
        expect(screen.getByLabelText('Título')).toBeInTheDocument();
        expect(screen.getByLabelText('Descripción')).toBeInTheDocument();
        expect(screen.getByLabelText('Fecha de Vencimiento')).toBeInTheDocument();
        expect(screen.getByLabelText('Prioridad')).toBeInTheDocument();
        expect(screen.getByLabelText('Estado')).toBeInTheDocument();
    });

    it('requires title, date, and priority', async () => {
        const submitButton = screen.getByText('Guardar Cambios');
        await fireEvent.click(submitButton);
        await waitFor(() => {
            expect(screen.getByText('El título no puede estar vacío.')).toBeInTheDocument();
            expect(screen.getByText('La fecha de vencimiento no puede estar vacía.')).toBeInTheDocument();
            expect(screen.getByText('La prioridad no puede estar vacía.')).toBeInTheDocument();
        });
    });

    it('prevents creating task with past due date', async () => {
        const dueDateInput = screen.getByLabelText('Fecha de Vencimiento');
        await fireEvent.change(dueDateInput, { target: { value: '2022-01-01' } });
        const submitButton = screen.getByText('Guardar Cambios');
        await fireEvent.click(submitButton);
        await waitFor(() => {
            expect(screen.getByText('La fecha de vencimiento no puede ser menor a la fecha actual.')).toBeInTheDocument();
        });
    });

    it('successfully creates task with valid data', async () => {
        api.post.mockResolvedValue({ status: 201, data: { id: 1, titulo: 'Nueva Tarea' } });
        const titleInput = screen.getByLabelText('Título');
        await fireEvent.change(titleInput, { target: { value: 'Nueva Tarea' } });
        const dueDateInput = screen.getByLabelText('Fecha de Vencimiento');
        await fireEvent.change(dueDateInput, { target: { value: '2024-03-16' } });
        const prioritySelect = screen.getByLabelText('Prioridad');
        await fireEvent.change(prioritySelect, { target: { value: 'alta' } });
        const submitButton = screen.getByText('Guardar Cambios');
        await fireEvent.click(submitButton);
        await waitFor(() => {
            expect(screen.queryByText('Error:')).not.toBeInTheDocument();
        });
    });
});