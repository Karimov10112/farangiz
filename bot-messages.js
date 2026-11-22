// ============================================================
//  TELEGRAM BOT XABARLARI (Farangiz uchun maxsus)
//  Har soatda bitta sirli va samimiy xat yuboriladi.
// ============================================================

const dayMessages = [
  "Har safar tabassumingni ko'rganimda, butun dunyo to'xtab qolgandek bo'ladi. Bugun ham ko'zguga qarab bir jilmayib qo'y, xo'pmi? ❤️",
  "Seni sevishimning yana bir sababi: sen hatto oddiy lahzalarni ham unutilmas ertakka aylantira olasan.",
  "Ko'chalarda yurganimda ham xayolimda faqat sensan. Sening bitta kulging men uchun eng katta quvonch.",
  "Bilasanmi, sen bilan o'tgan har bir daqiqa — mening hayotimdagi eng qimmatli xotiraga aylanadi.",
  "Dunyoda milliardlab odamlar bor, lekin faqat sen mening yuragimga shunchalik yaqin bo'la olgansan.",
  "Bugun kayfiyating a'lo bo'lsin! Sening xursand yurishing — mening eng katta tilagim.",
  "O'zingni ehtiyot qil, chunki sen kimgadir butun bir dunyosan...",
  "Hozir nima bilan bandsan bilmayman, lekin bilib qo'y: hozir ham seni kimdir juda qattiq yaxshi ko'radi.",
  "Qayerda bo'lsang ham, mening qalbim va xayollarim doim sen bilan birga yuradi, Hanuyim.",
  "Sening ovozing, qarashing va samimiyliging... har safar xuddi birinchi marta sevib qolgandek his qilaman.",
  "Xafa bo'lishga yoki charchashga haqqing yo'q — chunki oldinda bizni juda ko'p shirin kunlar kutmoqda!",
  "Seni uchratgan kunim — taqdirim menga bergan eng katta tuhfasi bo'lgan.",
  "Bilasanmi, sen kulganingda ko'zlaringda chaqnagan o'sha nur butun olamni yoritib yuborishi mumkin.",
  "Hatto eng oddiy suhbatlarimiz ham mening kunimni eng yorug' kuniga aylantiradi.",
  "Senga bir sir aytaymi? Sen tasavvur qilganingdan ham ming chandon chiroyliroq va azizroqsan.",
  "Ko'p narsa kerak emas — shunchaki sening borliging va tabassuming mening baxtim uchun yetarli.",
  "Har bir yangi kun sen bilan boshlansa, bu hayot yanada go'zalroq tuyuladi.",
  "Sening erkaliklaring, arazlaring ham mening yuragimga yoqadi — sen har qanday holatda ham betakrorsan.",
  "Bugun qiyinroq tuyulsa ham tushkunlikka tushma, sen eng kuchli va eng mehribon qizsan!",
  "Senga qarab to'ymayman deganlari rost ekan... xayolan bo'lsa ham yoningdaman.",
  "Sening kulging — xuddi bahor yomg'iridek, atrofga faqat hayot va iliqlik bag'ishlaydi.",
  "Mening erkatoy, shirin va o'jar malikam, bugun ko'proq suv ich va o'zingni asra 😉",
  "Yurak urishimning har bir zarbasida sening isming jaranglaydi desam ishonasanmi? ❤️",
  "Ba'zan o'ylab qolaman: sen bo'lmaganingda men qanday yashardim? Xudoga shukurki, sen borsan.",
  "Bugun shunday chiroyli kiyinib olgansanki, hatto quyosh ham senga havas bilan qarayapti deb o'ylayman.",
  "Seni har bir xaraktering, har bir nigohing bilan boricha sevaman.",
  "Orzularing sari intil, men esa senga doim suyanchiq va eng katta muxlising bo'lib qolaman.",
  "Ko'nglingni hech narsa xira qilmasin, yuzingdan tabassum hech qachon arimasin, sevgilim.",
  "Seni sevish — bu shunchaki his emas, bu mening eng to'g'ri tanlovim va hayotiy baxtim.",
  "Yana ozgina sabr qil... juda tez orada eng ajoyib kun boshlanadi! ✨"
];

const eveningMessages = [
  "Kechki salqin tushdi. Bugungi kuning qanday o'tgan bo'lmasin, barcha charchoqlarni unut — oldinda bayram!",
  "Kechki choyni ichib, o'zingga dam ber. Sen bugun juda ko'p mehnat qilding va dam olishga munosibsan ❤️",
  "Kechki osmondagi yulduzlar sen uchun yonayotgandek tuyuladi menga.",
  "Charchagan bo'lsang ham, jilmayib qo'y. Sening bitta kulging mening butun charchog'imni yuvib ketadi.",
  "Kechqurunlari sokinlikda faqat sen haqingda o'ylash — kunimning eng sevimli qismi.",
  "Bugun kechasi orom ol, yaxshilab dam ol, malikam. Har bir soniya bizni o'sha kunga yaqinlashtirmoqda.",
  "Sening xotirang bilan o'tgan har bir oqshom — dildagi iliqlik demakdir.",
  "Osmonga qara, eng yorqin yulduz senga mendan salom yetkazadi ✨",
  "Bugungi kuning uchun o'zingga rahmat ayt va ertaga undan-da go'zal kun bo'lishiga ishon.",
  "Kechki salqinda sening qo'llaringni ushlab sayr qilishni qanchalik sog'inganimni bilsang edi...",
  "Hamma narsa o'z vaqtida chiroyli. Bizning eng chiroyli onimiz esa juda-juda yaqin!",
  "Kuning qanday o'tdi? Umid qilamanki, labingdan tabassum tushmadi 😊",
  "Ko'zlaringni yumganda yuragingda paydo bo'ladigan iliqlik — bu mening mehrim.",
  "Kechki payt telefoningga kelgan ushbu xat — senga yaxshi kayfiyat ulashish uchun kichik bir sabab bo'lsin.",
  "Sen mening har bir oqshomimning eng sokin va eng go'zal xayolisan."
];

const nightMessages = [
  "🌙 Tun sokin, hamma uxladi... Sen ham shirin tushlar ko'rib, osoyishta orom ol. Xayrli tun, farishtam.",
  "🌙 Senga shirin-shirin tushlar tilayman. Tushlaringda faqat eng quvonchli orzularingni ko'rgin.",
  "🌙 Bu xat jimjitlikda, seni uyg'otmasdan kelyapti. Ertalab uyg'onganingda jilmayib o'qishing uchun...",
  "🌙 Hamma uxlagan paytda ham, soat millari bizni kutayotgan o'sha sehrli daqiqalarga yaqinlashtirmoqda.",
  "🌙 Yulduzlar sening oromingni qo'riqlasin. Sen dunyodagi eng go'zal tushlarga loyiqsan.",
  "🌙 Tun qorong'usi ham sening qalbingdagi yorug'likni to'sa olmaydi. Shirin uyqu tilayman ❤️",
  "🌙 Qayerda bo'lsang ham, o'zingni xotirjam his qil. Seni juda qadrlaydigan inson bor.",
  "🌙 Uyquing shirin, tushlaring rangin bo'lsin. Ertaga yana bir ajoyib kun kutmoqda.",
  "🌙 Osmon to'la yulduz, ammo sen ularning hammasidan go'zalsan. Xayrli orom...",
  "🌙 Tun sukunati senga huzur va yangi kuch-quvvat bersin. O'zingni ehtiyot qil, Hanuyim.",
  "🌙 Yostiqqa bosh qo'yganingda dilingdagi barcha xavotirlar yo'qolsin. Sen bilan doim hammasi yaxshi bo'ladi.",
  "🌙 Bu tunda ham qalbim senga osoyishtalik tilaydi. Ertalabgacha shirin uyqu...",
  "🌙 Vaqt bir zumga ham to'xtamaydi... Har bir soniya bizni orziqib kutilgan onga yaqinlashtirmoqda.",
  "🌙 Tun pardasi ostida qoldirilgan eng samimiy mehrim senga hamroh bo'lsin.",
  "🌙 Shunchaki shirin orom ol... Ertangi kun sen uchun yana bir quvonch olib kelsin."
];

const interactiveQuestions = [
  {
    text: "Kichik bir qiziq savol: Hozir nima qilishni ko'proq xohlarding? 😉",
    options: ["Issiq kofe va shirinlik ☕", "Musiqa eshitib sayr qilish 🎧"]
  },
  {
    text: "Senga qaysi fasl ko'proq yoqadi? 🍂",
    options: ["Oltin kuz fasli 🍁", "Gullagan bahor fasli 🌸"]
  },
  {
    text: "Agar hozir sehrli tayoqchang bo'lsa, qayerga uchib ketarding? ✨",
    options: ["Dengiz bo'yiga 🌊", "Tinch tog' bag'riga 🏔️"]
  },
  {
    text: "Bugungi kayfiyatingni qaysi emoji ifodalaydi? 😄",
    options: ["Juda xursandman 🥰", "Charchaganman, lekin kulyapman 😴"]
  },
  {
    text: "Kechki payt uchun qaysi biri zo'r? 🎬",
    options: ["Qiziqarli film ko'rish 🍿", "Sokin musiqa tinglash 🎶"]
  }
];

// So'nggi soatlardagi maxsus xabarlar
const finalHoursMessages = {
  3: "Qolgan vaqt: atigi 3 soat! Hayajon bormi? Yuragim tezroq ura boshladi... 💓",
  2: "Qolgan vaqt: 2 soat! Bugun butun dunyo sen uchun bayram qilishga tayyorlanmoqda ✨",
  1: "Oxirgi 1 soat qoldi! Qani, chuqur nafas ol... Juda oz qoldi, malikam! ⏳🎉",
  0: "Bir necha daqiqalar qoldi! Sanoq boshlandi... 10... 9... 8... 3... 2... 1... 🚀"
};

// 26-noyabr 00:00 da chiqadigan eng oxirgi katta tabrik
function getCelebrationMessage(name) {
  return (
    `🎉🎂 **TUG'ILGAN KUNING MUBORAK BO'LSIN, ${name.toUpperCase()}!** 🎂🎉\n\n` +
    `Bugun sening eng maxsus, eng sehrli va eng yorug' kuning! Dunyoga kelganing va hayotimda bor bo'lganing uchun cheksiz minnatdorman. ` +
    `Har bir orzung amalga oshsin, yuzingdagi kulgi hech qachon so'nmasin! ❤️\n\n` +
    `Uzoq kutilgan on keldi... Senga tayyorlagan maxsus sovg'amni ochish vaqti bo'ldi! 🎁\n\n` +
    `Quyidagi tugmani bosing va o'z ssyurprizingizni qarshi oling: 👇`
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
