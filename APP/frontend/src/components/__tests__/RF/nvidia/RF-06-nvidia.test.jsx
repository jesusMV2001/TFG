// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/RF/nvidia/RF-06-nvidia.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import Home from '../../../Home';
import api from '../../../../api';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../../../ProtectedRoute';

vi.mock('../../../../api');
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    Navigate: () => <div>Navigate</div>,
  };
});

describe('RF-06: Lista de tareas del usuario', () => {
  beforeEach(() => {
    // Mockear la respuesta de la API para obtener tareas
    const tareas = [
      { id: 1, titulo: 'Tarea 1', fecha_vencimiento: '2024-03-15' },
      { id: 2, titulo: 'Tarea 2', fecha_vencimiento: '2024-03-20' },
      { id: 3, titulo: 'Tarea 3', fecha_vencimiento: '2024-03-25' },
    ];
    vi.mocked(api.get).mockImplementationOnce(() =>
      Promise.resolve({ data: tareas }),
    );
  });

  it('Muestra la lista de tareas al usuario autenticado', async () => {
    // Ruta protegida para asegurarse del contexto de autenticación
    render(
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>,
    );

    // Esperar a que se rendericen las tareas
    await waitFor(() => {
      // Comprobar si se muestran los títulos de las tareas
      expect(screen.getByText('Tarea 1')).toBeInTheDocument();
      expect(screen.getByText('Tarea 2')).toBeInTheDocument();
      expect(screen.getByText('Tarea 3')).toBeInTheDocument();
    });
  });

  it('No muestra la lista de tareas sin autenticación', async () => {
    // Ruta no protegida para simular un usuario no autenticado
    render(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>,
    );

    // Esperar a que se complete el renderizado
    await waitFor(() => {
      // Comprobar si no se muestra la lista de tareas (solo el contenedor vacío)
      expect(screen.queryByText('Tarea 1')).not.toBeInTheDocument();
      expect(screen.queryByText('Tarea 2')).not.toBeInTheDocument();
      expect(screen.queryByText('Tarea 3')).not.toBeInTheDocument();
    });
  });

  it('Muestra mensaje de error al fallar la carga de tareas', async () => {
    // Mockear un error al obtener tareas de la API
    vi.mocked(api.get).mockImplementationOnce(() =>
      Promise.reject(new Error('Simulando fallo en la carga de tareas')),
    );

    render(
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>,
    );

    // Esperar a que se muestre el mensaje de error
    await waitFor(() => {
      expect(screen.getByText('Error al obtener las tareas')).toBeInTheDocument();
    });
  });
});