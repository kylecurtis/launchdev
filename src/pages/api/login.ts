// import type { APIRoute } from "astro";
import { pool } from "../../lib/db";
import bcrypt from "bcrypt";

export async function POST({ request }: { request: Request }) {
    try {
        const formData = await request.formData();
        const email = formData.get("email") as string | undefined;
        const password = formData.get("password") as string | undefined;

        if (!email || !password) {
            return new Response(
                JSON.stringify({ error: "Missing email or password" }),
                {
                    status: 400,
                }
            );
        }

        // Look up the user
        const result = await pool.query(
            "SELECT id, password_hash FROM users WHERE email = $1",
            [email]
        );

        if (result.rowCount === 0) {
            return new Response(JSON.stringify({ error: "User not found" }), {
                status: 401,
            });
        }

        const user = result.rows[0];

        // Compare the hash
        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) {
            return new Response(
                JSON.stringify({ error: "Invalid credentials" }),
                {
                    status: 401,
                }
            );
        }

        return new Response(null, {
            status: 302,
            headers: {
                Location: "/",
            },
        });
    } catch (error) {
        console.error("Login error", error);
        return new Response(JSON.stringify({ error: "Server Error" }), {
            status: 500,
        });
    }
}
