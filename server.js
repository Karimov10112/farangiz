const express = require("express");
const path = require("path");
const fs = require("fs");
const https = require("https");

const app = express();
app.use(express.json({ limit: "50kb" }));

const CONTENT_DIR = path.join(__dirname, "content");
const store = require("./store");

// config.js har so'rovda qayta o'qiladi — o'zgartirsangiz, server qayta ishga tushirish shart emas
function loadConfig() {
  try {
    delete require.cache[require.resolve("./config")];
    return require("./config");
  } catch (err) {
    console.error("Config yuklashda xatolik:", err);
    return {
      name: "Azizam",
      unlockAt: new Date(Date.now() + 86400000).toISOString(),
      testMode: true,
      candles: 5,
      photos: [],
      letter: { greeting: "Salom,", paragraphs: [], signature: "" },
      finalMessage: { title: "Tabriklayman!", text: "Kechqurun ko'rishamiz ❤️" },
      music: null,
      allowReply: true,
      adminKey: "admin123",
      telegram: { enabled: false },
      port: 3000,
    };
  }
}

function isUnlocked(c) {
  if (c.testMode === true) return true;
  const unlockTime = new Date(c.unlockAt).getTime();
  if (isNaN(unlockTime)) return true;
  return Date.now() >= unlockTime;
}

// Telegramga xabar yuborish (ixtiyoriy)
// Token va chat ID avval server muhit o'zgaruvchilaridan (Render → Environment) olinadi,
// shunda ular GitHub'da ochiq turmaydi
function getTelegramSettings(cfg) {
  const t = cfg.telegram || {};
  const token = String(process.env.TELEGRAM_BOT_TOKEN || t.botToken || "").trim();
  const chatId = String(process.env.TELEGRAM_CHAT_ID || t.chatId || "").trim();
  const enabled = t.enabled !== false && token && chatId;
  return enabled ? { token, chatId } : null;
}

function getAdminKey(cfg) {
  return String(process.env.ADMIN_KEY || cfg.adminKey || "").trim();
}

function sendTelegramNotification(text, cfg, type = "reply") {
  const tg = getTelegramSettings(cfg);
  if (!tg) return;
  const token = tg.token;
  const chatId = tg.chatId;
  // parse_mode ishlatilmaydi: matnda * yoki _ bo'lsa, Telegram xabarni rad etardi
  const msg = `${EVENT_TYPES[type] || "💌 Javob"}\n\n"${text}"\n\n🕒 ${new Date().toLocaleString("uz-UZ", { timeZone: "Asia/Tashkent" })}`;

  const payload = JSON.stringify({
    chat_id: chatId,
    text: msg,
  });

  const req = https.request({
    hostname: "api.telegram.org",
    path: `/bot${token}/sendMessage`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(payload),
    },
  }, (res) => {
    let body = "";
    res.on("data", (d) => (body += d));
    res.on("end", () => {
      if (res.statusCode !== 200) {
        console.error("Telegram javobi:", res.statusCode, body);
      }
    });
  });

  req.on("error", (err) => {
    console.error("Telegramga yuborishda xatolik:", err.message);
  });

  req.write(payload);
  req.end();
}

// Holat: qolgan vaqt (server vaqti bo'yicha — telefon soatini o'zgartirib aldab bo'lmaydi)
app.get("/api/status", (req, res) => {
  const c = loadConfig();
  const unlockTime = new Date(c.unlockAt).getTime();
  res.json({
    serverNow: Date.now(),
    unlockAt: isNaN(unlockTime) ? Date.now() : unlockTime,
    unlocked: isUnlocked(c),
  });
});

// Kontent faqat vaqti kelganda beriladi — sahifa kodidan oldindan ko'rib bo'lmaydi
app.get("/api/content", (req, res) => {
  const c = loadConfig();
  if (!isUnlocked(c)) {
    return res.status(403).json({ error: "locked" });
  }

  const musicPath = c.music ? path.join(CONTENT_DIR, "music", c.music) : null;
  const hasMusic = musicPath && fs.existsSync(musicPath);

  res.json({
    name: c.name || "Azizam",
    candles: Math.max(1, Math.min(12, Number(c.candles) || 5)),
    photos: (c.photos || []).map((p) => ({
      url: "/media/photos/" + encodeURIComponent(p.file),
      text: p.text || "",
    })),
    letter: c.letter || { greeting: "Azizim,", paragraphs: [], signature: "" },
    finalMessage: c.finalMessage || { title: "Tabriklayman!", text: "❤️" },
    music: hasMusic ? "/media/music/" + encodeURIComponent(c.music) : null,
    allowReply: c.allowReply !== false,
    quiz: ((c.quiz && c.quiz.questions) || [])
      .filter((q) => q && q.q && Array.isArray(q.options) && q.options.length >= 2)
      .map((q) => ({
        q: String(q.q),
        options: q.options.map(String),
        answer: Math.max(0, Math.min(q.options.length - 1, Number(q.answer) || 0)),
        right: q.right ? String(q.right) : "",
      })),
    coupons: (c.coupons || [])
      .filter((k) => k && k.title)
      .map((k, i) => ({ id: "c" + i, emoji: k.emoji || "🎟", title: String(k.title), text: String(k.text || "") })),
    finalQuestion: c.finalQuestion && c.finalQuestion.question ? c.finalQuestion : null,
  });
});

// Rasmlar va musiqa ham faqat vaqti kelganda ochiladi
app.use("/media", (req, res, next) => {
  if (!isUnlocked(loadConfig())) {
    return res.status(403).send("Hali erta...");
  }
  next();
}, express.static(CONTENT_DIR, { maxAge: "1d" })); // qayta kirganda musiqa va rasmlar qayta yuklanmaydi

// Javob turlari (admin panel va Telegram uchun belgilar)
const EVENT_TYPES = {
  reply: "💌 Javob",
  wish: "🏮 Tilagi",
  answer: "❤️ Kelasanmi? savoliga javob",
  coupon: "🎟 Kupon ishlatdi",
  quiz: "🧠 Test natijasi",
};

async function saveEvent(req, res, type, text) {
  const entry = {
    type,
    text,
    at: new Date().toISOString(),
    ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress || "noma'lum",
  };

  // 1) Telegramga (sozlangan bo'lsa)
  sendTelegramNotification(text, loadConfig(), type);
  // 2) Server loglariga (Render → Logs)
  console.log("💌 YANGI JAVOB [" + type + "]:", JSON.stringify(entry));
  // 3) Bazaga (DATABASE_URL bo'lsa) yoki faylga. Xato bo'lsa ham, u xato ko'rmasin
  await store.addEntry(entry);

  res.json({ ok: true });
}

// Uning javobi
app.post("/api/reply", (req, res) => {
  const c = loadConfig();
  if (!c.allowReply || !isUnlocked(c)) {
    return res.status(403).json({ error: "forbidden" });
  }
  const text = String((req.body && req.body.text) || "").trim().slice(0, 2000);
  if (!text) {
    return res.status(400).json({ error: "empty" });
  }
  saveEvent(req, res, "reply", text);
});

// Boshqa harakatlari: tilak, "Ha" javobi, kupon, test natijasi
app.post("/api/event", (req, res) => {
  const c = loadConfig();
  if (!isUnlocked(c)) {
    return res.status(403).json({ error: "forbidden" });
  }
  const type = String((req.body && req.body.type) || "");
  if (!EVENT_TYPES[type] || type === "reply") {
    return res.status(400).json({ error: "bad_type" });
  }
  const text = String((req.body && req.body.text) || "").trim().slice(0, 500);
  if (!text) {
    return res.status(400).json({ error: "empty" });
  }
  saveEvent(req, res, type, text);
});

// Javoblarni ko'rish: /admin/replies?key=PAROL
app.get("/admin/replies", async (req, res) => {
  const c = loadConfig();
  const adminKey = getAdminKey(c);
  if (!adminKey || req.query.key !== adminKey) {
    return res.status(401).send(`
      <!doctype html>
      <meta charset="utf-8">
      <title>Kirish taqiqlangan</title>
      <body style="background:#07051a;color:#ff8fb8;font-family:sans-serif;text-align:center;padding:50px;">
        <h2>🔒 Parol noto'g'ri</h2>
        <p style="color:#aaa;">To'g'ri parolni kiriting.</p>
      </body>
    `);
  }

  const list = await store.listEntries();

  const esc = (s) => String(s).replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[ch]));

  const reversed = [...list].reverse();
  const items = reversed.length
    ? reversed.map((r, i) => `
      <div class="card">
        <div class="card-header">
          <span class="badge">#${reversed.length - i} · ${esc(EVENT_TYPES[r.type || "reply"] || "💌 Javob")}</span>
          <span class="time">${new Date(r.at).toLocaleString("uz-UZ", { timeZone: "Asia/Tashkent" })}</span>
        </div>
        <div class="text">${esc(r.text)}</div>
      </div>
    `).join("")
    : `<div class="empty">Hozircha hech qanday javob kelmadi...</div>`;

  res.send(`<!doctype html>
<html lang="uz">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>💌 Javoblar paneli</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background: #0a071e;
      color: #f0f0f5;
      padding: 24px 16px;
      min-height: 100vh;
    }
    .container {
      max-width: 640px;
      margin: 0 auto;
    }
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    h1 {
      font-size: 1.5rem;
      color: #ffd98a;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .refresh-btn {
      background: rgba(255, 143, 184, 0.2);
      border: 1px solid rgba(255, 143, 184, 0.5);
      color: #ffd98a;
      padding: 8px 16px;
      border-radius: 20px;
      cursor: pointer;
      font-size: 0.9rem;
      text-decoration: none;
      transition: all 0.2s;
    }
    .refresh-btn:hover {
      background: rgba(255, 143, 184, 0.35);
    }
    .count-info {
      font-size: 0.9rem;
      color: #aaa;
      margin-bottom: 16px;
    }
    .store-ok, .store-warn {
      font-size: 0.85rem;
      padding: 10px 14px;
      border-radius: 10px;
      margin-bottom: 16px;
    }
    .store-ok { background: rgba(80, 200, 120, 0.12); color: #8fe3a8; }
    .store-warn { background: rgba(255, 107, 139, 0.12); color: #ff9db3; }
    .card {
      background: #191436;
      border: 1px solid rgba(255, 217, 138, 0.15);
      border-radius: 14px;
      padding: 16px;
      margin-bottom: 16px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    }
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      font-size: 0.85rem;
    }
    .badge {
      background: rgba(255, 217, 138, 0.2);
      color: #ffd98a;
      font-weight: 600;
      padding: 2px 8px;
      border-radius: 10px;
    }
    .time {
      color: #ff8fb8;
      font-size: 0.8rem;
    }
    .text {
      white-space: pre-wrap;
      font-size: 1.05rem;
      line-height: 1.5;
      color: #ffffff;
      word-break: break-word;
    }
    .empty {
      text-align: center;
      padding: 50px 20px;
      color: #888;
      font-size: 1.1rem;
      background: #140f2d;
      border-radius: 14px;
      border: 1px dashed rgba(255, 255, 255, 0.1);
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>💌 Javoblar</h1>
      <a href="?key=${esc(req.query.key)}" class="refresh-btn">🔄 Yangilash</a>
    </header>
    <div class="count-info">Jami xabarlar soni: <strong>${list.length}</strong></div>
    ${store.storageName() === "database"
      ? `<div class="store-ok">🗄️ Javoblar bazada doimiy saqlanmoqda</div>`
      : `<div class="store-warn">⚠️ Javoblar vaqtinchalik faylda — server qayta yonganda o'chib ketadi. Render'da DATABASE_URL ni sozlang (README).</div>`}
    ${items}
  </div>
</body>
</html>`);
});

// Statik frontend fayllar
app.use(express.static(path.join(__dirname, "public")));

const port = process.env.PORT || loadConfig().port || 3000;
app.listen(port, () => console.log(`✨ Sayt ishlayapti: http://localhost:${port}`));
