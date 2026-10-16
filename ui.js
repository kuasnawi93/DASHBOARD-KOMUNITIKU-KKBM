/**
 * KomunitiKu @ KKBM — Shared UI Utilities
 * Implements Shneiderman Rules 3, 4, 5, 6
 */

/* ============================================================
   TOAST SYSTEM — Rule 3: Informative Feedback
   ============================================================ */
(function () {
  var container;
  function getContainer() {
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }
    return container;
  }

  window.showToast = function (message, type, duration) {
    type = type || 'info';
    duration = duration || 3500;
    var icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
    var toast = document.createElement('div');
    toast.className = 'toast toast-' + type;
    toast.innerHTML =
      '<span>' + (icons[type] || 'ℹ️') + '</span>' +
      '<span style="flex:1;">' + message + '</span>' +
      '<button class="toast-close" onclick="this.closest(\'.toast\').remove()" aria-label="Tutup">✕</button>';
    getContainer().appendChild(toast);
    setTimeout(function () {
      toast.style.animation = 'slideOut 0.25s ease forwards';
      setTimeout(function () { toast.remove(); }, 250);
    }, duration);
    return toast;
  };
})();

/* ============================================================
   INLINE FORM VALIDATION — Rule 5: Prevent Errors
   ============================================================ */
window.validateField = function (input, rules) {
  var group = input.closest('.form-group');
  if (!group) return true;
  var errorEl = group.querySelector('.error-msg');
  var val = input.value.trim();
  var error = null;

  if (rules.required && !val) { error = rules.required === true ? 'Ruangan ini wajib diisi.' : rules.required; }
  else if (rules.email && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) { error = 'Format emel tidak sah.'; }
  else if (rules.minLength && val.length < rules.minLength) { error = 'Minimum ' + rules.minLength + ' aksara diperlukan.'; }
  else if (rules.match && val !== rules.match.value) { error = 'Tidak sepadan dengan ' + (rules.match.label || 'medan di atas') + '.'; }

  if (error) {
    group.classList.add('has-error'); group.classList.remove('has-success');
    if (errorEl) errorEl.textContent = error;
    return false;
  } else {
    group.classList.remove('has-error');
    if (val) group.classList.add('has-success');
    if (errorEl) errorEl.textContent = '';
    return true;
  }
};

/* Real-time password strength — Rule 5 */
window.initPasswordStrength = function (inputId, barId) {
  var input = document.getElementById(inputId);
  var bar = document.getElementById(barId);
  if (!input || !bar) return;
  input.addEventListener('input', function () {
    var val = input.value;
    var score = 0;
    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;
    var pct = (score / 4) * 100;
    var colors = ['', '#f87171', '#fbbf24', '#4ade80', '#14b8a6'];
    bar.style.width = pct + '%';
    bar.style.background = colors[score] || '#f87171';
  });
};

/* ============================================================
   CONFIRM DIALOG — Rule 5 & 6: Prevent errors + Easy reversal
   ============================================================ */
window.confirmAction = function (options) {
  return new Promise(function (resolve) {
    var overlay = document.createElement('div');
    overlay.className = 'modal-overlay open';
    var icon = options.danger ? '⚠️' : '❓';
    overlay.innerHTML =
      '<div class="modal" style="text-align:center;">' +
        '<div style="font-size:2.5rem;margin-bottom:12px;">' + icon + '</div>' +
        '<div class="modal-title" style="justify-content:center;">' + (options.title || 'Sahkan Tindakan') + '</div>' +
        '<div class="modal-desc" style="text-align:center;margin-top:8px;">' + (options.message || 'Adakah anda pasti?') + '</div>' +
        '<div class="modal-footer" style="justify-content:center;margin-top:24px;">' +
          '<button class="btn' + (options.danger ? ' btn-danger' : '') + '" id="confirmYes">' + (options.confirmLabel || 'Ya, Teruskan') + '</button>' +
          '<button class="btn-secondary" id="confirmNo">' + (options.cancelLabel || 'Batal') + '</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(overlay);
    overlay.querySelector('#confirmYes').onclick = function () { overlay.remove(); resolve(true); };
    overlay.querySelector('#confirmNo').onclick = function () { overlay.remove(); resolve(false); };
    overlay.onclick = function (e) { if (e.target === overlay) { overlay.remove(); resolve(false); } };
  });
};

/* ============================================================
   KEYBOARD SHORTCUTS — Rule 2: Enable shortcuts
   ============================================================ */
document.addEventListener('keydown', function (e) {
  // Esc closes modals and chatbot
  if (e.key === 'Escape') {
    var panel = document.getElementById('chatbot-panel');
    if (panel && panel.classList.contains('open')) { panel.classList.remove('open'); return; }
    var openModal = document.querySelector('.modal-overlay.open');
    if (openModal) { openModal.remove(); }
  }
  // Ctrl+/ opens chatbot
  if (e.ctrlKey && e.key === '/') {
    e.preventDefault();
    var panel = document.getElementById('chatbot-panel');
    if (panel) { panel.classList.toggle('open'); }
  }
});

/* ============================================================
   CHATBOT WIDGET — Rule 3: Feedback, Rule 8: Reduce memory load
   Persistent on every page
   ============================================================ */
(function () {
  var KB = [
    {keys:['daftar','register','akaun','sign'],reply:'Untuk daftar akaun, klik <a href="daftar.html"><strong>Daftar Sekarang</strong></a> di nav bar. Isi nama, emel, kawasan dan kata laluan — kurang 2 minit! ✅'},
    {keys:['sijil','certificate'],reply:'Sijil auto-dijana selepas anda selesai semua modul + lulus penilaian. Boleh cetak atau muat turun dari <a href="sijil.html">halaman Sijil</a>. 🏆'},
    {keys:['percuma','free'],reply:'Kursus percuma kami: 💻 Literasi Digital, 🎨 Grafik Asas, 📱 Media Sosial. Semua sertakan sijil rasmi KKBM! <a href="kursus.html">Lihat semua kursus</a>'},
    {keys:['bayar','harga','price','rm'],reply:'Kursus berbayar: Excel RM80, e-Dagang RM120, F&B RM60. Bayaran via FPX atau kad. 💳'},
    {keys:['f2f','bersemuka','kelas','lokasi'],reply:'Kelas F2F diadakan di Kolej Komuniti Bukit Mertajam. Jadual dihantar ke emel selepas daftar. 📍'},
    {keys:['hubungi','contact','telefon','email'],reply:'📞 04-538 2222 | ✉️ psh@kkbm.edu.my | Isnin-Jumaat 8am-5pm. <a href="tentang.html#hubungi">Halaman Hubungi</a>'},
    {keys:['lupa','reset','password','kata laluan'],reply:'Untuk reset kata laluan, hubungi psh@kkbm.edu.my atau 04-538 2222. Kami bantu dalam 1 hari bekerja. 🔑'},
    {keys:['cart','troli'],reply:'Tambah kursus ke cart dari halaman detail kursus, kemudian checkout di <a href="cart.html">Cart</a>. 🛒'},
    {keys:['progress','kemajuan'],reply:'Semak kemajuan kursus di <a href="dashboard-pelajar.html">Dashboard</a>. Klik "Teruskan" untuk sambung modul. 📊'},
    {keys:['penyedia','instructor','pensyarah','bina modul'],reply:'Penyedia kursus boleh bina modul menggunakan <a href="instructor.html">Instructor Studio</a> — dengan bantuan AI! ✏️'},
  ];

  function getBotReply(msg) {
    var lower = msg.toLowerCase();
    for (var i = 0; i < KB.length; i++) {
      for (var j = 0; j < KB[i].keys.length; j++) {
        if (lower.indexOf(KB[i].keys[j]) >= 0) return KB[i].reply;
      }
    }
    return 'Terima kasih! 😊 Untuk pertanyaan lanjut, lawati <a href="ai-helpdesk.html">AI Helpdesk</a> penuh atau hubungi <strong>psh@kkbm.edu.my</strong>.';
  }

  function buildChatbot() {
    var user = null;
    try { user = JSON.parse(localStorage.getItem('kkbm_user') || 'null'); } catch (e) {}
    var initials = user ? user.nama.charAt(0).toUpperCase() : '?';

    // FAB button
    var fab = document.createElement('button');
    fab.id = 'chatbot-fab';
    fab.setAttribute('aria-label', 'Buka AI Helpdesk');
    fab.setAttribute('data-tooltip', 'AI Helpdesk (Ctrl+/)');
    fab.innerHTML = '🤖';
    fab.onclick = togglePanel;

    // Panel
    var panel = document.createElement('div');
    panel.id = 'chatbot-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'AI Helpdesk Chat');
    panel.innerHTML =
      '<div class="chatbot-header">' +
        '<div class="chatbot-header-left">' +
          '<div class="chatbot-avatar">🤖</div>' +
          '<div><div class="chatbot-title">KomunitiKu AI</div><div class="chatbot-subtitle">● Online — Sedia membantu</div></div>' +
        '</div>' +
        '<button class="chatbot-close" onclick="document.getElementById(\'chatbot-panel\').classList.remove(\'open\')" aria-label="Tutup">✕</button>' +
      '</div>' +
      '<div class="chatbot-messages" id="cb-msgs">' +
        '<div class="cb-msg"><div class="cb-avatar bot">🤖</div><div class="cb-bubble bot">Hai! Saya AI KomunitiKu. Boleh saya bantu? 😊<br/>Cuba tanya: <em>kursus percuma</em>, <em>cara daftar</em>, atau <em>sijil</em>.</div></div>' +
      '</div>' +
      '<div class="chatbot-quick">' +
        '<button onclick="cbSend(\'Kursus percuma apa ada?\')">Kursus percuma</button>' +
        '<button onclick="cbSend(\'Cara daftar kursus?\')">Cara daftar</button>' +
        '<button onclick="cbSend(\'Bila boleh dapat sijil?\')">Pasal sijil</button>' +
      '</div>' +
      '<div class="chatbot-input-row">' +
        '<input class="chatbot-input" id="cb-input" placeholder="Taip soalan..." onkeydown="if(event.key===\'Enter\')cbSendInput()" aria-label="Taip soalan anda"/>' +
        '<button class="chatbot-send" onclick="cbSendInput()" aria-label="Hantar">▶</button>' +
      '</div>';

    document.body.appendChild(fab);
    document.body.appendChild(panel);

    window.togglePanel = function () {
      panel.classList.toggle('open');
      if (panel.classList.contains('open')) {
        setTimeout(function () { document.getElementById('cb-input').focus(); }, 100);
      }
    };

    var nowTime = function () { return new Date().toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit' }); };

    window.cbSend = function (msg) {
      var msgs = document.getElementById('cb-msgs');
      // User bubble
      var uDiv = document.createElement('div');
      uDiv.className = 'cb-msg user';
      uDiv.innerHTML = '<div class="cb-avatar user">' + initials + '</div><div class="cb-bubble user">' + msg + '</div>';
      msgs.appendChild(uDiv);
      // Typing
      var typing = document.createElement('div');
      typing.className = 'cb-msg';
      typing.id = 'cb-typing';
      typing.innerHTML = '<div class="cb-avatar bot">🤖</div><div class="cb-bubble bot"><span style="display:flex;gap:3px;align-items:center;"><span style="width:5px;height:5px;background:var(--teal);border-radius:50%;animation:bounce 1.2s infinite;"></span><span style="width:5px;height:5px;background:var(--teal);border-radius:50%;animation:bounce 1.2s 0.2s infinite;"></span><span style="width:5px;height:5px;background:var(--teal);border-radius:50%;animation:bounce 1.2s 0.4s infinite;"></span></span></div>';
      msgs.appendChild(typing);
      msgs.scrollTop = msgs.scrollHeight;
      setTimeout(function () {
        var t = document.getElementById('cb-typing');
        if (t) t.remove();
        var bDiv = document.createElement('div');
        bDiv.className = 'cb-msg';
        bDiv.innerHTML = '<div class="cb-avatar bot">🤖</div><div class="cb-bubble bot">' + getBotReply(msg) + '</div>';
        msgs.appendChild(bDiv);
        msgs.scrollTop = msgs.scrollHeight;
      }, 700 + Math.random() * 500);
    };

    window.cbSendInput = function () {
      var input = document.getElementById('cb-input');
      var msg = input.value.trim();
      if (!msg) return;
      input.value = '';
      cbSend(msg);
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildChatbot);
  } else {
    buildChatbot();
  }
})();
