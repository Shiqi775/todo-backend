// connect to PostgreSQL
const { Pool } = require('pg');          // Import PostgreSQL client
require('dotenv').config();              // Load environment variables from .env

// Create a new connection pool using our database URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Export the pool so other files can use it
module.exports = pool;
