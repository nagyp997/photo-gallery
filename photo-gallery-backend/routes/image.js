const express = require('express');
const auth = require('../middleware/authMiddleware');
const imageController = require('../controllers/imageController');
const router = express.Router();

router.get('/', auth, imageController.getAllImages);
router.get('/:id', auth, imageController.getImageById);
router.post('/new', auth, imageController.createImage);
router.put('/:id/edit', auth, imageController.updateImage);
router.delete('/:id/delete', auth, imageController.deleteImage);
router.post('/:id/comment', auth, imageController.addComment);
router.delete('/:imageId/comment/:commentId', auth, imageController.deleteComment);
router.put('/:id/assignAlbum', auth, imageController.assignAlbum);
router.get('/album/:albumId', auth, imageController.getImagesByAlbum);

module.exports = router;
