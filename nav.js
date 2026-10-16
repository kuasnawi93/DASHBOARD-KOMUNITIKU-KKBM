/**
 * KomunitiKu @ KKBM — Shared Nav Component v2
 * Role-aware: routes pelajar vs admin to correct portals.
 */
(function () {
  var PELAJAR_NAV = [
    { label: 'Kursus', href: 'kursus.html' },
    { label: 'Dashboard', href: 'dashboard-pelajar.html' },
    { label: 'Sijil', href: 'sijil.html' },
    { label: 'AI Helpdesk', href: 'ai-helpdesk.html' },
  ];
  var ADMIN_NAV = [
    { label: 'Dashboard', href: 'dashboard-admin.html' },
    { label: 'Peserta', href: 'dashboard-admin.html#peserta' },
    { label: 'Analytics', href: 'dashboard-admin.html#analytics' },
    { label: 'AI Agent', href: 'ai-agent.html' },
  ];
  var PUBLIC_NAV = [
    { label: 'Kursus', href: 'kursus.html' },
    { label: 'Cara Belajar', href: 'index.html#cara-belajar' },
    { label: 'Tentang Kami', href: 'tentang.html' },
  ];

  function getUser() {
    try { return JSON.parse(localStorage.getItem('kkbm_user') || 'null'); } catch (e) { return null; }
  }
  function getCart() {
    try { return JSON.parse(localStorage.getItem('kkbm_cart') || '[]'); } catch (e) { return []; }
  }
  function logout() {
    localStorage.removeItem('kkbm_user');
    window.location.href = 'index.html';
  }
  function currentPage() {
    return window.location.pathname.split('/').pop() || 'index.html';
  }

  function buildNav() {
    var user = getUser();
    var cart = getCart();
    var page = currentPage();
    var isAdmin = user && user.role === 'admin';
    var navLinks = !user ? PUBLIC_NAV : (isAdmin ? ADMIN_NAV : PELAJAR_NAV);

    var linksHtml = navLinks.map(function (l) {
      var active = (page === l.href || page + '#' === l.href) ? ' nav-active' : '';
      return '<a href="' + l.href + '" class="nav-link' + active + '">' + l.label + '</a>';
    }).join('');

    var cartCount = cart.length;
    var cartBadgeHtml = cartCount > 0
      ? '<span style="position:absolute;top:-5px;right:-5px;width:16px;height:16px;background:#f59e0b;border-radius:50%;font-size:10px;font-weight:800;color:#fff;display:flex;align-items:center;justify-content:center;">' + cartCount + '</span>'
      : '';
    var cartBtn = '<a href="cart.html" class="nav-icon-btn" title="Cart" style="position:relative;display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:8px;border:1px solid var(--border);color:var(--muted);">🛒' + cartBadgeHtml + '</a>';

    var rightHtml;
    if (user) {
      var initials = user.nama ? user.nama.split(' ').slice(0, 2).map(function (w) { return w[0]; }).join('').toUpperCase() : 'U';
      var roleBadge = isAdmin
        ? '<span style="font-size:9px;background:#2d1f03;color:#fbbf24;padding:2px 7px;border-radius:4px;font-weight:700;text-transform:uppercase;margin-left:4px;">Admin</span>'
        : '<span style="font-size:9px;background:#0d2926;color:var(--teal-light);padding:2px 7px;border-radius:4px;font-weight:700;text-transform:uppercase;margin-left:4px;">Pelajar</span>';
      var dashLink = isAdmin ? 'dashboard-admin.html' : 'dashboard-pelajar.html';
      rightHtml =
        (isAdmin ? '' : cartBtn) +
        '<div class="nav-user-menu" id="navUserMenu">' +
          '<button class="nav-avatar-btn" id="navAvatarBtn" onclick="window.__navToggle()" title="' + user.nama + '">' +
            '<span class="nav-avatar" style="background:' + (isAdmin ? '#b45309' : 'var(--teal)') + ';">' + initials + '</span>' +
            '<span class="nav-username">' + user.nama.split(' ')[0] + '</span>' +
            roleBadge +
            '<span style="font-size:10px;color:var(--muted);margin-left:4px;">&#9660;</span>' +
          '</button>' +
          '<div class="nav-dropdown" id="navDropdown">' +
            '<div class="nav-dropdown-header">' +
              '<div style="font-weight:700;color:var(--white);font-size:13px;">' + user.nama + '</div>' +
              '<div style="font-size:11px;color:var(--muted);">' + (user.emel || '') + '</div>' +
              '<div style="margin-top:4px;">' + roleBadge + '</div>' +
            '</div>' +
            (isAdmin
              ? '<a class="nav-dropdown-item" href="dashboard-admin.html">📊 Admin Dashboard</a>' +
                '<a class="nav-dropdown-item" href="ai-agent.html">🤖 AI Agent Panel</a>'
              : '<a class="nav-dropdown-item" href="dashboard-pelajar.html">📊 Dashboard Saya</a>' +
                '<a class="nav-dropdown-item" href="profile.html">👤 Profil Saya</a>' +
                '<a class="nav-dropdown-item" href="cart.html">🛒 Cart</a>' +
                '<a class="nav-dropdown-item" href="ai-helpdesk.html">🤖 AI Helpdesk</a>'
            ) +
            '<div class="nav-dropdown-divider"></div>' +
            '<button class="nav-dropdown-item nav-dropdown-logout" onclick="window.__navLogout()">🚪 Log Keluar</button>' +
          '</div>' +
        '</div>';
    } else {
      rightHtml =
        cartBtn +
        '<a href="login.html" class="nav-link" style="color:var(--muted);">Log Masuk</a>' +
        '<a href="daftar.html" class="nav-cta">Daftar Sekarang</a>';
    }

    /* Use SVG logo if logo.js loaded, else fallback to text */
    var logoHtml;
    if (window.LOGO_SVG) {
      logoHtml =
        '<a class="nav-logo" href="index.html" aria-label="KomunitiKu @ KKBM — Laman Utama" style="gap:10px;">' +
          window.LOGO_SVG.full(34) +
        '</a>';
    } else {
      logoHtml =
        '<a class="nav-logo" href="index.html">' +
          '<div class="nav-logo-icon">K</div>' +
          '<div class="nav-logo-text">Komuniti<span>Ku</span>&nbsp;<span style="color:#8b949e;font-weight:400;font-size:13px;">@ KKBM</span></div>' +
        '</a>';
    }

    var html =
      logoHtml +
      '<div class="nav-links">' + linksHtml + '</div>' +
      '<div class="nav-right" style="display:flex;align-items:center;gap:12px;">' + rightHtml + '</div>';

    var nav = document.getElementById('main-nav');
    if (nav) nav.innerHTML = html;

    window.__navToggle = function () {
      var d = document.getElementById('navDropdown');
      if (d) d.classList.toggle('open');
    };
    window.__navLogout = logout;

    document.addEventListener('click', function (e) {
      var menu = document.getElementById('navUserMenu');
      var d = document.getElementById('navDropdown');
      if (d && menu && !menu.contains(e.target)) d.classList.remove('open');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildNav);
  } else {
    buildNav();
  }
})();
