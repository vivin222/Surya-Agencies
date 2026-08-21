const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const { SAMPLE_PRODUCTS } = require('./sample-data');

const DB_PATH = path.join(__dirname, 'icecream.sqlite');

class DatabaseService {
  constructor() {
    this.db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('❌ Failed to connect to SQLite database:', err.message);
      } else {
        console.log('📦 Connected to SQLite database at:', DB_PATH);
      }
    });

    this.initTables();
  }

  // Promise helper for db.run
  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function (err) {
        if (err) return reject(err);
        resolve({ lastID: this.lastID, changes: this.changes });
      });
    });
  }

  // Promise helper for db.get (single row)
  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  }

  // Promise helper for db.all (multiple rows)
  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) return reject(err);
        resolve(rows || []);
      });
    });
  }

  // Execute multi-statement SQL
  exec(sql) {
    return new Promise((resolve, reject) => {
      this.db.exec(sql, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }

  async initTables() {
    const createSchema = `
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        price REAL NOT NULL,
        stock INTEGER NOT NULL DEFAULT 0,
        available INTEGER NOT NULL DEFAULT 1,
        description TEXT,
        image TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        orderNumber TEXT NOT NULL UNIQUE,
        customerName TEXT NOT NULL,
        customerPhone TEXT,
        items TEXT NOT NULL,
        total REAL NOT NULL,
        paymentMethod TEXT NOT NULL,
        paymentStatus TEXT NOT NULL,
        orderStatus TEXT NOT NULL,
        notes TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS customers (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        phone TEXT NOT NULL UNIQUE,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        lastActive DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );
    `;

    try {
      await this.exec(createSchema);
      console.log('✅ SQLite Schema initialized successfully');
      await this.initDefaultSettings();
      await this.checkInitialProducts();
    } catch (err) {
      console.error('❌ Error initializing database tables:', err);
    }
  }

  async initDefaultSettings() {
    const defaults = {
      shopName: 'Surya Agencies',
      tagline: 'Authorized Arun Icecreams Parlour',
      upiId: 'suryaagencies@upi',
      shopPhone: '+91 98765 43210',
      shopAddress: 'Surya Agencies, Main Bazaar, Arun Icecreams Junction',
      currency: '₹',
      orderCounter: '1',
      shopkeeperPin: '1234'
    };

    for (const [key, value] of Object.entries(defaults)) {
      await this.run(
        `INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)`,
        [key, value]
      );
    }
    // Update shop name to Surya Agencies if previously set differently
    await this.run(`UPDATE settings SET value = 'Surya Agencies' WHERE key = 'shopName' AND value != 'Surya Agencies'`);
    await this.run(`UPDATE settings SET value = 'Authorized Arun Icecreams Parlour' WHERE key = 'tagline'`);
  }

  async checkInitialProducts() {
    const countRow = await this.get(`SELECT COUNT(*) as count FROM products`);
    if (countRow && countRow.count === 0) {
      console.log('🌱 Database empty. Seeding Arun Icecreams catalog...');
      await this.seedProducts(SAMPLE_PRODUCTS);
    }
  }

  async seedProducts(productsList) {
    for (const p of productsList) {
      await this.run(
        `INSERT OR REPLACE INTO products (id, name, category, price, stock, available, description, image)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          p.id || `arun-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          p.name,
          p.category || 'Cups',
          Number(p.price) || 0,
          Number(p.stock) || 0,
          p.available !== undefined ? (p.available ? 1 : 0) : 1,
          p.description || '',
          p.image || ''
        ]
      );
    }
    console.log(`🍦 Seeded ${productsList.length} Arun Icecreams products.`);
  }

  // --- PRODUCT METHODS ---

  async getProducts() {
    const rows = await this.all(`SELECT * FROM products ORDER BY category, name ASC`);
    return rows.map(r => ({
      ...r,
      available: Boolean(r.available),
      price: Number(r.price),
      stock: Number(r.stock)
    }));
  }

  async getProductById(id) {
    const row = await this.get(`SELECT * FROM products WHERE id = ?`, [id]);
    if (!row) return null;
    return {
      ...row,
      available: Boolean(row.available),
      price: Number(row.price),
      stock: Number(row.stock)
    };
  }

  async createProduct({ id, name, category, price, stock, description, image, available }) {
    const prodId = id || `arun-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const isAvail = available !== undefined ? (available ? 1 : 0) : 1;

    await this.run(
      `INSERT INTO products (id, name, category, price, stock, available, description, image, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [prodId, name.trim(), category.trim(), Number(price), Number(stock), isAvail, description || '', image || '']
    );

    return this.getProductById(prodId);
  }

  async updateProduct(id, updates) {
    const current = await this.getProductById(id);
    if (!current) throw new Error('Product not found');

    const name = updates.name !== undefined ? updates.name.trim() : current.name;
    const category = updates.category !== undefined ? updates.category.trim() : current.category;
    const price = updates.price !== undefined ? Number(updates.price) : current.price;
    const stock = updates.stock !== undefined ? Number(updates.stock) : current.stock;
    const description = updates.description !== undefined ? updates.description : current.description;
    const image = updates.image !== undefined ? updates.image : current.image;
    const available = updates.available !== undefined ? (updates.available ? 1 : 0) : (current.available ? 1 : 0);

    await this.run(
      `UPDATE products 
       SET name = ?, category = ?, price = ?, stock = ?, description = ?, image = ?, available = ?, updatedAt = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [name, category, price, stock, description, image, available, id]
    );

    return this.getProductById(id);
  }

  async updateStock(id, newStock) {
    const current = await this.getProductById(id);
    if (!current) throw new Error('Product not found');

    const stock = Math.max(0, parseInt(newStock, 10) || 0);

    await this.run(
      `UPDATE products 
       SET stock = ?, updatedAt = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [stock, id]
    );

    return this.getProductById(id);
  }

  async deleteProduct(id) {
    const current = await this.getProductById(id);
    if (!current) throw new Error('Product not found');
    await this.run(`DELETE FROM products WHERE id = ?`, [id]);
    return { success: true, id };
  }

  // --- CUSTOMER PROFILE METHODS ---

  async registerOrUpdateCustomer(name, phone) {
    if (!name || !phone) throw new Error('Name and phone are required');
    const cleanPhone = phone.trim().replace(/\D/g, '');
    const cleanName = name.trim();

    const existing = await this.get(`SELECT * FROM customers WHERE phone = ?`, [cleanPhone]);
    if (existing) {
      await this.run(`UPDATE customers SET name = ?, lastActive = CURRENT_TIMESTAMP WHERE id = ?`, [cleanName, existing.id]);
      return this.get(`SELECT * FROM customers WHERE id = ?`, [existing.id]);
    } else {
      const custId = `cust-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
      await this.run(
        `INSERT INTO customers (id, name, phone, createdAt, lastActive) VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        [custId, cleanName, cleanPhone]
      );
      return this.get(`SELECT * FROM customers WHERE id = ?`, [custId]);
    }
  }

  async getCustomerByPhone(phone) {
    const cleanPhone = phone.trim().replace(/\D/g, '');
    return this.get(`SELECT * FROM customers WHERE phone = ?`, [cleanPhone]);
  }

  // --- ORDER METHODS & ATOMIC TRANSACTIONS ---

  async getNextOrderNumber() {
    const counterRow = await this.get(`SELECT value FROM settings WHERE key = 'orderCounter'`);
    let count = counterRow ? parseInt(counterRow.value, 10) : 1;
    if (isNaN(count) || count < 1) count = 1;

    const formattedNumber = `#A${String(count).padStart(3, '0')}`;
    await this.run(`UPDATE settings SET value = ? WHERE key = 'orderCounter'`, [String(count + 1)]);

    return formattedNumber;
  }

  async createOrder({ customerName, customerPhone, items, paymentMethod, paymentStatus = 'PENDING', notes = '' }) {
    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new Error('Order must contain at least one Arun Icecream item');
    }

    if (!customerName || !customerName.trim()) {
      throw new Error('Customer name is required');
    }

    // Save/update customer profile
    if (customerPhone) {
      await this.registerOrUpdateCustomer(customerName, customerPhone).catch(() => {});
    }

    // Begin SQLite Transaction
    await this.run('BEGIN IMMEDIATE TRANSACTION');

    try {
      const verifiedItems = [];
      let calculatedTotal = 0;
      const updatedProducts = [];

      // 1. Verify stock for each item
      for (const item of items) {
        const prod = await this.get(`SELECT * FROM products WHERE id = ?`, [item.productId || item.id]);
        
        if (!prod) {
          throw new Error(`Product not found: "${item.name || item.productId}"`);
        }

        const quantity = parseInt(item.quantity, 10);
        if (isNaN(quantity) || quantity <= 0) {
          throw new Error(`Invalid quantity for "${prod.name}"`);
        }

        if (prod.stock < quantity) {
          if (prod.stock === 0) {
            throw new Error(`"${prod.name}" is currently Out of Stock at Surya Agencies.`);
          } else {
            throw new Error(`Only ${prod.stock} available for "${prod.name}".`);
          }
        }

        const itemTotal = prod.price * quantity;
        calculatedTotal += itemTotal;

        verifiedItems.push({
          productId: prod.id,
          name: prod.name,
          category: prod.category,
          price: prod.price,
          quantity: quantity,
          total: itemTotal,
          image: prod.image
        });
      }

      // 2. Decrement stock for all items
      for (const item of verifiedItems) {
        await this.run(
          `UPDATE products 
           SET stock = stock - ?, updatedAt = CURRENT_TIMESTAMP 
           WHERE id = ?`,
          [item.quantity, item.productId]
        );

        const updatedProd = await this.get(`SELECT * FROM products WHERE id = ?`, [item.productId]);
        updatedProducts.push({
          ...updatedProd,
          available: Boolean(updatedProd.available),
          price: Number(updatedProd.price),
          stock: Number(updatedProd.stock)
        });
      }

      // 3. Generate Order Number & Record Order
      const orderNumber = await this.getNextOrderNumber();
      const orderId = `order-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
      
      const normalizedPaymentMethod = paymentMethod === 'upi' ? 'upi' : 'pay_at_shop';
      const normalizedPaymentStatus = paymentStatus === 'PAID' ? 'PAID' : 'PENDING';
      const initialOrderStatus = 'NEW';

      await this.run(
        `INSERT INTO orders (id, orderNumber, customerName, customerPhone, items, total, paymentMethod, paymentStatus, orderStatus, notes, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        [
          orderId,
          orderNumber,
          customerName.trim(),
          customerPhone ? customerPhone.trim() : '',
          JSON.stringify(verifiedItems),
          calculatedTotal,
          normalizedPaymentMethod,
          normalizedPaymentStatus,
          initialOrderStatus,
          notes || ''
        ]
      );

      // Commit Transaction
      await this.run('COMMIT');

      const savedOrder = await this.getOrderById(orderId);

      return {
        order: savedOrder,
        updatedProducts
      };

    } catch (err) {
      await this.run('ROLLBACK').catch(() => {});
      throw err;
    }
  }

  async getOrders(filterStatus = null, customerPhone = null) {
    let sql = `SELECT * FROM orders`;
    const conditions = [];
    const params = [];

    if (filterStatus && filterStatus !== 'ALL') {
      conditions.push(`orderStatus = ?`);
      params.push(filterStatus.toUpperCase());
    }

    if (customerPhone) {
      conditions.push(`customerPhone = ?`);
      params.push(customerPhone.trim());
    }

    if (conditions.length > 0) {
      sql += ` WHERE ` + conditions.join(' AND ');
    }

    sql += ` ORDER BY createdAt DESC`;

    const rows = await this.all(sql, params);
    return rows.map(r => ({
      ...r,
      items: JSON.parse(r.items || '[]'),
      total: Number(r.total)
    }));
  }

  async getOrderById(idOrOrderNumber) {
    let row = await this.get(`SELECT * FROM orders WHERE id = ?`, [idOrOrderNumber]);
    if (!row) {
      let cleanNum = idOrOrderNumber.trim().toUpperCase();
      if (!cleanNum.startsWith('#')) cleanNum = `#${cleanNum}`;
      row = await this.get(`SELECT * FROM orders WHERE UPPER(orderNumber) = ? OR UPPER(orderNumber) = ?`, [cleanNum, idOrOrderNumber.toUpperCase()]);
    }

    if (!row) return null;

    return {
      ...row,
      items: JSON.parse(row.items || '[]'),
      total: Number(row.total)
    };
  }

  async updateOrderStatus(orderId, newStatus) {
    const validStatuses = ['NEW', 'ACCEPTED', 'PREPARING', 'READY_FOR_PICKUP', 'COMPLETED', 'CANCELLED'];
    const status = newStatus.toUpperCase();

    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid order status: ${newStatus}`);
    }

    const currentOrder = await this.getOrderById(orderId);
    if (!currentOrder) throw new Error('Order not found');

    const prevStatus = currentOrder.orderStatus;
    const updatedProducts = [];

    // If transitioning to CANCELLED from an active status, return items back to product stock
    if (status === 'CANCELLED' && prevStatus !== 'CANCELLED' && prevStatus !== 'COMPLETED') {
      for (const item of (currentOrder.items || [])) {
        if (item.productId && item.quantity > 0) {
          await this.run(
            `UPDATE products SET stock = stock + ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`,
            [item.quantity, item.productId]
          );
          const up = await this.getProductById(item.productId);
          if (up) updatedProducts.push(up);
        }
      }
    }

    await this.run(
      `UPDATE orders SET orderStatus = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`,
      [status, currentOrder.id]
    );

    const updatedOrder = await this.getOrderById(currentOrder.id);
    if (updatedOrder) {
      updatedOrder.updatedProducts = updatedProducts;
    }
    return updatedOrder;
  }

  async updatePaymentStatus(orderId, newPaymentStatus) {
    const validStatuses = ['PENDING', 'PAID', 'FAILED', 'REFUNDED'];
    const pStatus = newPaymentStatus.toUpperCase();

    if (!validStatuses.includes(pStatus)) {
      throw new Error(`Invalid payment status: ${newPaymentStatus}`);
    }

    const currentOrder = await this.getOrderById(orderId);
    if (!currentOrder) throw new Error('Order not found');

    await this.run(
      `UPDATE orders SET paymentStatus = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`,
      [pStatus, currentOrder.id]
    );

    return this.getOrderById(currentOrder.id);
  }

  async completePickup(orderIdOrNumber) {
    const order = await this.getOrderById(orderIdOrNumber);
    if (!order) {
      throw new Error('Order not found in database. Invalid QR code or ticket.');
    }

    if (order.orderStatus === 'COMPLETED') {
      throw new Error(`Order ${order.orderNumber} has already been picked up and completed!`);
    }

    await this.run(
      `UPDATE orders SET orderStatus = 'COMPLETED', updatedAt = CURRENT_TIMESTAMP WHERE id = ?`,
      [order.id]
    );

    return this.getOrderById(order.id);
  }

  // --- STATS & SETTINGS ---

  async getDashboardStats() {
    const totalProductsRow = await this.get(`SELECT COUNT(*) as count FROM products`);
    const totalStockRow = await this.get(`SELECT SUM(stock) as totalStock FROM products`);
    
    const newOrdersRow = await this.get(`SELECT COUNT(*) as count FROM orders WHERE orderStatus = 'NEW' OR orderStatus = 'ACCEPTED'`);
    const preparingOrdersRow = await this.get(`SELECT COUNT(*) as count FROM orders WHERE orderStatus = 'PREPARING'`);
    const readyOrdersRow = await this.get(`SELECT COUNT(*) as count FROM orders WHERE orderStatus = 'READY_FOR_PICKUP'`);
    const completedOrdersRow = await this.get(`SELECT COUNT(*) as count FROM orders WHERE orderStatus = 'COMPLETED'`);
    
    const revenueRow = await this.get(`SELECT SUM(total) as revenue FROM orders WHERE orderStatus = 'COMPLETED' OR paymentStatus = 'PAID'`);

    return {
      totalProducts: totalProductsRow ? totalProductsRow.count : 0,
      totalStock: totalStockRow && totalStockRow.totalStock !== null ? totalStockRow.totalStock : 0,
      newOrders: newOrdersRow ? newOrdersRow.count : 0,
      ordersPreparing: preparingOrdersRow ? preparingOrdersRow.count : 0,
      ordersReady: readyOrdersRow ? readyOrdersRow.count : 0,
      ordersCompleted: completedOrdersRow ? completedOrdersRow.count : 0,
      totalRevenue: revenueRow && revenueRow.revenue !== null ? revenueRow.revenue : 0
    };
  }

  async getSettings() {
    const rows = await this.all(`SELECT * FROM settings`);
    const settings = {};
    rows.forEach(r => { settings[r.key] = r.value; });
    return settings;
  }

  async updateSetting(key, value) {
    await this.run(
      `INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)`,
      [key, String(value)]
    );
    return this.getSettings();
  }

  async verifyShopkeeperPin(pin) {
    const pinRow = await this.get(`SELECT value FROM settings WHERE key = 'shopkeeperPin'`);
    const storedPin = pinRow ? pinRow.value : '1234';
    return String(pin).trim() === String(storedPin).trim();
  }

  async resetAllData() {
    await this.run('DELETE FROM orders');
    await this.run('DELETE FROM products');
    await this.run(`UPDATE settings SET value = '1' WHERE key = 'orderCounter'`);
    await this.seedProducts(SAMPLE_PRODUCTS);
    console.log('🔄 All data reset and re-seeded with Surya Agencies Arun Icecreams catalog.');
    return { success: true };
  }
}

const dbService = new DatabaseService();
module.exports = dbService;
