# Biopunk Lab site + onboarding: roadmap

Everything decided and built in the onboarding/website rework, in one place.
See `docs/onboarding-journey-map.html` for the visual version.

## The member journey (7 stages, 3 surfaces)
A member moves from "who is this lab" to "badged, trained, running an experiment." Each stage is
owned by a surface, which is what tells us where to build.

| # | Stage | Owner surface |
|---|-------|---------------|
| 1 | Discover | Public site |
| 2 | Apply | Public site -> internal |
| 3 | Review & approve | Internal (staff) |
| 4 | Agreements & pay | Member portal |
| 5 | Safety onboarding | Portal + in-lab |
| 6 | Activate (access, booking, community) | Portal + internal |
| 7 | In-lab life (booking, status, events) | Portal + in-lab displays |

- **Public site** owns stages 1-2: a lean front door plus a short intake. Nothing more.
- **Member portal** is the spine for stages 4-7: agreements, payment, safety module, booking.
- **In-lab displays** co-run 5 and 7 and mirror the portal's data (same source of truth).
- **Internal ops** is the invisible glue at 2, 3, 6.

Streamlining principle: **collapse hand-offs.** One e-sign packet, one activation checklist,
a wall booking board that mirrors the portal.

## What's built (in this repo)
- **index-rebuild.html** — rebuilt homepage. Keeps the hero, ethos, art, and lab photos; adds a
  membership preview, a 3-step "how it works", and a safety band. All join links route on-site.
- **membership.html** — full membership page: tiers, 5-step join flow, safety-as-trust, equipment.
- **apply.html** — dedicated branded intake form (Stage 2), posts to a Netlify function.
- **community.html** — members + projects showcase, reads from Airtable via a Netlify function.
- **netlify/functions/apply.js** — writes applications into Airtable.
- **netlify/functions/roster.js** — serves published members/projects (Publish-to-site gated).
- **airtable-import/*.csv** + **AIRTABLE-SETUP.md** — stand up the base and wire env vars.

## Decisions made
- Positioning: emphasize **open-access** over the contested "world's largest" claim.
- Own the funnel: all Apply/Join links route to the on-site membership + apply flow, not off-site.
- Tiers: **Community / Resident / Startup-Team**, each including safety onboarding + BSL-1 approval.
- Intake is a **branded on-site form -> Airtable**, not an embedded Airtable form.
- Members/projects are **curated by a checkbox**, so nothing goes public without a deliberate tick.

## Placeholders to fill
Prices, BSL level, 24/7 access yes/no, real equipment inventory, biosafety-handbook link,
real members and projects. All marked in `#ccff00` in the HTML (search `ph` or `MERGE NOTE`).

## Next stages (not yet built)
- **Stage 3** review Interface in Airtable so the lab manager moves applicants through
  New -> Reviewing -> Tour -> Approved without leaving Airtable.
- **Stages 4-7** the member portal: agreements + e-sign, recurring payment, safety module,
  activation checklist, equipment booking, and the in-lab display that mirrors it.
