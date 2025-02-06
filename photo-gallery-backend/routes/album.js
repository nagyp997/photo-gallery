const express = require('express');
const albumController = require('../controllers/albumController');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', auth, albumController.getAllAlbums);
router.post('/new', auth, albumController.createAlbum);
router.put('/:id/edit', auth, albumController.updateAlbum);
router.delete('/:id/delete', auth, albumController.deleteAlbum);
router.get('/:id/images', auth, albumController.getImagesByAlbum);

module.exports = router;