import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UsuarioForm from '../UsuarioForm';
import api from '../../api';
import { BrowserRouter } from 'react-router-dom';

vi.mock('../../api');
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => vi.fn(),
    };
});

describe('UsuarioForm Component', () => {
    it('renders correctly for register', () => {
        render(
            <BrowserRouter>
                <UsuarioForm route="/api/user/register/" method="register" />
            </BrowserRouter>
        );
        expect(screen.getByText('Register')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    });

    it('updates username, email, and password state on input change for register', () => {
        render(
            <BrowserRouter>
                <UsuarioForm route="/api/user/register/" method="register" />
            </BrowserRouter>
        );
        const usernameInput = screen.getByPlaceholderText('Username');
        const emailInput = screen.getByPlaceholderText('Email');
        const passwordInput = screen.getByPlaceholderText('Password');

        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'testpassword' } });

        expect(usernameInput.value).toBe('testuser');
        expect(emailInput.value).toBe('test@example.com');
        expect(passwordInput.value).toBe('testpassword');
    });

    it('displays an error message if password is less than 8 characters on register', async () => {
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
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: '1234567' } });
        fireEvent.click(registerButton);

        await waitFor(() => {
            expect(screen.getByText('La contraseña debe tener al menos 8 caracteres.')).toBeInTheDocument();
        });
    });

    it('calls api.post with the correct data and navigates on successful register', async () => {
        api.post.mockResolvedValue({ data: { access: 'mock_access_token', refresh: 'mock_refresh_token' } });

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
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'testpassword123' } });
        fireEvent.click(registerButton);

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith('/api/user/register/', {
                username: 'testuser',
                email: 'test@example.com',
                password: 'testpassword123',
            });
        });

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/');
        });
    });

    it('displays an error message on failed register', async () => {
        api.post.mockRejectedValue({ response: { data: { error: 'Registration failed' } } });

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
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'testpassword123' } });
        fireEvent.click(registerButton);

        await waitFor(() => {
            expect(screen.getByText('Registration failed')).toBeInTheDocument();
        });
    });

    it('displays a generic error message on register failure if no specific error is provided', async () => {
        api.post.mockRejectedValue({});

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
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'testpassword123' } });
        fireEvent.click(registerButton);

        await waitFor(() => {
            expect(screen.getByText('Usuario o contraseña incorrectos.')).toBeInTheDocument();
        });
    });
});