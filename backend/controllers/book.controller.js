const pool = require('../config/db');

class BookController {
    async getAllBooks(req, res) {
        try {
            const { page, limit: queryLimit, q, category, all } = req.query;

            // Agar all === 'true' bo'lsa barcha kitoblarni qaytaramiz (masalan kategoriyalar hisobi uchun)
            if (all === 'true') {
                const searchQuery = q && q.trim() !== '' ? `%${q.trim()}%` : '%';
                let query = `
                    SELECT * FROM books 
                    WHERE (COALESCE(name, '') ILIKE $1 
                       OR COALESCE(size, '') ILIKE $1 
                       OR COALESCE(category_name, '') ILIKE $1)
                `;
                const params = [searchQuery];

                if (category && category !== '' && category !== 'uncategorized') {
                    let catName = category;
                    if (/^\d+$/.test(category)) {
                        const catRes = await pool.query('SELECT name FROM categories WHERE id = $1', [category]);
                        if (catRes.rows.length > 0) {
                            catName = catRes.rows[0].name;
                        }
                    }
                    params.push(catName);
                    query += ` AND LOWER(COALESCE(category_name, '')) = LOWER($${params.length})`;
                } else if (category === 'uncategorized') {
                    query += ` AND (category_name IS NULL OR category_name = '')`;
                }

                query += ` ORDER BY id DESC`;
                const books = await pool.query(query, params);
                return res.status(200).json(books.rows);
            }

            const pageNum = Math.max(1, parseInt(page, 10) || 1);
            const limit = Math.max(1, parseInt(queryLimit, 10) || 10);
            const offset = (pageNum - 1) * limit;
            const searchQuery = q && q.trim() !== '' ? `%${q.trim()}%` : '%';

            let whereClauses = [
                `(COALESCE(name, '') ILIKE $1 OR COALESCE(size, '') ILIKE $1 OR COALESCE(category_name, '') ILIKE $1)`
            ];
            let params = [searchQuery];

            if (category && category !== '' && category !== 'uncategorized') {
                let catName = category;
                if (/^\d+$/.test(category)) {
                    const catRes = await pool.query('SELECT name FROM categories WHERE id = $1', [category]);
                    if (catRes.rows.length > 0) {
                        catName = catRes.rows[0].name;
                    }
                }
                params.push(catName);
                whereClauses.push(`LOWER(COALESCE(category_name, '')) = LOWER($${params.length})`);
            } else if (category === 'uncategorized') {
                whereClauses.push(`(category_name IS NULL OR category_name = '')`);
            }

            const whereSql = `WHERE ` + whereClauses.join(' AND ');

            // Jami sonini hisoblash
            const countQuery = `SELECT COUNT(*) as total_count FROM books ${whereSql}`;
            const countRes = await pool.query(countQuery, params);
            const totalCount = parseInt(countRes.rows[0].total_count, 10) || 0;
            const totalPages = Math.max(1, Math.ceil(totalCount / limit));

            // Sahifalangan kitoblar ro'yxati
            const listParams = [...params, limit, offset];
            const listQuery = `
                SELECT * FROM books 
                ${whereSql}
                ORDER BY id DESC 
                LIMIT $${params.length + 1} OFFSET $${params.length + 2}
            `;
            const result = await pool.query(listQuery, listParams);

            res.status(200).json({
                books: result.rows,
                page: pageNum,
                limit: limit,
                total_pages: totalPages,
                total: totalCount
            });
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