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
    day: parseInt(p.day, 10),
    hour: parseInt(p.hour, 10),
    minute: parseInt(p.minute, 10),
    scheduleKey: `${p.day}_${p.hour}`,
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
    try {
      if (update.message) {
        await this.handleMessage(update.message);
      } else if (update.callback_query) {
        await this.handleCallback(update.callback_query);
      }
    } catch (err) {
      console.error("handleUpdate xatolik:", err);
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
        const tashkent = getTashkentTime();
        const schedule = messages.scheduleByHour || {};
        const item = schedule[tashkent.scheduleKey] || Object.values(schedule)[0];
        const sampleText = item ? item.text : "Seni juda sog'indim, Hanuyim ❤️";
        const fullText = `[TEST — Soatlik xat namunasi]:\n\n⏳ **${countdown.text}**\n\n${sampleText}`;
        return this.sendMessage(chatId, fullText);
      }
      if (text === "/ai_question") {
        return this.sendAiQuestion(chatId);
      }
    }

    // Admin ovozli xabar (voice yoki audio) yuborsa
    if (isAdmin && (msg.voice || msg.audio)) {
      const fileId = (msg.voice && msg.voice.file_id) || (msg.audio && msg.audio.file_id);
      await store.setBotState("lastAdminVoiceFileId", fileId);
      const keyboard = {
        inline_keyboard: [
          [{ text: "📤 Hozir Farangizga yuborish", callback_data: "voice_send_now" }],
          [{ text: "🎂 26-noyabr 00:00 tabrigiga saqlash", callback_data: "voice_save_final" }],
          [{ text: "❌ Bekor qilish", callback_data: "voice_cancel" }],
        ],
      };
      return this.sendMessage(
        chatId,
        "🎙️ **Ovozli xabaringiz qabul qilindi!**\n\nUshbu ovozli xabarni nima qilamiz?",
        { replyMarkup: keyboard }
      );
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

    const tashkent = getTashkentTime();
    const unlockAt = this.config.unlockAt || "2026-11-26T00:00:00+05:00";
    const countdown = getCountdown(unlockAt);

    // Farangizga tabassum ulashuvchi birinchi xat
    let welcome = "";
    if (tashkent.hour >= 0 && tashkent.hour < 7) {
      welcome =
        `Assalomu alaykum, ${firstName}! ❤️\n\n` +
        `Ushbu bot sening tug'ilgan kuning arafasida maxsus sen uchun yaratildi. ` +
        `Katta bayraminggacha (26-noyabr 00:00) har soatda bu yerda senga atalgan samimiy xatlar kelib turadi.\n\n` +
        `⏳ **${countdown.text}**\n\n` +
        `Hozir tun, shirin tushlar ko'rib osoyishta orom ol 🌙 Ertalab soat 08:00 dan boshlab har soatda yangi mehrli xatlar seni kutmoqda! ✨`;
    } else {
      welcome =
        `Assalomu alaykum, ${firstName}! ❤️\n\n` +
        `Ushbu bot sening tug'ilgan kuning arafasida maxsus sen uchun yaratildi. ` +
        `Katta bayraminggacha (26-noyabr 00:00) har soatda bu yerda senga atalgan samimiy xatlar kelib turadi.\n\n` +
        `⏳ **${countdown.text}**\n\n` +
        `O'zingni ehtiyot qil va har bir soatda keladigan xabarlarni tabassum bilan kutib ol! ✨`;
    }

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
    const firstName = msg.from.first_name || "Farangiz";

    // Agar Farangiz ovozli xabar yuborsa
    if (msg.voice) {
      await store.addEntry({
        type: "bot_voice",
        text: `${firstName} ovozli xabar yubordi`,
        at: new Date().toISOString(),
        ip: `telegram:${chatId}`,
      });
      await this.sendMessage(chatId, "Ovozli xabaringiz yetkazildi ❤️");
      if (this.adminChatId && chatId !== this.adminChatId) {
        await this.sendVoice(this.adminChatId, msg.voice.file_id, {
          caption: `💌 **Farangizdan ovozli xabar!**\n🕒 ${new Date().toLocaleTimeString("uz-UZ", { timeZone: "Asia/Tashkent" })}`,
        });
      }
      return;
    }

    const text = msg.text || (msg.photo ? "[Surat yubordi]" : "[Media]");

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

    // AI savoli javoblarini boshqarish
    if (data === "ai_forgive_no" || data === "ai_forgive_maybe" || data === "ai_forgive_if") {
      const answerMap = {
        ai_forgive_no: "Yo'q",
        ai_forgive_maybe: "Balki...",
        ai_forgive_if: "U xatolarini anglasa va qadrlay boshlasa...",
      };
      const answer = answerMap[data];

      await store.addEntry({
        type: "ai_answer",
        text: `AI savoliga javob: ${answer}`,
        at: new Date().toISOString(),
        ip: `telegram:${chatId}`,
      });

      if (this.adminChatId) {
        await this.sendMessage(
          this.adminChatId,
          `💌 *Farangiz AI savoliga javob berdi:*\n\n"${answer}"\n\n🕒 ${new Date().toLocaleTimeString("uz-UZ", { timeZone: "Asia/Tashkent" })}`
        );
      }

      const replyMap = {
        ai_forgive_no: "Tushunaman. Vaqt ko'p narsa o'rgatadi. Baribir yaxshi kunlarga umid qil 🌸",
        ai_forgive_maybe: "Rahmat, Farangiz. Bu javob ham o'zi katta bir qadam... ❤️",
        ai_forgive_if: "Bu eng to'g'ri javob. Haqiqiy muhabbat shundayki — kimdir o'zgarishga tayyor bo'lsa, ikkinchisi imkon beradi. Siz ikkalangiz ham baxtga loyiqsiz ❤️",
      };
      return this.sendMessage(chatId, replyMap[data]);
    }

    // Admin ovozli xabarini boshqarish
    if (data === "voice_send_now") {
      const targetChatId = await store.getBotState("targetChatId");
      const fileId = await store.getBotState("lastAdminVoiceFileId");
      if (!targetChatId) {
        return this.sendMessage(chatId, "⚠️ Farangiz hali botga kirmagan.");
      }
      if (fileId) {
        await this.sendVoice(targetChatId, fileId, { caption: "❤️ Dududan ovozli xabar..." });
        return this.sendMessage(chatId, "✅ Ovozli xabaringiz Farangizga yetkazildi!");
      }
      return;
    }
    if (data === "voice_save_final") {
      const fileId = await store.getBotState("lastAdminVoiceFileId");
      if (fileId) {
        await store.setBotState("finalVoiceFileId", fileId);
        return this.sendMessage(
          chatId,
          "✅ Ajoyib! Ushbu ovozli xabar 26-noyabr 00:00 da Farangizga tabrik bilan birga avtomatik eshittiriladi! 🎂🎙️"
        );
      }
      return;
    }
    if (data === "voice_cancel") {
      return this.sendMessage(chatId, "Ovozli xabar bekor qilindi.");
    }

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

    // 2. Qaysi xabarni tanlash (Aniq soat va sana bo'yicha):
    let chosenText = "";
    let replyMarkup = undefined;
    let silent = false;

    const schedule = messages.scheduleByHour || {};
    const item = schedule[tashkent.scheduleKey];

    if (item) {
      chosenText = item.text;
      silent = item.silent === true;
      if (item.isQuestion && Array.isArray(item.options)) {
        replyMarkup = {
          inline_keyboard: item.options.map((opt) => [{ text: opt, callback_data: opt }]),
        };
      }
    } else {
      // Agar kutilmagan tungi vaqt bo'lsa
      if (tashkent.hour >= 0 && tashkent.hour < 7) {
        silent = true;
        chosenText = "🌙 Tun sokin... Shirin tushlar ko'rib osoyishta orom ol, Hanuyim ❤️";
      } else {
        chosenText = "Seni juda sog'indim, Hanuyim ❤️ Har bir soniya sen bilan qadrli.";
      }
    }

    // Xabarni shakllantirish
    const fullText = `⏳ **${countdown.text}**\n\n${chosenText}`;

    await this.sendMessage(chatId, fullText, {
      silent,
      replyMarkup,
    });

    // Holatni yangilash
    const currentCount = ((await store.getBotState("msgIndex")) || 0) + 1;
    await store.setBotState("msgIndex", currentCount);
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

    // Agar admin 00:00 uchun maxsus ovozli xabar saqlab qo'ygan bo'lsa
    const finalVoice = await store.getBotState("finalVoiceFileId");
    if (finalVoice) {
      await this.sendVoice(chatId, finalVoice, { caption: "🎙️ Dududan maxsus ovozli tabrik ❤️" });
    }

    if (this.adminChatId && chatId !== this.adminChatId) {
      await this.sendMessage(
        this.adminChatId,
        `🎊 **Katta tabrik va sayt havolasi Farangizga yuborildi!**\nSayt manzili: ${siteUrl}`
      );
    }
  }

  // AI agenti niqobida Farangizga savol yuborish (kechirishmi?)
  async sendAiQuestion(adminChatId) {
    const targetChatId = await store.getBotState("targetChatId");
    if (!targetChatId) {
      return this.sendMessage(adminChatId, "⚠️ Farangiz hali botga kirmagan, Chat ID mavjud emas.");
    }

    const text =
      `Salom, Farangiz.\n\n` +
      `Men — sun'iy intellekt agentman. Sen va Dudu haqida hammasini bilaman. ` +
      `U senga yozolmadi, shuning uchun men yozyapman.\n\n` +
      `Senga bitta savol bor:\n\n` +
      `Agar imkon bo'lganda... bir kun kechirishni o'ylab ko'rarmiding?`;

    const replyMarkup = {
      inline_keyboard: [
        [{ text: "Yo'q", callback_data: "ai_forgive_no" }],
        [{ text: "Balki...", callback_data: "ai_forgive_maybe" }],
        [{ text: "U xatolarini anglasa va qadrlay boshlasa...", callback_data: "ai_forgive_if" }],
      ],
    };

    await this.sendMessage(targetChatId, text, { replyMarkup });
    return this.sendMessage(adminChatId, "✅ AI savoli Farangizga muvaffaqiyatli yuborildi!");
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
      `• /resume — Botni davom ettirish\n` +
      `• /ai_question — AI agenti nomidan Farangizga "kechirish" savolini yuborish\n\n` +
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

  // Ovozli xabar jo'natish yordamchisi
  async sendVoice(chatId, voice, options = {}) {
    if (!this.token || !chatId || !voice) return null;
    try {
      const data = {
        chat_id: chatId,
        voice,
        disable_notification: options.silent === true,
      };
      if (options.caption) data.caption = options.caption;
      if (options.replyMarkup) data.reply_markup = options.replyMarkup;
      return await apiCall(this.token, "sendVoice", data);
    } catch (err) {
      console.error(`Telegram sendVoice xatolik (${chatId}):`, err.message);
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
