const express = require('express');
const Image = require('../models/Image');
const auth = require('../middleware/authMiddleware');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const axios = require('axios');

// Get all images
router.get('/', auth, async (req, res) => {
    try {
        const images = await Image.find().populate('author', 'username');
        res.json(images);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//Search by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const image = await Image.findById(req.params.id);
        if (!image) return res.status(404).json({ msg: 'A kép nem található' });
        res.json(image);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create new image
router.post('/new', auth, async (req, res) => {
    const { src } = req.body;

    try {
        // Ha a src egy URL (nem egy helyi fájlnév), akkor mentjük az URL-t
        if (src.startsWith('http')) {
            const image = new Image({ src, author: req.user.id });
            await image.save();
            return res.status(201).json(image);
        }

        // Ha a src egy helyi fájlnév (uploads mappából), akkor azt mentjük
        const filePath = path.join(__dirname, '../uploads', src);
        if (!fs.existsSync(filePath)) {
            return res.status(400).json({ msg: 'A fájl nem létezik az uploads mappában' });
        }

        const image = new Image({ src, author: req.user.id });
        await image.save();
        res.status(201).json(image);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});


//Modify image data
router.put('/:id/edit', auth, async (req, res) => {
    try {
        const { src } = req.body;
        let image = await Image.findById(req.params.id);
        if (!image) return res.status(404).json({ msg: 'A kép nem található' });

        // Ellenőrizzük, hogy a felhasználó azonos-e a kép szerzőjével
        if (image.author.toString() !== req.user.id) {
            return res.status(403).json({ msg: 'Nincs jogosultságod szerkeszteni ezt a képet' });
        }

        image.src = src || image.src;
        await image.save();
        res.json(image);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.delete('/:id/delete', auth, async (req, res) => {
    try {
        console.log('Törlési kérés érkezett:', req.params.id);

        const image = await Image.findById(req.params.id);
        if (!image) {
            console.log('A kép nem található az adatbázisban.');
            return res.status(404).json({ msg: 'A kép nem található' });
        }

        if (image.author.toString() !== req.user.id) {
            console.log('Nincs jogosultság a kép törléséhez.');
            return res.status(403).json({ msg: 'Nincs jogosultságod törölni ezt a képet' });
        }

        await Image.findByIdAndDelete(req.params.id);
        console.log('A kép sikeresen törölve:', req.params.id);
        res.json({ msg: 'A kép sikeresen törölve' });
    } catch (err) {
        console.error('Hiba a törlés során:', err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;