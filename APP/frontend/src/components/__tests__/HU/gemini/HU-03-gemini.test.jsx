// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/HU/gemini/HU-03-gemini.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TareaForm from '../../../TareaForm';
import api from '../../../../api';

vi.mock('../../../../api');

describe('HU-03: Crear tarea', () => {
    const mockOnAddTarea = vi.fn();
    const mockShowToast = vi.fn();

    const renderComponent = () => {
        render(<TareaForm onAddTarea={mockOnAddTarea} showToast={mockShowToast} />);
    };

    it('El usuario puede crear una tarea ingresando titulo, descripcion, fecha de vencimiento, prioridad y estado inicial.', async () => {
        renderComponent();

        fireEvent.change(screen.getByLabelText(/Título/), { target: { value: 'Tarea de prueba' } });
        fireEvent.change(screen.getByLabelText(/Descripción/), { target: { value: 'Descripción de la tarea de prueba' } });
        fireEvent.change(screen.getByLabelText(/Fecha de Vencimiento/), { target: { value: '2024-12-31' } });
        fireEvent.change(screen.getByLabelText(/Prioridad/), { target: { value: 'alta' } });
        fireEvent.change(screen.getByLabelText(/Estado/), { target: { value: 'pendiente' } });

        fireEvent.click(screen.getByText(/Guardar Cambios/));

        expect(mockOnAddTarea).toHaveBeenCalled();
    });

    it('El titulo, fecha de vencimiento y prioridad no pueden estar vacios.', async () => {
        renderComponent();

        fireEvent.click(screen.getByText(/Guardar Cambios/));

        expect(mockOnAddTarea).not.toHaveBeenCalled();
    });

    it('La fecha de vencimiento no debe ser anterior a la fecha actual.', async () => {
        renderComponent();

        fireEvent.change(screen.getByLabelText(/Título/), { target: { value: 'Tarea de prueba' } });
        fireEvent.change(screen.getByLabelText(/Fecha de Vencimiento/), { target: { value: '2023-01-01' } });
        fireEvent.change(screen.getByLabelText(/Prioridad/), { target: { value: 'alta' } });

        fireEvent.click(screen.getByText(/Guardar Cambios/));

        expect(mockOnAddTarea).not.toHaveBeenCalled();
        expect(screen.getByText(/La fecha de vencimiento no puede ser menor a la fecha actual./)).toBeInTheDocument();
    });
});