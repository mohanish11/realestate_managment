require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

const createTables = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS localities (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) UNIQUE NOT NULL
            );
        `);
        await pool.query(`
            CREATE TABLE IF NOT EXISTS properties (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                locality_id INTEGER REFERENCES localities(id),
                owner_name VARCHAR(255) NOT NULL
            );
        `);
        console.log('Tables are successfully created or already exist.');
    } catch (error) {
        console.error('Error creating tables:', error);
        throw error;
    }
};

module.exports = { pool, createTables };
