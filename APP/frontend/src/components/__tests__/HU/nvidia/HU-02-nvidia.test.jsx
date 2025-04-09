// /home/jesus/python/TFG/APP/frontend/src/components/__tests__/HU/nvidia/HU-02-nvidia.test.jsx

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UsuarioForm from '../../../UsuarioForm';
import api from '../../../../api';
import { BrowserRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';

vi.mock('../../../../api');
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => vi.fn(),
    };
});

describe('HU-02: Inicio de Sesión y Autenticación', () => {
    beforeEach(() => {
        // Mockear respuestas de la API
        api.post.mockReset();
    });

    it('debe iniciar sesión con credenciales válidas', async () => {
        // Configurar el mock para retornar un token de acceso válido
        api.post.mockResolvedValue({
            data: {
                access: 'token_de_acceso_válido',
                refresh: 'refresh_token_válido',
            },
        });

        render(
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<UsuarioForm route="/api/token/" method="login" />} />
                </Routes>
            </BrowserRouter>
        );

        // Rellenar el formulario con credenciales válidas
        const usernameInput = screen.getByPlaceholderText('Username');
        const passwordInput = screen.getByPlaceholderText('Password');
        fireEvent.change(usernameInput, { target: { value: 'usuario_valido' } });
        fireEvent.change(passwordInput, { target: { value: 'contraseña_válida' } });

        //.Submit el formulario
        const submitButton = screen.getByText('Login');
        fireEvent.click(submitButton);

        // Esperar a que la API responda y el token sea guardado en localStorage
        await waitFor(() => expect(localStorage.getItem('access_token')).toBe('token_de_acceso_válido'));
    });

    it('debe mostrar un mensaje de error con credenciales incorrectas', async () => {
        // Configurar el mock para retornar un error de credenciales incorrectas
        api.post.mockRejectedValue({
            response: {
                data: {
                    detail: 'Credenciales incorrectas',
                },
            },
        });

        render(
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<UsuarioForm route="/api/token/" method="login" />} />
                </Routes>
            </BrowserRouter>
        );

        // Rellenar el formulario con credenciales incorrectas
        const usernameInput = screen.getByPlaceholderText('Username');
        const passwordInput = screen.getByPlaceholderText('Password');
        fireEvent.change(usernameInput, { target: { value: 'usuario_invalido' } });
        fireEvent.change(passwordInput, { target: { value: 'contraseña_inválida' } });

        // Submit el formulario
        const submitButton = screen.getByText('Login');
        fireEvent.click(submitButton);

        // Esperar a que el mensaje de error sea visible
        await screen.findByText('Credenciales incorrectas');
    });

    it('debe mantener la sesión activa después de la autenticación', async () => {
        // Este test implica verificar el comportamiento de la aplicación después de la autenticación exitosa
        // Para mantenerlo sencillo, solo verificaremos si el token de acceso está presente en localStorage
        // Después de una autenticación exitosa, y si se redirige a la ruta protegida '/'

        // Configurar el mock para retornar un token de acceso válido
        api.post.mockResolvedValue({
            data: {
                access: 'token_de_acceso_válido',
                refresh: 'refresh_token_válido',
            },
        });

        render(
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<UsuarioForm route="/api/token/" method="login" />} />
                    <Route path="/" element={<div>Panel de Tareas</div>} />
                </Routes>
            </BrowserRouter>
        );

        // Rellenar el formulario con credenciales válidas
        const usernameInput = screen.getByPlaceholderText('Username');
        const passwordInput = screen.getByPlaceholderText('Password');
        fireEvent.change(usernameInput, { target: { value: 'usuario_valido' } });
        fireEvent.change(passwordInput, { target: { value: 'contraseña_válida' } });

        // Submit el formulario
        const submitButton = screen.getByText('Login');
        fireEvent.click(submitButton);

        // Esperar a que la API responda, el token sea guardado en localStorage y se redirija a '/'
        await waitFor(() => expect(localStorage.getItem('access_token')).toBe('token_de_acceso_válido'));
        await screen.findByText('Panel de Tareas');
    });
});