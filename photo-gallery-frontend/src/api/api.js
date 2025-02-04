import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000' });

API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export const addComment = (imageId, comment) => API.post(`/images/${imageId}/comment`, { comment });
export const deleteComment = (imageId, commentId) => API.delete(`/images/${imageId}/comment/${commentId}`);
export const fetchImages = () => API.get('/images');
export const uploadImage = (imageData) => API.post('/images/new', imageData);
export const updateImage = (id, updatedData) => API.put(`/images/${id}/edit`, updatedData);
export const deleteImage = (id) => API.delete(`/images/${id}/delete`);
export const fetchAlbums = () => API.get('/albums');
export const createAlbum = (albumData) => API.post('/albums/new', albumData);
export const updateAlbum = (id, albumData) => API.put(`/albums/${id}/edit`, albumData);
export const deleteAlbum = (id) => API.delete(`/albums/${id}/delete`);
export const login = (formData) => API.post('/auth/login', formData);
export const register = (formData) => API.post('/auth/register', formData);
export const assignImageToAlbum = (imageId, albumId) => API.put(`/images/${imageId}/assignAlbum`, { albumId });
export const fetchImagesByAlbum = (albumId) => API.get(`/images/album/${albumId}`);