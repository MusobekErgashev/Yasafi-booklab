const pool = require('../config/db');

class CategoryController {
    async getAllCategories(req, res) {
        try {
            const categories = await pool.query('SELECT * FROM categories ORDER BY id ASC');
            const books = await pool.query('SELECT * FROM books');

            const categoriesWithBooks = categories.rows.map(category => {
                const categoryBooks = books.rows.filter(book => book.category_name === category.name);
                return {
                    ...category,
                    books: categoryBooks
                };
            });

            res.status(200).json(categoriesWithBooks);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Serverda xatolik yuz berdi!' });
        }
    }

    async createCategory(req, res) {
        try {
            const { name } = req.body;

            if (!name) return res.status(400).json({ message: 'Kategoriya nomi kiritilmadi!' });
            if (name.length > 50) return res.status(400).json({ message: 'Kategoriya nomi 50 simvoldan oshmasligi kerak!' });

            const category = await pool.query('INSERT INTO categories (name) VALUES ($1) RETURNING *', [name]);

            res.status(201).json(category.rows[0]);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Serverda xatolik yuz berdi!' });
        }
    }

    async updateCategory(req, res) {
        try {
            const { id, name } = req.body;

            if (!id || !name) return res.status(400).json({ message: 'Kategoriya ID va nomi kiritilmadi!' });
            if (name.length > 50) return res.status(400).json({ message: 'Kategoriya nomi 50 simvoldan oshmasligi kerak!' });

            const category = await pool.query('UPDATE categories SET name = $1 WHERE id = $2 RETURNING *', [name, id]);

            res.status(200).json(category.rows[0]);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Serverda xatolik yuz berdi!' });
        }
    }

    async deleteCategory(req, res) {
        try {
            const { id } = req.body;

            if (!id) return res.status(400).json({ message: 'Kategoriya ID kiritilmadi!' });

            const category = await pool.query('DELETE FROM categories WHERE id = $1 RETURNING *', [id]);

            res.status(200).json(category.rows[0]);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Serverda xatolik yuz berdi!' });
        }
    }
}

module.exports = new CategoryController();