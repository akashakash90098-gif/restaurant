/**
 * EMBER & OAK — Modern Dining
 * Admin Reservation Management
 */

const AdminReservations = (function() {
  let reservations = [];
  let currentStatus = 'all';
  let currentSearch = '';

  function init() {
    loadData();
    renderReservations();
    bindEvents();
  }

  function loadData() {
    reservations = typeof EmberStore !== 'undefined' ? EmberStore.getReservations() : [];
  }

  function getFilteredReservations() {
    return reservations.filter(r => {
      if (currentStatus !== 'all' && r.status !== currentStatus) return false;

      if (currentSearch) {
        const q = currentSearch.toLowerCase();
        const inName = r.name.toLowerCase().includes(q);
        const inPhone = (r.phone || '').toLowerCase().includes(q);
        const inEmail = (r.email || '').toLowerCase().includes(q);
        if (!inName && !inPhone && !inEmail) return false;
      }

      return true;
    });
  }

  function renderReservations() {
    const tbody = document.getElementById('reservations-table-body');
    const emptyState = document.getElementById('reservations-empty-state');
    const countEl = document.getElementById('reservations-count-label');

    const filtered = getFilteredReservations();

    if (countEl) {
      countEl.textContent = `Showing ${filtered.length} of ${reservations.length} reservations`;
    }

    if (filtered.length === 0) {
      if (tbody) tbody.innerHTML = '';
      if (emptyState) emptyState.style.display = 'flex';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    if (tbody) {
      tbody.innerHTML = filtered.map(res => `
        <tr data-res-id="${res.id}">
          <td>
            <div style="font-weight: 600; color: var(--text-dark);">${res.name}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">${res.email} • ${res.phone}</div>
          </td>
          <td>
            <strong style="color: var(--text-dark);">${res.date}</strong>
            <div style="font-size: 0.75rem; color: var(--text-muted); font-family: var(--font-mono);">${res.time}</div>
          </td>
          <td>
            <span class="badge-status" style="background: rgba(197, 157, 69, 0.12); color: #8c6d23; font-weight: 600;">
              👥 ${res.guests} Guests
            </span>
          </td>
          <td>
            <span class="badge-status ${res.status}">${res.status}</span>
          </td>
          <td>
            <div style="font-size: 0.8rem; color: var(--text-muted); max-width: 240px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
              ${res.specialRequests || 'None'}
            </div>
          </td>
          <td>
            <div class="table-actions-cell">
              <select class="table-select" style="padding: 4px 8px; font-size: 0.78rem;" onchange="AdminReservations.changeStatus('${res.id}', this.value)">
                <option value="pending" ${res.status === 'pending' ? 'selected' : ''}>Pending</option>
                <option value="confirmed" ${res.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
                <option value="seated" ${res.status === 'seated' ? 'selected' : ''}>Seated</option>
                <option value="completed" ${res.status === 'completed' ? 'selected' : ''}>Completed</option>
                <option value="cancelled" ${res.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
              </select>
              <button class="action-icon-btn delete" title="Delete Reservation" onclick="AdminReservations.deleteReservation('${res.id}')">🗑️</button>
            </div>
          </td>
        </tr>
      `).join('');
    }
  }

  function changeStatus(resId, newStatus) {
    const idx = reservations.findIndex(r => r.id === resId);
    if (idx !== -1) {
      reservations[idx].status = newStatus;
      EmberStore.saveReservations(reservations);
      renderReservations();
      AdminUI.showToast(`Updated reservation status to: ${newStatus}`, 'success');
    }
  }

  function deleteReservation(resId) {
    const res = reservations.find(r => r.id === resId);
    if (!res) return;

    AdminUI.confirm(
      'Remove Reservation',
      `Are you sure you want to remove reservation for ${res.name}?`,
      () => {
        reservations = reservations.filter(r => r.id !== resId);
        EmberStore.saveReservations(reservations);
        renderReservations();
        AdminUI.showToast(`Removed reservation for ${res.name}.`, 'info');
      }
    );
  }

  function openAddModal() {
    const modal = document.getElementById('reservation-modal');
    const form = document.getElementById('reservation-form');
    if (!modal || !form) return;

    form.reset();
    // Default date today
    const dateInput = document.getElementById('res-form-date');
    if (dateInput) {
      dateInput.value = new Date().toISOString().split('T')[0];
    }

    modal.classList.add('open');
  }

  function closeAddModal() {
    const modal = document.getElementById('reservation-modal');
    if (modal) modal.classList.remove('open');
  }

  function handleFormSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('res-form-name').value.trim();
    const email = document.getElementById('res-form-email').value.trim();
    const phone = document.getElementById('res-form-phone').value.trim();
    const guests = parseInt(document.getElementById('res-form-guests').value, 10) || 2;
    const date = document.getElementById('res-form-date').value;
    const time = document.getElementById('res-form-time').value;
    const requests = document.getElementById('res-form-notes').value.trim();

    if (!name || !email || !date || !time) {
      AdminUI.showToast('Please fill all required reservation fields.', 'error');
      return;
    }

    const newRes = {
      id: `RES-${Math.floor(200 + Math.random() * 800)}`,
      name,
      email,
      phone: phone || '+1 (555) 000-0000',
      guests,
      date,
      time,
      status: 'confirmed',
      specialRequests: requests
    };

    reservations.unshift(newRes);
    EmberStore.saveReservations(reservations);
    closeAddModal();
    renderReservations();
    AdminUI.showToast(`Reservation created for ${name}.`, 'success');
  }

  function bindEvents() {
    const searchInput = document.getElementById('res-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        currentSearch = e.target.value.trim();
        renderReservations();
      });
    }

    const statusFilter = document.getElementById('res-status-filter');
    if (statusFilter) {
      statusFilter.addEventListener('change', (e) => {
        currentStatus = e.target.value;
        renderReservations();
      });
    }

    const addBtn = document.getElementById('add-res-btn');
    if (addBtn) addBtn.addEventListener('click', openAddModal);

    const closeBtn = document.getElementById('res-modal-close');
    const cancelBtn = document.getElementById('res-modal-cancel');
    if (closeBtn) closeBtn.addEventListener('click', closeAddModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeAddModal);

    const form = document.getElementById('reservation-form');
    if (form) form.addEventListener('submit', handleFormSubmit);
  }

  return {
    init,
    changeStatus,
    deleteReservation,
    openAddModal,
    closeAddModal
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('reservations-table-body')) {
    AdminReservations.init();
  }
});

if (typeof module !== 'undefined' && module.exports) {
  module.exports = AdminReservations;
}

