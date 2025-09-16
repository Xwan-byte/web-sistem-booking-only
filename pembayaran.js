document.addEventListener("DOMContentLoaded", () => {
    const summaryContentEl = document.getElementById("summaryContent");
    const summaryTotalEl = document.getElementById("summaryTotal");
    const paymentForm = document.getElementById("paymentForm");

    // Ambil data dari localStorage
    const bookingDetails = JSON.parse(localStorage.getItem('bookingDetails'));

    if (!bookingDetails) {
        alert("Data pemesanan tidak ditemukan. Anda akan diarahkan kembali ke halaman utama.");
        window.location.href = "index.html";
        return;
    }

    // Tampilkan ringkasan pesanan
    let workshopListHTML = '';
    if (bookingDetails.selectedWorkshops && bookingDetails.selectedWorkshops.length > 0) {
        workshopListHTML += '<ul>';
        bookingDetails.selectedWorkshops.forEach(ws => {
            workshopListHTML += `<li>${ws.name}</li>`;
        });
        workshopListHTML += '</ul>';
    } else {
        workshopListHTML = '<p>Tidak ada pelatihan tambahan.</p>';
    }

    summaryContentEl.innerHTML = `
        <p><strong>Paket:</strong> ${bookingDetails.paketName}</p>
        <p><strong>Tanggal:</strong> ${bookingDetails.visitDate}</p>
        <p><strong>Jumlah:</strong> ${bookingDetails.numPeople} orang</p>
        <p><strong>Pelatihan Dipilih:</strong></p>
        ${workshopListHTML}
    `;
    summaryTotalEl.textContent = bookingDetails.totalPrice;

    // Handle submit form pembayaran
    paymentForm.addEventListener("submit", e => {
        e.preventDefault();
        
        // Simpan info pembayaran (opsional)
        const paymentInfo = {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            whatsapp: document.getElementById('whatsapp').value,
            method: document.querySelector('input[name="paymentMethod"]:checked').value
        };
        localStorage.setItem('paymentInfo', JSON.stringify(paymentInfo));

        // Redirect ke halaman sukses
        window.location.href = 'form-berhasil.html';
    });
});