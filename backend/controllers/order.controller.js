const pool = require('../config/db.js')

class OrderController {
    async getAllOrders(req, res) {
        try {
            const orders = await pool.query('select * from orders')

            if (!orders.rows.length) return res.status(404).json({ message: 'Buyurtmalar topilmadi!' })

            res.status(200).json(orders.rows)
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: 'Serverda xatolik yuz berdi!' })
        }
    }

    async createOrder(req, res) {
        try {
            const { customer_name, branch_name, phone, book_name, book_size, book_count, note, deadline } = req.body

            if (!customer_name || !branch_name || !phone || !book_name || !book_size || !book_count) {
                return res.status(400).json({ message: 'Barcha maydonlarni to\'ldiring!' })
            }

            const order = await pool.query('INSERT INTO orders (customer_name, branch_name, phone, book_name, book_size, book_count, note, deadline) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [customer_name, branch_name, phone, book_name, book_size, book_count, note, deadline])

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

            const order = await pool.query('UPDATE orders SET customer_name = $1, branch_name = $2, phone = $3, book_name = $4, book_size = $5, book_count = $6, note = $7, deadline = $8 where id = $9', [customer_name, branch_name, phone, book_name, book_size, book_count, note, deadline, id])

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