/**
 * EMBER & OAK — Modern Dining
 * Core Admin Dashboard Shell & Global UI Utilities
 */

const AdminUI = (function() {
  function init() {
    initSidebar();
    initTopbar();
    initRestaurantStatus();
    initNotificationBell();
    highlightActiveNav();
  }

  // ==================== SIDEBAR BEHAVIOR ====================
  function initSidebar() {
    const sidebar = document.getElementById('admin-sidebar');
    const toggleBtn = document.getElementById('sidebar-toggle-btn');
    const mobileBtn = document.getElementById('topbar-mobile-menu-btn');

    if (toggleBtn && sidebar) {
      toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        const main = document.querySelector('.admin-main-wrap');
        if (main) main.classList.toggle('sidebar-collapsed');
      });
    }

    if (mobileBtn && sidebar) {
      let backdrop = document.querySelector('.admin-sidebar-backdrop');
      if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.className = 'admin-sidebar-backdrop';
        document.body.appendChild(backdrop);
      }

      function toggleMobileSidebar(open) {
        const isOpen = open !== undefined ? open : !sidebar.classList.contains('mobile-open');
        sidebar.classList.toggle('mobile-open', isOpen);
        backdrop.classList.toggle('active', isOpen);
      }

      mobileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMobileSidebar();
      });

      backdrop.addEventListener('click', () => {
        toggleMobileSidebar(false);
      });

      // Close when clicking nav items on mobile
      sidebar.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
        item.addEventListener('click', () => {
          if (window.innerWidth <= 1023) {
            toggleMobileSidebar(false);
          }
        });
      });
    }
  }

  // ==================== TOPBAR UTILITIES ====================
  function initTopbar() {
    const dateEl = document.getElementById('topbar-current-date');
    if (dateEl) {
      const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
      dateEl.textContent = new Date().toLocaleDateString('en-US', options);
    }

    // Set Admin Profile Name if logged in
    const session = typeof AdminAuth !== 'undefined' ? AdminAuth.getSession() : null;
    const nameEl = document.getElementById('admin-user-display-name');
    const roleEl = document.getElementById('admin-user-display-role');
    if (session) {
      if (nameEl) nameEl.textContent = session.name || 'Executive Chef';
      if (roleEl) roleEl.textContent = session.role || 'General Manager';
    }
  }

  function highlightActiveNav() {
    const currentPath = (window.location.pathname || '').replace(/\/+$/, '');
    const currentFile = currentPath.split('/').pop() || 'index.html';
    const normalizedCurrent = currentFile === 'admin' ? 'index.html' : currentFile;

    document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
      const href = item.getAttribute('href') || '';
      const normalizedHref = href.split('/').pop() || 'index.html';
      const isMatch = href && (normalizedHref === normalizedCurrent || (normalizedCurrent === '' && normalizedHref === 'index.html'));
      item.classList.toggle('active', !!isMatch);
    });
  }

  // ==================== RESTAURANT OPEN/CLOSED TOGGLE ====================
  function initRestaurantStatus() {
    const toggleBtn = document.getElementById('restaurant-status-toggle');
    const textEl = document.getElementById('restaurant-status-text');
    if (!toggleBtn) return;

    let isOpen = localStorage.getItem('eo_restaurant_open') !== 'false';

    function updateUI() {
      toggleBtn.classList.toggle('closed', !isOpen);
      if (textEl) {
        textEl.textContent = isOpen ? 'Kitchen Active • Open' : 'Kitchen Closed';
      }
    }

    updateUI();

    toggleBtn.addEventListener('click', () => {
      isOpen = !isOpen;
      localStorage.setItem('eo_restaurant_open', isOpen ? 'true' : 'false');
      updateUI();
      showToast(`Restaurant dining status changed to: ${isOpen ? 'Open' : 'Closed'}`, isOpen ? 'success' : 'info');
    });
  }

  // ==================== NOTIFICATION PANEL ====================
  function initNotificationBell() {
    const bellBtn = document.getElementById('notification-bell-btn');
    const dropdown = document.getElementById('notification-dropdown');
    if (!bellBtn || !dropdown) return;

    bellBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target) && !bellBtn.contains(e.target)) {
        dropdown.classList.remove('show');
      }
    });
  }

  // ==================== TOAST NOTIFICATION SYSTEM ====================
  function showToast(message, type = 'info') {
    let container = document.querySelector('.admin-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'admin-toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `admin-toast ${type}`;
    const iconMap = {
      success: '✓',
      error: '✕',
      info: 'ℹ'
    };
    toast.innerHTML = `
      <span class="toast-icon-badge" style="font-weight: bold;">${iconMap[type] || '•'}</span>
      <span>${escapeHTML(message)}</span>
    `;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // ==================== CONFIRMATION MODAL ====================
  function confirmModal(title, message, onConfirm) {
    let modal = document.getElementById('admin-global-confirm-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'admin-global-confirm-modal';
      modal.className = 'admin-modal-backdrop';
      modal.innerHTML = `
        <div class="admin-modal-window" style="max-width: 440px;">
          <div class="admin-modal-header">
            <h3 class="admin-modal-title" id="confirm-modal-title">Confirm Action</h3>
            <button class="admin-modal-close-btn" id="confirm-modal-close-x">✕</button>
          </div>
          <div class="admin-modal-body">
            <p id="confirm-modal-msg" style="font-size: 0.92rem; color: var(--text-body);"></p>
          </div>
          <div class="admin-modal-footer">
            <button class="btn-admin-secondary" id="confirm-modal-cancel">Cancel</button>
            <button class="btn-admin-danger" id="confirm-modal-accept">Confirm</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }

    const titleEl = document.getElementById('confirm-modal-title');
    const msgEl = document.getElementById('confirm-modal-msg');
    const acceptBtn = document.getElementById('confirm-modal-accept');
    const cancelBtn = document.getElementById('confirm-modal-cancel');
    const closeX = document.getElementById('confirm-modal-close-x');

    if (titleEl) titleEl.textContent = title;
    if (msgEl) msgEl.textContent = message;

    function closeModal() {
      modal.classList.remove('open');
    }

    // Bind handlers
    acceptBtn.onclick = () => {
      closeModal();
      if (typeof onConfirm === 'function') onConfirm();
    };
    cancelBtn.onclick = closeModal;
    closeX.onclick = closeModal;

    modal.classList.add('open');
  }

  // Escape HTML helper
  function escapeHTML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Format currency
  function formatCurrency(amount) {
    const num = parseFloat(amount) || 0;
    return `$${num.toFixed(2)}`;
  }

  // Resolve asset paths correctly when viewing from inside /admin/
  function assetUrl(url) {
    if (!url || typeof url !== 'string') return '../assets/images/hero-interior.jpg';
    url = url.trim();
    if (!url) return '../assets/images/hero-interior.jpg';

    // Absolute URLs, protocol-relative, root-relative, or data URIs
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:') || url.startsWith('//') || url.startsWith('/')) {
      return url;
    }
    // Already has relative parent traversal
    if (url.startsWith('../')) {
      return url;
    }
    // Relative to current directory
    if (url.startsWith('./')) {
      url = url.substring(2);
    }
    return '../' + url;
  }

  return {
    init,
    showToast,
    confirm: confirmModal,
    escapeHTML,
    formatCurrency,
    assetUrl
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  AdminUI.init();
});

if (typeof module !== 'undefined' && module.exports) {
  module.exports = AdminUI;
}

