/* ============================
   NASHA | نشأة - Main Script
   ============================ */

const WA_NUMBER = '201229534310';
const WA_BASE = `https://wa.me/${WA_NUMBER}`;
const WA_DEFAULT_MSG = 'مرحباً، أريد الاستفسار عن خدمات نشأة لتصميم المواقع';

/* ---- Theme Management ---- */
const ThemeManager = {
  key: 'nasha-theme',

  init() {
    const saved = localStorage.getItem(this.key) || 'dark';
    this.apply(saved);
    document.getElementById('theme-toggle')?.addEventListener('click', () => this.toggle());
    document.getElementById('theme-toggle-mobile')?.addEventListener('click', () => this.toggle());
  },

  apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(this.key, theme);
    const emoji = theme === 'dark' ? '☀️' : '🌙';
    document.querySelectorAll('.toggle-icon').forEach(el => el.textContent = emoji);
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
      if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 20);
      this.updateProgress();
    });

    hamburger?.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu?.classList.toggle('open');
    });

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
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === page || (page === '' && href === 'index.html') || (page === 'index.html' && href === 'index.html')) {
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
      { threshold: 0.1 }
    );
    document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
  }
};

/* ---- Page Loader + Logo Animation ---- */
const PageLoader = {
  init() {
    const loader = document.getElementById('page-loader');
    if (!loader) return;
    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('hidden');
        document.querySelectorAll('.logo-animated').forEach(el => el.classList.add('logo-visible'));
      }, 500);
    });
    // Fallback in case load already fired
    if (document.readyState === 'complete') {
      setTimeout(() => {
        loader.classList.add('hidden');
        document.querySelectorAll('.logo-animated').forEach(el => el.classList.add('logo-visible'));
      }, 500);
    }
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
      const msg = el.dataset.wa || WA_DEFAULT_MSG;
      el.href = `${WA_BASE}?text=${encodeURIComponent(msg)}`;
    });
    const floatBtn = document.getElementById('float-wa');
    if (floatBtn) {
      floatBtn.href = `${WA_BASE}?text=${encodeURIComponent(WA_DEFAULT_MSG)}`;
    }
  }
};

/* ---- Back to Top ---- */
const BackToTop = {
  init() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;
    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 400);
    });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }
};

/* ---- Portfolio Filter ---- */
const PortfolioFilter = {
  init() {
    const btns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.portfolio-card');
    if (!btns.length) return;

    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active-filter'));
        btn.classList.add('active-filter');
        const cat = btn.dataset.filter;

        cards.forEach(card => {
          const cardCat = card.dataset.category || '';
          const show = cat === 'all' || cardCat.includes(cat);
          card.style.transition = 'opacity 0.3s, transform 0.3s';
          if (show) {
            card.style.display = '';
            setTimeout(() => { card.style.opacity = '1'; card.style.transform = ''; }, 10);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.95)';
            setTimeout(() => { card.style.display = 'none'; }, 320);
          }
        });
      });
    });
  }
};

/* ---- Init ---- */
document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  Navbar.init();
  AnimationObserver.init();
  CounterAnimator.init();
  WhatsApp.init();
  BackToTop.init();
  PortfolioFilter.init();
  PageLoader.init();

  // Trigger logo animation shortly after DOM ready
  setTimeout(() => {
    document.querySelectorAll('.logo-animated').forEach(el => el.classList.add('logo-visible'));
  }, 200);
});
