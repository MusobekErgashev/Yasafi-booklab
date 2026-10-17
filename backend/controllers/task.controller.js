const pool = require("../config/db")

class TaskController {
    // get all

    async getAll(req, res) {
        try {
            const user = req.user;
            const { status, date, page, limit: queryLimit, q, all } = req.query;

            let params = []
            let conditions = []

            if (!user.is_admin) {
                params.push(user.id)
                conditions.push(`tasks.user_id = $${params.length}`)
            }

            if (status && status !== 'all') {
                params.push(status)
                conditions.push(`tasks.status = $${params.length}`)
            }

            if (date && date !== 'all') {
                if (date === 'today' || date === 'bugun' || date === 'bugungi') {
                    conditions.push(`tasks.created_at >= CURRENT_DATE`)
                } else if (date === 'week' || date === 'hafta' || date === 'haftalik' || date === 'oxirgi_xafta') {
                    conditions.push(`tasks.created_at >= CURRENT_DATE - INTERVAL '7 days'`)
                } else if (date === 'month' || date === 'oy' || date === 'oylik') {
                    conditions.push(`tasks.created_at >= CURRENT_DATE - INTERVAL '30 days'`)
                }
            }

            if (q && q.trim() !== '') {
                params.push(`%${q.trim()}%`);
                conditions.push(`(
                    COALESCE(tasks.message, '') ILIKE $${params.length} 
                    OR COALESCE(users.first_name, '') ILIKE $${params.length} 
                    OR COALESCE(users.last_name, '') ILIKE $${params.length}
                )`);
            }

            const whereSql = conditions.length > 0 ? " WHERE " + conditions.join(" AND ") : "";

            if (all === 'true') {
                let query = `
                    SELECT 
                        tasks.*, 
                        users.first_name, 
                        users.last_name 
                    FROM tasks 
                    LEFT JOIN users ON tasks.user_id = users.id
                    ${whereSql}
                    ORDER BY tasks.id DESC
                `;
                const { rows } = await pool.query(query, params);
                return res.status(200).json({ total: rows.length, tasks: rows });
            }

            const pageNum = Math.max(1, parseInt(page, 10) || 1);
            const limit = Math.max(1, parseInt(queryLimit, 10) || 10);
            const offset = (pageNum - 1) * limit;

            // Count query
            const countQuery = `
                SELECT COUNT(*) as total_count
                FROM tasks
                LEFT JOIN users ON tasks.user_id = users.id
                ${whereSql}
            `;
            const countResult = await pool.query(countQuery, params);
            const totalCount = parseInt(countResult.rows[0].total_count, 10) || 0;
            const totalPages = Math.max(1, Math.ceil(totalCount / limit));

            // Paginated items query
            const listParams = [...params, limit, offset];
            const listQuery = `
                SELECT 
                    tasks.*, 
                    users.first_name, 
                    users.last_name 
                FROM tasks 
                LEFT JOIN users ON tasks.user_id = users.id
                ${whereSql}
                ORDER BY tasks.id DESC
                LIMIT $${params.length + 1} OFFSET $${params.length + 2}
            `;
            const { rows } = await pool.query(listQuery, listParams);

            return res.status(200).json({
                total: totalCount,
                total_pages: totalPages,
                page: pageNum,
                limit: limit,
                tasks: rows
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Serverda xatolik yuz berdi!" });
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

            let query
            let queryParams = [status, id, user.id]

            if (status === 'completing') {
                query = "UPDATE tasks SET status = $1, started_at = COALESCE(started_at, NOW()) WHERE id = $2 AND user_id = $3 RETURNING *"
            } else if (status === 'completed') {
                query = "UPDATE tasks SET status = $1, finished_at = COALESCE(finished_at, NOW()) WHERE id = $2 AND user_id = $3 RETURNING *"
            } else {
                query = "UPDATE tasks SET status = $1 WHERE id = $2 AND user_id = $3 RETURNING *"
            }

            const { rows } = await pool.query(query, queryParams)

            if (rows.length === 0) {
                return res.status(403).json({ message: "Topshiriq statusini faqat topshiriq biriktirilgan xodim o'zgartira oladi!" })
            }

            return res.status(200).json(rows[0])
        } catch (error) {
            console.log(error)
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