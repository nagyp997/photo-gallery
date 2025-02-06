const Image = require('../models/Image');
const fs = require('fs');
const path = require('path');

const getAllImages = () => {
    return Image.find().populate('author', 'username').populate('comments.author', 'username');
};

const getImageById = (id) => {
    return Image.findById(id).populate('author', 'username');
};

const createImage = async (src, userId) => {
    if (src.startsWith('http')) {
        const image = new Image({ src, author: userId });
        await image.save();
        return image;
    }

    const filePath = path.join(__dirname, '../uploads', src);
    if (!fs.existsSync(filePath)) {
        throw new Error('A fájl nem létezik az uploads mappában');
    }

    const image = new Image({ src, author: userId });
    await image.save();
    return image;
};

const updateImage = async (id, src, userId) => {
    const image = await Image.findById(id);
    if (!image) {
        throw { status: 404, message: 'A kép nem található' };
    }

    if (image.author.toString() !== userId) {
        throw { status: 403, message: 'Nincs jogosultságod módosítani ezt a képet' };
    }

    image.src = src || image.src;
    await image.save();
    return { msg: 'A kép sikeresen frissítve', image };
};

const deleteImage = async (id, userId) => {
    const image = await Image.findById(id);
    if (!image) {
        throw { status: 404, message: 'A kép nem található' };
    }

    if (image.author.toString() !== userId) {
        throw { status: 403, message: 'Nincs jogosultságod törölni ezt a képet' };
    }

    await Image.findByIdAndDelete(id);
    return { msg: 'A kép sikeresen törölve' };
};

const addComment = async (imageId, comment, userId) => {
    const image = await Image.findById(imageId);
    if (!image) {
        throw { status: 404, message: 'A kép nem található' };
    }

    const newComment = {
        author: userId,
        comment,
        createdAt: new Date(),
    };

    image.comments.push(newComment);
    await image.save();
    return { msg: 'Komment hozzáadva', comment: newComment };
};

const deleteComment = async (imageId, commentId, userId) => {
    const image = await Image.findById(imageId);
    if (!image) {
        throw { status: 404, message: 'A kép nem található' };
    }

    const commentIndex = image.comments.findIndex((c) => c._id.toString() === commentId);
    if (commentIndex === -1) {
        throw { status: 404, message: 'A komment nem található' };
    }

    if (image.comments[commentIndex].author.toString() !== userId) {
        throw { status: 403, message: 'Nincs jogosultságod törölni ezt a kommentet' };
    }

    image.comments.splice(commentIndex, 1);
    await image.save();
    return { msg: 'Komment törölve', image };
};

const assignAlbum = async (imageId, albumId) => {
    const image = await Image.findById(imageId);
    if (!image) {
        throw new Error('A kép nem található');
    }

    image.album = albumId || null;
    await image.save();
    return { msg: 'A kép sikeresen hozzárendelve az albumhoz', image };
};

const getImagesByAlbum = (albumId) => {
    return Image.find({ album: albumId });
};

module.exports = {
    getAllImages,
    getImageById,
    createImage,
    updateImage,
    deleteImage,
    addComment,
    deleteComment,
    assignAlbum,
    getImagesByAlbum,
};
