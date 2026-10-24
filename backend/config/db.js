const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

const initDb = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS user_sessions (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                session_token VARCHAR(255) UNIQUE NOT NULL,
                device_type VARCHAR(50) DEFAULT 'desktop',
                browser VARCHAR(100) DEFAULT 'Noma''lum brauzer',
                os VARCHAR(100) DEFAULT 'Noma''lum tizim',
                ip_address VARCHAR(100),
                location VARCHAR(100) DEFAULT 'Toshkent',
                user_agent TEXT,
                last_active TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
            CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
            CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);
        `);
    } catch (err) {
        console.error("Error creating user_sessions table:", err.message);
    }
};

initDb();

module.exports = pool;