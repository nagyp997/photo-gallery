const albumService = require('../services/albumService');

const getAllAlbums = async (req, res) => {
    try {
        const albums = await albumService.getAllAlbums();
        res.json(albums);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const createAlbum = async (req, res) => {
    try {
        const newAlbum = await albumService.createAlbum(req.body, req.user);
        res.status(201).json(newAlbum);
    } catch (err) {
        res.status(err.status || 500).json({ msg: err.message });
    }
};

const updateAlbum = async (req, res) => {
    try {
        const updatedAlbum = await albumService.updateAlbum(req.params.id, req.body, req.user);
        res.json(updatedAlbum);
    } catch (err) {
        res.status(err.status || 500).json({ msg: err.message });
    }
};

const deleteAlbum = async (req, res) => {
    try {
        const deletedAlbum = await albumService.deleteAlbum(req.params.id, req.user);
        res.json(deletedAlbum);
    } catch (err) {
        res.status(err.status || 500).json({ msg: err.message });
    }
};

const getImagesByAlbum = async (req, res) => {
    try {
        const albumImages = await albumService.getImagesByAlbum(req.params.id);
        if (!albumImages.length) {
            return res.status(404).json({ msg: 'Nincsenek képek ebben az albumban' });
        }
        res.json(albumImages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getAllAlbums,
    createAlbum,
    updateAlbum,
    deleteAlbum,
    getImagesByAlbum,
};
