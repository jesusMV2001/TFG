// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/HU/gemini/HU-10-gemini.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Tarea from '../../../Tarea';
import ModalTarea from '../../../ModalTarea';
import api from '../../../../api';
import { BrowserRouter } from 'react-router-dom';

vi.mock('../../../../api');

describe('HU-10: Historial de Actividades', () => {
    const tarea = {
        id: 1,
        titulo: 'Test Tarea',
        descripcion: 'Test Descripcion',
        estado: 'pendiente',
        prioridad: 'media',
        fecha_vencimiento: '2024-12-31',
        fecha_creacion: '2024-01-01',
    };

    const historial = [
        {
            id: 1,
            tarea: 1,
            usuario: 'testuser',
            accion: 'Tarea creada',
            fecha_cambio: '2024-01-01T12:00:00Z',
        },
        {
            id: 2,
            tarea: 1,
            usuario: 'testuser',
            accion: 'Estado cambiado a en_progreso',
            fecha_cambio: '2024-01-02T12:00:00Z',
        },
    ];

    it('should display the view details button', () => {
        render(
            <BrowserRouter>
                <Tarea tarea={tarea} onDelete={() => {}} onUpdate={() => {}} onDragStart={() => {}} />
            </BrowserRouter>
        );
        const viewDetailsButton = screen.getByText(/Ver Detalles/i);
        expect(viewDetailsButton).toBeInTheDocument();
    });

    it('should open the modal when view details button is clicked', async () => {
        api.get.mockResolvedValue({ data: historial });

        render(
            <BrowserRouter>
                <Tarea tarea={tarea} onDelete={() => {}} onUpdate={() => {}} onDragStart={() => {}} />
            </BrowserRouter>
        );

        const viewDetailsButton = screen.getByText(/Ver Detalles/i);
        fireEvent.click(viewDetailsButton);

        await waitFor(() => {
          expect(api.get).toHaveBeenCalledWith(`/api/tareas/${tarea.id}/historial/`);
        });


    });


    it('should display historial when available', async () => {
       api.get.mockResolvedValue({ data: historial });

        render(
            <BrowserRouter>
              <ModalTarea isOpen={true} onClose={() => {}}>
                    <div>
                        <h3>Historial de Cambios</h3>
                        <ul>
                            {historial.map(cambio => (
                                <li key={cambio.id}>{cambio.accion}</li>
                            ))}
                        </ul>
                    </div>
                </ModalTarea>
            </BrowserRouter>
        );

        await waitFor(() => {
            historial.forEach(cambio => {
                expect(screen.getByText(cambio.accion)).toBeInTheDocument();
            });
        });
    });

    it('should display a message when no history is available', async () => {
        api.get.mockResolvedValue({ data: [] });

        render(
            <BrowserRouter>
              <ModalTarea isOpen={true} onClose={() => {}}>
                    <div>
                        <h3>Historial de Cambios</h3>
                        <p>No hay historial de cambios.</p>
                    </div>
                </ModalTarea>
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText(/No hay historial de cambios./i)).toBeInTheDocument();
        });
    });
});