// Tambahkan di fungsi sendEmailToAdmin() di main.js
function sendEmailToAdmin(orderData) {
    // Buat URL khusus untuk admin panel dengan order ID
    const adminPanelUrl = `${window.location.origin}/admin-panel.html?order=${orderData.id}&focus=true`;
    
    const emailContent = `
        <h2>🚨 PESANAN BARU - PANGS!T STORE</h2>
        
        <div style="background:#fff3cd; border-left:4px solid #ffc107; padding:15px; margin:20px 0;">
            <strong>ORDER ID:</strong> ${orderData.id}<br>
            <strong>WAKTU:</strong> ${orderData.date} ${orderData.time}
        </div>
        
        <table style="width:100%; border-collapse:collapse;">
            <tr>
                <td style="padding:10px; background:#f8f9fa;"><strong>Pelanggan</strong></td>
                <td style="padding:10px;">${orderData.customer.name}</td>
            </tr>
            <tr>
                <td style="padding:10px; background:#f8f9fa;"><strong>Telepon</strong></td>
                <td style="padding:10px;">${orderData.customer.phone}</td>
            </tr>
            <tr>
                <td style="padding:10px; background:#f8f9fa;"><strong>Alamat</strong></td>
                <td style="padding:10px;">${orderData.customer.address}</td>
            </tr>
            <tr>
                <td style="padding:10px; background:#f8f9fa;"><strong>Total</strong></td>
                <td style="padding:10px; color:#ff6b35; font-weight:bold;">
                    Rp ${orderData.total.toLocaleString()}
                </td>
            </tr>
        </table>
        
        <div style="margin:30px 0; text-align:center;">
            <a href="${adminPanelUrl}" 
               style="background:#ff6b35; color:white; padding:15px 30px; 
                      text-decoration:none; border-radius:8px; font-size:16px;
                      display:inline-block;">
                📋 BUKA ADMIN PANEL UNTUK UPDATE STATUS
            </a>
        </div>
        
        <div style="background:#e8f5e9; padding:15px; border-radius:5px; margin-top:20px;">
            <strong>📝 Cara Update Status:</strong>
            <ol style="margin:10px 0; padding-left:20px;">
                <li>Klik tombol di atas untuk buka Admin Panel</li>
                <li>Cari pesanan dengan ID: <code>${orderData.id}</code></li>
                <li>Klik "Update Status" dan pilih status baru</li>
                <li>Customer akan otomatis melihat perubahan status</li>
            </ol>
        </div>
        
        <hr style="margin:30px 0;">
        
        <div style="font-size:12px; color:#666; text-align:center;">
            PANGS!T Store - Jl.panongan desa panongan kec panongan kabupaten tangerang<br>
            Telepon: +62 831-9524-3139 | Email: sitirusmi54@gmail.com
        </div>
    `;
    
    // Kirim email menggunakan Email API (Mailtrap, dll)
    // ... kode pengiriman email ...
}
