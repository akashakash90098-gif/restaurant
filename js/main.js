/**
 * EMBER & OAK — Modern Dining
 * Core Website Controller & Cinematic Experience Engine
 * Manages the cinematic walkthrough intro, audio synthesis, navigation, scroll effects, lightbox, and reservation validation.
 */

const App = (function() {
  let isIntroPlaying = false;
  let introTimer = null;
  let currentSceneIndex = 0;
  let audioContext = null;
  let ambientAudioNodes = null;
  let isAudioPlaying = false;
  let isReducedMotion = false;

  const SCENES = [
    {
      id: 'scene-exterior',
      duration: 2200,
      badge: 'PROLOGUE',
      title: 'EMBER & OAK',
      subtitle: 'Modern Dining • Wood-Fired Craft',
      sectionName: 'Architectural Foyer'
    },
    {
      id: 'scene-interior',
      duration: 2000,
      badge: 'ATMOSPHERE',
      title: 'The Grand Sanctuary',
      subtitle: 'Candlelight, Arched Vaults & Timber Warmth',
      sectionName: 'Main Dining Hall'
    },
    {
      id: 'scene-kitchen',
      duration: 2400,
      badge: 'CRAFT',
      title: 'The Woodfire Hearth',
      subtitle: 'Searing Over White Oak at 450°C',
      sectionName: "Chef's Station"
    },
    {
      id: 'scene-dish',
      duration: 2200,
      badge: 'SIGNATURE',
      title: 'The Wagyu Reserve',
      subtitle: 'Melted Cheddar, Truffle Marrow & Brioche',
      sectionName: "Chef's Special"
    }
  ];

  function init() {
    checkReducedMotion();
    setupCinematicIntro();
    setupNavigation();
    setupScrollEffects();
    setupEmberCanvas();
    setupGalleryLightbox();
    setupReservationForm();
    setupNewsletter();
    setupBackToTop();
  }

  // ==================== ACCESSIBILITY ====================
  function checkReducedMotion() {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    isReducedMotion = motionQuery.matches;

    motionQuery.addEventListener('change', (e) => {
      isReducedMotion = e.matches;
      if (isReducedMotion && isIntroPlaying) {
        finishCinematicIntro();
      }
    });

    const toggleBtn = document.getElementById('reduced-motion-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        isReducedMotion = !isReducedMotion;
        document.body.classList.toggle('reduce-motion-active', isReducedMotion);
        toggleBtn.classList.toggle('active', isReducedMotion);
        if (typeof Cart !== 'undefined') {
          Cart.showToast(isReducedMotion ? 'Reduced motion enabled' : 'Smooth cinematic motion restored');
        }
        if (isReducedMotion && isIntroPlaying) finishCinematicIntro();
      });
    }
  }

  // ==================== CINEMATIC INTRO ====================
  function setupCinematicIntro() {
    const introOverlay = document.getElementById('cinematic-intro-overlay');
    if (!introOverlay) return;

    // Check if user already saw intro in current session
    const hasSeen = sessionStorage.getItem('ember_intro_seen');
    if (hasSeen || isReducedMotion) {
      introOverlay.style.display = 'none';
      document.body.classList.remove('intro-active');
      revealHeroContent();
      return;
    }

    // Begin Cinematic Experience
    document.body.classList.add('intro-active');
    isIntroPlaying = true;
    currentSceneIndex = 0;
    playScene(0);

    // Skip Intro Trigger
    const skipBtn = document.getElementById('skip-intro-btn');
    if (skipBtn) {
      skipBtn.addEventListener('click', (e) => {
        e.preventDefault();
        finishCinematicIntro();
      });
    }

    // Audio Mute/Unmute
    const soundBtn = document.getElementById('intro-sound-toggle');
    if (soundBtn) {
      soundBtn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleAmbientAudio();
      });
    }

    // Replay Trigger (can be called from footer)
    window.replayCinematicIntro = function() {
      sessionStorage.removeItem('ember_intro_seen');
      introOverlay.style.display = 'flex';
      introOverlay.style.opacity = '1';
      document.body.classList.add('intro-active');
      isIntroPlaying = true;
      currentSceneIndex = 0;
      playScene(0);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
  }

  function playScene(index) {
    if (!isIntroPlaying) return;

    const scenes = document.querySelectorAll('.cinematic-scene');
    const hudBadge = document.getElementById('intro-hud-badge');
    const hudSection = document.getElementById('intro-hud-section');
    const introVideo = document.getElementById('intro-kitchen-video');
    const progressBar = document.getElementById('intro-progress-fill');

    if (index >= SCENES.length) {
      finishCinematicIntro();
      return;
    }

    currentSceneIndex = index;
    const sceneData = SCENES[index];

    // Update active scene element
    scenes.forEach((sc, i) => {
      sc.classList.toggle('active', i === index);
    });

    // Update HUD
    if (hudBadge) hudBadge.textContent = sceneData.badge;
    if (hudSection) hudSection.textContent = sceneData.sectionName;

    // Update Progress bar
    if (progressBar) {
      const pct = ((index + 1) / SCENES.length) * 100;
      progressBar.style.width = `${pct}%`;
    }

    // Handle video for kitchen scene
    if (sceneData.id === 'scene-kitchen' && introVideo) {
      introVideo.currentTime = 1.5;
      const playPromise = introVideo.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay was blocked, fallback poster is visible automatically
        });
      }
    }

    clearTimeout(introTimer);
    introTimer = setTimeout(() => {
      playScene(index + 1);
    }, sceneData.duration);
  }

  function finishCinematicIntro() {
    if (!isIntroPlaying) return;
    isIntroPlaying = false;
    clearTimeout(introTimer);

    // Stop intro video if playing
    const introVideo = document.getElementById('intro-kitchen-video');
    if (introVideo) {
      try { introVideo.pause(); } catch (_) {}
    }

    // Stop ambient audio gracefully
    stopAmbientAudio();

    const introOverlay = document.getElementById('cinematic-intro-overlay');
    if (introOverlay) {
      introOverlay.classList.add('fade-out');
      setTimeout(() => {
        introOverlay.style.display = 'none';
        document.body.classList.remove('intro-active');
        revealHeroContent();
      }, 700);
    } else {
      document.body.classList.remove('intro-active');
      revealHeroContent();
    }

    sessionStorage.setItem('ember_intro_seen', 'true');
  }

  function revealHeroContent() {
    const heroElements = document.querySelectorAll('.hero-stagger-reveal');
    heroElements.forEach((el, idx) => {
      setTimeout(() => {
        el.classList.add('revealed');
      }, idx * 140);
    });

    const navbar = document.getElementById('main-navbar');
    if (navbar) navbar.classList.add('nav-revealed');
  }

  // ==================== WEB AUDIO API AMBIENCE ====================
  // Generates real, synthesized acoustic crackle & warm room tone with zero audio downloads
  function toggleAmbientAudio() {
    if (isAudioPlaying) {
      stopAmbientAudio();
    } else {
      startAmbientAudio();
    }
  }

  function startAmbientAudio() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioContext) audioContext = new AudioCtx();
      if (audioContext.state === 'suspended') audioContext.resume();

      // Master gain
      const masterGain = audioContext.createGain();
      masterGain.gain.setValueAtTime(0.01, audioContext.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(0.3, audioContext.currentTime + 1.2);
      masterGain.connect(audioContext.destination);

      // Warm hearth hum (Low brownian tone)
      const osc = audioContext.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(95, audioContext.currentTime);

      const filter = audioContext.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(280, audioContext.currentTime);

      const humGain = audioContext.createGain();
      humGain.gain.setValueAtTime(0.15, audioContext.currentTime);

      osc.connect(filter);
      filter.connect(humGain);
      humGain.connect(masterGain);
      osc.start();

      // Soft fire crackle generator (noise bursts)
      const bufferSize = audioContext.sampleRate * 2;
      const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = audioContext.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const crackleFilter = audioContext.createBiquadFilter();
      crackleFilter.type = 'bandpass';
      crackleFilter.frequency.setValueAtTime(1400, audioContext.currentTime);
      crackleFilter.Q.setValueAtTime(3, audioContext.currentTime);

      const crackleGain = audioContext.createGain();
      crackleGain.gain.setValueAtTime(0.04, audioContext.currentTime);

      whiteNoise.connect(crackleFilter);
      crackleFilter.connect(crackleGain);
      crackleGain.connect(masterGain);
      whiteNoise.start();

      ambientAudioNodes = { osc, whiteNoise, masterGain };
      isAudioPlaying = true;

      updateAudioButtonUI(true);
    } catch (e) {
      console.warn('Web Audio ambience failed:', e);
    }
  }

  function stopAmbientAudio() {
    if (ambientAudioNodes && audioContext) {
      try {
        ambientAudioNodes.masterGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.6);
        setTimeout(() => {
          if (ambientAudioNodes) {
            ambientAudioNodes.osc.stop();
            ambientAudioNodes.whiteNoise.stop();
            ambientAudioNodes = null;
          }
        }, 700);
      } catch (_) {}
    }
    isAudioPlaying = false;
    updateAudioButtonUI(false);
  }

  function updateAudioButtonUI(playing) {
    const btn = document.getElementById('intro-sound-toggle');
    if (btn) {
      btn.classList.toggle('active', playing);
      btn.innerHTML = playing ? '<span>Sound ♫ On</span>' : '<span>Sound 🔇 Muted</span>';
    }
  }

  // ==================== NAVIGATION & SCROLL ====================
  function setupNavigation() {
    const navbar = document.getElementById('main-navbar');
    const mobileToggle = document.getElementById('mobile-nav-toggle');
    const mobileDrawer = document.getElementById('mobile-nav-drawer');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

    // Sticky Scroll Handler
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;

      // Add solid glass background when scrolled
      if (navbar) {
        if (scrollY > 70) {
          navbar.classList.add('nav-scrolled');
        } else {
          navbar.classList.remove('nav-scrolled');
        }
      }

      // Scroll spy for active link
      updateActiveSectionSpy();
    }, { passive: true });

    // Mobile Menu Toggle
    if (mobileToggle && mobileDrawer) {
      mobileToggle.addEventListener('click', () => {
        const isOpen = mobileDrawer.classList.toggle('open');
        mobileToggle.classList.toggle('active', isOpen);
        document.body.classList.toggle('mobile-menu-open', isOpen);
        mobileToggle.setAttribute('aria-expanded', isOpen);
      });
    }

    // Smooth anchor navigation
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            // Close mobile menu if open
            if (mobileDrawer && mobileDrawer.classList.contains('open')) {
              mobileDrawer.classList.remove('open');
              if (mobileToggle) mobileToggle.classList.remove('active');
              document.body.classList.remove('mobile-menu-open');
            }

            const headerOffset = 90;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }
      });
    });
  }

  function updateActiveSectionSpy() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 180;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');

      if (scrollPosition >= top && scrollPosition < top + height) {
        document.querySelectorAll('.nav-link').forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }

  // ==================== SCROLL EFFECTS & PROGRESS ====================
  function setupScrollEffects() {
    // Scroll progress bar
    const progressEl = document.getElementById('scroll-progress-indicator');
    window.addEventListener('scroll', () => {
      if (progressEl) {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        const pct = h > 0 ? (window.scrollY / h) * 100 : 0;
        progressEl.style.width = `${pct}%`;
      }
    }, { passive: true });

    // Scroll reveal observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal-on-scroll').forEach(el => {
      observer.observe(el);
    });
  }

  // ==================== EMBER PARTICLES CANVAS ====================
  function setupEmberCanvas() {
    const canvas = document.getElementById('hero-ember-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    const particleCount = 42;

    function resize() {
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    }

    resize();
    window.addEventListener('resize', resize, { passive: true });

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.2 + 0.6,
        alpha: Math.random() * 0.7 + 0.2,
        speedY: -(Math.random() * 0.8 + 0.3),
        speedX: (Math.random() - 0.5) * 0.4,
        hue: Math.random() > 0.4 ? 38 : 22 // Warm amber vs golden flame
      });
    }

    function animate() {
      if (isReducedMotion) return;
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.y += p.speedY;
        p.x += p.speedX;

        // Flicker alpha
        p.alpha += (Math.random() - 0.5) * 0.04;
        if (p.alpha < 0.1) p.alpha = 0.15;
        if (p.alpha > 0.9) p.alpha = 0.85;

        // Reset if drifted past top
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 88%, 56%, ${p.alpha})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = `hsla(${p.hue}, 100%, 50%, 0.6)`;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      requestAnimationFrame(animate);
    }

    animate();
  }

  // ==================== GALLERY LIGHTBOX ====================
  function setupGalleryLightbox() {
    const modal = document.getElementById('gallery-lightbox-modal');
    const modalImg = document.getElementById('lightbox-img');
    const modalCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.getElementById('lightbox-close-btn');
    const prevBtn = document.getElementById('lightbox-prev-btn');
    const nextBtn = document.getElementById('lightbox-next-btn');

    if (!modal || !modalImg) return;

    let galleryItems = [];
    let currentIndex = 0;

    document.querySelectorAll('.gallery-grid-item').forEach((item, idx) => {
      const img = item.querySelector('img');
      const caption = item.getAttribute('data-caption') || (img ? img.alt : '');
      galleryItems.push({
        src: img ? img.src : '',
        caption
      });

      item.addEventListener('click', () => {
        openLightbox(idx);
      });
    });

    function openLightbox(idx) {
      currentIndex = idx;
      updateLightboxContent();
      modal.classList.add('open');
      document.body.classList.add('lightbox-open-noscroll');
    }

    function updateLightboxContent() {
      const cur = galleryItems[currentIndex];
      if (!cur) return;
      modalImg.src = cur.src;
      if (modalCaption) modalCaption.textContent = cur.caption;
    }

    function closeLightbox() {
      modal.classList.remove('open');
      document.body.classList.remove('lightbox-open-noscroll');
    }

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeLightbox();
    });

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
        updateLightboxContent();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex + 1) % galleryItems.length;
        updateLightboxContent();
      });
    }

    document.addEventListener('keydown', (e) => {
      if (!modal.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft' && prevBtn) prevBtn.click();
      if (e.key === 'ArrowRight' && nextBtn) nextBtn.click();
    });
  }

  // ==================== RESERVATIONS FORM ====================
  function setupReservationForm() {
    const form = document.getElementById('reservation-form');
    if (!form) return;

    // Set minimum date to today
    const dateInput = document.getElementById('res-date');
    if (dateInput) {
      const today = new Date().toISOString().split('T')[0];
      dateInput.min = today;
      dateInput.value = today;
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('res-name')?.value.trim();
      const email = document.getElementById('res-email')?.value.trim();
      const phone = document.getElementById('res-phone')?.value.trim();
      const date = document.getElementById('res-date')?.value;
      const time = document.getElementById('res-time')?.value;
      const guests = document.getElementById('res-guests')?.value;
      const seating = document.getElementById('res-seating')?.value;
      const notes = document.getElementById('res-notes')?.value.trim();

      // Client validation
      if (!name || !email || !phone || !date || !time || !guests) {
        if (typeof Cart !== 'undefined') {
          Cart.showToast('Please fill in all required reservation fields.');
        } else {
          alert('Please fill in all required fields.');
        }
        return;
      }

      // Email format check
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        if (typeof Cart !== 'undefined') {
          Cart.showToast('Please enter a valid email address.');
        }
        return;
      }

      // Show confirmation modal
      showReservationConfirmation({
        name,
        email,
        phone,
        date,
        time,
        guests,
        seating,
        notes
      });
    });
  }

  function showReservationConfirmation(details) {
    // Save to shared EmberStore so the booking appears on Admin Reservations Dashboard
    if (typeof EmberStore !== 'undefined') {
      try {
        EmberStore.addReservation({
          id: `RES-${Math.floor(200 + Math.random() * 800)}`,
          name: details.name,
          email: details.email,
          phone: details.phone,
          guests: parseInt(details.guests, 10) || 2,
          date: details.date,
          time: details.time,
          status: 'pending',
          specialRequests: details.notes ? `${details.notes} (${details.seating || 'Standard'})` : `${details.seating || 'Standard'} seating.`
        });
      } catch(e) {}
    }

    const modal = document.getElementById('reservation-demo-modal');
    const contentEl = document.getElementById('res-confirmation-details');
    if (!modal || !contentEl) return;

    contentEl.innerHTML = `
      <div class="res-confirm-card">
        <div class="res-confirm-header">
          <span class="res-gold-star">✨</span>
          <h4>Priority Table Request Validated</h4>
        </div>
        <div class="res-confirm-meta">
          <div class="res-confirm-row"><span>Guest Name:</span> <strong>${details.name}</strong></div>
          <div class="res-confirm-row"><span>Party Size:</span> <strong>${details.guests} Guests</strong></div>
          <div class="res-confirm-row"><span>Date & Time:</span> <strong>${details.date} at ${details.time}</strong></div>
          <div class="res-confirm-row"><span>Seating:</span> <strong>${details.seating}</strong></div>
          <div class="res-confirm-row"><span>Contact:</span> <strong>${details.email} • ${details.phone}</strong></div>
          ${details.notes ? `<div class="res-confirm-row"><span>Special Requests:</span> <em>"${details.notes}"</em></div>` : ''}
        </div>
        <div class="res-backend-disclaimer">
          <div class="disclaimer-badge">Frontend Architecture Notice</div>
          <p>This reservation form has undergone complete client-side validation. In a production environment, this payload connects directly to your reservation engine (OpenTable, SevenRooms, Resy, or custom Postgres/Node API).</p>
        </div>
      </div>
    `;

    modal.classList.add('open');
    document.body.classList.add('modal-open-noscroll');

    const closeBtn = document.getElementById('res-modal-close-btn');
    if (closeBtn) {
      closeBtn.onclick = () => {
        modal.classList.remove('open');
        document.body.classList.remove('modal-open-noscroll');
        const form = document.getElementById('reservation-form');
        if (form) form.reset();
        if (typeof Cart !== 'undefined') {
          Cart.showToast('Reservation demonstration complete.');
        }
      };
    }
  }

  // ==================== NEWSLETTER ====================
  function setupNewsletter() {
    const form = document.getElementById('newsletter-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      if (input && input.value) {
        input.value = '';
        if (typeof Cart !== 'undefined') {
          Cart.showToast('Welcome to the Ember & Oak Private Dining Circle.');
        }
      }
    });
  }

  // ==================== BACK TO TOP ====================
  function setupBackToTop() {
    const btn = document.getElementById('back-to-top-btn');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  return {
    init,
    finishCinematicIntro
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

