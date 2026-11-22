// ============================================================
//  FARANGIZ UCHUN MAXSUS XATLAR (Dududan chin yurakdan)
//  5-iyun xotiralari, kechalari tonggacha suhbatlar,
//  sog'inch, pushaymonlik, shirin xotiralar va mehrli so'zlar.
// ============================================================

const dayMessages = [
  // 5-iyun va boshlanishi
  "5-iyun... Aynan shu kuni hayotimga bir farishta kirib kelganini o'shanda hali to'liq anglamagan edim. Sen mening hayotimdagi eng chiroyli kutilmagan mo'jizamsan, Hanuyim ❤️",
  "Eslaysanmi, boshida kechalari tong otguncha telefonda gaplashib chiqardik... Uyqu kelmasdi, go'shakni qo'ygimiz kelmasdi. O'sha tunlar hozir ham qalbimda eng shirin xotira bo'lib turibdi.",
  "Boshida: 'Seni shunchaki yaxshi ko'raman, lekin sevmayman' derding-a? 😄 Har safar shu gapingni eslasam, beixtiyor jilmayib qo'yaman. O'jar, erkatoy Bubuyim meni baribir sevib qolgan-ku!",
  "Sen men uchun hamma narsadan, hammadan voz kechib: 'Faqat sen!' deganingda... Men dunyodagi eng baxtli yigit bo'lgan edim. Sen bergan o'sha mehr dunyolarga arziydi.",

  // Sog'inch va pushaymonlik (tabassum bilan)
  "Tennis raketkalarini ham, futbol to'plarini ham butunlay yoqib yuborishga tayyorman! 😅 Sening bitta tabassuming, bitta erkalashing oldida dunyodagi barcha tennisu futbollar bir pul!",
  "30-oktyabrdan beri o'tgan har bir kun menga bitta katta haqiqatni o'rgatdi: Sensiz bu dunyo judayam sovuq va zerikarli ekan. Sening qadring — mening nafasimdek zarur.",
  "Mening ahmoqligim, tushunmovchiliklar tufayli ko'nglingni og'ritgan har bir soniyam uchun ming bor afsusdaman. Sen xafa bo'lishga emas, faqat malikadek sevilishga loyiqsan.",
  "Bilasanmi, menda qandli diabet borligini bilib, 'Dudu, siqilmang, asabiylashmang, ovqatingizni vaqtida yeng' deb jon kuydirganing... Seni o'sha g'amxo'rligingsiz yashash qanchalik qiyinligini bilsang edi ❤️",

  // Sevish sabablari va erkalashlar
  "Sening jahl qilishing ham, arazlab labingni burishtirishing ham dunyodagi eng yoqimtoy manzara. Hozir ham arazlab o'tirgan bo'lsang, bitta jilmayib qo'y, xo'pmi? 😉",
  "Hozir ko'zguga qarab bitta kulib qo'ygin. Chunki sening kulging — xuddi oftobdek, eng tushkun yurakka ham darhol yorug'lik olib kiradi.",
  "Dunyoda milliardlab qizlar bor, lekin faqat sen mening yuragimni bunchalik titrata olgansan. Sen mening yakkayu yagona Hanuyimsan.",
  "Har safar 'Bubuyim' deganingda yuragim qanday erib ketishini bilsang edi... Bu so'zni faqat sendan eshitishni xohlayman.",

  // Samimiy jumlalar
  "Senga qarab to'ymayman deganlari rost ekan. Hatto gaplashmay turgan kunlarimizda ham har daqiqa xayolimda faqat sening nigohing turdi.",
  "Men bilgan eng vafodor, eng mehrli va eng oqko'ngil qiz bu — sensan. Sen mening hayotimdagi eng to'g'ri tanlovimsan.",
  "Xafa bo'lma, sevgilim. Oldimizda hali birga ko'radigan qancha kinolarimiz, birga aylanadigan qancha ko'chalarimiz bor!",
  "O'zingni ehtiyot qil, kiyinib yur, sovuqda qolib ketma. Chunki sen kimgadir butun bir dunyo, butun bir hayotsan...",
  "Sening har bir aytgan so'zing, har bir kulging hozir qulog'im ostida jaranglayapti. Seni shunchalik qattiq sog'indimki, so'zlar ojiz.",
  "Men senga va'da beraman: bundan keyin sening ko'zlaringda faqat quvonch ko'z yoshlari bo'ladi. Xafa qilish degan so'z bizning lug'atimizdan butunlay o'chadi.",
  "Yana bir oz sabr qil, Hanuyim... Juda oz qoldi. Senga tayyorlagan ssyurprizim sening yuzingga quvonch olib kirishiga ishonaman ✨",
  "Seni yaxshi ko'rishim shunchaki so'z emas, bu har bir nafasim, har bir yurak urishimdir.",
  "Bilasanmi, eng katta orzum nima? Har kuni ertalab uyg'onganimda sening jilmayib turganingni ko'rish.",
  "Sening erkaliklaring, nozlaring... Ularsiz hayotim bo'm-bo'shdek tuyuladi. Seni juda sog'indim, o'jarim ❤️",
  "Bugun kayfiyating a'lo bo'lsin! Sening xursand yurishing — mening eng katta baxtim.",
  "Har safar telefonimga qarasam, sendan xabar kutaman. Hali hammasi avvalgidan ham go'zal bo'ladi, ishon.",
  "Sen mening qalbimning eng sokin, eng toza va eng aziz burchagisan.",
  "Dudung seni qanchalik sevishini bilasan-a? Bilmasang, har soat kelayotgan mana shu xatlardan bilib ol 😉"
];

const eveningMessages = [
  "Kechki salqin tushdi... O'tgan kunlarimizdagi kechki uzoq suhbatlarimiz, samimiy orzularimiz yodingdami? Hammasi qalbimda muhrlanib qolgan.",
  "Kechki issiq choyingni ichib, o'zingga dam ber, Hanuyim. Bugun juda ko'p mehnat qilding va faqat yaxshi narsalarni o'ylashga munosibsan ❤️",
  "Kechalari sokinlikda faqat sen haqingda o'ylayman. Seni uchratganim uchun har kuni shukr qilaman.",
  "Osmondagi yulduzlarga qara... Ularning har biri biz gaplashib chiqqan o'sha 5-iyundan keyingi tunlarning guvohi ✨",
  "Kechqurunlari ko'chada yursam, yoningda sen yetishmayotganing shundoq seziladi. Qo'lingdan ushlab yurishni sog'indim.",
  "Mening aqlli, chiroyli va qaysar Bubuyim... Bugun barcha charchoqlarni unut, chunki oldinda sening bayraming!",
  "Sening xotirang bilan o'tgan har bir oqshom — dildagi samimiy iliqlik demakdir.",
  "30-oktyabrdan keyingi har bir oqshomim sog'inch bilan o'tdi. Lekin bilaman, mehr hamma narsani yengadi.",
  "Kechki payt ko'zlaringni yumganda dilingda paydo bo'ladigan iliqlik — bu mening senga bo'lgan cheksiz sevgimdir.",
  "Hamma narsa o'z vaqtida go'zal. Bizning eng chiroyli, eng baxtli kunlarimiz esa hali oldinda, ishonaver ❤️"
];

const nightMessages = [
  "🌙 Tun sokin, shahar uxladi... Bu xat seni uyg'otmasdan, asta yetib boryapti. Shirin tushlar ko'rgin, farishtam.",
  "🌙 Senga dunyodagi eng sokin va huzurli uyquni tilayman. Tushlaringda faqat eng yorqin orzularingni ko'r.",
  "🌙 Qandli diabetim borligini bilib, 'Dudu, o'zingizni asrang' degan g'amxo'r ovozing hamon qulog'imda... Sen ham o'zingni asra, Hanuyim.",
  "🌙 Yulduzlar sening shirin oromingni qo'riqlasin. Sen dunyodagi eng go'zal ertaklarga munosibsan.",
  "🌙 Tun qorong'usi ham sening qalbingdagi beg'uborlikni to'sa olmaydi. Xayrli tun, mening yagonam ❤️",
  "🌙 Bilasanmi, sen tinchgina uxlab yotganingda ham, vaqt bir zumga to'xtamay bizni o'sha maxsus kunga yaqinlashtirmoqda.",
  "🌙 Hamma uxlagan tunda faqat sening ismingni pichirlab duo qilaman: doim sog' bo'l, doim kulib yur.",
  "🌙 Yostiqqa bosh qo'yganingda dilingdagi barcha xafagarchiliklar erib ketsin. Seni juda qadrlaydigan Dudung bor.",
  "🌙 Tun pardasi ostida qoldirilgan eng samimiy sevgim va sog'inchim senga hamroh bo'lsin. Shirin orom ol...",
  "🌙 Ertalab uyg'onganingda bu xatlarni o'qib, labingda mayin tabassum paydo bo'lishini chin dildan xohlayman 😊"
];

const interactiveQuestions = [
  {
    text: "Eslaylikchi: 5-iyunda tanishganimizda, kim birinchi bo'lib qiziqib qolgan edi? 😉",
    options: ["Albatta men (Farangiz) 🙈", "Yo'q, sen (Dudu) birinchi ko'rgan zahoti 😍"]
  },
  {
    text: "Boshida 'Yaxshi ko'raman, lekin sevmayman' derding-ku... Rostini ayt, o'shanda ham aslida sevib bo'lganmiding? 😄",
    options: ["Ha, ich-ichimdan sevib bo'lgandim 🥰", "Yo'q, rosa qiynab keyin sevganman 😜"]
  },
  {
    text: "Tennis raketkalarini nima qilaylik endi? 😂",
    options: ["Hammasini tashlab yubor, faqat men bilan bo'l! 🎾❌", "Mayli, kechirdim, faqat men bilan o'ynaysan 🤝"]
  },
  {
    text: "Hozir yuzingda qanday ifoda bor? To'g'risini ayt-a 😉",
    options: ["Jilmayib o'tiribman, xatlar yoqyapti 😊", "Arazlaganman, lekin baribir kulyapman 🤭"]
  },
  {
    text: "Dudung senga eng ko'p qaysi nom bilan murojaat qilgani yoqadi? ❤️",
    options: ["Hanuyim 👑", "Bubuyim 🐣"]
  }
];

// So'nggi hayajonli soatlar (25-noyabr kechasi)
const finalHoursMessages = {
  3: "Qolgan vaqt: atigi 3 soat! Yuragim xuddi birinchi uchrashuvimizdagidek tez urmoqda... Hanuyim, tayyormisan? 💓",
  2: "Qolgan vaqt: 2 soat! 5-iyundan boshlangan bu yo'l bugun eng maxsus pallasiga kirmoqda ✨",
  1: "Oxirgi 1 soat qoldi! Chuqur nafas ol... Dudung senga butun qalbini berishga tayyor! ⏳🎉",
  0: "Sanoq boshlandi... 10... 5... 3... 2... 1... Bugun dunyodagi eng chiroyli inson tug'ilgan kun! 🚀"
};

// 26-noyabr 00:00 da chiqadigan katta samimiy tabrik
function getCelebrationMessage(name) {
  return (
    `🎉🎂 **TUG'ILGAN KUNING MUBORAK BO'LSIN, MENING HANUYIM, BUBUYIM!** 🎂🎉\n\n` +
    `2026-yil 5-iyun kuni hayotimga kirib kelganing uchun, kechalari tonggacha gaplashib chiqqan shirin tunlarimiz uchun, ` +
    `menga diabetimda ham eng katta suyanchiq bo'lib, jon kuydirib mehr berganing uchun senga ming bor rahmat! ❤️\n\n` +
    `Xatolarim, ahmoqligim va seni xafa qilgan har bir lahzam uchun chin yurakdan, tiz cho'kib kechirim so'rayman. ` +
    `Sening qadring — mening nafasimdek zarur. Dunyodagi barcha tennisu futbollar, hamma narsa sening bitta mayin kulging oldida oddiy bir xazon, xolos.\n\n` +
    `Bugun sening kuning, mening yagonam! Sen faqat va faqat cheksiz baxtga loyiqsan. Seni qanchalik sevishimni va sog'inganimni so'z bilan ta'riflab bo'lmaydi.\n\n` +
    `Uzoq kutilgan on keldi... Senga tayyorlagan maxsus ssyurprizimni ochish vaqti bo'ldi! 🎁\n\n` +
    `Quyidagi tugmani bosing va o'z sovg'angizni qarshi oling: 👇`
  );
}

module.exports = {
  dayMessages,
  eveningMessages,
  nightMessages,
  interactiveQuestions,
  finalHoursMessages,
  getCelebrationMessage
};
