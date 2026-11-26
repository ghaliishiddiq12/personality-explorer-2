// =====================================================================
// RONDE 2: 5 MISI INTERAKTIF
// Setiap misi menghasilkan SATU kecenderungan (introvert / ekstrovert / ambivert)
// yang dihitung dari cara siswa bermain, lalu ditambahkan +1 ke skor.
// Bergantung pada: scores, answerLog, questions, TOTAL_STEPS, MISSION_COUNT,
// showScreen, showResult (semuanya ada di script.js).
// =====================================================================

let missionIndex = 0;

// ---------- Ikon garis (tanpa emoji) ----------
const ICON_PATHS = {
  book: '<path d="M6 12c6-3 13-3 18 1v25c-5-4-12-4-18-1z"/><path d="M42 12c-6-3-13-3-18 1v25c5-4 12-4 18-1z"/>',
  pencil: '<path d="M8 40l2-8L32 10l6 6L16 38z"/><path d="M28 14l6 6"/><path d="M10 32l6 6"/>',
  headphone: '<path d="M9 30v-6a15 15 0 0 1 30 0v6"/><rect x="6" y="28" width="8" height="12" rx="3"/><rect x="34" y="28" width="8" height="12" rx="3"/>',
  gamepad: '<rect x="5" y="14" width="38" height="22" rx="10"/><path d="M15 21v8M11 25h8"/><circle cx="32" cy="22" r="1.5"/><circle cx="36" cy="27" r="1.5"/>',
  ball: '<circle cx="24" cy="24" r="17"/><path d="M24 7v34M7 24h34"/><path d="M12 11c6 6 6 20 0 26M36 11c-6 6-6 20 0 26"/>',
  cup: '<path d="M9 16h26v12a10 10 0 0 1-10 10h-6A10 10 0 0 1 9 28z"/><path d="M35 19h4a4 4 0 0 1 0 9h-4"/><path d="M16 6v5M23 6v5M30 6v5"/>',
  people: '<circle cx="17" cy="16" r="6"/><path d="M5 40c0-8 5-13 12-13s12 5 12 13"/><circle cx="33" cy="18" r="5"/><path d="M33 28c6 0 10 4 10 12"/>',
  tv: '<rect x="5" y="9" width="38" height="26" rx="4"/><path d="M19 17l12 6-12 6z"/><path d="M16 42h16"/>',
  guitar: '<path d="M30 18l10-10M36 6l6 6"/><path d="M28 20c-4-3-9-1-10 3-1 3-4 3-6 5-4 4-3 10 2 13s10 3 13-1c2-2 2-5 5-6 4-1 6-6 3-10z"/><circle cx="21" cy="30" r="2"/>',
  cards: '<rect x="8" y="10" width="20" height="28" rx="3" transform="rotate(-10 18 24)"/><rect x="20" y="10" width="20" height="28" rx="3" transform="rotate(10 30 24)"/>',
  camera: '<path d="M6 16h8l3-5h14l3 5h8v22H6z"/><circle cx="24" cy="26" r="7"/>',
  mat: '<path d="M12 14h30l-6 22H6z"/><path d="M10 25h31M8 31h31M16 14l-4 22M26 14l-3 22"/>',
  calendar: '<rect x="6" y="10" width="36" height="32" rx="5"/><path d="M6 20h36M16 6v8M32 6v8"/>',
  chat: '<path d="M8 10h32a3 3 0 0 1 3 3v18a3 3 0 0 1-3 3H22l-8 7v-7H8a3 3 0 0 1-3-3V13a3 3 0 0 1 3-3z"/><path d="M14 20h20M14 26h12"/>',
  battery: '<rect x="4" y="15" width="35" height="18" rx="4"/><path d="M43 21v6"/><path d="M11 22v4M17 22v4M23 22v4"/>',
  bag: '<path d="M10 18h28l3 24H7z"/><path d="M17 18v-4a7 7 0 0 1 14 0v4"/>',
  mic: '<rect x="17" y="5" width="14" height="23" rx="7"/><path d="M11 23a13 13 0 0 0 26 0M24 36v7M17 43h14"/>',
  bike: '<circle cx="11" cy="32" r="8"/><circle cx="37" cy="32" r="8"/><path d="M11 32l8-16h10l8 16M19 16l10 16M27 11h6"/>',
  phone: '<rect x="13" y="5" width="22" height="38" rx="5"/><path d="M20 36h8"/>',
  cake: '<path d="M7 27h34v15H7z"/><path d="M7 34c4 3.500 8 3.500 12 0s8-3.500 12 0 6 2.500 10 0"/><path d="M24 27v-9"/><path d="M24 10c-3.500 3.500 0 7 0 7s3.500-3.500 0-7z"/>',
  run: '<circle cx="29" cy="9" r="4"/><path d="M26 17l-6 8 8 5-3 11M20 25l-9 2M28 30l9-3"/>'
};

function iconSvg(name, size = 28) {
  return `<svg viewBox="0 0 48 48" width="${size}" height="${size}" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON_PATHS[name]}</svg>`;
}

// ---------- Alat bantu ----------
function shuffle(list) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Kecenderungan terbanyak. Jika seri, hasilnya ambivert (berarti campuran).
function pluralityKey(keys) {
  const count = { introvert: 0, ekstrovert: 0, ambivert: 0 };
  keys.forEach(k => count[k]++);
  const max = Math.max(...Object.values(count));
  const top = Object.keys(count).filter(k => count[k] === max);
  return top.length === 1 ? top[0] : "ambivert";
}

function setMissionHeader(screenId) {
  const screen = document.getElementById(screenId);
  const step = questions.length + missionIndex + 1;
  screen.querySelector(".m-num").textContent = `SOAL ${step} DARI ${TOTAL_STEPS}`;
  screen.querySelector(".m-tag").textContent = `MISI ${missionIndex + 1}/${MISSION_COUNT}`;
  screen.querySelector(".m-fill").style.width = `${Math.round((step / TOTAL_STEPS) * 100)}%`;
}

// ---------- Alur ronde 2 ----------
const missionStarters = () => [startRun, startChat, startIsland, startBattery, startCards];

function showRound2Intro() {
  missionIndex = 0;
  const list = document.getElementById("mission-list");
  const items = [
    ["run", "Lari Akhir Pekan", "kejar pilihan kegiatanmu"],
    ["chat", "Chat Grup Kelas", "balas pesan teman"],
    ["bag", "Tas Kemah Pulau", "pilih 3 barang"],
    ["battery", "Baterai Sosial", "atur level energimu"],
    ["cards", "Kartu Aku Banget", "geser kartu pernyataan"]
  ];
  list.innerHTML = items.map(([ic, t, d]) =>
    `<div class="mission-item"><span class="tile">${iconSvg(ic, 24)}</span><span><strong>${t}</strong><small>${d}</small></span></div>`
  ).join("");
  showScreen("round2-screen");
}

function beginMissions() {
  missionStarters()[missionIndex]();
}

function finishMission(key) {
  answerLog.push(key);
  scores[key] += 1;
  missionIndex++;
  if (missionIndex < MISSION_COUNT) {
    missionStarters()[missionIndex]();
  } else {
    showResult();
  }
}

// =====================================================================
// MISI 2: CHAT GRUP KELAS  (cerita bercabang, 3 giliran)
// Skor: balasan terbanyak; seri = ambivert
// =====================================================================
const chatTurns = [
  {
    from: "Dimas",
    msgs: ["Guys, Sabtu ini aku ulang tahun!", "Kumpul di rumahku ya, bakal rame banget!"],
    options: [
      { key: "ekstrovert", label: "Ikut dan ajak teman lain", text: "Wah seru! Aku ikut, nanti kuajak anak-anak lain juga." },
      { key: "introvert", label: "Memilih di rumah saja", text: "Makasih ya, tapi kayaknya aku di rumah aja." },
      { key: "ambivert", label: "Ikut, tapi tidak lama", text: "Aku ikut, tapi mungkin nggak sampai malam." }
    ]
  },
  {
    from: "Dimas",
    msgs: ["Nanti ada lomba kelompok, semua harus ikut ya!"],
    options: [
      { key: "ekstrovert", label: "Maju duluan", text: "Siap, aku yang maju duluan!" },
      { key: "introvert", label: "Membantu dari belakang", text: "Boleh aku bantu di belakang aja, jadi pencatat skor?" },
      { key: "ambivert", label: "Lihat dulu, lalu ikut", text: "Aku lihat dulu, kalau sudah paham aku ikut." }
    ]
  },
  {
    divider: "Keesokan harinya...",
    from: "Sinta",
    msgs: ["Kemarin seru banget!", "Minggu depan kita jalan-jalan bareng lagi yuk?"],
    options: [
      { key: "ekstrovert", label: "Ajak lebih banyak orang", text: "Ayo! Makin banyak orang makin seru." },
      { key: "introvert", label: "Istirahat dulu", text: "Aku butuh istirahat dulu minggu ini, lain kali ya." },
      { key: "ambivert", label: "Jalan, tapi kelompok kecil", text: "Boleh, tapi kita jalan berempat saja ya biar santai." }
    ]
  }
];
let chatToken = 0;
let chatTurn = 0;
let chatKeys = [];

const sleep = ms => new Promise(r => setTimeout(r, ms));

function startChat() {
  chatToken++;
  chatTurn = 0;
  chatKeys = [];
  document.getElementById("chat-body").innerHTML = "";
  document.getElementById("chat-replies").innerHTML = "";
  document.getElementById("chat-next").style.display = "none";
  setMissionHeader("chat-screen");
  showScreen("chat-screen");
  runChatTurn(chatToken);
}

function chatScroll() {
  const body = document.getElementById("chat-body");
  body.scrollTop = body.scrollHeight;
}

function addBubble(text, who, name) {
  const body = document.getElementById("chat-body");
  const wrap = document.createElement("div");
  wrap.className = `bubble-row ${who}`;
  const bubble = document.createElement("div");
  bubble.className = "bubble";
  if (name) {
    const n = document.createElement("small");
    n.textContent = name;
    bubble.appendChild(n);
  }
  const p = document.createElement("span");
  p.textContent = text;
  bubble.appendChild(p);
  wrap.appendChild(bubble);
  body.appendChild(wrap);
  chatScroll();
}

async function runChatTurn(token) {
  const turn = chatTurns[chatTurn];
  const body = document.getElementById("chat-body");

  if (turn.divider) {
    const d = document.createElement("div");
    d.className = "chat-divider";
    d.textContent = turn.divider;
    body.appendChild(d);
    chatScroll();
    await sleep(500);
    if (token !== chatToken) return;
  }

  for (const msg of turn.msgs) {
    const typing = document.createElement("div");
    typing.className = "bubble-row them";
    typing.innerHTML = '<div class="bubble typing"><i></i><i></i><i></i></div>';
    body.appendChild(typing);
    chatScroll();
    await sleep(750);
    if (token !== chatToken) return;
    typing.remove();
    addBubble(msg, "them", turn.from);
    await sleep(250);
    if (token !== chatToken) return;
  }

  renderChatComposer(turn, token);
}

// Kolom balasan: pilih gaya balasan, lalu ketik sendiri dengan kata-katamu.
// Kecenderungan dihitung dari gaya yang dipilih; teks yang dikirim adalah ketikan siswa.
function renderChatComposer(turn, token) {
  const box = document.getElementById("chat-replies");
  box.innerHTML = "";

  const label = document.createElement("div");
  label.className = "reply-label";
  label.textContent = "Balasanmu: pilih gayanya, lalu ketik dengan kata-katamu sendiri";
  box.appendChild(label);

  const chips = document.createElement("div");
  chips.className = "style-chips";
  box.appendChild(chips);

  const form = document.createElement("form");
  form.className = "chat-compose";
  form.autocomplete = "off";
  form.innerHTML =
    '<input type="text" id="chat-input" maxlength="140" placeholder="Ketik balasanmu di sini..." aria-label="Ketik balasanmu">' +
    '<button type="submit" class="send-btn" id="chat-send" aria-label="Kirim balasan" disabled>' +
    '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.200" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 3L10 14"/><path d="M21 3l-7 18-4-7-7-4z"/></svg></button>';
  box.appendChild(form);

  const hint = document.createElement("div");
  hint.className = "compose-hint";
  box.appendChild(hint);

  const input = form.querySelector("#chat-input");
  const send = form.querySelector("#chat-send");
  let chosen = null;        // opsi gaya yang dipilih
  let lastAuto = "";        // teks contoh terakhir yang diisikan otomatis

  const refresh = () => {
    const ok = !!chosen && input.value.trim().length >= 2;
    send.disabled = !ok;
    send.classList.toggle("ready", ok);
    hint.textContent = !chosen
      ? "Pilih dulu gaya balasanmu di atas. Teks contoh akan muncul, dan boleh kamu ubah."
      : input.value.trim().length < 2
        ? "Ketik balasanmu, lalu tekan kirim."
        : "Sudah siap? Tekan kirim atau Enter.";
  };

  shuffle(turn.options).forEach(opt => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "style-chip";
    chip.textContent = opt.label;
    chip.onclick = () => {
      chosen = opt;
      chips.querySelectorAll(".style-chip").forEach(c => c.classList.toggle("on", c === chip));
      // isi contoh hanya jika kolom masih kosong atau belum diubah siswa
      if (input.value.trim() === "" || input.value === lastAuto) {
        input.value = opt.text;
        lastAuto = opt.text;
      }
      refresh();
      input.focus({ preventScroll: true });
      input.setSelectionRange(input.value.length, input.value.length);
    };
    chips.appendChild(chip);
  });

  input.addEventListener("input", refresh);
  refresh();

  form.addEventListener("submit", async e => {
    e.preventDefault();
    const text = input.value.trim();
    if (!chosen || text.length < 2) return;
    form.querySelectorAll("button, input").forEach(el => { el.disabled = true; });
    chips.querySelectorAll("button").forEach(el => { el.disabled = true; });
    chatKeys.push(chosen.key);
    addBubble(text, "me");
    box.innerHTML = "";
    await sleep(600);
    if (token !== chatToken) return;
    chatTurn++;
    if (chatTurn < chatTurns.length) {
      runChatTurn(token);
    } else {
      document.getElementById("chat-next").style.display = "";
    }
  });
}

function finishChat() {
  chatToken++;
  finishMission(pluralityKey(chatKeys));
}

// =====================================================================
// MISI 3: TAS KEMAH PULAU  (pilih 3 dari 8 barang + 1 alasan)
// Skor: 3 barang + 1 alasan = 4 suara; terbanyak menang, seri = ambivert
// =====================================================================
const islandItems = [
  { id: "i1", text: "Buku cerita", icon: "book", img: "images/items/buku-cerita.svg", key: "introvert" },
  { id: "i2", text: "Buku sketsa & pensil", icon: "pencil", img: "images/items/buku-sketsa.svg", key: "introvert" },
  { id: "i3", text: "Headphone", icon: "headphone", img: "images/items/headphone.svg", key: "introvert" },
  { id: "i4", text: "Bola", icon: "ball", img: "images/items/bola.svg", key: "ekstrovert" },
  { id: "i5", text: "Gitar untuk bernyanyi bersama", icon: "guitar", img: "images/items/gitar.svg", key: "ekstrovert" },
  { id: "i6", text: "Kartu permainan", icon: "cards", img: "images/items/kartu.svg", key: "ekstrovert" },
  { id: "i7", text: "Kamera", icon: "camera", img: "images/items/kamera.svg", key: "ambivert" },
  { id: "i8", text: "Tikar piknik", icon: "mat", img: "images/items/tikar.svg", key: "ambivert" }
];
const islandReasons = [
  { key: "introvert", text: "Supaya aku punya waktu tenang untuk diriku sendiri di sela kegiatan." },
  { key: "ekstrovert", text: "Supaya suasana tetap ramai dan aku bisa bersenang-senang bersama teman-teman." },
  { key: "ambivert", text: "Supaya aku siap untuk dua keadaan: bersama teman atau sendirian." }
];
const BAG_LIMIT = 3;
let islandPicked = [];
let islandOrder = [];
const islandLanding = new Set();   // barang yang masih terbang ke tas

function islandItemById(id) {
  return islandItems.find(i => i.id === id);
}

function startIsland() {
  islandPicked = [];
  islandLanding.clear();
  document.getElementById("bag-contents").innerHTML = "";
  islandOrder = shuffle(islandItems);
  setMissionHeader("island-screen");
  document.getElementById("island-step1").style.display = "";
  document.getElementById("island-step2").style.display = "none";
  buildIsland();
  showScreen("island-screen");
}

// Membuat barang-barang di sekeliling tas (posisi diatur lewat CSS: nth-child)
function buildIsland() {
  const box = document.getElementById("island-items");
  box.innerHTML = "";

  islandOrder.forEach(item => {
    const el = document.createElement("button");
    el.type = "button";
    el.className = "island-item";
    el.dataset.id = item.id;
    el.setAttribute("aria-label", `${item.text}. Seret ke dalam tas, atau tekan Enter.`);
    el.innerHTML =
      `<span class="item-inner"><img src="${item.img}" alt="" draggable="false"><span class="item-label">${item.text}</span></span>`;

    const img = el.querySelector("img");
    img.onerror = () => {
      img.replaceWith(Object.assign(document.createElement("span"), {
        className: "tile item-fallback",
        innerHTML: iconSvg(item.icon, 34)
      }));
    };

    bindIslandItem(el, item);
    box.appendChild(el);
  });

  updateIsland();
}

function bagRect() {
  return document.querySelector("#island-bag .bag-img").getBoundingClientRect();
}

function overBag(e) {
  const r = bagRect();
  const padX = r.width * 0.06, padY = r.height * 0.06;
  return e.clientX > r.left - padX && e.clientX < r.right + padX &&
         e.clientY > r.top - padY && e.clientY < r.bottom + padY;
}

function setBagHover(on) {
  document.getElementById("island-arena").classList.toggle("bag-hover", on);
}

function bindIslandItem(el, item) {
  let pid = null, sx = 0, sy = 0, dragging = false;
  el._dx = 0; el._dy = 0;

  el.addEventListener("pointerdown", e => {
    if (el.classList.contains("in-bag") || el.classList.contains("busy")) return;
    if (window.GameAudio) GameAudio.sfx("pop");
    pid = e.pointerId;
    el.setPointerCapture(pid);
    sx = e.clientX; sy = e.clientY;
    dragging = false;
    el._dx = 0; el._dy = 0;
    el.classList.add("grabbing");
  });

  el.addEventListener("pointermove", e => {
    if (e.pointerId !== pid) return;
    const dx = e.clientX - sx, dy = e.clientY - sy;
    if (!dragging && Math.hypot(dx, dy) > 8) {
      dragging = true;
      el.classList.add("dragging");
    }
    if (dragging) {
      el._dx = dx; el._dy = dy;
      el.style.transform = `translate(${dx}px, ${dy}px) scale(1.12) rotate(${Math.max(-14, Math.min(14, dx * 0.05))}deg)`;
      setBagHover(overBag(e));
    }
  });

  const finish = e => {
    if (e.pointerId !== pid) return;
    pid = null;
    el.classList.remove("grabbing");
    setBagHover(false);
    if (dragging) {
      el.classList.remove("dragging");
      if (overBag(e)) tryAddToBag(item, el);
      else springBack(el);
    } else {
      tryAddToBag(item, el);      // ketukan biasa = langsung masuk tas
    }
    dragging = false;
  };

  el.addEventListener("pointerup", finish);
  el.addEventListener("pointercancel", e => {
    if (e.pointerId !== pid) return;
    pid = null; dragging = false;
    el.classList.remove("grabbing", "dragging");
    setBagHover(false);
    springBack(el);
  });

  // Akses papan ketik: Enter / Spasi
  el.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      el._dx = 0; el._dy = 0;
      tryAddToBag(item, el);
    }
  });
}

function springBack(el) {
  const from = el.style.transform || "none";
  el.style.transform = "";
  el.animate(
    [{ transform: from }, { transform: "translate(0,0) scale(1) rotate(0deg)" }],
    { duration: 380, easing: "cubic-bezier(.34,1.56,.64,1)" }
  );
  el._dx = 0; el._dy = 0;
}

function shakeEl(el) {
  el.animate(
    [{ transform: "translateX(0)" }, { transform: "translateX(-9px)" }, { transform: "translateX(9px)" },
     { transform: "translateX(-6px)" }, { transform: "translateX(0)" }],
    { duration: 360 }
  );
}

function tryAddToBag(item, el) {
  if (islandPicked.length >= BAG_LIMIT) {
    // Tas penuh: barang kembali dan petunjuk muncul
    springBack(el);
    shakeEl(document.getElementById("island-bag"));
    shakeEl(document.getElementById("island-bag-front"));
    const hint = document.getElementById("island-hint");
    hint.textContent = "Tas sudah penuh! Keluarkan satu barang dulu (ketuk barang yang menyembul dari tas).";
    hint.classList.add("warn");
    return;
  }
  islandPicked.push(item.id);
  islandLanding.add(item.id);
  flyIntoBag(el);
  updateIsland();
}

// Barang terbang ke mulut tas, lalu jatuh ke dalam dan hilang di balik bibir tas
async function flyIntoBag(el) {
  el.classList.add("busy");
  const r = bagRect();
  const cur = el.getBoundingClientRect();
  const cx = cur.left + cur.width / 2, cy = cur.top + cur.height / 2;

  const mouthX = r.left + r.width * 0.5;
  const mouthY = r.top + r.height * 0.32;
  const tx = el._dx + (mouthX - cx);
  const ty = el._dy + (mouthY - cy);

  const from = `translate(${el._dx}px, ${el._dy}px) scale(${el._dx || el._dy ? 1.12 : 1})`;
  el.style.transform = "";
  el.style.zIndex = 30;

  const leg1 = el.animate(
    [{ transform: from }, { transform: `translate(${tx}px, ${ty}px) scale(.82)` }],
    { duration: 280, easing: "cubic-bezier(.3,.7,.3,1)", fill: "forwards" }
  );
  await leg1.finished;

  el.style.zIndex = 12;                         // di bawah "bibir tas", di atas bagian dalam tas
  const leg2 = el.animate(
    [{ transform: `translate(${tx}px, ${ty}px) scale(.82)` },
     { transform: `translate(${tx}px, ${ty + r.height * 0.5}px) scale(.3)` }],
    { duration: 380, easing: "cubic-bezier(.5,0,.9,.5)", fill: "forwards" }
  );
  await leg2.finished;

  leg1.cancel(); leg2.cancel();
  el.style.zIndex = "";
  el.style.transform = "";
  el.classList.remove("busy");
  el.classList.add("in-bag");
  el._dx = 0; el._dy = 0;

  islandLanding.delete(el.dataset.id);
  renderBagContents();
  bagReact(r);
}

function bagReact(r) {
  ["island-bag", "island-bag-front", "bag-contents"].forEach(id => {
    document.getElementById(id).animate(
      [{ transform: "scale(1,1)" }, { transform: "scale(1.07,.93)" }, { transform: "scale(.97,1.04)" }, { transform: "scale(1,1)" }],
      { duration: 460, easing: "ease-out" }
    );
  });
  const arena = document.getElementById("island-arena");
  const a = arena.getBoundingClientRect();
  for (let i = 0; i < 7; i++) {
    const s = document.createElement("i");
    s.className = "sparkle";
    s.style.left = `${r.left - a.left + r.width * (0.35 + Math.random() * 0.3)}px`;
    s.style.top = `${r.top - a.top + r.height * 0.3}px`;
    arena.appendChild(s);
    const ang = Math.random() * Math.PI * 2, dist = 34 + Math.random() * 46;
    s.animate(
      [{ transform: "translate(0,0) scale(1)", opacity: 1 },
       { transform: `translate(${Math.cos(ang) * dist}px, ${Math.sin(ang) * dist - 20}px) scale(.2)`, opacity: 0 }],
      { duration: 650, easing: "ease-out" }
    ).onfinish = () => s.remove();
  }
}

// Isi tas: barang yang dipilih tampak menyembul dari mulut tas (di belakang saku depan).
// Ketuk barang itu (atau kotak kecil di papan) untuk mengeluarkannya.
const BAG_POS = [
  { x: 33, y: 74, r: -10, z: 1 },
  { x: 50, y: 75, r: 1, z: 3 },
  { x: 67, y: 74, r: 10, z: 2 }
];
function renderBagContents() {
  const box = document.getElementById("bag-contents");
  const keep = new Set(islandPicked);
  box.querySelectorAll(".bag-content").forEach(el => {
    if (!keep.has(el.dataset.id)) el.remove();
  });
  islandPicked.forEach((id, i) => {
    if (islandLanding.has(id)) return;
    const it = islandItemById(id);
    let el = box.querySelector(`.bag-content[data-id="${id}"]`);
    const isNew = !el;
    if (!el) {
      el = document.createElement("button");
      el.type = "button";
      el.className = "bag-content";
      el.dataset.id = id;
      el.title = `Keluarkan: ${it.text}`;
      el.setAttribute("aria-label", `Keluarkan ${it.text} dari tas`);
      el.innerHTML = `<img src="${it.img}" alt="" draggable="false">`;
      const img = el.querySelector("img");
      img.onerror = () => img.replaceWith(Object.assign(document.createElement("span"), {
        className: "tile item-fallback", innerHTML: iconSvg(it.icon, 34)
      }));
      el.onclick = () => takeOutOfBag(id);
      box.appendChild(el);
    }
    const pos = BAG_POS[i] || BAG_POS[BAG_POS.length - 1];
    el.style.setProperty("--x", pos.x + "%");
    el.style.setProperty("--y", pos.y + "%");
    el.style.setProperty("--r", pos.r + "deg");
    el.style.zIndex = pos.z;
    if (isNew) {
      el.classList.add("rise");
      setTimeout(() => el.classList.remove("rise"), 650);
    }
  });
}

// Mengeluarkan barang dari tas: barang terbang keluar dari mulut tas kembali ke tempat asalnya
function takeOutOfBag(id) {
  if (!islandPicked.includes(id)) return;
  const home = document.querySelector(`.island-item[data-id="${id}"]`);
  const inBag = document.querySelector(`#bag-contents .bag-content[data-id="${id}"]`);
  const item = islandItemById(id);
  islandPicked = islandPicked.filter(x => x !== id);

  if (!home || !inBag) {
    if (home) home.classList.remove("in-bag");
    updateIsland();
    return;
  }

  const from = inBag.getBoundingClientRect();
  const to = home.querySelector(".item-inner").getBoundingClientRect();
  const fromX = from.left + from.width / 2, fromY = from.top + from.height / 2;
  const toX = to.left + to.width / 2, toY = to.top + to.height * 0.4;
  const dx = toX - fromX, dy = toY - fromY;
  const endScale = Math.max(0.6, Math.min(1.6, (to.width * 0.8) / from.width));

  const fly = document.createElement("img");
  fly.className = "fly-clone";
  fly.src = item.img;
  fly.alt = "";
  fly.style.cssText = `left:${from.left}px;top:${from.top}px;width:${from.width}px;height:${from.height}px;`;
  document.body.appendChild(fly);

  inBag.remove();                  // isi tas segera diperbarui
  updateIsland();
  bagReact(bagRect());

  const anim = fly.animate(
    [
      { transform: "translate(0,0) scale(1) rotate(0deg)", offset: 0 },
      { transform: `translate(${dx * 0.35}px, ${Math.min(dy * 0.35, 0) - 110}px) scale(1.3) rotate(-14deg)`, offset: 0.42 },
      { transform: `translate(${dx}px, ${dy}px) scale(${endScale}) rotate(0deg)`, offset: 1 }
    ],
    { duration: 720, easing: "cubic-bezier(.3,.6,.4,1)", fill: "forwards" }
  );
  anim.finished.then(() => {
    fly.remove();
    home.classList.remove("in-bag");
    home.animate(
      [{ transform: "scale(.7)", opacity: .4 }, { transform: "scale(1.15)", opacity: 1 }, { transform: "scale(1)", opacity: 1 }],
      { duration: 360, easing: "cubic-bezier(.34,1.56,.64,1)" }
    );
  });
}

function updateIsland() {
  const n = islandPicked.length;
  const full = n >= BAG_LIMIT;

  document.getElementById("island-count").textContent = `${n}/${BAG_LIMIT}`;
  document.getElementById("island-arena").classList.toggle("full", full);
  document.getElementById("island-bag").classList.toggle("full", full);

  const slots = document.getElementById("bag-slots");
  slots.innerHTML = "";
  for (let i = 0; i < BAG_LIMIT; i++) {
    const slot = document.createElement("button");
    slot.type = "button";
    slot.className = "bag-slot";
    const id = islandPicked[i];
    if (id) {
      const it = islandItemById(id);
      slot.classList.add("filled");
      slot.title = `Keluarkan: ${it.text}`;
      slot.setAttribute("aria-label", `Keluarkan ${it.text} dari tas`);
      slot.innerHTML = `<img src="${it.img}" alt="">`;
      slot.onclick = () => takeOutOfBag(id);
    } else {
      slot.disabled = true;
      slot.setAttribute("aria-label", "Slot kosong");
    }
    slots.appendChild(slot);
  }

  renderBagContents();

  const hint = document.getElementById("island-hint");
  hint.classList.remove("warn");
  hint.textContent = full
    ? "Tas penuh! Tekan LANJUT. Mau ganti? Ketuk barang yang menyembul dari tas untuk mengeluarkannya."
    : n === 0
      ? "Seret barang ke dalam tas, atau ketuk barangnya."
      : `Bagus! Pilih ${BAG_LIMIT - n} barang lagi.`;

  const next = document.getElementById("island-next");
  next.disabled = !full;
  next.classList.toggle("ready", full);
}

function islandToReason() {
  document.getElementById("island-step1").style.display = "none";
  document.getElementById("island-step2").style.display = "";

  const chosen = document.getElementById("island-chosen");
  chosen.innerHTML = islandPicked
    .map(islandItemById)
    .map(i => `<span class="chip"><img class="chip-img" src="${i.img}" alt="">${i.text}</span>`)
    .join("");

  const box = document.getElementById("island-reasons");
  box.innerHTML = "";
  shuffle(islandReasons).forEach(r => {
    const btn = document.createElement("button");
    btn.className = "reply-btn";
    btn.textContent = r.text;
    btn.onclick = () => {
      box.querySelectorAll("button").forEach(b => { b.disabled = true; });
      const keys = islandPicked.map(id => islandItemById(id).key);
      keys.push(r.key);
      finishMission(pluralityKey(keys));
    };
    box.appendChild(btn);
  });
  window.scrollTo({ top: 0 });
}

// =====================================================================
// MISI 4: BATERAI SOSIAL  (geser slider energi di 4 skenario)
// Skor: rata-rata energi setelah keramaian dikurangi rata-rata energi setelah menyendiri.
//   selisih >= 20 = ekstrovert, <= -20 = introvert, di antaranya = ambivert
// =====================================================================
const batteryScenarios = [
  { kind: "social", title: "Seharian di pesta yang ramai", text: "Kamu menghadiri pesta besar dari pagi sampai malam: banyak orang, musik, dan permainan. Sekarang sudah malam. Seberapa penuh baterai energimu?" },
  { kind: "solo", title: "Seharian di rumah sendirian", text: "Kamu di rumah sendirian seharian, tanpa bertemu atau mengobrol dengan siapa pun. Sekarang sudah malam. Seberapa penuh baterai energimu?" },
  { kind: "social", title: "Kerja kelompok 3 jam", text: "Kamu mengerjakan proyek bersama 4 teman selama 3 jam tanpa jeda, penuh diskusi dan ide. Seberapa penuh baterai energimu setelahnya?" },
  { kind: "solo", title: "Sore penuh hobi sendiri", text: "Kamu menghabiskan 3 jam sore untuk membaca, menggambar, atau bermain game sendirian. Seberapa penuh baterai energimu setelahnya?" }
];
let batteryIndex = 0;
let batteryValues = [];
let batteryTouched = false;

function startBattery() {
  batteryIndex = 0;
  batteryValues = [];
  setMissionHeader("battery-screen");
  showBatteryScenario();
  showScreen("battery-screen");
}

function batteryStateText(v) {
  if (v >= 75) return "Penuh semangat";
  if (v >= 50) return "Masih segar";
  if (v >= 25) return "Mulai lelah";
  return "Hampir habis";
}

function updateBattery(v) {
  const fill = document.getElementById("battery-fill");
  fill.style.width = `${v}%`;
  fill.className = "battery-fill " + (v >= 55 ? "high" : v >= 28 ? "mid" : "low");
  document.getElementById("battery-pct").textContent = `${v}%`;
  document.getElementById("battery-state").textContent = batteryStateText(v);
}

function showBatteryScenario() {
  const sc = batteryScenarios[batteryIndex];
  document.getElementById("battery-title").textContent = sc.title;
  document.getElementById("battery-text").textContent = sc.text;
  const slider = document.getElementById("battery-slider");
  slider.value = 50;
  batteryTouched = false;
  updateBattery(50);
  document.getElementById("battery-next").disabled = true;
  document.getElementById("battery-next").textContent =
    batteryIndex < batteryScenarios.length - 1 ? "LANJUT" : "SELESAI";
  document.getElementById("battery-dots").innerHTML = batteryScenarios
    .map((_, i) => `<i class="${i < batteryIndex ? "done" : i === batteryIndex ? "now" : ""}"></i>`)
    .join("");
}

function nextBattery() {
  batteryValues.push(Number(document.getElementById("battery-slider").value));
  batteryIndex++;
  if (batteryIndex < batteryScenarios.length) {
    showBatteryScenario();
    return;
  }
  const avg = kind => {
    const v = batteryScenarios.map((s, i) => s.kind === kind ? batteryValues[i] : null).filter(x => x !== null);
    return v.reduce((a, b) => a + b, 0) / v.length;
  };
  const diff = avg("social") - avg("solo");
  finishMission(diff >= 20 ? "ekstrovert" : diff <= -20 ? "introvert" : "ambivert");
}

function setupBattery() {
  const slider = document.getElementById("battery-slider");
  slider.addEventListener("input", () => {
    batteryTouched = true;
    updateBattery(Number(slider.value));
    document.getElementById("battery-next").disabled = false;
  });
}

// =====================================================================
// MISI 5: KARTU "AKU BANGET"  (geser kiri / kanan / tombol Kadang)
// 4 pernyataan ekstrovert + 4 pernyataan introvert.
// Jawaban: setuju +1, kadang 0, tidak -1 (pernyataan introvert dibalik).
//   total >= 3 = ekstrovert, <= -3 = introvert, di antaranya = ambivert
// =====================================================================
const cardStatements = [
  { text: "Aku semangat kalau ruangan ramai dan banyak orang.", pole: "E" },
  { text: "Aku butuh waktu sendiri setelah seharian bersama banyak orang.", pole: "I" },
  { text: "Aku mudah ngobrol dengan orang yang baru kukenal.", pole: "E" },
  { text: "Aku mikir dulu sebelum menjawab pertanyaan.", pole: "I" },
  { text: "Aku sering merasa bosan kalau terlalu lama sendirian.", pole: "E" },
  { text: "Aku lebih nyaman ngobrol dengan satu atau dua teman dekat.", pole: "I" },
  { text: "Aku senang bicara dulu, memikirkannya sambil jalan.", pole: "E" },
  { text: "Aku betah melakukan hobi sendirian berjam-jam.", pole: "I" }
];
let cardList = [];
let cardPos = 0;
let cardAnswers = [];
let cardBusy = false;

function startCards() {
  cardList = shuffle(cardStatements);
  cardPos = 0;
  cardAnswers = [];
  cardBusy = false;
  setMissionHeader("cards-screen");
  renderCardStack();
  showScreen("cards-screen");
}

function renderCardStack() {
  const stack = document.getElementById("swipe-stack");
  stack.innerHTML = "";
  document.getElementById("swipe-count").textContent = `Kartu ${Math.min(cardPos + 1, cardList.length)}/${cardList.length}`;

  const visible = cardList.slice(cardPos, cardPos + 3);
  for (let d = visible.length - 1; d >= 0; d--) {
    const card = document.createElement("div");
    card.className = "swipe-card";
    card.style.transform = `translateY(${d * 10}px) scale(${1 - d * 0.05})`;
    card.style.zIndex = 10 - d;
    card.innerHTML = `
      <span class="stamp no">BUKAN AKU</span>
      <span class="stamp yes">AKU BANGET</span>
      <p>${visible[d].text}</p>`;
    stack.appendChild(card);
    if (d === 0) attachSwipe(card);
  }
}

function attachSwipe(card) {
  let startX = 0, dx = 0, active = false;
  const yes = card.querySelector(".stamp.yes");
  const no = card.querySelector(".stamp.no");

  card.addEventListener("pointerdown", e => {
    if (cardBusy) return;
    active = true;
    startX = e.clientX;
    dx = 0;
    card.setPointerCapture(e.pointerId);
    card.style.transition = "none";
  });
  card.addEventListener("pointermove", e => {
    if (!active) return;
    dx = e.clientX - startX;
    card.style.transform = `translateX(${dx}px) rotate(${dx / 18}deg)`;
    yes.style.opacity = Math.max(0, Math.min(1, dx / 90));
    no.style.opacity = Math.max(0, Math.min(1, -dx / 90));
  });
  const release = () => {
    if (!active) return;
    active = false;
    if (dx > 90) answerCard(1);
    else if (dx < -90) answerCard(-1);
    else {
      card.style.transition = "transform .25s";
      card.style.transform = "";
      yes.style.opacity = 0;
      no.style.opacity = 0;
    }
  };
  card.addEventListener("pointerup", release);
  card.addEventListener("pointercancel", release);
}

function answerCard(value) {
  if (cardBusy || cardPos >= cardList.length) return;
  if (window.GameAudio) GameAudio.sfx("swipe");
  cardBusy = true;
  const stack = document.getElementById("swipe-stack");
  const top = stack.lastElementChild;
  top.style.transition = "transform .3s ease, opacity .3s ease";
  if (value === 0) top.style.transform = "translateY(-220px) scale(.9)";
  else top.style.transform = `translateX(${value * 460}px) rotate(${value * 26}deg)`;
  top.style.opacity = 0;

  const stmt = cardList[cardPos];
  cardAnswers.push(value * (stmt.pole === "E" ? 1 : -1));

  setTimeout(() => {
    cardPos++;
    cardBusy = false;
    if (cardPos < cardList.length) {
      renderCardStack();
    } else {
      const total = cardAnswers.reduce((a, b) => a + b, 0);
      finishMission(total >= 3 ? "ekstrovert" : total <= -3 ? "introvert" : "ambivert");
    }
  }, 280);
}

// Pasang pendengar sekali saat halaman dimuat
setupBattery();
