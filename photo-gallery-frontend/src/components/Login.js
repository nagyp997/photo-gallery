import React, { useState } from 'react';
import { login } from '../api/api'; // Az API hívás a backendhez
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await login(formData); // API hívás a backendhez
            localStorage.setItem('token', data.token); // A token elmentése
            navigate('/gallery'); // Sikeres bejelentkezés után irányítás a galériába
        } catch (err) {
            setError('Hibás felhasználónév vagy jelszó');
            console.error(err);
        }
    };

    return (
        <div>
            <h2>Bejelentkezés</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Felhasználónév:</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Jelszó:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">Bejelentkezés</button>
            </form>
            {error && <p>{error}</p>}
        </div>
    );
};

export default Login;
