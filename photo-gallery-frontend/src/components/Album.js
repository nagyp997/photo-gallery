import React, { useState, useEffect } from 'react';
import { fetchAlbums, createAlbum, updateAlbum, deleteAlbum } from '../api/api';
import { Grid, Card, CardContent, CardActions, Button, Typography, TextField, Box } from '@mui/material';

const Albums = () => {
    const [albums, setAlbums] = useState([]);
    const [newAlbum, setNewAlbum] = useState('');
    const [editAlbum, setEditAlbum] = useState({ id: null, name: '' });

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

    const handleDelete = async (id) => {
        try {
            await deleteAlbum(id);
            getAlbums();
        } catch (err) {
            console.error('Hiba az album törlésekor:', err);
        }
    };

    return (
        <Box p={3}>
            <Typography variant="h4" align="center" gutterBottom>Albumok</Typography>

            {/* Új album létrehozása */}
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

            {/* Albumok megjelenítése */}
            <Grid container spacing={3} justifyContent="center">
                {albums.map((album) => (
                    <Grid item key={album._id} xs={12} sm={6} md={4} lg={3}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">{album.name || "Nincs név megadva"}</Typography>
                            </CardContent>
                            <CardActions>
                                {editAlbum.id === album._id ? (
                                    <Box display="flex" width="100%">
                                        <TextField
                                            size="small"
                                            fullWidth
                                            value={editAlbum.name}
                                            onChange={(e) => setEditAlbum({ ...editAlbum, name: e.target.value })}
                                        />
                                        <Button onClick={() => handleEdit(album._id)} color="primary">
                                            Mentés
                                        </Button>
                                    </Box>
                                ) : (
                                    <Button size="small" onClick={() => setEditAlbum({ id: album._id, name: album.name })}>
                                        Szerkesztés
                                    </Button>
                                )}
                                <Button size="small" color="error" onClick={() => handleDelete(album._id)}>
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

export default Albums;
