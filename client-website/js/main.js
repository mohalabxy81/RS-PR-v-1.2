/* ============================================================
   REIS Real Estate — main.js
   Shared logic: Navbar, scroll animations, back-to-top,
   active nav links, toast notifications, data store
   ============================================================
   NOTE FOR DASHBOARD INTEGRATION:
   - All property/agent/blog data is stored in window.REIS_DATA
   - Replace these arrays with fetch() calls to your backend API
   - The render functions accept the same array format
   ============================================================ */

'use strict';

/* =========================================================
   DATA STORE
   Replace with API calls from your Agent/Admin dashboard
   ========================================================= */
window.REIS_DATA = {

  properties: [
    {
      id: 'p001',
      title: 'The Grandview Villa',
      address: '142 Sunset Ridge, Beverly Hills, CA',
      price: 4850000,
      type: 'Villa',
      status: 'For Sale',
      beds: 5, baths: 4, sqft: 6200,
      image: 'assets/images/property1.png',
      featured: true,
      location: 'Beverly Hills',
      agent: 'a001'
    },
    {
      id: 'p002',
      title: 'Skyline Penthouse Suite',
      address: '88 City Tower, Manhattan, NY',
      price: 3200000,
      type: 'Apartment',
      status: 'For Sale',
      beds: 3, baths: 3, sqft: 3800,
      image: 'assets/images/property2.png',
      featured: true,
      location: 'Manhattan',
      agent: 'a002'
    },
    {
      id: 'p003',
      title: 'Coastal Retreat Home',
      address: '33 Ocean Drive, Malibu, CA',
      price: 5600000,
      type: 'House',
      status: 'For Sale',
      beds: 4, baths: 5, sqft: 5100,
      image: 'assets/images/property3.png',
      featured: true,
      location: 'Malibu',
      agent: 'a001'
    },
    {
      id: 'p004',
      title: 'Park View Townhouse',
      address: '21 Green Park Ave, Chicago, IL',
      price: 1800000,
      type: 'Townhouse',
      status: 'For Rent',
      beds: 3, baths: 2, sqft: 2400,
      image: 'assets/images/property1.png',
      featured: false,
      location: 'Chicago',
      agent: 'a003'
    },
    {
      id: 'p005',
      title: 'Downtown Luxury Loft',
      address: '55 Arts District, Los Angeles, CA',
      price: 2100000,
      type: 'Apartment',
      status: 'For Sale',
      beds: 2, baths: 2, sqft: 2000,
      image: 'assets/images/property2.png',
      featured: false,
      location: 'Los Angeles',
      agent: 'a002'
    },
    {
      id: 'p006',
      title: 'Garden Estate Manor',
      address: '7 Rosewood Lane, Miami, FL',
      price: 6900000,
      type: 'Villa',
      status: 'For Sale',
      beds: 6, baths: 6, sqft: 8500,
      image: 'assets/images/property3.png',
      featured: false,
      location: 'Miami',
      agent: 'a003'
    }
  ],

  agents: [
    {
      id: 'a001',
      name: 'Victoria Sterling',
      title: 'Senior Luxury Specialist',
      phone: '+1 (310) 555-0192',
      emailObfuscated: 'victoria.sterling',
      domain: 'reis-realty.com',
      listings: 47,
      sales: 38,
      image: 'assets/images/agent1.png',
      specialties: ['Villa', 'Luxury']
    },
    {
      id: 'a002',
      name: 'Marcus Reid',
      title: 'Urban Property Expert',
      phone: '+1 (212) 555-0847',
      emailObfuscated: 'marcus.reid',
      domain: 'reis-realty.com',
      listings: 62,
      sales: 51,
      image: 'assets/images/agent2.png',
      specialties: ['Apartment', 'Penthouse']
    },
    {
      id: 'a003',
      name: 'Sophia Laurent',
      title: 'Residential & Investment',
      phone: '+1 (305) 555-0374',
      emailObfuscated: 'sophia.laurent',
      domain: 'reis-realty.com',
      listings: 35,
      sales: 29,
      image: 'assets/images/agent3.png',
      specialties: ['House', 'Townhouse']
    },
    {
      id: 'a004',
      name: 'Daniel Ashworth',
      title: 'Commercial & Residential',
      phone: '+1 (415) 555-0618',
      emailObfuscated: 'daniel.ashworth',
      domain: 'reis-realty.com',
      listings: 28,
      sales: 23,
      image: 'assets/images/agent1.png',
      specialties: ['Commercial', 'Office']
    }
  ],

  blogPosts: [
    {
      id: 'b001',
      title: '10 Tips for First-Time Luxury Home Buyers',
      category: 'Buying Tips',
      date: 'June 8, 2026',
      excerpt: 'Navigating the luxury market requires a different approach. Here are expert strategies to find and secure your ideal property without overpaying.',
      image: 'assets/images/blog1.png',
      readTime: '5 min read'
    },
    {
      id: 'b002',
      title: 'Market Report: Coastal Properties See 18% Value Surge',
      category: 'Market Trends',
      date: 'June 3, 2026',
      excerpt: 'Beachfront and waterfront properties continue to outperform the broader market. We break down the forces behind the surge.',
      image: 'assets/images/blog2.png',
      readTime: '7 min read'
    },
    {
      id: 'b003',
      title: 'How Smart Home Technology Boosts Property Value',
      category: 'Home Improvement',
      date: 'May 27, 2026',
      excerpt: 'From automated security to energy management systems, smart tech investments can increase resale value by up to 15%.',
      image: 'assets/images/blog3.png',
      readTime: '4 min read'
    }
  ],

  stats: {
    properties: 1240,
    clients: 3800,
    agents: 48,
    years: 15
  }
};

/* =========================================================
   NAVBAR
   ========================================================= */
function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const hamburger = document.querySelector('.nav-hamburger');
  const navMenu  = document.querySelector('.nav-menu');
  const isTransparent = navbar && navbar.classList.contains('transparent');

  if (!navbar) return;

  // Scroll state
  function updateNavbar() {
    if (isTransparent) {
      if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
  }
  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  // Hamburger
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });
    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target)) {
        navMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
    // Close on nav link click
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Active link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* =========================================================
   SCROLL REVEAL
   ========================================================= */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
}

/* =========================================================
   COUNTER ANIMATION
   ========================================================= */
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'), 10);
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;

  const update = () => {
    current = Math.min(current + step, target);
    // Use textContent (safe — no user data)
    el.textContent = Math.floor(current).toLocaleString();
    if (current < target) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

/* =========================================================
   BACK TO TOP
   ========================================================= */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* =========================================================
   TABS
   ========================================================= */
function initTabs(containerSelector) {
  document.querySelectorAll(containerSelector || '.tabs-wrapper').forEach(wrapper => {
    const btns   = wrapper.querySelectorAll('.tab-btn');
    const panels = wrapper.querySelectorAll('.tab-panel');

    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-tab');
        btns.forEach(b => b.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        const panel = wrapper.querySelector('#' + target);
        if (panel) panel.classList.add('active');
      });
    });
  });
}

/* =========================================================
   WISHLIST TOGGLE
   ========================================================= */
function initWishlists() {
  document.querySelectorAll('.property-card__wishlist').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      btn.classList.toggle('active');
      // NOTE: persist to backend on integration
      const label = btn.classList.contains('active') ? 'Saved to wishlist' : 'Removed from wishlist';
      showToast(label);
    });
  });
}

/* =========================================================
   TOAST NOTIFICATION (safe — uses textContent only)
   ========================================================= */
function showToast(message, type) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast' + (type ? ' ' + type : '');

  const icon = document.createElement('span');
  icon.textContent = type === 'success' ? '✓' : type === 'error' ? '✗' : '✦';

  const text = document.createElement('span');
  text.textContent = message; // Safe: textContent only

  toast.appendChild(icon);
  toast.appendChild(text);
  container.appendChild(toast);

  setTimeout(() => toast.remove(), 3500);
}
window.showToast = showToast;

/* =========================================================
   PROPERTY CARD RENDERER (safe DOM construction)
   ========================================================= */
function renderPropertyCard(prop) {
  const card = document.createElement('article');
  card.className = 'property-card reveal';
  card.setAttribute('data-type', prop.type);
  card.setAttribute('data-location', prop.location);
  card.setAttribute('data-price', prop.price);
  card.setAttribute('data-status', prop.status);

  // Image wrapper
  const imgWrap = document.createElement('div');
  imgWrap.className = 'property-card__img';

  const img = document.createElement('img');
  img.src = prop.image;
  img.alt = prop.title + ' - ' + prop.address;
  img.loading = 'lazy';

  const badgesDiv = document.createElement('div');
  badgesDiv.className = 'property-card__badges';

  const statusBadge = document.createElement('span');
  statusBadge.className = 'badge ' + (prop.status === 'For Rent' ? 'badge-navy' : 'badge-gold');
  statusBadge.textContent = prop.status;

  const typeBadge = document.createElement('span');
  typeBadge.className = 'badge badge-navy';
  typeBadge.textContent = prop.type;

  badgesDiv.appendChild(statusBadge);
  badgesDiv.appendChild(typeBadge);

  const wishlistBtn = document.createElement('button');
  wishlistBtn.className = 'property-card__wishlist';
  wishlistBtn.setAttribute('aria-label', 'Save to wishlist');
  wishlistBtn.textContent = '♥';

  imgWrap.appendChild(img);
  imgWrap.appendChild(badgesDiv);
  imgWrap.appendChild(wishlistBtn);

  // Body
  const body = document.createElement('div');
  body.className = 'property-card__body';

  const price = document.createElement('p');
  price.className = 'property-card__price';
  price.textContent = '$' + prop.price.toLocaleString();

  const title = document.createElement('h3');
  title.className = 'property-card__title';
  title.textContent = prop.title;

  const address = document.createElement('p');
  address.className = 'property-card__address';
  address.textContent = '📍 ' + prop.address;

  const divider = document.createElement('div');
  divider.className = 'property-card__divider';

  const features = document.createElement('div');
  features.className = 'property-card__features';

  [
    { icon: '🛏', val: prop.beds + ' Beds' },
    { icon: '🚿', val: prop.baths + ' Baths' },
    { icon: '📐', val: prop.sqft.toLocaleString() + ' sqft' }
  ].forEach(f => {
    const feat = document.createElement('span');
    feat.className = 'property-card__feature';
    feat.textContent = f.icon + ' ' + f.val;
    features.appendChild(feat);
  });

  body.appendChild(price);
  body.appendChild(title);
  body.appendChild(address);
  body.appendChild(divider);
  body.appendChild(features);

  card.appendChild(imgWrap);
  card.appendChild(body);

  // Wishlist click handler
  wishlistBtn.addEventListener('click', (e) => {
    e.preventDefault();
    wishlistBtn.classList.toggle('active');
    const msg = wishlistBtn.classList.contains('active') ? 'Saved to wishlist' : 'Removed from wishlist';
    showToast(msg);
  });

  return card;
}
window.renderPropertyCard = renderPropertyCard;

/* =========================================================
   INIT
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollReveal();
  initCounters();
  initBackToTop();
  initTabs();
  initWishlists();
});
