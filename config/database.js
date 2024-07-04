const { Pool } = require('pg');
require('dotenv').config();
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

const createTables = async () => {
    // Create Localities Table
    await pool.query(`
        CREATE TABLE IF NOT EXISTS localities (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) UNIQUE NOT NULL
        );
    `);

    // Create Properties Table
    await pool.query(`
        CREATE TABLE IF NOT EXISTS properties (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            locality_id INTEGER REFERENCES localities(id),
            owner_name VARCHAR(255) NOT NULL
        );
    `);
};

module.exports = { pool, createTables };
