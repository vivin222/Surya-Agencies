/**
 * Shopkeeper Portal — Surya Agencies (Arun Icecreams)
 * Authenticated Administrative Management Terminal & Scanner
 */

class ShopkeeperApp {
  constructor() {
    this.token = sessionStorage.getItem('surya_shopkeeper_token') || null;
    this.isAuthenticated = Boolean(this.token);
    this.products = [];
    this.orders = [];
    this.stats = {
      totalProducts: 0,
      totalStock: 0,
      newOrders: 0,
      ordersPreparing: 0,
      ordersReady: 0,
      ordersCompleted: 0,
      totalRevenue: 0
    };
    this.settings = {
      shopName: 'Surya Agencies',
      tagline: 'Authorized Arun Icecreams Parlour',
      upiId: 'suryaagencies@upi',
      shopPhone: '+91 98765 43210'
    };
    this.activeOrderTab = 'ALL';
    this.qrScanner = null;
    this.isScanning = false;
    this.scannedOrder = null;

    this.init();
  }

  async init() {
    if (this.isAuthenticated) {
      await this.loadShopkeeperData();
    }
    this.setupRealtimeListeners();
    this.renderAuthGate();
  }

  getAuthHeaders() {
    return {
      'Content-Type': 'application/json',
      'x-shopkeeper-token': this.token || ''
    };
  }

  // --- AUTHENTICATION GATE ---

  async login(pin) {
    if (!pin) {
      window.appController.showToast('Please enter the Shopkeeper PIN', 'warning');
      return false;
    }

    try {
      const res = await fetch('/api/auth/shopkeeper/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin })
      });

      const data = await res.json();
      if (res.ok && data.success && data.token) {
        this.token = data.token;
        this.isAuthenticated = true;
        sessionStorage.setItem('surya_shopkeeper_token', data.token);
        
        await this.loadShopkeeperData();
        this.renderAuthGate();
        window.appController.showToast('Shopkeeper logged in successfully!', 'success');
        return true;
      } else {
        throw new Error(data.error || 'Invalid PIN');
      }
    } catch (err) {
      window.appController.showToast(err.message, 'error');
      return false;
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    sessionStorage.removeItem('surya_shopkeeper_token');
    this.renderAuthGate();
    window.appController.showToast('Shopkeeper logged out', 'info');
  }

  renderAuthGate() {
    const loginGate = document.getElementById('shop-auth-gate');
    const dashboardContent = document.getElementById('shop-dashboard-content');

    if (!this.isAuthenticated) {
      if (loginGate) loginGate.classList.remove('hidden');
      if (dashboardContent) dashboardContent.classList.add('hidden');
    } else {
      if (loginGate) loginGate.classList.add('hidden');
      if (dashboardContent) dashboardContent.classList.remove('hidden');
      this.render();
    }
  }

  async loadShopkeeperData() {
    await this.fetchSettings();
    await this.fetchProducts();
    await this.fetchOrders();
    await this.fetchStats();
  }

  // --- DATA FETCHING ---

  async fetchSettings() {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data.success) {
        this.settings = data.settings;
        this.populateSettingsForm();
      }
    } catch (e) {
      console.warn('Could not fetch settings:', e);
    }
  }

  async fetchProducts() {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.success) {
        this.products = data.products || [];
        this.renderProductsList();
        this.renderInventoryTable();
      }
    } catch (e) {
      console.error('Failed to fetch products:', e);
    }
  }

  async fetchOrders() {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.success) {
        this.orders = data.orders || [];
        this.renderOrders();
      }
    } catch (e) {
      console.error('Failed to fetch orders:', e);
    }
  }

  async fetchStats() {
    try {
      const res = await fetch('/api/stats');
      const data = await res.json();
      if (data.success) {
        this.stats = data.stats;
        this.renderStats();
      }
    } catch (e) {
      console.error('Failed to fetch stats:', e);
    }
  }

  // --- REAL-TIME LISTENERS ---

  setupRealtimeListeners() {
    if (!window.realtimeClient) return;

    window.realtimeClient.on('order:created', (newOrder) => {
      this.orders.unshift(newOrder);
      if (this.isAuthenticated) {
        this.renderOrders();
        this.fetchStats();
        window.appController.playSound('new_order');
        window.appController.showToast(`🔔 New Arun Icecream Order: ${newOrder.orderNumber} (₹${newOrder.total})`, 'info');
      }
    });

    window.realtimeClient.on('order:status_updated', (updatedOrder) => {
      const idx = this.orders.findIndex(o => o.id === updatedOrder.id);
      if (idx >= 0) this.orders[idx] = updatedOrder;
      if (this.isAuthenticated) {
        this.renderOrders();
        this.fetchStats();
      }

      if (this.scannedOrder && (this.scannedOrder.id === updatedOrder.id || this.scannedOrder.orderNumber === updatedOrder.orderNumber)) {
        this.scannedOrder = updatedOrder;
        this.renderScannedOrderDetails(updatedOrder);
      }
    });

    window.realtimeClient.on('order:payment_updated', (updatedOrder) => {
      const idx = this.orders.findIndex(o => o.id === updatedOrder.id);
      if (idx >= 0) this.orders[idx] = updatedOrder;
      if (this.isAuthenticated) {
        this.renderOrders();
        this.fetchStats();
      }

      if (this.scannedOrder && (this.scannedOrder.id === updatedOrder.id || this.scannedOrder.orderNumber === updatedOrder.orderNumber)) {
        this.scannedOrder = updatedOrder;
        this.renderScannedOrderDetails(updatedOrder);
      }
    });

    window.realtimeClient.on('product:created', (product) => {
      const idx = this.products.findIndex(p => p.id === product.id);
      if (idx >= 0) this.products[idx] = product;
      else this.products.push(product);
      if (this.isAuthenticated) {
        this.renderProductsList();
        this.renderInventoryTable();
        this.fetchStats();
      }
    });

    window.realtimeClient.on('product:updated', (product) => {
      const idx = this.products.findIndex(p => p.id === product.id);
      if (idx >= 0) this.products[idx] = product;
      if (this.isAuthenticated) {
        this.renderProductsList();
        this.renderInventoryTable();
        this.fetchStats();
      }
    });

    window.realtimeClient.on('product:stock_updated', ({ id, stock, product }) => {
      const p = this.products.find(item => item.id === id);
      if (p) p.stock = stock;
      if (this.isAuthenticated) {
        this.renderProductsList();
        this.renderInventoryTable();
        this.fetchStats();
      }
    });

    window.realtimeClient.on('products:stock_batch_updated', (updatedList) => {
      if (Array.isArray(updatedList)) {
        updatedList.forEach(up => {
          const idx = this.products.findIndex(p => p.id === up.id);
          if (idx >= 0) this.products[idx] = up;
        });
        if (this.isAuthenticated) {
          this.renderProductsList();
          this.renderInventoryTable();
          this.fetchStats();
        }
      }
    });

    window.realtimeClient.on('product:deleted', ({ id }) => {
      this.products = this.products.filter(p => p.id !== id);
      if (this.isAuthenticated) {
        this.renderProductsList();
        this.renderInventoryTable();
        this.fetchStats();
      }
    });

    window.realtimeClient.on('products:reloaded', (productsList) => {
      this.products = productsList || [];
      if (this.isAuthenticated) {
        this.renderProductsList();
        this.renderInventoryTable();
        this.fetchStats();
        this.fetchOrders();
      }
    });

    window.realtimeClient.on('stats:updated', (stats) => {
      if (stats) {
        this.stats = stats;
        if (this.isAuthenticated) this.renderStats();
      }
    });
  }

  // --- STATS RENDERING ---

  renderStats() {
    const s = this.stats;
    const map = {
      'stat-total-products': s.totalProducts,
      'stat-total-stock': s.totalStock,
      'stat-new-orders': s.newOrders,
      'stat-preparing-orders': s.ordersPreparing,
      'stat-ready-orders': s.ordersReady,
      'stat-completed-orders': s.ordersCompleted,
      'stat-total-revenue': `₹${s.totalRevenue}`
    };

    for (const [id, val] of Object.entries(map)) {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    }

    const badge = document.getElementById('shop-new-orders-badge');
    if (badge) {
      badge.textContent = s.newOrders;
      if (s.newOrders > 0) badge.classList.remove('hidden');
      else badge.classList.add('hidden');
    }
  }

  // --- ORDERS MANAGEMENT ---

  setOrderTab(tab) {
    this.activeOrderTab = tab;
    
    const tabs = ['ALL', 'NEW', 'PREPARING', 'READY_FOR_PICKUP', 'COMPLETED', 'CANCELLED'];
    tabs.forEach(t => {
      const btn = document.getElementById(`order-tab-btn-${t.toLowerCase()}`);
      if (btn) {
        if (t === tab) {
          btn.className = 'px-3.5 py-1.5 rounded-xl bg-rose-600 text-white font-bold text-xs shadow-sm';
        } else {
          btn.className = 'px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs transition-colors';
        }
      }
    });

    this.renderOrders();
  }

  getFilteredOrders() {
    if (this.activeOrderTab === 'ALL') return this.orders;
    if (this.activeOrderTab === 'NEW') {
      return this.orders.filter(o => o.orderStatus === 'NEW' || o.orderStatus === 'ACCEPTED');
    }
    return this.orders.filter(o => o.orderStatus === this.activeOrderTab);
  }

  renderOrders() {
    const container = document.getElementById('shop-orders-container');
    const emptyState = document.getElementById('shop-orders-empty');
    if (!container) return;

    const filtered = this.getFilteredOrders();

    if (filtered.length === 0) {
      container.innerHTML = '';
      if (emptyState) emptyState.classList.remove('hidden');
      return;
    }

    if (emptyState) emptyState.classList.add('hidden');

    container.innerHTML = filtered.map(order => {
      const formattedDate = new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const isPaid = order.paymentStatus === 'PAID';
      
      let actionButtons = '';
      const isCancelled = order.orderStatus === 'CANCELLED';
      const isCompleted = order.orderStatus === 'COMPLETED';

      if (!isCancelled && !isCompleted) {
        actionButtons = `
          <div class="flex flex-wrap items-center gap-1.5">
            ${order.orderStatus === 'NEW' ? `
              <button 
                type="button" 
                onclick="shopkeeperApp.updateOrderStatus('${order.id}', 'ACCEPTED')"
                class="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all"
              >
                ✓ Order Received
              </button>
            ` : ''}

            ${order.orderStatus === 'NEW' || order.orderStatus === 'ACCEPTED' ? `
              <button 
                type="button" 
                onclick="shopkeeperApp.updateOrderStatus('${order.id}', 'PREPARING')"
                class="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-sm transition-all flex items-center space-x-1"
              >
                <span>🥣 Preparing</span>
              </button>
            ` : ''}

            ${order.orderStatus === 'PREPARING' || order.orderStatus === 'ACCEPTED' ? `
              <button 
                type="button" 
                onclick="shopkeeperApp.updateOrderStatus('${order.id}', 'READY_FOR_PICKUP')"
                class="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all flex items-center space-x-1"
              >
                <span>📦 Ready</span>
              </button>
            ` : ''}

            ${order.orderStatus === 'READY_FOR_PICKUP' ? `
              <button 
                type="button" 
                onclick="shopkeeperApp.updateOrderStatus('${order.id}', 'COMPLETED')"
                class="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all flex items-center space-x-1"
              >
                <span>🎉 Complete Order</span>
              </button>
            ` : ''}

            <button 
              type="button" 
              onclick="if(confirm('Cancel this order and restore product stock?')) shopkeeperApp.updateOrderStatus('${order.id}', 'CANCELLED')"
              class="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-700 text-xs font-semibold transition-colors"
              title="Cancel Order"
            >
              Cancel
            </button>
          </div>
        `;
      } else if (isCancelled) {
        actionButtons = `<span class="text-xs font-bold text-rose-600">❌ Cancelled</span>`;
      } else {
        actionButtons = `<span class="text-xs font-bold text-emerald-600">✓ Completed</span>`;
      }

      let paymentAction = '';
      if (!isPaid && order.orderStatus !== 'COMPLETED') {
        paymentAction = `
          <button 
            type="button" 
            onclick="shopkeeperApp.markPaymentReceived('${order.id}')"
            class="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 font-bold text-xs transition-colors"
          >
            Mark Paid
          </button>
        `;
      }

      return `
        <div class="bg-white rounded-3xl p-5 border border-slate-200 hover:border-rose-300 shadow-sm transition-all">
          <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div class="flex items-center space-x-3">
              <span class="text-lg font-black text-rose-600 font-mono tracking-tight">${order.orderNumber}</span>
              <span class="text-xs font-bold text-slate-400">• ${formattedDate}</span>
            </div>

            <div class="flex items-center gap-2">
              <span class="px-2.5 py-1 rounded-full text-xs font-extrabold ${isPaid ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800 border border-amber-300'}">
                ${isPaid ? '✓ Paid' : '⏳ Payment Pending'} (${order.paymentMethod === 'upi' ? 'UPI' : 'Pay at Shop'})
              </span>

              <span class="px-2.5 py-1 rounded-full text-xs font-extrabold ${
                order.orderStatus === 'CANCELLED' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                order.orderStatus === 'COMPLETED' ? 'bg-slate-100 text-slate-600' :
                order.orderStatus === 'READY_FOR_PICKUP' ? 'bg-emerald-500 text-white shadow-sm' :
                order.orderStatus === 'PREPARING' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                'bg-blue-100 text-blue-800 border border-blue-200'
              }">
                ${order.orderStatus}
              </span>
            </div>
          </div>

          <div class="py-3.5">
            <div class="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span>Customer: <strong class="text-slate-800 font-bold">${order.customerName}</strong> ${order.customerPhone ? `(${order.customerPhone})` : ''}</span>
              <span class="text-sm font-black text-slate-900 font-display">Total: <span class="text-rose-600">₹${order.total}</span></span>
            </div>

            <div class="bg-slate-50 rounded-2xl p-3 border border-slate-100 space-y-1.5">
              ${(order.items || []).map(item => `
                <div class="flex justify-between items-center text-xs">
                  <span class="font-bold text-slate-800">${item.name} <span class="text-rose-600 font-mono">× ${item.quantity}</span></span>
                  <span class="text-slate-500 font-mono">₹${item.price * item.quantity}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="flex items-center justify-between pt-2 border-t border-slate-100">
            <div>
              ${paymentAction}
            </div>
            <div class="flex items-center gap-2">
              ${actionButtons}
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  async updateOrderStatus(orderId, status) {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        window.appController.showToast(`Order status updated to: ${status}`, 'success');
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      window.appController.showToast(err.message, 'error');
    }
  }

  async markPaymentReceived(orderId) {
    try {
      const res = await fetch(`/api/orders/${orderId}/payment`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ paymentStatus: 'PAID' })
      });
      const data = await res.json();
      if (data.success) {
        window.appController.showToast('Payment marked as RECEIVED (PAID)', 'success');
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      window.appController.showToast(err.message, 'error');
    }
  }

  // --- PRODUCT MANAGEMENT ---

  renderProductsList() {
    const container = document.getElementById('shop-products-grid');
    const countSpan = document.getElementById('shop-products-count');
    if (!container) return;

    if (countSpan) countSpan.textContent = this.products.length;

    container.innerHTML = this.products.map(p => {
      const isOutOfStock = p.stock <= 0;
      const imageUrl = p.image || 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=600';

      return `
        <div class="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div>
            <div class="relative h-44 bg-slate-100">
              <img src="${imageUrl}" alt="${p.name}" class="w-full h-full object-cover" />
              <span class="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/95 shadow-sm text-slate-800">
                ${p.category}
              </span>
              <span class="absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-black ${isOutOfStock ? 'bg-rose-100 text-rose-700 border border-rose-200' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'}">
                ${isOutOfStock ? 'Out of Stock' : `Stock: ${p.stock}`}
              </span>
            </div>

            <div class="p-4">
              <div class="flex items-start justify-between gap-1">
                <h4 class="font-black text-slate-900 text-sm leading-snug">${p.name}</h4>
                <span class="font-black text-rose-600 font-display text-base">₹${p.price}</span>
              </div>
              <p class="text-xs text-slate-500 mt-1 line-clamp-2">${p.description || 'Authentic Arun Icecreams.'}</p>
            </div>
          </div>

          <div class="p-4 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between">
            <div class="flex items-center gap-1.5">
              <span class="w-2.5 h-2.5 rounded-full ${p.available ? 'bg-emerald-500' : 'bg-slate-300'}"></span>
              <span class="text-[11px] font-bold text-slate-500">${p.available ? 'Online Order Active' : 'Disabled'}</span>
            </div>

            <div class="flex items-center gap-1.5">
              <button 
                type="button" 
                onclick="shopkeeperApp.openEditProductModal('${p.id}')"
                class="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
              >
                ✏️ Edit
              </button>
              <button 
                type="button" 
                onclick="shopkeeperApp.deleteProduct('${p.id}')"
                class="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs transition-colors"
              >
                🗑️
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // --- INVENTORY TABLE & QUICK STOCK ADJUSTER ---

  renderInventoryTable() {
    const tbody = document.getElementById('shop-inventory-tbody');
    if (!tbody) return;

    tbody.innerHTML = this.products.map(p => {
      const isOutOfStock = p.stock <= 0;
      const imageUrl = p.image || 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=600';

      return `
        <tr class="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
          <td class="py-3 px-4">
            <div class="flex items-center space-x-3">
              <img src="${imageUrl}" alt="${p.name}" class="w-10 h-10 rounded-xl object-cover border border-slate-200" />
              <div>
                <span class="font-bold text-slate-900 text-sm block">${p.name}</span>
                <span class="text-[10px] font-semibold text-rose-600">Arun Icecreams • ${p.category}</span>
              </div>
            </div>
          </td>
          <td class="py-3 px-4 text-xs font-black text-slate-800 font-mono">₹${p.price}</td>
          <td class="py-3 px-4">
            <span class="px-2.5 py-0.5 rounded-full text-xs font-black ${isOutOfStock ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-800'}">
              ${p.stock} units
            </span>
          </td>
          <td class="py-3 px-4">
            <div class="flex items-center gap-1.5">
              <button type="button" onclick="shopkeeperApp.adjustStock('${p.id}', -5)" class="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs">−5</button>
              <button type="button" onclick="shopkeeperApp.adjustStock('${p.id}', -1)" class="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs">−1</button>
              <input 
                type="number" 
                value="${p.stock}" 
                min="0" 
                class="w-16 text-center py-1 rounded-lg border border-slate-200 text-xs font-black text-slate-900"
                onchange="shopkeeperApp.setExactStock('${p.id}', this.value)"
              />
              <button type="button" onclick="shopkeeperApp.adjustStock('${p.id}', 1)" class="w-7 h-7 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs">+1</button>
              <button type="button" onclick="shopkeeperApp.adjustStock('${p.id}', 5)" class="w-7 h-7 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs">+5</button>
            </div>
          </td>
          <td class="py-3 px-4 text-right">
            <button 
              type="button" 
              onclick="shopkeeperApp.toggleProductAvailability('${p.id}')"
              class="px-2.5 py-1 rounded-xl text-xs font-bold ${p.available ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500'}"
            >
              ${p.available ? 'Online Order Active' : 'Disabled'}
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  async adjustStock(productId, delta) {
    const prod = this.products.find(p => p.id === productId);
    if (!prod) return;
    const newStock = Math.max(0, prod.stock + delta);
    await this.setExactStock(productId, newStock);
  }

  async setExactStock(productId, value) {
    const stockVal = Math.max(0, parseInt(value, 10) || 0);
    try {
      const res = await fetch(`/api/products/${productId}/stock`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ stock: stockVal })
      });
      const data = await res.json();
      if (data.success) {
        window.appController.showToast(`Stock updated to ${stockVal}`, 'success');
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      window.appController.showToast(err.message, 'error');
    }
  }

  async toggleProductAvailability(productId) {
    const prod = this.products.find(p => p.id === productId);
    if (!prod) return;
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ available: !prod.available })
      });
      const data = await res.json();
      if (data.success) {
        window.appController.showToast(`Product availability toggled`, 'success');
      }
    } catch (e) {
      window.appController.showToast(e.message, 'error');
    }
  }

  // --- ADD / EDIT PRODUCT MODAL ---

  openAddProductModal() {
    const modal = document.getElementById('shop-product-modal');
    if (!modal) return;

    modal.innerHTML = `
      <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto" onclick="shopkeeperApp.closeProductModal(event)">
        <div class="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 my-8 animate-in fade-in zoom-in duration-200" onclick="event.stopPropagation()">
          <div class="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 class="text-lg font-black text-slate-900 font-display">Add Arun Icecreams Product</h3>
            <button type="button" onclick="shopkeeperApp.closeProductModal()" class="w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center hover:bg-slate-200">✕</button>
          </div>

          <form id="add-product-form" onsubmit="shopkeeperApp.submitProductForm(event)" class="mt-5 space-y-4">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Product Name *</label>
              <input 
                type="text" 
                id="prod-form-name" 
                required 
                placeholder="e.g. Arun Cassatta Slice" 
                class="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Category *</label>
                <select id="prod-form-category" class="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:border-rose-500">
                  <option value="Bars & Sticks">Bars & Sticks</option>
                  <option value="Cones">Cones</option>
                  <option value="Cups">Cups</option>
                  <option value="Family Tubs">Family Tubs</option>
                  <option value="Kulfi Special">Kulfi Special</option>
                  <option value="Slices & Cakes">Slices & Cakes</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Price (₹) *</label>
                <input 
                  type="number" 
                  id="prod-form-price" 
                  required 
                  min="1" 
                  placeholder="35" 
                  class="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Available Online Stock *</label>
                <input 
                  type="number" 
                  id="prod-form-stock" 
                  required 
                  min="0" 
                  value="50" 
                  class="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div class="flex flex-col justify-center">
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Online Ordering</label>
                <label class="flex items-center gap-2 cursor-pointer mt-1">
                  <input type="checkbox" id="prod-form-available" checked class="w-5 h-5 text-rose-600 rounded border-slate-300 focus:ring-rose-500" />
                  <span class="text-xs font-bold text-slate-800">Enable Ordering</span>
                </label>
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Description</label>
              <textarea 
                id="prod-form-desc" 
                rows="2" 
                placeholder="Delicious fresh Arun Icecreams product."
                class="w-full px-4 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-rose-500"
              ></textarea>
            </div>

            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Upload Product Image</label>
              <div class="flex items-center gap-3">
                <input 
                  type="file" 
                  id="prod-form-file" 
                  accept="image/*"
                  onchange="shopkeeperApp.previewSelectedImage(this)"
                  class="text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100"
                />
                <img id="prod-form-preview" class="w-12 h-12 rounded-xl object-cover border border-slate-200 hidden" />
              </div>
            </div>

            <div class="pt-3 border-t border-slate-100 flex gap-2">
              <button 
                type="button" 
                onclick="shopkeeperApp.closeProductModal()"
                class="flex-1 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                class="flex-1 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-lg shadow-rose-500/25 transition-all"
              >
                Save Arun Product
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  openEditProductModal(productId) {
    const p = this.products.find(item => item.id === productId);
    if (!p) return;

    const modal = document.getElementById('shop-product-modal');
    if (!modal) return;

    modal.innerHTML = `
      <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto" onclick="shopkeeperApp.closeProductModal(event)">
        <div class="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 my-8 animate-in fade-in zoom-in duration-200" onclick="event.stopPropagation()">
          <div class="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 class="text-lg font-black text-slate-900 font-display">Edit: ${p.name}</h3>
            <button type="button" onclick="shopkeeperApp.closeProductModal()" class="w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center hover:bg-slate-200">✕</button>
          </div>

          <form id="edit-product-form" onsubmit="shopkeeperApp.submitEditProductForm(event, '${p.id}')" class="mt-5 space-y-4">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Product Name *</label>
              <input 
                type="text" 
                id="edit-prod-name" 
                required 
                value="${p.name}" 
                class="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Category *</label>
                <select id="edit-prod-category" class="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:border-rose-500">
                  <option value="Bars & Sticks" ${p.category === 'Bars & Sticks' ? 'selected' : ''}>Bars & Sticks</option>
                  <option value="Cones" ${p.category === 'Cones' ? 'selected' : ''}>Cones</option>
                  <option value="Cups" ${p.category === 'Cups' ? 'selected' : ''}>Cups</option>
                  <option value="Family Tubs" ${p.category === 'Family Tubs' ? 'selected' : ''}>Family Tubs</option>
                  <option value="Kulfi Special" ${p.category === 'Kulfi Special' ? 'selected' : ''}>Kulfi Special</option>
                  <option value="Slices & Cakes" ${p.category === 'Slices & Cakes' ? 'selected' : ''}>Slices & Cakes</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Price (₹) *</label>
                <input 
                  type="number" 
                  id="edit-prod-price" 
                  required 
                  min="1" 
                  value="${p.price}" 
                  class="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Online Stock *</label>
                <input 
                  type="number" 
                  id="edit-prod-stock" 
                  required 
                  min="0" 
                  value="${p.stock}" 
                  class="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div class="flex flex-col justify-center">
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Online Ordering</label>
                <label class="flex items-center gap-2 cursor-pointer mt-1">
                  <input type="checkbox" id="edit-prod-available" ${p.available ? 'checked' : ''} class="w-5 h-5 text-rose-600 rounded border-slate-300 focus:ring-rose-500" />
                  <span class="text-xs font-bold text-slate-800">Enable Ordering</span>
                </label>
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Description</label>
              <textarea 
                id="edit-prod-desc" 
                rows="2" 
                class="w-full px-4 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-rose-500"
              >${p.description || ''}</textarea>
            </div>

            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Replace Image (Optional)</label>
              <div class="flex items-center gap-3">
                <input 
                  type="file" 
                  id="edit-prod-file" 
                  accept="image/*"
                  onchange="shopkeeperApp.previewSelectedImage(this)"
                  class="text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100"
                />
                <img id="prod-form-preview" src="${p.image || ''}" class="w-12 h-12 rounded-xl object-cover border border-slate-200 ${p.image ? '' : 'hidden'}" />
              </div>
            </div>

            <div class="pt-3 border-t border-slate-100 flex gap-2">
              <button 
                type="button" 
                onclick="shopkeeperApp.closeProductModal()"
                class="flex-1 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                class="flex-1 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-lg shadow-rose-500/25 transition-all"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  previewSelectedImage(input) {
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const preview = document.getElementById('prod-form-preview');
        if (preview) {
          preview.src = e.target.result;
          preview.classList.remove('hidden');
        }
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  closeProductModal(e) {
    const modal = document.getElementById('shop-product-modal');
    if (modal) modal.innerHTML = '';
  }

  async submitProductForm(e) {
    e.preventDefault();
    const name = document.getElementById('prod-form-name').value.trim();
    const category = document.getElementById('prod-form-category').value;
    const price = document.getElementById('prod-form-price').value;
    const stock = document.getElementById('prod-form-stock').value;
    const description = document.getElementById('prod-form-desc').value;
    const available = document.getElementById('prod-form-available').checked;
    const fileInput = document.getElementById('prod-form-file');

    const formData = new FormData();
    formData.append('name', name);
    formData.append('category', category);
    formData.append('price', price);
    formData.append('stock', stock);
    formData.append('description', description);
    formData.append('available', available);

    if (fileInput && fileInput.files[0]) {
      formData.append('imageFile', fileInput.files[0]);
    } else {
      formData.append('image', 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=600');
    }

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'x-shopkeeper-token': this.token || '' },
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        this.closeProductModal();
        window.appController.showToast(`Arun Product "${name}" added!`, 'success');
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      window.appController.showToast(err.message, 'error');
    }
  }

  async submitEditProductForm(e, productId) {
    e.preventDefault();
    const name = document.getElementById('edit-prod-name').value.trim();
    const category = document.getElementById('edit-prod-category').value;
    const price = document.getElementById('edit-prod-price').value;
    const stock = document.getElementById('edit-prod-stock').value;
    const description = document.getElementById('edit-prod-desc').value;
    const available = document.getElementById('edit-prod-available').checked;
    const fileInput = document.getElementById('edit-prod-file');

    const formData = new FormData();
    formData.append('name', name);
    formData.append('category', category);
    formData.append('price', price);
    formData.append('stock', stock);
    formData.append('description', description);
    formData.append('available', available);

    if (fileInput && fileInput.files[0]) {
      formData.append('imageFile', fileInput.files[0]);
    }

    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'x-shopkeeper-token': this.token || '' },
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        this.closeProductModal();
        window.appController.showToast(`Product "${name}" updated!`, 'success');
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      window.appController.showToast(err.message, 'error');
    }
  }

  async deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this Arun Icecream product?')) return;
    try {
      const res = await fetch(`/api/products/${productId}`, { 
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });
      const data = await res.json();
      if (data.success) {
        window.appController.showToast('Product deleted', 'info');
      } else {
        throw new Error(data.error);
      }
    } catch (e) {
      window.appController.showToast(e.message, 'error');
    }
  }

  // --- QR SCANNER & PICKUP VERIFICATION ---

  openQRScannerModal(prefillOrderId = '') {
    const modal = document.getElementById('shop-qr-scanner-modal');
    if (!modal) return;

    modal.innerHTML = `
      <div class="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto" onclick="shopkeeperApp.closeQRScannerModal(event)">
        <div class="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 my-8 animate-in fade-in zoom-in duration-200" onclick="event.stopPropagation()">
          <div class="flex items-center justify-between border-b border-slate-100 pb-4">
            <div class="flex items-center space-x-2.5">
              <span class="text-2xl">📷</span>
              <div>
                <h3 class="text-lg font-black text-slate-900 font-display">Scan Customer Order QR</h3>
                <p class="text-xs text-slate-500">Surya Agencies • Arun Icecreams Verification Terminal</p>
              </div>
            </div>
            <button type="button" onclick="shopkeeperApp.closeQRScannerModal()" class="w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center hover:bg-slate-200">✕</button>
          </div>

          <div class="mt-4 space-y-4">
            <div id="camera-scanner-wrapper" class="relative rounded-2xl overflow-hidden bg-slate-900 min-h-[220px] flex flex-col items-center justify-center text-white">
              <div id="qr-camera-reader" class="w-full"></div>
              <div id="scanner-loading-indicator" class="p-6 text-center">
                <span class="text-3xl block mb-2 animate-bounce-small">📸</span>
                <p class="text-xs font-bold text-slate-300">Point customer ticket QR Code at camera</p>
                <button type="button" onclick="shopkeeperApp.startCameraScanner()" class="mt-3 px-3.5 py-2 rounded-xl bg-rose-600 text-xs font-bold hover:bg-rose-700 transition-colors shadow-sm">Start Camera</button>
              </div>
            </div>

            <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Or Enter Order Number Manually</label>
              <div class="flex gap-2">
                <input 
                  type="text" 
                  id="scanner-manual-input" 
                  value="${prefillOrderId}"
                  placeholder="e.g. #A001" 
                  class="flex-1 px-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:border-rose-500 uppercase font-mono"
                  onkeydown="if(event.key === 'Enter'){ shopkeeperApp.lookupOrderByManualInput(); event.preventDefault(); }"
                />
                <button 
                  type="button" 
                  onclick="shopkeeperApp.lookupOrderByManualInput()"
                  class="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors shadow-sm"
                >
                  Verify Order
                </button>
              </div>
            </div>

            <div id="scanned-order-result" class="hidden"></div>
          </div>
        </div>
      </div>
    `;

    if (prefillOrderId) {
      this.lookupOrderByInput(prefillOrderId);
    }
  }

  startCameraScanner() {
    const readerEl = document.getElementById('qr-camera-reader');
    const loadingEl = document.getElementById('scanner-loading-indicator');
    if (!readerEl || !window.Html5Qrcode) {
      window.appController.showToast('Camera QR scanner ready. Please use manual Order ID search if camera is unavailable.', 'info');
      return;
    }

    try {
      if (this.qrScanner) {
        this.qrScanner.stop().catch(() => {});
      }

      this.qrScanner = new Html5Qrcode('qr-camera-reader');
      const config = { fps: 10, qrbox: { width: 220, height: 220 } };

      this.qrScanner.start(
        { facingMode: 'environment' },
        config,
        (decodedText) => {
          if (loadingEl) loadingEl.classList.add('hidden');
          this.handleScannedQRData(decodedText);
        },
        () => {}
      ).then(() => {
        this.isScanning = true;
        if (loadingEl) loadingEl.classList.add('hidden');
      }).catch(err => {
        console.warn('Camera access error:', err);
        if (loadingEl) {
          loadingEl.innerHTML = `
            <span class="text-amber-400 text-2xl block mb-1">📷</span>
            <p class="text-xs text-slate-300">Camera not accessible or permission denied.</p>
            <p class="text-[11px] text-slate-400 mt-1">Please use the manual Order ID box below.</p>
          `;
        }
      });
    } catch (e) {
      console.warn('Scanner error:', e);
    }
  }

  stopCameraScanner() {
    if (this.qrScanner && this.isScanning) {
      this.qrScanner.stop().then(() => {
        this.qrScanner.clear();
        this.isScanning = false;
      }).catch(() => {});
    }
  }

  closeQRScannerModal(e) {
    this.stopCameraScanner();
    this.scannedOrder = null;
    const modal = document.getElementById('shop-qr-scanner-modal');
    if (modal) modal.innerHTML = '';
  }

  handleScannedQRData(qrText) {
    let orderIdentifier = qrText;
    try {
      const parsed = JSON.parse(qrText);
      if (parsed.orderNumber) orderIdentifier = parsed.orderNumber;
      else if (parsed.orderId) orderIdentifier = parsed.orderId;
    } catch (e) {}

    this.lookupOrderByInput(orderIdentifier);
  }

  lookupOrderByManualInput() {
    const input = document.getElementById('scanner-manual-input');
    if (!input || !input.value.trim()) {
      window.appController.showToast('Please enter an Order Number (e.g. #A001)', 'warning');
      return;
    }
    this.lookupOrderByInput(input.value.trim());
  }

  async lookupOrderByInput(orderIdOrNumber) {
    const resultContainer = document.getElementById('scanned-order-result');
    if (!resultContainer) return;

    resultContainer.classList.remove('hidden');
    resultContainer.innerHTML = `
      <div class="p-4 text-center text-slate-500 text-xs animate-pulse">
        🔍 Querying Surya Agencies database for ${orderIdOrNumber}...
      </div>
    `;

    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(orderIdOrNumber)}`);
      const data = await res.json();

      if (!res.ok || !data.success || !data.order) {
        throw new Error(data.error || 'Order not found in database!');
      }

      this.scannedOrder = data.order;
      this.renderScannedOrderDetails(data.order);
      window.appController.playSound('order_placed');

    } catch (err) {
      resultContainer.innerHTML = `
        <div class="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
          <div class="flex items-center space-x-2">
            <span class="text-lg">❌</span>
            <div>
              <strong class="font-extrabold block">Verification Failed</strong>
              <span>${err.message}</span>
            </div>
          </div>
        </div>
      `;
    }
  }

  renderScannedOrderDetails(order) {
    const container = document.getElementById('scanned-order-result');
    if (!container) return;

    container.classList.remove('hidden');

    const isPaid = order.paymentStatus === 'PAID';
    const isCompleted = order.orderStatus === 'COMPLETED';

    container.innerHTML = `
      <div class="p-5 rounded-3xl bg-gradient-to-br from-rose-50/50 to-white border-2 border-rose-300 shadow-md space-y-3">
        <div class="flex items-center justify-between border-b border-rose-100 pb-3">
          <div>
            <span class="text-xs font-bold text-slate-400 block uppercase">Verified Order</span>
            <h4 class="text-xl font-black text-rose-600 font-mono">${order.orderNumber}</h4>
          </div>
          <div class="text-right">
            <span class="px-3 py-1 rounded-full text-xs font-extrabold ${isCompleted ? 'bg-slate-100 text-slate-600' : 'bg-emerald-100 text-emerald-800 border border-emerald-300'}">
              ${isCompleted ? '✓ Already Collected' : order.orderStatus}
            </span>
          </div>
        </div>

        <div class="text-xs text-slate-600 space-y-1">
          <p>Customer: <strong class="text-slate-900">${order.customerName}</strong> ${order.customerPhone ? `(${order.customerPhone})` : ''}</p>
          <div class="p-3 bg-white rounded-xl border border-slate-200 mt-2 space-y-1">
            ${(order.items || []).map(i => `
              <div class="flex justify-between font-medium">
                <span>${i.name} × ${i.quantity}</span>
                <span class="font-bold text-slate-900 font-mono">₹${i.price * i.quantity}</span>
              </div>
            `).join('')}
            <div class="border-t border-slate-100 pt-1.5 flex justify-between font-black text-sm text-slate-900">
              <span>Total Amount:</span>
              <span class="text-rose-600 font-mono">₹${order.total}</span>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between p-3 rounded-xl ${isPaid ? 'bg-emerald-50 border border-emerald-200' : 'bg-amber-50 border border-amber-200'}">
          <div>
            <span class="text-[10px] font-bold uppercase ${isPaid ? 'text-emerald-600' : 'text-amber-600'}">Payment (${order.paymentMethod === 'upi' ? 'UPI' : 'Pay at Shop'})</span>
            <p class="text-xs font-extrabold ${isPaid ? 'text-emerald-800' : 'text-amber-800'}">
              ${isPaid ? '✓ Payment Received (PAID)' : '⏳ PENDING PAYMENT'}
            </p>
          </div>

          ${!isPaid ? `
            <button 
              type="button" 
              onclick="shopkeeperApp.markPaymentFromScanner('${order.id}')"
              class="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all"
            >
              Mark Payment Received
            </button>
          ` : ''}
        </div>

        <div class="pt-2">
          ${isCompleted ? `
            <div class="p-3 rounded-xl bg-slate-100 text-center text-slate-600 text-xs font-bold">
              ✓ Order ${order.orderNumber} has already been handed over and completed.
            </div>
          ` : `
            <button 
              type="button" 
              onclick="shopkeeperApp.completePickup('${order.id}')"
              class="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm shadow-lg shadow-emerald-500/25 active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
            >
              <span>🎉 Complete Pickup & Handover</span>
            </button>
          `}
        </div>
      </div>
    `;
  }

  async markPaymentFromScanner(orderId) {
    try {
      const res = await fetch(`/api/orders/${orderId}/payment`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ paymentStatus: 'PAID' })
      });
      const data = await res.json();
      if (data.success) {
        this.scannedOrder = data.order;
        this.renderScannedOrderDetails(data.order);
        window.appController.showToast('Payment marked as RECEIVED (PAID)', 'success');
      } else {
        throw new Error(data.error);
      }
    } catch (e) {
      window.appController.showToast(e.message, 'error');
    }
  }

  async completePickup(orderId) {
    try {
      const res = await fetch(`/api/orders/${orderId}/complete-pickup`, {
        method: 'POST',
        headers: this.getAuthHeaders()
      });
      const data = await res.json();
      if (data.success) {
        this.scannedOrder = data.order;
        this.renderScannedOrderDetails(data.order);
        window.appController.playSound('completed');
        window.appController.showConfetti();
        window.appController.showToast(`🎉 Order ${data.order.orderNumber} Completed Successfully!`, 'success');
      } else {
        throw new Error(data.error);
      }
    } catch (e) {
      window.appController.showToast(e.message, 'error');
    }
  }

  // --- SETTINGS ---

  populateSettingsForm() {
    const upiInput = document.getElementById('settings-upi-id');
    const nameInput = document.getElementById('settings-shop-name');
    const phoneInput = document.getElementById('settings-shop-phone');

    if (upiInput) upiInput.value = this.settings.upiId || 'suryaagencies@upi';
    if (nameInput) nameInput.value = this.settings.shopName || 'Surya Agencies';
    if (phoneInput) phoneInput.value = this.settings.shopPhone || '+91 98765 43210';
  }

  async saveSettings(e) {
    e.preventDefault();
    const upiId = document.getElementById('settings-upi-id').value.trim();
    const shopName = document.getElementById('settings-shop-name').value.trim();
    const shopPhone = document.getElementById('settings-shop-phone').value.trim();

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ upiId, shopName, shopPhone })
      });
      const data = await res.json();
      if (data.success) {
        this.settings = data.settings;
        window.appController.showToast('Shop Settings Saved!', 'success');
      }
    } catch (e) {
      window.appController.showToast(e.message, 'error');
    }
  }

  async loadSampleProducts() {
    if (!confirm('This will reload the authentic Arun Icecreams catalog for Surya Agencies. Proceed?')) return;
    try {
      const res = await fetch('/api/seed', { 
        method: 'POST',
        headers: this.getAuthHeaders()
      });
      const data = await res.json();
      if (data.success) {
        window.appController.showToast('Arun Icecreams catalog loaded!', 'success');
      }
    } catch (e) {
      window.appController.showToast(e.message, 'error');
    }
  }

  render() {
    if (!this.isAuthenticated) return;
    this.renderStats();
    this.renderOrders();
    this.renderProductsList();
    this.renderInventoryTable();
  }
}

window.shopkeeperApp = new ShopkeeperApp();
