// ============================================================
//  FARANGIZ UCHUN SOATLIK XATLAR (23-NOYABR 08:00 DAN 26-NOYABR 00:00 GACHA)
//  Ketma-ket xronologik tartibda 65 ta to'liq samimiy xat
// ============================================================

const fullScheduleMessages = [
  // ============================================================
  // 23-NOYABR (DUSHANBA) — TANISHUV VA SHIRIN BOSHLANISH
  // ============================================================
  {
    day: "23-noyabr",
    time: "08:00",
    countdown: "2 kun, 16 soat qoldi",
    text: "Xayrli tong, mening Hanuyim! Bugun ertalab ko'zingni ochganingda labingda tabassum bo'lishini xohladim. Bu xatlar shunchaki so'zlar emas, bu mening 5-iyundan beri qalbimda to'planib qolgan hislarimdir ❤️"
  },
  {
    day: "23-noyabr",
    time: "09:00",
    countdown: "2 kun, 15 soat qoldi",
    text: "2026-yil 5-iyun... Aynan shu kuni hayotim butunlay o'zgargan. Boshida oddiygina tanishuv deb o'ylagandim, lekin taqdir menga eng qimmatli insonimni uchratgan ekan."
  },
  {
    day: "23-noyabr",
    time: "10:00",
    countdown: "2 kun, 14 soat qoldi",
    text: "Eslaysanmi, boshida kechalari tong otguncha telefonda gaplashardik... Soat qanday 4-5 bo'lib qolganini sezmay ham qolardik. Go'shakni qo'ygimiz kelmasdi."
  },
  {
    day: "23-noyabr",
    time: "11:00",
    countdown: "2 kun, 13 soat qoldi",
    isQuestion: true,
    text: "Kichik bir xotira savoli: Boshida kim ko'proq uxlolmay, telefonni qo'yishga qizg'anardi? 😉",
    options: ["Albatta men (Farangiz) 🙈", "Yo'q, sen (Dudu) qo'ymasding 😍"]
  },
  {
    day: "23-noyabr",
    time: "12:00",
    countdown: "2 kun, 12 soat qoldi",
    text: "Har safar 'Seni yaxshi ko'raman, lekin sevmayman' deganingda ichimdan kulib qo'yardim 😄 O'sha paytdagi o'jarliklaring ham menga shunchalik yoqardi..."
  },
  {
    day: "23-noyabr",
    time: "13:00",
    countdown: "2 kun, 11 soat qoldi",
    text: "Lekin vaqt o'tib, ko'zlaringda sevgini ko'rgan kunim... Men uchun dunyo boshqacha rangga kirdi. Sen meni sevdirding va o'zing ham sevding."
  },
  {
    day: "23-noyabr",
    time: "14:00",
    countdown: "2 kun, 10 soat qoldi",
    text: "Tushlik vaqti bo'ldi, Hanuyim. Vaqtida ovqatlanib ol, o'zingni asra. Bugun ko'zguga qarab bitta jilmayib qo'yishni unutmadingmi? 😉"
  },
  {
    day: "23-noyabr",
    time: "15:00",
    countdown: "2 kun, 9 soat qoldi",
    text: "Sening o'sha samimiy kulging... U xuddi quyosh kabi, eng qorong'i kunimni ham yoritib yuborishga qodir. Seni har bir tabassuming uchun yaxshi ko'raman."
  },
  {
    day: "23-noyabr",
    time: "16:00",
    countdown: "2 kun, 8 soat qoldi",
    text: "Sen men uchun boshqalardan, hamma narsadan voz kechib: 'Menga faqat sen keraksan' deganingda... Erkak kishi uchun bundan ortiq baxt bo'lmasa kerak deb o'ylagandim."
  },
  {
    day: "23-noyabr",
    time: "17:00",
    countdown: "2 kun, 7 soat qoldi",
    text: "Mening erkatoy, o'jar Bubuyim... Ba'zan arazlab labingni burishtirib olishlaringni ham shunaqangi sog'indimki, buni so'z bilan aytib berolmayman."
  },
  {
    day: "23-noyabr",
    time: "18:00",
    countdown: "2 kun, 6 soat qoldi",
    text: "Ish yoki o'qishdan charchab qaytyapsanmi? Hamma charchoqlaringni unut. Oldinda seni juda katta bayram va alohida e'tibor kutmoqda ❤️"
  },
  {
    day: "23-noyabr",
    time: "19:00",
    countdown: "2 kun, 5 soat qoldi",
    text: "Kechki salqin tushdi. O'sha biz yurgan ko'chalar, kechki sokin suhbatlarimiz yodimga tushdi... Qo'llaringdan ushlab sayr qilishni juda sog'indim."
  },
  {
    day: "23-noyabr",
    time: "20:00",
    countdown: "2 kun, 4 soat qoldi",
    text: "Kechki choyni ichib, o'zingga dam ber. Sen bugun juda ko'p mehnat qilding va faqat iliqlikka loyiqsan, Hanuyim."
  },
  {
    day: "23-noyabr",
    time: "21:00",
    countdown: "2 kun, 3 soat qoldi",
    text: "Kechqurunlari hamma tinchiganida faqat sen haqingda o'ylash — kunimning eng go'zal daqiqalariga aylanadi."
  },
  {
    day: "23-noyabr",
    time: "22:00",
    countdown: "2 kun, 2 soat qoldi",
    text: "Osmonga qara, eng yorqin yulduz senga mendan salom yetkazsin. Seni o'ylamagan bitta ham soniyam yo'q."
  },
  {
    day: "23-noyabr",
    time: "23:00",
    countdown: "2 kun, 1 soat qoldi",
    text: "Bugungi kun uchun o'zingga rahmat ayt. Yaxshilab dam ol, malikam. Bu tunda ham senga eng shirin oromni tilayman."
  },

  // ============================================================
  // 24-NOYABR (SESHANBA) — G'AMXO'RLIK, MEHR VA SALOMATLIK
  // ============================================================
  {
    day: "24-noyabr",
    time: "00:00",
    countdown: "2 kun qoldi",
    silent: true,
    text: "🌙 Tun sokin... Bu xat telefoningni jiringlatmasdan kelmoqda. Shirin tushlar ko'rgin, mening farishtam."
  },
  {
    day: "24-noyabr",
    time: "01:00",
    countdown: "47 soat qoldi",
    silent: true,
    text: "🌙 Sen tinchgina orom olayotganingda ham, vaqt bizni orziqib kutilgan o'sha daqiqalarga yaqinlashtirmoqda..."
  },
  {
    day: "24-noyabr",
    time: "02:00",
    countdown: "46 soat qoldi",
    silent: true,
    text: "🌙 Yulduzlar sening oromingni asrasin. Sen dunyodagi eng beg'ubor tushlarga munosibsan, Hanuyim."
  },
  {
    day: "24-noyabr",
    time: "03:00",
    countdown: "45 soat qoldi",
    silent: true,
    text: "🌙 Tun qorong'usi ham sening qalbingdagi nur va samimiylikni to'sa olmaydi. Xotirjam uxla ❤️"
  },
  {
    day: "24-noyabr",
    time: "04:00",
    countdown: "44 soat qoldi",
    silent: true,
    text: "🌙 Hamma uxlagan paytda faqat bitta narsani so'rayman: yuzingdan hech qachon tabassum arimasin."
  },
  {
    day: "24-noyabr",
    time: "05:00",
    countdown: "43 soat qoldi",
    silent: true,
    text: "🌙 Tong yaqinlashmoqda... Tungi sukunat senga yangi kun uchun kuch va xotirjamlik bersin."
  },
  {
    day: "24-noyabr",
    time: "06:00",
    countdown: "42 soat qoldi",
    silent: true,
    text: "🌙 Qayerda bo'lsang ham bilib qo'y: seni har lahzada asrashga tayyor insoning bor."
  },
  {
    day: "24-noyabr",
    time: "07:00",
    countdown: "41 soat qoldi",
    silent: true,
    text: "🌙 Uyg'onish vaqti yaqin... Yostiqdan bosh ko'targaningda bu xatlarni o'qib bir jilmayib qo'yasan degan umiddaman 😊"
  },
  {
    day: "24-noyabr",
    time: "08:00",
    countdown: "40 soat qoldi",
    text: "Xayrli tong, Bubuyim! Bugungi kuning ajoyib o'tsin. Bilasanmi, har kuni ertalab seni eslab uyg'onish — mening kunimga ma'no beradi."
  },
  {
    day: "24-noyabr",
    time: "09:00",
    countdown: "39 soat qoldi",
    text: "Menda qandli diabet borligini bilganingdagi holating hamon ko'z o'ngimda... Qanchalik xavotir olganing, jon kuydirganing..."
  },
  {
    day: "24-noyabr",
    time: "10:00",
    countdown: "38 soat qoldi",
    text: "'Dudu, asabiylashmang, siqilmang, ovqatingizni vaqtida yeng' deb har soniya meni ehtiyot qilarding. O'sha mehring dunyodagi eng qimmatli dori edi menga ❤️"
  },
  {
    day: "24-noyabr",
    time: "11:00",
    countdown: "37 soat qoldi",
    isQuestion: true,
    text: "Dudung senga eng ko'p qaysi erkalash bilan murojaat qilgani yoqadi? 😉",
    options: ["Hanuyim 👑", "Bubuyim 🐣"]
  },
  {
    day: "24-noyabr",
    time: "12:00",
    countdown: "36 soat qoldi",
    text: "Hozir o'sha g'amxo'r ovozingga, 'o'zingizni ehtiyot qiling' degan jumlalaringga shunchalik muhtojman... Sening o'rningni hech kim bosa olmaydi."
  },
  {
    day: "24-noyabr",
    time: "13:00",
    countdown: "35 soat qoldi",
    text: "Tushlikni qilib ol, jonim. Vaqtida ovqatlanishni sen menga o'rgatgan eding, o'zing ham qoidani buzmaysan degan umiddaman 😉"
  },
  {
    day: "24-noyabr",
    time: "14:00",
    countdown: "34 soat qoldi",
    text: "Sen mening hayotimdagi eng nozik, eng beg'ubor va eng ehtiyot qilinishi kerak bo'lgan boyligimsan."
  },
  {
    day: "24-noyabr",
    time: "15:00",
    countdown: "33 soat qoldi",
    text: "Senga qarab: 'Xudoyim menga shunday mehribon qizni uchratgani uchun shukr' degan onlarim behisob bo'lgan."
  },
  {
    day: "24-noyabr",
    time: "16:00",
    countdown: "32 soat qoldi",
    text: "Mening yakkayu yagonam... Xarakteringdagi har bir o'jarlik ham aslida sening samimiyligingdan darak beradi."
  },
  {
    day: "24-noyabr",
    time: "17:00",
    countdown: "31 soat qoldi",
    text: "Hatto oddiy xabarlashuvlarimiz ham butun kunimni yorug' qilishga yetardi. Seni eslashning o'zi dildagi darmonim."
  },
  {
    day: "24-noyabr",
    time: "18:00",
    countdown: "30 soat qoldi",
    text: "Kechki payt bo'ldi. Ko'chada sovuq, issiq kiyinib yur. Chunki sen betob bo'lsang, mening jonim og'riydi."
  },
  {
    day: "24-noyabr",
    time: "19:00",
    countdown: "29 soat qoldi",
    text: "Kechki sokinlik tushganda sen bilan gaplashgan kunlarimiz qanchalik baxtli bo'lganini yanada chuqurroq his qilyapman."
  },
  {
    day: "24-noyabr",
    time: "20:00",
    countdown: "28 soat qoldi",
    text: "Choy ichib orom ol, Hanuyim. Vaqt shiddat bilan o'tmoqda, orziqib kutgan kunimizga juda oz qoldi ✨"
  },
  {
    day: "24-noyabr",
    time: "21:00",
    countdown: "27 soat qoldi",
    text: "Dunyoda hech narsa tasodif emas. 5-iyunda uchrashganimiz ham, bugun bir-birimizni bunchalik sog'inganimiz ham bejiz emas."
  },
  {
    day: "24-noyabr",
    time: "22:00",
    countdown: "26 soat qoldi",
    text: "Sening isming mening yuragimga shunchalik chuqur yozilganki, uni hech qanday shamol o'chira olmaydi."
  },
  {
    day: "24-noyabr",
    time: "23:00",
    countdown: "25 soat qoldi",
    text: "Yaxshi dam ol, azizam. Ertaga seni bayram arafasidagi eng hayajonli kun kutmoqda!"
  },

  // ============================================================
  // 25-NOYABR (CHORSHANBA) — PUSHAYMONLIK, TENNIS VA KATTA SANOQ
  // ============================================================
  {
    day: "25-noyabr",
    time: "00:00",
    countdown: "24 soat qoldi",
    silent: true,
    text: "🌙 Tun kirdi... Oxirgi 24 soat boshlandi! Bugun kechasi uxlashdan oldin barcha xafagarchiliklarni unutishga harakat qil, farishtam."
  },
  {
    day: "25-noyabr",
    time: "01:00",
    countdown: "23 soat qoldi",
    silent: true,
    text: "🌙 Jimjitlikda kelayotgan bu xat seni erkalab qo'ysin. Shirin orom ol, Hanuyim."
  },
  {
    day: "25-noyabr",
    time: "02:00",
    countdown: "22 soat qoldi",
    silent: true,
    text: "🌙 Sen uxlayapsan, Dudung esa ertangi kuning unutilmas bo'lishi haqida o'ylamoqda..."
  },
  {
    day: "25-noyabr",
    time: "03:00",
    countdown: "21 soat qoldi",
    silent: true,
    text: "🌙 Osmon to'la yulduz, ammo sen ularning hammasidan go'zalsan."
  },
  {
    day: "25-noyabr",
    time: "04:00",
    countdown: "20 soat qoldi",
    silent: true,
    text: "🌙 Tushlaringda faqat eng quvonchli lahzalarni ko'r. Barcha og'riqlar o'tib ketadi."
  },
  {
    day: "25-noyabr",
    time: "05:00",
    countdown: "19 soat qoldi",
    silent: true,
    text: "🌙 Tong yaqin... Ertangi kun butunlay senga bag'ishlanadi."
  },
  {
    day: "25-noyabr",
    time: "06:00",
    countdown: "18 soat qoldi",
    silent: true,
    text: "🌙 Qalbingda faqat huzur bo'lsin. O'zingni ehtiyot qil."
  },
  {
    day: "25-noyabr",
    time: "07:00",
    countdown: "17 soat qoldi",
    silent: true,
    text: "🌙 Xayrli tong arafasi... Bugun sening bayramingdan oldingi oxirgi kun boshlanmoqda!"
  },
  {
    day: "25-noyabr",
    time: "08:00",
    countdown: "16 soat qoldi",
    text: "Xayrli tong, mening yagonam! Bugun sening tug'ilgan kuning arafasi. Yuzingda oftobdek tabassum bilan uyg'ongan bo'lsang kerak deb umid qilaman ❤️"
  },
  {
    day: "25-noyabr",
    time: "09:00",
    countdown: "15 soat qoldi",
    text: "30-oktyabr... O'sha kun mening hayotimdagi eng qora kunlardan biri bo'ldi. Sening xafa bo'lib ketganingni o'ylasam, hamon ichim yonadi."
  },
  {
    day: "25-noyabr",
    time: "10:00",
    countdown: "14 soat qoldi",
    text: "O'sha pastda tennis o'ynaganim va qizlarga salomlashib yozgan ahmoqliklarim... Bularning hammasi meni qanchalik o'ylamasdan ish qilganimni ko'rsatdi. Ming bor pushaymonman."
  },
  {
    day: "25-noyabr",
    time: "11:00",
    countdown: "13 soat qoldi",
    isQuestion: true,
    text: "Tennis raketkalarini nima qilaylik endi? Rostini ayt-a 😂",
    options: ["Hammasini tashlab yubor, faqat men bilan bo'l! 🎾❌", "Mayli, kechirdim, faqat men bilan o'ynaysan 🤝"]
  },
  {
    day: "25-noyabr",
    time: "12:00",
    countdown: "12 soat qoldi",
    text: "Tennisni ham, futbolni ham butunlay yig'ishtirishga tayyorman! Agar sening bitta mayin kulging, bitta kechirishing bo'lsa — menga boshqa hech narsa kerak emas."
  },
  {
    day: "25-noyabr",
    time: "13:00",
    countdown: "11 soat qoldi",
    text: "Sen men uchun hammadan vos kechganding... Men esa buni vaqtida to'liq qadrlay olmadim. Bu xato menga umrbod dars bo'ldi."
  },
  {
    day: "25-noyabr",
    time: "14:00",
    countdown: "10 soat qoldi",
    text: "Men senga so'z beraman, Hanuyim: bu hayotda seni hech qachon boshqa xafa qilmayman. Sening ko'zlaringda faqat quvonch bo'ladi."
  },
  {
    day: "25-noyabr",
    time: "15:00",
    countdown: "9 soat qoldi",
    text: "Kun yarmidan oshdi... Soat millari 00:00 ga qarab shiddat bilan yaqinlashmoqda. Hayajon kuchayyaptimi? 💓"
  },
  {
    day: "25-noyabr",
    time: "16:00",
    countdown: "8 soat qoldi",
    text: "Bilasanmi, sen mening dunyoyimdagi eng chiroyli ertaksan. Va bu ertak endi hech qachon to'xtamaydi."
  },
  {
    day: "25-noyabr",
    time: "17:00",
    countdown: "7 soat qoldi",
    text: "Hamma arazlaringni, ginalaringni unut. Bugun kechasi sen uchun eng unutilmas onlar boshlanadi ✨"
  },
  {
    day: "25-noyabr",
    time: "18:00",
    countdown: "6 soat qoldi",
    text: "Kechki payt... Atigi 6 soat qoldi! Dudung senga chin dildan mehr berishga oshiqmoqda."
  },
  {
    day: "25-noyabr",
    time: "19:00",
    countdown: "5 soat qoldi",
    text: "5 soat qoldi... Qani, kiyimlaringni tayyorlab, ko'zguga qarab jilmay! Bugun butun dunyo sen uchun bayram qiladi."
  },
  {
    day: "25-noyabr",
    time: "20:00",
    countdown: "4 soat qoldi",
    text: "Atigi 4 soat! Yurak urishimni eshitishingni xohlardim... Seni shunchalik qattiq yaxshi ko'ramanki, Hanuyim ❤️"
  },
  {
    day: "25-noyabr",
    time: "21:00",
    countdown: "3 soat qoldi",
    text: "⏳ 3 SOAT QOLDI! Hayajon bormi? Dudungning yuragi qinidan chiqib ketay deyapti... Tayyormisan, mening yagonam? 💓"
  },
  {
    day: "25-noyabr",
    time: "22:00",
    countdown: "2 soat qoldi",
    text: "⏳ 2 SOAT QOLDI! 5-iyundan boshlangan bu go'zal yo'limiz bugun eng sehrli cho'qqisiga chiqadi ✨"
  },
  {
    day: "25-noyabr",
    time: "23:00",
    countdown: "Oxirgi 1 soat qoldi!",
    text: "⏳ OXIRGI 1 SOAT! Chuqur nafas ol... Dudung senga tayyorlagan ssyurpriziga sanoqli daqiqalar qoldi! 10... 9... 8... ⏳🎉"
  }
];

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
  fullScheduleMessages,
  getCelebrationMessage
};
