// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/HU/gemini/HU-03-gemini.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TareaForm from '../../../TareaForm';
import api from '../../../../api';

vi.mock('../../../../api');

describe('HU-03: Crear tarea', () => {
    it('El usuario puede crear una tarea ingresando titulo, descripcion, fecha de vencimiento, prioridad y estado inicial.', async () => {
        const onAddTarea = vi.fn();
        render(<TareaForm onAddTarea={onAddTarea} />);

        fireEvent.change(screen.getByLabelText(/Título/i), { target: { value: 'Nueva tarea' } });
        fireEvent.change(screen.getByLabelText(/Descripción/i), { target: { value: 'Descripción de la tarea' } });
        fireEvent.change(screen.getByLabelText(/Fecha de Vencimiento/i), { target: { value: '2024-12-31' } });
        fireEvent.change(screen.getByLabelText(/Prioridad/i), { target: { value: 'alta' } });
        fireEvent.change(screen.getByLabelText(/Estado/i), { target: { value: 'pendiente' } });

        fireEvent.click(screen.getByText(/Guardar Cambios/i));

        expect(onAddTarea).toHaveBeenCalledTimes(1);
        expect(onAddTarea).toHaveBeenCalledWith({
            titulo: 'Nueva tarea',
            descripcion: 'Descripción de la tarea',
            fecha_vencimiento: '2024-12-31',
            prioridad: 'alta',
            estado: 'pendiente',
            etiquetas: []
        });
    });

    it('El titulo, fecha de vencimiento y prioridad no pueden estar vacios.', async () => {
        const onAddTarea = vi.fn();
        render(<TareaForm onAddTarea={onAddTarea} />);

        fireEvent.click(screen.getByText(/Guardar Cambios/i));

        expect(onAddTarea).not.toHaveBeenCalled();
    });

    it('La fecha de vencimiento no debe ser anterior a la fecha actual.', async () => {
        render(<TareaForm onAddTarea={() => { }} />);
    
        // Obtener la fecha actual en formato YYYY-MM-DD
        const today = new Date();
        const year = today.getFullYear();
        let month = today.getMonth() + 1;
        let day = today.getDate() - 1; // Establecer la fecha de vencimiento como ayer
    
        month = month < 10 ? '0' + month : month;
        day = day < 10 ? '0' + day : day;
    
        const yesterday = `${year}-${month}-${day}`;
    
        fireEvent.change(screen.getByLabelText(/Título/i), { target: { value: 'Tarea con fecha pasada' } });
        fireEvent.change(screen.getByLabelText(/Fecha de Vencimiento/i), { target: { value: yesterday } });
        fireEvent.change(screen.getByLabelText(/Prioridad/i), { target: { value: 'alta' } });
    
        fireEvent.click(screen.getByText(/Guardar Cambios/i));
    
        // Verificar si el mensaje de error está presente
        await waitFor(() => {
            expect(screen.getByText(/La fecha de vencimiento no puede ser menor a la fecha actual./i)).toBeInTheDocument();
        });
    });
});