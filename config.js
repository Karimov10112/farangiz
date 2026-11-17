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
      "Senga sog'lik, xotirjamlik va yuzingdan hech qachon arimaydigan tabassum tilayman. Barcha orzularing birma-bir ushalsin. Men esa shu tabassumning sababi bo'lishni, eng quvonchli kunlaringda ham, eng og'ir damlaringda ham yoningda turishni xohlayman. Tug'ilgan kuning muborak bo'lsin, mening eng qadrli insonim."
    ],
    signature: "Seni juda sog'ingan inson Dududan ❤️"
  },

  // 7. Final
  finalMessage: {
    title: "Bu hali hammasi emas...",
    text: "Eng muhimi seni kechqurun kutyapti. Soat 18:00 da tayyor tur. Har doimgi joyda ❤️"
  },

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
