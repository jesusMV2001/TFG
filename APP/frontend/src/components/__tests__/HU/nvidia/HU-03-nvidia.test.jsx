// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/HU/nvidia/HU-03-nvidia.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TareaForm } from '../../../TareaForm';
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
    it('Debe crear una tarea válida', async () => {
        // Mockear la API para simular la creación exitosa de una tarea
        vi.mocked(api.post).mockResolvedValue({ status: 201, data: { id: 1, titulo: 'Tarea de prueba' } });

        render(
            <BrowserRouter>
                <TareaForm onAddTarea={vi.fn()} />
            </BrowserRouter>
        );

        // Rellenar el formulario con datos válidos
        fireEvent.change(screen.getByLabelText('Título'), { target: { value: 'Tarea de prueba' } });
        fireEvent.change(screen.getByLabelText('Descripción'), { target: { value: 'Descripción de la tarea' } });
        fireEvent.change(screen.getByLabelText('Fecha de Vencimiento'), { target: { value: '2024-03-16' } });
        fireEvent.change(screen.getByLabelText('Prioridad'), { target: { value: 'media' } });

        // Enviar el formulario
        fireEvent.click(screen.getByText('Guardar Cambios'));

        // Verificar que se haya llamado a la API con los datos adecuados
        await waitFor(() => expect(api.post).toHaveBeenCalledTimes(1));
        expect(api.post).toHaveBeenCalledWith('/api/tareas/', expect.objectContaining({
            titulo: 'Tarea de prueba',
            descripcion: 'Descripción de la tarea',
            fecha_vencimiento: '2024-03-16',
            prioridad: 'media',
        }));
    });

    it('No debe crear una tarea con título vacío', async () => {
        render(
            <BrowserRouter>
                <TareaForm onAddTarea={vi.fn()} />
            </BrowserRouter>
        );

        // Rellenar el formulario con título vacío
        fireEvent.change(screen.getByLabelText('Descripción'), { target: { value: 'Descripción de la tarea' } });
        fireEvent.change(screen.getByLabelText('Fecha de Vencimiento'), { target: { value: '2024-03-16' } });
        fireEvent.change(screen.getByLabelText('Prioridad'), { target: { value: 'media' } });

        // Enviar el formulario
        fireEvent.click(screen.getByText('Guardar Cambios'));

        // Verificar que se muestre un error
        await waitFor(() => expect(screen.getByText('El título no puede estar vacío.')).toBeInTheDocument());
    });

    it('No debe crear una tarea con fecha de vencimiento anterior a la actual', async () => {
        const fechaAnterior = '2020-01-01';
        const fechaActual = new Date().toISOString().split('T')[0];

        render(
            <BrowserRouter>
                <TareaForm onAddTarea={vi.fn()} />
            </BrowserRouter>
        );

        // Rellenar el formulario con fecha de vencimiento anterior
        fireEvent.change(screen.getByLabelText('Título'), { target: { value: 'Tarea de prueba' } });
        fireEvent.change(screen.getByLabelText('Descripción'), { target: { value: 'Descripción de la tarea' } });
        fireEvent.change(screen.getByLabelText('Fecha de Vencimiento'), { target: { value: fechaAnterior } });
        fireEvent.change(screen.getByLabelText('Prioridad'), { target: { value: 'media' } });

        // Enviar el formulario
        fireEvent.click(screen.getByText('Guardar Cambios'));

        // Verificar que se muestre un error
        await waitFor(() => expect(screen.getByText(`La fecha de vencimiento no puede ser anterior a ${fechaActual}.`)).toBeInTheDocument());
    });

    it('No debe crear una tarea con fecha de vencimiento vacía', async () => {
        render(
            <BrowserRouter>
                <TareaForm onAddTarea={vi.fn()} />
            </BrowserRouter>
        );

        // Rellenar el formulario con fecha de vencimiento vacía
        fireEvent.change(screen.getByLabelText('Título'), { target: { value: 'Tarea de prueba' } });
        fireEvent.change(screen.getByLabelText('Descripción'), { target: { value: 'Descripción de la tarea' } });
        fireEvent.change(screen.getByLabelText('Prioridad'), { target: { value: 'media' } });

        // Enviar el formulario
        fireEvent.click(screen.getByText('Guardar Cambios'));

        // Verificar que se muestre un error
        await waitFor(() => expect(screen.getByText('La fecha de vencimiento es requerida.')).toBeInTheDocument());
    });

    it('No debe crear una tarea con prioridad vacía', async () => {
        render(
            <BrowserRouter>
                <TareaForm onAddTarea={vi.fn()} />
            </BrowserRouter>
        );

        // Rellenar el formulario con prioridad vacía
        fireEvent.change(screen.getByLabelText('Título'), { target: { value: 'Tarea de prueba' } });
        fireEvent.change(screen.getByLabelText('Descripción'), { target: { value: 'Descripción de la tarea' } });
        fireEvent.change(screen.getByLabelText('Fecha de Vencimiento'), { target: { value: '2024-03-16' } });

        // Enviar el formulario
        fireEvent.click(screen.getByText('Guardar Cambios'));

        // Verificar que se muestre un error
        await waitFor(() => expect(screen.getByText('La prioridad es requerida.')).toBeInTheDocument());
    });
});