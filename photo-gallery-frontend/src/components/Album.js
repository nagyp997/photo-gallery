import React, { useState, useEffect } from 'react';
import { fetchAlbums, fetchImagesByAlbum, createAlbum, updateAlbum, deleteAlbum } from '../api/api';
import { Grid, Card, CardContent, CardActions, Button, Typography, TextField, Box, CardMedia } from '@mui/material';

const Albums = () => {
    const [albums, setAlbums] = useState([]);
    const [newAlbum, setNewAlbum] = useState('');
    const [editAlbum, setEditAlbum] = useState({ id: null, name: '' });
    const [selectedImages, setSelectedImages] = useState([]);
    const loggedInUserId = localStorage.getItem('userId');

    useEffect(() => {
        getAlbums();
    }, []);

    const getAlbums = async () => {
        try {
            const { data } = await fetchAlbums();
            setAlbums(data);
        } catch (err) {
            console.error('Hiba az albumok betöltésekor:', err);
        }
    };

    const handleCreate = async () => {
        if (!newAlbum) return alert('Adj meg egy album nevet!');
        try {
            await createAlbum({ name: newAlbum });
            setNewAlbum('');
            getAlbums();
        } catch (err) {
            console.error('Hiba az album létrehozásakor:', err);
        }
    };

    const handleEdit = async (id) => {
        if (!editAlbum.name) return alert('Adj meg egy album nevet!');
        try {
            await updateAlbum(id, { name: editAlbum.name });
            setEditAlbum({ id: null, name: '' });
            getAlbums();
        } catch (err) {
            console.error('Hiba az album szerkesztésekor:', err);
        }
    };

    const handleDelete = async (id, authorId) => {
        if (loggedInUserId !== authorId) {
            alert('Nincs jogosultságod törölni ezt az albumot!');
            return;
        }

        try {
            await deleteAlbum(id);
            getAlbums(); // Frissítjük az albumok listáját
        } catch (err) {
            console.error('Hiba történt az album törlésekor:', err);
        }
    };

    const handleViewImages = async (albumId) => {
        try {
            const { data } = await fetchImagesByAlbum(albumId);
            setSelectedImages(data);
        } catch (err) {
            console.error('Hiba az album képeinek betöltésekor:', err);
        }
    };

    return (
        <Box p={3}>
            <Typography variant="h4" align="center" gutterBottom>Albumok</Typography>

            <Box display="flex" justifyContent="center" mb={3}>
                <TextField
                    label="Új album neve"
                    value={newAlbum}
                    onChange={(e) => setNewAlbum(e.target.value)}
                    variant="outlined"
                    size="small"
                    sx={{ mr: 2, width: '300px' }}
                />
                <Button variant="contained" color="primary" onClick={handleCreate}>
                    Létrehozás
                </Button>
            </Box>

            <Grid container spacing={3} justifyContent="center">
                {albums.length === 0 ? (
                    <Typography variant="h6" color="textSecondary">Nincsenek albumok</Typography>
                ) : (
                    albums.map((album) => (
                        <Grid item key={album._id} xs={12} sm={6} md={4} lg={3}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">{album.name || "Nincs név megadva"}</Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Szerző: {album.author && album.author.username ? album.author.username : "Ismeretlen"}
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleViewImages(album._id)}
                                        sx={{ mt: 1 }}
                                    >
                                        Képek megtekintése
                                    </Button>
                                </CardContent>

                                {album.author?._id === loggedInUserId && (
                                    <Button size="small" color="error" onClick={() => handleDelete(album._id, album.author._id)}>
                                        Törlés
                                    </Button>
                                )}
                            </Card>
                        </Grid>
                    ))
                )}
            </Grid>

            {selectedImages.length > 0 && (
                <Box mt={4}>
                    <Typography variant="h5">Album képei</Typography>
                    <Grid container spacing={2}>
                        {selectedImages.map((image) => (
                            <Grid item key={image._id} xs={12} sm={6} md={4} lg={3}>
                                <Card>
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image={image.src.startsWith('http') ? image.src : `http://localhost:5000/uploads/${image.src}`}
                                        alt="Kép"
                                    />
                                    <CardContent>
                                        <Typography variant="subtitle1">
                                            Szerző: {image.author && image.author.username ? image.author.username : "Ismeretlen"}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}
        </Box>
    );
};

export default Albums;
