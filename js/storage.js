// Favorit disimpan per nama user: hp_favs_<nama> = { characters:[], spells:[], houses:[], books:[] } (berisi index item)
const USER_KEY = 'hp_user', PREFIX = 'hp_favs_';
const EMPTY = () => ({ characters: [], spells: [], houses: [], books: [] });

export const getUser = () => { try { return localStorage.getItem(USER_KEY) || ''; } catch { return ''; } };
export const setUser = n => localStorage.setItem(USER_KEY, n);
export const validName = n => /^[\p{L}\p{N} _-]{2,20}$/u.test(n);

export function getFavs(user) {
  if (!user) return EMPTY();
  try { return { ...EMPTY(), ...JSON.parse(localStorage.getItem(PREFIX + user) || '{}') }; }
  catch { return EMPTY(); }
}

export function toggleFav(user, cat, index) {
  const favs = getFavs(user);
  const on = !favs[cat].includes(index);
  favs[cat] = on ? [...favs[cat], index] : favs[cat].filter(i => i !== index);
  localStorage.setItem(PREFIX + user, JSON.stringify(favs));
  return on;
}
