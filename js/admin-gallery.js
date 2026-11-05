/**
 * EMBER & OAK — Modern Dining
 * Admin Photo Gallery Management
 */

const AdminGallery = (function() {
  let gallery = [];

  function init() {
    loadData();
    renderGallery();
    bindEvents();
  }

  function loadData() {
    gallery = typeof EmberStore !== 'undefined' ? EmberStore.getGallery() : [];
  }

  function renderGallery() {
    const grid = document.getElementById('gallery-cards-grid');
    const emptyState = document.getElementById('gallery-empty-state');
    if (!grid) return;

    if (gallery.length === 0) {
      grid.innerHTML = '';
      if (emptyState) emptyState.style.display = 'flex';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    grid.innerHTML = gallery.map(item => {
      const resolvedImg = AdminUI.assetUrl(item.image);
      const fallback = item.fallbackImage ? AdminUI.assetUrl(item.fallbackImage) : '../assets/images/hero-interior.jpg';
      const safeTitle = AdminUI.escapeHTML(item.title || 'Photograph');
      const safeAlt = AdminUI.escapeHTML(item.alt || item.title || 'Culinary visual capture.');
      const safeCat = AdminUI.escapeHTML(item.category || 'interior');

      return `
      <div class="admin-card" style="overflow: hidden; display: flex; flex-direction: column;">
        <div style="position: relative; height: 190px; background: #1a1614;">
          <img src="${resolvedImg}" 
               alt="${safeAlt}" 
               style="width: 100%; height: 100%; object-fit: cover; display: block;" 
               onerror="this.onerror=null; this.src='${fallback}';">
          ${item.isFeatured ? `<span class="badge-status accepted" style="position: absolute; top: 10px; right: 10px; box-shadow: var(--shadow-sm);">👑 Featured</span>` : ''}
          <span class="badge-status" style="position: absolute; bottom: 10px; left: 10px; background: rgba(0,0,0,0.72); color: #fff; font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.05em; backdrop-filter: blur(4px);">
            ${safeCat}
          </span>
        </div>
        <div style="padding: 16px; flex: 1; display: flex; flex-direction: column;">
          <h4 style="font-family: var(--font-serif); font-size: 1.05rem; color: var(--text-dark); margin-bottom: 4px;">${safeTitle}</h4>
          <p style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.4; margin-bottom: 12px; height: 34px; overflow: hidden;">${safeAlt}</p>
          <div style="display: flex; align-items: center; justify-content: space-between; margin-top: auto; padding-top: 10px; border-top: 1px solid var(--admin-border-subtle);">
            <button class="badge-status ${item.isFeatured ? 'accepted' : 'neutral'}" 
                    style="cursor: pointer; border: 1px solid var(--admin-border); background: var(--admin-surface);"
                    onclick="AdminGallery.toggleFeatured('${item.id}')">
              ${item.isFeatured ? '★ Featured' : '☆ Make Featured'}
            </button>
            <div style="display: flex; gap: 6px;">
              <button class="action-icon-btn edit" onclick="AdminGallery.openEditModal('${item.id}')" title="Edit Photo">✏️</button>
              <button class="action-icon-btn delete" onclick="AdminGallery.deleteItem('${item.id}')" title="Delete Photo">🗑️</button>
            </div>
          </div>
        </div>
      </div>
      `;
    }).join('');
  }

  function openAddModal() {
    const modal = document.getElementById('gallery-modal');
    const form = document.getElementById('gallery-form');
    const titleEl = document.getElementById('gallery-modal-title');
    if (!modal || !form) return;

    form.reset();
    document.getElementById('gallery-form-id').value = '';
    if (titleEl) titleEl.textContent = 'Add New Gallery Photograph';

    const preview = document.getElementById('gallery-img-preview');
    if (preview) preview.src = '../assets/images/hero-interior.jpg';

    modal.classList.add('open');
  }

  function openEditModal(itemId) {
    const item = gallery.find(g => g.id === itemId);
    if (!item) return;

    const modal = document.getElementById('gallery-modal');
    const form = document.getElementById('gallery-form');
    const titleEl = document.getElementById('gallery-modal-title');
    if (!modal || !form) return;

    form.reset();
    if (titleEl) titleEl.textContent = `Edit Photo: ${item.title}`;

    document.getElementById('gallery-form-id').value = item.id;
    document.getElementById('gallery-form-title').value = item.title;
    document.getElementById('gallery-form-category').value = item.category || 'interior';
    document.getElementById('gallery-form-image').value = item.image;
    document.getElementById('gallery-form-alt').value = item.alt || '';
    document.getElementById('gallery-form-featured').checked = !!item.isFeatured;

    const preview = document.getElementById('gallery-img-preview');
    if (preview) preview.src = AdminUI.assetUrl(item.image);

    modal.classList.add('open');
  }

  function closeGalleryModal() {
    const modal = document.getElementById('gallery-modal');
    if (modal) modal.classList.remove('open');
  }

  function handleFormSubmit(e) {
    e.preventDefault();

    const id = document.getElementById('gallery-form-id').value;
    const title = document.getElementById('gallery-form-title').value.trim();
    const category = document.getElementById('gallery-form-category').value;
    const image = document.getElementById('gallery-form-image').value.trim();
    const alt = document.getElementById('gallery-form-alt').value.trim();
    const isFeatured = document.getElementById('gallery-form-featured').checked;

    if (!title || !image) {
      AdminUI.showToast('Please provide a title and image URL.', 'error');
      return;
    }

    if (id) {
      const idx = gallery.findIndex(g => g.id === id);
      if (idx !== -1) {
        gallery[idx] = { ...gallery[idx], title, category, image, alt, isFeatured };
        AdminUI.showToast(`Updated "${title}".`, 'success');
      }
    } else {
      const newItem = {
        id: `gal-custom-${Date.now()}`,
        title,
        category,
        image,
        alt: alt || title,
        isFeatured
      };
      gallery.unshift(newItem);
      AdminUI.showToast(`Added "${title}" to gallery.`, 'success');
    }

    EmberStore.saveGallery(gallery);
    closeGalleryModal();
    renderGallery();
  }

  function toggleFeatured(itemId) {
    const item = gallery.find(g => g.id === itemId);
    if (!item) return;

    item.isFeatured = !item.isFeatured;
    EmberStore.saveGallery(gallery);
    renderGallery();
    AdminUI.showToast(`"${item.title}" is now ${item.isFeatured ? 'featured' : 'standard'}.`, 'info');
  }

  function deleteItem(itemId) {
    const item = gallery.find(g => g.id === itemId);
    if (!item) return;

    AdminUI.confirm(
      'Remove Photo',
      `Are you sure you want to remove "${item.title}" from the restaurant gallery?`,
      () => {
        gallery = gallery.filter(g => g.id !== itemId);
        EmberStore.saveGallery(gallery);
        renderGallery();
        AdminUI.showToast(`Photo removed.`, 'info');
      }
    );
  }

  function bindEvents() {
    const addBtn = document.getElementById('add-gallery-btn');
    if (addBtn) addBtn.addEventListener('click', openAddModal);

    const closeBtn = document.getElementById('gallery-modal-close');
    const cancelBtn = document.getElementById('gallery-modal-cancel');
    if (closeBtn) closeBtn.addEventListener('click', closeGalleryModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeGalleryModal);

    const form = document.getElementById('gallery-form');
    if (form) form.addEventListener('submit', handleFormSubmit);

    const imgInput = document.getElementById('gallery-form-image');
    const preview = document.getElementById('gallery-img-preview');
    if (imgInput && preview) {
      imgInput.addEventListener('input', () => {
        preview.src = AdminUI.assetUrl(imgInput.value.trim() || 'assets/images/hero-interior.jpg');
      });
    }
  }

  return {
    init,
    openAddModal,
    openEditModal,
    closeGalleryModal,
    toggleFeatured,
    deleteItem
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('gallery-cards-grid')) {
    AdminGallery.init();
  }
});

if (typeof module !== 'undefined' && module.exports) {
  module.exports = AdminGallery;
}

