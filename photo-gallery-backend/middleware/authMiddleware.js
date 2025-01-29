const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ msg: 'Nincs token, hozzáférés megtagadva' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ msg: 'Nincs token, hozzáférés megtagadva' });
    }

    try {
        // A token dekódolása
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.error('Érvénytelen token:', err.message);
        res.status(401).json({ msg: 'Érvénytelen token' });
    }
};

module.exports = authMiddleware;
