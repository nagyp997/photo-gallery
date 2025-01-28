const express = require('express');
const Album = require('../models/Album');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

// Get all albums
router.get('/', auth, async (req, res) => {
    try {
        const albums = await Album.find().populate('images');
        res.json(albums);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create new album
router.post('/new', auth, async (req, res) => {
    const { images } = req.body;
    try {
        const album = new Album({ images, author: req.user.id });
        await album.save();
        res.status(201).json(album);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;