/**
 * QR Code Scanner Controller
 * Ice Cream Shop Prototype
 */

class QRScannerController {
  constructor() {
    this.html5QrCode = null;
    this.isScanning = false;
    this.scannerElementId = 'admin-qr-reader';
  }

  async startScanner() {
    const readerElement = document.getElementById(this.scannerElementId);
    if (!readerElement) return;

    if (this.isScanning) return;

    // Check if Html5Qrcode is loaded
    if (typeof Html5Qrcode === 'undefined') {
      console.warn('Html5Qrcode library not found, using manual lookup fallback.');
      this.showFallbackMessage('Camera scanning library loading... You can also enter the Order ID directly below.');
      return;
    }

    try {
      if (!this.html5QrCode) {
        this.html5QrCode = new Html5Qrcode(this.scannerElementId);
      }

      const qrCodeSuccessCallback = (decodedText, decodedResult) => {
        this.handleScanSuccess(decodedText);
      };

      const config = {
        fps: 10,
        qrbox: { width: 220, height: 220 },
        aspectRatio: 1.0
      };

      await this.html5QrCode.start(
        { facingMode: 'environment' },
        config,
        qrCodeSuccessCallback,
        (errorMessage) => {
          // Ignore frequent frame decode failure logs
        }
      );

      this.isScanning = true;
      const statusEl = document.getElementById('admin-qr-camera-status');
      if (statusEl) {
        statusEl.textContent = '🟢 Camera active. Align customer QR code inside box.';
        statusEl.className = 'text-xs text-emerald-600 font-semibold text-center mb-2';
      }
    } catch (err) {
      console.warn('Camera access error or permission denied:', err);
      this.isScanning = false;
      this.showFallbackMessage('Camera unavailable or permission denied. Please enter the Order ID manually below.');
    }
  }

  async stopScanner() {
    if (this.html5QrCode && this.isScanning) {
      try {
        await this.html5QrCode.stop();
        this.isScanning = false;
      } catch (err) {
        console.warn('Error stopping scanner:', err);
      }
    }
  }

  handleScanSuccess(decodedText) {
    // Play beep
    this.playBeep();

    // Parse decoded text (could be JSON or raw string)
    let orderIdToVerify = decodedText;

    try {
      const parsed = JSON.parse(decodedText);
      if (parsed.orderId) {
        orderIdToVerify = parsed.orderId;
      }
    } catch (e) {
      // Treat as raw text/code
    }

    if (window.adminApp) {
      window.adminApp.verifyOrderForPickup(orderIdToVerify);
    }
  }

  showFallbackMessage(msg) {
    const statusEl = document.getElementById('admin-qr-camera-status');
    if (statusEl) {
      statusEl.textContent = msg;
      statusEl.className = 'text-xs text-amber-600 font-medium text-center mb-2';
    }
  }

  playBeep() {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1046.5, audioCtx.currentTime); // C6
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch (e) {}
  }
}

window.qrScannerController = new QRScannerController();
