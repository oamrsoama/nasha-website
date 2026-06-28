/* ============================
   NASHA | نشأة - Main Script
   ============================ */

const WA_NUMBER = '201000000000';
const WA_BASE = `https://wa.me/${WA_NUMBER}`;
const WA_MSG = encodeURIComponent('مرحباً، أريد الاستفسار عن خدمات نشأة لتصميم المواقع');

/* ---- Theme Management ---- */
const ThemeManager = {
  key: 'nasha-theme',

  init() {
    const saved = localStorage.getItem(this.key) || 'light';
    this.apply(saved);
    document.getElementById('theme-toggle')?.addEventListener('click', () => this.toggle());
    document.getElementById('theme-toggle-mobile')?.addEventListener('click', () => this.toggle());
  },

  apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(this.key, theme);
    const icon = document.querySelector('#theme-toggle .toggle-icon');
    const iconM = document.querySelector('#theme-toggle-mobile .toggle-icon');
    const emoji = theme === 'dark' ? '☀️' : '🌙';
    if (icon) icon.textContent = emoji;
    if (iconM) iconM.textContent = emoji;
  },

  toggle() {
    const current = document.documentElement.getAttribute('data-theme');
    this.apply(current === 'dark' ? 'light' : 'dark');
  }
};

/* ---- Navbar ---- */
const Navbar = {
  init() {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');

    window.addEventListener('scroll', () => {
      navbar?.classList.toggle('scrolled', window.scrollY > 20);
      this.updateProgress();
    });

    hamburger?.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu?.classList.toggle('open');
    });

    // Close mobile menu on link click
    mobileMenu?.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger?.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });

    this.setActiveLink();
  },

  setActiveLink() {
    const page = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
      const href = link.getAttribute('href');
      if (href === page || (page === 'index.html' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  },

  updateProgress() {
    const el = document.querySelector('.scroll-progress');
    if (!el) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    el.style.width = pct + '%';
  }
};

/* ---- Scroll Animations ---- */
const AnimationObserver = {
  init() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
  }
};

/* ---- Page Loader ---- */
const PageLoader = {
  init() {
    const loader = document.getElementById('page-loader');
    if (!loader) return;
    window.addEventListener('load', () => {
      setTimeout(() => loader.classList.add('hidden'), 400);
    });
  }
};

/* ---- Counter Animations ---- */
const CounterAnimator = {
  init() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
  },

  animate(el) {
    const target = parseInt(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const start = performance.now();

    const step = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }
};

/* ---- WhatsApp Links ---- */
const WhatsApp = {
  init() {
    document.querySelectorAll('[data-wa]').forEach(el => {
      const msg = el.dataset.wa || 'مرحباً، أريد الاستفسار عن خدمات نشأة';
      el.href = `${WA_BASE}?text=${encodeURIComponent(msg)}`;
    });

    const floatBtn = document.getElementById('float-wa');
    if (floatBtn) {
      floatBtn.href = `${WA_BASE}?text=${WA_MSG}`;
    }
  }
};

/* ---- Init ---- */
document.addEventListener('DOMContentLoaded', () => {
  PageLoader.init();
  ThemeManager.init();
  Navbar.init();
  AnimationObserver.init();
  CounterAnimator.init();
  WhatsApp.init();
});
