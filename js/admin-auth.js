/**
 * EMBER & OAK — Modern Dining
 * Admin Authentication & Session Management
 * 
 * IMPORTANT SECURITY LIMITATION:
 * Client-side JavaScript authentication is a demonstration simulation for static hosting.
 * It does not replace a secure backend with server-side validation and signed HTTP-only cookies.
 */

const AdminAuth = (function() {
  const SESSION_KEY = 'eo_admin_session';
  const DEMO_CREDENTIALS = {
    email: 'admin@emberandoak.com',
    password: 'ember123',
    name: 'Executive Chef Vance',
    role: 'General Manager'
  };

  function getSession() {
    try {
      const data = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  function isAuthenticated() {
    const session = getSession();
    return !!(session && session.isAuthenticated);
  }

  function requireAuth() {
    const pathname = (window.location.pathname || '').replace(/\/+$/, '');
    const isLoginPage = /(?:^|\/)(?:admin\/)?login(?:\.html)?$/.test(pathname) || pathname.endsWith('/login');
    const isAdminIndexPage = /(?:^|\/)(?:admin\/)?index(?:\.html)?$/.test(pathname) || pathname.endsWith('/admin');

    if (!isAuthenticated() && !isLoginPage) {
      window.location.href = isAdminIndexPage ? './login.html' : 'login.html';
    } else if (isAuthenticated() && isLoginPage) {
      window.location.href = './index.html';
    }
  }

  function login(email, password, remember = false) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const cleanEmail = (email || '').trim().toLowerCase();
        // Allow demo credentials or any demo email with password 'ember123'
        if ((cleanEmail === DEMO_CREDENTIALS.email || cleanEmail.includes('@')) && password === DEMO_CREDENTIALS.password) {
          const sessionData = {
            isAuthenticated: true,
            email: cleanEmail,
            name: cleanEmail === DEMO_CREDENTIALS.email ? DEMO_CREDENTIALS.name : cleanEmail.split('@')[0],
            role: DEMO_CREDENTIALS.role,
            loginTime: new Date().toISOString()
          };
          if (remember) {
            localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
          } else {
            sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
          }
          resolve(sessionData);
        } else {
          reject(new Error('Invalid credentials. Use demo email: admin@emberandoak.com and password: ember123'));
        }
      }, 400); // Realistic simulated latency
    });
  }

  function logout() {
    try {
      sessionStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(SESSION_KEY);
    } catch(e) {}
    window.location.href = './login.html';
  }

  function initLoginForm() {
    const form = document.getElementById('admin-login-form');
    if (!form) return;

    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');
    const rememberCheckbox = document.getElementById('login-remember');
    const togglePassBtn = document.getElementById('toggle-password-btn');
    const errorAlert = document.getElementById('login-error-alert');
    const submitBtn = document.getElementById('login-submit-btn');

    // Toggle password visibility
    if (togglePassBtn && passwordInput) {
      togglePassBtn.addEventListener('click', () => {
        const isPass = passwordInput.getAttribute('type') === 'password';
        passwordInput.setAttribute('type', isPass ? 'text' : 'password');
        togglePassBtn.textContent = isPass ? '👁️' : '🔒';
      });
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (errorAlert) {
        errorAlert.style.display = 'none';
        errorAlert.textContent = '';
      }

      const email = emailInput ? emailInput.value : '';
      const password = passwordInput ? passwordInput.value : '';
      const remember = rememberCheckbox ? rememberCheckbox.checked : false;

      if (!email || !password) {
        if (errorAlert) {
          errorAlert.textContent = 'Please enter both email and password.';
          errorAlert.style.display = 'block';
        }
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Verifying...</span>';
      }

      try {
        await login(email, password, remember);
        window.location.href = 'index.html';
      } catch (err) {
        if (errorAlert) {
          errorAlert.textContent = err.message || 'Login failed.';
          errorAlert.style.display = 'block';
        }
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span>Sign In to Dashboard</span> <span>→</span>';
        }
      }
    });
  }

  return {
    getSession,
    isAuthenticated,
    requireAuth,
    login,
    logout,
    initLoginForm,
    DEMO_CREDENTIALS
  };
})();

// Automatic check on script load
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    AdminAuth.requireAuth();
    AdminAuth.initLoginForm();
  });
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = AdminAuth;
}

