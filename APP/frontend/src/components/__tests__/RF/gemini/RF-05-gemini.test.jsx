// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/RF/gemini/RF-05-gemini.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TareaForm from '../../../TareaForm';
import api from '../../../../api';

vi.mock('../../../../api');

describe('RF-05: Crear nuevas tareas', () => {
    it('Debería permitir crear una nueva tarea con título, fecha de vencimiento y prioridad', async () => {
        const onAddTarea = vi.fn();
        const showToast = vi.fn();
        render(<TareaForm onAddTarea={onAddTarea} showToast={showToast} />);

        const tituloInput = screen.getByLabelText('Título');
        const fechaVencimientoInput = screen.getByLabelText('Fecha de Vencimiento');
        const prioridadSelect = screen.getByLabelText('Prioridad');
        const guardarCambiosButton = screen.getByText('Guardar Cambios');

        fireEvent.change(tituloInput, { target: { value: 'Tarea de prueba' } });
        fireEvent.change(fechaVencimientoInput, { target: { value: '2024-12-31' } });
        fireEvent.change(prioridadSelect, { target: { value: 'alta' } });

        fireEvent.click(guardarCambiosButton);

        expect(onAddTarea).toHaveBeenCalledTimes(1);
        expect(onAddTarea).toHaveBeenCalledWith(
            expect.objectContaining({
                titulo: 'Tarea de prueba',
                fecha_vencimiento: '2024-12-31',
                prioridad: 'alta',
            })
        );
    });

    it('Debería mostrar un error si la fecha de vencimiento es anterior a la fecha actual', async () => {
        const onAddTarea = vi.fn();
        const showToast = vi.fn();

        render(<TareaForm onAddTarea={onAddTarea} showToast={showToast}/>);

        const tituloInput = screen.getByLabelText('Título');
        const fechaVencimientoInput = screen.getByLabelText('Fecha de Vencimiento');
        const prioridadSelect = screen.getByLabelText('Prioridad');
        const guardarCambiosButton = screen.getByText('Guardar Cambios');

        fireEvent.change(tituloInput, { target: { value: 'Tarea de prueba' } });
        fireEvent.change(fechaVencimientoInput, { target: { value: '2020-12-31' } });
        fireEvent.change(prioridadSelect, { target: { value: 'alta' } });

        fireEvent.click(guardarCambiosButton);

        await waitFor(() => {
            expect(screen.getByText('La fecha de vencimiento no puede ser menor a la fecha actual.')).toBeInTheDocument();
        });
    });

    it('Debería permitir crear una nueva tarea con descripción', async () => {
        const onAddTarea = vi.fn();
        const showToast = vi.fn();

        render(<TareaForm onAddTarea={onAddTarea} showToast={showToast} />);

        const tituloInput = screen.getByLabelText('Título');
        const descripcionInput = screen.getByLabelText('Descripción');
        const fechaVencimientoInput = screen.getByLabelText('Fecha de Vencimiento');
        const prioridadSelect = screen.getByLabelText('Prioridad');
        const guardarCambiosButton = screen.getByText('Guardar Cambios');

        fireEvent.change(tituloInput, { target: { value: 'Tarea de prueba' } });
        fireEvent.change(descripcionInput, { target: { value: 'Descripción de prueba' } });
        fireEvent.change(fechaVencimientoInput, { target: { value: '2024-12-31' } });
        fireEvent.change(prioridadSelect, { target: { value: 'alta' } });

        fireEvent.click(guardarCambiosButton);

        expect(onAddTarea).toHaveBeenCalledTimes(1);
        expect(onAddTarea).toHaveBeenCalledWith(
            expect.objectContaining({
                titulo: 'Tarea de prueba',
                descripcion: 'Descripción de prueba',
                fecha_vencimiento: '2024-12-31',
                prioridad: 'alta',
            })
        );
    });
});