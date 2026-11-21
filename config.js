// ============================================================
//  TUG'ILGAN KUN SAYTI — ASOSIY SOZLAMALAR (CONFIG)
//  Farangiz uchun maxsus tayyorlandi ❤️
// ============================================================

module.exports = {
  // 1. Uning ismi
  name: "Farangiz",

  // 2. Sayt ochiladigan sana
  unlockAt: "2026-11-26T00:00:00+05:00",

  // 3. Sinov rejimi: true — darhol ochiladi, false — faqat unlockAt vaqtida
  testMode: true,

  // 4. Tortdagi shamlar soni (1 dan 12 gacha)
  candles: 11,

  // 5. Rasmlar va har bir rasm uchun chin dildan yozilgan sevgi jumlalari (15 ta surat)
  photos: [
    {
      file: "photo1.jpg",
      text: "Sen hatto oddiy yaproqni ham toj qilib kiyishing mumkin, chunki mening dunyomda baribir tenging yo'q."
    },
    {
      file: "photo2.jpg",
      text: "Yuzingni berkitib olsang ham, seni minglab odamlar orasidan birgina nafasingdan tanib olaman."
    },
    {
      file: "photo3.jpg",
      text: "Dunyoda eng chiroyli manzara nima bilasanmi? Sen kulyapsan, men esa senga qarab to'ymayapman."
    },
    {
      file: "photo4.jpg",
      text: "Arazlab, labingni burishtirib olganingda ham... qasam ichaman, dunyodagi eng chiroyli inson o'zing bo'lasan."
    },
    {
      file: "photo5.jpg",
      text: "Sen bilan bo'lganimda butun dunyoning dardi unutiladi. Sen mening eng beg'ubor quvonchimsan."
    },
    {
      file: "photo6.jpg",
      text: "Odamlar maqtaydigan oltin kuz ham, sening bitta mayin nigohing oldida oddiygina xazon, xolos."
    },
    {
      file: "photo7.jpg",
      text: "Qayerda bo'lmaylik, nima bo'lishidan qat'i nazar — mening qalbim doim sen bilan, Hanuyim."
    },
    {
      file: "photo8.jpg",
      text: "Kulgichlaringni qo'ling bilan yashirma, sening samimiy kulging — mening eng qorong'i kunlarimga ham oftob olib kiradi."
    },
    {
      file: "photo9.jpg",
      text: "Ko'zlaring shunchalik chuqurki... ularga bir marta qaragan inson butun umr adashib qolishi mumkin."
    },
    {
      file: "photo10.jpg",
      text: "Dunyoning eng go'zal mo'jizasini birgina yaproq orqasiga yashirib qo'yish mumkin ekan..."
    },
    {
      file: "photo11.jpg",
      text: "Mening sportiv, erkatoy, eng zamonaviy va yagona sevgilim — sen bilan har bir soniyam bayram."
    },
    {
      file: "photo12.jpg",
      text: "Kulgingni yashirolmaysan, Hanuyim — u xuddi quyosh kabi, qo'l bilan to'sib bo'lmaydi."
    },
    {
      file: "photo13.jpg",
      text: "Kuz barglari to'kilsa ham, sen yonimda bo'lsang — atrofimdagi hamma narsa baribir gullaydi."
    },
    {
      file: "photo14.jpg",
      text: "Yuzingni yashirmoqchi bo'lsang ham, yuragim seni har qanday niqob ortidan tanib oladi."
    },
    {
      file: "photo15.jpg",
      text: "Bu ikkita barmog'ing V belgisimi yoki dunyoga: 'Men baxtliman!' deyayapsanmi? Ikkalasi ham to'g'ri."
    }
  ],

  // 6. Xat
  letter: {
    greeting: "Hanuyim,",
    paragraphs: [
      "Bugun sening kuning. Bundan bir necha yil oldin aynan shu kuni dunyoga bir inson keldi va keyinchalik mening butun dunyomga aylandi. Bugun senga shuni aytmoqchiman: sen bor bo'lganing uchun hayotim ancha chiroyliroq.",
      "Oxirgi kunlar ikkimiz uchun ham oson bo'lmadi, bilaman. Gaplashmagan har bir kunim xuddi nimadir yetishmayotgandek o'tdi. Telefonimni qo'limga olib, senga yozgim kelgan paytlar ko'p bo'ldi. Agar biror so'zim yoki ishim bilan ko'nglingni og'ritgan bo'lsam, chin dildan kechir. Seni xafa qilish hech qachon niyatim bo'lmagan.",
      "Bilasanmi, bu xatni necha marta yozib, o'chirib, qaytadan yozdim. Chunki senga aytmoqchi bo'lgan gaplarim so'zlarga sig'mayapti. Sog'lik tilayman, omad tilayman, hammasini tilayman... lekin aslida bitta narsani xohlayman: sen kulib yurgin. Chunki sen kulganingda, men ham tirikligimni his qilaman. Gaplashmagan kunlarimizda buni juda yaxshi tushundim. Orzularing ushalsin, sevgilim. Faqat bittasini menga qoldir, uni birga ushaltiramiz. Va yana bir gap... bu xatda yozmayman. Uni kechqurun, ko'zingga qarab aytaman. Tayyor tur ❤️ Tug'ilgan kuning muborak. Seni sevaman. Shunchaki sevaman."
    ],
    signature: "Seni juda sog'ingan inson Dududan ❤️",

    // Ovozli xat: xat SIZNING OVOZINGIZDA o'qiladi va yozuv ovozga moslab boradi,
    // o'qilayotganda fon musiqasi juda pasayadi.
    // Faylni content/voice/ papkasiga xat.mp3 nomi bilan qo'ying. Fayl bo'lmasa — oddiy yoziladi.
    voice: "xat.mp3"
  },

  // 7. Final
  finalMessage: {
    title: "Bu hali hammasi emas...",
    text: "Eng muhimi seni kechqurun kutyapti. Soat 18:00 da tayyor tur. Har doimgi joyda ❤️"
  },

  // 6.1. "Dudu yozmoqda..." chat — tortdan keyin xabarlar birma-bir, haqiqiy chatdagidek keladi.
  //   messages — sizning xabarlaringiz (tartib bilan)
  //   replies  — u bosadigan tayyor javob tugmalari
  //   answer   — uning javobidan keyin siz yozadigan oxirgi xabar
  //   O'chirish uchun: chat: null
  chat: {
    messages: [
      "Hanuyim, uxlamadingmi? 🙈",
      "Bilaman, uxlamagansan 😄",
      "Tilak qildingmi? Nima tilaganingni aytma — faqat ushalishiga ishon ✨",
      "Bir narsani bilib qo'y...",
      "Bugun faqat sening tug'ilgan kuning emas. Bugun — dunyoga mening eng yaqin insonim kelgan kun ❤️",
      "Endi osmonga qara... u yerda senga atalgan yulduzlar bor 🌟"
    ],
    replies: ["Men ham seni sevaman ❤️", "Dudu 🥺", "Rahmat, jonim 🥰"],
    answer: "Bilardim 🥰 Ketdik!"
  },

  // 6.2. "Raqamlarda sening hayoting" — ism yulduzlardan yig'ilgandan keyin.
  //   birthDate — tug'ilgan sanasi. O'chirish uchun: lifeStats: null
  lifeStats: {
    birthDate: "2007-11-26",
    metDate: "2026-06-05"
  },

  // 6.3. Testdan keyingi majburiy bosqichlar (o'chirish uchun false qiling):
  selfie: true,     // 📸 Tug'ilgan kun selfisi (toj va ramka bilan)
  drawing: true,    // 🎨 "Menga rasm chizib ber"
  magicBall: {      // 🔮 Sehrli shar — nechta savol berishi shart
    questions: 3
  },

  // 7.0. Rasm boshqotirmasi — yurak bosqichidan keyin, xatni ochish uchun yig'iladi.
  //   photo   — content/photos papkasidagi rasm nomi (har qanday o'lchamda bo'lishi mumkin)
  //   message — rasm yig'ilganda chiqadigan yashirin xabar
  //   O'chirish uchun: puzzle: null
  puzzle: {
    photo: "puzzle.jpg",
    message: "Bizning hayotimiz ham shunday — bo'laklari qayerda bo'lmasin, oxiri baribir bir-biriga mos tushadi ❤️"
  },

  // 7.0.1. Uchrashuv vaqti — finalda "Ko'rishishimizga qoldi 05:12:30" deb jonli sanaladi.
  //   Kerak bo'lmasa: meetAt: null
  meetAt: "2026-11-26T18:00:00+05:00",

  // 7.1. "Meni qanchalik bilasan?" testi
  //   answer — to'g'ri javobning tartib raqami (0 dan boshlanadi: 0 = birinchi variant)
  //   right  — to'g'ri topsa chiqadigan izoh
  //   Savol qo'shish/o'chirish mumkin. Testni o'chirish uchun: questions: []
  quiz: {
    questions: [
      {
        q: "Biz qachon tanishganmiz?",
        options: ["15-may", "5-iyun", "1-iyul", "20-iyun"],
        answer: 1,
        right: "Ha! Hayotimdagi eng omadli kun ✨"
      },
      {
        q: "Men seni qanday erkalab chaqiraman?",
        options: ["Asalim", "Quyoshim", "Hanuyim", "Jonim"],
        answer: 2,
        right: "Faqat sen shunday atalishga loyiqsan, Hanuyim 🥰"
      },
      {
        q: "Sen esa meni qanday chaqirasan?",
        options: ["Dudu", "Bubu", "Asalim", "Shunchaki ismim bilan"],
        answer: 0,
        right: "Dudu doim sening yoningda 🐻"
      },
      {
        q: "Bu saytda yangrayotgan musiqa qaysi serialdan?",
        options: ["Qora sevgi (Kara Sevda)", "Titanik", "Kuz hikoyasi", "Sen qo'ng'iroqni chal"],
        answer: 0,
        right: "Bizning qo'shig'imiz 🎵"
      },
      {
        q: "Men dunyoda eng ko'p nimani yaxshi ko'raman?",
        options: ["Futbolni", "Telefonimni", "Uxlashni", "Seni"],
        answer: 3,
        right: "Albatta seni! Boshqa javob bo'lishi mumkin emas edi ❤️"
      }
    ]
  },

  // 7.2. Sevgi kuponlari — u qirib ochadi va istagan paytida "ishlatadi".
  //   Ishlatganida sizga xabar keladi (admin panel / Telegram). Va'dangizda turing 😉
  //   O'chirish uchun: coupons: []
  coupons: [
    { emoji: "🍽️", title: "Istagan joyingda kechki ovqat", text: "Qayerni tanlasang — o'sha yerga boramiz. Hisob mendan." },
    { emoji: "👑", title: "Bir kunlik malika", text: "Butun kun nima desang — shu. Hech qanday 'yo'q' yo'q." },
    { emoji: "🕊️", title: "Kechirim kuponi", text: "Bir marta xafa qilsam — shuni ko'rsat, darhol yarashamiz." },
    { emoji: "🎬", title: "Kino kechasi", text: "Filmni sen tanlaysan, men bir og'iz ham shikoyat qilmayman." },
    { emoji: "💐", title: "Sababsiz gul", text: "Kutilmagan bir kunda eshigingda gul bilan turaman." },
    { emoji: "🌙", title: "Kechki sayr", text: "Telefonlarsiz, faqat ikkimiz — istagan oqshomingda." }
  ],

  // 7.3. Finaldagi savol: "Yo'q" tugmasi qochib ketadi 😄
  //   Kerak bo'lmasa: finalQuestion: null
  finalQuestion: {
    question: "Kechqurun 18:00 da kelasanmi?",
    yes: "Ha ❤️",
    no: "Yo'q",
    done: "Bilardim! ❤️ Seni kutaman..."
  },

  // 7.4. Kechki uchrashuv chiptasi (eng oxirida chiqadi, u saqlab oladi)
  //   mapUrl   — aniq joy havolasi (Yandex/Google xaritadan "Ulashish" → havola)
  //   mapQuery — mapUrl bo'lmasa, Google Maps'da qidiriladigan manzil
  //   O'chirish uchun: meeting: null
  meeting: {
    date: "26.11.2026",
    time: "18:00",
    place: "Xiyobontepa, Ezgulik ko'chasi",
    // Aniq nuqta (Yandex Xarita). QR-kod va "Xaritada ochish" tugmasi shu yerni ochadi
    mapUrl: "https://yandex.uz/maps/-/CXWDJE2y",
    mapQuery: "Khiyobontepa, Ezgulik Street, Tashkent",
    seat: "Duduning yonida ❤️",
    dressCode: "Eng chiroyli kiyiming 😉"
  },

  // 7.5. Kino titrlari (fonarlardan keyin, chiptadan oldin). [rol, kim] juftliklari.
  //   {noTries} — "Yo'q" tugmasini necha marta bosmoqchi bo'lgani bilan almashtiriladi
  //   O'chirish uchun: credits: null
  credits: [
    ["Bosh rolda", "Farangiz"],
    ["Ikkinchi rolda", "Dudu — uning eng katta muxlisi"],
    ["Rejissyor", "Sevgi"],
    ["Ssenariy muallifi", "Taqdir"],
    ["Operator", "Osmondagi yulduzlar ⭐"],
    ["Musiqa", "Kara Sevda va yuragimning urishi"],
    ["Maxsus effektlar", "Uning tabassumi"],
    ["Kaskadyor", "\"Yo'q\" tugmasi ({noTries} marta qochdi 😄)"],
    ["Maxsus minnatdorchilik", "5-iyun, 2026 — biz tanishgan kun"]
  ],

  // 8. Musiqa ("Kara Sevda")
  music: "music.mp3",

  // 9. Ruxsat
  allowReply: true,

  // 10. Admin paroli: /admin/replies?key=PAROL
  //     Internetda serverga ADMIN_KEY muhit o'zgaruvchisini qo'ying — u shu qiymat o'rniga ishlaydi
  //     (GitHub'da parol ochiq turmasligi uchun). Bu qiymat faqat kompyuterda sinash uchun.
  adminKey: "bubuvadudu",

  // 11. Telegram: u javob yozishi bilan xabar Telegramingizga keladi.
  //     Token va chat ID ni BU YERGA YOZMANG — serverda muhit o'zgaruvchisi qilib qo'ying:
  //       TELEGRAM_BOT_TOKEN = @BotFather bergan token
  //       TELEGRAM_CHAT_ID   = sizning chat ID raqamingiz
  telegram: { enabled: true },

  port: 3000
};
