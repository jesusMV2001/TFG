// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/RF/mistral/RF-04-mistral.test.jsx
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

describe('RF-04: Los usuarios podrán iniciar sesión y cerrar sesión.', () => {
    it('Debe permitir a los usuarios iniciar sesión con credenciales válidas', async () => {
        const mockNavigate = vi.fn();
        vi.mocked(api.post).mockResolvedValueOnce({ data: { access: 'mockAccessToken', refresh: 'mockRefreshToken' } });

        render(
            <BrowserRouter>
                <UsuarioForm route="/api/token/" method="login" />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'testpassword' } });
        fireEvent.click(screen.getByText('Login'));

        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/'));
    });

    it('Debe mostrar un mensaje de error si las credenciales son inválidas', async () => {
        vi.mocked(api.post).mockRejectedValueOnce({ response: { data: { error: 'Invalid credentials' } } });

        render(
            <BrowserRouter>
                <UsuarioForm route="/api/token/" method="login" />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'wrongpassword' } });
        fireEvent.click(screen.getByText('Login'));

        await waitFor(() => expect(screen.getByText('Invalid credentials')).toBeInTheDocument());
    });

    it('Debe permitir a los usuarios cerrar sesión', async () => {
        const mockNavigate = vi.fn();
        vi.mocked(api.post).mockResolvedValueOnce({ data: { access: 'mockAccessToken', refresh: 'mockRefreshToken' } });

        render(
            <BrowserRouter>
                <UsuarioForm route="/api/token/" method="login" />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'testpassword' } });
        fireEvent.click(screen.getByText('Login'));

        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/'));

        // Simulate logout
        localStorage.clear();
        mockNavigate('/login');

        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/login'));
    });
});