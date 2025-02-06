const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const register = async ({ username, password }) => {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        throw { status: 400, message: 'A felhasználó már létezik' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();

    return { msg: 'Sikeres regisztráció!' };
};

const login = async ({ username, password }) => {
    const user = await User.findOne({ username });
    if (!user) throw { status: 400, message: 'Felhasználó nem található' };

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw { status: 400, message: 'Hibás jelszó' };

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return { token, user: { _id: user._id, username: user.username } };
};

module.exports = {
    register,
    login,
};