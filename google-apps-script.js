// ============================================================
//  KomunitiKu @ KKBM — Google Apps Script Webhook
//  Paste ALL of this code into your Google Apps Script editor.
//
//  HOW TO DEPLOY:
//  1. Open https://script.google.com  → New Project
//  2. Paste this entire file into the editor (replace default code)
//  3. Replace SHEET_ID below with your Google Sheets document ID
//  4. Click "Deploy" → "New Deployment"
//     - Type: Web App
//     - Execute as: Me
//     - Who has access: Anyone
//  5. Authorise permissions when prompted
//  6. Copy the Web App URL  →  paste into daftar.html as SHEETS_WEBHOOK
//     and set  ENABLE_SHEETS = true
// ============================================================

// ─── CONFIG ─────────────────────────────────────────────────
const SHEET_ID   = 'PASTE_YOUR_GOOGLE_SHEET_ID_HERE';  // ← CHANGE THIS
const SHEET_NAME = 'Pendaftaran';  // Tab name (will be auto-created)
// ────────────────────────────────────────────────────────────


/**
 * Handles HTTP POST from daftar.html
 * Called automatically by Google Apps Script when the Web App receives a POST.
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    saveToSheet(data);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok', message: 'Data saved.' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}


/**
 * Handles HTTP GET — useful for testing the endpoint is alive.
 * Visit the Web App URL in a browser to verify deployment.
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'KomunitiKu @ KKBM webhook is running.' }))
    .setMimeType(ContentService.MimeType.JSON);
}


/**
 * Writes one registration row to the Google Sheet.
 * Auto-creates the sheet tab and header row on first run.
 */
function saveToSheet(data) {
  const ss    = SpreadsheetApp.openById(SHEET_ID);
  let   sheet = ss.getSheetByName(SHEET_NAME);

  // Create the sheet tab if it does not exist yet
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow([
      'Timestamp',
      'Nama Penuh',
      'No. IC',
      'Emel',
      'No. Telefon',
      'Tarikh Lahir',
      'Jantina',
      'Alamat',
      'Bandar',
      'Negeri',
      'Poskod',
      'Tahap Pendidikan',
      'Status Pekerjaan',
      'Kursus Pilihan',
      'Mod Kursus',
      'Sumber Maklumat',
      'Catatan',
    ]);

    // Style the header row
    const header = sheet.getRange(1, 1, 1, 17);
    header.setBackground('#14b8a6');
    header.setFontColor('#0d1117');
    header.setFontWeight('bold');
    sheet.setFrozenRows(1);
  }

  // Map incoming JSON fields to columns
  sheet.appendRow([
    new Date().toLocaleString('ms-MY', { timeZone: 'Asia/Kuala_Lumpur' }),
    data.nama          || '',
    data.ic            || '',
    data.emel          || '',
    data.telefon       || '',
    data.tarikh_lahir  || '',
    data.jantina       || '',
    data.alamat        || '',
    data.bandar        || '',
    data.negeri        || '',
    data.poskod        || '',
    data.pendidikan    || '',
    data.pekerjaan     || '',
    data.kursus        || '',
    data.mod           || '',
    data.sumber        || '',
    data.catatan       || '',
  ]);
}
