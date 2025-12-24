// File: js/database.js
class PangsitDatabase {
  constructor() {
    this.dbName = 'pangsit_online_db';
    this.apiURL = 'https://raw.githubusercontent.com/[username]/pangsit-toko-online/main/database/';
    this.localDB = {
      products: [],
      orders: [],
      customers: [],
      settings: {}
    };
    
    this.init();
  }
  
  async init() {
    // Load data dari localStorage atau GitHub
    await this.loadFromLocal();
    
    if (this.localDB.products.length === 0) {
      await this.loadFromGitHub();
    }
    
    // Auto-save setiap 5 menit
    setInterval(() => this.saveToLocal(), 300000);
  }
  
  async loadFromGitHub() {
    try {
      const response = await fetch(`${this.apiURL}pangsit-db.json`);
      const data = await response.json();
      
      this.localDB.products = data.produk || [];
      this.localDB.settings = data.settings || {};
      this.localDB.toko_info = data.toko_info || {};
      
      // Simpan ke localStorage
      this.saveToLocal();
      
      console.log('✅ Database loaded from GitHub');
    } catch (error) {
      console.error('❌ Error loading from GitHub:', error);
      this.createDefaultData();
    }
  }
  
  async loadFromLocal() {
    try {
      const saved = localStorage.getItem(this.dbName);
      if (saved) {
        this.localDB = JSON.parse(saved);
        console.log('✅ Database loaded from localStorage');
      }
    } catch (error) {
      console.error('❌ Error loading from localStorage:', error);
    }
  }
  
  saveToLocal() {
    try {
      localStorage.setItem(this.dbName, JSON.stringify(this.localDB));
      console.log('💾 Database saved to localStorage');
    } catch (error) {
      console.error('❌ Error saving to localStorage:', error);
    }
  }
  
  createDefaultData() {
    // Data default jika tidak ada koneksi
    this.localDB = {
      products: [
        {
          id: 1,
          nama: "fire silk wonton",
          harga: 20000,
          kategori: "pedas",
          stok: 50,
          gambar: "foto/fire silk wonton.jpg",
          deskripsi: "Kesan: lembut, pedas aromatik, classy dengan minyak cabai khas Asia."
        },
        // ... tambahkan produk lainnya
      ],
      orders: [],
      customers: [],
      settings: {
        ongkir: 15000,
        pajak: 10,
        jam_buka: "10:00",
        jam_tutup: "21:00",
        metode_bayar: ["QRIS", "GOPAY", "OVO", "DANA", "BCA", "Mandiri", "BNI", "BRI"],
        whatsapp_admin: "6283195243139"
      },
      toko_info: {
        nama: "PANGS!T TOKO ONLINE",
        pemilik: "Siti Rusmi",
        telepon: "+62 831-9524-3139",
        email: "sitirusmi54@gmail.com",
        alamat: "Jl.panongan desa panongan kec panongan kabupaten tangerang",
        toko_id: "PANGSIT_001"
      }
    };
    
    this.saveToLocal();
  }
  
  // CRUD Operations
  getProducts() {
    return this.localDB.products;
  }
  
  getProduct(id) {
    return this.localDB.products.find(p => p.id === id);
  }
  
  getOrders() {
    return this.localDB.orders;
  }
  
  addOrder(orderData) {
    const order = {
      id: `PANG-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      tanggal: new Date().toISOString(),
      waktu: new Date().toLocaleTimeString('id-ID'),
      ...orderData,
      status: 'pending',
      created_at: Date.now()
    };
    
    this.localDB.orders.unshift(order);
    
    // Simpan ke localStorage
    this.saveToLocal();
    
    // Update live database di GitHub (jika ada akses)
    this.updateLiveOrder(order);
    
    return order;
  }
  
  async updateLiveOrder(order) {
    try {
      // Format order untuk live view
      const liveOrder = {
        order_id: order.id,
        customer_name: order.customer?.name || 'Pelanggan',
        customer_phone: order.customer?.phone || '',
        items: order.products?.map(p => `${p.nama} x${p.quantity}`).join(', ') || '',
        total: order.total || 0,
        status: 'BARU',
        timestamp: Date.now()
      };
      
      // Simpan di localStorage untuk admin panel
      let liveOrders = JSON.parse(localStorage.getItem('pangsit_live_orders') || '[]');
      liveOrders.unshift(liveOrder);
      
      // Maksimal 100 order
      if (liveOrders.length > 100) {
        liveOrders = liveOrders.slice(0, 100);
      }
      
      localStorage.setItem('pangsit_live_orders', JSON.stringify(liveOrders));
      
      // Jika ingin push ke GitHub (advanced)
      await this.pushToGitHub(liveOrder);
      
    } catch (error) {
      console.log('⚠️ Live order update skipped:', error);
    }
  }
  
  async pushToGitHub(order) {
    // Hanya contoh - butuh GitHub token untuk real implementation
    console.log('📤 Order ready for GitHub:', order.id);
  }
  
  updateOrderStatus(orderId, newStatus) {
    const order = this.localDB.orders.find(o => o.id === orderId);
    if (order) {
      order.status = newStatus;
      order.updated_at = Date.now();
      this.saveToLocal();
      return true;
    }
    return false;
  }
  
  getStats() {
    const totalOrders = this.localDB.orders.length;
    const today = new Date().toDateString();
    const todayOrders = this.localDB.orders.filter(o => 
      new Date(o.tanggal).toDateString() === today
    ).length;
    
    const totalRevenue = this.localDB.orders
      .filter(o => o.status === 'completed')
      .reduce((sum, o) => sum + (o.total || 0), 0);
    
    return {
      totalOrders,
      todayOrders,
      totalRevenue,
      totalProducts: this.localDB.products.length
    };
  }
}

// Export database instance
const pangsitDB = new PangsitDatabase();
window.pangsitDB = pangsitDB;