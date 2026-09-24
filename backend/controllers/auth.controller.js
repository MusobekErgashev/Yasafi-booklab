const pool = require('../config/db');
const authValidate = require('../validations/auth.validation');
const { hashPassword, comparePassword } = require('../utils/bcrypt');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt');
const { accessTokenCookieOptions, refreshTokenCookieOptions } = require('../utils/cookie');

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

            const accessToken = generateAccessToken(userData.id);
            const refreshToken = generateRefreshToken(userData.id);

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

            const accessToken = generateAccessToken(userData.id);
            const refreshToken = generateRefreshToken(userData.id);

            res.cookie('access_token', accessToken, accessTokenCookieOptions);
            res.cookie('refresh_token', refreshToken, refreshTokenCookieOptions);

            res.status(200).json({
                message: 'Tizimga muvaffaqiyatli kirdingiz!'
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Serverda xatolik yuz berdi!' });
        }
    }

    // logout

    async logout(req, res) {
        try {
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

            const newAccessToken = generateAccessToken(userData.id);
            const newRefreshToken = generateRefreshToken(userData.id);

            res.cookie('access_token', newAccessToken, accessTokenCookieOptions);
            res.cookie('refresh_token', newRefreshToken, refreshTokenCookieOptions);

            return res.status(200).json({ message: "Yangi tokenlar berildi!" });
        } catch (error) {
            res.cookie('access_token', '', { ...accessTokenCookieOptions, maxAge: 0 });
            res.cookie('refresh_token', '', { ...refreshTokenCookieOptions, maxAge: 0 });
            return res.status(401).json({ message: "Refresh token yaroqsiz yoki muddati o'tgan!" });
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