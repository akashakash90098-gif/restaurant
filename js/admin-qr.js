/**
 * EMBER & OAK — Modern Dining
 * Admin QR Code Generator & Table Tent Management
 */

const AdminQR = (function() {
  let qrcodeInstance = null;

  function init() {
    initBaseUrl();
    generateQR();
    bindEvents();
  }

  function initBaseUrl() {
    const input = document.getElementById('qr-base-url-input');
    if (!input) return;

    let base = typeof EmberStore !== 'undefined' ? EmberStore.getMenuUrl() : '';
    if (!base || base.includes('emberandoak.restaurant')) {
      base = typeof EmberStore !== 'undefined' ? EmberStore.getMenuUrl() : '../menu.html';
    }

    input.value = base;
  }

  function getTargetUrl() {
    const baseInput = document.getElementById('qr-base-url-input');
    const tableSelect = document.getElementById('qr-table-select');
    const customTableInput = document.getElementById('qr-custom-table');

    let base = baseInput ? baseInput.value.trim() : '';
    if (!base || base.includes('emberandoak.restaurant')) {
      base = typeof EmberStore !== 'undefined' ? EmberStore.getMenuUrl() : '../menu.html';
      if (baseInput) baseInput.value = base;
    }

    let table = tableSelect ? tableSelect.value : '';
    if (table === 'custom' && customTableInput) {
      table = customTableInput.value.trim();
    }

    if (table && table !== 'general') {
      const sep = base.includes('?') ? '&' : '?';
      return `${base}${sep}table=${encodeURIComponent(table)}`;
    }
    return base;
  }

  function generateQR() {
    const qrContainer = document.getElementById('qr-preview-canvas-box');
    const urlDisplay = document.getElementById('qr-encoded-url-display');
    const tentTableBadge = document.getElementById('tent-card-table-badge');
    const tableSelect = document.getElementById('qr-table-select');
    const customTableInput = document.getElementById('qr-custom-table');
    const testMenuBtn = document.getElementById('qr-test-menu-btn');

    if (!qrContainer) return;

    const targetUrl = getTargetUrl();
    if (urlDisplay) urlDisplay.textContent = targetUrl;

    if (testMenuBtn) {
      let testHref = targetUrl;
      if (testHref.includes('emberandoak.restaurant')) {
        testHref = typeof EmberStore !== 'undefined' ? EmberStore.getMenuUrl(tableSelect ? tableSelect.value : '') : '../menu.html';
      }
      testMenuBtn.href = testHref;
    }

    let table = tableSelect ? tableSelect.value : 'general';
    if (table === 'custom' && customTableInput) table = customTableInput.value.trim();

    if (tentTableBadge) {
      tentTableBadge.textContent = table === 'general' ? 'DINING ROOM' : `TABLE ${table.toUpperCase()}`;
    }

    qrContainer.innerHTML = '';

    if (typeof QRCode !== 'undefined') {
      try {
        qrcodeInstance = new QRCode(qrContainer, {
          text: targetUrl,
          width: 260,
          height: 260,
          colorDark: '#120e0c',
          colorLight: '#ffffff',
          correctLevel: QRCode.CorrectLevel.H
        });
      } catch (e) {
        qrContainer.innerHTML = `<p style="color: #e74c3c;">QR Generation error: ${e.message}</p>`;
      }
    } else {
      qrContainer.innerHTML = `<p style="color: #e74c3c;">QRCode library not loaded.</p>`;
    }
  }

  function downloadQR() {
    const qrContainer = document.getElementById('qr-preview-canvas-box');
    if (!qrContainer) return;

    const img = qrContainer.querySelector('img');
    const canvas = qrContainer.querySelector('canvas');
    let dataUrl = '';

    if (canvas) {
      dataUrl = canvas.toDataURL('image/png');
    } else if (img && img.src) {
      dataUrl = img.src;
    }

    if (!dataUrl) {
      AdminUI.showToast('Could not extract QR image data.', 'error');
      return;
    }

    const tableSelect = document.getElementById('qr-table-select');
    const table = tableSelect ? tableSelect.value : 'general';
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `ember_oak_qr_${table}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    AdminUI.showToast('Downloaded High-Res QR Code PNG.', 'success');
  }

  function copyUrl() {
    const url = getTargetUrl();
    navigator.clipboard.writeText(url).then(() => {
      AdminUI.showToast('Menu URL copied to clipboard!', 'success');
    }).catch(() => {
      AdminUI.showToast('Failed to copy. Please copy manually.', 'error');
    });
  }

  function printTentCard() {
    window.print();
  }

  function bindEvents() {
    const tableSelect = document.getElementById('qr-table-select');
    const customTableGroup = document.getElementById('qr-custom-table-group');
    const baseInput = document.getElementById('qr-base-url-input');
    const refreshBtn = document.getElementById('qr-refresh-btn');
    const useActiveBtn = document.getElementById('qr-use-active-btn');
    const downloadBtn = document.getElementById('qr-download-btn');
    const copyBtn = document.getElementById('qr-copy-url-btn');
    const printBtn = document.getElementById('qr-print-tent-btn');

    if (tableSelect) {
      tableSelect.addEventListener('change', () => {
        if (customTableGroup) {
          customTableGroup.style.display = tableSelect.value === 'custom' ? 'flex' : 'none';
        }
        generateQR();
      });
    }

    if (baseInput) baseInput.addEventListener('input', generateQR);
    if (refreshBtn) refreshBtn.addEventListener('click', generateQR);
    if (useActiveBtn && baseInput) {
      useActiveBtn.addEventListener('click', () => {
        baseInput.value = typeof EmberStore !== 'undefined' ? EmberStore.getMenuUrl() : '../menu.html';
        generateQR();
        if (typeof AdminUI !== 'undefined') AdminUI.showToast('Updated base URL to current active host.', 'info');
      });
    }
    if (downloadBtn) downloadBtn.addEventListener('click', downloadQR);
    if (copyBtn) copyBtn.addEventListener('click', copyUrl);
    if (printBtn) printBtn.addEventListener('click', printTentCard);
  }

  return {
    init,
    generateQR,
    downloadQR,
    copyUrl,
    printTentCard
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('qr-preview-canvas-box')) {
    AdminQR.init();
  }
});

if (typeof module !== 'undefined' && module.exports) {
  module.exports = AdminQR;
}

