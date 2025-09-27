import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: "alex",
  password: "alex123",   // must be plain string
  host: "localhost",
  port: 5432,
  database: "aerial_ai",
});

export const initPostgres = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS detections (
      id SERIAL PRIMARY KEY,
      upload_id VARCHAR(64),
      label VARCHAR(50),
      confidence NUMERIC,
      bbox JSONB,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);
  console.log("✅ Postgres table ready");
};

export default pool;
