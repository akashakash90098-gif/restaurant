/**
 * EMBER & OAK — Modern Dining
 * Interactive Food Menu & Sequential Dish Showcase
 * Inspired by Reference Video 1: clean layout, floating leaves, orbital sequence, category filtering, detail modal.
 */

const MenuApp = (function() {
  let activeCategory = 'all';
  let searchQuery = '';
  let vegOnly = false;
  let gfOnly = false;
  let currentShowcaseIndex = 0;
  let showcaseQty = 1;

  // Selected state for active modal dish
  let currentModalDish = null;
  let modalQty = 1;
  let modalSelectedAddOns = [];

  function init() {
    renderCategoryPills();
    renderMenuList();
    initShowcase();
    bindEvents();
  }

  // ==================== CATEGORY PILLS ====================
  function renderCategoryPills() {
    const container = document.getElementById('menu-category-pills');
    if (!container) return;

    const categories = (typeof EmberStore !== 'undefined' ? EmberStore.getCategories() : MENU_CATEGORIES).filter(c => c.isActive !== false);

    container.innerHTML = categories.map(cat => `
      <button class="cat-pill-btn ${cat.id === activeCategory ? 'active' : ''}" 
              data-category="${cat.id}" 
              role="tab" 
              aria-selected="${cat.id === activeCategory}">
        <span class="cat-pill-icon">${cat.icon}</span>
        <span class="cat-pill-text">${cat.name}</span>
      </button>
    `).join('');

    container.querySelectorAll('.cat-pill-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const catId = btn.getAttribute('data-category');
        setCategory(catId);
      });
    });
  }

  function setCategory(catId) {
    if (activeCategory === catId) return;
    activeCategory = catId;

    // Update pill buttons
    document.querySelectorAll('.cat-pill-btn').forEach(btn => {
      const match = btn.getAttribute('data-category') === catId;
      btn.classList.toggle('active', match);
      btn.setAttribute('aria-selected', match);
    });

    // Smooth transition: brief fade out, update, fade in
    const grid = document.getElementById('menu-grid-container');
    if (grid) {
      grid.classList.add('grid-transitioning');
      setTimeout(() => {
        renderMenuList();
        grid.classList.remove('grid-transitioning');
      }, 150);
    } else {
      renderMenuList();
    }
  }

  // ==================== MENU GRID ====================
  function getFilteredItems() {
    const catalog = typeof EmberStore !== 'undefined' ? EmberStore.getMenuItems() : MENU_ITEMS;
    return catalog.filter(item => {
      // Respect availability status
      if (item.isAvailable === false) return false;

      // Category match
      if (activeCategory !== 'all' && item.category !== activeCategory) {
        return false;
      }
      // Vegetarian filter
      if (vegOnly && !item.isVegetarian) {
        return false;
      }
      // Gluten-free filter
      if (gfOnly && !item.isGlutenFree) {
        return false;
      }
      // Search query match
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const inName = item.name.toLowerCase().includes(q);
        const inDesc = item.description.toLowerCase().includes(q);
        const inIngredients = item.ingredients && item.ingredients.some(ing => ing.toLowerCase().includes(q));
        if (!inName && !inDesc && !inIngredients) {
          return false;
        }
      }
      return true;
    });
  }

  function renderMenuList() {
    const grid = document.getElementById('menu-grid-container');
    const emptyState = document.getElementById('menu-empty-state');
    if (!grid) return;

    const filtered = getFilteredItems();

    if (filtered.length === 0) {
      grid.innerHTML = '';
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    grid.innerHTML = filtered.map((dish, index) => {
      const isChefSpecial = dish.isChefSpecial ? `<span class="badge-special">👑 Chef's Signature</span>` : '';
      const vegBadge = dish.isVegetarian ? `<span class="badge-veg" title="Vegetarian">🌱 Veg</span>` : '';
      const gfBadge = dish.isGlutenFree ? `<span class="badge-gf" title="Gluten-Free">🌾 GF</span>` : '';

      return `
        <article class="dish-card" style="animation-delay: ${Math.min(index * 40, 400)}ms" data-dish-id="${dish.id}">
          <div class="dish-card-img-wrap" onclick="MenuApp.openDishModal('${dish.id}')">
            <img class="dish-card-img" 
                 src="${dish.image}" 
                 alt="${dish.name}" 
                 onerror="this.onerror=null;this.src='${dish.fallbackImage}';" 
                 loading="lazy">
            <div class="dish-card-overlay">
              <span class="quick-view-prompt">Inspect Dish 🔍</span>
            </div>
          </div>
          
          <div class="dish-card-body">
            <div class="dish-card-meta-top">
              <div class="dish-rating">
                <span class="star-icon">★</span>
                <span class="rating-num">${dish.rating.toFixed(1)}</span>
                <span class="rating-count">(${dish.reviews})</span>
              </div>
              <div class="dish-badges">
                ${isChefSpecial}
                ${vegBadge}
                ${gfBadge}
              </div>
            </div>

            <h3 class="dish-title" onclick="MenuApp.openDishModal('${dish.id}')">${dish.name}</h3>
            <p class="dish-desc">${dish.description}</p>

            <div class="dish-card-footer">
              <div class="dish-price">$${dish.price.toFixed(2)}</div>
              <button class="add-to-cart-quick-btn" onclick="MenuApp.handleQuickAdd('${dish.id}', event)">
                <span class="btn-plus-icon">+</span> Add
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');
  }

  function handleQuickAdd(dishId, event) {
    if (event) event.stopPropagation();
    Cart.addItem(dishId, 1, [], '');
  }

  // ==================== DISH DETAIL MODAL ====================
  function openDishModal(dishId) {
    const catalog = typeof EmberStore !== 'undefined' ? EmberStore.getMenuItems() : MENU_ITEMS;
    const dish = catalog.find(d => d.id === dishId);
    if (!dish) return;

    currentModalDish = dish;
    modalQty = 1;
    modalSelectedAddOns = [];

    const modal = document.getElementById('dish-detail-modal');
    if (!modal) return;

    // Populate Modal Elements
    const imgEl = document.getElementById('modal-dish-img');
    const titleEl = document.getElementById('modal-dish-title');
    const priceEl = document.getElementById('modal-dish-price');
    const descEl = document.getElementById('modal-dish-desc');
    const ratingEl = document.getElementById('modal-dish-rating');
    const badgesEl = document.getElementById('modal-dish-badges');
    const calsEl = document.getElementById('modal-dish-cals');
    const prepEl = document.getElementById('modal-dish-prep');
    const ingrEl = document.getElementById('modal-dish-ingredients');
    const addonsWrap = document.getElementById('modal-dish-addons-wrap');
    const addonsList = document.getElementById('modal-dish-addons-list');
    const qtyValEl = document.getElementById('modal-qty-val');
    const notesInput = document.getElementById('modal-special-notes');

    if (imgEl) {
      imgEl.src = dish.image;
      imgEl.alt = dish.name;
      imgEl.onerror = () => { imgEl.src = dish.fallbackImage; };
    }
    if (titleEl) titleEl.textContent = dish.name;
    if (descEl) descEl.textContent = dish.longDescription || dish.description;
    if (ratingEl) ratingEl.innerHTML = `★ ${dish.rating.toFixed(1)} <small>(${dish.reviews} verified dining reviews)</small>`;
    if (calsEl) calsEl.textContent = dish.calories ? `${dish.calories} kcal` : 'Artisanal';
    if (prepEl) prepEl.textContent = dish.prepTime || '12 mins';

    if (notesInput) notesInput.value = '';
    if (qtyValEl) qtyValEl.textContent = modalQty;

    // Badges
    if (badgesEl) {
      let bHtml = '';
      if (dish.isChefSpecial) bHtml += `<span class="badge-special">👑 Chef's Reserve</span>`;
      if (dish.isVegetarian) bHtml += `<span class="badge-veg">🌱 Vegetarian</span>`;
      if (dish.isGlutenFree) bHtml += `<span class="badge-gf">🌾 Gluten-Free</span>`;
      if (dish.spiciness > 0) bHtml += `<span class="badge-spicy">${'🔥'.repeat(dish.spiciness)} Mild Spice</span>`;
      badgesEl.innerHTML = bHtml;
    }

    // Ingredients
    if (ingrEl) {
      ingrEl.innerHTML = (dish.ingredients || []).map(i => `<span class="ing-tag">${i}</span>`).join('');
    }

    // Add-ons
    if (addonsWrap && addonsList) {
      if (dish.addOns && dish.addOns.length > 0) {
        addonsWrap.style.display = 'block';
        addonsList.innerHTML = dish.addOns.map((add, idx) => `
          <label class="addon-checkbox-label">
            <input type="checkbox" class="addon-checkbox" data-index="${idx}" onchange="MenuApp.updateModalAddOn(this, ${idx})">
            <span class="addon-custom-box"></span>
            <span class="addon-name">${add.name}</span>
            <span class="addon-price">+$${add.price.toFixed(2)}</span>
          </label>
        `).join('');
      } else {
        addonsWrap.style.display = 'none';
        addonsList.innerHTML = '';
      }
    }

    updateModalTotal();

    modal.classList.add('open');
    document.body.classList.add('modal-open-noscroll');
  }

  function updateModalAddOn(checkbox, index) {
    if (!currentModalDish || !currentModalDish.addOns) return;
    const addOn = currentModalDish.addOns[index];
    if (checkbox.checked) {
      modalSelectedAddOns.push(addOn);
    } else {
      modalSelectedAddOns = modalSelectedAddOns.filter(a => a.name !== addOn.name);
    }
    updateModalTotal();
  }

  function updateModalQty(delta) {
    modalQty += delta;
    if (modalQty < 1) modalQty = 1;
    const qtyValEl = document.getElementById('modal-qty-val');
    if (qtyValEl) qtyValEl.textContent = modalQty;
    updateModalTotal();
  }

  function updateModalTotal() {
    if (!currentModalDish) return;
    const addOnTotal = modalSelectedAddOns.reduce((sum, a) => sum + a.price, 0);
    const unitPrice = currentModalDish.price + addOnTotal;
    const totalPrice = unitPrice * modalQty;

    const priceEl = document.getElementById('modal-dish-price');
    const ctaBtn = document.getElementById('modal-add-to-cart-btn');

    if (priceEl) priceEl.textContent = `$${unitPrice.toFixed(2)}`;
    if (ctaBtn) {
      ctaBtn.innerHTML = `<span>Add to Order</span> <strong>$${totalPrice.toFixed(2)}</strong>`;
    }
  }

  function handleModalAddToCart() {
    if (!currentModalDish) return;
    const notesInput = document.getElementById('modal-special-notes');
    const notes = notesInput ? notesInput.value : '';

    Cart.addItem(currentModalDish.id, modalQty, modalSelectedAddOns, notes);
    closeDishModal();
  }

  function closeDishModal() {
    const modal = document.getElementById('dish-detail-modal');
    if (modal) {
      modal.classList.remove('open');
      document.body.classList.remove('modal-open-noscroll');
    }
    currentModalDish = null;
  }

  // ==================== SEQUENTIAL ORBITAL SHOWCASE ====================
  // (Reference Video 1 recreation: smooth sequential reveals with floating garnish and continuous auto-rotation)
  let showcaseAutoTimer = null;
  const showcaseAutoInterval = 3800; // 3.8 seconds per dish
  let showcaseElapsed = 0;
  let isShowcaseAutoPaused = false;
  let isMiddleImageHovered = false; // When mouse is taken to that middle image, rotation pauses
  let cumulativeOrbitStep = 0; // Tracks cumulative rotations so the carousel rotates forward continuously without snapping

  function initShowcase() {
    initShowcaseOrbitDots();
    renderShowcaseDish();
    startShowcaseAutoPlay();

    const prevBtn = document.getElementById('showcase-prev-btn');
    const nextBtn = document.getElementById('showcase-next-btn');
    const orderBtn = document.getElementById('showcase-order-btn');
    const qtyMinus = document.getElementById('showcase-qty-minus');
    const qtyPlus = document.getElementById('showcase-qty-plus');
    const autoPlayBtn = document.getElementById('showcase-autoplay-toggle');
    const plateStage = document.getElementById('showcase-plate-stage') || document.querySelector('.showcase-plate-stage');

    // Pause auto-rotation when the mouse is taken and goes to that middle image
    if (plateStage) {
      plateStage.addEventListener('mouseenter', () => {
        isMiddleImageHovered = true;
        updateShowcaseTimerUI();
      });
      plateStage.addEventListener('mouseleave', () => {
        isMiddleImageHovered = false;
        updateShowcaseTimerUI();
      });
      plateStage.addEventListener('click', () => {
        const item = SIGNATURE_SHOWCASE_ITEMS[currentShowcaseIndex];
        if (item && item.dishId) {
          openDishModal(item.dishId);
        }
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        advanceShowcase(-1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        advanceShowcase(1);
      });
    }

    if (autoPlayBtn) {
      autoPlayBtn.addEventListener('click', toggleShowcaseAutoPlay);
    }

    if (qtyMinus) {
      qtyMinus.addEventListener('click', () => {
        if (showcaseQty > 1) {
          showcaseQty--;
          updateShowcaseQtyDisplay();
        }
      });
    }

    if (qtyPlus) {
      qtyPlus.addEventListener('click', () => {
        showcaseQty++;
        updateShowcaseQtyDisplay();
      });
    }

    if (orderBtn) {
      orderBtn.addEventListener('click', () => {
        const item = SIGNATURE_SHOWCASE_ITEMS[currentShowcaseIndex];
        Cart.addItem(item.dishId, showcaseQty, [], '');
        
        // Delightful micro-feedback
        const originalText = orderBtn.textContent;
        orderBtn.textContent = 'Added ✓';
        orderBtn.style.filter = 'brightness(1.15)';
        setTimeout(() => {
          orderBtn.textContent = originalText;
          orderBtn.style.filter = '';
        }, 1200);
      });
    }
  }

  function initShowcaseOrbitDots() {
    const dotsContainer = document.getElementById('showcase-orbit-dots');
    if (!dotsContainer) return;

    dotsContainer.innerHTML = SIGNATURE_SHOWCASE_ITEMS.map((si, idx) => `
      <button class="orbit-mini-dot ${idx === currentShowcaseIndex ? 'active' : ''}" 
              data-dot-index="${idx}"
              title="${si.name}" 
              onclick="MenuApp.selectShowcaseIndex(${idx})"
              aria-label="View ${si.name}">
        <img src="${si.image}" 
             alt="${si.name}" 
             onerror="this.onerror=null;this.src='${si.fallbackImage}';">
      </button>
    `).join('');
  }

  function startShowcaseAutoPlay() {
    stopShowcaseAutoPlay();
    showcaseElapsed = 0;
    updateShowcaseTimerUI();

    showcaseAutoTimer = setInterval(() => {
      // Pause rotation when manual pause is on OR when mouse is hovering the middle image
      if (isShowcaseAutoPaused || isMiddleImageHovered) {
        updateShowcaseTimerUI();
        return;
      }

      showcaseElapsed += 100;
      updateShowcaseTimerUI();

      if (showcaseElapsed >= showcaseAutoInterval) {
        showcaseElapsed = 0;
        advanceShowcase(1);
      }
    }, 100);
  }

  function stopShowcaseAutoPlay() {
    if (showcaseAutoTimer) {
      clearInterval(showcaseAutoTimer);
      showcaseAutoTimer = null;
    }
  }

  function resetShowcaseTimer() {
    showcaseElapsed = 0;
    updateShowcaseTimerUI();
  }

  function advanceShowcase(delta) {
    cumulativeOrbitStep += delta;
    const total = SIGNATURE_SHOWCASE_ITEMS.length;
    currentShowcaseIndex = ((cumulativeOrbitStep % total) + total) % total;
    renderShowcaseDish();
    resetShowcaseTimer();
  }

  function selectShowcaseIndex(targetIdx) {
    if (targetIdx === currentShowcaseIndex) return;
    const total = SIGNATURE_SHOWCASE_ITEMS.length;
    let diff = targetIdx - currentShowcaseIndex;
    if (diff > 2) diff -= total;
    if (diff < -2) diff += total;
    cumulativeOrbitStep += diff;
    currentShowcaseIndex = targetIdx;
    renderShowcaseDish();
    resetShowcaseTimer();
  }

  function toggleShowcaseAutoPlay() {
    isShowcaseAutoPaused = !isShowcaseAutoPaused;
    const badge = document.getElementById('showcase-autoplay-toggle');
    const label = document.getElementById('showcase-autoplay-text');
    if (badge) badge.classList.toggle('paused', isShowcaseAutoPaused);
    if (label) label.textContent = isShowcaseAutoPaused ? 'Paused' : 'Auto 4s';
    if (!isShowcaseAutoPaused) resetShowcaseTimer();
  }

  function updateShowcaseTimerUI() {
    const fillEl = document.getElementById('showcase-timer-fill');
    const label = document.getElementById('showcase-autoplay-text');
    const badge = document.getElementById('showcase-autoplay-toggle');

    const isHolding = isShowcaseAutoPaused || isMiddleImageHovered;

    if (badge) {
      badge.classList.toggle('paused', isHolding);
    }

    if (label) {
      if (isShowcaseAutoPaused) {
        label.textContent = 'Paused';
      } else if (isMiddleImageHovered) {
        label.textContent = '❚❚ Holding';
      } else {
        const remainingSec = Math.max(1, Math.ceil((showcaseAutoInterval - showcaseElapsed) / 1000));
        label.textContent = `Auto ${remainingSec}s`;
      }
    }

    if (fillEl) {
      const pct = Math.min(100, (showcaseElapsed / showcaseAutoInterval) * 100);
      fillEl.style.width = isShowcaseAutoPaused ? '0%' : `${pct}%`;
    }
  }

  function updateShowcaseQtyDisplay() {
    const valEl = document.getElementById('showcase-qty-val');
    if (valEl) valEl.textContent = showcaseQty < 10 ? `0${showcaseQty}` : showcaseQty;
  }

  function renderShowcaseDish() {
    const item = SIGNATURE_SHOWCASE_ITEMS[currentShowcaseIndex];
    if (!item) return;

    showcaseQty = 1;
    updateShowcaseQtyDisplay();

    const editorialCol = document.querySelector('.showcase-editorial-col');
    const titleEl = document.getElementById('showcase-dish-title');
    const subtitleEl = document.getElementById('showcase-dish-subtitle');
    const priceEl = document.getElementById('showcase-dish-price');
    const descEl = document.getElementById('showcase-dish-desc');
    const tagsEl = document.getElementById('showcase-dish-tags');
    const plateImgEl = document.getElementById('showcase-plate-img');
    const plateGlowEl = document.querySelector('.showcase-plate-glow');
    const dotsContainer = document.getElementById('showcase-orbit-dots');

    // Smooth staggered editorial text transition
    if (editorialCol) {
      editorialCol.classList.add('text-switching');
      setTimeout(() => {
        if (titleEl) titleEl.textContent = item.name;
        if (subtitleEl) subtitleEl.textContent = item.subtitle;
        if (priceEl) priceEl.textContent = item.price;
        if (descEl) descEl.textContent = item.description;
        if (tagsEl) {
          tagsEl.innerHTML = (item.tags || []).map(t => `<span class="showcase-tag">${t}</span>`).join('');
        }
        editorialCol.classList.remove('text-switching');
      }, 160);
    } else {
      if (titleEl) titleEl.textContent = item.name;
      if (subtitleEl) subtitleEl.textContent = item.subtitle;
      if (priceEl) priceEl.textContent = item.price;
      if (descEl) descEl.textContent = item.description;
      if (tagsEl) {
        tagsEl.innerHTML = (item.tags || []).map(t => `<span class="showcase-tag">${t}</span>`).join('');
      }
    }

    // Plate image transition with rotation & scale
    if (plateImgEl) {
      plateImgEl.classList.add('plate-switching');
      if (plateGlowEl) plateGlowEl.classList.add('glow-burst');

      setTimeout(() => {
        plateImgEl.src = item.image;
        plateImgEl.alt = item.name;
        plateImgEl.onerror = () => { plateImgEl.src = item.fallbackImage; };
        plateImgEl.classList.remove('plate-switching');
        if (plateGlowEl) {
          setTimeout(() => plateGlowEl.classList.remove('glow-burst'), 400);
        }
      }, 180);
    }

    // Revolve orbital ring smoothly and counter-rotate child images so food is always upright
    if (dotsContainer) {
      const totalDots = SIGNATURE_SHOWCASE_ITEMS.length;
      const stepAngle = 360 / totalDots; // 72 deg
      const orbitRotationAngle = -cumulativeOrbitStep * stepAngle;
      dotsContainer.style.transform = `rotate(${orbitRotationAngle}deg)`;

      // Update dot active states and counter-rotate images so food is always upright
      const dots = dotsContainer.querySelectorAll('.orbit-mini-dot');
      dots.forEach((dot, idx) => {
        const isActive = idx === currentShowcaseIndex;
        dot.classList.toggle('active', isActive);
        
        const img = dot.querySelector('img');
        if (img) {
          // Counter-rotate the inner image so food stays upright as the circle spins
          const dotStaticAngle = idx * stepAngle;
          const imgCounterAngle = -(orbitRotationAngle + dotStaticAngle);
          img.style.transform = `rotate(${imgCounterAngle}deg)`;
        }
      });
    }

    // Floating leaves subtle pulse
    const leaves = document.querySelectorAll('.floating-leaf');
    leaves.forEach(leaf => {
      leaf.classList.add('leaf-flutter');
      setTimeout(() => leaf.classList.remove('leaf-flutter'), 600);
    });
  }

  // ==================== SEARCH & DIETARY EVENTS ====================
  function bindEvents() {
    // Search input
    const searchInput = document.getElementById('menu-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim();
        renderMenuList();
      });
    }

    // Clear search button
    const clearSearchBtn = document.getElementById('menu-clear-search-btn');
    if (clearSearchBtn) {
      clearSearchBtn.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        searchQuery = '';
        renderMenuList();
      });
    }

    // Vegetarian toggle
    const vegCheckbox = document.getElementById('filter-veg-checkbox');
    if (vegCheckbox) {
      vegCheckbox.addEventListener('change', (e) => {
        vegOnly = e.target.checked;
        renderMenuList();
      });
    }

    // Gluten Free toggle
    const gfCheckbox = document.getElementById('filter-gf-checkbox');
    if (gfCheckbox) {
      gfCheckbox.addEventListener('change', (e) => {
        gfOnly = e.target.checked;
        renderMenuList();
      });
    }

    // Modal close triggers
    const modalCloseBtn = document.getElementById('dish-modal-close');
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeDishModal);

    const modalOverlay = document.getElementById('dish-modal-overlay');
    if (modalOverlay) modalOverlay.addEventListener('click', closeDishModal);

    const modalAddBtn = document.getElementById('modal-add-to-cart-btn');
    if (modalAddBtn) modalAddBtn.addEventListener('click', handleModalAddToCart);

    const modalMinus = document.getElementById('modal-qty-minus');
    if (modalMinus) modalMinus.addEventListener('click', () => updateModalQty(-1));

    const modalPlus = document.getElementById('modal-qty-plus');
    if (modalPlus) modalPlus.addEventListener('click', () => updateModalQty(1));

    // Reset filters button in empty state
    const resetFiltersBtn = document.getElementById('menu-reset-filters-btn');
    if (resetFiltersBtn) {
      resetFiltersBtn.addEventListener('click', () => {
        activeCategory = 'all';
        searchQuery = '';
        vegOnly = false;
        gfOnly = false;
        if (searchInput) searchInput.value = '';
        if (vegCheckbox) vegCheckbox.checked = false;
        if (gfCheckbox) gfCheckbox.checked = false;
        renderCategoryPills();
        renderMenuList();
      });
    }
  }

  return {
    init,
    setCategory,
    openDishModal,
    closeDishModal,
    updateModalAddOn,
    updateModalQty,
    handleQuickAdd,
    selectShowcaseIndex,
    advanceShowcase,
    toggleShowcaseAutoPlay
  };
})();

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  MenuApp.init();
});

