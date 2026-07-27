// GET /.netlify/functions/roster
// Returns published Members + Projects (only rows with "Publish to site" checked).
// Only public fields are returned, never emails or internal notes.
// Requires env vars: AIRTABLE_TOKEN, AIRTABLE_BASE_ID

exports.handler = async () => {
  const TOKEN = process.env.AIRTABLE_TOKEN;
  const BASE = process.env.AIRTABLE_BASE_ID;
  if (!TOKEN || !BASE) {
    return json(500, { error: "Server not configured" });
  }
  const headers = { Authorization: `Bearer ${TOKEN}` };

  async function pull(table, fields) {
    const params = new URLSearchParams();
    params.set("filterByFormula", "{Publish to site}=1");
    fields.forEach((f) => params.append("fields[]", f));
    const url = `https://api.airtable.com/v0/${BASE}/${encodeURIComponent(table)}?${params.toString()}`;
    const r = await fetch(url, { headers });
    if (!r.ok) return [];
    const j = await r.json();
    return (j.records || []).map((rec) => rec.fields);
  }

  try {
    const [members, projects] = await Promise.all([
      pull("Members", ["Name", "Role", "Bio", "Photo URL", "Links"]),
      pull("Projects", ["Title", "Blurb", "Lead", "Tags", "Status", "Image URL"]),
    ]);
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=300",
      },
      body: JSON.stringify({ members, projects }),
    };
  } catch (e) {
    return json(502, { error: "Request failed" });
  }
};

function json(statusCode, body) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}
