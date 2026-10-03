const pool = require('../config/db.js')

class OrderController {
    async getAllOrders(req, res) {
        try {
            const { page, limit, order, status, from, to, size, q } = req.query;

            let queryText = 'SELECT * FROM orders';
            let countQueryText = 'SELECT COUNT(*) FROM orders';
            const conditions = [];
            const params = [];

            if (status) {
                params.push(status);
                conditions.push(`status = $${params.length}`);
            }

            if (from) {
                params.push(from);
                conditions.push(`created_at >= $${params.length}::timestamp`);
            }

            if (to) {
                const toDateStr = to.includes(' ') || to.includes('T') ? to : `${to} 23:59:59`;
                params.push(toDateStr);
                conditions.push(`created_at <= $${params.length}::timestamp`);
            }

            if (size) {
                params.push(`%${size}%`);
                conditions.push(`book_size ILIKE $${params.length}`);
            }

            if (q && q.trim() !== '') {
                params.push(`%${q.trim()}%`);
                const pIdx = params.length;
                conditions.push(`(
                    customer_name ILIKE $${pIdx} OR 
                    branch_name ILIKE $${pIdx} OR 
                    phone ILIKE $${pIdx} OR 
                    book_name ILIKE $${pIdx} OR 
                    note ILIKE $${pIdx} OR 
                    CAST(id AS TEXT) ILIKE $${pIdx}
                )`);
            }

            if (conditions.length > 0) {
                const whereClause = ' WHERE ' + conditions.join(' AND ');
                queryText += whereClause;
                countQueryText += whereClause;
            }

            const countRes = await pool.query(countQueryText, params);
            const total = parseInt(countRes.rows[0].count, 10);

            const sortDirection = (order && order.toLowerCase() === 'asc') ? 'ASC' : 'DESC';
            queryText += ` ORDER BY created_at ${sortDirection}, id ${sortDirection}`;

            const queryParams = [...params];
            if (limit) {
                const parsedLimit = parseInt(limit, 10);
                const parsedPage = parseInt(page, 10) || 1;
                const offset = (parsedPage - 1) * parsedLimit;

                queryParams.push(parsedLimit);
                queryText += ` LIMIT $${queryParams.length}`;

                queryParams.push(offset);
                queryText += ` OFFSET $${queryParams.length}`;
            }

            const orders = await pool.query(queryText, queryParams);

            res.status(200).json({
                total,
                orders: orders.rows,
                page: page ? parseInt(page, 10) : 1,
                limit: limit ? parseInt(limit, 10) : total
            });
        } catch (error) {
            console.log("Error in getAllOrders:", error);
            res.status(500).json({ message: 'Serverda xatolik yuz berdi!' });
        }
    }

    async createOrder(req, res) {
        try {
            const { customer_name, branch_name, phone, book_name, book_size, book_count, note, deadline, customer_id } = req.body

            if (!customer_name || !branch_name || !phone || !book_name || !book_size || !book_count) {
                return res.status(400).json({ message: 'Barcha maydonlarni to\'ldiring!' })
            }

            const order = await pool.query('INSERT INTO orders (customer_name, branch_name, phone, book_name, book_size, book_count, note, deadline, customer_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)', [customer_name, branch_name, phone, book_name, book_size, book_count, note, deadline, customer_id])

            res.status(201).json({ message: 'Buyurtma yuborildi, tez orada aloqaga chiqishadi!' })
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: 'Serverda xatolik yuz berdi!' })
        }
    }

    async updateOrder(req, res) {
        try {
            const { id } = req.params
            const { customer_name, branch_name, phone, book_name, book_size, book_count, note, deadline } = req.body

            if (!book_name && !book_size && !book_count) {
                await pool.query(
                    'UPDATE orders SET customer_name = COALESCE($1, customer_name), branch_name = COALESCE($2, branch_name), phone = COALESCE($3, phone) WHERE id::text = $4 OR customer_id::text = $4',
                    [customer_name, branch_name, phone, id]
                )
                return res.status(200).json({ message: 'Buyurtma mijoz ma\'lumotlari yangilandi!' })
            }

            await pool.query(
                'UPDATE orders SET customer_name = $1, branch_name = $2, phone = $3, book_name = $4, book_size = $5, book_count = $6, note = $7, deadline = $8 WHERE id::text = $9 OR customer_id::text = $9',
                [customer_name, branch_name, phone, book_name, book_size, book_count, note, deadline, id]
            )

            res.status(200).json({ message: 'Buyurtma yangilandi!' })
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: 'Serverda xatolik yuz berdi!' })
        }
    }

    async updateStatus(req, res) {
        try {
            const { id } = req.params
            const { status } = req.body

            const order = await pool.query('UPDATE orders SET status = $1 where id = $2', [status, id])

            res.status(200).json({ message: 'Buyurtma statusi yangilandi!' })
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: 'Serverda xatolik yuz berdi!' })
        }
    }

    async getOrderStatus(req, res) {
        try {
            const { telegram_id } = req.params

            if (!telegram_id) return res.status(400).json({ message: 'Telegram ID topilmadi!' })

            const order = await pool.query('SELECT status, book_name, created_at FROM orders WHERE customer_id = $1 ORDER BY id DESC', [telegram_id])

            if (!order.rows.length) return res.status(404).json({ message: 'Buyurtma topilmadi!' })

            res.status(200).json(order.rows)
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: 'Serverda xatolik yuz berdi!' })
        }
    }

    async deleteOrder(req, res) {
        try {
            const { id } = req.params

            const order = await pool.query('delete from orders where id = $1', [id])

            res.status(200).json({ message: 'Buyurtma o\'chirildi!' })
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: 'Serverda xatolik yuz berdi!' })
        }
    }
}

module.exports = new OrderController()