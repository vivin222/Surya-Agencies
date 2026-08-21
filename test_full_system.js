const { io } = require('socket.io-client');

const BASE_URL = 'http://localhost:8080';

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runSystemIntegrationTest() {
  console.log('🧪 ========================================================');
  console.log('🍦 RUNNING SURYA AGENCIES FULL SYSTEM & SOCKET.IO TEST');
  console.log('========================================================\n');

  try {
    // 1. Check HTTP Connection
    console.log('1. Checking Public /api/products for Arun Icecreams...');
    const prodRes = await fetch(`${BASE_URL}/api/products`);
    const prodData = await prodRes.json();
    if (!prodData.success || !Array.isArray(prodData.products)) {
      throw new Error('Failed to fetch products');
    }
    console.log(`✅ HTTP API OK: Received ${prodData.products.length} Arun Icecreams products.\n`);

    // 2. Connect Socket.io client
    console.log('2. Connecting Socket.io real-time client...');
    const socket = io(BASE_URL, { reconnection: false });
    
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Socket.io connection timeout')), 3000);
      socket.on('connect', () => {
        clearTimeout(timeout);
        console.log(`✅ Socket.io Connected with ID: ${socket.id}`);
        resolve();
      });
      socket.on('connect_error', (err) => {
        clearTimeout(timeout);
        reject(err);
      });
    });

    const receivedEvents = [];
    socket.on('order:created', (data) => {
      console.log('   📡 [WS Event: order:created]', data.orderNumber);
      receivedEvents.push({ event: 'order:created', data });
    });
    socket.on('order:status_updated', (data) => {
      console.log('   📡 [WS Event: order:status_updated]', data.orderNumber, '->', data.orderStatus);
      receivedEvents.push({ event: 'order:status_updated', data });
    });
    socket.on('order:completed', (data) => {
      console.log('   📡 [WS Event: order:completed]', data.orderNumber);
      receivedEvents.push({ event: 'order:completed', data });
    });
    socket.on('products:stock_batch_updated', (data) => {
      console.log('   📡 [WS Event: products:stock_batch_updated] Count:', data.length);
      receivedEvents.push({ event: 'products:stock_batch_updated', data });
    });

    // 3. Shopkeeper Authentication
    console.log('\n3. Testing Shopkeeper Authentication Gate (PIN: 1234)...');
    const loginRes = await fetch(`${BASE_URL}/api/auth/shopkeeper/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin: '1234' })
    });
    const loginData = await loginRes.json();
    if (!loginData.success || !loginData.token) {
      throw new Error('Shopkeeper login failed!');
    }
    const skToken = loginData.token;
    console.log('✅ Shopkeeper logged in. Session token acquired.');

    // 4. Shopkeeper creates new Arun Icecream product
    console.log('\n4. Shopkeeper creates new Arun product "Arun Royal Kesar Badam Tub" (Price: ₹180, Stock: 25)...');
    const newProdRes = await fetch(`${BASE_URL}/api/products`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-shopkeeper-token': skToken
      },
      body: JSON.stringify({
        name: 'Arun Royal Kesar Badam Tub (500ml)',
        category: 'Family Tubs',
        price: 180,
        stock: 25,
        description: 'Authentic royal saffron and rich almond ice cream.',
        available: true
      })
    });
    const newProdData = await newProdRes.json();
    if (!newProdData.success) throw new Error(newProdData.error);
    const kesarProduct = newProdData.product;
    console.log(`✅ Product created with ID: ${kesarProduct.id}, Stock: ${kesarProduct.stock}`);

    // 5. Customer places order for 2 tubs
    console.log('\n5. Customer places order for 2 tubs (Pay at Shop)...');
    const orderRes = await fetch(`${BASE_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: 'Ananya Iyer',
        customerPhone: '9876543210',
        items: [{ productId: kesarProduct.id, quantity: 2, name: kesarProduct.name, price: 180 }],
        paymentMethod: 'pay_at_shop',
        paymentStatus: 'PENDING'
      })
    });
    const orderData = await orderRes.json();
    if (!orderData.success) throw new Error(orderData.error);
    const order = orderData.order;
    console.log(`✅ Order Created: ${order.orderNumber}, Total: ₹${order.total}, Payment: ${order.paymentMethod} (${order.paymentStatus})`);

    // Verify stock decreased 25 -> 23
    const updatedProdRes = await fetch(`${BASE_URL}/api/products/${kesarProduct.id}`);
    const updatedProdData = await updatedProdRes.json();
    console.log(`   Remaining stock in Surya Agencies DB: ${updatedProdData.product.stock} (Expected: 23)`);
    if (updatedProdData.product.stock !== 23) {
      throw new Error(`Expected stock 23, got ${updatedProdData.product.stock}`);
    }
    console.log('✅ Stock decreased atomically from 25 -> 23.');

    // 6. Shopkeeper updates status: NEW -> PREPARING -> READY_FOR_PICKUP
    console.log('\n6. Shopkeeper transitions status: NEW -> PREPARING -> READY_FOR_PICKUP...');
    await fetch(`${BASE_URL}/api/orders/${order.id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-shopkeeper-token': skToken },
      body: JSON.stringify({ status: 'PREPARING' })
    });
    await sleep(100);

    const readyRes = await fetch(`${BASE_URL}/api/orders/${order.id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-shopkeeper-token': skToken },
      body: JSON.stringify({ status: 'READY_FOR_PICKUP' })
    });
    const readyData = await readyRes.json();
    console.log(`✅ Order status is now: ${readyData.order.orderStatus}`);

    // 7. QR Code / Scanner Lookup & Payment Received
    console.log('\n7. Shopkeeper scans QR for order:', order.orderNumber);
    const scannedRes = await fetch(`${BASE_URL}/api/orders/${encodeURIComponent(order.orderNumber)}`);
    const scannedData = await scannedRes.json();
    if (!scannedData.success || !scannedData.order) throw new Error('Failed to lookup order by number');
    console.log(`✅ Scanned & Verified Order: ${scannedData.order.orderNumber} for ${scannedData.order.customerName}`);

    console.log('   Marking payment as received...');
    const payRes = await fetch(`${BASE_URL}/api/orders/${order.id}/payment`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-shopkeeper-token': skToken },
      body: JSON.stringify({ paymentStatus: 'PAID' })
    });
    const payData = await payRes.json();
    console.log(`✅ Payment status is now: ${payData.order.paymentStatus}`);

    // 8. Complete Pickup
    console.log('\n8. Completing pickup...');
    const completeRes = await fetch(`${BASE_URL}/api/orders/${order.id}/complete-pickup`, {
      method: 'POST',
      headers: { 'x-shopkeeper-token': skToken }
    });
    const completeData = await completeRes.json();
    console.log(`✅ Order status is now: ${completeData.order.orderStatus}`);

    // 9. Verify WebSocket events
    await sleep(200);
    console.log(`\n9. Verifying WebSocket broadcast events (Total received: ${receivedEvents.length})...`);
    if (receivedEvents.length < 3) {
      throw new Error('Did not receive expected WebSocket events!');
    }
    console.log('✅ Real-time WebSocket broadcasting verified.');

    socket.disconnect();

    console.log('\n🎉 ========================================================');
    console.log('🌟 SURYA AGENCIES SYSTEM INTEGRATION TEST PASSED!');
    console.log('========================================================\n');
    process.exit(0);

  } catch (err) {
    console.error('\n❌ INTEGRATION TEST FAILED:', err);
    process.exit(1);
  }
}

runSystemIntegrationTest();
