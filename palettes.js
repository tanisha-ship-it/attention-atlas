// Background gradients for the atlas, top → bottom.
// Try one on the map with ?bg=<key>, e.g. index.html?bg=peach
window.PALETTES = {
  dusk:     { label: 'Dusk',          note: 'lavender, mauve, olive', stops: ['#9590a8', '#c18fa8', '#cd96ab', '#c09ba6', '#b09f8c', '#aaa264', '#a39f42'] },
  peach:    { label: 'Peach haze',    note: 'lilac into apricot and wheat',      stops: ['#a9a3c4', '#cfa6bb', '#e5ac9f', '#ecbc92', '#e6c98e', '#c9b96f'] },
  seaglass: { label: 'Sea glass',     note: 'blue-grey, mint, sand',             stops: ['#8ea3b0', '#9fb9b4', '#b7cbb4', '#d3d1ab', '#d6bf94', '#c3a07b'] },
  lilac:    { label: 'Lilac sky',     note: 'periwinkle to blush',               stops: ['#7f86b8', '#998fc9', '#b79bd0', '#d6a6c6', '#ebb9b9', '#f1cbaa'] },
  denim:    { label: 'Faded denim',   note: 'washed blue into warm paper',       stops: ['#6f7f9e', '#8696b2', '#a4aebf', '#c2bcb4', '#d4bc9c', '#d7b182'] },
  postcard: { label: 'Sunset postcard', note: 'plum, coral, marigold',           stops: ['#6d6290', '#9c7095', '#c77f8a', '#e2957a', '#e9ae6e', '#e6c46a'] },
  moss:     { label: 'Moss and rose', note: 'sage, khaki, dusty rose',           stops: ['#7d8b6c', '#99a07c', '#b4a385', '#c89f93', '#c08e95', '#a97f8e'] },
  butter:   { label: 'Butter',        note: 'light: cream, pink, lavender',      stops: ['#ece2b4', '#ecd2ae', '#e8c1b4', '#dbb6c6', '#c8b3d6', '#b4b0d8'] },
  matcha:   { label: 'Matcha milk',   note: 'light: pale green to oat',          stops: ['#c9d3b0', '#d3d6b4', '#dfd8bc', '#e6d4c0', '#e2c9c0', '#d7bdc0'] },
  cornflower: { label: 'Cornflower',  note: 'blue: cornflower to soft lilac',    stops: ['#6f8fc9', '#7e9ad0', '#93a7d6', '#a9b2da', '#bdb9d9', '#cfc1d6'] },
  powder:   { label: 'Powder blue',   note: 'blue, light: sky to milk (current)',          stops: ['#9fbbe0', '#adc6e3', '#bdd0e4', '#cdd8e3', '#dcdfe0', '#e6e3dc'] },
  hour:     { label: 'Blue hour',     note: 'blue: deep blue into peach glow',   stops: ['#3f5f9e', '#5873ac', '#7b8cba', '#a3a2c0', '#c9b2b4', '#e2c0a2'] },
  cyanotype: { label: 'Cyanotype',    note: 'blue: prussian print, paper edge',  stops: ['#28497d', '#335a8f', '#4b72a3', '#6f8fb6', '#a3b6cc', '#d9dcd6'], dark: true },
  lagoon:   { label: 'Lagoon',        note: 'blue: teal-blue to warm sand',      stops: ['#4f86a6', '#6698b0', '#86abb5', '#a9bcb5', '#c9c6ad', '#dccb9f'] },
  airmail:  { label: 'Airmail',       note: 'blue + red: faded envelope',        stops: ['#7a98c4', '#97aacb', '#b7bccd', '#d2c3c4', '#d9aeae', '#c98f91'] },
  midnight: { label: 'Midnight film', note: 'dark: ink, plum, ember',            stops: ['#2e3350', '#463f63', '#634a6c', '#8a5a6e', '#ae7068', '#c9925f'], dark: true },
};

window.paletteGradient = (key) => {
  const p = window.PALETTES[key];
  if (!p) return null;
  const n = p.stops.length - 1;
  return `linear-gradient(180deg, ${p.stops.map((c, i) => `${c} ${Math.round((i / n) * 100)}%`).join(', ')})`;
};
