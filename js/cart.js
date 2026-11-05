/**
 * EMBER & OAK — Modern Dining
 * Shopping Cart & Table Order Management
 * Preserved in sessionStorage, calculates subtotals/tax/service, handles table identification.
 */

const Cart = (function() {
  const STORAGE_KEY = 'ember_oak_cart_v1';
  const TABLE_STORAGE_KEY = 'ember_oak_active_table';

  let items = [];
  let tableId = null;

  function init() {
    // 1. Detect Table ID from URL or sessionStorage
    const params = new URLSearchParams(window.location.search);
    const urlTable = params.get('table');
    if (urlTable) {
      tableId = urlTable.toUpperCase().trim();
      sessionStorage.setItem(TABLE_STORAGE_KEY, tableId);
    } else {
      tableId = sessionStorage.getItem(TABLE_STORAGE_KEY) || null;
    }

    // 2. Load persisted cart items
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        items = JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Could not read cart from sessionStorage:', e);
      items = [];
    }

    // 3. Render initial UI across document
    updateUI();
    bindGlobalEvents();
  }

  function save() {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('Could not write cart to sessionStorage:', e);
    }
    updateUI();
  }

  function addItem(dishId, quantity = 1, selectedAddOns = [], notes = '') {
    const catalog = typeof EmberStore !== 'undefined' ? EmberStore.getMenuItems() : MENU_ITEMS;
    const dish = catalog.find(i => i.id === dishId);
    if (!dish) return false;

    // Calculate item unit price with add-ons
    const addOnTotal = selectedAddOns.reduce((sum, a) => sum + (parseFloat(a.price) || 0), 0);
    const unitPrice = dish.price + addOnTotal;

    // Create unique key based on dishId + sorted add-on names
    const addOnKey = selectedAddOns.map(a => a.name).sort().join('|');
    const existingIndex = items.findIndex(
      i => i.dishId === dishId && i.addOnKey === addOnKey && i.notes === notes
    );

    if (existingIndex > -1) {
      items[existingIndex].quantity += quantity;
    } else {
      const cartItemId = 'c_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
      items.push({
        cartItemId,
        dishId: dish.id,
        name: dish.name,
        basePrice: dish.price,
        unitPrice,
        image: dish.image,
        fallbackImage: dish.fallbackImage,
        quantity,
        addOns: selectedAddOns,
        addOnKey,
        notes: notes.trim()
      });
    }

    save();
    showToast(`Added ${quantity}x "${dish.name}" to your order.`);
    return true;
  }

  function updateQuantity(cartItemId, delta) {
    const item = items.find(i => i.cartItemId === cartItemId);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
      removeItem(cartItemId);
    } else {
      save();
    }
  }

  function removeItem(cartItemId) {
    const idx = items.findIndex(i => i.cartItemId === cartItemId);
    if (idx > -1) {
      const removed = items[idx];
      items.splice(idx, 1);
      save();
      showToast(`Removed "${removed.name}" from order.`);
    }
  }

  function clearCart() {
    items = [];
    save();
    showToast('Order cleared.');
  }

  function getItemCount() {
    return items.reduce((sum, i) => sum + i.quantity, 0);
  }

  function getSubtotal() {
    return items.reduce((sum, i) => sum + (i.unitPrice * i.quantity), 0);
  }

  function getTax() {
    return getSubtotal() * (MENU_CONFIG.taxRate || 0.0825);
  }

  function getServiceFee() {
    return getSubtotal() > 0 ? getSubtotal() * (MENU_CONFIG.serviceFeeRate || 0.05) : 0;
  }

  function getTotal() {
    return getSubtotal() + getTax() + getServiceFee();
  }

  function getTableId() {
    return tableId;
  }

  function formatCurrency(amount) {
    return '$' + (amount || 0).toFixed(2);
  }

  function updateUI() {
    const count = getItemCount();
    const subtotal = getSubtotal();
    const tax = getTax();
    const service = getServiceFee();
    const total = getTotal();

    // 1. Update Header Badges
    document.querySelectorAll('.cart-count-badge').forEach(el => {
      el.textContent = count;
      if (count > 0) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });

    // 2. Update Table Badges
    document.querySelectorAll('.table-indicator-pill').forEach(el => {
      if (tableId) {
        el.style.display = 'inline-flex';
        el.innerHTML = `<span class="table-dot"></span> Table <strong>${tableId}</strong>`;
      } else {
        el.style.display = 'none';
      }
    });

    // 3. Update Drawer Content
    const drawerContainer = document.getElementById('cart-items-container');
    const emptyState = document.getElementById('cart-empty-state');
    const footerControls = document.getElementById('cart-drawer-footer');

    if (drawerContainer && emptyState && footerControls) {
      if (items.length === 0) {
        emptyState.style.display = 'block';
        drawerContainer.innerHTML = '';
        footerControls.style.display = 'none';
      } else {
        emptyState.style.display = 'none';
        footerControls.style.display = 'block';

        drawerContainer.innerHTML = items.map(item => `
          <div class="cart-item-row" data-id="${item.cartItemId}">
            <div class="cart-item-img-wrap">
              <img src="${item.image}" alt="${item.name}" onerror="this.onerror=null;this.src='${item.fallbackImage}';" loading="lazy">
            </div>
            <div class="cart-item-details">
              <div class="cart-item-title">${item.name}</div>
              ${item.addOns && item.addOns.length > 0 ? `
                <div class="cart-item-addons">
                  ${item.addOns.map(a => `<span>+ ${a.name} ($${a.price.toFixed(2)})</span>`).join('')}
                </div>
              ` : ''}
              ${item.notes ? `<div class="cart-item-note">"${item.notes}"</div>` : ''}
              <div class="cart-item-price">${formatCurrency(item.unitPrice * item.quantity)}</div>
            </div>
            <div class="cart-item-actions">
              <div class="cart-qty-ctrl">
                <button class="cart-qty-btn minus" onclick="Cart.updateQuantity('${item.cartItemId}', -1)" aria-label="Decrease quantity">−</button>
                <span class="cart-qty-val">${item.quantity}</span>
                <button class="cart-qty-btn plus" onclick="Cart.updateQuantity('${item.cartItemId}', 1)" aria-label="Increase quantity">+</button>
              </div>
              <button class="cart-item-remove-btn" onclick="Cart.removeItem('${item.cartItemId}')" aria-label="Remove item" title="Remove">✕</button>
            </div>
          </div>
        `).join('');

        // Update financial figures
        const subtotalEl = document.getElementById('cart-subtotal');
        const taxEl = document.getElementById('cart-tax');
        const serviceEl = document.getElementById('cart-service');
        const totalEl = document.getElementById('cart-total');

        if (subtotalEl) subtotalEl.textContent = formatCurrency(subtotal);
        if (taxEl) taxEl.textContent = formatCurrency(tax);
        if (serviceEl) serviceEl.textContent = formatCurrency(service);
        if (totalEl) totalEl.textContent = formatCurrency(total);
      }
    }

    // 4. Update Mobile Persistent Floating Bar (if present on menu.html)
    const mobileFloatBar = document.getElementById('mobile-cart-float-bar');
    if (mobileFloatBar) {
      if (count > 0) {
        mobileFloatBar.classList.add('visible');
        const floatCountEl = mobileFloatBar.querySelector('.float-count');
        const floatTotalEl = mobileFloatBar.querySelector('.float-total');
        if (floatCountEl) floatCountEl.textContent = `${count} ${count === 1 ? 'item' : 'items'}`;
        if (floatTotalEl) floatTotalEl.textContent = formatCurrency(total);
      } else {
        mobileFloatBar.classList.remove('visible');
      }
    }
  }

  function openDrawer() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-overlay');
    if (drawer && overlay) {
      drawer.classList.add('open');
      overlay.classList.add('open');
      document.body.classList.add('cart-open-noscroll');
    }
  }

  function closeDrawer() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-overlay');
    if (drawer && overlay) {
      drawer.classList.remove('open');
      overlay.classList.remove('open');
      document.body.classList.remove('cart-open-noscroll');
    }
  }

  function showToast(message) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'ember-toast';
    toast.innerHTML = `
      <span class="toast-dot"></span>
      <span class="toast-msg">${message}</span>
    `;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('show');
    }, 10);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    }, 3200);
  }

  function showCheckoutModal() {
    if (items.length === 0) {
      showToast('Your order is currently empty.');
      return;
    }

    const modal = document.getElementById('checkout-demo-modal');
    if (!modal) return;

    const count = getItemCount();
    const total = getTotal();

    const orderSummaryEl = document.getElementById('demo-order-summary');
    if (orderSummaryEl) {
      orderSummaryEl.innerHTML = `
        <div class="demo-modal-table-badge">
          ${tableId ? `📍 Ordering for Table <strong>${tableId}</strong>` : '📍 General Walk-In / Takeaway Order'}
        </div>
        <div class="demo-modal-items">
          ${items.map(i => `
            <div class="demo-modal-row">
              <span>${i.quantity}x ${i.name}</span>
              <span>${formatCurrency(i.unitPrice * i.quantity)}</span>
            </div>
          `).join('')}
        </div>
        <div class="demo-modal-totals">
          <div class="demo-modal-row"><span>Subtotal:</span><span>${formatCurrency(getSubtotal())}</span></div>
          <div class="demo-modal-row"><span>Tax (8.25%):</span><span>${formatCurrency(getTax())}</span></div>
          <div class="demo-modal-row"><span>Kitchen Craft (5%):</span><span>${formatCurrency(getServiceFee())}</span></div>
          <div class="demo-modal-row total"><span>Total:</span><span>${formatCurrency(total)}</span></div>
        </div>
      `;
    }

    modal.classList.add('open');
    document.body.classList.add('cart-open-noscroll');
  }

  function closeCheckoutModal() {
    const modal = document.getElementById('checkout-demo-modal');
    if (modal) {
      modal.classList.remove('open');
      document.body.classList.remove('cart-open-noscroll');
    }
  }

  function bindGlobalEvents() {
    // Drawer triggers
    document.querySelectorAll('.cart-toggle-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openDrawer();
      });
    });

    const closeBtn = document.getElementById('cart-drawer-close');
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

    const overlay = document.getElementById('cart-overlay');
    if (overlay) overlay.addEventListener('click', closeDrawer);

    // Escape key closes drawer and checkout modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeDrawer();
        closeCheckoutModal();
      }
    });

    // Checkout demo trigger
    const checkoutBtn = document.getElementById('cart-checkout-btn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        closeDrawer();
        showCheckoutModal();
      });
    }

    const modalCloseBtn = document.getElementById('checkout-modal-close');
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeCheckoutModal);

    const modalDoneBtn = document.getElementById('checkout-modal-done-btn');
    if (modalDoneBtn) {
      modalDoneBtn.addEventListener('click', () => {
        if (typeof EmberStore !== 'undefined' && items.length > 0) {
          try {
            const newOrderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
            EmberStore.addOrder({
              id: newOrderId,
              createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
              table: tableId || "T01",
              items: items.map(i => ({ id: i.dishId, name: i.name, qty: i.quantity, price: i.unitPrice })),
              subtotal: getSubtotal(),
              tax: getTax(),
              serviceFee: getServiceFee(),
              total: getTotal(),
              status: "new",
              paymentStatus: "paid",
              paymentMethod: "Online Card (Demo)",
              notes: "Diner mobile QR order."
            });
            clearCart();
            closeCheckoutModal();
            showToast(`Order #${newOrderId} sent directly to kitchen display!`);
            return;
          } catch(e) {}
        }
        closeCheckoutModal();
        showToast('Demo order review complete. Ready for kitchen deployment!');
      });
    }
  }

  return {
    init,
    getItems: () => items,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    getItemCount,
    getSubtotal,
    getTax,
    getServiceFee,
    getTotal,
    getTableId,
    openDrawer,
    closeDrawer,
    showToast,
    showCheckoutModal,
    closeCheckoutModal
  };
})();

// Auto initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  Cart.init();
});

