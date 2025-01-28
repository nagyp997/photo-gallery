const mongoose = require('mongoose');
const User = require('./models/User');
const Image = require('./models/Image');
const Album = require('./models/Album');
require('dotenv').config();

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        await User.deleteMany();
        await Image.deleteMany();
        await Album.deleteMany();

        const user = new User({ username: 'testuser', password: 'password123' });
        await user.save();

        const image1 = new Image({
            src: 'image1.jpg',
            author: user._id,
            comments: [
                { author: user._id, comment: 'Nagyon jó kép!', createdAt: new Date() },
                { author: user._id, comment: 'Szép munka!', createdAt: new Date() },
            ],
        });
        const image2 = new Image({
            src: 'image2.jpg',
            author: user._id,
            comments: [
                { author: user._id, comment: 'Ez is nagyon szép!', createdAt: new Date() },
            ],
        });
        await image1.save();
        await image2.save();

        const album = new Album({
            author: user._id,
            images: [image1._id, image2._id],
            description: 'Ez egy tesztalbum',
            tags: ['teszt', 'fotó'],
        });
        await album.save();

        console.log('Adatbázis feltöltve tesztadatokkal!');
        process.exit();
    } catch (err) {
        console.error('Hiba történt az adatbázis feltöltése során:', err);
        process.exit(1);
    }
};

seedDatabase();