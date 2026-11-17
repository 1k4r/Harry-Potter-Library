// Konfigurasi tiap kategori: tampilan kartu, filter bertingkat (f1 -> f2), dan sort.
const v = x => (x === undefined || x === null || x === '' ? '—' : String(x));
const year = s => (String(s ?? '').match(/\d{4}/) || ['—'])[0];
const idx = i => i.index;

export const CATS = {
  characters: {
    name: i => i.fullName, img: i => i.image, sub: i => i.hogwartsHouse,
    meta: i => [i.nickname, i.interpretedBy, i.birthdate, i.children?.length ? `👶 ${i.children.join(', ')}` : ''],
    f1: i => v(i.hogwartsHouse), f2: i => v(i.interpretedBy),
    sorts: { name: i => i.fullName, date: i => +year(i.birthdate) || 0, '#': idx },
  },
  spells: {
    name: i => i.spell, sub: i => i.use, meta: () => [],
    f1: i => v(i.spell?.[0]?.toUpperCase()), f2: i => String((i.spell || '').split(' ').length),
    sorts: { name: i => i.spell, '#': idx },
  },
  houses: {
    name: i => `${i.emoji} ${i.house}`, sub: i => `👤 ${i.founder}`,
    meta: i => [`🐾 ${i.animal}`, `🎨 ${(i.colors || []).join(', ')}`],
    f1: i => v(i.animal), f2: i => v(i.founder),
    sorts: { name: i => i.house, '#': idx },
  },
  books: {
    name: i => i.title, img: i => i.cover, sub: i => i.releaseDate,
    meta: i => [i.originalTitle, `${i.pages} p`, i.description],
    f1: i => year(i.releaseDate),
    f2: i => (i.pages < 300 ? '< 300' : i.pages <= 500 ? '300–500' : '> 500'),
    sorts: { name: i => i.title, date: i => i.number, pages: i => i.pages, '#': idx },
  },
};
