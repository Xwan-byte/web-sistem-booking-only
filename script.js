const urlParams = new URLSearchParams(window.location.search);
const paket = urlParams.get("paket");
const workshopsRow = document.getElementById("workshopsRow");
const workshopsOptions = document.getElementById("workshopsOptions");

// Data pelatihan
const pelatihan = [
  { id: "galon", name: "Melukis Pot dari Galon", price: 15000 },
  { id: "topeng", name: "Melukis Topeng", price: 20000 },
  { id: "kresek", name: "Membuat Bunga dari Kresek", price: 13000 },
  { id: "pot", name: "Membuat Pot dari Kain Bekas", price: 27500 },
  { id: "ecobrick", name: "Membuat Ecobrick", price: 7000 },
  { id: "lilin", name: "Membuat Lilin Aroma Terapi Jelantah", price: 16000 }
];

// Aturan per paket
let aturan = { min: 0, max: 0 };

if (paket === "halfday") {
  // Kunjungan edukasi saja
  workshopsRow.style.display = "none";
} else if (paket === "fullday") {
  aturan = { min: 2, max: 3 };
  tampilkanPelatihan();
} else if (paket === "menginap") {
  aturan = { min: 2, max: 4 };
  tampilkanPelatihan();
} else if (paket === "minat") {
  aturan = { min: 1, max: 1 };
  tampilkanPelatihan();
}

function tampilkanPelatihan() {
  workshopsRow.style.display = "block";
  pelatihan.forEach(p => {
    const div = document.createElement("div");
    div.innerHTML = `<label><input type="checkbox" name="pelatihan" value="${p.id}"> ${p.name} (Rp${p.price})</label>`;
    workshopsOptions.appendChild(div);
  });
}

// Validasi sebelum submit
document.getElementById("bookingForm").addEventListener("submit", e => {
  const checked = document.querySelectorAll("input[name=pelatihan]:checked").length;
  if (aturan.min > 0 && (checked < aturan.min || checked > aturan.max)) {
    e.preventDefault();
    alert(`Paket ini harus memilih antara ${aturan.min} hingga ${aturan.max} pelatihan.`);
  }
});
