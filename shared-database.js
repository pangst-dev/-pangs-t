// ==================== DATABASE TERPUSAT ====================
// File ini menghubungkan website customer dan admin panel

const PANGSIT_DATABASE_KEY = 'pangsit_master_database';

// Fungsi untuk menyimpan pesanan (dipanggil dari customer website)
function saveOrderToMasterDatabase(orderData) {
    try {
        // Ambil database yang sudah ada
        let masterDB = JSON.parse(localStorage.getItem(PANGSIT_DATABASE_KEY)) || {
            orders: [],
            products: [],
            lastUpdated: Date.now()
        };
        
        // Tambahkan pesanan baru
        orderData.adminViewed = false; // Tanda belum dilihat admin
        orderData.updatedAt = new Date().toISOString();
        
        masterDB.orders.unshift(orderData); // Tambah di awal array
        
        // Simpan maksimal 100 pesanan terbaru
        if (masterDB.orders.length > 100) {
            masterDB.orders = masterDB.orders.slice(0, 100);
        }
        
        masterDB.lastUpdated = Date.now();
        localStorage.setItem(PANGSIT_DATABASE_KEY, JSON.stringify(masterDB));
        
        console.log('✅ Pesanan disimpan ke database master:', orderData.id);
        return true;
        
    } catch (error) {
        console.error('❌ Error menyimpan ke database:', error);
        return false;
    }
}

// Fungsi untuk mendapatkan semua pesanan (dipanggil dari admin panel)
function getAllOrdersFromDatabase() {
    try {
        const masterDB = JSON.parse(localStorage.getItem(PANGSIT_DATABASE_KEY)) || {
            orders: [],
            products: [],
            lastUpdated: Date.now()
        };
        
        // Urutkan berdasarkan yang terbaru
        const sortedOrders = [...masterDB.orders].sort((a, b) => 
            new Date(b.timestamp || b.date) - new Date(a.timestamp || a.date)
        );
        
        return sortedOrders;
        
    } catch (error) {
        console.error('❌ Error membaca database:', error);
        return [];
    }
}

// Fungsi untuk update status pesanan (dipanggil dari admin panel)
function updateOrderStatusInDatabase(orderId, newStatus) {
    try {
        let masterDB = JSON.parse(localStorage.getItem(PANGSIT_DATABASE_KEY)) || {
            orders: [],
            products: [],
            lastUpdated: Date.now()
        };
        
        // Cari dan update pesanan
        let orderUpdated = false;
        masterDB.orders = masterDB.orders.map(order => {
            if (order.id === orderId) {
                order.status = newStatus.toLowerCase();
                order.updatedAt = new Date().toISOString();
                order.adminViewed = true;
                orderUpdated = true;
            }
            return order;
        });
        
        if (orderUpdated) {
            masterDB.lastUpdated = Date.now();
            localStorage.setItem(PANGSIT_DATABASE_KEY, JSON.stringify(masterDB));
            
            // Juga update di data customer
            updateCustomerOrderStatus(orderId, newStatus);
            
            return true;
        }
        
        return false;
        
    } catch (error) {
        console.error('❌ Error update status:', error);
        return false;
    }
}

// Fungsi untuk update status di data customer
function updateCustomerOrderStatus(orderId, newStatus) {
    try {
        // Update di localStorage customer
        let customerOrders = JSON.parse(localStorage.getItem('customerOrders')) || [];
        customerOrders = customerOrders.map(order => {
            if (order.id === orderId) {
                order.status = newStatus.toLowerCase();
            }
            return order;
        });
        localStorage.setItem('customerOrders', JSON.stringify(customerOrders));
        
        // Dispatch event untuk real-time update
        const statusEvent = new CustomEvent('orderStatusUpdated', {
            detail: { orderId, newStatus }
        });
        window.dispatchEvent(statusEvent);
        
        return true;
        
    } catch (error) {
        console.error('❌ Error update customer order:', error);
        return false;
    }
}

// Fungsi untuk menandai pesanan sudah dilihat admin
function markOrderAsViewedByAdmin(orderId) {
    try {
        let masterDB = JSON.parse(localStorage.getItem(PANGSIT_DATABASE_KEY)) || { orders: [] };
        
        masterDB.orders = masterDB.orders.map(order => {
            if (order.id === orderId) {
                order.adminViewed = true;
            }
            return order;
        });
        
        localStorage.setItem(PANGSIT_DATABASE_KEY, JSON.stringify(masterDB));
        return true;
        
    } catch (error) {
        console.error('❌ Error mark as viewed:', error);
        return false;
    }
}

// Ekspor fungsi ke global scope
window.PANGSIT_DB = {
    saveOrder: saveOrderToMasterDatabase,
    getAllOrders: getAllOrdersFromDatabase,
    updateStatus: updateOrderStatusInDatabase,
    markAsViewed: markOrderAsViewedByAdmin,
    updateCustomerStatus: updateCustomerOrderStatus
};