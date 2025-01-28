const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
    src: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    comments: [{
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        comment: { type: String },
        createdAt: { type: Date, default: Date.now }
    }]
});

module.exports = mongoose.model('Image', ImageSchema);