/**
 * EMBER & OAK — Modern Dining
 * Admin Category Management
 */

const AdminCategories = (function() {
  let categories = [];
  let dishes = [];

  function init() {
    loadData();
    renderCategories();
    bindEvents();
  }

  function loadData() {
    categories = typeof EmberStore !== 'undefined' ? EmberStore.getCategories() : [];
    dishes = typeof EmberStore !== 'undefined' ? EmberStore.getMenuItems() : [];
  }

  function renderCategories() {
    const tbody = document.getElementById('categories-table-body');
    if (!tbody) return;

    // Filter out "all" from editable list
    const editableCats = categories.filter(c => c.id !== 'all');

    tbody.innerHTML = editableCats.map((cat, idx) => {
      const assignedDishes = dishes.filter(d => d.category === cat.id);
      const isSystem = ['starters', 'burgers', 'mains', 'desserts'].includes(cat.id);

      return `
        <tr data-cat-id="${cat.id}">
          <td style="font-family: var(--font-mono); color: var(--text-muted); font-size: 0.8rem;">
            #${idx + 1}
          </td>
          <td>
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="font-size: 1.4rem;">${cat.icon || '🍽️'}</span>
              <div>
                <strong style="color: var(--text-dark);">${cat.name}</strong>
                <div style="font-size: 0.74rem; color: var(--text-muted); font-family: var(--font-mono);">ID: ${cat.id}</div>
              </div>
            </div>
          </td>
          <td>
            <div style="font-size: 0.84rem; color: var(--text-muted); max-width: 260px;">
              ${cat.description || 'Artisanal kitchen offerings crafted with seasonal ingredients.'}
            </div>
          </td>
          <td>
            <span class="badge-status" style="background: rgba(197, 157, 69, 0.15); color: #8c6d23; font-weight: 600;">
              ${assignedDishes.length} dishes
            </span>
          </td>
          <td>
            <span class="badge-status ${cat.isActive !== false ? 'completed' : 'cancelled'}">
              ${cat.isActive !== false ? '● Active' : '○ Inactive'}
            </span>
          </td>
          <td>
            <div class="table-actions-cell">
              <button class="action-icon-btn edit" title="Edit Category" onclick="AdminCategories.openEditModal('${cat.id}')">✏️</button>
              <button class="action-icon-btn delete" title="Delete Category" onclick="AdminCategories.deleteCategory('${cat.id}')">🗑️</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  function openAddModal() {
    const modal = document.getElementById('category-modal');
    const form = document.getElementById('category-form');
    const titleEl = document.getElementById('category-modal-title');
    if (!modal || !form) return;

    form.reset();
    document.getElementById('cat-form-id').value = '';
    if (titleEl) titleEl.textContent = 'Add New Culinary Category';

    modal.classList.add('open');
  }

  function openEditModal(catId) {
    const cat = categories.find(c => c.id === catId);
    if (!cat) return;

    const modal = document.getElementById('category-modal');
    const form = document.getElementById('category-form');
    const titleEl = document.getElementById('category-modal-title');
    if (!modal || !form) return;

    form.reset();
    if (titleEl) titleEl.textContent = `Edit Category: ${cat.name}`;

    document.getElementById('cat-form-id').value = cat.id;
    document.getElementById('cat-form-name').value = cat.name;
    document.getElementById('cat-form-icon').value = cat.icon || '🍽️';
    document.getElementById('cat-form-desc').value = cat.description || '';
    document.getElementById('cat-form-active').checked = cat.isActive !== false;

    modal.classList.add('open');
  }

  function closeCategoryModal() {
    const modal = document.getElementById('category-modal');
    if (modal) modal.classList.remove('open');
  }

  function handleFormSubmit(e) {
    e.preventDefault();

    const id = document.getElementById('cat-form-id').value;
    const name = document.getElementById('cat-form-name').value.trim();
    const icon = document.getElementById('cat-form-icon').value.trim() || '🍽️';
    const description = document.getElementById('cat-form-desc').value.trim();
    const isActive = document.getElementById('cat-form-active').checked;

    if (!name) {
      AdminUI.showToast('Category name is required.', 'error');
      return;
    }

    if (id) {
      const idx = categories.findIndex(c => c.id === id);
      if (idx !== -1) {
        categories[idx] = {
          ...categories[idx],
          name,
          icon,
          description,
          isActive
        };
        AdminUI.showToast(`Updated "${name}" category.`, 'success');
      }
    } else {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const newCat = {
        id: slug,
        name,
        icon,
        description,
        isActive
      };
      categories.push(newCat);
      AdminUI.showToast(`Added new category "${name}".`, 'success');
    }

    EmberStore.saveCategories(categories);
    closeCategoryModal();
    renderCategories();
  }

  function deleteCategory(catId) {
    const cat = categories.find(c => c.id === catId);
    if (!cat) return;

    const assignedDishes = dishes.filter(d => d.category === catId);
    if (assignedDishes.length > 0) {
      AdminUI.showToast(`Cannot delete "${cat.name}": ${assignedDishes.length} dishes are currently assigned to it. Reassign dishes first.`, 'error');
      return;
    }

    AdminUI.confirm(
      'Delete Category',
      `Are you sure you want to delete category "${cat.name}"?`,
      () => {
        categories = categories.filter(c => c.id !== catId);
        EmberStore.saveCategories(categories);
        renderCategories();
        AdminUI.showToast(`Category "${cat.name}" deleted.`, 'info');
      }
    );
  }

  function bindEvents() {
    const addBtn = document.getElementById('add-cat-btn');
    if (addBtn) addBtn.addEventListener('click', openAddModal);

    const closeBtn = document.getElementById('category-modal-close');
    const cancelBtn = document.getElementById('category-modal-cancel');
    if (closeBtn) closeBtn.addEventListener('click', closeCategoryModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeCategoryModal);

    const form = document.getElementById('category-form');
    if (form) form.addEventListener('submit', handleFormSubmit);
  }

  return {
    init,
    openAddModal,
    openEditModal,
    closeCategoryModal,
    deleteCategory
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('categories-table-body')) {
    AdminCategories.init();
  }
});

if (typeof module !== 'undefined' && module.exports) {
  module.exports = AdminCategories;
}

