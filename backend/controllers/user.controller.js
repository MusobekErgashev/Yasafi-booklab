const pool = require('../config/db')
const { hashPassword } = require('../utils/bcrypt')
const authValidation = require('../validations/auth.validation')

class UserController {
    // get all

    async getAll(req, res) {
        try {
            const { is_admin } = req.user
            const { q } = req.query

            if (!is_admin) {
                return res.status(403).json({ message: "Sizga bunday imkoniyat berilmagan!" })
            }

            const users = await pool.query('SELECT * FROM users WHERE is_admin = false AND (first_name ILIKE $1 OR last_name ILIKE $1)', [`%${q}%`])

            if(!users.rows.length){
                return res.status(404).json({ message: "Xodim topilmadi!" })
            }

            const filteredUsers = users.rows.map(user => {
                delete user.password
                delete user.login
                return user
            })

            return res.status(200).json({ total: filteredUsers.length, employees: filteredUsers })
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Serverda xatolik yuz berdi!' })
        }
    }

    // get me

    async getMe(req, res) {
        try {
            const { id } = req.user

            const user = await pool.query('SELECT * FROM users WHERE id = $1', [id])

            if (user.rows.length === 0) {
                return res.status(404).json({ message: "Foydalanuvchi topilmadi!" })
            }

            const filteredUser = user.rows[0]
            delete filteredUser.password

            return res.status(200).json(filteredUser)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Serverda xatolik yuz berdi!' })
        }
    }

    // get by id

    async getById(req, res) {
        try {
            const { id } = req.params
            const { is_admin } = req.user
            if (!is_admin) {
                return res.status(403).json({ message: "Sizga bunday imkoniyat berilmagan!" })
            }
            if (!id || isNaN(Number(id))) {
                return res.status(400).json({ message: "Noto'g'ri foydalanuvchi ID!" })
            }
            const user = await pool.query('SELECT * FROM users WHERE id = $1', [id])

            if (user.rows.length === 0) {
                return res.status(404).json({ message: "Foydalanuvchi topilmadi!" })
            }

            const filteredUser = user.rows[0]
            delete filteredUser.password
            delete filteredUser.login

            return res.status(200).json(filteredUser)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Serverda xatolik yuz berdi!' })
        }
    }

    // create

    async create(req, res) {
        try {
            const { is_admin } = req.user

            if (!is_admin) {
                return res.status(403).json({ message: "Sizga bunday imkoniyat berilmagan!" })
            }

            const validationResult = authValidation.register.validate(req.body)

            if (validationResult.error) {
                return res.status(400).json({ message: validationResult.error.message })
            }

            const { first_name, last_name, phone, login, password } = req.body

            const user = await pool.query('SELECT * FROM users WHERE login = $1', [login])

            if (user.rows.length > 0) {
                return res.status(400).json({ message: "Foydalanuvchi allaqachon mavjud!" })
            }

            await pool.query('INSERT INTO users (first_name, last_name, phone, login, password, is_admin) VALUES ($1, $2, $3, $4, $5, $6)', [
                first_name, last_name, phone, login, await hashPassword(password), false
            ])

            return res.status(201).json({ message: "Foydalanuvchi muvaffaqiyatli yaratildi!" })
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Serverda xatolik yuz berdi!' })
        }
    }

    // update

    async update(req, res) {
        try {
            const { id } = req.params
            const { is_admin, id: user_id } = req.user
            const { first_name, last_name, phone, login, password } = req.body

            if (!id || isNaN(Number(id))) {
                return res.status(400).json({ message: "Noto'g'ri foydalanuvchi ID!" })
            }

            // Faqat admin yoki akkaunt egasi o'zgartira oladi
            if (!is_admin && Number(id) !== Number(user_id)) {
                return res.status(403).json({ message: "Sizga bunday imkoniyat berilmagan!" })
            }

            const validationResult = authValidation.updateCusomer.validate(req.body)
            if (validationResult.error) {
                return res.status(400).json({ message: validationResult.error.message })
            }

            const existingUser = await pool.query('SELECT * FROM users WHERE id = $1', [id])
            if (existingUser.rows.length === 0) {
                return res.status(404).json({ message: "Foydalanuvchi topilmadi!" })
            }

            const currentUser = existingUser.rows[0]

            // Agar login o'zgartirilayotgan bo'lsa, takrorlanmasligini tekshirish
            if (login && login !== currentUser.login) {
                const checkLogin = await pool.query('SELECT * FROM users WHERE login = $1 AND id != $2', [login, id])
                if (checkLogin.rows.length > 0) {
                    return res.status(400).json({ message: "Ushbu login allaqachon mavjud!" })
                }
            }

            const updatedFirstName = first_name !== undefined && first_name !== '' ? first_name : currentUser.first_name
            const updatedLastName = last_name !== undefined && last_name !== '' ? last_name : currentUser.last_name
            const updatedPhone = phone !== undefined && phone !== '' ? phone : currentUser.phone
            const updatedLogin = login !== undefined && login !== '' ? login : currentUser.login
            const updatedPassword = password ? await hashPassword(password) : currentUser.password

            const user = await pool.query(
                'UPDATE users SET first_name = $1, last_name = $2, phone = $3, login = $4, password = $5 WHERE id = $6 RETURNING *',
                [updatedFirstName, updatedLastName, updatedPhone, updatedLogin, updatedPassword, id]
            )

            const filteredUser = user.rows[0]
            delete filteredUser.password

            return res.status(200).json(filteredUser)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Serverda xatolik yuz berdi!' })
        }
    }

    // delete

    async delete(req, res) {
        try {
            const { id } = req.params
            const { is_admin } = req.user

            if (!is_admin) {
                return res.status(403).json({ message: "Sizga bunday imkoniyat berilmagan!" })
            }

            if (!id || isNaN(Number(id))) {
                return res.status(400).json({ message: "Noto'g'ri foydalanuvchi ID!" })
            }

            const user = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id])

            if (user.rows.length === 0) {
                return res.status(404).json({ message: "Foydalanuvchi topilmadi!" })
            }

            const filteredUser = user.rows[0]
            delete filteredUser.password
            delete filteredUser.login

            return res.status(200).json(filteredUser)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Serverda xatolik yuz berdi!' })
        }
    }
}

module.exports = new UserController();