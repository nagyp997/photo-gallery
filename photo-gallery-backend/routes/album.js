const express = require('express');
const Album = require('../models/Album');
const Image = require('../models/Image');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

// Get all albums
router.get('/', auth, async (req, res) => {
    try {
        const albums = await Album.find().populate('author', 'username'); // 🔹 Szerző adatait is betöltjük
        res.json(albums);
    } catch (err) {
        console.error('Hiba az albumok betöltésekor:', err.message);
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
        const album = new Album({
            name,
            author: req.user.id
        });

        await album.save();
        res.status(201).json(album);
    } catch (err) {
        console.error('Hiba az album létrehozásakor:', err.message);
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

        if (album.author.toString() !== req.user.id) {
            return res.status(403).json({ msg: 'Nincs jogosultságod törölni ezt az albumot' });
        }

        await Album.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Az album sikeresen törölve' });
    } catch (err) {
        console.error('Hiba az album törlésekor:', err.message);
        res.status(500).json({ error: err.message });
    }
});

router.get('/:id/images', auth, async (req, res) => {
    try {
        const albumImages = await Image.find({ album: req.params.id }).populate('author', 'username');
        if (!albumImages.length) {
            return res.status(404).json({ msg: 'Nincsenek képek ebben az albumban' });
        }
        res.json(albumImages);
    } catch (err) {
        console.error('Hiba az album képeinek betöltésekor:', err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;