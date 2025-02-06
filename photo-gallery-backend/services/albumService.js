const Album = require('../models/Album');
const Image = require('../models/Image');

const getAllAlbums = async () => {
    return Album.find().populate('author', 'username');
};

const createAlbum = async ({ name }, user) => {
    if (!name) throw { status: 400, message: 'Az album neve kötelező' };

    const album = new Album({ name, author: user.id });
    await album.save();

    return album;
};

const updateAlbum = async (id, { name }, user) => {
    if (!name) throw { status: 400, message: 'Az album neve kötelező' };

    const album = await Album.findById(id);
    if (!album) throw { status: 404, message: 'Az album nem található' };
    if (album.author.toString() !== user.id) throw { status: 403, message: 'Nincs jogosultságod' };

    album.name = name;
    await album.save();

    return album;
};

const deleteAlbum = async (id, user) => {
    const album = await Album.findById(id);
    if (!album) throw { status: 404, message: 'Az album nem található' };
    if (album.author.toString() !== user.id) throw { status: 403, message: 'Nincs jogosultságod' };

    await album.remove();
    return { msg: 'Az album sikeresen törölve' };
};

const getImagesByAlbum = async (albumId) => {
    return Image.find({ album: albumId }).populate('author', 'username');
};

module.exports = {
    getAllAlbums,
    createAlbum,
    updateAlbum,
    deleteAlbum,
    getImagesByAlbum,
};
