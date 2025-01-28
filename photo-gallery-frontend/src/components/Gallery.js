import React, { useState, useEffect } from 'react';
import { fetchImages } from '../api/api';

const Gallery = () => {
    const [images, setImages] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getImages = async () => {
            try {
                const { data } = await fetchImages(); // Lekéri az adatokat a szerverről
                setImages(data); // Beállítja az állapotot a kapott képek alapján
            } catch (err) {
                setError('Nem sikerült betölteni a képeket.');
                console.error('Hiba történt:', err);
            }
        };

        getImages();
    }, []);

    return (
        <div>
            {error && <p>{error}</p>}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {images.map((image) => (
                    <div key={image._id}>
                        <img
                            src={`http://localhost:5000/uploads/${image.src}`} // A `src` alapján jeleníti meg a képet
                            alt="Gallery item"
                            style={{ width: '200px', height: '200px', objectFit: 'cover' }}
                        />
                        <p>Author: {image.author}</p>
                        <ul>
                            {image.comments.map((comment) => (
                                <li key={comment._id}>
                                    {comment.comment} - {new Date(comment.createdAt).toLocaleDateString()}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Gallery;
