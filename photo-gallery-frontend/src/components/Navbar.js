import React from 'react';
import { AppBar, Toolbar, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token'); // Token törlése
        navigate('/login'); // Átirányítás a bejelentkezési oldalra
    };

    return (
        <AppBar position="static" style={{ marginBottom: '20px' }}>
            <Toolbar>
                {token ? (
                    <>
                        <Button color="inherit" onClick={() => navigate('/gallery')}>Galéria</Button>
                        <Button color="inherit" onClick={() => navigate('/albums')}>Albumok</Button>
                        <Button color="inherit" onClick={handleLogout}>Kijelentkezés</Button>
                    </>
                ) : (
                    <>
                        <Button color="inherit" onClick={() => navigate('/login')}>Bejelentkezés</Button>
                        <Button color="inherit" onClick={() => navigate('/register')}>Regisztráció</Button>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
