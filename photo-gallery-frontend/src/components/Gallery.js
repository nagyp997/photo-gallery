import React, { useState, useEffect } from 'react';
import { fetchImages, uploadImage, updateImage, deleteImage } from '../api/api';
import {
    Grid, Card, CardMedia, CardContent, CardActions, Button, TextField, Typography, CircularProgress, Box, Alert
} from '@mui/material';

const Gallery = () => {
    const [images, setImages] = useState([]);
    const [error, setError] = useState(null);
    const [newImage, setNewImage] = useState('');
    const [editImage, setEditImage] = useState({ id: null, src: '' });
    const [loading, setLoading] = useState(true);
    const [alertMessage, setAlertMessage] = useState(null);

    const loggedInUserId = localStorage.getItem('userId');

    useEffect(() => {
        getImages();
    }, []);

    const getImages = async () => {
        setLoading(true);
        try {
            const { data } = await fetchImages();
            setImages(data);
        } catch (err) {
            setError('Nem sikerült betölteni a képeket.');
            console.error('Hiba történt:', err);
        }
        setLoading(false);
    };

    const handleUpload = async () => {
        if (!newImage) return alert('Adj meg egy kép URL-t vagy fájlnevet!');
        try {
            await uploadImage({ src: newImage });
            setNewImage('');
            getImages();
        } catch (err) {
            console.error('Hiba történt a kép feltöltésekor:', err);
        }
    };

    const handleEdit = async (id, authorId) => {
        if (loggedInUserId !== authorId) {
            setAlertMessage({ type: 'error', text: '❌ Nincs jogosultságod módosítani ezt a képet!' });
            return;
        }

        if (!editImage.src) return alert('Adj meg egy új kép URL-t!');
        try {
            await updateImage(id, { src: editImage.src });
            setEditImage({ id: null, src: '' });
            getImages();
        } catch (err) {
            console.error('Hiba történt a kép módosításakor:', err);
        }
    };

    const handleDelete = async (id, authorId) => {
        if (loggedInUserId !== authorId) {
            setAlertMessage({ type: 'error', text: '❌ Nincs jogosultságod törölni ezt a képet!' });
            return;
        }

        try {
            await deleteImage(id);
            getImages();
        } catch (err) {
            console.error('Hiba történt a kép törlésekor:', err);
        }
    };

    return (
        <Box p={3}>
            <Typography variant="h4" align="center" gutterBottom>Galéria</Typography>

            {/* Figyelmeztetések megjelenítése */}
            {alertMessage && (
                <Alert severity={alertMessage.type} onClose={() => setAlertMessage(null)} sx={{ mb: 2 }}>
                    {alertMessage.text}
                </Alert>
            )}

            {/* Új kép feltöltése */}
            <Box display="flex" justifyContent="center" mb={3}>
                <TextField
                    label="Kép URL vagy fájlnév"
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    variant="outlined"
                    size="small"
                    sx={{ mr: 2, width: '300px' }}
                />
                <Button variant="contained" color="primary" onClick={handleUpload}>
                    Feltöltés
                </Button>
            </Box>

            {/* Betöltési animáció */}
            {loading && <Box display="flex" justifyContent="center" mt={3}><CircularProgress /></Box>}

            {/* Hibakezelés */}
            {error && <Typography color="error" align="center">{error}</Typography>}

            {/* Képek megjelenítése rácsos elrendezésben */}
            <Grid container spacing={3} justifyContent="center">
                {images.map((image) => (
                    <Grid item key={image._id} xs={12} sm={6} md={4} lg={3}>
                        <Card>
                            <CardMedia
                                component="img"
                                height="200"
                                image={image.src.startsWith('http') ? image.src : `http://localhost:5000/uploads/${image.src}`}
                                alt="Kép"
                            />
                            <CardContent>
                                <Typography variant="subtitle1">Szerző: {image.author.username}</Typography>
                            </CardContent>
                            <CardActions>
                                {editImage.id === image._id ? (
                                    <Box display="flex" width="100%">
                                        <TextField
                                            size="small"
                                            fullWidth
                                            value={editImage.src}
                                            onChange={(e) => setEditImage({ ...editImage, src: e.target.value })}
                                        />
                                        <Button onClick={() => handleEdit(image._id, image.author._id)} color="primary">
                                            Mentés
                                        </Button>
                                    </Box>
                                ) : (
                                    <Button size="small" onClick={() => setEditImage({ id: image._id, src: image.src })}>
                                        Módosítás
                                    </Button>
                                )}
                                <Button size="small" color="error" onClick={() => handleDelete(image._id, image.author._id)}>
                                    Törlés
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default Gallery;
