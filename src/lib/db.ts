import pg from "pg";
const { Pool } = pg;

// DATABASE_URL from .env
const connectionString = import.meta.env.DATABASE_URL;

if (!connectionString) {
    throw new Error("DATABASE_URL is not defined in .env");
}

// Creates a pool of connections to the database
export const pool = new Pool({
    connectionString,
});

// Grab a client from the pool
export async function getClient() {
    return pool.connect();
}
