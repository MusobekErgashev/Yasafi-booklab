const pool = require("../config/db")

class TaskController {
    // get all

    async getAll(req, res) {
        try {
            const user = req.user;

            if (user.is_admin == true) {
                const { rows } = await pool.query("SELECT * FROM tasks")

                if (rows.length === 0) return res.status(404).json({ message: "Vazifalar topilmadi" })

                return res.status(200).json({ total: rows.length, tasks: rows })
            }

            const { rows } = await pool.query("SELECT * FROM tasks WHERE user_id = $1", [user.id])

            if (rows.length === 0) return res.status(404).json({ message: "Vazifalar topilmadi" })

            return res.status(200).json({ total: rows.length, tasks: rows })
        } catch (error) {
            return res.status(500).json({ message: "Serverda xatolik yuz berdi!" })
        }
    }

    // create

    async create(req, res) {
        try {
            const { message, deadline, user_id } = req.body
            const user = req.user

            if (!message) return res.status(400).json({ message: "Vazifa matni kiritilmagan" })

            if (message.trim().length > 250) return res.status(400).json({ message: "Vazifa matni 250 belgidan oshmasligi kerak" })

            if (!deadline) return res.status(400).json({ message: "Muddat kiritilmagan" })

            if (!user_id) return res.status(400).json({ message: "User biriktirilmagan" })

            if (user.is_admin == true) {
                const { rows } = await pool.query("INSERT INTO tasks (message, deadline, user_id) VALUES ($1, $2, $3) RETURNING *", [message, deadline, user_id])
                return res.status(201).json(rows[0])
            } else {
                return res.status(403).json({ message: "Sizga yangi vazifa qo'shishga ruxsat etilmagan" })
            }
        } catch (error) {
            return res.status(500).json({ message: "Serverda xatolik yuz berdi!" })
        }
    }

    // update status

    async changeStatus(req, res) {
        try {
            const { id } = req.params
            const { status } = req.body
            const user = req.user

            if (!status) {
                return res.status(400).json({ message: "Status kiritilmagan" })
            }

            let query = "UPDATE tasks SET status = $1 WHERE id = $2 AND user_id = $3 RETURNING *"
            let queryParams = [status, id, user.id]

            const { rows } = await pool.query(query, queryParams)

            if (rows.length === 0) {
                return res.status(404).json({ message: "Vazifa topilmadi yoki uni o'zgartirishga ruxsat yo'q" })
            }

            return res.status(200).json(rows[0])
        } catch (error) {
            return res.status(500).json({ message: "Serverda xatolik yuz berdi!" })
        }
    }

    // update started date

    async changeStartedDate(req, res) {
        try {
            const { id } = req.params
            const { started_at } = req.body
            const user = req.user

            if (!started_at) {
                return res.status(400).json({ message: "Vazifa boshlangan sana kiritilmagan" })
            }

            let query = "UPDATE tasks SET started_at = $1 WHERE id = $2 AND user_id = $3 RETURNING *"
            let queryParams = [started_at, id, user.id]

            const { rows } = await pool.query(query, queryParams)

            if (rows.length === 0) {
                return res.status(404).json({ message: "Vazifa topilmadi yoki uni o'zgartirishga ruxsat yo'q" })
            }

            return res.status(200).json(rows[0])
        } catch (error) {
            return res.status(500).json({ message: "Serverda xatolik yuz berdi!" })
        }
    }

    // update finished date

    async changeFinishedDate(req, res) {
        try {
            const { id } = req.params
            const { finished_at } = req.body
            const user = req.user

            if (!finished_at) {
                return res.status(400).json({ message: "Vazifa bajarilgan sana kiritilmagan" })
            }

            let query = "UPDATE tasks SET finished_at = $1 WHERE id = $2 AND user_id = $3 RETURNING *"
            let queryParams = [finished_at, id, user.id]

            const { rows } = await pool.query(query, queryParams)

            if (rows.length === 0) {
                return res.status(404).json({ message: "Vazifa topilmadi yoki uni o'zgartirishga ruxsat yo'q" })
            }

            return res.status(200).json(rows[0])
        } catch (error) {
            return res.status(500).json({ message: "Serverda xatolik yuz berdi!" })
        }
    }

    // update

    async update(req, res) {
        try {
            const { id } = req.params
            const { message, deadline, user_id } = req.body
            const user = req.user

            if (!user.is_admin) return res.status(403).json({ message: "Sizga bunday ruxsat berilmagan" })

            if (!message) return res.status(400).json({ message: "Vazifa matni kiritilmagan" })

            if (message.trim().length > 250) return res.status(400).json({ message: "Vazifa matni 250 belgidan oshmasligi kerak" })

            if (!deadline) return res.status(400).json({ message: "Muddat kiritilmagan" })

            if (!user_id) return res.status(400).json({ message: "User biriktirilmagan" })

            const query = "UPDATE tasks SET message = $1, deadline = $2, user_id = $3 WHERE id = $4 RETURNING *"
            const queryParams = [message, deadline, user_id, id]

            const { rows } = await pool.query(query, queryParams)

            if (rows.length === 0) {
                return res.status(404).json({ message: "Vazifa topilmadi" })
            }

            return res.status(200).json(rows[0])
        } catch (error) {
            return res.status(500).json({ message: "Serverda xatolik yuz berdi!" })
        }
    }

    // delete

    async delete(req, res) {
        try {
            const { id } = req.params
            const user = req.user

            if (!user.is_admin) return res.status(403).json({ message: "Sizga bunday ruxsat berilmagan" })

            const { rows } = await pool.query("DELETE FROM tasks WHERE id = $1 RETURNING *", [id])

            if (rows.length === 0) {
                return res.status(404).json({ message: "Vazifa topilmadi" })
            }

            return res.status(200).json({ message: "Vazifa muvaffaqiyatli o'chirildi" })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
}

module.exports = new TaskController()