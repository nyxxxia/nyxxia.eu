const maxUserLength = 60;
const maxInquiryLength = 500;

const jsonResponse = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });

const sanitizeString = (value, maxLength) => {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed || trimmed.length > maxLength) {
    return null;
  }

  return trimmed;
};

const ensureTable = async (db) => {
  await db
    .prepare(
      `CREATE TABLE IF NOT EXISTS inquiries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user TEXT NOT NULL,
        inquiry TEXT NOT NULL,
        created_at TEXT NOT NULL
      );`
    )
    .run();
};

export async function onRequest(context) {
  const { request, env } = context;

  if (!env || !env.DB) {
    return jsonResponse(
      { error: "Database binding missing. Configure a D1 binding named DB." },
      500
    );
  }

  await ensureTable(env.DB);

  if (request.method === "GET") {
    const { results } = await env.DB
      .prepare(
        "SELECT id, user, inquiry, created_at as createdAt FROM inquiries ORDER BY id ASC"
      )
      .all();
    return jsonResponse({ items: results || [] });
  }

  if (request.method === "POST") {
    let payload;
    try {
      payload = await request.json();
    } catch {
      return jsonResponse({ error: "Invalid JSON payload." }, 400);
    }

    const user = sanitizeString(payload?.user, maxUserLength);
    const inquiry = sanitizeString(payload?.inquiry, maxInquiryLength);

    if (!user || !inquiry) {
      return jsonResponse(
        { error: "Both user and inquiry are required." },
        400
      );
    }

    const createdAt = new Date().toISOString();
    const result = await env.DB
      .prepare(
        "INSERT INTO inquiries (user, inquiry, created_at) VALUES (?, ?, ?)"
      )
      .bind(user, inquiry, createdAt)
      .run();

    return jsonResponse(
      {
        item: {
          id: result?.meta?.last_row_id ?? null,
          user,
          inquiry,
          createdAt,
        },
      },
      201
    );
  }

  return new Response("Method Not Allowed", {
    status: 405,
    headers: {
      Allow: "GET, POST",
    },
  });
}
