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

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const query =
            "INSERT INTO users (email, password_hash) VALUES ($1, $2)";
        await pool.query(query, [email, hashedPassword]);

        // Return success
        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
        console.error("Signup error", error);
        return new Response(JSON.stringify({ error: "Server Error" }), {
            status: 500,
        });
    }
}
