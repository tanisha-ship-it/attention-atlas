const canvas = document.querySelector('#grid');
const ctx = canvas.getContext('2d');
const atlas = document.querySelector('#atlas');
const layer = document.querySelector('#artifacts');
const horizontalSlider = document.querySelector('#horizontal-position');
const verticalSlider = document.querySelector('#vertical-position');
const zoomSlider = document.querySelector('#zoom');
const indexPanel = document.querySelector('#index-panel');
const indexList = document.querySelector('#index-list');

const WORLD_LIMIT = 1800;
const GRID_SIZE = 110;
const state = {
  x: 0, y: 0, targetX: 0, targetY: 0,
  vx: 0, vy: 0, dragging: false,
  lastX: 0, lastY: 0, lastTime: 0,
  sliderMoving: false, zoom: 1
};

const artifacts = [
  { id: 1, type: 'text', x: -360, y: -230, title: 'Interfaces that feel like places', content: 'Interfaces that feel more like places than pages.' },
  { id: 2, type: 'image', x: -430, y: 245, title: 'Found color study', color: '#738fd0', mark: 'found image · 01' },
  { id: 3, type: 'text', x: 340, y: -250, title: 'Active note', content: 'What changes when attention is arranged spatially?' },
  { id: 4, type: 'image', x: 420, y: 250, title: 'Made fragment', color: '#54df52', mark: 'created image · 02' },
  { id: 5, type: 'text', x: -250, y: 790, title: 'Passing thought', content: 'A passing thought, kept before it disappears.' },
  { id: 6, type: 'image', x: 320, y: -920, title: 'Current focus', color: '#e6d55c', mark: 'active focus · 03' },
  { id: 7, type: 'text', x: 1050, y: 120, title: 'Small observation', content: 'The map is also a portrait of time spent looking.' },
  { id: 8, type: 'image', x: -1080, y: -140, title: 'Internet fragment', color: '#c95d58', mark: 'found fragment · 04' }
];

function makeArtifacts() {
  artifacts.forEach((item, index) => {
    const el = document.createElement('button');
    el.className = `artifact ${item.type}`;
    el.dataset.id = item.id;
    el.setAttribute('aria-label', item.title);
    if (item.type === 'text') el.textContent = item.content;
    else {
      el.style.setProperty('--swatch', item.color);
      el.dataset.mark = item.mark;
    }
    layer.appendChild(el);

    const li = document.createElement('li');
    const button = document.createElement('button');
    button.innerHTML = `<span class="index-number">${String(index + 1).padStart(2, '0')}</span><span class="index-title">${item.title}</span><span class="index-type">${item.type}</span>`;
    button.addEventListener('click', () => focusArtifact(item));
    li.appendChild(button);
    indexList.appendChild(li);
  });
}

function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = innerWidth * dpr;
  canvas.height = innerHeight * dpr;
  canvas.style.width = `${innerWidth}px`;
  canvas.style.height = `${innerHeight}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

// A gentle radial lens makes the center feel convex, like moving across a globe.
function project(worldX, worldY) {
  const dx = (worldX - state.x) * state.zoom;
  const dy = (worldY - state.y) * state.zoom;
  const radius = Math.hypot(dx, dy);
  const viewportRadius = Math.min(innerWidth, innerHeight) * .72;
  const bulge = 1 + .11 * Math.exp(-(radius * radius) / (viewportRadius * viewportRadius));
  return { x: innerWidth / 2 + dx * bulge, y: innerHeight / 2 + dy * bulge, scale: bulge };
}

function drawCurve(points) {
  ctx.beginPath();
  points.forEach((p, index) => index ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y));
  ctx.stroke();
}

function drawGrid() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  ctx.strokeStyle = 'rgba(0,0,0,.11)';
  ctx.lineWidth = 1;
  const spanX = innerWidth * 1.1 / state.zoom;
  const spanY = innerHeight * 1.1 / state.zoom;
  const minX = Math.floor((state.x - spanX) / GRID_SIZE) * GRID_SIZE;
  const maxX = Math.ceil((state.x + spanX) / GRID_SIZE) * GRID_SIZE;
  const minY = Math.floor((state.y - spanY) / GRID_SIZE) * GRID_SIZE;
  const maxY = Math.ceil((state.y + spanY) / GRID_SIZE) * GRID_SIZE;

  for (let x = minX; x <= maxX; x += GRID_SIZE) {
    const points = [];
    for (let y = minY; y <= maxY; y += 28) points.push(project(x, y));
    drawCurve(points);
  }
  for (let y = minY; y <= maxY; y += GRID_SIZE) {
    const points = [];
    for (let x = minX; x <= maxX; x += 28) points.push(project(x, y));
    drawCurve(points);
  }

  const origin = project(0, 0);
  ctx.strokeStyle = 'rgba(34,37,31,.42)';
  ctx.lineWidth = 1.2;
  drawCurve(Array.from({length: 90}, (_, i) => project(0, minY + i * (maxY - minY) / 89)));
  drawCurve(Array.from({length: 90}, (_, i) => project(minX + i * (maxX - minX) / 89, 0)));
  ctx.fillStyle = '#22251f';
  ctx.beginPath();
  ctx.arc(origin.x, origin.y, 3, 0, Math.PI * 2);
  ctx.fill();
}

function renderArtifacts() {
  document.querySelectorAll('.artifact').forEach((el) => {
    const item = artifacts.find((entry) => String(entry.id) === el.dataset.id);
    const p = project(item.x, item.y);
    const visible = p.x > -260 && p.x < innerWidth + 260 && p.y > -220 && p.y < innerHeight + 220;
    el.style.display = visible ? '' : 'none';
    el.style.transform = `translate(${p.x - el.offsetWidth / 2}px, ${p.y - el.offsetHeight / 2}px) rotate(${(item.id % 3 - 1) * 1.2}deg) scale(${Math.min(p.scale, 1.08)})`;
  });
}

function softLimit(value) {
  if (Math.abs(value) <= WORLD_LIMIT) return value;
  const sign = Math.sign(value);
  return sign * (WORLD_LIMIT + Math.sqrt(Math.abs(value) - WORLD_LIMIT) * 9);
}

function syncControls() {
  const nx = Math.round(state.x / WORLD_LIMIT * 100);
  const ny = Math.round(-state.y / WORLD_LIMIT * 100);
  if (!state.sliderMoving) {
    horizontalSlider.value = Math.max(-100, Math.min(100, nx));
    verticalSlider.value = Math.max(-100, Math.min(100, ny));
  }
}

function tick() {
  if (!state.dragging && !state.sliderMoving) {
    state.x += state.vx;
    state.y += state.vy;
    state.vx *= .92;
    state.vy *= .92;
    if (Math.abs(state.vx) < .02) state.vx = 0;
    if (Math.abs(state.vy) < .02) state.vy = 0;

    if (Math.abs(state.x) > WORLD_LIMIT) state.vx += (Math.sign(state.x) * WORLD_LIMIT - state.x) * .018;
    if (Math.abs(state.y) > WORLD_LIMIT) state.vy += (Math.sign(state.y) * WORLD_LIMIT - state.y) * .018;
  }
  drawGrid();
  renderArtifacts();
  syncControls();
  requestAnimationFrame(tick);
}

function startDrag(event) {
  if (event.target.closest('button, input, .index-panel')) return;
  state.dragging = true;
  state.lastX = event.clientX;
  state.lastY = event.clientY;
  state.lastTime = performance.now();
  state.vx = state.vy = 0;
  atlas.classList.add('dragging');
  atlas.setPointerCapture(event.pointerId);
}

function moveDrag(event) {
  if (!state.dragging) return;
  const now = performance.now();
  const dt = Math.max(8, now - state.lastTime);
  const dx = event.clientX - state.lastX;
  const dy = event.clientY - state.lastY;
  state.x = softLimit(state.x - dx);
  state.y = softLimit(state.y - dy);
  state.vx = -(dx / dt) * 12;
  state.vy = -(dy / dt) * 12;
  state.lastX = event.clientX;
  state.lastY = event.clientY;
  state.lastTime = now;
}

function endDrag() {
  state.dragging = false;
  atlas.classList.remove('dragging');
}

function animateTo(x, y) {
  const startX = state.x;
  const startY = state.y;
  const start = performance.now();
  state.vx = state.vy = 0;
  function step(now) {
    const t = Math.min(1, (now - start) / 650);
    const eased = 1 - Math.pow(1 - t, 4);
    state.x = startX + (x - startX) * eased;
    state.y = startY + (y - startY) * eased;
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function focusArtifact(item) {
  indexPanel.classList.remove('open');
  indexPanel.setAttribute('aria-hidden', 'true');
  animateTo(item.x, item.y);
}

function sliderInput() {
  state.sliderMoving = true;
  state.vx = state.vy = 0;
  state.x = Number(horizontalSlider.value) / 100 * WORLD_LIMIT;
  state.y = -Number(verticalSlider.value) / 100 * WORLD_LIMIT;
}

function sliderEnd() { state.sliderMoving = false; }

function setZoom(value) {
  state.zoom = Math.max(.65, Math.min(1.6, value));
  zoomSlider.value = Math.round(state.zoom * 100);
}

horizontalSlider.addEventListener('input', sliderInput);
verticalSlider.addEventListener('input', sliderInput);
horizontalSlider.addEventListener('change', sliderEnd);
verticalSlider.addEventListener('change', sliderEnd);
zoomSlider.addEventListener('input', () => setZoom(Number(zoomSlider.value) / 100));
document.querySelector('#zoom-out').addEventListener('click', () => setZoom(state.zoom - .15));
document.querySelector('#zoom-in').addEventListener('click', () => setZoom(state.zoom + .15));
atlas.addEventListener('pointerdown', startDrag);
atlas.addEventListener('pointermove', moveDrag);
atlas.addEventListener('pointerup', endDrag);
atlas.addEventListener('pointercancel', endDrag);
window.addEventListener('resize', resize);

document.querySelector('[data-view="index"]').addEventListener('click', () => {
  indexPanel.classList.add('open');
  indexPanel.setAttribute('aria-hidden', 'false');
});
document.querySelector('#close-index').addEventListener('click', () => {
  indexPanel.classList.remove('open');
  indexPanel.setAttribute('aria-hidden', 'true');
});
document.querySelector('#recenter').addEventListener('click', () => animateTo(0, 0));
document.querySelector('.wordmark').addEventListener('click', (event) => { event.preventDefault(); animateTo(0, 0); });

makeArtifacts();
resize();
tick();
