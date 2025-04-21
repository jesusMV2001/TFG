// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/HU/nvidia/HU-02-nvidia.test.jsx

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UsuarioForm from '../../../UsuarioForm';
import api from '../../../../api';
import { BrowserRouter } from 'react-router-dom';
import ProtectedRoute from '../../../ProtectedRoute';

vi.mock('../../../../api');
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => vi.fn(),
    };
});

describe('HU-02: Inicio de Sesión y Autenticación', () => {
    it('debe permitir el inicio de sesión con credenciales válidas', async () => {
        // Mockear API para simular inicio de sesión exitoso
        vi.mocked(api.post).mockResolvedValue({
            data: {
                access: 'token-de-prueba',
                refresh: 'refresh-token-de-prueba',
            },
        });

        render(
            <BrowserRouter>
                <UsuarioForm route="login" method="login" />
            </BrowserRouter>
        );

        const usernameInput = screen.getByPlaceholderText('Username');
        const passwordInput = screen.getByPlaceholderText('Password');
        const submitButton = screen.getByRole('button', { name: 'Login' });

        fireEvent.change(usernameInput, { target: { value: 'usuario_de_prueba' } });
        fireEvent.change(passwordInput, { target: { value: 'contraseña_de_prueba' } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(vi.mocked(api.post)).toHaveBeenCalledTimes(1));
        expect(vi.mocked(api.post)).toHaveBeenCalledWith('http://localhost:8000/api/token/', {
            username: 'usuario_de_prueba',
            password: 'contraseña_de_prueba',
        });

        // Verificar redirección a página protegida
        expect(screen.queryByText('Lista de Tareas')).toBeInTheDocument();
    });

    it('debe mostrar un mensaje de error con credenciales incorrectas', async () => {
        // Mockear API para simular inicio de sesión fallido
        vi.mocked(api.post).mockRejectedValue({
            response: {
                data: { error: 'Credenciales inválidas' },
                status: 401,
            },
        });

        render(
            <BrowserRouter>
                <UsuarioForm route="login" method="login" />
            </BrowserRouter>
        );

        const usernameInput = screen.getByPlaceholderText('Username');
        const passwordInput = screen.getByPlaceholderText('Password');
        const submitButton = screen.getByRole('button', { name: 'Login' });

        fireEvent.change(usernameInput, { target: { value: 'usuario_invalido' } });
        fireEvent.change(passwordInput, { target: { value: 'contraseña_invalida' } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(vi.mocked(api.post)).toHaveBeenCalledTimes(1));
        expect(screen.getByText('Credenciales inválidas')).toBeInTheDocument();
    });

    it('debe mantener la sesión activa después del inicio de sesión', async () => {
        // Mockear API para simular inicio de sesión exitoso
        vi.mocked(api.post).mockResolvedValue({
            data: {
                access: 'token-de-prueba',
                refresh: 'refresh-token-de-prueba',
            },
        });

        // Iniciar sesión
        render(
            <BrowserRouter>
                <UsuarioForm route="login" method="login" />
            </BrowserRouter>
        );

        const usernameInput = screen.getByPlaceholderText('Username');
        const passwordInput = screen.getByPlaceholderText('Password');
        const submitButton = screen.getByRole('button', { name: 'Login' });

        fireEvent.change(usernameInput, { target: { value: 'usuario_de_prueba' } });
        fireEvent.change(passwordInput, { target: { value: 'contraseña_de_prueba' } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(vi.mocked(api.post)).toHaveBeenCalledTimes(1));

        // Verificar que la ruta protegida se muestra después de iniciar sesión
        const protectedRoute = render(
            <BrowserRouter>
                <ProtectedRoute>
                    <div>Contenido protegido</div>
                </ProtectedRoute>
            </BrowserRouter>
        );
        expect(protectedRoute.getByText('Contenido protegido')).toBeInTheDocument();
    });
});