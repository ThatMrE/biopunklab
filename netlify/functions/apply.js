// POST /.netlify/functions/apply
// Creates a record in the Airtable "Applications" table.
// Requires env vars: AIRTABLE_TOKEN, AIRTABLE_BASE_ID

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method not allowed" });
  }

  const TOKEN = process.env.AIRTABLE_TOKEN;
  const BASE = process.env.AIRTABLE_BASE_ID;
  if (!TOKEN || !BASE) {
    return json(500, { error: "Server not configured" });
  }

  let d;
  try {
    d = JSON.parse(event.body || "{}");
  } catch {
    return json(400, { error: "Bad request" });
  }

  // honeypot: bots fill this hidden field, humans don't
  if (d.company) return json(200, { ok: true });

  const name = (d.name || "").trim();
  const email = (d.email || "").trim();
  const project = (d.project || "").trim();
  const emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  if (!name || !emailOk || !project) {
    return json(422, { error: "Missing or invalid required fields" });
  }

  // only include optional fields when present, so empty selects don't error
  const fields = { Name: name, Email: email, Project: project, Status: "New" };
  const add = (key, val) => { if (val && String(val).trim()) fields[key] = String(val).trim(); };
  add("Tier interest", d.tier);
  add("Experience", d.experience);
  add("Links", d.links);
  add("Biosafety needs", d.biosafety);
  add("How did you hear", d.source);

  try {
    const res = await fetch(`https://api.airtable.com/v0/${BASE}/Applications`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ records: [{ fields }], typecast: true }),
    });
    if (!res.ok) {
      const detail = (await res.text()).slice(0, 300);
      return json(502, { error: "Upstream error", detail });
    }
    return json(200, { ok: true });
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
