const pool = require('../config/db');
const { verifyAccessToken } = require('../utils/jwt');
const { accessTokenCookieOptions, refreshTokenCookieOptions } = require('../utils/cookie');
const { parseUserAgent, getClientIp, getLocationFromIp, generateSessionToken } = require('../utils/sessionHelper');

const protect = async (req, res, next) => {
    let token = req.cookies?.access_token;

    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ message: "Token aniqlanmadi yoki noto'g'ri!" });
    }

    try {
        const decoded = verifyAccessToken(token);
        const user = await pool.query('SELECT * FROM users WHERE id = $1', [decoded.id]);

        if (user.rows.length === 0) {
            return res.status(401).json({ message: "Token aniqlanmadi yoki noto'g'ri!" });
        }

        const userData = user.rows[0];
        delete userData.password;
        req.user = userData;

        if (decoded.sessionId) {
            const sessionRes = await pool.query(
                'SELECT id FROM user_sessions WHERE session_token = $1 AND user_id = $2',
                [decoded.sessionId, decoded.id]
            );

            if (sessionRes.rows.length === 0) {
                res.cookie('access_token', '', { ...accessTokenCookieOptions, maxAge: 0 });
                res.cookie('refresh_token', '', { ...refreshTokenCookieOptions, maxAge: 0 });
                return res.status(401).json({ message: "Sessiya yakunlangan yoki bekor qilingan!" });
            }

            req.sessionId = decoded.sessionId;

            // Update last_active
            pool.query('UPDATE user_sessions SET last_active = CURRENT_TIMESTAMP WHERE session_token = $1', [decoded.sessionId]).catch(() => {});
        } else {
            // Legacy token support: link or create session
            const ua = req.headers['user-agent'] || '';
            const existing = await pool.query(
                'SELECT session_token FROM user_sessions WHERE user_id = $1 AND user_agent = $2 ORDER BY last_active DESC LIMIT 1',
                [decoded.id, ua]
            );

            if (existing.rows.length > 0) {
                req.sessionId = existing.rows[0].session_token;
                pool.query('UPDATE user_sessions SET last_active = CURRENT_TIMESTAMP WHERE session_token = $1', [req.sessionId]).catch(() => {});
            } else {
                const { browser, os, device_type } = parseUserAgent(ua);
                const ip = getClientIp(req);
                const location = getLocationFromIp(ip);
                const newSessionToken = generateSessionToken();

                await pool.query(
                    `INSERT INTO user_sessions (user_id, session_token, device_type, browser, os, ip_address, location, user_agent, last_active)
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP)`,
                    [decoded.id, newSessionToken, device_type, browser, os, ip, location, ua]
                );
                req.sessionId = newSessionToken;
            }
        }

        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({ message: "Not authorized!" });
    }
};

module.exports = { protect }