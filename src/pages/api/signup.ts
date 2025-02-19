// src/pages/api/signup.ts
import { pool } from "../../lib/db";
import bcrypt from "bcrypt";

export async function POST({ request }: { request: Request }) {
    try {
        const formData = await request.formData();
        const email = formData.get("email") as string | undefined;
        const password = formData.get("password") as string | undefined;
        const name = formData.get("name") as string | undefined;

        if (!email || !password || !name) {
            return new Response(
                JSON.stringify({ error: "Missing email, password, or name" }),
                {
                    status: 400,
                }
            );
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const query = `
          INSERT INTO users (email, password_hash, name)
          VALUES ($1, $2, $3)
        `;
        await pool.query(query, [email, hashedPassword, name]);

        // Return success
        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
        console.error("Signup error", error);
        return new Response(JSON.stringify({ error: "Server Error" }), {
            status: 500,
        });
    }
}
