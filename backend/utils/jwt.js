const jwt = require('jsonwebtoken');

const generateAccessToken = (id, sessionId = null, isAdmin = false) => {
    return jwt.sign({ id, sessionId, is_admin: isAdmin }, process.env.JWT_ACCESS_SECRET, {
        expiresIn: '15m'
    });
};

const generateRefreshToken = (id, sessionId = null, isAdmin = false) => {
    return jwt.sign({ id, sessionId, is_admin: isAdmin }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: '7d'
    });
};

const verifyAccessToken = (token) => {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
};

const verifyRefreshToken = (token) => {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken
};