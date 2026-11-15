// ============================================================
//  TUG'ILGAN KUN SAYTI — ASOSIY SOZLAMALAR (CONFIG)
//  Farangiz uchun maxsus tayyorlandi ❤️
// ============================================================

module.exports = {
  // 1. Uning ismi (kirishda, sarlavhada va yulduzlardan shu ism yig'iladi)
  name: "Farangiz",

  // 2. Sayt aynan shu vaqtda ochiladi (Toshkent vaqti: +05:00)
  unlockAt: "2026-11-26T00:00:00+05:00",

  // 3. Sinov rejimi:
  // true  -> saytni hozir o'zingiz to'liq ko'rib sinashingiz uchun darhol ochiladi
  // false -> faqat 26-noyabr 00:00 da ochiladi (yuborishdan oldin false qilasiz!)
  testMode: true,

  // 4. Tortdagi shamlar soni (har bir rasm uchun bittadan - 7 ta sham)
  candles: 7,

  // 5. Rasmlar va har bir rasm uchun maxsus jumlalar
  photos: [
    {
      file: "photo1.jpg",
      text: "Mening eng erka, eng yoqimtoy yaproq tojlari malikasi ✨"
    },
    {
      file: "photo2.jpg",
      text: "Yuzingni berkitma... Ko'zlaringdagi sehr butun olamni yoritadi 🍂"
    },
    {
      file: "photo3.jpg",
      text: "Shu tabassumingni ko'rgan har bir onimda qalbim yayraydi 🌸"
    },
    {
      file: "photo4.jpg",
      text: "Arazlaganingda ham shunaqangi shirin bo'lib ketasanki... 🥰"
    },
    {
      file: "photo5.jpg",
      text: "Sen bilan har bir kun — eng unutilmas sarguzasht, quvnoq qizalog'im 🎸💫"
    },
    {
      file: "photo6.jpg",
      text: "Kuzning barcha oltin barglari ham sening go'zalliging oldida ojiz 👑💖"
    },
    {
      file: "photo7.jpg",
      text: "Sen mening hayotimdagi eng sokin va eng shirin mo'jizamsan ✌️❤️"
    }
  ],

  // 6. Konvert ichidagi xat
  letter: {
    greeting: "Hanuyim,",
    paragraphs: [
      "Bugun sening kuning. Bundan bir necha yil oldin aynan shu kuni dunyoga bir inson keldi va keyinchalik mening butun dunyomga aylandi. Bugun senga shuni aytmoqchiman: sen bor bo'lganing uchun hayotim ancha chiroyliroq.",
      "Oxirgi kunlar ikkimiz uchun ham oson bo'lmadi, bilaman. Gaplashmagan har bir kunim xuddi nimadir yetishmayotgandek o'tdi. Telefonimni qo'limga olib, senga yozgim kelgan paytlar ko'p bo'ldi. Agar biror so'zim yoki ishim bilan ko'nglingni og'ritgan bo'lsam, chin dildan kechir. Seni xafa qilish hech qachon niyatim bo'lmagan.",
      "Senga sog'lik, xotirjamlik va yuzingdan hech qachon arimaydigan tabassum tilayman. Barcha orzularing birma-bir ushalsin. Men esa shu tabassumning sababi bo'lishni, eng quvonchli kunlaringda ham, eng og'ir damlaringda ham yoningda turishni xohlayman. Tug'ilgan kuning muborak bo'lsin, mening eng qadrli insonim."
    ],
    signature: "Seni juda sog'ingan inson Dududan ❤️"
  },

  // 7. Eng oxirgi sahifa (Final)
  finalMessage: {
    title: "Bu hali hammasi emas...",
    text: "Eng muhimi seni kechqurun kutyapti. Soat 18:00 da tayyor tur. Har doimgi joyda ❤️"
  },

  // 8. Fon musiqasi ("Kara Sevda")
  music: "music.mp3",

  // 9. U sizga javob yoza olsinmi? (ha)
  allowReply: true,

  // 10. Javoblarni ko'rish paroli: /admin/replies?key=bubuvadudu
  adminKey: "bubuvadudu",

  // Server porti
  port: 3000
};
