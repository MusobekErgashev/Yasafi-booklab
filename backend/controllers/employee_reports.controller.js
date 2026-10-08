const pool = require('../config/db')

class EmployeeReports {
    // get all

    async getAll(req, res) {
        try {
            const reports = await pool.query('SELECT * FROM employee_reports ORDER BY created_at DESC');

            if (reports.rows.length === 0) return res.status(404).json({ message: "Hisobot topilmadi!" });

            const employeeIds = [...new Set(reports.rows.map((item) => item.employee_id))];
            const employees = await pool.query('SELECT id, first_name, last_name FROM users WHERE id = ANY($1)', [employeeIds]);

            const employeeMap = new Map(employees.rows.map(emp => [Number(emp.id), emp]));

            const reportsWithEmployee = reports.rows.map(report => ({
                employee: employeeMap.get(Number(report.employee_id)) || null,
                report: report
            }));

            return res.status(200).json({ total: reports.rows.length, reports: reportsWithEmployee });
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