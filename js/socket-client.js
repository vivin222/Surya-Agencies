/**
 * SocketClient — Central WebSocket Client for Surya Agencies
 * Manages resilient connections, auto-reconnection, and room subscriptions.
 */

class SocketClient {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.connectionListeners = [];
    this.eventListeners = new Map();
    this.subscribedRooms = new Set();
    this.init();
  }

  init() {
    if (typeof io === 'undefined') {
      console.warn('Socket.io client library not loaded. Running in HTTP fallback mode.');
      return;
    }

    try {
      this.socket = io({
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 10000,
        transports: ['websocket', 'polling']
      });

      this.socket.on('connect', () => {
        this.isConnected = true;
        console.log('🟢 Socket connected [ID:', this.socket.id, ']');
        this.notifyConnectionState('connected');

        // Re-subscribe to active rooms upon reconnection
        this.subscribedRooms.forEach(room => {
          this.socket.emit('subscribe:order', room);
        });
      });

      this.socket.on('disconnect', (reason) => {
        this.isConnected = false;
        console.log('🔴 Socket disconnected:', reason);
        this.notifyConnectionState('disconnected');
      });

      this.socket.on('connect_error', (err) => {
        this.isConnected = false;
        this.notifyConnectionState('error');
      });

      this.socket.on('reconnect_attempt', () => {
        this.notifyConnectionState('reconnecting');
      });

      // Bind all registered listeners
      this.eventListeners.forEach((callbacks, event) => {
        callbacks.forEach(cb => {
          this.socket.on(event, cb);
        });
      });

    } catch (e) {
      console.error('Error initializing Socket.io client:', e);
    }
  }

  on(event, callback) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event).push(callback);

    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  onConnectionChange(callback) {
    this.connectionListeners.push(callback);
    callback(this.isConnected ? 'connected' : 'disconnected');
  }

  notifyConnectionState(state) {
    this.connectionListeners.forEach(cb => {
      try { cb(state); } catch (e) { console.error(e); }
    });
  }

  subscribeToOrder(orderIdOrNumber) {
    if (!orderIdOrNumber) return;
    this.subscribedRooms.add(orderIdOrNumber);
    if (this.socket && this.isConnected) {
      this.socket.emit('subscribe:order', orderIdOrNumber);
    }
  }
}

window.socketClient = new SocketClient();
