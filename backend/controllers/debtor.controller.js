const pool = require("../config/db.js")

class DebtorController {
    async getAll(req, res) {
        try {
            const { page, limit: queryLimit, q, all } = req.query;

            // Umumiy statistika (kartochkalar uchun)
            const statsRes = await pool.query(`
                SELECT 
                    COALESCE(SUM(total_debt), 0) as total_debt,
                    COUNT(*) as total_debtors,
                    COUNT(CASE WHEN deadline IS NOT NULL AND deadline < NOW() THEN 1 END) as expired
                FROM debtors
            `);
            const overallTotalDebt = Number(statsRes.rows[0].total_debt || 0);
            const overallTotalDebtors = Number(statsRes.rows[0].total_debtors || 0);
            const overallExpired = Number(statsRes.rows[0].expired || 0);

            let whereClauses = [];
            let params = [];

            if (q && q.trim() !== '') {
                params.push(`%${q.trim()}%`);
                whereClauses.push(`(
                    COALESCE(customer_name, '') ILIKE $${params.length}
                    OR COALESCE(branch_name, '') ILIKE $${params.length}
                    OR COALESCE(phone, '') ILIKE $${params.length}
                    OR COALESCE(note, '') ILIKE $${params.length}
                )`);
            }

            const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
            const now = new Date();

            if (all === 'true') {
                const allRes = await pool.query(`SELECT * FROM debtors ${whereSql} ORDER BY id DESC`, params);
                const debtors = allRes.rows.map((item) => {
                    const deadlineVal = item.deadline;
                    let is_expired = false;
                    if (deadlineVal) {
                        const d = new Date(deadlineVal);
                        if (!isNaN(d.getTime())) {
                            is_expired = d < now;
                        }
                    }
                    let history = item.payment_history;
                    if (typeof history === 'string') {
                        try { history = JSON.parse(history); } catch { history = []; }
                    }
                    return {
                        ...item,
                        total_debt: Number(item.total_debt || 0),
                        payment_history: Array.isArray(history) ? history : [],
                        is_expired
                    };
                });

                return res.status(200).json({
                    total_debt: overallTotalDebt,
                    total_debtors: overallTotalDebtors,
                    expired: overallExpired,
                    total: allRes.rows.length,
                    total_pages: 1,
                    page: 1,
                    limit: allRes.rows.length,
                    debtors
                });
            }

            const pageNum = Math.max(1, parseInt(page, 10) || 1);
            const limitNum = Math.max(1, parseInt(queryLimit, 10) || 10);
            const offset = (pageNum - 1) * limitNum;

            const countRes = await pool.query(`SELECT COUNT(*) as count FROM debtors ${whereSql}`, params);
            const totalFiltered = parseInt(countRes.rows[0].count, 10) || 0;
            const totalPages = Math.max(1, Math.ceil(totalFiltered / limitNum));

            const listParams = [...params, limitNum, offset];
            const listQuery = `
                SELECT * FROM debtors
                ${whereSql}
                ORDER BY id DESC
                LIMIT $${params.length + 1} OFFSET $${params.length + 2}
            `;
            const result = await pool.query(listQuery, listParams);

            const debtors = result.rows.map((item) => {
                const deadlineVal = item.deadline;
                let is_expired = false;
                if (deadlineVal) {
                    const d = new Date(deadlineVal);
                    if (!isNaN(d.getTime())) {
                        is_expired = d < now;
                    }
                }
                let history = item.payment_history;
                if (typeof history === 'string') {
                    try { history = JSON.parse(history); } catch { history = []; }
                }
                return {
                    ...item,
                    total_debt: Number(item.total_debt || 0),
                    payment_history: Array.isArray(history) ? history : [],
                    is_expired
                };
            });

            return res.status(200).json({
                total_debt: overallTotalDebt,
                total_debtors: overallTotalDebtors,
                expired: overallExpired,
                total: totalFiltered,
                total_pages: totalPages,
                page: pageNum,
                limit: limitNum,
                debtors
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Serverda xatolik yuz berdi!' });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params
            const { amount, date } = req.body

            const numAmount = Number(amount)
            if (!numAmount || numAmount <= 0) {
                return res.status(400).json({ message: "To'lov summasi musbat son bo'lishi kerak!" })
            }

            // Mavjud qarzdorni olish
            const debtorRes = await pool.query("SELECT * FROM debtors WHERE id = $1", [id])
            if (debtorRes.rows.length === 0) {
                return res.status(404).json({ message: "Qarzdor topilmadi!" })
            }

            const currentDebtor = debtorRes.rows[0]
            const currentDebt = Number(currentDebtor.total_debt || 0)
            const newDebt = Math.max(0, currentDebt - numAmount)

            // Yangi to'lov yozuvi
            const formattedDate = date ? String(date).slice(0, 10) : new Date().toISOString().slice(0, 10)
            const newPayment = {
                id: Date.now(),
                paid_at: formattedDate,
                paid_amount: numAmount
            }

            let history = currentDebtor.payment_history
            if (typeof history === 'string') {
                try { history = JSON.parse(history) } catch { history = [] }
            }
            if (!Array.isArray(history)) {
                history = []
            }
            history.push(newPayment)

            // debtors jadvalini yangilash
            const updateResult = await pool.query(
                "UPDATE debtors SET total_debt = $1, payment_history = $2::jsonb WHERE id = $3 RETURNING *",
                [newDebt, JSON.stringify(history), id]
            )

            // Mijozlar jadvalidagi qarzni ham yangilash
            if (currentDebtor.customer_id) {
                await pool.query(
                    "UPDATE customers SET debt = $1 WHERE telegram_id::text = $2::text OR id::text = $2::text",
                    [newDebt, String(currentDebtor.customer_id)]
                ).catch(() => {})
            }

            const updatedRow = updateResult.rows[0]
            updatedRow.total_debt = Number(updatedRow.total_debt || 0)
            updatedRow.payment_history = history

            res.status(200).json(updatedRow)
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: 'Serverda xatolik yuz berdi!' })
        }
    }
}

module.exports = new DebtorController()