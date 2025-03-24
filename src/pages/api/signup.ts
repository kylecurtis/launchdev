// ============================================================================
// IMPORTS
// ============================================================================

import { pool } from "../../lib/db";
import bcrypt from "bcrypt";

// ============================================================================
// Astro APIRoute (POST HTTP method)
// ============================================================================

export async function POST({ request }: { request: Request }) {
    try {
        // Parse the incoming form data for email, password, name
        const formData = await request.formData();
        const email = formData.get("email") as string | undefined;
        const password = formData.get("password") as string | undefined;
        const name = formData.get("name") as string | undefined;

        // Validate that all required fields are provided (or return 400 error)
        if (!email || !password || !name) {
            return new Response(
                JSON.stringify({ error: "Missing email, password, or name" }),
                {
                    status: 400,
                }
            );
        }

        // Hash the password (for database table)
        const hashedPassword = await bcrypt.hash(password, 10);

        // ============================================================================
        // INSERT USER RECORD
        // ============================================================================

        // Insert the new user record into the users table (with hashed password)
        const query = `
          INSERT INTO users (email, password_hash, name)
          VALUES ($1, $2, $3)
        `;
        await pool.query(query, [email, hashedPassword, name]);

        // If the insert succeeds, respond with success 200, otherwise
        // return error 500
        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
        console.error("Signup error", error);
        return new Response(JSON.stringify({ error: "Server Error" }), {
            status: 500,
        });
    }
}
