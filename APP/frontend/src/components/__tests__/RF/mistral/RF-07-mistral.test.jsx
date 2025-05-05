// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/RF/mistral/RF-07-mistral.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TareaForm from '../../../TareaForm';
import api from '../../../../api';
import { BrowserRouter } from 'react-router-dom';

vi.mock('../../../../api');

describe('RF-07: Editar campos visibles de una tarea existente', () => {
    const initialData = {
        id: 1,
        titulo: 'Tarea de prueba',
        descripcion: 'Descripción de prueba',
        estado: 'pendiente',
        prioridad: 'media',
        fecha_vencimiento: '2023-12-31',
        etiquetas: []
    };

    const mockOnAddTarea = vi.fn();

    beforeEach(() => {
        render(
            <BrowserRouter>
                <TareaForm onAddTarea={mockOnAddTarea} initialData={initialData} />
            </BrowserRouter>
        );
    });

    it('Debería mostrar los datos iniciales de la tarea', () => {
        expect(screen.getByLabelText(/Título/i).value).toBe(initialData.titulo);
        expect(screen.getByLabelText(/Descripción/i).value).toBe(initialData.descripcion);
        expect(screen.getByLabelText(/Estado/i).value).toBe(initialData.estado);
        expect(screen.getByLabelText(/Prioridad/i).value).toBe(initialData.prioridad);
        expect(screen.getByLabelText(/Fecha de Vencimiento/i).value).toBe('2023-12-31');
    });

    it('Debería permitir editar el título de la tarea', async () => {
        const nuevoTitulo = 'Nuevo título de tarea';
        fireEvent.change(screen.getByLabelText(/Título/i), { target: { value: nuevoTitulo } });
        fireEvent.submit(screen.getByText(/Guardar Cambios/i));

        await waitFor(() => {
            expect(mockOnAddTarea).toHaveBeenCalledWith(
                expect.objectContaining({
                    titulo: nuevoTitulo
                })
            );
        });
    });

    it('Debería permitir editar la descripción de la tarea', async () => {
        const nuevaDescripcion = 'Nueva descripción de tarea';
        fireEvent.change(screen.getByLabelText(/Descripción/i), { target: { value: nuevaDescripcion } });
        fireEvent.submit(screen.getByText(/Guardar Cambios/i));

        await waitFor(() => {
            expect(mockOnAddTarea).toHaveBeenCalledWith(
                expect.objectContaining({
                    descripcion: nuevaDescripcion
                })
            );
        });
    });

    it('Debería permitir editar el estado de la tarea', async () => {
        const nuevoEstado = 'en_progreso';
        fireEvent.change(screen.getByLabelText(/Estado/i), { target: { value: nuevoEstado } });
        fireEvent.submit(screen.getByText(/Guardar Cambios/i));

        await waitFor(() => {
            expect(mockOnAddTarea).toHaveBeenCalledWith(
                expect.objectContaining({
                    estado: nuevoEstado
                })
            );
        });
    });

    it('Debería permitir editar la prioridad de la tarea', async () => {
        const nuevaPrioridad = 'alta';
        fireEvent.change(screen.getByLabelText(/Prioridad/i), { target: { value: nuevaPrioridad } });
        fireEvent.submit(screen.getByText(/Guardar Cambios/i));

        await waitFor(() => {
            expect(mockOnAddTarea).toHaveBeenCalledWith(
                expect.objectContaining({
                    prioridad: nuevaPrioridad
                })
            );
        });
    });

    it('Debería permitir editar la fecha de vencimiento de la tarea', async () => {
        const nuevaFechaVencimiento = '2024-01-01';
        fireEvent.change(screen.getByLabelText(/Fecha de Vencimiento/i), { target: { value: nuevaFechaVencimiento } });
        fireEvent.submit(screen.getByText(/Guardar Cambios/i));

        await waitFor(() => {
            expect(mockOnAddTarea).toHaveBeenCalledWith(
                expect.objectContaining({
                    fecha_vencimiento: nuevaFechaVencimiento
                })
            );
        });
    });

    it('Debería mostrar un mensaje de error si la fecha de vencimiento es menor a la fecha actual', async () => {
        const fechaInvalida = '2023-01-01';
        fireEvent.change(screen.getByLabelText(/Fecha de Vencimiento/i), { target: { value: fechaInvalida } });
        fireEvent.submit(screen.getByText(/Guardar Cambios/i));

        await waitFor(() => {
            expect(screen.getByText(/La fecha de vencimiento no puede ser menor a la fecha actual/i)).toBeInTheDocument();
        });
    });
});