import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../api/api';
import { Container, TextField, Button, Typography, Box, Paper } from '@mui/material';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData);
            setSuccess(true);
            setTimeout(() => navigate('/login'), 2000); // 2 mp után átirányítás a login oldalra
        } catch (err) {
            setError('A regisztráció sikertelen. Próbáld újra!');
            console.error(err);
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} style={{ padding: '20px', marginTop: '50px', textAlign: 'center' }}>
                <Typography variant="h4" gutterBottom>Regisztráció</Typography>
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
                    {success && <Typography color="success">Sikeres regisztráció! Átirányítás...</Typography>}
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Regisztráció
                    </Button>
                </form>
            </Paper>
        </Container>
    );
};

export default Register;
