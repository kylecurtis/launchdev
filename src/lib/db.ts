// ============================================================================
// IMPORTS
// ============================================================================

import pg from "pg";

// ============================================================================
// DATABASE SETUP
// ============================================================================

const { Pool } = pg;

// Get the database connection from environment variable (DATABASE_URL)
// DATABASE_URL is defined in the .env file (root directory)
const connectionString = import.meta.env.DATABASE_URL;

// If no DATABASE_URL is found, throw an error at startup
// This prevents confusing errors due to missing database connection
if (!connectionString) {
    throw new Error("DATABASE_URL is not defined in .env");
}

// Create a "pool" of reusable connections to the database
// This helps manage and optimize multiple database queries in the application
export const pool = new Pool({
    connectionString,
});

// Optional helper function to grab a single client from the pool
// Useful if direct control of a transaction / operation is needed
export async function getClient() {
    return pool.connect();
}
