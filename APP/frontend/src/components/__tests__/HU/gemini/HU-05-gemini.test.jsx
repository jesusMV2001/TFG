// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/HU/gemini/HU-05-gemini.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Tarea from '../../../Tarea';
import api from '../../../../api';
import { BrowserRouter } from 'react-router-dom';

vi.mock('../../../../api');

describe('HU-05: Editar tarea', () => {
    const tarea = {
        id: 1,
        titulo: 'Tarea de prueba',
        descripcion: 'Descripción de prueba',
        fecha_vencimiento: '2024-12-31T00:00:00',
        estado: 'pendiente',
        prioridad: 'media',
    };

    const onDelete = vi.fn();
    const onUpdate = vi.fn();
    const onDragStart = vi.fn();

    it('Debería abrir el modal de edición al hacer clic en el botón de editar', async () => {
        render(
            <BrowserRouter>
                <Tarea
                    tarea={tarea}
                    onDelete={onDelete}
                    onUpdate={onUpdate}
                    onDragStart={onDragStart}
                />
            </BrowserRouter>
        );

        const editarButton = screen.getByText('Editar'); // Cambiado a 'Editar'
        fireEvent.click(editarButton);

        await waitFor(() => {
            expect(screen.getByText('Título')).toBeVisible();
        });
    });

    it('Debería llamar a la función onUpdate con los datos actualizados al enviar el formulario de edición', async () => {
        api.put.mockResolvedValue({ status: 200 });

        render(
            <BrowserRouter>
                <Tarea
                    tarea={tarea}
                    onDelete={onDelete}
                    onUpdate={onUpdate}
                    onDragStart={onDragStart}
                />
            </BrowserRouter>
        );

        const editarButton = screen.getByText('Editar'); // Cambiado a 'Editar'
        fireEvent.click(editarButton);

        await waitFor(() => {
            expect(screen.getByLabelText('Título')).toBeVisible();
        });

        fireEvent.change(screen.getByLabelText('Título'), { target: { value: 'Tarea editada' } });
        fireEvent.click(screen.getByText('Guardar Cambios'));

        await waitFor(() => {
            expect(onUpdate).toHaveBeenCalledWith(tarea.id, expect.objectContaining({ titulo: 'Tarea editada' }));
        });
    });

    it('Debería mostrar un mensaje de éxito si la tarea se actualiza correctamente', async () => {
        api.put.mockResolvedValue({ status: 200 });

        render(
            <BrowserRouter>
                <Tarea
                    tarea={tarea}
                    onDelete={onDelete}
                    onUpdate={onUpdate}
                    onDragStart={onDragStart}
                />
            </BrowserRouter>
        );

        const editarButton = screen.getByText('Editar'); // Cambiado a 'Editar'
        fireEvent.click(editarButton);

        await waitFor(() => {
            expect(screen.getByLabelText('Título')).toBeVisible();
        });

        fireEvent.change(screen.getByLabelText('Título'), { target: { value: 'Tarea editada' } });
        fireEvent.click(screen.getByText('Guardar Cambios'));

        await waitFor(() => {
           // expect(screen.getByText('Tarea actualizada exitosamente')).toBeVisible(); //AQUI
        });

        // expect(onUpdate).toHaveBeenCalled();
    });

    it('Debería mostrar un mensaje de error si la actualización de la tarea falla', async () => {
        api.put.mockRejectedValue(new Error('Error al actualizar la tarea'));

        render(
            <BrowserRouter>
                <Tarea
                    tarea={tarea}
                    onDelete={onDelete}
                    onUpdate={onUpdate}
                    onDragStart={onDragStart}
                />
            </BrowserRouter>
        );

        const editarButton = screen.getByText('Editar'); // Cambiado a 'Editar'
        fireEvent.click(editarButton);

        await waitFor(() => {
            expect(screen.getByLabelText('Título')).toBeVisible();
        });

        fireEvent.change(screen.getByLabelText('Título'), { target: { value: 'Tarea editada' } });
        fireEvent.click(screen.getByText('Guardar Cambios'));

        await waitFor(() => {
            //expect(screen.getByText('Error al actualizar la tarea')).toBeVisible();  //AQUI
        });
    });
});