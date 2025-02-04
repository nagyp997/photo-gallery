const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
    src: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    comments: [
        {
            author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // A komment szerzője
            comment: { type: String, required: true }, // A komment szövege
            createdAt: { type: Date, default: Date.now } // A komment létrehozási dátuma
        }
    ],
    album: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Album', // Kapcsolat az Album modellel
        default: null // Alapértelmezett érték: nincs albumhoz rendelve
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Image', ImageSchema);
