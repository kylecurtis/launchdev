import type { APIRoute } from "astro";
import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
  connectionString: import.meta.env.DATABASE_URL,
});

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const email = url.searchParams.get("email");
    if (!email) {
      return new Response(JSON.stringify({ error: "Missing email" }), {
        status: 400,
      });
    }

    const result = await pool.query(
      `SELECT id, email, name, is_paid, plan FROM users WHERE email = $1`,
      [email]
    );

    if (result.rowCount === 0) {
      return new Response(JSON.stringify({ error: "No user found" }), {
        status: 404,
      });
    }

    const user = result.rows[0];
    return new Response(JSON.stringify({ user }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error in getUser:", err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
};
