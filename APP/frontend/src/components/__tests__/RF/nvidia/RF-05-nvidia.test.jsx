// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/RF/nvidia/RF-05-nvidia.test.jsx
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

describe('RF-05: Creación de tareas', () => {
    it('Muestra error si el título está vacío', async () => {
        render(
            <BrowserRouter>
                <TareaForm onAddTarea={vi.fn()} />
            </BrowserRouter>
        );

        const tituloInput = screen.getByLabelText('Título');
        const submitButton = screen.getByRole('button', { name: 'Guardar Cambios' });

        // Dejar título vacío y enviar el formulario
        fireEvent.click(submitButton);

        await waitFor(() => expect(screen.getByText(' Este campo es obligatorio.')).toBeInTheDocument());
    });

    it('Muestra error si la fecha de vencimiento no es seleccionada', async () => {
        render(
            <BrowserRouter>
                <TareaForm onAddTarea={vi.fn()} />
            </BrowserRouter>
        );

        const fechaVencimientoInput = screen.getByLabelText('Fecha de Vencimiento');
        const submitButton = screen.getByRole('button', { name: 'Guardar Cambios' });

        // Dejar fecha de vencimiento vacía y enviar el formulario
        fireEvent.click(submitButton);

        await waitFor(() => expect(screen.getByText(' Este campo es obligatorio.')).toBeInTheDocument());
    });

    it('Muestra error si la prioridad no es seleccionada', async () => {
        render(
            <BrowserRouter>
                <TareaForm onAddTarea={vi.fn()} initialData={{ prioridad: '' }} />
            </BrowserRouter>
        );

        const prioridadSelect = screen.getByLabelText('Prioridad');
        const submitButton = screen.getByRole('button', { name: 'Guardar Cambios' });

        // Dejar prioridad en opción por defecto (vacía) y enviar el formulario
        fireEvent.click(submitButton);

        await waitFor(() => expect(screen.getByText(' Seleccione una prioridad válida.')).toBeInTheDocument());
    });

    it('Envía la solicitud de creación de tarea con título, fecha de vencimiento y prioridad', async () => {
        const onAddTareaMock = vi.fn();
        const apiPostMock = vi.mocked(api.post).mockResolvedValueOnce({ status: 201 });

        render(
            <BrowserRouter>
                <TareaForm onAddTarea={onAddTareaMock} />
            </BrowserRouter>
        );

        const tituloInput = screen.getByLabelText('Título');
        const fechaVencimientoInput = screen.getByLabelText('Fecha de Vencimiento');
        const prioridadSelect = screen.getByLabelText('Prioridad');
        const submitButton = screen.getByRole('button', { name: 'Guardar Cambios' });

        // Rellenar campos con datos válidos
        fireEvent.change(tituloInput, { target: { value: 'Título de ejemplo' } });
        fireEvent.change(fechaVencimientoInput, { target: { value: '2024-04-16' } });
        fireEvent.change(prioridadSelect, { target: { value: 'media' } });

        // Enviar el formulario
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(onAddTareaMock).toHaveBeenCalledTimes(1);
            expect(onAddTareaMock).toHaveBeenCalledWith({
                titulo: 'Título de ejemplo',
                fecha_vencimiento: '2024-04-16',
                prioridad: 'media',
                estado: 'pendiente', // Valor por defecto
                etiquetas: [], // Valor por defecto
            });
            expect(apiPostMock).toHaveBeenCalledTimes(1);
        });
    });
});