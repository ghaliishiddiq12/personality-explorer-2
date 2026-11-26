# PERSONALITY EXPLORER: VIDEO INTERAKTIF AI — Web Game V2

## Alur terbaru
1. Halaman pembuka
2. Tentang game
3. Soal + video situasi
4. Menonton 3 video ilustrasi pilihan (A, B, C)
5. Memilih jawaban -> langsung lanjut ke soal berikutnya (tanpa feedback)
6. Hasil akhir

## Jumlah soal
5 soal untuk siswa kelas 7–9.

## Cara menjalankan
1. Ekstrak file ZIP.
2. Buka folder `personality-explorer-v2` di VS Code.
3. Buka `index.html`.
4. Jalankan dengan Live Server, atau buka langsung di browser.

## Menambahkan video ilustrasi AI
Masukkan video ke folder `videos` dengan nama:

videos/q{nomor soal}-soal.mp4   -> video situasi di layar soal   (contoh: q1-soal.mp4)
videos/q{nomor soal}-a.mp4      -> video ilustrasi pilihan A      (contoh: q1-a.mp4)
videos/q{nomor soal}-b.mp4      -> video ilustrasi pilihan B
videos/q{nomor soal}-c.mp4      -> video ilustrasi pilihan C

Total 20 video (5 soal x 4 video). Daftar lengkap + saran prompt ada di VIDEO-GUIDE.txt.
Format .webm juga didukung (q1-a.webm), tetapi .mp4 (H.264) paling aman di semua perangkat.
Untuk mengganti video, cukup timpa file dengan nama yang sama.

Jika sebuah video belum ada:
- Layar soal menampilkan emoji soal.
- Layar pilihan menampilkan gambar dari folder `images` (q1-a.jpg dst.), lalu emoji bila gambar juga tidak ada.
Jadi game tetap bisa dijalankan sambil video dibuat satu per satu.

Folder `images` tetap dipakai sebagai gambar cadangan dan sampul (poster) video.

## Catatan
Hasil game menunjukkan kecenderungan berdasarkan jawaban, bukan diagnosis kepribadian profesional.

## Kartu sampul (halaman pembuka)
Tiga kartu di bagian `hero-stage` pada index.html kini memakai VIDEO (otomatis berputar, tanpa suara).
Untuk mengganti: ubah `src="videos/q1-soal.mp4"` ke video lain. `poster="images/..."` adalah gambar cadangan.

## Ronde 2: 5 misi interaktif (soal 6-10)  -> file missions.js
6. Lari Akhir Pekan  : GAME LARI 3 JALUR (runner.js), lihat bagian di bawah
7. Chat Grup Kelas   : cerita bercabang 3 giliran
8. Tas Kemah Pulau   : pilih 3 dari 8 barang + 1 alasan
9. Baterai Sosial    : geser slider energi di 4 skenario
10. Kartu Aku Banget : geser kartu 8 pernyataan (kanan/kiri/kadang)
Tiap misi menghasilkan satu kecenderungan (+1 skor). Total 10 poin. Seri dalam satu misi dihitung ambivert.
Teks soal ada di missions.js (chatTurns, islandItems, batteryScenarios, cardStatements) dan runner.js (runWaves).

## Layar Pilihan Jawaban (kartu video)
Setiap pilihan A/B/C di layar "Pilih Jawabanmu" kini berupa kartu video (videos/q{soal}-{a|b|c}.mp4)
yang berputar tanpa suara. Ketuk kartu untuk memilih. Jika video belum ada, kartu memakai gambar di folder images.

## Tampilan layar penuh
Game memenuhi seluruh jendela browser (bukan kartu di tengah). Di layar lebar (>= 900px) soal, video pilihan,
pilihan jawaban, tentang game, dan hasil memakai tata letak dua kolom / tiga kartu. Di HP tetap satu kolom.

## Misi Tas Kemah Pulau (seret barang ke tas)
- Gambar tas: images/tas.webp (PNG asli sudah dibersihkan dari latar kotak-kotak).
- Gambar barang: images/items/*.svg (buku-cerita, buku-sketsa, headphone, bola, gitar, kartu, kamera, tikar).
  Untuk memakai gambar sendiri, ganti file di folder itu atau ubah alamat `img` di `islandItems` (missions.js).
- Latar pulau: images/pulau-bg.svg.
- Cara main: seret barang ke tas, atau ketuk barang. Ketuk miniatur di papan slot untuk mengeluarkannya lagi.

## Soal 6: Lari Akhir Pekan (runner.js)
Game bersepeda 3 jalur melewati satu hari Sabtu. Latar berganti dari siang, sore, sampai malam.
- Ada 12 persimpangan. Di tiap persimpangan muncul 3 kegiatan, satu di tiap jalur:
  waktu tenang sendiri (introvert), kegiatan seimbang/fleksibel (ambivert), kegiatan bersama banyak orang (ekstrovert).
  Letak ketiganya diacak tiap persimpangan, jadi siswa harus membaca, bukan menghafal posisi.
- Kendali:
  * Pindah jalur : ketuk/seret di layar, tombol Kiri/Kanan, atau panah kiri/kanan (A/D).
  * Lompat       : panah atas (W), tombol Lompat, atau geser layar ke atas.
  * Trik freestyle: panah bawah (S), tombol Trik, atau geser layar ke bawah. Trik acak (putar, salto, miring) dan
    kalau mendarat mulus dapat bonus +15.
- Rintangan RENDAH (palang, polisi tidur, peti, kayu, lubang, genangan) bisa dilompati. Rintangan TINGGI (kerucut, tong,
  motor, papan, kardus, gerobak) harus dihindari dengan pindah jalur. Kena = tersandung, -5 skor.
- Skor, bintang, dan trik hanya hiburan, tidak memengaruhi hasil kepribadian.
- Hasil misi: kegiatan yang paling sering dipilih; jika seri = ambivert (+1 skor, sama seperti misi lain).
- Arena berbentuk 16:9 di laptop/tablet. Di HP tegak arena dibuat sedikit lebih tinggi agar tulisan tetap terbaca.

### Mengatur kecepatan (waktu berpikir)
Di bagian atas runner.js:
  SPEED_BASE  kecepatan awal (makin kecil makin lambat)
  SPEED_GAIN  tambahan kecepatan sampai akhir
  THINK_SLOW  pengali kecepatan saat pilihan mendekat (0.5 = setengah kecepatan)
Game otomatis melambat ketika 3 pilihan kegiatan mendekat, sehingga pilihan terlihat sekitar 6-7 detik.

### Aset (folder assets/)
bg-siang.jpg, bg-sore.jpg, bg-malam.jpg : latar jalan (dibuat di Canva AI)
rider-1..13.png : sprite siswa bersepeda (1-10 siklus mengayuh, 11 miring, 12 dan 13 cadangan)
obs-*.png       : rintangan,  fx-*.png : efek debu, kilau, bintang, ledakan
Mengganti latar: titik hilang jalan dan kemiringan tepi jalan diatur di konstanta BG (runner.js).
Jalan beraspal tiga jalur digambar oleh kode di atas latar, agar bisa bergerak.
Mengganti isi kegiatan: ubah array runWaves di runner.js (t = teks, icon = nama ikon di ICON_PATHS missions.js).

## Hasil akhir
Layar hasil punya tombol MAIN LAGI dan KEMBALI KE HOME (kembali ke halaman pembuka, kemajuan direset).

## Folder videos
Folder videos tidak disertakan di ZIP ini (ukurannya 30 MB lebih). Letakkan kembali folder videos di samping index.html.
Selama belum ada, game tetap berjalan memakai gambar cadangan di folder images.

## Pembaruan terbaru
- Soal 7 (Chat Grup): ada kolom ketik. Siswa memilih gaya balasan (3 pilihan), contoh kalimat muncul di kolom, dan boleh
  diubah atau ditulis ulang dengan kata-kata sendiri, lalu dikirim. Skor dihitung dari gaya yang dipilih, bukan dari isi ketikan.
  Mengubah gaya/kalimat contoh: array chatTurns di missions.js (label = nama gaya, text = kalimat contoh).
- Soal 8 (Tas Kemah): barang yang dipilih tampak menyembul di dalam tas. Ketuk barang di dalam tas (atau kotak kecil di papan)
  untuk mengeluarkannya; barang terbang kembali ke tempat asalnya.
- Layar hasil (laptop/tablet): sisi kiri (foto, judul kecenderungan) dibuat lebih besar.

## Audio (audio.js) - pembaruan
- Musik latar berbeda per bagian: beranda/soal, misi tenang, game lari (cepat), dan musik hasil akhir sesuai sifat
  (introvert = lembut seperti kotak musik, ambivert = santai hangat, ekstrovert = pesta cepat, campuran = ceria seimbang).
- Suara klik untuk semua tombol, suara geser kartu, tarik barang, dan geser slider.
- Tombol bisu (ikon speaker, pojok kanan atas). Pilihan bisu tersimpan di browser. Di game lari memakai tombol di dalam arena.
- Semua suara dibuat oleh browser (WebAudio), tanpa file suara tambahan. Browser baru mengizinkan suara setelah pemain mengetuk layar.
- Mengubah lagu: objek TRACKS di audio.js (tempo, akor, pola drum, melodi).

## Lari Akhir Pekan - pembaruan tampilan
- Kegiatan tampil buram dan samar dari jauh, makin jelas saat game melambat, lalu naik melewati atas pelari.
- Pelari digambar di kanvas lapisan atas (run-canvas-top) sehingga tidak pernah tertutup kegiatan.

## Persiapan validasi (v7)
- ISI IDENTITAS PENGEMBANG di bagian atas info.js (objek GAME_INFO: developer, affiliation, supervisor, year, aiTools).
  Teks di halaman utama dan layar Kredit terisi otomatis.
- Halaman utama: nama pengembang, tautan Panduan Guru, tautan Kredit & Keterangan AI, dan catatan "dibuat dengan bantuan AI".
- Layar Kredit & Keterangan AI: pengembang, keterangan penggunaan AI, tabel sumber aset. Dapat dibuka dari halaman utama dan dari
  layar soal / video / pilihan (tombol "Lihat kredit"), lalu KEMBALI ke layar semula.
- Panduan Guru (satu halaman): tentang media, persiapan, alur, memaknai hasil, saran diskusi, kendala. Tombol CETAK PANDUAN
  mencetak satu lembar A4 landscape.
- Keterangan "dibuat dengan bantuan AI" juga tampil di layar soal, video pilihan, pilihan jawaban, dan hasil.
