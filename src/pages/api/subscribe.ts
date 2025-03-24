// ============================================================================
// IMPORTS
// ============================================================================

import type { APIRoute } from "astro";
import { pool } from "../../lib/db";
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
        // Extract the JWT from the cookie header
        // Searches for "token=" in the string (cookie name)
        // ([^;]+) is a capture group that matches one or more characters (+)
        // that are not a semicolon
        const cookieHeader = request.headers.get("cookie") || "";
        const tokenMatch = cookieHeader.match(/token=([^;]+)/);

        // If token doesn't match, return 401 error
        if (!tokenMatch) {
            return new Response(
                JSON.stringify({ error: "No token provided" }),
                {
                    status: 401,
                }
            );
        }
        const token = tokenMatch[1];

        // ====================================================================
        // VERIFY AND DECODE THE JWT TOKEN
        // ====================================================================

        // If it's invalid or expired, return a 401 error (Unauthorized)
        let payload: any;
        try {
            payload = jwt.verify(token, SECRET_KEY);
        } catch (err) {
            return new Response(
                JSON.stringify({ error: "Invalid or expired token" }),
                { status: 401 }
            );
        }

        // ====================================================================
        // PARSE THE PLAN FROM JSON
        // ====================================================================

        // Parse the plan from the JSON body (monthly, yearly)
        const { plan } = await request.json();

        // If plan is not found, return 400 error
        if (!plan) {
            return new Response(JSON.stringify({ error: "Missing plan" }), {
                status: 400,
            });
        }

        // ====================================================================
        // UPDATE THE USER PLAN
        // ====================================================================

        // Set the user as paid in the db with correct plan
        // User = payload.userID from the token
        await pool.query(
            `UPDATE users
       SET is_paid = true,
           plan = $2
       WHERE id = $1`,
            [payload.userId, plan]
        );

        // Return with success (200)
        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (err) {
        // Catch any unexpected server errors and return a 500 status
        console.error("Subscribe error:", err);
        return new Response(JSON.stringify({ error: "Server error" }), {
            status: 500,
        });
    }
};
