// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/RF/mistral/RF-05-mistral.test.jsx
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

describe('RF-05: Creación de nuevas tareas', () => {
    it('debe mostrar un error si la fecha de vencimiento es menor a la fecha actual', async () => {
        render(
            <BrowserRouter>
                <TareaForm onAddTarea={() => {}} />
            </BrowserRouter>
        );

        const tituloInput = screen.getByLabelText(/Título/i);
        const fechaVencimientoInput = screen.getByLabelText(/Fecha de Vencimiento/i);
        const prioridadSelect = screen.getByLabelText(/Prioridad/i);
        const submitButton = screen.getByText(/Guardar Cambios/i);

        fireEvent.change(tituloInput, { target: { value: 'Nueva Tarea' } });
        fireEvent.change(fechaVencimientoInput, { target: { value: '2020-01-01' } });
        fireEvent.change(prioridadSelect, { target: { value: 'alta' } });

        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/La fecha de vencimiento no puede ser menor a la fecha actual/i)).toBeInTheDocument();
        });
    });

    it('debe crear una nueva tarea con éxito', async () => {
        const mockOnAddTarea = vi.fn();
        render(
            <BrowserRouter>
                <TareaForm onAddTarea={mockOnAddTarea} />
            </BrowserRouter>
        );

        const tituloInput = screen.getByLabelText(/Título/i);
        const fechaVencimientoInput = screen.getByLabelText(/Fecha de Vencimiento/i);
        const prioridadSelect = screen.getByLabelText(/Prioridad/i);
        const submitButton = screen.getByText(/Guardar Cambios/i);

        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 1);
        const futureDateString = futureDate.toISOString().split('T')[0];

        fireEvent.change(tituloInput, { target: { value: 'Nueva Tarea' } });
        fireEvent.change(fechaVencimientoInput, { target: { value: futureDateString } });
        fireEvent.change(prioridadSelect, { target: { value: 'alta' } });

        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockOnAddTarea).toHaveBeenCalledWith(expect.objectContaining({
                titulo: 'Nueva Tarea',
                fecha_vencimiento: futureDateString,
                prioridad: 'alta',
            }));
        });
    });

    it('debe mostrar un error si el título está vacío', async () => {
        render(
            <BrowserRouter>
                <TareaForm onAddTarea={() => {}} />
            </BrowserRouter>
        );

        const tituloInput = screen.getByLabelText(/Título/i);
        const fechaVencimientoInput = screen.getByLabelText(/Fecha de Vencimiento/i);
        const prioridadSelect = screen.getByLabelText(/Prioridad/i);
        const submitButton = screen.getByText(/Guardar Cambios/i);

        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 1);
        const futureDateString = futureDate.toISOString().split('T')[0];

        fireEvent.change(tituloInput, { target: { value: '' } });
        fireEvent.change(fechaVencimientoInput, { target: { value: futureDateString } });
        fireEvent.change(prioridadSelect, { target: { value: 'alta' } });

        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/El título no puede estar vacío/i)).toBeInTheDocument();
        });
    });
});