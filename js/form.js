const form = document.querySelector("#form-kontak");
const preview = document.querySelector("#preview-form");

//  P12

const formFeedback = document.querySelector("#form-feedback");
const fields = ["nama", "email", "telepon", "paket", "pesan", "setuju"].map((id) => document.querySelector(`#${id}`));
const topikInputs = document.querySelectorAll('input[name="topik"]');
const STORAGE_KEY = "kopara-coffee-preferensi-kontak";


// P12 Helper Validasi Error

function getFieldError(field) {
  const validity = field.validity;
  if (validity.valueMissing) return "Bagian ini wajib diisi.";
  if (validity.typeMismatch) return "Format data belum sesuai.";
  if (validity.tooShort) return `Isi minimal ${field.minLength} karakter.`;
  if (validity.patternMismatch) return "Format belum sesuai contoh yang diminta.";
  return "";
}

function tampilkanError(field, pesan) {
  const error = document.querySelector(`#${field.id}-error`);
  field.setCustomValidity(pesan);
  field.setAttribute("aria-invalid", pesan ? "true" : "false");
  if (error) {
    error.textContent = pesan;
  }
}

function validasiField(field) {
  field.setCustomValidity("");
  const pesan = getFieldError(field);
  tampilkanError(field, pesan);
  return pesan === "";
}

//  P12 Preview & localStorage

function tampilkanPreview() {
  const data = new FormData(form);
  const topikDipilih = document.querySelector('input[name="topik"]:checked');
  const waktuDipilih = document.querySelector('input[name="waktu"]:checked');

  //  kode untuk menampilkan data ke preview
  preview.textContent = [
    `Nama: ${data.get("nama")}`,
    `Email: ${data.get("email")}`,
    `Paket: ${data.get("paket")}`,
    `Topik: ${topikDipilih ? topikDipilih.value : "-"}`,
    `Telepon: ${data.get("telepon") || "-"}`,
    `Waktu dihubungi: ${waktuDipilih ? waktuDipilih.value : "-"}`,
    `Pesan: ${data.get("pesan")}`,
  ].join("\n");

  formFeedback.textContent = "Form valid. Preview berhasil dibuat.";
  formFeedback.classList.add("success");

  // p12 Simpan data ke localStorage 
  simpanPreferensi();
}

function simpanPreferensi() {
  const data = new FormData(form);
  const topikDipilih = document.querySelector('input[name="topik"]:checked');
  const preferensi = {
    paket: data.get("paket"),
    topik: topikDipilih ? topikDipilih.value : "",
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(preferensi));
}

function muatPreferensi() {
  try {
    const tersimpan = localStorage.getItem(STORAGE_KEY);
    if (!tersimpan) return;

    const preferensi = JSON.parse(tersimpan);
    document.querySelector("#paket").value = preferensi.paket ?? "";
    
    if (preferensi.topik) {
      const topik = document.querySelector(`input[name="topik"][value="${preferensi.topik}"]`);
      if (topik) topik.checked = true;
    }
  } catch (error) {
    console.warn("Preferensi tidak valid.", error);
    localStorage.removeItem(STORAGE_KEY);
  }
}

// 5. EVENT LISTENER SUBMIT 

form.addEventListener("submit", (event) => {
  event.preventDefault(); // (KODE LAMA: Mencegah halaman reload)

 
  const semuaValid = fields.every((field) => validasiField(field));
  const topikValid = Array.from(topikInputs).some((input) => input.checked);

  const topikError = document.querySelector("#topik-error");
  if (!topikValid) {
    if (topikError) topikError.textContent = "Pilih salah satu topik.";
  } else {
    if (topikError) topikError.textContent = "";
  }

  //  P12 Jika tidak valid, tahan submit & pindahkan fokus 
  if (!semuaValid || !topikValid || !form.checkValidity()) {
    formFeedback.textContent = "Periksa kembali bagian yang ditandai.";
    formFeedback.classList.remove("success");
    preview.textContent = "Data form akan muncul setelah tombol dikirim.";
    
    form.reportValidity();
    const firstInvalid = form.querySelector('[aria-invalid="true"], :invalid');
    if (firstInvalid) {
      firstInvalid.focus();
    }
    return;
  }

  tampilkanPreview();
});

// 6. TAMBAHAN BARU P12 Muat preferensi saat halaman siap
document.addEventListener("DOMContentLoaded", () => {
  muatPreferensi();
});


