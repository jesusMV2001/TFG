// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/HU/mistral/HU-01-mistral.test.jsx
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

describe('HU-01: Registro de Usuarios', () => {
    it('Debe permitir al usuario ingresar nombre, correo y contraseña', () => {
        render(
            <BrowserRouter>
                <UsuarioForm route="/api/user/register/" method="register" />
            </BrowserRouter>
        );

        const usernameInput = screen.getByPlaceholderText('Username');
        const emailInput = screen.getByPlaceholderText('Email');
        const passwordInput = screen.getByPlaceholderText('Password');

        expect(usernameInput).toBeInTheDocument();
        expect(emailInput).toBeInTheDocument();
        expect(passwordInput).toBeInTheDocument();
    });

    it('Debe mostrar un mensaje de error si algún campo está vacío', async () => {
        render(
            <BrowserRouter>
                <UsuarioForm route="/api/user/register/" method="register" />
            </BrowserRouter>
        );

        const submitButton = screen.getByText('Register');
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText('Todos los campos son obligatorios.')).toBeInTheDocument();
        });
    });

    it('Debe mostrar un mensaje de error si la contraseña es menor de 8 caracteres', async () => {
        render(
            <BrowserRouter>
                <UsuarioForm route="/api/user/register/" method="register" />
            </BrowserRouter>
        );

        const usernameInput = screen.getByPlaceholderText('Username');
        const emailInput = screen.getByPlaceholderText('Email');
        const passwordInput = screen.getByPlaceholderText('Password');
        const submitButton = screen.getByText('Register');

        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: '1234567' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText('La contraseña debe tener al menos 8 caracteres.')).toBeInTheDocument();
        });
    });

    it('Debe mostrar un mensaje de error si el correo ya está registrado', async () => {
        api.post.mockResolvedValueOnce({
            data: { error: 'El correo electrónico ya está registrado.' },
        });

        render(
            <BrowserRouter>
                <UsuarioForm route="/api/user/register/" method="register" />
            </BrowserRouter>
        );

        const usernameInput = screen.getByPlaceholderText('Username');
        const emailInput = screen.getByPlaceholderText('Email');
        const passwordInput = screen.getByPlaceholderText('Password');
        const submitButton = screen.getByText('Register');

        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: '12345678' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText('El correo electrónico ya está registrado.')).toBeInTheDocument();
        });
    });

    it('Debe mostrar un mensaje de error si el nombre de usuario ya está registrado', async () => {
        api.post.mockResolvedValueOnce({
            data: { error: 'El nombre de usuario ya está registrado.' },
        });

        render(
            <BrowserRouter>
                <UsuarioForm route="/api/user/register/" method="register" />
            </BrowserRouter>
        );

        const usernameInput = screen.getByPlaceholderText('Username');
        const emailInput = screen.getByPlaceholderText('Email');
        const passwordInput = screen.getByPlaceholderText('Password');
        const submitButton = screen.getByText('Register');

        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: '12345678' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText('El nombre de usuario ya está registrado.')).toBeInTheDocument();
        });
    });
});