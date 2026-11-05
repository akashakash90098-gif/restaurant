/**
 * EMBER & OAK — Modern Dining
 * Admin Reports & Sales Analytics
 */

const AdminReports = (function() {
  let orders = [];

  function init() {
    loadData();
    renderSummaryCards();
    renderPopularDishes();
    renderCategorySales();
    renderStatusDistribution();
    bindEvents();
  }

  function loadData() {
    orders = typeof EmberStore !== 'undefined' ? EmberStore.getOrders() : [];
  }

  function renderSummaryCards() {
    const totalRevEl = document.getElementById('report-total-revenue');
    const totalOrdersEl = document.getElementById('report-total-orders');
    const aovEl = document.getElementById('report-aov');
    const totalItemsEl = document.getElementById('report-total-items-sold');

    const totalRev = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const totalOrders = orders.length;
    const aov = totalOrders > 0 ? (totalRev / totalOrders) : 0;
    const totalItems = orders.reduce((sum, o) => {
      return sum + (o.items || []).reduce((iSum, i) => iSum + (i.qty || 1), 0);
    }, 0);

    if (totalRevEl) totalRevEl.textContent = AdminUI.formatCurrency(totalRev);
    if (totalOrdersEl) totalOrdersEl.textContent = totalOrders;
    if (aovEl) aovEl.textContent = AdminUI.formatCurrency(aov);
    if (totalItemsEl) totalItemsEl.textContent = totalItems;
  }

  function renderPopularDishes() {
    const container = document.getElementById('report-popular-dishes-list');
    if (!container) return;

    // Count orders per dish
    const dishCounts = {};
    orders.forEach(o => {
      (o.items || []).forEach(item => {
        dishCounts[item.name] = (dishCounts[item.name] || 0) + (item.qty || 1);
      });
    });

    const sorted = Object.entries(dishCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const maxCount = sorted.length > 0 ? sorted[0].count : 1;

    container.innerHTML = sorted.map(item => {
      const pct = Math.round((item.count / maxCount) * 100);
      return `
        <div class="dish-popularity-item">
          <div class="dish-popularity-meta">
            <span class="dish-pop-name">${item.name}</span>
            <span class="dish-pop-orders"><strong>${item.count}</strong> orders</span>
          </div>
          <div class="dish-popularity-bar-bg">
            <div class="dish-popularity-bar-fill" style="width: ${pct}%;"></div>
          </div>
        </div>
      `;
    }).join('');
  }

  function renderCategorySales() {
    const container = document.getElementById('report-category-breakdown');
    if (!container) return;

    const catRevenue = {
      "Burgers": 54.00,
      "Main Course": 125.00,
      "Starters": 50.50,
      "Pasta": 28.00,
      "Pizza": 22.00,
      "Beverages": 66.00,
      "Desserts": 16.00
    };

    const total = Object.values(catRevenue).reduce((a, b) => a + b, 0);

    container.innerHTML = Object.entries(catRevenue).map(([cat, rev]) => {
      const pct = Math.round((rev / total) * 100);
      return `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid var(--admin-border-subtle); font-size: 0.88rem;">
          <span style="font-weight: 500;">${cat}</span>
          <div style="text-align: right;">
            <strong>${AdminUI.formatCurrency(rev)}</strong>
            <span style="font-size: 0.75rem; color: var(--text-muted); margin-left: 8px;">(${pct}%)</span>
          </div>
        </div>
      `;
    }).join('');
  }

  function renderStatusDistribution() {
    const container = document.getElementById('report-status-distribution');
    if (!container) return;

    const statusCounts = {};
    orders.forEach(o => {
      statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
    });

    container.innerHTML = Object.entries(statusCounts).map(([status, count]) => `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid var(--admin-border-subtle); font-size: 0.85rem;">
        <span class="badge-status ${status}">${status}</span>
        <strong>${count} orders</strong>
      </div>
    `).join('');
  }

  function exportCSV() {
    if (orders.length === 0) {
      AdminUI.showToast('No orders found to export.', 'info');
      return;
    }

    // CSV Header
    const headers = ["Order ID", "Date Time", "Table", "Total ($)", "Status", "Payment Status", "Items Summary", "Notes"];

    // CSV Rows
    const rows = orders.map(o => {
      const itemsSummary = (o.items || []).map(i => `${i.qty}x ${i.name}`).join('; ');
      return [
        `"${o.id}"`,
        `"${o.createdAt}"`,
        `"${o.table || 'Walk-In'}"`,
        `"${(o.total || 0).toFixed(2)}"`,
        `"${o.status}"`,
        `"${o.paymentStatus}"`,
        `"${itemsSummary.replace(/"/g, '""')}"`,
        `"${(o.notes || '').replace(/"/g, '""')}"`
      ];
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ember_oak_sales_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    AdminUI.showToast('CSV Report downloaded successfully.', 'success');
  }

  function bindEvents() {
    const exportBtn = document.getElementById('export-csv-btn');
    if (exportBtn) exportBtn.addEventListener('click', exportCSV);

    const printBtn = document.getElementById('print-report-btn');
    if (printBtn) printBtn.addEventListener('click', () => window.print());
  }

  return {
    init,
    exportCSV
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('report-total-revenue')) {
    AdminReports.init();
  }
});

if (typeof module !== 'undefined' && module.exports) {
  module.exports = AdminReports;
}

