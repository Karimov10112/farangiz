// ============================================================
//  TELEGRAM BOT: tug'ilgan kungacha har soatda bitta xat,
//  26-noyabr 00:00 da — tabrik va sayt havolasi.
//
//  Sozlash (Render → Environment):
//    BIRTHDAY_BOT_TOKEN — @BotFather bergan token
//  Bot o'zi webhook'ni sozlaydi (RENDER_EXTERNAL_URL bo'yicha).
//  Server uxlab qolmasligi uchun cron-job.org dan har 5 daqiqada /cron/tick ni chaqiring.
//
//  Siz (admin): botga  /admin PAROL  yozing (PAROL — adminKey yoki ADMIN_KEY).
//  Keyin: /stats, /send matn, /pause, /resume, /preview, /test_final
// ============================================================
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const store = require("./store");

const STATE_KEY = "bot_state";
const API_BASE = process.env.TELEGRAM_API_BASE || "https://api.telegram.org";
const HOUR = 3600 * 1000;

let getConfig = () => ({});
let busy = false;
let finalTimer = null;
let lastMinuteTimer = null;

function token() {
  return String(process.env.BIRTHDAY_BOT_TOKEN || "").trim();
}

function enabled() {
  const c = getConfig();
  return !!(token() && c.bot && c.bot.enabled !== false);
}

function messages() {
  delete require.cache[require.resolve("./bot-messages")];
  return require("./bot-messages");
}

function webhookSecret() {
  return crypto.createHash("sha256").update("farangiz-bot:" + token()).digest("hex").slice(0, 40);
}

function unlockTime() {
  const t = new Date(getConfig().unlockAt).getTime();
  return isNaN(t) ? null : t;
}

function siteUrl() {
  const c = getConfig();
  return (c.bot && c.bot.siteUrl) || process.env.RENDER_EXTERNAL_URL || "";
}

// Toshkent vaqti bo'yicha soat (0–23)
function tashkentHour(ts) {
  return new Date(ts + 5 * HOUR).getUTCHours();
}

const esc = (s) => String(s).replace(/[&<>]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[ch]));

/* ---------- Telegram API ---------- */
async function tg(method, body) {
  const res = await fetch(`${API_BASE}/bot${token()}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!data.ok) throw new Error(`${method}: ${data.description || res.status}`);
  return data.result;
}

async function tgPhoto(chatId, file, caption, extra = {}) {
  const fd = new FormData();
  fd.append("chat_id", String(chatId));
  fd.append("caption", caption);
  fd.append("parse_mode", "HTML");
  for (const [k, v] of Object.entries(extra)) fd.append(k, typeof v === "string" ? v : JSON.stringify(v));
  fd.append("photo", new Blob([fs.readFileSync(file)]), path.basename(file));
  const res = await fetch(`${API_BASE}/bot${token()}/sendPhoto`, { method: "POST", body: fd });
  const data = await res.json().catch(() => ({}));
  if (!data.ok) throw new Error(`sendPhoto: ${data.description || res.status}`);
  return data.result;
}

/* ---------- Holat ---------- */
async function loadState() {
  return (await store.kvGet(STATE_KEY)) || {};
}

async function saveState(st) {
  await store.kvSet(STATE_KEY, st);
}

async function notifyAdmin(st, text) {
  if (!st.adminChat) return;
  try {
    await tg("sendMessage", { chat_id: st.adminChat, text });
  } catch (err) {
    console.error("Adminga yuborib bo'lmadi:", err.message);
  }
}

/* ---------- Qaysi soatda qaysi xat ---------- */
function pickMessage(st, hoursLeft, slotTs) {
  const m = messages();
  const hour = tashkentHour(slotTs);
  const daysLeft = Math.floor(hoursLeft / 24);
  st.counters = st.counters || { day: 0, night: 0 };

  if (m.specials[hoursLeft]) return { msg: m.specials[hoursLeft], silent: false };
  if (hour === 8) return { msg: m.mornings[Math.min(daysLeft, m.mornings.length - 1)], silent: false };
  if (hour === 23) return { msg: m.goodnights[Math.min(daysLeft, m.goodnights.length - 1)], silent: false };
  if (hour < 7) {
    const msg = m.night[st.counters.night++ % m.night.length];
    const c = getConfig();
    return { msg, silent: !(c.bot && c.bot.silentNight === false) };
  }
  return { msg: m.day[st.counters.day++ % m.day.length], silent: false };
}

async function sendBotMessage(chatId, msg, hoursLeft, silent, tag) {
  const header = hoursLeft != null ? `⏳ <b>${hoursLeft} soat qoldi</b>\n\n` : "";
  const opts = { disable_notification: !!silent };
  if (typeof msg === "string") {
    return tg("sendMessage", { chat_id: chatId, text: header + esc(msg), parse_mode: "HTML", ...opts });
  }
  if (msg.buttons) {
    opts.reply_markup = {
      inline_keyboard: msg.buttons.map((b, i) => [{ text: b[0], callback_data: `b:${tag}:${i}` }]),
    };
  }
  if (msg.photo) {
    const file = path.join(__dirname, "content", "photos", msg.photo);
    if (fs.existsSync(file)) return tgPhoto(chatId, file, header + esc(msg.text || ""), opts);
  }
  return tg("sendMessage", { chat_id: chatId, text: header + esc(msg.text || ""), parse_mode: "HTML", ...opts });
}

async function sendFinal(chatId) {
  const m = messages();
  const url = siteUrl();
  const body = { chat_id: chatId, text: m.final };
  if (/^https:\/\//.test(url)) {
    body.reply_markup = { inline_keyboard: [[{ text: m.finalButton, url }]] };
  } else if (url) {
    body.text += `\n\n${url}`;
  }
  return tg("sendMessage", body);
}

/* ---------- Har daqiqa (va cron) tekshiruv ---------- */
async function tick() {
  if (!enabled() || busy) return;
  busy = true;
  try {
    const st = await loadState();
    const unlock = unlockTime();
    if (!st.herChat || st.paused || !unlock) return;
    const now = Date.now();

    // Tabrik
    if (now >= unlock) {
      if (!st.finalSent) {
        await sendFinal(st.herChat);
        st.finalSent = true;
        await saveState(st);
        await notifyAdmin(st, "🎉 00:00 — tabrik va sayt havolasi unga yuborildi!");
      }
      return;
    }

    // Oxirgi daqiqalar: aniq vaqtga taymer (server cron tufayli uyg'oq turadi)
    const left = unlock - now;
    if (left < 6 * 60 * 1000 && !finalTimer) {
      finalTimer = setTimeout(() => { finalTimer = null; tick(); }, left + 300);
      if (left > 61 * 1000 && !st.lastMinuteSent && !lastMinuteTimer) {
        lastMinuteTimer = setTimeout(async () => {
          lastMinuteTimer = null;
          const s2 = await loadState();
          if (s2.herChat && !s2.lastMinuteSent && !s2.paused) {
            await tg("sendMessage", { chat_id: s2.herChat, text: messages().lastMinute }).catch(() => {});
            s2.lastMinuteSent = true;
            await saveState(s2);
          }
        }, left - 60 * 1000);
      }
    }

    // Har soat boshida bitta xat (o'tkazib yuborilgan soatlar ketma-ket yuborilmaydi)
    const hoursLeft = Math.ceil(left / HOUR);
    if (st.lastSlot == null || hoursLeft < st.lastSlot) {
      const slotTs = unlock - hoursLeft * HOUR;
      const { msg, silent } = pickMessage(st, hoursLeft, slotTs);
      st.lastSlot = hoursLeft;
      st.sent = (st.sent || 0) + 1;
      await saveState(st); // avval saqlaymiz — ikki marta yuborilmasin
      await sendBotMessage(st.herChat, msg, hoursLeft, silent, hoursLeft);
    }
  } catch (err) {
    console.error("Bot tick xatoligi:", err.message);
  } finally {
    busy = false;
  }
}

/* ---------- Telegram'dan kelgan xabarlar ---------- */
async function handleUpdate(update, saveEvent) {
  const st = await loadState();
  const c = getConfig();
  const startKey = String((c.bot && c.bot.startKey) || "").trim();
  const adminKey = String(process.env.ADMIN_KEY || c.adminKey || "").trim();

  // Javob tugmasi bosildi
  if (update.callback_query) {
    const q = update.callback_query;
    const idx = Number(String(q.data || "").split(":")[2]);
    let answer = "❤️";
    let label = "";
    const m = messages();
    const msg = findButtonMessage([...m.day, ...m.night], q.message);
    if (msg && msg.buttons[idx]) {
      label = msg.buttons[idx][0];
      answer = msg.buttons[idx][1];
    }
    await tg("answerCallbackQuery", { callback_query_id: q.id }).catch(() => {});
    if (q.message) {
      await tg("editMessageReplyMarkup", { chat_id: q.message.chat.id, message_id: q.message.message_id, reply_markup: { inline_keyboard: [] } }).catch(() => {});
      await tg("sendMessage", { chat_id: q.message.chat.id, text: answer }).catch(() => {});
    }
    if (String(q.from.id) !== String(st.adminChat)) {
      const question = (q.message && (q.message.text || q.message.caption || "")).replace(/^⏳.*\n\n/, "");
      await notifyAdmin(st, `🔘 U tanladi: ${label || "?"}\n(savol: ${question})`);
      if (saveEvent) saveEvent("bot", `🔘 ${question} → ${label}`);
    }
    return;
  }

  const msg = update.message;
  if (!msg || !msg.chat) return;
  const chatId = msg.chat.id;
  const text = String(msg.text || "").trim();

  // Admin ro'yxatdan o'tishi
  if (text.startsWith("/admin")) {
    if (adminKey && text.split(/\s+/)[1] === adminKey) {
      st.adminChat = chatId;
      await saveState(st);
      await tg("sendMessage", { chat_id: chatId, text: "✅ Siz admin bo'ldingiz.\n\n/stats — holat\n/send matn — unga xat yuborish\n/pause, /resume — to'xtatish / davom ettirish\n/preview — keyingi xatni o'zingizga ko'rish\n/test_final — 00:00 dagi tabrikni o'zingizga yuborish" });
    } else {
      await tg("sendMessage", { chat_id: chatId, text: "Parol noto'g'ri." });
    }
    return;
  }

  // Admin buyruqlari
  if (String(chatId) === String(st.adminChat) && text.startsWith("/") && !text.startsWith("/start")) {
    const [cmd, ...rest] = text.split(" ");
    const unlock = unlockTime();
    const hoursLeft = unlock ? Math.max(0, Math.ceil((unlock - Date.now()) / HOUR)) : "?";
    if (cmd === "/stats") {
      await tg("sendMessage", {
        chat_id: chatId,
        text: `📊 Holat\n\nU /start bosganmi: ${st.herChat ? "ha ✅" : "hali yo'q ⏳"}\nYuborilgan xatlar: ${st.sent || 0}\nTug'ilgan kungacha: ${hoursLeft} soat\nTo'xtatilganmi: ${st.paused ? "ha" : "yo'q"}\nTabrik yuborilganmi: ${st.finalSent ? "ha" : "yo'q"}`,
      });
    } else if (cmd === "/send") {
      const t = rest.join(" ").trim();
      if (!st.herChat) await tg("sendMessage", { chat_id: chatId, text: "U hali /start bosmagan." });
      else if (t) {
        await tg("sendMessage", { chat_id: st.herChat, text: t });
        await tg("sendMessage", { chat_id: chatId, text: "✅ Yuborildi." });
      }
    } else if (cmd === "/pause" || cmd === "/resume") {
      st.paused = cmd === "/pause";
      await saveState(st);
      await tg("sendMessage", { chat_id: chatId, text: st.paused ? "⏸ To'xtatildi." : "▶️ Davom etyapti." });
    } else if (cmd === "/preview") {
      const copy = JSON.parse(JSON.stringify(st));
      const h = typeof hoursLeft === "number" ? Math.max(1, hoursLeft - 1) : 1;
      const { msg: pm } = pickMessage(copy, h, unlock - h * HOUR);
      await sendBotMessage(chatId, pm, h, false, h);
    } else if (cmd === "/test_final") {
      await sendFinal(chatId);
    }
    return;
  }

  // U /start bosdi
  if (text.startsWith("/start")) {
    const payload = text.split(/\s+/)[1] || "";
    if (startKey && payload !== startKey && String(chatId) !== String(st.herChat)) {
      await tg("sendMessage", { chat_id: chatId, text: "Bu bot faqat bitta inson uchun 💌" });
      return;
    }
    const first = !st.herChat;
    st.herChat = chatId;
    const unlock = unlockTime();
    const hoursLeft = unlock ? Math.max(0, Math.ceil((unlock - Date.now()) / HOUR)) : 0;
    if (first) st.lastSlot = hoursLeft; // keyingi xat — keyingi soat boshida
    await saveState(st);
    if (unlock && Date.now() >= unlock) {
      await sendFinal(chatId);
    } else {
      await tg("sendMessage", { chat_id: chatId, text: messages().welcome.replace("{hours}", String(hoursLeft)) });
    }
    if (first) await notifyAdmin(st, `🎉 U botni ishga tushirdi! (${msg.from && msg.from.first_name ? msg.from.first_name : ""})`);
    return;
  }

  // Uning oddiy xabari — sizga yetkaziladi
  if (String(chatId) === String(st.herChat)) {
    const what = text || (msg.sticker ? `[stiker ${msg.sticker.emoji || ""}]` : msg.photo ? "[rasm]" : msg.voice ? "[ovozli xabar]" : "[xabar]");
    if (st.adminChat) {
      await tg("forwardMessage", { chat_id: st.adminChat, from_chat_id: chatId, message_id: msg.message_id }).catch(() =>
        notifyAdmin(st, `💬 U yozdi: ${what}`)
      );
    }
    if (saveEvent) saveEvent("bot", what);
    await tg("sendMessage", { chat_id: chatId, text: "❤️" }).catch(() => {});
  }
}

// Tugmali xatni matni bo'yicha topamiz (xatlar ro'yxati o'zgarsa ham ishlaydi)
function findButtonMessage(all, tgMsg) {
  if (!tgMsg) return null;
  const body = String(tgMsg.text || tgMsg.caption || "").replace(/^⏳.*\n\n/, "").trim();
  return all.find((x) => x && x.buttons && String(x.text || "").trim() === body) || null;
}

/* ---------- Ulash ---------- */
function mount(app, express, loadConfig, saveEvent) {
  getConfig = loadConfig;

  app.post("/tg/webhook", express.json({ limit: "1mb" }), async (req, res) => {
    if (req.get("X-Telegram-Bot-Api-Secret-Token") !== webhookSecret()) return res.sendStatus(401);
    res.sendStatus(200);
    try {
      await handleUpdate(req.body || {}, saveEvent);
    } catch (err) {
      console.error("Bot xabarini qayta ishlashda xatolik:", err.message);
    }
  });

  // cron-job.org shu manzilni har 5 daqiqada chaqiradi: server uyg'oq turadi va xatlar o'z vaqtida ketadi
  app.get("/cron/tick", async (req, res) => {
    await tick();
    res.json({ ok: true, bot: enabled() });
  });
}

async function start() {
  if (!enabled()) {
    console.log("🤖 Telegram bot o'chiq (BIRTHDAY_BOT_TOKEN yo'q)");
    return;
  }
  const base = (process.env.RENDER_EXTERNAL_URL || (getConfig().bot && getConfig().bot.siteUrl) || "").replace(/\/$/, "");
  if (base.startsWith("https://")) {
    try {
      await tg("setWebhook", {
        url: `${base}/tg/webhook`,
        secret_token: webhookSecret(),
        allowed_updates: ["message", "callback_query"],
      });
      console.log("🤖 Telegram bot ulandi:", `${base}/tg/webhook`);
    } catch (err) {
      console.error("Webhook sozlanmadi:", err.message);
    }
  } else {
    console.log("🤖 Bot: RENDER_EXTERNAL_URL yo'q — webhook sozlanmadi");
  }
  setInterval(tick, 60 * 1000);
  tick();
}

module.exports = { mount, start, tick, handleUpdate, webhookSecret };
