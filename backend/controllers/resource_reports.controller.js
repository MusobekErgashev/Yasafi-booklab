const pool = require('../config/db')

class ResourceReportsController {
    // get all

    async getAll(req, res) {
        try {
            const query = `SELECT * FROM resource_reports ORDER BY created_at DESC`
            const result = await pool.query(query)

            if (!result.rows.length) {
                return res.status(404).json({ message: "Hisobotlar topilmadi!" })
            }

            res.status(200).json({ total: result.rows.length, reports: result.rows })
        } catch (error) {
            console.error("Error fetching resource reports:", error)
            res.status(500).json({ message: "Serverda xatolik yuz berdi!" })
        }
    }

    // edit

    async update(req, res) {
        try {
            const { id } = req.params
            const { message, color_count, paper_count } = req.body
            const user = req.user

            if (!id || isNaN(Number(id))) {
                return res.status(400).json({ message: "Noto'g'ri hisobot ID!" })
            }

            if (message.length > 200) return res.status(400).json({ message: "Hisobot matni 200 simvoldan oshmasligi kerak!" })

            const existingReport = await pool.query('SELECT * FROM resource_reports WHERE id = $1', [id])
            if (existingReport.rows.length === 0) {
                return res.status(404).json({ message: "Hisobot topilmadi!" })
            }

            const currentReport = existingReport.rows[0]

            if (!user.is_admin && Number(currentReport.user_id) !== Number(user.id)) {
                return res.status(403).json({ message: "Sizga bunday imkoniyat berilmagan!" })
            }

            const updatedMessage = message !== undefined ? message.trim() : currentReport.message
            const updatedColorCount = color_count !== undefined ? color_count : currentReport.color_count
            const updatedPaperCount = paper_count !== undefined ? paper_count : currentReport.paper_count

            const query = `UPDATE resource_reports SET message = $1, color_count = $2, paper_count = $3 WHERE id = $4 RETURNING *`
            const result = await pool.query(query, [updatedMessage, updatedColorCount, updatedPaperCount, id])

            res.status(200).json(result.rows[0])
        } catch (error) {
            console.error("Error updating resource report:", error)
            res.status(500).json({ message: "Serverda xatolik yuz berdi!" })
        }
    }

    // post

    async create(req, res) {
        try {
            const { message, color_count, paper_count } = req.body
            const user = req.user

            if (!user || !user.id) return res.status(400).json({ message: "Foydalanuvchi ID topilmadi!" })
            if (!message || message.trim() === "") return res.status(400).json({ message: "Hisobot matnini kiriting!" })
            if (color_count === 0 && paper_count === 0) return res.status(400).json({ message: "Rang yoki qog'oz sonini kiriting!" })

            const query = `INSERT INTO resource_reports (message, color_count, paper_count, user_id) VALUES ($1, $2, $3, $4) RETURNING *`
            const result = await pool.query(query, [message.trim(), color_count || 0, paper_count || 0, user.id])

            res.status(201).json(result.rows[0])
        } catch (error) {
            console.error("Error creating resource report:", error)
            res.status(500).json({ message: "Serverda xatolik yuz berdi!" })
        }
    }

    // delete

    async delete(req, res) {
        try {
            const { id } = req.params
            const user = req.user

            if (!id || isNaN(Number(id))) {
                return res.status(400).json({ message: "Noto'g'ri hisobot ID!" })
            }

            const existingReport = await pool.query('SELECT * FROM resource_reports WHERE id = $1', [id])
            if (existingReport.rows.length === 0) {
                return res.status(404).json({ message: "Hisobot topilmadi!" })
            }

            const currentReport = existingReport.rows[0]

            if (!user.is_admin && Number(currentReport.user_id) !== Number(user.id)) {
                return res.status(403).json({ message: "Sizga bunday imkoniyat berilmagan!" })
            }

            await pool.query('DELETE FROM resource_reports WHERE id = $1', [id])

            res.status(200).json({ message: "Hisobot o'chirildi!" })
        } catch (error) {
            console.error("Error deleting resource report:", error)
            res.status(500).json({ message: "Serverda xatolik yuz berdi!" })
        }
    }
}

module.exports = new ResourceReportsController()