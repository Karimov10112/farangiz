# 🎂 Tug'ilgan kun ssyurpriz sayti

Ushbu loyiha tug'ilgan kun uchun maxsus yaratilgan ikki tomonlama interaktiv saytdir:
1. **U ko'radigan qism** (sehrli, emotsional va interaktiv sahifalar).
2. **Siz boshqaradigan qism** (`config.js` orqali to'liq nazorat va `/admin/replies` javoblar paneli).

---

## 🚀 Qanday ishga tushiriladi (Kompyuterda sinash)

```bash
npm install
npm start
```
Brauzerda oching: **http://localhost:3000**

---

## ⚙️ Siz boshqaradigan qism (`config.js`)

Barcha sozlamalar faqat bitta faylda — `config.js`:

| Sozlama | Nima qiladi |
|---|---|
| `name` | Uning ismi (kirishda, sarlavhada va osmonda yulduzlardan yig'iladi) |
| `unlockAt` | Sayt ochiladigan aniq sana va vaqt (Toshkent vaqti: +05:00) |
| `testMode` | `true` bo'lsa darhol ochiladi (sinash uchun), `false` bo'lsa faqat vaqtida |
| `candles` | Tortdagi shamlar soni (1 dan 10 gacha) |
| `photos` | Rasmlar va har biriga bitta jumla. Nechta qo'shsangiz, shuncha yulduz bo'ladi |
| `letter` | Konvert ichidagi xat: murojaat (`greeting`), abzaslar (`paragraphs`) va imzo (`signature`) |
| `finalMessage` | Oxirgi sahifadagi katta sarlavha va matn |
| `music` | Fon musiqasi fayli nomi (`content/music` papkasiga tashlanadi). Kerak bo'lmasa `null` |
| `allowReply` | U oxirida sizga javob yoza oladimi (`true` / `false`) |
| `adminKey` | Javoblarni o'qish sahifasi paroli (internetda `ADMIN_KEY` muhit o'zgaruvchisi ishlatiladi) |
| `telegram` | U javob yozganda xabar Telegramingizga keladi (token serverda saqlanadi, pastga qarang) |

> **Eslatma:** `config.js` faylini o'zgartirgandan keyin sahifani yangilash (F5) kifoya. Serverni qayta ishga tushirish shart emas!

---

## 💌 U yozgan javoblarni o'qish (Admin paneli)

U sayt oxirida sizga javob yozib yuborganida, xabarni quyidagi manzilda o'qiysiz:
👉 `http://localhost:3000/admin/replies?key=PAROL`
*(PAROL o'rniga `config.js` dagi `adminKey` qiymati kiritiladi).*

---

## 🌟 Sayt bosqichlari (U ko'radigan qism)

1. **Qulflangan ekran (00:00 gacha):**
   - Oy va yulduzli qorong'i osmon, *“Hali erta... kutib tur ✨”* yozuvi.
   - 00:00 gacha kun, soat, daqiqa va soniya bo'yicha teskari sanoq.
   - Vaqt **server soati** bo'yicha hisoblanadi. Telefon soatini surib qo'ysa ham ochilmaydi.
   - Sahifa ochiq tursa, 00:00 bo'lganda o'zi avtomatik ochiladi (yangilash shart emas).
   - Vaqti kelmaguncha hech qanday rasm, xat yoki ism serverdan yuborilmaydi (sahifa kodidan qidirib ham topib bo'lmaydi).

2. **Sovg'a qutisi:**
   - Tebranib turgan 🎁 va *“Bos”* yozuvi.
   - Bosganda salyut otiladi, konfetti yog'iladi va musiqa sekin balandlab boshlanadi.
   - Uning ismi oltin-pushti jilvada katta bo'lib chiqadi, tepasida *“Tug'ilgan kuning bilan”* yozuvi turadi.
   - 5 soniya salyut davom etadi, so'ng *“Davom etish →”* tugmasi chiqadi.

3. **Tort va shamlar:**
   - 3 qavatli tort va lipillab turgan shamlar.
   - *“🎤 Puflashni boshlash”* bosilib mikrofonga ruxsat berilsa, telefonga puflaganda shamlar qiyshayadi va birma-bir o'chadi. O'chgan shamdan tutun chiqadi, telefon esa biroz titraydi.
   - Mikrofonsiz shamlarga barmoq bilan bosib ham o'chirish mumkin.
   - Hamma shamlar o'chgach, *“Tilaging albatta ushalsin ✨”* yozuvi, salyut va konfetti chiqadi.

4. **Yulduzli osmon:**
   - Osmonda bir nechta katta, porlab turgan ⭐ yulduzlar. Har bir rasm uchun bittadan yulduz.
   - Yulduzga bosganda polaroid kartochkasi tushadi: tepada uning rasmi, pastda qo'lyozma shriftida siz yozgan jumla.
   - Tepada `3 / 6 — yulduzlarga bos` kabi hisoblagich turadi. Ko'rilgan yulduz xiralashadi.
   - Hamma yulduzlar ochilgach, *“✨ Osmonga qara”* tugmasi chiqadi.
   - Bosganda osmondagi yuzlab yulduzlar uchib kelib, **uning ismi shakliga yig'iladi**!

5. **Konvert va xat:**
   - Havoda suzib turgan, yurak muhrli pushti konvert.
   - Bosganda qopqoq ochiladi, konvert pastga tushib ketadi va o'rniga daftarning chiziqli qog'ozi ko'tariladi.
   - Xat qo'lda yozilayotgandek, harfma-harf paydo bo'ladi (tinish belgilarida o'ylanib to'xtaydi).
   - Oxirida o'ng tomonda sizning imzoyingiz yoziladi.
   - Qog'ozga bosilsa, xat bir zumda to'liq chiqadi.

6. **Final:**
   - Katta oltin yozuv: *“Bu hali hammasi emas...”*.
   - So'ng: *“Kechqurun ko'rishamiz ❤️”*.
   - Yana salyut otiladi.
   - Pastda javob yozish oynasi: *“Menga bir nima desang...”*. U yozib yuborsa, *“Yetib keldi ❤️”* yozuvi chiqadi va konfetti yog'iladi.

---

## ⚠️ Internetga joylashdan oldin (Eslatmalar)

1. `config.js` faylida:
   - `testMode: false` qiling.
   - `unlockAt` sanasi va vaqtini to'g'ri belgilang.
   - `adminKey` ni o'zingiz biladigan maxfiy parolga o'zgartiring.
2. Mikrofon bilan puflash funksiyasi xavfsizlik talablariga ko'ra **HTTPS** protokoli orqali ishlaydi (internetga qo'yilganda yoki localhost da bemalol ishlaydi).
3. **Serverga muhit o'zgaruvchilarini qo'ying** (Render → Environment):
   - `ADMIN_KEY` — javoblar paneli uchun yangi maxfiy parol.
   - `TELEGRAM_BOT_TOKEN` — Telegramda @BotFather orqali bot yaratib, olingan token.
   - `TELEGRAM_CHAT_ID` — sizning chat ID (botingizga bir marta /start yozing, so'ng @userinfobot dan ID ni oling).
   - Muhim: bepul serverda `data/replies.json` server qayta yonganda o'chib ketadi. Telegram sozlansa, javob baribir sizga yetib keladi. Qo'shimcha nusxa Render → Logs bo'limida `💌 YANGI JAVOB` qatorida turadi.
4. Sayt internetga bepul joylashtirilganda (masalan **Render.com** orqali), servis uxlab qolmasligi uchun belgilangan vaqtdan 5–10 daqiqa oldin linkni bir marta o'zingiz ochib qo'ying.
