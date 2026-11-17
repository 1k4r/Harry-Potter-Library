import { fetchList } from './api.js';
import { CATS } from './config.js';
import { t, LANGS, getLang, setLang, applyI18n } from './i18n.js';
import { getUser, setUser, validName, getFavs, toggleFav } from './storage.js';
import { card, esc } from './render.js';

const $ = id => document.getElementById(id);
const S = { cat: 'characters', q: '', f1: '', f2: '', sort: '#', dir: 1, items: [] };
let req = 0; // mencegah response lama menimpa yang baru

const uniq = a => [...new Set(a)].sort((x, y) => String(x).localeCompare(String(y), getLang(), { numeric: true }));
const status = (m, err) => { $('status').textContent = m; $('status').className = err ? 'min-h-5 text-sm text-rose-400' : 'min-h-5 text-sm text-amber-100/50'; };
const opts = (el, arr, sel, label) => {
  el.innerHTML = `<option value="">${label}: ${t('all')}</option>` +
    arr.map(x => `<option ${x === sel ? 'selected' : ''}>${esc(x)}</option>`).join('');
};

function paint() {
  const c = CATS[S.cat], favs = getFavs(getUser())[S.cat];
  const o1 = uniq(S.items.map(c.f1));
  if (S.f1 && !o1.includes(S.f1)) S.f1 = '';
  const base = S.f1 ? S.items.filter(i => c.f1(i) === S.f1) : S.items;   // filter 1
  const o2 = uniq(base.map(c.f2));                                        // opsi filter 2 bergantung filter 1
  if (S.f2 && !o2.includes(S.f2)) S.f2 = '';
  const key = c.sorts[S.sort] || c.sorts['#'];
  const list = (S.f2 ? base.filter(i => c.f2(i) === S.f2) : base).sort((a, b) => {
    const x = key(a), y = key(b);
    return (typeof x === 'number' ? x - y : String(x).localeCompare(String(y), getLang())) * S.dir;
  });
  opts($('f1'), o1, S.f1, `${t('filter')} 1`);
  opts($('f2'), o2, S.f2, `${t('filter')} 2`);
  $('sort').innerHTML = Object.keys(c.sorts).map(k => `<option value="${k}" ${k === S.sort ? 'selected' : ''}>${t('sort')}: ${t(k)}</option>`).join('');
  $('dir').textContent = S.dir > 0 ? '↑' : '↓';
  $('grid').innerHTML = list.map(i => card(S.cat, i, favs.includes(i.index))).join('');
  status(list.length ? `${list.length}` : t('empty'));
}

async function loadFavorites(id) {
  const user = getUser();
  if (!user) return status(t('noName'));
  const favs = getFavs(user), cats = Object.keys(CATS);
  const lists = await Promise.all(cats.map(c => fetchList(getLang(), c)));
  if (id !== req) return;
  let html = '';
  cats.forEach((c, n) => {
    const items = lists[n].filter(i => favs[c].includes(i.index));
    if (items.length) html += `<h2 class="display col-span-full mt-4 text-xl font-bold text-amber-300">${t(c)}</h2>` + items.map(i => card(c, i, true)).join('');
  });
  $('grid').innerHTML = html;
  status(html ? '' : t('empty'));
}

async function load() {
  const id = ++req, fav = S.cat === 'favorites';
  $('controls').classList.toggle('hidden', fav);
  document.querySelectorAll('#nav button').forEach(b => {
    b.className = `rounded-lg px-4 py-1.5 text-sm font-semibold transition ${b.dataset.cat === S.cat ? 'bg-gradient-to-b from-amber-300 to-amber-500 text-stone-900 shadow-[0_0_16px_rgba(251,191,36,.35)]' : 'text-amber-100/60 hover:bg-white/5 hover:text-amber-200'}`;
  });
  status(t('loading'));
  $('grid').innerHTML = '';
  try {
    if (fav) return await loadFavorites(id);
    const items = await fetchList(getLang(), S.cat, S.q.trim());
    if (id !== req) return;
    S.items = items;
    paint();
  } catch (e) {
    if (id === req) status(`${t('error')}: ${e.message}`, true);
  }
}

const hello = () => { $('hello').textContent = getUser() ? `${t('hello')}, ${getUser()}!` : ''; };

// --- Events ---
$('nav').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  Object.assign(S, { cat: b.dataset.cat, q: '', f1: '', f2: '', sort: '#', dir: 1 });
  $('q').value = '';
  load();
});
let timer;
$('q').addEventListener('input', e => { clearTimeout(timer); timer = setTimeout(() => { S.q = e.target.value; load(); }, 350); });
$('f1').addEventListener('change', e => { S.f1 = e.target.value; S.f2 = ''; paint(); });
$('f2').addEventListener('change', e => { S.f2 = e.target.value; paint(); });
$('sort').addEventListener('change', e => { S.sort = e.target.value; paint(); });
$('dir').addEventListener('click', () => { S.dir *= -1; paint(); });

$('lang').addEventListener('change', e => {
  setLang(e.target.value); applyI18n(); hello();
  S.f1 = S.f2 = ''; // nilai filter bergantung bahasa
  load();
});

$('nameForm').addEventListener('submit', e => {
  e.preventDefault();
  const n = $('name').value.trim();
  if (!validName(n)) return status('2–20: letters, numbers, space, _ -', true);
  try { setUser(n); } catch (err) { return status(`${t('error')}: ${err.message}`, true); }
  hello(); load();
});

$('grid').addEventListener('click', e => {
  const b = e.target.closest('.fav'); if (!b) return;
  const user = getUser();
  if (!user) return alert(t('noName'));
  try {
    const on = toggleFav(user, b.dataset.cat, +b.dataset.idx);
    b.classList.toggle('is-fav', on);
    if (S.cat === 'favorites' && !on) load();
  } catch (err) { status(`${t('error')}: ${err.message}`, true); }
});

// --- Init ---
$('lang').innerHTML = LANGS.map(([c, n]) => `<option value="${c}">${n}</option>`).join('');
$('lang').value = getLang();
$('name').value = getUser();
applyI18n(); hello(); load();

// --- Efek sihir: cahaya "Lumos" mengikuti kursor + partikel emas ---
const root = document.documentElement.style;
addEventListener('pointermove', e => { root.setProperty('--mx', e.clientX + 'px'); root.setProperty('--my', e.clientY + 'px'); });
for (let n = 0; n < 28; n++) {
  const sp = document.createElement('span');
  sp.className = 'spark';
  sp.style.cssText = `left:${Math.random() * 100}%;animation-duration:${8 + Math.random() * 12}s;animation-delay:-${Math.random() * 15}s;--sz:${1 + Math.random() * 3}px`;
  $('sparks').append(sp);
}
