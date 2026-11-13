# Attention Atlas

A public, spatial record of what I'm finding, making, and paying attention to on the internet.

Entries sit on two loose axes: **found it ↔ made it**, and **passing by ↔ can't stop thinking about it**. Drag around the map, open an entry to see what it is and where it sits, or browse them all under *Entries*.

## How it works

A static site: plain HTML, CSS and JavaScript, no build step.

- `index.html`, `styles.css`, `app.js`: the atlas
- `palettes.js`: background gradients (`?bg=<name>` to try one)
- `entries.json` (optional): published entries. Without it, the site shows placeholder entries.

## Editing

Editing only works when the site runs locally:

```bash
python3 -m http.server 8113
```

Open `http://localhost:8113/?edit`, add or edit entries, then use **⋯ → Export entries.json** and commit that file to publish.
