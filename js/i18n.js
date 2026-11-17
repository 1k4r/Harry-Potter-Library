const K = 'characters,spells,houses,books,favorites,search,sort,all,name_ph,save,loading,empty,error,filter,name,date,pages,hello,noName'.split(',');
const D = {
  en: 'Characters|Spells|Houses|Books|Favorites|Search…|Sort|All|Your name|Save|Loading…|No results|Error|Filter|Name|Date|Pages|Hello|Enter your name first',
  es: 'Personajes|Hechizos|Casas|Libros|Favoritos|Buscar…|Ordenar|Todos|Tu nombre|Guardar|Cargando…|Sin resultados|Error|Filtro|Nombre|Fecha|Páginas|Hola|Ingresa tu nombre primero',
  fr: 'Personnages|Sorts|Maisons|Livres|Favoris|Rechercher…|Trier|Tous|Votre nom|Enregistrer|Chargement…|Aucun résultat|Erreur|Filtre|Nom|Date|Pages|Bonjour|Entrez d\'abord votre nom',
  it: 'Personaggi|Incantesimi|Case|Libri|Preferiti|Cerca…|Ordina|Tutti|Il tuo nome|Salva|Caricamento…|Nessun risultato|Errore|Filtro|Nome|Data|Pagine|Ciao|Inserisci prima il tuo nome',
  pt: 'Personagens|Feitiços|Casas|Livros|Favoritos|Buscar…|Ordenar|Todos|Seu nome|Salvar|Carregando…|Sem resultados|Erro|Filtro|Nome|Data|Páginas|Olá|Digite seu nome primeiro',
  uk: 'Персонажі|Закляття|Будинки|Книги|Обране|Пошук…|Сортувати|Усі|Ваше ім\'я|Зберегти|Завантаження…|Немає результатів|Помилка|Фільтр|Назва|Дата|Сторінки|Привіт|Спочатку введіть ім\'я',
  id: 'Karakter|Mantra|Asrama|Buku|Favorit|Cari…|Urutkan|Semua|Namamu|Simpan|Memuat…|Tidak ada hasil|Galat|Filter|Nama|Tanggal|Halaman|Halo|Masukkan nama dulu',
};
for (const l in D) D[l] = D[l].split('|');

export const LANGS = [['en', 'English'], ['es', 'Español'], ['fr', 'Français'], ['it', 'Italiano'],
  ['pt', 'Português'], ['uk', 'Українська'], ['id', 'Indonesia']];

let lang = 'en';
try { const s = localStorage.getItem('hp_lang'); if (D[s]) lang = s; } catch {}

export const getLang = () => lang;
export function setLang(l) {
  if (!D[l]) return;
  lang = l;
  document.documentElement.lang = l;
  try { localStorage.setItem('hp_lang', l); } catch {}
}
export const t = k => { const i = K.indexOf(k); return i < 0 ? k : D[lang][i] ?? D.en[i]; };

export function applyI18n() {
  document.querySelectorAll('[data-i18n]').forEach(e => (e.textContent = t(e.dataset.i18n)));
  document.querySelectorAll('[data-ph]').forEach(e => (e.placeholder = t(e.dataset.ph)));
}
