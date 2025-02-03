import React, { useState, useEffect } from 'react';
import { fetchImages, uploadImage, updateImage, deleteImage } from '../api/api';

const Gallery = () => {
    const [images, setImages] = useState([]);
    const [error, setError] = useState(null);
    const [newImage, setNewImage] = useState('');
    const [editImage, setEditImage] = useState({ id: null, src: '' });

    const getImages = async () => {
        try {
            const { data } = await fetchImages();
            setImages(data);
        } catch (err) {
            setError('Nem sikerült betölteni a képeket.');
            console.error('Hiba történt:', err);
        }
    };


    useEffect(() => {
        getImages();
    }, []);

    const handleUpload = async () => {
        if (!newImage) return alert('Adj meg egy kép URL-t vagy fájlnévet!');
        try {
            await uploadImage({ src: newImage });
            setNewImage('');
            getImages();
        } catch (err) {
            console.error('Hiba történt a kép feltöltésekor:', err);
        }
    };

    const handleEdit = async (id) => {
        if (!editImage.src) return alert('Adj meg egy új kép URL-t!');
        try {
            await updateImage(id, { src: editImage.src });
            setEditImage({ id: null, src: '' });
            getImages();
        } catch (err) {
            console.error('Hiba történt a kép módosításakor:', err);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteImage(id);
            getImages();
        } catch (err) {
            console.error('Hiba történt a kép törlésekor:', err);
        }
    };

    return (
        <div>
            <h1>Galéria</h1>

            <div>
                <input
                    type="text"
                    placeholder="Kép URL vagy fájlnév"
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                />
                <button onClick={handleUpload}>Feltöltés</button>
            </div>

            {error && <p>{error}</p>}

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {images.map((image) => (
                    <div key={image._id} style={{ border: '1px solid black', padding: '10px' }}>
                        <img
                            src={image.src.startsWith('http') ? image.src : `http://localhost:5000/uploads/${image.src}`}
                            alt="Gallery item"
                            style={{ width: '200px', height: '200px', objectFit: 'cover' }}
                        />
                        <p>Szerző: {image.author?.username || 'Ismeretlen'}</p>

                        {editImage.id === image._id ? (
                            <div>
                                <input
                                    type="text"
                                    value={editImage.src}
                                    onChange={(e) => setEditImage({ ...editImage, src: e.target.value })}
                                />
                                <button onClick={() => handleEdit(image._id)}>Mentés</button>
                            </div>
                        ) : (
                            <button onClick={() => setEditImage({ id: image._id, src: image.src })}>
                                Módosítás
                            </button>
                        )}

                        <button onClick={() => handleDelete(image._id)}>Törlés</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Gallery;
