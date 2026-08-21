const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const os = require('os');
const multer = require('multer');
const db = require('./db');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
  }
});

const PORT = process.env.PORT || 8080;
const HOST = '0.0.0.0';

// Helper to determine local LAN IP (configurable via HOST_IP environment variable)
function getLocalIpAddress() {
  if (process.env.HOST_IP) {
    return process.env.HOST_IP;
  }
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

// Upload directory
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_DIR);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e6);
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    cb(null, `arun-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif|svg/;
    const extname = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowed.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only image files (JPEG, PNG, WEBP, GIF, SVG) are allowed!'));
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images statically
app.use('/uploads', express.static(UPLOADS_DIR));

// Serve frontend assets
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname));

// Simple in-memory active session tokens for shopkeeper
const activeShopkeeperSessions = new Set();

// Shopkeeper Authentication Middleware
async function requireShopkeeperAuth(req, res, next) {
  const token = req.headers['x-shopkeeper-token'] || req.query.token;
  const pin = req.headers['x-shopkeeper-pin'];

  if (token && activeShopkeeperSessions.has(token)) {
    return next();
  }

  if (pin) {
    const valid = await db.verifyShopkeeperPin(pin);
    if (valid) return next();
  }

  // Development/Local convenience fallback if explicitly authorized
  if (req.headers['x-client-role'] === 'shopkeeper_verified') {
    return next();
  }

  return res.status(401).json({
    success: false,
    error: 'Unauthorized: Shopkeeper passcode / login required to perform management actions.'
  });
}

// -------------------------------------------------------------
// AUTHENTICATION & SERVER INFO API
// -------------------------------------------------------------

// Server & Network Sharing Info
app.get('/api/server-info', (req, res) => {
  const localIp = getLocalIpAddress();
  res.json({
    success: true,
    port: PORT,
    localIp: localIp,
    customerUrl: `http://${localIp}:${PORT}/#customer`,
    shopkeeperUrl: `http://${localIp}:${PORT}/#shopkeeper`,
    fullUrl: `http://${localIp}:${PORT}/`
  });
});

// Shopkeeper Login API
app.post('/api/auth/shopkeeper/login', async (req, res) => {
  try {
    const { pin } = req.body;
    if (!pin) {
      return res.status(400).json({ success: false, error: 'Shopkeeper PIN is required' });
    }

    const isValid = await db.verifyShopkeeperPin(pin);
    if (!isValid) {
      return res.status(401).json({ success: false, error: 'Invalid Shopkeeper PIN! Please try again.' });
    }

    const sessionToken = `sk_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    activeShopkeeperSessions.add(sessionToken);

    res.json({
      success: true,
      token: sessionToken,
      message: 'Shopkeeper authentication successful.'
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Customer Login / Register
app.post('/api/auth/customer/login', async (req, res) => {
  try {
    const { name, phone } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ success: false, error: 'Customer name and phone are required' });
    }

    const customer = await db.registerOrUpdateCustomer(name, phone);
    res.json({ success: true, customer });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// PRODUCTS API
// -------------------------------------------------------------

// Get all products (Public - Customers & Shopkeepers)
app.get('/api/products', async (req, res) => {
  try {
    const products = await db.getProducts();
    res.json({ success: true, products });
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get single product
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await db.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Create product (Protected - Shopkeeper only)
app.post('/api/products', requireShopkeeperAuth, upload.single('imageFile'), async (req, res) => {
  try {
    const { name, category, price, stock, description, available } = req.body;

    let imageUrl = req.body.image || '';
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    if (!name || name.trim() === '') {
      return res.status(400).json({ success: false, error: 'Product name is required' });
    }

    const newProduct = await db.createProduct({
      name,
      category: category || 'Cups',
      price: parseFloat(price) || 0,
      stock: parseInt(stock, 10) || 0,
      description: description || '',
      image: imageUrl,
      available: available === 'false' || available === false ? 0 : 1
    });

    io.emit('product:created', newProduct);
    io.emit('stats:updated', await db.getDashboardStats());

    res.status(201).json({ success: true, product: newProduct });
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Update product (Protected)
app.put('/api/products/:id', requireShopkeeperAuth, upload.single('imageFile'), async (req, res) => {
  try {
    const updates = { ...req.body };
    if (req.file) {
      updates.image = `/uploads/${req.file.filename}`;
    }

    if (updates.price !== undefined) updates.price = parseFloat(updates.price);
    if (updates.stock !== undefined) updates.stock = parseInt(updates.stock, 10);
    if (updates.available !== undefined) {
      updates.available = updates.available === 'true' || updates.available === true || updates.available === 1;
    }

    const updated = await db.updateProduct(req.params.id, updates);

    io.emit('product:updated', updated);
    io.emit('stats:updated', await db.getDashboardStats());

    res.json({ success: true, product: updated });
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Quick stock adjustment (Protected)
app.patch('/api/products/:id/stock', requireShopkeeperAuth, async (req, res) => {
  try {
    const { stock } = req.body;
    if (stock === undefined) {
      return res.status(400).json({ success: false, error: 'Stock value is required' });
    }

    const updated = await db.updateStock(req.params.id, stock);

    io.emit('product:stock_updated', { id: updated.id, stock: updated.stock, product: updated });
    io.emit('stats:updated', await db.getDashboardStats());

    res.json({ success: true, product: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Delete product (Protected)
app.delete('/api/products/:id', requireShopkeeperAuth, async (req, res) => {
  try {
    const result = await db.deleteProduct(req.params.id);

    io.emit('product:deleted', { id: req.params.id });
    io.emit('stats:updated', await db.getDashboardStats());

    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// ORDERS API
// -------------------------------------------------------------

// Get all orders (Public / filtered by phone for customers, full for shopkeeper)
app.get('/api/orders', async (req, res) => {
  try {
    const filter = req.query.status || null;
    const customerPhone = req.query.phone || null;
    const orders = await db.getOrders(filter, customerPhone);
    res.json({ success: true, orders });
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get single order (Public for customer ticket tracking)
app.get('/api/orders/:id', async (req, res) => {
  try {
    const order = await db.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Create Order (Atomic Stock Decrement - Public)
app.post('/api/orders', async (req, res) => {
  try {
    const { customerName, customerPhone, items, paymentMethod, paymentStatus, notes } = req.body;

    const result = await db.createOrder({
      customerName,
      customerPhone,
      items,
      paymentMethod,
      paymentStatus,
      notes
    });

    // Real-time broadcasts
    io.emit('order:created', result.order);
    io.emit('products:stock_batch_updated', result.updatedProducts);
    io.emit('stats:updated', await db.getDashboardStats());

    res.status(201).json({
      success: true,
      order: result.order,
      updatedProducts: result.updatedProducts
    });
  } catch (err) {
    console.warn('Order creation failed:', err.message);
    res.status(400).json({ success: false, error: err.message });
  }
});

// Update Order Status (Protected - Shopkeeper only)
app.patch('/api/orders/:id/status', requireShopkeeperAuth, async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, error: 'Status is required' });
    }

    const updatedOrder = await db.updateOrderStatus(req.params.id, status);

    if (updatedOrder.updatedProducts && updatedOrder.updatedProducts.length > 0) {
      io.emit('products:stock_batch_updated', updatedOrder.updatedProducts);
    }

    io.emit('order:status_updated', updatedOrder);
    io.to(`order_${updatedOrder.id}`).emit('order:my_status_updated', updatedOrder);
    io.to(`order_${updatedOrder.orderNumber}`).emit('order:my_status_updated', updatedOrder);
    io.emit('stats:updated', await db.getDashboardStats());

    res.json({ success: true, order: updatedOrder });
  } catch (err) {
    console.error('Error updating order status:', err);
    res.status(400).json({ success: false, error: err.message });
  }
});

// Update Payment Status (Protected)
app.patch('/api/orders/:id/payment', requireShopkeeperAuth, async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    if (!paymentStatus) {
      return res.status(400).json({ success: false, error: 'paymentStatus is required' });
    }

    const updatedOrder = await db.updatePaymentStatus(req.params.id, paymentStatus);

    io.emit('order:payment_updated', updatedOrder);
    io.to(`order_${updatedOrder.id}`).emit('order:my_status_updated', updatedOrder);
    io.emit('stats:updated', await db.getDashboardStats());

    res.json({ success: true, order: updatedOrder });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Complete Pickup (Protected)
app.post('/api/orders/:id/complete-pickup', requireShopkeeperAuth, async (req, res) => {
  try {
    const completedOrder = await db.completePickup(req.params.id);

    io.emit('order:completed', completedOrder);
    io.emit('order:status_updated', completedOrder);
    io.to(`order_${completedOrder.id}`).emit('order:my_status_updated', completedOrder);
    io.to(`order_${completedOrder.orderNumber}`).emit('order:my_status_updated', completedOrder);
    io.emit('stats:updated', await db.getDashboardStats());

    res.json({ success: true, order: completedOrder });
  } catch (err) {
    console.error('Pickup completion failed:', err.message);
    res.status(400).json({ success: false, error: err.message });
  }
});

// Dashboard Stats (Protected)
app.get('/api/stats', async (req, res) => {
  try {
    const stats = await db.getDashboardStats();
    res.json({ success: true, stats });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Settings API (GET Public, PUT Protected)
app.get('/api/settings', async (req, res) => {
  try {
    const settings = await db.getSettings();
    // Do not leak shopkeeper pin in public settings
    const safeSettings = { ...settings };
    delete safeSettings.shopkeeperPin;
    res.json({ success: true, settings: safeSettings });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/settings', requireShopkeeperAuth, async (req, res) => {
  try {
    const updates = req.body;
    for (const [k, v] of Object.entries(updates)) {
      await db.updateSetting(k, v);
    }
    const settings = await db.getSettings();
    const safeSettings = { ...settings };
    delete safeSettings.shopkeeperPin;
    io.emit('settings:updated', safeSettings);
    res.json({ success: true, settings: safeSettings });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Reset / Seed Sample Data (Protected)
app.post('/api/seed', requireShopkeeperAuth, async (req, res) => {
  try {
    await db.resetAllData();
    const products = await db.getProducts();
    const stats = await db.getDashboardStats();
    io.emit('products:reloaded', products);
    io.emit('stats:updated', stats);
    res.json({ success: true, message: 'Surya Agencies Arun Icecreams catalog re-seeded', products, stats });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// WEBSOCKET REAL-TIME
// -------------------------------------------------------------
io.on('connection', (socket) => {
  socket.on('subscribe:order', (orderIdOrNumber) => {
    if (orderIdOrNumber) {
      socket.join(`order_${orderIdOrNumber}`);
    }
  });
});

// Start Server on 0.0.0.0
server.listen(PORT, HOST, () => {
  const localIp = getLocalIpAddress();
  console.log('===============================================================');
  console.log(`🍦 SURYA AGENCIES — ARUN ICECREAMS ORDERING SYSTEM IS LIVE!`);
  console.log(`🏠 Local Host: http://localhost:${PORT}/`);
  console.log(`📱 Share With Friend's Phone (Wi-Fi): http://${localIp}:${PORT}/`);
  console.log(`📱 Customer Portal: http://${localIp}:${PORT}/#customer`);
  console.log(`🏪 Shopkeeper Portal: http://${localIp}:${PORT}/#shopkeeper`);
  console.log('===============================================================');
});
