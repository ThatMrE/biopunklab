# Biopunk Lab — Airtable intake + community showcase

Two things share one Airtable base: the **Apply** form writes new applications in, and the
**Community** page reads published members and projects back out. Here is how to wire it.

## 1. Create the base and three tables

Fastest path: create a new base ("Biopunk Lab"), then import each CSV in `airtable-import/`
as its own table (Add table -> Import data -> CSV). The columns come in as text; adjust the
types below, then delete the example rows you don't want.

**Applications** (fed by the website form)
- Name — single line text (primary)
- Email — email
- Tier interest — single select: Community, Resident, Startup / Team
- Project — long text
- Experience — single select: New to the bench, Some experience, Professional / trained
- Links — URL
- Biosafety needs — long text
- How did you hear — single line text
- Status — single select: New, Reviewing, Tour scheduled, Approved, Waitlist, Declined

**Members** (shown on /community.html)
- Name — single line text (primary)
- Role — single select or text (e.g. Resident, Community, Startup)
- Bio — long text
- Photo URL — single line text (a hosted image URL; or drop images in `images/members/` and point here)
- Links — URL
- Publish to site — checkbox  ← only checked rows appear on the site

**Projects** (shown on /community.html)
- Title — single line text (primary)
- Blurb — long text
- Lead — single line text (or a link to Members)
- Tags — multiple select
- Status — single select: Active, Recruiting, Complete
- Image URL — single line text
- Publish to site — checkbox  ← only checked rows appear on the site

The field **names** must match exactly (the functions reference them by name).

## 2. Create an Airtable personal access token

airtable.com/create/tokens -> scopes `data.records:read` and `data.records:write`,
access limited to this one base. Copy the token (starts with `pat...`).

## 3. Add two env vars in Netlify

Site settings -> Environment variables:
- `AIRTABLE_TOKEN` = your `pat...` token
- `AIRTABLE_BASE_ID` = the base id (starts with `app...`, from the base's API docs / URL)

## 4. Deploy

Push the repo. Netlify picks up `netlify.toml` and deploys the two functions:
- `/.netlify/functions/apply` — the form on `apply.html` POSTs here
- `/.netlify/functions/roster` — `community.html` fetches here

The token lives only in Netlify env and is used only inside the functions, never in the browser.

## How the pieces connect
- apply.html (branded form) -> apply function -> Applications table
- Members / Projects tables (Publish to site checked) -> roster function -> community.html
- Review applications in Airtable; flip Status as they move through the funnel.
