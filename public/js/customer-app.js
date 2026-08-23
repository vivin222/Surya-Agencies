/**
 * Customer Store Application — Surya Agencies
 * 95+ Product Catalog, Automatic Stock Availability, Cart Persistence,
 * Large High-Contrast UPI Payment QR, Digital Order Ticket QR & 5-Step Live Order Timeline
 */

class CustomerApp {
  constructor() {
    this.products = [];
    this.categories = [];
    this.selectedCategory = 'ALL';
    this.searchQuery = '';
    this.cart = this.loadCartFromStorage();
    this.activeOrder = null;
    this.myOrders = [];
    this.currentView = 'catalog'; // 'catalog' | 'tracking' | 'orders'
    this.isSubmittingOrder = false;
    this.upiId = 'suryaagencies@upi';

    this.init();
  }

  async init() {
    this.setupRealtimeListeners();
    this.setupHashRouting();
    await this.fetchProducts();
    await this.fetchSettings();
    this.render();
    this.updateCartBadge();
  }

  // --- HASH ROUTING FOR DIRECT QR TICKET SCANNING ---

  setupHashRouting() {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#order/')) {
        const orderNum = hash.replace('#order/', '').trim();
        this.fetchAndDisplayOrder(orderNum);
      }
    };

    window.addEventListener('hashchange', handleHash);
    if (window.location.hash.startsWith('#order/')) {
      setTimeout(handleHash, 200);
    }
  }

  async fetchAndDisplayOrder(orderNum) {
    try {
      const res = await fetch(`/api/orders/lookup/${encodeURIComponent(orderNum)}`);
      const data = await res.json();
      if (data.success && data.order) {
        this.activeOrder = data.order;
        if (window.appController) window.appController.showCustomerPortal();
        this.showTrackingView();
      }
    } catch (e) {
      console.warn('Could not fetch direct order from hash:', e);
    }
  }

  // --- CART PERSISTENCE (LOCALSTORAGE) ---

  loadCartFromStorage() {
    try {
      const saved = localStorage.getItem('surya_customer_cart_v2');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  }

  saveCartToStorage() {
    try {
      localStorage.setItem('surya_customer_cart_v2', JSON.stringify(this.cart));
    } catch (e) {}
    this.updateCartBadge();
    this.renderFloatingCartBar();
  }

  // --- REAL-TIME LISTENERS ---

  setupRealtimeListeners() {
    if (!window.socketClient) return;

    // Live Stock & Availability Sync
    window.socketClient.on('products:stock_batch_updated', (updatedList) => {
      if (!Array.isArray(updatedList)) return;
      let hasChanges = false;

      updatedList.forEach(updatedProd => {
        const idx = this.products.findIndex(p => p.id === updatedProd.id);
        if (idx !== -1) {
          this.products[idx] = { ...this.products[idx], ...updatedProd };
          hasChanges = true;
        }

        // Adjust cart if stock became lower than cart quantity
        const cartItem = this.cart.find(c => c.productId === updatedProd.id);
        if (cartItem && (!updatedProd.available || updatedProd.stock <= 0)) {
          this.cart = this.cart.filter(c => c.productId !== updatedProd.id);
          this.saveCartToStorage();
          if (window.appController) {
            window.appController.showToast(`"${updatedProd.name}" went out of stock and was removed from cart`, 'info');
          }
        }
      });

      if (hasChanges && this.currentView === 'catalog') {
        this.renderProductsGrid();
      }
    });

    window.socketClient.on('product:updated', (prod) => {
      const idx = this.products.findIndex(p => p.id === prod.id);
      if (idx !== -1) {
        this.products[idx] = prod;
        if (this.currentView === 'catalog') this.renderProductsGrid();
      }
    });

    window.socketClient.on('product:created', (prod) => {
      this.products.unshift(prod);
      this.extractCategories();
      if (this.currentView === 'catalog') {
        this.renderCategoriesBar();
        this.renderProductsGrid();
      }
    });

    // Real-Time Order Timeline Status Updater
    const handleStatusUpdate = (order) => {
      if (this.activeOrder && (this.activeOrder.id === order.id || this.activeOrder.orderNumber === order.orderNumber)) {
        this.activeOrder = { ...this.activeOrder, ...order };
        if (this.currentView === 'tracking') {
          this.renderTrackingView();
        }
        if (window.appController) {
          window.appController.playChime();
          window.appController.showToast(`🔔 Order ${order.orderNumber} Status: ${order.orderStatus.replace(/_/g, ' ')}`, 'info');
        }
      }

      // Update in My Orders list
      const mIdx = this.myOrders.findIndex(o => o.id === order.id || o.orderNumber === order.orderNumber);
      if (mIdx !== -1) {
        this.myOrders[mIdx] = { ...this.myOrders[mIdx], ...order };
        if (this.currentView === 'orders') this.renderOrdersView();
      }
    };

    window.socketClient.on('order:status_updated', handleStatusUpdate);
    window.socketClient.on('order:my_status_updated', handleStatusUpdate);

    window.socketClient.on('settings:updated', (s) => {
      if (s && s.upiId) this.upiId = s.upiId;
    });
  }

  // --- API DATA FETCHING ---

  async refreshProducts() {
    await this.fetchProducts();
    this.render();
  }

  async fetchProducts() {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.success && Array.isArray(data.products)) {
        this.products = data.products;
        this.extractCategories();
      }
    } catch (e) {
      console.error('Error fetching products:', e);
    }
  }

  async fetchSettings() {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data.success && data.settings && data.settings.upiId) {
        this.upiId = data.settings.upiId;
      }
    } catch (e) {}
  }

  extractCategories() {
    const cats = new Set();
    this.products.forEach(p => {
      if (p.category) cats.add(p.category);
    });
    this.categories = Array.from(cats);
  }

  // --- CATALOG FILTERING & RENDERING ---

  setCategory(category) {
    this.selectedCategory = category;
    const titleEl = document.getElementById('current-category-title');
    if (titleEl) {
      titleEl.textContent = category === 'ALL' ? 'All Products' : category;
    }
    this.renderCategoriesBar();
    this.renderProductsGrid();
  }

  setSearchQuery(query) {
    this.searchQuery = query.trim().toLowerCase();
    this.renderProductsGrid();
  }

  getFilteredProducts() {
    return this.products.filter(p => {
      const matchesCategory = this.selectedCategory === 'ALL' || p.category === this.selectedCategory;
      const matchesSearch = !this.searchQuery || 
        p.name.toLowerCase().includes(this.searchQuery) ||
        (p.category && p.category.toLowerCase().includes(this.searchQuery)) ||
        (p.description && p.description.toLowerCase().includes(this.searchQuery));
      return matchesCategory && matchesSearch;
    });
  }

    renderCategoriesBar() {
    const container = document.getElementById('customer-categories-bar');
    if (!container) return;

    const allActive = this.selectedCategory === 'ALL';
    const allPill = `
      <button 
        type="button" 
        onclick="customerApp.setCategory('ALL')" 
        class="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs sm:text-sm font-black whitespace-nowrap transition-all flex items-center space-x-2 border shadow-xs ${
          allActive 
            ? 'bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-600/25' 
            : 'bg-white/80 dark:bg-slate-800/60 backdrop-blur-sm text-slate-700 dark:text-slate-200 border-slate-200/90 dark:border-slate-700/80 hover:border-rose-400 hover:bg-white dark:hover:bg-slate-800'
        }"
      >
        <span>🍨 All Products</span>
        <span class="px-1.5 py-0.5 rounded-full text-[10px] font-mono font-black ${allActive ? 'bg-white/25 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}">${this.products.length}</span>
      </button>
    `;

    const catPills = this.categories.map(cat => {
      const count = this.products.filter(p => p.category === cat).length;
      const isActive = this.selectedCategory === cat;
      return `
        <button 
          type="button" 
          onclick="customerApp.setCategory('${cat}')" 
          class="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs sm:text-sm font-black whitespace-nowrap transition-all flex items-center space-x-2 border shadow-xs ${
            isActive 
              ? 'bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-600/25' 
              : 'bg-white/80 dark:bg-slate-800/60 backdrop-blur-sm text-slate-700 dark:text-slate-200 border-slate-200/90 dark:border-slate-700/80 hover:border-rose-400 hover:bg-white dark:hover:bg-slate-800'
          }"
        >
          <span>${this.getCategoryIcon(cat)} ${cat}</span>
          <span class="px-1.5 py-0.5 rounded-full text-[10px] font-mono font-black ${isActive ? 'bg-white/25 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}">${count}</span>
        </button>
      `;
    }).join('');

    container.innerHTML = allPill + catPills;
  }

    getCategoryIcon(cat) {
    if (!cat) return '🍨';
    const c = cat.toLowerCase();
    if (c.includes('dairy') || c.includes('milk') || c.includes('curd') || c.includes('paneer') || c.includes('ghee') || c.includes('butter')) return '🥛';
    if (c.includes('cone')) return '🍦';
    if (c.includes('bar') || c.includes('stick')) return '🍫';
    if (c.includes('cup') || c.includes('duet')) return '🍨';
    if (c.includes('tub') || c.includes('pack') || c.includes('family')) return '📦';
    if (c.includes('cake')) return '🍰';
    if (c.includes('sundae') || c.includes('special')) return '🍧';
    if (c.includes('novelty') || c.includes('slice')) return '🍭';
    return '🍨';
  }

  renderProductCardHtml(p) {
    const stockInt = Math.max(0, parseInt(p.stock, 10) || 0);
    const minThresh = parseInt(p.minThreshold, 10) || 5;
    const isManuallyOff = !p.available;
    const isOutOfStock = stockInt === 0;
    const isOrderable = p.available && stockInt > 0;
    const isLowStock = isOrderable && stockInt <= minThresh;
    const cartItem = this.cart.find(c => c.productId === p.id);
    const cartQty = cartItem ? cartItem.quantity : 0;
    const hasPrice = p.price !== null && p.price !== undefined;

    let stockBadge = '';
    if (isManuallyOff) {
      stockBadge = `<span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800">🔴 NOT AVAILABLE</span>`;
    } else if (isOutOfStock) {
      stockBadge = `<span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800">🔴 OUT OF STOCK</span>`;
    } else if (isLowStock) {
      stockBadge = `<span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700">⚡ Only ${stockInt} left</span>`;
    } else {
      stockBadge = `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700">🟢 AVAILABLE</span>`;
    }

    const imageUrl = p.image || '/assets/arun-vanilla-cup.jpg';

    return `
      <div class="product-card">
        <div class="p-2 sm:p-2.5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
          <span class="text-[10px] font-bold text-slate-400 dark:text-slate-400 truncate max-w-[90px] sm:max-w-none">${p.category || 'Surya'}</span>
          ${stockBadge}
        </div>

        <div class="product-image-box">
          <img src="${imageUrl}" alt="${p.name}" loading="lazy" class="product-img" onerror="this.src='/assets/arun-vanilla-cup.jpg'" />
          ${p.packSize ? `<span class="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-lg bg-slate-900/80 backdrop-blur-xs text-white text-[9px] font-extrabold">${p.packSize}</span>` : ''}
        </div>

        <div class="p-3 sm:p-3.5 flex flex-col justify-between flex-1 space-y-2">
          <div>
            <h4 class="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white leading-tight line-clamp-2" title="${p.name}">${p.name}</h4>
          </div>

          <div class="pt-1 flex items-center justify-between gap-1.5 mt-auto">
            <div>
              <span class="text-[10px] text-slate-400 block font-bold">PRICE</span>
              <span class="text-sm sm:text-base font-black text-rose-600 dark:text-rose-400 font-mono">
                ${hasPrice ? `₹${p.price}` : '<span class="text-xs text-slate-400">N/A</span>'}
              </span>
            </div>

            <div class="flex-shrink-0">
              ${!isOrderable ? `
                <button type="button" disabled class="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 text-[10px] sm:text-xs font-extrabold cursor-not-allowed">
                  Unavailable
                </button>
              ` : cartQty > 0 ? `
                <div class="flex items-center space-x-1 bg-rose-600 text-white rounded-xl p-0.5 shadow-sm">
                  <button type="button" onclick="customerApp.decrementCart('${p.id}')" class="w-6 h-6 rounded-lg bg-rose-700 hover:bg-rose-800 font-black text-xs flex items-center justify-center transition-all">−</button>
                  <span class="text-xs font-black font-mono w-5 text-center">${cartQty}</span>
                  <button type="button" onclick="customerApp.incrementCart('${p.id}')" class="w-6 h-6 rounded-lg bg-rose-700 hover:bg-rose-800 font-black text-xs flex items-center justify-center transition-all">+</button>
                </div>
              ` : `
                <button type="button" onclick="customerApp.addToCart('${p.id}')" class="px-2.5 sm:px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-[11px] sm:text-xs shadow-sm shadow-rose-600/20 active:scale-95 transition-all flex items-center space-x-1">
                  <span>+ Add</span>
                </button>
              `}
            </div>
          </div>
        </div>
      </div>
    `;
  }

    renderProductsGrid() {
    const container = document.getElementById('customer-products-grid');
    const emptyEl = document.getElementById('customer-empty-products');
    const countEl = document.getElementById('current-category-count');
    if (!container) return;

    const items = this.getFilteredProducts();

    if (countEl) {
      countEl.textContent = `Showing ${items.length} product${items.length !== 1 ? 's' : ''}`;
    }

    if (items.length === 0) {
      container.innerHTML = '';
      if (emptyEl) emptyEl.classList.remove('hidden');
      return;
    }

    if (emptyEl) emptyEl.classList.add('hidden');

    // Render all product cards in full-width responsive grid
    container.innerHTML = items.map(p => this.renderProductCardHtml(p)).join('');
  }

  // --- CART OPERATIONS ---

  addToCart(productId, qty = 1) {
    const prod = this.products.find(p => p.id === productId);
    if (!prod || !prod.available || prod.stock <= 0) {
      if (window.appController) window.appController.showToast('Item is currently not available', 'error');
      return;
    }

    const existingIndex = this.cart.findIndex(c => c.productId === productId);
    if (existingIndex !== -1) {
      if (this.cart[existingIndex].quantity + qty > prod.stock) {
        if (window.appController) window.appController.showToast(`Only ${prod.stock} units available in parlour`, 'error');
        return;
      }
      this.cart[existingIndex].quantity += qty;
    } else {
      this.cart.push({
        productId: prod.id,
        name: prod.name,
        packSize: prod.packSize || '',
        price: prod.price || 0,
        image: prod.image,
        quantity: qty
      });
    }

    this.saveCartToStorage();
    this.renderProductsGrid();
    if (window.appController) window.appController.showToast(`Added ${prod.name} to cart`, 'success');
  }

  incrementCart(productId) {
    const prod = this.products.find(p => p.id === productId);
    const item = this.cart.find(c => c.productId === productId);
    if (!prod || !item) return;

    if (item.quantity >= prod.stock) {
      if (window.appController) window.appController.showToast(`Maximum available stock reached (${prod.stock})`, 'error');
      return;
    }

    item.quantity += 1;
    this.saveCartToStorage();
    this.renderProductsGrid();
    this.renderCartDrawerItems();
  }

  decrementCart(productId) {
    const itemIndex = this.cart.findIndex(c => c.productId === productId);
    if (itemIndex === -1) return;

    if (this.cart[itemIndex].quantity > 1) {
      this.cart[itemIndex].quantity -= 1;
    } else {
      this.cart.splice(itemIndex, 1);
    }

    this.saveCartToStorage();
    this.renderProductsGrid();
    this.renderCartDrawerItems();
  }

  removeCartItem(productId) {
    this.cart = this.cart.filter(c => c.productId !== productId);
    this.saveCartToStorage();
    this.renderProductsGrid();
    this.renderCartDrawerItems();
  }

  updateCartBadge() {
    const countEl = document.getElementById('cart-badge-count');
    const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
    if (countEl) {
      countEl.textContent = totalItems;
      countEl.style.display = totalItems > 0 ? 'inline-block' : 'none';
    }
  }

  renderFloatingCartBar() {
    const bar = document.getElementById('mobile-floating-cart-bar');
    const countEl = document.getElementById('mobile-cart-items-count');
    const totalEl = document.getElementById('mobile-cart-total-amount');
    if (!bar) return;

    const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (totalItems > 0 && this.currentView === 'catalog') {
      if (countEl) countEl.textContent = `${totalItems} Item${totalItems !== 1 ? 's' : ''}`;
      if (totalEl) totalEl.textContent = `₹${totalPrice}`;
      bar.classList.remove('hidden');
    } else {
      bar.classList.add('hidden');
    }
  }

  openCartDrawer() {
    const backdrop = document.getElementById('cart-drawer-backdrop');
    const panel = document.getElementById('cart-drawer-panel');
    if (backdrop && panel) {
      backdrop.classList.remove('hidden');
      setTimeout(() => {
        panel.classList.remove('translate-x-full');
      }, 10);
      this.renderCartDrawerItems();
    }
  }

  closeCartDrawer(event) {
    if (event && event.target !== event.currentTarget) return;
    const backdrop = document.getElementById('cart-drawer-backdrop');
    const panel = document.getElementById('cart-drawer-panel');
    if (backdrop && panel) {
      panel.classList.add('translate-x-full');
      setTimeout(() => {
        backdrop.classList.add('hidden');
      }, 300);
    }
  }

  renderCartDrawerItems() {
    const container = document.getElementById('cart-drawer-items');
    const emptyEl = document.getElementById('cart-drawer-empty');
    const footerEl = document.getElementById('cart-drawer-footer');
    const subtotalEl = document.getElementById('cart-drawer-subtotal');
    const totalEl = document.getElementById('cart-drawer-total');
    if (!container) return;

    if (this.cart.length === 0) {
      container.innerHTML = '';
      if (emptyEl) emptyEl.classList.remove('hidden');
      if (footerEl) footerEl.classList.add('hidden');
      return;
    }

    if (emptyEl) emptyEl.classList.add('hidden');
    if (footerEl) footerEl.classList.remove('hidden');

    const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (subtotalEl) subtotalEl.textContent = `₹${total}`;
    if (totalEl) totalEl.textContent = `₹${total}`;

    container.innerHTML = this.cart.map(item => `
      <div class="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2.5">
        <img src="${item.image || '/assets/arun-vanilla-cup.jpg'}" alt="${item.name}" class="w-12 h-12 object-contain bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700 flex-shrink-0" />
        <div class="flex-1 min-w-0">
          <h4 class="font-extrabold text-xs text-slate-900 dark:text-white truncate">${item.name}</h4>
          <span class="text-[10px] text-slate-400 block">${item.packSize}</span>
          <span class="text-xs font-black text-rose-600 dark:text-rose-400 font-mono">₹${item.price} each</span>
        </div>
        <div class="flex items-center space-x-1.5">
          <button type="button" onclick="customerApp.decrementCart('${item.productId}')" class="w-6 h-6 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 font-black flex items-center justify-center hover:bg-slate-100">−</button>
          <span class="text-xs font-black font-mono w-4 text-center text-slate-900 dark:text-white">${item.quantity}</span>
          <button type="button" onclick="customerApp.incrementCart('${item.productId}')" class="w-6 h-6 rounded-lg bg-rose-600 text-white font-black flex items-center justify-center hover:bg-rose-700">+</button>
        </div>
      </div>
    `).join('');
  }

  // --- CHECKOUT & SCANNABLE UPI QR CODE ---

  openCheckoutModal() {
    if (this.cart.length === 0) {
      if (window.appController) window.appController.showToast('Your cart is empty', 'error');
      return;
    }

    this.closeCartDrawer();
    const modalContainer = document.getElementById('checkout-modal-container');
    if (!modalContainer) return;

    const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const user = (window.appController && window.appController.customerUser) || {};
    const defaultName = user.name || '';
    const defaultPhone = user.phone && !user.phone.includes('@') ? user.phone : '';

    modalContainer.innerHTML = `
      <div id="checkout-modal" class="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4" onclick="customerApp.closeCheckoutModal(event)">
        <div class="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-5 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-2xl animate-in fade-in zoom-in duration-200 max-h-[92vh] overflow-y-auto" onclick="event.stopPropagation()">
          
          <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div class="flex items-center space-x-2">
              <span class="text-2xl">🛍️</span>
              <div>
                <h3 class="text-base sm:text-lg font-black text-slate-900 dark:text-white font-display">Surya Agencies Checkout</h3>
                <p class="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">Instant UPI Payment & Counter Pickup Ticket</p>
              </div>
            </div>
            <button type="button" onclick="customerApp.closeCheckoutModal()" class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold flex items-center justify-center hover:bg-slate-200">✕</button>
          </div>

          <form id="checkout-form" onsubmit="customerApp.submitOrder(event)" class="mt-4 space-y-4">
            
            <div>
              <label class="block text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">Your Full Name *</label>
              <input type="text" id="checkout-name" value="${defaultName}" required placeholder="Enter Your Name" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-rose-500 dark:bg-slate-800 dark:text-white" />
            </div>

            <div>
              <label class="block text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">Mobile Number (For pickup SMS) *</label>
              <input type="tel" id="checkout-phone" value="${defaultPhone}" required placeholder="10-digit mobile number" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-rose-500 dark:bg-slate-800 dark:text-white" />
            </div>

            <!-- Payment Mode -->
            <div>
              <label class="block text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">Payment Method</label>
              <div class="grid grid-cols-2 gap-2">
                <label class="p-3 rounded-2xl border-2 border-rose-500 bg-rose-50/60 dark:bg-rose-950/40 flex items-center space-x-2 cursor-pointer">
                  <input type="radio" name="checkout-payment" value="upi" checked onchange="customerApp.togglePaymentMethodUI('upi')" class="text-rose-600 focus:ring-rose-500" />
                  <span class="text-xs font-black text-slate-900 dark:text-white">📱 UPI QR Payment</span>
                </label>
                <label class="p-3 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center space-x-2 cursor-pointer">
                  <input type="radio" name="checkout-payment" value="pay_at_shop" onchange="customerApp.togglePaymentMethodUI('pay_at_shop')" class="text-rose-600 focus:ring-rose-500" />
                  <span class="text-xs font-black text-slate-900 dark:text-white">💵 Pay at Counter</span>
                </label>
              </div>
            </div>

            <!-- GENUINE SCANNABLE UPI QR PRESENTATION (HIGH-CONTRAST WITH WHITE MARGIN) -->
            <div id="checkout-upi-box" class="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-purple-50 via-slate-50 to-pink-50 dark:from-slate-800 dark:to-slate-900 border border-purple-200/80 dark:border-purple-900/50 space-y-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <span class="text-xl">📱</span>
                  <div>
                    <h5 class="text-xs font-black text-slate-900 dark:text-white">Scan & Pay ₹${total} with any UPI App</h5>
                    <p class="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">Google Pay, PhonePe, Paytm, BHIM</p>
                  </div>
                </div>
                <span class="px-2 py-0.5 rounded text-[10px] font-black bg-purple-100 text-purple-800 border border-purple-200">INSTANT UPI</span>
              </div>

              <!-- High Contrast White Container with Padding for Fast Optical Camera Scanning -->
              <div class="flex flex-col items-center justify-center gap-3 py-1">
                <div class="bg-white p-4 rounded-2xl border-2 border-slate-300 shadow-md flex items-center justify-center min-w-[200px] min-h-[200px]">
                  <div id="checkout-upi-qrcode" class="flex items-center justify-center"></div>
                </div>
                
                <a 
                  id="checkout-upi-direct-link"
                  href="upi://pay?pa=${encodeURIComponent(this.upiId)}&pn=Surya%20Agencies&am=${total}&cu=INR&tn=Surya%20Agencies%20Order" 
                  class="inline-flex items-center justify-center w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm transition-all space-x-1.5 sm:hidden"
                >
                  <span>⚡ Open UPI App (GPay / PhonePe / Paytm)</span>
                </a>

                <p class="text-[11px] text-slate-500 dark:text-slate-400 font-medium text-center">
                  Scan QR with any payment app, or tap below to proceed with order.
                </p>
              </div>
            </div>

            <!-- Order Summary -->
            <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5">
              <div class="flex justify-between text-xs text-slate-600 dark:text-slate-300">
                <span>Items in Order</span>
                <span class="font-bold">${this.cart.reduce((s, i) => s + i.quantity, 0)} items</span>
              </div>
              <div class="flex justify-between text-base font-black text-slate-900 dark:text-white border-t border-slate-200 dark:border-slate-700 pt-1.5">
                <span>Total Amount</span>
                <span class="text-rose-600 font-mono">₹${total}</span>
              </div>
            </div>

            <!-- Non-Mandatory Proceed Button -->
            <button 
              type="submit" 
              id="submit-order-btn"
              class="w-full py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-black text-sm shadow-xl shadow-rose-600/25 active:scale-98 transition-all flex items-center justify-center space-x-2"
            >
              <span>✓ Confirm Order & Get Pickup Ticket →</span>
            </button>
          </form>
        </div>
      </div>
    `;

    this.renderCheckoutUPIQR(total);
  }

  togglePaymentMethodUI(method) {
    const upiBox = document.getElementById('checkout-upi-box');
    if (upiBox) {
      if (method === 'upi') {
        upiBox.classList.remove('hidden');
      } else {
        upiBox.classList.add('hidden');
      }
    }
  }

  renderCheckoutUPIQR(amount) {
    setTimeout(() => {
      const qrContainer = document.getElementById('checkout-upi-qrcode');
      if (!qrContainer) return;

      const upiUri = `upi://pay?pa=${encodeURIComponent(this.upiId || 'suryaagencies@upi')}&pn=Surya%20Agencies&am=${amount}&cu=INR&tn=Surya%20Agencies%20Order`;

      qrContainer.innerHTML = '';

      // Direct High-Resolution SVG API Generator Fallback
      const img = new Image();
      img.src = `/api/qr?text=${encodeURIComponent(upiUri)}&format=svg`;
      img.alt = 'UPI Payment QR Code';
      img.className = 'w-44 h-44 object-contain rounded-lg';
      img.onload = () => {
        qrContainer.innerHTML = '';
        qrContainer.appendChild(img);
      };
      img.onerror = () => {
        // Fallback to client-side QRCode if available
        if (typeof QRCode !== 'undefined') {
          try {
            new QRCode(qrContainer, {
              text: upiUri,
              width: 176,
              height: 176,
              colorDark: '#0f172a',
              colorLight: '#ffffff',
              correctLevel: QRCode.CorrectLevel.M
            });
          } catch (e) {}
        }
      };
    }, 50);
  }

  closeCheckoutModal(event) {
    if (event && event.target !== event.currentTarget) return;
    const container = document.getElementById('checkout-modal-container');
    if (container) container.innerHTML = '';
  }

  async submitOrder(event) {
    event.preventDefault();
    if (this.isSubmittingOrder) return;
    this.isSubmittingOrder = true;

    const btn = document.getElementById('submit-order-btn');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span>Placing Order & Generating Ticket...</span>';
    }

    const customerName = document.getElementById('checkout-name').value.trim();
    const customerPhone = document.getElementById('checkout-phone').value.trim();
    const paymentMethod = document.querySelector('input[name="checkout-payment"]:checked').value;
    const user = (window.appController && window.appController.customerUser) || {};

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: user.id || ('cust_' + Date.now()),
          customerName: customerName,
          customerPhone: customerPhone,
          customerEmail: user.email || (customerPhone + '@phone.surya'),
          items: this.cart,
          paymentMethod: paymentMethod,
          paymentStatus: paymentMethod === 'upi' ? 'PAID_ONLINE' : 'PENDING'
        })
      });

      const data = await res.json();
      if (data.success && data.order) {
        this.activeOrder = data.order;
        this.myOrders.unshift(data.order);
        this.cart = [];
        this.saveCartToStorage();
        this.closeCheckoutModal();
        this.showTrackingView();
        if (window.appController) {
          window.appController.playChime();
          window.appController.showToast(`✅ Order ${data.order.orderNumber} confirmed! Show your Ticket QR at counter.`, 'success');
        }
      } else {
        alert(data.error || 'Failed to place order. Please try again.');
      }
    } catch (e) {
      console.error('Order placement error:', e);
      alert('Error placing order. Please check connection and try again.');
    } finally {
      this.isSubmittingOrder = false;
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '<span>Confirm & Place Order →</span>';
      }
    }
  }

  // --- ORDER TRACKING VIEW (5-STEP ORDER TIMELINE & DIGITAL TICKET QR) ---

  showTrackingView() {
    this.currentView = 'tracking';
    document.getElementById('customer-catalog-view').classList.add('hidden');
    document.getElementById('customer-orders-view').classList.add('hidden');
    const trackingView = document.getElementById('customer-tracking-view');
    if (trackingView) trackingView.classList.remove('hidden');

    this.renderTrackingView();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  renderTrackingView() {
    const container = document.getElementById('customer-tracking-view');
    if (!container || !this.activeOrder) return;

    const order = this.activeOrder;
    const status = order.orderStatus || 'NEW';

    const statusMap = {
      'NEW': { step: 1, label: 'Order Placed', color: 'text-emerald-600', desc: 'Order received at parlour counter.' },
      'ACCEPTED': { step: 2, label: 'Accepted', color: 'text-blue-600', desc: 'Staff accepted order. Getting pack ready.' },
      'PREPARING': { step: 3, label: 'Preparing', color: 'text-amber-500', desc: 'Packing fresh dairy & ice creams.' },
      'READY_FOR_PICKUP': { step: 4, label: 'Ready for Pickup', color: 'text-purple-600', desc: 'Ready! Show your Ticket QR at counter to collect.' },
      'COMPLETED': { step: 5, label: 'Completed', color: 'text-emerald-700', desc: 'Order picked up! Thank you for choosing Surya Agencies.' },
      'CANCELLED': { step: 0, label: 'Cancelled', color: 'text-red-600', desc: 'This order was cancelled.' }
    };

    const currentStatus = statusMap[status] || statusMap['NEW'];
    const isCancelled = status === 'CANCELLED';

    let parsedItems = [];
    try {
      parsedItems = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
    } catch (e) {
      parsedItems = [];
    }

        // Direct clean unique order link for exact lookup
    const origin = window.location.origin || 'https://surya-agencies.onrender.com';
    const cleanNum = String(order.orderNumber || '').replace(/^#/, '').trim();
    const ticketUrl = `${origin}/#order/${cleanNum}`;

    container.innerHTML = `
      <div class="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <div class="flex items-center space-x-2">
              <span class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-display">${order.orderNumber}</span>
              <span class="px-2.5 py-0.5 rounded-full text-xs font-black ${
                status === 'READY_FOR_PICKUP' ? 'bg-purple-100 text-purple-800 animate-pulse' :
                status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                isCancelled ? 'bg-red-100 text-red-800' :
                'bg-rose-100 text-rose-800'
              }">
                ${currentStatus.label}
              </span>
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">${currentStatus.desc}</p>
          </div>

          <button 
            type="button" 
            onclick="customerApp.showCatalogView()" 
            class="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100"
          >
            ← Back to Store
          </button>
        </div>

        <!-- 5-STEP VISUAL ORDER TIMELINE (REAL-TIME PROGRESS BAR) -->
        ${!isCancelled ? `
          <div class="py-2">
            <span class="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-3 text-center sm:text-left">
              Live Order Progress Tracker
            </span>
            <div class="grid grid-cols-5 gap-1.5 sm:gap-2 text-center">
              <div class="flex flex-col items-center">
                <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-black shadow-sm ${currentStatus.step >= 1 ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 dark:ring-emerald-950' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}">
                  ${currentStatus.step > 1 ? '✓' : '1'}
                </div>
                <span class="text-[10px] sm:text-xs font-extrabold mt-1.5 ${currentStatus.step >= 1 ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-400'}">Placed</span>
              </div>

              <div class="flex flex-col items-center">
                <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-black shadow-sm ${currentStatus.step >= 2 ? 'bg-blue-600 text-white ring-4 ring-blue-100 dark:ring-blue-950' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}">
                  ${currentStatus.step > 2 ? '✓' : '2'}
                </div>
                <span class="text-[10px] sm:text-xs font-extrabold mt-1.5 ${currentStatus.step >= 2 ? 'text-blue-700 dark:text-blue-400' : 'text-slate-400'}">Accepted</span>
              </div>

              <div class="flex flex-col items-center">
                <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-black shadow-sm ${currentStatus.step >= 3 ? 'bg-amber-500 text-white ring-4 ring-amber-100 dark:ring-amber-950' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}">
                  ${currentStatus.step > 3 ? '✓' : '3'}
                </div>
                <span class="text-[10px] sm:text-xs font-extrabold mt-1.5 ${currentStatus.step >= 3 ? 'text-amber-700 dark:text-amber-400' : 'text-slate-400'}">Preparing</span>
              </div>

              <div class="flex flex-col items-center">
                <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-black shadow-sm ${currentStatus.step >= 4 ? 'bg-purple-600 text-white ring-4 ring-purple-100 dark:ring-purple-950 animate-bounce' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}">
                  ${currentStatus.step > 4 ? '✓' : '4'}
                </div>
                <span class="text-[10px] sm:text-xs font-extrabold mt-1.5 ${currentStatus.step >= 4 ? 'text-purple-700 dark:text-purple-400' : 'text-slate-400'}">Ready</span>
              </div>

              <div class="flex flex-col items-center">
                <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-black shadow-sm ${currentStatus.step >= 5 ? 'bg-emerald-700 text-white ring-4 ring-emerald-100 dark:ring-emerald-950' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}">
                  5
                </div>
                <span class="text-[10px] sm:text-xs font-extrabold mt-1.5 ${currentStatus.step >= 5 ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-400'}">Picked Up</span>
              </div>
            </div>
          </div>
        ` : ''}

        <!-- SCANNABLE CUSTOMER TICKET QR CODE (HIGH CONTRAST WHITE CONTAINER) -->
        <div class="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-center gap-5 text-center sm:text-left">
          <div class="bg-white p-3.5 rounded-2xl border-2 border-slate-300 shadow-md flex items-center justify-center min-w-[155px] min-h-[155px]">
            <div id="tracking-ticket-qrcode" class="flex items-center justify-center"></div>
          </div>
          <div class="space-y-1.5 max-w-xs">
            <span class="px-2 py-0.5 rounded text-[10px] font-black bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 uppercase tracking-wider">Digital Counter Ticket</span>
            <h4 class="font-black text-slate-900 dark:text-white text-base">Show at Surya Agencies</h4>
            <p class="text-xs text-slate-500 dark:text-slate-400 leading-snug">
              Shopkeeper will scan this QR or type <strong>${order.orderNumber}</strong> to hand over your order.
            </p>
            <span class="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 block">Total: ₹${order.total} (${order.paymentMethod === 'upi' ? 'UPI' : 'Cash at Counter'})</span>
          </div>
        </div>

        <!-- Ordered Items Summary -->
        <div class="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-4">
          <h4 class="font-bold text-xs text-slate-400 uppercase">Items Ordered</h4>
          <div class="space-y-1.5">
            ${parsedItems.map(item => `
              <div class="flex items-center justify-between text-xs py-1 border-b border-slate-50 dark:border-slate-800/60">
                <span class="font-bold text-slate-800 dark:text-slate-200">${item.name} <span class="text-slate-400 font-normal">(${item.packSize || 'Single'})</span> × ${item.quantity}</span>
                <span class="font-mono font-bold text-slate-900 dark:text-white">₹${item.itemTotal || (item.price * item.quantity)}</span>
              </div>
            `).join('')}
          </div>
          <div class="flex justify-between items-center text-sm font-black text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-700">
            <span>Total Paid/Payable</span>
            <span class="text-rose-600 font-mono text-base">₹${order.total}</span>
          </div>
        </div>
      </div>
    `;

    // Render Scannable Ticket QR Code
    setTimeout(() => {
      const qrEl = document.getElementById('tracking-ticket-qrcode');
      if (!qrEl) return;
      qrEl.innerHTML = '';

      const img = new Image();
      img.src = `/api/qr?text=${encodeURIComponent(ticketUrl)}&format=svg`;
      img.alt = 'Order Ticket QR';
      img.className = 'w-36 h-36 object-contain rounded-lg';
      img.onload = () => {
        qrEl.innerHTML = '';
        qrEl.appendChild(img);
      };
      img.onerror = () => {
        if (typeof QRCode !== 'undefined') {
          try {
            new QRCode(qrEl, {
              text: ticketUrl,
              width: 140,
              height: 140,
              colorDark: '#0f172a',
              colorLight: '#ffffff',
              correctLevel: QRCode.CorrectLevel.M
            });
          } catch (e) {}
        }
      };
    }, 50);
  }

  // --- MY ORDERS VIEW ---

  showOrdersView() {
    this.currentView = 'orders';
    document.getElementById('customer-catalog-view').classList.add('hidden');
    document.getElementById('customer-tracking-view').classList.add('hidden');
    const ordersView = document.getElementById('customer-orders-view');
    if (ordersView) ordersView.classList.remove('hidden');

    this.renderOrdersView();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  showCatalogView() {
    this.currentView = 'catalog';
    document.getElementById('customer-catalog-view').classList.remove('hidden');
    document.getElementById('customer-tracking-view').classList.add('hidden');
    document.getElementById('customer-orders-view').classList.add('hidden');
    this.renderFloatingCartBar();
  }

  renderOrdersView() {
    const container = document.getElementById('customer-orders-view');
    if (!container) return;

    if (this.myOrders.length === 0) {
      container.innerHTML = `
        <div class="max-w-2xl mx-auto text-center py-16 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 shadow-xs">
          <span class="text-4xl block mb-2">📦</span>
          <h4 class="font-black text-slate-800 dark:text-slate-200 text-base">No orders placed yet</h4>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Browse products and place your first order for instant counter pickup!</p>
          <button type="button" onclick="customerApp.showCatalogView()" class="mt-4 px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs shadow-xs">
            Browse Store →
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="max-w-3xl mx-auto space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-black text-slate-900 dark:text-white font-display">My Past Orders</h3>
          <button type="button" onclick="customerApp.showCatalogView()" class="text-xs font-bold text-rose-600 hover:underline">← Back to Store</button>
        </div>

        <div class="space-y-3">
          ${this.myOrders.map(order => `
            <div class="p-4 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:border-rose-300 transition-all" onclick="customerApp.openSpecificOrder('${order.id}')">
              <div>
                <div class="flex items-center space-x-2">
                  <span class="font-black text-slate-900 dark:text-white">${order.orderNumber}</span>
                  <span class="px-2 py-0.5 rounded text-[10px] font-black bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200">${order.orderStatus}</span>
                </div>
                <span class="text-xs text-slate-400 mt-0.5 block">${new Date(order.createdAt).toLocaleDateString()} at ${new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div class="flex items-center justify-between sm:justify-end gap-3">
                <span class="text-base font-black text-rose-600 font-mono">₹${order.total}</span>
                <span class="text-xs font-bold text-slate-500 dark:text-slate-400">View Ticket →</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  openSpecificOrder(orderId) {
    const found = this.myOrders.find(o => o.id === orderId || o.orderNumber === orderId);
    if (found) {
      this.activeOrder = found;
      this.showTrackingView();
    }
  }

  render() {
    this.renderCategoriesBar();
    this.renderProductsGrid();
    this.renderFloatingCartBar();
  }
}

window.customerApp = new CustomerApp();
