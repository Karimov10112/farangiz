// ============================================================
//  FARANGIZ UCHUN SOATLIK XATLAR (SOAT VA SANAGA ANIQ BOG'LANGAN)
//  Toshkent vaqti bo'yicha har bir soat uchun o'z vaqtiga mos xat
// ============================================================

const scheduleByHour = {
  // ------------------------------------------------------------
  // 23-NOYABR TUNGI VAQTLAR (01:00 dan 07:00 gacha) — Agar hozir ochib qolsa
  // ------------------------------------------------------------
  "23_01": { silent: true, text: "🌙 Tun sokin... Bu xat seni uyg'otmasdan, asta yetib boryapti. Shirin tushlar ko'rgin, mening farishtam." },
  "23_02": { silent: true, text: "🌙 Hamma uxlagan tunda senga eng shirin oromni tilayman. Ertalabgacha yaxshi dam ol, Hanuyim ❤️" },
  "23_03": { silent: true, text: "🌙 Yulduzlar sening oromingni qo'riqlasin. Ertalab soat 08:00 dan boshlab har soatda ajoyib xatlar seni kutmoqda ✨" },
  "23_04": { silent: true, text: "🌙 Tun qorong'usi ham sening qalbingdagi nur va samimiylikni to'sa olmaydi. Xotirjam uxla." },
  "23_05": { silent: true, text: "🌙 Tong yaqinlashmoqda... Tungi sukunat senga yangi kun uchun kuch va xotirjamlik bersin." },
  "23_06": { silent: true, text: "🌙 Qayerda bo'lsang ham bilib qo'y: seni har lahzada asrashga tayyor insoning bor." },
  "23_07": { silent: true, text: "🌙 Uyg'onish vaqti yaqin... Yostiqdan bosh ko'targaningda labingda tabassum paydo bo'lishini chin dildan xohlayman 😊" },

  // ------------------------------------------------------------
  // 23-NOYABR KUNDUZI VA KECHASI (08:00 dan 23:00 gacha)
  // ------------------------------------------------------------
  "23_08": { text: "Xayrli tong, mening Hanuyim! Bugun ertalab ko'zingni ochganingda labingda tabassum bo'lishini xohladim. Bu xatlar shunchaki so'zlar emas, bu mening 5-iyundan beri qalbimda to'planib qolgan hislarimdir ❤️" },
  "23_09": { text: "2026-yil 5-iyun... Aynan shu kuni hayotim butunlay o'zgargan. Boshida oddiygina tanishuv deb o'ylagandim, lekin taqdir menga eng qimmatli insonimni uchratgan ekan." },
  "23_10": { text: "Eslaysanmi, boshida kechalari tong otguncha telefonda gaplashardik... Soat qanday 4-5 bo'lib qolganini sezmay ham qolardik. Go'shakni qo'ygimiz kelmasdi." },
  "23_11": {
    isQuestion: true,
    text: "Kichik bir xotira savoli: Boshida kim ko'proq uxlolmay, telefonni qo'yishga qizg'anardi? 😉",
    options: ["Albatta men (Farangiz) 🙈", "Yo'q, sen (Dudu) qo'ymasding 😍"]
  },
  "23_12": { text: "Har safar 'Seni yaxshi ko'raman, lekin sevmayman' deganingda ichimdan kulib qo'yardim 😄 O'sha paytdagi o'jarliklaring ham menga shunchalik yoqardi..." },
  "23_13": { text: "Lekin vaqt o'tib, ko'zlaringda sevgini ko'rgan kunim... Men uchun dunyo boshqacha rangga kirdi. Sen meni sevdirding va o'zing ham sevding." },
  "23_14": { text: "Tushlik vaqti bo'ldi, Hanuyim. Vaqtida ovqatlanib ol, o'zingni asra. Bugun ko'zguga qarab bitta jilmayib qo'yishni unutmadingmi? 😉" },
  "23_15": { text: "Sening o'sha samimiy kulging... U xuddi quyosh kabi, eng qorong'i kunimni ham yoritib yuborishga qodir. Seni har bir tabassuming uchun yaxshi ko'raman." },
  "23_16": { text: "Sen men uchun boshqalardan, hamma narsadan voz kechib: 'Menga faqat sen keraksan' deganingda... Erkak kishi uchun bundan ortiq baxt bo'lmasa kerak deb o'ylagandim." },
  "23_17": { text: "Mening erkatoy, o'jar Bubuyim... Ba'zan arazlab labingni burishtirib olishlaringni ham shunaqangi sog'indimki, buni so'z bilan aytib berolmayman." },
  "23_18": { text: "Ish yoki o'qishdan charchab qaytyapsanmi? Hamma charchoqlaringni unut. Oldinda seni juda katta bayram va alohida e'tibor kutmoqda ❤️" },
  "23_19": { text: "Kechki salqin tushdi. O'sha biz yurgan ko'chalar, kechki sokin suhbatlarimiz yodimga tushdi... Qo'llaringdan ushlab sayr qilishni juda sog'indim." },
  "23_20": { text: "Kechki choyni ichib, o'zingga dam ber. Sen bugun juda ko'p mehnat qilding va faqat iliqlikka loyiqsan, Hanuyim." },
  "23_21": { text: "Kechqurunlari hamma tinchiganida faqat sen haqingda o'ylash — kunimning eng go'zal daqiqalariga aylanadi." },
  "23_22": { text: "Osmonga qara, eng yorqin yulduz senga mendan salom yetkazsin. Seni o'ylamagan bitta ham soniyam yo'q." },
  "23_23": { text: "Bugungi kun uchun o'zingga rahmat ayt. Yaxshilab dam ol, malikam. Bu tunda ham senga eng shirin oromni tilayman." },

  // ------------------------------------------------------------
  // 24-NOYABR TUNGI SOATLAR (00:00 dan 07:00 gacha) — Ovozsiz
  // ------------------------------------------------------------
  "24_00": { silent: true, text: "🌙 Tun sokin... Bu xat telefoningni jiringlatmasdan kelmoqda. Shirin tushlar ko'rgin, mening farishtam." },
  "24_01": { silent: true, text: "🌙 Sen tinchgina orom olayotganingda ham, vaqt bizni orziqib kutilgan o'sha daqiqalarga yaqinlashtirmoqda..." },
  "24_02": { silent: true, text: "🌙 Yulduzlar sening oromingni asrasin. Sen dunyodagi eng beg'ubor tushlarga munosibsan, Hanuyim." },
  "24_03": { silent: true, text: "🌙 Tun qorong'usi ham sening qalbingdagi nur va samimiylikni to'sa olmaydi. Xotirjam uxla ❤️" },
  "24_04": { silent: true, text: "🌙 Hamma uxlagan paytda faqat bitta narsani so'rayman: yuzingdan hech qachon tabassum arimasin." },
  "24_05": { silent: true, text: "🌙 Tong yaqinlashmoqda... Tungi sukunat senga yangi kun uchun kuch va xotirjamlik bersin." },
  "24_06": { silent: true, text: "🌙 Qayerda bo'lsang ham bilib qo'y: seni har lahzada asrashga tayyor insoning bor." },
  "24_07": { silent: true, text: "🌙 Uyg'onish vaqti yaqin... Yostiqdan bosh ko'targaningda bu xatlarni o'qib bir jilmayib qo'yasan degan umiddaman 😊" },

  // ------------------------------------------------------------
  // 24-NOYABR KUNDUZI VA KECHASI (08:00 dan 23:00 gacha) — Salomatlik va g'amxo'rlik
  // ------------------------------------------------------------
  "24_08": { text: "Xayrli tong, Bubuyim! Bugungi kuning ajoyib o'tsin. Bilasanmi, har kuni ertalab seni eslab uyg'onish — mening kunimga ma'no beradi." },
  "24_09": { text: "Menda qandli diabet borligini bilganingdagi holating hamon ko'z o'ngimda... Qanchalik xavotir olganing, jon kuydirganing..." },
  "24_10": { text: "'Dudu, asabiylashmang, siqilmang, ovqatingizni vaqtida yeng' deb har soniya meni ehtiyot qilarding. O'sha mehring dunyodagi eng qimmatli dori edi menga ❤️" },
  "24_11": {
    isQuestion: true,
    text: "Dudung senga eng ko'p qaysi erkalash bilan murojaat qilgani yoqadi? 😉",
    options: ["Hanuyim 👑", "Bubuyim 🐣"]
  },
  "24_12": { text: "Hozir o'sha g'amxo'r ovozingga, 'o'zingizni ehtiyot qiling' degan jumlalaringga shunchalik muhtojman... Sening o'rningni hech kim bosa olmaydi." },
  "24_13": { text: "Tushlikni qilib ol, jonim. Vaqtida ovqatlanishni sen menga o'rgatgan eding, o'zing ham qoidani buzmaysan degan umiddaman 😉" },
  "24_14": { text: "Sen mening hayotimdagi eng nozik, eng beg'ubor va eng ehtiyot qilinishi kerak bo'lgan boyligimsan." },
  "24_15": { text: "Senga qarab: 'Xudoyim menga shunday mehribon qizni uchratgani uchun shukr' degan onlarim behisob bo'lgan." },
  "24_16": { text: "Mening yakkayu yagonam... Xarakteringdagi har bir o'jarlik ham aslida sening samimiyligingdan darak beradi." },
  "24_17": { text: "Hatto oddiy xabarlashuvlarimiz ham butun kunimni yorug' qilishga yetardi. Seni eslashning o'zi dildagi darmonim." },
  "24_18": { text: "Kechki payt bo'ldi. Ko'chada sovuq, issiq kiyinib yur. Chunki sen betob bo'lsang, mening jonim og'riydi." },
  "24_19": { text: "Kechki sokinlik tushganda sen bilan gaplashgan kunlarimiz qanchalik baxtli bo'lganini yanada chuqurroq his qilyapman." },
  "24_20": { text: "Choy ichib orom ol, Hanuyim. Vaqt shiddat bilan o'tmoqda, orziqib kutgan kunimizga juda oz qoldi ✨" },
  "24_21": { text: "Dunyoda hech narsa tasodif emas. 5-iyunda uchrashganimiz ham, bugun bir-birimizni bunchalik sog'inganimiz ham bejiz emas." },
  "24_22": { text: "Sening isming mening yuragimga shunchalik chuqur yozilganki, uni hech qanday shamol o'chira olmaydi." },
  "24_23": { text: "Yaxshi dam ol, azizam. Ertaga seni bayram arafasidagi eng hayajonli kun kutmoqda!" },

  // ------------------------------------------------------------
  // 25-NOYABR TUNGI SOATLAR (00:00 dan 07:00 gacha) — Ovozsiz
  // ------------------------------------------------------------
  "25_00": { silent: true, text: "🌙 Tun kirdi... Oxirgi 24 soat boshlandi! Bugun kechasi uxlashdan oldin barcha xafagarchiliklarni unutishga harakat qil, farishtam." },
  "25_01": { silent: true, text: "🌙 Jimjitlikda kelayotgan bu xat seni erkalab qo'ysin. Shirin orom ol, Hanuyim." },
  "25_02": { silent: true, text: "🌙 Sen uxlayapsan, Dudung esa ertangi kuning unutilmas bo'lishi haqida o'ylamoqda..." },
  "25_03": { silent: true, text: "🌙 Osmon to'la yulduz, ammo sen ularning hammasidan go'zalsan." },
  "25_04": { silent: true, text: "🌙 Tushlaringda faqat eng quvonchli lahzalarni ko'r. Barcha og'riqlar o'tib ketadi." },
  "25_05": { silent: true, text: "🌙 Tong yaqin... Ertangi kun butunlay senga bag'ishlanadi." },
  "25_06": { silent: true, text: "🌙 Qalbingda faqat huzur bo'lsin. O'zingni ehtiyot qil." },
  "25_07": { silent: true, text: "🌙 Xayrli tong arafasi... Bugun sening bayramingdan oldingi oxirgi kun boshlanmoqda!" },

  // ------------------------------------------------------------
  // 25-NOYABR KUNDUZI VA KECHASI — Pushaymonlik, tennis va katta sanoq
  // ------------------------------------------------------------
  "25_08": { text: "Xayrli tong, mening yagonam! Bugun sening tug'ilgan kuning arafasi. Yuzingda oftobdek tabassum bilan uyg'ongan bo'lsang kerak deb umid qilaman ❤️" },
  "25_09": { text: "30-oktyabr... O'sha kun mening hayotimdagi eng qora kunlardan biri bo'ldi. Sening xafa bo'lib ketganingni o'ylasam, hamon ichim yonadi." },
  "25_10": { text: "O'sha pastda tennis o'ynaganim va qizlarga salomlashib yozgan ahmoqliklarim... Bularning hammasi meni qanchalik o'ylamasdan ish qilganimni ko'rsatdi. Ming bor pushaymonman." },
  "25_11": {
    isQuestion: true,
    text: "Tennis raketkalarini nima qilaylik endi? Rostini ayt-a 😂",
    options: ["Hammasini tashlab yubor, faqat men bilan bo'l! 🎾❌", "Mayli, kechirdim, faqat men bilan o'ynaysan 🤝"]
  },
  "25_12": { text: "Tennisni ham, futbolni ham butunlay yig'ishtirishga tayyorman! Agar sening bitta mayin kulging, bitta kechirishing bo'lsa — menga boshqa hech narsa kerak emas." },
  "25_13": { text: "Sen men uchun hammadan vos kechganding... Men esa buni vaqtida to'liq qadrlay olmadim. Bu xato menga umrbod dars bo'ldi." },
  "25_14": { text: "Men senga so'z beraman, Hanuyim: bu hayotda seni hech qachon boshqa xafa qilmayman. Sening ko'zlaringda faqat quvonch bo'ladi." },
  "25_15": { text: "Kun yarmidan oshdi... Soat millari 00:00 ga qarab shiddat bilan yaqinlashmoqda. Hayajon kuchayyaptimi? 💓" },
  "25_16": { text: "Bilasanmi, sen mening dunyoyimdagi eng chiroyli ertaksan. Va bu ertak endi hech qachon to'xtamaydi." },
  "25_17": { text: "Hamma arazlaringni, ginalaringni unut. Bugun kechasi sen uchun eng unutilmas onlar boshlanadi ✨" },
  "25_18": { text: "Kechki payt... Atigi 6 soat qoldi! Dudung senga chin dildan mehr berishga oshiqmoqda." },
  "25_19": { text: "5 soat qoldi... Qani, kiyimlaringni tayyorlab, ko'zguga qarab jilmay! Bugun butun dunyo sen uchun bayram qiladi." },
  "25_20": { text: "Atigi 4 soat! Yurak urishimni eshitishingni xohlardim... Seni shunchalik qattiq yaxshi ko'ramanki, Hanuyim ❤️" },
  "25_21": { text: "⏳ 3 SOAT QOLDI! Hayajon bormi? Dudungning yuragi qinidan chiqib ketay deyapti... Tayyormisan, mening yagonam? 💓" },
  "25_22": { text: "⏳ 2 SOAT QOLDI! 5-iyundan boshlangan bu go'zal yo'limiz bugun eng sehrli cho'qqisiga chiqadi ✨" },
  "25_23": { text: "⏳ OXIRGI 1 SOAT! Chuqur nafas ol... Dudung senga tayyorlagan ssyurpriziga sanoqli daqiqalar qoldi! 10... 9... 8... ⏳🎉" }
};

// 26-NOYABR 00:00 KATTA TUG'ILGAN KUN TABRIGI VA SOVG'A
function getCelebrationMessage(name) {
  return (
    `🎉🎂 **TUG'ILGAN KUNING MUBORAK BO'LSIN, MENING HANUYIM, BUBUYIM!** 🎂🎉\n\n` +
    `2026-yil 5-iyun kuni hayotimga kirib kelganing uchun, kechalari tonggacha gaplashib chiqqan shirin tunlarimiz uchun, ` +
    `menga diabetimda ham eng katta suyanchiq bo'lib, jon kuydirib mehr berganing uchun senga ming bor rahmat! ❤️\n\n` +
    `Xatolarim, ahmoqligim va seni xafa qilgan har bir lahzam uchun chin yurakdan kechirim so'rayman. ` +
    `Sening qadring — mening nafasimdek zarur. Dunyodagi barcha tennisu futbollar, hamma narsa sening bitta mayin kulging oldida oddiy bir xazon, xolos.\n\n` +
    `Bugun sening kuning, mening yagonam! Sen faqat va faqat cheksiz baxtga loyiqsan. Seni qanchalik sevishimni va sog'inganimni so'z bilan ta'riflab bo'lmaydi.\n\n` +
    `Uzoq kutilgan on keldi... Senga tayyorlagan maxsus ssyurprizimni ochish vaqti bo'ldi! 🎁\n\n` +
    `Quyidagi tugmani bosing va o'z sovg'angizni qarshi oling: 👇`
  );
}

module.exports = {
  scheduleByHour,
  getCelebrationMessage
};
