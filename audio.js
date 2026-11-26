// =====================================================================
// AUDIO GAME: musik latar, suara klik, tombol bisu, dan musik hasil akhir.
// Semua suara dibuat langsung oleh browser (WebAudio), jadi TIDAK ada file
// suara tambahan dan ukuran game tetap kecil.
//
// Cara pakai dari file lain:
//   GameAudio.sfx("click" | "start" | "back" | "pick" | "tick" | "swipe" | "pop")
//   GameAudio.music("menu" | "calm" | "run" | "introvert" | "ambivert" | "ekstrovert" | "campuran" | null)
//   GameAudio.beep(freq, durasi, tipe, volume, freqAkhir)   (dipakai game lari)
//   GameAudio.toggle()   -> bisukan / nyalakan
// Mengubah lagu: lihat objek TRACKS di bawah (tempo, urutan akor, pola drum).
// =====================================================================
(function () {
  const AC = window.AudioContext || window.webkitAudioContext;
  let ctx = null, master = null, musicBus = null, sfxBus = null, delay = null, noiseBuf = null;
  let muted = false;
  try { muted = localStorage.getItem("pe-muted") === "1"; } catch (e) { /* tidak wajib */ }

  let wanted = null;      // lagu yang diinginkan
  let cur = null;         // lagu yang sedang jalan
  let timer = null;
  let unlocked = false;
  const watchers = [];

  const midi = m => 440 * Math.pow(2, (m - 69) / 12);
  const CHORD = { maj: [0, 4, 7], min: [0, 3, 7], maj7: [0, 4, 7, 11], min7: [0, 3, 7, 10], dom7: [0, 4, 7, 10], sus: [0, 5, 7] };
  const PENTA = [0, 2, 4, 7, 9];

  // ---------------------------------------------------------------
  // Daftar lagu
  //  prog  : urutan akor [nada dasar (MIDI), jenis], satu akor = satu birama (16 langkah)
  //  bass  : pola 16 langkah. 1 = nada dasar, 5 = kuint, 8 = oktaf, . = diam
  //  arp   : pola 16 langkah. angka = urutan nada akor (angka besar = oktaf naik)
  //  mel   : melodi pentatonik acak-tetap (seed sama = melodi sama tiap putaran)
  //  drum  : k = kick, s = snare, h = hi-hat, c = tepuk tangan; x = bunyi, o = hi-hat terbuka
  // ---------------------------------------------------------------
  const TRACKS = {
    // Beranda, soal, pilihan: ceria dan ringan
    menu: {
      bpm: 100, tonic: 60, vol: 0.9,
      prog: [[48, "maj7"], [43, "maj"], [45, "min7"], [41, "maj7"]],
      pad: { type: "triangle", vol: 0.045, lp: 1400 },
      bass: { type: "sine", vol: 0.2, pat: "1...1...5...1..." },
      arp: { type: "triangle", vol: 0.05, pat: "0.1.2.1.0.1.2.3." },
      mel: { type: "sine", vol: 0.075, rhythm: ["x...x.x.....x...", "..x...x.x.......", "x.....x...x.x...", "....x.x.x......."], lo: 5, hi: 11, seed: 7, pluck: 0.5 },
      drum: { k: "x.......x.......", s: "", h: "..x...x...x...x.", c: "" },
      delay: 0.5
    },
    // Misi tenang: lo-fi santai
    calm: {
      bpm: 82, tonic: 60, swing: 0.16, vol: 0.9,
      prog: [[50, "min7"], [43, "dom7"], [48, "maj7"], [45, "min7"]],
      pad: { type: "sine", vol: 0.06, lp: 1000 },
      bass: { type: "sine", vol: 0.2, pat: "1....1..5.1....." },
      arp: { type: "triangle", vol: 0.05, pat: "..0...1...2...1." },
      mel: { type: "sine", vol: 0.065, rhythm: ["x.....x.......x.", "..x.......x.....", "x.......x.x.....", "......x...x....."], lo: 6, hi: 12, seed: 21, pluck: 0.6 },
      drum: { k: "x.....x...x.....", s: "....x.......x...", h: "x.x.x.x.x.x.x.xo", c: "" },
      delay: 0.75
    },
    // Game lari: cepat dan bersemangat
    run: {
      bpm: 130, tonic: 60, vol: 0.85,
      prog: [[48, "maj"], [45, "min"], [41, "maj"], [43, "maj"]],
      pad: { type: "sawtooth", vol: 0.02, lp: 900 },
      bass: { type: "triangle", vol: 0.24, pat: "1.1.1.1.1.1.1.1." },
      arp: { type: "square", vol: 0.028, lp: 2400, pat: "0.12.1020.12.102" },
      mel: { type: "square", vol: 0.04, lp: 2600, rhythm: ["x.x.x...x.x.x...", "x...x.x.x.......", "x.x...x.x.x.x...", "x...x...x.x....."], lo: 7, hi: 13, seed: 3, pluck: 0.25 },
      drum: { k: "x...x...x...x...", s: "....x.......x...", h: "x.x.x.x.x.x.x.xo", c: "" },
      delay: 0.5
    },

    // ------------------ Musik hasil akhir ------------------
    // INTROVERT: pelan, lembut, seperti kotak musik, tanpa drum
    introvert: {
      bpm: 66, tonic: 60, vol: 1,
      prog: [[41, "maj7"], [40, "min7"], [38, "min7"], [48, "maj7"]],
      pad: { type: "sine", vol: 0.07, lp: 800 },
      bass: { type: "sine", vol: 0.14, pat: "1..............." },
      arp: { type: "sine", vol: 0.06, pat: "0..1..2..3..2..1", pluck: 0.9 },
      mel: { type: "sine", vol: 0.1, rhythm: ["x.......x.......", "....x.......x...", "x.......x...x...", "......x........."], lo: 8, hi: 14, seed: 11, pluck: 1.1 },
      drum: { k: "", s: "", h: "", c: "" },
      delay: 0.75, wet: 0.45
    },
    // AMBIVERT: seimbang, hangat, groove sedang
    ambivert: {
      bpm: 100, tonic: 60, swing: 0.08, vol: 0.95,
      prog: [[48, "maj7"], [41, "maj7"], [45, "min7"], [43, "dom7"]],
      pad: { type: "triangle", vol: 0.05, lp: 1300 },
      bass: { type: "triangle", vol: 0.22, pat: "1..1..5.1..1.5.8" },
      arp: { type: "triangle", vol: 0.055, pat: "0.12.1.20.12.1.2" },
      mel: { type: "triangle", vol: 0.085, rhythm: ["x..x..x...x.....", "x.....x.x.......", "x..x....x..x....", "..x...x.....x..."], lo: 6, hi: 12, seed: 5, pluck: 0.55 },
      drum: { k: "x.....x...x.....", s: "....x.......x...", h: "x.x.x.x.x.x.x.x.", c: "" },
      delay: 0.5
    },
    // EKSTROVERT: pesta, cepat, ramai
    ekstrovert: {
      bpm: 128, tonic: 67, vol: 0.9,
      prog: [[43, "maj"], [50, "maj"], [52, "min"], [48, "maj"]],
      pad: { type: "sawtooth", vol: 0.025, lp: 1500 },
      bass: { type: "square", vol: 0.14, lp: 700, pat: "1.1.8.1.1.1.8.5." },
      arp: { type: "square", vol: 0.03, lp: 3000, pat: "0.12.1020.12.102" },
      mel: { type: "sawtooth", vol: 0.045, lp: 3200, rhythm: ["x.x.x.x.x...x.x.", "x...x.x.x.x.....", "x.x.x...x.x.x.x.", "x.x...x.x.x.x..."], lo: 9, hi: 16, seed: 13, pluck: 0.3 },
      drum: { k: "x...x...x...x...", s: "....x.......x...", h: "x.xox.xox.xox.xo", c: "....c.......c..." },
      delay: 0.5, crash: true
    },
    // CAMPURAN: bergantian lembut dan ceria
    campuran: {
      bpm: 112, tonic: 62, swing: 0.05, vol: 0.95,
      prog: [[50, "maj"], [47, "min"], [43, "maj7"], [45, "dom7"]],
      pad: { type: "triangle", vol: 0.05, lp: 1400 },
      bass: { type: "triangle", vol: 0.2, pat: "1...1.5.1...8.5." },
      arp: { type: "triangle", vol: 0.05, pat: "0.1.2.3.2.1.0.1." },
      mel: { type: "triangle", vol: 0.08, rhythm: ["x.x...x.x.......", "x...x.....x.x...", "x.x.....x.x.....", "..x...x.x...x..."], lo: 7, hi: 14, seed: 17, pluck: 0.45 },
      drum: { k: "x.......x.x.....", s: "....x.......x...", h: "..x...x...x...x.", c: "" },
      delay: 0.5
    }
  };

  // ---------- Dasar ----------
  function ensure() {
    if (!AC) return false;
    if (!ctx) {
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = muted ? 0 : 1;
      master.connect(ctx.destination);

      musicBus = ctx.createGain();
      musicBus.gain.value = 0.6;
      sfxBus = ctx.createGain();
      sfxBus.gain.value = 0.9;

      delay = { node: ctx.createDelay(1.5), fb: ctx.createGain(), wet: ctx.createGain() };
      delay.node.delayTime.value = 0.45;
      delay.fb.gain.value = 0.3;
      delay.wet.gain.value = 0.22;
      musicBus.connect(master);
      musicBus.connect(delay.node);
      delay.node.connect(delay.fb); delay.fb.connect(delay.node);
      delay.node.connect(delay.wet); delay.wet.connect(master);
      sfxBus.connect(master);

      noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
      const d = noiseBuf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    if (ctx.state === "suspended") ctx.resume();
    return true;
  }

  function tone(bus, f, t, dur, type, vol, o = {}) {
    const osc = ctx.createOscillator(), g = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(f, t);
    if (o.to) osc.frequency.exponentialRampToValueAtTime(o.to, t + dur);
    if (o.detune) osc.detune.value = o.detune;
    g.gain.setValueAtTime(0.0001, t);
    if (o.pluck) {
      g.gain.linearRampToValueAtTime(vol, t + 0.006);
      g.gain.exponentialRampToValueAtTime(0.0001, t + o.pluck);
      dur = Math.max(dur, o.pluck);
    } else {
      const a = o.a !== undefined ? o.a : 0.01, r = Math.min(o.r !== undefined ? o.r : 0.08, dur * 0.6);
      g.gain.linearRampToValueAtTime(vol, t + a);
      g.gain.setValueAtTime(vol, Math.max(t + a, t + dur - r));
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    }
    if (o.lp) {
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass"; lp.frequency.value = o.lp;
      osc.connect(lp); lp.connect(g);
    } else osc.connect(g);
    g.connect(bus);
    osc.start(t); osc.stop(t + dur + 0.05);
  }

  function noise(bus, t, dur, ftype, freq, vol, q) {
    const src = ctx.createBufferSource(), g = ctx.createGain(), f = ctx.createBiquadFilter();
    src.buffer = noiseBuf;
    f.type = ftype; f.frequency.value = freq;
    if (q) f.Q.value = q;
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f); f.connect(g); g.connect(bus);
    src.start(t, Math.random()); src.stop(t + dur + 0.02);
  }

  const drum = {
    k(bus, t, v) { tone(bus, 150, t, 0.16, "sine", 0.55 * v, { to: 42, pluck: 0.18 }); },
    s(bus, t, v) { noise(bus, t, 0.14, "highpass", 1600, 0.3 * v); tone(bus, 200, t, 0.09, "triangle", 0.18 * v, { pluck: 0.09 }); },
    h(bus, t, v) { noise(bus, t, 0.04, "highpass", 7500, 0.12 * v); },
    o(bus, t, v) { noise(bus, t, 0.16, "highpass", 7000, 0.11 * v); },
    c(bus, t, v) { [0, 0.012, 0.026].forEach(d => noise(bus, t + d, 0.09, "bandpass", 1300, 0.22 * v, 0.8)); },
    crash(bus, t, v) { noise(bus, t, 1.3, "highpass", 4500, 0.16 * v); }
  };

  // ---------- Pemutar lagu ----------
  function mulberry(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // Membuat melodi tetap per lagu: berjalan naik-turun di tangga nada pentatonik
  function buildMelody(tr) {
    const rnd = mulberry(tr.mel.seed);
    const scale = [];
    for (let o = -1; o < 4; o++) PENTA.forEach(p => scale.push(tr.tonic + p + 12 * o));
    let idx = Math.floor((tr.mel.lo + tr.mel.hi) / 2);
    const out = [];
    for (let bar = 0; bar < tr.prog.length; bar++) {
      const pat = tr.mel.rhythm[bar % tr.mel.rhythm.length];
      const notes = [];
      const [root, type] = tr.prog[bar];
      for (let s = 0; s < 16; s++) {
        if (pat[s] !== "x") { notes.push(null); continue; }
        if (s === 0) {
          // awal birama: mendarat di nada akor terdekat
          let best = idx, bd = 99;
          for (let i = tr.mel.lo; i <= tr.mel.hi; i++) {
            const pc = ((scale[i] - root) % 12 + 12) % 12;
            if (CHORD[type].includes(pc) && Math.abs(i - idx) < bd) { bd = Math.abs(i - idx); best = i; }
          }
          idx = best;
        } else {
          const r = rnd();
          idx += r < 0.38 ? -1 : r < 0.76 ? 1 : r < 0.88 ? -2 : 2;
          idx = Math.max(tr.mel.lo, Math.min(tr.mel.hi, idx));
        }
        notes.push(scale[idx]);
      }
      out.push(notes);
    }
    return out;
  }

  function playStep(tr, bus, t, bar, s, stepDur) {
    const [root, type] = tr.prog[bar % tr.prog.length];
    const ch = CHORD[type];

    if (tr.pad && s === 0) {
      ch.forEach((iv, i) => tone(bus, midi(root + 12 + iv), t, stepDur * 16, tr.pad.type, tr.pad.vol, { a: 0.35, r: 0.5, lp: tr.pad.lp, detune: i * 4 }));
    }
    if (tr.bass) {
      const c = tr.bass.pat[s];
      if (c !== ".") {
        const iv = c === "5" ? 7 : c === "8" ? 12 : 0;
        tone(bus, midi(root + iv), t, stepDur * 1.7, tr.bass.type, tr.bass.vol, { a: 0.008, r: 0.06, lp: tr.bass.lp || 900 });
      }
    }
    if (tr.arp) {
      const c = tr.arp.pat[s];
      if (c !== ".") {
        const n = parseInt(c, 10);
        const note = root + 24 + ch[n % ch.length] + 12 * Math.floor(n / ch.length);
        tone(bus, midi(note), t, stepDur * 1.4, tr.arp.type, tr.arp.vol, { pluck: tr.arp.pluck || 0.22, lp: tr.arp.lp });
      }
    }
    if (tr.mel && tr.melody) {
      const n = tr.melody[bar % tr.melody.length][s];
      if (n !== null && n !== undefined) {
        tone(bus, midi(n + 12), t, stepDur * 2, tr.mel.type, tr.mel.vol, { pluck: tr.mel.pluck || 0.4, lp: tr.mel.lp });
      }
    }
    if (tr.drum) {
      const d = tr.drum;
      if (d.k && d.k[s] === "x") drum.k(bus, t, 1);
      if (d.s && d.s[s] === "x") drum.s(bus, t, 1);
      if (d.h && d.h[s] && d.h[s] !== ".") (d.h[s] === "o" ? drum.o : drum.h)(bus, t, s % 4 === 0 ? 1 : 0.7);
      if (d.c && d.c[s] === "c") drum.c(bus, t, 1);
    }
    if (tr.crash && bar % tr.prog.length === 0 && s === 0 && cur && cur.loops === 0) drum.crash(bus, t, 1);
  }

  function pump() {
    if (!cur || !ctx) return;
    const tr = cur.tr;
    const stepDur = 60 / tr.bpm / 4;
    while (cur.next < ctx.currentTime + 0.18) {
      const s = cur.step % 16;
      const bar = Math.floor(cur.step / 16) % tr.prog.length;
      const swing = tr.swing && s % 2 === 1 ? tr.swing * stepDur : 0;
      playStep(tr, cur.gain, cur.next + swing, bar, s, stepDur);
      cur.step++;
      if (cur.step % (16 * tr.prog.length) === 0) cur.loops++;
      cur.next += stepDur;
    }
  }

  function stopCurrent(fade) {
    if (!cur) return;
    const old = cur; cur = null;
    try {
      old.gain.gain.cancelScheduledValues(ctx.currentTime);
      old.gain.gain.setValueAtTime(old.gain.gain.value, ctx.currentTime);
      old.gain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + fade);
    } catch (e) { /* abaikan */ }
    setTimeout(() => { try { old.gain.disconnect(); } catch (e) { /* abaikan */ } }, fade * 1000 + 1500);
  }

  function startTrack(id) {
    if (!ensure()) return;
    if (cur && cur.id === id) return;
    stopCurrent(0.5);
    if (!id || !TRACKS[id]) return;
    const tr = TRACKS[id];
    if (!tr.melody && tr.mel) tr.melody = buildMelody(tr);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.linearRampToValueAtTime(tr.vol || 1, ctx.currentTime + 0.8);
    g.connect(musicBus);
    delay.node.delayTime.value = 60 / tr.bpm * (tr.delay || 0.5) * 1.0;
    delay.wet.gain.value = tr.wet || 0.22;
    cur = { id, tr, gain: g, step: 0, next: ctx.currentTime + 0.08, loops: 0 };
    if (!timer) timer = setInterval(pump, 40);
    pump();
  }

  // ---------- Efek suara ----------
  const SFX = {
    click() { tone(sfxBus, 880, ctx.currentTime, 0.07, "sine", 0.16, { to: 620, pluck: 0.07 }); tone(sfxBus, 1760, ctx.currentTime, 0.03, "triangle", 0.05, { pluck: 0.03 }); },
    start() { const t = ctx.currentTime; tone(sfxBus, 523, t, 0.1, "triangle", 0.16, { pluck: 0.12 }); tone(sfxBus, 784, t + 0.075, 0.16, "triangle", 0.16, { pluck: 0.18 }); tone(sfxBus, 1046, t + 0.15, 0.2, "sine", 0.1, { pluck: 0.22 }); },
    back() { const t = ctx.currentTime; tone(sfxBus, 520, t, 0.08, "triangle", 0.14, { pluck: 0.09 }); tone(sfxBus, 390, t + 0.07, 0.12, "triangle", 0.14, { pluck: 0.13 }); },
    pick() { const t = ctx.currentTime; tone(sfxBus, 659, t, 0.1, "square", 0.05, { pluck: 0.1, lp: 2500 }); tone(sfxBus, 988, t + 0.07, 0.16, "square", 0.05, { pluck: 0.16, lp: 2500 }); },
    tick() { tone(sfxBus, 1200, ctx.currentTime, 0.03, "sine", 0.07, { pluck: 0.03 }); },
    swipe() { noise(sfxBus, ctx.currentTime, 0.18, "bandpass", 1800, 0.18, 0.7); },
    pop() { tone(sfxBus, 420, ctx.currentTime, 0.12, "sine", 0.22, { to: 190, pluck: 0.12 }); }
  };

  // Jingle pendek saat hasil muncul (sesuai sifat)
  const STINGER = {
    introvert: [[72, 0, 0.5, "sine"], [76, 0.18, 0.5, "sine"], [79, 0.36, 0.5, "sine"], [84, 0.56, 1.2, "sine"]],
    ambivert: [[67, 0, 0.3, "triangle"], [72, 0.12, 0.3, "triangle"], [76, 0.24, 0.3, "triangle"], [79, 0.4, 0.9, "triangle"]],
    ekstrovert: [[67, 0, 0.18, "square"], [67, 0.14, 0.18, "square"], [72, 0.28, 0.18, "square"], [76, 0.42, 0.18, "square"], [79, 0.56, 0.9, "square"]],
    campuran: [[69, 0, 0.3, "triangle"], [74, 0.14, 0.3, "triangle"], [78, 0.28, 0.3, "triangle"], [81, 0.44, 0.9, "triangle"]]
  };

  function stinger(key) {
    if (!ensure()) return;
    const notes = STINGER[key];
    if (!notes) return;
    const t0 = ctx.currentTime + 0.05;
    notes.forEach(n => {
      tone(sfxBus, midi(n[0]), t0 + n[1], n[2], n[3], key === "ekstrovert" ? 0.08 : 0.14, { pluck: n[2] + 0.2, lp: key === "ekstrovert" ? 3000 : undefined });
    });
    if (key === "ekstrovert") drum.crash(sfxBus, t0 + 0.56, 1.1);
  }

  // ---------- Layar -> lagu ----------
  const SCREEN_MUSIC = {
    "start-screen": "menu", "about-screen": "menu", "tendency-screen": "menu",
    "question-screen": "menu", "illustration-screen": "menu", "choice-screen": "menu",
    "round2-screen": "menu", "credits-screen": "menu", "teacher-screen": "menu",
    "run-screen": "calm",
    "chat-screen": "calm", "island-screen": "calm", "battery-screen": "calm", "cards-screen": "calm",
    "result-screen": null   // diatur oleh showResult
  };

  // ---------- Tombol bisu ----------
  function syncButtons() {
    document.querySelectorAll(".sound-fab, .run-sound").forEach(b => {
      b.classList.toggle("off", muted);
      b.setAttribute("aria-pressed", String(!muted));
      b.setAttribute("aria-label", muted ? "Suara mati. Ketuk untuk menyalakan" : "Suara menyala. Ketuk untuk membisukan");
    });
  }

  const api = {
    get muted() { return muted; },
    unlock() {
      unlocked = true;
      if (ensure() && wanted !== undefined) startTrack(wanted);
    },
    music(id) {
      wanted = id;
      if (!unlocked) return;       // browser baru mengizinkan suara setelah pemain mengetuk layar
      startTrack(id);
    },
    sfx(name) {
      if (muted || !unlocked || !ensure() || !SFX[name]) return;
      try { SFX[name](); } catch (e) { /* suara tidak wajib */ }
    },
    beep(f, d = 0.12, type = "sine", vol = 0.05, to = null) {
      if (muted || !unlocked || !ensure()) return;
      try { tone(sfxBus, f, ctx.currentTime, d, type, vol * 2.2, { to: to || undefined }); } catch (e) { /* abaikan */ }
    },
    result(key) {
      const k = TRACKS[key] ? key : "campuran";
      wanted = k;
      if (!unlocked) return;
      if (!muted) stinger(k);
      startTrack(k);
    },
    onScreen(id) {
      document.body.dataset.screen = id;
      if (Object.prototype.hasOwnProperty.call(SCREEN_MUSIC, id) && SCREEN_MUSIC[id] !== null) api.music(SCREEN_MUSIC[id]);
    },
    toggle() {
      muted = !muted;
      try { localStorage.setItem("pe-muted", muted ? "1" : "0"); } catch (e) { /* abaikan */ }
      if (ensure()) {
        master.gain.cancelScheduledValues(ctx.currentTime);
        master.gain.setTargetAtTime(muted ? 0 : 1, ctx.currentTime, 0.05);
      }
      syncButtons();
      if (!muted) api.sfx("click");
    }
  };
  window.GameAudio = api;

  // ---------- Pasang ----------
  function setup() {
    // tombol bisu mengambang di semua layar (di game lari dipakai tombol di dalam arena)
    const fab = document.createElement("button");
    fab.type = "button";
    fab.className = "sound-fab";
    fab.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z" fill="#fff"/><path class="wave" d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/><path class="mute" d="M16 9l6 6M22 9l-6 6"/></svg>';
    document.body.appendChild(fab);
    fab.addEventListener("click", e => { e.stopPropagation(); api.toggle(); });
    const hud = document.getElementById("run-sound");
    if (hud) hud.addEventListener("click", e => { e.stopPropagation(); api.toggle(); });
    syncButtons();

    // izin suara dari browser: aktif pada ketukan / tombol pertama
    const first = () => {
      api.unlock();
      ["pointerdown", "keydown", "touchstart"].forEach(ev => window.removeEventListener(ev, first, true));
    };
    ["pointerdown", "keydown", "touchstart"].forEach(ev => window.addEventListener(ev, first, true));

    // suara klik untuk semua tombol
    document.addEventListener("click", e => {
      const el = e.target.closest && e.target.closest("button, [onclick], .choice-btn, .tendency-btn");
      if (!el || el.matches(".sound-fab, .run-sound, .run-arrow, .swipe-btn")) return;
      if (el.matches(".primary-btn")) api.sfx("start");
      else if (el.matches(".secondary-btn, .back-btn")) api.sfx("back");
      else if (el.matches(".choice-btn")) api.sfx("pick");
      else api.sfx("click");
    }, true);

    // geser slider energi
    let lastTick = 0;
    document.addEventListener("input", e => {
      if (e.target.type !== "range") return;
      const n = performance.now();
      if (n - lastTick > 70) { lastTick = n; api.sfx("tick"); }
    });

    // hemat baterai: jeda saat tab tidak dilihat
    document.addEventListener("visibilitychange", () => {
      if (!ctx) return;
      if (document.hidden) ctx.suspend(); else if (unlocked) ctx.resume();
    });

    api.onScreen(document.querySelector(".screen.active") ? document.querySelector(".screen.active").id : "start-screen");
    if (wanted === null) wanted = "menu";
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", setup);
  else setup();
})();
