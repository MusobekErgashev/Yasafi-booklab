const pool = require('../config/db')

class EmployeeReports {
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
                conditions.push(`(employee_reports.message ILIKE $${params.length} OR users.first_name ILIKE $${params.length} OR users.last_name ILIKE $${params.length})`);
            }

            if (date && date !== 'all' && date !== '') {
                if (date === 'today' || date === 'bugun') {
                    conditions.push(`employee_reports.created_at >= CURRENT_DATE`);
                } else if (date === 'week' || date === 'oxirgi_xafta' || date === 'oxirgi_hafta') {
                    conditions.push(`employee_reports.created_at >= CURRENT_DATE - INTERVAL '7 days'`);
                }
            }

            const whereSql = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

            // Jami sonini hisoblash
            const countQuery = `
                SELECT COUNT(*) as total_count
                FROM employee_reports
                LEFT JOIN users ON users.id = employee_reports.employee_id
                ${whereSql}
            `;
            const countRes = await pool.query(countQuery, params);
            const totalCount = parseInt(countRes.rows[0].total_count, 10) || 0;
            const totalPages = Math.max(1, Math.ceil(totalCount / limit));

            // Sahifalangan hisobotlar ro'yxati
            const listParams = [...params, limit, offset];
            const listQuery = `
                SELECT 
                    employee_reports.id as report_id,
                    employee_reports.message,
                    employee_reports.employee_id,
                    employee_reports.created_at,
                    users.id as emp_id,
                    users.first_name,
                    users.last_name
                FROM employee_reports
                LEFT JOIN users ON users.id = employee_reports.employee_id
                ${whereSql}
                ORDER BY employee_reports.created_at DESC, employee_reports.id DESC
                LIMIT $${params.length + 1} OFFSET $${params.length + 2}
            `;
            const result = await pool.query(listQuery, listParams);

            const reportsWithEmployee = result.rows.map(row => ({
                employee: row.emp_id ? {
                    id: row.emp_id,
                    first_name: row.first_name,
                    last_name: row.last_name
                } : null,
                report: {
                    id: row.report_id,
                    message: row.message,
                    employee_id: row.employee_id,
                    created_at: row.created_at
                }
            }));

            return res.status(200).json({ 
                total: totalCount, 
                total_pages: totalPages,
                page: pageNum,
                limit: limit,
                reports: reportsWithEmployee 
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Serverda xatolik yuz berdi!" });
        }
    }

    // update

    async update(req, res) {
        try {
            const { id } = req.params;
            const { message } = req.body;
            const user = req.user;

            if (!id || isNaN(Number(id))) {
                return res.status(400).json({ message: "Noto'g'ri hisobot ID!" });
            }

            if (message.length > 200) return res.status(400).json({ message: "Hisobot matni 200 belgidan uzun bo'lishi mumkin emas!" });

            const existingReport = await pool.query('SELECT * FROM employee_reports WHERE id = $1', [id]);
            if (existingReport.rows.length === 0) {
                return res.status(404).json({ message: "Hisobot topilmadi!" });
            }

            const currentReport = existingReport.rows[0];

            if (!user.is_admin && Number(currentReport.employee_id) !== Number(user.id)) {
                return res.status(403).json({ message: "Sizga bunday imkoniyat berilmagan!" });
            }

            const updatedMessage = message !== undefined ? message : currentReport.message;

            const { rows } = await pool.query(
                'UPDATE employee_reports SET message = $1 WHERE id = $2 RETURNING *',
                [updatedMessage, id]
            );

            return res.status(200).json(rows[0]);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Serverda xatolik yuz berdi!" });
        }
    }

    // create

    async create(req, res) {
        try {
            const user = req.user;
            const { message } = req.body;

            if (!message || message.trim() === '') {
                return res.status(400).json({ message: "Hisobot matnini kiriting!" });
            }

            if (message.length > 200) return res.status(400).json({ message: "Hisobot matni 200 belgidan uzun bo'lishi mumkin emas!" });

            const { rows } = await pool.query(
                `INSERT INTO employee_reports (employee_id, message) 
                 VALUES ($1, $2) RETURNING *`,
                [user.id, message]
            );

            return res.status(201).json(rows[0]);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Serverda xatolik yuz berdi!" });
        }
    }

    // delete

    async delete(req, res) {
        try {
            const { id } = req.params;
            const user = req.user;

            if (!id || isNaN(Number(id))) {
                return res.status(400).json({ message: "ID noto'g'ri berildi!" });
            }

            const existingReport = await pool.query('SELECT * FROM employee_reports WHERE id = $1', [id]);
            if (existingReport.rows.length === 0) {
                return res.status(404).json({ message: "Hisobot topilmadi!" });
            }

            const currentReport = existingReport.rows[0];

            if (!user.is_admin && Number(currentReport.employee_id) !== Number(user.id)) {
                return res.status(403).json({ message: "Sizga bunday imkoniyat berilmagan!" });
            }

            await pool.query('DELETE FROM employee_reports WHERE id = $1', [id]);

            return res.status(200).json({ message: "Hisobot o'chirildi!" });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Serverda xatolik yuz berdi!" });
        }
    }
}

module.exports = new EmployeeReports();