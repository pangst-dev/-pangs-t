// File: database.js
// Simpan file ini di folder yang sama dengan index.html

// ==================== KONFIGURASI DATABASE ====================
const DATABASE_NAME = "pangsit_database";
const TABLES = {
    PRODUCTS: 'products',
    ORDERS: 'orders',
    CUSTOMERS: 'customers',
    SETTINGS: 'settings',
    CATEGORIES: 'categories',
    PAYMENTS: 'payments'
};

// ==================== INISIALISASI DATABASE ====================
function initDatabase() {
    console.log("🔄 Menginisialisasi database PANGS!T...");
    
    // Cek apakah database sudah ada
    if (!localStorage.getItem(DATABASE_NAME)) {
        // Buat struktur database baru
        const database = {
            version: "1.0",
            last_updated: new Date().toISOString(),
            tables: {}
        };
        
        // Inisialisasi semua tabel
        database.tables[TABLES.PRODUCTS] = getDefaultProducts();
        database.tables[TABLES.ORDERS] = [];
        database.tables[TABLES.CUSTOMERS] = [];
        database.tables[TABLES.SETTINGS] = getDefaultSettings();
        database.tables[TABLES.CATEGORIES] = getDefaultCategories();
        database.tables[TABLES.PAYMENTS] = [];
        
        // Simpan ke localStorage
        localStorage.setItem(DATABASE_NAME, JSON.stringify(database));
        console.log("✅ Database berhasil dibuat!");
    } else {
        console.log("✅ Database sudah ada, melanjutkan...");
    }
    
    // Migrasi data lama jika ada
    migrateOldData();
    
    return getDatabase();
}

// ==================== FUNGSI UTAMA DATABASE ====================
function getDatabase() {
    const db = localStorage.getItem(DATABASE_NAME);
    return db ? JSON.parse(db) : null;
}

function saveDatabase(database) {
    database.last_updated = new Date().toISOString();
    localStorage.setItem(DATABASE_NAME, JSON.stringify(database));
    console.log("💾 Database disimpan:", new Date().toLocaleString());
}

function getTable(tableName) {
    const db = getDatabase();
    return db ? db.tables[tableName] : [];
}

function saveToTable(tableName, data) {
    const db = getDatabase();
    if (!db) return false;
    
    db.tables[tableName] = data;
    saveDatabase(db);
    return true;
}

// ==================== DATA DEFAULT ====================
function getDefaultProducts() {
    return [
        {
            id: 1,
            name: "fire silk wonton",
            price: 20000,
            image: "foto/fire silk wonton.jpg",
            description: "Kesan: lembut, pedas aromatik, classy dengan minyak cabai khas Asia.",
            details: "Kesan: lembut, pedas aromatik, classy dengan minyak cabai khas Asia.",
            category: "pedas",
            stock: 50,
            sold: 0,
            status: "active",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        {
            id: 2,
            name: "crispy melt deluxe",
            price: 13000,
            image: "foto/crispy melt deluxe.jpg",
            description: "Kesan: garing di luar, lembut & creamy di dalam.",
            details: "Kesan: garing di luar, lembut & creamy di dalam.",
            category: "original",
            stock: 45,
            sold: 0,
            status: "active",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        {
            id: 3,
            name: "Golden chili crunch",
            price: 15000,
            image: "foto/Golden chili crunch.jpg",
            description: "Kesan: renyah, gurih dengan sentuhan manis-pedas saus khas.",
            details: "Kesan: renyah, gurih dengan sentuhan manis-pedas saus khas.",
            category: "pedas",
            stock: 60,
            sold: 0,
            status: "active",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        {
            id: 4,
            name: "bila bila ayam pangsit",
            price: 10000,
            image: "foto/bils bila ayam pangsit.jpg",
            description: "Isi ayam lembut dengan bumbu bawang, merica, dan sedikit sayuran—rasa gurih klasik seperti pangsit ayam pada umumnya.",
            details: "Isi ayam lembut dengan bumbu bawang, merica, dan sedikit sayuran—rasa gurih klasik seperti pangsit ayam pada umumnya.",
            category: "ayam isi 4",
            stock: 75,
            sold: 0,
            status: "active",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        {
            id: 5,
            name: "pangsit kuah mercon",
            price: 20000,
            image: "foto/pangsit kuah mercon.jpg",
            description: "Cocok untuk pangsit kuah. Menggunakan cabai rawit, sambal mercon, dan bumbu pedas gurih.",
            details: "Cocok untuk pangsit kuah. Menggunakan cabai rawit, sambal mercon, dan bumbu pedas gurih.",
            category: "pedas",
            stock: 40,
            sold: 0,
            status: "active",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        {
            id: 6,
            name: "pangsit isi tahu",
            price: 15000,
            image: "foto/pangsit isi tahu.jpg",
            description: "Pangsit goreng dengan isian udang utuh yang segar.",
            details: "Setiap pangsit berisi udang utuh pilihan dengan bumbu spesial. Sangat cocok untuk pecinta seafood.",
            category: "udang",
            stock: 55,
            sold: 0,
            status: "active",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        }
    ];
}

function getDefaultCategories() {
    return [
        { id: 1, name: "pedas", description: "Produk dengan rasa pedas", product_count: 3, status: "active" },
        { id: 2, name: "original", description: "Produk dengan rasa original", product_count: 1, status: "active" },
        { id: 3, name: "ayam isi 4", description: "Pangsit isi ayam", product_count: 1, status: "active" },
        { id: 4, name: "udang", description: "Produk dengan isian udang", product_count: 1, status: "active" },
        { id: 5, name: "spesial", description: "Produk spesial", product_count: 0, status: "inactive" }
    ];
}

function getDefaultSettings() {
    return {
        store_name: "PANGS!T",
        store_address: "Jl.panongan desa panongan kec panongan kabupaten tangerang",
        store_phone: "+62 831-9524-3139",
        store_email: "sitirusmi54@gmail.com",
        store_hours: "Senin - Minggu: 10:00 - 21:00 WIB",
        shipping_cost: 15000,
        tax_rate: 0.1,
        payment_methods: ["qris", "gopay", "ovo", "dana", "bank_transfer"],
        bank_accounts: {
            bca: { name: "PANGS!T STORE", number: "1234567890" },
            mandiri: { name: "PANGS!T STORE", number: "0987654321" },
            bni: { name: "PANGS!T STORE", number: "1122334455" },
            bri: { name: "PANGS!T STORE", number: "5566778899" }
        },
        social_media: {
            instagram: "",
            facebook: "",
            twitter: "",
            tiktok: ""
        }
    };
}

// ==================== MIGRASI DATA LAMA ====================
function migrateOldData() {
    console.log("🔄 Migrasi data lama...");
    
    // Migrasi produk
    const oldProducts = JSON.parse(localStorage.getItem('products')) || [];
    if (oldProducts.length > 0) {
        const db = getDatabase();
        db.tables[TABLES.PRODUCTS] = oldProducts.map(p => ({
            ...p,
            stock: p.stock || 50,
            sold: p.sold || 0,
            status: "active",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        }));
        saveDatabase(db);
        localStorage.removeItem('products');
        console.log("✅ Produk lama dimigrasi");
    }
    
    // Migrasi pesanan
    const oldOrders = JSON.parse(localStorage.getItem('customerOrders')) || [];
    if (oldOrders.length > 0) {
        const db = getDatabase();
        db.tables[TABLES.ORDERS] = oldOrders.map(o => ({
            ...o,
            customer_id: generateCustomerId(o.customer),
            notes: o.notes || "",
            payment_status: "pending",
            shipping_status: "pending",
            created_at: o.timestamp ? new Date(o.timestamp).toISOString() : new Date().toISOString(),
            updated_at: new Date().toISOString()
        }));
        saveDatabase(db);
        console.log("✅ Pesanan lama dimigrasi");
    }
}

function generateCustomerId(customer) {
    return 'CUST-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

// ==================== CRUD OPERATIONS ====================

// === PRODUCTS ===
function getAllProducts() {
    return getTable(TABLES.PRODUCTS);
}

function getProductById(id) {
    const products = getAllProducts();
    return products.find(p => p.id === id);
}

function addProduct(product) {
    const products = getAllProducts();
    
    // Generate ID baru
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    
    const newProduct = {
        ...product,
        id: newId,
        stock: product.stock || 0,
        sold: 0,
        status: product.status || "active",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };
    
    products.push(newProduct);
    saveToTable(TABLES.PRODUCTS, products);
    
    return newProduct;
}

function updateProduct(id, updates) {
    const products = getAllProducts();
    const index = products.findIndex(p => p.id === id);
    
    if (index === -1) return false;
    
    products[index] = {
        ...products[index],
        ...updates,
        updated_at: new Date().toISOString()
    };
    
    saveToTable(TABLES.PRODUCTS, products);
    return true;
}

function deleteProduct(id) {
    const products = getAllProducts();
    const filteredProducts = products.filter(p => p.id !== id);
    return saveToTable(TABLES.PRODUCTS, filteredProducts);
}

// === ORDERS ===
function getAllOrders() {
    return getTable(TABLES.ORDERS);
}

function getOrderById(orderId) {
    const orders = getAllOrders();
    return orders.find(o => o.id === orderId);
}

function addOrder(orderData) {
    const orders = getAllOrders();
    
    // Generate ID jika belum ada
    if (!orderData.id) {
        orderData.id = generateOrderId();
    }
    
    const newOrder = {
        ...orderData,
        payment_status: orderData.payment_status || "pending",
        shipping_status: orderData.shipping_status || "pending",
        status: orderData.status || "pending",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };
    
    orders.push(newOrder);
    
    // Update stok produk
    orderData.products.forEach(item => {
        const product = getProductById(item.product_id || item.id);
        if (product) {
            updateProduct(product.id, {
                stock: Math.max(0, product.stock - item.quantity),
                sold: product.sold + item.quantity
            });
        }
    });
    
    // Simpan customer jika baru
    saveCustomer(orderData.customer);
    
    saveToTable(TABLES.ORDERS, orders);
    
    // Simpan pembayaran
    addPayment({
        order_id: newOrder.id,
        amount: newOrder.total,
        method: newOrder.paymentMethod,
        status: "pending",
        created_at: new Date().toISOString()
    });
    
    return newOrder;
}

function updateOrder(orderId, updates) {
    const orders = getAllOrders();
    const index = orders.findIndex(o => o.id === orderId);
    
    if (index === -1) return false;
    
    orders[index] = {
        ...orders[index],
        ...updates,
        updated_at: new Date().toISOString()
    };
    
    saveToTable(TABLES.ORDERS, orders);
    
    // Update pembayaran jika status berubah
    if (updates.payment_status) {
        const payments = getAllPayments();
        const paymentIndex = payments.findIndex(p => p.order_id === orderId);
        if (paymentIndex !== -1) {
            payments[paymentIndex].status = updates.payment_status;
            saveToTable(TABLES.PAYMENTS, payments);
        }
    }
    
    return true;
}

function generateOrderId() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const random = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
    return `PANG-${year}${month}${day}-${hours}${minutes}${seconds}-${random}`;
}

// === CUSTOMERS ===
function getAllCustomers() {
    return getTable(TABLES.CUSTOMERS);
}

function saveCustomer(customerData) {
    const customers = getAllCustomers();
    
    // Cek apakah customer sudah ada berdasarkan email atau telepon
    const existingCustomer = customers.find(c => 
        c.email === customerData.email || c.phone === customerData.phone
    );
    
    if (existingCustomer) {
        // Update data customer
        const index = customers.findIndex(c => c.id === existingCustomer.id);
        customers[index] = {
            ...existingCustomer,
            ...customerData,
            total_orders: existingCustomer.total_orders + 1,
            total_spent: existingCustomer.total_spent + (customerData.total || 0),
            updated_at: new Date().toISOString()
        };
    } else {
        // Customer baru
        const newCustomer = {
            id: generateCustomerId(customerData),
            ...customerData,
            total_orders: 1,
            total_spent: customerData.total || 0,
            first_order_date: new Date().toISOString(),
            last_order_date: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        customers.push(newCustomer);
    }
    
    saveToTable(TABLES.CUSTOMERS, customers);
}

// === PAYMENTS ===
function getAllPayments() {
    return getTable(TABLES.PAYMENTS);
}

function addPayment(paymentData) {
    const payments = getAllPayments();
    payments.push({
        id: 'PAY-' + Date.now(),
        ...paymentData
    });
    saveToTable(TABLES.PAYMENTS, payments);
}

// === SETTINGS ===
function getSettings() {
    return getTable(TABLES.SETTINGS);
}

function updateSettings(updates) {
    const settings = getSettings();
    const updatedSettings = { ...settings, ...updates };
    saveToTable(TABLES.SETTINGS, updatedSettings);
    return updatedSettings;
}

// === STATISTICS ===
function getStatistics() {
    const orders = getAllOrders();
    const products = getAllProducts();
    const customers = getAllCustomers();
    
    const today = new Date().toDateString();
    const todayOrders = orders.filter(o => 
        new Date(o.created_at).toDateString() === today
    );
    
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const todayRevenue = todayOrders.reduce((sum, order) => sum + order.total, 0);
    
    return {
        total_orders: orders.length,
        total_customers: customers.length,
        total_products: products.length,
        total_revenue: totalRevenue,
        today_orders: todayOrders.length,
        today_revenue: todayRevenue,
        pending_orders: orders.filter(o => o.status === 'pending').length,
        processing_orders: orders.filter(o => o.status === 'processing').length,
        popular_products: products
            .sort((a, b) => b.sold - a.sold)
            .slice(0, 5)
            .map(p => ({ name: p.name, sold: p.sold }))
    };
}

// ==================== BACKUP & RESTORE ====================
function backupDatabase() {
    const db = getDatabase();
    const backup = {
        ...db,
        backup_date: new Date().toISOString(),
        backup_type: "manual"
    };
    
    // Simpan backup ke localStorage terpisah
    const backupKey = DATABASE_NAME + '_backup_' + Date.now();
    localStorage.setItem(backupKey, JSON.stringify(backup));
    
    // Simpan ke file (untuk download)
    const dataStr = JSON.stringify(backup, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `pangsit_backup_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    return { success: true, filename: exportFileDefaultName, key: backupKey };
}

function restoreDatabase(backupData) {
    try {
        // Validasi backup data
        if (!backupData || !backupData.tables || !backupData.version) {
            throw new Error("Format backup tidak valid");
        }
        
        // Simpan ke localStorage
        localStorage.setItem(DATABASE_NAME, JSON.stringify(backupData));
        
        // Reload halaman
        setTimeout(() => {
            alert("Database berhasil direstore! Halaman akan dimuat ulang.");
            location.reload();
        }, 1000);
        
        return { success: true };
    } catch (error) {
        console.error("Error restoring database:", error);
        return { success: false, error: error.message };
    }
}

function importFromFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            try {
                const backupData = JSON.parse(e.target.result);
                const result = restoreDatabase(backupData);
                resolve(result);
            } catch (error) {
                reject(new Error("File tidak valid: " + error.message));
            }
        };
        
        reader.onerror = function() {
            reject(new Error("Gagal membaca file"));
        };
        
        reader.readAsText(file);
    });
}

// ==================== EKSPOR KE EXCEL/CSV ====================
function exportToCSV(tableName) {
    const data = getTable(tableName);
    
    if (data.length === 0) {
        return null;
    }
    
    // Ambil semua field yang ada
    const fields = Object.keys(data[0]);
    
    // Buat header
    let csv = fields.join(',') + '\n';
    
    // Tambahkan data
    data.forEach(row => {
        const values = fields.map(field => {
            const value = row[field];
            
            // Handle nilai yang kompleks
            if (typeof value === 'object' && value !== null) {
                return JSON.stringify(value).replace(/,/g, ';');
            }
            
            // Escape koma dan quotes
            const stringValue = String(value || '');
            return stringValue.includes(',') ? `"${stringValue}"` : stringValue;
        });
        
        csv += values.join(',') + '\n';
    });
    
    // Buat file untuk download
    const filename = `pangsit_${tableName}_${new Date().toISOString().split('T')[0]}.csv`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return filename;
}

// ==================== INISIALISASI OTOMATIS ====================
// Jalankan inisialisasi saat file dimuat
document.addEventListener('DOMContentLoaded', function() {
    initDatabase();
    console.log("🚀 Database PANGS!T siap digunakan!");
    
    // Ekspor fungsi ke window untuk akses global
    window.PangsitDB = {
        // Database functions
        init: initDatabase,
        get: getDatabase,
        backup: backupDatabase,
        restore: restoreDatabase,
        import: importFromFile,
        exportCSV: exportToCSV,
        
        // Table functions
        getTable: getTable,
        
        // Products
        getProducts: getAllProducts,
        getProduct: getProductById,
        addProduct: addProduct,
        updateProduct: updateProduct,
        deleteProduct: deleteProduct,
        
        // Orders
        getOrders: getAllOrders,
        getOrder: getOrderById,
        addOrder: addOrder,
        updateOrder: updateOrder,
        
        // Customers
        getCustomers: getAllCustomers,
        
        // Payments
        getPayments: getAllPayments,
        
        // Settings
        getSettings: getSettings,
        updateSettings: updateSettings,
        
        // Statistics
        getStats: getStatistics,
        
        // Constants
        TABLES: TABLES
    };
});

// ==================== ADMIN DASHBOARD INTEGRATION ====================
// Kode untuk admin dashboard
function createAdminDashboard() {
    if (!document.getElementById('adminDashboard')) {
        const dashboardHTML = `
            <div id="adminDashboard" style="
                position: fixed;
                top: 10px;
                right: 10px;
                z-index: 9999;
                background: #2d3047;
                color: white;
                padding: 10px 15px;
                border-radius: 5px;
                font-size: 12px;
                cursor: pointer;
                box-shadow: 0 2px 10px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                gap: 8px;
            ">
                <i class="fas fa-database"></i>
                <span>Admin DB</span>
            </div>
        `;
        
        const div = document.createElement('div');
        div.innerHTML = dashboardHTML;
        document.body.appendChild(div);
        
        // Event listener untuk membuka admin panel
        div.querySelector('#adminDashboard').addEventListener('click', function() {
            openAdminPanel();
        });
    }
}

function openAdminPanel() {
    const adminHTML = `
        <div id="adminPanelOverlay" style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            z-index: 10000;
            display: flex;
            justify-content: center;
            align-items: center;
        ">
            <div style="
                background: white;
                width: 90%;
                max-width: 800px;
                max-height: 90vh;
                border-radius: 10px;
                overflow: hidden;
                display: flex;
                flex-direction: column;
            ">
                <div style="
                    background: #2d3047;
                    color: white;
                    padding: 20px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                ">
                    <h3 style="margin: 0;">
                        <i class="fas fa-database"></i> Database Admin PANGS!T
                    </h3>
                    <button onclick="document.getElementById('adminPanelOverlay').remove()" style="
                        background: none;
                        border: none;
                        color: white;
                        font-size: 24px;
                        cursor: pointer;
                    ">
                        &times;
                    </button>
                </div>
                
                <div style="
                    padding: 20px;
                    overflow-y: auto;
                    flex-grow: 1;
                ">
                    <div id="adminPanelContent">
                        <!-- Konten akan diisi oleh JavaScript -->
                        <div style="text-align: center; padding: 40px;">
                            <i class="fas fa-spinner fa-spin fa-2x"></i>
                            <p>Memuat data...</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const overlay = document.createElement('div');
    overlay.innerHTML = adminHTML;
    document.body.appendChild(overlay);
    
    // Load admin panel content
    setTimeout(() => {
        loadAdminPanelContent();
    }, 500);
}

function loadAdminPanelContent() {
    const contentDiv = document.getElementById('adminPanelContent');
    if (!contentDiv) return;
    
    const stats = window.PangsitDB.getStats();
    
    contentDiv.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-bottom: 20px;">
            <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; text-align: center;">
                <div style="font-size: 24px; font-weight: bold; color: #1976d2;">${stats.total_orders}</div>
                <div style="font-size: 12px; color: #555;">Total Pesanan</div>
            </div>
            <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; text-align: center;">
                <div style="font-size: 24px; font-weight: bold; color: #7b1fa2;">${stats.total_customers}</div>
                <div style="font-size: 12px; color: #555;">Pelanggan</div>
            </div>
            <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; text-align: center;">
                <div style="font-size: 24px; font-weight: bold; color: #388e3c;">Rp ${stats.total_revenue.toLocaleString()}</div>
                <div style="font-size: 12px; color: #555;">Total Pendapatan</div>
            </div>
            <div style="background: #fff3e0; padding: 15px; border-radius: 8px; text-align: center;">
                <div style="font-size: 24px; font-weight: bold; color: #f57c00;">${stats.today_orders}</div>
                <div style="font-size: 12px; color: #555;">Pesanan Hari Ini</div>
            </div>
        </div>
        
        <div style="display: flex; gap: 10px; margin-bottom: 20px;">
            <button onclick="adminShowTable('${TABLES.ORDERS}')" style="
                padding: 10px 15px;
                background: #2d3047;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                flex: 1;
            ">
                <i class="fas fa-shopping-cart"></i> Pesanan
            </button>
            <button onclick="adminShowTable('${TABLES.PRODUCTS}')" style="
                padding: 10px 15px;
                background: #ff6b35;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                flex: 1;
            ">
                <i class="fas fa-drumstick-bite"></i> Produk
            </button>
            <button onclick="adminShowTable('${TABLES.CUSTOMERS}')" style="
                padding: 10px 15px;
                background: #28a745;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                flex: 1;
            ">
                <i class="fas fa-users"></i> Pelanggan
            </button>
        </div>
        
        <div style="display: flex; gap: 10px; margin-bottom: 20px;">
            <button onclick="window.PangsitDB.backup()" style="
                padding: 10px 15px;
                background: #17a2b8;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            ">
                <i class="fas fa-download"></i> Backup
            </button>
            <button onclick="adminShowImport()" style="
                padding: 10px 15px;
                background: #6c757d;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            ">
                <i class="fas fa-upload"></i> Restore
            </button>
        </div>
        
        <div id="adminTableContent" style="
            margin-top: 20px;
            border: 1px solid #eee;
            border-radius: 8px;
            padding: 15px;
            max-height: 300px;
            overflow-y: auto;
        ">
            <p style="text-align: center; color: #666;">Pilih menu di atas untuk melihat data</p>
        </div>
    `;
}

// Fungsi untuk menampilkan tabel di admin panel
function adminShowTable(tableName) {
    const data = window.PangsitDB.getTable(tableName);
    const tableContent = document.getElementById('adminTableContent');
    
    if (data.length === 0) {
        tableContent.innerHTML = `<p style="text-align: center; color: #666;">Tidak ada data di tabel ${tableName}</p>`;
        return;
    }
    
    let html = `<h4 style="color: #2d3047; margin-bottom: 15px;">${tableName.toUpperCase()} (${data.length} data)</h4>`;
    
    if (tableName === TABLES.ORDERS) {
        html += `
            <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
                <thead>
                    <tr style="background: #f5f5f5;">
                        <th style="padding: 8px; border: 1px solid #ddd;">ID</th>
                        <th style="padding: 8px; border: 1px solid #ddd;">Customer</th>
                        <th style="padding: 8px; border: 1px solid #ddd;">Total</th>
                        <th style="padding: 8px; border: 1px solid #ddd;">Status</th>
                        <th style="padding: 8px; border: 1px solid #ddd;">Tanggal</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.slice(0, 10).map(order => `
                        <tr>
                            <td style="padding: 8px; border: 1px solid #ddd;">${order.id.substring(0, 10)}...</td>
                            <td style="padding: 8px; border: 1px solid #ddd;">${order.customer?.name || 'N/A'}</td>
                            <td style="padding: 8px; border: 1px solid #ddd;">Rp ${order.total?.toLocaleString() || 0}</td>
                            <td style="padding: 8px; border: 1px solid #ddd;">
                                <span style="
                                    padding: 3px 8px;
                                    border-radius: 12px;
                                    font-size: 11px;
                                    background: ${order.status === 'pending' ? '#fff3cd' : 
                                               order.status === 'processing' ? '#cce5ff' : 
                                               order.status === 'delivered' ? '#d4edda' : '#f8d7da'};
                                    color: ${order.status === 'pending' ? '#856404' : 
                                            order.status === 'processing' : '#004085' : 
                                            order.status === 'delivered' ? '#155724' : '#721c24'};
                                ">
                                    ${order.status || 'pending'}
                                </span>
                            </td>
                            <td style="padding: 8px; border: 1px solid #ddd;">${order.date || ''}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } else if (tableName === TABLES.PRODUCTS) {
        html += `
            <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
                <thead>
                    <tr style="background: #f5f5f5;">
                        <th style="padding: 8px; border: 1px solid #ddd;">Nama</th>
                        <th style="padding: 8px; border: 1px solid #ddd;">Harga</th>
                        <th style="padding: 8px; border: 1px solid #ddd;">Stok</th>
                        <th style="padding: 8px; border: 1px solid #ddd;">Terjual</th>
                        <th style="padding: 8px; border: 1px solid #ddd;">Kategori</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.map(product => `
                        <tr>
                            <td style="padding: 8px; border: 1px solid #ddd;">${product.name}</td>
                            <td style="padding: 8px; border: 1px solid #ddd;">Rp ${product.price.toLocaleString()}</td>
                            <td style="padding: 8px; border: 1px solid #ddd;">${product.stock}</td>
                            <td style="padding: 8px; border: 1px solid #ddd;">${product.sold}</td>
                            <td style="padding: 8px; border: 1px solid #ddd;">${product.category}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } else {
        // Tampilkan data dalam format JSON sederhana untuk tabel lain
        html += `<pre style="font-size: 11px; background: #f8f9fa; padding: 10px; border-radius: 5px; max-height: 200px; overflow-y: auto;">${JSON.stringify(data.slice(0, 5), null, 2)}</pre>`;
    }
    
    tableContent.innerHTML = html;
}

function adminShowImport() {
    const tableContent = document.getElementById('adminTableContent');
    tableContent.innerHTML = `
        <div style="text-align: center; padding: 20px;">
            <h4 style="color: #2d3047; margin-bottom: 15px;">Restore Database</h4>
            <p style="color: #666; margin-bottom: 20px;">Pilih file backup (.json) untuk restore database</p>
            
            <div style="
                border: 2px dashed #ccc;
                border-radius: 10px;
                padding: 30px;
                margin-bottom: 20px;
                cursor: pointer;
            " id="dropZone" onclick="document.getElementById('fileInput').click()">
                <i class="fas fa-cloud-upload-alt" style="font-size: 48px; color: #ccc; margin-bottom: 10px;"></i>
                <p style="color: #666;">Klik untuk pilih file atau drop file di sini</p>
                <input type="file" id="fileInput" accept=".json" style="display: none;" onchange="handleFileSelect(this)">
            </div>
            
            <div id="importStatus" style="margin-top: 15px;"></div>
            
            <p style="font-size: 12px; color: #999; margin-top: 20px;">
                <i class="fas fa-exclamation-triangle"></i> 
                Restore akan mengganti semua data yang ada. Pastikan sudah backup terlebih dahulu.
            </p>
        </div>
    `;
    
    // Setup drag and drop
    const dropZone = document.getElementById('dropZone');
    
    dropZone.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.stopPropagation();
        dropZone.style.borderColor = '#007bff';
        dropZone.style.background = '#f0f8ff';
    });
    
    dropZone.addEventListener('dragleave', function(e) {
        e.preventDefault();
        e.stopPropagation();
        dropZone.style.borderColor = '#ccc';
        dropZone.style.background = 'white';
    });
    
    dropZone.addEventListener('drop', function(e) {
        e.preventDefault();
        e.stopPropagation();
        dropZone.style.borderColor = '#ccc';
        dropZone.style.background = 'white';
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileSelect({ files: files });
        }
    });
}

function handleFileSelect(input) {
    const file = input.files[0];
    if (!file) return;
    
    const statusDiv = document.getElementById('importStatus');
    statusDiv.innerHTML = `<p style="color: #17a2b8;"><i class="fas fa-spinner fa-spin"></i> Membaca file...</p>`;
    
    window.PangsitDB.import(file)
        .then(result => {
            if (result.success) {
                statusDiv.innerHTML = `
                    <p style="color: #28a745;">
                        <i class="fas fa-check-circle"></i> 
                        Database berhasil direstore! Halaman akan dimuat ulang...
                    </p>
                `;
            } else {
                statusDiv.innerHTML = `
                    <p style="color: #dc3545;">
                        <i class="fas fa-times-circle"></i> 
                        Gagal: ${result.error}
                    </p>
                `;
            }
        })
        .catch(error => {
            statusDiv.innerHTML = `
                <p style="color: #dc3545;">
                    <i class="fas fa-times-circle"></i> 
                    Error: ${error.message}
                </p>
            `;
        });
}

// Tambahkan admin dashboard ke halaman
setTimeout(() => {
    if (window.PangsitDB) {
        createAdminDashboard();
    }
}, 2000);
