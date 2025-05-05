// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/RF/gemini/RF-02-gemini.test.jsx
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

describe('RF-02: Validar correo electrónico no registrado en el registro', () => {
    it('Muestra un mensaje de error si el correo electrónico ya está registrado', async () => {
        api.post.mockRejectedValue({
            response: {
                data: {
                    error: 'Este correo electrónico ya está registrado.'
                }
            }
        });

        render(
            <BrowserRouter>
                <UsuarioForm route="/api/user/register/" method="register" />
            </BrowserRouter>
        );

        const usernameInput = screen.getByPlaceholderText('Username');
        const emailInput = screen.getByPlaceholderText('Email');
        const passwordInput = screen.getByPlaceholderText('Password');
        const registerButton = screen.getByText('Register');

        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(emailInput, { target: { value: 'existing@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.click(registerButton);

        await waitFor(() => {
            expect(screen.getByText('Este correo electrónico ya está registrado.')).toBeVisible();
        });
    });

    it('No muestra un mensaje de error si el correo electrónico no está registrado', async () => {
        api.post.mockResolvedValue({ data: {} });

        render(
            <BrowserRouter>
                <UsuarioForm route="/api/user/register/" method="register" />
            </BrowserRouter>
        );

        const usernameInput = screen.getByPlaceholderText('Username');
        const emailInput = screen.getByPlaceholderText('Email');
        const passwordInput = screen.getByPlaceholderText('Password');
        const registerButton = screen.getByText('Register');

        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(emailInput, { target: { value: 'new@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.click(registerButton);

        await waitFor(() => {
            expect(screen.queryByText('Este correo electrónico ya está registrado.')).toBeNull();
        });
    });

    it('No muestra un mensaje de error si la solicitud falla por otra razón', async () => {
        api.post.mockRejectedValue({
            response: {
                data: {
                    error: 'Otro error'
                }
            }
        });

        render(
            <BrowserRouter>
                <UsuarioForm route="/api/user/register/" method="register" />
            </BrowserRouter>
        );

        const usernameInput = screen.getByPlaceholderText('Username');
        const emailInput = screen.getByPlaceholderText('Email');
        const passwordInput = screen.getByPlaceholderText('Password');
        const registerButton = screen.getByText('Register');

        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(emailInput, { target: { value: 'new@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.click(registerButton);

        await waitFor(() => {
            expect(screen.queryByText('Este correo electrónico ya está registrado.')).toBeNull();
            expect(screen.getByText('Otro error')).toBeVisible();
        });
    });

});