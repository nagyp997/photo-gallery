const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // Ellenőrzi, hogy van-e Authorization fejléc
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ msg: 'Nincs token, hozzáférés megtagadva' });
    }

    // Kinyeri a Bearer token részt
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ msg: 'Nincs token, hozzáférés megtagadva' });
    }

    try {
        // A token dekódolása
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // JWT_SECRET a .env fájlban van
        req.user = decoded; // A token adatait hozzáadja a kéréshez
        next(); // Tovább engedi a kérést
    } catch (err) {
        console.error('Érvénytelen token:', err.message);
        res.status(401).json({ msg: 'Érvénytelen token' });
    }
};

module.exports = authMiddleware;
