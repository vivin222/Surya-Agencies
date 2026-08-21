/**
 * Store - Centralized Reactive State & Split-Stock Management Engine
 * Ice Cream Shop Prototype
 */

const STORAGE_KEYS = {
  PRODUCTS: 'icecream_products_v1',
  ORDERS: 'icecream_orders_v1',
  SALES: 'icecream_sales_v1',
  CONFIG: 'icecream_config_v1'
};

class Store {
  constructor() {
    this.listeners = new Set();
    this.broadcastChannel = null;
    this.state = {
      products: [],
      orders: [],
      sales: [],
      config: {
        shopName: '🍦 ICE CREAM SHOP',
        currency: '₹',
        autoAcceptOrders: false,
        soundNotifications: true
      },
      cart: []
    };

    this.init();
  }

  init() {
    this.loadFromStorage();

    // Cross-tab sync via BroadcastChannel
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        this.broadcastChannel = new BroadcastChannel('icecream_shop_sync');
        this.broadcastChannel.onmessage = (event) => {
          if (event.data && event.data.type === 'STATE_UPDATED') {
            this.loadFromStorage(false);
          }
        };
      } catch (e) {
        console.warn('BroadcastChannel not supported, falling back to storage events', e);
      }
    }

    // Fallback cross-tab sync via storage events
    window.addEventListener('storage', (e) => {
      if (Object.values(STORAGE_KEYS).includes(e.key)) {
        this.loadFromStorage(false);
      }
    });
  }

  loadFromStorage(triggerNotify = true) {
    try {
      const storedProducts = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      const storedOrders = localStorage.getItem(STORAGE_KEYS.ORDERS);
      const storedSales = localStorage.getItem(STORAGE_KEYS.SALES);
      const storedConfig = localStorage.getItem(STORAGE_KEYS.CONFIG);

      this.state.products = storedProducts ? JSON.parse(storedProducts) : [];
      this.state.orders = storedOrders ? JSON.parse(storedOrders) : [];
      this.state.sales = storedSales ? JSON.parse(storedSales) : [];
      if (storedConfig) {
        this.state.config = { ...this.state.config, ...JSON.parse(storedConfig) };
      }

      // Restore cart from session or memory
      const storedCart = sessionStorage.getItem('icecream_cart');
      if (storedCart) {
        this.state.cart = JSON.parse(storedCart);
      }
    } catch (err) {
      console.error('Error loading data from localStorage:', err);
    }

    if (triggerNotify) {
      this.notifyListeners();
    }
  }

  saveToStorage(broadcast = true) {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(this.state.products));
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(this.state.orders));
      localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(this.state.sales));
      localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(this.state.config));
      sessionStorage.setItem('icecream_cart', JSON.stringify(this.state.cart));
    } catch (err) {
      console.error('Error saving data to localStorage:', err);
    }

    if (broadcast && this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage({ type: 'STATE_UPDATED', timestamp: Date.now() });
      } catch (e) {
        console.warn('Broadcast failed:', e);
      }
    }

    this.notifyListeners();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notifyListeners() {
    this.listeners.forEach((listener) => {
      try {
        listener(this.getState());
      } catch (err) {
        console.error('Error in store listener:', err);
      }
    });
  }

  getState() {
    return {
      products: [...this.state.products],
      orders: [...this.state.orders],
      sales: [...this.state.sales],
      config: { ...this.state.config },
      cart: [...this.state.cart]
    };
  }

  /* ==========================================================================
     PRODUCT & INVENTORY MANAGEMENT
     ========================================================================== */

  addProduct(productData) {
    const {
      name,
      image,
      category,
      price,
      totalStock,
      onlineStock,
      walkInStock,
      onlineAvailable = true,
      description = ''
    } = productData;

    const numTotal = Number(totalStock) || 0;
    const numOnline = Number(onlineStock) || 0;
    const numWalkIn = Number(walkInStock) || 0;
    const numPrice = Number(price) || 0;

    // Rule: Online Stock + Walk-in Stock <= Total Stock
    if (numOnline + numWalkIn > numTotal) {
      throw new Error(`Invalid stock allocation! Online (${numOnline}) + Walk-in (${numWalkIn}) exceeds Total Stock (${numTotal}).`);
    }

    const newProduct = {
      id: 'PROD-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      name: name.trim(),
      image: image || '',
      category: (category || 'General').trim(),
      price: Math.max(0, numPrice),
      totalStock: Math.max(0, numTotal),
      onlineStock: Math.max(0, numOnline),
      walkInStock: Math.max(0, numWalkIn),
      onlineAvailable: Boolean(onlineAvailable),
      description: (description || '').trim(),
      createdAt: new Date().toISOString()
    };

    this.state.products.unshift(newProduct);
    this.saveToStorage();
    return newProduct;
  }

  updateProduct(id, updates) {
    const index = this.state.products.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Product not found.');

    const current = this.state.products[index];
    const numTotal = updates.totalStock !== undefined ? Number(updates.totalStock) : current.totalStock;
    const numOnline = updates.onlineStock !== undefined ? Number(updates.onlineStock) : current.onlineStock;
    const numWalkIn = updates.walkInStock !== undefined ? Number(updates.walkInStock) : current.walkInStock;
    const numPrice = updates.price !== undefined ? Number(updates.price) : current.price;

    if (numOnline + numWalkIn > numTotal) {
      throw new Error(`Invalid stock allocation! Online (${numOnline}) + Walk-in (${numWalkIn}) exceeds Total Stock (${numTotal}).`);
    }

    this.state.products[index] = {
      ...current,
      ...updates,
      name: updates.name ? updates.name.trim() : current.name,
      category: updates.category ? updates.category.trim() : current.category,
      price: Math.max(0, numPrice),
      totalStock: Math.max(0, numTotal),
      onlineStock: Math.max(0, numOnline),
      walkInStock: Math.max(0, numWalkIn),
      onlineAvailable: updates.onlineAvailable !== undefined ? Boolean(updates.onlineAvailable) : current.onlineAvailable,
      updatedAt: new Date().toISOString()
    };

    this.saveToStorage();
    return this.state.products[index];
  }

  deleteProduct(id) {
    this.state.products = this.state.products.filter((p) => p.id !== id);
    this.removeFromCart(id);
    this.saveToStorage();
  }

  quickStockAdjust(id, pool, delta) {
    const product = this.state.products.find((p) => p.id === id);
    if (!product) return;

    let { totalStock, onlineStock, walkInStock } = product;

    if (pool === 'online') {
      const newOnline = Math.max(0, onlineStock + delta);
      if (newOnline + walkInStock > totalStock) {
        totalStock = newOnline + walkInStock;
      }
      onlineStock = newOnline;
    } else if (pool === 'walkin') {
      const newWalkIn = Math.max(0, walkInStock + delta);
      if (onlineStock + newWalkIn > totalStock) {
        totalStock = onlineStock + newWalkIn;
      }
      walkInStock = newWalkIn;
    } else if (pool === 'total') {
      const newTotal = Math.max(onlineStock + walkInStock, totalStock + delta);
      totalStock = newTotal;
    }

    this.updateProduct(id, { totalStock, onlineStock, walkInStock });
  }

  toggleOnlineAvailability(id) {
    const product = this.state.products.find((p) => p.id === id);
    if (product) {
      this.updateProduct(id, { onlineAvailable: !product.onlineAvailable });
    }
  }

  /* ==========================================================================
     CART MANAGEMENT (CUSTOMER)
     ========================================================================== */

  addToCart(productId, quantity = 1) {
    const product = this.state.products.find((p) => p.id === productId);
    if (!product) throw new Error('Product not found.');

    if (!product.onlineAvailable || product.onlineStock <= 0) {
      throw new Error('Product is currently unavailable for online ordering.');
    }

    const existingIndex = this.state.cart.findIndex((item) => item.productId === productId);
    const currentQtyInCart = existingIndex > -1 ? this.state.cart[existingIndex].quantity : 0;
    const requestedQty = currentQtyInCart + quantity;

    if (requestedQty > product.onlineStock) {
      throw new Error(`Only ${product.onlineStock} units available for online order.`);
    }

    if (existingIndex > -1) {
      this.state.cart[existingIndex].quantity = requestedQty;
    } else {
      this.state.cart.push({ productId, quantity });
    }

    this.saveToStorage(false);
  }

  updateCartQuantity(productId, quantity) {
    const product = this.state.products.find((p) => p.id === productId);
    if (!product && quantity > 0) return;

    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    if (product && quantity > product.onlineStock) {
      quantity = product.onlineStock;
    }

    const index = this.state.cart.findIndex((item) => item.productId === productId);
    if (index > -1) {
      this.state.cart[index].quantity = quantity;
      this.saveToStorage(false);
    }
  }

  removeFromCart(productId) {
    this.state.cart = this.state.cart.filter((item) => item.productId !== productId);
    this.saveToStorage(false);
  }

  clearCart() {
    this.state.cart = [];
    this.saveToStorage(false);
  }

  getCartDetails() {
    let subtotal = 0;
    const items = [];

    for (const item of this.state.cart) {
      const product = this.state.products.find((p) => p.id === item.productId);
      if (product) {
        const itemTotal = product.price * item.quantity;
        subtotal += itemTotal;
        items.push({
          productId: product.id,
          name: product.name,
          category: product.category,
          price: product.price,
          image: product.image,
          quantity: item.quantity,
          maxAvailable: product.onlineStock,
          itemTotal
        });
      }
    }

    return {
      items,
      itemCount: items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal,
      total: subtotal
    };
  }

  /* ==========================================================================
     ONLINE ORDER CREATION & STOCK RESERVATION
     ========================================================================== */

  placeOnlineOrder({ customerName = 'Guest Customer', customerPhone = '', paymentMethod = 'shop', notes = '' }) {
    const cartDetails = this.getCartDetails();
    if (cartDetails.items.length === 0) {
      throw new Error('Your cart is empty.');
    }

    // 1. Strict Stock Check
    for (const item of cartDetails.items) {
      const product = this.state.products.find((p) => p.id === item.productId);
      if (!product || !product.onlineAvailable || product.onlineStock < item.quantity) {
        throw new Error(`Insufficient online stock for "${item.name}". Available: ${product ? product.onlineStock : 0}`);
      }
    }

    // 2. Decrement Online Stock for each product (Walk-in stock untouched!)
    for (const item of cartDetails.items) {
      const productIndex = this.state.products.findIndex((p) => p.id === item.productId);
      if (productIndex > -1) {
        const currentProd = this.state.products[productIndex];
        const newOnlineStock = currentProd.onlineStock - item.quantity;
        this.state.products[productIndex] = {
          ...currentProd,
          onlineStock: Math.max(0, newOnlineStock),
          updatedAt: new Date().toISOString()
        };
      }
    }

    // 3. Generate Sequential Unique Order ID (e.g. #A101, #A102...)
    const orderCount = this.state.orders.length + 1;
    const orderCode = 'A' + String(100 + orderCount);
    const orderId = `#${orderCode}`;

    const isPaidOnline = paymentMethod === 'online';

    const newOrder = {
      orderId,
      orderCode,
      customerName: customerName.trim() || 'Valued Customer',
      customerPhone: customerPhone.trim() || 'N/A',
      items: cartDetails.items.map((i) => ({
        productId: i.productId,
        name: i.name,
        category: i.category,
        price: i.price,
        image: i.image,
        quantity: i.quantity,
        itemTotal: i.itemTotal
      })),
      total: cartDetails.total,
      subtotal: cartDetails.subtotal,
      paymentMethod, // 'online' | 'shop'
      paymentStatus: isPaidOnline ? 'Paid' : 'Pending',
      orderStatus: 'Order Placed',
      notes: notes.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      timeline: [
        {
          status: 'Order Placed',
          timestamp: new Date().toISOString(),
          note: isPaidOnline ? 'Paid online (Demo payment)' : 'Pay at Shop selected (Payment pending at counter)'
        }
      ]
    };

    this.state.orders.unshift(newOrder);

    // If already paid online, record in sales log
    if (isPaidOnline) {
      this.state.sales.unshift({
        saleId: 'SALE-' + Date.now(),
        type: 'online',
        orderId: newOrder.orderId,
        items: newOrder.items,
        total: newOrder.total,
        paymentMethod: 'online',
        createdAt: new Date().toISOString()
      });
    }

    this.clearCart();
    this.saveToStorage();

    return newOrder;
  }

  updateOrderStatus(orderId, newStatus, extraData = {}) {
    const orderIndex = this.state.orders.findIndex((o) => o.orderId === orderId);
    if (orderIndex === -1) throw new Error('Order not found.');

    const order = this.state.orders[orderIndex];
    const previousStatus = order.orderStatus;

    if (previousStatus === newStatus && !extraData.paymentStatus) return order;

    // Handle Order Cancellation: RESTORE online stock
    if (newStatus === 'Cancelled' && previousStatus !== 'Cancelled' && previousStatus !== 'Picked Up') {
      for (const item of order.items) {
        const prodIndex = this.state.products.findIndex((p) => p.id === item.productId);
        if (prodIndex > -1) {
          const prod = this.state.products[prodIndex];
          this.state.products[prodIndex] = {
            ...prod,
            onlineStock: prod.onlineStock + item.quantity,
            updatedAt: new Date().toISOString()
          };
        }
      }
    }

    let updatedPaymentStatus = extraData.paymentStatus || order.paymentStatus;

    if (newStatus === 'Picked Up') {
      updatedPaymentStatus = 'Paid';

      const existingSale = this.state.sales.find((s) => s.orderId === order.orderId);
      if (!existingSale) {
        this.state.sales.unshift({
          saleId: 'SALE-' + Date.now(),
          type: 'online',
          orderId: order.orderId,
          items: order.items,
          total: order.total,
          paymentMethod: order.paymentMethod,
          createdAt: new Date().toISOString()
        });
      }
    }

    const updatedTimeline = [
      ...order.timeline,
      {
        status: newStatus,
        timestamp: new Date().toISOString(),
        note: extraData.note || `Status updated to ${newStatus}`
      }
    ];

    this.state.orders[orderIndex] = {
      ...order,
      orderStatus: newStatus,
      paymentStatus: updatedPaymentStatus,
      updatedAt: new Date().toISOString(),
      timeline: updatedTimeline
    };

    this.saveToStorage();
    return this.state.orders[orderIndex];
  }

  markPaymentReceived(orderId, paymentMethod = 'cash') {
    const order = this.state.orders.find((o) => o.orderId === orderId);
    if (!order) throw new Error('Order not found');

    return this.updateOrderStatus(orderId, order.orderStatus, {
      paymentStatus: 'Paid',
      note: `Payment received via ${paymentMethod.toUpperCase()}`
    });
  }

  /* ==========================================================================
     WALK-IN SALES (POS REGISTER)
     ========================================================================== */

  recordWalkInSale({ items, paymentMethod = 'cash', customerNote = '' }) {
    if (!items || items.length === 0) {
      throw new Error('No items in walk-in sale.');
    }

    for (const item of items) {
      const product = this.state.products.find((p) => p.id === item.productId);
      if (!product || product.walkInStock < item.quantity) {
        throw new Error(`Insufficient walk-in stock for "${product ? product.name : 'Item'}". Available: ${product ? product.walkInStock : 0}`);
      }
    }

    let total = 0;
    const saleItems = [];

    for (const item of items) {
      const productIndex = this.state.products.findIndex((p) => p.id === item.productId);
      const product = this.state.products[productIndex];
      const newWalkInStock = product.walkInStock - item.quantity;

      this.state.products[productIndex] = {
        ...product,
        walkInStock: Math.max(0, newWalkInStock),
        updatedAt: new Date().toISOString()
      };

      const itemTotal = product.price * item.quantity;
      total += itemTotal;
      saleItems.push({
        productId: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        quantity: item.quantity,
        itemTotal
      });
    }

    const saleId = 'WALKIN-' + Date.now();
    const newSale = {
      saleId,
      type: 'walkin',
      items: saleItems,
      total,
      paymentMethod,
      customerNote: customerNote.trim(),
      createdAt: new Date().toISOString()
    };

    this.state.sales.unshift(newSale);
    this.saveToStorage();

    return newSale;
  }

  /* ==========================================================================
     ANALYTICS & SUMMARY
     ========================================================================== */

  getAnalyticsSummary() {
    let onlineOrdersCount = 0;
    let onlineRevenue = 0;
    let onlineItemsSold = 0;

    let walkInSalesCount = 0;
    let walkInRevenue = 0;
    let walkInItemsSold = 0;

    const productSalesMap = {};

    for (const sale of this.state.sales) {
      const isOnline = sale.type === 'online';
      const itemsCount = sale.items.reduce((sum, i) => sum + i.quantity, 0);

      if (isOnline) {
        onlineOrdersCount++;
        onlineRevenue += sale.total;
        onlineItemsSold += itemsCount;
      } else {
        walkInSalesCount++;
        walkInRevenue += sale.total;
        walkInItemsSold += itemsCount;
      }

      for (const item of sale.items) {
        if (!productSalesMap[item.productId]) {
          productSalesMap[item.productId] = {
            productId: item.productId,
            name: item.name,
            category: item.category,
            onlineQty: 0,
            walkInQty: 0,
            totalQty: 0,
            totalRevenue: 0
          };
        }
        if (isOnline) {
          productSalesMap[item.productId].onlineQty += item.quantity;
        } else {
          productSalesMap[item.productId].walkInQty += item.quantity;
        }
        productSalesMap[item.productId].totalQty += item.quantity;
        productSalesMap[item.productId].totalRevenue += item.itemTotal;
      }
    }

    const currentOnlineStock = this.state.products.reduce((sum, p) => sum + (p.onlineStock || 0), 0);
    const currentWalkInStock = this.state.products.reduce((sum, p) => sum + (p.walkInStock || 0), 0);
    const currentTotalStock = this.state.products.reduce((sum, p) => sum + (p.totalStock || 0), 0);

    const topProducts = Object.values(productSalesMap).sort((a, b) => b.totalQty - a.totalQty);

    return {
      online: {
        ordersCount: onlineOrdersCount,
        revenue: onlineRevenue,
        itemsSold: onlineItemsSold
      },
      walkIn: {
        salesCount: walkInSalesCount,
        revenue: walkInRevenue,
        itemsSold: walkInItemsSold
      },
      overall: {
        totalOrders: onlineOrdersCount + walkInSalesCount,
        totalRevenue: onlineRevenue + walkInRevenue,
        totalItemsSold: onlineItemsSold + walkInItemsSold,
        currentOnlineStock,
        currentWalkInStock,
        currentTotalStock,
        topProducts
      }
    };
  }

  seedSampleProducts() {
    const sampleProducts = [
      {
        name: 'Vanilla Cup',
        image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=500&auto=format&fit=crop&q=80',
        category: 'Cups',
        price: 60,
        totalStock: 100,
        onlineStock: 40,
        walkInStock: 60,
        onlineAvailable: true,
        description: 'Classic rich Madagascar vanilla cream scoop.'
      },
      {
        name: 'Belgian Chocolate Cone',
        image: 'https://images.unsplash.com/photo-1549395156-e0c1fe6fc7a5?w=500&auto=format&fit=crop&q=80',
        category: 'Cones',
        price: 95,
        totalStock: 80,
        onlineStock: 30,
        walkInStock: 50,
        onlineAvailable: true,
        description: '70% dark cocoa gelato served in a crisp waffle cone.'
      },
      {
        name: 'Alphonso Mango Family Tub',
        image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=500&auto=format&fit=crop&q=80',
        category: 'Tubs',
        price: 250,
        totalStock: 50,
        onlineStock: 20,
        walkInStock: 30,
        onlineAvailable: true,
        description: '500ml tub made with 100% natural Alphonso mango pulp.'
      },
      {
        name: 'Butterscotch Almond Sundae',
        image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&auto=format&fit=crop&q=80',
        category: 'Sundaes',
        price: 140,
        totalStock: 40,
        onlineStock: 15,
        walkInStock: 25,
        onlineAvailable: true,
        description: 'Butterscotch gelato topped with roasted almonds & caramel.'
      }
    ];

    sampleProducts.forEach((p) => {
      try {
        this.addProduct(p);
      } catch (e) {
        console.warn('Seed product add failed:', e);
      }
    });
  }

  clearAllData() {
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.SALES);
    localStorage.removeItem(STORAGE_KEYS.CONFIG);
    sessionStorage.removeItem('icecream_cart');

    this.state.products = [];
    this.state.orders = [];
    this.state.sales = [];
    this.state.cart = [];

    this.saveToStorage();
  }
}

window.iceCreamStore = new Store();
