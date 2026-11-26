const tendencyIcons = {"introvert": "<svg viewBox=\"0 0 64 64\" width=\"50\" height=\"50\"><path d=\"M40 8a24 24 0 1 0 16 40A20 20 0 0 1 40 8z\" fill=\"#fff\" stroke=\"#fff\" stroke-width=\"2\" stroke-linejoin=\"round\"/><circle cx=\"48\" cy=\"14\" r=\"2.500\" fill=\"#fff\"/><circle cx=\"54\" cy=\"26\" r=\"1.800\" fill=\"#fff\"/></svg>", "ekstrovert": "<svg viewBox=\"0 0 64 64\" width=\"50\" height=\"50\"><path d=\"M8 12h30a6 6 0 0 1 6 6v14a6 6 0 0 1-6 6H24l-9 8v-8H8a6 6 0 0 1-6-6V18a6 6 0 0 1 6-6z\" fill=\"#fff\"/><path d=\"M26 30h26a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6h-2v7l-8-7H26a6 6 0 0 1-6-6V36a6 6 0 0 1 6-6z\" fill=\"#fff\" opacity=\".7\"/></svg>", "ambivert": "<svg viewBox=\"0 0 64 64\" width=\"50\" height=\"50\"><circle cx=\"32\" cy=\"32\" r=\"22\" fill=\"none\" stroke=\"#fff\" stroke-width=\"5\"/><path d=\"M32 10a22 22 0 0 1 0 44z\" fill=\"#fff\"/><circle cx=\"32\" cy=\"21\" r=\"4\" fill=\"#fff\"/></svg>"};

const tendencyInfo = {
  introvert: {
    icon: "🔵",
    title: "Introvert",
    definition: "Introvert adalah kecenderungan seseorang yang merasa nyaman dan berenergi ketika memiliki waktu tenang atau waktu untuk diri sendiri. Introvert bukan berarti pemalu atau tidak suka berteman.",
    examples: [
      "Mengamati situasi terlebih dahulu sebelum berinteraksi.",
      "Berpikir dulu sebelum berbicara atau menjawab.",
      "Lebih nyaman berbincang dengan satu atau dua teman dekat.",
      "Membutuhkan waktu sendiri setelah berada di tengah keramaian.",
      "Senang melakukan hobi mandiri seperti membaca, menggambar, atau bermain game."
    ]
  },
  ekstrovert: {
    icon: "🟢",
    title: "Ekstrovert",
    definition: "Ekstrovert adalah kecenderungan seseorang yang merasa bersemangat dan berenergi ketika berinteraksi dengan banyak orang. Ia biasanya terbuka dan aktif dalam situasi sosial.",
    examples: [
      "Mudah menyapa dan berkenalan dengan orang baru.",
      "Senang berdiskusi dan bekerja bersama dalam kelompok.",
      "Berani berbicara atau tampil di depan banyak orang.",
      "Lebih semangat ketika berada di tengah keramaian.",
      "Suka mengisi waktu luang dengan bermain atau pergi bersama teman."
    ]
  },
  ambivert: {
    icon: "🟣",
    title: "Ambivert",
    definition: "Ambivert adalah kecenderungan seseorang yang berada di antara introvert dan ekstrovert. Ia dapat menyesuaikan diri, nyaman bersosialisasi sekaligus menikmati waktu sendiri.",
    examples: [
      "Mengamati dulu, lalu berkenalan ketika sudah merasa siap.",
      "Kadang ingin bersama teman, kadang ingin menyendiri.",
      "Bisa berdiskusi dalam kelompok, lalu mengerjakan bagian tugas sendiri.",
      "Mungkin gugup di awal, tetapi cepat menyesuaikan diri.",
      "Perilakunya bergantung pada situasi dan suasana hati."
    ]
  }
};

const questions = [
  {
    icon: "🏫",
    title: "Masuk Kelas Baru",
    text: "Kamu masuk ke kelas baru dan belum mengenal banyak teman. Apa yang akan kamu lakukan?",
    options: [
      {
        label: "A",
        text: "Duduk dengan tenang dan mengamati keadaan kelas.",
        type: "Introvert",
        key: "introvert",
        icon: "🧑‍🎓",
        scene: "Seorang siswa duduk tenang di bangkunya sambil mengamati teman-teman dan keadaan di sekitar kelas."
      },
      {
        label: "B",
        text: "Langsung menyapa teman dan mengajak berkenalan.",
        type: "Ekstrovert",
        key: "ekstrovert",
        icon: "👋",
        scene: "Seorang siswa berdiri sambil melambaikan tangan, menyapa dan mengajak teman-teman sekelas berkenalan."
      },
      {
        label: "C",
        text: "Mengamati terlebih dahulu, lalu berkenalan jika ada kesempatan.",
        type: "Ambivert",
        key: "ambivert",
        icon: "🙂",
        scene: "Gambar atas: siswa duduk mengamati kelas lebih dulu. Gambar bawah: siswa kemudian melambaikan tangan dan berkenalan dengan teman."
      }
    ]
  },
  {
    icon: "📚",
    title: "Tugas Kelompok",
    text: "Guru memberikan tugas kelompok. Apa yang kamu lakukan?",
    options: [
      {
        label: "A",
        text: "Mengerjakan bagian tugas sendiri terlebih dahulu.",
        type: "Introvert",
        key: "introvert",
        icon: "📖",
        scene: "Seorang siswa menulis di bukunya sendiri, sementara teman-temannya berdiskusi di meja yang sama."
      },
      {
        label: "B",
        text: "Langsung mengajak teman berdiskusi dan membagi tugas.",
        type: "Ekstrovert",
        key: "ekstrovert",
        icon: "🗣️",
        scene: "Seorang siswa berdiskusi bersama teman-teman kelompoknya sambil menunjuk kertas tugas dan membagi pekerjaan."
      },
      {
        label: "C",
        text: "Berdiskusi dengan teman, kemudian mengerjakan bagian sendiri.",
        type: "Ambivert",
        key: "ambivert",
        icon: "🤝",
        scene: "Seorang siswa menulis bagian tugasnya sendiri setelah berdiskusi dengan teman-teman kelompoknya."
      }
    ]
  },
  {
    icon: "🍱",
    title: "Waktu Istirahat",
    text: "Bel istirahat berbunyi. Apa yang ingin kamu lakukan?",
    options: [
      {
        label: "A",
        text: "Tetap di kelas untuk membaca, menggambar, atau bermain sendiri.",
        type: "Introvert",
        key: "introvert",
        icon: "📚",
        scene: "Seorang siswa duduk di kelas dan membaca buku sendirian saat jam istirahat."
      },
      {
        label: "B",
        text: "Pergi bersama teman ke kantin atau mengobrol.",
        type: "Ekstrovert",
        key: "ekstrovert",
        icon: "🍱",
        scene: "Seorang siswa berjalan bersama teman-temannya sambil mengobrol, menuju kantin saat istirahat."
      },
      {
        label: "C",
        text: "Kadang ingin bersama teman, tetapi kadang ingin tetap di kelas.",
        type: "Ambivert",
        key: "ambivert",
        icon: "😊",
        scene: "Seorang siswa berdiri sambil berpikir, tampak ragu memilih pergi bersama teman atau tetap di kelas."
      }
    ]
  },
  {
    icon: "🎤",
    title: "Presentasi di Depan Kelas",
    text: "Guru meminta kamu maju untuk melakukan presentasi. Apa yang kamu lakukan?",
    options: [
      {
        label: "A",
        text: "Mempersiapkan diri terlebih dahulu sebelum maju.",
        type: "Introvert",
        key: "introvert",
        icon: "📝",
        scene: "Seorang siswa berdiri di depan kelas sambil memegang catatan, bersiap sebelum mulai presentasi."
      },
      {
        label: "B",
        text: "Langsung maju dan mencoba berbicara di depan kelas.",
        type: "Ekstrovert",
        key: "ekstrovert",
        icon: "🎤",
        scene: "Seorang siswa langsung berbicara di depan kelas sambil menjelaskan dengan gerakan tangan."
      },
      {
        label: "C",
        text: "Awalnya sedikit gugup, tetapi kemudian mencoba menyesuaikan diri.",
        type: "Ambivert",
        key: "ambivert",
        icon: "🙂",
        scene: "Empat gambar berurutan: siswa tampak gugup di awal, lalu perlahan menyesuaikan diri dan mulai berbicara di depan kelas."
      }
    ]
  },
  {
    icon: "🎮",
    title: "Waktu Luang Setelah Sekolah",
    text: "Setelah pulang sekolah, kamu memiliki waktu luang. Apa yang ingin kamu lakukan?",
    options: [
      {
        label: "A",
        text: "Bermain game, membaca, atau melakukan hobi sendiri.",
        type: "Introvert",
        key: "introvert",
        icon: "🎮",
        scene: "Seorang siswa duduk santai di kursi bean bag di kamarnya sambil bermain game sendirian."
      },
      {
        label: "B",
        text: "Mengajak teman bermain atau pergi bersama.",
        type: "Ekstrovert",
        key: "ekstrovert",
        icon: "⚽",
        scene: "Seorang siswa bermain gitar dan bola bersama teman-teman di taman sekolah."
      },
      {
        label: "C",
        text: "Kadang ingin bermain bersama teman, tetapi kadang ingin bersantai sendiri.",
        type: "Ambivert",
        key: "ambivert",
        icon: "🎮",
        scene: "Seorang siswa duduk di kamar sambil memegang stik game, membayangkan bermain bersama teman sekaligus bersantai sendiri dengan buku."
      }
    ]
  }
];

const MISSION_COUNT = 5;
const TOTAL_STEPS = questions.length + MISSION_COUNT;
let answerLog = [];

let currentQuestion = 0;
let currentIllustration = 0;
let selectedOption = null;

let scores = {
  introvert: 0,
  ekstrovert: 0,
  ambivert: 0
};

// ===== VIDEO =====
// Video soal     : videos/q{nomor soal}-soal.mp4   (contoh: videos/q1-soal.mp4)
// Video pilihan  : videos/q{nomor soal}-{a|b|c}.mp4 (contoh: videos/q1-a.mp4)
// Format yang dicoba: .mp4 lalu .webm.
// Jika video belum ada, game memakai gambar (pilihan) atau emoji (soal) sebagai cadangan.
function getVideoBase(questionIndex, name) {
  return `videos/q${questionIndex + 1}-${name}`;
}

function createVideo(basePath, poster, onFail, options = {}) {
  const video = document.createElement("video");
  video.controls = options.controls !== false;
  video.autoplay = true;
  video.muted = true;       // wajib agar autoplay diizinkan browser; suara bisa dinyalakan lewat kontrol
  video.loop = true;
  video.playsInline = true;
  video.preload = "auto";
  if (poster) video.poster = poster;

  const formats = ["mp4", "webm"];
  formats.forEach((ext, i) => {
    const source = document.createElement("source");
    source.src = `${basePath}.${ext}`;
    source.type = `video/${ext}`;
    // Hanya format terakhir yang memicu cadangan, setelah semua format gagal dimuat.
    if (i === formats.length - 1) source.addEventListener("error", onFail);
    video.appendChild(source);
  });

  return video;
}

// Membuat alamat file gambar, contoh: soal 0 pilihan "A" -> images/q1-a.jpg
function getIllustrationPath(questionIndex, label) {
  return `images/q${questionIndex + 1}-${label.toLowerCase()}.jpg`;
}

// Memuat semua gambar di awal supaya perpindahan layar terasa mulus.
function preloadIllustrations() {
  questions.forEach((q, qIndex) => {
    q.options.forEach(option => {
      const img = new Image();
      img.src = getIllustrationPath(qIndex, option.label);
    });
  });
}

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.remove("active");
  });

  const target = document.getElementById(id);
  document.querySelectorAll("video").forEach(video => {
    if (!target.contains(video)) video.pause();
  });

  target.classList.add("active");
  if (window.GameAudio) GameAudio.onScreen(id);

  target.querySelectorAll("video").forEach(video => {
    const playing = video.play();
    if (playing) playing.catch(() => {});
  });
}

// Layar tentang game muncul sebelum soal pertama.
function showAbout() {
  showScreen("about-screen");
}

// Menampilkan penjelasan satu kecenderungan (dipanggil dari tombol di layar Tentang Game).
function showTendency(key) {
  const info = tendencyInfo[key];

  document.getElementById("tendency-icon").innerHTML = tendencyIcons[key];
  document.getElementById("tendency-title").textContent = info.title;
  document.getElementById("tendency-definition").textContent = info.definition;

  const list = document.getElementById("tendency-examples");
  list.innerHTML = "";
  info.examples.forEach(text => {
    const li = document.createElement("li");
    li.textContent = text;
    list.appendChild(li);
  });

  document.getElementById("tendency-screen").dataset.type = key;
  showScreen("tendency-screen");
}

function startGame() {
  currentQuestion = 0;
  currentIllustration = 0;
  scores = { introvert: 0, ekstrovert: 0, ambivert: 0 };
  answerLog = [];
  showQuestion();
}

function showQuestion() {
  const q = questions[currentQuestion];

  document.getElementById("question-number").textContent =
    `SOAL ${currentQuestion + 1} DARI ${TOTAL_STEPS}`;

  const percent = Math.round(((currentQuestion + 1) / TOTAL_STEPS) * 100);
  document.getElementById("progress-text").textContent = `${percent}%`;
  document.getElementById("progress-fill").style.width = `${percent}%`;

  // Video situasi soal (cadangan: emoji soal bila video belum ada)
  const media = document.getElementById("question-media");
  media.innerHTML = "";

  const showFallbackIcon = () => {
    media.innerHTML = "";
    const icon = document.createElement("div");
    icon.className = "question-icon";
    icon.textContent = q.icon;
    media.appendChild(icon);
  };

  const questionVideo = createVideo(
    getVideoBase(currentQuestion, "soal"),
    null,
    showFallbackIcon
  );
  questionVideo.className = "question-video";
  questionVideo.setAttribute("aria-label", `Video situasi: ${q.title}`);
  media.appendChild(questionVideo);

  document.getElementById("question-title").textContent = q.title;
  document.getElementById("question-text").textContent = q.text;

  showScreen("question-screen");
}

// Menampilkan satu ilustrasi saja dalam satu layar.
function showIllustration(index) {
  currentIllustration = index;
  const q = questions[currentQuestion];
  const option = q.options[currentIllustration];

  document.getElementById("illustration-number").textContent =
    `SOAL ${currentQuestion + 1} DARI ${TOTAL_STEPS}`;
  document.getElementById("illustration-progress").textContent =
    `VIDEO ${currentIllustration + 1}/3`;
  document.getElementById("illustration-label").textContent =
    `PILIHAN ${option.label}`;
  document.getElementById("illustration-title").textContent =
    `Video Pilihan ${option.label}`;

  // Penjelasan ilustrasi (di atas gambar), digabung dengan kalimat instruksi.
  document.getElementById("illustration-scene").textContent = option.scene;

  // Tombol kembali hanya muncul pada ilustrasi B dan C.
  document.getElementById("illustration-back-btn").style.display =
    currentIllustration > 0 ? "inline-block" : "none";

  // Video pilihan dari folder videos (videos/q1-a.mp4, dst.).
  // Cadangan 1: gambar di folder images. Cadangan 2: emoji.
  const container = document.getElementById("single-illustration");
  container.innerHTML = "";

  const frame = document.createElement("div");
  frame.className = "image-placeholder";
  container.appendChild(frame);

  const imagePath = getIllustrationPath(currentQuestion, option.label);

  const showFallbackImage = () => {
    frame.innerHTML = "";
    const img = document.createElement("img");
    img.src = imagePath;
    img.alt = `Ilustrasi soal ${currentQuestion + 1} pilihan ${option.label}`;
    img.onerror = () => {
      img.remove();
      frame.textContent = option.icon;
    };
    frame.appendChild(img);
  };

  const video = createVideo(
    getVideoBase(currentQuestion, option.label.toLowerCase()),
    imagePath,
    showFallbackImage
  );
  video.setAttribute("aria-label", `Video soal ${currentQuestion + 1} pilihan ${option.label}`);
  frame.appendChild(video);

  const nextButton = document.getElementById("illustration-next-btn");

  if (currentIllustration < 2) {
    nextButton.textContent = "NEXT";
  } else {
    nextButton.textContent = "LANJUT KE PILIHAN JAWABAN";
  }

  showScreen("illustration-screen");
}

function prevIllustration() {
  if (currentIllustration > 0) {
    showIllustration(currentIllustration - 1);
  }
}

function nextIllustration() {
  if (currentIllustration < 2) {
    showIllustration(currentIllustration + 1);
  } else {
    showChoices();
  }
}

function showChoices() {
  const q = questions[currentQuestion];

  document.getElementById("choice-number").textContent =
    `SOAL ${currentQuestion + 1} DARI ${TOTAL_STEPS}`;

  document.getElementById("choice-question").textContent = q.text;

  const container = document.getElementById("choices-container");
  container.innerHTML = "";

  // Setiap pilihan jawaban berupa kartu video (video berputar tanpa suara).
  // Video: videos/q{soal}-{a|b|c}.mp4. Cadangan: gambar di folder images, lalu emoji.
  q.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.className = "choice-btn choice-video-card";
    button.setAttribute("aria-label", `Pilihan ${option.label}: ${option.text}`);

    const thumb = document.createElement("span");
    thumb.className = "choice-thumb";

    const imagePath = getIllustrationPath(currentQuestion, option.label);

    const showFallbackImage = () => {
      thumb.querySelectorAll("video, img").forEach(el => el.remove());
      const img = document.createElement("img");
      img.src = imagePath;
      img.alt = "";
      img.onerror = () => {
        img.remove();
        thumb.insertAdjacentText("afterbegin", option.icon);
      };
      thumb.prepend(img);
    };

    const video = createVideo(
      getVideoBase(currentQuestion, option.label.toLowerCase()),
      imagePath,
      showFallbackImage,
      { controls: false }
    );
    thumb.appendChild(video);

    const letter = document.createElement("strong");
    letter.textContent = option.label;
    thumb.appendChild(letter);

    const text = document.createElement("span");
    text.className = "choice-text";
    text.textContent = option.text;

    button.appendChild(thumb);
    button.appendChild(text);
    button.onclick = () => chooseAnswer(index);

    container.appendChild(button);
  });

  showScreen("choice-screen");
}

// Jawaban langsung dicatat, lalu otomatis lanjut ke soal berikutnya (tanpa layar feedback).
function chooseAnswer(index) {
  // Cegah ketukan ganda yang bisa menambah poin dua kali.
  document.querySelectorAll("#choices-container .choice-btn").forEach(btn => {
    btn.disabled = true;
  });

  selectedOption = questions[currentQuestion].options[index];
  scores[selectedOption.key] += 1;
  answerLog.push(selectedOption.key);

  nextQuestion();
}

function nextQuestion() {
  currentQuestion++;

  if (currentQuestion < questions.length) {
    currentIllustration = 0;
    showQuestion();
  } else {
    showRound2Intro();
  }
}

const resultProfiles = {
  INTROVERT: {
    key: "introvert", image: "images/q5-a.jpg", label: "INTROVERT",
    tagline: "Sang Pengamat yang Tenang",
    traits: ["Suka mengamati", "Berpikir dulu", "Hobi mandiri"],
    text: "Kamu cenderung nyaman dengan waktu untuk diri sendiri dan biasanya mempertimbangkan situasi sebelum berinteraksi."
  },
  EKSTROVERT: {
    key: "ekstrovert", image: "images/q1-b.jpg", label: "EKSTROVERT",
    tagline: "Sang Penyemangat yang Ramah",
    traits: ["Mudah bergaul", "Berani tampil", "Suka bersama teman"],
    text: "Kamu cenderung menikmati interaksi dengan orang lain dan lebih aktif dalam situasi sosial."
  },
  AMBIVERT: {
    key: "ambivert", image: "images/q2-c.jpg", label: "AMBIVERT",
    tagline: "Sang Penyeimbang yang Luwes",
    traits: ["Pandai menyesuaikan diri", "Bisa ramai, bisa tenang", "Fleksibel"],
    text: "Kamu dapat merasa nyaman dalam situasi sosial maupun ketika menikmati waktu untuk diri sendiri."
  },
  CAMPURAN: {
    key: "campuran", image: "images/q3-c.jpg", label: "CAMPURAN / SEIMBANG",
    tagline: "Kamu Punya Banyak Sisi",
    traits: ["Beragam", "Bergantung situasi", "Terus berkembang"],
    text: "Jawabanmu menunjukkan beberapa kecenderungan yang seimbang. Setiap orang dapat memiliki kecenderungan yang berbeda dalam situasi yang berbeda."
  }
};

function launchConfetti() {
  const box = document.getElementById("confetti");
  box.innerHTML = "";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const colors = ["#ffb340", "#5fd07f", "#5b9bf0", "#ff7aa8", "#8a5fc7", "#ffd35a"];
  for (let i = 0; i < 38; i++) {
    const piece = document.createElement("i");
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = colors[i % colors.length];
    piece.style.animationDelay = `${Math.random() * 1.2}s`;
    piece.style.animationDuration = `${2.6 + Math.random() * 2}s`;
    piece.style.setProperty("--drift", `${Math.round(Math.random() * 60 - 30)}px`);
    if (i % 3 === 0) piece.style.borderRadius = "50%";
    box.appendChild(piece);
  }
}

function showResult() {
  const keys = ["introvert", "ekstrovert", "ambivert"];

  const values = [
    { name: "INTROVERT", score: scores.introvert },
    { name: "EKSTROVERT", score: scores.ekstrovert },
    { name: "AMBIVERT", score: scores.ambivert }
  ];

  const highest = Math.max(...values.map(item => item.score));
  const winners = values.filter(item => item.score === highest);
  const profile = winners.length > 1 ? resultProfiles.CAMPURAN : resultProfiles[winners[0].name];

  const screen = document.getElementById("result-screen");
  screen.dataset.type = profile.key;
  if (window.GameAudio) GameAudio.result(profile.key);   // musik akhir sesuai hasil

  document.getElementById("result-type").textContent = profile.label;
  document.getElementById("result-tagline").textContent = profile.tagline;
  document.getElementById("result-description").textContent = profile.text;
  document.getElementById("result-image").src = profile.image;

  const chips = document.getElementById("trait-chips");
  chips.innerHTML = "";
  profile.traits.forEach(t => {
    const span = document.createElement("span");
    span.textContent = t;
    chips.appendChild(span);
  });

  // Skor + bar (mulai dari 0 supaya terisi dengan animasi)
  keys.forEach(k => {
    document.getElementById(`${k}-score`).textContent = scores[k];
    document.getElementById(`${k}-bar`).style.width = "0%";
  });

  const dots = document.getElementById("journey-dots");
  dots.innerHTML = "";
  answerLog.forEach((k, i) => {
    const d = document.createElement("i");
    d.className = `jd ${k}`;
    d.textContent = i + 1;
    dots.appendChild(d);
  });

  showScreen("result-screen");
  launchConfetti();

  requestAnimationFrame(() => requestAnimationFrame(() => {
    keys.forEach(k => {
      const pct = Math.round((scores[k] / TOTAL_STEPS) * 100);
      document.getElementById(`${k}-bar`).style.width = `${pct}%`;
    });
  }));
}

function restartGame() {
  startGame();
}

// Kembali ke halaman pembuka (home) dan bersihkan semua kemajuan permainan.
function goHome() {
  currentQuestion = 0;
  currentIllustration = 0;
  selectedOption = null;
  scores = { introvert: 0, ekstrovert: 0, ambivert: 0 };
  answerLog = [];
  if (typeof missionIndex !== "undefined") missionIndex = 0;
  document.getElementById("confetti").innerHTML = "";
  showScreen("start-screen");
  window.scrollTo({ top: 0 });
}

preloadIllustrations();
