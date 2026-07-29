# Biopunk Lab — Members System Plan

Goal: run the lab application, onboarding, safety training, and reagent ordering on
Airtable; give members a private login to see their own status, certs, billing, and
projects; and surface opt-in member/project info publicly on the site.

## Locked decisions
- **Login:** passwordless **magic links** (email → click link → in). No passwords stored anywhere.
- **Billing:** **Stripe** for recurring lab dues (replacing Open Collective for membership).
  Open Collective may remain for donations only.
- **Start:** Phase 0 first.

## The hard rule
Airtable is the **operations database only** — never the auth or payment store.
- No passwords in Airtable; login is handled by the auth provider (magic links).
- No card/bank data anywhere; Stripe handles payments, we store only Stripe IDs.
- The Airtable token lives only in Netlify env vars and is used only inside Netlify
  Functions — never in the browser.
- Airtable has no per-user permissions, so every member-facing read goes through a
  Netlify Function that verifies the session and returns **only that member's row**.

## Stack
| Concern | Choice |
|---|---|
| Login | Magic links (Supabase Auth or Clerk — free tier) |
| Data / ops | Airtable (single source of truth for member ops) |
| API layer | Netlify Functions (verify session, scope reads, hold token) |
| Billing | Stripe Billing + hosted Customer Portal |
| Email | hello@biopunklab.com via Resend/Postmark (magic links, confirmations, nudges) |

## Airtable base
Base: **Biopunk Lab — Membership Applications** (`apptZ7B4jQNIl5cOY`).

Table IDs:
- **Applications** `tblCgHuXQopd4BBbw` — full membership application (bio, proposed project,
  safety plan, equipment, reagents, protocol, application status, reviewer notes). Existing.
- **Members** `tblV9XDrpIJ6QY78i` — name, email (auth join key), Tiers (Tower/BSL-1/Tissue
  Culture), Status, Stripe Customer ID, Join Date, Headshot, Bio, Links, Publish to site;
  onboarding checkboxes (Tower member, Applied, Review passed, Safety quiz passed, Paid,
  Materials onboarded); link → Applications.
- **Certifications** `tblef01LGmYm8RpjQ` — Member, Type (BSL-1/Tissue Culture/Equipment),
  Score, Date earned, Expiry.
- **Reagent Orders** `tblIyg4or9d1MpAaU` — Item, Member, Quantity, Link,
  Status (Requested→Approved→Ordered→Received/Denied), Needed by, Notes.
- **Projects** `tblQ6oCgn8ofT5bKF` — Title, Lead (→ Members), Blurb, Tags, Status, Image,
  Publish to site.

(Onboarding folded into Members as checkboxes.)

## Phase 0 status
- [x] Members, Certifications, Reagent Orders, Projects tables created + linked.
- [ ] Applications **Form view** created + shared (Airtable UI step) → repoint site Apply links to it.
- [ ] Transactional email set up for hello@biopunklab.com (Resend/Postmark + DNS).

## Workflows (item 1)
- **Application:** Airtable Form view on Applications (decide: replace the Google Form).
- **Onboarding:** Onboarding table + Airtable Automations emailing from hello@ at each stage.
- **Safety training:** quiz (Airtable form or custom page) → writes score + cert to Certifications.
- **Reagent ordering:** order form → Reagent Orders → staff approval → status emails.

## Member portal (item 2)
Protected `members.html`: email → magic link → session. Netlify Functions verify the
session JWT, find the member by email, return only their data: profile, onboarding
progress, certifications, reagent orders, project(s), and a "Manage billing" button
that deep-links to the Stripe Customer Portal.

## Public display (item 3)
Two lanes:
- **Public showcase** (opt-in `Publish to site` only): members + projects on the
  membership/community pages via the existing roster function. No private data.
- **Private portal:** billing, certs, contact, orders — logged-in member only.

## Rollout
- **Phase 0** — supporting tables + links; Application form decision; email wiring. ← current
- **Phase 1** — onboarding tracking + safety certs + reagent orders (email-driven).
- **Phase 2** — member portal with magic-link login (read-only).
- **Phase 3** — Stripe billing + self-service.
- **Phase 4** — public member/project showcase on the site.

## Accounts you (Biopunk) must create/authorize
- Auth provider (Supabase or Clerk)
- Stripe account
- Transactional email (Resend/Postmark) + DNS records (SPF/DKIM/DMARC) for hello@biopunklab.com
