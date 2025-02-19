import type { APIRoute } from "astro";
import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
  connectionString: import.meta.env.DATABASE_URL,
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const { email, plan } = await request.json();

    if (!email || !plan) {
      return new Response(JSON.stringify({ error: "Missing email or plan" }), {
        status: 400,
      });
    }

    // paid with the chosen plan
    await pool.query(
      `UPDATE users
       SET is_paid = true,
           plan = $2
       WHERE email = $1`,
      [email, plan]
    );

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error("Error in subscribe:", err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
};
