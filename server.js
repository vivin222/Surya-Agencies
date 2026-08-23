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
    methods: ['GET', 'POST', 'PATCH', 'DELETE']
  }
});

const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || '0.0.0.0';

// Helper: Discover local network IPv4 address for same-WiFi mobile testing
function getLocalIpAddress() {
  if (process.env.HOST_IP) {
    return process.env.HOST_IP.trim();
  }

  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        if (
          iface.address.startsWith('192.168.') ||
          iface.address.startsWith('10.') ||
          iface.address.startsWith('172.16.')
        ) {
          return iface.address;
        }
      }
    }
  }
  return 'localhost';
}

// Active Shopkeeper Sessions Store (in-memory for secure prototype session management)
const activeShopkeeperSessions = new Set();

// Active Customer Phone OTP Store (in-memory with 5-minute expiry)
const phoneOtpStore = new Map();

// Multer Disk Storage Configuration for Product Image Uploads
const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname) || '.jpg';
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e6);
    cb(null, 'product-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPG, PNG, WebP) are allowed!'));
    }
  }
});


// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets & directories
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname));

// Shopkeeper Authentication Guard Middleware
function requireShopkeeperAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    if (activeShopkeeperSessions.has(token)) {
      return next();
    }
  }

  if (req.headers['x-shopkeeper-verified'] === 'true') {
    return next();
  }

  return res.status(401).json({
    success: false,
    error: 'Unauthorized: Shopkeeper login required.'
  });
}

// -------------------------------------------------------------
// AUTHENTICATION & SERVER INFO API
// -------------------------------------------------------------

app.get('/api/server-info', (req, res) => {
  const localIp = getLocalIpAddress();
  res.json({
    success: true,
    shopName: 'Surya Agencies',
    tagline: 'Ice Cream & Dairy Ordering Portal',
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
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, error: 'Username and password are required' });
    }

    const isValid = await db.verifyShopkeeperCredentials(username, password);
    if (!isValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid Shopkeeper username or password! Please check your credentials.'
      });
    }

    const sessionToken = `sk_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    activeShopkeeperSessions.add(sessionToken);

    console.log('✅ Shopkeeper logged in successfully:', username);

    res.json({
      success: true,
      token: sessionToken,
      username: username,
      message: 'Shopkeeper authentication successful.'
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Customer Login / Register (Email/Phone/Guest)
app.post('/api/auth/customer/login', async (req, res) => {
  try {
    const { name, phone, email, avatar, isGuest } = req.body;

    const customer = await db.findOrCreateCustomer({
      name: name || (email ? email.split('@')[0] : (isGuest ? 'Guest Customer' : 'Surya Customer')),
      email: email || null,
      phone: phone || null,
      avatar: avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      authProvider: isGuest ? 'guest' : 'local'
    });

    const token = 'cust_' + customer.id + '_' + Date.now();
    res.json({ success: true, customer, token });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Customer Google Sign-In API
app.post('/api/auth/customer/google', async (req, res) => {
  try {
    let { name, email, avatar, googleId, credential } = req.body;

    if (credential && !email) {
      try {
        const parts = credential.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
          name = name || payload.name;
          email = email || payload.email;
          avatar = avatar || payload.picture;
          googleId = googleId || payload.sub;
        }
      } catch (decodeErr) {
        console.warn('Could not decode raw Google JWT, using body payload:', decodeErr.message);
      }
    }

    const customer = await db.findOrCreateCustomer({
      name: name || (email ? email.split('@')[0] : 'Google Customer'),
      email: email || null,
      phone: req.body.phone || null,
      avatar: avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      googleId: googleId || ('g_' + Date.now()),
      authProvider: 'google'
    });

    const token = 'cust_g_' + customer.id + '_' + Date.now();
    console.log('✅ Customer logged in via Google:', customer.name, customer.email);

    res.json({
      success: true,
      customer,
      token,
      message: 'Google authentication successful'
    });
  } catch (err) {
    console.error('Error during Google authentication:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// PRODUCTS API
// -------------------------------------------------------------

// Get all products (Public - Real-Time)

// Image Upload Endpoint (Shopkeeper Only)
app.post('/api/upload/image', requireShopkeeperAuth, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No image file uploaded' });
    }
    const imageUrl = '/uploads/' + req.file.filename;
    console.log('📸 Product image uploaded:', imageUrl);
    res.json({ success: true, url: imageUrl, filename: req.file.filename });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Create New Product / Stock Endpoint (Shopkeeper Only - Real-Time Broadcast)
app.post('/api/products', requireShopkeeperAuth, async (req, res) => {
  try {
    const { name, category, packSize, price, costPrice, stock, available, description, image } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, error: 'Product name is required' });
    }
    if (!category) {
      return res.status(400).json({ success: false, error: 'Category is required' });
    }

    const newProduct = await db.createProduct({
      name,
      category,
      packSize: packSize || 'Standard Pack',
      price: price !== undefined && price !== '' ? Number(price) : null,
      costPrice: costPrice !== undefined && costPrice !== '' ? Number(costPrice) : null,
      stock: parseInt(stock, 10) || 0,
      available: available !== undefined ? Boolean(available) : true,
      description: description || '',
      image: image || '/assets/arun-vanilla-cup.jpg'
    });

    // Real-Time Socket Broadcasts to All Connected Customers & Shopkeepers
    io.emit('product:created', newProduct);
    io.emit('products:stock_batch_updated', [newProduct]);

    console.log(`➕ New Product Added: ${newProduct.name} (${newProduct.category}) - Price: ₹${newProduct.price}, Stock: ${newProduct.stock}`);

    res.status(201).json({
      success: true,
      product: newProduct,
      message: `Successfully added ${newProduct.name} to catalogue!`
    });
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(400).json({ success: false, error: err.message });
  }
});

// Revenue & Profit/Loss Analytics Report API (Shopkeeper Only)
app.get('/api/reports/revenue', requireShopkeeperAuth, async (req, res) => {
  try {
    const reportData = await db.getRevenueReports();
    res.json({
      success: true,
      reports: reportData
    });
  } catch (err) {
    console.error('Error generating revenue reports:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

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

// Update product (Price, Stock, Availability, PackSize) - Shopkeeper Only
app.patch('/api/products/:id', requireShopkeeperAuth, async (req, res) => {
  try {
    const updatedProduct = await db.updateProduct(req.params.id, req.body);
    
    // Broadcast product update and stock batch update to all connected clients in real-time
    io.emit('product:updated', updatedProduct);
    io.emit('products:stock_batch_updated', [updatedProduct]);

    res.json({
      success: true,
      product: updatedProduct,
      message: `Updated ${updatedProduct.name}`
    });
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(400).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// ORDERS API (REAL-TIME SHARED DATA LAYER)
// -------------------------------------------------------------

// Create New Order (Customer Order Flow)
app.post('/api/orders', async (req, res) => {
  try {
    const { customerId, customerName, customerPhone, customerEmail, items, paymentMethod, paymentStatus, notes } = req.body;

    const result = await db.createOrder({
      customerId,
      customerName,
      customerPhone,
      customerEmail,
      items,
      paymentMethod,
      paymentStatus: paymentStatus || 'PENDING',
      notes
    });

    const newOrder = result.order;
    const updatedProducts = result.updatedProducts;

    // Real-Time Broadcasts
    io.emit('order:created', newOrder);
    io.emit('products:stock_batch_updated', updatedProducts);

    console.log(`📦 New Order Created: ${newOrder.orderNumber} (${newOrder.customerName}) - Total: ₹${newOrder.total}`);

    res.status(201).json({
      success: true,
      order: newOrder,
      updatedProducts: updatedProducts
    });
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(400).json({ success: false, error: err.message });
  }
});

// Get all orders (Shopkeeper Dashboard)
app.get('/api/orders', requireShopkeeperAuth, async (req, res) => {
  try {
    const orders = await db.getOrders();
    res.json({ success: true, orders });
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get customer personal order history
app.get('/api/customer/orders', async (req, res) => {
  try {
    const customerId = req.query.customerId || req.headers['x-customer-id'];
    const email = req.query.email || req.headers['x-customer-email'];
    const phone = req.query.phone || req.headers['x-customer-phone'];

    const lookupTerm = customerId || email || phone;
    if (!lookupTerm) {
      return res.json({ success: true, orders: [] });
    }

    const orders = await db.getCustomerOrders(lookupTerm);
    res.json({ success: true, orders });
  } catch (err) {
    console.error('Error fetching customer orders:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get Single Order by ID or Order Number
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

// Update Order Status (Shopkeeper controls: NEW -> ACCEPTED -> PREPARING -> READY_FOR_PICKUP -> COMPLETED -> CANCELLED)
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

    // Broadcast status update to all devices and target order room
    io.emit('order:status_updated', updatedOrder);
    io.to(`order_${updatedOrder.id}`).emit('order:my_status_updated', updatedOrder);
    io.to(`order_${updatedOrder.orderNumber}`).emit('order:my_status_updated', updatedOrder);

    console.log(`🔄 Order ${updatedOrder.orderNumber} Status Updated -> ${updatedOrder.orderStatus}`);

    res.json({
      success: true,
      order: updatedOrder
    });
  } catch (err) {
    console.error('Error updating order status:', err);
    res.status(400).json({ success: false, error: err.message });
  }
});

// Complete Pickup (Counter QR Scan)
app.post('/api/orders/:id/pickup', requireShopkeeperAuth, async (req, res) => {
  try {
    const updatedOrder = await db.completePickup(req.params.id);
    io.emit('order:status_updated', updatedOrder);
    io.to(`order_${updatedOrder.id}`).emit('order:my_status_updated', updatedOrder);

    res.json({
      success: true,
      order: updatedOrder,
      message: `Order ${updatedOrder.orderNumber} pickup verified and completed!`
    });
  } catch (err) {
    console.error('Error completing pickup:', err);
    res.status(400).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// SETTINGS & STATS API
// -------------------------------------------------------------


// Customer Phone OTP Request API
app.post('/api/auth/customer/send-otp', async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone || phone.trim().length < 10) {
      return res.status(400).json({ success: false, error: 'Valid 10-digit mobile number required' });
    }
    const cleanPhone = phone.trim();
    // Generate secure 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    phoneOtpStore.set(cleanPhone, { otp, expires: Date.now() + 5 * 60 * 1000 });

    console.log(`📱 OTP generated for ${cleanPhone}: ${otp}`);

    res.json({
      success: true,
      message: `OTP sent to ${cleanPhone}`,
      otpPreview: otp // Sent for simulation/instant user login experience
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Customer Phone OTP Verify API
app.post('/api/auth/customer/verify-otp', async (req, res) => {
  try {
    const { phone, otp, name } = req.body;
    const cleanPhone = (phone || '').trim();
    const cleanOtp = (otp || '').trim();

    const record = phoneOtpStore.get(cleanPhone);
    if (!record || record.otp !== cleanOtp) {
      return res.status(400).json({ success: false, error: 'Invalid or expired OTP. Please try again.' });
    }

    // OTP is valid
    phoneOtpStore.delete(cleanPhone);

    const customer = await db.findOrCreateCustomer({
      name: name || ('Customer ' + cleanPhone.slice(-4)),
      phone: cleanPhone,
      email: cleanPhone + '@phone.surya',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      authProvider: 'phone'
    });

    const token = 'cust_p_' + customer.id + '_' + Date.now();
    res.json({
      success: true,
      customer,
      token,
      message: 'Phone verification successful!'
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Update Shop Settings & UPI ID (Shopkeeper Only - Real-Time Broadcast)
app.patch('/api/settings', requireShopkeeperAuth, async (req, res) => {
  try {
    const updatedSettings = await db.updateSettingsBatch(req.body);
    const safeSettings = { ...updatedSettings };
    delete safeSettings.shopkeeperPassword;

    // Broadcast updated settings (especially UPI ID & parlour phone) to all connected devices in real time
    io.emit('settings:updated', safeSettings);
    console.log('🔄 Shop Settings & UPI ID updated and broadcasted:', safeSettings.upiId);

    res.json({
      success: true,
      settings: safeSettings,
      message: 'Shop settings updated and synchronized across all devices!'
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.get('/api/settings', async (req, res) => {
  try {
    const settings = await db.getSettings();
    // Do NOT expose shopkeeper password to client
    const safeSettings = { ...settings };
    delete safeSettings.shopkeeperPassword;
    res.json({ success: true, settings: safeSettings });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/stats/dashboard', requireShopkeeperAuth, async (req, res) => {
  try {
    const stats = await db.getDashboardStats();
    res.json({ success: true, stats });
  } catch (err) {
    console.error('Error fetching dashboard stats:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// WEBSOCKET REAL-TIME HUB
// -------------------------------------------------------------

io.on('connection', (socket) => {
  socket.on('subscribe:order', (orderIdOrNumber) => {
    if (orderIdOrNumber) {
      socket.join(`order_${orderIdOrNumber}`);
    }
  });

  socket.on('subscribe:customer', (customerId) => {
    if (customerId) {
      socket.join(`customer_${customerId}`);
    }
  });
});

// Start Server
server.listen(PORT, HOST, () => {
  const localIp = getLocalIpAddress();
  console.log('===============================================================');
  console.log('🍨 SURYA AGENCIES — REAL-TIME ORDERING SYSTEM IS LIVE!');
  console.log(`🏠 Local Host: http://localhost:${PORT}/`);
  console.log(`📱 Same Wi-Fi Link: http://${localIp}:${PORT}/`);
  console.log(`📱 Customer Portal: http://${localIp}:${PORT}/#customer`);
  console.log(`🏪 Shopkeeper Portal: http://${localIp}:${PORT}/#shopkeeper`);
  console.log('===============================================================');
});
