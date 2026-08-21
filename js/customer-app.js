/**
 * Customer Portal — Surya Agencies (Arun Icecreams)
 * Connects to shared central database & real-time Socket.io backend
 */

class CustomerApp {
  constructor() {
    this.products = [
  {
    "id": "arun-trio",
    "name": "Arun Trio (Choco-Vanilla-Strawberry)",
    "category": "Bars & Sticks",
    "price": 35,
    "stock": 50,
    "available": 1,
    "description": "Iconic 3-in-1 ice cream bar combining luscious chocolate, classic vanilla, and sweet strawberry in authentic Arun packaging.",
    "image": "/assets/arun-trio.jpg"
  },
  {
    "id": "arun-cassatta",
    "name": "Arun Cassatta Slice",
    "category": "Slices & Cakes",
    "price": 65,
    "stock": 35,
    "available": 1,
    "description": "Rich multi-layered sponge cake topped with strawberry, vanilla, and pistachio ice cream garnished with roasted cashew praline.",
    "image": "/assets/arun-cassatta.jpg"
  },
  {
    "id": "arun-icon-chocobar",
    "name": "Arun Icon Chocobar Feast",
    "category": "Bars & Sticks",
    "price": 40,
    "stock": 45,
    "available": 1,
    "description": "Velvety vanilla ice cream bar dipped in thick, crackling dark Belgian chocolate coating in official Arun Icon packaging.",
    "image": "/assets/arun-chocobar.jpg"
  },
  {
    "id": "arun-spirals-cone",
    "name": "Arun Spirals Swirled Waffle Cone",
    "category": "Cones",
    "price": 55,
    "stock": 40,
    "available": 1,
    "description": "Crispy baked waffle cone filled with twirled dark chocolate and vanilla cream topped with chocolate drizzle and roasted nuts.",
    "image": "/assets/arun-spirals-cone.jpg"
  },
  {
    "id": "arun-kulfi-maharaj",
    "name": "Arun Kulfi Maharaj Stick",
    "category": "Kulfi Special",
    "price": 35,
    "stock": 40,
    "available": 1,
    "description": "Traditional slow-cooked thick rabri kulfi enriched with roasted almonds, Iranian pistachio, and fragrant cardamom.",
    "image": "/assets/arun-kulfi-maharaj.jpg"
  },
  {
    "id": "arun-matka-kulfi",
    "name": "Arun Royal Matka Kulfi",
    "category": "Kulfi Special",
    "price": 80,
    "stock": 25,
    "available": 1,
    "description": "Authentic royal saffron-infused kesar pista kulfi served in a traditional reusable clay matka pot.",
    "image": "/assets/arun-matka-kulfi.jpg"
  },
  {
    "id": "arun-vanilla-magic-cup",
    "name": "Arun Vanilla Magic Cup (100ml)",
    "category": "Cups",
    "price": 25,
    "stock": 60,
    "available": 1,
    "description": "Pure smooth cream blended with natural vanilla extracts in convenient tamper-proof cups.",
    "image": "/assets/arun-vanilla-cup.jpg"
  },
  {
    "id": "arun-butterscotch-tub",
    "name": "Arun Butterscotch Crunch Tub (500ml)",
    "category": "Family Tubs",
    "price": 160,
    "stock": 20,
    "available": 1,
    "description": "Generous family dessert tub with creamy rich butterscotch ice cream packed with golden cashew crunchies in official Arun tub.",
    "image": "/assets/arun-butterscotch-tub.jpg"
  },
  {
    "id": "arun-cotton-candy-cone",
    "name": "Arun Cotton Candy Delight Cone",
    "category": "Cones",
    "price": 45,
    "stock": 30,
    "available": 1,
    "description": "Playful pastel pink and blue swirls of cotton candy flavoured ice cream in a crunchy waffle cone.",
    "image": "/assets/arun-spirals-cone.jpg"
  },
  {
    "id": "arun-choco-rocks-tub",
    "name": "Arun Choco Rocks Tub (700ml)",
    "category": "Family Tubs",
    "price": 220,
    "stock": 15,
    "available": 1,
    "description": "Ultimate chocolate lovers tub filled with chunky chocolate brownies, fudge ripples, and chocolate flakes in Arun tub.",
    "image": "/assets/arun-butterscotch-tub.jpg"
  },
  {
    "id": "arun-wonder-bar",
    "name": "Arun Wonder Bar Alphonso Mango",
    "category": "Bars & Sticks",
    "price": 25,
    "stock": 45,
    "available": 1,
    "description": "Juicy tropical real Alphonso mango fruit bar with a smooth dairy cream centre in authentic Arun packaging.",
    "image": "/assets/arun-trio.jpg"
  },
  {
    "id": "arun-strawberry-blast",
    "name": "Arun Strawberry Blast Cup (100ml)",
    "category": "Cups",
    "price": 30,
    "stock": 40,
    "available": 1,
    "description": "Fresh farm strawberry puree churned into sweet, silky smooth pink cream in tamper-proof Arun cup.",
    "image": "/assets/arun-vanilla-cup.jpg"
  }
];
    this.cart = [];
    this.selectedCategory = 'ALL';
    this.searchQuery = '';
    this.settings = { 
      shopName: 'Surya Agencies', 
      tagline: 'Authorized Arun Icecreams Parlour',
      upiId: 'suryaagencies@upi', 
      shopPhone: '+91 98765 43210' 
    };
    this.customerProfile = { name: '', phone: '' };
    this.activeTrackedOrderId = null;
    this.myOrders = [];
    this.isSubmittingOrder = false;

    this.init();
  }

  async init() {
    this.loadCustomerProfile();
    this.loadCartFromStorage();
    this.loadMyOrdersFromStorage();
    await this.fetchSettings();
    await this.fetchProducts();

    this.setupRealtimeListeners();
    this.render();
  }

  // --- PERSISTENCE ---

  loadCustomerProfile() {
    try {
      const stored = localStorage.getItem('surya_customer_profile');
      if (stored) this.customerProfile = JSON.parse(stored);
    } catch (e) {
      this.customerProfile = { name: '', phone: '' };
    }
  }

  saveCustomerProfile(name, phone) {
    this.customerProfile = { name: (name || '').trim(), phone: (phone || '').trim() };
    localStorage.setItem('surya_customer_profile', JSON.stringify(this.customerProfile));
  }

  loadCartFromStorage() {
    try {
      const stored = sessionStorage.getItem('surya_customer_cart');
      if (stored) this.cart = JSON.parse(stored);
    } catch (e) {
      this.cart = [];
    }
  }

  saveCartToStorage() {
    try {
      sessionStorage.setItem('surya_customer_cart', JSON.stringify(this.cart));
      this.updateCartBadge();
    } catch (e) {
      console.error('Error saving cart:', e);
    }
  }

  loadMyOrdersFromStorage() {
    try {
      const stored = localStorage.getItem('surya_my_orders');
      if (stored) this.myOrders = JSON.parse(stored);
    } catch (e) {
      this.myOrders = [];
    }
  }

  saveMyOrder(order) {
    if (!order || !order.id) return;
    const idx = this.myOrders.findIndex(o => o.id === order.id || o.orderNumber === order.orderNumber);
    if (idx >= 0) {
      this.myOrders[idx] = { ...this.myOrders[idx], ...order };
    } else {
      this.myOrders.unshift(order);
    }
    localStorage.setItem('surya_my_orders', JSON.stringify(this.myOrders));
    this.updateMyOrdersBadge();
  }

  // --- DATA FETCHING ---

  async fetchSettings() {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data.success && data.settings) {
        this.settings = { ...this.settings, ...data.settings };
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
        this.renderProductGrid();
        this.renderCategories();
      }
    } catch (e) {
      console.error('Failed to fetch products:', e);
    }
  }

  // --- REAL-TIME LISTENERS ---

  setupRealtimeListeners() {
    if (!window.realtimeClient) return;

    window.realtimeClient.on('product:created', (product) => {
      const idx = this.products.findIndex(p => p.id === product.id);
      if (idx >= 0) this.products[idx] = product;
      else this.products.push(product);
      this.renderProductGrid();
      this.renderCategories();
    });

    window.realtimeClient.on('product:updated', (product) => {
      const idx = this.products.findIndex(p => p.id === product.id);
      if (idx >= 0) this.products[idx] = product;
      this.renderProductGrid();
      this.syncCartWithLiveStock();
    });

    window.realtimeClient.on('product:stock_updated', ({ id, stock }) => {
      const p = this.products.find(item => item.id === id);
      if (p) {
        p.stock = stock;
        this.renderProductGrid();
        this.syncCartWithLiveStock();
      }
    });

    window.realtimeClient.on('products:stock_batch_updated', (updatedList) => {
      if (Array.isArray(updatedList)) {
        updatedList.forEach(up => {
          const idx = this.products.findIndex(p => p.id === up.id);
          if (idx >= 0) this.products[idx] = up;
        });
        this.renderProductGrid();
        this.syncCartWithLiveStock();
      }
    });

    window.realtimeClient.on('product:deleted', ({ id }) => {
      this.products = this.products.filter(p => p.id !== id);
      this.removeFromCart(id);
      this.renderProductGrid();
      this.renderCategories();
    });

    window.realtimeClient.on('products:reloaded', (productsList) => {
      this.products = productsList || [];
      this.renderProductGrid();
      this.renderCategories();
      this.syncCartWithLiveStock();
    });

    window.realtimeClient.on('order:status_updated', (order) => {
      this.handleOrderStatusChanged(order);
    });

    window.realtimeClient.on('order:my_status_updated', (order) => {
      this.handleOrderStatusChanged(order);
    });

    window.realtimeClient.on('order:payment_updated', (order) => {
      this.handleOrderStatusChanged(order);
    });

    window.realtimeClient.on('settings:updated', (settings) => {
      this.settings = { ...this.settings, ...settings };
    });
  }

  handleOrderStatusChanged(order) {
    if (!order) return;
    this.saveMyOrder(order);

    if (this.activeTrackedOrderId === order.id || this.activeTrackedOrderId === order.orderNumber) {
      this.renderLiveOrderTicket(order);

      if (order.orderStatus === 'READY_FOR_PICKUP') {
        window.appController.playSound('ready');
        window.appController.showToast(`🎉 Your Arun Icecream Order ${order.orderNumber} is READY for pickup at Surya Agencies counter!`);
      } else if (order.orderStatus === 'COMPLETED') {
        window.appController.playSound('completed');
        window.appController.showToast(`🍦 Order ${order.orderNumber} collected! Enjoy your Arun Icecreams!`);
      }
    }
  }

  syncCartWithLiveStock() {
    let modified = false;
    this.cart.forEach(item => {
      const liveProd = this.products.find(p => p.id === item.productId);
      if (liveProd) {
        if (liveProd.stock < item.quantity) {
          item.quantity = liveProd.stock;
          modified = true;
        }
      }
    });
    this.cart = this.cart.filter(item => item.quantity > 0);
    if (modified) {
      this.saveCartToStorage();
      this.renderCart();
    }
  }

  // --- CATEGORIES & FILTERS ---

  renderCategories() {
    const container = document.getElementById('customer-category-pills');
    if (!container) return;

    const categories = ['ALL', ...new Set(this.products.map(p => p.category).filter(Boolean))];

    container.innerHTML = categories.map(cat => {
      const isActive = this.selectedCategory === cat;
      const count = cat === 'ALL' ? this.products.length : this.products.filter(p => p.category === cat).length;
      return `
        <button 
          type="button"
          onclick="customerApp.selectCategory('${cat}')"
          class="flex-shrink-0 px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
            isActive 
              ? 'bg-rose-600 text-white shadow-md shadow-rose-500/25 scale-105' 
              : 'bg-white text-slate-600 hover:bg-rose-50 hover:text-rose-600 border border-slate-200'
          }"
        >
          ${cat === 'ALL' ? '🍨 All Arun Flavours' : cat} <span class="ml-1 opacity-80 text-[10px]">(${count})</span>
        </button>
      `;
    }).join('');
  }

  selectCategory(category) {
    this.selectedCategory = category;
    this.renderCategories();
    this.renderProductGrid();
  }

  setSearchQuery(query) {
    this.searchQuery = (query || '').toLowerCase().trim();
    this.renderProductGrid();
  }

  getFilteredProducts() {
    return this.products.filter(p => {
      if (!p.available) return false;

      const matchesCat = this.selectedCategory === 'ALL' || p.category === this.selectedCategory;
      const matchesSearch = !this.searchQuery || 
        p.name.toLowerCase().includes(this.searchQuery) || 
        (p.description && p.description.toLowerCase().includes(this.searchQuery)) ||
        (p.category && p.category.toLowerCase().includes(this.searchQuery));

      return matchesCat && matchesSearch;
    });
  }

  // --- PRODUCT GRID ---

  renderProductGrid() {
    const container = document.getElementById('customer-products-grid');
    const emptyState = document.getElementById('customer-empty-products');
    if (!container) return;

    const items = this.getFilteredProducts();

    if (items.length === 0) {
      container.innerHTML = '';
      if (emptyState) emptyState.classList.remove('hidden');
      return;
    }

    if (emptyState) emptyState.classList.add('hidden');

    container.innerHTML = items.map(p => {
      const isOutOfStock = p.stock <= 0;
      const isLowStock = p.stock > 0 && p.stock <= 5;
      const cartItem = this.cart.find(c => c.productId === p.id);
      const cartQty = cartItem ? cartItem.quantity : 0;

      let stockBadge = '';
      if (isOutOfStock) {
        stockBadge = `<span class="px-2.5 py-1 rounded-full text-[10px] font-black bg-rose-100 text-rose-700 border border-rose-200">✕ Out of Stock</span>`;
      } else if (isLowStock) {
        stockBadge = `<span class="px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">⚡ Only ${p.stock} left!</span>`;
      } else {
        stockBadge = `<span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">✓ ${p.stock} in stock</span>`;
      }

      const imageUrl = p.image || 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=600';

      return `
        <div class="bg-white rounded-3xl overflow-hidden border border-slate-200/90 hover:border-rose-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between ${isOutOfStock ? 'opacity-70 grayscale-[25%]' : ''}">
          <div>
            <!-- Image View -->
            <div class="relative h-48 w-full overflow-hidden bg-slate-100 cursor-pointer" onclick="customerApp.openProductModal('${p.id}')">
              <img 
                src="${imageUrl}" 
                alt="${p.name}" 
                class="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                loading="lazy"
                onerror="this.src='https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=600'"
              />
              <div class="absolute top-3 left-3">
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/95 backdrop-blur-md text-slate-800 shadow-sm">
                  ${p.category}
                </span>
              </div>
              <div class="absolute top-3 right-3">
                ${stockBadge}
              </div>
            </div>

            <!-- Info -->
            <div class="p-4">
              <h3 class="font-extrabold text-slate-900 text-base leading-snug cursor-pointer hover:text-rose-600 transition-colors" onclick="customerApp.openProductModal('${p.id}')">
                ${p.name}
              </h3>
              <p class="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                ${p.description || 'Authentic Arun Icecreams product sold fresh by Surya Agencies.'}
              </p>
            </div>
          </div>

          <!-- Bottom Price & Quantity / Add Button -->
          <div class="p-4 pt-0">
            <div class="flex items-center justify-between border-t border-slate-100 pt-3 mt-1">
              <div>
                <span class="text-[10px] uppercase font-bold text-slate-400 block">Price</span>
                <span class="text-xl font-black text-slate-900 font-display">₹${p.price}</span>
              </div>

              <div>
                ${isOutOfStock 
                  ? `<button disabled class="px-3.5 py-2 rounded-2xl bg-slate-100 text-slate-400 text-xs font-bold cursor-not-allowed">Out of Stock</button>`
                  : cartQty > 0
                    ? `
                      <div class="flex items-center bg-rose-50 border border-rose-200 rounded-2xl p-1 shadow-sm">
                        <button type="button" onclick="customerApp.decrementCart('${p.id}')" class="w-7 h-7 rounded-xl bg-white text-rose-700 font-extrabold flex items-center justify-center hover:bg-rose-100 shadow-sm">−</button>
                        <span class="w-7 text-center text-xs font-black text-rose-700">${cartQty}</span>
                        <button type="button" onclick="customerApp.incrementCart('${p.id}')" class="w-7 h-7 rounded-xl bg-rose-600 text-white font-extrabold flex items-center justify-center hover:bg-rose-700 shadow-sm" ${cartQty >= p.stock ? 'disabled opacity-40' : ''}>+</button>
                      </div>
                    `
                    : `
                      <button 
                        type="button" 
                        onclick="customerApp.addToCart('${p.id}', 1)"
                        class="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white text-xs font-extrabold shadow-md shadow-rose-500/20 active:scale-95 transition-all flex items-center space-x-1.5"
                      >
                        <span>+ Add to Cart</span>
                      </button>
                    `
                }
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // --- PRODUCT DETAILS MODAL ---

  openProductModal(productId) {
    const p = this.products.find(item => item.id === productId);
    if (!p) return;

    const modal = document.getElementById('product-detail-modal');
    if (!modal) return;

    const isOutOfStock = p.stock <= 0;
    const imageUrl = p.image || 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=600';

    modal.innerHTML = `
      <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onclick="customerApp.closeProductModal(event)">
        <div class="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-200" onclick="event.stopPropagation()">
          <div class="relative h-64 bg-slate-100">
            <img src="${imageUrl}" alt="${p.name}" class="w-full h-full object-cover" />
            <button 
              type="button" 
              onclick="customerApp.closeProductModal()"
              class="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 text-slate-700 font-bold flex items-center justify-center hover:bg-white shadow-md"
            >✕</button>
            <span class="absolute bottom-4 left-4 px-3 py-1 rounded-full text-xs font-extrabold bg-white/95 text-slate-900 shadow-md">
              Arun Icecreams • ${p.category}
            </span>
          </div>

          <div class="p-6">
            <div class="flex items-start justify-between gap-2">
              <h2 class="text-xl font-black text-slate-900 font-display leading-tight">${p.name}</h2>
              <span class="text-2xl font-black text-rose-600 font-display">₹${p.price}</span>
            </div>

            <p class="text-sm text-slate-600 mt-3 leading-relaxed">
              ${p.description || 'Authentic Arun Icecreams product sold fresh by Surya Agencies.'}
            </p>

            <div class="mt-4 p-4 rounded-2xl bg-rose-50/60 border border-rose-100 flex items-center justify-between">
              <div>
                <span class="text-xs font-bold text-slate-500 block">Available Online Stock</span>
                <span class="text-sm font-extrabold ${isOutOfStock ? 'text-rose-600' : 'text-emerald-700'}">
                  ${isOutOfStock ? 'Out of Stock' : `${p.stock} units ready for home order`}
                </span>
              </div>
              <div class="text-right">
                <span class="text-[10px] font-semibold text-slate-400">Shop Counter</span>
                <span class="text-xs font-bold text-slate-800 block">Surya Agencies</span>
              </div>
            </div>

            <div class="mt-6">
              ${isOutOfStock
                ? `<button disabled class="w-full py-3.5 rounded-2xl bg-slate-200 text-slate-500 font-bold cursor-not-allowed">Item is Out of Stock</button>`
                : `
                  <div class="flex items-center gap-3">
                    <div class="flex items-center bg-slate-100 rounded-2xl p-1 border border-slate-200">
                      <button type="button" class="w-9 h-9 rounded-xl bg-white text-slate-700 font-bold flex items-center justify-center shadow-sm" onclick="customerApp.adjustModalQty(-1, ${p.stock})">−</button>
                      <input type="number" id="modal-qty-input" value="1" min="1" max="${p.stock}" readonly class="w-10 text-center font-black bg-transparent text-slate-900 text-sm" />
                      <button type="button" class="w-9 h-9 rounded-xl bg-white text-slate-700 font-bold flex items-center justify-center shadow-sm" onclick="customerApp.adjustModalQty(1, ${p.stock})">+</button>
                    </div>
                    <button 
                      type="button" 
                      onclick="customerApp.addModalToCart('${p.id}')"
                      class="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-extrabold shadow-lg shadow-rose-500/25 active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
                    >
                      <span>Add to Cart</span>
                    </button>
                  </div>
                `
              }
            </div>
          </div>
        </div>
      </div>
    `;
  }

  adjustModalQty(delta, maxStock) {
    const input = document.getElementById('modal-qty-input');
    if (!input) return;
    let val = parseInt(input.value, 10) || 1;
    val += delta;
    if (val < 1) val = 1;
    if (val > maxStock) val = maxStock;
    input.value = val;
  }

  addModalToCart(productId) {
    const input = document.getElementById('modal-qty-input');
    const qty = input ? parseInt(input.value, 10) || 1 : 1;
    this.addToCart(productId, qty);
    this.closeProductModal();
  }

  closeProductModal(e) {
    const modal = document.getElementById('product-detail-modal');
    if (modal) modal.innerHTML = '';
  }

  // --- CART OPERATIONS ---

  addToCart(productId, quantity = 1) {
    const product = this.products.find(p => p.id === productId);
    if (!product) return;

    if (product.stock <= 0) {
      window.appController.showToast(`"${product.name}" is Out of Stock!`, 'error');
      return;
    }

    const existing = this.cart.find(c => c.productId === productId);
    const currentQty = existing ? existing.quantity : 0;
    const requestedTotal = currentQty + quantity;

    if (requestedTotal > product.stock) {
      window.appController.showToast(`Only ${product.stock} available for "${product.name}".`, 'warning');
      if (existing) existing.quantity = product.stock;
      else this.cart.push({ productId: product.id, name: product.name, price: product.price, quantity: product.stock, image: product.image });
    } else {
      if (existing) {
        existing.quantity += quantity;
      } else {
        this.cart.push({
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: quantity,
          image: product.image
        });
      }
      window.appController.showToast(`Added ${quantity} × ${product.name} to Cart`, 'success');
    }

    this.saveCartToStorage();
    this.renderProductGrid();
    this.renderCart();
  }

  incrementCart(productId) {
    this.addToCart(productId, 1);
  }

  decrementCart(productId) {
    const existing = this.cart.find(c => c.productId === productId);
    if (!existing) return;

    existing.quantity -= 1;
    if (existing.quantity <= 0) {
      this.cart = this.cart.filter(c => c.productId !== productId);
    }

    this.saveCartToStorage();
    this.renderProductGrid();
    this.renderCart();
  }

  removeFromCart(productId) {
    this.cart = this.cart.filter(c => c.productId !== productId);
    this.saveCartToStorage();
    this.renderProductGrid();
    this.renderCart();
  }

  clearCart() {
    this.cart = [];
    this.saveCartToStorage();
    this.renderProductGrid();
    this.renderCart();
  }

  getCartTotal() {
    return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  getCartItemCount() {
    return this.cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  updateCartBadge() {
    const count = this.getCartItemCount();
    const badges = document.querySelectorAll('.cart-badge-count');
    badges.forEach(b => {
      b.textContent = count;
      if (count > 0) b.classList.remove('hidden');
      else b.classList.add('hidden');
    });

    const floatingBtn = document.getElementById('customer-floating-cart-bar');
    if (floatingBtn) {
      if (count > 0) {
        floatingBtn.classList.remove('translate-y-32');
        const priceSpan = document.getElementById('floating-cart-price');
        const countSpan = document.getElementById('floating-cart-items');
        if (priceSpan) priceSpan.textContent = `₹${this.getCartTotal()}`;
        if (countSpan) countSpan.textContent = `${count} ${count === 1 ? 'item' : 'items'}`;
      } else {
        floatingBtn.classList.add('translate-y-32');
      }
    }
  }

  updateMyOrdersBadge() {
    const count = this.myOrders.filter(o => o.orderStatus !== 'COMPLETED').length;
    const badges = document.querySelectorAll('.myorders-badge-count');
    badges.forEach(b => {
      b.textContent = count;
      if (count > 0) b.classList.remove('hidden');
      else b.classList.add('hidden');
    });
  }

  // --- CART DRAWER ---

  openCartDrawer() {
    const drawer = document.getElementById('customer-cart-drawer');
    if (!drawer) return;
    this.renderCart();
    drawer.classList.remove('hidden');
    setTimeout(() => {
      const panel = document.getElementById('customer-cart-panel');
      if (panel) panel.classList.remove('translate-x-full');
    }, 10);
  }

  closeCartDrawer() {
    const panel = document.getElementById('customer-cart-panel');
    if (panel) panel.classList.add('translate-x-full');
    setTimeout(() => {
      const drawer = document.getElementById('customer-cart-drawer');
      if (drawer) drawer.classList.add('hidden');
    }, 300);
  }

  renderCart() {
    const container = document.getElementById('customer-cart-items');
    const footer = document.getElementById('customer-cart-footer');
    const emptyState = document.getElementById('customer-cart-empty');
    if (!container) return;

    if (this.cart.length === 0) {
      container.innerHTML = '';
      if (emptyState) emptyState.classList.remove('hidden');
      if (footer) footer.classList.add('hidden');
      return;
    }

    if (emptyState) emptyState.classList.add('hidden');
    if (footer) footer.classList.remove('hidden');

    container.innerHTML = this.cart.map(item => {
      const liveProd = this.products.find(p => p.id === item.productId);
      const imageUrl = item.image || 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=600';

      return `
        <div class="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 gap-3">
          <img src="${imageUrl}" alt="${item.name}" class="w-14 h-14 rounded-xl object-cover border border-slate-200" />
          <div class="flex-1 min-w-0">
            <h4 class="font-bold text-slate-900 text-xs truncate">${item.name}</h4>
            <div class="flex items-center gap-2 mt-0.5">
              <span class="text-xs font-black text-rose-600">₹${item.price}</span>
              ${liveProd && liveProd.stock < 5 ? `<span class="text-[9px] font-bold text-amber-600">(${liveProd.stock} left)</span>` : ''}
            </div>
          </div>
          
          <div class="flex items-center bg-white border border-slate-200 rounded-xl p-0.5 shadow-sm">
            <button type="button" onclick="customerApp.decrementCart('${item.productId}')" class="w-6 h-6 rounded-lg text-slate-600 font-bold flex items-center justify-center hover:bg-slate-100">−</button>
            <span class="w-6 text-center text-xs font-black text-slate-900">${item.quantity}</span>
            <button type="button" onclick="customerApp.incrementCart('${item.productId}')" class="w-6 h-6 rounded-lg text-rose-600 font-bold flex items-center justify-center hover:bg-rose-50" ${liveProd && item.quantity >= liveProd.stock ? 'disabled opacity-30' : ''}>+</button>
          </div>
        </div>
      `;
    }).join('');

    const subtotalEl = document.getElementById('cart-subtotal-price');
    const totalEl = document.getElementById('cart-total-price');
    const total = this.getCartTotal();

    if (subtotalEl) subtotalEl.textContent = `₹${total}`;
    if (totalEl) totalEl.textContent = `₹${total}`;
  }

  // --- CHECKOUT SCREEN ---

  openCheckoutModal() {
    if (this.cart.length === 0) {
      window.appController.showToast('Your cart is empty!', 'warning');
      return;
    }

    this.closeCartDrawer();
    const modal = document.getElementById('checkout-modal');
    if (!modal) return;

    const total = this.getCartTotal();
    const upiId = this.settings.upiId || 'suryaagencies@upi';
    const upiString = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent('SuryaAgencies')}&am=${total}&cu=INR&tn=${encodeURIComponent('Arun Icecreams Order')}`;

    modal.innerHTML = `
      <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto" onclick="customerApp.closeCheckoutModal(event)">
        <div class="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 my-8 animate-in fade-in zoom-in duration-200" onclick="event.stopPropagation()">
          <div class="flex items-center justify-between border-b border-slate-100 pb-4">
            <div class="flex items-center space-x-2.5">
              <span class="text-2xl">🛍️</span>
              <div>
                <h3 class="text-lg font-black text-slate-900 font-display">Surya Agencies Checkout</h3>
                <p class="text-xs text-slate-500">Pick up freshly packed Arun Icecreams at shop counter</p>
              </div>
            </div>
            <button type="button" onclick="customerApp.closeCheckoutModal()" class="w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center hover:bg-slate-200">✕</button>
          </div>

          <form id="checkout-form" onsubmit="customerApp.submitOrder(event)" class="mt-5 space-y-4">
            <!-- Customer Details -->
            <div class="space-y-3">
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Your Name *</label>
                <input 
                  type="text" 
                  id="checkout-name" 
                  required 
                  value="${this.customerProfile.name || ''}"
                  placeholder="e.g. Ramesh Kumar" 
                  class="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Mobile Phone * (For Order Tracking & Pickup)</label>
                <input 
                  type="tel" 
                  id="checkout-phone" 
                  required
                  value="${this.customerProfile.phone || ''}"
                  placeholder="e.g. 9876543210" 
                  class="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <!-- Order Summary -->
            <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <h4 class="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Arun Icecreams Items (${this.getCartItemCount()})</h4>
              <div class="space-y-1 max-h-32 overflow-y-auto pr-1">
                ${this.cart.map(item => `
                  <div class="flex justify-between text-xs font-medium text-slate-700">
                    <span>${item.name} × ${item.quantity}</span>
                    <span class="font-bold text-slate-900">₹${item.price * item.quantity}</span>
                  </div>
                `).join('')}
              </div>
              <div class="border-t border-slate-200 mt-2 pt-2 flex justify-between items-center text-sm font-black text-slate-900 font-display">
                <span>Total Amount</span>
                <span class="text-base text-rose-600 font-mono">₹${total}</span>
              </div>
            </div>

            <!-- Payment Method Selection -->
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Select Payment Method</label>
              
              <div class="grid grid-cols-2 gap-3">
                <label class="relative flex flex-col p-3.5 rounded-2xl border-2 cursor-pointer transition-all border-rose-500 bg-rose-50/50" id="label-pay-upi">
                  <input type="radio" name="paymentMethod" value="upi" checked onchange="customerApp.togglePaymentMethodView('upi')" class="sr-only" />
                  <div class="flex items-center justify-between">
                    <span class="text-sm font-black text-slate-900">⚡ UPI</span>
                    <span class="w-4 h-4 rounded-full border-2 border-rose-500 bg-rose-500 flex items-center justify-center text-white text-[9px]">✓</span>
                  </div>
                  <span class="text-[11px] text-slate-500 mt-1">GPay / PhonePe / QR</span>
                </label>

                <label class="relative flex flex-col p-3.5 rounded-2xl border-2 cursor-pointer transition-all border-slate-200 hover:border-slate-300 bg-white" id="label-pay-shop">
                  <input type="radio" name="paymentMethod" value="pay_at_shop" onchange="customerApp.togglePaymentMethodView('pay_at_shop')" class="sr-only" />
                  <div class="flex items-center justify-between">
                    <span class="text-sm font-black text-slate-900">🏪 Pay at Shop</span>
                    <span class="w-4 h-4 rounded-full border-2 border-slate-300"></span>
                  </div>
                  <span class="text-[11px] text-slate-500 mt-1">Cash/UPI at counter</span>
                </label>
              </div>

              <!-- UPI Details -->
              <div id="upi-details-container" class="mt-3 p-4 rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-200">
                <div class="flex items-center justify-between">
                  <div>
                    <span class="text-[10px] font-bold text-slate-500 uppercase">Surya Agencies UPI ID</span>
                    <p class="text-xs font-black text-slate-900 font-mono">${upiId}</p>
                  </div>
                  <span class="px-2.5 py-1 bg-rose-100 text-rose-800 text-[10px] font-bold rounded-lg">Pay ₹${total}</span>
                </div>

                <div class="mt-3 flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-rose-200">
                  <div id="checkout-upi-qr" class="p-1"></div>
                  <p class="text-[10px] font-semibold text-slate-500 mt-2 text-center">Scan with GPay / PhonePe / Paytm / BHIM</p>
                </div>

                <div class="mt-3 flex flex-col gap-2">
                  <a 
                    href="${upiString}" 
                    target="_blank"
                    class="w-full py-2.5 px-3 rounded-xl bg-slate-900 text-white text-xs font-bold text-center hover:bg-slate-800 transition-colors shadow-sm"
                  >
                    Open UPI Payment App
                  </a>
                  
                  <label class="flex items-center gap-2 cursor-pointer mt-1">
                    <input type="checkbox" id="upi-paid-checkbox" class="w-4 h-4 text-rose-600 rounded border-slate-300 focus:ring-rose-500" />
                    <span class="text-xs font-bold text-slate-800">I have completed UPI payment of ₹${total}</span>
                  </label>
                  <p class="text-[10px] text-slate-400 italic">(Prototype mode: Payment recorded as complete by customer)</p>
                </div>
              </div>

              <!-- Pay at Shop Details -->
              <div id="pay-at-shop-container" class="mt-3 p-4 rounded-2xl bg-amber-50 border border-amber-200 hidden">
                <div class="flex items-start space-x-2.5">
                  <span class="text-amber-600 text-base">ℹ️</span>
                  <div>
                    <h5 class="text-xs font-extrabold text-amber-900">Payment Status: PENDING</h5>
                    <p class="text-xs text-amber-700 mt-0.5 leading-relaxed">
                      Your order ticket will be generated immediately. You can pay ₹${total} at the Surya Agencies shop counter when collecting your ice creams.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Submit Button -->
            <div class="pt-2">
              <button 
                type="submit" 
                id="btn-submit-order"
                class="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white text-base font-black shadow-xl shadow-rose-500/25 active:scale-[0.99] transition-all flex items-center justify-center space-x-2"
              >
                <span>🍨 Place Arun Icecreams Order (₹${total})</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    `;

    setTimeout(() => {
      const qrEl = document.getElementById('checkout-upi-qr');
      if (qrEl && window.QRCode) {
        qrEl.innerHTML = '';
        new QRCode(qrEl, {
          text: upiString,
          width: 120,
          height: 120,
          colorDark: '#0f172a',
          colorLight: '#ffffff',
          correctLevel: QRCode.CorrectLevel.M
        });
      }
    }, 50);
  }

  togglePaymentMethodView(method) {
    const upiContainer = document.getElementById('upi-details-container');
    const shopContainer = document.getElementById('pay-at-shop-container');
    const labelUpi = document.getElementById('label-pay-upi');
    const labelShop = document.getElementById('label-pay-shop');

    if (method === 'upi') {
      if (upiContainer) upiContainer.classList.remove('hidden');
      if (shopContainer) shopContainer.classList.add('hidden');
      if (labelUpi) labelUpi.className = 'relative flex flex-col p-3.5 rounded-2xl border-2 cursor-pointer transition-all border-rose-500 bg-rose-50/50';
      if (labelShop) labelShop.className = 'relative flex flex-col p-3.5 rounded-2xl border-2 cursor-pointer transition-all border-slate-200 hover:border-slate-300 bg-white';
    } else {
      if (upiContainer) upiContainer.classList.add('hidden');
      if (shopContainer) shopContainer.classList.remove('hidden');
      if (labelShop) labelShop.className = 'relative flex flex-col p-3.5 rounded-2xl border-2 cursor-pointer transition-all border-rose-500 bg-rose-50/50';
      if (labelUpi) labelUpi.className = 'relative flex flex-col p-3.5 rounded-2xl border-2 cursor-pointer transition-all border-slate-200 hover:border-slate-300 bg-white';
    }
  }

  closeCheckoutModal(e) {
    const modal = document.getElementById('checkout-modal');
    if (modal) modal.innerHTML = '';
  }

  // --- SUBMIT ORDER ---

  async submitOrder(e) {
    e.preventDefault();
    if (this.isSubmittingOrder) {
      console.warn('Order submission already in progress.');
      return;
    }

    if (this.cart.length === 0) {
      window.appController.showToast('Your cart is empty!', 'warning');
      return;
    }

    this.isSubmittingOrder = true;
    const btn = document.getElementById('btn-submit-order');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `<span>⏳ Verifying Live Stock & Placing Order...</span>`;
    }

    const nameInput = document.getElementById('checkout-name');
    const phoneInput = document.getElementById('checkout-phone');
    const paymentMethodRadio = document.querySelector('input[name="paymentMethod"]:checked');

    const customerName = nameInput ? nameInput.value.trim() : '';
    const customerPhone = phoneInput ? phoneInput.value.trim() : '';
    const paymentMethod = paymentMethodRadio ? paymentMethodRadio.value : 'pay_at_shop';

    let paymentStatus = 'PENDING';
    if (paymentMethod === 'upi') {
      paymentStatus = 'PAID';
    }

    this.saveCustomerProfile(customerName, customerPhone);

    const orderPayload = {
      customerName,
      customerPhone,
      items: this.cart,
      paymentMethod,
      paymentStatus
    };

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to place order.');
      }

      const createdOrder = data.order;

      this.clearCart();
      this.closeCheckoutModal();
      this.saveMyOrder(createdOrder);

      this.activeTrackedOrderId = createdOrder.id;
      if (window.realtimeClient) {
        window.realtimeClient.subscribeToOrder(createdOrder.id);
        window.realtimeClient.subscribeToOrder(createdOrder.orderNumber);
      }

      this.showOrderTicket(createdOrder.id);
      window.appController.playSound('order_placed');
      window.appController.showConfetti();
      window.appController.showToast(`🎉 Order ${createdOrder.orderNumber} Placed Successfully!`, 'success');

    } catch (err) {
      console.error('Order submission error:', err);
      window.appController.showToast(err.message, 'error');
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = `<span>🍨 Place Arun Icecreams Order (₹${this.getCartTotal()})</span>`;
      }
    } finally {
      this.isSubmittingOrder = false;
    }
  }

  async showOrderTicket(orderIdOrNumber) {
    this.activeTrackedOrderId = orderIdOrNumber;
    if (window.realtimeClient) {
      window.realtimeClient.subscribeToOrder(orderIdOrNumber);
    }

    window.appController.showCustomerView('ticket');

    try {
      const res = await fetch(`/api/orders/${orderIdOrNumber}`);
      const data = await res.json();
      if (data.success && data.order) {
        this.renderLiveOrderTicket(data.order);
      } else {
        throw new Error('Order not found');
      }
    } catch (e) {
      console.error('Could not load order ticket:', e);
    }
  }

  renderLiveOrderTicket(order) {
    const container = document.getElementById('customer-order-ticket-view');
    if (!container) return;

    const statuses = ['NEW', 'ACCEPTED', 'PREPARING', 'READY_FOR_PICKUP', 'COMPLETED', 'CANCELLED'];
    const currentIdx = statuses.indexOf(order.orderStatus);

    const isReady = order.orderStatus === 'READY_FOR_PICKUP';
    const isCompleted = order.orderStatus === 'COMPLETED';
    const isCancelled = order.orderStatus === 'CANCELLED';
    const formattedDate = new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    container.innerHTML = `
      <div class="max-w-md mx-auto my-4 space-y-4">
        <!-- Live Alert Banner -->
        ${isCancelled ? `
          <div class="p-4 rounded-3xl bg-rose-600 text-white shadow-xl shadow-rose-500/20 flex items-center gap-3 border border-rose-500">
            <span class="text-3xl">❌</span>
            <div>
              <h4 class="font-black text-base">Order Cancelled</h4>
              <p class="text-xs text-rose-100">This order was cancelled by the shopkeeper. Stock has been returned.</p>
            </div>
          </div>
        ` : isReady ? `
          <div class="p-4 rounded-3xl bg-emerald-500 text-white shadow-xl shadow-emerald-500/20 animate-bounce-small flex items-center gap-3 border border-emerald-400">
            <span class="text-3xl">🎉</span>
            <div>
              <h4 class="font-black text-base">Your Arun Icecreams are READY!</h4>
              <p class="text-xs text-emerald-100">Please visit the Surya Agencies counter and show your QR Code.</p>
            </div>
          </div>
        ` : isCompleted ? `
          <div class="p-4 rounded-3xl bg-blue-600 text-white shadow-xl shadow-blue-500/20 flex items-center gap-3 border border-blue-400">
            <span class="text-3xl">🍦</span>
            <div>
              <h4 class="font-black text-base">Order Collected Successfully</h4>
              <p class="text-xs text-blue-100">Thank you for ordering with Surya Agencies! Enjoy your Arun Icecreams.</p>
            </div>
          </div>
        ` : `
          <div class="p-4 rounded-3xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center gap-3">
            <span class="text-xl animate-spin">⏳</span>
            <div>
              <h4 class="font-black text-xs">Surya Agencies is packing your fresh ice creams...</h4>
              <p class="text-[11px] text-amber-700">Live order status updates will appear here automatically.</p>
            </div>
          </div>
        `}

        <!-- DIGITAL TICKET CARD -->
        <div class="ticket-container p-6 border border-slate-200">
          <div class="flex items-center justify-between border-b border-slate-100 pb-4">
            <div class="flex items-center space-x-2.5">
              <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 to-red-500 flex items-center justify-center text-lg text-white shadow-sm font-black">
                🍨
              </div>
              <div>
                <h3 class="font-black text-slate-900 text-sm font-display leading-tight">SURYA AGENCIES</h3>
                <p class="text-[10px] font-bold text-rose-600">Arun Icecreams • ${formattedDate}</p>
              </div>
            </div>
            <div class="text-right">
              <span class="text-[10px] font-bold text-slate-400 block uppercase">Order ID</span>
              <span class="text-xl font-black text-rose-600 font-mono tracking-tight">${order.orderNumber}</span>
            </div>
          </div>

          <!-- Progress Stepper -->
          <div class="py-5">
            <div class="relative flex justify-between items-center text-center">
              <div class="absolute top-1/2 left-0 right-0 h-1 bg-slate-100 -translate-y-1/2 z-0"></div>
              <div class="absolute top-1/2 left-0 h-1 bg-rose-500 -translate-y-1/2 z-0 transition-all duration-500" style="width: ${(Math.max(0, currentIdx) / (statuses.length - 1)) * 100}%"></div>

              <div class="relative z-10 flex flex-col items-center">
                <div class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${currentIdx >= 0 ? 'bg-rose-600 text-white shadow-md' : 'bg-slate-200 text-slate-500'}">✓</div>
                <span class="text-[9px] font-bold text-slate-600 mt-1">Placed</span>
              </div>

              <div class="relative z-10 flex flex-col items-center">
                <div class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${currentIdx >= 2 ? 'bg-rose-600 text-white shadow-md' : currentIdx === 1 ? 'bg-amber-400 text-amber-900 animate-pulse' : 'bg-slate-200 text-slate-500'}">
                  ${currentIdx >= 2 ? '✓' : '🥣'}
                </div>
                <span class="text-[9px] font-bold text-slate-600 mt-1">Preparing</span>
              </div>

              <div class="relative z-10 flex flex-col items-center">
                <div class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${currentIdx >= 3 ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-200 text-slate-500'}">
                  ${currentIdx >= 3 ? '✓' : '📦'}
                </div>
                <span class="text-[9px] font-bold text-slate-600 mt-1">Ready</span>
              </div>

              <div class="relative z-10 flex flex-col items-center">
                <div class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${currentIdx >= 4 ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-200 text-slate-500'}">
                  ${currentIdx >= 4 ? '✓' : '🎉'}
                </div>
                <span class="text-[9px] font-bold text-slate-600 mt-1">Collected</span>
              </div>
            </div>
          </div>

          <!-- QR Code Area -->
          <div class="my-3 flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
            <div id="ticket-qrcode" class="p-2 bg-white rounded-xl shadow-sm border border-slate-200"></div>
            <p class="text-xs font-black text-slate-800 mt-2 font-mono tracking-wider">${order.orderNumber}</p>
            <p class="text-[10px] text-slate-500">Show this QR to the Surya Agencies shopkeeper at the counter</p>
          </div>

          <div class="ticket-perforation"></div>

          <!-- Receipt Details -->
          <div class="pt-6 mt-4 space-y-2">
            <div class="flex justify-between text-xs text-slate-500">
              <span>Customer:</span>
              <span class="font-bold text-slate-800">${order.customerName}</span>
            </div>

            <div class="border-t border-slate-100 pt-2">
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Ordered Items</span>
              <div class="space-y-1">
                ${order.items.map(item => `
                  <div class="flex justify-between text-xs font-semibold text-slate-700">
                    <span>${item.name} × ${item.quantity}</span>
                    <span class="font-bold text-slate-900 font-mono">₹${item.price * item.quantity}</span>
                  </div>
                `).join('')}
              </div>
            </div>

            <div class="border-t border-slate-100 pt-2 flex justify-between items-center text-sm font-black text-slate-900 font-display">
              <span>Total Amount</span>
              <span class="text-base text-rose-600 font-mono">₹${order.total}</span>
            </div>

            <div class="flex justify-between items-center text-xs pt-1">
              <span class="text-slate-500">Payment:</span>
              <div class="flex items-center gap-1.5">
                <span class="font-bold text-slate-700 uppercase">${order.paymentMethod === 'upi' ? 'UPI' : 'Pay at Shop'}</span>
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${order.paymentStatus === 'PAID' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800 border border-amber-300'}">
                  ${order.paymentStatus === 'PAID' ? '✓ PAID' : 'PENDING'}
                </span>
              </div>
            </div>
          </div>

          <!-- Bottom Actions -->
          <div class="mt-6 flex gap-2">
            <button 
              type="button" 
              onclick="window.print()" 
              class="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
            >
              🖨️ Print Ticket
            </button>
            <button 
              type="button" 
              onclick="window.appController.showCustomerView('catalog')" 
              class="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors shadow-sm"
            >
              🍨 Order More
            </button>
          </div>
        </div>
      </div>
    `;

    setTimeout(() => {
      const qrContainer = document.getElementById('ticket-qrcode');
      if (qrContainer && window.QRCode) {
        qrContainer.innerHTML = '';
        new QRCode(qrContainer, {
          text: JSON.stringify({ orderId: order.id, orderNumber: order.orderNumber, shop: 'Surya Agencies' }),
          width: 140,
          height: 140,
          colorDark: '#0f172a',
          colorLight: '#ffffff',
          correctLevel: QRCode.CorrectLevel.H
        });
      }
    }, 50);
  }

  // --- MY ORDERS VIEW ---

  renderMyOrders() {
    const container = document.getElementById('customer-myorders-list');
    const emptyState = document.getElementById('customer-myorders-empty');
    if (!container) return;

    if (this.myOrders.length === 0) {
      container.innerHTML = '';
      if (emptyState) emptyState.classList.remove('hidden');
      return;
    }

    if (emptyState) emptyState.classList.add('hidden');

    container.innerHTML = this.myOrders.map(order => {
      const isCompleted = order.orderStatus === 'COMPLETED';
      const isReady = order.orderStatus === 'READY_FOR_PICKUP';

      let statusBadge = '';
      if (isCompleted) {
        statusBadge = `<span class="px-2.5 py-1 rounded-full text-xs font-extrabold bg-slate-100 text-slate-600">✓ Collected</span>`;
      } else if (isReady) {
        statusBadge = `<span class="px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 animate-pulse border border-emerald-300">🎉 Ready for Pickup</span>`;
      } else {
        statusBadge = `<span class="px-2.5 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800 border border-amber-300">🥣 ${order.orderStatus}</span>`;
      }

      const formattedDate = new Date(order.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

      return `
        <div class="bg-white rounded-3xl p-5 border border-slate-200 hover:border-rose-300 shadow-sm transition-all">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span class="text-base font-black text-rose-600 font-mono">${order.orderNumber}</span>
              <p class="text-[10px] text-slate-400">${formattedDate}</p>
            </div>
            <div>
              ${statusBadge}
            </div>
          </div>

          <div class="py-3">
            <p class="text-xs font-semibold text-slate-700">
              ${(order.items || []).map(i => `${i.name} × ${i.quantity}`).join(', ')}
            </p>
            <div class="mt-2 flex items-center justify-between text-xs">
              <span class="text-slate-500">Total: <strong class="text-slate-900 font-mono">₹${order.total}</strong></span>
              <span class="text-[10px] font-bold ${order.paymentStatus === 'PAID' ? 'text-emerald-700' : 'text-amber-700'}">
                ${order.paymentStatus === 'PAID' ? '✓ Paid' : 'Payment Pending'}
              </span>
            </div>
          </div>

          <button 
            type="button" 
            onclick="customerApp.showOrderTicket('${order.id}')"
            class="w-full py-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors flex items-center justify-center space-x-1.5"
          >
            <span>📱 View QR Pickup Ticket & Live Tracker</span>
          </button>
        </div>
      `;
    }).join('');
  }

  render() {
    this.renderCategories();
    this.renderProductGrid();
    this.updateCartBadge();
    this.updateMyOrdersBadge();
  }
}

window.customerApp = new CustomerApp();
