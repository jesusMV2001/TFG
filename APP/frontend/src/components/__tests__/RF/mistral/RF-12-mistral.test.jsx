// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/RF/mistral/RF-12-mistral.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TareaForm from '../../../TareaForm';
import Tarea from '../../../Tarea';
import ModalTarea from '../../../ModalTarea';
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

describe('RF-12: Registro detallado de acciones sobre cada tarea', () => {
    it('debería mostrar el historial de cambios al ver los detalles de una tarea', async () => {
        const tarea = {
            id: 1,
            titulo: 'Tarea de prueba',
            descripcion: 'Descripción de la tarea',
            estado: 'pendiente',
            prioridad: 'media',
            fecha_creacion: '2023-01-01T00:00:00Z',
            fecha_vencimiento: '2023-12-31T00:00:00Z',
        };

        const historial = [
            { id: 1, accion: 'Tarea creada', usuario: 'usuario1', fecha_cambio: '2023-01-01T00:00:00Z' },
            { id: 2, accion: 'Tarea editada', usuario: 'usuario2', fecha_cambio: '2023-01-02T00:00:00Z' },
        ];

        api.get.mockResolvedValueOnce({ data: historial });

        render(
            <BrowserRouter>
                <Tarea tarea={tarea} onDelete={() => {}} onUpdate={() => {}} onDragStart={() => {}} />
            </BrowserRouter>
        );

        // Abrir el modal de detalles de la tarea
        fireEvent.click(screen.getByText('Ver Detalles'));

        // Esperar a que se muestre el historial
        await waitFor(() => {
            expect(screen.getByText('Historial de Cambios')).toBeInTheDocument();
            expect(screen.getByText('Tarea creada')).toBeInTheDocument();
            expect(screen.getByText('Tarea editada')).toBeInTheDocument();
        });
    });

    it('debería actualizar el historial de cambios al editar una tarea', async () => {
        const tarea = {
            id: 1,
            titulo: 'Tarea de prueba',
            descripcion: 'Descripción de la tarea',
            estado: 'pendiente',
            prioridad: 'media',
            fecha_creacion: '2023-01-01T00:00:00Z',
            fecha_vencimiento: '2023-12-31T00:00:00Z',
        };

        const nuevaTarea = {
            ...tarea,
            titulo: 'Tarea editada',
            descripcion: 'Nueva descripción',
            estado: 'en_progreso',
            prioridad: 'alta',
            fecha_vencimiento: '2023-11-30T00:00:00Z',
        };

        const historial = [
            { id: 1, accion: 'Tarea creada', usuario: 'usuario1', fecha_cambio: '2023-01-01T00:00:00Z' },
            { id: 2, accion: 'Tarea editada', usuario: 'usuario2', fecha_cambio: '2023-01-02T00:00:00Z' },
        ];

        api.get.mockResolvedValueOnce({ data: historial });
        api.put.mockResolvedValueOnce({ status: 200 });

        render(
            <BrowserRouter>
                <Tarea tarea={tarea} onDelete={() => {}} onUpdate={() => {}} onDragStart={() => {}} />
                <ModalTarea isOpen={true} onClose={() => {}}>
                    <TareaForm
                        onAddTarea={(updatedTarea) => {
                            expect(updatedTarea).toEqual(nuevaTarea);
                        }}
                        initialData={tarea}
                    />
                </ModalTarea>
            </BrowserRouter>
        );

        // Abrir el modal de edición de la tarea
        fireEvent.click(screen.getByText('Editar Tarea'));

        // Rellenar el formulario con los nuevos datos
        fireEvent.change(screen.getByLabelText('Título'), { target: { value: nuevaTarea.titulo } });
        fireEvent.change(screen.getByLabelText('Descripción'), { target: { value: nuevaTarea.descripcion } });
        fireEvent.change(screen.getByLabelText('Estado'), { target: { value: nuevaTarea.estado } });
        fireEvent.change(screen.getByLabelText('Prioridad'), { target: { value: nuevaTarea.prioridad } });
        fireEvent.change(screen.getByLabelText('Fecha de Vencimiento'), { target: { value: nuevaTarea.fecha_vencimiento } });

        // Enviar el formulario
        fireEvent.click(screen.getByText('Guardar Cambios'));

        // Esperar a que se actualice el historial
        await waitFor(() => {
            expect(api.put).toHaveBeenCalledWith(`/api/tareas/update/1/`, nuevaTarea);
            expect(screen.getByText('Historial de Cambios')).toBeInTheDocument();
            expect(screen.getByText('Tarea creada')).toBeInTheDocument();
            expect(screen.getByText('Tarea editada')).toBeInTheDocument();
        });
    });

    it('debería actualizar el historial de cambios al cambiar el estado de una tarea', async () => {
        const tarea = {
            id: 1,
            titulo: 'Tarea de prueba',
            descripcion: 'Descripción de la tarea',
            estado: 'pendiente',
            prioridad: 'media',
            fecha_creacion: '2023-01-01T00:00:00Z',
            fecha_vencimiento: '2023-12-31T00:00:00Z',
        };

        const historial = [
            { id: 1, accion: 'Tarea creada', usuario: 'usuario1', fecha_cambio: '2023-01-01T00:00:00Z' },
            { id: 2, accion: 'Tarea editada', usuario: 'usuario2', fecha_cambio: '2023-01-02T00:00:00Z' },
        ];

        api.get.mockResolvedValueOnce({ data: historial });
        api.put.mockResolvedValueOnce({ status: 200 });

        render(
            <BrowserRouter>
                <Tarea tarea={tarea} onDelete={() => {}} onUpdate={() => {}} onDragStart={() => {}} />
            </BrowserRouter>
        );

        // Cambiar el estado de la tarea
        fireEvent.dragStart(screen.getByText('Tarea de prueba'));
        fireEvent.drop(screen.getByText('En Progreso'));

        // Esperar a que se actualice el historial
        await waitFor(() => {
            expect(api.put).toHaveBeenCalledWith(`/api/tareas/update/1/`, { ...tarea, estado: 'en_progreso' });
            expect(screen.getByText('Historial de Cambios')).toBeInTheDocument();
            expect(screen.getByText('Tarea creada')).toBeInTheDocument();
            expect(screen.getByText('Tarea editada')).toBeInTheDocument();
            expect(screen.getByText('Estado cambiado a en_progreso')).toBeInTheDocument();
        });
    });
});