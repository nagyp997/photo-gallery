import React, { useState, useEffect } from 'react';
import { fetchAlbums } from '../api/api';

const Album = () => {
    const [albums, setAlbums] = useState([]);

    useEffect(() => {
        const getAlbums = async () => {
            const { data } = await fetchAlbums();
            setAlbums(data);
        };
        getAlbums();
    }, []);

    return (
        <div>
            {albums.map((album) => (
                <div key={album._id}>
                    <h2>Album by {album.author}</h2>
                    {album.images.map((image) => (
                        <img key={image} src={image.src} alt="Album item" />
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Album;