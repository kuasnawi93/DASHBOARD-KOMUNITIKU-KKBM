/**
 * KomunitiKu @ KKBM — AI Genie Widget
 * Floating assistant that helps site visitors discover courses based on their interests.
 * Include this script on any public page: <script src="ai-genie.js"></script>
 */
(function () {
  'use strict';

  /* ── Course catalogue ── */
  var COURSES = [
    { id: 1, title: 'Asas Literasi Digital', tags: ['komputer', 'internet', 'digital', 'teknologi', 'asas', 'pemula', 'awam', 'umum', 'siber'], type: 'percuma', mod: 'online', desc: 'Kemahiran komputer & internet untuk kehidupan harian.' },
    { id: 2, title: 'Microsoft Excel Intermediate', tags: ['excel', 'data', 'pejabat', 'kerja', 'akaun', 'spreadsheet', 'analisis', 'perakaunan', 'admin'], type: 'berbayar', mod: 'f2f', desc: 'Fungsi lanjutan Excel untuk keperluan kerja dan analisis data.' },
    { id: 3, title: 'Reka Bentuk Grafik Asas', tags: ['grafik', 'reka bentuk', 'canva', 'kreatif', 'seni', 'poster', 'visual', 'design', 'content'], type: 'percuma', mod: 'online', desc: 'Reka bentuk grafik profesional menggunakan Canva dan Adobe Express.' },
    { id: 4, title: 'e-Dagang untuk Usahawan', tags: ['shopee', 'online', 'jualan', 'bisnes', 'usahawan', 'perniagaan', 'ecommerce', 'tiktok', 'lazada'], type: 'berbayar', mod: 'f2f', desc: 'Jana pendapatan melalui platform e-dagang seperti Shopee & TikTok Shop.' },
    { id: 5, title: 'Pengurusan Media Sosial', tags: ['instagram', 'facebook', 'tiktok', 'media sosial', 'marketing', 'pemasaran', 'kandungan', 'influencer', 'branding'], type: 'percuma', mod: 'online', desc: 'Strategi kandungan berkesan untuk meningkatkan kehadiran perniagaan anda.' },
    { id: 6, title: 'Keusahawanan Makanan & Minuman', tags: ['makanan', 'minuman', 'fnb', 'masak', 'restoran', 'katering', 'halal', 'produk', 'usahawan'], type: 'berbayar', mod: 'f2f', desc: 'Dari pelesenan halal hingga pemasaran produk makanan & minuman.' }
  ];

  /* ── Genie responses ── */
  var GREETINGS = [
    'Assalamualaikum! 👋 Saya <strong>AI Genie KKBM</strong> — pembantu pintar anda untuk mencari kursus yang sesuai. Beritahu saya minat anda, contoh: <em>"saya suka masak"</em>, <em>"nak belajar bisnes online"</em> atau <em>"minat grafik"</em>.',
    'Hai! Saya AI Genie KKBM 🧞 Nak tahu kursus apa yang sesuai dengan minat anda? Ceritakan sikit tentang diri anda atau apa yang anda ingin pelajari!'
  ];

  var UNKNOWN = [
    'Hmm, saya tak pasti dengan jawapan spesifik tu 🤔 Cuba tanya tentang minat anda seperti <em>"suka bisnes"</em>, <em>"nak belajar komputer"</em> atau <em>"minat memasak"</em>!',
    'Saya AI Genie yang fokus pada kursus KKBM 🧞 Cuba sebut bidang minat anda dan saya akan cadangkan kursus terbaik!',
    'Boleh ceritakan lebih tentang apa yang anda suka atau nak capai? Saya akan carikan kursus yang paling sesuai untuk anda! 😊'
  ];

  var INTEREST_REPLIES = {
    komputer: 'Bagus! Anda berminat dalam teknologi digital 💻 Ini kursus yang sesuai untuk anda:',
    bisnes: 'Semangat usahawan tu bagus! 🚀 Cuba tengok kursus-kursus ini:',
    masak: 'Suka masakan? Jom kembangkan jadi perniagaan! 🍳 Kursus ini sesuai untuk anda:',
    grafik: 'Jiwa kreatif! 🎨 Kursus reka bentuk ini akan sesuai dengan anda:',
    sosial: 'Nak kuasai media sosial? 📱 Kursus ni memang untuk anda:',
    default: 'Berdasarkan minat anda, ini kursus yang saya cadangkan:'
  };

  /* ── Keyword → interest mapping ── */
  var KEYWORD_MAP = {
    komputer: ['komputer', 'internet', 'digital', 'teknologi', 'it', 'siber', 'coding', 'asas', 'pemula'],
    bisnes: ['bisnes', 'perniagaan', 'usahawan', 'shopee', 'lazada', 'tiktok', 'jualan', 'ecommerce', 'online', 'duit', 'pendapatan', 'untung'],
    masak: ['masak', 'makanan', 'minuman', 'fnb', 'restoran', 'katering', 'halal', 'produk'],
    grafik: ['grafik', 'reka bentuk', 'canva', 'kreatif', 'seni', 'design', 'visual', 'poster', 'logo'],
    sosial: ['instagram', 'facebook', 'tiktok', 'media sosial', 'marketing', 'pemasaran', 'kandungan', 'influencer', 'branding', 'sosial']
  };

  /* ── Interest quiz flow ── */
  var QUIZ_STEPS = [
    { key: 'goal', q: 'Apa matlamat utama anda? 🎯', opts: ['💼 Cari kerja / tingkat kemahiran', '🚀 Mulakan atau kembangkan bisnes', '📚 Belajar untuk diri sendiri', '👩‍💻 Beralih ke bidang baru'] },
    { key: 'style', q: 'Pilihan mod pembelajaran anda?', opts: ['💻 Online (belajar sendiri)', '🏫 Bersemuka (F2F di kolej)', '🤷 Tak kisah, mana-mana sesuai'] },
    { key: 'interest', q: 'Bidang yang paling menarik minat anda?', opts: ['🍳 Makanan & Minuman', '📱 Media Sosial & Marketing', '🎨 Reka Bentuk Kreatif', '💰 Perniagaan & e-Dagang', '💻 Komputer & Teknologi'] }
  ];

  /* ── State ── */
  var state = { open: false, quiz: false, quizStep: 0, answers: {}, history: [], pulse: null };

  /* ── Inject CSS ── */
  var style = document.createElement('style');
  style.textContent = [
    '#genie-btn{position:fixed;bottom:28px;right:28px;z-index:9999;width:60px;height:60px;border-radius:50%;background:linear-gradient(135deg,#0d9488,#14b8a6);border:2px solid rgba(45,212,191,0.4);box-shadow:0 4px 20px rgba(20,184,166,0.45);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:26px;transition:transform 0.2s,box-shadow 0.2s;animation:genie-idle 3s ease-in-out infinite;}',
    '#genie-btn:hover{transform:scale(1.12);box-shadow:0 6px 28px rgba(20,184,166,0.6);}',
    '@keyframes genie-idle{0%,100%{transform:translateY(0);}50%{transform:translateY(-5px);}}',
    '#genie-badge{position:absolute;top:-4px;right:-4px;width:18px;height:18px;background:#f59e0b;border-radius:50%;font-size:10px;font-weight:800;color:#fff;display:flex;align-items:center;justify-content:center;border:2px solid #0d1117;}',
    '#genie-panel{position:fixed;bottom:100px;right:28px;z-index:9998;width:360px;max-width:calc(100vw - 40px);background:#161b22;border:1px solid #2d3748;border-radius:20px;box-shadow:0 8px 40px rgba(0,0,0,0.6);display:none;flex-direction:column;overflow:hidden;animation:genie-in 0.25s ease;}',
    '@keyframes genie-in{from{opacity:0;transform:translateY(12px) scale(0.97);}to{opacity:1;transform:none;}}',
    '#genie-panel.open{display:flex;}',
    '#genie-head{background:linear-gradient(135deg,#0a2420,#0f2d3a);padding:16px 18px;display:flex;align-items:center;gap:12px;border-bottom:1px solid #2d3748;flex-shrink:0;}',
    '#genie-head .gh-avatar{width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#0d9488,#14b8a6);display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;}',
    '#genie-head .gh-info .gh-name{font-size:14px;font-weight:800;color:#fff;}',
    '#genie-head .gh-info .gh-status{font-size:11px;color:#2dd4bf;display:flex;align-items:center;gap:4px;}',
    '#genie-head .gh-info .gh-status::before{content:"";width:6px;height:6px;background:#4ade80;border-radius:50%;display:inline-block;}',
    '#genie-head .gh-close{margin-left:auto;background:transparent;border:none;color:#8b949e;font-size:18px;cursor:pointer;padding:4px;border-radius:6px;line-height:1;}',
    '#genie-head .gh-close:hover{color:#e2e8f0;}',
    '#genie-msgs{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px;max-height:320px;min-height:180px;}',
    '#genie-msgs::-webkit-scrollbar{width:4px;}#genie-msgs::-webkit-scrollbar-track{background:transparent;}#genie-msgs::-webkit-scrollbar-thumb{background:#2d3748;border-radius:2px;}',
    '.gm-ai,.gm-user{display:flex;gap:8px;align-items:flex-start;}',
    '.gm-user{flex-direction:row-reverse;}',
    '.gm-av{width:28px;height:28px;border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;flex-shrink:0;}',
    '.gm-av.ai{background:linear-gradient(135deg,#0d9488,#14b8a6);color:#fff;}',
    '.gm-av.user{background:#1e3a5f;color:#93c5fd;}',
    '.gm-bub{max-width:82%;padding:10px 13px;border-radius:12px;font-size:13px;line-height:1.6;}',
    '.gm-bub.ai{background:#0d1f1e;border:1px solid rgba(20,184,166,0.2);color:#e2e8f0;}',
    '.gm-bub.user{background:#1e3a5f;border:1px solid rgba(147,197,253,0.2);color:#e2e8f0;}',
    '.gm-bub a{color:#2dd4bf;}',
    '.gm-opts{display:flex;flex-direction:column;gap:6px;margin-top:8px;}',
    '.gm-opt-btn{background:#161b22;border:1px solid #2d3748;color:#e2e8f0;font-size:12px;padding:8px 12px;border-radius:9px;cursor:pointer;text-align:left;transition:border-color 0.2s,color 0.2s;}',
    '.gm-opt-btn:hover{border-color:#14b8a6;color:#2dd4bf;}',
    '.gm-course-card{background:#0d1117;border:1px solid #2d3748;border-radius:10px;padding:12px;margin-top:4px;transition:border-color 0.2s;}',
    '.gm-course-card:hover{border-color:#14b8a6;}',
    '.gm-course-card .gcc-title{font-size:13px;font-weight:700;color:#fff;margin-bottom:3px;}',
    '.gm-course-card .gcc-desc{font-size:11px;color:#8b949e;line-height:1.5;}',
    '.gm-course-card .gcc-tags{display:flex;gap:5px;margin-top:7px;flex-wrap:wrap;}',
    '.gm-course-card .gcc-tag{font-size:9px;font-weight:700;padding:2px 7px;border-radius:999px;letter-spacing:0.05em;text-transform:uppercase;}',
    '.gcc-tag.percuma{background:#0d2926;color:#2dd4bf;}',
    '.gcc-tag.berbayar{background:#2d1f03;color:#fbbf24;}',
    '.gcc-tag.online{background:#1a1f3a;color:#93c5fd;}',
    '.gcc-tag.f2f{background:#2d1a2d;color:#c4b5fd;}',
    '.gcc-tag.hybrid{background:#1a2a1a;color:#4ade80;}',
    '.gcc-link{display:inline-block;margin-top:8px;font-size:11px;font-weight:700;color:#14b8a6;text-decoration:none;}',
    '.gcc-link:hover{text-decoration:underline;}',
    '.gm-typing{display:flex;align-items:center;gap:4px;padding:6px 2px;}',
    '.gm-typing span{width:5px;height:5px;background:#14b8a6;border-radius:50%;animation:gt-bounce 1.1s infinite;}',
    '.gm-typing span:nth-child(2){animation-delay:0.18s;}',
    '.gm-typing span:nth-child(3){animation-delay:0.36s;}',
    '@keyframes gt-bounce{0%,60%,100%{transform:translateY(0);}30%{transform:translateY(-5px);}}',
    '#genie-footer{padding:10px 12px;border-top:1px solid #2d3748;display:flex;gap:8px;align-items:center;flex-shrink:0;}',
    '#genie-input{flex:1;background:#0d1117;border:1px solid #2d3748;border-radius:10px;padding:9px 12px;color:#e2e8f0;font-size:13px;outline:none;font-family:inherit;resize:none;height:38px;transition:border-color 0.2s;}',
    '#genie-input:focus{border-color:#14b8a6;}',
    '#genie-send{background:#14b8a6;color:#fff;border:none;border-radius:9px;padding:9px 14px;font-weight:700;font-size:13px;cursor:pointer;transition:background 0.2s;flex-shrink:0;}',
    '#genie-send:hover{background:#0d9488;}',
    '#genie-quiz-btns{padding:0 12px 12px;display:flex;flex-direction:column;gap:6px;}',
    '.gq-btn{background:#0d1117;border:1px solid #2d3748;color:#e2e8f0;font-size:13px;padding:10px 14px;border-radius:10px;cursor:pointer;text-align:left;transition:border-color 0.2s,background 0.2s;}',
    '.gq-btn:hover{border-color:#14b8a6;background:#0d2926;color:#2dd4bf;}',
    '#genie-quick{padding:0 12px 10px;display:flex;gap:6px;flex-wrap:wrap;}',
    '.gq-quick{background:#0d1117;border:1px solid #2d3748;color:#8b949e;font-size:11px;padding:5px 11px;border-radius:999px;cursor:pointer;transition:all 0.2s;}',
    '.gq-quick:hover{border-color:#14b8a6;color:#2dd4bf;}'
  ].join('');
  document.head.appendChild(style);

  /* ── Build DOM ── */
  var btn = document.createElement('div');
  btn.id = 'genie-btn';
  btn.setAttribute('role', 'button');
  btn.setAttribute('aria-label', 'Buka AI Genie');
  btn.setAttribute('tabindex', '0');
  btn.innerHTML = '🧞<div id="genie-badge">1</div>';

  var panel = document.createElement('div');
  panel.id = 'genie-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'AI Genie Kursus');
  panel.innerHTML = [
    '<div id="genie-head">',
      '<div class="gh-avatar">🧞</div>',
      '<div class="gh-info">',
        '<div class="gh-name">AI Genie KKBM</div>',
        '<div class="gh-status">Online &bull; Sedia Membantu</div>',
      '</div>',
      '<button class="gh-close" id="genie-close" aria-label="Tutup">✕</button>',
    '</div>',
    '<div id="genie-msgs"></div>',
    '<div id="genie-quick">',
      '<button class="gq-quick" onclick="window.__genieQuick(\'komputer\')">💻 Teknologi</button>',
      '<button class="gq-quick" onclick="window.__genieQuick(\'bisnes\')">🚀 Bisnes</button>',
      '<button class="gq-quick" onclick="window.__genieQuick(\'masak\')">🍳 F&B</button>',
      '<button class="gq-quick" onclick="window.__genieQuick(\'grafik\')">🎨 Grafik</button>',
      '<button class="gq-quick" onclick="window.__genieQuick(\'sosial\')">📱 Sosial</button>',
    '</div>',
    '<div id="genie-quiz-btns" style="display:none;"></div>',
    '<div id="genie-footer">',
      '<input id="genie-input" placeholder="Taip minat anda..." aria-label="Taip mesej"/>',
      '<button id="genie-send" aria-label="Hantar">↑</button>',
    '</div>'
  ].join('');

  document.body.appendChild(btn);
  document.body.appendChild(panel);

  /* ── Helpers ── */
  function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function now() { var d = new Date(); return d.getHours() + ':' + ('0' + d.getMinutes()).slice(-2); }
  function scrollBottom() { var m = document.getElementById('genie-msgs'); if (m) m.scrollTop = m.scrollHeight; }
  function genieMsg(html, opts) {
    var msgs = document.getElementById('genie-msgs');
    if (!msgs) return;
    var row = document.createElement('div');
    row.className = 'gm-ai';
    row.innerHTML = '<div class="gm-av ai">🧞</div><div><div class="gm-bub ai">' + html + '</div>' + (opts ? renderOpts(opts) : '') + '</div>';
    msgs.appendChild(row);
    scrollBottom();
  }
  function userMsg(text) {
    var msgs = document.getElementById('genie-msgs');
    if (!msgs) return;
    var row = document.createElement('div');
    row.className = 'gm-user';
    row.innerHTML = '<div class="gm-av user">👤</div><div class="gm-bub user">' + escHtml(text) + '</div>';
    msgs.appendChild(row);
    scrollBottom();
  }
  function renderOpts(opts) {
    return '<div class="gm-opts">' + opts.map(function (o) {
      return '<button class="gm-opt-btn" onclick="window.__genieOpt(\'' + escAttr(o) + '\')">' + escHtml(o) + '</button>';
    }).join('') + '</div>';
  }
  function typingMsg(cb) {
    var msgs = document.getElementById('genie-msgs');
    if (!msgs) return;
    var row = document.createElement('div');
    row.className = 'gm-ai';
    row.id = 'genie-typing-row';
    row.innerHTML = '<div class="gm-av ai">🧞</div><div class="gm-bub ai"><div class="gm-typing"><span></span><span></span><span></span></div></div>';
    msgs.appendChild(row);
    scrollBottom();
    setTimeout(function () {
      var r = document.getElementById('genie-typing-row');
      if (r) r.parentNode.removeChild(r);
      cb();
    }, 900);
  }
  function escHtml(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function escAttr(s) { return String(s).replace(/'/g, '&#39;'); }

  function renderCourseCards(courses) {
    if (!courses.length) return '<em>Tiada kursus yang sepadan dijumpai.</em>';
    return courses.map(function (c) {
      var modLabel = c.mod === 'online' ? 'Online' : c.mod === 'f2f' ? 'Bersemuka' : 'Hybrid';
      return '<div class="gm-course-card">' +
        '<div class="gcc-title">' + escHtml(c.title) + '</div>' +
        '<div class="gcc-desc">' + escHtml(c.desc) + '</div>' +
        '<div class="gcc-tags">' +
          '<span class="gcc-tag ' + c.type + '">' + (c.type === 'percuma' ? 'Percuma' : 'Berbayar') + '</span>' +
          '<span class="gcc-tag ' + c.mod + '">' + modLabel + '</span>' +
        '</div>' +
        '<a class="gcc-link" href="kursus-detail.html?id=' + c.id + '">Lihat Kursus →</a>' +
      '</div>';
    }).join('');
  }

  /* ── Detect interest from text ── */
  function detectInterest(text) {
    var lower = text.toLowerCase();
    var scores = {};
    Object.keys(KEYWORD_MAP).forEach(function (interest) {
      KEYWORD_MAP[interest].forEach(function (kw) {
        if (lower.indexOf(kw) >= 0) scores[interest] = (scores[interest] || 0) + 1;
      });
    });
    var best = null, bestScore = 0;
    Object.keys(scores).forEach(function (k) {
      if (scores[k] > bestScore) { bestScore = scores[k]; best = k; }
    });
    return best;
  }

  /* ── Find matching courses ── */
  function findCourses(interest) {
    if (!interest) return [];
    var keywords = KEYWORD_MAP[interest] || [];
    return COURSES.filter(function (c) {
      return c.tags.some(function (t) { return keywords.indexOf(t) >= 0; });
    });
  }

  /* ── Handle user input ── */
  function handleInput(text) {
    if (!text.trim()) return;
    userMsg(text);
    document.getElementById('genie-input').value = '';
    typingMsg(function () {
      var interest = detectInterest(text);
      if (interest) {
        var courses = findCourses(interest);
        var reply = INTEREST_REPLIES[interest] || INTEREST_REPLIES.default;
        genieMsg(reply + '<br/>' + renderCourseCards(courses));
        genieMsg('Ada minat lain yang nak saya bantu terokai? 😊 Atau klik <a href="kursus.html">lihat semua kursus →</a>');
      } else if (/sijil|certificate/i.test(text)) {
        genieMsg('Sijil rasmi KKBM akan dijana automatik selepas anda lulus kursus (markah ≥ 70%). Log masuk dan pergi ke Dashboard untuk muat turun sijil anda. 🏆');
      } else if (/daftar|register|sign up/i.test(text)) {
        genieMsg('Senang je! 😊<br/>1. Klik <a href="daftar.html">Daftar Sekarang</a><br/>2. Isi nama, emel & kawasan<br/>3. Pilih kursus dan daftar!<br/>Kursus percuma boleh terus daftar tanpa bayaran.');
      } else if (/harga|bayar|kos|free|percuma/i.test(text)) {
        var free = COURSES.filter(function (c) { return c.type === 'percuma'; });
        var paid = COURSES.filter(function (c) { return c.type === 'berbayar'; });
        genieMsg('Kami ada <strong>' + free.length + ' kursus percuma</strong> dan <strong>' + paid.length + ' kursus berbayar</strong> (RM 60–RM 120).<br/>' +
          '<strong>Percuma:</strong> ' + free.map(function(c){return c.title;}).join(', ') + '<br/>' +
          '<a href="kursus.html">Terokai semua kursus →</a>');
      } else if (/salam|hello|hai|hi|apa khabar/i.test(text)) {
        genieMsg(rand(GREETINGS));
      } else {
        genieMsg(rand(UNKNOWN));
      }
    });
  }

  /* ── Quiz flow ── */
  function startQuiz() {
    state.quiz = true;
    state.quizStep = 0;
    state.answers = {};
    showQuizStep();
  }

  function showQuizStep() {
    var step = QUIZ_STEPS[state.quizStep];
    if (!step) { finishQuiz(); return; }
    var qBtns = document.getElementById('genie-quiz-btns');
    var footer = document.getElementById('genie-footer');
    var quick = document.getElementById('genie-quick');
    if (qBtns) { qBtns.style.display = 'flex'; qBtns.innerHTML = step.opts.map(function (o) { return '<button class="gq-btn" onclick="window.__genieQuizAns(\'' + escAttr(o) + '\')">' + escHtml(o) + '</button>'; }).join(''); }
    if (footer) footer.style.display = 'none';
    if (quick) quick.style.display = 'none';
    genieMsg(step.q);
  }

  function finishQuiz() {
    state.quiz = false;
    var qBtns = document.getElementById('genie-quiz-btns');
    var footer = document.getElementById('genie-footer');
    var quick = document.getElementById('genie-quick');
    if (qBtns) { qBtns.style.display = 'none'; qBtns.innerHTML = ''; }
    if (footer) footer.style.display = 'flex';
    if (quick) quick.style.display = 'flex';

    // Determine best matches from quiz answers
    var interest = null;
    var interestAns = state.answers['interest'] || '';
    if (/Makanan/i.test(interestAns)) interest = 'masak';
    else if (/Media Sosial/i.test(interestAns)) interest = 'sosial';
    else if (/Reka Bentuk/i.test(interestAns)) interest = 'grafik';
    else if (/Perniagaan|e-Dagang/i.test(interestAns)) interest = 'bisnes';
    else if (/Komputer|Teknologi/i.test(interestAns)) interest = 'komputer';

    var modPref = state.answers['style'] || '';
    var goalAns = state.answers['goal'] || '';

    typingMsg(function () {
      var courses = interest ? findCourses(interest) : COURSES.slice(0, 3);
      // Filter by mod preference if specified
      if (/Online/i.test(modPref)) courses = courses.filter(function(c){return c.mod==='online';}).concat(courses.filter(function(c){return c.mod!=='online';})).slice(0,3);
      else if (/Bersemuka/i.test(modPref)) courses = courses.filter(function(c){return c.mod==='f2f';}).concat(courses.filter(function(c){return c.mod!=='f2f';})).slice(0,3);

      var intro = 'Berdasarkan jawapan anda, saya cadangkan kursus-kursus ini yang paling sesuai! ✨';
      if (/kerja/i.test(goalAns)) intro = 'Untuk tingkatkan kemahiran kerja, kursus-kursus ini sangat sesuai untuk anda! 💼';
      else if (/bisnes/i.test(goalAns)) intro = 'Wah, jiwa usahawan! 🚀 Kursus-kursus ini akan bantu bisnes anda berkembang:';

      genieMsg(intro + '<br/>' + renderCourseCards(courses.slice(0, 3)));
      genieMsg('Nak tahu lebih? <a href="kursus.html">Terokai semua kursus →</a> atau taip minat lain!');
    });
  }

  /* ── Global handlers ── */
  window.__genieOpt = function (opt) {
    if (state.quiz) {
      window.__genieQuizAns(opt);
    } else {
      handleInput(opt);
    }
  };

  window.__genieQuizAns = function (ans) {
    var step = QUIZ_STEPS[state.quizStep];
    if (step) {
      state.answers[step.key] = ans;
      userMsg(ans);
      state.quizStep++;
      if (state.quizStep < QUIZ_STEPS.length) {
        typingMsg(showQuizStep);
      } else {
        var qBtns = document.getElementById('genie-quiz-btns');
        if (qBtns) { qBtns.style.display = 'none'; qBtns.innerHTML = ''; }
        finishQuiz();
      }
    }
  };

  window.__genieQuick = function (interest) {
    userMsg({ komputer: '💻 Minat Teknologi', bisnes: '🚀 Minat Bisnes', masak: '🍳 Minat F&B', grafik: '🎨 Minat Grafik', sosial: '📱 Minat Media Sosial' }[interest] || interest);
    typingMsg(function () {
      var courses = findCourses(interest);
      var reply = INTEREST_REPLIES[interest] || INTEREST_REPLIES.default;
      genieMsg(reply + '<br/>' + renderCourseCards(courses));
      genieMsg('Ada minat lain? Klik pilihan di atas atau taip terus! 😊');
    });
  };

  /* ── Toggle panel ── */
  function openGenie() {
    state.open = true;
    panel.classList.add('open');
    btn.style.animation = 'none';
    document.getElementById('genie-badge').style.display = 'none';
    if (!state.history.length) {
      // Welcome message
      var msgs = document.getElementById('genie-msgs');
      if (msgs) msgs.innerHTML = '';
      typingMsg(function () {
        genieMsg(rand(GREETINGS), [
          '🎯 Bantu saya cari kursus yang sesuai',
          '💰 Tunjukkan kursus percuma',
          '📋 Cara daftar kursus'
        ]);
      });
    }
    var input = document.getElementById('genie-input');
    if (input) setTimeout(function () { input.focus(); }, 300);
  }

  function closeGenie() {
    state.open = false;
    panel.classList.remove('open');
    btn.style.animation = 'genie-idle 3s ease-in-out infinite';
  }

  btn.addEventListener('click', function () { state.open ? closeGenie() : openGenie(); });
  btn.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); state.open ? closeGenie() : openGenie(); } });

  var closeBtn = document.getElementById('genie-close');
  if (closeBtn) closeBtn.addEventListener('click', closeGenie);

  var sendBtn = document.getElementById('genie-send');
  var inputEl = document.getElementById('genie-input');
  function doSend() { var v = inputEl ? inputEl.value.trim() : ''; if (v) handleInput(v); }
  if (sendBtn) sendBtn.addEventListener('click', doSend);
  if (inputEl) inputEl.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); doSend(); } });

  // Handle option buttons from welcome
  window.__genieOpt = function (opt) {
    if (/cari kursus/i.test(opt)) {
      userMsg(opt);
      typingMsg(startQuiz);
    } else if (/percuma/i.test(opt)) {
      handleInput('kursus percuma');
    } else if (/cara daftar/i.test(opt)) {
      handleInput('cara daftar kursus');
    } else if (state.quiz) {
      window.__genieQuizAns(opt);
    } else {
      handleInput(opt);
    }
  };

  // Close on outside click
  document.addEventListener('click', function (e) {
    if (state.open && !panel.contains(e.target) && !btn.contains(e.target)) closeGenie();
  });

  // Pulse badge after 4s to attract attention
  state.pulse = setTimeout(function () {
    var badge = document.getElementById('genie-badge');
    if (badge && !state.open) {
      badge.textContent = '!';
      badge.style.background = '#14b8a6';
    }
  }, 4000);

})();
