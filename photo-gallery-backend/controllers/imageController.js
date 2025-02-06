const imageService = require('../services/imageService');

const getAllImages = async (req, res) => {
    try {
        const images = await imageService.getAllImages();
        res.json(images);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getImageById = async (req, res) => {
    try {
        const image = await imageService.getImageById(req.params.id);
        if (!image) {
            return res.status(404).json({ msg: 'A kép nem található' });
        }
        res.json(image);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const createImage = async (req, res) => {
    const { src } = req.body;

    try {
        const newImage = await imageService.createImage(src, req.user.id);
        res.status(201).json(newImage);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateImage = async (req, res) => {
    try {
        const updatedImage = await imageService.updateImage(req.params.id, req.body.src, req.user.id);
        res.json(updatedImage);
    } catch (err) {
        res.status(err.status || 500).json({ error: err.message });
    }
};

const deleteImage = async (req, res) => {
    try {
        const deletedImage = await imageService.deleteImage(req.params.id, req.user.id);
        res.json(deletedImage);
    } catch (err) {
        res.status(err.status || 500).json({ error: err.message });
    }
};

const addComment = async (req, res) => {
    try {
        const { comment } = req.body;
        const newComment = await imageService.addComment(req.params.id, comment, req.user.id);
        res.json(newComment);
    } catch (err) {
        res.status(err.status || 500).json({ error: err.message });
    }
};

const deleteComment = async (req, res) => {
    try {
        const updatedImage = await imageService.deleteComment(req.params.imageId, req.params.commentId, req.user.id);
        res.json(updatedImage);
    } catch (err) {
        res.status(err.status || 500).json({ error: err.message });
    }
};

const assignAlbum = async (req, res) => {
    try {
        const updatedImage = await imageService.assignAlbum(req.params.id, req.body.albumId);
        res.json(updatedImage);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getImagesByAlbum = async (req, res) => {
    try {
        const images = await imageService.getImagesByAlbum(req.params.albumId);
        res.json(images);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getAllImages,
    getImageById,
    createImage,
    updateImage,
    deleteImage,
    addComment,
    deleteComment,
    assignAlbum,
    getImagesByAlbum,
};
