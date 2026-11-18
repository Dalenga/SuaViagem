// Celular (Android/iOS): SQLite de verdade, a "fonte da verdade" do app offline.
import * as SQLite from 'expo-sqlite';

let dbPromise;
const db = () =>
  dbPromise ||
  (dbPromise = SQLite.openDatabaseAsync('rota.db').then(async (d) => {
    await d.execAsync(`CREATE TABLE IF NOT EXISTS entries (
      id TEXT PRIMARY KEY, text TEXT, photo TEXT, lat REAL, lon REAL,
      createdAt TEXT, syncStatus TEXT DEFAULT 'pendente')`);
    return d;
  }));

export async function listEntries() {
  return (await db()).getAllAsync('SELECT * FROM entries ORDER BY createdAt DESC');
}
export async function addEntry(e) {
  await (await db()).runAsync(
    'INSERT INTO entries (id, text, photo, lat, lon, createdAt) VALUES (?, ?, ?, ?, ?, ?)',
    [e.id, e.text, e.photo, e.lat, e.lon, e.createdAt]
  );
}
export async function removeEntry(id) {
  await (await db()).runAsync('DELETE FROM entries WHERE id = ?', [id]);
}
