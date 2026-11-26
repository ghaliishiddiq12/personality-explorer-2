// =====================================================================
// SOAL 6 (MISI 1): LARI AKHIR PEKAN
// Game lari 3 jalur dengan sepeda. Siswa melewati satu hari Sabtu (pagi -> malam).
// Di setiap persimpangan ada 3 kegiatan, satu di tiap jalur:
//   I = waktu tenang sendiri (introvert)
//   A = kegiatan seimbang / fleksibel (ambivert)
//   E = kegiatan bersama banyak orang (ekstrovert)
// Posisi ketiganya diacak tiap persimpangan. Siswa mengarahkan sepeda ke jalur
// pilihannya, melompat (panah atas) dan freestyle (panah bawah) untuk melewati
// rintangan. Ada 12 persimpangan -> 12 pilihan.
// Skor kecenderungan: pilihan terbanyak; jika seri = ambivert.
// Bergantung pada: ICON_PATHS, iconSvg, shuffle, pluralityKey, setMissionHeader,
// finishMission (missions.js) dan showScreen (script.js).
// =====================================================================

const runWaves = [
  { when: "Sabtu pagi", q: "Baru bangun tidur. Mau apa?",
    I: { t: "Baca buku di kamar", icon: "book" },
    A: { t: "Jalan pagi dengan 1 teman", icon: "bike" },
    E: { t: "Olahraga bareng satu tim", icon: "ball" } },
  { when: "Sabtu pagi", q: "Waktunya sarapan!",
    I: { t: "Sarapan sambil dengar musik", icon: "headphone" },
    A: { t: "Sarapan bareng keluarga", icon: "cup" },
    E: { t: "Sarapan ramai bareng geng", icon: "people" } },
  { when: "Sabtu pagi", q: "Ada kegiatan di sekolah.",
    I: { t: "Menggambar di kamar", icon: "pencil" },
    A: { t: "Ikut sebentar lalu pulang", icon: "calendar" },
    E: { t: "Jadi MC acara kelas", icon: "mic" } },
  { when: "Sabtu siang", q: "Ada tugas yang harus selesai.",
    I: { t: "Kerjakan sendiri dulu", icon: "book" },
    A: { t: "Diskusi sebentar, lanjut sendiri", icon: "chat" },
    E: { t: "Kerja bareng banyak teman", icon: "people" } },
  { when: "Sabtu siang", q: "Perut keroncongan.",
    I: { t: "Makan tenang di sudut", icon: "cup" },
    A: { t: "Makan bareng 2 teman dekat", icon: "people" },
    E: { t: "Makan di kantin yang ramai", icon: "cup" } },
  { when: "Sabtu siang", q: "Ada waktu luang.",
    I: { t: "Main game santai sendiri", icon: "gamepad" },
    A: { t: "Main game bareng 1 teman", icon: "gamepad" },
    E: { t: "Main bola bareng teman-teman", icon: "ball" } },
  { when: "Sabtu sore", q: "Cuaca cerah di taman.",
    I: { t: "Memotret pemandangan sendirian", icon: "camera" },
    A: { t: "Jalan santai berdua", icon: "bike" },
    E: { t: "Selfie rame-rame", icon: "camera" } },
  { when: "Sabtu sore", q: "Mau dengar musik?",
    I: { t: "Putar playlist favorit", icon: "headphone" },
    A: { t: "Ngejam berdua", icon: "guitar" },
    E: { t: "Nyanyi bareng di panggung", icon: "mic" } },
  { when: "Sabtu sore", q: "Ada undangan ulang tahun!",
    I: { t: "Kirim ucapan dari rumah", icon: "phone" },
    A: { t: "Datang sebentar, pulang awal", icon: "cake" },
    E: { t: "Datang dan ramaikan pesta", icon: "cake" } },
  { when: "Sabtu malam", q: "Saatnya hiburan malam.",
    I: { t: "Nonton film sendirian", icon: "tv" },
    A: { t: "Nonton bareng keluarga", icon: "tv" },
    E: { t: "Nonton bareng banyak teman", icon: "tv" } },
  { when: "Sabtu malam", q: "Malam makin larut.",
    I: { t: "Rebahan sambil baca komik", icon: "book" },
    A: { t: "Ngobrol santai 2-3 orang", icon: "chat" },
    E: { t: "Api unggun, kumpul rame-rame", icon: "people" } },
  { when: "Sabtu malam", q: "Sebelum tidur.",
    I: { t: "Menyendiri dulu, lalu tidur", icon: "mat" },
    A: { t: "Ngobrol sebentar, lalu tidur", icon: "phone" },
    E: { t: "Video call bareng teman", icon: "phone" } }
];
const RUN_TOTAL = runWaves.length;
const RUN_KEY = { I: "introvert", A: "ambivert", E: "ekstrovert" };

// ---------- Pengaturan kecepatan (ubah di sini untuk lebih lambat / cepat) ----------
const SPEED_BASE = 1.35;   // kecepatan awal
const SPEED_GAIN = 0.4;    // tambahan kecepatan sampai akhir
const THINK_SLOW = 0.5;    // pengali kecepatan saat pilihan kegiatan mendekat (waktu berpikir)
const THINK_FROM = 4.4;    // mulai melambat pada jarak ini
const THINK_FULL = 3.4;    // sudah paling lambat pada jarak ini

// ---------- Ukuran & tuning ----------
// Titik hilang & kemiringan tepi jalan pada gambar latar (satuan piksel gambar 1536x1024)
const BG = { w: 1536, h: 1024, vx: 763, vy: 520, slope: 2.3 };
const RUN = { W: 720, H: 405, k: 1, dpr: 1, laneGap: 194, cx: 360, hz: 220, py: 346, dmin: 0.7, narrow: false,
              ox: 0, oy: 0, bgScale: 1 };
const DFAR = 7.5;       // jarak awal benda (jauh)
const HIT_D = 1.0;      // jarak tempat benda "bertemu" pelari
const WAVE_GAP = 5.0;   // jarak antar persimpangan

// ---------- Gambar (aset dari Canva, folder assets/) ----------
const RUN_IMG = {};
const RIDER_FRAMES = 10;
const OBSTACLES = [
  // h = tinggi dalam satuan lebar jalur; low = bisa dilompati
  { n: "barrier", h: 0.42, low: true },
  { n: "bump", h: 0.2, low: true },
  { n: "crate", h: 0.38, low: true },
  { n: "log", h: 0.34, low: true },
  { n: "pothole", h: 0.28, low: true },
  { n: "puddle", h: 0.2, low: true },
  { n: "cone", h: 0.55, low: false },
  { n: "bin", h: 0.72, low: false },
  { n: "scooter", h: 0.8, low: false },
  { n: "sign", h: 0.7, low: false },
  { n: "boxes", h: 0.75, low: false },
  { n: "cart", h: 0.85, low: false }
];
function loadRunImages() {
  if (RUN_IMG.loaded) return;
  RUN_IMG.loaded = true;
  const add = (key, file) => { const im = new Image(); im.src = "assets/" + file; RUN_IMG[key] = im; };
  add("bg0", "bg-siang.jpg"); add("bg1", "bg-sore.jpg"); add("bg2", "bg-malam.jpg");
  for (let i = 1; i <= 13; i++) add("rider" + i, `rider-${i}.png`);
  OBSTACLES.forEach(o => add("obs-" + o.n, `obs-${o.n}.png`));
  ["puff", "speed", "sparkle", "stars", "burst"].forEach(n => add("fx-" + n, `fx-${n}.png`));
}
const imgOk = im => im && im.complete && im.naturalWidth > 0;

let run = null;
let runToken = 0;
let runCanvasTop = null, runCtxTop = null;
let runCanvas = null, runCtx = null, runWrap = null, runStage = null, runItemsEl = null;

// ---------- Warna ----------
const hex2rgb = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
function mixHex(a, b, t) {
  const A = hex2rgb(a), B = hex2rgb(b);
  return `rgb(${Math.round(A[0] + (B[0] - A[0]) * t)},${Math.round(A[1] + (B[1] - A[1]) * t)},${Math.round(A[2] + (B[2] - A[2]) * t)})`;
}
function shade(rgbStr, amt) {
  const m = rgbStr.match(/\d+/g).map(Number);
  const f = c => Math.max(0, Math.min(255, Math.round(amt >= 0 ? c + (255 - c) * amt : c * (1 + amt))));
  return `rgb(${f(m[0])},${f(m[1])},${f(m[2])})`;
}
function mixRgb(a, b, t) {
  const A = a.match(/\d+/g).map(Number), B = b.match(/\d+/g).map(Number);
  return `rgb(${Math.round(A[0] + (B[0] - A[0]) * t)},${Math.round(A[1] + (B[1] - A[1]) * t)},${Math.round(A[2] + (B[2] - A[2]) * t)})`;
}
const smooth = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
// bobot latar: siang -> sore -> malam
const skyWeights = p => ({ aS: smooth(0.38, 0.52, p), aN: smooth(0.68, 0.82, p) });

// ---------- Suara ----------
function runBeep(f, d = 0.12, type = "sine", vol = 0.05, to = null) {
  if (window.GameAudio) GameAudio.beep(f, d, type, vol, to);
}

function showOverlay(text, cls) {
  const ov = document.getElementById("run-overlay");
  ov.className = "run-overlay";
  void ov.offsetWidth;
  ov.textContent = text;
  ov.className = "run-overlay pop " + (cls || "");
}

// ---------- Mulai misi ----------
function startRun() {
  runToken++;
  loadRunImages();
  runCanvas = document.getElementById("run-canvas");
  runCtx = runCanvas.getContext("2d");
  runCanvasTop = document.getElementById("run-canvas-top");   // lapisan atas: pelari selalu terlihat
  runCtxTop = runCanvasTop.getContext("2d");
  runWrap = document.getElementById("run-wrap");
  runStage = document.getElementById("run-stage");
  runItemsEl = document.getElementById("run-items");

  run = {
    token: runToken, state: "idle", t: 0, scroll: 0, dist: 0,
    spawned: 0, obsN: 0, resolved: 0, p: 0, mult: 1, speed: 0,
    score: 0, hits: 0, tricks: 0, picks: [], entities: [], fx: [],
    lane: 1, laneF: 1, stun: 0, shake: 0, jump: null,
    count: 0, finishT: 0, last: performance.now()
  };

  setMissionHeader("run-screen");
  runItemsEl.innerHTML = "";
  document.getElementById("run-score").textContent = "0";
  document.getElementById("run-overlay").textContent = "";
  document.getElementById("run-overlay").className = "run-overlay";
  document.getElementById("run-steps").innerHTML = Array.from({ length: RUN_TOTAL }, () => "<i></i>").join("");
  document.getElementById("run-intro").style.display = "";
  document.getElementById("run-recap").hidden = true;
  document.getElementById("run-controls").hidden = false;
  document.getElementById("run-start").style.display = "";
  runUpdateCaption();
  runWrap.classList.remove("running");

  showScreen("run-screen");
  layoutRun();
  requestAnimationFrame(runFrame);
}

function beginRun() {
  if (!run || run.state !== "idle") return;
  document.getElementById("run-start").style.display = "none";
  document.getElementById("run-intro").style.display = "none";
  runWrap.classList.add("running");
  if (window.GameAudio) GameAudio.music("run");
  run.state = "count";
  run.count = 0;
  runCountTick(-1);
  layoutRun();
  runWrap.scrollIntoView({ block: "nearest", behavior: "smooth" });
}

const COUNT_STEPS = ["3", "2", "1", "LARI!"];
let lastCountIdx = -1;
function runCountTick(i) {
  lastCountIdx = i;
  if (i < 0) return;
  showOverlay(COUNT_STEPS[i], i === 3 ? "go" : "");
  runBeep(i === 3 ? 880 : 520, i === 3 ? 0.3 : 0.12, "square", 0.04);
}

// ---------- Tata letak (arena 16:9, skala kanvas mengikuti lebar layar) ----------
function layoutRun() {
  if (!runWrap) return;
  const w = runWrap.clientWidth || 360;
  const narrow = w < 600;
  RUN.narrow = narrow;
  RUN.W = 720;
  RUN.H = narrow ? 540 : 405;          // layar lebar 16:9, HP tegak dibuat lebih tinggi agar teks terbaca
  RUN.k = w / RUN.W;
  RUN.dpr = Math.min(2, window.devicePixelRatio || 1);
  RUN.laneGap = RUN.W * (narrow ? 0.30 : 0.27);

  // Gambar latar menutupi arena; titik hilangnya dijadikan cakrawala permainan
  const sc = Math.max(RUN.W / BG.w, RUN.H / BG.h);
  const imgW = BG.w * sc, imgH = BG.h * sc;
  RUN.bgScale = sc;
  RUN.ox = (RUN.W - imgW) / 2;
  const vyImg = BG.vy * sc;
  RUN.oy = Math.max(RUN.H - imgH, Math.min(0, RUN.H * 0.545 - vyImg));
  RUN.hz = RUN.oy + vyImg;
  RUN.cx = RUN.ox + BG.vx * sc;
  RUN.py = RUN.hz + (1.5 * RUN.laneGap) / BG.slope;     // tepi jalan = kemiringan tepi trotoar pada gambar
  RUN.dmin = (RUN.py - RUN.hz) / (RUN.H - RUN.hz);

  runWrap.classList.toggle("narrow", narrow);
  runStage.style.width = RUN.W + "px";
  runStage.style.height = RUN.H + "px";
  runStage.style.transform = `scale(${RUN.k})`;
  runStage.style.setProperty("--lane", RUN.laneGap + "px");
  runWrap.style.height = Math.round(RUN.H * RUN.k) + "px";

  runCanvas.style.width = RUN.W + "px";
  runCanvas.style.height = RUN.H + "px";
  runCanvas.width = Math.round(RUN.W * RUN.k * RUN.dpr);
  runCanvas.height = Math.round(RUN.H * RUN.k * RUN.dpr);
  runCanvasTop.style.width = RUN.W + "px";
  runCanvasTop.style.height = RUN.H + "px";
  runCanvasTop.width = runCanvas.width;
  runCanvasTop.height = runCanvas.height;
}

// ---------- Proyeksi perspektif ----------
const sOf = d => 1 / d;
const yOf = s => RUN.hz + (RUN.py - RUN.hz) * s;
const laneX = (lane, s) => RUN.cx + (lane - 1) * RUN.laneGap * s;
const roadHalf = s => 1.5 * RUN.laneGap * s;

// ---------- Spawn ----------
function spawnWave() {
  const idx = run.spawned++;
  const w = runWaves[idx];
  const types = shuffle(["I", "A", "E"]);
  const items = types.map((type, lane) => {
    const data = w[type];
    const el = document.createElement("div");
    el.className = "run-item";
    el.innerHTML =
      `<div class="ri-in"><span class="ri-label"></span><span class="tile">${iconSvg(data.icon, 46)}</span></div>`;
    el.querySelector(".ri-label").textContent = data.t;
    runItemsEl.appendChild(el);
    return { type, lane, el };
  });
  run.entities.push({ kind: "wave", idx, d: DFAR, items, done: false });
}

function spawnObstacle() {
  const o = OBSTACLES[Math.floor(Math.random() * OBSTACLES.length)];
  run.entities.push({ kind: "obs", d: DFAR, lane: Math.floor(Math.random() * 3), o, done: false });
}

// ---------- Efek ----------
function pushFx(name, x, y, life, scale, rise = 0, alpha = 1) {
  run.fx.push({ name, x, y, t: 0, life, scale, rise, alpha });
}

// ---------- Aturan satu langkah ----------
function runNearestLane() {
  return Math.max(0, Math.min(2, Math.round(run.laneF)));
}

// tinggi lompatan saat ini (piksel pada s = 1) dan kemajuan 0..1
function jumpState() {
  const j = run.jump;
  if (!j) return { h: 0, u: 0 };
  const u = Math.min(1, j.t / j.dur);
  return { h: j.high * 4 * u * (1 - u), u };
}

function startJump(trick) {
  if (!run || (run.state !== "run" && run.state !== "count")) return;
  if (run.jump) return;
  const g = RUN.laneGap;
  run.jump = trick
    ? { t: 0, dur: 1.15, high: g * 0.78, trick: ["spin", "flip", "table"][Math.floor(Math.random() * 3)], dir: Math.random() < 0.5 ? -1 : 1 }
    : { t: 0, dur: 0.85, high: g * 0.58, trick: null, dir: 1 };
  runBeep(trick ? 320 : 380, 0.2, "sine", 0.06, trick ? 760 : 620);
  pushFx("puff", laneX(run.laneF, 1), RUN.py + 2, 0.5, 0.35, 0, 0.8);
}

function runUpdateCaption() {
  const w = runWaves[Math.min(run.resolved, RUN_TOTAL - 1)];
  document.getElementById("run-when").textContent = w.when.toUpperCase();
  document.getElementById("run-q").textContent = w.q;
}

function resolveWave(e) {
  const lane = runNearestLane();
  const chosen = e.items[lane];
  run.picks.push(chosen.type);
  run.score += 10;
  run.resolved++;

  e.items.forEach(it => {
    const inner = it.el.querySelector(".ri-in");
    if (it === chosen) {
      it.el.style.opacity = 1;
      it.el.style.filter = "none";
      inner.classList.add("got");
      const pop = document.createElement("div");
      pop.className = "run-pop";
      pop.textContent = "+10";
      pop.style.left = it.el._x + "px";
      pop.style.top = (it.el._y - 150) + "px";
      runItemsEl.appendChild(pop);
      setTimeout(() => pop.remove(), 900);
      pushFx("sparkle", it.el._x, it.el._y - RUN.laneGap * 0.3, 0.6, 0.55, -20, 1);
    } else {
      inner.classList.add("gone");
    }
    setTimeout(() => it.el.remove(), 700);
  });

  document.getElementById("run-score").textContent = run.score;
  const dots = document.querySelectorAll("#run-steps i");
  if (dots[run.resolved - 1]) dots[run.resolved - 1].classList.add("done");
  runBeep(660, 0.1, "triangle", 0.06, 990);
  setTimeout(() => runBeep(990, 0.12, "triangle", 0.05), 70);
  runUpdateCaption();
}

function hitObstacle(x, y) {
  run.hits++;
  run.stun = 0.9;
  run.shake = 0.35;
  run.score = Math.max(0, run.score - 5);
  document.getElementById("run-score").textContent = run.score;
  runBeep(180, 0.25, "sawtooth", 0.06, 70);
  pushFx("burst", x, y - RUN.laneGap * 0.3, 0.45, 0.55, 0, 1);
  showOverlay("Aduh!", "hit");
}

function setRunLane(l) {
  if (!run || (run.state !== "run" && run.state !== "count")) return;
  const nl = Math.max(0, Math.min(2, l));
  if (nl !== run.lane) runBeep(420, 0.06, "sine", 0.025, 520);
  run.lane = nl;
}

// ---------- Perulangan ----------
function runFrame(now) {
  if (!run || run.token !== runToken) return;
  if (!document.getElementById("run-screen").classList.contains("active")) return;
  const dt = Math.min(0.05, Math.max(0, (now - run.last) / 1000));
  run.last = now;
  runUpdate(dt);
  runDraw();
  requestAnimationFrame(runFrame);
}

function runUpdate(dt) {
  run.t += dt;
  run.stun = Math.max(0, run.stun - dt);
  run.shake = Math.max(0, run.shake - dt);
  run.laneF += (run.lane - run.laneF) * Math.min(1, dt * 11);

  const targetP = run.resolved / RUN_TOTAL;
  run.p += (targetP - run.p) * Math.min(1, dt * 1.2);

  // lompatan
  if (run.jump) {
    run.jump.t += dt;
    if (run.jump.t >= run.jump.dur) {
      const tr = run.jump.trick;
      run.jump = null;
      pushFx("puff", laneX(run.laneF, 1), RUN.py + 2, 0.55, 0.5, 0, 0.9);
      if (tr && run.stun <= 0) {
        run.tricks++;
        run.score += 15;
        document.getElementById("run-score").textContent = run.score;
        pushFx("stars", laneX(run.laneF, 1), RUN.py - RUN.laneGap * 0.9, 0.9, 0.8, -30, 1);
        showOverlay("KEREN! +15", "trick");
        [660, 880, 1175].forEach((f, i) => setTimeout(() => runBeep(f, 0.14, "triangle", 0.05), i * 70));
      } else {
        runBeep(150, 0.1, "sine", 0.05, 90);
      }
    }
  }

  let step = 0.9 * dt; // kecepatan latar saat menunggu / hitung mundur
  if (run.state === "count") {
    run.count += dt;
    const idx = Math.min(3, Math.floor(run.count / 0.75));
    if (idx !== lastCountIdx) runCountTick(idx);
    if (run.count >= 3.0) {
      run.state = "run";
      setTimeout(() => {
        if (run && run.state === "run") document.getElementById("run-overlay").className = "run-overlay";
      }, 450);
    }
  }

  if (run.state === "run") {
    // Melambat otomatis ketika pilihan kegiatan mendekat, supaya sempat membaca dan berpikir
    let nearest = 99;
    run.entities.forEach(e => { if (e.kind === "wave" && !e.done) nearest = Math.min(nearest, e.d); });
    const tSlow = Math.max(0, Math.min(1, (THINK_FROM - nearest) / (THINK_FROM - THINK_FULL)));
    const targetMult = 1 - (1 - THINK_SLOW) * tSlow;
    run.mult += (targetMult - run.mult) * Math.min(1, dt * 4);

    const v = (SPEED_BASE + SPEED_GAIN * run.resolved / RUN_TOTAL) * run.mult * (run.stun > 0 ? 0.6 : 1);
    run.speed = v;
    step = v * dt;
    run.dist += step;
    run.entities.forEach(e => { e.d -= step; });

    if (run.spawned < RUN_TOTAL && run.dist >= run.spawned * WAVE_GAP) spawnWave();
    if (run.obsN < RUN_TOTAL - 1 && run.dist >= WAVE_GAP / 2 + run.obsN * WAVE_GAP) {
      if (Math.random() < 0.9) spawnObstacle();
      run.obsN++;
    }

    run.entities.forEach(e => {
      if (e.done || e.d > HIT_D) return;
      e.done = true;
      if (e.kind === "wave") { resolveWave(e); return; }
      if (e.lane !== runNearestLane()) return;
      const jh = jumpState().h;
      const cleared = e.o.low && jh > RUN.laneGap * 0.14;
      if (cleared) {
        run.score += 2;
        document.getElementById("run-score").textContent = run.score;
        runBeep(900, 0.08, "triangle", 0.04);
      } else {
        hitObstacle(laneX(e.lane, 1), RUN.py);
      }
    });
    run.entities = run.entities.filter(e => !(e.kind === "wave" && e.done) && e.d > RUN.dmin);

    if (run.resolved >= RUN_TOTAL && run.state === "run") {
      run.state = "finish";
      run.finishT = 0;
      showOverlay("SELESAI!", "go");
      [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => runBeep(f, 0.2, "triangle", 0.06), i * 110));
    }
  } else if (run.state === "finish") {
    run.finishT += dt;
    step = Math.max(0.3, 1.6 - run.finishT * 1.0) * dt;
    run.dist += step;
    run.entities.forEach(e => { e.d -= step; });
    run.entities = run.entities.filter(e => e.d > RUN.dmin);
    if (run.finishT > 1.7) {
      run.state = "done";
      showRunRecap();
    }
  } else if (run.state === "done") {
    step = 0.4 * dt;
  }
  run.scroll += step;

  // efek
  run.fx.forEach(f => { f.t += dt; });
  run.fx = run.fx.filter(f => f.t < f.life);

  // posisi benda DOM
  run.entities.forEach(e => {
    if (e.kind !== "wave" || e.done) return;
    const s = sOf(e.d);
    const sv = Math.pow(s, 0.72);            // benda tampak lebih besar dari jauh agar mudah dibaca
    const fade = Math.max(0, Math.min(1, (s - 0.13) / 0.14));        // jauh: samar -> jelas
    const blur = 6 * (1 - smooth(0.13, 0.26, s));                    // jauh: buram -> tajam sebelum waktu membaca
    const up = smooth(2.3, 1.0, e.d);                                // dekat pelari: 0 -> 1 (naik melewati atas kepala)
    const near = runNearestLane();
    e.items.forEach(it => {
      const x = laneX(it.lane, sv), y0 = yOf(s);   // jarak antar benda ikut membesar supaya teks tidak saling tumpuk
      const lift = up * RUN.laneGap * 0.8;
      const y = y0 - lift;
      it.el._x = x; it.el._y = y;
      const bob = Math.sin(run.t * 4 + it.lane) * 4 * sv * (1 - up);
      it.el.style.transform = `translate(${x}px, ${y - 10 * sv + bob}px) translate(-50%, -100%) scale(${sv * (1 - 0.18 * up)})`;
      it.el.style.opacity = fade * (1 - 0.6 * up);
      it.el.style.filter = blur > 0.25 ? `blur(${blur.toFixed(1)}px)` : "none";
      it.el.classList.toggle("hot", it.lane === near && e.d < 3.6);
    });
  });
}

function showRunRecap() {
  const stars = run.hits === 0 ? 3 : run.hits <= 2 ? 2 : 1;
  const starSvg = on => `<svg viewBox="0 0 24 24" width="38" height="38"><path d="M12 2l3 6.500 7 .8-5.200 4.800 1.500 7L12 17.400 5.700 21l1.500-7L2 9.300l7-.8z" fill="${on ? "#ffc83d" : "#d7e2f2"}" stroke="${on ? "#e8890f" : "#b9c9df"}" stroke-width="1.5" stroke-linejoin="round"/></svg>`;
  document.getElementById("run-stars").innerHTML = [1, 2, 3].map(n => starSvg(n <= stars)).join("");
  document.getElementById("run-stat-pick").textContent = `${run.picks.length}/${RUN_TOTAL}`;
  document.getElementById("run-stat-hit").textContent = run.hits;
  document.getElementById("run-stat-trick").textContent = run.tricks;
  document.getElementById("run-stat-score").textContent = run.score;
  document.getElementById("run-overlay").className = "run-overlay";
  document.getElementById("run-controls").hidden = true;
  document.getElementById("run-recap").hidden = false;
  runWrap.classList.remove("running");
  if (window.GameAudio) GameAudio.music("calm");
  document.getElementById("run-recap").scrollIntoView({ block: "nearest", behavior: "smooth" });
}

function finishRun() {
  if (!run || run.state !== "done") return;
  const keys = run.picks.map(t => RUN_KEY[t]);
  runToken++;
  finishMission(pluralityKey(keys));
}

// =====================================================================
// MENGGAMBAR
// =====================================================================
const ASPHALT = ["rgb(104,105,111)", "rgb(92,66,56)", "rgb(40,48,78)"];   // siang, sore, malam (diambil dari gambar latar)

function runDraw() {
  const { W, H, hz, py, cx, laneGap, k, dpr } = RUN;
  const ctx = runCtx;
  const p = run.p;
  const { aS, aN } = skyWeights(p);
  ctx.setTransform(k * dpr, 0, 0, k * dpr, 0, 0);
  ctx.clearRect(0, 0, W, H);
  ctx.save();
  const shx = run.shake > 0 ? (Math.random() - 0.5) * 7 : 0, shy = run.shake > 0 ? (Math.random() - 0.5) * 5 : 0;
  ctx.translate(shx, shy);

  // Latar: siang -> sore -> malam
  ctx.fillStyle = "#8cc8ff";
  ctx.fillRect(-10, -10, W + 20, H + 20);
  const iw = BG.w * RUN.bgScale, ih = BG.h * RUN.bgScale;
  if (imgOk(RUN_IMG.bg0)) ctx.drawImage(RUN_IMG.bg0, RUN.ox, RUN.oy, iw, ih);
  if (aS > 0.001 && imgOk(RUN_IMG.bg1)) { ctx.globalAlpha = aS; ctx.drawImage(RUN_IMG.bg1, RUN.ox, RUN.oy, iw, ih); }
  if (aN > 0.001 && imgOk(RUN_IMG.bg2)) { ctx.globalAlpha = aN; ctx.drawImage(RUN_IMG.bg2, RUN.ox, RUN.oy, iw, ih); }
  ctx.globalAlpha = 1;

  // Jalan beraspal tiga jalur (pita bergerak mengikuti jarak). Menutupi jalan pada gambar latar.
  const roadBase = mixRgb(mixRgb(ASPHALT[0], ASPHALT[1], aS), ASPHALT[2], aN);
  const dashCol = mixRgb("rgb(236,232,220)", "rgb(150,162,196)", aN);
  const band = 0.8;
  const off = run.scroll % (2 * band);
  const dEnd = 46;
  for (let i = 0; i < 80; i++) {
    let d1 = i * band - off, d2 = d1 + band;
    if (d1 > dEnd) break;
    if (d2 <= RUN.dmin) continue;
    d1 = Math.max(d1, RUN.dmin);
    const s1 = sOf(d1), s2 = sOf(d2);
    const y1 = yOf(s1), y2 = yOf(s2);
    const alt = i % 2 === 0;
    ctx.fillStyle = alt ? roadBase : shade(roadBase, 0.05);
    ctx.beginPath();
    ctx.moveTo(cx - roadHalf(s1), y1 + 1.5); ctx.lineTo(cx + roadHalf(s1), y1 + 1.5);
    ctx.lineTo(cx + roadHalf(s2), y2 - 0.5); ctx.lineTo(cx - roadHalf(s2), y2 - 0.5);
    ctx.closePath(); ctx.fill();
    if (alt) {
      ctx.fillStyle = dashCol;
      [-0.5, 0.5].forEach(m => {
        const w1 = 3.4 * s1, w2 = 3.4 * s2;
        const x1 = cx + m * laneGap * s1, x2 = cx + m * laneGap * s2;
        ctx.beginPath();
        ctx.moveTo(x1 - w1, y1); ctx.lineTo(x1 + w1, y1); ctx.lineTo(x2 + w2, y2); ctx.lineTo(x2 - w2, y2);
        ctx.closePath(); ctx.fill();
      });
    }
  }

  // Tiang lampu + pohon tepi jalan yang bergerak, bersama rintangan, urut dari jauh ke dekat
  const gapSide = 2.4;
  const sOff = run.scroll % gapSide;
  const sBase = Math.floor(run.scroll / gapSide);
  const list = [];
  for (let i = 1; i < 18; i++) {
    const d = i * gapSide - sOff;
    if (d < RUN.dmin) continue;
    const id = i + sBase;
    list.push({ d, kind: "lamp", side: -1 });
    list.push({ d, kind: "lamp", side: 1 });
    if (id % 2 === 0) {
      list.push({ d: d + gapSide / 2, kind: "tree", id, side: -1 });
      list.push({ d: d + gapSide / 2, kind: "tree", id: id + 999, side: 1 });
    }
  }
  run.entities.forEach(e => { if (e.kind === "obs") list.push({ d: e.d, kind: "obs", e }); });
  list.sort((a, b) => b.d - a.d);
  list.forEach(o => {
    const s = sOf(o.d);
    if (o.d < RUN.dmin) return;
    if (o.kind === "lamp") drawLamp(ctx, o.side, s, aN);
    else if (o.kind === "tree") drawTree(ctx, o, s, aN);
    else drawObstacle(ctx, o.e, s);
  });

  // efek (debu, bintang, kilau, ledakan kecil)
  run.fx.forEach(f => {
    const im = RUN_IMG["fx-" + f.name];
    if (!imgOk(im)) return;
    const u = f.t / f.life;
    const w = im.naturalWidth * f.scale * (0.7 + 0.5 * u), h = im.naturalHeight * f.scale * (0.7 + 0.5 * u);
    ctx.globalAlpha = f.alpha * (1 - u * u);
    ctx.drawImage(im, f.x - w / 2, f.y - h + f.rise * u, w, h);
    ctx.globalAlpha = 1;
  });

  ctx.restore();
  if (aN > 0) {
    ctx.fillStyle = `rgba(10,20,60,${aN * 0.1})`;
    ctx.fillRect(0, 0, W, H);
  }

  // Pelari digambar di kanvas lapisan ATAS (di atas kegiatan), jadi tidak pernah tertutup
  const top = runCtxTop;
  top.setTransform(k * dpr, 0, 0, k * dpr, 0, 0);
  top.clearRect(0, 0, W, H);
  top.save();
  top.translate(shx, shy);
  drawRider(top, laneX(run.laneF, 1), py);
  top.restore();
  if (aN > 0) {
    top.globalCompositeOperation = "source-atop";    // malam: ikut digelapkan seperti latar
    top.fillStyle = `rgba(10,20,60,${aN * 0.1})`;
    top.fillRect(0, 0, W, H);
    top.globalCompositeOperation = "source-over";
  }
}

function hash01(n) {
  const x = Math.sin(n * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

function drawLamp(ctx, side, s, aN) {
  const x = RUN.cx + side * (roadHalf(1) + 58) * s;
  const y = yOf(s);
  const hgt = RUN.laneGap * 1.25 * s;
  ctx.fillStyle = "rgba(0,0,0,.18)";
  ctx.beginPath(); ctx.ellipse(x, y, 12 * s, 3.5 * s, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = "#7c8799";
  ctx.lineWidth = Math.max(1.5, 5 * s);
  ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - hgt);
  ctx.quadraticCurveTo(x, y - hgt - 24 * s, x - side * 30 * s, y - hgt - 18 * s);
  ctx.stroke();
  ctx.fillStyle = aN > 0.3 ? "#ffe9a0" : "#dfe7f2";
  ctx.beginPath(); ctx.ellipse(x - side * 32 * s, y - hgt - 15 * s, 11 * s, 5 * s, 0, 0, Math.PI * 2); ctx.fill();
  if (aN > 0.3) {
    const g = ctx.createRadialGradient(x - side * 32 * s, y - hgt - 12 * s, 2, x - side * 32 * s, y - hgt - 12 * s, 60 * s);
    g.addColorStop(0, `rgba(255,226,140,${0.55 * aN})`); g.addColorStop(1, "rgba(255,226,140,0)");
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(x - side * 32 * s, y - hgt - 12 * s, 60 * s, 0, Math.PI * 2); ctx.fill();
  }
}

function drawTree(ctx, o, s, aN) {
  const x = RUN.cx + o.side * (roadHalf(1) + 150 + hash01(o.id) * 70) * s;
  const y = yOf(s);
  const sc = s * (0.85 + hash01(o.id + 3) * 0.35);
  const canopy = mixRgb("rgb(62,160,88)", "rgb(26,80,66)", aN);
  ctx.fillStyle = "rgba(0,0,0,.15)";
  ctx.beginPath(); ctx.ellipse(x, y, 30 * sc, 7 * sc, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = mixRgb("rgb(138,90,51)", "rgb(60,44,40)", aN);
  ctx.fillRect(x - 6 * sc, y - 50 * sc, 12 * sc, 50 * sc);
  ctx.fillStyle = canopy;
  ctx.beginPath(); ctx.arc(x, y - 74 * sc, 34 * sc, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x - 22 * sc, y - 58 * sc, 23 * sc, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x + 23 * sc, y - 60 * sc, 24 * sc, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = shade(canopy, 0.15);
  ctx.beginPath(); ctx.arc(x - 9 * sc, y - 85 * sc, 15 * sc, 0, Math.PI * 2); ctx.fill();
}

function drawObstacle(ctx, e, s) {
  const im = RUN_IMG["obs-" + e.o.n];
  const x = laneX(e.lane, s), y = yOf(s);
  const h = e.o.h * RUN.laneGap * s;
  ctx.fillStyle = "rgba(0,0,0,.22)";
  ctx.beginPath(); ctx.ellipse(x, y, 0.26 * RUN.laneGap * s, 0.05 * RUN.laneGap * s, 0, 0, Math.PI * 2); ctx.fill();
  if (!imgOk(im)) return;
  const w = h * im.naturalWidth / im.naturalHeight;
  ctx.drawImage(im, x - w / 2, y - h + h * 0.04, w, h);
}

// Siswa bersepeda dari belakang (sprite dari Canva). Lompat = naik; trik = putar / salto / miring.
function drawRider(ctx, x, py) {
  const jmp = jumpState();
  const gap = RUN.laneGap;
  const scale = (gap * 0.82) / 316;
  const moving = run.lane - run.laneF;
  const flick = run.stun > 0 && Math.floor(run.t * 18) % 2 === 0;

  // pilih gambar
  let img, flip = false;
  if (run.jump) {
    img = RUN_IMG["rider5"];
  } else if (Math.abs(moving) > 0.2) {
    img = RUN_IMG["rider11"];
    flip = moving > 0;
  } else {
    const fps = run.state === "run" || run.state === "finish" ? 9 + run.speed * 3 : 6;
    img = RUN_IMG["rider" + (1 + (Math.floor(run.t * fps) % RIDER_FRAMES))];
  }

  // bayangan di tanah (mengecil saat melompat)
  const sh = 1 - Math.min(0.55, jmp.h / (gap * 1.4));
  ctx.fillStyle = `rgba(0,0,0,${0.28 * sh})`;
  ctx.beginPath(); ctx.ellipse(x, py + 3, gap * 0.2 * sh, gap * 0.045 * sh, 0, 0, Math.PI * 2); ctx.fill();

  if (!imgOk(img)) return;
  const w = img.naturalWidth * scale, h = img.naturalHeight * scale;
  const bob = run.jump || run.state !== "run" ? 0 : Math.abs(Math.sin(run.t * 9)) * 2;

  ctx.save();
  if (flick) ctx.globalAlpha = 0.5;
  ctx.translate(x, py - jmp.h - bob + 3);
  const j = run.jump;
  let rot = moving * 0.05, sx = flip ? -1 : 1;
  if (j) {
    const uu = Math.max(0, Math.min(1, (jmp.u - 0.12) / 0.76));
    rot += -0.2 * Math.sin(Math.PI * jmp.u) * 0.5;      // hidung sepeda naik sedikit
    if (j.trick === "flip") rot = -2 * Math.PI * uu * j.dir;
    else if (j.trick === "table") rot = Math.sin(Math.PI * uu) * 1.2 * j.dir;
    else if (j.trick === "spin") sx = Math.cos(2 * Math.PI * uu);
  }
  ctx.translate(0, -h / 2);
  ctx.rotate(rot);
  ctx.scale(sx, 1);
  ctx.drawImage(img, -w / 2, -h / 2, w, h);
  ctx.restore();

  // bintang berputar saat tersandung
  if (run.stun > 0) {
    for (let i = 0; i < 3; i++) {
      const a = run.t * 8 + i * 2.1;
      ctx.fillStyle = "#ffc83d";
      ctx.beginPath(); ctx.arc(x + Math.cos(a) * 26, py - h - 6 + Math.sin(a) * 7, 4.5, 0, Math.PI * 2); ctx.fill();
    }
  }
}

// =====================================================================
// KENDALI: ketuk / seret, geser atas-bawah, tombol panah, tombol layar
// =====================================================================
function setupRun() {
  const wrap = document.getElementById("run-wrap");
  let pressing = false, sx = 0, sy = 0, fired = false;

  const laneFromEvent = e => {
    const r = wrap.getBoundingClientRect();
    const f = (e.clientX - r.left) / r.width;
    return f < 0.36 ? 0 : f > 0.64 ? 2 : 1;
  };

  wrap.addEventListener("pointerdown", e => {
    if (e.target.closest("button")) return;
    pressing = true; fired = false;
    sx = e.clientX; sy = e.clientY;
    try { wrap.setPointerCapture(e.pointerId); } catch (err) { /* abaikan */ }
    setRunLane(laneFromEvent(e));
  });
  wrap.addEventListener("pointermove", e => {
    if (!pressing) return;
    const dx = e.clientX - sx, dy = e.clientY - sy;
    // geser vertikal: atas = lompat, bawah = trik freestyle
    if (!fired && Math.abs(dy) > 38 && Math.abs(dy) > Math.abs(dx) * 1.2) {
      fired = true;
      startJump(dy > 0);
      return;
    }
    if (!fired) setRunLane(laneFromEvent(e));
  });
  const up = () => { pressing = false; };
  wrap.addEventListener("pointerup", up);
  wrap.addEventListener("pointercancel", up);

  document.addEventListener("keydown", e => {
    if (!run || !document.getElementById("run-screen").classList.contains("active")) return;
    const k = e.key;
    if (k === "ArrowLeft" || k === "a" || k === "A") { e.preventDefault(); setRunLane(run.lane - 1); }
    else if (k === "ArrowRight" || k === "d" || k === "D") { e.preventDefault(); setRunLane(run.lane + 1); }
    else if (k === "ArrowUp" || k === "w" || k === "W") { e.preventDefault(); startJump(false); }
    else if (k === "ArrowDown" || k === "s" || k === "S") { e.preventDefault(); startJump(true); }
  });

  document.getElementById("run-left").addEventListener("click", () => setRunLane(run.lane - 1));
  document.getElementById("run-right").addEventListener("click", () => setRunLane(run.lane + 1));
  document.getElementById("run-jump").addEventListener("click", () => startJump(false));
  document.getElementById("run-trick").addEventListener("click", () => startJump(true));

  // tombol bisu (#run-sound) diatur oleh audio.js

  window.addEventListener("resize", () => { if (run && runWrap) layoutRun(); });
}

setupRun();
