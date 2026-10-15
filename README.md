# greenmountainfog.com

Website for Green Mountain Fog, Vermont IT help from Noah Duncan.

Plain HTML, CSS and JavaScript. No build step: edit the files and push.
Hosted on **Cloudflare Pages**, which deploys automatically on every push to `main`.
Other branches get their own preview link from Cloudflare.

## Local preview

```sh
python3 -m http.server 8080
```

Then open <http://localhost:8080>.

## Layout

```
.
├── index.html      # the whole site: copy lives here
├── 404.html        # "Lost in the fog" page for bad links
├── css/site.css    # all styles (colors and type at the top)
├── js/site.js      # small enhancements: word reveal, nav, scroll fallback
├── images/         # fog textures, photos, favicon, share card
└── game/           # The Journey (Phaser), self-contained
```

## How the scrolling works

Each animated section has one number, `--p`, that goes from 0 to 1 as you scroll through it.
Everything (fog lifting, ridges moving, the trail drawing) is written in CSS in terms of `--p`.
Chrome, Edge and Safari 26+ drive `--p` natively with CSS scroll-driven animations;
`js/site.js` computes it for other browsers. People with reduced motion turned on get a calm, static page.

## History

The previous Manus-built version of the site is preserved on the
`backup/pre-redesign-2026-10-15` branch.
