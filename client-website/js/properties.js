/* ============================================================
   REIS Real Estate — properties.js
   Filter, sort, search, pagination
   Dashboard Integration Note:
   - Replace window.REIS_DATA.properties with your API fetch
   - buildAgentCard and buildBlogCard are also exported here
     for use on index.html and other pages
   ============================================================ */

'use strict';

/* =========================================================
   AGENT CARD BUILDER (safe DOM construction)
   ========================================================= */
function buildAgentCard(agent) {
  const card = document.createElement('article');
  card.className = 'agent-card';
  card.setAttribute('data-specialty', agent.specialties.join(','));

  const imgWrap = document.createElement('div');
  imgWrap.className = 'agent-card__img-wrap';

  const img = document.createElement('img');
  img.src = agent.image;
  img.alt = agent.name + ', ' + agent.title;
  img.className = 'agent-card__img';
  img.loading = 'lazy';

  const overlay = document.createElement('div');
  overlay.className = 'agent-card__overlay';
  overlay.setAttribute('aria-hidden', 'true');

  const social = document.createElement('div');
  social.className = 'agent-card__social';
  social.setAttribute('aria-hidden', 'true');

  // Safe email obfuscation — never put raw email in href in HTML
  ['f', 'in', '✉'].forEach((icon, idx) => {
    const a = document.createElement('a');
    a.href = '#';
    a.textContent = icon;
    if (idx === 2) {
      // Email shown as obfuscated — never logs email to console
      a.addEventListener('click', (e) => {
        e.preventDefault();
        // TODO(security): Backend should handle email routing securely
        showToast('Contact ' + agent.name + ' via the contact form');
      });
    }
    social.appendChild(a);
  });

  imgWrap.appendChild(img);
  imgWrap.appendChild(overlay);
  imgWrap.appendChild(social);

  const body = document.createElement('div');
  body.className = 'agent-card__body';

  const name = document.createElement('h3');
  name.className = 'agent-card__name';
  name.textContent = agent.name;

  const title = document.createElement('p');
  title.className = 'agent-card__title';
  title.textContent = agent.title;

  const stats = document.createElement('div');
  stats.className = 'agent-card__stats';

  [
    { val: agent.listings, label: 'Listings' },
    { val: agent.sales, label: 'Sales' }
  ].forEach(s => {
    const stat = document.createElement('div');
    const val = document.createElement('div');
    val.className = 'agent-card__stat-value';
    val.textContent = s.val;
    const lbl = document.createElement('div');
    lbl.className = 'agent-card__stat-label';
    lbl.textContent = s.label;
    stat.appendChild(val);
    stat.appendChild(lbl);
    stats.appendChild(stat);
  });

  body.appendChild(name);
  body.appendChild(title);
  body.appendChild(stats);
  card.appendChild(imgWrap);
  card.appendChild(body);
  return card;
}
window.buildAgentCard = buildAgentCard;

/* =========================================================
   BLOG CARD BUILDER (safe DOM construction)
   ========================================================= */
function buildBlogCard(post) {
  const card = document.createElement('article');
  card.className = 'blog-card';

  const imgWrap = document.createElement('div');
  imgWrap.className = 'blog-card__img';
  const img = document.createElement('img');
  img.src = post.image;
  img.alt = post.title;
  img.loading = 'lazy';
  imgWrap.appendChild(img);

  const body = document.createElement('div');
  body.className = 'blog-card__body';

  const meta = document.createElement('div');
  meta.className = 'blog-card__meta';

  const cat = document.createElement('span');
  cat.className = 'badge badge-gold';
  cat.textContent = post.category;

  const dot = document.createElement('span');
  dot.className = 'blog-card__meta-dot';
  dot.setAttribute('aria-hidden', 'true');

  const date = document.createElement('span');
  date.textContent = post.date;

  const dot2 = document.createElement('span');
  dot2.className = 'blog-card__meta-dot';
  dot2.setAttribute('aria-hidden', 'true');

  const rt = document.createElement('span');
  rt.textContent = post.readTime;

  meta.appendChild(cat);
  meta.appendChild(dot);
  meta.appendChild(date);
  meta.appendChild(dot2);
  meta.appendChild(rt);

  const title = document.createElement('h3');
  title.className = 'blog-card__title';
  title.textContent = post.title;

  const excerpt = document.createElement('p');
  excerpt.className = 'blog-card__excerpt';
  excerpt.textContent = post.excerpt;

  const link = document.createElement('a');
  link.className = 'blog-card__link';
  link.href = 'blog.html';
  link.textContent = 'Read More →';

  body.appendChild(meta);
  body.appendChild(title);
  body.appendChild(excerpt);
  body.appendChild(link);

  card.appendChild(imgWrap);
  card.appendChild(body);
  return card;
}
window.buildBlogCard = buildBlogCard;

/* =========================================================
   PROPERTIES PAGE — Filter & Sort Engine
   ========================================================= */
function initPropertiesPage() {
  const grid = document.getElementById('properties-grid');
  if (!grid) return;

  const data = window.REIS_DATA;
  if (!data) return;

  let filtered = [...data.properties];
  let currentPage = 1;
  const perPage = 6;

  // Filter state
  const filters = {
    type: '',
    status: '',
    location: '',
    minPrice: 0,
    maxPrice: Infinity,
    minBeds: 0,
    minBaths: 0
  };

  // Render cards
  function renderGrid() {
    grid.replaceChildren(); // Safe clear
    const start = (currentPage - 1) * perPage;
    const page  = filtered.slice(start, start + perPage);

    if (page.length === 0) {
      const msg = document.createElement('p');
      msg.className = 'text-muted text-center';
      msg.style.gridColumn = '1/-1';
      msg.textContent = 'No properties found matching your criteria.';
      grid.appendChild(msg);
    } else {
      page.forEach((prop, i) => {
        const card = renderPropertyCard(prop);
        card.classList.add('reveal-delay-' + (i % 4));
        grid.appendChild(card);
      });
    }

    // Update count
    const countEl = document.getElementById('properties-count');
    if (countEl) {
      const strong = document.createElement('strong');
      strong.textContent = filtered.length;
      countEl.replaceChildren();
      countEl.appendChild(strong);
      const rest = document.createTextNode(' properties found');
      countEl.appendChild(rest);
    }

    renderPagination();
    // Re-init scroll reveal for new cards
    document.querySelectorAll('.reveal:not(.revealed)').forEach(el => {
      el.classList.add('revealed');
    });
  }

  function applyFilters() {
    filtered = data.properties.filter(p => {
      if (filters.type   && p.type   !== filters.type)   return false;
      if (filters.status && p.status !== filters.status) return false;
      if (filters.location && p.location !== filters.location) return false;
      if (p.price < filters.minPrice)  return false;
      if (p.price > filters.maxPrice)  return false;
      if (p.beds  < filters.minBeds)   return false;
      if (p.baths < filters.minBaths)  return false;
      return true;
    });
    currentPage = 1;
    renderGrid();
  }

  function renderPagination() {
    const pag = document.getElementById('properties-pagination');
    if (!pag) return;
    const totalPages = Math.ceil(filtered.length / perPage);
    pag.replaceChildren();

    if (totalPages <= 1) return;

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement('button');
      btn.className = 'pagination__btn' + (i === currentPage ? ' active' : '');
      btn.textContent = i;
      btn.setAttribute('aria-label', 'Page ' + i);
      btn.addEventListener('click', () => {
        currentPage = i;
        renderGrid();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
      pag.appendChild(btn);
    }
  }

  // Filter chip events
  document.querySelectorAll('.filter-chip[data-filter]').forEach(chip => {
    chip.addEventListener('click', () => {
      const filterKey  = chip.getAttribute('data-filter');
      const filterVal  = chip.getAttribute('data-value');
      const parentChips = chip.closest('.filter-chips');

      // Toggle siblings
      if (parentChips) {
        parentChips.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      }
      chip.classList.toggle('active');

      const isActive = chip.classList.contains('active');
      if (filterKey === 'type')     filters.type     = isActive ? filterVal : '';
      if (filterKey === 'status')   filters.status   = isActive ? filterVal : '';
      if (filterKey === 'location') filters.location = isActive ? filterVal : '';
      if (filterKey === 'beds')     filters.minBeds  = isActive ? parseInt(filterVal, 10) : 0;
      if (filterKey === 'baths')    filters.minBaths = isActive ? parseInt(filterVal, 10) : 0;

      applyFilters();
    });
  });

  // Price range
  const priceRange = document.getElementById('price-range');
  const priceMax   = document.getElementById('price-max-display');
  if (priceRange) {
    priceRange.addEventListener('input', () => {
      const val = parseInt(priceRange.value, 10);
      if (priceMax) priceMax.textContent = '$' + (val / 1000000).toFixed(1) + 'M';
      filters.maxPrice = val;
      applyFilters();
    });
  }

  // Sort
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      const val = sortSelect.value;
      if (val === 'price-asc')  filtered.sort((a,b) => a.price - b.price);
      if (val === 'price-desc') filtered.sort((a,b) => b.price - a.price);
      if (val === 'newest')     filtered.sort((a,b) => a.id < b.id ? 1 : -1);
      renderGrid();
    });
  }

  // Reset filters
  const resetBtn = document.getElementById('reset-filters');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      Object.keys(filters).forEach(k => {
        filters[k] = k.includes('max') ? Infinity : 0;
        if (k === 'type' || k === 'status' || k === 'location') filters[k] = '';
      });
      document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      if (priceRange) { priceRange.value = priceRange.max; }
      if (priceMax) priceMax.textContent = '$10M+';
      applyFilters();
    });
  }

  renderGrid();
}

/* =========================================================
   SEARCH PAGE — live filter
   ========================================================= */
function initSearchPage() {
  const resultsGrid = document.getElementById('search-results-grid');
  if (!resultsGrid) return;

  const data = window.REIS_DATA;
  if (!data) return;

  // Parse URL params
  const params = new URLSearchParams(window.location.search);
  const urlLocation = params.get('location') || '';
  const urlType     = params.get('type') || '';

  // Pre-fill form
  const locInput  = document.getElementById('search-location-input');
  const typeSelect= document.getElementById('search-type-input');
  if (locInput  && urlLocation) locInput.value  = urlLocation;
  if (typeSelect && urlType)    typeSelect.value = urlType;

  let filtered = [...data.properties];

  function runSearch() {
    const loc   = (locInput  ? locInput.value.trim().toLowerCase()  : '');
    const type  = (typeSelect ? typeSelect.value : '');
    const kw    = document.getElementById('search-keyword-input');
    const kwVal = kw ? kw.value.trim().toLowerCase() : '';
    const minP  = document.getElementById('search-min-price');
    const maxP  = document.getElementById('search-max-price');
    const beds  = document.getElementById('search-beds-input');
    const baths = document.getElementById('search-baths-input');

    filtered = data.properties.filter(p => {
      if (loc  && !p.location.toLowerCase().includes(loc)  &&
                  !p.address.toLowerCase().includes(loc))  return false;
      if (type && p.type !== type) return false;
      if (kwVal && !p.title.toLowerCase().includes(kwVal) &&
                   !p.address.toLowerCase().includes(kwVal)) return false;
      if (minP && minP.value && p.price < parseInt(minP.value, 10)) return false;
      if (maxP && maxP.value && p.price > parseInt(maxP.value, 10)) return false;
      if (beds  && beds.value  && p.beds  < parseInt(beds.value,  10)) return false;
      if (baths && baths.value && p.baths < parseInt(baths.value, 10)) return false;
      return true;
    });

    renderResults();
  }

  function renderResults() {
    resultsGrid.replaceChildren();

    const count = document.getElementById('search-results-count');
    if (count) {
      const strong = document.createElement('strong');
      strong.textContent = filtered.length;
      count.replaceChildren(strong);
      count.appendChild(document.createTextNode(' Results Found'));
    }

    filtered.forEach((prop, i) => {
      const card = renderPropertyCard(prop);
      card.classList.add('reveal', 'reveal-delay-' + (i % 4));
      resultsGrid.appendChild(card);
    });

    if (filtered.length === 0) {
      const msg = document.createElement('p');
      msg.className = 'text-muted text-center';
      msg.style.gridColumn = '1/-1';
      msg.textContent = 'No properties match your search. Try adjusting your filters.';
      resultsGrid.appendChild(msg);
    }

    document.querySelectorAll('.reveal:not(.revealed)').forEach(el => el.classList.add('revealed'));
  }

  // Form submit
  const searchForm = document.getElementById('search-form');
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      runSearch();
    });
  }

  // Advanced toggle
  const advToggle = document.getElementById('advanced-toggle');
  const advGrid   = document.getElementById('advanced-grid');
  if (advToggle && advGrid) {
    advToggle.addEventListener('click', () => {
      advGrid.classList.toggle('open');
      advToggle.textContent = advGrid.classList.contains('open')
        ? '▲ Hide Advanced Filters'
        : '▼ Advanced Filters';
    });
  }

  runSearch();
}

/* =========================================================
   GALLERY LIGHTBOX
   ========================================================= */
function initGallery() {
  const items = document.querySelectorAll('.gallery-item');
  if (!items.length) return;

  const lightbox   = document.getElementById('lightbox');
  const lbImg      = document.getElementById('lightbox-img');
  const lbCaption  = document.getElementById('lightbox-caption');
  const lbClose    = document.getElementById('lightbox-close');
  const lbPrev     = document.getElementById('lightbox-prev');
  const lbNext     = document.getElementById('lightbox-next');

  if (!lightbox || !lbImg) return;

  let currentIdx = 0;
  const imgData = [];

  items.forEach((item, i) => {
    const img = item.querySelector('img');
    if (img) {
      imgData.push({ src: img.src, alt: img.alt });
    }
    item.addEventListener('click', () => {
      currentIdx = i;
      openLightbox(i);
    });
    item.setAttribute('tabindex', '0');
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); currentIdx = i; openLightbox(i); }
    });
  });

  function openLightbox(idx) {
    const d = imgData[idx];
    if (!d) return;
    lbImg.src = d.src;
    lbImg.alt = d.alt;
    if (lbCaption) lbCaption.textContent = d.alt;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    lbClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    lbImg.src = '';
    document.body.style.overflow = '';
  }

  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

  if (lbPrev) lbPrev.addEventListener('click', () => {
    currentIdx = (currentIdx - 1 + imgData.length) % imgData.length;
    openLightbox(currentIdx);
  });
  if (lbNext) lbNext.addEventListener('click', () => {
    currentIdx = (currentIdx + 1) % imgData.length;
    openLightbox(currentIdx);
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') { currentIdx = (currentIdx - 1 + imgData.length) % imgData.length; openLightbox(currentIdx); }
    if (e.key === 'ArrowRight') { currentIdx = (currentIdx + 1) % imgData.length; openLightbox(currentIdx); }
  });

  // Category filter
  document.querySelectorAll('[data-gallery-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-gallery-filter]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-gallery-filter');
      items.forEach(item => {
        if (cat === 'all' || item.getAttribute('data-category') === cat) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}
window.initGallery = initGallery;

/* =========================================================
   CONTACT FORM VALIDATION
   ========================================================= */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const rules = {
    'contact-name':    { required: true, minLen: 2,  pattern: /^[A-Za-z\s'-]{2,80}$/ },
    'contact-email':   { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    'contact-phone':   { required: false, pattern: /^[+\d\s\-().]{7,20}$/ },
    'contact-subject': { required: true, minLen: 3 },
    'contact-message': { required: true, minLen: 10 }
  };

  function showError(fieldId, msg) {
    const field = document.getElementById(fieldId);
    const err   = document.getElementById(fieldId + '-error');
    if (field) field.classList.add('error');
    if (err)   { err.textContent = msg; err.classList.add('visible'); }
  }
  function clearError(fieldId) {
    const field = document.getElementById(fieldId);
    const err   = document.getElementById(fieldId + '-error');
    if (field) field.classList.remove('error');
    if (err)   err.classList.remove('visible');
  }

  function validateField(id) {
    const rule  = rules[id];
    const field = document.getElementById(id);
    if (!rule || !field) return true;

    const val = field.value.trim();
    if (rule.required && !val) { showError(id, 'This field is required.'); return false; }
    if (val && rule.minLen && val.length < rule.minLen) { showError(id, 'Too short.'); return false; }
    if (val && rule.pattern && !rule.pattern.test(val)) { showError(id, 'Invalid format.'); return false; }
    clearError(id);
    return true;
  }

  // Live validation
  Object.keys(rules).forEach(id => {
    const field = document.getElementById(id);
    if (field) {
      field.addEventListener('blur', () => validateField(id));
      field.addEventListener('input', () => {
        if (field.classList.contains('error')) validateField(id);
      });
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;
    Object.keys(rules).forEach(id => { if (!validateField(id)) valid = false; });
    if (valid) {
      showToast('Message sent successfully! We will be in touch shortly.', 'success');
      form.reset();
      // TODO(security): On backend integration, add CSRF token, rate limiting, and sanitize server-side
    } else {
      showToast('Please fix the errors above.', 'error');
    }
  });
}

/* =========================================================
   JOIN FORM — Password Strength
   ========================================================= */
function initJoinForm() {
  const pw = document.getElementById('join-password');
  if (!pw) return;

  const bars = document.querySelectorAll('.strength-bar');

  pw.addEventListener('input', () => {
    const val = pw.value;
    let strength = 0;
    if (val.length >= 8)  strength++;
    if (val.length >= 12) strength++;
    if (/[A-Z]/.test(val) && /[a-z]/.test(val)) strength++;
    if (/\d/.test(val))   strength++;
    if (/[^A-Za-z0-9]/.test(val)) strength++;

    const level = strength <= 2 ? 'weak' : strength <= 3 ? 'medium' : 'strong';
    bars.forEach((bar, i) => {
      bar.className = 'strength-bar';
      if (i < strength) bar.classList.add(level);
    });
  });

  const form = document.getElementById('join-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameVal  = document.getElementById('join-name')?.value.trim();
    const emailVal = document.getElementById('join-email')?.value.trim();
    const pwVal    = document.getElementById('join-password')?.value;
    const terms    = document.getElementById('join-terms')?.checked;

    // Validate
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!nameVal || nameVal.length < 2) { showToast('Please enter your full name.', 'error'); return; }
    if (!emailVal || !emailRegex.test(emailVal)) { showToast('Please enter a valid email.', 'error'); return; }
    if (!pwVal || pwVal.length < 8) { showToast('Password must be at least 8 characters.', 'error'); return; }
    if (!terms) { showToast('Please accept the Terms & Conditions.', 'error'); return; }

    showToast('Registration submitted! Check your email to verify.', 'success');
    form.reset();
    // TODO(security): Backend must hash password with Argon2, implement CSRF, rate limit, email verification
  });
}

/* =========================================================
   INIT PAGE-SPECIFIC LOGIC
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
  initPropertiesPage();
  initSearchPage();
  initGallery();
  initContactForm();
  initJoinForm();
});
