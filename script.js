// ===== Data mahasiswa (array objek) =====
// Data awal agar tabel tetap terisi saat halaman pertama kali dibuka.
let dataMahasiswa = [
  { nama: "Ilham", nim: "05301425105", nilai: 88 },
  { nama: "Melisa", nim: "531424002", nilai: 70 }
];

// ===== Mengambil elemen HTML =====
const formNilai = document.getElementById("formNilai");
const inputNama = document.getElementById("nama");
const inputNim = document.getElementById("nim");
const inputNilai = document.getElementById("nilai");
const pesanNama = document.getElementById("pesanNama");
const pesanNim = document.getElementById("pesanNim");
const pesanNilai = document.getElementById("pesanNilai");
const pesanSukses = document.getElementById("pesanSukses");
const filterStatus = document.getElementById("filterStatus");
const isiTabel = document.getElementById("isiTabel");

// Menentukan predikat berdasarkan nilai.
function tentukanGrade(nilai) {
  if (nilai >= 85) {
    return "A";
  } else if (nilai >= 75) {
    return "B";
  } else if (nilai >= 65) {
    return "C";
  } else if (nilai >= 50) {
    return "D";
  } else {
    return "E";
  }
}

// Menentukan status kelulusan: mahasiswa lulus jika nilainya minimal 75.
function tentukanStatus(nilai) {
  if (nilai >= 75) {
    return "Lulus";
  } else {
    return "Tidak Lulus";
  }
}

// Menampilkan data pada tabel sesuai dengan filter yang dipilih.
function tampilkanTabel() {
  const pilihan = filterStatus.value; // semua, lulus, atau tidak lulus
  let html = "";
  let nomor = 0;

  for (let i = 0; i < dataMahasiswa.length; i++) {
    const m = dataMahasiswa[i];
    const status = tentukanStatus(m.nilai);

    // Memeriksa apakah data sesuai dengan filter yang dipilih.
    let tampil = false;
    if (pilihan === "semua") {
      tampil = true;
    } else if (pilihan === "lulus" && status === "Lulus") {
      tampil = true;
    } else if (pilihan === "tidak" && status === "Tidak Lulus") {
      tampil = true;
    }

    // Membuat baris tabel jika data sesuai dengan filter.
    if (tampil) {
      nomor++;
      html +=
        "<tr>" +
          "<td>" + nomor + "</td>" +
          "<td>" + m.nama + "</td>" +
          "<td>" + m.nim + "</td>" +
          "<td>" + m.nilai + "</td>" +
          '<td><span class="grade">' + tentukanGrade(m.nilai) + "</span></td>" +
          "<td>" + status + "</td>" +
          '<td><button class="btn btn-sm btn-danger btn-hapus" data-index="' + i + '">Hapus</button></td>' +
        "</tr>";
    }
  }

  // Menampilkan pesan jika tidak ada data yang sesuai.
  if (html === "") {
    html = '<tr><td colspan="7" class="text-center">Tidak ada data yang sesuai.</td></tr>';
  }

  isiTabel.innerHTML = html;
  pasangTombolHapus();
}

// Memasang event klik pada setiap tombol Hapus di tabel.
function pasangTombolHapus() {
  const tombol = document.querySelectorAll(".btn-hapus");
  for (let i = 0; i < tombol.length; i++) {
    tombol[i].addEventListener("click", function () {
      hapusData(Number(this.getAttribute("data-index")));
    });
  }
}

// Menghapus satu data berdasarkan indeksnya di dalam array.
function hapusData(index) {
  dataMahasiswa.splice(index, 1); // Menghapus satu data pada indeks tersebut.
  tampilkanTabel();
}

// Menandai kolom yang tidak valid dan menampilkan pesan kesalahan.
function tandaiSalah(input, elemenPesan, pesan) {
  input.classList.add("is-invalid");
  elemenPesan.textContent = pesan;
}

// Menghapus tanda kesalahan pada kolom.
function bersihkanTanda(input) {
  input.classList.remove("is-invalid");
}

// Memeriksa seluruh kolom formulir. Mengembalikan true jika semua data valid.
function validasiForm() {
  let valid = true;
  const nama = inputNama.value.trim();
  const nim = inputNim.value.trim();
  const nilai = inputNilai.value;

  // Nama wajib diisi dan terdiri atas minimal tiga karakter.
  if (nama.length < 3) {
    tandaiSalah(inputNama, pesanNama, "Nama harus diisi dan terdiri atas minimal 3 karakter.");
    valid = false;
  } else {
    bersihkanTanda(inputNama);
  }

  // NIM wajib diisi dan harus berupa angka.
  if (nim === "" || isNaN(Number(nim))) {
    tandaiSalah(inputNim, pesanNim, "NIM harus diisi dengan angka.");
    valid = false;
  } else {
    bersihkanTanda(inputNim);
  }

  // Nilai wajib berupa angka antara 0 dan 100.
  if (nilai === "" || Number(nilai) < 0 || Number(nilai) > 100) {
    tandaiSalah(inputNilai, pesanNilai, "Nilai harus berupa angka antara 0 dan 100.");
    valid = false;
  } else {
    bersihkanTanda(inputNilai);
  }

  return valid;
}

// Menambahkan data baru ke array jika formulir valid.
function tambahData() {
  if (validasiForm() === false) {
    pesanSukses.innerHTML = "";
    return; // Menghentikan proses agar data tidak ditambahkan.
  }

  const mahasiswaBaru = {
    nama: inputNama.value.trim(),
    nim: inputNim.value.trim(),
    nilai: Number(inputNilai.value)
  };
  dataMahasiswa.push(mahasiswaBaru);

  pesanSukses.innerHTML =
    '<div class="alert alert-success">Data mahasiswa atas nama ' + mahasiswaBaru.nama + " berhasil ditambahkan.</div>";

  formNilai.reset();
  tampilkanTabel();
}

// ===== Pendengar peristiwa =====

// Saat formulir dikirim, tambahkan data.
formNilai.addEventListener("submit", function (e) {
  e.preventDefault(); // Mencegah halaman dimuat ulang.
  tambahData();
});

// Saat filter diubah, tampilkan ulang tabel.
filterStatus.addEventListener("change", tampilkanTabel);

// Saat pengguna mengubah input, hapus tanda kesalahan pada kolom tersebut.
formNilai.addEventListener("input", function (e) {
  bersihkanTanda(e.target);
});

// Event klik tombol Hapus dipasang melalui fungsi pasangTombolHapus().

// ===== Jalankan saat halaman dibuka =====
tampilkanTabel();