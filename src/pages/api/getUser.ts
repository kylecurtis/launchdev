// ============================================================================
// IMPORTS
// ============================================================================

import type { APIRoute } from "astro";
import { pool } from "../../lib/db";
import jwt from "jsonwebtoken";

// ============================================================================
// GET THE SECRET_KEY
// ============================================================================

// Used to verify JWT tokens issued at login
const SECRET_KEY = import.meta.env.SECRET_KEY;

// ============================================================================
// Astro APIRoute (GET HTTP method)
// ============================================================================

// This function runs whenever a client makes a GET request to the route
// The "request" parameter contains headers, cookies, etc. for handling the request
export const GET: APIRoute = async ({ request }) => {
    try {
        // Extract the JWT from the cookie header
        // Searches for "token=" in the string (cookie name)
        // ([^;]+) is a capture group that matches one or more characters (+)
        // that are not a semicolon
        const cookieHeader = request.headers.get("cookie") || "";
        const tokenMatch = cookieHeader.match(/token=([^;]+)/);

        // If no token is available, respond with 401 error
        if (!tokenMatch) {
            return new Response(JSON.stringify({ error: "No token" }), {
                status: 401,
            });
        }
        const token = tokenMatch[1];

        // ====================================================================
        // VERIFY AND DECODE THE JWT TOKEN
        // ====================================================================

        // If the JWT token expired or is invalid, return a 401 error
        let payload: any;
        try {
            payload = jwt.verify(token, SECRET_KEY);
        } catch (err) {
            return new Response(
                JSON.stringify({ error: "Invalid or expired token" }),
                {
                    status: 401,
                }
            );
        }

        // ====================================================================
        // FETCH THE USER RECORDS FROM THE DATABASE
        // ====================================================================

        // The payload should contain a userID
        const result = await pool.query(
            "SELECT id, email, name, is_paid, plan FROM users WHERE id = $1",
            [payload.userId]
        );

        // If no user records are found, return a 404 error
        if (result.rowCount === 0) {
            return new Response(JSON.stringify({ error: "No user found" }), {
                status: 404,
            });
        }

        // ====================================================================
        // RETURN THE USER DATA AS JSON (200 OK STATUS)
        // ====================================================================

        const user = result.rows[0];
        return new Response(JSON.stringify({ user }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (err) {
        // Catch any unexpected server errors and return a 500 status
        console.error("Error in getUser:", err);
        return new Response(JSON.stringify({ error: "Server error" }), {
            status: 500,
        });
    }
};
