import { CATS } from './config.js';

export const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const BOLT = '<svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M13 2 3 14h7l-1 8 10-12h-7z"/></svg>';

// Warna asrama (regex mencakup nama di 6 bahasa)
const HOUSES = [
  [/gr[iy]f|[ґг]риф/i, '#c8102e'],            // Gryffindor
  [/slyth|serpent|serpev|sonser|слизер/i, '#1f9d55'], // Slytherin
  [/raven|serdaigle|corvon|corvin|рейвен/i, '#3b6fd4'], // Ravenclaw
  [/huff|pouf|tasso|lufa|гафл/i, '#f2c230'],  // Hufflepuff
];
const accent = i => (HOUSES.find(([re]) => re.test(i.hogwartsHouse || i.house || '')) || [])[1];

export function card(cat, i, fav) {
  const c = CATS[cat], img = c.img?.(i), a = accent(i);
  return `<article class="card group flex flex-col" ${a ? `style="--accent:${a}"` : ''}>
    ${img ? `<div class="relative h-64 overflow-hidden bg-black/40">
      <img src="${esc(img)}" alt="" aria-hidden="true" class="absolute inset-0 h-full w-full scale-125 object-cover opacity-30 blur-2xl">
      <img src="${esc(img)}" alt="${esc(c.name(i))}" loading="lazy" onerror="this.parentNode.remove()" class="relative h-full w-full object-contain p-2 transition duration-300 group-hover:scale-105"></div>` : ''}
    <div class="space-y-1.5 p-4">
      <div class="flex items-start justify-between gap-2">
        <h3 class="display font-bold leading-snug text-amber-200">${esc(c.name(i))}</h3>
        <button data-cat="${cat}" data-idx="${i.index}" class="fav ${fav ? 'is-fav' : ''}" aria-label="favorite">${BOLT}</button>
      </div>
      <p class="text-amber-50/80">${esc(c.sub(i))}</p>
      ${c.meta(i).filter(Boolean).map(m => `<p class="line-clamp-3 text-sm text-amber-100/45">${esc(m)}</p>`).join('')}
    </div></article>`;
}
