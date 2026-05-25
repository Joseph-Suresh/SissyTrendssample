/* ═══════════════════════════════════════════════════════
   SISSYTRENDS BOUTIQUE — Shared JavaScript
   Elegant Styles for Every You
   Phone: 9344182144 | help@sissytrends.in
═══════════════════════════════════════════════════════ */

/* ── Brand constants ── */
const BRAND = {
  name:        'SissyTrends Boutique',
  nameShort:   'SissyTrends',
  tagline:     'Elegant Styles for Every You',
  phone:       '919344182144',
  phoneDisplay:'+91 93441 82144',
  email:       'help@sissytrends.in',
  website:     'www.sissytrends.in',
  instagram:   'https://instagram.com/sissytrendsindia',
  instagramHandle: '@sissytrendsindia',
  facebook:    'https://facebook.com/SissyTrendsIndia',
  whatsapp:    'https://wa.me/919344182144',
  location:    'Coimbatore, Tamil Nadu',
};

/* ── Page loader ── */
window.addEventListener('load', () => {
  const loader = document.getElementById('pageLoader');
  if (loader) setTimeout(() => loader.classList.add('hidden'), 1200);
});

/* ── DOMContentLoaded init ── */
document.addEventListener('DOMContentLoaded', () => {

  /* Navbar scroll */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    });
  }

  /* Mobile menu toggle */
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileClose= document.getElementById('mobileClose');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });
    if (mobileClose) {
      mobileClose.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    }
    /* Close on link click (but NOT on accordion toggles) */
    mobileMenu.querySelectorAll('a[data-close]').forEach(a => {
      a.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* Mobile accordion (category expand) */
  document.querySelectorAll('.mob-acc-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const parent = btn.closest('.mob-acc-item');
      const open   = parent.classList.contains('open');
      document.querySelectorAll('.mob-acc-item').forEach(i => i.classList.remove('open'));
      if (!open) parent.classList.add('open');
    });
  });

  /* Desktop mega-menu: close on outside click */
  document.addEventListener('click', e => {
    if (!e.target.closest('.has-mega')) {
      document.querySelectorAll('.mega-menu').forEach(m => m.classList.remove('visible'));
    }
  });

  /* Scroll reveal */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
  revealEls.forEach(r => revealObs.observe(r));

  /* Wishlist badge restore */
  window.wishlistCount = parseInt(sessionStorage.getItem('st_wishlist') || '0');
  const badge = document.getElementById('wishlistBadge');
  if (badge) badge.textContent = window.wishlistCount;
});

/* ── Wishlist ── */
function addToWishlist(name) {
  window.wishlistCount = (window.wishlistCount || 0) + 1;
  sessionStorage.setItem('st_wishlist', window.wishlistCount);
  const badge = document.getElementById('wishlistBadge');
  if (badge) {
    badge.textContent = window.wishlistCount;
    badge.classList.add('heart-pop');
    setTimeout(() => badge.classList.remove('heart-pop'), 400);
  }
  showToast(`❤ "${name || 'Item'}" added to wishlist`);
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.innerHTML = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
}

/* ── Quick-view modal ── */
function openModal(fabric, name, desc, price, imgUrl) {
  document.getElementById('modalFabric').textContent  = fabric;
  document.getElementById('modalName').textContent    = name;
  document.getElementById('modalDesc').textContent    = desc;
  document.getElementById('modalPrice').textContent   = price;
  document.getElementById('modalNameHidden').textContent = name;
  const img = document.getElementById('modalImgEl');
  if (img) { img.src = imgUrl; img.alt = name; }
  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal(e) {
  if (!e || e.target === document.getElementById('modalOverlay')) {
    document.getElementById('modalOverlay')?.classList.remove('open');
    document.body.style.overflow = '';
  }
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/* ════════════════════════════════════════════════════
   PRODUCTS DATA — 3-level hierarchy
   category  →  subcategory  →  products
   ════════════════════════════════════════════════════ */
const STORE_KEY = 'sissytrends_products_v1';

/*
  Category taxonomy:
  sarees
    └─ soft-silk      (Soft Silk)
    └─ kanjivaram     (Kanjivaram)
    └─ banarasi       (Banarasi)
    └─ velvet         (Velvet)
    └─ cotton-linen   (Cotton & Linen)
  jewellery
    └─ necklace-sets  (Necklace Sets)
    └─ earrings       (Earrings)
    └─ full-sets      (Full Sets)
    └─ bridal         (Bridal Collection)
  decor
    └─ diyas          (Diyas & Lamps)
    └─ gifting        (Gifting)
*/

/* Subcategory definitions — used to build menus + filter UI */
const SUBCATEGORIES = {
  sarees: [
    { key: 'soft-silk',    label: 'Soft Silk',       icon: '🥻' },
    { key: 'kanjivaram',   label: 'Kanjivaram',      icon: '🪡' },
    { key: 'banarasi',     label: 'Banarasi',         icon: '✨' },
    { key: 'velvet',       label: 'Velvet',           icon: '🌹' },
    { key: 'cotton-linen', label: 'Cotton & Linen',   icon: '🌿' },
  ],
  jewellery: [
    { key: 'necklace-sets',label: 'Necklace Sets',    icon: '💎' },
    { key: 'earrings',     label: 'Earrings',         icon: '✨' },
    { key: 'full-sets',    label: 'Full Sets',        icon: '👑' },
    { key: 'bridal',       label: 'Bridal Collection',icon: '🌸' },
  ],
  decor: [
    { key: 'diyas',        label: 'Diyas & Lamps',   icon: '🪔' },
    { key: 'gifting',      label: 'Gifting',          icon: '🎁' },
  ],
};

function getSubcategories(cat) {
  return SUBCATEGORIES[cat] || [];
}

function getProducts() {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY)) || getDefaultProducts();
  } catch { return getDefaultProducts(); }
}
function saveProducts(products) {
  localStorage.setItem(STORE_KEY, JSON.stringify(products));
}

function getDefaultProducts() {
  return [
    /* ── SAREES › Soft Silk ── */
    {
      id: 1, name: 'Crimson Soft Silk',
      category: 'sarees', subcategory: 'soft-silk',
      fabric: 'Soft Silk', price: 4500,
      badge: 'New Arrival',
      img: '../Images/Saree1.jpeg',
      desc: 'Draped in silken grace — this deep crimson soft silk speaks the language of celebration and feminine confidence. Perfect for weddings and festive evenings.',
      occasion: 'bridal'
    },
    {
      id: 2, name: 'Ivory Soft Silk',
      category: 'sarees', subcategory: 'soft-silk',
      fabric: 'Soft Silk', price: 3800,
      badge: 'Bestseller',
      img: '../Images/saree3.jpeg',
      desc: 'Pure ivory grace — a saree that carries the quiet confidence of a woman who knows her worth. Soft, luminous, and endlessly elegant.',
      occasion: 'festive'
    },
    {
      id: 3, name: 'Rose Petal Soft Silk',
      category: 'sarees', subcategory: 'soft-silk',
      fabric: 'Soft Silk', price: 4200,
      badge: 'Trending',
      img: '../Images/saree2.jpeg',
      desc: 'Blush-toned soft silk with a delicate sheen — for the woman who steps into every room like a poem.',
      occasion: 'wedding'
    },

    /* ── SAREES › Kanjivaram ── */
    {
      id: 4, name: 'Classic Kanjivaram Gold',
      category: 'sarees', subcategory: 'kanjivaram',
      fabric: 'Kanjivaram Silk', price: 12500,
      badge: 'Heritage',
      img: '../Images/Saree1.jpeg',
      desc: 'The heirloom you pass down — a classic Kanjivaram in deep gold and maroon, woven with generations of Kanchipuram artisanship.',
      occasion: 'bridal'
    },
    {
      id: 5, name: 'Peacock Kanjivaram',
      category: 'sarees', subcategory: 'kanjivaram',
      fabric: 'Kanjivaram Silk', price: 14800,
      badge: "Editor's Pick",
      img: '../Images/saree2.jpeg',
      desc: 'Rich teal with peacock motifs in zari — a Kanjivaram that turns every step into a statement.',
      occasion: 'wedding'
    },

    /* ── SAREES › Banarasi ── */
    {
      id: 6, name: 'The Golden Thread Banarasi',
      category: 'sarees', subcategory: 'banarasi',
      fabric: 'Banarasi Weave', price: 8500,
      badge: 'Heritage',
      img: '../Images/saree2.jpeg',
      desc: 'Where Banaras lives in every zari — ivory and gold in perfect conversation. A masterpiece for the wedding guest who wants to be unforgettable.',
      occasion: 'wedding'
    },
    {
      id: 7, name: 'Midnight Banarasi',
      category: 'sarees', subcategory: 'banarasi',
      fabric: 'Banarasi Silk', price: 9200,
      badge: 'New',
      img: '../Images/saree3.jpeg',
      desc: 'Deep navy Banarasi with silver brocade — for the woman who commands attention without trying.',
      occasion: 'party'
    },

    /* ── SAREES › Velvet ── */
    {
      id: 8, name: 'Velvet Vermilion',
      category: 'sarees', subcategory: 'velvet',
      fabric: 'Velvet Silk', price: 6800,
      badge: "Editor's Pick",
      img: '../Images/V Saree 1.jpeg',
      desc: 'Deep and luxurious — velvet silk in a shade that commands every room. For the woman who wears her culture like armour and her grace like a crown.',
      occasion: 'party'
    },
    {
      id: 9, name: 'Heritage Velvet',
      category: 'sarees', subcategory: 'velvet',
      fabric: 'Velvet Weave', price: 5900,
      badge: 'New',
      img: '../Images/V Saree 2.jpeg',
      desc: 'Rich heritage woven into every thread — a saree that bridges the grandeur of the past with the poise of the present.',
      occasion: 'bridal'
    },
    {
      id: 10, name: 'Regal Drape',
      category: 'sarees', subcategory: 'velvet',
      fabric: 'Velvet Cotton', price: 4800,
      badge: 'Trending',
      img: '../Images/V Saree 3.jpeg',
      desc: 'Regal without trying, warm without effort — the saree for women who carry their stories with effortless poise.',
      occasion: 'wedding'
    },
    {
      id: 11, name: 'Deep Velvet Dream',
      category: 'sarees', subcategory: 'velvet',
      fabric: 'Premium Velvet', price: 7200,
      badge: 'Curated',
      img: '../Images/V Saree 4.jpeg',
      desc: 'A dream in deep velvet — this drape belongs to the woman who turns every occasion into a memory.',
      occasion: 'festive'
    },

    /* ── SAREES › Cotton & Linen ── */
    {
      id: 12, name: 'Morning Mist Cotton',
      category: 'sarees', subcategory: 'cotton-linen',
      fabric: 'Pure Cotton', price: 2200,
      badge: 'Everyday',
      img: '../Images/saree3.jpeg',
      desc: 'Light as a whisper, graceful as dawn — the cotton saree for the modern woman who values comfort as much as elegance.',
      occasion: 'casual'
    },
    {
      id: 13, name: 'Sun-Kissed Linen',
      category: 'sarees', subcategory: 'cotton-linen',
      fabric: 'Pure Linen', price: 2800,
      badge: 'Sustainable',
      img: '../Images/saree2.jpeg',
      desc: 'Effortless heritage — linen reborn for the woman who leads with ease and intention. Cool, natural, and endlessly graceful.',
      occasion: 'casual'
    },

    /* ── JEWELLERY › Necklace Sets ── */
    {
      id: 14, name: 'Heart of Gold Necklace',
      category: 'jewellery', subcategory: 'necklace-sets',
      type: 'Necklace Set', price: 1200,
      badge: 'Bestseller',
      img: '../Images/Imitation jewels/Heartin on Saree.jpeg',
      desc: 'Golden hearts in a delicate setting — this necklace pairs beautifully with both contemporary and traditional sarees, adding warmth to every look.',
      occasion: 'festive'
    },
    {
      id: 15, name: 'Stone Elegance Necklace',
      category: 'jewellery', subcategory: 'necklace-sets',
      type: 'Necklace Set', price: 1600,
      badge: 'New',
      img: '../Images/Imitation jewels/Heartin stones .jpeg',
      desc: 'Richly embellished with hand-set stones — this necklace elevates your silhouette from beautiful to breathtaking.',
      occasion: 'bridal'
    },

    /* ── JEWELLERY › Earrings ── */
    {
      id: 16, name: 'Pearl Classic Earrings',
      category: 'jewellery', subcategory: 'earrings',
      type: 'Earrings', price: 650,
      badge: "Editor's Pick",
      img: '../Images/Imitation jewels/Pearl ear.jpeg',
      desc: 'Timeless pearl drops in an antique setting — the earring that works with every occasion, every saree, every version of you.',
      occasion: 'casual'
    },
    {
      id: 17, name: 'Geometric Gold Earrings',
      category: 'jewellery', subcategory: 'earrings',
      type: 'Earrings', price: 750,
      badge: 'Trending',
      img: '../Images/Imitation jewels/Squares.jpeg',
      desc: 'Bold geometric forms in antique gold — a statement earring that draws the eye and completes any look.',
      occasion: 'wedding'
    },

    /* ── JEWELLERY › Full Sets ── */
    {
      id: 18, name: 'Geometric Temple Set',
      category: 'jewellery', subcategory: 'full-sets',
      type: 'Full Set', price: 2200,
      badge: 'Trending',
      img: '../Images/Imitation jewels/Squares.jpeg',
      desc: 'Bold geometric forms meet temple jewellery — a set that makes an architectural statement and complements the richness of silk sarees.',
      occasion: 'wedding'
    },

    /* ── JEWELLERY › Bridal ── */
    {
      id: 19, name: 'Royal Bridal Grand Set',
      category: 'jewellery', subcategory: 'bridal',
      type: 'Bridal Set', price: 3500,
      badge: 'Bridal',
      img: '../Images/Imitation jewels/WhatsApp Image 2026-03-04 at 19.29.31.jpeg',
      desc: 'A complete bridal jewellery ensemble crafted for the woman entering forever — grand, golden, and full of intention.',
      occasion: 'bridal'
    },
    {
      id: 20, name: 'Bridal Stone Set',
      category: 'jewellery', subcategory: 'bridal',
      type: 'Bridal Set', price: 2800,
      badge: 'New',
      img: '../Images/Imitation jewels/Heartin stones .jpeg',
      desc: 'A dazzling stone-studded bridal set — for the bride who wants to shine from every angle on her special day.',
      occasion: 'bridal'
    },

    /* ── DECOR › Diyas & Lamps ── */
    {
      id: 21, name: 'Festival Diya',
      category: 'decor', subcategory: 'diyas',
      type: 'Diya', price: 350,
      badge: 'Festive',
      img: '../Images/Decorative handcrafts/Diya.webp',
      desc: 'Hand-crafted festive diya — a warm glow that transforms any space into a celebration. Perfect for Diwali or home décor.',
      occasion: 'festive'
    },

    /* ── DECOR › Gifting ── */
    {
      id: 22, name: 'Festive Gift Box',
      category: 'decor', subcategory: 'gifting',
      type: 'Gift Set', price: 1200,
      badge: 'Gift',
      img: '../Images/Decorative handcrafts/Diya.webp',
      desc: 'A curated festive gift box — the perfect way to celebrate the people who matter most, wrapped in elegance.',
      occasion: 'festive'
    },
  ];
}

/* ── Render a product card ── */
function renderProductCard(product, delay = 0) {
  const imgSrc = product.img;
  const waText = encodeURIComponent(
    `Hi SissyTrends! I'd love to order: ${product.name} (₹${product.price.toLocaleString()}). Can you help me?`
  );
  const safeDesc  = (product.desc || '').replace(/'/g, "\\'");
  const safeFab   = (product.fabric || product.type || product.category).replace(/'/g, "\\'");
  const safeName  = product.name.replace(/'/g, "\\'");

  return `
    <div class="product-card reveal" style="transition-delay:${delay}s"
         onclick="openModal('${safeFab}','${safeName}','${safeDesc}','₹${product.price.toLocaleString()}','${imgSrc}')">
      <div class="img-wrap">
        <img src="${imgSrc}" alt="${product.name}" loading="lazy"
             onerror="this.style.display='none';this.parentElement.style.background='linear-gradient(135deg,#EAD9C4,#E8C5C0)';this.parentElement.style.minHeight='260px'"/>
      </div>
      <div class="card-body">
        <div class="card-badge">${product.badge || product.fabric || product.type}</div>
        <div class="card-name">${product.name}</div>
        <p class="card-desc">${(product.desc || '').substring(0, 75)}…</p>
        <div class="card-price">₹${product.price.toLocaleString()}</div>
        <div class="card-actions">
          <button class="btn-primary" style="width:100%;justify-content:center;padding:11px"
            onclick="event.stopPropagation();openModal('${safeFab}','${safeName}','${safeDesc}','₹${product.price.toLocaleString()}','${imgSrc}')">
            <span>Quick View</span> <span class="arrow">→</span>
          </button>
          <a href="https://wa.me/${BRAND.phone}?text=${waText}" target="_blank" onclick="event.stopPropagation()">
            <button class="btn-wa" style="width:100%;padding:10px">
              <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.122.554 4.112 1.528 5.84L.057 23.5l5.797-1.499A11.938 11.938 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.854 0-3.6-.497-5.11-1.367l-.366-.218-3.44.889.921-3.32-.239-.384A9.955 9.955 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
              WhatsApp Order
            </button>
          </a>
        </div>
      </div>
    </div>`;
}

/* ── Contact form → WhatsApp ── */
function sendViaWhatsApp() {
  const name = document.getElementById('cName')?.value  || 'A visitor';
  const phone= document.getElementById('cPhone')?.value || '';
  const msg  = document.getElementById('cMsg')?.value   || '';
  const occ  = document.getElementById('cOccasion')?.value || '';
  const text = encodeURIComponent(
    `🌺 Hello SissyTrends Boutique!\n\nName: ${name}\nPhone: ${phone}${occ ? '\nOccasion: ' + occ : ''}\nMessage: ${msg}`
  );
  window.open(`${BRAND.whatsapp}?text=${text}`, '_blank');
}

/* ════════════════════════════════════════════════════
   SHARED NAV — with 3-level mega-menu
   ════════════════════════════════════════════════════ */
function injectNav(activePage, isRoot) {
  const base = isRoot ? '' : '../';

  /* Top-level pages (non-dropdown) */
  const simplePages = [
    { href: base + 'index.html',            label: 'Home'      },
    { href: base + 'pages/heritage.html',   label: 'Our Story' },
    { href: base + 'pages/contact.html',    label: 'Contact'   },
  ];

  /* Build desktop mega-menu for Shop */
  const shopMega = `
    <li class="has-mega">
      <a href="${base}pages/collections.html" class="${['Collections','Categories'].includes(activePage)?'active':''}">
        Shop <span style="font-size:9px">▾</span>
      </a>
      <div class="mega-menu">
        <div class="mega-col">
          <div class="mega-col-title">
            <a href="${base}pages/categories.html?cat=sarees">🥻 Sarees</a>
          </div>
          ${SUBCATEGORIES.sarees.map(s => `
            <a class="mega-sub-link" href="${base}pages/categories.html?cat=sarees&sub=${s.key}">
              ${s.icon} ${s.label}
            </a>`).join('')}
        </div>
        <div class="mega-col">
          <div class="mega-col-title">
            <a href="${base}pages/categories.html?cat=jewellery">💎 Jewellery</a>
          </div>
          ${SUBCATEGORIES.jewellery.map(s => `
            <a class="mega-sub-link" href="${base}pages/categories.html?cat=jewellery&sub=${s.key}">
              ${s.icon} ${s.label}
            </a>`).join('')}
        </div>
        <div class="mega-col">
          <div class="mega-col-title">
            <a href="${base}pages/categories.html?cat=decor">🪔 Décor</a>
          </div>
          ${SUBCATEGORIES.decor.map(s => `
            <a class="mega-sub-link" href="${base}pages/categories.html?cat=decor&sub=${s.key}">
              ${s.icon} ${s.label}
            </a>`).join('')}
          <div style="margin-top:16px;padding-top:14px;border-top:1px solid rgba(201,168,76,0.15)">
            <a class="mega-sub-link" href="${base}pages/collections.html" style="color:var(--gold)">
              ✦ View All Products →
            </a>
          </div>
        </div>
      </div>
    </li>`;

  const simpleLinks = simplePages.map(p =>
    `<li><a href="${p.href}" class="${p.label===activePage?'active':''}">${p.label}</a></li>`
  ).join('');

  /* Mobile accordion menu */
  const mobileAccordion = `
    <div class="mob-acc-item">
      <button class="mob-acc-toggle">🥻 Sarees <span class="mob-acc-arrow">▾</span></button>
      <div class="mob-acc-body">
        <a href="${base}pages/categories.html?cat=sarees" data-close>All Sarees</a>
        ${SUBCATEGORIES.sarees.map(s =>
          `<a href="${base}pages/categories.html?cat=sarees&sub=${s.key}" data-close>${s.icon} ${s.label}</a>`
        ).join('')}
      </div>
    </div>
    <div class="mob-acc-item">
      <button class="mob-acc-toggle">💎 Jewellery <span class="mob-acc-arrow">▾</span></button>
      <div class="mob-acc-body">
        <a href="${base}pages/categories.html?cat=jewellery" data-close>All Jewellery</a>
        ${SUBCATEGORIES.jewellery.map(s =>
          `<a href="${base}pages/categories.html?cat=jewellery&sub=${s.key}" data-close>${s.icon} ${s.label}</a>`
        ).join('')}
      </div>
    </div>
    <div class="mob-acc-item">
      <button class="mob-acc-toggle">🪔 Décor <span class="mob-acc-arrow">▾</span></button>
      <div class="mob-acc-body">
        <a href="${base}pages/categories.html?cat=decor" data-close>All Décor</a>
        ${SUBCATEGORIES.decor.map(s =>
          `<a href="${base}pages/categories.html?cat=decor&sub=${s.key}" data-close>${s.icon} ${s.label}</a>`
        ).join('')}
      </div>
    </div>`;

  const mobileSimple = simplePages.filter(p => p.label !== 'Home').map(p =>
    `<a href="${p.href}" data-close>${p.label}</a>`
  ).join('');

  return `
  <!-- PAGE LOADER -->
  <div class="page-loader" id="pageLoader">
    <div class="loader-logo">SissyTrends</div>
    <div class="loader-bar"></div>
    <div class="loader-sub">Elegant Styles for Every You</div>
  </div>

  <!-- TOAST -->
  <div class="toast" id="toast"></div>

  <!-- QUICK VIEW MODAL -->
  <div class="modal-overlay" id="modalOverlay" onclick="closeModal(event)">
    <div class="modal-box">
      <div class="modal-img">
        <img id="modalImgEl" src="" alt="" style="width:100%;height:100%;object-fit:cover;display:block;min-height:360px"/>
      </div>
      <div class="modal-body">
        <button class="modal-close" onclick="closeModal()">✕</button>
        <div style="font-family:var(--font-body);font-size:9.5px;letter-spacing:3px;text-transform:uppercase;color:var(--gold);margin-bottom:6px" id="modalFabric"></div>
        <div style="font-family:var(--font-display);font-size:1.6rem;font-weight:400;color:var(--maroon-deep);line-height:1.2;margin-bottom:10px" id="modalName"></div>
        <p style="font-family:var(--font-body);font-size:13px;font-weight:300;line-height:1.9;color:var(--taupe);margin-bottom:18px" id="modalDesc"></p>
        <div style="font-family:var(--font-display);font-size:1.8rem;color:var(--maroon);margin-bottom:24px" id="modalPrice"></div>
        <input type="hidden" id="modalNameHidden"/>
        <div style="display:flex;flex-direction:column;gap:10px">
          <button class="btn-primary" style="width:100%;justify-content:center"
            onclick="addToWishlist(document.getElementById('modalNameHidden').value);closeModal()">
            <span>Add to Wishlist</span> <span>♡</span>
          </button>
          <a href="${BRAND.whatsapp}?text=Hi%20SissyTrends!%20I%27m%20interested%20in%20this%20piece." target="_blank">
            <button class="btn-wa" style="width:100%;justify-content:center">
              <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.122.554 4.112 1.528 5.84L.057 23.5l5.797-1.499A11.938 11.938 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.854 0-3.6-.497-5.11-1.367l-.366-.218-3.44.889.921-3.32-.239-.384A9.955 9.955 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
              Enquire on WhatsApp
            </button>
          </a>
        </div>
      </div>
    </div>
  </div>

  <!-- MOBILE MENU -->
  <div class="mobile-menu" id="mobileMenu">
    <button class="mobile-menu-close" id="mobileClose">✕</button>
    <a href="${base}index.html" data-close>Home</a>
    ${mobileAccordion}
    ${mobileSimple}
    <a href="${base}pages/matcher.html" class="nav-special" data-close>✦ Style Personality Matcher</a>
  </div>

  <!-- NAVBAR -->
  <nav id="navbar">
    <div class="nav-inner">
      <a href="${base}index.html" class="nav-logo">
        <span class="nav-logo-name">SissyTrends</span>
        <span class="nav-logo-sub">Elegant Styles for Every You</span>
      </a>
      <ul class="nav-links">
        <li><a href="${base}index.html" class="${activePage==='Home'?'active':''}">Home</a></li>
        ${shopMega}
        ${simpleLinks}
        <li><a href="${base}pages/matcher.html" class="nav-special">✦ Style Matcher</a></li>
      </ul>
      <div class="nav-actions">
        <button class="nav-icon-btn" title="Wishlist" onclick="addToWishlist()">♡<span class="nav-badge" id="wishlistBadge">0</span></button>
        <button class="nav-hamburger" id="hamburger" aria-label="Menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  </nav>`;
}

/* ── Shared footer ── */
function injectFooter(isRoot) {
  const base = isRoot ? '' : '../';
  return `
  <footer>
    <div class="footer-inner">
      <div class="footer-grid">
        <div>
          <div class="footer-brand-name">SissyTrends</div>
          <div class="footer-brand-sub">Elegant Styles for Every You</div>
          <p class="footer-about">A curated boutique in Coimbatore celebrating India's textile heritage through handpicked sarees, premium imitation jewellery, and complete styled looks — for women who wear culture with confidence.</p>
          <div class="footer-socials">
            <a href="${BRAND.whatsapp}" target="_blank" class="footer-social" title="WhatsApp">💬</a>
            <a href="${BRAND.instagram}" target="_blank" class="footer-social" title="Instagram">📸</a>
            <a href="${BRAND.facebook}" target="_blank" class="footer-social" title="Facebook">f</a>
          </div>
          <div class="footer-newsletter">
            <p class="footer-newsletter-label">Style Updates</p>
            <div class="footer-newsletter-row">
              <input type="email" placeholder="your@email.com"/>
              <button>→</button>
            </div>
          </div>
        </div>
        <div>
          <p class="footer-heading">Shop</p>
          <ul class="footer-links">
            <li><a href="${base}pages/collections.html">All Products</a></li>
            <li><a href="${base}pages/categories.html?cat=sarees">All Sarees</a></li>
            <li><a href="${base}pages/categories.html?cat=sarees&sub=soft-silk">Soft Silk</a></li>
            <li><a href="${base}pages/categories.html?cat=sarees&sub=kanjivaram">Kanjivaram</a></li>
            <li><a href="${base}pages/categories.html?cat=sarees&sub=velvet">Velvet</a></li>
            <li><a href="${base}pages/categories.html?cat=jewellery">Jewellery</a></li>
            <li><a href="${base}pages/categories.html?cat=decor">Décor</a></li>
          </ul>
        </div>
        <div>
          <p class="footer-heading">Information</p>
          <ul class="footer-links">
            <li><a href="${base}pages/heritage.html">Our Story</a></li>
            <li><a href="${base}pages/contact.html">Contact Us</a></li>
            <li><a href="${base}pages/matcher.html">Style Matcher</a></li>
            <li><a href="#">Styling Guide</a></li>
            <li><a href="#">Care Instructions</a></li>
            <li><a href="#">Returns Policy</a></li>
          </ul>
        </div>
        <div>
          <p class="footer-heading">Get In Touch</p>
          <div class="footer-policies">
            <span>📍 Coimbatore, Tamil Nadu</span>
            <span>📞 <a href="tel:+919344182144" style="color:inherit">+91 93441 82144</a></span>
            <span>✉ <a href="mailto:help@sissytrends.in" style="color:inherit">help@sissytrends.in</a></span>
            <span>🌐 <a href="https://www.sissytrends.in" style="color:inherit">www.sissytrends.in</a></span>
          </div>
          <div style="margin-top:20px" class="footer-policies">
            <span>✦ Free shipping above ₹999</span>
            <span>✦ Cash on delivery available</span>
            <span>✦ Easy returns within 7 days</span>
            <span>✦ Mon–Sat · 10am – 7pm IST</span>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© 2025 SissyTrends Boutique, Coimbatore. All rights reserved.</p>
        <em>Crafted with love for Indian women everywhere</em>
      </div>
    </div>
  </footer>
  <a href="${BRAND.whatsapp}?text=Hi%20SissyTrends!%20I%27d%20love%20help%20finding%20the%20perfect%20style." target="_blank" class="float-wa" title="Chat with our stylist">
    <svg fill="white" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.122.554 4.112 1.528 5.84L.057 23.5l5.797-1.499A11.938 11.938 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.854 0-3.6-.497-5.11-1.367l-.366-.218-3.44.889.921-3.32-.239-.384A9.955 9.955 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
  </a>`;
}
