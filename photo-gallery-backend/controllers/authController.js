const authService = require('../services/authService');

const register = async (req, res) => {
    try {
        const response = await authService.register(req.body);
        res.status(201).json(response);
    } catch (err) {
        res.status(err.status || 500).json({ msg: err.message });
    }
};

const login = async (req, res) => {
    try {
        const response = await authService.login(req.body);
        res.json(response);
    } catch (err) {
        res.status(err.status || 500).json({ msg: err.message });
    }
};

module.exports = {
    register,
    login,
};
