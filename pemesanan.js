document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const paketId = urlParams.get("paket");

  // DOM Elements
  const paketTitleEl = document.getElementById("paketTitle");
  const paketPriceEl = document.getElementById("paketPrice");
  const workshopsRow = document.getElementById("workshopsRow");
  const workshopsOptions = document.getElementById("workshopsOptions");
  const workshopRuleEl = document.getElementById("workshopRule");
  const visitDateEl = document.getElementById("visitDate");
  const numPeopleEl = document.getElementById("numPeople");
  const totalPriceDisplayEl = document.getElementById("totalPriceDisplay");
  const bookingForm = document.getElementById("bookingForm");

  // Data Paket & Pelatihan
  const paketData = {
    halfday: { name: "Kunjungan Edukasi (Halfday)", price: 25000, min: 0, max: 0 },
    fullday: { name: "Fullday (Tanpa Menginap)", price: 125000, min: 2, max: 3 },
    menginap: { name: "2 Hari 1 Malam (Fullday + Menginap)", price: 145000, min: 2, max: 2 }, // Sudah termasuk 2 pelatihan
    minat: { name: "Minat Khusus", price: 25000, min: 1, max: 1 } // Harga dasar halfday + 1 pelatihan
  };

  const pelatihanData = [
    { id: "galon", name: "Melukis Pot dari Galon", price: 15000 },
    { id: "topeng", name: "Melukis Topeng", price: 20000 },
    { id: "kresek", name: "Membuat Bunga dari Kresek", price: 13000 },
    { id: "pot", name: "Membuat Pot dari Kain Bekas", price: 27500 },
    { id: "ecobrick", name: "Membuat Ecobrick", price: 7000 },
    { id: "lilin", name: "Membuat Lilin Aroma Terapi Jelantah", price: 16000 }
  ];

  const currentPaket = paketData[paketId];
  if (!currentPaket) {
    window.location.href = "index.html"; // Redirect jika paket tidak valid
    return;
  }

  // Inisialisasi Halaman
  paketTitleEl.textContent = currentPaket.name;
  paketPriceEl.textContent = `Rp${currentPaket.price.toLocaleString('id-ID')}`;
  
  // Tampilkan pilihan pelatihan jika diperlukan
  if (currentPaket.min > 0) {
    workshopsRow.style.display = "block";
    workshopRuleEl.textContent = `Pilih antara ${currentPaket.min} hingga ${currentPaket.max} pelatihan.`;
    pelatihanData.forEach(p => {
      const div = document.createElement("div");
      div.className = "checkbox-item";
      div.innerHTML = `<label><input type="checkbox" name="pelatihan" value="${p.id}" data-price="${p.price}"> ${p.name} (Rp${p.price.toLocaleString('id-ID')})</label>`;
      workshopsOptions.appendChild(div);
    });
  }

  // Kalkulasi Total Harga
  function calculateTotal() {
    const numPeople = parseInt(numPeopleEl.value) || 0;
    let basePrice = currentPaket.price;
    let workshopPrice = 0;

    const checkedWorkshops = document.querySelectorAll("input[name=pelatihan]:checked");
    checkedWorkshops.forEach(checkbox => {
      workshopPrice += parseInt(checkbox.dataset.price);
    });

    // Paket "Menginap" sudah termasuk 2 pelatihan, jadi jangan ditambahkan lagi harganya
    let totalPerPerson;
    if (paketId === 'menginap') {
      totalPerPerson = basePrice; // Harga sudah final
    } else {
      totalPerPerson = basePrice + workshopPrice;
    }

    const total = totalPerPerson * numPeople;
    totalPriceDisplayEl.textContent = `Rp${total.toLocaleString('id-ID')}`;
  }

  // Event Listeners
  numPeopleEl.addEventListener("input", calculateTotal);
  workshopsOptions.addEventListener("change", calculateTotal);
  
  // Form Submission
  bookingForm.addEventListener("submit", e => {
    e.preventDefault();

    const numPeople = parseInt(numPeopleEl.value);
  if (numPeople < 10) {
    alert("Pemesanan rombongan minimal 10 orang.");
    return; // Hentikan proses jika kurang dari 10 orang
  }
  
    const checkedCount = document.querySelectorAll("input[name=pelatihan]:checked").length;

    if (currentPaket.min > 0 && (checkedCount < currentPaket.min || checkedCount > currentPaket.max)) {
      alert(`Untuk paket ini, Anda harus memilih antara ${currentPaket.min} hingga ${currentPaket.max} pelatihan.`);
      return;
    }
    
    // Simpan data ke localStorage untuk dibawa ke halaman pembayaran
    const selectedWorkshops = Array.from(document.querySelectorAll("input[name=pelatihan]:checked")).map(cb => {
        return {
            id: cb.value,
            name: cb.parentElement.textContent.trim(),
            price: parseInt(cb.dataset.price)
        };
    });

    const bookingDetails = {
      paketName: currentPaket.name,
      visitDate: visitDateEl.value,
      numPeople: numPeopleEl.value,
      totalPrice: totalPriceDisplayEl.textContent,
      selectedWorkshops: selectedWorkshops
    };
    
    localStorage.setItem('bookingDetails', JSON.stringify(bookingDetails));
    window.location.href = 'form-pembayaran.html';
  });
  
  // Kalkulasi awal
  calculateTotal();
});