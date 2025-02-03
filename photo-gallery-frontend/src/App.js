import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Gallery from './components/Gallery';
import Album from './components/Album';
import Navbar from './components/Navbar';

const isAuthenticated = () => !!localStorage.getItem('token');

const ProtectedRoute = ({ element }) => {
    return isAuthenticated() ? element : <Navigate to="/login" />;
};

const RedirectIfAuthenticated = ({ element }) => {
    return isAuthenticated() ? <Navigate to="/gallery" /> : element;
};

const App = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<RedirectIfAuthenticated element={<Login />} />} />
                <Route path="/login" element={<RedirectIfAuthenticated element={<Login />} />} />
                <Route path="/register" element={<RedirectIfAuthenticated element={<Register />} />} />
                <Route path="/gallery" element={<ProtectedRoute element={<Gallery />} />} />
                <Route path="/albums" element={<ProtectedRoute element={<Album />} />} />
            </Routes>
        </Router>
    );
};

export default App;
