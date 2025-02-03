import React, { useState, useEffect } from 'react';
import { fetchAlbums } from '../api/api';

const Album = () => {
    const [albums, setAlbums] = useState([]);

    useEffect(() => {
        const getAlbums = async () => {
            try {
                const { data } = await fetchAlbums();
                setAlbums(data);
            } catch (err) {
                console.error('Nem sikerült betölteni az albumokat:', err);
            }
        };

        getAlbums();
    }, []);

    return (
        <div>
            {albums.map((album) => (
                <div key={album._id}>
                    <h2>Album: {album.name}</h2>
                </div>
            ))}
        </div>
    );
};

export default Album;