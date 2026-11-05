/**
 * EMBER & OAK — Modern Dining
 * Admin Order Management
 */

const AdminOrders = (function() {
  let orders = [];
  let currentStatusFilter = 'all';
  let currentSearch = '';
  let activeOrder = null;

  function init() {
    loadOrders();
    renderOrders();
    bindEvents();
  }

  function loadOrders() {
    orders = typeof EmberStore !== 'undefined' ? EmberStore.getOrders() : [];
  }

  function getFilteredOrders() {
    return orders.filter(o => {
      // Status filter
      if (currentStatusFilter !== 'all' && o.status !== currentStatusFilter) return false;

      // Search
      if (currentSearch) {
        const q = currentSearch.toLowerCase();
        const inId = o.id.toLowerCase().includes(q);
        const inTable = (o.table || '').toLowerCase().includes(q);
        const inItems = o.items && o.items.some(i => i.name.toLowerCase().includes(q));
        if (!inId && !inTable && !inItems) return false;
      }

      return true;
    });
  }

  function renderOrders() {
    const tbody = document.getElementById('orders-table-body');
    const emptyState = document.getElementById('orders-empty-state');
    const countEl = document.getElementById('orders-count-label');

    const filtered = getFilteredOrders();

    if (countEl) {
      countEl.textContent = `Showing ${filtered.length} of ${orders.length} orders`;
    }

    if (filtered.length === 0) {
      if (tbody) tbody.innerHTML = '';
      if (emptyState) emptyState.style.display = 'flex';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    if (tbody) {
      tbody.innerHTML = filtered.map(order => {
        const itemsSummary = (order.items || []).map(i => `${i.qty}x ${i.name}`).join(', ');
        const isPaid = order.paymentStatus === 'paid';

        return `
          <tr data-order-id="${order.id}">
            <td>
              <strong style="color: var(--text-dark); font-family: var(--font-mono);">${order.id}</strong>
              <div style="font-size: 0.74rem; color: var(--text-muted);">${order.createdAt}</div>
            </td>
            <td>
              <span class="badge-status" style="background: rgba(197, 157, 69, 0.15); color: #8c6d23; font-weight: 700;">
                📍 ${order.table || 'Walk-In'}
              </span>
            </td>
            <td>
              <div style="max-width: 280px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 0.84rem;">
                ${itemsSummary}
              </div>
            </td>
            <td>
              <strong style="color: var(--text-dark);">${AdminUI.formatCurrency(order.total)}</strong>
              <div style="font-size: 0.72rem; color: ${isPaid ? '#27ae60' : '#e67e22'}; font-weight: 600;">
                ${isPaid ? '● Paid' : '○ Pending Pay'}
              </div>
            </td>
            <td>
              <span class="badge-status ${order.status}">${order.status}</span>
            </td>
            <td>
              <div class="table-actions-cell">
                <button class="btn-admin-secondary" style="padding: 5px 12px; font-size: 0.8rem;" onclick="AdminOrders.viewOrder('${order.id}')">
                  Inspect 🔍
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join('');
    }
  }

  function viewOrder(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    activeOrder = order;

    const modal = document.getElementById('order-detail-modal');
    if (!modal) return;

    // Fill elements
    document.getElementById('modal-order-id').textContent = order.id;
    document.getElementById('modal-order-time').textContent = order.createdAt;
    document.getElementById('modal-order-table').textContent = order.table || 'Walk-In Table';
    document.getElementById('modal-order-status-badge').className = `badge-status ${order.status}`;
    document.getElementById('modal-order-status-badge').textContent = order.status;
    document.getElementById('modal-order-pay-status').textContent = order.paymentStatus === 'paid' ? 'Paid (Verified)' : 'Pending Payment';
    document.getElementById('modal-order-pay-method').textContent = order.paymentMethod || 'Credit Card';

    const itemsListEl = document.getElementById('modal-order-items-list');
    if (itemsListEl) {
      itemsListEl.innerHTML = (order.items || []).map(i => `
        <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid var(--admin-border-subtle); font-size: 0.88rem;">
          <div>
            <strong>${i.qty}x</strong> ${i.name}
          </div>
          <div>${AdminUI.formatCurrency((i.price || 0) * i.qty)}</div>
        </div>
      `).join('');
    }

    document.getElementById('modal-order-subtotal').textContent = AdminUI.formatCurrency(order.subtotal);
    document.getElementById('modal-order-tax').textContent = AdminUI.formatCurrency(order.tax);
    document.getElementById('modal-order-fee').textContent = AdminUI.formatCurrency(order.serviceFee);
    document.getElementById('modal-order-total').textContent = AdminUI.formatCurrency(order.total);

    const notesEl = document.getElementById('modal-order-notes');
    if (notesEl) {
      notesEl.textContent = order.notes || 'None provided.';
    }

    modal.classList.add('open');
  }

  function closeOrderModal() {
    const modal = document.getElementById('order-detail-modal');
    if (modal) modal.classList.remove('open');
    activeOrder = null;
  }

  function updateOrderStatus(newStatus) {
    if (!activeOrder) return;

    if (newStatus === 'cancelled') {
      AdminUI.confirm(
        'Cancel Customer Order',
        `Are you sure you want to mark order ${activeOrder.id} as Cancelled?`,
        () => {
          applyStatus(newStatus);
        }
      );
      return;
    }

    applyStatus(newStatus);
  }

  function applyStatus(newStatus) {
    const idx = orders.findIndex(o => o.id === activeOrder.id);
    if (idx !== -1) {
      orders[idx].status = newStatus;
      EmberStore.saveOrders(orders);
      AdminUI.showToast(`Order ${activeOrder.id} status updated to: ${newStatus}`, 'success');
      viewOrder(activeOrder.id);
      renderOrders();
    }
  }

  function printReceipt() {
    window.print();
  }

  function bindEvents() {
    // Search input
    const searchInput = document.getElementById('orders-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        currentSearch = e.target.value.trim();
        renderOrders();
      });
    }

    // Status tabs
    document.querySelectorAll('.order-status-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.order-status-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentStatusFilter = tab.getAttribute('data-status');
        renderOrders();
      });
    });

    // Modal Close
    const closeBtn = document.getElementById('order-modal-close');
    const closeBtnFooter = document.getElementById('order-modal-close-btn');
    if (closeBtn) closeBtn.addEventListener('click', closeOrderModal);
    if (closeBtnFooter) closeBtnFooter.addEventListener('click', closeOrderModal);

    // Print Receipt
    const printBtn = document.getElementById('order-print-btn');
    if (printBtn) printBtn.addEventListener('click', printReceipt);
  }

  return {
    init,
    viewOrder,
    closeOrderModal,
    updateOrderStatus,
    printReceipt
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('orders-table-body')) {
    AdminOrders.init();
  }
});

if (typeof module !== 'undefined' && module.exports) {
  module.exports = AdminOrders;
}

