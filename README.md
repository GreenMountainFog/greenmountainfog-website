# greenmountainfog.com

Website for Green Mountain Fog — Vermont-based IT consulting by Noah Duncan.

Static bundle exported from Manus (Vite build output). Deploy-ready as-is.

## Stack

- Pre-built static HTML + hashed CSS/JS assets in `assets/`.
- WebP imagery in `images/`.
- Hosted on **Cloudflare Pages** — auto-deploys on push to `main`.

## Local preview

```sh
python3 -m http.server 8080
```

Then open <http://localhost:8080>.

## Layout

```
.
├── index.html              # the whole site
├── _redirects              # Cloudflare Pages SPA fallback
├── assets/                 # built CSS + JS (hashed filenames)
└── images/                 # WebP imagery
```

## Updating the site

The build comes from Manus. To make content or design changes, edit the source in Manus and re-export the Cloudflare Pages bundle, then replace the files in this repo and push to `main`.
