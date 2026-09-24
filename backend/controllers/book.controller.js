const pool = require('../config/db');

class BookController {
    async getAllBooks(req, res) {
        try {
            const books = await pool.query('SELECT * FROM books');
            res.status(200).json(books.rows);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Serverda xatolik yuz berdi!' });
        }
    }

    async createBook(req, res) {
        try {
            const { name, size, price, category_name } = req.body;

            if (!name || !size || !price) return res.status(400).json({ message: 'Barcha maydonlarni to`ldiring!' });
            if (name.length > 50) return res.status(400).json({ message: 'Kitob nomi 50 simvoldan oshmasligi kerak!' });

            let finalCategoryName = null;

            if (category_name && category_name.trim() !== '') {
                const trimmedCategory = category_name.trim();
                let category = await pool.query('SELECT * FROM categories WHERE LOWER(name) = LOWER($1)', [trimmedCategory]);

                if (category.rows.length === 0) {
                    category = await pool.query('INSERT INTO categories (name) VALUES ($1) RETURNING *', [trimmedCategory]);
                }

                finalCategoryName = category.rows[0].name;
            }

            const book = await pool.query(
                'INSERT INTO books (name, size, price, category_name) VALUES ($1, $2, $3, $4) RETURNING *',
                [name, size, price, finalCategoryName]
            );

            res.status(201).json(book.rows[0]);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Serverda xatolik yuz berdi!' });
        }
    }

    async updateBook(req, res) {
        try {
            const { id } = req.params;
            const { name, size, price, category_name } = req.body;

            let finalCategoryName = null;

            if (category_name && category_name.trim() !== '') {
                const trimmedCategory = category_name.trim();
                let category = await pool.query('SELECT * FROM categories WHERE LOWER(name) = LOWER($1)', [trimmedCategory]);

                if (category.rows.length === 0) {
                    category = await pool.query('INSERT INTO categories (name) VALUES ($1) RETURNING *', [trimmedCategory]);
                }

                finalCategoryName = category.rows[0].name;
            }

            const book = await pool.query(
                'UPDATE books SET name = $1, size = $2, price = $3, category_name = $4 WHERE id = $5 RETURNING *',
                [name, size, price, finalCategoryName, id]
            );

            res.status(200).json(book.rows[0]);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Serverda xatolik yuz berdi!' });
        }
    }

    async deleteBook(req, res) {
        try {
            const { id } = req.params;

            const book = await pool.query('DELETE FROM books WHERE id = $1 RETURNING *', [id]);
            res.status(200).json(book.rows[0]);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Serverda xatolik yuz berdi!' });
        }
    }
}

module.exports = new BookController();