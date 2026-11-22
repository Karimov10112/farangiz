// ============================================================
//  JAVOBLARNI SAQLASH
//  DATABASE_URL berilgan bo'lsa — Postgres bazasi (doimiy saqlanadi).
//  Berilmagan bo'lsa — data/replies.json fayli (bepul Render'da server
//  qayta yonganda o'chib ketadi).
// ============================================================
const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "data", "replies.json");
const BOT_STATE_FILE = path.join(__dirname, "data", "bot_state.json");

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
    .query(`
      CREATE TABLE IF NOT EXISTS replies (
        id   SERIAL PRIMARY KEY,
        type TEXT NOT NULL DEFAULT 'reply',
        text TEXT NOT NULL,
        at   TIMESTAMPTZ NOT NULL DEFAULT now(),
        ip   TEXT
      );
      CREATE TABLE IF NOT EXISTS bot_state (
        key   TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        at    TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `)
    .then(() => console.log("🗄️  Javoblar va bot holati ma'lumotlar bazasida saqlanadi (doimiy)"))
    .catch((err) => console.error("Baza jadvalini yaratishda xatolik:", err.message));
} else {
  console.log("⚠️  DATABASE_URL yo'q — ma'lumotlar vaqtinchalik fayllarda saqlanadi");
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

function readBotStateFile() {
  try {
    if (fs.existsSync(BOT_STATE_FILE)) return JSON.parse(fs.readFileSync(BOT_STATE_FILE, "utf8"));
  } catch (_) {}
  return {};
}

function writeBotStateFile(obj) {
  try {
    fs.mkdirSync(path.dirname(BOT_STATE_FILE), { recursive: true });
    fs.writeFileSync(BOT_STATE_FILE, JSON.stringify(obj, null, 2), "utf8");
  } catch (err) {
    console.error("Bot holatini faylga yozishda xatolik:", err.message);
  }
}

async function getBotState(key) {
  if (!pool) {
    const data = readBotStateFile();
    return data[key] !== undefined ? data[key] : null;
  }
  try {
    await ready;
    const { rows } = await pool.query("SELECT value FROM bot_state WHERE key = $1", [key]);
    if (rows.length > 0) {
      try {
        return JSON.parse(rows[0].value);
      } catch (_) {
        return rows[0].value;
      }
    }
    const fallback = readBotStateFile();
    return fallback[key] !== undefined ? fallback[key] : null;
  } catch (err) {
    console.error("Bot holatini bazadan o'qishda xatolik:", err.message);
    const data = readBotStateFile();
    return data[key] !== undefined ? data[key] : null;
  }
}

async function setBotState(key, value) {
  const fileData = readBotStateFile();
  fileData[key] = value;
  writeBotStateFile(fileData);

  if (!pool) return true;
  try {
    await ready;
    const strVal = typeof value === "string" ? value : JSON.stringify(value);
    await pool.query(
      `INSERT INTO bot_state (key, value, at) VALUES ($1, $2, now())
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, at = now()`,
      [key, strVal]
    );
    return true;
  } catch (err) {
    console.error("Bot holatini bazaga yozishda xatolik:", err.message);
    return false;
  }
}

async function getAllBotState() {
  const fallback = readBotStateFile();
  if (!pool) return fallback;
  try {
    await ready;
    const { rows } = await pool.query("SELECT key, value FROM bot_state");
    const result = { ...fallback };
    for (const r of rows) {
      try {
        result[r.key] = JSON.parse(r.value);
      } catch (_) {
        result[r.key] = r.value;
      }
    }
    return result;
  } catch (err) {
    return fallback;
  }
}

const storageName = () => (pool ? "database" : "file");

module.exports = {
  addEntry,
  listEntries,
  clearAll,
  storageName,
  getBotState,
  setBotState,
  getAllBotState,
};
