"use strict";


console.log("p09 JavaScript aktif");
console.log("P10 JavaScript aktif");
console.log("P11 JavaScript aktif");


// 1. DATA PRODUK UMKM

const produkUmkm = [
  { nama: "kopara kampung", kategori: "Kopi", harga: 85000, stok: 12, unggulan: true },
  { nama: "Robusta Temanggung", kategori: "Kopi", harga: 65000, stok: 4, unggulan: false},
  { nama: "Paket instan kopara", kategori: "Bundling", harga: 125000, stok: 12, unggulan: false },
  { nama: "americano", kategori: "Kopi", harga: 125000, stok: 4, unggulan: false },
];



// 2. FUNCTION FORMAT RUPIAH

function formatRupiah(nilai) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(nilai);
}

console.log(formatRupiah(85000));


// 3. FUNCTION STATUS STOK

function statusStok(stok) {
  if (stok <= 0) {
    return { label: "Habis", className: "empty" };
  }

  if (stok <= 5) {
    return { label: "Stok terbatas", className: "warning" };
  }

  return { label: "Tersedia", className: "" };
}


console.log(statusStok(0));
console.log(statusStok(3));
console.log(statusStok(12));


// 4. FUNCTION LABEL KATEGORI
function labelKategori(kategori) {
  switch (kategori) {
    case "Kopi":
      return "Produk kopi pilihan";
    case "Bundling":
      return "Paket hemat";
    default:
      return "Produk UMKM";
  }
}


// 5. FUNCTION MEMBUAT KARTU PRODUKP 10
function buatKartuProduk(produk) {
  const status = statusStok(produk.stok);

  return `
    <article class="js-product-card">
      <h3>${produk.nama}</h3>
      <p class="category-note">${labelKategori(produk.kategori)}</p>
      <p class="price">${formatRupiah(produk.harga)}</p>
      <span class="stock-badge ${status.className}">${status.label}</span>
    </article>
  `;
}


produkUmkm.forEach((produk) => {
  console.log("Debug produk:", produk.nama, "stok:", produk.stok);
});

console.table(produkUmkm);


// 6. FUNCTION RENDER PRODUK  P10

function renderProduk() {
  const grid = document.querySelector("#produk-dinamis");
  const ringkasan = document.querySelector("#produk-ringkasan");
  const unggulan = document.querySelector("#produk-unggulan");

  if (!grid || !ringkasan || !unggulan) {
    console.warn("Target render produk belum lengkap (P10).");
    return;
  }

  const produkTersedia = produkUmkm.filter((produk) => produk.stok > 0);
  const produkUnggulan = produkUmkm.find((produk) => produk.unggulan === true);
  const markupProduk = produkTersedia.map(buatKartuProduk).join("");

  grid.innerHTML = markupProduk;
  ringkasan.textContent = `${produkTersedia.length} produk tersedia dari ${produkUmkm.length} data.`;
  unggulan.textContent = produkUnggulan
    ? `Produk unggulan: ${produkUnggulan.nama}`
    : "Belum ada produk unggulan.";

  console.log("Jumlah produk tersedia:", produkTersedia.length);
  console.log("Produk unggulan:", produkUnggulan);
}


// ==========================================
// PRAKTIKUM P11
// ==========================================

// 7. DOM SELECTION DAN GUARD (P11)
const produkGridP11 = document.querySelector("#produk-grid");
const produkStatusP11 = document.querySelector("#produk-status");
const tombolFilter = document.querySelectorAll("[data-filter]");


// 8. FUNCTION BUAT ELEMEN PRODUK (P11Menggunakan kategori asli)
function buatElemenProdukP11(produk) {
  const card = document.createElement("article");
  card.classList.add("product-card");

  const title = document.createElement("h3");
  title.textContent = produk.nama;

  const category = document.createElement("p");
  category.classList.add("category-note");
  category.textContent = produk.kategori; // Menampilkan kategori asli (Bundling, Kopi, dll)

  const price = document.createElement("p");
  price.classList.add("price");
  price.textContent = formatRupiah(produk.harga);

  const stock = document.createElement("span");
  const status = statusStok(produk.stok);
  stock.classList.add("stock-badge");
  if (status.className) {
    stock.classList.add(status.className);
  }
  stock.textContent = status.label;

  const removeButton = document.createElement("button");
removeButton.type = "button";
removeButton.textContent = "Sembunyikan";
removeButton.classList.add("ghost-button");

removeButton.addEventListener("click", () => {
  card.remove();
  produkStatusP11.textContent = "Satu kartu disembunyikan dari tampilan sementara.";
});

card.append(title, category, price, stock, removeButton);

  

  card.append(title, category, price, stock);
  return card;

}


// 9. FUNCTION EMPTY STATE (P11)
function buatEmptyState(kategori) {
  const empty = document.createElement("p");
  empty.classList.add("empty-state");
  empty.textContent = `Belum ada produk pada kategori ${kategori}.`;
  return empty;
}


// 10. FUNCTION RENDER PRODUK & FILTER (P11)
function renderProdukP11(kategoriAktif = "Semua") {
  if (!produkGridP11 || !produkStatusP11) {
    console.warn("Target render produk P11 tidak ditemukan.");
    return;
  }

  const produkTampil = kategoriAktif === "Semua"
    ? produkUmkm
    : produkUmkm.filter((produk) => produk.kategori === kategoriAktif);

  produkGridP11.replaceChildren();

  if (produkTampil.length === 0) {
    produkGridP11.append(buatEmptyState(kategoriAktif));
    produkStatusP11.textContent = "0 produk ditemukan.";
    return;
  }

  produkTampil.forEach((produk) => {
    produkGridP11.append(buatElemenProdukP11(produk));
  });

  produkStatusP11.textContent = `${produkTampil.length} produk ditampilkan.`;
  console.log("Render kategori P11:", kategoriAktif);
}


// 11. EVENT LISTENER UNTUK TOMBOL FILTER (P11)
tombolFilter.forEach((tombol) => {
  tombol.addEventListener("click", (event) => {
    const tombolAktif = event.currentTarget;
    const kategori = tombolAktif.dataset.filter;

    tombolFilter.forEach((item) => item.classList.remove("is-active"));
    tombolAktif.classList.add("is-active");

    renderProdukP11(kategori);
  });
});


document.addEventListener("DOMContentLoaded", () => {
  renderProduk();       // Menjalankan fungsi P10
  renderProdukP11("Semua"); // Menjalankan fungsi P11
});