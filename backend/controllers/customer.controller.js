const pool = require('../config/db');

class CustomerController {
    // get all

    async getAllCustomers(req, res) {
        try {
            const { page, limit: queryLimit, q, all } = req.query;

            // Agar all === 'true' bo'lsa barcha mijozlarni qaytaramiz
            if (all === 'true') {
                const searchQuery = q && q.trim() !== '' ? `%${q.trim()}%` : '%';
                const { rows } = await pool.query(
                    `SELECT * FROM customers 
                     WHERE (COALESCE(customer_name, '') ILIKE $1 
                        OR COALESCE(phone, '') ILIKE $1 
                        OR COALESCE(branch_name, '') ILIKE $1)
                     ORDER BY id DESC`,
                    [searchQuery]
                );
                return res.json(rows);
            }

            const pageNum = Math.max(1, parseInt(page, 10) || 1);
            const limit = Math.max(1, parseInt(queryLimit, 10) || 10);
            const offset = (pageNum - 1) * limit;
            const searchQuery = q && q.trim() !== '' ? `%${q.trim()}%` : '%';

            // Jami sonini hisoblash
            const countQuery = `
                SELECT COUNT(*) as total_count
                FROM customers
                WHERE (COALESCE(customer_name, '') ILIKE $1 
                   OR COALESCE(phone, '') ILIKE $1 
                   OR COALESCE(branch_name, '') ILIKE $1)
            `;
            const countRes = await pool.query(countQuery, [searchQuery]);
            const totalCount = parseInt(countRes.rows[0].total_count, 10) || 0;
            const totalPages = Math.max(1, Math.ceil(totalCount / limit));

            // Sahifalangan mijozlar ro'yxati
            const listQuery = `
                SELECT *
                FROM customers
                WHERE (COALESCE(customer_name, '') ILIKE $1 
                   OR COALESCE(phone, '') ILIKE $1 
                   OR COALESCE(branch_name, '') ILIKE $1)
                ORDER BY id DESC
                LIMIT $2 OFFSET $3
            `;
            const result = await pool.query(listQuery, [searchQuery, limit, offset]);

            res.status(200).json({
                customers: result.rows,
                page: pageNum,
                limit: limit,
                total_pages: totalPages,
                total: totalCount
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    // create customer

    async createCustomer(req, res) {
        try {
            const { customer_name, phone, telegram_id, branch_name } = req.body;

            if (telegram_id) {
                const existing = await pool.query('SELECT * FROM customers WHERE telegram_id = $1', [telegram_id]);
                if (existing.rows.length > 0) {
                    const { rows } = await pool.query(
                        `UPDATE customers SET customer_name = $1, phone = $2, branch_name = $3 WHERE telegram_id = $4 RETURNING *`,
                        [customer_name, phone, branch_name, telegram_id]
                    );
                    return res.json(rows[0]);
                }
            }

            const { rows } = await pool.query(
                `INSERT INTO customers (customer_name, phone, telegram_id, branch_name) VALUES ($1, $2, $3, $4) RETURNING *`,
                [customer_name, phone, telegram_id, branch_name]
            );
            res.json(rows[0]);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    // get by id

    async getById(req, res) {
        try {
            const { id } = req.params;

            if (!id) return res.status(400).json({ message: "Telegram ID aniqlanmadi!" });

            const { rows } = await pool.query('SELECT * FROM customers WHERE telegram_id = $1', [id])

            if (rows.length === 0) return res.json({ message: "Mijoz topilmadi" });

            return res.json(rows[0]);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    // update

    async update(req, res) {
        try {
            const { id } = req.params;
            const { customer_name, phone, telegram_id, branch_name } = req.body;

            if (!id) return res.status(400).json({ message: "Mijoz ID aniqlanmadi!" });

            const { rows } = await pool.query('UPDATE customers SET customer_name = $1, phone = $2, telegram_id = $3, branch_name = $4 WHERE telegram_id = $5 OR id::text = $5 RETURNING *', [customer_name, phone, telegram_id, branch_name, id])

            if (rows.length === 0) return res.status(404).json({ message: "Mijoz topilmadi" });

            return res.json(rows[0]);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    // update debt

    async updateDebt(req, res) {
        try {
            const { id } = req.params;
            const { debt } = req.body;

            if (!id) return res.status(400).json({ message: "Mijoz ID aniqlanmadi!" });

            const { rows } = await pool.query('UPDATE customers SET debt = COALESCE(debt, 0) + $1 WHERE telegram_id = $2 OR id::text = $2 RETURNING *', [debt, id])

            if (rows.length === 0) return res.status(404).json({ message: "Mijoz topilmadi" });

            return res.json(rows[0]);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    // delete customer

    async deleteCustomer(req, res) {
        try {
            const { id } = req.params;

            if (!id) return res.status(400).json({ message: "Mijoz ID aniqlanmadi!" });

            const { rows } = await pool.query('DELETE FROM customers WHERE id = $1 RETURNING *', [id])

            if (rows.length === 0) return res.status(404).json({ message: "Mijoz topilmadi" });

            return res.json({ message: "Mijoz o'chirildi" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}

module.exports = new CustomerController();