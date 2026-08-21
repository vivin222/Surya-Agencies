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
    const trio = products.find(p => p.name.includes('Trio'));
    if (!trio) throw new Error('Arun Trio product missing!');
    console.log(`   Sample Product: "${trio.name}" | Price: ₹${trio.price} | Stock: ${trio.stock}`);
    console.log('✅ Step 1 Passed: Surya Agencies Arun Icecreams catalog verified.\n');

    // 2. SHOPKEEPER PIN AUTHENTICATION CHECK
    console.log('Step 2: Testing Shopkeeper PIN Authentication security...');
    const validPin = await db.verifyShopkeeperPin('1234');
    const invalidPin = await db.verifyShopkeeperPin('9999');
    if (!validPin || invalidPin) {
      throw new Error('Shopkeeper PIN verification logic failed!');
    }
    console.log('✅ Step 2 Passed: PIN 1234 authorized, incorrect PIN rejected.\n');

    // 3. OVER-ORDERING ATTEMPT
    console.log('Step 3: Customer attempts to over-order (ordering 80 units when 50 in stock)...');
    let overOrderCaught = false;
    try {
      await db.createOrder({
        customerName: 'Karthik Raja',
        customerPhone: '9876543210',
        items: [{ productId: trio.id, quantity: 80, name: trio.name, price: trio.price }],
        paymentMethod: 'pay_at_shop',
        paymentStatus: 'PENDING'
      });
    } catch (err) {
      overOrderCaught = true;
      console.log('   Correctly rejected with error:', err.message);
    }
    if (!overOrderCaught) throw new Error('Over-ordering should have failed!');
    console.log('✅ Step 3 Passed: Over-order prevented safely.\n');

    // 4. CUSTOMER PLACES ORDER FOR 3 ARUN TRIO BARS
    console.log('Step 4: Customer places order for 3 Arun Trio bars (Pay at Shop)...');
    const initialStock = trio.stock;
    const orderResult = await db.createOrder({
      customerName: 'Sundar Pichai',
      customerPhone: '9876500000',
      items: [{ productId: trio.id, quantity: 3, name: trio.name, price: trio.price }],
      paymentMethod: 'pay_at_shop',
      paymentStatus: 'PENDING'
    });

    const order = orderResult.order;
    console.log('   Created Order:', order.orderNumber);
    console.log('   Total:', '₹' + order.total);
    console.log('   Payment Status:', order.paymentStatus);

    const trioAfter = await db.getProductById(trio.id);
    console.log(`   Stock after order: ${trioAfter.stock} (Expected: ${initialStock - 3})`);
    if (trioAfter.stock !== initialStock - 3) {
      throw new Error(`Expected stock ${initialStock - 3}, got ${trioAfter.stock}`);
    }
    console.log('✅ Step 4 Passed: Order placed, online stock safely decremented.\n');

    // 5. SHOPKEEPER TRANSITIONS ORDER
    console.log('Step 5: Shopkeeper updates status: NEW -> PREPARING -> READY_FOR_PICKUP...');
    let updated = await db.updateOrderStatus(order.id, 'PREPARING');
    if (updated.orderStatus !== 'PREPARING') throw new Error('Failed to set PREPARING');
    updated = await db.updateOrderStatus(order.id, 'READY_FOR_PICKUP');
    if (updated.orderStatus !== 'READY_FOR_PICKUP') throw new Error('Failed to set READY_FOR_PICKUP');
    console.log('✅ Step 5 Passed: Order is now READY_FOR_PICKUP.\n');

    // 6. QR SCAN & VERIFY AT SURYA AGENCIES COUNTER
    console.log('Step 6: Customer visits Surya Agencies counter, Shopkeeper scans QR ticket:', order.orderNumber);
    const scanned = await db.getOrderById(order.orderNumber);
    if (!scanned) throw new Error('Failed to lookup order by number');
    console.log('   Verified Order:', scanned.orderNumber, 'for', scanned.customerName);

    // 7. MARK PAYMENT RECEIVED & COMPLETE PICKUP
    console.log('Step 7: Customer pays counter cash/UPI -> Shopkeeper marks Payment Received & completes pickup...');
    const paid = await db.updatePaymentStatus(scanned.id, 'PAID');
    if (paid.paymentStatus !== 'PAID') throw new Error('Failed to update payment');
    const completed = await db.completePickup(scanned.id);
    if (completed.orderStatus !== 'COMPLETED') throw new Error('Failed to complete pickup');
    console.log('✅ Step 7 Passed: Payment PAID and Order marked COMPLETED.\n');

    // 8. DUPLICATE PICKUP REJECTED
    console.log('Step 8: Testing duplicate pickup prevention...');
    let dupCaught = false;
    try {
      await db.completePickup(scanned.id);
    } catch (err) {
      dupCaught = true;
      console.log('   Correctly prevented duplicate pickup:', err.message);
    }
    if (!dupCaught) throw new Error('Duplicate pickup should have failed!');
    console.log('✅ Step 8 Passed: Duplicate pickup prevented.\n');

    console.log('🎉 ====================================================================');
    console.log('🌟 ALL SURYA AGENCIES E2E TESTS PASSED PERFECTLY!');
    console.log('====================================================================\n');
    process.exit(0);

  } catch (err) {
    console.error('\n❌ E2E TEST FAILED:', err);
    process.exit(1);
  }
}

runE2ETest();
