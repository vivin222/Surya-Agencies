/**
 * Shopkeeper Portal Logic — Surya Agencies
 * Live Orders Feed, Status Steppers, KPI Analytics, and Product Price/Stock Manager
 */

class ShopkeeperApp {
  constructor() {
    this.orders = [];
    this.products = [];
    this.activeFilter = 'ALL';
    this.activeTab = 'orders'; // 'orders' | 'products'
    this.productSearchQuery = '';
    this.productCategoryFilter = 'ALL';

    this.init();
  }

  async init() {
    this.setupRealtimeListeners();
  }

  async initDashboard() {
    await this.fetchDashboardStats();
    await this.fetchOrders();
    await this.fetchProducts();
    this.render();
  }

  setupRealtimeListeners() {
    if (!window.socketClient) return;

    // Incoming customer order in real-time
    window.socketClient.on('order:created', (newOrder) => {
      this.orders.unshift(newOrder);
      if (window.appController) {
        window.appController.playChime();
        window.appController.showToast(`🔔 Incoming Order ${newOrder.orderNumber} by ${newOrder.customerName} (₹${newOrder.total})`, 'info');
      }
      this.fetchDashboardStats();
      this.renderOrders();
    });

    // Real-time status update
    window.socketClient.on('order:status_updated', (updatedOrder) => {
      const idx = this.orders.findIndex(o => o.id === updatedOrder.id || o.orderNumber === updatedOrder.orderNumber);
      if (idx !== -1) {
        this.orders[idx] = { ...this.orders[idx], ...updatedOrder };
        this.renderOrders();
      }
      this.fetchDashboardStats();
    });

    // Real-time stock / product updates
    window.socketClient.on('products:stock_batch_updated', (updatedList) => {
      if (!Array.isArray(updatedList)) return;
      updatedList.forEach(updatedProd => {
        const idx = this.products.findIndex(p => p.id === updatedProd.id);
        if (idx !== -1) {
          this.products[idx] = { ...this.products[idx], ...updatedProd };
        }
      });
      this.fetchDashboardStats();
      if (this.activeTab === 'products') {
        this.renderProductsTable();
      }
    });
  }

  // --- API CALLS ---

  async fetchDashboardStats() {
    try {
      const token = sessionStorage.getItem('surya_shopkeeper_token');
      const res = await fetch('/api/stats/dashboard', {
        headers: { 'Authorization': `Bearer ${token}`, 'x-shopkeeper-verified': 'true' }
      });
      const data = await res.json();
      if (data.success && data.stats) {
        const s = data.stats;
        const kpiOrders = document.getElementById('shop-kpi-orders');
        const kpiPending = document.getElementById('shop-kpi-pending');
        const kpiRevenue = document.getElementById('shop-kpi-revenue');
        const kpiStock = document.getElementById('shop-kpi-stock');

        if (kpiOrders) kpiOrders.textContent = s.totalProducts ? s.newOrders + s.ordersPreparing + s.ordersReady + s.ordersCompleted : 0;
        if (kpiPending) kpiPending.textContent = s.newOrders + s.ordersPreparing + s.ordersReady;
        if (kpiRevenue) kpiRevenue.textContent = `₹${s.totalRevenue}`;
        
        // Count low stock items from products
        const lowStockCount = this.products.filter(p => p.stock <= 5).length;
        if (kpiStock) kpiStock.textContent = lowStockCount;
      }
    } catch (e) {}
  }

  async fetchOrders() {
    try {
      const token = sessionStorage.getItem('surya_shopkeeper_token');
      const res = await fetch('/api/orders', {
        headers: { 'Authorization': `Bearer ${token}`, 'x-shopkeeper-verified': 'true' }
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.orders)) {
        this.orders = data.orders;
        this.renderOrders();
      }
    } catch (e) {
      console.error('Error fetching orders:', e);
    }
  }

  async fetchProducts() {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.success && Array.isArray(data.products)) {
        this.products = data.products;
        if (this.activeTab === 'products') {
          this.renderProductsTable();
        }
      }
    } catch (e) {
      console.error('Error fetching products:', e);
    }
  }

  // --- TAB SWITCHING ---

  switchTab(tab) {
    this.activeTab = tab;
    const tabOrders = document.getElementById('shop-tab-orders');
    const tabProducts = document.getElementById('shop-tab-products');
    const viewOrders = document.getElementById('shop-view-orders');
    const viewProducts = document.getElementById('shop-view-products');

    if (tab === 'orders') {
      tabOrders.className = 'px-4 py-2 rounded-2xl bg-slate-900 text-white font-extrabold text-xs shadow-sm transition-all flex items-center space-x-2';
      tabProducts.className = 'px-4 py-2 rounded-2xl bg-white text-slate-700 hover:bg-slate-100 font-extrabold text-xs border border-slate-200 transition-all flex items-center space-x-2';
      viewOrders.classList.remove('hidden');
      viewProducts.classList.add('hidden');
      this.renderOrders();
    } else {
      tabOrders.className = 'px-4 py-2 rounded-2xl bg-white text-slate-700 hover:bg-slate-100 font-extrabold text-xs border border-slate-200 transition-all flex items-center space-x-2';
      tabProducts.className = 'px-4 py-2 rounded-2xl bg-slate-900 text-white font-extrabold text-xs shadow-sm transition-all flex items-center space-x-2';
      viewOrders.classList.add('hidden');
      viewProducts.classList.remove('hidden');
      this.renderProductsTable();
    }
  }

  filterOrders(status) {
    this.activeFilter = status;
    const buttons = document.querySelectorAll('.shop-filter-btn');
    buttons.forEach(btn => {
      if (btn.textContent.trim().toUpperCase() === status.replace(/_/g, ' ') || (status === 'ALL' && btn.textContent.trim() === 'All Orders')) {
        btn.className = 'shop-filter-btn px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-900 text-white';
      } else {
        btn.className = 'shop-filter-btn px-3 py-1.5 rounded-xl text-xs font-bold bg-white text-slate-700 border border-slate-200';
      }
    });
    this.renderOrders();
  }

  // --- RENDERING ORDERS ---

  render() {
    this.renderOrders();
    this.renderProductsTable();
  }

  renderOrders() {
    const container = document.getElementById('shopkeeper-orders-list');
    const emptyEl = document.getElementById('shopkeeper-orders-empty');
    const activeCountBadge = document.getElementById('shop-active-orders-count');
    if (!container) return;

    const filtered = this.orders.filter(o => {
      if (this.activeFilter === 'ALL') return true;
      return o.orderStatus === this.activeFilter;
    });

    const activeCount = this.orders.filter(o => o.orderStatus !== 'COMPLETED' && o.orderStatus !== 'CANCELLED').length;
    if (activeCountBadge) activeCountBadge.textContent = activeCount;

    if (filtered.length === 0) {
      container.innerHTML = '';
      if (emptyEl) emptyEl.classList.remove('hidden');
      return;
    }

    if (emptyEl) emptyEl.classList.add('hidden');

    const statusBadgeColors = {
      'NEW': 'bg-blue-100 text-blue-800 border-blue-200',
      'ACCEPTED': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'PREPARING': 'bg-amber-100 text-amber-800 border-amber-200',
      'READY_FOR_PICKUP': 'bg-emerald-100 text-emerald-800 border-emerald-300 font-black animate-pulse',
      'COMPLETED': 'bg-slate-100 text-slate-700 border-slate-200',
      'CANCELLED': 'bg-rose-100 text-rose-800 border-rose-200'
    };

    container.innerHTML = filtered.map(order => {
      const badgeColor = statusBadgeColors[order.orderStatus] || 'bg-slate-100 text-slate-700';

      return `
        <div class="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm hover:border-slate-300 transition-all space-y-4">
          <!-- Order Top Header -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div class="flex items-center gap-3">
              <span class="font-black text-lg text-slate-900 font-display">${order.orderNumber}</span>
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${badgeColor}">
                ${order.orderStatus}
              </span>
              <span class="text-xs font-semibold text-slate-400">
                ${new Date(order.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            <div class="text-right">
              <span class="text-xs font-bold text-slate-500">Customer:</span>
              <span class="text-xs font-black text-slate-900 ml-1">${order.customerName}</span>
              ${order.customerPhone ? `<span class="text-xs text-slate-500 ml-1">(${order.customerPhone})</span>` : ''}
            </div>
          </div>

          <!-- Items Ordered -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            ${order.items.map(item => `
              <div class="flex items-center justify-between p-2 bg-slate-50 rounded-xl">
                <span class="font-medium text-slate-800">${item.name} (${item.packSize}) × ${item.quantity}</span>
                <span class="font-mono font-bold text-slate-900">₹${item.itemTotal || (item.price * item.quantity)}</span>
              </div>
            `).join('')}
          </div>

          <!-- Order Footer & Action Controls -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100 pt-3">
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold text-slate-500">Payment:</span>
              <span class="px-2 py-0.5 rounded text-[10px] font-black ${order.paymentMethod === 'upi' ? 'bg-purple-100 text-purple-800' : 'bg-emerald-100 text-emerald-800'}">
                ${order.paymentMethod === 'upi' ? 'UPI Payment' : 'Pay at Shop'} (${order.paymentStatus})
              </span>
              <span class="text-base font-black text-slate-900 font-mono ml-2">Total: ₹${order.total}</span>
            </div>

            <!-- Status Control Buttons -->
            <div class="flex items-center gap-2 flex-wrap">
              ${order.orderStatus === 'NEW' ? `
                <button type="button" onclick="shopkeeperApp.updateOrderStatus('${order.id}', 'ACCEPTED')" class="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm">
                  Accept Order
                </button>
              ` : ''}

              ${order.orderStatus === 'ACCEPTED' ? `
                <button type="button" onclick="shopkeeperApp.updateOrderStatus('${order.id}', 'PREPARING')" class="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm">
                  Start Preparing
                </button>
              ` : ''}

              ${order.orderStatus === 'PREPARING' ? `
                <button type="button" onclick="shopkeeperApp.updateOrderStatus('${order.id}', 'READY_FOR_PICKUP')" class="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-sm">
                  ✓ Mark Ready for Pickup
                </button>
              ` : ''}

              ${order.orderStatus === 'READY_FOR_PICKUP' ? `
                <button type="button" onclick="shopkeeperApp.updateOrderStatus('${order.id}', 'COMPLETED')" class="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs shadow-sm">
                  ✓ Complete Pickup
                </button>
              ` : ''}

              ${order.orderStatus !== 'COMPLETED' && order.orderStatus !== 'CANCELLED' ? `
                <button type="button" onclick="shopkeeperApp.cancelOrder('${order.id}')" class="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200">
                  Cancel
                </button>
              ` : ''}
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // --- ORDER STATUS ACTIONS ---

  async updateOrderStatus(orderId, newStatus) {
    try {
      const token = sessionStorage.getItem('surya_shopkeeper_token');
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-shopkeeper-verified': 'true'
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to update order status');

      if (window.appController) window.appController.showToast(`Order status updated to ${newStatus}`, 'success');
      await this.fetchOrders();
      await this.fetchDashboardStats();

    } catch (err) {
      if (window.appController) window.appController.showToast(err.message, 'error');
    }
  }

  async cancelOrder(orderId) {
    if (!confirm('Are you sure you want to cancel this order? Stock will be automatically returned to inventory.')) return;
    await this.updateOrderStatus(orderId, 'CANCELLED');
  }

  // --- PRODUCT & PRICE MANAGEMENT ---

  searchProducts(query) {
    this.productSearchQuery = (query || '').toLowerCase().trim();
    this.renderProductsTable();
  }

  filterProductCategory(category) {
    this.productCategoryFilter = category;
    this.renderProductsTable();
  }

  renderProductsTable() {
    const container = document.getElementById('shopkeeper-products-table');
    if (!container) return;

    const filtered = this.products.filter(p => {
      const matchesCat = this.productCategoryFilter === 'ALL' || p.category === this.productCategoryFilter;
      const matchesSearch = !this.productSearchQuery || 
        p.name.toLowerCase().includes(this.productSearchQuery) || 
        (p.packSize && p.packSize.toLowerCase().includes(this.productSearchQuery)) ||
        (p.category && p.category.toLowerCase().includes(this.productSearchQuery));

      return matchesCat && matchesSearch;
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="text-center py-12 bg-white rounded-3xl border border-slate-200 p-6">
          <p class="text-xs text-slate-500 font-bold">No products match your filter.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(p => {
      return `
        <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <!-- Product Info -->
          <div class="flex items-center space-x-3 w-full md:w-1/3">
            <img src="${p.image || '/assets/arun-vanilla-cup.jpg'}" alt="${p.name}" class="w-12 h-12 object-contain bg-slate-50 rounded-xl p-1 border border-slate-100" />
            <div>
              <h5 class="font-extrabold text-slate-900 text-xs leading-tight line-clamp-1">${p.name}</h5>
              <div class="flex items-center gap-1 mt-0.5">
                <span class="px-1.5 py-0.5 rounded text-[9px] font-black bg-slate-100 text-slate-600">${p.packSize || 'Pack'}</span>
                <span class="text-[10px] text-slate-400 font-semibold">${p.category}</span>
              </div>
            </div>
          </div>

          <!-- Price & Stock Editable Fields -->
          <div class="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            <div>
              <label class="block text-[9px] uppercase font-bold text-slate-400">Selling Price (₹)</label>
              <input 
                type="number" 
                id="edit-price-${p.id}" 
                value="${p.price !== null ? p.price : ''}" 
                placeholder="Not set" 
                class="w-24 px-2.5 py-1.5 rounded-xl border border-slate-300 text-xs font-black text-slate-900 focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label class="block text-[9px] uppercase font-bold text-slate-400">Stock Units</label>
              <input 
                type="number" 
                id="edit-stock-${p.id}" 
                value="${p.stock}" 
                min="0" 
                class="w-20 px-2.5 py-1.5 rounded-xl border border-slate-300 text-xs font-black text-slate-900 focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label class="block text-[9px] uppercase font-bold text-slate-400">Status</label>
              <select id="edit-avail-${p.id}" class="px-2 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700">
                <option value="1" ${p.available ? 'selected' : ''}>Available</option>
                <option value="0" ${!p.available ? 'selected' : ''}>Unavailable</option>
              </select>
            </div>
          </div>

          <!-- Save Button -->
          <div>
            <button 
              type="button" 
              onclick="shopkeeperApp.saveProductChanges('${p.id}')"
              class="w-full md:w-auto px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-sm"
            >
              Save
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  async saveProductChanges(productId) {
    const priceInput = document.getElementById(`edit-price-${productId}`);
    const stockInput = document.getElementById(`edit-stock-${productId}`);
    const availSelect = document.getElementById(`edit-avail-${productId}`);

    const newPrice = priceInput.value.trim() === '' ? null : Number(priceInput.value);
    const newStock = parseInt(stockInput.value, 10) || 0;
    const isAvail = availSelect.value === '1';

    try {
      const token = sessionStorage.getItem('surya_shopkeeper_token');
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-shopkeeper-verified': 'true'
        },
        body: JSON.stringify({
          price: newPrice,
          stock: newStock,
          available: isAvail
        })
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to update product');

      if (window.appController) window.appController.showToast(`Updated ${data.product.name} successfully!`, 'success');
      await this.fetchProducts();
      await this.fetchDashboardStats();

    } catch (err) {
      if (window.appController) window.appController.showToast(err.message, 'error');
    }
  }
}

window.shopkeeperApp = new ShopkeeperApp();
