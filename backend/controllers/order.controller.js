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

    async updateStatus(req, res) {
        try {
            const { id } = req.params
            const { status, price, sold_at, is_debt, debt_note, debt_deadline } = req.body

            const updates = []
            const values = []

            if (status !== undefined) {
                values.push(status)
                updates.push(`status = $${values.length}`)
            }

            if (price !== undefined) {
                const numPrice = price === '' || price === null ? null : Number(price)
                values.push(numPrice)
                updates.push(`price = $${values.length}`)
            }

            if (is_debt !== undefined) {
                values.push(Boolean(is_debt))
                updates.push(`is_debt = $${values.length}`)
            }

            if (debt_note !== undefined) {
                values.push(debt_note)
                updates.push(`debt_note = $${values.length}`)
            }

            if (debt_deadline !== undefined) {
                values.push(debt_deadline || null)
                updates.push(`debt_deadline = $${values.length}`)
            }

            if (sold_at !== undefined) {
                values.push(sold_at)
                updates.push(`sold_at = $${values.length}`)
            } else if (price !== undefined && price !== null && price !== '') {
                updates.push(`sold_at = NOW()`)
            }

            if (updates.length > 0) {
                values.push(id)
                const queryText = `UPDATE orders SET ${updates.join(', ')} WHERE id = $${values.length}`
                await pool.query(queryText, values)
            }

            const orderRes = await pool.query(
                'SELECT id, customer_id, customer_name, branch_name, phone, note, debt_note, debt_deadline, is_debt, price FROM orders WHERE id = $1',
                [id]
            )
            const currentOrder = orderRes.rows[0]

            if (currentOrder) {
                const customerId = currentOrder.customer_id || currentOrder.phone || String(currentOrder.id)

                const debtRes = await pool.query(
                    currentOrder.customer_id
                        ? 'SELECT COALESCE(SUM(price), 0) AS total_debt FROM orders WHERE customer_id::text = $1::text AND is_debt = true'
                        : 'SELECT COALESCE(SUM(price), 0) AS total_debt FROM orders WHERE id = $1 AND is_debt = true',
                    [currentOrder.customer_id ? String(currentOrder.customer_id) : id]
                )
                const totalDebt = Number(debtRes.rows[0]?.total_debt || 0)

                if (currentOrder.customer_id) {
                    await pool.query(
                        'UPDATE customers SET debt = $1 WHERE telegram_id::text = $2::text OR id::text = $2::text',
                        [totalDebt, String(currentOrder.customer_id)]
                    )
                }

                if (totalDebt > 0) {
                    let debtorName = currentOrder.customer_name
                    let debtorBranch = currentOrder.branch_name
                    let debtorPhone = currentOrder.phone
                    let debtorNote = currentOrder.debt_note || currentOrder.note || null
                    let debtorDeadline = currentOrder.debt_deadline || null

                    // Agar ushbu buyurtma qarz bo'lmasa, lekin mijozning boshqa qarz buyurtmasi bo'lsa, oxirgisidan olamiz
                    if (!currentOrder.is_debt && currentOrder.customer_id) {
                        const lastDebtOrder = await pool.query(
                            'SELECT customer_name, branch_name, phone, note, debt_note, debt_deadline FROM orders WHERE customer_id::text = $1::text AND is_debt = true ORDER BY id DESC LIMIT 1',
                            [String(currentOrder.customer_id)]
                        )
                        if (lastDebtOrder.rows.length > 0) {
                            const lOrder = lastDebtOrder.rows[0]
                            debtorName = lOrder.customer_name || debtorName
                            debtorBranch = lOrder.branch_name || debtorBranch
                            debtorPhone = lOrder.phone || debtorPhone
                            debtorNote = lOrder.debt_note || lOrder.note || debtorNote
                            debtorDeadline = lOrder.debt_deadline || debtorDeadline
                        }
                    }

                    const existingDebtor = await pool.query(
                        'SELECT id FROM debtors WHERE customer_id::text = $1::text',
                        [String(customerId)]
                    )

                    if (existingDebtor.rows.length > 0) {
                        await pool.query(
                            `UPDATE debtors 
                             SET total_debt = $1, customer_name = $2, branch_name = $3, phone = $4, note = $5, deadline = $6 
                             WHERE customer_id::text = $7::text`,
                            [totalDebt, debtorName, debtorBranch, debtorPhone, debtorNote, debtorDeadline, String(customerId)]
                        )
                    } else {
                        await pool.query(
                            `INSERT INTO debtors (total_debt, customer_id, customer_name, branch_name, phone, note, deadline, created_at) 
                             VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
                            [totalDebt, String(customerId), debtorName, debtorBranch, debtorPhone, debtorNote, debtorDeadline]
                        )
                    }
                } else {
                    await pool.query(
                        'DELETE FROM debtors WHERE customer_id::text = $1::text',
                        [String(customerId)]
                    )
                }
            }

            res.status(200).json({ message: 'Buyurtma statusi/narxi yangilandi!' })
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