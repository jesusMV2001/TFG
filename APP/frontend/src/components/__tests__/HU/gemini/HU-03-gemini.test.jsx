// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/HU/gemini/HU-03-gemini.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TareaForm from '../../../TareaForm';
import api from '../../../../api';

vi.mock('../../../../api');

describe('HU-03: Crear tarea', () => {
    it('El usuario puede crear una tarea ingresando titulo, descripcion, fecha de vencimiento, prioridad y estado inicial', async () => {
        api.post.mockResolvedValue({ status: 201 });

        const onAddTarea = vi.fn();
        render(<TareaForm onAddTarea={onAddTarea} showToast={vi.fn()} />);

        fireEvent.change(screen.getByLabelText('Título'), { target: { value: 'Tarea de prueba' } });
        fireEvent.change(screen.getByLabelText('Descripción'), { target: { value: 'Descripción de prueba' } });
        fireEvent.change(screen.getByLabelText('Fecha de Vencimiento'), { target: { value: '2024-12-31' } });
        fireEvent.change(screen.getByLabelText('Prioridad'), { target: { value: 'alta' } });
        fireEvent.change(screen.getByLabelText('Estado'), { target: { value: 'pendiente' } });

        fireEvent.click(screen.getByText('Guardar Cambios'));

        await waitFor(() => {
            expect(onAddTarea).toHaveBeenCalledWith({
                titulo: 'Tarea de prueba',
                descripcion: 'Descripción de prueba',
                fecha_vencimiento: '2024-12-31',
                prioridad: 'alta',
                estado: 'pendiente',
                etiquetas: [],
            });
        });
    });

    it('Muestra un error si el título está vacío', async () => {
        const onAddTarea = vi.fn();
        render(<TareaForm onAddTarea={onAddTarea} showToast={vi.fn()} />);

        fireEvent.change(screen.getByLabelText('Fecha de Vencimiento'), { target: { value: '2024-12-31' } });

        fireEvent.click(screen.getByText('Guardar Cambios'));

        await waitFor(() => {
            expect(screen.getByText('Título es requerido')).toBeVisible();
            expect(onAddTarea).not.toHaveBeenCalled();
        });
    });

    it('Muestra un error si la fecha de vencimiento está vacía', async () => {
        const onAddTarea = vi.fn();
        render(<TareaForm onAddTarea={onAddTarea} showToast={vi.fn()} />);

        fireEvent.change(screen.getByLabelText('Título'), { target: { value: 'Tarea de prueba' } });

        fireEvent.click(screen.getByText('Guardar Cambios'));

        await waitFor(() => {
            expect(screen.getByText('Fecha de vencimiento es requerida')).toBeVisible();
            expect(onAddTarea).not.toHaveBeenCalled();
        });
    });

    it('La fecha de vencimiento no debe ser anterior a la fecha actual', async () => {
        render(<TareaForm onAddTarea={vi.fn()} showToast={vi.fn()} />);

        fireEvent.change(screen.getByLabelText('Título'), { target: { value: 'Tarea de prueba' } });
        fireEvent.change(screen.getByLabelText('Fecha de Vencimiento'), { target: { value: '2020-01-01' } });

        fireEvent.click(screen.getByText('Guardar Cambios'));

        await waitFor(() => {
            expect(screen.getByText('La fecha de vencimiento no puede ser menor a la fecha actual.')).toBeVisible();
        });
    });
});