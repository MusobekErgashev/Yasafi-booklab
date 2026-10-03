const pool = require('../config/db');

class CustomerController {
    async getAllCustomers(req, res) {
        try {
            const { rows } = await pool.query("SELECT * FROM customers");
            res.json(rows);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async createCustomer(req, res) {
        try {
            const { customer_name, phone, telegram_id, branch_name } = req.body;

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

    async getById(req, res) {
        try {

        } catch (error) {

        }
    }

    async update(req, res) {
        try {

        } catch (error) {

        }
    }
}

module.exports = new CustomerController();