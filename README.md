# greenmountainfog.com

Static website for Green Mountain Fog — Vermont-based IT consulting by Noah Duncan.

## Stack

- Plain HTML, CSS, and a small vanilla-JS file. No build step.
- Hosted on **Cloudflare Pages**.
- Contact form backed by a **Cloudflare Pages Function** that emails submissions via **Resend**.

## Local preview

From the repo root:

```sh
python3 -m http.server 8080
```

Then open <http://localhost:8080>.

The contact form will fail locally (no Pages Function runtime). To test the function locally, use Wrangler:

```sh
npm install -g wrangler
wrangler pages dev . --compatibility-date=2025-01-01
```

## Deploy

The site deploys automatically when changes are pushed to the connected branch on Cloudflare Pages.

### One-time Cloudflare setup

1. **Cloudflare → Pages → Create a project → Connect to Git**, pick this repo, deploy from `main`. Build command: *(empty)*. Output directory: `/`.
2. **Pages → your project → Settings → Environment variables** — add:
   - `RESEND_API_KEY` — get one at <https://resend.com> (free tier: 100/day).
   - `CONTACT_TO` *(optional)* — defaults to `hello@greenmountainfog.com`.
   - `CONTACT_FROM` *(optional)* — defaults to `website@greenmountainfog.com`. Must be a verified Resend sender on a domain you control.
3. **Pages → your project → Custom domains** — add `greenmountainfog.com` and `www.greenmountainfog.com`.
4. **Cloudflare → Email → Email Routing** — set up `hello@greenmountainfog.com` to forward to your inbox.
5. **Resend → Domains** — verify `greenmountainfog.com` (adds SPF/DKIM records to Cloudflare DNS) so the function can send `From: website@greenmountainfog.com`.

## Layout

```
.
├── index.html              # the whole site
├── styles.css
├── scripts.js              # form submit + GitHub repos
├── assets/
│   ├── topo.svg            # tileable topographic background
│   └── favicon.svg
└── functions/
    └── api/
        └── contact.js      # POST /api/contact → Resend
```

## Notes

- Content edits: open `index.html` and change the relevant section.
- Color palette and typography live as CSS custom properties at the top of `styles.css`.
- GitHub project cards are pulled live from the public REST API on page load (`github.com/GreenMountainFog`). No server work needed.
