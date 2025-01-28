import React, { useState, useEffect } from 'react';
import { fetchImages } from '../api/api';

const Gallery = () => {
    const [images, setImages] = useState([]);

    useEffect(() => {
        const getImages = async () => {
            const { data } = await fetchImages();
            setImages(data);
        };
        getImages();
    }, []);

    return (
        <div>
            {images.map((image) => (
                <div key={image._id}>
                    <img src={image.src} alt="Gallery item" />
                </div>
            ))}
        </div>
    );
};

export default Gallery;