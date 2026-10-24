const pool = require('../config/db');
const jwt = require('jsonwebtoken');
const authValidate = require('../validations/auth.validation');
const { hashPassword, comparePassword } = require('../utils/bcrypt');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt');
const { accessTokenCookieOptions, refreshTokenCookieOptions } = require('../utils/cookie');
const { parseUserAgent, getClientIp, getLocationFromIp, generateSessionToken } = require('../utils/sessionHelper');

class AuthController {
    // register

    async register(req, res) {
        try {
            const validationResult = authValidate.register.validate(req.body);

            if (validationResult.error) {
                return res.status(400).json({ message: validationResult.error.message });
            }

            const { first_name, last_name, phone, is_admin, login, password } = req.body;

            const userExist = await pool.query('SELECT * FROM users WHERE login = $1', [login]);

            if (userExist.rows.length > 0) {
                return res.status(400).json({ message: 'Bu login allaqachon mavjud!' });
            }

            const adminExist = await pool.query('SELECT * FROM users WHERE is_admin = true')

            if (adminExist.rows.length && is_admin) {
                return res.status(400).json({ message: 'Admin allaqachon mavjud!' });
            }

            const newUser = await pool.query('INSERT INTO users (first_name, last_name, phone, is_admin, login, password) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [
                first_name, last_name, phone, is_admin || false, login, await hashPassword(password)
            ]);

            const userData = newUser.rows[0];
            delete userData.password;

            const ua = req.headers['user-agent'] || '';
            const { browser, os, device_type } = parseUserAgent(ua);
            const ip = getClientIp(req);
            const location = getLocationFromIp(ip);
            const sessionToken = generateSessionToken();

            await pool.query(
                `INSERT INTO user_sessions (user_id, session_token, device_type, browser, os, ip_address, location, user_agent, last_active)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP)`,
                [userData.id, sessionToken, device_type, browser, os, ip, location, ua]
            );

            const accessToken = generateAccessToken(userData.id, sessionToken, userData.is_admin);
            const refreshToken = generateRefreshToken(userData.id, sessionToken, userData.is_admin);

            res.cookie('access_token', accessToken, accessTokenCookieOptions);
            res.cookie('refresh_token', refreshToken, refreshTokenCookieOptions);

            res.status(201).json({
                message: 'Foydalanuvchi muvaffaqiyatli yaratildi!',
                user: userData,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Serverda xatolik yuz berdi!' });
        }
    }

    // login

    async login(req, res) {
        try {
            const validationResult = authValidate.login.validate(req.body);

            if (validationResult.error) {
                return res.status(400).json({ message: validationResult.error.message });
            }

            const { login, password } = req.body;

            const user = await pool.query('SELECT * FROM users WHERE login = $1', [login]);

            if (user.rows.length === 0) {
                return res.status(401).json({ message: 'Login yoki parol xato!' });
            }

            const isMatch = await comparePassword(password, user.rows[0].password);

            if (!isMatch) {
                return res.status(401).json({ message: 'Login yoki parol xato!' });
            }

            const userData = user.rows[0];
            delete userData.password;

            const ua = req.headers['user-agent'] || '';
            const { browser, os, device_type } = parseUserAgent(ua);
            const ip = getClientIp(req);
            const location = getLocationFromIp(ip);
            const sessionToken = generateSessionToken();

            await pool.query(
                `INSERT INTO user_sessions (user_id, session_token, device_type, browser, os, ip_address, location, user_agent, last_active)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP)`,
                [userData.id, sessionToken, device_type, browser, os, ip, location, ua]
            );

            const accessToken = generateAccessToken(userData.id, sessionToken, userData.is_admin);
            const refreshToken = generateRefreshToken(userData.id, sessionToken, userData.is_admin);

            res.cookie('access_token', accessToken, accessTokenCookieOptions);
            res.cookie('refresh_token', refreshToken, refreshTokenCookieOptions);

            res.status(200).json({
                message: 'Tizimga muvaffaqiyatli kirdingiz!',
                user: userData
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Serverda xatolik yuz berdi!' });
        }
    }

    // logout

    async logout(req, res) {
        try {
            const refreshToken = req.cookies?.refresh_token;
            const accessToken = req.cookies?.access_token;
            const token = refreshToken || accessToken;

            if (token) {
                try {
                    const decoded = jwt.decode(token);
                    if (decoded?.sessionId) {
                        await pool.query('DELETE FROM user_sessions WHERE session_token = $1', [decoded.sessionId]);
                    }
                } catch (e) {}
            }

            res.cookie('access_token', '', { ...accessTokenCookieOptions, maxAge: 0 });
            res.cookie('refresh_token', '', { ...refreshTokenCookieOptions, maxAge: 0 });

            res.status(200).json({ message: 'Tizimdan muvaffaqiyatli chiqdingiz!' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Serverda xatolik yuz berdi!' });
        }
    }

    // refresh token

    async refresh(req, res) {
        const refreshToken = req.cookies?.refresh_token;

        if (!refreshToken) {
            res.cookie('access_token', '', { ...accessTokenCookieOptions, maxAge: 0 });
            res.cookie('refresh_token', '', { ...refreshTokenCookieOptions, maxAge: 0 });
            return res.status(401).json({ message: "Refresh token taqdim etilmadi!" });
        }

        try {
            const decoded = verifyRefreshToken(refreshToken);
            const user = await pool.query('SELECT * FROM users WHERE id = $1', [decoded.id]);

            if (user.rows.length === 0) {
                res.cookie('access_token', '', { ...accessTokenCookieOptions, maxAge: 0 });
                res.cookie('refresh_token', '', { ...refreshTokenCookieOptions, maxAge: 0 });
                return res.status(401).json({ message: "Foydalanuvchi topilmadi!" });
            }

            const userData = user.rows[0];
            delete userData.password;

            let sessionToken = decoded.sessionId;

            if (sessionToken) {
                const sessionCheck = await pool.query(
                    'SELECT id FROM user_sessions WHERE session_token = $1 AND user_id = $2',
                    [sessionToken, userData.id]
                );

                if (sessionCheck.rows.length === 0) {
                    res.cookie('access_token', '', { ...accessTokenCookieOptions, maxAge: 0 });
                    res.cookie('refresh_token', '', { ...refreshTokenCookieOptions, maxAge: 0 });
                    return res.status(401).json({ message: "Sessiya muddati tugagan yoki boshqa qurilmadan o'chirilgan!" });
                }

                await pool.query(
                    'UPDATE user_sessions SET last_active = CURRENT_TIMESTAMP WHERE session_token = $1',
                    [sessionToken]
                );
            } else {
                const ua = req.headers['user-agent'] || '';
                const { browser, os, device_type } = parseUserAgent(ua);
                const ip = getClientIp(req);
                const location = getLocationFromIp(ip);
                sessionToken = generateSessionToken();

                await pool.query(
                    `INSERT INTO user_sessions (user_id, session_token, device_type, browser, os, ip_address, location, user_agent, last_active)
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP)`,
                    [userData.id, sessionToken, device_type, browser, os, ip, location, ua]
                );
            }

            const newAccessToken = generateAccessToken(userData.id, sessionToken, userData.is_admin);
            const newRefreshToken = generateRefreshToken(userData.id, sessionToken, userData.is_admin);

            res.cookie('access_token', newAccessToken, accessTokenCookieOptions);
            res.cookie('refresh_token', newRefreshToken, refreshTokenCookieOptions);

            return res.status(200).json({ message: "Yangi tokenlar berildi!" });
        } catch (error) {
            res.cookie('access_token', '', { ...accessTokenCookieOptions, maxAge: 0 });
            res.cookie('refresh_token', '', { ...refreshTokenCookieOptions, maxAge: 0 });
            return res.status(401).json({ message: "Refresh token yaroqsiz yoki muddati o'tgan!" });
        }
    }

    // get all active sessions
    async getSessions(req, res) {
        try {
            const currentSessionToken = req.sessionId || '';
            const sessions = await pool.query(
                `SELECT id, device_type, browser, os, ip_address, location, last_active, created_at,
                 (session_token = $1) AS is_current
                 FROM user_sessions
                 WHERE user_id = $2
                 ORDER BY is_current DESC, last_active DESC`,
                [currentSessionToken, req.user.id]
            );

            return res.status(200).json({ sessions: sessions.rows });
        } catch (error) {
            console.error('getSessions error:', error);
            return res.status(500).json({ message: 'Serverda xatolik yuz berdi!' });
        }
    }

    // delete single session
    async deleteSession(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            const existing = await pool.query(
                'SELECT * FROM user_sessions WHERE id = $1 AND user_id = $2',
                [id, userId]
            );

            if (existing.rows.length === 0) {
                return res.status(404).json({ message: 'Seans topilmadi!' });
            }

            const sessionToDelete = existing.rows[0];
            await pool.query('DELETE FROM user_sessions WHERE id = $1 AND user_id = $2', [id, userId]);

            const isCurrent = sessionToDelete.session_token === req.sessionId;
            if (isCurrent) {
                res.cookie('access_token', '', { ...accessTokenCookieOptions, maxAge: 0 });
                res.cookie('refresh_token', '', { ...refreshTokenCookieOptions, maxAge: 0 });
            }

            return res.status(200).json({
                message: 'Seans muvaffaqiyatli yakunlandi!',
                isCurrent
            });
        } catch (error) {
            console.error('deleteSession error:', error);
            return res.status(500).json({ message: 'Serverda xatolik yuz berdi!' });
        }
    }

    // terminate all other sessions
    async terminateOtherSessions(req, res) {
        try {
            const currentSessionToken = req.sessionId || '';
            const userId = req.user.id;

            await pool.query(
                'DELETE FROM user_sessions WHERE user_id = $1 AND session_token != $2',
                [userId, currentSessionToken]
            );

            return res.status(200).json({
                message: 'Boshqa barcha qurilmalardan muvaffaqiyatli chiqildi!'
            });
        } catch (error) {
            console.error('terminateOtherSessions error:', error);
            return res.status(500).json({ message: 'Serverda xatolik yuz berdi!' });
        }
    }

    // change password

    async changePassword(req, res) {
        try {
            const { oldPassword, newPassword } = req.body;
            const validationResult = authValidate.login.validate({ password: newPassword });

            if (!oldPassword || !newPassword) {
                return res.status(400).json({ message: "Parollar to'liq kiritilmadi!" });
            }

            if (validationResult.error) {
                return res.status(400).json({ message: validationResult.error.message });
            }

            const { id } = req.user;

            const user = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
            const userData = user.rows[0];

            const isMatch = await comparePassword(oldPassword, userData.password);

            if (!isMatch) {
                return res.status(400).json({ message: "Parol noto'g'ri!" });
            }

            const newPasswordHash = await hashPassword(newPassword);
            await pool.query('UPDATE users SET password = $1 WHERE id = $2', [newPasswordHash, id]);
            res.status(200).json({ message: "Parol muvaffaqiyatli o'zgartirildi!" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Serverda xatolik yuz berdi!" });
        }
    }
}

module.exports = new AuthController();