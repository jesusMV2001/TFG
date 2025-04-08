// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/HU/gemini/HU-06-gemini.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '../../../pages/Home';
import api from '../../../../api';

vi.mock('../../../../api');

describe('HU-06: Eliminar tarea', () => {
    const mockTareas = [
        { id: 1, titulo: 'Tarea 1', descripcion: 'Descripcion 1', estado: 'pendiente', prioridad: 'alta', fecha_vencimiento: '2024-01-01' },
        { id: 2, titulo: 'Tarea 2', descripcion: 'Descripcion 2', estado: 'en_progreso', prioridad: 'media', fecha_vencimiento: '2024-01-02' },
    ];

    it('Al eliminar una tarea, esta debe desaparecer de la lista.', async () => {
        api.get.mockResolvedValue({ data: mockTareas });
        api.delete.mockResolvedValue({ status: 204 });

        render(<Home />);

        await waitFor(() => {
            expect(screen.getByText('Tarea 1')).toBeInTheDocument();
            expect(screen.getByText('Tarea 2')).toBeInTheDocument();
        });

        const deleteButton = screen.getAllByRole('button', { hidden: false,  name: /eliminar/i })[0];
        fireEvent.click(deleteButton);

        await waitFor(() => {
            expect(api.delete).toHaveBeenCalledWith('/api/tareas/delete/1/');
        });

        api.get.mockResolvedValue({ data: [mockTareas[1]] });

        await waitFor(() => {
           
        });


        
    });

    it('El sistema debe mostrar un mensaje si se ha borrado la tarea.', async () => {
        api.get.mockResolvedValue({ data: mockTareas });
        api.delete.mockResolvedValue({ status: 204 });
        
        const mockSetToast = vi.fn();
        vi.spyOn(Home.prototype, 'showToast').mockImplementation(mockSetToast);
    
        render(<Home />);
        
        await waitFor(() => {
            expect(screen.getByText('Tarea 1')).toBeInTheDocument();
        });
    
        const deleteButton = screen.getAllByRole('button', { hidden: false,  name: /eliminar/i })[0];
        fireEvent.click(deleteButton);
    
        await waitFor(() => {
            expect(api.delete).toHaveBeenCalledWith('/api/tareas/delete/1/');
        });
    
        await waitFor(() => {
            expect(mockSetToast).toHaveBeenCalledWith("Tarea eliminada exitosamente");
        });
    });

    it('En caso de error, el sistema debe mostrar un mensaje de error.', async () => {
        api.get.mockResolvedValue({ data: mockTareas });
        api.delete.mockRejectedValue(new Error('Error al eliminar'));

        const mockSetToast = vi.fn();
        vi.spyOn(Home.prototype, 'showToast').mockImplementation(mockSetToast);

        render(<Home />);

        await waitFor(() => {
            expect(screen.getByText('Tarea 1')).toBeInTheDocument();
        });

        const deleteButton = screen.getAllByRole('button', { hidden: false,  name: /eliminar/i })[0];
        fireEvent.click(deleteButton);

        await waitFor(() => {
            expect(api.delete).toHaveBeenCalledWith('/api/tareas/delete/1/');
        });

        await waitFor(() => {
            expect(mockSetToast).toHaveBeenCalledWith("Error al eliminar la tarea", "error");
        });
    });
});