const express = require('express');
const Album = require('../models/Album');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

// Get all albums
router.get('/', auth, async (req, res) => {
    try {
        const albums = await Album.find();
        res.json(albums);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create new album
router.post('/new', auth, async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ msg: 'Az album neve kötelező' });
    }

    try {
        const album = new Album({ name });
        await album.save();
        res.status(201).json(album);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update album
router.put('/:id/edit', auth, async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ msg: 'Az album neve kötelező' });
    }

    try {
        const album = await Album.findById(req.params.id);
        if (!album) {
            return res.status(404).json({ msg: 'Az album nem található' });
        }

        album.name = name;
        await album.save();
        res.json({ msg: 'Az album sikeresen frissítve', album });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete album
router.delete('/:id/delete', auth, async (req, res) => {
    try {
        const album = await Album.findById(req.params.id);
        if (!album) {
            return res.status(404).json({ msg: 'Az album nem található' });
        }

        await album.deleteOne(); // Az album törlése

        res.json({ msg: 'Az album sikeresen törölve' });
    } catch (err) {
        console.error('Hiba az album törlése során:', err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;