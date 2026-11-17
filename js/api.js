const BASE = 'https://potterapi-fedeperin.vercel.app';
export const API_LANGS = ['en', 'es', 'fr', 'it', 'pt', 'uk'];
const cache = new Map();

// Bahasa di luar API (mis. "id") otomatis memakai data /en
export async function fetchList(lang, resource, search = '') {
  const l = API_LANGS.includes(lang) ? lang : 'en';
  const url = `${BASE}/${l}/${resource}${search ? `?search=${encodeURIComponent(search)}` : ''}`;
  if (cache.has(url)) return cache.get(url);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (!Array.isArray(data)) throw new Error('Invalid response');
  cache.set(url, data);
  return data;
}
