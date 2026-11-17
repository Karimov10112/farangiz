// =========================================================
//  TUG'ILGAN KUN SSYURPRIZ SAYTI - FRONTEND KODI
//  Farangiz uchun maxsus sehrli effektlar bilan
// =========================================================

const $ = (s) => document.querySelector(s);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let content = null;
let currentScene = "lock";

function showScene(id) {
  currentScene = id;
  document.querySelectorAll(".scene").forEach((s) => s.classList.remove("active"));
  const target = $("#" + id);
  if (target) target.classList.add("active");
}

/* =========================================================
   FON: YULDUZLI OSMON VA CINEMATIC ISMNI YIG'ISH
   ========================================================= */
const bgCanvas = $("#bg");
const bctx = bgCanvas.getContext("2d");
let W = window.innerWidth;
let H = window.innerHeight;
let DPR = Math.min(window.devicePixelRatio || 1, 2);

let stars = [];
let formMode = false;
let namePoints = [];
let shockwaveRadius = 0;
let shockwaveActive = false;
// Ism yulduzlardan yig'iladigan balandlik (toj va matn qutisi ostida turishi uchun)
const NAME_Y = 0.6;

function resize() {
  DPR = Math.min(window.devicePixelRatio || 1, 2);
  W = window.innerWidth;
  H = window.innerHeight;
  
  [bgCanvas, fxCanvas].forEach((c) => {
    c.width = W * DPR;
    c.height = H * DPR;
    c.getContext("2d").setTransform(DPR, 0, 0, DPR, 0, 0);
  });
}

function makeStars() {
  const count = Math.round(Math.min(500, (W * H) / 1800));
  stars = Array.from({ length: count }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    baseR: Math.random() * 1.4 + 0.4,
    r: Math.random() * 1.4 + 0.4,
    t: Math.random() * Math.PI * 2,
    speed: 0.015 + Math.random() * 0.03,
    alpha: 0.4,
    tx: null,
    ty: null,
    angle: Math.random() * Math.PI * 2,
    radius: Math.random() * W * 0.8,
    isNamePart: false,
    color: "#ffffff",
  }));
}

function drawBg() {
  bctx.clearRect(0, 0, W, H);

  // Koinot tumanligi (Galaktika nuri)
  if (formMode) {
    const grad = bctx.createRadialGradient(W / 2, H * NAME_Y, 10, W / 2, H * NAME_Y, W * 0.65);
    grad.addColorStop(0, "rgba(255, 143, 184, 0.15)");
    grad.addColorStop(0.5, "rgba(100, 30, 160, 0.08)");
    grad.addColorStop(1, "transparent");
    bctx.fillStyle = grad;
    bctx.fillRect(0, 0, W, H);
  }

  // Shockwave to'lqini
  if (shockwaveActive) {
    shockwaveRadius += (W * 0.8 - shockwaveRadius) * 0.08;
    bctx.beginPath();
    bctx.arc(W / 2, H * NAME_Y, shockwaveRadius, 0, Math.PI * 2);
    bctx.strokeStyle = `rgba(255, 217, 138, ${Math.max(0, 1 - shockwaveRadius / (W * 0.8))})`;
    bctx.lineWidth = 4;
    bctx.stroke();
    if (shockwaveRadius >= W * 0.78) shockwaveActive = false;
  }

  for (let i = 0; i < stars.length; i++) {
    const st = stars[i];
    st.t += st.speed;

    if (formMode && st.tx != null) {
      // Kinematik silliq tortilish + mayin tebranish
      st.x += (st.tx - st.x) * 0.065;
      st.y += (st.ty - st.y) * 0.065;
      st.alpha += (0.95 - st.alpha) * 0.05;
      st.r = 1.6 + Math.sin(st.t * 2) * 0.6; // Ism harflari oltindek miltillaydi
      st.color = i % 3 === 0 ? "#ff8fb8" : "#ffd98a";
    } else if (formMode && st.tx == null) {
      st.alpha += (0.08 - st.alpha) * 0.04;
      st.color = "#ffffff";
    } else {
      st.alpha = 0.3 + Math.sin(st.t) * 0.35;
      st.r = st.baseR;
      st.color = "#ffffff";
    }

    bctx.beginPath();
    bctx.arc(st.x, st.y, Math.max(0.2, st.r), 0, Math.PI * 2);
    bctx.fillStyle = st.color;
    bctx.globalAlpha = Math.max(0, Math.min(1, st.alpha));

    if (formMode && st.tx != null) {
      bctx.shadowBlur = 10;
      bctx.shadowColor = "#ffd98a";
    }

    bctx.fill();
    bctx.shadowBlur = 0;
  }
  bctx.globalAlpha = 1;

  if (Math.random() < 0.003 && !formMode) {
    shootingStar();
  }

  requestAnimationFrame(drawBg);
}

// Ismni Great Vibes shriftida rasterizatsiya qilib yulduzlarni yig'ish
function formName(text) {
  const off = document.createElement("canvas");
  off.width = W;
  off.height = H;
  const o = off.getContext("2d");

  const fontSize = Math.min(W / (Math.max(4, text.length) * 0.5), H * 0.28);
  o.font = `600 ${fontSize}px "Great Vibes", cursive, sans-serif`;
  o.textAlign = "center";
  o.textBaseline = "middle";
  o.fillStyle = "#ffffff";
  o.fillText(text, W / 2, H * NAME_Y);

  const imgData = o.getImageData(0, 0, W, H).data;
  namePoints = [];
  const step = Math.max(2, Math.round(fontSize / 30));

  for (let y = 0; y < H; y += step) {
    for (let x = 0; x < W; x += step) {
      const idx = (y * W + x) * 4;
      if (imgData[idx + 3] > 110) {
        namePoints.push({ x, y });
      }
    }
  }

  namePoints.sort(() => Math.random() - 0.5);

  const needed = Math.min(namePoints.length, 1400);

  // Yulduzlar sonini ko'paytirish
  while (stars.length < needed) {
    stars.push({
      x: Math.random() * W,
      y: Math.random() * H,
      baseR: 1.3,
      r: 1.3,
      t: Math.random() * Math.PI * 2,
      speed: 0.02,
      alpha: 0.2,
      tx: null,
      ty: null,
      isNamePart: false,
      color: "#ffd98a",
    });
  }

  // Har bir yulduz markazdan spiral orqali ismga keladi
  stars.forEach((st, i) => {
    if (i < needed) {
      st.tx = namePoints[i].x;
      st.ty = namePoints[i].y;
      st.isNamePart = true;
    } else {
      st.tx = null;
      st.ty = null;
      st.isNamePart = false;
    }
  });

  formMode = true;

  // 1.5 soniyadan so'ng katta shockwave va salyut
  setTimeout(() => {
    shockwaveRadius = 10;
    shockwaveActive = true;
    firework(W / 2, H * NAME_Y);
    confetti(120);

    if (navigator.vibrate) {
      try { navigator.vibrate([100, 50, 150]); } catch (_) {}
    }

    $("#name-crown-wrap").classList.remove("hidden");

    // Poetic kunlar hisoblagichini hisoblash va ko'rsatish
    setTimeout(() => {
      const BORN = new Date("2007-11-26T00:00:00+05:00").getTime();
      const MET  = new Date("2026-06-05T00:00:00+05:00").getTime();
      const NOW  = Date.now();

      const bornDays = Math.floor((NOW - BORN) / 86400000);
      const metDays  = Math.floor((NOW - MET)  / 86400000);

      const line1El = $("#crown-days-line1");
      const line2El = $("#crown-days-line2");
      const poemEl  = $("#crown-days-poem");

      line1El.textContent =
        `Sen dunyoga kelganingga ${bornDays.toLocaleString()} kun bo'ldi...`;
      line2El.textContent =
        `Lekin mening hayotim sen bilan o'tgan shu ${metDays} kundan boshlab haqiqiy hayotga aylandi. ❤️`;

      poemEl.classList.remove("hidden");
      poemEl.classList.add("poem-reveal");
    }, 800);
  }, 1400);
}

/* =========================================================
   EFFEKTLAR: SALYUT, KONFETTI, METEOR VA SEHRLI BARMOQ IZI
   ========================================================= */
const fxCanvas = $("#fx");
const fctx = fxCanvas.getContext("2d");
let particles = [];
let fxRunning = false;
const FX_COLORS = ["#ffd98a", "#ff8fb8", "#ffffff", "#8ec5ff", "#c89bff", "#ff6b8b", "#ffe57f"];

// Sehrli barmoq izi (Magic Touch Trail)
function addTouchParticles(x, y) {
  for (let i = 0; i < 3; i++) {
    particles.push({
      kind: Math.random() < 0.4 ? "touchHeart" : "touchSpark",
      x: x + (Math.random() - 0.5) * 14,
      y: y + (Math.random() - 0.5) * 14,
      vx: (Math.random() - 0.5) * 1.5,
      vy: -1 - Math.random() * 1.5,
      size: 3 + Math.random() * 5,
      life: 28 + Math.random() * 12,
      maxLife: 40,
      color: FX_COLORS[(Math.random() * FX_COLORS.length) | 0],
    });
  }
  triggerFxLoop();
}

window.addEventListener("touchmove", (e) => {
  if (e.touches && e.touches[0]) {
    addTouchParticles(e.touches[0].clientX, e.touches[0].clientY);
  }
}, { passive: true });

window.addEventListener("mousemove", (e) => {
  if (Math.random() < 0.5) {
    addTouchParticles(e.clientX, e.clientY);
  }
});

function shootingStar() {
  const startX = Math.random() * W * 0.75;
  const startY = Math.random() * H * 0.35;
  particles.push({
    kind: "meteor",
    x: startX,
    y: startY,
    vx: 8 + Math.random() * 4,
    vy: 3.5 + Math.random() * 2.5,
    life: 38,
    maxLife: 38,
    color: "#fff",
  });
  triggerFxLoop();
}

function firework(x, y) {
  const color = FX_COLORS[(Math.random() * FX_COLORS.length) | 0];
  const count = 85;
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count;
    const speed = 2 + Math.random() * 4.8;
    particles.push({
      kind: "spark",
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 65 + Math.random() * 35,
      maxLife: 100,
      color,
    });
  }
  triggerFxLoop();
}

function confetti(amount = 140) {
  for (let i = 0; i < amount; i++) {
    particles.push({
      kind: "confetti",
      x: Math.random() * W,
      y: -20 - Math.random() * H * 0.4,
      vx: (Math.random() - 0.5) * 2.5,
      vy: 2.2 + Math.random() * 3.2,
      rot: Math.random() * 6,
      vr: (Math.random() - 0.5) * 0.25,
      w: 6 + Math.random() * 6,
      h: 8 + Math.random() * 8,
      color: FX_COLORS[(Math.random() * FX_COLORS.length) | 0],
      life: 360,
      maxLife: 360,
    });
  }
  triggerFxLoop();
}

function triggerFxLoop() {
  if (fxRunning) return;
  fxRunning = true;

  const loop = () => {
    fctx.clearRect(0, 0, W, H);
    particles = particles.filter((p) => p.life > 0 && p.y < H + 50);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.life--;

      if (p.kind === "spark") {
        p.vx *= 0.965;
        p.vy = p.vy * 0.965 + 0.055;
        p.x += p.vx;
        p.y += p.vy;

        fctx.globalAlpha = Math.max(0, p.life / p.maxLife);
        fctx.fillStyle = p.color;
        fctx.beginPath();
        fctx.arc(p.x, p.y, 2.2, 0, Math.PI * 2);
        fctx.fill();
      } else if (p.kind === "touchSpark") {
        p.x += p.vx;
        p.y += p.vy;
        fctx.globalAlpha = p.life / p.maxLife;
        fctx.fillStyle = p.color;
        fctx.beginPath();
        fctx.arc(p.x, p.y, Math.max(0, p.size * (p.life / p.maxLife)), 0, Math.PI * 2);
        fctx.fill();
      } else if (p.kind === "touchHeart") {
        p.x += p.vx;
        p.y += p.vy;
        fctx.globalAlpha = p.life / p.maxLife;
        fctx.font = `${p.size * 2}px sans-serif`;
        fctx.fillText("❤️", p.x, p.y);
      } else if (p.kind === "confetti") {
        p.x += p.vx + Math.sin(p.y / 28) * 0.8;
        p.y += p.vy;
        p.rot += p.vr;

        fctx.globalAlpha = Math.min(1, p.life / 30);
        fctx.save();
        fctx.translate(p.x, p.y);
        fctx.rotate(p.rot);
        fctx.fillStyle = p.color;
        fctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.rot)));
        fctx.restore();
      } else if (p.kind === "meteor") {
        p.x += p.vx;
        p.y += p.vy;

        const tailLen = 14;
        const grad = fctx.createLinearGradient(p.x, p.y, p.x - p.vx * tailLen, p.y - p.vy * tailLen);
        grad.addColorStop(0, `rgba(255, 255, 255, ${p.life / p.maxLife})`);
        grad.addColorStop(1, "rgba(255, 255, 255, 0)");

        fctx.globalAlpha = 1;
        fctx.strokeStyle = grad;
        fctx.lineWidth = 2.2;
        fctx.beginPath();
        fctx.moveTo(p.x, p.y);
        fctx.lineTo(p.x - p.vx * tailLen, p.y - p.vy * tailLen);
        fctx.stroke();
      }
    }

    fctx.globalAlpha = 1;

    if (particles.length > 0) {
      requestAnimationFrame(loop);
    } else {
      fxRunning = false;
      fctx.clearRect(0, 0, W, H);
    }
  };

  loop();
}

async function fireworkShow(seconds = 5) {
  const endTime = Date.now() + seconds * 1000;
  while (Date.now() < endTime) {
    const rx = W * (0.15 + Math.random() * 0.7);
    const ry = H * (0.12 + Math.random() * 0.38);
    firework(rx, ry);
    await sleep(320 + Math.random() * 420);
  }
}

/* =========================================================
   MUSIQA BOSHQARUVI
   ========================================================= */
const musicAudio = $("#music");
const musicToggleBtn = $("#music-toggle");
const musicIcon = $("#music-icon");
let isAudioMuted = false;
let musicLoaded = false;

let musicPrefetch = null;

// Musiqani oldindan to'liq yuklab olish (iPhone'da <audio preload> ishlamaydi,
// shuning uchun fayl fetch orqali xotiraga olinadi — bosilganda darhol chaladi)
function prefetchMusic() {
  if (!content || !content.music || musicPrefetch) return musicPrefetch;
  musicPrefetch = fetch(content.music)
    .then((r) => (r.ok ? r.blob() : null))
    .then((blob) => {
      if (blob && !musicLoaded) {
        musicAudio.src = URL.createObjectURL(blob);
        musicAudio.preload = "auto";
        musicAudio.load();
        musicLoaded = true;
      }
    })
    .catch(() => {});
  return musicPrefetch;
}

function setupAudioSource() {
  // Oldindan yuklash tugamagan bo'lsa — to'g'ridan-to'g'ri havoladan chalamiz
  if (content && content.music && !musicLoaded) {
    musicAudio.src = content.music;
    musicAudio.preload = "auto";
    musicAudio.load();
    musicLoaded = true;
  }
}

function startMusicPlayback() {
  if (isAudioMuted) return;
  setupAudioSource();

  try {
    musicAudio.volume = 1.0;
  } catch (_) {}

  const playPromise = musicAudio.play();
  if (playPromise !== undefined) {
    playPromise.then(() => {
      musicToggleBtn.classList.remove("muted");
      musicToggleBtn.classList.add("playing");
      if (musicIcon) musicIcon.textContent = "🎵";
    }).catch((err) => {
      console.warn("Autoplay block:", err);
      enableAudioOnFirstGesture();
    });
  }
}

function toggleAudio() {
  setupAudioSource();
  if (musicAudio.paused) {
    isAudioMuted = false;
    musicAudio.volume = 1.0;
    musicAudio.play().then(() => {
      musicToggleBtn.classList.remove("muted");
      musicToggleBtn.classList.add("playing");
      if (musicIcon) musicIcon.textContent = "🎵";
    }).catch((e) => console.log(e));
  } else {
    isAudioMuted = true;
    musicAudio.pause();
    musicToggleBtn.classList.add("muted");
    musicToggleBtn.classList.remove("playing");
    if (musicIcon) musicIcon.textContent = "🔇";
  }
}

musicToggleBtn.addEventListener("click", toggleAudio);

function enableAudioOnFirstGesture() {
  const resume = () => {
    if (!isAudioMuted && musicAudio.paused) {
      musicAudio.volume = 1.0;
      musicAudio.play().then(() => {
        musicToggleBtn.classList.remove("muted");
        musicToggleBtn.classList.add("playing");
        if (musicIcon) musicIcon.textContent = "🎵";
      }).catch(() => {});
    }
    window.removeEventListener("click", resume);
    window.removeEventListener("touchstart", resume);
  };
  window.addEventListener("click", resume, { once: true });
  window.addEventListener("touchstart", resume, { once: true });
}

/* =========================================================
   1. QULFLANGAN EKRAN (YARIM KECHAGACHA SANASH)
   ========================================================= */
let countdownTimer = null;
let serverOffset = 0;

async function checkStatusAndInit() {
  let statusData = null;
  try {
    const res = await fetch("/api/status");
    statusData = await res.json();
  } catch (err) {
    console.warn("Status tekshirishda xatolik, qayta urinamiz...", err);
    setTimeout(checkStatusAndInit, 3000);
    return;
  }

  if (statusData.unlocked) {
    return loadContentAndUnlock();
  }

  serverOffset = statusData.serverNow - Date.now();
  showScene("lock");

  const pad = (n) => String(Math.max(0, n)).padStart(2, "0");

  if (countdownTimer) clearInterval(countdownTimer);

  countdownTimer = setInterval(() => {
    const nowServer = Date.now() + serverOffset;
    const timeLeft = statusData.unlockAt - nowServer;

    if (timeLeft <= 0) {
      clearInterval(countdownTimer);
      loadContentAndUnlock();
      return;
    }

    const totalSeconds = Math.floor(timeLeft / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    $("#cd-d").textContent = pad(days);
    $("#cd-h").textContent = pad(hours);
    $("#cd-m").textContent = pad(minutes);
    $("#cd-s").textContent = pad(seconds);
  }, 250);
}

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible" && currentScene === "lock") {
    checkStatusAndInit();
  }
});

async function loadContentAndUnlock() {
  try {
    const res = await fetch("/api/content");
    if (!res.ok) {
      setTimeout(loadContentAndUnlock, 1500);
      return;
    }
    content = await res.json();
  } catch (e) {
    setTimeout(loadContentAndUnlock, 2000);
    return;
  }

  document.title = `✨ ${content.name} ✨`;
  $("#intro-name").textContent = content.name;

  // Avval musiqa yuklanadi, rasmlar esa undan keyin (internetni talashmasligi uchun)
  const preloadPhotos = () => {
    (content.photos || []).forEach((p) => {
      const img = new Image();
      img.src = p.url;
    });
  };
  const musicReady = prefetchMusic();
  if (musicReady) {
    Promise.race([musicReady, sleep(6000)]).then(preloadPhotos);
  } else {
    preloadPhotos();
  }

  // Kuponlarni oldin ko'rgan bo'lsa — keyingi kirishlarda 🎟 tugmasi chiqadi
  if (couponState.seen && content.coupons && content.coupons.length) {
    $("#coupons-fab").classList.remove("hidden");
  }

  showScene("intro");
}

/* =========================================================
   2. SOVG'A QUTISI VA KIRISH
   ========================================================= */
$("#open-btn").addEventListener("click", async () => {
  startMusicPlayback();
  $("#open-btn").classList.add("hidden");

  firework(W / 2, H * 0.45);
  confetti(150);

  await sleep(350);
  $("#intro-text").classList.add("show");

  await fireworkShow(5);

  $("#to-cake").classList.remove("hidden");
});

$("#to-cake").addEventListener("click", () => {
  buildCakeCandles();
  showScene("cake");
});

/* =========================================================
   3. TORT VA SHAMLAR
   ========================================================= */
let candlesCount = 0;
let candlesRemaining = 0;
let micAudioStream = null;
let blowAudioCtx = null;
let isCakeFinished = false;

function buildCakeCandles() {
  const box = $("#candles");
  box.innerHTML = "";
  isCakeFinished = false;
  candlesCount = content.candles || 11;
  candlesRemaining = candlesCount;

  for (let i = 0; i < candlesCount; i++) {
    const candleEl = document.createElement("div");
    candleEl.className = "candle";
    candleEl.innerHTML = '<div class="flame"></div>';

    const handleExtinguish = (e) => {
      e.preventDefault();
      blowOutCandle(candleEl);
    };
    candleEl.addEventListener("click", handleExtinguish);
    candleEl.addEventListener("touchstart", handleExtinguish, { passive: false });

    box.appendChild(candleEl);
  }
}

function blowOutCandle(candleEl) {
  if (!candleEl || candleEl.classList.contains("out")) return;
  candleEl.classList.add("out");

  for (let i = 0; i < 3; i++) {
    const smoke = document.createElement("div");
    smoke.className = "smoke-particle";
    smoke.style.animationDelay = `${i * 0.25}s`;
    smoke.style.left = `${2 + (Math.random() - 0.5) * 6}px`;
    candleEl.appendChild(smoke);
  }

  if (navigator.vibrate) {
    try { navigator.vibrate([35, 20, 35]); } catch (_) {}
  }

  candlesRemaining--;
  if (candlesRemaining <= 0 && !isCakeFinished) {
    onAllCandlesBlown();
  }
}

$("#mic-btn").addEventListener("click", async () => {
  try {
    micAudioStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
      },
    });
  } catch (err) {
    $("#cake-hint").textContent = "Mikrofonga ruxsat berilmadi — shamlarga barmog'ingiz bilan bosing 👆";
    $("#mic-btn").classList.add("hidden");
    return;
  }

  $("#mic-btn").classList.add("hidden");
  $("#cake-hint").textContent = "Endi mikrofonga puflang... 🌬️";
  initBlowDetection(micAudioStream);
});

function initBlowDetection(stream) {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  blowAudioCtx = new AudioCtx();
  if (blowAudioCtx.state === "suspended") {
    blowAudioCtx.resume();
  }

  const source = blowAudioCtx.createMediaStreamSource(stream);
  const analyser = blowAudioCtx.createAnalyser();
  analyser.fftSize = 512;
  source.connect(analyser);

  const freqBuf = new Uint8Array(analyser.frequencyBinCount);
  let blowStreak = 0;
  let blowCooldown = 0;

  const detectLoop = () => {
    if (candlesRemaining <= 0 || isCakeFinished) {
      if (blowAudioCtx && blowAudioCtx.state !== "closed") {
        blowAudioCtx.close().catch(() => {});
      }
      return;
    }

    analyser.getByteFrequencyData(freqBuf);

    let lowEnergy = 0;
    const checkBins = Math.min(30, freqBuf.length);
    for (let i = 1; i < checkBins; i++) {
      lowEnergy += freqBuf[i];
    }
    const avgEnergy = lowEnergy / (checkBins - 1);

    const activeCandles = [...document.querySelectorAll(".candle:not(.out)")];

    const isWobbling = avgEnergy > 60;
    activeCandles.forEach((c) => c.classList.toggle("wobble", isWobbling));

    if (avgEnergy > 88) {
      blowStreak++;
    } else {
      blowStreak = Math.max(0, blowStreak - 1);
    }

    if (blowCooldown > 0) blowCooldown--;

    if (blowStreak >= 4 && blowCooldown === 0 && activeCandles.length > 0) {
      const target = activeCandles[(Math.random() * activeCandles.length) | 0];
      blowOutCandle(target);
      blowCooldown = 12;
      blowStreak = 1;
    }

    requestAnimationFrame(detectLoop);
  };

  detectLoop();
}

async function onAllCandlesBlown() {
  isCakeFinished = true;

  if (micAudioStream) {
    micAudioStream.getTracks().forEach((track) => track.stop());
  }

  document.querySelectorAll(".candle").forEach((c) => c.classList.remove("wobble"));
  $("#mic-btn").classList.add("hidden");
  $("#cake-title").textContent = "Tilaging albatta ushalsin ✨";
  $("#cake-hint").textContent = "";

  confetti(220);
  firework(W * 0.35, H * 0.28);
  await sleep(350);
  firework(W * 0.65, H * 0.22);
  await sleep(400);
  firework(W * 0.5, H * 0.18);

  await sleep(2200);
  $("#to-stars").classList.remove("hidden");
}

$("#to-stars").addEventListener("click", () => {
  buildStarField();
  showScene("stars");
});

/* =========================================================
   4. YULDUZLI OSMON VA POLAROID RASMLAR (15 ta)
   ========================================================= */
let seenStarsCount = 0;

function buildStarField() {
  const container = $("#star-field");
  container.innerHTML = "";
  seenStarsCount = 0;

  const total = content.photos.length;
  updateStarsCounter();

  const placedCoords = [];
  content.photos.forEach((photoObj, idx) => {
    let x, y, attempts = 0;
    do {
      x = 12 + Math.random() * 76;
      y = 18 + Math.random() * 56;
      attempts++;
    } while (
      attempts < 100 &&
      placedCoords.some(([px, py]) => Math.hypot((px - x) * W / 100, (py - y) * H / 100) < 65)
    );
    placedCoords.push([x, y]);

    const starBtn = document.createElement("button");
    starBtn.className = "wish-star";
    starBtn.textContent = "⭐";
    starBtn.style.left = `${x}%`;
    starBtn.style.top = `${y}%`;
    starBtn.style.animationDelay = `${idx * 0.25}s`;

    starBtn.addEventListener("click", () => openPolaroidModal(photoObj, starBtn));
    container.appendChild(starBtn);
  });
}

function updateStarsCounter() {
  $("#stars-count").textContent = `${seenStarsCount} / ${content.photos.length} — yulduzlarga bos`;
}

function openPolaroidModal(photoObj, starBtn) {
  $("#modal-img").src = photoObj.url;
  $("#modal-text").textContent = photoObj.text;
  $("#photo-modal").classList.remove("hidden");

  if (!starBtn.classList.contains("seen")) {
    starBtn.classList.add("seen");
    seenStarsCount++;
    updateStarsCounter();
  }
}

function closePolaroidModal() {
  $("#photo-modal").classList.add("hidden");
  if (seenStarsCount >= content.photos.length) {
    $("#form-name").classList.remove("hidden");
  }
}

$("#modal-close").addEventListener("click", closePolaroidModal);
$(".modal-backdrop").addEventListener("click", closePolaroidModal);

$("#form-name").addEventListener("click", async () => {
  $("#form-name").classList.add("hidden");
  $("#stars-title").classList.add("hidden");
  $("#stars-count").classList.add("hidden");

  document.querySelectorAll(".wish-star").forEach((btn) => btn.classList.add("gone"));
  await sleep(400);

  // Katta kinematik ism yig'ilishi
  formName(content.name);
  await sleep(4500);

  $("#to-heartbeat").classList.remove("hidden");
});

$("#to-heartbeat").addEventListener("click", () => {
  stars.forEach((s) => {
    s.tx = Math.random() * W;
    s.ty = Math.random() * H;
  });
  setTimeout(() => {
    formMode = false;
    makeStars();
  }, 2000);

  startLoveCounter();
  showScene("heartbeat");
});

/* =========================================================
   4.5. QALB URISHI VA 2026-YIL 5-IYUN TANISHUV HISOB-KITOBI
   ========================================================= */
const pulseHeartEl = $("#pulse-heart");
const heartProgressEl = $("#heart-progress");
let heartPressTimer = null;
let heartHapticInterval = null;
let heartProgressVal = 0;
let heartCompleted = false;
let loveTimer = null;

// 2026-yil 5-iyun tanishuv sanasi
const FIRST_MET_DATE = new Date("2026-06-05T00:00:00+05:00").getTime();

function startLoveCounter() {
  if (loveTimer) clearInterval(loveTimer);

  const updateCounter = () => {
    const now = Date.now();
    let diff = now - FIRST_MET_DATE;
    
    // Agar sana hali kelmagan bo'lsa (yoki testda):
    if (diff < 0) {
      diff = Math.abs(diff);
    }

    const totalSecs = Math.floor(diff / 1000);
    const days = Math.floor(totalSecs / 86400);
    const hours = Math.floor((totalSecs % 86400) / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;

    const pad = (n) => String(n).padStart(2, "0");

    $("#love-days-num").textContent = days;
    $("#love-hours-num").textContent = pad(hours);
    $("#love-mins-num").textContent = pad(mins);
    $("#love-secs-num").textContent = pad(secs);
  };

  updateCounter();
  loveTimer = setInterval(updateCounter, 1000);
}

function startHeartPress() {
  if (heartCompleted) return;
  pulseHeartEl.classList.add("pressing");
  heartProgressVal = 0;

  if (navigator.vibrate) {
    navigator.vibrate([70, 90, 70, 220]);
    heartHapticInterval = setInterval(() => {
      navigator.vibrate([70, 90, 70, 220]);
    }, 450);
  }

  heartPressTimer = setInterval(() => {
    heartProgressVal += 3.5;
    heartProgressEl.style.width = `${Math.min(100, heartProgressVal)}%`;

    if (heartProgressVal >= 100) {
      finishHeartPress();
    }
  }, 100);
}

function stopHeartPress() {
  if (heartCompleted) return;
  pulseHeartEl.classList.remove("pressing");
  if (heartPressTimer) clearInterval(heartPressTimer);
  if (heartHapticInterval) clearInterval(heartHapticInterval);
  heartProgressVal = 0;
  heartProgressEl.style.width = "0%";
}

function finishHeartPress() {
  heartCompleted = true;
  pulseHeartEl.classList.remove("pressing");
  if (heartPressTimer) clearInterval(heartPressTimer);
  if (heartHapticInterval) clearInterval(heartHapticInterval);

  if (navigator.vibrate) {
    navigator.vibrate([120, 60, 120, 60, 200]);
  }

  confetti(120);
  firework(W / 2, H * 0.45);

  $("#heart-instruction").classList.add("hidden");
  $("#heart-progress-bar").classList.add("hidden");
  $("#heart-revealed-text").classList.remove("hidden");
}

pulseHeartEl.addEventListener("pointerdown", startHeartPress);
pulseHeartEl.addEventListener("pointerup", stopHeartPress);
pulseHeartEl.addEventListener("pointerleave", stopHeartPress);

$("#to-letter").addEventListener("click", () => {
  if (loveTimer) clearInterval(loveTimer);
  showScene("letter");
});

/* =========================================================
   5. KONVERT VA XAT
   ========================================================= */
let isEnvelopeOpened = false;
let isTypingFastForward = false;
let isLetterDone = false;

$("#envelope").addEventListener("click", async () => {
  if (isEnvelopeOpened) return;
  isEnvelopeOpened = true;

  $("#env-hint").classList.add("hidden");
  $("#envelope").classList.add("open");

  await sleep(850);
  $("#envelope").classList.add("away");

  await sleep(650);
  $("#envelope-wrap").classList.add("hidden");
  $("#paper").classList.remove("hidden");

  await typeOutLetter();
  $("#to-final").classList.remove("hidden");
});

async function typeOutLetter() {
  const textContainer = $("#letter-text");
  textContainer.innerHTML = "";
  const letterData = content.letter;

  const cursor = document.createElement("span");
  cursor.className = "cursor";
  textContainer.appendChild(cursor);

  $("#paper").addEventListener("click", () => {
    if (isTypingFastForward) return;
    isTypingFastForward = true;
    // Xat to'liq chiqqach, u o'qiyotgan joyidan davom etadi (oxiriga sakrab ketmaydi)
    const keep = $("#paper").scrollTop;
    requestAnimationFrame(() => { $("#paper").scrollTop = keep; });
  });

  const lines = [letterData.greeting, "", ...letterData.paragraphs.flatMap((p) => [p, ""])];

  for (let l = 0; l < lines.length; l++) {
    const line = lines[l];
    for (let c = 0; c < line.length; c++) {
      if (isTypingFastForward) {
        cursor.before(line.slice(c));
        break;
      }
      const char = line[c];
      cursor.before(char);

      let delay = 35;
      if (char === "." || char === "!" || char === "?") delay = 350;
      else if (char === "," || char === ";") delay = 220;

      await sleep(delay);
      $("#paper").scrollTop = $("#paper").scrollHeight;
    }

    cursor.before("\n");
    if (!isTypingFastForward) {
      await sleep(220);
    }
  }

  const sigContainer = document.createElement("span");
  sigContainer.className = "sig";
  cursor.before(sigContainer);

  const sigText = letterData.signature || "";
  for (let i = 0; i < sigText.length; i++) {
    sigContainer.textContent += sigText[i];
    if (!isTypingFastForward) {
      await sleep(65);
    }
  }

  cursor.remove();
  if (!isTypingFastForward) $("#paper").scrollTop = $("#paper").scrollHeight;
  isLetterDone = true;
}

/* =========================================================
   UMUMIY: SERVERGA HARAKATNI YUBORISH VA TEBRANISH
   ========================================================= */
function sendEvent(type, text) {
  return fetch("/api/event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, text }),
  })
    .then((r) => r.ok)
    .catch(() => false);
}

function buzz(pattern) {
  if (navigator.vibrate) {
    try { navigator.vibrate(pattern); } catch (_) {}
  }
}

const hasQuiz = () => content.quiz && content.quiz.length > 0;
const hasCoupons = () => content.coupons && content.coupons.length > 0;

// Xatdan keyin: test → kuponlar → final (qaysi biri yoqilgan bo'lsa)
$("#to-final").addEventListener("click", () => {
  if (hasQuiz()) return startQuiz();
  if (hasCoupons()) return openCoupons("flow");
  openFinal();
});

/* =========================================================
   5.5. "MENI QANCHALIK BILASAN?" TESTI
   ========================================================= */
let quizIdx = 0;
let quizScore = 0;
let quizFirstTry = true;
let quizLocked = false;

const QUIZ_WRONG = [
  "Hmm... yana o'ylab ko'r 😏",
  "Yo'q-yo'q, sen buni bilasan 🙈",
  "Ayyy, xafa bo'ldim-a 🥺 Yana bir marta?",
  "Sovuq... juda sovuq 🥶",
];

function startQuiz() {
  quizIdx = 0;
  quizScore = 0;
  $("#quiz-result").classList.add("hidden");
  $("#quiz-card").classList.remove("hidden");

  const hearts = $("#quiz-hearts");
  hearts.innerHTML = "";
  content.quiz.forEach(() => {
    const h = document.createElement("span");
    h.className = "quiz-heart";
    h.textContent = "🤍";
    hearts.appendChild(h);
  });

  showScene("quiz");
  renderQuizQuestion();
}

function renderQuizQuestion() {
  const q = content.quiz[quizIdx];
  quizFirstTry = true;
  quizLocked = false;

  $("#quiz-progress").textContent = `${quizIdx + 1} / ${content.quiz.length}`;
  $("#quiz-question").textContent = q.q;
  $("#quiz-feedback").textContent = "";

  const card = $("#quiz-card");
  card.classList.remove("quiz-in");
  void card.offsetWidth; // animatsiyani qayta boshlash
  card.classList.add("quiz-in");

  const box = $("#quiz-options");
  box.innerHTML = "";
  q.options.forEach((opt, i) => {
    const b = document.createElement("button");
    b.className = "quiz-option";
    b.textContent = opt;
    b.addEventListener("click", () => answerQuiz(i, b));
    box.appendChild(b);
  });
}

async function answerQuiz(i, btn) {
  if (quizLocked || btn.disabled) return;
  const q = content.quiz[quizIdx];

  if (i === q.answer) {
    quizLocked = true;
    btn.classList.add("right");
    if (quizFirstTry) {
      quizScore++;
      const heart = $("#quiz-hearts").children[quizIdx];
      if (heart) {
        heart.textContent = "❤️";
        heart.classList.add("pop");
      }
    }
    $("#quiz-feedback").textContent = q.right || "To'g'ri! ❤️";
    const r = btn.getBoundingClientRect();
    firework(r.left + r.width / 2, r.top);
    buzz([40, 30, 40]);

    await sleep(1900);
    quizIdx++;
    if (quizIdx < content.quiz.length) renderQuizQuestion();
    else finishQuiz();
  } else {
    quizFirstTry = false;
    btn.classList.add("wrong");
    btn.disabled = true;
    $("#quiz-feedback").textContent = QUIZ_WRONG[(Math.random() * QUIZ_WRONG.length) | 0];
    buzz(120);
  }
}

function finishQuiz() {
  const total = content.quiz.length;
  const ratio = quizScore / total;

  $("#quiz-card").classList.add("hidden");
  $("#quiz-score").textContent = `${quizScore} / ${total}`;
  $("#quiz-verdict").textContent =
    ratio === 1
      ? "Sen meni mendan ham yaxshi bilasan... ❤️"
      : ratio >= 0.6
        ? "Deyarli mukammal! Qolganini kechqurun o'rgataman 😉"
        : "Hechqisi yo'q — meni bilib olishga hali butun umrimiz bor 🥰";
  $("#quiz-next").textContent = hasCoupons() ? "Senga sovg'alarim bor 🎁" : "Davom etish →";
  $("#quiz-result").classList.remove("hidden");

  confetti(ratio === 1 ? 220 : 120);
  if (ratio === 1) fireworkShow(2);
  sendEvent("quiz", `${quizScore} / ${total} (birinchi urinishda to'g'ri topganlari)`);
}

$("#quiz-next").addEventListener("click", () => {
  if (hasCoupons()) openCoupons("flow");
  else openFinal();
});

/* =========================================================
   5.7. SEVGI KUPONLARI (QIRIB OCHILADIGAN)
   ========================================================= */
const COUPON_KEY = "farangiz-coupons-v1";
let couponState = loadCouponState();
let couponMode = "flow";
let couponReturnScene = null;
let pendingCoupon = null;

function loadCouponState() {
  const empty = { scratched: {}, used: {}, seen: false };
  try {
    return Object.assign(empty, JSON.parse(localStorage.getItem(COUPON_KEY)) || {});
  } catch (_) {
    return empty;
  }
}

function saveCouponState() {
  try { localStorage.setItem(COUPON_KEY, JSON.stringify(couponState)); } catch (_) {}
}

// "flow" — sayt oqimida (oxirida "Davom etish"), "visit" — 🎟 tugmasi orqali keyinroq kirganda
function openCoupons(mode) {
  couponMode = mode;
  couponReturnScene = mode === "visit" ? currentScene : null;
  couponState.seen = true;
  saveCouponState();

  $("#coupons-fab").classList.add("hidden");
  showScene("coupons");
  buildCouponGrid();
  updateCouponButtons();
}

function updateCouponButtons() {
  const allOpen = content.coupons.every((k) => couponState.scratched[k.id]);
  $("#coupons-next").classList.toggle("hidden", couponMode !== "flow" || !allOpen);
  $("#coupons-back").classList.toggle("hidden", couponMode === "flow");
}

function buildCouponGrid() {
  const grid = $("#coupon-grid");
  grid.innerHTML = "";

  content.coupons.forEach((k, idx) => {
    const card = document.createElement("div");
    card.className = "coupon";
    card.style.animationDelay = `${idx * 0.08}s`;
    if (couponState.used[k.id]) card.classList.add("used");

    const body = document.createElement("div");
    body.className = "coupon-body";
    body.innerHTML = `
      <span class="coupon-emoji"></span>
      <p class="coupon-title"></p>
      <p class="coupon-text handwritten"></p>
      <button class="coupon-use-btn">Ishlatish</button>
      <span class="coupon-stamp">Ishlatildi ✓</span>`;
    body.querySelector(".coupon-emoji").textContent = k.emoji;
    body.querySelector(".coupon-title").textContent = k.title;
    body.querySelector(".coupon-text").textContent = k.text;
    body.querySelector(".coupon-use-btn").addEventListener("click", () => openCouponModal(k, card));
    card.appendChild(body);

    if (!couponState.scratched[k.id]) {
      const foil = document.createElement("canvas");
      foil.className = "coupon-foil";
      card.appendChild(foil);
      requestAnimationFrame(() => setupFoil(foil, card, k));
    }

    grid.appendChild(card);
  });
}

function setupFoil(canvas, card, coupon) {
  const rect = card.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = Math.max(1, rect.width);
  const h = Math.max(1, rect.height);
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);

  // Oltin folga
  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, "#f7d27a");
  g.addColorStop(0.35, "#fff1c1");
  g.addColorStop(0.55, "#e9b54f");
  g.addColorStop(1, "#f9dc8c");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  // Yaltiroq nuqtalar
  for (let i = 0; i < 45; i++) {
    ctx.fillStyle = `rgba(255,255,255,${0.25 + Math.random() * 0.5})`;
    ctx.beginPath();
    ctx.arc(Math.random() * w, Math.random() * h, Math.random() * 1.8 + 0.4, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = "rgba(120, 70, 10, 0.75)";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "700 28px Montserrat, sans-serif";
  ctx.fillText("❤", w / 2, h / 2 - 16);
  ctx.font = "600 13px Montserrat, sans-serif";
  ctx.fillText("Qirib och ✨", w / 2, h / 2 + 16);

  let drawing = false;
  let moves = 0;
  let done = false;

  const scratchAt = (e) => {
    const r = canvas.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";
    addTouchParticles(e.clientX, e.clientY);

    if (++moves % 6 === 0) checkCleared();
  };

  const checkCleared = () => {
    if (done) return;
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let clear = 0;
    let total = 0;
    for (let i = 3; i < data.length; i += 4 * 24) {
      total++;
      if (data[i] < 40) clear++;
    }
    if (clear / total > 0.45) reveal();
  };

  const reveal = () => {
    done = true;
    canvas.classList.add("cleared");
    setTimeout(() => canvas.remove(), 650);
    couponState.scratched[coupon.id] = true;
    saveCouponState();
    const r = card.getBoundingClientRect();
    firework(r.left + r.width / 2, r.top + r.height / 2);
    buzz([30, 20, 30]);
    updateCouponButtons();
  };

  canvas.addEventListener("pointerdown", (e) => {
    drawing = true;
    try { canvas.setPointerCapture(e.pointerId); } catch (_) {}
    scratchAt(e);
  });
  canvas.addEventListener("pointermove", (e) => { if (drawing) scratchAt(e); });
  const stop = () => {
    drawing = false;
    checkCleared();
  };
  canvas.addEventListener("pointerup", stop);
  canvas.addEventListener("pointercancel", stop);
}

function openCouponModal(coupon, card) {
  if (couponState.used[coupon.id]) return;
  pendingCoupon = { coupon, card };
  $("#coupon-modal-emoji").textContent = coupon.emoji;
  $("#coupon-modal-title").textContent = `"${coupon.title}" kuponini ishlatasanmi?`;
  $("#coupon-use").disabled = false;
  $("#coupon-use").textContent = "Ishlataman ✨";
  $("#coupon-modal").classList.remove("hidden");
}

function closeCouponModal() {
  $("#coupon-modal").classList.add("hidden");
  pendingCoupon = null;
}

$("#coupon-cancel").addEventListener("click", closeCouponModal);
$("#coupon-modal .modal-backdrop").addEventListener("click", closeCouponModal);

$("#coupon-use").addEventListener("click", async () => {
  if (!pendingCoupon) return;
  const { coupon, card } = pendingCoupon;
  const btn = $("#coupon-use");
  btn.disabled = true;
  btn.textContent = "Yuborilmoqda...";

  const ok = await sendEvent("coupon", `${coupon.emoji} ${coupon.title}`);
  if (!ok) {
    btn.disabled = false;
    btn.textContent = "Internet yo'q — qayta urin 🔄";
    return;
  }

  couponState.used[coupon.id] = true;
  saveCouponState();
  card.classList.add("used");
  closeCouponModal();
  confetti(140);
  firework(W / 2, H * 0.35);
  buzz([60, 40, 60]);
});

$("#coupons-next").addEventListener("click", openFinal);

$("#coupons-back").addEventListener("click", () => {
  showScene(couponReturnScene && couponReturnScene !== "coupons" ? couponReturnScene : "intro");
  $("#coupons-fab").classList.remove("hidden");
});

$("#coupons-fab").addEventListener("click", () => openCoupons("visit"));

/* =========================================================
   6. FINAL: "KELASANMI?" (YO'Q TUGMASI QOCHADI)
   ========================================================= */
let noTries = 0;
let finalOpened = false;
const NO_TEXTS = ["Yo'q", "Ishonching komilmi? 🤨", "Yana o'ylab ko'r 🥺", "Iltimos...", "Baribir ushlay olmaysan 😜", "Ha'ni bos-da 🙈", "Charchadim... 😮‍💨", "Foydasi yo'q 😏", "Faqat Ha bor 💕"];

async function openFinal() {
  $("#final-title").textContent = content.finalMessage.title || "Bu hali hammasi emas...";
  $("#final-text").textContent = content.finalMessage.text || "Kechqurun ko'rishamiz ❤️";

  const fq = content.finalQuestion;
  if (fq) {
    NO_TEXTS[0] = fq.no || "Yo'q";
    $("#ask-question").textContent = fq.question;
    $("#ask-yes").textContent = fq.yes || "Ha ❤️";
    $("#ask-no").textContent = NO_TEXTS[0];
    $(".ask-done-text").textContent = fq.done || "Bilardim! ❤️ Seni kutaman...";
    $("#ask-box").classList.remove("hidden");
    $("#ask-done").classList.add("hidden");
  } else {
    $("#ask-box").classList.add("hidden");
    $(".ask-done-text").classList.add("hidden");
    $("#ask-done").classList.remove("hidden");
  }

  showScene("final");
  if (finalOpened) return;
  finalOpened = true;
  await sleep(1600);
  fireworkShow(4);
}

function fleeNoButton(e) {
  if (e) e.preventDefault();
  const no = $("#ask-no");
  // Asl o'lchami — yozuvi o'zgarishidan OLDIN o'lchanadi (o'rinbosar uchun)
  const origW = no.offsetWidth || 100;
  const origH = no.offsetHeight || 46;
  noTries++;

  // "Yo'q" hech qachon yo'qolmaydi — yozuvlar aylanib takrorlanadi
  lastNoFlee = Date.now();
  no.textContent = NO_TEXTS[1 + ((noTries - 1) % (NO_TEXTS.length - 1))];

  const yesRect = $("#ask-yes").getBoundingClientRect();
  const bw = no.offsetWidth || 120;
  const bh = no.offsetHeight || 46;
  const px = e && e.clientX != null ? e.clientX : null;
  const py = e && e.clientY != null ? e.clientY : null;
  let x;
  let y;
  let tries = 0;
  do {
    x = 12 + Math.random() * Math.max(10, W - bw - 24);
    y = 70 + Math.random() * Math.max(10, H - bh - 140);
    tries++;
    // "Ha" tugmasiga ham, barmoq turgan joyga ham yaqin bo'lmasin
  } while (
    tries < 60 &&
    ((x < yesRect.right + 20 && x + bw > yesRect.left - 20 &&
      y < yesRect.bottom + 20 && y + bh > yesRect.top - 20) ||
     (px != null && Math.hypot(x + bw / 2 - px, y + bh / 2 - py) < 160))
  );

  // Birinchi qochishda tugma sahnaning o'ziga ko'chiriladi — shunda butun ekran bo'ylab qochadi
  if (!no.classList.contains("fleeing")) {
    // Bo'shagan joyga ko'rinmas o'rinbosar — "Ha" surilib, "Yo'q" turgan joyni egallamasin
    const ph = document.createElement("span");
    ph.className = "ask-no-placeholder";
    ph.style.width = `${origW}px`;
    ph.style.height = `${origH}px`;
    no.after(ph);
    $("#final").appendChild(no);
  }
  no.classList.add("fleeing");
  no.style.left = `${x}px`;
  no.style.top = `${y}px`;

  const scale = Math.min(1.35, 1 + noTries * 0.07);
  $("#ask-yes").style.transform = `scale(${scale})`;
  buzz(30);
}

let lastNoFlee = 0;
let yesPressedDirectly = false;

// Telefonda: barmoq tegishi bilan qochadi, preventDefault esa keyingi "click"ni butunlay bekor qiladi —
// shunda barmoq ostiga kelib qolgan "Ha" tugmasi tasodifan bosilmaydi
$("#ask-no").addEventListener("touchstart", fleeNoButton, { passive: false });
$("#ask-no").addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") fleeNoButton(e); });
$("#ask-no").addEventListener("pointerdown", (e) => { if (e.pointerType !== "touch") fleeNoButton(e); });
$("#ask-no").addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); });

// "Ha" faqat barmoq to'g'ridan-to'g'ri unga qo'yilganda ishlaydi
$("#ask-yes").addEventListener("pointerdown", () => {
  yesPressedDirectly = Date.now() - lastNoFlee > 400;
});
$("#ask-yes").addEventListener("touchstart", () => {
  yesPressedDirectly = Date.now() - lastNoFlee > 400;
}, { passive: true });

$("#ask-yes").addEventListener("click", async (e) => {
  if (!yesPressedDirectly || Date.now() - lastNoFlee < 400) {
    e.preventDefault();
    yesPressedDirectly = false;
    return;
  }
  yesPressedDirectly = false;
  $("#ask-box").classList.add("hidden");
  $("#ask-no").classList.add("hidden");
  $("#ask-done").classList.remove("hidden");

  const extra = noTries > 0 ? ` ("Yo'q" tugmasini ${noTries} marta ushlashga urindi 😄)` : "";
  sendEvent("answer", `${content.finalQuestion ? content.finalQuestion.question : ""} — HA!${extra}`);

  buzz([100, 50, 100, 50, 200]);
  confetti(260);
  firework(W * 0.3, H * 0.3);
  await sleep(300);
  firework(W * 0.7, H * 0.25);
  await sleep(300);
  firework(W * 0.5, H * 0.2);
});

/* =========================================================
   7. OSMONGA FONAR UCHIRISH
   ========================================================= */
let lanternTimer = null;
let lanternsStarted = false;

function spawnLantern(main = false) {
  const sky = $("#lantern-sky");
  const el = document.createElement("div");
  el.className = "lantern" + (main ? " main" : "");

  const size = main ? 64 : 12 + Math.random() * 26;
  const dur = main ? 10 : 11 + Math.random() * 11;
  el.style.setProperty("--s", `${size}px`);
  el.style.setProperty("--dur", `${dur}s`);
  el.style.setProperty("--sway", `${(Math.random() - 0.5) * 90}px`);
  el.style.left = main ? `calc(50% - ${size / 2}px)` : `${Math.random() * 96}%`;
  // Kichiklari — uzoqdagilar, shuning uchun xiraroq
  el.style.opacity = main ? "1" : String(Math.min(0.95, 0.35 + size / 55));
  el.innerHTML = '<div class="lantern-body"></div>';

  sky.appendChild(el);
  setTimeout(() => el.remove(), dur * 1000 + 300);
}

function setLanternRate(perSecond) {
  if (lanternTimer) clearInterval(lanternTimer);
  lanternTimer = setInterval(() => spawnLantern(), 1000 / perSecond);
}

$("#to-lanterns").addEventListener("click", () => {
  showScene("lanterns");
  if (!lanternsStarted) {
    lanternsStarted = true;
    for (let i = 0; i < 4; i++) setTimeout(() => spawnLantern(), i * 400);
    setLanternRate(0.7);
  }
});

$("#wish-btn").addEventListener("click", async () => {
  const ta = $("#wish-text");
  const text = ta.value.trim();
  if (!text) {
    ta.placeholder = "Bitta so'z bo'lsa ham yoz 🥺";
    ta.classList.remove("shake");
    void ta.offsetWidth;
    ta.classList.add("shake");
    return;
  }

  ta.blur();
  $("#wish-box").classList.add("hidden");
  sendEvent("wish", text);

  spawnLantern(true);
  buzz([80, 60, 80]);
  for (let i = 0; i < 26; i++) setTimeout(() => spawnLantern(), 300 + i * 140);
  setLanternRate(2.5);

  await sleep(2500);
  $("#wish-sent").classList.remove("hidden");
  confetti(90);

  await sleep(2500);
  $("#secret-btn").classList.remove("hidden");
  if (content.allowReply) $("#reply-form").classList.remove("hidden");
  setLanternRate(1.2);
});

/* =========================================================
   SIRLI TUGMA (EASTER EGG) VA JAVOB YOZISH
   ========================================================= */
$("#secret-btn").addEventListener("click", () => {
  confetti(150);
  firework(W * 0.3, H * 0.3);
  firework(W * 0.7, H * 0.3);
  $("#secret-modal").classList.remove("hidden");
});

$("#secret-close").addEventListener("click", () => {
  $("#secret-modal").classList.add("hidden");
});

$(".secret-card").addEventListener("click", (e) => e.stopPropagation());

$("#reply-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const textarea = $("#reply-text");
  const submitBtn = $("#reply-btn");
  const errorMsg = $("#reply-error");
  const text = textarea.value.trim();

  if (!text) return;

  submitBtn.disabled = true;
  submitBtn.textContent = "Uchirilmoqda... ✈️";
  errorMsg.classList.add("hidden");

  const plane = $("#flying-plane");
  plane.classList.remove("hidden");

  try {
    const res = await fetch("/api/reply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (res.ok) {
      await sleep(1500);
      plane.classList.add("hidden");
      textarea.value = "";
      submitBtn.disabled = false;
      submitBtn.textContent = "Yuborish 💌";
      $("#reply-form").classList.add("hidden");
      $("#reply-done").classList.remove("hidden");
      confetti(160);
      firework(W / 2, H * 0.35);
    } else {
      throw new Error("Xatolik");
    }
  } catch (err) {
    plane.classList.add("hidden");
    errorMsg.textContent = "Xabarni yuborishda xatolik yuz berdi. Qaytadan urinib ko'ring.";
    errorMsg.classList.remove("hidden");
    submitBtn.disabled = false;
    submitBtn.textContent = "Yuborish 💌";
  }
});

// "Yana yozish" tugmasi — reply-done dan formga qaytaradi
document.addEventListener("click", (e) => {
  if (e.target && e.target.id === "reply-again-btn") {
    $("#reply-done").classList.add("hidden");
    $("#reply-form").classList.remove("hidden");
    $("#reply-text").focus();
  }
});

/* =========================================================
   ISHGA TUSHIRISH
   ========================================================= */
window.addEventListener("resize", () => {
  resize();
  if (!formMode) makeStars();
});

resize();
makeStars();
drawBg();
checkStatusAndInit();
