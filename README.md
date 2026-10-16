# KomunitiKu @ KKBM
**Platform Pembelajaran Sepanjang Hayat (PSH) — Kolej Komuniti Bukit Mertajam**

> A fully static, multi-role learning platform deployable to **GitHub Pages** for free.  
> Registration data is captured via **FormSubmit** (email) and **Google Sheets** (Apps Script webhook).

---

## 📁 Project Structure

```
komunitiku-kkbm/
│
├── SHARED ASSETS
│   ├── logo.js              SVG logo — icon + full wordmark
│   ├── nav.js               Role-aware shared navigation bar
│   ├── nav.css              Navigation styles
│   ├── design.css           Design system (Shneiderman 8 Golden Rules)
│   └── ui.js                Toast, confirm dialogs, chatbot widget, inline validation
│
├── PUBLIC PAGES
│   ├── index.html           Entry point (redirects to landing.html)
│   ├── landing.html         Animated landing page (particles + scroll reveal)
│   ├── kursus.html          Course catalogue with filter
│   ├── kursus-detail.html   Course detail + enroll + add to cart
│   ├── tentang.html         About KKBM + contact
│   └── logo-preview.html    Logo test / preview page
│
├── AUTH
│   ├── daftar.html          Registration form (FormSubmit + Google Sheets)
│   ├── daftar-success.html  Success redirect page (confetti animation)
│   └── login.html           Login — routes by role
│
├── PELAJAR PORTAL
│   ├── dashboard-pelajar.html   Student dashboard
│   ├── profile.html             Edit profile + enrolled courses
│   ├── cart.html                Cart + checkout modal
│   ├── sijil.html               Certificate preview + print
│   └── ai-helpdesk.html         AI chatbot helpdesk
│
├── ADMIN PORTAL
│   ├── dashboard-admin.html     KPI, peserta, income chart, analytics, mode toggle
│   └── ai-agent.html            Agentic AI panel (5 modes)
│
├── INSTRUCTOR PORTAL
│   └── instructor.html          AI module builder (nota + media + assessment)
│
└── DEPLOYMENT HELPERS
    └── google-apps-script.js    Paste into Google Apps Script editor (see below)
```

---

## 🚀 Deploying to GitHub Pages

### Step 1 — Create a GitHub repository

1. Go to [github.com](https://github.com) → **New repository**
2. Name it e.g. `komunitiku-kkbm`
3. Set it to **Public**
4. Click **Create repository**

### Step 2 — Upload all files

**Option A — GitHub web UI (no Git required):**
1. Open your new repository
2. Click **Add file → Upload files**
3. Drag & drop **all files** from the `komunitiku-kkbm/` folder
4. Commit changes → **Commit directly to `main`**

**Option B — Git CLI:**
```bash
cd komunitiku-kkbm
git init
git remote add origin https://github.com/YOUR_USERNAME/komunitiku-kkbm.git
git add .
git commit -m "Initial deploy — KomunitiKu @ KKBM"
git push -u origin main
```

### Step 3 — Enable GitHub Pages

1. In your repo → **Settings → Pages**
2. Source: **Deploy from a branch**
3. Branch: **main** / `/ (root)`
4. Click **Save**
5. Wait ~2 minutes → your site will be live at:
   ```
   https://YOUR_USERNAME.github.io/komunitiku-kkbm/
   ```

---

## 📧 Setting up FormSubmit (Registration Emails)

FormSubmit is a **free** service that emails you the form data — no server needed.

### Step 1 — Edit `daftar.html`
At the top of `daftar.html`, find the CONFIG block:

```js
const FORMSUBMIT_EMAIL = 'YOUR_EMAIL@example.com'; // ← CHANGE THIS
```

Replace with the **admin email** that should receive registration notifications.

### Step 2 — Activate FormSubmit

1. Deploy your site to GitHub Pages first (Step 3 above)
2. Open the live `daftar.html` page and submit **one test registration**
3. FormSubmit will send a **confirmation email** to your admin email
4. Click **Confirm** in that email — FormSubmit is now activated
5. All future submissions will be forwarded automatically ✅

### Step 3 — Set the success redirect URL

In `daftar.html`, find:
```html
<input type="hidden" name="_next" value="https://YOUR_USERNAME.github.io/komunitiku-kkbm/daftar-success.html"/>
```
Replace `YOUR_USERNAME` with your actual GitHub username.

---

## 📊 Setting up Google Sheets (Registration Database)

This stores every registration as a row in a Google Sheet — completely free.

### Step 1 — Create a Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com) → **New spreadsheet**
2. Name it e.g. `KomunitiKu Pendaftaran`
3. Copy the **Sheet ID** from the URL:
   ```
   https://docs.google.com/spreadsheets/d/  ←SHEET_ID→  /edit
   ```

### Step 2 — Create the Apps Script webhook

1. Go to [script.google.com](https://script.google.com) → **New project**
2. Name it e.g. `KomunitiKu Webhook`
3. **Delete all existing code** in the editor
4. **Copy & paste** the entire contents of `google-apps-script.js`
5. Replace `PASTE_YOUR_GOOGLE_SHEET_ID_HERE` with your Sheet ID from Step 1
6. Click **Save** (💾)

### Step 3 — Deploy the Apps Script as a Web App

1. Click **Deploy → New Deployment**
2. Click ⚙️ gear icon → **Web App**
3. Set:
   - **Description:** KomunitiKu Webhook
   - **Execute as:** Me
   - **Who has access:** Anyone
4. Click **Deploy**
5. **Authorise permissions** (Google will ask for permission to access Sheets)
6. Copy the **Web App URL** — it looks like:
   ```
   https://script.google.com/macros/s/AKfycb.../exec
   ```

### Step 4 — Paste the webhook URL into `daftar.html`

Find the CONFIG block at the top of `daftar.html`:

```js
const SHEETS_WEBHOOK = '';          // ← PASTE YOUR WEB APP URL HERE
const ENABLE_SHEETS  = false;       // ← CHANGE TO: true
```

Change to:
```js
const SHEETS_WEBHOOK = 'https://script.google.com/macros/s/YOUR_ID/exec';
const ENABLE_SHEETS  = true;
```

### Step 5 — Verify

- Submit a test registration from the live site
- Open your Google Sheet — a new row should appear with all registration details
- The sheet tab `Pendaftaran` is **auto-created** with a teal header on first submission

---

## 👤 User Roles & Default Login (Demo)

| Role | Email | Password | Portal |
|------|-------|----------|--------|
| Pelajar | `pelajar@kkbm.edu.my` | `pelajar123` | `dashboard-pelajar.html` |
| Admin | `admin@kkbm.edu.my` | `admin123` | `dashboard-admin.html` |
| Instructor | `instructor@kkbm.edu.my` | `instructor123` | `instructor.html` |

> ⚠️ These are **demo credentials stored in `login.html`** (localStorage). For a real deployment, replace with a proper authentication backend.

---

## 🎨 Design System

All pages share `design.css` which implements **Shneiderman's 8 Golden Rules of Interface Design**:

| Rule | Implementation |
|------|---------------|
| Strive for consistency | Unified dark/teal colour palette across all pages |
| Cater to universal usability | Mobile-responsive layout, keyboard navigation |
| Offer informative feedback | Toast notifications for every user action |
| Design dialogs to yield closure | Step indicators on forms, success page after registration |
| Prevent errors | Inline validation on all form fields |
| Permit easy reversal of actions | Undo-style toasts, confirm dialogs before destructive actions |
| Keep users in control | Role-based nav so users always know where they are |
| Reduce short-term memory load | Persistent cart badge, enrolled course list in profile |

**Colour Palette:**
- Background: `#0d1117`
- Surface: `#161b22`
- Border: `#21262d`
- Primary: `#14b8a6` (teal)
- Accent: `#f97316` (orange)
- Purple: `#7c3aed`

---

## 🤖 AI Features (Simulated)

All AI features are **simulated with a knowledge base** — no API key or cost required:

| Feature | Page | Description |
|---------|------|-------------|
| AI Helpdesk | `ai-helpdesk.html` | Knowledge-base chatbot for students (FAQ + course info) |
| AI Agent | `ai-agent.html` | Admin agentic panel — diagnose, data, content, report, frontend modes |
| AI Module Builder | `instructor.html` | Auto-generates modul nota, media suggestions, and soal jawab assessments |

---

## 📱 Browser Compatibility

| Browser | Support |
|---------|---------|
| Chrome 90+ | ✅ Full |
| Firefox 88+ | ✅ Full |
| Edge 90+ | ✅ Full |
| Safari 14+ | ✅ Full |
| Mobile Chrome / Safari | ✅ Responsive |

---

## 📋 Quick Checklist Before Going Live

- [ ] Replace `FORMSUBMIT_EMAIL` in `daftar.html` with real admin email
- [ ] Replace `_next` redirect URL in `daftar.html` with real GitHub Pages URL
- [ ] Deploy to GitHub Pages and submit one test form → confirm FormSubmit email
- [ ] Create Google Sheet → deploy Apps Script → paste webhook URL into `daftar.html`
- [ ] Set `ENABLE_SHEETS = true` in `daftar.html`
- [ ] Update demo login credentials in `login.html` (or disable for production)
- [ ] Update `index.html` if needed (currently links to `landing.html`)

---

## 🏫 About

**KomunitiKu @ KKBM** is the Pembelajaran Sepanjang Hayat (PSH / Lifelong Learning) platform for **Kolej Komuniti Bukit Mertajam**, Pulau Pinang.

Built with: HTML5 · CSS3 · Vanilla JavaScript · FormSubmit · Google Apps Script · GitHub Pages

---

*Dibangunkan untuk komuniti Bukit Mertajam 💚*
