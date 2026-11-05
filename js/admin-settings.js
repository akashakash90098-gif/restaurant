/**
 * EMBER & OAK — Modern Dining
 * Admin Website Content & Settings Management
 */

const AdminSettings = (function() {
  let settings = {};

  function init() {
    loadSettings();
    populateForm();
    bindEvents();
    updateLivePreview();
  }

  function loadSettings() {
    settings = typeof EmberStore !== 'undefined' ? EmberStore.getSettings() : MENU_CONFIG;
  }

  function populateForm() {
    const fields = [
      { id: 'settings-name', key: 'restaurantName', fallback: 'EMBER & OAK' },
      { id: 'settings-tagline', key: 'tagline', fallback: 'Modern Dining • Wood-Fired Craft' },
      { id: 'settings-currency', key: 'currencySymbol', fallback: '₹' },
      { id: 'settings-tax', key: 'taxRate', fallback: 0.05 },
      { id: 'settings-service', key: 'serviceFeeRate', fallback: 0.05 },
      { id: 'settings-base-url', key: 'productionBaseUrl', fallback: '' },
      { id: 'settings-address', key: 'address', fallback: '428 Hearthstone Way, Historic District' },
      { id: 'settings-phone', key: 'phone', fallback: '+1 (555) 782-9445' },
      { id: 'settings-email', key: 'email', fallback: 'reservations@emberandoak.com' },
      { id: 'settings-hours', key: 'hours', fallback: 'Tue – Sun: 5:00 PM – 11:00 PM (Closed Mondays)' },
      { id: 'settings-hero-headline', key: 'heroHeadline', fallback: 'An Experience Beyond the Ordinary.' },
      { id: 'settings-hero-desc', key: 'heroDescription', fallback: 'Where primordial white oak embers meet refined contemporary gastronomy.' },
      { id: 'settings-hero-img', key: 'heroImage', fallback: 'assets/images/hero-interior.jpg' }
    ];

    fields.forEach(f => {
      const el = document.getElementById(f.id);
      if (el) {
        let val = settings[f.key] !== undefined ? settings[f.key] : f.fallback;
        if (f.key === 'productionBaseUrl' && (!val || (typeof val === 'string' && val.includes('emberandoak.restaurant')))) {
          val = typeof EmberStore !== 'undefined' ? EmberStore.getMenuUrl() : '';
        }
        el.value = val;
      }
    });
  }

  function updateLivePreview() {
    const nameInput = document.getElementById('settings-name');
    const taglineInput = document.getElementById('settings-tagline');
    const heroHeadlineInput = document.getElementById('settings-hero-headline');
    const heroDescInput = document.getElementById('settings-hero-desc');
    const heroImgInput = document.getElementById('settings-hero-img');

    const previewName = document.getElementById('preview-brand-name');
    const previewTagline = document.getElementById('preview-brand-tagline');
    const previewHeadline = document.getElementById('preview-hero-headline');
    const previewDesc = document.getElementById('preview-hero-desc');
    const previewImg = document.getElementById('preview-hero-img');

    if (previewName && nameInput) previewName.textContent = nameInput.value || 'EMBER & OAK';
    if (previewTagline && taglineInput) previewTagline.textContent = taglineInput.value || 'Modern Dining';
    if (previewHeadline && heroHeadlineInput) previewHeadline.textContent = heroHeadlineInput.value || 'An Experience Beyond the Ordinary.';
    if (previewDesc && heroDescInput) previewDesc.textContent = heroDescInput.value || '';
    if (previewImg && heroImgInput) previewImg.src = AdminUI.assetUrl(heroImgInput.value.trim() || 'assets/images/hero-interior.jpg');
  }

  function handleSave(e) {
    e.preventDefault();

    const name = document.getElementById('settings-name').value.trim();
    if (!name) {
      AdminUI.showToast('Restaurant name is required.', 'error');
      return;
    }

    const newSettings = {
      ...settings,
      restaurantName: name,
      tagline: document.getElementById('settings-tagline').value.trim(),
      currencySymbol: document.getElementById('settings-currency').value.trim() || '₹',
      taxRate: parseFloat(document.getElementById('settings-tax').value) || 0.05,
      serviceFeeRate: parseFloat(document.getElementById('settings-service').value) || 0.05,
      productionBaseUrl: document.getElementById('settings-base-url').value.trim(),
      address: document.getElementById('settings-address').value.trim(),
      phone: document.getElementById('settings-phone').value.trim(),
      email: document.getElementById('settings-email').value.trim(),
      hours: document.getElementById('settings-hours').value.trim(),
      heroHeadline: document.getElementById('settings-hero-headline').value.trim(),
      heroDescription: document.getElementById('settings-hero-desc').value.trim(),
      heroImage: document.getElementById('settings-hero-img').value.trim() || 'assets/images/hero-interior.jpg'
    };

    settings = newSettings;
    EmberStore.saveSettings(newSettings);
    updateLivePreview();
    AdminUI.showToast('Website content settings saved! Changes are live on public site in this browser.', 'success');
  }

  function handleReset() {
    AdminUI.confirm(
      'Reset All Restaurant Settings',
      'Are you sure you want to revert all restaurant settings to original factory defaults?',
      () => {
        try {
          localStorage.removeItem('eo_settings');
        } catch(e) {}
        loadSettings();
        populateForm();
        updateLivePreview();
        AdminUI.showToast('Reverted settings to defaults.', 'info');
      }
    );
  }

  function bindEvents() {
    const form = document.getElementById('website-settings-form');
    if (form) form.addEventListener('submit', handleSave);

    const resetBtn = document.getElementById('settings-reset-btn');
    if (resetBtn) resetBtn.addEventListener('click', handleReset);

    // Live preview updates on typing
    const inputs = ['settings-name', 'settings-tagline', 'settings-hero-headline', 'settings-hero-desc', 'settings-hero-img'];
    inputs.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', updateLivePreview);
    });
  }

  return {
    init,
    handleSave,
    handleReset
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('website-settings-form')) {
    AdminSettings.init();
  }
});

if (typeof module !== 'undefined' && module.exports) {
  module.exports = AdminSettings;
}

