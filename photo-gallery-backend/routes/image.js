const express = require('express');
const Image = require('../models/Image');
const auth = require('../middleware/authMiddleware');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// Get all images
router.get('/', auth, async (req, res) => {
    try {
        const images = await Image.find().populate('author', 'username').populate('comments.author', 'username');
        res.json(images);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//Search by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const image = await Image.findById(req.params.id).populate('author', 'username');
        if (!image) {
            return res.status(404).json({ msg: 'A kép nem található' });
        }
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
        const image = await Image.findById(req.params.id);
        if (!image) {
            return res.status(404).json({ msg: 'A kép nem található' });
        }

        if (image.author.toString() !== req.user.id) {
            return res.status(403).json({ msg: 'Nincs jogosultságod módosítani ezt a képet' });
        }

        image.src = req.body.src || image.src;
        await image.save();
        res.json({ msg: 'A kép sikeresen frissítve', image });
    } catch (err) {
        console.error('Hiba történt a kép módosítása során:', err.message);
        res.status(500).json({ error: err.message });
    }
});


router.delete('/:id/delete', auth, async (req, res) => {
    try {
        const image = await Image.findById(req.params.id);
        if (!image) {
            return res.status(404).json({ msg: 'A kép nem található' });
        }

        if (image.author.toString() !== req.user.id) {
            return res.status(403).json({ msg: 'Nincs jogosultságod törölni ezt a képet' });
        }

        await Image.findByIdAndDelete(req.params.id);
        res.json({ msg: 'A kép sikeresen törölve' });
    } catch (err) {
        console.error('Hiba a kép törlése során:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// Új komment hozzáadása egy képhez
router.post('/:id/comment', auth, async (req, res) => {
    try {
        const { comment } = req.body;
        const image = await Image.findById(req.params.id);
        if (!image) return res.status(404).json({ msg: 'A kép nem található' });

        console.log(`Komment mentése az adatbázisba: "${comment}" Felhasználó: ${req.user.id}`);

        const newComment = {
            author: req.user.id,
            comment,
            createdAt: new Date()
        };

        image.comments.push(newComment);
        await image.save();

        res.json({ msg: 'Komment hozzáadva', comment: newComment });
    } catch (err) {
        console.error('Hiba a komment mentése során:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// Komment törlése
router.delete('/:imageId/comment/:commentId', auth, async (req, res) => {
    try {
        const image = await Image.findById(req.params.imageId);
        if (!image) return res.status(404).json({ msg: 'A kép nem található' });

        // Keressük meg a kommentet
        const commentIndex = image.comments.findIndex(c => c._id.toString() === req.params.commentId);
        if (commentIndex === -1) {
            return res.status(404).json({ msg: 'A komment nem található' });
        }

        // Ellenőrizzük, hogy a bejelentkezett felhasználó törölheti-e
        if (image.comments[commentIndex].author.toString() !== req.user.id) {
            return res.status(403).json({ msg: 'Nincs jogosultságod törölni ezt a kommentet!' });
        }

        // Komment törlése a tömbből
        image.comments.splice(commentIndex, 1);
        await image.save();

        res.json({ msg: 'Komment törölve', image });
    } catch (err) {
        console.error('Hiba a komment törlése során:', err.message);
        res.status(500).json({ error: err.message });
    }
});

//Kép albumhoz rendelése
router.put('/:id/assignAlbum', auth, async (req, res) => {
    try {
        const { albumId } = req.body;
        const image = await Image.findById(req.params.id);

        if (!image) {
            return res.status(404).json({ msg: 'A kép nem található' });
        }

        image.album = albumId || null;
        await image.save();

        res.json({ msg: 'A kép sikeresen hozzárendelve az albumhoz', image });
    } catch (err) {
        console.error('Hiba az album hozzárendelésekor:', err.message);
        res.status(500).json({ error: err.message });
    }
});

//Album képeinek lekérése
router.get('/album/:albumId', auth, async (req, res) => {
    try {
        const images = await Image.find({ album: req.params.albumId });
        res.json(images);
    } catch (err) {
        console.error('Hiba az album képeinek lekérésekor:', err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;