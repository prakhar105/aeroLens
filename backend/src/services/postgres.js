// services/postgres.js
import pkg from "pg";
const { Pool } = pkg;

// Create Postgres connection pool
const pool = new Pool({
  user: process.env.PG_USER || "alex",
  password: process.env.PG_PASSWORD || "alex123",
  host: process.env.PG_HOST || "localhost",
  port: process.env.PG_PORT || 5432,
  database: process.env.PG_DATABASE || "aerial_ai",
  max: 10,                // max number of clients
  idleTimeoutMillis: 30000, // close idle clients after 30s
});

/**
 * Initialize Postgres (create tables if not exist)
 */
export const initPostgres = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS detections (
        id SERIAL PRIMARY KEY,
        upload_id VARCHAR(64) NOT NULL,
        label VARCHAR(50) NOT NULL,
        confidence NUMERIC CHECK (confidence >= 0 AND confidence <= 1),
        bbox JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log("✅ Postgres table 'detections' is ready");
  } catch (err) {
    console.error("❌ Postgres init error:", err.message);
    throw err;
  }
};

// Graceful shutdown handler
process.on("SIGINT", async () => {
  await pool.end();
  console.log("🛑 Postgres pool closed");
  process.exit(0);
});

export default pool;
