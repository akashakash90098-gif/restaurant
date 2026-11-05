/**
 * EMBER & OAK — Modern Dining
 * Admin Menu Management (Dishes CRUD)
 */

const AdminMenu = (function() {
  let dishes = [];
  let categories = [];
  let currentSearch = '';
  let currentCategory = 'all';
  let currentAvailability = 'all';
  let currentSort = 'name-asc';
  let isGridView = false;

  function init() {
    loadData();
    renderCategoryFilterOptions();
    renderDishes();
    bindEvents();
  }

  function loadData() {
    dishes = typeof EmberStore !== 'undefined' ? EmberStore.getMenuItems() : [];
    categories = typeof EmberStore !== 'undefined' ? EmberStore.getCategories() : [];
  }

  function renderCategoryFilterOptions() {
    const filterSelect = document.getElementById('menu-category-filter');
    const formCatSelect = document.getElementById('dish-form-category');
    
    const catOptionsHtml = `
      <option value="all">All Categories</option>
      ${categories.filter(c => c.id !== 'all').map(c => `
        <option value="${c.id}">${c.name}</option>
      `).join('')}
    `;

    if (filterSelect) filterSelect.innerHTML = catOptionsHtml;

    if (formCatSelect) {
      formCatSelect.innerHTML = categories.filter(c => c.id !== 'all').map(c => `
        <option value="${c.id}">${c.name}</option>
      `).join('');
    }
  }

  function getFilteredDishes() {
    return dishes.filter(d => {
      // Category filter
      if (currentCategory !== 'all' && d.category !== currentCategory) return false;

      // Availability filter
      if (currentAvailability === 'available' && d.isAvailable === false) return false;
      if (currentAvailability === 'unavailable' && d.isAvailable !== false) return false;

      // Search
      if (currentSearch) {
        const q = currentSearch.toLowerCase();
        const inName = d.name.toLowerCase().includes(q);
        const inDesc = (d.description || '').toLowerCase().includes(q);
        const inCat = (d.category || '').toLowerCase().includes(q);
        if (!inName && !inDesc && !inCat) return false;
      }

      return true;
    }).sort((a, b) => {
      if (currentSort === 'name-asc') return a.name.localeCompare(b.name);
      if (currentSort === 'name-desc') return b.name.localeCompare(a.name);
      if (currentSort === 'price-asc') return a.price - b.price;
      if (currentSort === 'price-desc') return b.price - a.price;
      if (currentSort === 'category') return (a.category || '').localeCompare(b.category || '');
      return 0;
    });
  }

  function renderDishes() {
    const tableBody = document.getElementById('dishes-table-body');
    const gridContainer = document.getElementById('dishes-grid-container');
    const countEl = document.getElementById('dishes-count-label');
    const emptyState = document.getElementById('dishes-empty-state');

    const filtered = getFilteredDishes();

    if (countEl) {
      countEl.textContent = `Showing ${filtered.length} of ${dishes.length} items`;
    }

    if (filtered.length === 0) {
      if (tableBody) tableBody.innerHTML = '';
      if (gridContainer) gridContainer.innerHTML = '';
      if (emptyState) emptyState.style.display = 'flex';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    // Render Table View
    if (tableBody) {
      tableBody.innerHTML = filtered.map(dish => {
        const isAvail = dish.isAvailable !== false;
        const categoryName = (categories.find(c => c.id === dish.category) || {}).name || dish.category;
        const specialBadge = dish.isChefSpecial ? `<span class="badge-status accepted" style="margin-left: 6px;">👑 Special</span>` : '';
        const vegBadge = dish.isVegetarian ? `<span title="Vegetarian" style="color: #27ae60; font-size: 0.95rem;">🌱</span>` : '';

        const dishImg = AdminUI.assetUrl(dish.image);
        const fallbackImg = AdminUI.assetUrl(dish.fallbackImage || 'assets/images/hero-interior.jpg');
        const safeName = AdminUI.escapeHTML(dish.name);

        return `
          <tr data-dish-id="${dish.id}">
            <td>
              <div class="table-dish-cell">
                <img class="table-dish-thumb" src="${dishImg}" alt="${safeName}" onerror="this.onerror=null; this.src='${fallbackImg}';">
                <div>
                  <div class="table-dish-name">
                    ${vegBadge} ${safeName} ${specialBadge}
                  </div>
                  <div class="table-dish-desc">${AdminUI.escapeHTML(dish.description || '')}</div>
                </div>
              </div>
            </td>
            <td>
              <span class="badge-status" style="background: #f4f1ea; color: #555;">${AdminUI.escapeHTML(categoryName)}</span>
            </td>
            <td>
              <strong style="color: var(--text-dark);">${AdminUI.formatCurrency(dish.price)}</strong>
              ${dish.discountPrice ? `<div style="font-size: 0.75rem; color: #e74c3c; text-decoration: line-through;">${AdminUI.formatCurrency(dish.price)}</div>` : ''}
            </td>
            <td>
              <button class="badge-status ${isAvail ? 'completed' : 'cancelled'}" 
                      style="cursor: pointer; border: none;"
                      title="Click to toggle availability"
                      onclick="AdminMenu.toggleAvailability('${dish.id}')">
                ${isAvail ? '● Available' : '○ Sold Out'}
              </button>
            </td>
            <td>
              <div class="table-actions-cell">
                <button class="action-icon-btn edit" title="Edit Dish" onclick="AdminMenu.openEditModal('${dish.id}')">✏️</button>
                <button class="action-icon-btn delete" title="Delete Dish" onclick="AdminMenu.deleteDish('${dish.id}')">🗑️</button>
              </div>
            </td>
          </tr>
        `;
      }).join('');
    }

    // Render Grid View
    if (gridContainer) {
      gridContainer.innerHTML = filtered.map(dish => {
        const isAvail = dish.isAvailable !== false;
        const categoryName = (categories.find(c => c.id === dish.category) || {}).name || dish.category;
        const dishImg = AdminUI.assetUrl(dish.image);
        const fallbackImg = AdminUI.assetUrl(dish.fallbackImage || 'assets/images/hero-interior.jpg');
        const safeName = AdminUI.escapeHTML(dish.name);

        return `
          <div class="admin-card" style="padding: 16px; display: flex; flex-direction: column; gap: 12px;">
            <div style="position: relative; height: 160px; border-radius: var(--radius-md); overflow: hidden; background: #1a1614;">
              <img src="${dishImg}" alt="${safeName}" style="width: 100%; height: 100%; object-fit: cover; display: block;" onerror="this.onerror=null; this.src='${fallbackImg}';">
              <span class="badge-status ${isAvail ? 'completed' : 'cancelled'}" style="position: absolute; top: 10px; right: 10px;">
                ${isAvail ? 'Available' : 'Sold Out'}
              </span>
            </div>
            <div>
              <div style="font-size: 0.75rem; text-transform: uppercase; color: var(--admin-gold); font-weight: 600;">${AdminUI.escapeHTML(categoryName)}</div>
              <h4 style="font-family: var(--font-serif); font-size: 1.1rem; color: var(--text-dark); margin: 4px 0;">${safeName}</h4>
              <p style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.4; height: 38px; overflow: hidden; text-overflow: ellipsis;">${AdminUI.escapeHTML(dish.description || '')}</p>
            </div>
            <div style="display: flex; align-items: center; justify-content: space-between; margin-top: auto; padding-top: 10px; border-top: 1px solid var(--admin-border-subtle);">
              <span style="font-size: 1.15rem; font-weight: 700; color: var(--text-dark);">${AdminUI.formatCurrency(dish.price)}</span>
              <div style="display: flex; gap: 6px;">
                <button class="action-icon-btn edit" onclick="AdminMenu.openEditModal('${dish.id}')">✏️</button>
                <button class="action-icon-btn delete" onclick="AdminMenu.deleteDish('${dish.id}')">🗑️</button>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  // ==================== DISH MODAL & FORM ====================
  function openAddModal() {
    const modal = document.getElementById('dish-modal');
    const form = document.getElementById('dish-form');
    const titleEl = document.getElementById('dish-modal-title');
    if (!modal || !form) return;

    form.reset();
    document.getElementById('dish-form-id').value = '';
    if (titleEl) titleEl.textContent = 'Add New Culinary Dish';

    // Clear previews and errors
    const imgPreview = document.getElementById('dish-img-preview');
    if (imgPreview) imgPreview.src = '../assets/images/hero-interior.jpg';
    form.querySelectorAll('.form-group').forEach(fg => fg.classList.remove('has-error'));

    modal.classList.add('open');
  }

  function openEditModal(dishId) {
    const dish = dishes.find(d => d.id === dishId);
    if (!dish) return;

    const modal = document.getElementById('dish-modal');
    const form = document.getElementById('dish-form');
    const titleEl = document.getElementById('dish-modal-title');
    if (!modal || !form) return;

    form.reset();
    form.querySelectorAll('.form-group').forEach(fg => fg.classList.remove('has-error'));

    if (titleEl) titleEl.textContent = `Edit Dish: ${dish.name}`;

    document.getElementById('dish-form-id').value = dish.id;
    document.getElementById('dish-form-name').value = dish.name;
    document.getElementById('dish-form-short-desc').value = dish.description || '';
    document.getElementById('dish-form-long-desc').value = dish.longDescription || '';
    document.getElementById('dish-form-price').value = dish.price;
    document.getElementById('dish-form-discount-price').value = dish.discountPrice || '';
    document.getElementById('dish-form-category').value = dish.category;
    document.getElementById('dish-form-image').value = dish.image;
    document.getElementById('dish-form-veg').checked = !!dish.isVegetarian;
    document.getElementById('dish-form-gf').checked = !!dish.isGlutenFree;
    document.getElementById('dish-form-special').checked = !!dish.isChefSpecial;
    document.getElementById('dish-form-available').checked = dish.isAvailable !== false;
    document.getElementById('dish-form-ingredients').value = (dish.ingredients || []).join(', ');

    const imgPreview = document.getElementById('dish-img-preview');
    if (imgPreview) imgPreview.src = AdminUI.assetUrl(dish.image);

    modal.classList.add('open');
  }

  function closeDishModal() {
    const modal = document.getElementById('dish-modal');
    if (modal) modal.classList.remove('open');
  }

  function handleFormSubmit(e) {
    e.preventDefault();

    const id = document.getElementById('dish-form-id').value;
    const name = document.getElementById('dish-form-name').value.trim();
    const shortDesc = document.getElementById('dish-form-short-desc').value.trim();
    const longDesc = document.getElementById('dish-form-long-desc').value.trim();
    const priceStr = document.getElementById('dish-form-price').value.trim();
    const discountStr = document.getElementById('dish-form-discount-price').value.trim();
    const category = document.getElementById('dish-form-category').value;
    const image = document.getElementById('dish-form-image').value.trim() || 'assets/images/hero-interior.jpg';
    const isVeg = document.getElementById('dish-form-veg').checked;
    const isGf = document.getElementById('dish-form-gf').checked;
    const isSpecial = document.getElementById('dish-form-special').checked;
    const isAvailable = document.getElementById('dish-form-available').checked;
    const ingredientsRaw = document.getElementById('dish-form-ingredients').value.trim();

    // Validation
    let isValid = true;
    const nameGroup = document.getElementById('dish-form-name').closest('.form-group');
    const priceGroup = document.getElementById('dish-form-price').closest('.form-group');

    if (!name) {
      if (nameGroup) nameGroup.classList.add('has-error');
      isValid = false;
    } else {
      if (nameGroup) nameGroup.classList.remove('has-error');
    }

    const price = parseFloat(priceStr);
    if (isNaN(price) || price < 0) {
      if (priceGroup) priceGroup.classList.add('has-error');
      isValid = false;
    } else {
      if (priceGroup) priceGroup.classList.remove('has-error');
    }

    const discountPrice = discountStr ? parseFloat(discountStr) : null;
    if (discountPrice !== null && (isNaN(discountPrice) || discountPrice > price)) {
      AdminUI.showToast('Discount price cannot exceed regular price.', 'error');
      return;
    }

    if (!isValid) return;

    const ingredients = ingredientsRaw ? ingredientsRaw.split(',').map(s => s.trim()).filter(Boolean) : [];

    if (id) {
      // Update existing
      const idx = dishes.findIndex(d => d.id === id);
      if (idx !== -1) {
        dishes[idx] = {
          ...dishes[idx],
          name,
          description: shortDesc,
          longDescription: longDesc || shortDesc,
          price,
          discountPrice,
          category,
          image,
          isVegetarian: isVeg,
          isGlutenFree: isGf,
          isChefSpecial: isSpecial,
          isAvailable,
          ingredients
        };
        AdminUI.showToast(`Updated "${name}" successfully.`, 'success');
      }
    } else {
      // Create new
      const newDish = {
        id: `dish-custom-${Date.now()}`,
        name,
        category,
        price,
        discountPrice,
        rating: 5.0,
        reviews: 1,
        description: shortDesc,
        longDescription: longDesc || shortDesc,
        image,
        fallbackImage: 'assets/images/hero-interior.jpg',
        calories: 450,
        isVegetarian: isVeg,
        isGlutenFree: isGf,
        isChefSpecial: isSpecial,
        isAvailable,
        spiciness: 0,
        prepTime: '15 mins',
        ingredients,
        addOns: []
      };
      dishes.unshift(newDish);
      AdminUI.showToast(`Added "${name}" to the menu.`, 'success');
    }

    EmberStore.saveMenuItems(dishes);
    closeDishModal();
    renderDishes();
  }

  function deleteDish(dishId) {
    const dish = dishes.find(d => d.id === dishId);
    if (!dish) return;

    AdminUI.confirm(
      'Delete Menu Dish',
      `Are you sure you want to delete "${dish.name}"? This action will remove it from the public menu.`,
      () => {
        dishes = dishes.filter(d => d.id !== dishId);
        EmberStore.saveMenuItems(dishes);
        renderDishes();
        AdminUI.showToast(`Deleted "${dish.name}".`, 'info');
      }
    );
  }

  function toggleAvailability(dishId) {
    const dish = dishes.find(d => d.id === dishId);
    if (!dish) return;

    dish.isAvailable = dish.isAvailable === false ? true : false;
    EmberStore.saveMenuItems(dishes);
    renderDishes();
    AdminUI.showToast(`"${dish.name}" is now ${dish.isAvailable ? 'available' : 'sold out'}.`, 'info');
  }

  function bindEvents() {
    // Search input
    const searchInput = document.getElementById('menu-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        currentSearch = e.target.value.trim();
        renderDishes();
      });
    }

    // Category filter
    const catFilter = document.getElementById('menu-category-filter');
    if (catFilter) {
      catFilter.addEventListener('change', (e) => {
        currentCategory = e.target.value;
        renderDishes();
      });
    }

    // Availability filter
    const availFilter = document.getElementById('menu-availability-filter');
    if (availFilter) {
      availFilter.addEventListener('change', (e) => {
        currentAvailability = e.target.value;
        renderDishes();
      });
    }

    // Sort
    const sortSelect = document.getElementById('menu-sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        renderDishes();
      });
    }

    // Grid / Table view toggle
    const viewTableBtn = document.getElementById('view-table-btn');
    const viewGridBtn = document.getElementById('view-grid-btn');
    const tableWrap = document.getElementById('dishes-table-wrap');
    const gridWrap = document.getElementById('dishes-grid-wrap');

    if (viewTableBtn && viewGridBtn) {
      viewTableBtn.addEventListener('click', () => {
        isGridView = false;
        viewTableBtn.classList.add('active');
        viewGridBtn.classList.remove('active');
        if (tableWrap) tableWrap.style.display = 'block';
        if (gridWrap) gridWrap.style.display = 'none';
      });

      viewGridBtn.addEventListener('click', () => {
        isGridView = true;
        viewGridBtn.classList.add('active');
        viewTableBtn.classList.remove('active');
        if (tableWrap) tableWrap.style.display = 'none';
        if (gridWrap) gridWrap.style.display = 'grid';
      });
    }

    // Add Dish Trigger
    const addBtn = document.getElementById('add-dish-btn');
    if (addBtn) addBtn.addEventListener('click', openAddModal);

    // Modal Close
    const closeBtn = document.getElementById('dish-modal-close');
    const cancelBtn = document.getElementById('dish-modal-cancel');
    if (closeBtn) closeBtn.addEventListener('click', closeDishModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeDishModal);

    // Form Submit
    const form = document.getElementById('dish-form');
    if (form) form.addEventListener('submit', handleFormSubmit);

    // Image URL live preview
    const imgInput = document.getElementById('dish-form-image');
    const imgPreview = document.getElementById('dish-img-preview');
    if (imgInput && imgPreview) {
      imgInput.addEventListener('input', () => {
        imgPreview.src = AdminUI.assetUrl(imgInput.value.trim() || 'assets/images/hero-interior.jpg');
      });
    }
  }

  return {
    init,
    openAddModal,
    openEditModal,
    closeDishModal,
    deleteDish,
    toggleAvailability
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('dishes-table-body')) {
    AdminMenu.init();
  }
});

if (typeof module !== 'undefined' && module.exports) {
  module.exports = AdminMenu;
}

