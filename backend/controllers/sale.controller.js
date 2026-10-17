const pool = require('../config/db')

class SaleController {
    async getAll(req, res) {
        try {
            const { page, q } = req.query;
            const pageNum = Math.max(1, parseInt(page, 10) || 1);
            const limit = 10;
            const offset = (pageNum - 1) * limit;
            const searchQuery = q && q.trim() !== '' ? `%${q.trim()}%` : '%';

            // Umumiy statistika va jami soni
            const statsQuery = `
                SELECT 
                    COUNT(*) as total_count,
                    COALESCE(SUM(book_count), 0) as total_books,
                    COALESCE(SUM(CASE WHEN is_debt = true THEN (COALESCE(price, 0) * COALESCE(book_count, 0)) ELSE 0 END), 0) as total_debt,
                    COALESCE(SUM(CASE WHEN is_debt = false OR is_debt IS NULL THEN (COALESCE(price, 0) * COALESCE(book_count, 0)) ELSE 0 END), 0) as total_money
                FROM orders 
                WHERE status = 'delivered' 
                  AND (COALESCE(customer_name, '') ILIKE $1 OR COALESCE(book_name, '') ILIKE $1 OR COALESCE(branch_name, '') ILIKE $1 OR COALESCE(phone, '') ILIKE $1)
            `;
            const statsRes = await pool.query(statsQuery, [searchQuery]);
            const stats = statsRes.rows[0];
            const totalCount = parseInt(stats.total_count, 10) || 0;
            const totalPages = Math.max(1, Math.ceil(totalCount / limit));

            // Sahifalangan sotuvlar ro'yxati
            const listQuery = `
                SELECT id, customer_name, is_debt, branch_name, phone, book_name, book_size, book_count, price, sold_at, created_at 
                FROM orders 
                WHERE status = 'delivered' 
                  AND (COALESCE(customer_name, '') ILIKE $1 OR COALESCE(book_name, '') ILIKE $1 OR COALESCE(branch_name, '') ILIKE $1 OR COALESCE(phone, '') ILIKE $1)
                ORDER BY sold_at DESC NULLS LAST, id DESC 
                LIMIT $2 OFFSET $3
            `;
            const result = await pool.query(listQuery, [searchQuery, limit, offset]);

            const sales = result.rows.map((item) => {
                return {
                    ...item,
                    total_price: (Number(item.price) || 0) * (Number(item.book_count) || 0)
                };
            });

            res.status(200).json({ 
                total_transaction: totalCount, 
                total_money: Number(stats.total_money) || 0, 
                total_debt: Number(stats.total_debt) || 0, 
                total_books: Number(stats.total_books) || 0, 
                sales: sales,
                page: pageNum,
                limit: limit,
                total_pages: totalPages,
                total: totalCount
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Serverda xatolik yuz berdi' });
        }
    }

    async getById(req, res) {
        try {
            const { id } = req.params
            const result = await pool.query('SELECT * FROM sales WHERE id = $1', [id])
            res.json(result.rows[0])
        } catch (error) {
            res.status(500).json({ message: 'Serverda xatolik yuz berdi' })
        }
    }
}

module.exports = new SaleController()
