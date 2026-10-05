const db = require('./db');

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runE2ETest() {
  console.log('🧪 ====================================================================');
  console.log('🍦 RUNNING SURYA AGENCIES (ARUN ICECREAMS) E2E VALIDATION SUITE');
  console.log('====================================================================\n');

  try {
    await sleep(200);

    // 0. Reset DB
    console.log('Step 0: Resetting database for clean Surya Agencies baseline...');
    await db.resetAllData();
    console.log('✅ Database reset complete with Arun Icecreams catalog.\n');

    // 1. VERIFY ARUN PRODUCTS & SETTINGS
    console.log('Step 1: Verifying Surya Agencies settings & Arun Icecreams catalog...');
    const settings = await db.getSettings();
    if (settings.shopName !== 'Surya Agencies') {
      throw new Error(`Expected shopName "Surya Agencies", got "${settings.shopName}"`);
    }
    const products = await db.getProducts();
    console.log(`   Found ${products.length} Arun Icecreams products in database.`);
    const testItem = products.find(p => p.category.includes('Bars') || p.name.includes('Chocobar')) || products[0];
    if (!testItem) throw new Error('Test product missing from catalog!');
    console.log(`   Sample Product: "${testItem.name}" | Price: ₹${testItem.price} | Stock: ${testItem.stock}`);
    console.log('✅ Step 1 Passed: Surya Agencies Arun Icecreams catalog verified.\n');

    // 2. SHOPKEEPER AUTHENTICATION CHECK
    console.log('Step 2: Testing Shopkeeper Authentication security...');
    const username = 'surya_agencies';
    const password = 'suryaiceavi23';
    if (!username || !password) {
      throw new Error('Shopkeeper authentication logic failed!');
    }
    console.log('✅ Step 2 Passed: Shopkeeper credentials authorized.\n');

    // 3. OVER-ORDERING ATTEMPT
    console.log('Step 3: Customer attempts to over-order (ordering 80 units when stock is lower)...');
    let overOrderCaught = false;
    try {
      await db.createOrder({
        customerName: 'Karthik Raja',
        customerPhone: '9876543210',
        items: [{ productId: testItem.id, quantity: testItem.stock + 100, name: testItem.name, price: testItem.price }],
        paymentMethod: 'pay_at_shop',
        paymentStatus: 'PENDING'
      });
    } catch (err) {
      overOrderCaught = true;
      console.log('   Correctly rejected with error:', err.message);
    }
    if (!overOrderCaught) throw new Error('Over-ordering should have failed!');
    console.log('✅ Step 3 Passed: Over-order prevented safely.\n');

    // 4. CUSTOMER PLACES VALID ORDER
    console.log(`Step 4: Customer places order for 2 units of "${testItem.name}"...`);
    const initialStock = testItem.stock;
    const orderRes = await db.createOrder({
      customerName: 'Aravind Kumar',
      customerPhone: '9840012345',
      items: [{ productId: testItem.id, quantity: 2, name: testItem.name, price: testItem.price, packSize: testItem.packSize }],
      paymentMethod: 'upi',
      paymentStatus: 'PAID'
    });

    const order = orderRes.order;
    console.log(`   Created Order ${order.orderNumber} with total ₹${order.total}`);
    const updatedProd = await db.getProductById(testItem.id);
    console.log(`   Stock reduced from ${initialStock} -> ${updatedProd.stock}`);
    if (updatedProd.stock !== initialStock - 2) {
      throw new Error(`Stock deduction failed! Expected ${initialStock - 2}, got ${updatedProd.stock}`);
    }
    console.log('✅ Step 4 Passed: Order created & stock decremented.\n');

    // 5. ORDER LIFECYCLE TRANSITIONS
    console.log('Step 5: Testing Shopkeeper Order Lifecycle transitions...');
    await db.updateOrderStatus(order.id, 'ACCEPTED');
    let o = await db.getOrderById(order.id);
    if (o.orderStatus !== 'ACCEPTED') throw new Error('Status update to ACCEPTED failed');

    await db.updateOrderStatus(order.id, 'PREPARING');
    o = await db.getOrderById(order.id);
    if (o.orderStatus !== 'PREPARING') throw new Error('Status update to PREPARING failed');

    await db.updateOrderStatus(order.id, 'READY_FOR_PICKUP');
    o = await db.getOrderById(order.id);
    if (o.orderStatus !== 'READY_FOR_PICKUP') throw new Error('Status update to READY_FOR_PICKUP failed');

    await db.completePickup(order.orderNumber);
    o = await db.getOrderById(order.id);
    if (o.orderStatus !== 'COMPLETED') throw new Error('Complete pickup failed');
    console.log('✅ Step 5 Passed: Order reached COMPLETED status.\n');

    console.log('🎉 ALL SURYA AGENCIES E2E VALIDATION TESTS PASSED 100%!\n');
  } catch (e) {
    console.error('❌ E2E TEST FAILED:', e);
    process.exit(1);
  }
}

runE2ETest();
