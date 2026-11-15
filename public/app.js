// =========================================================
//  TUG'ILGAN KUN SSYURPRIZ SAYTI - FRONTEND KODI
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
   FON: YULDUZLI OSMON VA ISMNI YULDUZLARDAN YIG'ISH
   ========================================================= */
const bgCanvas = $("#bg");
const bctx = bgCanvas.getContext("2d");
let W = window.innerWidth;
let H = window.innerHeight;
let DPR = Math.min(window.devicePixelRatio || 1, 2);

let stars = [];
let formMode = false;
let namePoints = [];

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
  const count = Math.round(Math.min(450, (W * H) / 2000));
  stars = Array.from({ length: count }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    baseR: Math.random() * 1.3 + 0.4,
    r: Math.random() * 1.3 + 0.4,
    t: Math.random() * Math.PI * 2,
    speed: 0.015 + Math.random() * 0.03,
    alpha: 0.4,
    tx: null,
    ty: null,
    isNamePart: false,
    color: "#ffffff",
  }));
}

function drawBg() {
  bctx.clearRect(0, 0, W, H);

  for (let i = 0; i < stars.length; i++) {
    const st = stars[i];
    st.t += st.speed;

    if (formMode && st.tx != null) {
      // Yulduzlar ism shaklidagi nuqtalarga tortiladi
      st.x += (st.tx - st.x) * 0.055;
      st.y += (st.ty - st.y) * 0.055;
      st.alpha += (0.95 - st.alpha) * 0.04;
      st.r += (1.8 - st.r) * 0.04;
      st.color = "#ffd98a";
    } else if (formMode && st.tx == null) {
      // Ismga kirmagan ortiqcha yulduzlar xiralashadi
      st.alpha += (0.1 - st.alpha) * 0.03;
      st.color = "#ffffff";
    } else {
      // Oddiy tungi osmon miltillashi
      st.alpha = 0.3 + Math.sin(st.t) * 0.35;
      st.r = st.baseR;
      st.color = "#ffffff";
    }

    bctx.beginPath();
    bctx.arc(st.x, st.y, Math.max(0.2, st.r), 0, Math.PI * 2);
    bctx.fillStyle = st.color;
    bctx.globalAlpha = Math.max(0, Math.min(1, st.alpha));

    if (formMode && st.tx != null) {
      bctx.shadowBlur = 8;
      bctx.shadowColor = "#ffd98a";
    }

    bctx.fill();
    bctx.shadowBlur = 0;
  }
  bctx.globalAlpha = 1;

  // Har 8-14 soniyada meteor uchishi
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

  // Shrift o'lchamini hisoblash
  const fontSize = Math.min(W / (Math.max(4, text.length) * 0.52), H * 0.26);
  o.font = `600 ${fontSize}px "Great Vibes", cursive, sans-serif`;
  o.textAlign = "center";
  o.textBaseline = "middle";
  o.fillStyle = "#ffffff";
  o.fillText(text, W / 2, H * 0.42);

  const imgData = o.getImageData(0, 0, W, H).data;
  namePoints = [];
  const step = Math.max(3, Math.round(fontSize / 26));

  for (let y = 0; y < H; y += step) {
    for (let x = 0; x < W; x += step) {
      const idx = (y * W + x) * 4;
      if (imgData[idx + 3] > 120) {
        namePoints.push({ x, y });
      }
    }
  }

  // Tasodifiy tartibda aralashtirish
  namePoints.sort(() => Math.random() - 0.5);

  const needed = Math.min(namePoints.length, 1200);

  // Yulduzlar soni yetmasa qo'shamiz
  while (stars.length < needed) {
    stars.push({
      x: Math.random() * W,
      y: Math.random() * H,
      baseR: 1.2,
      r: 1.2,
      t: Math.random() * Math.PI * 2,
      speed: 0.02,
      alpha: 0.2,
      tx: null,
      ty: null,
      isNamePart: false,
      color: "#ffd98a",
    });
  }

  // Har bir yulduzga ism koordinatasi beriladi
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
}

/* =========================================================
   EFFEKTLAR: SALYUT, KONFETTI VA METEOR
   ========================================================= */
const fxCanvas = $("#fx");
const fctx = fxCanvas.getContext("2d");
let particles = [];
let fxRunning = false;
const FX_COLORS = ["#ffd98a", "#ff8fb8", "#ffffff", "#8ec5ff", "#c89bff", "#ff6b8b", "#ffe57f"];

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
   MUSIQA VA WEB AUDIO AMBIENT SINTIZATORI
   ========================================================= */
const musicAudio = $("#music");
const musicToggleBtn = $("#music-toggle");
let isAudioMuted = false;
let webAudioSynth = null;
let musicStarted = false;

// Foydalanuvchi mp3 qo'ymagan bo'lsa, chiroyli romantik musiqa qutisi (music box) chalinadi
class AmbientMusicBox {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.timer = null;
    // Chiroyli ohang notalari (C major / pentatonic lofi melody)
    this.notes = [
      261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99,
      523.25, 392.00, 329.63, 293.66, 349.23, 440.00, 523.25
    ];
    this.noteIdx = 0;
  }

  init() {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    this.ctx = new AudioCtx();
  }

  playPluck(freq, time) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, time);

    // Mayin musiqiy qo'ng'iroqcha konverti (chime / kalimba)
    gain.gain.setValueAtTime(0.001, time);
    gain.gain.exponentialRampToValueAtTime(0.12, time + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 1.8);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(time);
    osc.stop(time + 1.85);
  }

  start() {
    if (this.isPlaying) return;
    if (!this.ctx) this.init();
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    this.isPlaying = true;
    this.scheduleNotes();
  }

  scheduleNotes() {
    if (!this.isPlaying || !this.ctx) return;
    const now = this.ctx.currentTime;
    const freq = this.notes[this.noteIdx % this.notes.length];
    this.playPluck(freq, now);

    // Ba'zan akkord berish
    if (this.noteIdx % 4 === 0) {
      this.playPluck(freq * 0.5, now);
    }

    this.noteIdx++;
    const delay = 480 + (this.noteIdx % 3 === 0 ? 300 : 0);
    this.timer = setTimeout(() => this.scheduleNotes(), delay);
  }

  stop() {
    this.isPlaying = false;
    if (this.timer) clearTimeout(this.timer);
    if (this.ctx && this.ctx.state !== "closed") {
      this.ctx.suspend().catch(() => {});
    }
  }
}

function startMusic() {
  if (musicStarted) return;
  musicStarted = true;
  musicToggleBtn.classList.remove("hidden");
  musicToggleBtn.classList.add("playing");

  if (content && content.music) {
    musicAudio.src = content.music;
    musicAudio.volume = 0;
    musicAudio.play().then(() => {
      fadeAudioVolume(musicAudio, 0.65, 3000);
    }).catch(() => {
      // Autoplay xatosi bo'lsa synth ga o'tadi
      fallbackToSynth();
    });
  } else {
    fallbackToSynth();
  }
}

function fallbackToSynth() {
  webAudioSynth = new AmbientMusicBox();
  webAudioSynth.start();
}

function fadeAudioVolume(audioEl, targetVol, durationMs) {
  const startVol = audioEl.volume;
  const startTime = performance.now();
  const step = (t) => {
    const elapsed = t - startTime;
    const factor = Math.min(1, elapsed / durationMs);
    audioEl.volume = startVol + (targetVol - startVol) * factor;
    if (factor < 1 && !isAudioMuted) {
      requestAnimationFrame(step);
    }
  };
  requestAnimationFrame(step);
}

musicToggleBtn.addEventListener("click", () => {
  isAudioMuted = !isAudioMuted;
  if (isAudioMuted) {
    musicToggleBtn.classList.add("muted");
    musicToggleBtn.classList.remove("playing");
    if (musicAudio && !musicAudio.paused) musicAudio.pause();
    if (webAudioSynth) webAudioSynth.stop();
  } else {
    musicToggleBtn.classList.remove("muted");
    musicToggleBtn.classList.add("playing");
    if (content && content.music) {
      musicAudio.play().catch(() => {});
    } else if (webAudioSynth) {
      webAudioSynth.start();
    }
  }
});

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

  // Server vaqti bilan mijoz vaqti farqi
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

// Brauzer tab faol bo'lganda vaqtni qayta tekshirib olish
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible" && currentScene === "lock") {
    checkStatusAndInit();
  }
});

async function loadContentAndUnlock() {
  try {
    const res = await fetch("/api/content");
    if (!res.ok) {
      // Agar server hali ruxsat bermagan bo'lsa 1.5 soniyadan keyin qayta so'raymiz
      setTimeout(loadContentAndUnlock, 1500);
      return;
    }
    content = await res.json();
  } catch (e) {
    setTimeout(loadContentAndUnlock, 2000);
    return;
  }

  // Sahifa sarlavhasi va ism o'rnatiladi
  document.title = `✨ ${content.name} ✨`;
  $("#intro-name").textContent = content.name;

  // Rasmlarni brauzer keshiga oldindan yuklab qo'yish
  if (content.photos && content.photos.length) {
    content.photos.forEach((p) => {
      const img = new Image();
      img.src = p.url;
    });
  }

  showScene("intro");
}

/* =========================================================
   2. SOVG'A QUTISI VA KIRISH
   ========================================================= */
$("#open-btn").addEventListener("click", async () => {
  startMusic();
  $("#open-btn").classList.add("hidden");

  // Markazdan salyut va konfetti portlashi
  firework(W / 2, H * 0.45);
  confetti(150);

  await sleep(350);
  $("#intro-text").classList.add("show");

  // 5 soniya salyut shousi
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
  candlesCount = content.candles || 5;
  candlesRemaining = candlesCount;

  for (let i = 0; i < candlesCount; i++) {
    const candleEl = document.createElement("div");
    candleEl.className = "candle";
    candleEl.innerHTML = '<div class="flame"></div>';

    // Barmoq bilan bosib o'chirish (touch va click)
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

  // Tutun zarrachalari
  for (let i = 0; i < 3; i++) {
    const smoke = document.createElement("div");
    smoke.className = "smoke-particle";
    smoke.style.animationDelay = `${i * 0.25}s`;
    smoke.style.left = `${2 + (Math.random() - 0.5) * 6}px`;
    candleEl.appendChild(smoke);
  }

  // Telefon titrashi (vibratsiya)
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

    // Puflash shovqini: 30Hz - 250Hz oralig'idagi past chastotali kuchli shamol to'lqini
    let lowEnergy = 0;
    const checkBins = Math.min(30, freqBuf.length);
    for (let i = 1; i < checkBins; i++) {
      lowEnergy += freqBuf[i];
    }
    const avgEnergy = lowEnergy / (checkBins - 1);

    const activeCandles = [...document.querySelectorAll(".candle:not(.out)")];

    // Sham olovlarining shamolda egilishi
    const isWobbling = avgEnergy > 60;
    activeCandles.forEach((c) => c.classList.toggle("wobble", isWobbling));

    if (avgEnergy > 88) {
      blowStreak++;
    } else {
      blowStreak = Math.max(0, blowStreak - 1);
    }

    if (blowCooldown > 0) blowCooldown--;

    if (blowStreak >= 4 && blowCooldown === 0 && activeCandles.length > 0) {
      // Tasodifiy bitta shamni o'chiramiz
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
   4. YULDUZLI OSMON VA POLAROID RASMLAR
   ========================================================= */
let seenStarsCount = 0;

function buildStarField() {
  const container = $("#star-field");
  container.innerHTML = "";
  seenStarsCount = 0;

  const total = content.photos.length;
  updateStarsCounter();

  // Yulduzlarni ekranda optimal va bir-biridan masofali joylashtirish
  const placedCoords = [];
  content.photos.forEach((photoObj, idx) => {
    let x, y, attempts = 0;
    do {
      x = 15 + Math.random() * 70;
      y = 20 + Math.random() * 52;
      attempts++;
    } while (
      attempts < 100 &&
      placedCoords.some(([px, py]) => Math.hypot((px - x) * W / 100, (py - y) * H / 100) < 80)
    );
    placedCoords.push([x, y]);

    const starBtn = document.createElement("button");
    starBtn.className = "wish-star";
    starBtn.textContent = "⭐";
    starBtn.style.left = `${x}%`;
    starBtn.style.top = `${y}%`;
    starBtn.style.animationDelay = `${idx * 0.35}s`;

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

// "Osmonga qara" tugmasi bosilganda yulduzlar ism shakliga yig'iladi
$("#form-name").addEventListener("click", async () => {
  $("#form-name").classList.add("hidden");
  $("#stars-title").classList.add("hidden");
  $("#stars-count").classList.add("hidden");

  // Katta sariq yulduzlar yo'qoladi
  document.querySelectorAll(".wish-star").forEach((btn) => btn.classList.add("gone"));
  await sleep(400);

  // Yulduzlar uning ismi shakliga yig'iladi
  formName(content.name);
  await sleep(1200);

  firework(W * 0.25, H * 0.25);
  await sleep(500);
  firework(W * 0.75, H * 0.25);

  await sleep(3500);
  $("#to-letter").classList.remove("hidden");
});

$("#to-letter").addEventListener("click", () => {
  // Yulduzlar yana osmonga qaytariladi
  stars.forEach((s) => {
    s.tx = Math.random() * W;
    s.ty = Math.random() * H;
  });
  setTimeout(() => {
    formMode = false;
    makeStars();
  }, 2000);

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

  // Qog'ozga bosilganda tezlashtirish (darhol to'liq chiqarish)
  $("#paper").addEventListener("click", () => {
    isTypingFastForward = true;
  });

  const lines = [letterData.greeting, "", ...letterData.paragraphs.flatMap((p) => [p, ""])];

  for (let l = 0; l < lines.length; l++) {
    const line = lines[l];
    for (let c = 0; c < line.length; c++) {
      if (isTypingFastForward) {
        // Darhol to'liq matnni chiqarish
        cursor.before(line.slice(c));
        break;
      }
      const char = line[c];
      cursor.before(char);

      // Tinish belgilarida o'ylanib to'xtash
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

  // Imzo qismi
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
  $("#paper").scrollTop = $("#paper").scrollHeight;
  isLetterDone = true;
}

$("#to-final").addEventListener("click", async () => {
  $("#final-title").textContent = content.finalMessage.title || "Bu hali hammasi emas...";
  $("#final-text").textContent = content.finalMessage.text || "Kechqurun ko'rishamiz ❤️";

  if (content.allowReply) {
    $("#reply-form").classList.remove("hidden");
  }

  showScene("final");

  await sleep(1600);
  fireworkShow(4);
});

/* =========================================================
   6. FINAL VA JAVOB YUBORISH
   ========================================================= */
$("#reply-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const textarea = $("#reply-text");
  const submitBtn = $("#reply-btn");
  const errorMsg = $("#reply-error");
  const text = textarea.value.trim();

  if (!text) return;

  submitBtn.disabled = true;
  submitBtn.textContent = "Yuborilmoqda... ⏳";
  errorMsg.classList.add("hidden");

  try {
    const res = await fetch("/api/reply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (res.ok) {
      $("#reply-form").classList.add("hidden");
      $("#reply-done").classList.remove("hidden");
      confetti(160);
      firework(W / 2, H * 0.35);
    } else {
      throw new Error("Xatolik");
    }
  } catch (err) {
    errorMsg.textContent = "Xabarni yuborishda xatolik yuz berdi. Qaytadan urinib ko'ring.";
    errorMsg.classList.remove("hidden");
    submitBtn.disabled = false;
    submitBtn.textContent = "Yuborish 💌";
  }
});

/* =========================================================
   ISHGA TUSHIRISH
   ========================================================= */
window.addEventListener("resize", () => {
  resize();
  if (!formMode) makeStars();
});

// Boshlang'ich initsializatsiya
resize();
makeStars();
drawBg();
checkStatusAndInit();
