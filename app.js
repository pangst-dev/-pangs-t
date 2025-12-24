// Main Application for PANGS!T
class PangsitApp {
  constructor() {
    this.db = window.pangsitDB;
    this.cart = JSON.parse(localStorage.getItem('pangsit_cart')) || [];
    this.init();
  }
  
  async init() {
    console.log('🍜 PANGS!T App Starting...');
    
    // Wait for database to initialize
    await this.db.init();
    
    // Initialize components
    this.initCart();
    this.renderProducts();
    this.initEventListeners();
    
    // Update cart count
    this.updateCartCount();
    
    console.log('✅ PANGS!T App Ready');
  }
  
  // ==================== PRODUCTS ====================
  renderProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    const products = this.db.getProducts();
    
    productsGrid.innerHTML = products.map(product => `
      <div class="product-card" data-id="${product.id}">
        <img src="${product.gambar}" alt="${product.nama}" class="product-img" 
             onerror="this.src='foto/default.jpg'">
        <div class="product-info">
          <h3 class="product-name">${product.nama}</h3>
          <div class="product-price">Rp ${product.harga.toLocaleString('id-ID')}</div>
          ${product.stok < 10 ? `<div style="color: #dc3545; font-size: 12px; margin-bottom: 5px;">Stok: ${product.stok}</div>` : ''}
          <p class="product-desc">${product.deskripsi}</p>
          <div class="product-actions">
            <button class="btn btn-detail" onclick="pangsitApp.showProductDetail(${product.id})">
              <i class="fas fa-eye"></i> Detail
            </button>
            <button class="btn-add-cart" onclick="pangsitApp.addToCart(${product.id})" 
                    ${product.stok <= 0 ? 'disabled style="opacity: 0.5;"' : ''}>
              <i class="fas fa-shopping-cart"></i>
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }
  
  showProductDetail(productId) {
    const product = this.db.getProduct(productId);
    if (!product) return;
    
    // Show modal or navigate to detail page
    const modal = document.getElementById('productModal');
    if (modal) {
      modal.querySelector('.modal-product-img').src = product.gambar;
      modal.querySelector('.modal-product-info h2').textContent = product.nama;
      modal.querySelector('.modal-product-price').textContent = `Rp ${product.harga.toLocaleString('id-ID')}`;
      modal.querySelector('.modal-product-desc').textContent = product.deskripsi;
      modal.classList.add('active');
    } else {
      // Fallback to alert
      alert(`${product.nama}\n\nHarga: Rp ${product.harga.toLocaleString('id-ID')}\n\n${product.deskripsi}\n\nStok: ${product.stok} pcs`);
    }
  }
  
  // ==================== CART SYSTEM ====================
  initCart() {
    this.cart = JSON.parse(localStorage.getItem('pangsit_cart')) || [];
  }
  
  addToCart(productId) {
    const product = this.db.getProduct(productId);
    if (!product) return;
    
    if (product.stok <= 0) {
      this.showNotification('Produk habis stok', 'error');
      return;
    }
    
    const existingItem = this.cart.find(item => item.id === productId);
    
    if (existingItem) {
      if (existingItem.quantity >= product.stok) {
        this.showNotification('Stok tidak mencukupi', 'error');
        return;
      }
      existingItem.quantity += 1;
    } else {
      this.cart.push({
        id: product.id,
        name: product.nama,
        price: product.harga,
        image: product.gambar,
        quantity: 1
      });
    }
    
    this.saveCart();
    this.showNotification('Ditambahkan ke keranjang');
  }
  
  removeFromCart(productId) {
    this.cart = this.cart.filter(item => item.id !== productId);
    this.saveCart();
  }
  
  updateQuantity(productId, change) {
    const item = this.cart.find(item => item.id === productId);
    if (item) {
      const product = this.db.getProduct(productId);
      
      item.quantity += change;
      
      if (item.quantity <= 0) {
        this.removeFromCart(productId);
      } else if (item.quantity > (product?.stok || 10)) {
        item.quantity = product.stok;
        this.showNotification('Jumlah melebihi stok tersedia', 'warning');
      }
      
      this.saveCart();
    }
  }
  
  saveCart() {
    localStorage.setItem('pangsit_cart', JSON.stringify(this.cart));
    this.updateCartCount();
    this.updateCartDisplay();
  }
  
  updateCartCount() {
    const totalItems = this.cart.reduce((total, item) => total + item.quantity, 0);
    
    // Update all cart count elements
    document.querySelectorAll('.cart-count').forEach(el => {
      el.textContent = totalItems;
    });
    
    return totalItems;
  }
  
  updateCartDisplay() {
    const cartItemsElement = document.getElementById('cartItems');
    if (!cartItemsElement) return;
    
    if (this.cart.length === 0) {
      cartItemsElement.innerHTML = `
        <div style="text-align: center; padding: 40px; color: #666;">
          <i class="fas fa-shopping-cart" style="font-size: 48px; margin-bottom: 20px;"></i>
          <p>Keranjang belanja kosong</p>
          <a href="#produk" class="btn" style="margin-top: 20px;">Mulai Belanja</a>
        </div>
      `;
      return;
    }
    
    cartItemsElement.innerHTML = this.cart.map(item => {
      const product = this.db.getProduct(item.id);
      const subtotal = item.price * item.quantity;
      
      return `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}" class="cart-item-img" 
               onerror="this.src='foto/default.jpg'">
          <div class="cart-item-info">
            <h3>${item.name}</h3>
            <div class="cart-item-price">Rp ${item.price.toLocaleString('id-ID')}</div>
            <div class="cart-item-quantity">
              <button class="quantity-btn" onclick="pangsitApp.updateQuantity(${item.id}, -1)">-</button>
              <span>${item.quantity}</span>
              <button class="quantity-btn" onclick="pangsitApp.updateQuantity(${item.id}, 1)">+</button>
            </div>
          </div>
          <button class="cart-item-remove" onclick="pangsitApp.removeFromCart(${item.id})">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `;
    }).join('');
    
    // Update summary
    this.updateCartSummary();
  }
  
  updateCartSummary() {
    const subtotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = 15000;
    const tax = subtotal * 0.1;
    const total = subtotal + shipping + tax;
    
    // Update elements if they exist
    const subtotalEl = document.getElementById('subtotal');
    const shippingEl = document.getElementById('shipping');
    const taxEl = document.getElementById('tax');
    const totalEl = document.getElementById('total');
    
    if (subtotalEl) subtotalEl.textContent = `Rp ${subtotal.toLocaleString('id-ID')}`;
    if (shippingEl) shippingEl.textContent = `Rp ${shipping.toLocaleString('id-ID')}`;
    if (taxEl) taxEl.textContent = `Rp ${tax.toLocaleString('id-ID')}`;
    if (totalEl) totalEl.textContent = `Rp ${total.toLocaleString('id-ID')}`;
    
    return { subtotal, shipping, tax, total };
  }
  
  clearCart() {
    if (this.cart.length > 0 && confirm('Yakin ingin mengosongkan keranjang?')) {
      this.cart = [];
      this.saveCart();
      this.showNotification('Keranjang dikosongkan');
    }
  }
  
  // ==================== CHECKOUT ====================
  async checkout() {
    if (this.cart.length === 0) {
      this.showNotification('Keranjang belanja kosong', 'error');
      return;
    }
    
    // Get customer info (simplified for demo)
    const customerName = prompt('Masukkan nama Anda:') || 'Pelanggan';
    const customerPhone = prompt('Masukkan nomor HP:') || '';
    const customerAddress = prompt('Masukkan alamat pengiriman:') || '';
    
    if (!customerName || !customerPhone || !customerAddress) {
      this.showNotification('Harap isi semua informasi', 'error');
      return;
    }
    
    // Calculate total
    const { subtotal, shipping, tax, total } = this.updateCartSummary();
    
    // Prepare order data
    const orderData = {
      customer: {
        name: customerName,
        phone: customerPhone,
        address: customerAddress,
        email: ''
      },
      products: this.cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.price * item.quantity
      })),
      subtotal: subtotal,
      shipping: shipping,
      tax: tax,
      total: total,
      payment_method: 'QRIS',
      notes: ''
    };
    
    // Add to database
    const order = this.db.addOrder(orderData);
    
    if (order) {
      // Clear cart
      this.cart = [];
      this.saveCart();
      
      // Show success message
      this.showNotification(`Order ${order.id} berhasil dibuat!`, 'success');
      
      // Show order details
      this.showOrderConfirmation(order);
      
      return order;
    } else {
      this.showNotification('Gagal membuat order', 'error');
      return null;
    }
  }
  
  showOrderConfirmation(order) {
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.8);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    `;
    
    modal.innerHTML = `
      <div style="
        background: white;
        border-radius: 15px;
        padding: 30px;
        max-width: 500px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
      ">
        <div style="text-align: center; margin-bottom: 20px;">
          <div style="
            width: 80px;
            height: 80px;
            background: #28a745;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 36px;
            margin: 0 auto 20px;
          ">
            <i class="fas fa-check"></i>
          </div>
          <h2 style="color: #2d3047; margin-bottom: 10px;">Order Berhasil!</h2>
          <p style="color: #666;">ID Order: <strong>${order.id}</strong></p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
          <h4 style="color: #2d3047; margin-bottom: 15px;">Rincian Order</h4>
          ${order.products.map(p => `
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span>${p.name} x${p.quantity}</span>
              <span>Rp ${(p.price * p.quantity).toLocaleString('id-ID')}</span>
            </div>
          `).join('')}
          
          <div style="border-top: 1px solid #ddd; margin: 15px 0; padding-top: 15px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
              <span>Subtotal:</span>
              <span>Rp ${order.subtotal.toLocaleString('id-ID')}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
              <span>Ongkir:</span>
              <span>Rp ${order.shipping.toLocaleString('id-ID')}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
              <span>Pajak (10%):</span>
              <span>Rp ${order.tax.toLocaleString('id-ID')}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 18px; margin-top: 10px;">
              <span>TOTAL:</span>
              <span style="color: #ff6b35;">Rp ${order.total.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
        
        <div style="margin-top: 20px;">
          <button onclick="this.closest('div[style*=\"position: fixed\"]').remove()" 
                  style="
                    width: 100%;
                    padding: 15px;
                    background: #ff6b35;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: bold;
                    cursor: pointer;
                  ">
            <i class="fas fa-check-circle"></i> Selesai
          </button>
          
          <button onclick="window.open('admin-live-pangsit.html', '_blank')" 
                  style="
                    width: 100%;
                    padding: 10px;
                    background: #2d3047;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-size: 14px;
                    margin-top: 10px;
                    cursor: pointer;
                  ">
            <i class="fas fa-external-link-alt"></i> Lihat di Admin Panel
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
  }
  
  // ==================== UTILITIES ====================
  showNotification(message, type = 'success') {
    // Remove existing notification
    const existing = document.querySelector('.pangsit-notification');
    if (existing) existing.remove();
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = 'pangsit-notification';
    notification.textContent = message;
    
    const bgColor = type === 'success' ? '#28a745' : 
                   type === 'error' ? '#dc3545' : 
                   type === 'warning' ? '#ffc107' : '#17a2b8';
    
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${bgColor};
      color: white;
      padding: 15px 25px;
      border-radius: 8px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.2);
      z-index: 9999;
      animation: slideIn 0.3s ease;
      max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
  
  initEventListeners() {
    // Add CSS animations if not exist
    if (!document.querySelector('#pangsit-animations')) {
      const style = document.createElement('style');
      style.id = 'pangsit-animations';
      style.textContent = `
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }
    
    // Checkout button
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => this.checkout());
    }
    
    // Clear cart button
    const clearCartBtn = document.getElementById('clearCartBtn');
    if (clearCartBtn) {
      clearCartBtn.addEventListener('click', () => this.clearCart());
    }
    
    // Export data button
    const exportBtn = document.getElementById('exportDataBtn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        const filename = this.db.exportData();
        this.showNotification(`Data diexpor: ${filename}`);
      });
    }
  }
}

// Initialize app when DOM is ready
let pangsitApp;
document.addEventListener('DOMContentLoaded', () => {
  pangsitApp = new PangsitApp();
  window.pangsitApp = pangsitApp;
});