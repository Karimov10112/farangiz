// ============================================================
//  TELEGRAM BOT XATLARI
//  Har soatda bittadan, kun vaqtiga qarab tanlanadi:
//    08:00 — tong, 23:00 — tun, 00:00–07:00 — tungi, qolgani — kunduzgi.
//  Oxirgi kun soatlari uchun maxsus xatlar ham bor (specials).
//
//  Xat turlari:
//    "oddiy matn"
//    { photo: "photo3.jpg", text: "rasm ostidagi gap" }      — content/photos dan
//    { text: "savol", buttons: [["Tugma", "unga javob"], ...] } — u bosganda javob keladi
//
//  Matnni bemalol o'zgartiring. Xat sonini qisqartirsangiz yoki ko'paytirsangiz ham bo'ladi —
//  tugab qolsa, boshidan takrorlanadi.
// ============================================================

// /start bosganda birinchi xat. {hours} — tug'ilgan kunigacha qolgan soat
const welcome =
  "Salom, Hanuyim 🌙\n\n" +
  "Men — Duduning sirli boti 🤖💌\n" +
  "Tug'ilgan kuningga {hours} soat qoldi. Shu vaqt ichida har soatda senga bitta xat keladi — kunduzi ham, kechasi ham.\n\n" +
  "26-noyabr 00:00 da esa eng katta sirni ochaman 🎁\n\n" +
  "Birinchi xat — keyingi soat boshida. Kutib tur 😉";

// 26-noyabr 00:00 dagi oxirgi xat (ostida "Sovg'ani ochish" tugmasi bo'ladi)
const final =
  "🎉🎂 Tug'ilgan kuning bilan, Hanuyim! 🎂🎉\n\n" +
  "Shu lahzani kutdim. Endi sovg'angni och — u faqat sen uchun 💝\n\n" +
  "Ovozni yoqib qo'y 🔊 va shoshilmasdan, oxirigacha ko'r.";
const finalButton = "🎁 Sovg'ani ochish";

// 00:00 dan bir daqiqa oldin
const lastMinute = "Bir daqiqa qoldi... 🤫";

// Oxirgi kun: qolgan soat → maxsus xat
const specials = {
  12: "Yarim kun qoldi! 🕛 12 soatdan keyin — sening kuning.",
  6: "Roppa-rosa 6 soat qoldi ⏳ Ertaga shu vaqtda — 18:00 da — men seni kutayotgan bo'laman 😉",
  3: "3 soat qoldi. Telefoningni zaryadlab qo'y 🔋 Yarim tunda kerak bo'ladi 😏",
  2: "2 soat... Uxlab qolma! 😄 Yoki uxlasang ham mayli — sovg'ang qochib ketmaydi.",
  1: "Bir soat qoldi ⏳ 00:00 da shu yerga qara. Hamma narsa tayyor 🎁",
};

// 08:00 — tong (indeks = tug'ilgan kunigacha necha kun qolgani: 0 — oxirgi kun)
const mornings = [
  "Xayrli tong! ☀️ Bugun — tug'ilgan kuningdan oldingi oxirgi kun. Hayajondamisan? Men — ha 😅",
  "Tong muborak, mening quyoshim ☀️ Nonushta qil, och qolma! Ertaga emas, indinga — sening kuning.",
  "Xayrli tong! ☀️ Uyg'ondingmi? Bugun ham seni yaxshi ko'raman. Kechagidek — balki undan ham ko'proq.",
  "Xayrli tong, Hanuyim ☀️ Bugun ham chiroyli kun bo'lsin. Tug'ilgan kuningga sanoqli kunlar qoldi!",
];

// 23:00 — xayrli tun (indeks = necha kun qolgani; oxirgi kun 23:00 da maxsus xat ketadi)
const goodnights = [
  "Xayrli tun 🌙",
  "Xayrli tun! Ertaga — tug'ilgan kuningdan oldingi oxirgi kun 🥰 Shirin tushlar.",
  "Kun tugadi. Bugun ham seni o'ylab o'tkazdim. Xayrli tun 🌙",
  "Xayrli tun, Hanuyim 🌙 Ertaga yana yangi xatlar keladi. Shirin tushlar.",
];

// 00:00–07:00 — tungi xatlar (ovozsiz keladi)
const night = [
  "Uxlayapsanmi? Agar uyg'oq bo'lsang — uxla, Hanuyim 🌙 Ertaga chiroyli bo'lib uyg'onishing kerak.",
  "Tun. Hamma uxlagan. Men esa seni o'ylayapman. Odat bo'lib qoldi 🙂",
  "Tushingda meni ko'rsang, salom ayt 😄",
  "Osmonga qara... yulduzlar ham seni kutyapti ✨",
  "Bu xatni ertalab o'qiysan, bilaman. Xayrli tong deyishga hali erta, shunchaki — seni yaxshi ko'raman.",
  "Tunda yozilgan gaplar eng samimiysi bo'ladi deyishadi. Seni sevaman. Mana, samimiy.",
  "Oyni ko'rdingmi bugun? Menga sen haqingda o'ylatdi. Aslida hamma narsa sen haqingda o'ylatadi 🌕",
  "Uyqung shirin bo'lsin. Yostig'ingni quchoqla — bu mendan 🤗",
  "Sen bilan vaqtni ham unutaman. Hozir soat nechi o'zi? 😅",
  "Tunda yulduzlar senga o'xshaydi: jim, lekin porlaydi ✨",
  "Agar hozir uyg'ongan bo'lsang — suv ich va yana uxla. Buyruq 😄",
  "Seni o'ylab uxlay olmayapman. Ertaga aybni senga qo'yaman 😏",
  "Tun yarmida ham sen mening birinchi fikrimsan.",
  "Kichkina sir: har kecha uxlashdan oldin rasmingga qarayman. Endi sen ham bilasan 🙈",
  "Tushlaring faqat chiroyli bo'lsin. Qo'rqinchlilarini men haydab yuboraman 💪",
  "Tong otishiga oz qoldi. Tong — bu seni ko'rishga yana bir kun yaqinroq degani.",
  "Tinchgina uxla. Men shu yerda — botingda 😄",
  "Sen uxlayotganda ham kimdir seni juda-juda sevadi. Bu — men.",
  "Oy bugun juda chiroyli. Lekin sen undan ham chiroyliroqsan 🌙",
  "Uyg'onsang, birinchi meni o'yla. Xo'pmi? 😊",
  "Bu — tug'ilgan kuningdan oldingi tunlardan biri. Ular sanoqli qoldi 🥰",
  "Shirin tush ko'r. Unda men bo'lsam — yanayam shirin 😄",
  "Tunlar uzun, lekin seni o'ylasam qisqa tuyuladi.",
  "Yana bir bor xayrli tun. Eng chiroyli tushlar senga 🌙✨",
  "Hozir uxlayotgan bo'lsang ham, bu xat seni kutib turadi. Men ham shunday — doim kutaman.",
  "Yulduzlarni sanab chiqdim. Hammasi bitta tilak qildi: sen baxtli bo'l ✨",
  "Kechasi uyg'onib qolsang, bilgin: kimdir hozir seni o'ylayapti 💭",
  "Uxla, uxla... ertaga kulib uyg'on 😊",
];

// Kunduzgi xatlar (tartib bilan, takrorlanmasdan)
const day = [
  "Bilasanmi, hozir nima qilyapman? Seni o'ylayapman. Yangilik emas, to'g'rimi? 😄",
  "Seni sevishimning sabablaridan biri: gaplashayotganda ko'zing kulib turadi. Og'zing jim tursa ham 🙂",
  {
    text: "Savol: hozir qayerdasan? 🤔",
    buttons: [
      ["🏠 Uydaman", "Issiq kiyinib o'tir, shamollab qolma 🥺"],
      ["🚶‍♀️ Tashqaridaman", "Ehtiyot bo'l, mening malikam 👑"],
      ["💭 Seni o'ylayapman", "Men ham 🥰"],
    ],
  },
  "Kichik vazifa: hozir bir stakan suv ich. Ha-ha, jiddiy aytyapman 😄 Sog'ligingga qarab yur.",
  { photo: "photo3.jpg", text: "Shu rasmingga qancha qarasam ham to'ymayman. Dunyodagi eng chiroyli manzara shu 😍" },
  "Eslaysanmi, 5-iyun... O'sha kuni nima bo'lishini bilmagandim. Endi bilaman: hayotim boshqacha bo'ldi.",
  "Sening kuling — eng sevimli ovozim. Hech qaysi qo'shiq unga teng kelmaydi 🎵",
  {
    text: "Hozir nima yegin keldi? 😋",
    buttons: [
      ["🍕 Pitsa", "Yozib qo'ydim 😌 Nimaga yozganimni keyin bilasan..."],
      ["🍣 Sushi", "Yozib qo'ydim 😌 Nimaga yozganimni keyin bilasan..."],
      ["🍰 Shirinlik", "Shirinlikka shirinlik 😄 Yozib qo'ydim"],
      ["🍲 Uy taomi", "Yozib qo'ydim 😌"],
    ],
  },
  "Ba'zida shunchaki seni ko'rgim keladi. Hech qanday sababsiz. Hozir ham shunday.",
  "Sirli gap: 26-noyabrda seni bir narsa kutyapti. Ko'proq aytmayman 🤫",
  "Seni sevishimning yana bir sababi: arazlasang ham chiroylisan. Lekin baribir arazlama 😄",
  { photo: "photo8.jpg", text: "Kulgichlaringni qo'ling bilan yashirma. Ular mening eng sevimli joyim 🙈" },
  "Vazifa: hozir ko'zguga qarab jilmay. Ko'rdingmi? Men har kuni shu tabassumni sevib qolaman 😊",
  "Bilasanmi, sen bilan gaplashmagan kunlar menga juda uzun tuyuldi. Endi bunday kunlar bo'lmasin.",
  {
    text: "Rostini ayt: meni sog'indingmi? 🥺",
    buttons: [
      ["Ha 🥺", "Men ham 🥺"],
      ["Juda 😭", "Men undan ham ko'p 😭"],
      ["Biroz 🙄", "Biroz?! Mayli, 26-kuni ko'ramiz 😏"],
    ],
  },
  "Sen haqingda bitta sir: uxlashdan oldin telefoningni qo'lingdan qo'ymaysan. Topdimmi? 😄",
  "Agar hozir yoningda bo'lganimda, nima qilardim bilasanmi? Shunchaki qo'lingni ushlab o'tirardim.",
  { photo: "photo7.jpg", text: "Qayerda bo'lmaylik, yuragim doim sen bilan." },
  "Kulgili fakt: senga yozgan xabarlarimni o'chirib, qayta yozaman. Ha, hozir ham 😅",
  "Sening ovozing eng og'ir kunimni ham yengil qiladi. Rahmat — shunchaki borliging uchun.",
  {
    text: "Qaysi biri senga ko'proq yoqadi?",
    buttons: [
      ["🌅 Tong", "Tonglar sen bilan boshlansa — eng zo'ri ☀️"],
      ["🌙 Tun", "Tunlar — sen bilan uzoq gaplashish uchun 🌙"],
    ],
  },
  "Seni sevishimning sababi: sen hamma narsani yuragingga yaqin olasan. Sening yuraging juda katta, Hanuyim.",
  "Vazifa: bugun o'zingga bitta yaxshi narsa qil. Yoqqan taomni ye, yoqqan qo'shiqni eshit. Sen bunga loyiqsan 💕",
  { photo: "photo2.jpg", text: "Yuzingni yashirsang ham, seni minglab odam orasidan taniyman 🙈" },
  "Hisoblab chiqdim: tanishganimizdan beri seni o'ylamagan kunim bo'lmagan. Bitta ham.",
  "Sirli gap №2: 26-noyabr kechqurun... yo'q, aytmayman 😏 Sabr qil.",
  {
    text: "Sevimli rangin? 🎨",
    buttons: [
      ["🩷 Pushti", "Esda saqlab qo'ydim 😌"],
      ["🤍 Oq", "Esda saqlab qo'ydim 😌"],
      ["🖤 Qora", "Esda saqlab qo'ydim 😌"],
      ["💜 Binafsha", "Esda saqlab qo'ydim 😌"],
    ],
  },
  "Seni xafa qilgan paytlarim uchun yana bir bor kechir. Bundan keyin ko'proq kuldirishga harakat qilaman.",
  "Bilasanmi, eng zo'r qo'shiq ham sening \"Dudu\" deganingchalik yoqimli emas 🥰",
  { photo: "photo11.jpg", text: "Sportiv, erkatoy, zamonaviy... va meniki. Eng zo'r kombinatsiya 😎" },
  "Vazifa: yuzingdagi tabassumni 10 soniya ushlab tur. Sanayapman: 1, 2, 3... ❤️",
  "Seni sevishimning sababi: sen bilan jim o'tirish ham yoqimli. Gapirish shart emas.",
  "Tug'ilgan kuningga oz qoldi va men sendan ham ko'proq hayajonlanyapman. Kulma 😅",
  {
    text: "Kechqurunlari nima qilishni yaxshi ko'rasan?",
    buttons: [
      ["🎬 Kino", "Kino kechasi — belgilab qo'ydim 🎬"],
      ["🚶‍♀️ Sayr", "Sayr — ikkimiz birga, xo'pmi? 🌙"],
      ["📱 Telefon", "Telefonda men bilan gaplashsang yaxshi 😄"],
      ["😴 Uxlash", "Uyquchi 😄 Tushingda meni ko'r"],
    ],
  },
  { photo: "photo9.jpg", text: "Ko'zlaringga bir qarasang, adashib qolasan. Men allaqachon adashganman." },
  "Seni kimgadir maqtasam, gapim tugamaydi. Sen haqingda gapirishni yaxshi ko'raman.",
  "Kichik eslatma: sen juda chiroylisan. Bugun buni hech kim aytmagan bo'lsa — men aytdim 😊",
  "Agar senga bitta narsa sovg'a qila olsam — o'zingni mening ko'zim bilan ko'rishni sovg'a qilardim. Shunda qanchalik go'zal ekaningni bilarding.",
  {
    text: "Kim ko'proq sog'inadi? 😏",
    buttons: [
      ["Men 🙋‍♀️", "Bahslashmayman... lekin men 😄"],
      ["Sen 🙋‍♂️", "To'g'ri topding 😌"],
    ],
  },
  { photo: "photo4.jpg", text: "Arazlab turganingda ham dunyodagi eng chiroyli insonsan. Isbot — shu rasm 😄" },
  "Bir narsani bilib qo'y: men seni har qanday holatingda yaxshi ko'raman. Kulganingda ham, yig'laganingda ham.",
  "Sirli gap №3: senga atalgan narsalar ko'p. 26-kuni hammasini topishga harakat qil 😉",
  "Vazifa: menga bitta yurakcha yubor ❤️ Shunchaki. Hozir.",
  "Seni sevishimning sababi: sen meni yaxshiroq inson bo'lishga undaysan. O'zing sezmasdan.",
  { photo: "photo13.jpg", text: "Kuz ham, qish ham — sen yonimda bo'lsang, hammasi bahor 🌸" },
  "Har o'tgan soat seni ko'rishga yaqinlashtiradi. Shuning uchun soatlarni sanayapman ⏳",
  {
    text: "Tug'ilgan kuningda eng ko'p nimani xohlaysan?",
    buttons: [
      ["🎁 Sovg'a", "Sabr qil 😏"],
      ["🤗 Yaqinlarim", "Men ham shu yaqinlaringdanman, unutma 🤗"],
      ["💐 Gul", "Yozib oldim 💐"],
      ["😴 Uxlash", "Uxlab ol, keyin bayram 😄"],
    ],
  },
  "Hech qachon unutma: sen men uchun eng muhim insonsan.",
  "Birinchi marta gaplashganimizdagi hayajonim hali ham esimda. Hozir ham xuddi shunday hayajonlanaman.",
  { photo: "photo15.jpg", text: "Bu V belgisi — \"Men baxtliman\" degani. Doim shunday bo'lsin ✌️" },
  "Seni sevishimning sababi: sen bilan kelajak haqida o'ylash qo'rqinchli emas. Aksincha — yoqimli.",
  "Vazifa: bugun kimgadir yaxshi so'z ayt. Sening so'zing odamlarni xursand qiladi, bilaman.",
  "Sirli gap №4: kechqurunga tayyorlanib qo'y... qaysi kechqurun ekanini 26-kuni bilasan 🤫",
  {
    text: "Qaysi biri ko'proq sen?",
    buttons: [
      ["😇 Farishta", "Farishta... ba'zan 😄"],
      ["😈 Shaytoncha", "Bilardim 😏 Lekin aynan shunisi yoqadi"],
    ],
  },
  "Rahmat. Hayotimda borliging uchun. Tez-tez aytmasam ham, har kuni o'ylayman.",
  { photo: "photo1.jpg", text: "Yaproqni ham toj qilib kiya olasan. Haqiqiy malika 👑" },
  "Bugun bir narsani payqadim: kulayotgan odamni ko'rsam, seni eslayman. Sen dunyodagi eng chiroyli kulasan.",
  "Seni sevishimning sababi: sen o'zgalarga o'xshamaysan. Sen — sensan. Va bu eng zo'ri.",
  { photo: "photo5.jpg", text: "Sen bilan bo'lganimda butun dunyoning dardi unutiladi." },
  "Sanab ko'rdim: seni o'ylagan paytlarim kunning hammasini egallaydi. Boshqa ishga vaqt qolmayapti 😅",
  "Vazifa: derazadan tashqariga qara. Osmonni ko'ryapsanmi? U ham men kabi seni kutyapti 🌤",
  { photo: "photo6.jpg", text: "Odamlar maqtaydigan oltin kuz ham sening bitta nigohing oldida oddiy xazon, xolos 🍂" },
  "Bilasanmi, eng baxtli paytlarim — sen \"yaxshi ko'raman\" deb yozgan paytlaring 🥰",
];

module.exports = { welcome, final, finalButton, lastMinute, specials, mornings, goodnights, night, day };
