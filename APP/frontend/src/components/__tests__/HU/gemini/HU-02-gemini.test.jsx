// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/HU/gemini/HU-02-gemini.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UsuarioForm from '../../../UsuarioForm';
import api from '../../../../api';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../../../../constants';

vi.mock('../../../../api');

describe('HU-02: Inicio de Sesión y Autenticación', () => {
    it('El usuario registrado debe poder iniciar sesión con sus credenciales válidas.', async () => {
        const mockNavigate = vi.fn();
        vi.mock('react-router-dom', async () => {
            const actual = await vi.importActual('react-router-dom');
            return {
                ...actual,
                useNavigate: () => mockNavigate,
            };
        });

        api.post.mockResolvedValue({
            data: { access: 'mockAccessToken', refresh: 'mockRefreshToken' },
        });

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
            expect(localStorage.getItem(ACCESS_TOKEN)).toBe('mockAccessToken');
            expect(localStorage.getItem(REFRESH_TOKEN)).toBe('mockRefreshToken');
            expect(mockNavigate).toHaveBeenCalledWith('/');
        });
    });

    it('Si se ingresan credenciales incorrectas, se mostrará un mensaje de error.', async () => {

        api.post.mockRejectedValue({
            response: { data: { error: 'Credenciales incorrectas' } },
        });

        render(
            <BrowserRouter>
                <UsuarioForm route="/api/token/" method="login" />
            </BrowserRouter>
        );

        const usernameInput = screen.getByPlaceholderText('Username');
        const passwordInput = screen.getByPlaceholderText('Password');
        const loginButton = screen.getByText('Login');

        fireEvent.change(usernameInput, { target: { value: 'invaliduser' } });
        fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
        fireEvent.click(loginButton);

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith('/api/token/', {
                username: 'invaliduser',
                password: 'wrongpassword',
            });
            expect(screen.getByText('Credenciales incorrectas')).toBeVisible();
        });
        expect(localStorage.getItem(ACCESS_TOKEN)).toBeNull();
        expect(localStorage.getItem(REFRESH_TOKEN)).toBeNull();
    });
});