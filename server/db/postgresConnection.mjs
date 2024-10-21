import pg from "pg";
import dotenv from "dotenv";

if (process.env.NODE_ENV === "prod") {
  dotenv.config({ path: ".env.prod" });
} else {
  dotenv.config({ path: ".env.dev" });
}

const ssl =
  process.env.PGSSLMODE === "require" ? { rejectUnauthorized: false } : false;

const { Pool } = pg;

export const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
  ssl,
});

export const connectDB = async () => {
  try {
    await pool.connect();
    console.log("Database connected successfully");
  } catch (err) {
    console.error("connection error", err.stack);
    throw err;
  }
};
