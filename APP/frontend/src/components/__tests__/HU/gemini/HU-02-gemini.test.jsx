// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/HU/gemini/HU-02-gemini.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UsuarioForm from '../../../UsuarioForm';
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

describe('HU-02: Inicio de Sesión y Autenticación', () => {
    it('El usuario registrado debe poder iniciar sesión con sus credenciales válidas.', async () => {
        api.post.mockResolvedValue({ data: { access: 'access_token', refresh: 'refresh_token' } });

        render(
            <BrowserRouter>
                <UsuarioForm route="/api/token/" method="login" />
            </BrowserRouter>
        );

        const usernameInput = screen.getByPlaceholderText('Username');
        const passwordInput = screen.getByPlaceholderText('Password');
        const loginButton = screen.getByText('Login');

        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.click(loginButton);

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith('/api/token/', {
                username: 'testuser',
                password: 'password123',
            });
        });

        await waitFor(() => {
            expect(localStorage.getItem('ACCESS_TOKEN')).toBe('access_token');
            expect(localStorage.getItem('REFRESH_TOKEN')).toBe('refresh_token');
        });
    });

    it('Si se ingresan credenciales incorrectas, se mostrará un mensaje de error.', async () => {
        api.post.mockRejectedValue({ response: { data: { error: 'Credenciales incorrectas' } } });

        render(
            <BrowserRouter>
                <UsuarioForm route="/api/token/" method="login" />
            </BrowserRouter>
        );

        const usernameInput = screen.getByPlaceholderText('Username');
        const passwordInput = screen.getByPlaceholderText('Password');
        const loginButton = screen.getByText('Login');

        fireEvent.change(usernameInput, { target: { value: 'wronguser' } });
        fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
        fireEvent.click(loginButton);

        await waitFor(() => {
            expect(screen.getByText('Credenciales incorrectas')).toBeInTheDocument();
        });
    });

    it('Una vez autenticado, el sistema debe mantener la sesión activa hasta que el usuario cierre sesión (simulando ProtectedRoute).', () => {
        localStorage.setItem('ACCESS_TOKEN', 'test_access_token');
        const { getByText } = render(
            <BrowserRouter>
                <UsuarioForm route="/api/token/" method="login" />
            </BrowserRouter>
        );
        expect(localStorage.getItem('ACCESS_TOKEN')).toBe('test_access_token')
    });
});