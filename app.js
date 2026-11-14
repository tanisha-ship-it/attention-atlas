/* Attention Atlas — a pannable, gently curved grid of attention.
 *
 * World units are grid cells. (0, 0) is the crossing of the two axes.
 *   x < 0  → found          x > 0  → created
 *   y < 0  → can't stop thinking about it   y > 0  → passing by
 */

// ------------------------------------------------------------------
// Content (placeholder — replace with real entries)
// ------------------------------------------------------------------
// Each entry is a cluster of cells. `shape` is drawn row by row; every
// non-"." character is one cell, filled in order from `items`.
// img(seed, caption) makes a generated placeholder; pass a third argument
// (a real image URL or local path) to use an actual image instead.
const img = (seed, caption, src = null) => (src ? { type: 'image', src, caption } : { type: 'image', seed, caption });
const note = (text) => ({ type: 'text', text });

// Procedural stand-in images (soft, photo-ish colour fields with grain),
// so the atlas works offline until real images are added.
function placeholder(seed) {
  let h = 2166136261;
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  const rand = () => ((h = Math.imul(h ^ (h >>> 15), 2246822507) ^ Math.imul(h ^ (h >>> 13), 3266489909)) >>> 0) / 4294967296;
  const c = document.createElement('canvas');
  c.width = 480; c.height = 360;
  const g = c.getContext('2d');
  const hue = rand() * 360;
  const sat = 12 + rand() * 38;
  const light = 30 + rand() * 40;
  const bg = g.createLinearGradient(0, 0, c.width * rand(), c.height);
  bg.addColorStop(0, `hsl(${hue} ${sat}% ${light + 18}%)`);
  bg.addColorStop(1, `hsl(${(hue + 30 + rand() * 40) % 360} ${sat}% ${light - 12}%)`);
  g.fillStyle = bg;
  g.fillRect(0, 0, c.width, c.height);
  for (let i = 0; i < 5 + rand() * 6; i++) {
    const x = rand() * c.width, y = rand() * c.height, r = 30 + rand() * 170;
    const rg = g.createRadialGradient(x, y, 0, x, y, r);
    const hh = (hue + (rand() - 0.5) * 90 + 360) % 360;
    rg.addColorStop(0, `hsla(${hh} ${sat + 10}% ${20 + rand() * 65}% / ${0.35 + rand() * 0.5})`);
    rg.addColorStop(1, `hsla(${hh} ${sat}% 50% / 0)`);
    g.fillStyle = rg;
    g.fillRect(0, 0, c.width, c.height);
  }
  if (rand() > 0.5) { // a horizon line, like a landscape
    const y = c.height * (0.35 + rand() * 0.35);
    g.fillStyle = `hsla(${hue} ${sat}% ${light - 20}% / .45)`;
    g.fillRect(0, y, c.width, c.height - y);
  }
  const grain = g.getImageData(0, 0, c.width, c.height);
  for (let i = 0; i < grain.data.length; i += 4) {
    const n = (rand() - 0.5) * 26;
    grain.data[i] += n; grain.data[i + 1] += n; grain.data[i + 2] += n;
  }
  g.putImageData(grain, 0, 0);
  return c.toDataURL('image/jpeg', 0.82);
}

const DEFAULT_ENTRIES = [
  {
    slug: 'interfaces-as-places', title: 'Interfaces as places', x: -9, y: -6,
    sub: 'Software that feels more like somewhere you go than something you scroll',
    tags: ['Interfaces', 'Spatial software'], kind: 'Links, screenshots',
    shape: ['xx.', '.xxx', '..x'],
    items: [img('places1', 'A map-like homepage'), img('places2', 'Rooms instead of tabs'),
      note('Interfaces that feel more like places than pages.'), img('places3', 'Wayfinding as navigation'),
      img('places4', 'An index you can walk through'), img('places5', 'Edges of a world')],
    text: ['A long-running thread on interfaces that behave like terrain: you arrive, look around, and remember where things were.',
      'Placeholder text. Replace with the real story of this entry.'],
  },
  {
    slug: 'archive-fever', title: 'Archive fever', x: -15, y: -9,
    sub: 'Personal archives, digital gardens, and the urge to keep everything',
    tags: ['Archives', 'Memory'], kind: 'Links',
    shape: ['xx', 'x.', 'xx'],
    items: [img('archive1', 'Shoebox of scans'), img('archive2', 'A garden of notes'),
      note('What does an archive owe the person who made it?'), img('archive3', 'Index cards'), img('archive4', 'Hard drives')],
    text: ['Collected writing and projects about keeping things. Placeholder text.'],
  },
  {
    slug: 'spatial-memory', title: 'Spatial memory', x: -3, y: -10,
    sub: 'Why we remember where we read something',
    tags: ['Cognition', 'Research'], kind: 'Papers, links',
    shape: ['xxx', 'x.x'],
    items: [img('memory1', 'Memory palace drawing'), note('We remember the left page, top corner.'),
      img('memory2', 'Desk as map'), img('memory3', 'Pinboard'), img('memory4', 'Hallway')],
    text: ['Research trail on spatial memory and reading. Placeholder text.'],
  },
  {
    slug: 'field-recordings-of-the-web', title: 'Field recordings of the web', x: -17, y: -1,
    sub: 'Screenshots of strange, beautiful corners of the internet',
    tags: ['Screenshots', 'Internet'], kind: 'Images',
    shape: ['.x', 'xx', 'x.'],
    items: [img('field1', 'A forgotten forum'), img('field2', 'Personal homepage, 2004'),
      img('field3', 'Webring'), img('field4', 'Guestbook')],
    text: ['Specimens from walks around the web. Placeholder text.'],
  },
  {
    slug: 'small-software', title: 'Small software', x: -7, y: 3,
    sub: 'Tools made by one person for a few people',
    tags: ['Tools', 'Craft'], kind: 'Links',
    shape: ['xx', '.x'],
    items: [img('small1', 'A one-screen app'), note('Software as a home-cooked meal.'), img('small2', 'Tiny utility')],
    text: ['Noticing tools that stay small on purpose. Placeholder text.'],
  },
  {
    slug: 'hand-drawn-internet', title: 'Hand-drawn internet', x: -13, y: 6,
    sub: 'Sites that show the hand that made them',
    tags: ['Illustration', 'Web'], kind: 'Links, images',
    shape: ['x.x', 'xxx'],
    items: [img('hand1', 'Scribbled navigation'), img('hand2', 'Paper textures'),
      img('hand3', 'Hand-lettered headline'), note('Imperfection as a signal that someone was here.'), img('hand4', 'Ink cursor')],
    text: ['A loose collection, kept for later. Placeholder text.'],
  },
  {
    slug: 'atlas-sketches', title: 'Atlas sketches', x: 5, y: -6,
    sub: 'Early drawings and decisions for this atlas',
    tags: ['Making', 'This site'], kind: 'Sketches, notes',
    shape: ['xxx', 'x.x', 'xx.'],
    items: [img('sketch1', 'First grid sketch'), note('Two axes, not four boxes.'), img('sketch2', 'Slider studies'),
      img('sketch3', 'Index layouts'), note('Placement is a gesture, not a filing system.'),
      img('sketch4', 'Paper prototype'), img('sketch5', 'Zoom studies')],
    text: ['Working notes on building Attention Atlas. Placeholder text.'],
  },
  {
    slug: 'ai-and-judgment', title: 'AI and judgment', x: 12, y: -3,
    sub: 'Notes on working with AI without losing taste',
    tags: ['AI', 'Design practice'], kind: 'Essays, notes',
    shape: ['xx', 'xx'],
    items: [note('Grade the output before it grades you.'), img('ai1', 'Workshop slide'),
      img('ai2', 'Annotated transcript'), note('False clarity is the most persuasive kind.')],
    text: ['An active thread of writing. Placeholder text.'],
  },
  {
    slug: 'paper-prototypes', title: 'Paper prototypes', x: 3, y: 1,
    sub: 'Quick physical models of digital ideas',
    tags: ['Prototyping'], kind: 'Images',
    shape: ['x.', 'xx'],
    items: [img('paper1', 'Folded menu'), img('paper2', 'Cut-out cards'), img('paper3', 'Tape and string')],
    text: ['Made in an afternoon. Placeholder text.'],
  },
  {
    slug: 'notes-on-slowness', title: 'Notes on slowness', x: 10, y: 5,
    sub: 'Short notes written in passing',
    tags: ['Writing'], kind: 'Notes',
    shape: ['xx.', '.xx'],
    items: [note('Slowness is a feature you have to design for.'), img('slow1', 'Afternoon light'),
      note('Not every link needs to become a project.'), img('slow2', 'Window')],
    text: ['Small notes, kept before they disappear. Placeholder text.'],
  },
  {
    slug: 'walks', title: 'Walks', x: 4, y: 8,
    sub: 'Photos taken while thinking',
    tags: ['Photography'], kind: 'Images',
    shape: ['xxx'],
    items: [img('walk1', 'Morning street'), img('walk2', 'Tree shadow'), img('walk3', 'Wet pavement')],
    text: ['Placeholder text.'],
  },
  {
    slug: 'weekly-fragments', title: 'Weekly fragments', x: 15, y: 8,
    sub: 'A loose weekly log of what caught my eye',
    tags: ['Log'], kind: 'Notes, images',
    shape: ['x.', 'xx', '.x'],
    items: [note('Week 46: maps, margins, and mushrooms.'), img('week1', 'Clipping'), img('week2', 'Found poster'), img('week3', 'Desk')],
    text: ['Placeholder text.'],
  },
];

// ------------------------------------------------------------------
// Constants
// ------------------------------------------------------------------
const WORLD = { x: 19, y: 11 };       // half-extent of the field in cells (slider range + soft limits)
const ZOOM_LEVELS = [0.5, 1, 1.5];    // discrete zoom stops; the camera eases between them
const INTRO_MS = 750;                 // opening flight to a random entry
const GRID_ALPHA = 0.13;

// Background palette (see palettes.js). Pick one with ?bg=<key>.
const BG_KEY = new URLSearchParams(location.search).get('bg') || 'powder';
const BG = (window.PALETTES || {})[BG_KEY];
if (BG) document.querySelector('.app').style.background = window.paletteGradient(BG_KEY);
const DARK_BG = !!(BG && BG.dark);
const INK = DARK_BG ? '255,255,255' : '0,0,0';   // grid + axis line colour

// ------------------------------------------------------------------
// Data: entries are plain JSON-able objects, rebuilt into map cells
// ------------------------------------------------------------------
// Stored shape (what entries.json / the browser draft contain):
//   { slug, title, sub, tags: [], kind, text: [paragraphs],
//     cells: [{ x, y, type: 'image', src | seed, caption } | { x, y, type: 'text', text }] }
const STORE_KEY = 'atlas.entries.v1';

// Convert the built-in shape/items format into cell lists.
function fromLegacy(list) {
  return list.map((e) => {
    const out = { slug: e.slug, title: e.title, sub: e.sub || '', tags: e.tags || [], kind: e.kind || '', text: e.text || [], cells: [] };
    let i = 0;
    e.shape.forEach((row, dy) => [...row].forEach((ch, dx) => {
      if (ch === '.') return;
      const item = e.items[i++];
      if (item) out.cells.push({ x: e.x + dx, y: e.y + dy, ...item });
    }));
    return out;
  });
}

const placeholderCache = new Map();
function imgSrc(item) {
  if (item.src) return item.src;
  if (!placeholderCache.has(item.seed)) placeholderCache.set(item.seed, placeholder(item.seed || 'x'));
  return placeholderCache.get(item.seed);
}

let DATA = fromLegacy(DEFAULT_ENTRIES);   // replaced by entries.json or your draft
let ENTRIES = [];                         // runtime entries (with cells, bounds…)
let cells = [];
let bySlug = {};
const imageCache = new Map();             // src → { img, ready }

function loadImage(src) {
  if (!imageCache.has(src)) {
    const rec = { img: new Image(), ready: false };
    rec.img.decoding = 'async';
    rec.img.onload = () => { rec.ready = true; };
    rec.img.onerror = () => { rec.failed = true; };
    rec.img.src = src;
    imageCache.set(src, rec);
  }
  return imageCache.get(src);
}

function rebuild() {
  cells = [];
  ENTRIES = DATA.filter((d) => d.cells.length).map((d) => {
    const entry = { ...d, data: d, cells: [] };
    d.cells.forEach((c) => {
      const item = c.type === 'image' ? { type: 'image', caption: c.caption || '', src: imgSrc(c) } : { type: 'text', text: c.text || '' };
      const cell = { entry, item, data: c, x: c.x, y: c.y };
      if (item.type === 'image') {
        const rec = loadImage(item.src);
        cell.img = rec.img;
        Object.defineProperty(cell, 'ready', { get: () => rec.ready || rec.failed });
        Object.defineProperty(cell, 'failed', { get: () => !!rec.failed });
      } else cell.ready = true;
      entry.cells.push(cell);
      cells.push(cell);
    });
    // reading order for the detail view: row by row
    entry.cells.sort((a, b) => a.y - b.y || a.x - b.x);
    entry.items = entry.cells.map((c) => c.item);
    const xs = entry.cells.map((c) => c.x), ys = entry.cells.map((c) => c.y);
    entry.bounds = { x0: Math.min(...xs), x1: Math.max(...xs) + 1, y0: Math.min(...ys), y1: Math.max(...ys) + 1 };
    entry.cx = (entry.bounds.x0 + entry.bounds.x1) / 2;
    entry.cy = (entry.bounds.y0 + entry.bounds.y1) / 2;
    return entry;
  });
  bySlug = Object.fromEntries(ENTRIES.map((e) => [e.slug, e]));
  if (indexReady) renderIndex();
}

var indexReady = false;   // the index DOM is set up further down
const cellAt = (x, y) => cells.find((c) => c.x === x && c.y === y) || null;

function readDraft() {
  try { const raw = localStorage.getItem(STORE_KEY); return raw ? JSON.parse(raw) : null; } catch (e) { return null; }
}

rebuild();

// ------------------------------------------------------------------
// DOM
// ------------------------------------------------------------------
const $ = (s) => document.querySelector(s);
const app = $('.app');
const canvas = $('#map');
const ctx = canvas.getContext('2d');
const teaser = $('#teaser');
const zoomTrack = $('#zoom-track');
const zoomThumb = $('#zoom-thumb');
const axisX = $('#axis-x');
const axisY = $('#axis-y');

// ------------------------------------------------------------------
// Camera + projection
// ------------------------------------------------------------------
// Movement works like Tracing the Ground: input only ever sets a *target*;
// every frame the camera eases a fixed fraction of the way toward it.
// There is no throw / inertia. The softness comes entirely from the easing.
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

const EASE_MOUSE = { move: 0.075, zoom: 0.05 };
const EASE_TOUCH = { move: 0.15, zoom: 0.1 };
// Curvature while moving. gain: how strongly speed bends the field;
// max: cap; rise/fall: how quickly the bend builds and relaxes; depth: how
// much the edges also sink away (smaller = deeper).
const BULGE = { gain: 1.5, max: 0.32, rise: 0.22, fall: 0.07, depth: 6 };
const DRAG_GAIN = 2;         // the map moves twice as far as the pointer
const CLICK_SLOP = 5;        // px of movement before a press counts as a drag

const cam = {
  x: 0, y: 0, z: ZOOM_LEVELS[0],          // current (rendered)
  tx: 0, ty: 0, tz: ZOOM_LEVELS[0],       // target
  lx: 0, ly: 0,                           // last frame, for speed
  strength: 0,                            // curvature, driven by speed
};
let ease = EASE_MOUSE;
let isTouch = false;
let W = 0, H = 0, base = 50, dpr = 1;
let intro = null;           // the opening flight to a random entry
let selected = null;        // entry whose teaser is open
let hovered = null;

function resize() {
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  W = innerWidth; H = innerHeight;
  canvas.width = W * dpr; canvas.height = H * dpr;
  base = Math.max(56, Math.min(110, Math.min(W, H * 1.5) / 12));
}

const cellPx = () => base * cam.z;

// Lens: the field behaves like the surface of a globe seen head-on.
// A point r (in half-viewports) from the screen centre shows the world at
//   r · (1 + k r²) · (1 + k r² / DEPTH)
// so content toward the edges is squeezed and pushed back. k ("strength")
// comes from speed: flat at rest, curving while you scroll or drag.
// Defined screen → world, so it is always smooth and fills the corners.
const lensStretch = (rs2, k) => (1 + k * rs2) * (1 + (k * rs2) / BULGE.depth);

// `k` is the lens strength: the grid passes cam.strength, entries pass 0 (flat).
function project(wx, wy, k = 0, ox = cam.x, oy = cam.y) {
  const s = cellPx();
  const px = (wx - ox) * s, py = (wy - oy) * s;
  if (k < 1e-5) return [W / 2 + px, H / 2 + py];
  const nx = px / (W / 2), ny = py / (H / 2);
  const rw = Math.hypot(nx, ny);
  if (rw < 1e-6) return [W / 2, H / 2];
  // solve rs · stretch(rs²) = rw (monotonic) with a few Newton steps
  let rs = rw / (1 + k * rw * rw);
  for (let i = 0; i < 5; i++) {
    const r2 = rs * rs, a = 1 + k * r2, b = 1 + (k * r2) / BULGE.depth;
    const f = rs * a * b - rw;
    const df = a * b + rs * (2 * k * rs * b + a * (2 * k * rs) / BULGE.depth);
    rs -= f / df;
  }
  const f = rs / rw;
  return [W / 2 + px * f, H / 2 + py * f];
}

function unproject(sx, sy, k = 0, ox = cam.x, oy = cam.y) {
  const nx = (sx - W / 2) / (W / 2), ny = (sy - H / 2) / (H / 2);
  const m = lensStretch(nx * nx + ny * ny, k);
  const s = cellPx();
  return [ox + (nx * m * W) / 2 / s, oy + (ny * m * H) / 2 / s];
}

// ------------------------------------------------------------------
// Drawing
// ------------------------------------------------------------------
function polyline(points) {
  ctx.beginPath();
  points.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
  ctx.stroke();
}

function line(x0, y0, x1, y1, steps) {
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    pts.push(project(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, cam.strength));
  }
  polyline(pts);
}

function visibleWorld(k) {
  const corners = [unproject(0, 0, k), unproject(W, 0, k), unproject(0, H, k), unproject(W, H, k)];
  return {
    x0: Math.floor(Math.min(...corners.map((c) => c[0]))) - 1,
    x1: Math.ceil(Math.max(...corners.map((c) => c[0]))) + 1,
    y0: Math.floor(Math.min(...corners.map((c) => c[1]))) - 1,
    y1: Math.ceil(Math.max(...corners.map((c) => c[1]))) + 1,
  };
}

function wrapText(text, maxW) {
  const words = text.split(/\s+/);
  const lines = [];
  let cur = '';
  words.forEach((w) => {
    const next = cur ? `${cur} ${w}` : w;
    if (ctx.measureText(next).width > maxW && cur) { lines.push(cur); cur = w; } else cur = next;
  });
  if (cur) lines.push(cur);
  return lines;
}

// Text tiles get a soft two-colour wash instead of plain white, and the wash
// comes from where the tile sits on the atlas:
//   up at "can't stop thinking about it" → cool (sky/mint when found, periwinkle/lilac when made)
//   around the middle                     → lavender into blush
//   down at "passing by"                  → warm (butter/sand when found, peach/rose when made)
// Moving an entry changes its colour.
const WASH = {
  top:    { found: ['#e3f0ff', '#cdf0da'], made: ['#ebe3ff', '#d3daff'] },   // pale, so they stand out on the blue
  middle: { found: ['#ddd1fa', '#fbd0da'], made: ['#e2cff7', '#fcc9d5'] },
  bottom: { found: ['#f1e2ad', '#f3c9a6'], made: ['#f3cdae', '#ecbccb'] },
};
const hexRGB = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mixHex = (a, b, t) => { const A = hexRGB(a), B = hexRGB(b); return `rgb(${A.map((c, i) => Math.round(c + (B[i] - c) * t)).join(' ')})`; };
function tileWashAt(wx, wy) {
  const u = (clamp(wx / WORLD.x, -1, 1) + 1) / 2;          // 0 found it → 1 made it
  const v0 = clamp(wy / WORLD.y, -1, 1);                   // -1 can't stop → 1 passing by
  const v = Math.sign(v0) * Math.pow(Math.abs(v0), 0.55);  // reach the cool and warm ends sooner
  const row = (r) => [mixHex(r.found[0], r.made[0], u), mixHex(r.found[1], r.made[1], u)];
  const [from, to, t] = v < 0 ? [row(WASH.top), row(WASH.middle), v + 1] : [row(WASH.middle), row(WASH.bottom), v];
  const blend = (i) => { const p = (c) => c.match(/\d+/g).map(Number); const A = p(from[i]), B = p(to[i]); return `rgb(${A.map((c, k) => Math.round(c + (B[k] - c) * t)).join(' ')})`; };
  return [blend(0), blend(1)];
}
const tileWashCSS = (entry) => { const c = tileWashAt(entry.cx, entry.cy); return `linear-gradient(150deg, ${c[0]}, ${c[1]})`; };

function drawTextCell(cell, x, y, w, h) {
  // inset so the grid lines along the cell's edges stay visible
  const moving = moveState && (moveState.cell ? moveState.cell === cell : moveState.entry === cell.entry);
  const wash = tileWashAt(cell.x + 0.5 + (moving ? moveState.dx : 0), cell.y + 0.5 + (moving ? moveState.dy : 0));
  const g = ctx.createLinearGradient(x, y, x + w, y + h);
  g.addColorStop(0, wash[0]); g.addColorStop(1, wash[1]);
  ctx.fillStyle = g;
  ctx.fillRect(x + 1, y + 1, w - 2, h - 2);
  ctx.strokeStyle = 'rgba(26,25,24,.16)';   // a hairline edge keeps the tile defined on any part of the map
  ctx.lineWidth = 1;
  ctx.strokeRect(x + 1.5, y + 1.5, w - 3, h - 3);
  const pad = w * 0.1;
  const size = w * 0.118;
  ctx.save();
  ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
  if (size < 6) {
    // Too small to read — draw greeked lines instead.
    ctx.fillStyle = 'rgba(26,25,24,.5)';
    const lh = h / 7;
    for (let i = 0; i < 4; i++) {
      const lw = (w - pad * 2) * (i === 3 ? 0.55 : 0.92 - (i % 2) * 0.12);
      ctx.fillRect(x + pad, y + pad + i * lh, lw, Math.max(1, lh * 0.38));
    }
  } else {
    ctx.fillStyle = '#1a1918';
    ctx.font = `500 ${size}px Figtree, Inter, Arial, sans-serif`;
    ctx.textBaseline = 'top';
    wrapText(cell.item.text, w - pad * 2).forEach((l, i) => ctx.fillText(l, x + pad, y + pad + i * size * 1.2));
  }
  ctx.restore();
}

function drawImageCell(cell, x, y, w, h) {
  if (!cell.ready) { ctx.fillStyle = '#000'; ctx.fillRect(x, y, w, h); return; }
  if (cell.failed) {
    // broken link: a quiet placeholder rather than a black hole
    ctx.fillStyle = '#ecebe8';
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = 'rgba(0,0,0,.25)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + w, y + h); ctx.moveTo(x + w, y); ctx.lineTo(x, y + h); ctx.stroke();
    return;
  }
  const im = cell.img;
  // cover-crop into the square cell
  const side = Math.min(im.naturalWidth, im.naturalHeight);
  const sx = (im.naturalWidth - side) / 2, sy = (im.naturalHeight - side) / 2;
  ctx.drawImage(im, sx, sy, side, side, x, y, w, h);
}

function draw() {
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, W, H);   // the gradient + grain live in CSS behind the canvas

  const v = visibleWorld(cam.strength);
  const s = cellPx();
  const stepsX = Math.max(16, Math.min(90, (v.x1 - v.x0) * 3));
  const stepsY = Math.max(16, Math.min(90, (v.y1 - v.y0) * 3));

  // grid
  const alpha = GRID_ALPHA * Math.max(0, Math.min(1, (s - 8) / 18));
  if (alpha > 0.005) {
    ctx.strokeStyle = `rgba(${INK},${alpha * (DARK_BG ? 1.4 : 1)})`;
    ctx.lineWidth = 1;
    for (let gx = v.x0; gx <= v.x1; gx++) if (gx !== 0) line(gx, v.y0, gx, v.y1, stepsY);
    for (let gy = v.y0; gy <= v.y1; gy++) if (gy !== 0) line(v.x0, gy, v.x1, gy, stepsX);
  }

  // axes through the origin
  ctx.strokeStyle = `rgb(${INK})`;
  ctx.lineWidth = 1;
  line(0, v.y0, 0, v.y1, stepsY * 2);
  line(v.x0, 0, v.x1, 0, stepsX * 2);

  // cells
  // Entries ride the curved grid (each is pinned to its cell's centre) but are
  // never squashed: they keep their flat, full size while the grid bends.
  const size = Math.round(s);
  for (const cell of cells) {
    if (cell.x + 1 < v.x0 || cell.x > v.x1 || cell.y + 1 < v.y0 || cell.y > v.y1) continue;
    const moving = moveState && (moveState.cell ? moveState.cell === cell : moveState.entry === cell.entry);
    const ox = moving ? moveState.dx : 0, oy = moving ? moveState.dy : 0;
    const [cx, cy] = project(cell.x + ox + 0.5, cell.y + oy + 0.5, cam.strength);
    const x = Math.round(cx - size / 2), y = Math.round(cy - size / 2);
    const w = size, h = size;
    if (w < 1) continue;
    if (moving) ctx.globalAlpha = 0.85;
    if (cell.item.type === 'image') drawImageCell(cell, x, y, w, h);
    else drawTextCell(cell, x, y, w, h);
    ctx.globalAlpha = 1;
  }

  if (EDIT) drawEditOverlays(size);
}

// Edit mode overlays: four small crop marks fade in on the empty cell under
// the cursor (like a frame waiting for a picture); the cell being edited
// gets a solid outline.
let hoverKey = '', hoverT0 = 0;           // when the cursor arrived on this cell

function cellBox(x, y, size) {
  const [cx, cy] = project(x + 0.5, y + 0.5, cam.strength);
  return [Math.round(cx - size / 2), Math.round(cy - size / 2)];
}

function drawEditOverlays(size) {
  const now = performance.now();
  const showHover = hoverCell && !moveState && !pointer.down && !cellAt(hoverCell.x, hoverCell.y) &&
    !(editTarget && editTarget.x === hoverCell.x && editTarget.y === hoverCell.y);
  if (showHover) {
    const key = `${hoverCell.x},${hoverCell.y}`;
    if (key !== hoverKey) { hoverKey = key; hoverT0 = now; }
    const fade = clamp((now - hoverT0) / 160, 0, 1);
    const [x, y] = cellBox(hoverCell.x, hoverCell.y, size);
    const a = Math.max(6, size * 0.16), i = 3;
    ctx.strokeStyle = `rgba(${INK},${0.7 * fade})`;
    ctx.lineWidth = 1.25;
    ctx.beginPath();
    [[x + i, y + i, 1, 1], [x + size - i, y + i, -1, 1], [x + i, y + size - i, 1, -1], [x + size - i, y + size - i, -1, -1]]
      .forEach(([px, py, sx, sy]) => { ctx.moveTo(px + sx * a, py); ctx.lineTo(px, py); ctx.lineTo(px, py + sy * a); });
    ctx.stroke();
  } else if (!hoverCell) hoverKey = '';

  if (editTarget) {
    const [x, y] = cellBox(editTarget.x, editTarget.y, size);
    if (!cellAt(editTarget.x, editTarget.y)) { ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.fillRect(x, y, size, size); }
    ctx.strokeStyle = `rgb(${INK})`;
    ctx.lineWidth = 2;
    ctx.strokeRect(x + 1, y + 1, size - 2, size - 2);
  }
}

// ------------------------------------------------------------------
// Motion
// ------------------------------------------------------------------
function clampTarget() {
  cam.tx = clamp(cam.tx, -WORLD.x, WORLD.x);
  cam.ty = clamp(cam.ty, -WORLD.y, WORLD.y);
}

// Move the target; the per-frame easing does the animating.
function flyTo(x, y, z) {
  cam.tx = x; cam.ty = y;
  if (z !== undefined) cam.tz = nearestLevel(z);
  clampTarget();
}

const nearestLevel = (z) => ZOOM_LEVELS.reduce((a, b) => (Math.abs(b - z) < Math.abs(a - z) ? b : a));

// Change the zoom target while keeping the world point under (sx, sy) put.
function zoomTo(z, sx = W / 2, sy = H / 2) {
  intro = null;
  const prev = base * cam.tz;
  const wx = cam.tx + (sx - W / 2) / prev, wy = cam.ty + (sy - H / 2) / prev;
  cam.tz = clamp(z, ZOOM_LEVELS[0], ZOOM_LEVELS[ZOOM_LEVELS.length - 1]);
  const next = base * cam.tz;
  cam.tx = wx - (sx - W / 2) / next;
  cam.ty = wy - (sy - H / 2) / next;
  clampTarget();
}

function zoomStep(dir) {
  const i = ZOOM_LEVELS.indexOf(nearestLevel(cam.tz));
  zoomTo(ZOOM_LEVELS[clamp(i + dir, 0, ZOOM_LEVELS.length - 1)]);
}

// Lens strength from speed: viewport-normalised distance travelled this frame.
function lensGain() {
  if (intro) return isTouch ? 1.5 : 3;
  return 1.5 + clamp((W - 640) / 896, 0, 1) * 1.5;
}

function step(now) {
  if (intro) {
    const t = clamp((now - intro.t0) / INTRO_MS, 0, 1);
    const e = easeOutCubic(t);
    cam.z = lerp(intro.fz, intro.tz, e);
    cam.x = lerp(intro.fx, intro.tx, e);
    cam.y = lerp(intro.fy, intro.ty, e);
    cam.tx = cam.x; cam.ty = cam.y; cam.tz = intro.tz;
    if (t >= 1) intro = null;
  } else {
    cam.z = lerp(cam.z, cam.tz, ease.zoom);
    cam.x = lerp(cam.x, cam.tx, ease.move);
    cam.y = lerp(cam.y, cam.ty, ease.move);
  }

  // Doc-space speed (screen distance at the base zoom), as in the reference.
  const docScale = base / 2;
  const speed = Math.hypot(((cam.y - cam.ly) * docScale) / H, ((cam.x - cam.lx) * docScale) / W) * lensGain();
  const want = Math.min(BULGE.max, speed * BULGE.gain);
  cam.strength = lerp(cam.strength, want, want > cam.strength ? BULGE.rise : BULGE.fall);
  if (!(cam.strength >= 1e-4)) cam.strength = 0;   // also catches NaN, so one bad frame can't blank the map
  cam.lx = cam.x; cam.ly = cam.y;


  draw();
  syncControls();
  positionTeaser();
  requestAnimationFrame(step);
}

// ------------------------------------------------------------------
// Pointer: drag, pinch, click
// ------------------------------------------------------------------
const pointer = { id: null, mode: 'pan', down: false, sx: 0, sy: 0, ox: 0, oy: 0, pts: new Map(), pinch: null };

// Hit-test against where entries are actually drawn (curved centre, flat size).
function hitTest(sx, sy) {
  const half = cellPx() / 2;
  return cells.find((c) => {
    const [cx, cy] = project(c.x + 0.5, c.y + 0.5, cam.strength);
    return Math.abs(sx - cx) <= half && Math.abs(sy - cy) <= half;
  }) || null;
}

function setInputMode(e) {
  const touch = e.pointerType === 'touch';
  if (touch !== isTouch) { isTouch = touch; ease = touch ? EASE_TOUCH : EASE_MOUSE; }
}

canvas.addEventListener('pointerdown', (e) => {
  setInputMode(e);
  canvas.setPointerCapture(e.pointerId);
  pointer.pts.set(e.pointerId, [e.clientX, e.clientY]);
  intro = null;
  if (pointer.pts.size === 2) {
    const [a, b] = [...pointer.pts.values()];
    pointer.down = false;
    pointer.pinch = {
      d: Math.hypot(a[0] - b[0], a[1] - b[1]), z: cam.tz,
      mx: (a[0] + b[0]) / 2, my: (a[1] + b[1]) / 2, tx: cam.tx, ty: cam.ty,
    };
    return;
  }
  pointer.id = e.pointerId;
  pointer.down = true;
  pointer.sx = e.clientX; pointer.sy = e.clientY;
  pointer.ox = cam.x; pointer.oy = cam.y;   // drag starts from where the map *is*, not where it was heading
  pointer.mode = 'pan';
  if (EDIT) {
    const hit = hitTest(e.clientX, e.clientY);
    if (hit) {
      // in edit mode, dragging an entry moves it (Alt/Option: just this cell)
      pointer.mode = 'move';
      const [wx, wy] = unproject(e.clientX, e.clientY, cam.strength);
      moveState = { entry: hit.entry, cell: e.altKey ? hit : null, wx, wy, dx: 0, dy: 0 };
    }
  }
});

canvas.addEventListener('pointermove', (e) => {
  if (pointer.pts.has(e.pointerId)) pointer.pts.set(e.pointerId, [e.clientX, e.clientY]);

  if (pointer.pinch && pointer.pts.size === 2) {
    // live pinch: zoom follows the fingers, snaps to a level on release
    const [a, b] = [...pointer.pts.values()];
    const p = pointer.pinch;
    const z = clamp(p.z * (Math.hypot(a[0] - b[0], a[1] - b[1]) / p.d), ZOOM_LEVELS[0], ZOOM_LEVELS[ZOOM_LEVELS.length - 1]);
    const wx = p.tx + (p.mx - W / 2) / (base * p.z), wy = p.ty + (p.my - H / 2) / (base * p.z);
    cam.z = cam.tz = z;
    cam.tx = wx - (p.mx - W / 2) / (base * z);
    cam.ty = wy - (p.my - H / 2) / (base * z);
    clampTarget();
    return;
  }

  if (pointer.down && e.pointerId === pointer.id && pointer.mode === 'move' && moveState) {
    if (Math.hypot(pointer.sx - e.clientX, pointer.sy - e.clientY) >= CLICK_SLOP) {
      canvas.classList.add('is-dragging');
      const [wx, wy] = unproject(e.clientX, e.clientY, cam.strength);
      moveState.dx = Math.round(wx - moveState.wx);
      moveState.dy = Math.round(wy - moveState.wy);
    }
    return;
  }

  if (pointer.down && e.pointerId === pointer.id) {
    const dx = pointer.sx - e.clientX, dy = pointer.sy - e.clientY;
    if (Math.hypot(dx, dy) >= CLICK_SLOP) canvas.classList.add('is-dragging');
    const s = base * cam.tz;
    cam.tx = pointer.ox + (dx * DRAG_GAIN) / s;
    cam.ty = pointer.oy + (dy * DRAG_GAIN) / s;
    clampTarget();
    return;
  }

  const hit = hitTest(e.clientX, e.clientY);
  hovered = hit ? hit.entry : null;
  hoverCell = null;
  if (EDIT && !hit) {
    const [wx, wy] = unproject(e.clientX, e.clientY, cam.strength);
    hoverCell = { x: Math.floor(wx), y: Math.floor(wy) };
  }
  canvas.classList.toggle('is-hovering', !!hit);
  canvas.classList.toggle('is-adding', !hit && !!hoverCell);
});

function endPointer(e) {
  pointer.pts.delete(e.pointerId);
  if (pointer.pinch) {
    if (pointer.pts.size < 2) {
      const p = pointer.pinch;
      pointer.pinch = null;
      const z = nearestLevel(cam.tz);
      const wx = p.tx + (p.mx - W / 2) / (base * p.z), wy = p.ty + (p.my - H / 2) / (base * p.z);
      cam.tz = z;
      cam.tx = wx - (p.mx - W / 2) / (base * z);
      cam.ty = wy - (p.my - H / 2) / (base * z);
      clampTarget();
    }
    return;
  }
  if (e.pointerId !== pointer.id) return;
  pointer.down = false;
  pointer.id = null;
  canvas.classList.remove('is-dragging');
  const isClick = e.type === 'pointerup' && Math.hypot(e.clientX - pointer.sx, e.clientY - pointer.sy) < CLICK_SLOP;
  if (pointer.mode === 'move' && !isClick) { commitMove(); return; }
  moveState = null;
  if (!isClick) return;
  const hit = hitTest(e.clientX, e.clientY);
  if (EDIT) {
    // edit mode: any cell opens the editor (existing → edit, empty → add)
    if (hit) return openEditor(hit.x, hit.y);
    const [wx, wy] = unproject(e.clientX, e.clientY, cam.strength);
    const x = Math.floor(wx), y = Math.floor(wy);
    if (Math.abs(x + 0.5) <= WORLD.x + 0.5 && Math.abs(y + 0.5) <= WORLD.y + 0.5) openEditor(x, y);
    else setStatus('That cell is outside the map.', true);
    return;
  }
  // clicking an entry opens its detail card directly (no intermediate popup)
  if (hit) location.hash = `#/entry/${hit.entry.slug}`;
}
canvas.addEventListener('pointerup', endPointer);
canvas.addEventListener('pointercancel', endPointer);
canvas.addEventListener('pointerleave', () => {
  if (!pointer.down) { hovered = null; hoverCell = null; canvas.classList.remove('is-hovering', 'is-adding'); }
});

// Wheel / trackpad behaves like page scroll: it moves the target, so the
// OS's own scroll momentum carries through. Ctrl+wheel (pinch) zooms and
// settles on the nearest level once the gesture stops.
let wheelZoomTimer = null;
canvas.addEventListener('wheel', (e) => {
  e.preventDefault();
  intro = null;
  if (ease !== EASE_MOUSE) { isTouch = false; ease = EASE_MOUSE; }
  if (e.ctrlKey) {
    zoomTo(cam.tz * Math.exp(-e.deltaY * 0.01), e.clientX, e.clientY);
    clearTimeout(wheelZoomTimer);
    wheelZoomTimer = setTimeout(() => zoomTo(nearestLevel(cam.tz), e.clientX, e.clientY), 160);
    return;
  }
  const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? H : 1;
  // scroll distance is in "page" pixels, which the reference renders at 2× zoom
  cam.tx += (e.deltaX * unit * 2) / base;
  cam.ty += (e.deltaY * unit * 2) / base;
  clampTarget();
}, { passive: false });

// ------------------------------------------------------------------
// Controls: zoom bar, edge axes, recenter
// ------------------------------------------------------------------
const zoomToT = (z) => (z - ZOOM_LEVELS[0]) / (ZOOM_LEVELS[ZOOM_LEVELS.length - 1] - ZOOM_LEVELS[0]);

function dragControl(el, onValue) {
  el.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    el.setPointerCapture(e.pointerId);
    intro = null;
    const move = (ev) => onValue(ev, el.getBoundingClientRect());
    move(e);
    const up = () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerup', up); el.removeEventListener('pointercancel', up); };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
  });
}

// The zoom bar picks a level; the camera eases there.
dragControl(zoomTrack, (e, r) => {
  const t = clamp(1 - (e.clientY - r.top) / r.height, 0, 1);
  zoomTo(nearestLevel(lerp(ZOOM_LEVELS[0], ZOOM_LEVELS[ZOOM_LEVELS.length - 1], t)));
});
$('#zoom-in').addEventListener('click', () => zoomStep(1));
$('#zoom-out').addEventListener('click', () => zoomStep(-1));
zoomTrack.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' || e.key === 'ArrowUp') zoomStep(1);
  if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') zoomStep(-1);
});

// The axes track the arrow ends (inset 7px) so the marker sits on the line's span.
const ARROW_INSET = 7;
const trackX = axisX.querySelector('.axis-track');
const trackY = axisY.querySelector('.axis-track');
dragControl(trackX, (e, r) => {
  const t = clamp((e.clientX - r.left - ARROW_INSET) / (r.width - ARROW_INSET * 2), 0, 1);
  cam.tx = (t * 2 - 1) * WORLD.x;
});
dragControl(trackY, (e, r) => {
  const t = clamp((e.clientY - r.top - ARROW_INSET) / (r.height - ARROW_INSET * 2), 0, 1);
  cam.ty = (t * 2 - 1) * WORLD.y;
});
[[trackX, 'x'], [trackY, 'y']].forEach(([el, k]) => el.addEventListener('keydown', (e) => {
  const d = { ArrowLeft: -1, ArrowUp: -1, ArrowRight: 1, ArrowDown: 1 }[e.key];
  if (d) { e.preventDefault(); flyTo(k === 'x' ? cam.tx + d * 2 : cam.tx, k === 'y' ? cam.ty + d * 2 : cam.ty); }
}));

$('#recenter').addEventListener('click', () => flyTo(0, 0));

// Markers follow the camera with their own easing, like the reference.
const markerX = axisX.querySelector('.axis-marker');
const markerY = axisY.querySelector('.axis-marker');
const markers = { x: 0.5, y: 0.5 };
function syncControls() {
  markers.x = lerp(markers.x, (clamp(cam.x / WORLD.x, -1, 1) + 1) / 2, ease.move);
  markers.y = lerp(markers.y, (clamp(cam.y / WORLD.y, -1, 1) + 1) / 2, ease.move);
  markerX.style.left = `calc(${ARROW_INSET}px + (100% - ${ARROW_INSET * 2}px) * ${markers.x})`;
  markerY.style.top = `calc(${ARROW_INSET}px + (100% - ${ARROW_INSET * 2}px) * ${markers.y})`;
  trackX.setAttribute('aria-valuenow', Math.round((markers.x * 2 - 1) * 100));
  trackY.setAttribute('aria-valuenow', Math.round((markers.y * 2 - 1) * 100));
  const tz = zoomToT(cam.z);
  zoomThumb.style.top = `${(1 - tz) * 100}%`;   // zoomed in = top
  zoomTrack.setAttribute('aria-valuenow', Math.round(tz * 100));
}

// ------------------------------------------------------------------
// Teaser
// ------------------------------------------------------------------
function select(entry) {
  selected = entry;
  teaser.querySelector('.teaser-title').textContent = entry.title;
  teaser.querySelector('.teaser-sub').textContent = entry.sub;
  teaser.querySelector('.teaser-more').href = `#/entry/${entry.slug}`;
  teaser.hidden = false;
}

function closeTeaser() {
  selected = null;
  teaser.hidden = true;
}

function positionTeaser() {
  if (!selected || teaser.hidden) return;
  const b = selected.bounds;
  const [, bottom] = project(selected.cx, b.y1);
  const [cx] = project(selected.cx, selected.cy);
  const tw = teaser.offsetWidth, th = teaser.offsetHeight;
  const x = clamp(cx - tw / 2, 16, W - tw - 16);
  const y = clamp(bottom + 10, 90, H - th - 56);
  teaser.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`;
}

// ------------------------------------------------------------------
// Index
// ------------------------------------------------------------------
const indexEl = $('#index');
const indexList = $('#index-list');
let hoverTimer = null;

function renderIndex() {
indexList.innerHTML = '';
ENTRIES.forEach((entry) => {
  const li = document.createElement('li');
  const a = document.createElement('a');
  a.className = 'index-card';
  a.href = `#/entry/${entry.slug}`;
  const cover = entry.items.find((i) => i.type === 'image');
  a.innerHTML = `<h2></h2>${cover ? '<img class="cover" alt="" loading="lazy">' : '<div class="cover is-text"></div>'}<p></p>`;
  a.querySelector('h2').textContent = entry.title;
  a.querySelector('p').textContent = entry.sub;
  if (cover) a.querySelector('img').src = cover.src;
  else { const cv = a.querySelector('.cover'); cv.textContent = entry.items[0].text; cv.style.background = tileWashCSS(entry); }
  // Hovering a card glides the map to that entry.
  a.addEventListener('pointerenter', () => {
    if (app.classList.contains('index-expanded')) return;
    clearTimeout(hoverTimer);
    hoverTimer = setTimeout(() => {
      const offset = (indexEl.querySelector('.index-list').offsetWidth / 2) / (base * cam.tz); // keep it clear of the column
      flyTo(entry.cx + offset, entry.cy);
    }, 120);
  });
  li.appendChild(a);
  indexList.appendChild(li);
});
}
renderIndex();
indexReady = true;

$('#index-expand').addEventListener('click', () => {
  const on = app.classList.toggle('index-expanded');
  $('#index-expand').setAttribute('aria-label', on ? 'Collapse index' : 'Expand index');
});

function esc(s) { return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]); }

// ------------------------------------------------------------------
// Routing (#/, #/index, #/about, #/entry/slug)
// ------------------------------------------------------------------
function route() {
  const parts = location.hash.replace(/^#\/?/, '').split('/');
  let view = parts[0] || 'ground';
  let entry = null;
  if (view === 'entry') {
    entry = bySlug[parts[1]];
    if (!entry) view = 'ground';
  }
  if (!['ground', 'index', 'about', 'entry'].includes(view)) view = 'ground';

  app.dataset.view = view;
  document.querySelectorAll('[data-route]').forEach((a) => {
    if (a.dataset.route === view || (view === 'entry' && a.dataset.route === 'index' && cameFromIndex)) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });

  indexEl.hidden = view !== 'index';
  if (view !== 'index') app.classList.remove('index-expanded');
  $('#about').hidden = view !== 'about';
  $('#veil').hidden = !(view === 'about' || view === 'entry' || editState);
  if (view !== 'ground') closeTeaser();

  if (entry) {
    openCard(entry);
    flyTo(entry.cx, entry.cy);
    document.title = `${entry.title} – Attention Atlas`;
  } else {
    if (cardState && cardState.mode === 'view') {   // left an entry's page: put its card away
      cardState = null; cardEl.hidden = true; cardEl.innerHTML = ''; app.classList.remove('is-editor-open');
    }
    document.title = { ground: 'Attention Atlas', index: 'Entries – Attention Atlas', about: 'Hi – Attention Atlas' }[view];
  }
  lastView = view;
}
let lastView = 'ground';
let cameFromIndex = false;
window.addEventListener('hashchange', () => { cameFromIndex = lastView === 'index'; route(); });

// Clicking the veil returns to the map.
$('#veil').addEventListener('click', () => {
  if (cardState) closeEditor();
  else location.hash = '#/';
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (cardState) closeEditor();
    else if (!teaser.hidden) closeTeaser();
    else if (app.dataset.view !== 'ground') location.hash = '#/';
  }
  if (e.target.closest('input, textarea, select, [role="slider"]')) return;
  if (app.dataset.view === 'about' || app.dataset.view === 'entry' || cardState) return;
  const k = { ArrowLeft: [-2, 0], ArrowRight: [2, 0], ArrowUp: [0, -2], ArrowDown: [0, 2] }[e.key];
  if (k) flyTo(cam.tx + k[0], cam.ty + k[1]);
  if (e.key === '+' || e.key === '=') zoomStep(1);
  if (e.key === '-') zoomStep(-1);
});

// ------------------------------------------------------------------
// Editing — turn on with ?edit (remembered), off with ?edit=0.
// Edits are saved in this browser as a draft; Export downloads
// entries.json, which the public site loads when it's in the folder.
// ------------------------------------------------------------------
const params = new URLSearchParams(location.search);
// Editing only exists on your own computer (the local preview server or the
// file opened directly). On the published site ?edit does nothing, there is
// no Add button, and clicking an empty square does nothing — visitors can
// only read. You edit locally, Export entries.json, and publish that.
const IS_LOCAL = location.protocol === 'file:' ||
  ['localhost', '127.0.0.1', '::1', '[::1]'].includes(location.hostname) || location.hostname.endsWith('.localhost');
// On the live site, editing is unlocked per browser with a GitHub key that can
// write to this repository (see ?unlock). Unlocked browsers save straight to
// the repo; everyone else gets the read-only site.
const GH = { owner: 'tanisha-ship-it', repo: 'attention-atlas', branch: 'main' };   // update after moving the repo
const KEY_STORE = 'atlas.key', DIRTY_STORE = 'atlas.dirty';
const ghKey = (() => { try { return localStorage.getItem(KEY_STORE) || ''; } catch (e) { return ''; } })();
const REMOTE = !!ghKey;                 // this browser is unlocked: saves publish to GitHub
const OWNER = IS_LOCAL || REMOTE;       // may edit at all
const EDIT = REMOTE || IS_LOCAL && (() => {
  try {
    if (params.get('edit') === '0') localStorage.removeItem('atlas.edit');
    else if (params.has('edit')) localStorage.setItem('atlas.edit', '1');
    return localStorage.getItem('atlas.edit') === '1';
  } catch (e) { return params.has('edit') && params.get('edit') !== '0'; }
})();

const editStatus = $('#edit-status');
let editState = null;   // the cell being added / edited
let editTarget = null;  // { x, y } highlighted on the map
let hoverCell = null;   // empty cell under the cursor (edit mode)
let moveState = null;   // entry (or single cell) being dragged

// Status messages appear briefly under the Add button, then fade.
let statusTimer = null;
function setStatus(msg, isError = false) {
  editStatus.textContent = msg;
  editStatus.classList.toggle('is-error', isError);
  editStatus.classList.add('is-on');
  clearTimeout(statusTimer);
  statusTimer = setTimeout(() => editStatus.classList.remove('is-on'), isError ? 4200 : 2600);
}

function save() {
  if (REMOTE) {
    try { localStorage.setItem(DIRTY_STORE, '1'); } catch (e) { /* ignore */ }
    try { localStorage.setItem(STORE_KEY, JSON.stringify(DATA)); } catch (e) { /* too big to keep a local copy; publishing still happens */ }
    schedulePublish();
    return true;
  }
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(DATA));
    setStatus('Saved in this browser. Export to publish.');
    return true;
  } catch (e) {
    setStatus("Couldn't save: browser storage is full. Export now, or use smaller images.", true);
    return false;
  }
}

// ---------- publishing to GitHub (unlocked browsers only) ----------
function gh(path, opts = {}) {
  return fetch(`https://api.github.com/repos/${GH.owner}/${GH.repo}${path}`, {
    ...opts,
    headers: { Accept: 'application/vnd.github+json', Authorization: `Bearer ${ghKey}`, 'X-GitHub-Api-Version': '2022-11-28', ...(opts.headers || {}) },
  });
}
function toB64(str) {
  const bytes = new TextEncoder().encode(str);
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  return btoa(bin);
}
const fromB64 = (b) => new TextDecoder().decode(Uint8Array.from(atob(b.replace(/\s/g, '')), (c) => c.charCodeAt(0)));

let entriesSha = null;            // sha of entries.json in the repo ('' = not there yet)
const uploadedMedia = new Map();  // data URL → path in the repo, so nothing uploads twice
let publishTimer = null, publishing = false, publishQueued = false;

async function loadRemoteEntries() {
  const r = await gh(`/contents/entries.json?ref=${GH.branch}`);
  if (r.status === 404) { entriesSha = ''; return null; }
  if (!r.ok) throw Object.assign(new Error(`GitHub said ${r.status}`), { status: r.status });
  const j = await r.json();
  entriesSha = j.sha;
  const text = j.content ? fromB64(j.content)
    : await (await gh(`/contents/entries.json?ref=${GH.branch}`, { headers: { Accept: 'application/vnd.github.raw' } })).text();
  return JSON.parse(text);
}

// Uploaded pictures, videos and files live in the browser as data URLs until
// they're published; publishing puts each one in media/ and stores its path.
async function uploadDataURL(u) {
  if (uploadedMedia.has(u)) return uploadedMedia.get(u);
  const m = u.match(/^data:([^;,]+)[^,]*;base64,([\s\S]*)$/);
  if (!m) return u;
  const ext = ({ 'image/jpeg': 'jpg', 'image/png': 'png', 'image/gif': 'gif', 'image/webp': 'webp', 'image/svg+xml': 'svg', 'application/pdf': 'pdf', 'video/mp4': 'mp4', 'video/quicktime': 'mov', 'video/webm': 'webm' })[m[1]]
    || (m[1].split('/')[1] || 'bin').replace(/[^a-z0-9]/gi, '').slice(0, 8) || 'bin';
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(m[2].slice(0, 200000) + m[2].length));
  const name = [...new Uint8Array(digest)].slice(0, 8).map((x) => x.toString(16).padStart(2, '0')).join('');
  const path = `media/${name}.${ext}`;
  const r = await gh(`/contents/${path}`, { method: 'PUT', body: JSON.stringify({ message: `Add ${path}`, content: m[2], branch: GH.branch }) });
  if (!r.ok && r.status !== 422) throw Object.assign(new Error(`upload failed (${r.status})`), { status: r.status });   // 422 = already there
  uploadedMedia.set(u, path);
  return path;
}

async function publishableData() {
  const copy = JSON.parse(JSON.stringify(DATA));
  const fix = async (obj, key) => { if (typeof obj[key] === 'string' && obj[key].startsWith('data:')) obj[key] = await uploadDataURL(obj[key]); };
  for (const e of copy) {
    for (const c of e.cells || []) await fix(c, 'src');
    for (const a of e.attachments || []) { await fix(a, 'src'); await fix(a, 'poster'); await fix(a, 'preview'); }
  }
  return copy;
}

function schedulePublish() {
  setStatus('Saving…');
  clearTimeout(publishTimer);
  publishTimer = setTimeout(publishNow, 1200);
}

async function publishNow() {
  if (publishing) { publishQueued = true; return; }
  publishing = true;
  try {
    const body = JSON.stringify(await publishableData(), null, 2) + '\n';
    if (entriesSha === null) await loadRemoteEntries();
    const put = () => gh('/contents/entries.json', { method: 'PUT', body: JSON.stringify({ message: 'Update entries', content: toB64(body), branch: GH.branch, ...(entriesSha ? { sha: entriesSha } : {}) }) });
    let r = await put();
    if (r.status === 409 || r.status === 422) { await loadRemoteEntries(); r = await put(); }   // the file changed underneath us
    if (!r.ok) throw Object.assign(new Error(`GitHub said ${r.status}`), { status: r.status });
    entriesSha = (await r.json()).content.sha;
    if (!publishQueued) { try { localStorage.removeItem(DIRTY_STORE); localStorage.removeItem(STORE_KEY); } catch (e) { /* ignore */ } }
    setStatus('Published. Everyone sees it in about a minute.');
  } catch (e) {
    const why = e.status === 401 ? 'your GitHub key has expired or was removed'
      : e.status === 403 || e.status === 404 ? 'your GitHub key can’t write to this repository (it needs “Contents: Read and write”)'
      : (e.message || 'no connection');
    setStatus(`Couldn’t publish: ${why}. Your change is kept in this browser and will be sent with the next save.`, true);
  } finally {
    publishing = false;
    if (publishQueued) { publishQueued = false; publishNow(); }
  }
}

window.addEventListener('beforeunload', (e) => {
  if (REMOTE && (publishing || publishTimer && localStorage.getItem(DIRTY_STORE) === '1')) { e.preventDefault(); e.returnValue = ''; }
});

function slugify(t) {
  const base = t.toLowerCase().normalize('NFKD').replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-').slice(0, 48) || 'entry';
  let slug = base, n = 2;
  while (DATA.some((d) => d.slug === slug)) slug = `${base}-${n++}`;
  return slug;
}

function neighbourEntry(x, y) {
  for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, -1], [-1, 1], [1, 1]]) {
    const c = cellAt(x + dx, y + dy);
    if (c) return c.entry.data;
  }
  return null;
}

// Move an entry (or, with Alt/Option held, a single cell) by dragging.
function commitMove() {
  const m = moveState;
  moveState = null;
  if (!m || (!m.dx && !m.dy)) return;
  const moving = m.cell ? [m.cell] : m.entry.cells;
  const set = new Set(moving);
  for (const c of moving) {
    const nx = c.x + m.dx, ny = c.y + m.dy;
    if (Math.abs(nx + 0.5) > WORLD.x + 0.5 || Math.abs(ny + 0.5) > WORLD.y + 0.5) return setStatus('That would push it off the map.', true);
    const other = cellAt(nx, ny);
    if (other && !set.has(other)) return setStatus('That spot is taken by another entry.', true);
  }
  moving.forEach((c) => { c.data.x += m.dx; c.data.y += m.dy; });
  rebuild();
  save();
}

$('#edit-export').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(DATA, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'entries.json';
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  setStatus('Exported. Put entries.json in the site folder to publish.');
});

$('#edit-reset').addEventListener('click', () => {
  if (!confirm('Throw away every edit saved in this browser and go back to the published entries?')) return;
  try { localStorage.removeItem(STORE_KEY); localStorage.removeItem(DIRTY_STORE); } catch (e) { /* ignore */ }
  location.reload();
});

function lockDevice() {
  try { localStorage.removeItem(KEY_STORE); } catch (e) { /* ignore */ }
  location.href = location.pathname;
}
$('#edit-lock').addEventListener('click', () => { if (confirm('Lock this device? Editing turns off here until you unlock it again with your GitHub key.')) lockDevice(); });
if (REMOTE) { $('#edit-lock').hidden = false; $('#edit-done').hidden = true; }

if (EDIT) {
  $('#edit-bar').hidden = false;
  app.classList.add('is-editing');
}

// Nearest empty square to where you're looking, preferring one with no
// neighbours so a new entry starts on its own. You can drag it after.
function freeCellNear(cx, cy) {
  const x0 = Math.floor(cx), y0 = Math.floor(cy);
  let fallback = null;
  for (let r = 0; r <= Math.max(WORLD.x, WORLD.y) * 2; r++) {
    for (let dy = -r; dy <= r; dy++) {
      for (let dx = -r; dx <= r; dx++) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
        const x = x0 + dx, y = y0 + dy;
        if (Math.abs(x + 0.5) > WORLD.x + 0.5 || Math.abs(y + 0.5) > WORLD.y + 0.5 || cellAt(x, y)) continue;
        if (!neighbourEntry(x, y)) return { x, y };
        fallback = fallback || { x, y };
      }
    }
  }
  return fallback;
}

$('#edit-add').addEventListener('click', () => {
  if (app.dataset.view !== 'ground' && app.dataset.view !== 'index') location.hash = '#/';
  const spot = freeCellNear(cam.tx, cam.ty);
  if (!spot) return setStatus('The map is full. Remove something first.', true);
  openEditor(spot.x, spot.y, { viaAdd: true });
});

const editMenu = $('#edit-menu'), editMore = $('#edit-more');
function toggleMenu(open) {
  editMenu.hidden = !open;
  editMore.setAttribute('aria-expanded', String(open));
}
editMore.addEventListener('click', (e) => { e.stopPropagation(); toggleMenu(editMenu.hidden); });
document.addEventListener('click', (e) => { if (!e.target.closest('#edit-menu')) toggleMenu(false); });



// ------------------------------------------------------------------
// Entry card — one hierarchy for reading, adding and editing:
//   1 preview (if there's a picture) · 2 what it is · 3 the way in ·
//   4 where it sits (two dials) · 5 what's inside · 6 thoughts, tags, date
// Entry data (stored in entries.json / the browser draft):
//   { slug, title, sub, kind?, tags[], added, cells[],           ← cells = map footprint
//     attachments: [{ type:'link', url, title? } | { type:'image', src, caption? }
//                   | { type:'video', src, poster?, name } | { type:'file', name, size, mime, src, preview? }],
//     thoughts: [{ d: 'YYYY-MM-DD' | null, t }] }
// ------------------------------------------------------------------
const cardEl = $('#ecard');
const MAX_UPLOAD = (REMOTE ? 25 : 3) * 1024 * 1024;   // unlocked: files go to the repo; otherwise browser storage (~5 MB in total)
const IC = {
  link: '<svg viewBox="0 0 20 20"><path d="M8.5 11.5a3 3 0 0 0 4.2 0l2.6-2.6a3 3 0 0 0-4.2-4.2l-.9.9M11.5 8.5a3 3 0 0 0-4.2 0l-2.6 2.6a3 3 0 0 0 4.2 4.2l.9-.9"/></svg>',
  file: '<svg viewBox="0 0 20 20"><path d="M6 2.5h5.5L15 6v11.5H6zM11 2.5V6.5h4"/></svg>',
  image: '<svg viewBox="0 0 20 20"><rect x="3" y="4" width="14" height="12"/><path d="m3 13 4-4 4 4 2-2 4 4"/></svg>',
  video: '<svg viewBox="0 0 20 20"><rect x="2.5" y="5" width="11" height="10"/><path d="m13.5 9 4-2.5v7l-4-2.5"/></svg>',
  note: '<svg viewBox="0 0 20 20"><path d="M4 4h12v12H4zM7 8h6M7 11h6M7 14h3"/></svg>',
  arrow: '<svg viewBox="0 0 20 20"><path d="M7 13 13 7M8 7h5v5"/></svg>',
  play: '<svg viewBox="0 0 20 20"><path d="M6 4v12l10-6z" fill="currentColor" stroke="none"/></svg>',
  x: '<svg viewBox="0 0 20 20"><path d="M5 5l10 10M15 5 5 15"/></svg>',
};

// ---------- small helpers ----------
const domainOf = (url) => { try { return new URL(url).hostname.replace(/^www\./, ''); } catch (e) { return url; } };
const youtubeId = (url) => (url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{6,})/) || [])[1] || null;
const isInstagram = (url) => /instagram\.com\/(reel|p|tv)\//.test(url);
const isVideoLink = (url) => !!youtubeId(url) || /vimeo\.com\/\d+/.test(url) || isInstagram(url) || /tiktok\.com\//.test(url);
const todayISO = () => { const n = new Date(); return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}-${String(n.getDate()).padStart(2, '0')}`; };   // local date
const fmtDate = (iso) => {
  if (!iso) return '';
  const d = new Date(`${iso}T12:00:00`);
  return Number.isNaN(+d) ? iso : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
};
const fmtSize = (b) => (b > 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`);
const isPdf = (f) => f.mime === 'application/pdf' || /\.pdf$/i.test(f.name || '');

// Where an entry sits, as dial values: x found it (-1) → made it (+1);
// y passing by (-1) → can't stop thinking about it (+1).
const toDial = (cx, cy) => ({ x: clamp(cx / WORLD.x, -1, 1), y: clamp(-cy / WORLD.y, -1, 1) });
const quadName = (x, y) => (Math.abs(x) < 0.12 && Math.abs(y) < 0.12) ? 'right in the middle'
  : (y >= 0 ? (x < 0 ? 'a trail I’m following' : 'something I keep working on') : (x < 0 ? 'a find, kept for later' : 'a quick make'));

// Eyebrow accent: the background gradient's hues — powder blue up at
// "can't stop thinking about it", warm sand down at "passing by".
const ACCENT_TOP = { mark: [127, 160, 208], ink: [62, 98, 150] };
const ACCENT_BOT = { mark: [196, 182, 152], ink: [128, 110, 76] };
function setAccent(el, y) {
  const t = 1 - (y + 1) / 2;
  const mix = (a, b) => a.map((c, i) => Math.round(c + (b[i] - c) * t)).join(' ');
  el.style.setProperty('--accent', `rgb(${mix(ACCENT_TOP.mark, ACCENT_BOT.mark)})`);
  el.style.setProperty('--accent-ink', `rgb(${mix(ACCENT_TOP.ink, ACCENT_BOT.ink)})`);
}

// ---------- reading an entry ----------
// Older entries are clusters of image/note cells; their extra cells show up
// as things inside the entry, and their old description as undated thoughts.
function legacyParts(d, removed = []) {
  const cells = (d.cells || []).map((c, ci) => ({ c, ci })).filter(({ c, ci }) => !c.auto && !removed.includes(ci));
  return {
    images: cells.filter(({ c }) => c.type === 'image').map(({ c, ci }) => ({ type: 'image', src: imgSrc(c), caption: c.caption || '', ci })),
    notes: cells.filter(({ c }) => c.type === 'text').map(({ c, ci }) => ({ type: 'note', text: c.text, ci })),
  };
}
const thoughtsOf = (d) => d.thoughts || (d.text || []).map((t) => ({ d: null, t }));

function previewOf(atts, legacyImages = []) {
  const img = atts.find((a) => a.type === 'image');
  if (img) return { type: 'image', src: img.src };
  const vid = atts.find((a) => a.type === 'video' && a.poster);
  if (vid) return { type: 'video', src: vid.poster, video: vid };
  const pdf = atts.find((a) => a.type === 'file' && a.preview);
  if (pdf) return { type: 'page', src: pdf.preview };
  const yt = atts.find((a) => a.type === 'link' && youtubeId(a.url));
  if (yt) return { type: 'video', src: `https://img.youtube.com/vi/${youtubeId(yt.url)}/hqdefault.jpg`, link: yt };
  if (legacyImages[0]) return { type: 'image', src: legacyImages[0].src };
  return null;
}

function inferKind(atts, total) {
  if (total >= 3) return 'deep dive';
  const link = atts.find((a) => a.type === 'link');
  if (link && youtubeId(link.url)) return 'video · youtube';
  if (link && isInstagram(link.url)) return 'reel · instagram';
  if (atts.some((a) => a.type === 'video')) return 'video';
  const f = atts.find((a) => a.type === 'file');
  if (f) return isPdf(f) ? 'pdf' : 'file';
  if (link) return `link · ${domainOf(link.url)}`;
  if (atts.some((a) => a.type === 'image')) return 'image';
  return 'note';
}

function primaryOf(atts) {
  const link = atts.find((a) => a.type === 'link');
  if (link) {
    const label = link.title || (youtubeId(link.url) ? 'Watch on YouTube' : isInstagram(link.url) ? 'Watch on Instagram' : 'Open link');
    return { label, meta: `${domainOf(link.url)} ↗`, href: link.url, att: link };
  }
  const f = atts.find((a) => a.type === 'file');
  if (f) return { label: isPdf(f) ? 'Read the PDF' : 'Download the file', meta: fmtSize(f.size || 0), file: f, att: f };
  const v = atts.find((a) => a.type === 'video' && a.src);
  if (v) return { label: 'Play', meta: 'video', play: true };
  return null;
}

// ---------- state ----------
// editState: { mode: 'view'|'add'|'edit', viaAdd, d (entry data or null), draft {…}, pos {x,y}, spot {x,y}, error }
function openCard(entry) {            // read-only card (visitors, or from the index)
  const d = entry.data;
  editState = null;
  cardState = { mode: 'view', d, pos: toDial(entry.cx, entry.cy) };
  showCard();
}
let cardState = null;

// Edit mode: an existing cell opens its entry for editing; an empty cell (or
// the Add button) starts a new entry. Only the Add button lets you set the
// location with the dials — from a clicked cell, the cell is the location.
function openEditor(x, y, opts = {}) {
  const existing = cellAt(x, y);
  if (existing) {
    const d = existing.entry.data;
    cardState = { mode: 'edit', d, pos: toDial(existing.entry.cx, existing.entry.cy), draft: draftFrom(d) };
  } else {
    cardState = {
      mode: 'add', viaAdd: !!opts.viaAdd, d: null, spot: { x, y },
      pos: toDial(x + 0.5, y + 0.5), draft: draftFrom(null),
    };
  }
  editState = cardState;
  editTarget = { x, y };
  showCard();
  cardEl.querySelector('[data-f="title"]')?.focus();
}

function editFromView() {
  const s = cardState; if (!s || s.mode !== 'view' || !OWNER) return;
  cardState = { mode: 'edit', d: s.d, pos: s.pos, draft: draftFrom(s.d) };
  editState = cardState;
  const c = s.d.cells[0]; editTarget = c ? { x: c.x, y: c.y } : null;
  renderCard();
  cardEl.scrollTop = 0;
  cardEl.querySelector('[data-f="title"]')?.focus();
}

function draftFrom(d) {
  return {
    title: d ? d.title : '', sub: d ? d.sub || '' : '', kind: d ? d.kind || '' : '',
    tags: d ? (d.tags || []).join(', ') : '', attachments: d ? JSON.parse(JSON.stringify(d.attachments || [])) : [],
    firstThought: '', linkForm: false, error: '', removed: [],   // removed = map squares to drop on save
  };
}

function showCard() {
  $('#veil').hidden = false;
  app.classList.add('is-editor-open');
  cardEl.hidden = false;
  renderCard();
  cardEl.scrollTop = 0;
}

function closeEditor() {
  cardState = null; editState = null; editTarget = null;
  cardEl.hidden = true; cardEl.innerHTML = '';
  app.classList.remove('is-editor-open');
  if (app.dataset.view === 'entry') { location.hash = '#/'; return; }
  if (app.dataset.view !== 'about' && app.dataset.view !== 'entry') $('#veil').hidden = true;
}

// keep what's been typed before re-rendering
function readDraft_() {
  const s = cardState; if (!s || s.mode === 'view') return;
  const v = (f) => cardEl.querySelector(`[data-f="${f}"]`)?.value;
  ['title', 'sub', 'kind', 'tags', 'firstThought'].forEach((f) => { const x = v(f); if (x !== undefined) s.draft[f] = x; });
  s.draft.attachments.forEach((a, i) => { const c = cardEl.querySelector(`[data-caption="${i}"]`); if (c) a.caption = c.value; });
}

// ---------- render ----------
function renderCard() {
  const s = cardState; if (!s) return;
  const editing = s.mode !== 'view';
  const d = s.d;
  const dr = s.draft;
  const atts = editing ? dr.attachments : (d.attachments || []);
  const legacy = d ? legacyParts(d, editing ? dr.removed : []) : { images: [], notes: [] };
  const pv = previewOf(atts, legacy.images);
  const extraImages = legacy.images.filter((im) => !(pv && pv.src === im.src));   // the preview isn't repeated below
  const total = atts.length + legacy.images.length + legacy.notes.length;
  const kindText = (editing ? dr.kind : d.kind) || inferKind(atts, total);
  const title = editing ? dr.title : d.title;
  const sub = editing ? dr.sub : (d.sub || '');
  const thoughts = d ? thoughtsOf(d) : [];
  const tags = editing ? dr.tags : (d.tags || []);

  cardEl.classList.toggle('is-textfirst', !pv && !editing);
  cardEl.classList.toggle('is-editing', editing);
  setAccent(cardEl, s.pos.y);

  const close = `<div class="ec-close"><button class="ec-x" data-act="close" aria-label="Close">${IC.x}</button></div>`;

  // 1 · preview, or a drop zone while adding/editing with nothing visual yet
  let top = '';
  if (pv) {
    const rm = editing ? `<span class="ec-pv-note">Preview from ${pv.type === 'page' ? 'the PDF’s first page' : pv.type === 'video' ? (pv.link ? 'YouTube' : 'a frame of the video') : 'the image'}</span>` : '';
    if (pv.type === 'page') top = `<div class="ec-pv is-page">${rm}<img src="${esc(pv.src)}" alt=""></div>`;
    else top = `<div class="ec-pv" ${pv.video && pv.video.src && !editing ? 'data-act="play"' : ''}>${rm}<img src="${esc(pv.src)}" alt="" referrerpolicy="no-referrer">
      ${pv.type === 'video' ? `<span class="ec-play">${IC.play}</span>` : ''}
      ${!editing && total >= 3 ? `<span class="ec-badge">${total} things</span>` : ''}</div>`;
  } else if (editing) {
    top = `<div class="ec-drop" data-drop>
      <p>Drop a photo, video or file here, or paste a link.<br><span>If it has a picture, that becomes its look on the map.</span></p>
      <div class="ec-pills">${addButtons()}</div></div>`;
  }

  // 2 · what it is
  const id = editing
    ? `<div class="ec-id">
        <label class="ec-eyebrow ec-field"><input data-f="kind" value="${esc(dr.kind)}" placeholder="${esc(inferKind(atts, total))}" aria-label="Kind"></label>
        <label class="ec-field"><input class="ec-in-title" data-f="title" value="${esc(dr.title)}" placeholder="What is it?" aria-label="Title"></label>
        <label class="ec-field"><input class="ec-in-sub" data-f="sub" value="${esc(dr.sub)}" placeholder="In a line, why it’s here" aria-label="One line"></label>
        ${dr.error ? `<p class="ec-error" role="alert">${esc(dr.error)}</p>` : ''}
      </div>`
    : `<div class="ec-id"><span class="ec-eyebrow">${esc(kindText)}</span><h2 class="ec-title">${esc(title)}</h2>${sub ? `<p class="ec-sub">${esc(sub)}</p>` : ''}</div>`;

  // 3 · the way in
  const pr = editing ? null : primaryOf(atts);
  const primary = pr
    ? (pr.href ? `<a class="ec-primary" href="${esc(pr.href)}" target="_blank" rel="noopener"><span>${pr.label}</span><small>${esc(pr.meta)}</small></a>`
      : `<button class="ec-primary" data-act="${pr.play ? 'play' : 'open-file'}"><span>${pr.label}</span><small>${esc(pr.meta)}</small></button>`)
    : '';

  // 4 · where it sits
  const canDial = s.mode === 'add' && s.viaAdd;
  const dial = (axis, l, r) => `<div class="ec-sl ${canDial ? 'can' : ''}" data-axis="${axis}" ${canDial ? 'tabindex="0" role="slider" aria-valuemin="-100" aria-valuemax="100"' : ''} aria-label="${l} to ${r}">
      <span class="fill"></span><span class="mid"></span><span class="h"></span><span class="l">${l}</span><span class="r">${r}</span></div>`;
  const where = `<section class="ec-sec"><div class="ec-sec-h"><span>On the atlas</span>${canDial ? '<em>drag to place</em>' : ''}</div>
      ${dial('x', 'found it', 'made it')}${dial('y', 'passing by', 'can’t stop thinking about it')}
      <span class="ec-quad"><em>so it’s</em> <span data-quad></span></span>
      ${editing && !canDial ? `<span class="ec-hint">${s.mode === 'edit' ? 'To move it, drag it on the map.' : 'It goes in the square you clicked.'}</span>` : ''}
    </section>`;

  // 5 · what's inside
  const rows = [];
  atts.forEach((a, i) => {
    if (pv && pv.type === 'image' && a.type === 'image' && atts.findIndex((x) => x.type === 'image') === i && !editing) return; // the preview itself
    if (pr && pr.att === a) return;                                                                                          // already the way in
    rows.push(attRow(a, i, editing));
  });
  if (!editing) legacy.notes.forEach((n) => rows.push(`<div class="ec-att is-note"><span class="ic">${IC.note}</span><span class="t"><b class="wrap">${esc(n.text)}</b></span></div>`));
  if (editing) {
    const rmBtn = (ci) => `<button class="ec-rm" data-act="remove-cell" data-ci="${ci}" aria-label="Remove this square from the map">×</button>`;
    legacy.images.forEach((im) => rows.push(`<div class="ec-att is-image"><span class="ic" style="background-image:url('${esc(im.src)}')"></span><span class="t"><b>${esc(im.caption || 'Image')}</b><span>square on the map</span></span>${rmBtn(im.ci)}</div>`));
    legacy.notes.forEach((n) => rows.push(`<div class="ec-att is-note"><span class="ic">${IC.note}</span><span class="t"><b class="wrap">${esc(n.text)}</b><span>square on the map</span></span>${rmBtn(n.ci)}</div>`));
  }
  const thumbs = !editing && extraImages.length ? `<div class="ec-thumbs">${extraImages.map((im) => `<span style="background-image:url('${im.src}')"></span>`).join('')}</div>` : '';
  const insideCount = rows.length + (thumbs ? extraImages.length : 0);
  const inside = (insideCount || editing)
    ? `<section class="ec-sec"><div class="ec-sec-h"><span>${kindText === 'deep dive' && !editing ? 'In this deep dive' : 'Also in here'}</span>${insideCount ? `<em>${insideCount}</em>` : ''}</div>
        ${rows.join('')}${thumbs}
        ${editing && (pv || atts.length) ? `<div class="ec-addrow">${addButtons()}</div>` : ''}
        ${editing && dr.linkForm ? linkForm() : ''}
      </section>` : '';

  // 6 · thoughts
  const log = thoughts.map((t, i) => `<div class="ec-thought" data-i="${i}"><time>${t.d ? fmtDate(t.d) : ''}</time><p>${esc(t.t)}</p></div>`).join('');
  const thoughtsSec = (thoughts.length || editing)
    ? `<section class="ec-sec"><div class="ec-sec-h"><span>Thoughts</span>${thoughts.length ? `<em>${thoughts.length}</em>` : ''}</div>
        ${log ? `<div class="ec-thoughts">${log}</div>` : ''}
        ${editing ? `<div class="ec-add-thought"><textarea data-f="${s.mode === 'add' ? 'firstThought' : 'newThought'}" rows="2" placeholder="${s.mode === 'add' ? 'First thoughts. Why did this catch your attention?' : 'Add a thought. It’s dated today.'}">${s.mode === 'add' ? esc(dr.firstThought) : ''}</textarea>
          ${s.mode === 'edit' ? '<div class="ec-row2"><span>⌘ + Enter to add</span><button data-act="add-thought">Add thought</button></div>' : ''}</div>` : ''}
      </section>` : '';

  // footer
  const foot = editing
    ? `<div class="ec-foot is-edit"><label class="ec-field ec-tags"><span>Tags</span><input data-f="tags" value="${esc(dr.tags)}" placeholder="memory, interfaces"></label></div>
       <div class="ec-actions"><button class="ec-save" data-act="save">${s.mode === 'add' ? 'Add to atlas' : 'Save changes'}</button>
       ${s.mode === 'edit' ? '<button class="ec-delete" data-act="delete">Delete entry</button>' : ''}</div>`
    : (tags.length || d.added ? `<div class="ec-foot"><span class="ec-tags-list">${tags.map((t) => `<span>${esc(t)}</span>`).join('')}</span><span class="ec-date">${d.added ? `added ${fmtDate(d.added)}` : ''}</span></div>` : '')
      + (OWNER ? '<div class="ec-owner"><button data-act="edit-entry">Edit entry</button><button class="ec-delete" data-act="delete">Delete entry</button></div>' : '');

  cardEl.innerHTML = close + top + `<div class="ec-body">${id}${primary}${where}${inside}${thoughtsSec}${foot}</div>`
    + '<input type="file" hidden data-pick="image" accept="image/*"><input type="file" hidden data-pick="video" accept="video/*"><input type="file" hidden data-pick="file">';
  paintDials();
  cardEl.querySelectorAll('textarea').forEach(autosizeTA);
}

function addButtons() {
  return `<button data-act="pick-link">${IC.link}Link</button><button data-act="pick" data-kind="image">${IC.image}Image</button>`
    + `<button data-act="pick" data-kind="video">${IC.video}Video</button><button data-act="pick" data-kind="file">${IC.file}File</button>`;
}
function linkForm() {
  return `<div class="ec-linkform"><input data-lf="url" type="url" placeholder="https://" aria-label="Link"><input data-lf="title" placeholder="Title (optional)" aria-label="Link title"><button data-act="add-link">Add</button></div>`;
}
function attRow(a, i, editing) {
  let ic = IC[a.type] || IC.file, title = '', meta = '', href = '';
  if (a.type === 'link') { title = a.title || domainOf(a.url); meta = domainOf(a.url); href = a.url; if (youtubeId(a.url) || isVideoLink(a.url)) ic = IC.video; }
  if (a.type === 'file') { title = a.name; meta = `${isPdf(a) ? 'PDF' : (a.mime || 'file').split('/').pop()} · ${fmtSize(a.size || 0)}`; }
  if (a.type === 'video') { title = a.name || 'Video'; meta = 'video'; }
  if (a.type === 'image') {
    return `<div class="ec-att is-image"><span class="ic" style="background-image:url('${esc(a.src)}')"></span>
      <span class="t">${editing ? `<input data-caption="${i}" value="${esc(a.caption || '')}" placeholder="Caption (optional)">` : `<b>${esc(a.caption || 'Image')}</b>`}</span>
      ${editing ? `<button class="ec-rm" data-act="remove" data-i="${i}" aria-label="Remove">×</button>` : ''}</div>`;
  }
  const tag = !editing && href ? 'a' : 'div';
  const attrs = tag === 'a' ? `href="${esc(href)}" target="_blank" rel="noopener"` : (!editing && a.type === 'file' ? `data-act="open-att" data-i="${i}" role="button" tabindex="0"`
    : !editing && a.type === 'video' && a.src ? 'data-act="play" role="button" tabindex="0"' : '');
  return `<${tag} class="ec-att" ${attrs}><span class="ic">${ic}</span><span class="t"><b>${esc(title)}</b><span>${esc(meta)}</span></span>
    ${editing ? `<button class="ec-rm" data-act="remove" data-i="${i}" aria-label="Remove">×</button>` : `<span class="go">${a.type === 'file' ? 'Open file' : a.type === 'video' ? 'Play' : 'Open'}${IC.arrow}</span>`}</${tag}>`;
}

function paintDials() {
  const s = cardState; if (!s) return;
  cardEl.querySelectorAll('.ec-sl').forEach((el) => {
    const v = s.pos[el.dataset.axis], p = (v + 1) * 50;
    el.querySelector('.h').style.left = `${p}%`;
    const f = el.querySelector('.fill'); f.style.left = `${Math.min(50, p)}%`; f.style.width = `${Math.abs(p - 50)}%`;
    el.querySelector('.l').classList.toggle('on', v < -0.12);
    el.querySelector('.r').classList.toggle('on', v > 0.12);
    if (el.hasAttribute('role')) el.setAttribute('aria-valuenow', Math.round(v * 100));
  });
  const q = cardEl.querySelector('[data-quad]'); if (q) q.textContent = quadName(s.pos.x, s.pos.y);
  setAccent(cardEl, s.pos.y);
}

function autosizeTA(t) { t.style.height = 'auto'; t.style.height = `${Math.min(t.scrollHeight, 240)}px`; }

// ---------- uploads → attachments (with previews) ----------
async function downscale(file, max = 1200) {
  const bmp = await createImageBitmap(file);
  const k = Math.min(1, max / Math.max(bmp.width, bmp.height));
  const c = document.createElement('canvas');
  c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
  c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
  return c.toDataURL('image/jpeg', 0.82);
}
const readAsDataURL = (file) => new Promise((ok, bad) => { const r = new FileReader(); r.onload = () => ok(r.result); r.onerror = bad; r.readAsDataURL(file); });

function videoPoster(file) {
  return new Promise((ok) => {
    const v = document.createElement('video');
    v.muted = true; v.playsInline = true; v.preload = 'metadata';
    v.src = URL.createObjectURL(file);
    v.onloadeddata = () => { v.currentTime = Math.min(1, (v.duration || 2) / 3); };
    v.onseeked = () => {
      const k = Math.min(1, 1200 / Math.max(v.videoWidth, v.videoHeight));
      const c = document.createElement('canvas'); c.width = Math.round(v.videoWidth * k); c.height = Math.round(v.videoHeight * k);
      c.getContext('2d').drawImage(v, 0, 0, c.width, c.height);
      URL.revokeObjectURL(v.src); ok(c.toDataURL('image/jpeg', 0.8));
    };
    v.onerror = () => ok(null);
  });
}

let pdfjsReady = null;
function loadPdfJs() {
  if (!pdfjsReady) {
    pdfjsReady = new Promise((ok, bad) => {
      const sc = document.createElement('script');
      sc.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      sc.onload = () => { window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'; ok(window.pdfjsLib); };
      sc.onerror = bad; document.head.appendChild(sc);
    });
  }
  return pdfjsReady;
}
async function pdfFirstPage(file) {
  try {
    const pdfjs = await loadPdfJs();
    const pdf = await Promise.race([pdfjs.getDocument({ data: await file.arrayBuffer() }).promise, new Promise((_, no) => setTimeout(() => no(new Error('timeout')), 10000))]);
    const page = await pdf.getPage(1);
    const vp = page.getViewport({ scale: 1 }); const scale = 900 / vp.width;
    const c = document.createElement('canvas'); const v2 = page.getViewport({ scale });
    c.width = v2.width; c.height = v2.height;
    // 'print' intent renders without waiting on animation frames, and a
    // timeout means an odd PDF can never leave the card stuck
    await Promise.race([
      page.render({ canvasContext: c.getContext('2d'), viewport: v2, intent: 'print' }).promise,
      new Promise((_, no) => setTimeout(() => no(new Error('timeout')), 10000)),
    ]);
    return c.toDataURL('image/jpeg', 0.8);
  } catch (e) { return null; }
}

async function addFile(file, kind) {
  const s = cardState; if (!s || s.mode === 'view') return;
  readDraft_();
  const type = kind || (file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : 'file');
  try {
    if (type === 'image') {
      s.draft.attachments.push({ type: 'image', src: await downscale(file), caption: '' });
    } else if (type === 'video') {
      if (file.size > MAX_UPLOAD) { setStatus(`That video is ${fmtSize(file.size)}; the limit here is ${fmtSize(MAX_UPLOAD)}. Add it as a link instead (YouTube, Vimeo, Instagram).`, true); return; }
      s.draft.attachments.push({ type: 'video', name: file.name, src: await readAsDataURL(file), poster: await videoPoster(file) });
    } else {
      if (file.size > MAX_UPLOAD) { setStatus(`That file is ${fmtSize(file.size)}; the limit here is ${fmtSize(MAX_UPLOAD)}. Link to it instead.`, true); return; }
      const att = { type: 'file', name: file.name, size: file.size, mime: file.type, src: await readAsDataURL(file) };
      if (isPdf(att)) { setStatus('Making a preview from the first page…'); att.preview = await pdfFirstPage(file); }
      s.draft.attachments.push(att);
    }
  } catch (e) { setStatus("That couldn't be read. Try another file.", true); return; }
  renderCard();
}

function addLink(url, title) {
  const s = cardState;
  url = (url || '').trim();
  if (!/^https?:\/\//i.test(url)) url = url ? `https://${url}` : '';
  try { new URL(url); } catch (e) { s.draft.error = 'That link doesn’t look right.'; renderCard(); return; }
  readDraft_();
  s.draft.attachments.push({ type: 'link', url, ...(title && title.trim() ? { title: title.trim() } : {}) });
  s.draft.linkForm = false; s.draft.error = '';
  renderCard();
}

// ---------- saving ----------
// ---------- map footprint: one square per resource ----------
// An entry made with this card covers as many squares as it has attachments
// (at least one). The first square stands for the entry (its preview, or its
// title); the rest are its other attachments: a picture if there is one,
// otherwise a text tile with the attachment's name.
function tileOfAttachment(a) {
  if (a.type === 'image') return { type: 'image', src: a.src };
  if (a.type === 'video' && a.poster) return { type: 'image', src: a.poster };
  if (a.type === 'file' && a.preview) return { type: 'image', src: a.preview };
  if (a.type === 'link' && youtubeId(a.url)) return { type: 'image', src: `https://img.youtube.com/vi/${youtubeId(a.url)}/hqdefault.jpg` };
  if (a.type === 'link') return { type: 'text', text: a.title || domainOf(a.url) };
  return { type: 'text', text: a.name || a.caption || 'File' };
}
function tilesFor(d) {
  const tiles = (d.attachments || []).map(tileOfAttachment);
  if (!tiles.length) return [{ type: 'text', text: d.title }];
  const lead = tiles.findIndex((t) => t.type === 'image');
  if (lead > 0) tiles.unshift(tiles.splice(lead, 1)[0]);      // the preview leads
  if (lead < 0) tiles[0] = { type: 'text', text: d.title };   // no picture: the title leads
  return tiles;
}

// Lay the tiles out as a cluster. Squares already placed keep their spots (so
// shapes are stable and hand-arranged ones survive); new squares attach to
// the side of the cluster, picked pseudo-randomly per entry so shapes vary.
function syncAutoCells(d, anchor) {
  const tiles = tilesFor(d);
  const old = (d.cells || []).filter((c) => c.auto);
  const kept = (d.cells || []).filter((c) => !c.auto);          // squares of older, hand-built entries
  const taken = new Set();
  DATA.forEach((o) => { if (o !== d) (o.cells || []).forEach((c) => taken.add(`${c.x},${c.y}`)); });
  kept.forEach((c) => taken.add(`${c.x},${c.y}`));
  let seed = 2166136261;
  for (const ch of d.slug || d.title || '') seed = Math.imul(seed ^ ch.charCodeAt(0), 16777619) >>> 0;
  const rand = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
  const inWorld = (x, y) => Math.abs(x + 0.5) <= WORLD.x + 0.5 && Math.abs(y + 0.5) <= WORLD.y + 0.5;
  const placed = [];
  tiles.forEach((t, i) => {
    let pos = old[i] ? { x: old[i].x, y: old[i].y } : null;
    if (!pos && !placed.length) pos = anchor;
    if (!pos) {
      const mine = new Set(placed.map((c) => `${c.x},${c.y}`));
      const options = [];
      placed.forEach((c) => [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => {
        const x = c.x + dx, y = c.y + dy, k = `${x},${y}`;
        if (!mine.has(k) && !taken.has(k) && inWorld(x, y) && !options.some((o) => o.x === x && o.y === y)) options.push({ x, y });
      }));
      // keep a one-square gap from other entries when there's room, so clusters read as separate
      const touchesOther = (o) => [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]].some(([dx, dy]) => taken.has(`${o.x + dx},${o.y + dy}`));
      const roomy = options.filter((o) => !touchesOther(o));
      let pool = roomy.length ? roomy : options;
      // more often than not, continue from the newest square, so shapes wander like tetris pieces instead of filling a block
      const last = placed[placed.length - 1];
      const fromLast = pool.filter((o) => Math.abs(o.x - last.x) + Math.abs(o.y - last.y) === 1);
      for (let n = 0; n <= i; n++) rand();                       // vary the pick with the square's index
      if (fromLast.length && rand() < 0.65) pool = fromLast;
      pos = pool.length ? pool[Math.floor(rand() * pool.length)] : null;
    }
    if (pos) placed.push({ x: pos.x, y: pos.y, auto: true, ...t });   // no room left: that resource simply has no square
  });
  d.cells = [...kept, ...placed];
}

function saveCard() {
  readDraft_();
  const s = cardState, dr = s.draft;
  if (!dr.title.trim()) { dr.error = 'Give it a title (even a rough one).'; renderCard(); cardEl.querySelector('[data-f="title"]')?.focus(); return; }
  const fields = {
    title: dr.title.trim(), sub: dr.sub.trim(), kind: dr.kind.trim(),
    tags: dr.tags.split(',').map((t) => t.trim()).filter(Boolean),
    attachments: dr.attachments,
  };
  if (!fields.kind) delete fields.kind;
  let d;
  if (s.mode === 'add') {
    // via Add: the dials choose the spot (nearest free square); otherwise the clicked square
    const spot = s.viaAdd ? freeCellNear(s.pos.x * WORLD.x - 0.5, -s.pos.y * WORLD.y - 0.5) : s.spot;
    if (!spot) { setStatus('The map is full. Remove something first.', true); return; }
    d = { slug: slugify(fields.title), ...fields, added: todayISO(), thoughts: [], cells: [] };
    if (dr.firstThought.trim()) d.thoughts.push({ d: todayISO(), t: dr.firstThought.trim() });
    DATA.push(d);
    syncAutoCells(d, spot);
  } else {
    d = s.d;
    Object.assign(d, fields);
    if (!dr.kind.trim()) delete d.kind;
    if (!d.thoughts) d.thoughts = thoughtsOf(d);
    delete d.text;
    if (dr.removed.length) {
      const first = d.cells[0];
      d.cells = d.cells.filter((c, ci) => !dr.removed.includes(ci));
      if (!d.cells.length) d.cells = [{ x: first.x, y: first.y, auto: true, type: 'text', text: d.title }];
    }
    // entries made with this card: one square per resource, kept in sync
    if (d.cells.some((c) => c.auto)) syncAutoCells(d, d.cells.find((c) => c.auto));
  }
  rebuild(); save();
  const ent = bySlug[d.slug];
  closeEditor();
  if (ent) flyTo(ent.cx, ent.cy);
}

function addThoughtNow() {
  const s = cardState; if (!s || s.mode !== 'edit') return;
  const ta = cardEl.querySelector('[data-f="newThought"]'); const t = ta && ta.value.trim(); if (!t) return;
  readDraft_();
  if (!s.d.thoughts) s.d.thoughts = thoughtsOf(s.d);
  delete s.d.text;
  s.d.thoughts.push({ d: todayISO(), t });
  rebuild(); save();
  renderCard();
  const all = cardEl.querySelectorAll('.ec-thought'); all[all.length - 1]?.classList.add('is-new');
  cardEl.querySelector('[data-f="newThought"]')?.focus();
}

function deleteCardEntry() {
  const d = cardState.d;
  if (!confirm(`Delete “${d.title}”? This can't be undone once you export.`)) return;
  DATA = DATA.filter((x) => x !== d);
  rebuild(); save(); closeEditor();
}

function openStoredFile(f) {
  fetch(f.src).then((r) => r.blob()).then((b) => window.open(URL.createObjectURL(b), '_blank', 'noopener'));
}

// ---------- events ----------
cardEl.addEventListener('click', (e) => {
  const t = e.target.closest('[data-act]'); if (!t || !cardState) return;
  const s = cardState, act = t.dataset.act;
  if (act === 'close') return closeEditor();
  if (act === 'save') return saveCard();
  if (act === 'delete') return deleteCardEntry();
  if (act === 'edit-entry') return editFromView();
  if (act === 'remove-cell') { readDraft_(); s.draft.removed.push(+t.dataset.ci); renderCard(); return; }
  if (act === 'add-thought') return addThoughtNow();
  if (act === 'pick') { cardEl.querySelector(`[data-pick="${t.dataset.kind}"]`).click(); return; }
  if (act === 'pick-link') { readDraft_(); s.draft.linkForm = true; renderCard(); cardEl.querySelector('[data-lf="url"]')?.focus(); return; }
  if (act === 'add-link') return addLink(cardEl.querySelector('[data-lf="url"]').value, cardEl.querySelector('[data-lf="title"]').value);
  if (act === 'remove') { readDraft_(); s.draft.attachments.splice(+t.dataset.i, 1); renderCard(); return; }
  if (act === 'open-file') { const f = (s.d.attachments || []).find((a) => a.type === 'file'); if (f) openStoredFile(f); return; }
  if (act === 'open-att') { const f = (s.d.attachments || [])[+t.dataset.i]; if (f) openStoredFile(f); return; }
  if (act === 'play') {
    const v = (s.d.attachments || []).find((a) => a.type === 'video' && a.src); if (!v) return;
    const box = cardEl.querySelector('.ec-pv');
    if (box) box.outerHTML = `<div class="ec-pv is-playing"><video src="${esc(v.src)}" controls autoplay playsinline></video></div>`;
  }
});

cardEl.addEventListener('change', (e) => {
  const p = e.target.closest('[data-pick]');
  if (p && p.files[0]) { addFile(p.files[0], p.dataset.pick); p.value = ''; }
});

cardEl.addEventListener('input', (e) => { if (e.target.tagName === 'TEXTAREA') autosizeTA(e.target); });

cardEl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && e.target.dataset.f === 'newThought') { e.preventDefault(); addThoughtNow(); }
  if (e.key === 'Enter' && e.target.dataset.lf) { e.preventDefault(); addLink(cardEl.querySelector('[data-lf="url"]').value, cardEl.querySelector('[data-lf="title"]').value); }
  const sl = e.target.closest('.ec-sl.can');
  if (sl) {
    const dlt = { ArrowLeft: -0.1, ArrowRight: 0.1, ArrowDown: -0.1, ArrowUp: 0.1 }[e.key];
    if (dlt) { e.preventDefault(); cardState.pos[sl.dataset.axis] = clamp(cardState.pos[sl.dataset.axis] + dlt, -1, 1); paintDials(); }
  }
});

// dials (only live when the card was opened with Add an entry)
cardEl.addEventListener('pointerdown', (e) => {
  const sl = e.target.closest('.ec-sl.can'); if (!sl) return;
  e.preventDefault();
  try { sl.setPointerCapture(e.pointerId); } catch (err) { /* synthetic pointer */ }
  const go = (p) => { const r = sl.getBoundingClientRect(); cardState.pos[sl.dataset.axis] = clamp(((p.clientX - r.left) / r.width) * 2 - 1, -1, 1); paintDials(); };
  go(e);
  const up = () => { sl.removeEventListener('pointermove', go); sl.removeEventListener('pointerup', up); };
  sl.addEventListener('pointermove', go); sl.addEventListener('pointerup', up);
});

// drag and drop files onto the card while adding/editing; paste a link anywhere on it
cardEl.addEventListener('dragover', (e) => { if (cardState && cardState.mode !== 'view') { e.preventDefault(); cardEl.classList.add('is-dropping'); } });
cardEl.addEventListener('dragleave', (e) => { if (!cardEl.contains(e.relatedTarget)) cardEl.classList.remove('is-dropping'); });
cardEl.addEventListener('drop', (e) => {
  if (!cardState || cardState.mode === 'view') return;
  e.preventDefault(); cardEl.classList.remove('is-dropping');
  [...e.dataTransfer.files].forEach((f) => addFile(f));
  const url = e.dataTransfer.getData('text/uri-list') || '';
  if (!e.dataTransfer.files.length && url) addLink(url.split('\n')[0]);
});
cardEl.addEventListener('paste', (e) => {
  if (!cardState || cardState.mode === 'view' || e.target.closest('input, textarea')) return;
  const txt = e.clipboardData.getData('text'); if (/^https?:\/\//i.test(txt.trim())) { e.preventDefault(); addLink(txt.trim()); }
});

// Load published entries (entries.json) unless this browser has a draft.
(async function loadData() {
  if (REMOTE) {
    // unlocked: read the freshest entries straight from the repo (the public
    // site lags a minute behind), unless a change here hasn't been published yet
    let dirty = false; try { dirty = localStorage.getItem(DIRTY_STORE) === '1'; } catch (e) { /* ignore */ }
    const draft = dirty ? readDraft() : null;
    if (Array.isArray(draft)) { DATA = draft; rebuild(); route(); schedulePublish(); return; }
    try {
      const d = await loadRemoteEntries();
      if (Array.isArray(d)) { DATA = d; rebuild(); route(); return; }
    } catch (e) {
      if (e.status === 401 || e.status === 403) setStatus('Your GitHub key no longer works. Open ?unlock to add a new one.', true);
    }
  }
  // on your own computer (and not unlocked), in-progress edits live in the
  // browser; visitors always get exactly what's in entries.json
  const draft = IS_LOCAL && !REMOTE ? readDraft() : null;
  if (Array.isArray(draft)) { DATA = draft; rebuild(); route(); return; }
  try {
    const r = await fetch('entries.json', { cache: 'no-store' });
    if (r.ok) {
      const j = await r.json();
      if (Array.isArray(j)) { DATA = j; rebuild(); route(); }
    }
  } catch (e) { /* no entries.json yet: keep the built-in placeholders */ }
})();

// ---------- unlocking this device (?unlock) ----------
(function unlockPage() {
  if (!params.has('unlock')) return;
  const box = $('#unlock'), msg = $('#unlock-msg'), input = $('#unlock-key');
  box.hidden = false;
  if (REMOTE) {
    $('#unlock-form').hidden = true;
    $('#unlock-done').hidden = false;
    $('#unlock-lock').addEventListener('click', lockDevice);
    return;
  }
  input.focus();
  $('#unlock-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const key = input.value.trim();
    if (!key) { msg.textContent = 'Paste your GitHub key first.'; return; }
    msg.textContent = 'Checking…';
    try {
      const r = await fetch(`https://api.github.com/repos/${GH.owner}/${GH.repo}`, { headers: { Accept: 'application/vnd.github+json', Authorization: `Bearer ${key}` } });
      if (r.status === 401) { msg.textContent = 'GitHub doesn’t recognise that key. Check you copied all of it.'; return; }
      if (!r.ok) { msg.textContent = `That key can’t see ${GH.owner}/${GH.repo}. Give it access to that repository.`; return; }
      localStorage.setItem(KEY_STORE, key);
      location.href = location.pathname;
    } catch (err) { msg.textContent = 'Couldn’t reach GitHub. Check your connection and try again.'; }
  });
})();

// ------------------------------------------------------------------
// Start
// ------------------------------------------------------------------
window.addEventListener('resize', resize);
resize();
route();
requestAnimationFrame(step);

// Intro: hold the loader until most images are in (or 2.5s), then fade.
const t0 = performance.now();
(function waitForImages() {
  const imgs = cells.filter((c) => c.img);
  const ready = imgs.filter((c) => c.ready).length / Math.max(1, imgs.length);
  const elapsed = performance.now() - t0;
  if ((ready > 0.7 && elapsed > 900) || elapsed > 2500) {
    $('#loader').classList.add('is-done');
    startIntro();
  } else setTimeout(waitForImages, 120);
})();

// Like the reference: open zoomed out, then glide in to a random entry.
function startIntro() {
  if (app.dataset.view === 'entry') { cam.tz = ZOOM_LEVELS[1]; return; }
  if (!ENTRIES.length) { cam.tz = ZOOM_LEVELS[1]; return; }
  const e = ENTRIES[Math.floor(Math.random() * ENTRIES.length)];
  intro = { t0: performance.now(), fx: cam.x, fy: cam.y, fz: cam.z, tx: e.cx, ty: e.cy, tz: ZOOM_LEVELS[1] };
}
