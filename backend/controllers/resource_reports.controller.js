const pool = require('../config/db')

class ResourceReportsController {
    // get all

    async getAll(req, res) {
        try {
            const { page, limit: queryLimit, q, date } = req.query;
            const pageNum = Math.max(1, parseInt(page, 10) || 1);
            const limit = Math.max(1, parseInt(queryLimit, 10) || 10);
            const offset = (pageNum - 1) * limit;

            let conditions = [];
            let params = [];

            if (q && q.trim() !== '') {
                params.push(`%${q.trim()}%`);
                conditions.push(`COALESCE(message, '') ILIKE $${params.length}`);
            }

            if (date && date !== 'all' && date !== '') {
                if (date === 'today' || date === 'bugun') {
                    conditions.push(`created_at >= CURRENT_DATE`);
                } else if (date === 'week' || date === 'oxirgi_xafta' || date === 'oxirgi_hafta') {
                    conditions.push(`created_at >= CURRENT_DATE - INTERVAL '7 days'`);
                }
            }

            const whereSql = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

            // Jami sonini hisoblash
            const countQuery = `SELECT COUNT(*) as total_count FROM resource_reports ${whereSql}`;
            const countRes = await pool.query(countQuery, params);
            const totalCount = parseInt(countRes.rows[0].total_count, 10) || 0;
            const totalPages = Math.max(1, Math.ceil(totalCount / limit));

            // Sahifalangan ro'yxat
            const listParams = [...params, limit, offset];
            const listQuery = `
                SELECT * FROM resource_reports 
                ${whereSql}
                ORDER BY created_at DESC, id DESC
                LIMIT $${params.length + 1} OFFSET $${params.length + 2}
            `;
            const result = await pool.query(listQuery, listParams);

            res.status(200).json({ 
                total: totalCount, 
                total_pages: totalPages,
                page: pageNum,
                limit: limit,
                reports: result.rows 
            });
        } catch (error) {
            console.error("Error fetching resource reports:", error);
            res.status(500).json({ message: "Serverda xatolik yuz berdi!" });
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