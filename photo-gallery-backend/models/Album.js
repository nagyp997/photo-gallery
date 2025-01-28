const mongoose = require('mongoose');

const AlbumSchema = new mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    images: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Image' }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Album', AlbumSchema);