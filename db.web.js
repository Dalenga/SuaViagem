// Navegador: usa localStorage (SQLite no navegador exige configurações que o GitHub Pages não permite).
const KEY = 'rota_entries';
const read = () => {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
};
const write = (list) => {
  try { localStorage.setItem(KEY, JSON.stringify(list)); }
  catch { throw new Error('Armazenamento do navegador cheio. Apague registros antigos.'); }
};
export async function listEntries() { return read(); }
export async function addEntry(e) { write([{ ...e, syncStatus: 'pendente' }, ...read()]); }
export async function removeEntry(id) { write(read().filter((x) => x.id !== id)); }
