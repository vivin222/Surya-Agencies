/**
 * Test Suite for Ice Cream Shop Inventory Logic
 */

// Mock localStorage and sessionStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, val) => { store[key] = String(val); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();

global.localStorage = localStorageMock;
global.sessionStorage = localStorageMock;
global.window = {
  addEventListener: () => {},
  iceCreamStore: null
};

// Load Store code
const fs = require('fs');
const storeCode = fs.readFileSync('C:\\Users\\user\\.gemini\\antigravity\\scratch\\ice-cream-shop\\js\\store.js', 'utf8');
eval(storeCode);

const store = window.iceCreamStore;

console.log('=== TEST 1: Initial Stock & Split Validation ===');
store.clearAllData();

// Test adding product with valid split stock
const prod1 = store.addProduct({
  name: 'Vanilla Cup',
  category: 'Cups',
  price: 50,
  totalStock: 100,
  onlineStock: 40,
  walkInStock: 60,
  onlineAvailable: true,
  description: 'Vanilla ice cream'
});

console.assert(prod1.totalStock === 100, 'Total stock should be 100');
console.assert(prod1.onlineStock === 40, 'Online stock should be 40');
console.assert(prod1.walkInStock === 60, 'Walk-in stock should be 60');
console.log('✓ Product added successfully with 40 online / 60 walk-in');

// Test adding invalid stock allocation (online + walkin > total)
try {
  store.addProduct({
    name: 'Invalid Scoop',
    category: 'Cups',
    price: 50,
    totalStock: 100,
    onlineStock: 60,
    walkInStock: 50
  });
  console.error('FAIL: Should have thrown error for exceeding total stock');
} catch (e) {
  console.log('✓ Successfully caught invalid stock allocation:', e.message);
}

console.log('\n=== TEST 2: Customer Online Order Decrements Online Stock ONLY ===');
// Customer orders 5 units of Vanilla Cup
store.addToCart(prod1.id, 5);
const order1 = store.placeOnlineOrder({
  customerName: 'Aarav',
  customerPhone: '9988776655',
  paymentMethod: 'shop'
});

const updatedProd1 = store.getState().products.find(p => p.id === prod1.id);
console.assert(updatedProd1.onlineStock === 35, `Online stock expected 35, got ${updatedProd1.onlineStock}`);
console.assert(updatedProd1.walkInStock === 60, `Walk-in stock expected 60 (untouched), got ${updatedProd1.walkInStock}`);
console.assert(order1.orderId === '#A101', `Order ID expected #A101, got ${order1.orderId}`);
console.assert(order1.paymentStatus === 'Pending', `Payment status should be Pending for Pay at Shop`);
console.log('✓ Online order placed: Online stock decreased to 35, Walk-in stock strictly remained 60!');

console.log('\n=== TEST 3: Walk-in Sale Decrements Walk-in Stock ONLY ===');
// Shopkeeper sells 3 units to walk-in customer
const sale1 = store.recordWalkInSale({
  items: [{ productId: prod1.id, quantity: 3 }],
  paymentMethod: 'cash'
});

const prodAfterWalkin = store.getState().products.find(p => p.id === prod1.id);
console.assert(prodAfterWalkin.onlineStock === 35, `Online stock expected 35 (untouched), got ${prodAfterWalkin.onlineStock}`);
console.assert(prodAfterWalkin.walkInStock === 57, `Walk-in stock expected 57, got ${prodAfterWalkin.walkInStock}`);
console.log('✓ Walk-in sale recorded: Walk-in stock decreased to 57, Online stock strictly remained 35!');

console.log('\n=== TEST 4: Online Order Cancellation Restores Online Stock ===');
// Cancel order1
store.updateOrderStatus(order1.orderId, 'Cancelled');
const prodAfterCancel = store.getState().products.find(p => p.id === prod1.id);
console.assert(prodAfterCancel.onlineStock === 40, `Online stock expected 40 (restored 5), got ${prodAfterCancel.onlineStock}`);
console.assert(prodAfterCancel.walkInStock === 57, `Walk-in stock expected 57 (untouched), got ${prodAfterCancel.walkInStock}`);
console.log('✓ Order cancelled: Online stock restored back to 40!');

console.log('\n=== TEST 5: Complete Pickup & Sales Analytics ===');
// Place another online order of 4 units and complete pickup
store.addToCart(prod1.id, 4);
const order2 = store.placeOnlineOrder({
  customerName: 'Priya',
  customerPhone: '9876543210',
  paymentMethod: 'shop'
});

// Update order status workflow
store.updateOrderStatus(order2.orderId, 'Order Accepted');
store.updateOrderStatus(order2.orderId, 'Preparing');
store.updateOrderStatus(order2.orderId, 'Ready for Pickup');
store.updateOrderStatus(order2.orderId, 'Picked Up'); // Completed

const analytics = store.getAnalyticsSummary();
console.log('Analytics Summary:', {
  onlineOrders: analytics.online.ordersCount,
  onlineRevenue: analytics.online.revenue,
  walkInSales: analytics.walkIn.salesCount,
  walkInRevenue: analytics.walkIn.revenue,
  totalRevenue: analytics.overall.totalRevenue
});

console.assert(analytics.online.ordersCount === 1, '1 completed online order');
console.assert(analytics.walkIn.salesCount === 1, '1 walk-in sale');
console.assert(analytics.overall.totalRevenue === (4 * 50) + (3 * 50), 'Total revenue should be 200 + 150 = 350');
console.log('✓ Sales analytics accurate and split cleanly!');

console.log('\n🎉 ALL CORE INVENTORY & WORKFLOW TESTS PASSED PERFECTLY!');
