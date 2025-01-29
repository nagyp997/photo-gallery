const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Felhasználói modell

router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ msg: 'A felhasználó már létezik' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({ username, password: hashedPassword });

        await user.save();

        res.status(201).json({ msg: 'Sikeres regisztráció!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Szerverhiba' });
    }
});

// Bejelentkezés végpont
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Felhasználó keresése az adatbázisban
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ msg: 'Hibás felhasználónév vagy jelszó' });
        }

        // Jelszó ellenőrzése
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ msg: 'Hibás felhasználónév vagy jelszó' });
        }

        // Token generálása
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Token visszaküldése
        res.status(200).json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Szerverhiba' });
    }
});

module.exports = router;
