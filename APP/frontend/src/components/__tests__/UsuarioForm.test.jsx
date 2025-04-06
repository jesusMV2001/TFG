import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import UsuarioForm from '../UsuarioForm';
import { BrowserRouter } from 'react-router-dom';
import api from '../../api';

jest.mock('../../api');

describe('UsuarioForm Component', () => {
  const mockNavigate = jest.fn();
  jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
  }));

  it('renders the form with username, email (for register), and password fields', () => {
    render(
      <BrowserRouter>
        <UsuarioForm route="/api/user/register/" method="register" />
      </BrowserRouter>
    );
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
  });

  it('renders the form with username and password fields for login', () => {
    render(
      <BrowserRouter>
        <UsuarioForm route="/api/token/" method="login" />
      </BrowserRouter>
    );
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Email')).toBeNull(); // Email should not be present for login
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
  });

  it('displays an error message if password is less than 8 characters during registration', async () => {
    render(
      <BrowserRouter>
        <UsuarioForm route="/api/user/register/" method="register" />
      </BrowserRouter>
    );
    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'short' } });
    fireEvent.click(screen.getByRole('button', { name: 'Register' }));

    await waitFor(() => {
      expect(screen.getByText('La contraseña debe tener al menos 8 caracteres.')).toBeInTheDocument();
    });
  });

  it('handles successful registration', async () => {
    api.post.mockResolvedValue({ data: { message: 'Registration successful' } });
    render(
      <BrowserRouter>
        <UsuarioForm route="/api/user/register/" method="register" />
      </BrowserRouter>
    );
    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'testpassword' } });
    fireEvent.click(screen.getByRole('button', { name: 'Register' }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/api/user/register/', {
        username: 'testuser',
        email: 'test@example.com',
        password: 'testpassword',
      });
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('handles successful login and stores tokens', async () => {
    const mockAccessToken = 'mock_access_token';
    const mockRefreshToken = 'mock_refresh_token';
    api.post.mockResolvedValue({ data: { access: mockAccessToken, refresh: mockRefreshToken } });

    render(
      <BrowserRouter>
        <UsuarioForm route="/api/token/" method="login" />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'testpassword' } });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/api/token/', {
        username: 'testuser',
        password: 'testpassword',
      });
      expect(localStorage.getItem('access_token')).toBe(mockAccessToken);
      expect(localStorage.getItem('refresh_token')).toBe(mockRefreshToken);
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('displays an error message if registration fails due to existing username', async () => {
    api.post.mockRejectedValue({ response: { data: { error: 'El nombre de usuario ya está registrado.' } } });
    render(
      <BrowserRouter>
        <UsuarioForm route="/api/user/register/" method="register" />
      </BrowserRouter>
    );
    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'existinguser' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'testpassword' } });
    fireEvent.click(screen.getByRole('button', { name: 'Register' }));

    await waitFor(() => {
      expect(screen.getByText('El nombre de usuario ya está registrado.')).toBeInTheDocument();
    });
  });

  it('displays an error message if login fails due to incorrect credentials', async () => {
    api.post.mockRejectedValue({ response: { data: { error: 'Usuario o contraseña incorrectos.' } } });
    render(
      <BrowserRouter>
        <UsuarioForm route="/api/token/" method="login" />
      </BrowserRouter>
    );
    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'wronguser' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(screen.getByText('Usuario o contraseña incorrectos.')).toBeInTheDocument();
    });
  });

  it('displays a generic error message if the server returns an unexpected error', async () => {
    api.post.mockRejectedValue({ response: { data: { message: 'Internal Server Error' } } });

    render(
      <BrowserRouter>
        <UsuarioForm route="/api/user/register/" method="register" />
      </BrowserRouter>
    );
    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'testpassword' } });
    fireEvent.click(screen.getByRole('button', { name: 'Register' }));

    await waitFor(() => {
      expect(screen.getByText('Usuario o contraseña incorrectos.')).toBeInTheDocument();
    });
  });
});