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
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('renders form with fields', () => {
        render(
            <BrowserRouter>
                <UsuarioForm route="/api/user/register/" method="register" />
            </BrowserRouter>
        );
        expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    });

    it('shows error if fields are empty', async () => {
        render(
            <BrowserRouter>
                <UsuarioForm route="/api/user/register/" method="register" />
            </BrowserRouter>
        );
        const submitButton = screen.getByText('Register');
        fireEvent.click(submitButton);
        await waitFor(() => expect(screen.getByText('Todos los campos son obligatorios.')).toBeInTheDocument());
    });

    it('shows error if password is less than 8 characters', async () => {
        render(
            <BrowserRouter>
                <UsuarioForm route="/api/user/register/" method="register" />
            </BrowserRouter>
        );
        const passwordInput = screen.getByPlaceholderText('Password');
        fireEvent.change(passwordInput, { target: { value: 'short' } });
        const submitButton = screen.getByText('Register');
        fireEvent.click(submitButton);
        await waitFor(() => expect(screen.getByText('La contraseña debe tener al menos 8 caracteres.')).toBeInTheDocument());
    });

    it('shows error if email or username is already registered', async () => {
        api.post.mockRejectedValueOnce({
            response: {
                data: { error: 'El correo electrónico ya está registrado.' },
            },
        });
        render(
            <BrowserRouter>
                <UsuarioForm route="/api/user/register/" method="register" />
            </BrowserRouter>
        );
        const usernameInput = screen.getByPlaceholderText('Username');
        fireEvent.change(usernameInput, { target: { value: 'existinguser' } });
        const emailInput = screen.getByPlaceholderText('Email');
        fireEvent.change(emailInput, { target: { value: 'existing@email.com' } });
        const passwordInput = screen.getByPlaceholderText('Password');
        fireEvent.change(passwordInput, { target: { value: 'longenoughpassword' } });
        const submitButton = screen.getByText('Register');
        fireEvent.click(submitButton);
        await waitFor(() => expect(screen.getByText('El correo electrónico ya está registrado.')).toBeInTheDocument());
    });
});