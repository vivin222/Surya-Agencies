/**
 * Admin / Shopkeeper App Controller
 * Ice Cream Shop Prototype
 */

class AdminApp {
  constructor(store) {
    this.store = store;
    this.activeTab = 'inventory'; // 'inventory' | 'orders' | 'pos' | 'scanner' | 'analytics'
    this.orderFilter = 'all';
    this.posCart = []; // [{ productId, quantity }]
    this.editingProductId = null;
    this.productImageBase64 = '';
    this.posSearchQuery = '';

    this.init();
  }

  init() {
    this.store.subscribe((state) => this.render(state));
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Navigation Tabs
    const tabButtons = document.querySelectorAll('.admin-nav-tab');
    tabButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const tab = btn.dataset.tab;
        if (tab) this.switchTab(tab);
      });
    });

    // Product Modal Image Uploader
    const imageInput = document.getElementById('admin-prod-image-input');
    if (imageInput) {
      imageInput.addEventListener('change', (e) => this.handleImageUpload(e));
    }

    // Product Form Stock Validation Live Listener
    const totalInput = document.getElementById('admin-prod-total-stock');
    const onlineInput = document.getElementById('admin-prod-online-stock');
    const walkinInput = document.getElementById('admin-prod-walkin-stock');

    [totalInput, onlineInput, walkinInput].forEach((input) => {
      if (input) {
        input.addEventListener('input', () => this.validateStockInputs());
      }
    });

    // Product Form Submission
    const productForm = document.getElementById('admin-product-form');
    if (productForm) {
      productForm.addEventListener('submit', (e) => this.handleProductFormSubmit(e));
    }

    // POS Walk-in Sale Form
    const posForm = document.getElementById('admin-pos-checkout-btn');
    if (posForm) {
      posForm.addEventListener('click', () => this.handlePosSaleSubmit());
    }

    // POS Search Input
    const posSearch = document.getElementById('admin-pos-search');
    if (posSearch) {
      posSearch.addEventListener('input', (e) => {
        this.posSearchQuery = e.target.value.toLowerCase().trim();
        this.renderPos(this.store.getState());
      });
    }

    // Manual QR/Order Lookup Form
    const manualOrderForm = document.getElementById('admin-manual-order-form');
    if (manualOrderForm) {
      manualOrderForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('admin-manual-order-input');
        if (input && input.value.trim()) {
          this.verifyOrderForPickup(input.value.trim());
        }
      });
    }
  }

  switchTab(tabName) {
    this.activeTab = tabName;

    // Update tab button styles
    document.querySelectorAll('.admin-nav-tab').forEach((btn) => {
      const isCurrent = btn.dataset.tab === tabName;
      btn.classList.toggle('active-tab', isCurrent);
      btn.classList.toggle('text-pink-600', isCurrent);
      btn.classList.toggle('bg-pink-50', isCurrent);
      btn.classList.toggle('text-slate-600', !isCurrent);
    });

    // Update section visibility
    const sections = ['inventory', 'orders', 'pos', 'scanner', 'analytics'];
    sections.forEach((sec) => {
      const el = document.getElementById(`admin-sec-${sec}`);
      if (el) el.classList.toggle('hidden', sec !== tabName);
    });

    // Initialize or stop QR camera if switching to/from scanner tab
    if (tabName === 'scanner') {
      if (window.qrScannerController) {
        window.qrScannerController.startScanner();
      }
    } else {
      if (window.qrScannerController) {
        window.qrScannerController.stopScanner();
      }
    }

    this.render(this.store.getState());
  }

  render(state) {
    // Check if first-run setup needed
    this.checkFirstRunSetup(state);

    // Render Order Badge Count on tab
    const pendingOrdersCount = state.orders.filter((o) => ['Order Placed', 'Order Accepted', 'Preparing'].includes(o.orderStatus)).length;
    const orderBadge = document.getElementById('admin-orders-count-badge');
    if (orderBadge) {
      orderBadge.textContent = pendingOrdersCount;
      orderBadge.classList.toggle('hidden', pendingOrdersCount === 0);
    }

    if (this.activeTab === 'inventory') this.renderInventory(state);
    if (this.activeTab === 'orders') this.renderOrders(state);
    if (this.activeTab === 'pos') this.renderPos(state);
    if (this.activeTab === 'analytics') this.renderAnalytics(state);
  }

  checkFirstRunSetup(state) {
    const setupBanner = document.getElementById('admin-first-run-banner');
    if (!setupBanner) return;

    if (state.products.length === 0) {
      setupBanner.classList.remove('hidden');
    } else {
      setupBanner.classList.add('hidden');
    }
  }

  /* ==========================================================================
     INVENTORY MANAGEMENT
     ========================================================================== */

  renderInventory(state) {
    const tableBody = document.getElementById('admin-inventory-table-body');
    const cardsGrid = document.getElementById('admin-inventory-cards');
    const emptyState = document.getElementById('admin-inventory-empty');

    if (state.products.length === 0) {
      if (tableBody) tableBody.innerHTML = '';
      if (cardsGrid) cardsGrid.innerHTML = '';
      if (emptyState) emptyState.classList.remove('hidden');
      return;
    }

    if (emptyState) emptyState.classList.add('hidden');

    const fallbackImg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%23f472b6' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m7 11 4.08 10.35a1 1 0 0 0 1.84 0L17 11'/%3E%3Cpath d='M17 7A5 5 0 0 0 7 7c0 2 2 4 5 4s5-2 5-4Z'/%3E%3C/svg%3E";

    // Table view (for desktop)
    if (tableBody) {
      tableBody.innerHTML = state.products
        .map((p) => {
          const unallocated = p.totalStock - (p.onlineStock + p.walkInStock);
          const imgSrc = p.image && p.image.trim().length > 0 ? p.image : fallbackImg;

          return `
          <tr class="border-b border-slate-100 hover:bg-slate-50/70 transition-colors">
            <td class="py-3.5 px-4">
              <div class="flex items-center space-x-3">
                <div class="w-12 h-12 rounded-xl bg-pink-50 overflow-hidden flex-shrink-0 border border-pink-100">
                  <img src="${escapeHtml(imgSrc)}" alt="${escapeHtml(p.name)}" class="w-full h-full object-cover" onerror="this.src='${fallbackImg}'"/>
                </div>
                <div>
                  <div class="font-bold text-slate-800 text-sm">${escapeHtml(p.name)}</div>
                  <div class="text-xs text-slate-400">${escapeHtml(p.category)}</div>
                </div>
              </div>
            </td>
            <td class="py-3.5 px-4 font-bold text-slate-800 text-sm">
              ₹${p.price}
            </td>
            <td class="py-3.5 px-4">
              <span class="font-black text-slate-900 text-sm bg-slate-100 px-2.5 py-1 rounded-lg">
                ${p.totalStock}
              </span>
            </td>
            <td class="py-3.5 px-4">
              <div class="flex items-center space-x-1.5">
                <span class="font-bold text-xs px-2.5 py-1 rounded-lg ${p.onlineStock > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}">
                  ${p.onlineStock}
                </span>
                <div class="flex items-center space-x-1">
                  <button type="button" class="w-5 h-5 rounded bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold" onclick="adminApp.adjustStock('${p.id}', 'online', -1)">-</button>
                  <button type="button" class="w-5 h-5 rounded bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold" onclick="adminApp.adjustStock('${p.id}', 'online', 1)">+</button>
                </div>
              </div>
            </td>
            <td class="py-3.5 px-4">
              <div class="flex items-center space-x-1.5">
                <span class="font-bold text-xs px-2.5 py-1 rounded-lg ${p.walkInStock > 0 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'}">
                  ${p.walkInStock}
                </span>
                <div class="flex items-center space-x-1">
                  <button type="button" class="w-5 h-5 rounded bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold" onclick="adminApp.adjustStock('${p.id}', 'walkin', -1)">-</button>
                  <button type="button" class="w-5 h-5 rounded bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold" onclick="adminApp.adjustStock('${p.id}', 'walkin', 1)">+</button>
                </div>
              </div>
            </td>
            <td class="py-3.5 px-4">
              <button 
                type="button" 
                class="px-2.5 py-1 text-xs font-bold rounded-lg border transition-colors ${
                  p.onlineAvailable ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                }"
                onclick="adminApp.toggleOnline('${p.id}')"
              >
                ${p.onlineAvailable ? '✓ Online Enabled' : '✕ Disabled'}
              </button>
            </td>
            <td class="py-3.5 px-4 text-right">
              <div class="flex items-center justify-end space-x-2">
                <button 
                  type="button" 
                  class="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors" 
                  title="Edit Product"
                  onclick="adminApp.openEditProductModal('${p.id}')"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                </button>
                <button 
                  type="button" 
                  class="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors" 
                  title="Delete Product"
                  onclick="adminApp.deleteProduct('${p.id}')"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                </button>
              </div>
            </td>
          </tr>
        `;
        })
        .join('');
    }
  }

  openAddProductModal() {
    this.editingProductId = null;
    this.productImageBase64 = '';

    const modal = document.getElementById('admin-product-modal');
    const title = document.getElementById('admin-product-modal-title');
    const form = document.getElementById('admin-product-form');
    const preview = document.getElementById('admin-prod-image-preview');

    if (title) title.textContent = '✨ Add New Ice Cream Product';
    if (form) form.reset();
    if (preview) {
      preview.src = '';
      preview.classList.add('hidden');
    }

    const availableToggle = document.getElementById('admin-prod-online-avail');
    if (availableToggle) availableToggle.checked = true;

    this.validateStockInputs();
    if (modal) modal.classList.remove('hidden');
  }

  openEditProductModal(productId) {
    const product = this.store.getState().products.find((p) => p.id === productId);
    if (!product) return;

    this.editingProductId = productId;
    this.productImageBase64 = product.image || '';

    const modal = document.getElementById('admin-product-modal');
    const title = document.getElementById('admin-product-modal-title');
    const preview = document.getElementById('admin-prod-image-preview');

    if (title) title.textContent = `✏️ Edit Product: ${product.name}`;

    document.getElementById('admin-prod-name').value = product.name;
    document.getElementById('admin-prod-category').value = product.category;
    document.getElementById('admin-prod-price').value = product.price;
    document.getElementById('admin-prod-total-stock').value = product.totalStock;
    document.getElementById('admin-prod-online-stock').value = product.onlineStock;
    document.getElementById('admin-prod-walkin-stock').value = product.walkInStock;
    document.getElementById('admin-prod-description').value = product.description || '';
    document.getElementById('admin-prod-online-avail').checked = product.onlineAvailable;

    if (preview && product.image) {
      preview.src = product.image;
      preview.classList.remove('hidden');
    } else if (preview) {
      preview.classList.add('hidden');
    }

    this.validateStockInputs();
    if (modal) modal.classList.remove('hidden');
  }

  closeProductModal() {
    const modal = document.getElementById('admin-product-modal');
    if (modal) modal.classList.add('hidden');
    this.editingProductId = null;
    this.productImageBase64 = '';
  }

  handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      this.showToast('Image file too large (Max 2MB)', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (loadEvt) => {
      this.productImageBase64 = loadEvt.target.result;
      const preview = document.getElementById('admin-prod-image-preview');
      if (preview) {
        preview.src = this.productImageBase64;
        preview.classList.remove('hidden');
      }
    };
    reader.readAsDataURL(file);
  }

  validateStockInputs() {
    const totalEl = document.getElementById('admin-prod-total-stock');
    const onlineEl = document.getElementById('admin-prod-online-stock');
    const walkinEl = document.getElementById('admin-prod-walkin-stock');
    const helperEl = document.getElementById('admin-stock-validation-msg');
    const submitBtn = document.getElementById('admin-product-submit-btn');

    const total = Number(totalEl ? totalEl.value : 0) || 0;
    const online = Number(onlineEl ? onlineEl.value : 0) || 0;
    const walkin = Number(walkinEl ? walkinEl.value : 0) || 0;

    const sum = online + walkin;
    const isValid = sum <= total;

    if (helperEl) {
      if (isValid) {
        const unallocated = total - sum;
        helperEl.className = 'text-xs text-emerald-600 font-semibold mt-1';
        helperEl.textContent = `✓ Stock allocation valid: Online (${online}) + Walk-in (${walkin}) = ${sum}/${total} units. (Unallocated buffer: ${unallocated})`;
      } else {
        const excess = sum - total;
        helperEl.className = 'text-xs text-rose-600 font-bold mt-1';
        helperEl.textContent = `❌ Online (${online}) + Walk-in (${walkin}) = ${sum} exceeds Total Stock (${total}) by ${excess} units!`;
      }
    }

    if (submitBtn) {
      submitBtn.disabled = !isValid;
    }

    return isValid;
  }

  handleProductFormSubmit(e) {
    e.preventDefault();

    if (!this.validateStockInputs()) {
      this.showToast('Please fix stock allocation before saving.', 'error');
      return;
    }

    const name = document.getElementById('admin-prod-name').value;
    const category = document.getElementById('admin-prod-category').value;
    const price = Number(document.getElementById('admin-prod-price').value);
    const totalStock = Number(document.getElementById('admin-prod-total-stock').value);
    const onlineStock = Number(document.getElementById('admin-prod-online-stock').value);
    const walkInStock = Number(document.getElementById('admin-prod-walkin-stock').value);
    const description = document.getElementById('admin-prod-description').value;
    const onlineAvailable = document.getElementById('admin-prod-online-avail').checked;

    try {
      if (this.editingProductId) {
        this.store.updateProduct(this.editingProductId, {
          name,
          category,
          price,
          totalStock,
          onlineStock,
          walkInStock,
          description,
          onlineAvailable,
          ...(this.productImageBase64 ? { image: this.productImageBase64 } : {})
        });
        this.showToast('Product updated successfully! 🍦', 'success');
      } else {
        this.store.addProduct({
          name,
          category,
          price,
          totalStock,
          onlineStock,
          walkInStock,
          description,
          onlineAvailable,
          image: this.productImageBase64
        });
        this.showToast('New product added to inventory! 🍦', 'success');
      }

      this.closeProductModal();
    } catch (err) {
      this.showToast(err.message, 'error');
    }
  }

  deleteProduct(productId) {
    if (confirm('Are you sure you want to remove this product from inventory?')) {
      try {
        this.store.deleteProduct(productId);
        this.showToast('Product deleted from catalog', 'info');
      } catch (err) {
        this.showToast(err.message, 'error');
      }
    }
  }

  adjustStock(productId, pool, delta) {
    try {
      this.store.quickStockAdjust(productId, pool, delta);
    } catch (err) {
      this.showToast(err.message, 'error');
    }
  }

  toggleOnline(productId) {
    try {
      this.store.toggleOnlineAvailability(productId);
    } catch (err) {
      this.showToast(err.message, 'error');
    }
  }

  /* ==========================================================================
     LIVE ORDERS DASHBOARD
     ========================================================================== */

  renderOrders(state) {
    const listContainer = document.getElementById('admin-orders-list');
    const emptyMsg = document.getElementById('admin-orders-empty');
    if (!listContainer) return;

    let orders = state.orders;

    if (this.orderFilter !== 'all') {
      if (this.orderFilter === 'active') {
        orders = orders.filter((o) => ['Order Placed', 'Order Accepted', 'Preparing', 'Ready for Pickup'].includes(o.orderStatus));
      } else {
        orders = orders.filter((o) => o.orderStatus === this.orderFilter);
      }
    }

    if (orders.length === 0) {
      listContainer.innerHTML = '';
      if (emptyMsg) emptyMsg.classList.remove('hidden');
      return;
    }

    if (emptyMsg) emptyMsg.classList.add('hidden');

    listContainer.innerHTML = orders
      .map((order) => {
        const isPaid = order.paymentStatus === 'Paid';
        const isPending = order.paymentStatus === 'Pending';

        return `
        <div class="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:border-pink-300 transition-all">
          <div class="flex flex-wrap items-center justify-between gap-2 mb-3 pb-3 border-b border-slate-100">
            <div class="flex items-center space-x-2">
              <span class="font-extrabold text-base text-slate-900 font-mono">${order.orderId}</span>
              <span class="text-xs px-2.5 py-0.5 rounded-full font-bold ${
                order.orderStatus === 'Ready for Pickup'
                  ? 'bg-emerald-100 text-emerald-800 animate-pulse'
                  : order.orderStatus === 'Preparing'
                  ? 'bg-amber-100 text-amber-800'
                  : order.orderStatus === 'Picked Up'
                  ? 'bg-slate-100 text-slate-600'
                  : order.orderStatus === 'Cancelled'
                  ? 'bg-rose-100 text-rose-800'
                  : 'bg-blue-100 text-blue-800'
              }">${order.orderStatus}</span>
            </div>

            <div class="flex items-center space-x-2">
              <span class="text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                isPaid ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
              }">
                ${isPaid ? '✓ Paid Online' : '⚠️ Pay at Shop (Pending)'}
              </span>
              <span class="text-xs text-slate-400 font-medium">
                ${new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>

          <div class="mb-3">
            <div class="text-xs font-semibold text-slate-500 mb-1">
              Customer: <span class="text-slate-800">${escapeHtml(order.customerName)}</span> ${order.customerPhone !== 'N/A' ? `(${escapeHtml(order.customerPhone)})` : ''}
            </div>
            ${order.notes ? `<div class="text-xs text-amber-700 bg-amber-50 p-1.5 rounded-lg mb-2">Note: "${escapeHtml(order.notes)}"</div>` : ''}
            
            <div class="bg-slate-50 p-2.5 rounded-xl space-y-1">
              ${order.items
                .map(
                  (i) => `
                <div class="flex justify-between text-xs">
                  <span class="font-medium text-slate-700">${escapeHtml(i.name)} × ${i.quantity}</span>
                  <span class="font-bold text-slate-900">₹${i.itemTotal}</span>
                </div>
              `
                )
                .join('')}
            </div>
          </div>

          <div class="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
            <div class="text-sm font-extrabold text-pink-600">
              Total: ₹${order.total}
            </div>

            <div class="flex items-center space-x-1.5">
              ${
                order.orderStatus === 'Order Placed'
                  ? `
                <button type="button" class="btn-primary py-1.5 px-3 text-xs font-bold rounded-xl" onclick="adminApp.advanceOrderStatus('${order.orderId}', 'Order Accepted')">
                  Accept Order
                </button>
              `
                  : ''
              }
              ${
                order.orderStatus === 'Order Accepted'
                  ? `
                <button type="button" class="bg-amber-500 hover:bg-amber-600 text-white py-1.5 px-3 text-xs font-bold rounded-xl shadow-sm transition-colors" onclick="adminApp.advanceOrderStatus('${order.orderId}', 'Preparing')">
                  👨‍🍳 Start Preparing
                </button>
              `
                  : ''
              }
              ${
                order.orderStatus === 'Preparing'
                  ? `
                <button type="button" class="bg-emerald-600 hover:bg-emerald-700 text-white py-1.5 px-3 text-xs font-bold rounded-xl shadow-sm transition-colors" onclick="adminApp.advanceOrderStatus('${order.orderId}', 'Ready for Pickup')">
                  🔔 Ready for Pickup
                </button>
              `
                  : ''
              }
              ${
                order.orderStatus === 'Ready for Pickup'
                  ? `
                <button type="button" class="bg-purple-600 hover:bg-purple-700 text-white py-1.5 px-3 text-xs font-bold rounded-xl shadow-sm transition-colors" onclick="adminApp.openPickupVerificationModal('${order.orderId}')">
                  🚀 Complete Pickup
                </button>
              `
                  : ''
              }
              ${
                ['Order Placed', 'Order Accepted'].includes(order.orderStatus)
                  ? `
                <button type="button" class="text-rose-600 hover:bg-rose-50 py-1.5 px-2 text-xs font-semibold rounded-xl transition-colors" onclick="adminApp.cancelOrder('${order.orderId}')">
                  Cancel
                </button>
              `
                  : ''
              }
            </div>
          </div>
        </div>
      `;
      })
      .join('');
  }

  filterOrders(filter) {
    this.orderFilter = filter;
    document.querySelectorAll('.order-filter-pill').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.filter === filter);
    });
    this.renderOrders(this.store.getState());
  }

  advanceOrderStatus(orderId, nextStatus) {
    try {
      this.store.updateOrderStatus(orderId, nextStatus);
      this.showToast(`Order status updated to "${nextStatus}"`, 'success');
    } catch (e) {
      this.showToast(e.message, 'error');
    }
  }

  cancelOrder(orderId) {
    if (confirm(`Cancel Order ${orderId}? Online stock will be restored.`)) {
      try {
        this.store.updateOrderStatus(orderId, 'Cancelled', { note: 'Cancelled by shopkeeper' });
        this.showToast('Order cancelled & stock restored.', 'info');
      } catch (e) {
        this.showToast(e.message, 'error');
      }
    }
  }

  /* ==========================================================================
     QR SCANNING & PICKUP VERIFICATION
     ========================================================================== */

  verifyOrderForPickup(query) {
    let cleanCode = query.trim().toUpperCase();
    if (!cleanCode.startsWith('#') && cleanCode.startsWith('A')) {
      cleanCode = '#' + cleanCode;
    }

    const state = this.store.getState();
    const order = state.orders.find((o) => o.orderId.toUpperCase() === cleanCode || o.orderCode.toUpperCase() === cleanCode.replace('#', ''));

    if (!order) {
      this.showToast(`Order "${query}" not found!`, 'error');
      return;
    }

    this.openPickupVerificationModal(order.orderId);
  }

  openPickupVerificationModal(orderId) {
    const order = this.store.getState().orders.find((o) => o.orderId === orderId);
    if (!order) return;

    const modal = document.getElementById('admin-pickup-modal');
    const content = document.getElementById('admin-pickup-modal-content');

    const isPaid = order.paymentStatus === 'Paid';
    const isCompleted = order.orderStatus === 'Picked Up';

    if (content) {
      content.innerHTML = `
        <div class="p-5 text-left">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div>
              <div class="text-xs text-slate-400 font-semibold">VERIFYING PICKUP</div>
              <div class="text-xl font-black text-slate-900 font-mono">${order.orderId}</div>
            </div>
            <span class="text-xs font-extrabold px-3 py-1 rounded-full ${
              isCompleted ? 'bg-slate-100 text-slate-700' : 'bg-emerald-100 text-emerald-800'
            }">${order.orderStatus}</span>
          </div>

          <div class="mb-4 bg-slate-50 p-3.5 rounded-2xl">
            <div class="text-xs font-semibold text-slate-600 mb-1">Customer: <strong class="text-slate-900">${escapeHtml(order.customerName)}</strong></div>
            <div class="text-xs font-semibold text-slate-600 mb-2">Phone: <strong class="text-slate-900">${escapeHtml(order.customerPhone)}</strong></div>
            
            <div class="border-t border-slate-200/60 pt-2 space-y-1">
              ${order.items
                .map(
                  (i) => `
                <div class="flex justify-between text-xs">
                  <span class="text-slate-700 font-medium">${escapeHtml(i.name)} × ${i.quantity}</span>
                  <span class="font-bold text-slate-900">₹${i.itemTotal}</span>
                </div>
              `
                )
                .join('')}
            </div>

            <div class="flex justify-between items-center text-sm font-black text-slate-900 pt-2.5 mt-2 border-t border-slate-200">
              <span>Total Amount</span>
              <span class="text-pink-600 text-base">₹${order.total}</span>
            </div>
          </div>

          <div class="mb-5">
            ${
              isPaid
                ? `
              <div class="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl flex items-center space-x-2 text-xs font-bold">
                <svg class="w-5 h-5 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                <span>Payment Verified (Paid Online)</span>
              </div>
            `
                : `
              <div class="p-3.5 bg-amber-50 text-amber-900 border border-amber-200 rounded-xl">
                <div class="flex items-center space-x-2 text-xs font-extrabold text-amber-800 mb-1">
                  <span>⚠️ Payment Pending at Counter: ₹${order.total}</span>
                </div>
                <p class="text-[11px] text-amber-700 mb-2">Please collect ₹${order.total} via Cash or Shop UPI QR before handing over order.</p>
                <button type="button" class="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold shadow-sm transition-colors" onclick="adminApp.confirmPaymentReceived('${order.orderId}')">
                  ✓ Mark Payment Received (₹${order.total})
                </button>
              </div>
            `
            }
          </div>

          <div class="flex items-center space-x-2">
            ${
              !isCompleted
                ? `
              <button 
                type="button" 
                class="flex-1 btn-primary py-3 text-xs font-bold rounded-xl shadow-md shadow-pink-500/20"
                onclick="adminApp.completeOrderPickup('${order.orderId}')"
              >
                🚀 Handover Order & Complete Pickup
              </button>
            `
                : `
              <div class="w-full text-center py-2 text-xs font-bold text-slate-500 bg-slate-100 rounded-xl">
                ✓ Order Completed & Picked Up
              </div>
            `
            }
            <button type="button" class="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors" onclick="adminApp.closePickupModal()">
              Close
            </button>
          </div>
        </div>
      `;
    }

    if (modal) modal.classList.remove('hidden');
  }

  confirmPaymentReceived(orderId) {
    try {
      this.store.markPaymentReceived(orderId);
      this.showToast('Payment marked as received! 💵', 'success');
      this.openPickupVerificationModal(orderId);
    } catch (e) {
      this.showToast(e.message, 'error');
    }
  }

  completeOrderPickup(orderId) {
    try {
      this.store.updateOrderStatus(orderId, 'Picked Up', { note: 'Completed at shop counter via QR pickup' });
      this.showToast('🎉 Order completed & handed over to customer!', 'success');
      this.closePickupModal();
    } catch (e) {
      this.showToast(e.message, 'error');
    }
  }

  closePickupModal() {
    const modal = document.getElementById('admin-pickup-modal');
    if (modal) modal.classList.add('hidden');
  }

  /* ==========================================================================
     WALK-IN SALES (POS TERMINAL)
     ========================================================================== */

  renderPos(state) {
    const grid = document.getElementById('admin-pos-products-grid');
    const cartContainer = document.getElementById('admin-pos-cart-items');
    const totalEl = document.getElementById('admin-pos-cart-total');
    const emptyPosMsg = document.getElementById('admin-pos-empty-products');

    let products = state.products;

    if (this.posSearchQuery) {
      products = products.filter(
        (p) => p.name.toLowerCase().includes(this.posSearchQuery) || p.category.toLowerCase().includes(this.posSearchQuery)
      );
    }

    if (products.length === 0) {
      if (grid) grid.innerHTML = '';
      if (emptyPosMsg) emptyPosMsg.classList.remove('hidden');
    } else {
      if (emptyPosMsg) emptyPosMsg.classList.add('hidden');
      if (grid) {
        grid.innerHTML = products
          .map((p) => {
            const hasStock = p.walkInStock > 0;
            const inCart = this.posCart.find((i) => i.productId === p.id);
            const cartQty = inCart ? inCart.quantity : 0;

            return `
            <div 
              class="p-3.5 bg-white rounded-2xl border ${
                cartQty > 0 ? 'border-pink-500 bg-pink-50/20 ring-2 ring-pink-100' : 'border-slate-200'
              } flex flex-col justify-between cursor-pointer hover:border-pink-400 transition-all ${
              !hasStock ? 'opacity-50 cursor-not-allowed' : ''
            }"
              onclick="${hasStock ? `adminApp.addPosItem('${p.id}')` : ''}"
            >
              <div>
                <div class="flex items-center justify-between mb-1.5">
                  <span class="text-[11px] font-semibold text-slate-400">${escapeHtml(p.category)}</span>
                  <span class="text-xs font-black px-2 py-0.5 rounded-md ${
                    p.walkInStock > 5 ? 'bg-amber-100 text-amber-800' : p.walkInStock > 0 ? 'bg-rose-100 text-rose-800' : 'bg-slate-200 text-slate-500'
                  }">
                    Walk-in: ${p.walkInStock}
                  </span>
                </div>
                <h4 class="font-bold text-sm text-slate-800 line-clamp-1">${escapeHtml(p.name)}</h4>
              </div>

              <div class="flex items-center justify-between mt-3 pt-2 border-t border-slate-100">
                <span class="font-extrabold text-pink-600 text-sm">₹${p.price}</span>
                ${
                  cartQty > 0
                    ? `<span class="w-6 h-6 rounded-full bg-pink-600 text-white font-bold text-xs flex items-center justify-center">${cartQty}</span>`
                    : `<span class="text-xs font-bold text-slate-400">+ Add</span>`
                }
              </div>
            </div>
          `;
          })
          .join('');
      }
    }

    // Render POS Cart
    let total = 0;
    if (this.posCart.length === 0) {
      if (cartContainer) {
        cartContainer.innerHTML = `
          <div class="p-6 text-center text-slate-400 text-xs">
            Tap products to add to walk-in cart.
          </div>
        `;
      }
      if (totalEl) totalEl.textContent = '₹0';
    } else {
      if (cartContainer) {
        cartContainer.innerHTML = this.posCart
          .map((item) => {
            const product = state.products.find((p) => p.id === item.productId);
            if (!product) return '';
            const itemTotal = product.price * item.quantity;
            total += itemTotal;

            return `
            <div class="flex items-center justify-between py-2 border-b border-slate-100 text-xs">
              <div>
                <div class="font-bold text-slate-800">${escapeHtml(product.name)}</div>
                <div class="text-slate-400">₹${product.price} × ${item.quantity}</div>
              </div>
              <div class="flex items-center space-x-2">
                <span class="font-black text-slate-900">₹${itemTotal}</span>
                <div class="flex items-center space-x-1">
                  <button type="button" class="w-5 h-5 rounded bg-slate-200 text-slate-700 font-bold" onclick="adminApp.updatePosItemQty('${product.id}', ${item.quantity - 1})">-</button>
                  <button type="button" class="w-5 h-5 rounded bg-slate-200 text-slate-700 font-bold ${item.quantity >= product.walkInStock ? 'opacity-40' : ''}" onclick="adminApp.updatePosItemQty('${product.id}', ${item.quantity + 1})" ${item.quantity >= product.walkInStock ? 'disabled' : ''}>+</button>
                </div>
              </div>
            </div>
          `;
          })
          .join('');
      }
      if (totalEl) totalEl.textContent = `₹${total}`;
    }
  }

  addPosItem(productId) {
    const product = this.store.getState().products.find((p) => p.id === productId);
    if (!product || product.walkInStock <= 0) {
      this.showToast('No walk-in stock available.', 'error');
      return;
    }

    const inCart = this.posCart.find((i) => i.productId === productId);
    if (inCart) {
      if (inCart.quantity < product.walkInStock) {
        inCart.quantity++;
      } else {
        this.showToast(`Only ${product.walkInStock} units in walk-in stock.`, 'error');
      }
    } else {
      this.posCart.push({ productId, quantity: 1 });
    }

    this.renderPos(this.store.getState());
  }

  updatePosItemQty(productId, newQty) {
    if (newQty <= 0) {
      this.posCart = this.posCart.filter((i) => i.productId !== productId);
    } else {
      const item = this.posCart.find((i) => i.productId === productId);
      if (item) item.quantity = newQty;
    }
    this.renderPos(this.store.getState());
  }

  clearPosCart() {
    this.posCart = [];
    this.renderPos(this.store.getState());
  }

  handlePosSaleSubmit() {
    if (this.posCart.length === 0) {
      this.showToast('Walk-in cart is empty!', 'error');
      return;
    }

    const paymentMethodEl = document.querySelector('input[name="admin-pos-payment"]:checked');
    const paymentMethod = paymentMethodEl ? paymentMethodEl.value : 'cash';

    try {
      const sale = this.store.recordWalkInSale({
        items: this.posCart,
        paymentMethod
      });

      this.clearPosCart();
      this.showToast('✓ Walk-in sale completed! Walk-in stock deducted.', 'success');
      this.openPosReceiptModal(sale);
    } catch (err) {
      this.showToast(err.message, 'error');
    }
  }

  openPosReceiptModal(sale) {
    const modal = document.getElementById('admin-receipt-modal');
    const content = document.getElementById('admin-receipt-content');

    if (content) {
      content.innerHTML = `
        <div class="p-6 text-center font-mono">
          <div class="text-2xl mb-1">🍦</div>
          <h3 class="font-extrabold text-base text-slate-900">ICE CREAM SHOP</h3>
          <p class="text-xs text-slate-400 mb-3">Walk-in Customer Receipt</p>
          
          <div class="text-xs text-slate-500 pb-2 border-b border-dashed border-slate-300 mb-3 text-left">
            <div>Receipt ID: ${sale.saleId}</div>
            <div>Time: ${new Date(sale.createdAt).toLocaleTimeString()}</div>
            <div>Payment: ${sale.paymentMethod.toUpperCase()} (PAID)</div>
          </div>

          <div class="space-y-1.5 text-xs text-left mb-3 pb-3 border-b border-dashed border-slate-300">
            ${sale.items
              .map(
                (i) => `
              <div class="flex justify-between">
                <span>${escapeHtml(i.name)} × ${i.quantity}</span>
                <span>₹${i.itemTotal}</span>
              </div>
            `
              )
              .join('')}
          </div>

          <div class="flex justify-between text-sm font-black text-slate-900 mb-4">
            <span>TOTAL PAID</span>
            <span>₹${sale.total}</span>
          </div>

          <p class="text-[10px] text-slate-400 mb-4">Thank you for visiting! Have a sweet day 🍨</p>

          <button type="button" class="btn-primary py-2 px-6 text-xs font-bold rounded-xl" onclick="adminApp.closeReceiptModal()">
            Done
          </button>
        </div>
      `;
    }

    if (modal) modal.classList.remove('hidden');
  }

  closeReceiptModal() {
    const modal = document.getElementById('admin-receipt-modal');
    if (modal) modal.classList.add('hidden');
  }

  /* ==========================================================================
     SALES & INVENTORY ANALYTICS
     ========================================================================== */

  renderAnalytics(state) {
    const analytics = this.store.getAnalyticsSummary();

    // Summary Cards
    const setTxt = (id, txt) => {
      const el = document.getElementById(id);
      if (el) el.textContent = txt;
    };

    setTxt('stat-online-orders', analytics.online.ordersCount);
    setTxt('stat-online-revenue', `₹${analytics.online.revenue}`);
    setTxt('stat-online-items', analytics.online.itemsSold);

    setTxt('stat-walkin-sales', analytics.walkIn.salesCount);
    setTxt('stat-walkin-revenue', `₹${analytics.walkIn.revenue}`);
    setTxt('stat-walkin-items', analytics.walkIn.itemsSold);

    setTxt('stat-total-orders', analytics.overall.totalOrders);
    setTxt('stat-total-revenue', `₹${analytics.overall.totalRevenue}`);
    setTxt('stat-total-items', analytics.overall.totalItemsSold);

    setTxt('stat-stock-online', analytics.overall.currentOnlineStock);
    setTxt('stat-stock-walkin', analytics.overall.currentWalkInStock);
    setTxt('stat-stock-total', analytics.overall.currentTotalStock);

    // Top Selling Products Leaderboard
    const topList = document.getElementById('admin-top-products-list');
    if (topList) {
      if (analytics.overall.topProducts.length === 0) {
        topList.innerHTML = `<div class="p-6 text-center text-xs text-slate-400">No sales recorded yet.</div>`;
      } else {
        topList.innerHTML = analytics.overall.topProducts
          .slice(0, 5)
          .map(
            (p, idx) => `
            <div class="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100 shadow-sm text-xs">
              <div class="flex items-center space-x-3">
                <span class="w-6 h-6 rounded-full bg-pink-100 text-pink-700 font-extrabold flex items-center justify-center text-xs">#${idx + 1}</span>
                <div>
                  <div class="font-bold text-slate-800">${escapeHtml(p.name)}</div>
                  <div class="text-[11px] text-slate-400">Online: ${p.onlineQty} | Walk-in: ${p.walkInQty}</div>
                </div>
              </div>
              <div class="text-right">
                <div class="font-black text-slate-900">${p.totalQty} sold</div>
                <div class="text-[11px] text-pink-600 font-semibold">₹${p.totalRevenue}</div>
              </div>
            </div>
          `
          )
          .join('');
      }
    }

    // Recent Transactions Log
    const salesTable = document.getElementById('admin-transactions-table-body');
    if (salesTable) {
      if (state.sales.length === 0) {
        salesTable.innerHTML = `<tr><td colspan="5" class="py-6 text-center text-xs text-slate-400">No transactions yet.</td></tr>`;
      } else {
        salesTable.innerHTML = state.sales
          .map(
            (sale) => `
            <tr class="border-b border-slate-100 text-xs">
              <td class="py-2.5 px-3 font-mono font-bold text-slate-700">${sale.saleId.slice(0, 14)}</td>
              <td class="py-2.5 px-3">
                <span class="px-2 py-0.5 rounded-full font-bold ${
                  sale.type === 'online' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                }">${sale.type === 'online' ? '🌐 Online Order' : '🚶 Walk-in Sale'}</span>
              </td>
              <td class="py-2.5 px-3 text-slate-600">${sale.items.map((i) => `${escapeHtml(i.name)} (${i.quantity})`).join(', ')}</td>
              <td class="py-2.5 px-3 font-extrabold text-slate-900">₹${sale.total}</td>
              <td class="py-2.5 px-3 text-slate-400">${new Date(sale.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
            </tr>
          `
          )
          .join('');
      }
    }
  }

  loadSampleFlavors() {
    if (confirm('Load 4 delicious generic sample flavors into your inventory?')) {
      this.store.seedSampleProducts();
      this.showToast('Sample products added! 🍨', 'success');
    }
  }

  resetAllData() {
    if (confirm('⚠️ WARNING: This will clear all products, orders, and sales data. Continue?')) {
      this.store.clearAllData();
      this.showToast('Database reset complete.', 'info');
    }
  }

  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    const bgColors = {
      success: 'bg-emerald-600 text-white',
      error: 'bg-rose-600 text-white',
      info: 'bg-slate-900 text-white'
    };

    toast.className = `fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-2xl shadow-2xl font-semibold text-xs transition-all duration-300 flex items-center space-x-2 ${bgColors[type] || bgColors.info}`;
    toast.innerHTML = `<span>${escapeHtml(message)}</span>`;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-2');
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }
}

window.adminApp = new AdminApp(window.iceCreamStore);
