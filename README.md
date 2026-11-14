# Attention Atlas

A public, spatial record of what I'm finding, making, and paying attention to on the internet.

Entries sit on two loose axes: **found it ↔ made it**, and **passing by ↔ can't stop thinking about it**. Drag around the map, open an entry to see what it is and where it sits, or browse them all under *Entries*.

## How it works

A static site: plain HTML, CSS and JavaScript, no build step.

- `index.html`, `styles.css`, `app.js`: the atlas
- `palettes.js`: background gradients (`?bg=<name>` to try one)
- `entries.json` (optional): published entries. Without it, the site shows placeholder entries.

## Editing

Only the owner can edit.

**On the live site:** open `/?unlock` and paste a GitHub fine-grained personal access token that has **Contents: Read and write** on this repository. The key stays in that browser. From then on the site shows **+ Add an entry**, and every add, edit, delete or move commits `entries.json` (and uploads into `media/`) to this repo. The public site catches up about a minute later. **⋯ → Lock this device** removes the key.

**Locally:**

```bash
python3 -m http.server 8113
```

Open `http://localhost:8113/?edit`. Without a key, edits stay in the browser; use **⋯ → Export entries.json** and commit that file to publish.

If the repository moves, update `GH` near the top of the editing section in `app.js`.
