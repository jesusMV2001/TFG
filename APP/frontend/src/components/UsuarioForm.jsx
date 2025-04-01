import { useState } from 'react';
import api from '../api';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';
import { useNavigate } from 'react-router-dom';
import '../styles/Form.css';

function Form({ route, method }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState(''); // Estado para manejar errores
    const navigate = useNavigate();

    const name = method === 'login' ? 'Login' : 'Register';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Limpiar errores previos

        // Validar que la contraseña tenga al menos 8 caracteres
        if (method === 'register' && password.length < 8) {
            setError('La contraseña debe tener al menos 8 caracteres.');
            return;
        }

        try {
            const payload = { username, password };
            if (method === 'register') {
                payload.email = email;
            }

            const res = await api.post(route, payload);
            if (method === 'login') {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
            }
            navigate('/');
        } catch (error) {
            if (error.response && error.response.data.error) {
                setError(error.response.data.error); // Mostrar mensaje de error del backend
            } else {
                setError('Usuario o contraseña incorrectos.'); // Mostrar mensaje de error genérico
            }
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <h1>{name}</h1>
            {error && <p className="form-error">{error}</p>} {/* Mostrar mensaje de error */}
            <input
                className="form-input"
                type="text"
                placeholder="Username"
                value={username}
                required
                onChange={(e) => setUsername(e.target.value)}
            />
            {method === 'register' && (
                <input
                    className="form-input"
                    type="email"
                    placeholder="Email"
                    value={email}
                    required
                    onChange={(e) => setEmail(e.target.value)}
                />
            )}
            <input
                className="form-input"
                type="password"
                placeholder="Password"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
            />
            <button
                className="form-button"
                type="submit"
            >
                {name}
            </button>
        </form>
    );
}

export default Form;