// ============================================================
//  TELEGRAM BOT ASOSIY LOGIKASI
//  Farangiz uchun tug'ilgan kun arafasidagi soatlik xatlar boti
// ============================================================

const https = require("https");
const store = require("./store");
const messages = require("./bot-messages");

// Telegram Bot API orqali so'rov yuborish (hech qanday tashqi kutubxonasiz)
function apiCall(token, method, data = {}) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(data);
    const req = https.request(
      {
        hostname: "api.telegram.org",
        path: `/bot${token}/${method}`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(payload),
        },
      },
      (res) => {
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => {
          try {
            const parsed = JSON.parse(body);
            resolve(parsed);
          } catch (err) {
            reject(new Error(`JSON xatolik (${res.statusCode}): ${body}`));
          }
        });
      }
    );

    req.on("error", (err) => reject(err));
    req.write(payload);
    req.end();
  });
}

// Toshkent vaqti bo'yicha hisoblash
function getTashkentTime() {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Tashkent",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const parts = formatter.formatToParts(now);
  const p = {};
  for (const part of parts) p[part.type] = part.value;

  const iso = `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}:${p.second}+05:00`;
  return {
    date: new Date(iso),
    hour: parseInt(p.hour, 10),
    minute: parseInt(p.minute, 10),
    dateKey: `${p.year}-${p.month}-${p.day}`,
    hourKey: `${p.year}-${p.month}-${p.day}_${p.hour}`,
  };
}

// Qolgan vaqtni hisoblash
function getCountdown(unlockAt) {
  const target = new Date(unlockAt).getTime();
  const now = Date.now();
  const msLeft = target - now;

  if (msLeft <= 0) {
    return { isTime: true, totalHours: 0, text: "Vaqt bo'ldi! 🎉" };
  }

  const totalMinutes = Math.floor(msLeft / 60000);
  const totalHours = Math.floor(totalMinutes / 60);
  const days = Math.floor(totalHours / 24);
  const remHours = totalHours % 24;

  let text = "";
  if (days > 0) {
    text = `${days} kun, ${remHours} soat qoldi...`;
  } else if (totalHours > 0) {
    text = `${totalHours} soat qoldi...`;
  } else {
    text = `${totalMinutes} daqiqa qoldi...`;
  }

  return { isTime: false, totalHours, text };
}

// Bot klassi
class BirthdayBot {
  constructor(config) {
    this.config = config;
    this.token = null;
    this.adminChatId = null;
    this.isRunning = false;
    this.pollingOffset = 0;
    this.checkInterval = null;
  }

  async init() {
    const t = this.config.telegram || {};
    this.token = String(process.env.TELEGRAM_BOT_TOKEN || t.botToken || "").trim();
    this.adminChatId = String(process.env.TELEGRAM_CHAT_ID || t.chatId || "").trim();

    if (!this.token) {
      console.log("ℹ️  Telegram bot tokeni topilmadi (TELEGRAM_BOT_TOKEN o'rnatilmagan). Bot yoqilmadi.");
      return;
    }

    try {
      const me = await apiCall(this.token, "getMe");
      if (!me.ok) {
        console.error("❌ Telegram botga ulanib bo'lmadi:", me.description);
        return;
      }
      console.log(`🤖 Telegram bot ishga tushdi: @${me.result.username} (${me.result.first_name})`);
      this.isRunning = true;

      // Long polling siklini boshlash
      this.startPolling();

      // Har soatlik xabarlarni tekshirish taymeri (har daqiqada tekshiradi)
      this.checkInterval = setInterval(() => this.checkSchedule(), 60 * 1000);
      // Dastlabki tekshiruv
      setTimeout(() => this.checkSchedule(), 5000);
    } catch (err) {
      console.error("❌ Telegram botni ishga tushirishda xatolik:", err.message);
    }
  }

  // Telegramdan xabarlarni qabul qilish (Long Polling)
  async startPolling() {
    while (this.isRunning) {
      try {
        const res = await apiCall(this.token, "getUpdates", {
          offset: this.pollingOffset,
          timeout: 25,
          allowed_updates: ["message", "callback_query"],
        });

        if (res && res.ok && Array.isArray(res.result)) {
          for (const update of res.result) {
            this.pollingOffset = update.update_id + 1;
            await this.handleUpdate(update);
          }
        }
      } catch (err) {
        // Tarmoq xatosi bo'lsa 5 soniya kutib qayta urinish
        await new Promise((r) => setTimeout(r, 5000));
      }
    }
  }

  // Update larni qayta ishlash
  async handleUpdate(update) {
    if (update.message) {
      await this.handleMessage(update.message);
    } else if (update.callback_query) {
      await this.handleCallback(update.callback_query);
    }
  }

  // Xabarlarni ko'rib chiqish
  async handleMessage(msg) {
    const chatId = String(msg.chat.id);
    const text = (msg.text || "").trim();
    const isAdmin = this.adminChatId && chatId === this.adminChatId;

    // Admin buyruqlari
    if (isAdmin) {
      if (text.startsWith("/start") || text === "/help") {
        return this.sendAdminHelp(chatId);
      }
      if (text === "/stats") {
        return this.sendAdminStats(chatId);
      }
      if (text.startsWith("/send ")) {
        const customText = text.replace("/send ", "").trim();
        return this.sendManualMessage(chatId, customText);
      }
      if (text === "/pause") {
        await store.setBotState("isPaused", true);
        return this.sendMessage(chatId, "⏸️ Botning avtomatik xat yuborishi to'xtatildi.");
      }
      if (text === "/resume") {
        await store.setBotState("isPaused", false);
        return this.sendMessage(chatId, "▶️ Botning avtomatik xat yuborishi davom ettirildi.");
      }
      if (text === "/next") {
        return this.sendNextLetter(true);
      }
      if (text === "/test_final") {
        return this.sendFinalCelebration(chatId);
      }
      if (text === "/test_start") {
        const unlockAt = this.config.unlockAt || "2026-11-26T00:00:00+05:00";
        const countdown = getCountdown(unlockAt);
        const welcome =
          `[TEST — Farangizga boradigan birinchi xat]:\n\n` +
          `Assalomu alaykum, Farangiz! ❤️\n\n` +
          `Ushbu bot sening tug'ilgan kuning arafasida maxsus sen uchun yaratildi. ` +
          `Katta bayraminggacha (26-noyabr 00:00) har soatda bu yerda senga atalgan samimiy xatlar kelib turadi.\n\n` +
          `⏳ **${countdown.text}**\n\n` +
          `O'zingni ehtiyot qil va har bir soatda keladigan xabarlarni tabassum bilan kutib ol! ✨`;
        return this.sendMessage(chatId, welcome);
      }
      if (text === "/test_letter") {
        const unlockAt = this.config.unlockAt || "2026-11-26T00:00:00+05:00";
        const countdown = getCountdown(unlockAt);
        const sampleText = messages.dayMessages[0];
        const fullText = `[TEST — Soatlik xat namunasi]:\n\n⏳ **${countdown.text}**\n\n${sampleText}`;
        return this.sendMessage(chatId, fullText);
      }
    }

    // Agar /start buyrug'i bo'lsa (Farangiz yoki boshqa foydalanuvchi)
    if (text === "/start") {
      await this.handleUserStart(msg);
      return;
    }

    // Farangiz biror narsa yozsa yoki rasm/audio yuborsa
    await this.handleUserReply(msg);
  }

  // Farangiz /start bosganda
  async handleUserStart(msg) {
    const chatId = String(msg.chat.id);
    const firstName = msg.from.first_name || "Farangiz";
    const username = msg.from.username ? `@${msg.from.username}` : "foydalanuvchi";

    // Holatni saqlash
    await store.setBotState("targetChatId", chatId);
    await store.setBotState("targetUser", {
      id: msg.from.id,
      firstName,
      username,
      startedAt: new Date().toISOString(),
    });

    const unlockAt = this.config.unlockAt || "2026-11-26T00:00:00+05:00";
    const countdown = getCountdown(unlockAt);

    // Farangizga tabassum ulashuvchi birinchi xat
    const welcome =
      `Assalomu alaykum, ${firstName}! ❤️\n\n` +
      `Ushbu bot sening tug'ilgan kuning arafasida maxsus sen uchun yaratildi. ` +
      `Katta bayraminggacha (26-noyabr 00:00) har soatda bu yerda senga atalgan samimiy xatlar kelib turadi.\n\n` +
      `⏳ **${countdown.text}**\n\n` +
      `O'zingni ehtiyot qil va har bir soatda keladigan xabarlarni tabassum bilan kutib ol! ✨`;

    await this.sendMessage(chatId, welcome);

    // Adminga xabar berish
    if (this.adminChatId) {
      await this.sendMessage(
        this.adminChatId,
        `🔔 **Ajoyib yangilik!**\n\n${firstName} (${username}) botni ishga tushirdi! (/start bosdi).\n` +
          `Chat ID: \`${chatId}\`\nEndi unga har soatda xatlar avtomatik yuboriladi.`
      );
    }

    // Birinchi xatni ham yuborib qo'yish
    await this.sendHourlyMessage(chatId, true);
  }

  // Farangiz xat yozganda yoki savolga javob berganda
  async handleUserReply(msg) {
    const chatId = String(msg.chat.id);
    const text = msg.text || (msg.photo ? "[Surat yubordi]" : msg.voice ? "[Ovozli xabar]" : "[Media]");
    const firstName = msg.from.first_name || "Farangiz";

    // Saytning ichki arxiviga ham saqlab qo'yamiz
    await store.addEntry({
      type: "bot_message",
      text: `${firstName}: ${text}`,
      at: new Date().toISOString(),
      ip: `telegram:${chatId}`,
    });

    // Farangizga samimiy javob
    await this.sendMessage(chatId, "Xabaringiz yetkazildi ❤️ Har bir so'zingiz men uchun juda qadrli!");

    // Adminga darhol yetkazish
    if (this.adminChatId && chatId !== this.adminChatId) {
      await this.sendMessage(
        this.adminChatId,
        `💌 **Farangizdan yangi xabar!**\n\n"${text}"\n\n🕒 ${new Date().toLocaleTimeString("uz-UZ", { timeZone: "Asia/Tashkent" })}`
      );
    }
  }

  // Callback query (tugmachalar bosilganda)
  async handleCallback(cb) {
    const chatId = String(cb.message.chat.id);
    const data = cb.data;

    try {
      await apiCall(this.token, "answerCallbackQuery", {
        callback_query_id: cb.id,
        text: "Tanlovingiz qabul qilindi 😊",
      });
    } catch (_) {}

    await store.addEntry({
      type: "bot_callback",
      text: `Tugma tanlovi: ${data}`,
      at: new Date().toISOString(),
      ip: `telegram:${chatId}`,
    });

    if (this.adminChatId) {
      await this.sendMessage(this.adminChatId, `🎯 **Farangiz tugmani bosdi:**\n"${data}"`);
    }

    await this.sendMessage(chatId, `Tanlovingiz eslab qolindi: "${data}" ❤️`);
  }

  // Soatlik jadvalni tekshiruvchi funksiya
  async checkSchedule() {
    if (!this.isRunning) return;

    const isPaused = await store.getBotState("isPaused");
    if (isPaused) return;

    const targetChatId = await store.getBotState("targetChatId");
    if (!targetChatId) return;

    const tashkent = getTashkentTime();
    const lastHourKey = await store.getBotState("lastSentHourKey");

    // Agar bu soatda hali xat yuborilmagan bo'lsa
    if (lastHourKey !== tashkent.hourKey) {
      await this.sendHourlyMessage(targetChatId);
    }
  }

  // Soatlik xat yuborish
  async sendHourlyMessage(chatId, isInitial = false) {
    const tashkent = getTashkentTime();
    const unlockAt = this.config.unlockAt || "2026-11-26T00:00:00+05:00";
    const countdown = getCountdown(unlockAt);

    // 1. Agar vaqt bo'lgan bo'lsa (26-noyabr 00:00)
    if (countdown.isTime) {
      const celebrationSent = await store.getBotState("celebrationSent");
      if (!celebrationSent) {
        await this.sendFinalCelebration(chatId);
        await store.setBotState("celebrationSent", true);
        await store.setBotState("lastSentHourKey", tashkent.hourKey);
      }
      return;
    }

    // 2. Qaysi xabarni tanlash:
    let msgIndex = (await store.getBotState("msgIndex")) || 0;
    let chosenText = "";
    let replyMarkup = undefined;
    let silent = false;

    // Tungi soatlar (00:00 dan 07:00 gacha) — ovozsiz (uxlayotgan bo'lsa bezovta qilmaslik uchun)
    if (tashkent.hour >= 0 && tashkent.hour < 7) {
      silent = true;
      const nList = messages.nightMessages;
      chosenText = nList[msgIndex % nList.length];
    }
    // Kechki soatlar (19:00 dan 23:00 gacha)
    else if (tashkent.hour >= 19 && tashkent.hour <= 23) {
      const eList = messages.eveningMessages;
      chosenText = eList[msgIndex % eList.length];
    }
    // Kunduzgi soatlar (08:00 dan 18:00 gacha)
    else {
      // Har 4-xatda interaktiv savol qo'shish
      if (msgIndex % 4 === 3 && messages.interactiveQuestions.length > 0) {
        const qIdx = Math.floor(msgIndex / 4) % messages.interactiveQuestions.length;
        const q = messages.interactiveQuestions[qIdx];
        chosenText = q.text;
        replyMarkup = {
          inline_keyboard: q.options.map((opt) => [{ text: opt, callback_data: opt }]),
        };
      } else {
        const dList = messages.dayMessages;
        chosenText = dList[msgIndex % dList.length];
      }
    }

    // Agar so'nggi 3 soat qolgan bo'lsa, maxsus hayajonli xabarlar
    if (countdown.totalHours <= 3 && messages.finalHoursMessages[countdown.totalHours]) {
      chosenText = messages.finalHoursMessages[countdown.totalHours];
    }

    // Xabarni shakllantirish
    const fullText = `⏳ **${countdown.text}**\n\n${chosenText}`;

    await this.sendMessage(chatId, fullText, {
      silent,
      replyMarkup,
    });

    // Holatni yangilash
    await store.setBotState("msgIndex", msgIndex + 1);
    await store.setBotState("lastSentHourKey", tashkent.hourKey);
    await store.setBotState("lastSentAt", new Date().toISOString());
  }

  // 26-noyabr 00:00 da chiqadigan eng oxirgi katta sovg'a tabrigi
  async sendFinalCelebration(chatId) {
    const name = this.config.name || "Farangiz";
    const text = messages.getCelebrationMessage(name);
    const siteUrl = this.config.siteUrl || process.env.SITE_URL || "https://farangiz.onrender.com";

    const replyMarkup = {
      inline_keyboard: [
        [
          {
            text: "🎁 Sovg'ani ochish (Saytga kirish)",
            url: siteUrl,
          },
        ],
      ],
    };

    await this.sendMessage(chatId, text, { replyMarkup, silent: false });

    if (this.adminChatId && chatId !== this.adminChatId) {
      await this.sendMessage(
        this.adminChatId,
        `🎊 **Katta tabrik va sayt havolasi Farangizga yuborildi!**\nSayt manzili: ${siteUrl}`
      );
    }
  }

  // Admin qo'lda keyingi xatni yuborishi
  async sendNextLetter(adminTriggered = false) {
    const targetChatId = await store.getBotState("targetChatId");
    if (!targetChatId) {
      if (this.adminChatId) {
        await this.sendMessage(this.adminChatId, "⚠️ Farangiz hali botga /start bosmagan, Chat ID mavjud emas.");
      }
      return;
    }
    await this.sendHourlyMessage(targetChatId);
    if (adminTriggered && this.adminChatId) {
      await this.sendMessage(this.adminChatId, "✅ Keyingi xat Farangizga yuborildi!");
    }
  }

  // Admin qo'lda ixtiyoriy xabar yozishi
  async sendManualMessage(adminId, customText) {
    const targetChatId = await store.getBotState("targetChatId");
    if (!targetChatId) {
      return this.sendMessage(adminId, "⚠️ Farangiz hali botga kirmagan.");
    }
    await this.sendMessage(targetChatId, `💌 **Senga xat:**\n\n${customText}`);
    return this.sendMessage(adminId, `✅ Xabaringiz Farangizga yetkazildi:\n"${customText}"`);
  }

  // Admin statistikasi
  async sendAdminStats(chatId) {
    const state = await store.getAllBotState();
    const unlockAt = this.config.unlockAt || "2026-11-26T00:00:00+05:00";
    const countdown = getCountdown(unlockAt);
    const targetUser = state.targetUser || null;

    const msg =
      `📊 **Bot statistikasi:**\n\n` +
      `• Farangiz: ${targetUser ? `${targetUser.firstName} (${targetUser.username})` : "Hali /start bosmagan ❌"}\n` +
      `• Chat ID: \`${state.targetChatId || "Yo'q"}\`\n` +
      `• Holat: ${state.isPaused ? "⏸️ To'xtatilgan" : "▶️ Faol"}\n` +
      `• Yuborilgan xatlar soni: ${state.msgIndex || 0} ta\n` +
      `• Qolgan vaqt: ${countdown.text}\n` +
      `• Oxirgi xat vaqti: ${state.lastSentAt ? new Date(state.lastSentAt).toLocaleString("uz-UZ", { timeZone: "Asia/Tashkent" }) : "Yuborilmagan"}\n` +
      `• Sayt havolasi: ${this.config.siteUrl || "Mavjud emas"}`;

    await this.sendMessage(chatId, msg);
  }

  // Admin yordam xabari
  async sendAdminHelp(chatId) {
    const help =
      `👋 **Salom, Dudu! Bot boshqaruv panelidasiz.**\n\n` +
      `Sinov buyruqlari (o'zingizda tekshirish uchun):\n` +
      `• /test_start — Farangizga boradigan birinchi kirish xabarini ko'rish\n` +
      `• /test_letter — Soatlik xat qanday ko'rinishda kelishini ko'rish\n` +
      `• /test_final — 00:00 dagi tug'ilgan kun tabrigi va sayt tugmasini sinab ko'rish\n\n` +
      `Asosiy buyruqlar:\n` +
      `• /stats — Farangiz kirdimi, nechta xat ketdi va holatni ko'rish\n` +
      `• /send <matn> — Farangizga o'z nomingizdan to'g'ridan-to'g'ri xat yuborish\n` +
      `• /next — Navbatdagi soatlik xatni hoziroq yuborish (test qilish uchun)\n` +
      `• /pause — Botni vaqtincha to'xtatish\n` +
      `• /resume — Botni davom ettirish\n\n` +
      `💡 *Farangiz nima yozsa yoki qaysi tugmani bossa, sizga shu yerga keladi!*`;

    await this.sendMessage(chatId, help);
  }

  // Xabar jo'natish yordamchisi
  async sendMessage(chatId, text, options = {}) {
    if (!this.token || !chatId) return null;
    try {
      const data = {
        chat_id: chatId,
        text,
        disable_notification: options.silent === true,
      };
      if (options.replyMarkup) {
        data.reply_markup = options.replyMarkup;
      }
      return await apiCall(this.token, "sendMessage", data);
    } catch (err) {
      console.error(`Telegram xabar yuborishda xatolik (${chatId}):`, err.message);
      return null;
    }
  }

  stop() {
    this.isRunning = false;
    if (this.checkInterval) clearInterval(this.checkInterval);
  }
}

let activeBot = null;

function startBot(config) {
  if (activeBot) activeBot.stop();
  activeBot = new BirthdayBot(config);
  activeBot.init();
  return activeBot;
}

function checkSchedule() {
  if (activeBot) return activeBot.checkSchedule();
}

function isBotRunning() {
  return Boolean(activeBot && activeBot.isRunning);
}

module.exports = { BirthdayBot, startBot, checkSchedule, isBotRunning };
