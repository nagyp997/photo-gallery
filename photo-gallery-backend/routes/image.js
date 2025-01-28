const express = require('express');
const Image = require('../models/Image');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

// Get all images
router.get('/', auth, async (req, res) => {
    try {
        const images = await Image.find();
        res.json(images);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create new image
router.post('/new', auth, async (req, res) => {
    const { src } = req.body;
    try {
        const image = new Image({ src, author: req.user.id });
        await image.save();
        res.status(201).json(image);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;