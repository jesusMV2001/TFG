// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/RF/nvidia/RF-04-nvidia.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UsuarioForm from '../../../UsuarioForm';
import Login from '../../../../pages/Login';
import App from '../../../../App';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import api from '../../../../api';
import ProtectedRoute from '../../../../components/ProtectedRoute';

vi.mock('../../../../api');
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => vi.fn(),
    };
});

describe('RF-04: Inicio y cierre de sesión', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('Debería mostrar el formulario de login cuando no hay sesión iniciada', () => {
        const { getByText } = render(
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />
                </Routes>
            </BrowserRouter>
        );

        expect(getByText('Login')).toBeInTheDocument();
    });

    it('Debería iniciar sesión correctamente con credenciales válidas', async () => {
        const mockApiPost = vi.fn(() => Promise.resolve({
            data: { access: 'token_de_acceso', refresh: 'token_de_refresco' },
            status: 200,
        }));
        api.post.mockImplementation(mockApiPost);

        const { getByText, getByLabelText } = render(
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />
                </Routes>
            </BrowserRouter>
        );

        const usernameInput = getByLabelText('Username');
        const passwordInput = getByLabelText('Password');
        const submitButton = getByText('Login');

        fireEvent.change(usernameInput, { target: { value: 'usuario_valido' } });
        fireEvent.change(passwordInput, { target: { value: 'contraseña_segura' } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockApiPost).toHaveBeenCalledTimes(1));
        expect(mockApiPost).toHaveBeenCalledWith('/api/token/', expect.objectContaining({
            username: 'usuario_valido',
            password: 'contraseña_segura',
        }));
        // Verificar que se redirige correctamente tras el login
        // Asumiendo que la ruta de inicio es '/'
        expect(screen.queryByText('Lista de Tareas')).toBeInTheDocument();
    });

    it('Debería mostrar un mensaje de error al intentar iniciar sesión con credenciales inválidas', async () => {
        const mockApiPost = vi.fn(() => Promise.reject({
            response: { data: { error: 'Credenciales inválidas' }, status: 401 },
        }));
        api.post.mockImplementation(mockApiPost);

        const { getByText, getByLabelText } = render(
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />
                </Routes>
            </BrowserRouter>
        );

        const usernameInput = getByLabelText('Username');
        const passwordInput = getByLabelText('Password');
        const submitButton = getByText('Login');

        fireEvent.change(usernameInput, { target: { value: 'usuario_invalido' } });
        fireEvent.change(passwordInput, { target: { value: 'contraseña_insegura' } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(screen.getByText('Credenciales inválidas')).toBeInTheDocument());
    });

    it('Debería cerrar la sesión correctamente', async () => {
        const mockLocalStorageClear = vi.spyOn(Storage.prototype, 'clear');
        const mockApiGet = vi.fn(() => Promise.resolve({ data: [] }));
        api.get.mockImplementation(mockApiGet);

        render(
            <BrowserRouter>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <App />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/login" element={<Login />} />
                </Routes>
            </BrowserRouter>
        );

        // Simular que hay una sesión iniciada
        localStorage.setItem('ACCESS_TOKEN', 'token_de_acceso');
        localStorage.setItem('REFRESH_TOKEN', 'token_de_refresco');

        const { getByText } = screen;
        expect(getByText('Lista de Tareas')).toBeInTheDocument();

        const cerrarSesionButton = getByText('Cerrar Sesión');
        fireEvent.click(cerrarSesionButton);

        await waitFor(() => expect(mockLocalStorageClear).toHaveBeenCalledTimes(1));
        expect(screen.queryByText('Login')).toBeInTheDocument();
    });
});