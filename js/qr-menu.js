/**
 * EMBER & OAK — Modern Dining
 * QR Digital Menu Generator & Table Tent Management
 * Generates verified HTTPS URLs for table ordering, outputs printable cards and downloadable PNGs.
 */

const QRGenerator = (function() {
  let qrcodeInstance = null;
  let activeTable = 'T01';
  let activeBaseUrl = '';

  function init() {
    // 1. Determine Default Base URL:
    // If running on a live web host (GitHub Pages, Vercel, Netlify, custom domain), use window.location.origin + path.
    // Intelligently auto-detect active deployment URL or local server host
    const defaultUrl = (typeof EmberStore !== 'undefined' && EmberStore.getMenuUrl)
      ? EmberStore.getMenuUrl()
      : 'menu.html';

    activeBaseUrl = defaultUrl;

    const baseUrlInput = document.getElementById('qr-base-url-input');
    if (baseUrlInput) {
      baseUrlInput.value = defaultUrl;
    }

    const tableInput = document.getElementById('qr-custom-table-input');
    if (tableInput) {
      tableInput.value = activeTable;
    }

    bindEvents();
    generate();
  }

  function getTargetUrl() {
    const baseUrlInput = document.getElementById('qr-base-url-input');
    let baseUrl = baseUrlInput ? baseUrlInput.value.trim() : activeBaseUrl;

    if (!baseUrl || baseUrl.includes('emberandoak.restaurant')) {
      baseUrl = (typeof EmberStore !== 'undefined' && EmberStore.getMenuUrl)
        ? EmberStore.getMenuUrl()
        : 'menu.html';
      if (baseUrlInput) baseUrlInput.value = baseUrl;
    }

    // Append table parameter if selected
    if (activeTable && activeTable !== 'NONE') {
      const sep = baseUrl.includes('?') ? '&' : '?';
      return `${baseUrl}${sep}table=${encodeURIComponent(activeTable)}`;
    }
    return baseUrl;
  }

  function generate() {
    const fullUrl = getTargetUrl();
    const qrContainer = document.getElementById('qr-code-canvas-container');
    const tableTentQrContainer = document.getElementById('tent-qr-canvas-container');
    const urlDisplayEl = document.getElementById('qr-generated-url-display');
    const testLinkEl = document.getElementById('qr-test-link');
    const tentTableBadge = document.getElementById('tent-table-number-display');

    if (!qrContainer) return;

    // Validate URL shape
    const isValid = validateUrl(fullUrl);
    const validationWarning = document.getElementById('qr-url-validation-warning');
    if (validationWarning) {
      validationWarning.style.display = isValid ? 'none' : 'block';
    }

    // 1. Render primary QR code
    qrContainer.innerHTML = '';
    try {
      new QRCode(qrContainer, {
        text: fullUrl,
        width: 256,
        height: 256,
        colorDark: "#181412",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
      });
    } catch (e) {
      console.error('Error generating QR:', e);
      qrContainer.innerHTML = `<p class="qr-error-msg">Failed to generate QR code: ${e.message}</p>`;
    }

    // 2. Render Table Tent QR code (in printable card preview)
    if (tableTentQrContainer) {
      tableTentQrContainer.innerHTML = '';
      try {
        new QRCode(tableTentQrContainer, {
          text: fullUrl,
          width: 200,
          height: 200,
          colorDark: "#181412",
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.H
        });
      } catch (e) {
        console.error('Error generating tent QR:', e);
      }
    }

    // 3. Update Text and Links
    if (urlDisplayEl) urlDisplayEl.textContent = fullUrl;
    if (testLinkEl) {
      let testHref = fullUrl;
      if (testHref.includes('emberandoak.restaurant')) {
        testHref = (typeof EmberStore !== 'undefined' && EmberStore.getMenuUrl)
          ? EmberStore.getMenuUrl(activeTable)
          : `menu.html?table=${encodeURIComponent(activeTable || 'T01')}`;
      }
      testLinkEl.href = testHref;
      testLinkEl.target = '_blank';
    }
    if (tentTableBadge) {
      if (activeTable && activeTable !== 'NONE') {
        tentTableBadge.textContent = `TABLE ${activeTable}`;
      } else {
        tentTableBadge.textContent = 'GENERAL DINING MENU';
      }
    }
  }

  function validateUrl(str) {
    if (!str) return false;
    if (str.startsWith('/') || str.startsWith('./') || str.startsWith('menu.html')) return true;
    try {
      const url = new URL(str, window.location.href);
      return url.protocol === 'http:' || url.protocol === 'https:' || url.protocol === 'file:';
    } catch (_) {
      return false;
    }
  }

  function setTable(table) {
    activeTable = table;
    const tableInput = document.getElementById('qr-custom-table-input');
    if (tableInput && table !== 'CUSTOM') {
      tableInput.value = table === 'NONE' ? '' : table;
    }

    // Highlight button
    document.querySelectorAll('.table-select-btn').forEach(btn => {
      const bTable = btn.getAttribute('data-table');
      btn.classList.toggle('active', bTable === table);
    });

    generate();
  }

  function downloadPNG() {
    // Look for canvas element inside container
    const container = document.getElementById('qr-code-canvas-container');
    if (!container) return;

    let canvas = container.querySelector('canvas');
    if (!canvas) {
      const img = container.querySelector('img');
      if (img && img.src) {
        const link = document.createElement('a');
        link.download = `EmberOak-QR-${activeTable || 'Menu'}.png`;
        link.href = img.src;
        link.click();
        showToast('QR Code image downloaded.');
        return;
      }
      showToast('QR code image is still rendering, please retry in a second.');
      return;
    }

    // Create high-resolution branded export with white padding and restaurant label
    const exportCanvas = document.createElement('canvas');
    const padding = 40;
    const bannerHeight = 80;
    exportCanvas.width = canvas.width + padding * 2;
    exportCanvas.height = canvas.height + padding * 2 + bannerHeight;

    const ctx = exportCanvas.getContext('2d');
    // White background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

    // Top Brand Text
    ctx.fillStyle = '#181412';
    ctx.font = 'bold 20px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('EMBER & OAK', exportCanvas.width / 2, 35);

    ctx.fillStyle = '#8c7d75';
    ctx.font = '12px sans-serif';
    ctx.fillText('MODERN DINING • SCAN FOR MENU', exportCanvas.width / 2, 55);

    // Draw QR Code
    ctx.drawImage(canvas, padding, 70);

    // Bottom Table Identifier
    ctx.fillStyle = '#df9b3a';
    ctx.font = 'bold 16px sans-serif';
    const label = activeTable && activeTable !== 'NONE' ? `TABLE ${activeTable}` : 'DIGITAL MENU';
    ctx.fillText(label, exportCanvas.width / 2, exportCanvas.height - 20);

    // Trigger download
    const dataUrl = exportCanvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.download = `EmberOak-QR-${activeTable || 'Menu'}.png`;
    a.href = dataUrl;
    a.click();

    showToast(`Downloaded high-res QR Code for ${label}!`);
  }

  function printTent() {
    window.print();
  }

  function copyUrl() {
    const fullUrl = getTargetUrl();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(fullUrl).then(() => {
        showToast('Menu URL copied to clipboard!');
      }).catch(() => {
        fallbackCopy(fullUrl);
      });
    } else {
      fallbackCopy(fullUrl);
    }
  }

  function fallbackCopy(text) {
    const input = document.createElement('input');
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    showToast('Menu URL copied to clipboard!');
  }

  function showToast(msg) {
    if (typeof Cart !== 'undefined' && Cart.showToast) {
      Cart.showToast(msg);
    } else {
      alert(msg);
    }
  }

  function bindEvents() {
    // Base URL change
    const baseUrlInput = document.getElementById('qr-base-url-input');
    if (baseUrlInput) {
      baseUrlInput.addEventListener('input', () => {
        activeBaseUrl = baseUrlInput.value.trim();
        generate();
      });
    }

    // Custom Table Input
    const tableInput = document.getElementById('qr-custom-table-input');
    if (tableInput) {
      tableInput.addEventListener('input', () => {
        const val = tableInput.value.trim().toUpperCase();
        activeTable = val || 'NONE';
        // Clear active pill if custom
        document.querySelectorAll('.table-select-btn').forEach(btn => btn.classList.remove('active'));
        generate();
      });
    }

    // Quick Table Selection Buttons
    document.querySelectorAll('.table-select-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const t = btn.getAttribute('data-table');
        setTable(t);
      });
    });

    // Action buttons
    const downloadBtn = document.getElementById('qr-download-btn');
    if (downloadBtn) downloadBtn.addEventListener('click', downloadPNG);

    const printBtn = document.getElementById('qr-print-btn');
    if (printBtn) printBtn.addEventListener('click', printTent);

    const copyBtn = document.getElementById('qr-copy-url-btn');
    if (copyBtn) copyBtn.addEventListener('click', copyUrl);

    // Preset URL buttons (production vs current host)
    const setProdBtn = document.getElementById('qr-use-prod-url');
    if (setProdBtn) {
      setProdBtn.addEventListener('click', () => {
        const currentVal = baseUrlInput ? baseUrlInput.value.trim() : '';
        const custom = prompt('Enter your live domain URL (e.g. https://your-site.vercel.app/menu.html):', currentVal.includes('emberandoak') ? '' : currentVal);
        if (custom && custom.trim()) {
          baseUrlInput.value = custom.trim();
          activeBaseUrl = custom.trim();
          generate();
          showToast('Updated to Custom Domain URL');
        }
      });
    }

    const setLocalBtn = document.getElementById('qr-use-local-url');
    if (setLocalBtn) {
      setLocalBtn.addEventListener('click', () => {
        if (baseUrlInput) {
          const autoUrl = (typeof EmberStore !== 'undefined' && EmberStore.getMenuUrl)
            ? EmberStore.getMenuUrl()
            : 'menu.html';
          baseUrlInput.value = autoUrl;
          activeBaseUrl = autoUrl;
          generate();
          showToast('Updated to Active Host URL');
        }
      });
    }
  }

  return {
    init,
    generate,
    setTable,
    downloadPNG,
    printTent,
    copyUrl
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  QRGenerator.init();
});

