import React, { useState, useEffect } from 'react';
import { fetchImages, uploadImage, updateImage, deleteImage, addComment, deleteComment, assignImageToAlbum, fetchAlbums } from '../api/api';
import {
    Grid, Card, CardMedia, CardContent, CardActions, Button, TextField, Typography, CircularProgress, Box, Alert, List, ListItem, IconButton, Dialog, DialogContent, DialogActions, MenuItem, Select
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const Gallery = () => {
    const [images, setImages] = useState([]);
    const [error, setError] = useState(null);
    const [newImage, setNewImage] = useState('');
    const [editImage, setEditImage] = useState({ id: null, src: '' });
    const [commentText, setCommentText] = useState({});
    const [alertMessage, setAlertMessage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [albums, setAlbums] = useState([]);
    const [selectedAlbum, setSelectedAlbum] = useState({});
    const loggedInUserId = localStorage.getItem('userId');

    useEffect(() => {
        getImages();

        const getAlbums = async () => {
            try {
                const { data } = await fetchAlbums();
                if (Array.isArray(data)) {
                    setAlbums(data);
                } else {
                    console.error("Nem tömbként érkezett az albumok adata:", data);
                    setAlbums([]);
                }
            } catch (err) {
                console.error('Hiba az albumok betöltésekor:', err);
                setAlbums([]);
            }
        };

        getAlbums();
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

    const handleAssignToAlbum = async (imageId) => {
        try {
            await assignImageToAlbum(imageId, selectedAlbum[imageId]);
            getImages();
        } catch (err) {
            console.error('Hiba az album hozzárendelésekor:', err);
        }
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
            setAlertMessage({ type: 'error', text: 'Nincs jogosultságod módosítani ezt a képet!' });
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
            setAlertMessage({ type: 'error', text: 'Nincs jogosultságod törölni ezt a képet!' });
            return;
        }

        try {
            await deleteImage(id);
            getImages();
        } catch (err) {
            console.error('Hiba történt a kép törlésekor:', err);
        }
    };

    const handleCommentSubmit = async (imageId) => {
        if (!commentText[imageId]) return;

        try {
            console.log(`Komment küldése képhez (ID: ${imageId}):`, commentText[imageId]);

            await addComment(imageId, commentText[imageId]);
            setCommentText({ ...commentText, [imageId]: '' });

            getImages();
        } catch (err) {
            console.error('Hiba történt a komment küldésekor:', err);
        }
    };

    const handleDeleteComment = async (imageId, commentId, authorId) => {
        if (loggedInUserId !== authorId) {
            setAlertMessage({ type: 'error', text: 'Nincs jogosultságod törölni ezt a kommentet!' });
            return;
        }

        try {
            await deleteComment(imageId, commentId);
            getImages();
        } catch (err) {
            console.error('Hiba történt a komment törlésekor:', err);
        }
    };

    const handleImageClick = (image) => {
        setSelectedImage(image);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedImage(null);
    };

    return (
        <Box p={3}>
            <Typography variant="h4" align="center" gutterBottom>Galéria</Typography>

            {alertMessage && (
                <Alert severity={alertMessage.type} onClose={() => setAlertMessage(null)} sx={{ mb: 2 }}>
                    {alertMessage.text}
                </Alert>
            )}

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

            {loading && <Box display="flex" justifyContent="center" mt={3}><CircularProgress /></Box>}

            {error && <Typography color="error" align="center">{error}</Typography>}

            <Grid container spacing={3} justifyContent="center">
                {images.map((image) => (
                    <Grid item key={image._id} xs={12} sm={6} md={4} lg={3}>
                        <Card>
                            <CardMedia
                                component="img"
                                height="200"
                                image={image.src.startsWith('http') ? image.src : `http://localhost:5000/uploads/${image.src}`}
                                alt="Kép"
                                onClick={() => handleImageClick(image)}
                                sx={{ cursor: 'pointer' }}
                            />
                            <CardContent>
                                <Typography variant="subtitle1">Szerző: {image.author.username}</Typography>

                                <List
                                    sx={{
                                        maxHeight: '150px',
                                        minHeight: '150px',
                                        overflowY: 'auto',
                                        border: '1px solid #ddd',
                                        padding: '5px',
                                        borderRadius: '4px',
                                        backgroundColor: '#f9f9f9',
                                        mb: 2
                                    }}
                                >
                                    {image.comments.length > 0 ? (
                                        image.comments.map((comment) => (
                                            <ListItem key={comment._id} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <Typography variant="body2">
                                                    {comment.comment} - <strong>{comment.author?.username || "Ismeretlen"}</strong>
                                                </Typography>
                                                {loggedInUserId === comment.author?._id && (
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        onClick={() => handleDeleteComment(image._id, comment._id, comment.author._id)}
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                )}
                                            </ListItem>
                                        ))
                                    ) : (
                                        <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center' }}>
                                            Nincsenek hozzászólások
                                        </Typography>
                                    )}
                                </List>

                                <TextField
                                    size="small"
                                    fullWidth
                                    label="Hozzászólás"
                                    value={commentText[image._id] || ''}
                                    onChange={(e) => setCommentText({ ...commentText, [image._id]: e.target.value })}
                                    variant="outlined"
                                    sx={{
                                        mb: 1
                                    }}
                                />
                                <Button
                                    variant="contained"
                                    size="small"
                                    color="primary"
                                    onClick={() => handleCommentSubmit(image._id)}
                                    sx={{
                                        mt: 1
                                    }}
                                >
                                    Küldés
                                </Button>

                                <Typography variant="subtitle1"
                                            sx={{
                                                mt: 2
                                            }}
                                >Album:</Typography>
                                <Select
                                    value={selectedAlbum[image._id] || image.album || ''}
                                    onChange={(e) => setSelectedAlbum({ ...selectedAlbum, [image._id]: e.target.value })}
                                    displayEmpty
                                    fullWidth
                                >
                                    <MenuItem value="">
                                        {image.album ? albums.find((album) => album._id === image.album)?.name || "Nincs album" : "Válassz a listából"}
                                    </MenuItem>
                                    {albums.map((album) => (
                                        <MenuItem key={album._id} value={album._id}>
                                            {album.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <Button size="small" onClick={() => handleAssignToAlbum(image._id)}>Hozzárendelés</Button>
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
            <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth="md" fullWidth>
                <DialogContent>
                    {selectedImage && (
                        <img
                            src={selectedImage.src.startsWith('http') ? selectedImage.src : `http://localhost:5000/uploads/${selectedImage.src}`}
                            alt="Kép nagyban"
                            style={{ width: '100%', height: 'auto', borderRadius: '4px' }}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="primary">Bezárás</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Gallery;
