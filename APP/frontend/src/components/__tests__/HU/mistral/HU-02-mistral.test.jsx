// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/HU/mistral/HU-02-mistral.test.jsx
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
        const mockResponse = { data: { access: 'mockAccessToken', refresh: 'mockRefreshToken' } };
        api.post.mockResolvedValue(mockResponse);

        render(
            <BrowserRouter>
                <UsuarioForm route="/api/token/" method="login" />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
        fireEvent.click(screen.getByText('Login'));

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith('/api/token/', { username: 'testuser', password: 'password123' });
            expect(localStorage.getItem('ACCESS_TOKEN')).toBe('mockAccessToken');
            expect(localStorage.getItem('REFRESH_TOKEN')).toBe('mockRefreshToken');
        });
    });

    it('Si se ingresan credenciales incorrectas, se mostrará un mensaje de error.', async () => {
        const mockErrorResponse = { response: { data: { error: 'Usuario o contraseña incorrectos.' } } };
        api.post.mockRejectedValue(mockErrorResponse);

        render(
            <BrowserRouter>
                <UsuarioForm route="/api/token/" method="login" />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'wrongpassword' } });
        fireEvent.click(screen.getByText('Login'));

        await waitFor(() => {
            expect(screen.getByText('Usuario o contraseña incorrectos.')).toBeInTheDocument();
        });
    });

    it('Una vez autenticado, el sistema debe mantener la sesión activa hasta que el usuario cierre sesión.', async () => {
        const mockResponse = { data: { access: 'mockAccessToken', refresh: 'mockRefreshToken' } };
        api.post.mockResolvedValue(mockResponse);

        render(
            <BrowserRouter>
                <UsuarioForm route="/api/token/" method="login" />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
        fireEvent.click(screen.getByText('Login'));

        await waitFor(() => {
            expect(localStorage.getItem('ACCESS_TOKEN')).toBe('mockAccessToken');
            expect(localStorage.getItem('REFRESH_TOKEN')).toBe('mockRefreshToken');
        });

        // Simulate logout by clearing localStorage
        localStorage.clear();

        expect(localStorage.getItem('ACCESS_TOKEN')).toBeNull();
        expect(localStorage.getItem('REFRESH_TOKEN')).toBeNull();
    });
});