import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000' });

API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export const fetchImages = () => API.get('/images');
export const uploadImage = (imageData) => API.post('/images/new', imageData);
export const updateImage = (id, updatedData) => API.put(`/images/${id}/edit`, updatedData);
export const deleteImage = (id) => API.delete(`/images/${id}/delete`);
export const fetchAlbums = () => API.get('/albums');
export const login = (formData) => API.post('/auth/login', formData);
export const register = (formData) => API.post('/auth/register', formData);