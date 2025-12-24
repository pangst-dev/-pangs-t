// ==================== SISTEM EMAIL NOTIFIKASI ====================

// FUNGSI KIRIM EMAIL KE ADMIN
function kirimNotifikasiPesanan(orderData) {
    console.log("📧 Mengirim notifikasi pesanan:", orderData.id);
    
    // Data untuk email
    const subject = `PESANAN BARU - ${orderData.id}`;
    const body = `
PESANAN BARU - PANGS!T STORE
==============================

📋 ORDER ID: ${orderData.id}
🕐 WAKTU: ${orderData.date} ${orderData.time}

👤 PELANGGAN
Nama: ${orderData.customer.name}
Telepon: ${orderData.customer.phone}
Email: ${orderData.customer.email || "-"}
Alamat: ${orderData.customer.address}

💰 TOTAL: Rp ${orderData.total.toLocaleString()}

📦 ITEMS:
${orderData.products.map(p => `- ${p.name} x${p.quantity} = Rp ${(p.price * p.quantity).toLocaleString()}`).join('\n')}

🔗 LINK ADMIN: ${window.location.origin}/admin-panel.html?order=${orderData.id}
==============================
PANGS!T Store
Jl. Panongan, Tangerang
📞 0831-9524-3139
    `;
    
    // Buka email client
    const mailtoLink = `mailto:muhamadturmuzdi@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink, '_blank');
    
    // Tampilkan notifikasi
    alert("📧 Email notifikasi telah dibuka!\nSilakan kirim ke: muhamadturmuzdi@gmail.com");
    
    // Simpan juga untuk riwayat
    simpanRiwayatNotifikasi(orderData);
}

// SIMPAN RIWAYAT NOTIFIKASI
function simpanRiwayatNotifikasi(orderData) {
    const riwayat = JSON.parse(localStorage.getItem('email_notifications')) || [];
    riwayat.push({
        orderId: orderData.id,
        waktu: new Date().toLocaleString(),
        status: 'pending'
    });
    localStorage.setItem('email_notifications', JSON.stringify(riwayat));
}

// ==================== CARA PAKAI ====================

// TEMPATKAN INI SETELAH PESANAN DISIMPAN:
// Contoh: setelah saveCustomerOrder()

/*
// DI FUNGSI createOrderFromCheckout() ATAU SEJENISNYA:
const savedOrder = saveCustomerOrder(orderData);

if (savedOrder) {
    // KIRIM EMAIL NOTIFIKASI
    kirimNotifikasiPesanan(savedOrder);
    
    // ... kode lainnya ...
}
*/
