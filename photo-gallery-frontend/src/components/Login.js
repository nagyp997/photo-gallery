import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/api';
import { Container, TextField, Button, Typography, Box, Paper } from '@mui/material';

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
            const { data } = await login(formData);
            console.log('Bejelentkezési válasz:', data);
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data.user._id); // Felhasználó ID elmentése
            navigate('/gallery');
        } catch (err) {
            setError('Hibás felhasználónév vagy jelszó!');
            console.error('Bejelentkezési hiba:', err);
        }
    };


    return (
        <Container maxWidth="sm">
            <Paper elevation={3} style={{ padding: '20px', marginTop: '50px', textAlign: 'center' }}>
                <Typography variant="h4" gutterBottom>Bejelentkezés</Typography>
                <form onSubmit={handleSubmit}>
                    <Box mb={2}>
                        <TextField
                            fullWidth
                            label="Felhasználónév"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            variant="outlined"
                        />
                    </Box>
                    <Box mb={2}>
                        <TextField
                            fullWidth
                            type="password"
                            label="Jelszó"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            variant="outlined"
                        />
                    </Box>
                    {error && <Typography color="error">{error}</Typography>}
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Bejelentkezés
                    </Button>
                </form>
                <Button onClick={() => navigate('/register')} color="secondary">
                    Nincs még fiókod? Regisztrálj itt!
                </Button>
            </Paper>
        </Container>
    );
};

export default Login;
