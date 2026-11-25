// ============================================================
//  JAVOBLARNI SAQLASH
//  DATABASE_URL berilgan bo'lsa — Postgres bazasi (doimiy saqlanadi).
//  Berilmagan bo'lsa — data/replies.json fayli (bepul Render'da server
//  qayta yonganda o'chib ketadi).
// ============================================================
const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "data", "replies.json");

let pool = null;
let ready = Promise.resolve();

if (process.env.DATABASE_URL) {
  const { Pool } = require("pg");
  const url = process.env.DATABASE_URL;
  // Render'ning ichki manzili (dpg-xxxx-a) SSL talab qilmaydi, tashqi manzil (…render.com) esa talab qiladi
  let host = "";
  try { host = new URL(url).hostname; } catch (_) {}
  const needsSsl = host.includes(".") && host !== "localhost" && host !== "127.0.0.1";

  pool = new Pool({
    connectionString: url,
    ssl: needsSsl ? { rejectUnauthorized: false } : false,
    max: 3,
  });
  pool.on("error", (err) => console.error("Baza ulanishida xatolik:", err.message));

  ready = pool
    .query(`CREATE TABLE IF NOT EXISTS replies (
      id   SERIAL PRIMARY KEY,
      type TEXT NOT NULL DEFAULT 'reply',
      text TEXT NOT NULL,
      at   TIMESTAMPTZ NOT NULL DEFAULT now(),
      ip   TEXT
    )`)
    .then(() => console.log("🗄️  Javoblar ma'lumotlar bazasida saqlanadi (doimiy)"))
    .catch((err) => console.error("Baza jadvalini yaratishda xatolik:", err.message));
} else {
  console.log("⚠️  DATABASE_URL yo'q — javoblar vaqtinchalik faylda saqlanadi");
}

function readFileList() {
  try {
    if (fs.existsSync(DATA_FILE)) return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  } catch (_) {}
  return [];
}

function writeFileList(list) {
  try {
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2), "utf8");
  } catch (err) {
    console.error("Javobni faylga yozishda xatolik:", err.message);
  }
}

// Yangi javobni saqlash. Bazaga yozib bo'lmasa, true/false qaytaradi (u baribir xato ko'rmaydi)
async function addEntry(entry) {
  if (!pool) {
    const list = readFileList();
    list.push(entry);
    writeFileList(list);
    return true;
  }
  try {
    await ready;
    await pool.query("INSERT INTO replies (type, text, at, ip) VALUES ($1, $2, $3, $4)", [
      entry.type,
      entry.text,
      entry.at,
      entry.ip,
    ]);
    return true;
  } catch (err) {
    console.error("Javobni bazaga yozishda xatolik:", err.message);
    // Zaxira: hech bo'lmasa faylga yozib qo'yamiz
    const list = readFileList();
    list.push(entry);
    writeFileList(list);
    return false;
  }
}

// Barcha javoblar (eskidan yangiga)
async function listEntries() {
  if (!pool) return readFileList();
  try {
    await ready;
    const { rows } = await pool.query("SELECT type, text, at, ip FROM replies ORDER BY id");
    // Bazaga yozilmay faylga tushib qolganlari ham ko'rinsin
    const fallback = readFileList();
    return rows
      .map((r) => ({ type: r.type, text: r.text, at: new Date(r.at).toISOString(), ip: r.ip }))
      .concat(fallback)
      .sort((a, b) => new Date(a.at) - new Date(b.at));
  } catch (err) {
    console.error("Javoblarni bazadan o'qishda xatolik:", err.message);
    return readFileList();
  }
}

// Hammasini o'chirish (admin paneldagi "Tozalash" tugmasi uchun)
async function clearAll() {
  writeFileList([]);
  if (!pool) return;
  await ready;
  await pool.query("DELETE FROM replies");
}

/* ---------- Kalit-qiymat (Telegram bot holati uchun) ---------- */
const KV_FILE = path.join(__dirname, "data", "kv.json");
let kvReady = null;

function kvTable() {
  if (!pool) return Promise.resolve();
  if (!kvReady) {
    kvReady = ready.then(() =>
      pool.query("CREATE TABLE IF NOT EXISTS kv (k TEXT PRIMARY KEY, v TEXT NOT NULL)")
    );
  }
  return kvReady;
}

function readKvFile() {
  try {
    if (fs.existsSync(KV_FILE)) return JSON.parse(fs.readFileSync(KV_FILE, "utf8"));
  } catch (_) {}
  return {};
}

async function kvGet(key) {
  if (pool) {
    try {
      await kvTable();
      const { rows } = await pool.query("SELECT v FROM kv WHERE k = $1", [key]);
      return rows[0] ? JSON.parse(rows[0].v) : null;
    } catch (err) {
      console.error("kv o'qishda xatolik:", err.message);
    }
  }
  const all = readKvFile();
  return key in all ? all[key] : null;
}

async function kvSet(key, value) {
  if (pool) {
    try {
      await kvTable();
      await pool.query(
        "INSERT INTO kv (k, v) VALUES ($1, $2) ON CONFLICT (k) DO UPDATE SET v = EXCLUDED.v",
        [key, JSON.stringify(value)]
      );
      return;
    } catch (err) {
      console.error("kv yozishda xatolik:", err.message);
    }
  }
  const all = readKvFile();
  all[key] = value;
  try {
    fs.mkdirSync(path.dirname(KV_FILE), { recursive: true });
    fs.writeFileSync(KV_FILE, JSON.stringify(all, null, 2), "utf8");
  } catch (err) {
    console.error("kv faylga yozishda xatolik:", err.message);
  }
}

const storageName = () => (pool ? "database" : "file");

module.exports = { addEntry, listEntries, clearAll, storageName, kvGet, kvSet };
