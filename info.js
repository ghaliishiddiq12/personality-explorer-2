// =====================================================================
// INFO GAME: identitas pengembang, layar Kredit, dan Panduan Guru.
// >>> ISI DATA PENGEMBANG DI BAWAH INI (satu tempat saja). <<<
// Teks pada halaman utama dan layar Kredit akan terisi otomatis.
// Baris yang dikosongkan ("") tidak ditampilkan.
// =====================================================================
const GAME_INFO = {
  developer: "Ghali Shiddiq F (K3524054) | Jinan Ramadhan A (K3524086)",
  affiliation: "Pendidikan Informatika Dan Komputer / Universitas Sebelas Maret",
  supervisor: "",          // contoh: "Dosen pembimbing: Nama, M.Pd." (kosongkan jika tidak perlu)
  year: "2026",
  aiTools: ""              // contoh: "Canva AI, Veo" (opsional; ditambahkan pada keterangan AI)
};

(function () {
  let prevScreen = "start-screen";

  function fill() {
    document.querySelectorAll("[data-info]").forEach(el => {
      const v = GAME_INFO[el.dataset.info] || "";
      el.textContent = v;
    });
    document.querySelectorAll("[data-info-row]").forEach(el => {
      el.hidden = !GAME_INFO[el.dataset.infoRow];
    });
  }

  // Membuka layar Kredit / Panduan Guru, lalu kembali ke layar sebelumnya
  window.openInfo = function (id) {
    const active = document.querySelector(".screen.active");
    if (active && !active.classList.contains("info-screen")) prevScreen = active.id;
    showScreen(id);
    window.scrollTo({ top: 0 });
  };
  window.closeInfo = function () {
    showScreen(prevScreen);
  };
  window.printGuide = function () {
    window.print();
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fill);
  else fill();
})();
