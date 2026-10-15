# greenmountainfog.com: GMF 3.0

Website for Green Mountain Fog, patient IT help in Burlington, Vermont, from Noah Duncan.

Plain HTML, CSS and JavaScript. No build step: edit the files and push.
Hosted on **Cloudflare Pages**, which deploys automatically on every push to `main`.
Other branches get their own preview link.

## The idea

The page opens on a fogged-up window looking out over Lake Champlain at sunset,
with the Adirondacks across the water and the Burlington breakwater lighthouse.
Visitors can wipe the glass with the cursor (or a sideways swipe on a phone),
and the fog slowly creeps back. Scrolling clears the window completely.
The page ends on the same view, fully clear, behind the contact section.

## Local preview

```sh
python3 -m http.server 8080
```

Then open <http://localhost:8080>.

## Layout

```
.
├── index.html        # the whole site: all copy lives here
├── 404.html          # "Lost in the fog" page for bad links
├── css/site.css      # styles; palette and type scale at the top
├── js/site.js        # the fogged window, nav, menu
├── images/
│   ├── scene.svg     # the Lake Champlain sunset artwork
│   ├── favicon.svg
│   └── og-card.jpg   # preview image for links shared on social media
└── game/             # The Journey (Phaser), self-contained
```

## Design notes

- Palette: blue hour over the lake. Indigo night `#161a3d`, indigo `#2e3474`,
  fog lilac `#c9c4e3`, haze `#f3f2f8`, sunset apricot `#f6ad8a` (accents only).
- Type: Young Serif for headings; Atkinson Hyperlegible Next for everything else,
  a typeface designed for readers with low vision.
- The fog is a canvas: a blurred copy of the scene with a milky film and droplets.
  Wipes are painted into a separate mask, which fades over about ten seconds.
- Reduced motion: no zoom or regrowth; the glass can still be wiped.
- Without JavaScript, a CSS blur stands in for the fog.

## History

- `backup/pre-redesign-2026-10-15`: the Manus-built site that was live before the redesigns
- `redesign`: the first redesign (green, fog over the Green Mountains)
- `gmf3.0`: this version
