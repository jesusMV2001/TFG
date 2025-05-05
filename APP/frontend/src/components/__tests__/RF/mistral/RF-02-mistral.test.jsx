// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/RF/mistral/RF-02-mistral.test.jsx
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

describe('RF-02: Validación de correo electrónico', () => {
    it('debe mostrar un mensaje de error si el correo electrónico ya está registrado', async () => {
        const mockError = {
            response: {
                data: {
                    error: 'El correo electrónico ya está registrado.',
                },
            },
        };

        api.post.mockRejectedValue(mockError);

        render(
            <BrowserRouter>
                <UsuarioForm route="/api/user/register/" method="register" />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
        fireEvent.submit(screen.getByText('Register'));

        await waitFor(() => {
            expect(screen.getByText('El correo electrónico ya está registrado.')).toBeInTheDocument();
        });
    });

    it('debe mostrar un mensaje de error si el correo electrónico ya está registrado con otro mensaje de error', async () => {
        const mockError = {
            response: {
                data: {
                    error: 'El correo electrónico ya está en uso.',
                },
            },
        };

        api.post.mockRejectedValue(mockError);

        render(
            <BrowserRouter>
                <UsuarioForm route="/api/user/register/" method="register" />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
        fireEvent.submit(screen.getByText('Register'));

        await waitFor(() => {
            expect(screen.getByText('El correo electrónico ya está en uso.')).toBeInTheDocument();
        });
    });
});