// Di fungsi createOrderFromCheckout(), setelah saveCustomerOrder():
// Simpan ke database master
PANGSIT_DB.saveOrder(savedOrder);

// Di bagian inisialisasi, tambahkan real-time listener:
window.addEventListener('orderStatusUpdated', function(event) {
    const { orderId, newStatus } = event.detail;
    
    // Update tampilan customer
    const orderElement = document.querySelector(`[data-order="${orderId}"]`);
    if (orderElement) {
        const statusElement = orderElement.querySelector('.order-status');
        if (statusElement) {
            statusElement.className = `order-status ${getStatusClass(newStatus)}`;
            statusElement.textContent = getStatusText(newStatus);
            
            showNotification(`Status pesanan ${orderId} diperbarui: ${getStatusText(newStatus)}`);
        }
    }
});

// Tambahkan polling untuk cek update status
setInterval(() => {
    const orders = JSON.parse(localStorage.getItem('customerOrders')) || [];
    const masterOrders = PANGSIT_DB.getAllOrders();
    
    orders.forEach(customerOrder => {
        const masterOrder = masterOrders.find(m => m.id === customerOrder.id);
        if (masterOrder && masterOrder.status !== customerOrder.status) {
            customerOrder.status = masterOrder.status;
            localStorage.setItem('customerOrders', JSON.stringify(orders));
            renderCustomerOrders(); // Refresh tampilan
            
            // Dispatch event untuk update UI
            const event = new CustomEvent('orderStatusUpdated', {
                detail: { orderId: customerOrder.id, newStatus: masterOrder.status }
            });
            window.dispatchEvent(event);
        }
    });
}, 10000); // Cek setiap 10 detik