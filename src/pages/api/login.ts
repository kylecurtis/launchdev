// ============================================================================
// IMPORTS
// ============================================================================
import type { APIRoute } from "astro";
import { pool } from "../../lib/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// ============================================================================
// GET THE SECRET_KEY
// ============================================================================
const SECRET_KEY = import.meta.env.SECRET_KEY;

// ============================================================================
// Astro APIRoute (POST HTTP method)
// ============================================================================

// This function runs whenever a client makes a POST request to the route
export const POST: APIRoute = async ({ request }) => {
    try {
        // Parse the email and password from the form sent by the client in POST request
        const formData = await request.formData();
        const email = formData.get("email") as string | undefined;
        const password = formData.get("password") as string | undefined;

        // If email/password is missing, return 400 error
        if (!email || !password) {
            return new Response(
                JSON.stringify({ error: "Missing email/password" }),
                {
                    status: 400,
                }
            );
        }

        // ====================================================================
        // QUERY THE DATABASE FOR USER RECORD
        // ====================================================================

        // Check the user in DB
        const result = await pool.query(
            "SELECT id, password_hash FROM users WHERE email = $1",
            [email]
        );

        // If user not found, return 401 error
        if (result.rowCount === 0) {
            return new Response(JSON.stringify({ error: "User not found" }), {
                status: 401,
            });
        }

        // Match password hash (using bcrypt) for user with database
        const user = result.rows[0];
        const match = await bcrypt.compare(password, user.password_hash);

        // If password doesn't match, return 401 error
        if (!match) {
            return new Response(
                JSON.stringify({ error: "Invalid credentials" }),
                {
                    status: 401,
                }
            );
        }

        // ====================================================================
        // CREATE A JWT
        // ====================================================================

        // Creates a JWT that encodes the user's ID (and email).
        // Token expires in 1 hour
        const token = jwt.sign({ userId: user.id, email: email }, SECRET_KEY, {
            expiresIn: "1h",
        });

        // ====================================================================
        // RETURN RESPONSE
        // HttpOnly cookie ensures client-side scripts can't read the token
        // ====================================================================

        // Return a response that sets the token in an HTTP-only cookie
        // and redirects the user back to the homepage ("/")
        return new Response(null, {
            status: 302,
            headers: {
                Location: "/",
                "Set-Cookie": `token=${token}; HttpOnly; Path=/; Max-Age=3600`,
            },
        });
        // Catch and throw login server 500 error
    } catch (error) {
        console.error("Login error", error);
        return new Response(JSON.stringify({ error: "Server Error" }), {
            status: 500,
        });
    }
};
