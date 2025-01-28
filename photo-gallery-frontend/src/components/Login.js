import React, { useState } from 'react';
import { login } from '../api/api';

const Login = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { data } = await login(formData);
        localStorage.setItem('token', data.token);
        alert('Bejelentkezés sikeres!');
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Felhasználónév"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
            <input
                type="password"
                placeholder="Jelszó"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <button type="submit">Bejelentkezés</button>
        </form>
    );
};

export default Login;