// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/RF/nvidia/RF-08-nvidia.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Tarea from '../../../Tarea';
import api from '../../../../api';

vi.mock('../../../../api');

describe('RF-08: Eliminar Tareas', () => {
  beforeEach(() => {
    // Mockear la respuesta de la API para la lista de tareas
    api.delete = vi.fn(() => Promise.resolve({ status: 204 }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('Eliminar tarea con éxito', async () => {
    const tarea = {
      id: 1,
      titulo: 'Tarea de Prueba',
    };

    const { getByText, getAllByRole } = render(<Tarea tarea={tarea} onDelete={vi.fn()} onDragStart={vi.fn()} onUpdate={vi.fn()} />);

    // Botón de eliminar
    const eliminarButton = getAllByRole('button')[3]; // El cuarto botón en el arreglo debe ser el de eliminar
    expect(eliminarButton).toHaveTextContent('Eliminar');

    // Simular clic en el botón de eliminar
    fireEvent.click(eliminarButton);

    // Esperar a que la tarea sea eliminada ( simulando la espera a la respuesta de la API )
    await waitFor(() => expect(api.delete).toHaveBeenCalledTimes(1));

    // Verificar que se haya llamado al mock de eliminar tarea con la ID correcta
    expect(api.delete).toHaveBeenNthCalledWith(1, `/api/tareas/delete/${tarea.id}/`);
  });

  it('Muestra mensaje de error al fallar la eliminación', async () => {
    const tarea = {
      id: 1,
      titulo: 'Tarea de Prueba',
    };

    // Forzar un error en la API
    api.delete = vi.fn(() => Promise.reject('Error al eliminar'));

    const { getByText, getAllByRole } = render(<Tarea tarea={tarea} onDelete={vi.fn()} onDragStart={vi.fn()} onUpdate={vi.fn()} />);
    const eliminarButton = getAllByRole('button')[3];
    expect(eliminarButton).toHaveTextContent('Eliminar');

    fireEvent.click(eliminarButton);

    // Esperar a que se muestre el mensaje de error
    await screen.findByText('Error al eliminar la tarea');

    // Verificar que se haya mostrado el mensaje de error
    expect(screen.getByText('Error al eliminar la tarea')).toBeVisible();
  });
});