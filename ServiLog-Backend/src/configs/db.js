const { Pool } = require('pg');
const logger = require('../utils/logger');
const { dbUrl } = require('./env');

const pool = new Pool({
    connectionString: dbUrl,
});

async function databaseConnectionTest() {
    try {
        const client = await pool.connect();
        logger.info('Database can be connected');
        await client.end();
    } catch (error) {
        logger.error('Error connecting to database:', error);
    }
}

module.exports = {
    pool,
    databaseConnectionTest
};