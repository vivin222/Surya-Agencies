/**
 * App Controller — Surya Agencies (Arun Icecreams System)
 * Manages Portal Navigation, Connection Status Pill, LAN Phone Sharing, Audio & Toasts
 */

class AppController {
  constructor() {
    this.currentPortal = 'customer'; // 'customer' | 'shopkeeper'
    this.currentCustomerSubView = 'catalog'; // 'catalog' | 'myorders' | 'ticket'
    this.currentShopkeeperSubView = 'dashboard'; // 'dashboard' | 'orders' | 'products' | 'inventory' | 'scanner' | 'settings'
    this.soundEnabled = true;
    this.serverInfo = { localIp: window.location.hostname || 'localhost', port: window.location.port || 8080 };
    this.deferredPwaPrompt = null;
    this.connectionState = 'connected';

    this.init();
  }

  async init() {
    this.setupPwa();
    await this.fetchServerInfo();
    this.handleRouteFromHash();
    this.setupConnectionMonitor();

    window.addEventListener('hashchange', () => this.handleRouteFromHash());
    window.addEventListener('online', () => this.updateConnectionPill('connected'));
    window.addEventListener('offline', () => this.updateConnectionPill('disconnected'));
  }

  setupPwa() {
    // Register Service Worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(err => {
          console.warn('ServiceWorker registration skipped:', err);
        });
      });
    }

    // Capture PWA Install Prompt for Android
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPwaPrompt = e;
      const installBtn = document.getElementById('pwa-install-btn');
      if (installBtn) installBtn.classList.remove('hidden');
    });
  }

  promptPwaInstall() {
    if (this.deferredPwaPrompt) {
      this.deferredPwaPrompt.prompt();
      this.deferredPwaPrompt.userChoice.then((choice) => {
        if (choice.outcome === 'accepted') {
          this.showToast('Surya Agencies App installed successfully!', 'success');
        }
        this.deferredPwaPrompt = null;
        const installBtn = document.getElementById('pwa-install-btn');
        if (installBtn) installBtn.classList.add('hidden');
      });
    } else {
      this.showToast('To install: Tap Browser Menu (⋮) → "Add to Home screen"', 'info');
    }
  }

  async fetchServerInfo() {
    try {
      const res = await fetch('/api/server-info');
      const data = await res.json();
      if (data.success) {
        this.serverInfo = data;
      }
    } catch (e) {
      console.warn('Could not fetch server info:', e);
    }
  }

  setupConnectionMonitor() {
    if (window.realtimeClient) {
      window.realtimeClient.on('connection:changed', ({ connected, state }) => {
        this.updateConnectionPill(state || (connected ? 'connected' : 'disconnected'));
      });
    }
  }

  updateConnectionPill(state) {
    this.connectionState = state;
    const pill = document.getElementById('connection-status-pill');
    if (!pill) return;

    if (state === 'connected') {
      pill.className = 'conn-status-pill conn-status-online cursor-pointer';
      pill.innerHTML = `<span class="conn-dot conn-dot-online"></span><span>Connected (Local Wi-Fi)</span>`;
      pill.title = 'Connected to Surya Agencies backend over local Wi-Fi';
    } else if (state === 'reconnecting') {
      pill.className = 'conn-status-pill conn-status-reconnecting cursor-pointer';
      pill.innerHTML = `<span class="conn-dot conn-dot-reconnecting"></span><span>Reconnecting...</span>`;
      pill.title = 'Attempting to reconnect to local server';
    } else {
      pill.className = 'conn-status-pill conn-status-offline cursor-pointer';
      pill.innerHTML = `<span class="conn-dot conn-dot-offline"></span><span>Offline / Retrying</span>`;
      pill.title = 'Click to retry connection to server';
    }
  }

  retryConnection() {
    this.updateConnectionPill('reconnecting');
    this.showToast('Checking connection to local server...', 'info');
    this.fetchServerInfo().then(() => {
      if (window.realtimeClient && window.realtimeClient.socket) {
        window.realtimeClient.socket.connect();
      }
      if (window.customerApp) window.customerApp.fetchProducts();
    }).catch(() => {
      this.updateConnectionPill('disconnected');
    });
  }

  handleRouteFromHash() {
    const hash = window.location.hash.replace('#', '').toLowerCase();
    if (hash === 'shopkeeper' || hash === 'admin') {
      this.switchPortal('shopkeeper');
    } else {
      this.switchPortal('customer');
    }
  }

  switchPortal(portal) {
    this.currentPortal = portal;
    window.location.hash = portal;

    const customerContainer = document.getElementById('portal-customer');
    const shopkeeperContainer = document.getElementById('portal-shopkeeper');

    const btnNavCustomer = document.getElementById('top-nav-customer');
    const btnNavShopkeeper = document.getElementById('top-nav-shopkeeper');

    if (portal === 'shopkeeper') {
      if (customerContainer) customerContainer.classList.add('hidden');
      if (shopkeeperContainer) shopkeeperContainer.classList.remove('hidden');

      if (btnNavCustomer) {
        btnNavCustomer.className = 'px-3 py-1.5 rounded-xl text-slate-600 hover:text-slate-900 transition-colors font-bold text-xs';
      }
      if (btnNavShopkeeper) {
        btnNavShopkeeper.className = 'px-3.5 py-1.5 rounded-xl bg-white text-rose-600 shadow-sm font-black text-xs';
      }

      if (window.shopkeeperApp) {
        window.shopkeeperApp.renderAuthGate();
      }
    } else {
      // Customer Portal
      if (customerContainer) customerContainer.classList.remove('hidden');
      if (shopkeeperContainer) shopkeeperContainer.classList.add('hidden');

      if (btnNavCustomer) {
        btnNavCustomer.className = 'px-3.5 py-1.5 rounded-xl bg-white text-rose-600 shadow-sm font-black text-xs';
      }
      if (btnNavShopkeeper) {
        btnNavShopkeeper.className = 'px-3 py-1.5 rounded-xl text-slate-600 hover:text-slate-900 transition-colors font-bold text-xs';
      }
    }
  }

  // --- SUBVIEWS ---

  showCustomerView(subview) {
    this.currentCustomerSubView = subview;

    const catalogView = document.getElementById('customer-catalog-view');
    const myOrdersView = document.getElementById('customer-myorders-view');
    const ticketView = document.getElementById('customer-ticket-view');

    const navCatalog = document.getElementById('c-nav-catalog');
    const navOrders = document.getElementById('c-nav-orders');

    if (catalogView) catalogView.classList.add('hidden');
    if (myOrdersView) myOrdersView.classList.add('hidden');
    if (ticketView) ticketView.classList.add('hidden');

    if (navCatalog) navCatalog.className = 'flex flex-col items-center text-xs font-bold text-slate-400 hover:text-rose-600';
    if (navOrders) navOrders.className = 'flex flex-col items-center text-xs font-bold text-slate-400 hover:text-rose-600';

    if (subview === 'catalog') {
      if (catalogView) catalogView.classList.remove('hidden');
      if (navCatalog) navCatalog.className = 'flex flex-col items-center text-xs font-black text-rose-600';
    } else if (subview === 'myorders') {
      if (myOrdersView) myOrdersView.classList.remove('hidden');
      if (navOrders) navOrders.className = 'flex flex-col items-center text-xs font-black text-rose-600';
      if (window.customerApp) window.customerApp.renderMyOrders();
    } else if (subview === 'ticket') {
      if (ticketView) ticketView.classList.remove('hidden');
    }
  }

  showShopkeeperSubView(subview) {
    this.currentShopkeeperSubView = subview;

    const sections = ['dashboard', 'products', 'inventory', 'scanner', 'settings'];
    sections.forEach(s => {
      const el = document.getElementById(`shop-section-${s}`);
      const btn = document.getElementById(`shop-nav-${s}`);
      if (el) {
        if (s === subview) el.classList.remove('hidden');
        else el.classList.add('hidden');
      }
      if (btn) {
        if (s === subview) {
          btn.className = 'px-3.5 py-2 rounded-2xl bg-rose-600 text-white font-black text-xs shadow-sm flex items-center space-x-1.5';
        } else {
          btn.className = 'px-3.5 py-2 rounded-2xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-bold text-xs transition-colors flex items-center space-x-1.5';
        }
      }
    });

    if (subview === 'scanner' && window.shopkeeperApp) {
      window.shopkeeperApp.openQRScannerModal();
    }
  }

  // --- SHARE WITH FRIEND'S PHONE MODAL ---

  openSharePhoneModal() {
    const modal = document.getElementById('share-phone-modal');
    if (!modal) return;

    const hostIp = this.serverInfo.localIp || window.location.hostname || 'localhost';
    const port = this.serverInfo.port || window.location.port || 8080;
    const shareUrl = `http://${hostIp}:${port}/#customer`;
    const shopUrl = `http://${hostIp}:${port}/#shopkeeper`;

    modal.innerHTML = `
      <div class="fixed inset-0 bg-slate-900/65 backdrop-blur-sm z-50 flex items-center justify-center p-4" onclick="appController.closeSharePhoneModal(event)">
        <div class="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-200" onclick="event.stopPropagation()">
          <div class="flex items-center justify-between border-b border-slate-100 pb-4">
            <div class="flex items-center space-x-2.5">
              <span class="text-2xl">📱</span>
              <div>
                <h3 class="text-lg font-black text-slate-900 font-display">Same Wi-Fi Access</h3>
                <p class="text-xs text-slate-500">Connect any device on the same Wi-Fi network</p>
              </div>
            </div>
            <button type="button" onclick="appController.closeSharePhoneModal()" class="w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center hover:bg-slate-200">✕</button>
          </div>

          <div class="mt-5 space-y-4 text-center">
            <div class="p-4 bg-rose-50/50 rounded-2xl border border-rose-100 flex flex-col items-center justify-center">
              <div id="share-phone-qrcode" class="p-3 bg-white rounded-2xl shadow-sm border border-rose-200"></div>
              <p class="text-xs font-black text-slate-900 font-mono mt-3 break-all select-all">${shareUrl}</p>
              <p class="text-[11px] text-slate-500 mt-1">Scan with any phone camera connected to the same Wi-Fi network</p>
            </div>

            <div class="text-left bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-1.5 text-xs text-slate-600">
              <p class="font-bold text-slate-800">💡 How to connect another phone / laptop:</p>
              <p>1. Connect both devices to the <strong>same Wi-Fi router or hotspot</strong>.</p>
              <p>2. Open browser on Device 2 and enter: <code class="font-mono font-bold text-rose-600 bg-white px-1.5 py-0.5 rounded border border-slate-200">${shareUrl}</code></p>
              <p>3. For Shopkeeper Portal on Device 2: <code class="font-mono font-bold text-slate-800 bg-white px-1.5 py-0.5 rounded border border-slate-200">${shopUrl}</code></p>
            </div>

            <div class="flex gap-2">
              <button 
                type="button" 
                onclick="navigator.clipboard.writeText('${shareUrl}'); appController.showToast('Customer link copied to clipboard!', 'success');"
                class="flex-1 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center justify-center space-x-1.5"
              >
                <span>📋 Copy Phone Link</span>
              </button>
              <button 
                type="button" 
                onclick="appController.closeSharePhoneModal()"
                class="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    setTimeout(() => {
      const qrEl = document.getElementById('share-phone-qrcode');
      if (qrEl && window.QRCode) {
        qrEl.innerHTML = '';
        new QRCode(qrEl, {
          text: shareUrl,
          width: 160,
          height: 160,
          colorDark: '#0f172a',
          colorLight: '#ffffff',
          correctLevel: QRCode.CorrectLevel.M
        });
      }
    }, 50);
  }

  closeSharePhoneModal(e) {
    const modal = document.getElementById('share-phone-modal');
    if (modal) modal.innerHTML = '';
  }

  // --- AUDIO SYNTHESIZER ---

  playSound(type) {
    if (!this.soundEnabled) return;

    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      if (type === 'new_order') {
        this.playTone(ctx, 587.33, 0.1, 0, () => {
          this.playTone(ctx, 880, 0.25, 0.1);
        });
      } else if (type === 'ready') {
        this.playTone(ctx, 523.25, 0.15, 0);
        this.playTone(ctx, 659.25, 0.15, 0.1);
        this.playTone(ctx, 783.99, 0.2, 0.2);
        this.playTone(ctx, 1046.50, 0.35, 0.3);
      } else if (type === 'completed') {
        this.playTone(ctx, 659.25, 0.2, 0);
        this.playTone(ctx, 880, 0.4, 0.15);
      } else if (type === 'cancelled') {
        this.playTone(ctx, 440, 0.2, 0);
        this.playTone(ctx, 330, 0.3, 0.15);
      } else {
        this.playTone(ctx, 440, 0.1, 0);
      }
    } catch (e) {}
  }

  playTone(ctx, frequency, duration, delay = 0, onEnded = null) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.value = frequency;

    const startTime = ctx.currentTime + delay;
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.15, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration);

    if (onEnded) {
      setTimeout(onEnded, (delay + duration) * 1000);
    }
  }

  // --- TOASTS & CONFETTI ---

  showToast(message, type = 'info') {
    const container = document.getElementById('global-toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `p-4 rounded-2xl shadow-xl border text-xs font-bold flex items-center justify-between gap-3 animate-in slide-in-from-top-5 duration-200 ${
      type === 'error' ? 'bg-rose-50 border-rose-200 text-rose-800' :
      type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
      type === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-800' :
      'bg-slate-900 border-slate-800 text-white'
    }`;

    toast.innerHTML = `
      <span>${message}</span>
      <button class="opacity-60 hover:opacity-100 font-bold" onclick="this.parentElement.remove()">✕</button>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('opacity-0', 'transition-opacity', 'duration-300');
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  showConfetti() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '99999';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#e11d48', '#be123c', '#f59e0b', '#10b981', '#3b82f6'];

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        r: Math.random() * 6 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() - 0.7) * 14,
        alpha: 1
      });
    }

    let frames = 0;
    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.3;
        p.alpha -= 0.015;

        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      frames++;
      if (frames < 70) {
        requestAnimationFrame(render);
      } else {
        canvas.remove();
      }
    }
    render();
  }
}

window.appController = new AppController();
