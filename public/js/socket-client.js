/**
 * Real-Time Socket.io Client Manager — Surya Agencies (Arun Icecreams)
 * Handles bidirectional events for live order updates, stock changes, and connection resilience.
 */

class SocketClient {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
    this.connected = false;
    this.connectionState = 'disconnected'; // 'connected' | 'reconnecting' | 'disconnected'
    this.init();
  }

  init() {
    if (typeof io === 'undefined') {
      console.warn('Socket.io library not yet loaded. Will retry...');
      setTimeout(() => this.init(), 500);
      return;
    }

    try {
      this.socket = io({
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 10000
      });

      this.socket.on('connect', () => {
        console.log('⚡ Connected to Real-time Backend via Socket.io [ID:', this.socket.id, ']');
        this.connected = true;
        this.connectionState = 'connected';
        this.dispatch('connection:changed', { connected: true, state: 'connected' });
        
        // Re-subscribe to any active tracked customer orders
        if (window.customerApp && window.customerApp.activeTrackedOrderId) {
          this.subscribeToOrder(window.customerApp.activeTrackedOrderId);
        }

        // Refresh data on reconnection
        if (window.customerApp && typeof window.customerApp.fetchProducts === 'function') {
          window.customerApp.fetchProducts();
        }
        if (window.shopkeeperApp && window.shopkeeperApp.isAuthenticated && typeof window.shopkeeperApp.loadShopkeeperData === 'function') {
          window.shopkeeperApp.loadShopkeeperData();
        }
      });

      this.socket.on('reconnect_attempt', () => {
        this.connected = false;
        this.connectionState = 'reconnecting';
        this.dispatch('connection:changed', { connected: false, state: 'reconnecting' });
      });

      this.socket.on('disconnect', (reason) => {
        console.warn('⚠️ Disconnected from Real-time Backend. Reason:', reason);
        this.connected = false;
        this.connectionState = 'disconnected';
        this.dispatch('connection:changed', { connected: false, state: 'disconnected' });
      });

      this.socket.on('connect_error', (error) => {
        this.connected = false;
        this.connectionState = 'disconnected';
        this.dispatch('connection:changed', { connected: false, state: 'disconnected', error });
      });

      // Forward server broadcasts to client UI modules
      const events = [
        'product:created',
        'product:updated',
        'product:deleted',
        'product:stock_updated',
        'products:stock_batch_updated',
        'products:reloaded',
        'order:created',
        'order:status_updated',
        'order:payment_updated',
        'order:completed',
        'order:my_status_updated',
        'stats:updated',
        'settings:updated'
      ];

      events.forEach(eventName => {
        this.socket.on(eventName, (data) => {
          console.log(`📡 [Real-time Event: ${eventName}]`, data);
          this.dispatch(eventName, data);
        });
      });

    } catch (err) {
      console.error('Failed to initialize Socket.io client:', err);
    }
  }

  // Subscribe to specific order channel for live updates
  subscribeToOrder(orderIdOrNumber) {
    if (this.socket && this.connected && orderIdOrNumber) {
      this.socket.emit('subscribe:order', orderIdOrNumber);
    }
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
    return () => this.off(event, callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }
  }

  dispatch(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(cb => {
        try {
          cb(data);
        } catch (e) {
          console.error(`Error in listener for event ${event}:`, e);
        }
      });
    }
  }
}

window.realtimeClient = new SocketClient();
