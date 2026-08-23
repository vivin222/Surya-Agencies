/**
 * Shopkeeper Portal Logic — Surya Agencies
 * Live Orders Feed, Notification Bell & History, Stock Availability Filters, KPI Analytics, Add Product with Image Upload, and Revenue/Profit Reports
 */

class ShopkeeperApp {
  constructor() {
    this.orders = [];
    this.products = [];
    this.notifications = [];
    this.unreadNotificationsCount = 0;
    this.activeFilter = 'ALL';
    this.activeTab = 'orders'; // 'orders' | 'products' | 'reports' | 'settings'
    this.productSearchQuery = '';
    this.productCategoryFilter = 'ALL';
    this.productStockFilter = 'ALL'; // 'ALL' | 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK'
    this.reportsData = null;
    this.settings = {
      upiId: 'suryaagencies@upi',
      shopPhone: '+91 98400 12345',
      shopAddress: 'Surya Agencies, Main Road, Ice Cream & Dairy Junction'
    };

    this.init();
  }

  async init() {
    this.setupRealtimeListeners();
  }

  async initDashboard() {
    await this.fetchDashboardStats();
    await this.fetchOrders();
    await this.fetchProducts();
    await this.fetchSettings();
    this.render();
  }

  // --- REALTIME SOCKET.IO EVENT LISTENERS ---

  setupRealtimeListeners() {
    if (!window.socketClient) return;

    // 1. New Order Placed
    window.socketClient.on('order:created', (newOrder) => {
      this.orders.unshift(newOrder);
      
      const notif = {
        id: 'notif-' + Date.now(),
        type: 'ORDER_NEW',
        icon: '🛒',
        title: `New Order ${newOrder.orderNumber}`,
        message: `Placed by ${newOrder.customerName} (₹${newOrder.total} • ${newOrder.paymentMethod === 'upi' ? 'UPI' : 'Cash'})`,
        timestamp: new Date()
      };
      this.addNotification(notif);

      if (window.appController) {
        window.appController.playChime();
        window.appController.showToast(`🔔 Incoming Order ${newOrder.orderNumber} by ${newOrder.customerName} (₹${newOrder.total})`, 'info');
      }
      
      this.fetchDashboardStats();
      this.renderOrders();
      if (this.activeTab === 'reports') {
        this.fetchRevenueReports();
      }
    });

    // 2. Order Status Updated
    window.socketClient.on('order:status_updated', (updatedOrder) => {
      const idx = this.orders.findIndex(o => o.id === updatedOrder.id || o.orderNumber === updatedOrder.orderNumber);
      if (idx !== -1) {
        this.orders[idx] = { ...this.orders[idx], ...updatedOrder };
        this.renderOrders();
      }

      if (updatedOrder.orderStatus === 'READY_FOR_PICKUP') {
        this.addNotification({
          id: 'notif-' + Date.now(),
          type: 'ORDER_READY',
          icon: '🔔',
          title: `Order ${updatedOrder.orderNumber} Ready`,
          message: 'Marked ready for customer counter pickup',
          timestamp: new Date()
        });
      } else if (updatedOrder.orderStatus === 'COMPLETED') {
        this.addNotification({
          id: 'notif-' + Date.now(),
          type: 'ORDER_COMPLETED',
          icon: '✅',
          title: `Order ${updatedOrder.orderNumber} Completed`,
          message: `Handed to customer • Payment: ₹${updatedOrder.total}`,
          timestamp: new Date()
        });
      } else if (updatedOrder.orderStatus === 'CANCELLED') {
        this.addNotification({
          id: 'notif-' + Date.now(),
          type: 'ORDER_CANCELLED',
          icon: '❌',
          title: `Order ${updatedOrder.orderNumber} Cancelled`,
          message: 'Order was rejected or cancelled',
          timestamp: new Date()
        });
      }

      this.fetchDashboardStats();
      if (this.activeTab === 'reports') {
        this.fetchRevenueReports();
      }
    });

    // 3. New Product Created
    window.socketClient.on('product:created', (newProd) => {
      if (!newProd) return;
      const idx = this.products.findIndex(p => p.id === newProd.id);
      if (idx !== -1) {
        this.products[idx] = newProd;
      } else {
        this.products.unshift(newProd);
      }
      this.fetchDashboardStats();
      if (this.activeTab === 'products') {
        this.renderProductsTable();
      }
    });

    // 4. Product Updated
    window.socketClient.on('product:updated', (updatedProd) => {
      if (!updatedProd) return;
      const idx = this.products.findIndex(p => p.id === updatedProd.id);
      if (idx !== -1) {
        this.products[idx] = updatedProd;
      }
      this.fetchDashboardStats();
      if (this.activeTab === 'products') {
        this.renderProductsTable();
      }
    });

    // 5. Stock Batch Updated (With Low-Stock & Out-of-Stock Alerts)
    window.socketClient.on('products:stock_batch_updated', (updatedList) => {
      if (!Array.isArray(updatedList)) return;
      updatedList.forEach(updatedProd => {
        const idx = this.products.findIndex(p => p.id === updatedProd.id);
        if (idx !== -1) {
          this.products[idx] = { ...this.products[idx], ...updatedProd };
        }

        const stock = Math.max(0, parseInt(updatedProd.stock, 10) || 0);
        if (stock === 0) {
          this.addNotification({
            id: 'notif-out-' + updatedProd.id + '-' + Date.now(),
            type: 'STOCK_OUT',
            icon: '🔴',
            title: 'Out of Stock Alert',
            message: `"${updatedProd.name}" is now out of stock (0 units)!`,
            timestamp: new Date()
          });
        } else if (stock > 0 && stock <= 5) {
          this.addNotification({
            id: 'notif-low-' + updatedProd.id + '-' + Date.now(),
            type: 'STOCK_LOW',
            icon: '📦',
            title: 'Low Stock Warning',
            message: `"${updatedProd.name}" has only ${stock} unit(s) left!`,
            timestamp: new Date()
          });
        }
      });

      this.fetchDashboardStats();
      if (this.activeTab === 'products') {
        this.renderProductsTable();
      }
    });

    // 6. Settings Updated
    window.socketClient.on('settings:updated', (newSettings) => {
      if (newSettings) {
        this.settings = { ...this.settings, ...newSettings };
        this.populateSettingsForm();
      }
    });
  }

  // --- NOTIFICATION SYSTEM ENGINE ---

  addNotification(notif) {
    // Avoid duplicate notifications for same title & message within 5 seconds
    const isDuplicate = this.notifications.some(n => 
      n.title === notif.title && 
      n.message === notif.message && 
      (Date.now() - new Date(n.timestamp).getTime()) < 5000
    );

    if (!isDuplicate) {
      this.notifications.unshift(notif);
      this.unreadNotificationsCount += 1;
      this.updateNotificationsBadge();
      this.updateRecentActivity(notif);
    }
  }

  updateNotificationsBadge() {
    const badge = document.getElementById('shop-bell-badge');
    if (badge) {
      if (this.unreadNotificationsCount > 0) {
        badge.textContent = this.unreadNotificationsCount > 9 ? '9+' : this.unreadNotificationsCount;
        badge.classList.remove('hidden');
      } else {
        badge.classList.add('hidden');
      }
    }
  }

  updateRecentActivity(notif) {
    const textEl = document.getElementById('shop-recent-activity-text');
    if (textEl && notif) {
      textEl.textContent = `${notif.icon} ${notif.title}: ${notif.message}`;
    }
  }

  toggleNotificationsModal() {
    const modal = document.getElementById('shop-notifications-modal');
    if (modal) {
      if (modal.classList.contains('hidden')) {
        modal.classList.remove('hidden');
        this.renderNotifications();
        this.unreadNotificationsCount = 0;
        this.updateNotificationsBadge();
      } else {
        modal.classList.add('hidden');
      }
    }
  }

  closeNotificationsModal(event) {
    if (event && event.target !== event.currentTarget) return;
    const modal = document.getElementById('shop-notifications-modal');
    if (modal) modal.classList.add('hidden');
  }

  renderNotifications() {
    const container = document.getElementById('shop-notifications-list');
    if (!container) return;

    if (this.notifications.length === 0) {
      container.innerHTML = `
        <div class="text-center py-8 text-slate-400 dark:text-slate-500 text-xs font-semibold">
          <span class="text-2xl block mb-1.5">🔔</span>
          No new alerts. Incoming orders and stock warnings will appear here!
        </div>
      `;
      return;
    }

    container.innerHTML = this.notifications.map(n => `
      <div class="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-start space-x-3 text-xs">
        <span class="text-lg flex-shrink-0">${n.icon}</span>
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between gap-1">
            <h5 class="font-extrabold text-slate-900 dark:text-white truncate">${n.title}</h5>
            <span class="text-[10px] text-slate-400 dark:text-slate-500 font-mono">${new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <p class="text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">${n.message}</p>
        </div>
      </div>
    `).join('');
  }

  markAllNotificationsRead() {
    this.unreadNotificationsCount = 0;
    this.updateNotificationsBadge();
    if (window.appController) {
      window.appController.showToast('✓ All notifications marked as read', 'success');
    }
  }

  clearNotifications() {
    this.notifications = [];
    this.unreadNotificationsCount = 0;
    this.updateNotificationsBadge();
    this.renderNotifications();
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

  async fetchSettings() {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data.success && data.settings) {
        this.settings = { ...this.settings, ...data.settings };
        this.populateSettingsForm();
      }
    } catch (e) {}
  }

  async fetchRevenueReports() {
    try {
      const token = sessionStorage.getItem('surya_shopkeeper_token');
      const res = await fetch('/api/reports/revenue', {
        headers: { 'Authorization': `Bearer ${token}`, 'x-shopkeeper-verified': 'true' }
      });
      const data = await res.json();
      if (data.success && data.reports) {
        this.reportsData = data.reports;
        this.renderRevenueReports();
      }
    } catch (e) {
      console.error('Error fetching revenue reports:', e);
    }
  }

  populateSettingsForm() {
    const upiInput = document.getElementById('settings-upi-id');
    const phoneInput = document.getElementById('settings-shop-phone');
    const addressInput = document.getElementById('settings-shop-address');

    if (upiInput) upiInput.value = this.settings.upiId || 'suryaagencies@upi';
    if (phoneInput) phoneInput.value = this.settings.shopPhone || '';
    if (addressInput) addressInput.value = this.settings.shopAddress || '';
  }

  // --- TAB NAVIGATION (4 TABS) ---

  switchTab(tab) {
    this.activeTab = tab;

    const tabs = ['orders', 'products', 'reports', 'settings'];
    tabs.forEach(t => {
      const btn = document.getElementById(`shop-tab-${t}`);
      const view = document.getElementById(`shop-view-${t}`);

      if (t === tab) {
        if (btn) btn.className = 'px-3.5 sm:px-4 py-2 rounded-2xl bg-slate-900 dark:bg-rose-600 text-white font-extrabold text-xs shadow-sm transition-all flex items-center space-x-1.5 whitespace-nowrap';
        if (view) view.classList.remove('hidden');
      } else {
        if (btn) btn.className = 'px-3.5 sm:px-4 py-2 rounded-2xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 font-extrabold text-xs border border-slate-200 dark:border-slate-700 transition-all flex items-center space-x-1.5 whitespace-nowrap';
        if (view) view.classList.add('hidden');
      }
    });

    if (tab === 'orders') this.renderOrders();
    if (tab === 'products') this.renderProductsTable();
    if (tab === 'reports') this.fetchRevenueReports();
    if (tab === 'settings') this.populateSettingsForm();
  }

  // --- TAB 1: ORDERS RENDERING & STEPPERS ---

  filterOrders(filter) {
    this.activeFilter = filter;
    const buttons = document.querySelectorAll('.shop-filter-btn');
    buttons.forEach(btn => {
      if (btn.textContent.trim().toUpperCase().includes(filter.replace('_', ' '))) {
        btn.className = 'shop-filter-btn px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-900 text-white whitespace-nowrap';
      } else {
        btn.className = 'shop-filter-btn px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 whitespace-nowrap';
      }
    });
    this.renderOrders();
  }

  renderOrders() {
    const container = document.getElementById('shopkeeper-orders-list');
    const emptyEl = document.getElementById('shopkeeper-orders-empty');
    const badgeEl = document.getElementById('shop-active-orders-count');
    if (!container) return;

    let filtered = this.orders;
    if (this.activeFilter !== 'ALL') {
      filtered = this.orders.filter(o => o.orderStatus === this.activeFilter);
    }

    const activePending = this.orders.filter(o => ['NEW', 'ACCEPTED', 'PREPARING', 'READY_FOR_PICKUP'].includes(o.orderStatus)).length;
    if (badgeEl) badgeEl.textContent = activePending;

    if (filtered.length === 0) {
      container.innerHTML = '';
      if (emptyEl) emptyEl.classList.remove('hidden');
      return;
    }

    if (emptyEl) emptyEl.classList.add('hidden');

    container.innerHTML = filtered.map(order => {
      let parsedItems = [];
      try {
        parsedItems = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
      } catch (e) {
        parsedItems = [];
      }

      const isNew = order.orderStatus === 'NEW';
      const isAccepted = order.orderStatus === 'ACCEPTED';
      const isPreparing = order.orderStatus === 'PREPARING';
      const isReady = order.orderStatus === 'READY_FOR_PICKUP';
      const isCompleted = order.orderStatus === 'COMPLETED';
      const isCancelled = order.orderStatus === 'CANCELLED';

      return `
        <div class="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-3xl border ${isNew ? 'border-rose-400 ring-2 ring-rose-100 dark:ring-rose-950' : 'border-slate-200 dark:border-slate-700'} shadow-sm space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
            <div>
              <div class="flex items-center space-x-2">
                <span class="font-black text-slate-900 dark:text-white font-display text-base sm:text-lg">${order.orderNumber}</span>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-black ${
                  isReady ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 animate-pulse' :
                  isCompleted ? 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200' :
                  isCancelled ? 'bg-red-100 dark:bg-red-950/80 text-red-800 dark:text-red-300' :
                  'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300'
                }">
                  ${order.orderStatus.replace(/_/g, ' ')}
                </span>
                <span class="px-2 py-0.5 rounded text-[10px] font-bold ${order.paymentMethod === 'upi' ? 'bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300' : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'}">
                  ${order.paymentMethod === 'upi' ? '📱 UPI' : '💵 Pay at Shop'}
                </span>
              </div>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                Customer: <strong class="text-slate-800 dark:text-slate-200">${order.customerName}</strong> • Phone: ${order.customerPhone || 'N/A'} • ${new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>

            <div class="text-left sm:text-right">
              <span class="text-lg font-black text-rose-600 dark:text-rose-400 font-mono">₹${order.total}</span>
              <span class="text-[10px] text-slate-400 block font-semibold">${parsedItems.length} unique item(s)</span>
            </div>
          </div>

          <!-- Items Ordered Breakdown -->
          <div class="space-y-1.5 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
            ${parsedItems.map(item => `
              <div class="flex justify-between text-xs">
                <span class="font-bold text-slate-800 dark:text-slate-200">${item.name} <span class="text-slate-400 font-normal">(${item.packSize || 'Single'})</span></span>
                <span class="font-mono text-slate-700 dark:text-slate-300"><strong>${item.quantity}</strong> × ₹${item.price} = ₹${item.itemTotal || (item.price * item.quantity)}</span>
              </div>
            `).join('')}
          </div>

          <!-- Action Stepper Buttons -->
          <div class="flex flex-wrap items-center gap-2 pt-1">
            ${isNew ? `
              <button type="button" onclick="shopkeeperApp.updateOrderStatus('${order.id}', 'ACCEPTED')" class="px-3.5 py-1.5 rounded-xl bg-slate-900 dark:bg-rose-600 text-white font-bold text-xs shadow-sm hover:bg-slate-800 flex items-center space-x-1">
                <span>✓ Accept Order</span>
              </button>
              <button type="button" onclick="shopkeeperApp.updateOrderStatus('${order.id}', 'CANCELLED')" class="px-3 py-1.5 rounded-xl bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 font-bold text-xs hover:bg-red-100">
                <span>✕ Reject / Cancel</span>
              </button>
            ` : ''}

            ${isAccepted ? `
              <button type="button" onclick="shopkeeperApp.updateOrderStatus('${order.id}', 'PREPARING')" class="px-3.5 py-1.5 rounded-xl bg-amber-500 text-white font-bold text-xs shadow-sm hover:bg-amber-600 flex items-center space-x-1">
                <span>⚡ Mark as Preparing</span>
              </button>
            ` : ''}

            ${isPreparing ? `
              <button type="button" onclick="shopkeeperApp.updateOrderStatus('${order.id}', 'READY_FOR_PICKUP')" class="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-sm hover:bg-emerald-700 flex items-center space-x-1">
                <span>🔔 Mark Ready for Counter Pickup</span>
              </button>
            ` : ''}

            ${isReady ? `
              <button type="button" onclick="shopkeeperApp.updateOrderStatus('${order.id}', 'COMPLETED')" class="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 text-white font-black text-xs shadow-sm hover:from-emerald-700 hover:to-green-700 flex items-center space-x-1">
                <span>✓ Handed to Customer (Complete)</span>
              </button>
            ` : ''}

            ${isCompleted ? `
              <span class="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                <span>✓ Completed & Picked Up</span>
              </span>
            ` : ''}

            ${isCancelled ? `
              <span class="text-xs font-bold text-red-600 dark:text-red-400">✕ Cancelled Order</span>
            ` : ''}
          </div>
        </div>
      `;
    }).join('');
  }

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
        body: JSON.stringify({ orderStatus: newStatus })
      });

      const data = await res.json();
      if (data.success) {
        const idx = this.orders.findIndex(o => o.id === orderId);
        if (idx !== -1) {
          this.orders[idx].orderStatus = newStatus;
          this.renderOrders();
        }
        this.fetchDashboardStats();
        if (window.appController) {
          window.appController.showToast(`Order status updated to ${newStatus}`, 'success');
        }
      } else {
        alert(data.error || 'Failed to update order status');
      }
    } catch (e) {
      console.error('Error updating order:', e);
    }
  }

  // --- TAB 2: PRODUCT MANAGEMENT & STOCK EDITING ---

  searchProducts(query) {
    this.productSearchQuery = query.toLowerCase();
    this.renderProductsTable();
  }

  filterProductCategory(category) {
    this.productCategoryFilter = category;
    this.renderProductsTable();
  }

  filterProductStock(status) {
    this.productStockFilter = status;
    const filterSelect = document.getElementById('shop-product-stock-filter');
    if (filterSelect) filterSelect.value = status;
    this.renderProductsTable();
  }

  renderProductsTable() {
    const container = document.getElementById('shopkeeper-products-table');
    if (!container) return;

    let list = this.products;
    if (this.productSearchQuery) {
      list = list.filter(p => p.name.toLowerCase().includes(this.productSearchQuery) || p.category.toLowerCase().includes(this.productSearchQuery));
    }
    if (this.productCategoryFilter !== 'ALL') {
      list = list.filter(p => p.category === this.productCategoryFilter);
    }

    if (this.productStockFilter === 'IN_STOCK') {
      list = list.filter(p => p.stock > 0);
    } else if (this.productStockFilter === 'LOW_STOCK') {
      list = list.filter(p => p.stock > 0 && p.stock <= 5);
    } else if (this.productStockFilter === 'OUT_OF_STOCK') {
      list = list.filter(p => p.stock === 0);
    }

    if (list.length === 0) {
      container.innerHTML = `
        <div class="text-center py-12 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8">
          <span class="text-3xl block mb-2">📦</span>
          <h4 class="font-extrabold text-slate-800 dark:text-slate-200 text-sm">No products found</h4>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Try adjusting your category/stock filter or click "➕ Add New Product".</p>
        </div>
      `;
      return;
    }

    container.innerHTML = list.map(prod => {
      const stockInt = Math.max(0, parseInt(prod.stock, 10) || 0);
      const isOut = stockInt === 0;
      const isLowStock = stockInt > 0 && stockInt <= 5;

      return `
        <div class="bg-white dark:bg-slate-800 p-3.5 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3.5 hover:border-slate-300 dark:hover:border-slate-600 transition-all">
          <div class="flex items-center space-x-3 flex-1 min-w-0">
            <div class="relative group cursor-pointer flex-shrink-0" onclick="shopkeeperApp.openEditImageModal('${prod.id}')" title="Click to change image">
              <img src="${prod.image || '/assets/arun-vanilla-cup.jpg'}" alt="${prod.name}" class="w-14 h-14 object-contain rounded-2xl bg-slate-50 dark:bg-slate-900 p-1 border border-slate-200 dark:border-slate-700" />
              <div class="absolute inset-0 bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity">
                📷
              </div>
            </div>

            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-1.5 flex-wrap">
                <h4 class="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm truncate">${prod.name}</h4>
                <span class="px-2 py-0.5 rounded text-[9px] font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">${prod.category}</span>
                ${isOut 
                  ? '<span class="px-2 py-0.5 rounded-full text-[9px] font-black bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800">🔴 OUT OF STOCK</span>' 
                  : isLowStock 
                    ? `<span class="px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700">⚡ LOW STOCK (${stockInt} left)</span>`
                    : `<span class="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700">🟢 IN STOCK (${stockInt} units)</span>`
                }
              </div>
              <span class="text-[11px] text-slate-400 font-semibold block mt-0.5">${prod.packSize || 'Standard Pack'}</span>
            </div>
          </div>

          <!-- Price, Cost, and Stock Whole Integer Editor -->
          <div class="flex items-center gap-2 sm:gap-3 flex-wrap md:flex-nowrap justify-between md:justify-end">
            <!-- Selling Price Input -->
            <div class="w-24">
              <label class="text-[9px] font-bold text-slate-400 uppercase block">Selling Price</label>
              <div class="flex items-center rounded-xl border border-slate-300 dark:border-slate-600 px-2 py-1 bg-white dark:bg-slate-900 focus-within:ring-2 focus-within:ring-rose-500">
                <span class="text-xs text-slate-400 font-bold mr-1">₹</span>
                <input type="number" id="prod-price-${prod.id}" value="${prod.price || 0}" min="0" step="0.5" class="w-full text-xs font-black text-slate-900 dark:text-white bg-transparent focus:outline-none" />
              </div>
            </div>

            <!-- Cost Price Input -->
            <div class="w-24">
              <label class="text-[9px] font-bold text-slate-400 uppercase block" title="Used for net profit calculations">Cost Price</label>
              <div class="flex items-center rounded-xl border border-slate-300 dark:border-slate-600 px-2 py-1 bg-white dark:bg-slate-900 focus-within:ring-2 focus-within:ring-rose-500">
                <span class="text-xs text-slate-400 font-bold mr-1">₹</span>
                <input type="number" id="prod-cost-${prod.id}" value="${prod.costPrice !== null && prod.costPrice !== undefined ? prod.costPrice : ''}" placeholder="None" min="0" step="0.5" class="w-full text-xs font-medium text-slate-700 dark:text-slate-200 bg-transparent focus:outline-none" />
              </div>
            </div>

            <!-- Stock Integer Input -->
            <div class="w-20">
              <label class="text-[9px] font-bold text-slate-400 uppercase block">Units</label>
              <input type="number" id="prod-stock-${prod.id}" value="${stockInt}" min="0" step="1" class="w-full px-2 py-1 rounded-xl border border-slate-300 dark:border-slate-600 text-xs font-black text-slate-900 dark:text-white bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500" />
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center space-x-1.5 mt-auto">
              <button 
                type="button" 
                onclick="shopkeeperApp.saveProductChanges('${prod.id}')" 
                class="px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-rose-600 hover:bg-slate-800 text-white font-extrabold text-xs shadow-sm"
                title="Save Price, Cost, and Stock"
              >
                Save
              </button>

              <button 
                type="button" 
                onclick="shopkeeperApp.openEditImageModal('${prod.id}')" 
                class="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold text-xs"
                title="Update product photo"
              >
                🖼️ Image
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  async saveProductChanges(productId) {
    const priceInput = document.getElementById(`prod-price-${productId}`);
    const costInput = document.getElementById(`prod-cost-${productId}`);
    const stockInput = document.getElementById(`prod-stock-${productId}`);

    const newPrice = priceInput ? Number(priceInput.value) : null;
    const newCost = costInput && costInput.value.trim() !== '' ? Number(costInput.value) : null;
    const newStock = stockInput ? Math.max(0, parseInt(stockInput.value, 10) || 0) : 0;

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
          costPrice: newCost,
          stock: newStock
        })
      });

      const data = await res.json();
      if (data.success && data.product) {
        const idx = this.products.findIndex(p => p.id === productId);
        if (idx !== -1) {
          this.products[idx] = data.product;
        }
        if (window.appController) {
          window.appController.showToast(`✅ Updated ${data.product.name} (Stock: ${data.product.stock})`, 'success');
        }
        this.fetchDashboardStats();
      } else {
        alert(data.error || 'Failed to update product');
      }
    } catch (e) {
      console.error('Error updating product:', e);
    }
  }

  // --- ADD NEW PRODUCT MODAL & SUBMISSION ---

  openAddProductModal() {
    const modal = document.getElementById('add-product-modal');
    if (modal) {
      modal.classList.remove('hidden');
      const form = document.getElementById('add-product-form');
      if (form) form.reset();
      const preview = document.getElementById('new-prod-preview-img');
      if (preview) preview.src = '/assets/arun-vanilla-cup.jpg';
    }
  }

  closeAddProductModal(event) {
    if (event && event.target !== event.currentTarget) return;
    const modal = document.getElementById('add-product-modal');
    if (modal) modal.classList.add('hidden');
  }

  previewNewProductImage(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const preview = document.getElementById('new-prod-preview-img');
        if (preview) preview.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  async submitNewProduct(event) {
    event.preventDefault();
    const btn = document.getElementById('btn-save-new-product');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span>Saving & Publishing...</span>';
    }

    const name = document.getElementById('new-prod-name').value.trim();
    const category = document.getElementById('new-prod-category').value;
    const packSize = document.getElementById('new-prod-packsize').value.trim() || 'Standard Pack';
    const price = document.getElementById('new-prod-price').value;
    const costPrice = document.getElementById('new-prod-cost').value;
    const stock = Math.max(0, parseInt(document.getElementById('new-prod-stock').value, 10) || 0);
    const description = document.getElementById('new-prod-desc').value.trim();
    const fileInput = document.getElementById('new-prod-image-file');

    let imageUrl = '/assets/arun-vanilla-cup.jpg';

    if (category === 'Dairy Products') imageUrl = '/assets/arokya-milk.jpg';
    else if (category === 'Ice Cream Cones') imageUrl = '/assets/arun-cone.jpg';
    else if (category === 'Ice Cream Bars & Sticks') imageUrl = '/assets/arun-chocobar.jpg';
    else if (category === 'Ice Cream Cakes') imageUrl = '/assets/arun-icecream-cake.jpg';
    else if (category === 'Family Tubs & Packs') imageUrl = '/assets/arun-tub.jpg';
    else if (category === 'Sundaes & In-Store Specials') imageUrl = '/assets/arun-sundae.jpg';

    try {
      const token = sessionStorage.getItem('surya_shopkeeper_token');

      if (fileInput && fileInput.files && fileInput.files[0]) {
        const formData = new FormData();
        formData.append('image', fileInput.files[0]);

        const uploadRes = await fetch('/api/upload/image', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'x-shopkeeper-verified': 'true'
          },
          body: formData
        });
        const uploadData = await uploadRes.json();
        if (uploadData.success && uploadData.url) {
          imageUrl = uploadData.url;
        }
      }

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-shopkeeper-verified': 'true'
        },
        body: JSON.stringify({
          name,
          category,
          packSize,
          price: Number(price),
          costPrice: costPrice.trim() !== '' ? Number(costPrice) : null,
          stock: stock,
          available: stock > 0,
          description,
          image: imageUrl
        })
      });

      const data = await res.json();
      if (data.success && data.product) {
        this.products.unshift(data.product);
        this.closeAddProductModal();
        this.renderProductsTable();
        this.fetchDashboardStats();
        if (window.appController) {
          window.appController.showToast(`✅ Added ${data.product.name} to catalogue!`, 'success');
        }
      } else {
        alert(data.error || 'Failed to create product');
      }
    } catch (e) {
      console.error('Error creating product:', e);
      alert('Error connecting to server. Please try again.');
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '<span>✓ Save & Publish to Store</span>';
      }
    }
  }

  // --- EDIT PRODUCT IMAGE MODAL & SUBMISSION ---

  openEditImageModal(productId) {
    const prod = this.products.find(p => p.id === productId);
    if (!prod) return;

    const modal = document.getElementById('edit-product-image-modal');
    const idInput = document.getElementById('edit-img-prod-id');
    const nameEl = document.getElementById('edit-img-prod-name');
    const preview = document.getElementById('edit-img-preview');
    const fileInput = document.getElementById('edit-img-file-input');

    if (idInput) idInput.value = prod.id;
    if (nameEl) nameEl.textContent = prod.name;
    if (preview) preview.src = prod.image || '/assets/arun-vanilla-cup.jpg';
    if (fileInput) fileInput.value = '';

    if (modal) modal.classList.remove('hidden');
  }

  closeEditImageModal(event) {
    if (event && event.target !== event.currentTarget) return;
    const modal = document.getElementById('edit-product-image-modal');
    if (modal) modal.classList.add('hidden');
  }

  previewEditImage(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const preview = document.getElementById('edit-img-preview');
        if (preview) preview.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  async submitProductImageUpdate(event) {
    event.preventDefault();
    const btn = document.getElementById('btn-save-edit-image');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span>Uploading Image...</span>';
    }

    const productId = document.getElementById('edit-img-prod-id').value;
    const fileInput = document.getElementById('edit-img-file-input');

    if (!fileInput || !fileInput.files || !fileInput.files[0]) {
      alert('Please select an image file to upload.');
      if (btn) btn.disabled = false;
      return;
    }

    try {
      const token = sessionStorage.getItem('surya_shopkeeper_token');
      const formData = new FormData();
      formData.append('image', fileInput.files[0]);

      const uploadRes = await fetch('/api/upload/image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-shopkeeper-verified': 'true'
        },
        body: formData
      });
      const uploadData = await uploadRes.json();
      if (!uploadData.success || !uploadData.url) {
        throw new Error(uploadData.error || 'Failed to upload image file');
      }

      const patchRes = await fetch(`/api/products/${productId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-shopkeeper-verified': 'true'
        },
        body: JSON.stringify({ image: uploadData.url })
      });

      const patchData = await patchRes.json();
      if (patchData.success && patchData.product) {
        const idx = this.products.findIndex(p => p.id === productId);
        if (idx !== -1) {
          this.products[idx] = patchData.product;
        }
        this.closeEditImageModal();
        this.renderProductsTable();
        if (window.appController) {
          window.appController.showToast(`✅ Updated image for ${patchData.product.name}`, 'success');
        }
      } else {
        alert(patchData.error || 'Failed to update product image');
      }
    } catch (e) {
      console.error('Error updating image:', e);
      alert(e.message || 'Error updating product image');
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '<span>💾 Save & Broadcast Image</span>';
      }
    }
  }

  // --- TAB 3: REVENUE & REPORTS RENDERING (DARK CONTRAST FIX) ---

  renderRevenueReports() {
    if (!this.reportsData) return;
    const r = this.reportsData;

    const todayRev = document.getElementById('rep-today-rev');
    const todayOrders = document.getElementById('rep-today-orders');
    const weekRev = document.getElementById('rep-week-rev');
    const weekOrders = document.getElementById('rep-week-orders');
    const monthRev = document.getElementById('rep-month-rev');
    const monthOrders = document.getElementById('rep-month-orders');
    const totalProfit = document.getElementById('rep-total-profit');
    const profitSub = document.getElementById('rep-profit-sub');
    const cashSales = document.getElementById('rep-cash-sales');
    const upiSales = document.getElementById('rep-upi-sales');
    const prodCount = document.getElementById('rep-product-count');
    const tableContainer = document.getElementById('rep-products-table');

    if (todayRev) todayRev.textContent = `₹${r.today.revenue}`;
    if (todayOrders) todayOrders.textContent = `${r.today.ordersCount} completed order(s) today`;

    if (weekRev) weekRev.textContent = `₹${r.thisWeek.revenue}`;
    if (weekOrders) weekOrders.textContent = `${r.thisWeek.ordersCount} completed order(s) this week`;

    if (monthRev) monthRev.textContent = `₹${r.thisMonth.revenue}`;
    if (monthOrders) monthOrders.textContent = `${r.thisMonth.ordersCount} completed order(s) this month`;

    if (cashSales) cashSales.textContent = `₹${r.allTime.cashRevenue}`;
    if (upiSales) upiSales.textContent = `₹${r.allTime.upiRevenue}`;

    if (totalProfit) {
      const p = r.allTime.totalProfit;
      if (p >= 0) {
        totalProfit.textContent = `+₹${p}`;
        totalProfit.className = 'text-xl sm:text-3xl font-black text-emerald-700 dark:text-emerald-400 font-display mt-1 block';
      } else {
        totalProfit.textContent = `-₹${Math.abs(p)}`;
        totalProfit.className = 'text-xl sm:text-3xl font-black text-red-600 dark:text-red-400 font-display mt-1 block';
      }
    }

    if (profitSub) {
      if (r.allTime.totalUncostedSales > 0) {
        profitSub.textContent = `From costed products • ${r.allTime.totalUncostedSales} uncosted sale item(s)`;
      } else {
        profitSub.textContent = `Calculated across ${r.allTime.totalCostConfiguredSales} item sales`;
      }
    }

    if (prodCount) {
      prodCount.textContent = `${r.products ? r.products.length : 0} product(s) sold`;
    }

    if (tableContainer) {
      if (!r.products || r.products.length === 0) {
        tableContainer.innerHTML = `
          <div class="text-center py-8 text-slate-400 dark:text-slate-500 text-xs font-semibold">
            No product sales recorded yet. Completed orders will appear here automatically.
          </div>
        `;
        return;
      }

      tableContainer.innerHTML = `
        <div class="min-w-[580px]">
          <div class="grid grid-cols-12 gap-2 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-700 pb-2 px-2">
            <span class="col-span-5">Product & Category</span>
            <span class="col-span-2 text-center">Units Sold</span>
            <span class="col-span-2 text-right">Revenue (₹)</span>
            <span class="col-span-3 text-right">Estimated Profit</span>
          </div>

          <div class="space-y-1.5 pt-2">
            ${r.products.map((p, idx) => `
              <div class="grid grid-cols-12 gap-2 items-center p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/90 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-xs border border-slate-100 dark:border-slate-700/60">
                <div class="col-span-5 flex items-center space-x-2.5 min-w-0">
                  <span class="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-[10px] font-black flex items-center justify-center flex-shrink-0">${idx + 1}</span>
                  <img src="${p.image || '/assets/arun-vanilla-cup.jpg'}" alt="${p.name}" class="w-8 h-8 object-contain rounded-lg bg-white dark:bg-slate-900 p-0.5 border border-slate-200 dark:border-slate-700 flex-shrink-0" />
                  <div class="min-w-0 flex-1">
                    <span class="font-extrabold text-slate-900 dark:text-white truncate block text-xs">${p.name}</span>
                    <span class="text-[10px] text-slate-400 dark:text-slate-400 block">${p.category}</span>
                  </div>
                </div>

                <div class="col-span-2 text-center font-black text-slate-800 dark:text-slate-200">
                  ${p.totalQuantitySold}
                </div>

                <div class="col-span-2 text-right font-black text-rose-600 dark:text-rose-400 font-mono">
                  ₹${p.totalRevenue}
                </div>

                <div class="col-span-3 text-right">
                  ${p.hasCostPrice ? `
                    <span class="font-black ${p.totalProfit >= 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'} font-mono">
                      ${p.totalProfit >= 0 ? '+' : ''}₹${p.totalProfit}
                    </span>
                    <span class="text-[9px] text-slate-400 block">Cost: ₹${p.costPrice}/u</span>
                  ` : `
                    <span class="text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/70 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">No Cost Set</span>
                  `}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }
  }

  // --- TAB 4: SHOP & UPI SETTINGS ---

  async saveShopSettings(event) {
    event.preventDefault();
    const btn = document.getElementById('save-settings-btn');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span>Broadcasting Settings...</span>';
    }

    const upiId = document.getElementById('settings-upi-id').value.trim();
    const shopPhone = document.getElementById('settings-shop-phone').value.trim();
    const shopAddress = document.getElementById('settings-shop-address').value.trim();

    try {
      const token = sessionStorage.getItem('surya_shopkeeper_token');
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-shopkeeper-verified': 'true'
        },
        body: JSON.stringify({
          upiId: upiId || 'suryaagencies@upi',
          shopPhone: shopPhone,
          shopAddress: shopAddress
        })
      });

      const data = await res.json();
      if (data.success) {
        this.settings = { ...this.settings, upiId, shopPhone, shopAddress };
        if (window.appController) {
          window.appController.showToast('✅ Settings updated & broadcasted to all customer QR codes!', 'success');
        }
      } else {
        alert(data.error || 'Failed to save settings');
      }
    } catch (e) {
      console.error('Error saving settings:', e);
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '<span>💾 Save & Broadcast Settings</span>';
      }
    }
  }

  render() {
    this.switchTab(this.activeTab);
  }
}

window.shopkeeperApp = new ShopkeeperApp();
