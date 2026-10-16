/**
 * KomunitiKu @ KKBM — Logo SVG component
 * Recreated from brand asset as inline SVG.
 * Usage: window.LOGO_SVG.icon(size) — just the K mark
 *        window.LOGO_SVG.full(height) — K mark + wordmark
 *        window.LOGO_SVG.favicon() — tiny 32px icon string
 */
window.LOGO_SVG = {

  /** K-mark icon only, default size 36px */
  icon: function (size) {
    size = size || 36;
    return (
      '<svg width="' + size + '" height="' + size + '" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
        '<defs>' +
          '<linearGradient id="lgStem" x1="0" y1="0" x2="0" y2="1">' +
            '<stop offset="0%" stop-color="#06b6d4"/>' +
            '<stop offset="100%" stop-color="#0ea5e9"/>' +
          '</linearGradient>' +
          '<linearGradient id="lgTop" x1="0" y1="1" x2="1" y2="0">' +
            '<stop offset="0%" stop-color="#f97316"/>' +
            '<stop offset="100%" stop-color="#ef4444"/>' +
          '</linearGradient>' +
          '<linearGradient id="lgBot" x1="0" y1="0" x2="1" y2="1">' +
            '<stop offset="0%" stop-color="#8b5cf6"/>' +
            '<stop offset="100%" stop-color="#6d28d9"/>' +
          '</linearGradient>' +
        '</defs>' +
        /* Vertical stem */
        '<rect x="14" y="10" width="16" height="80" rx="8" fill="url(#lgStem)"/>' +
        /* Top arm — angled bar from stem mid-top to upper-right */
        '<path d="M28 50 L78 12" stroke="url(#lgTop)" stroke-width="15" stroke-linecap="round"/>' +
        /* Top dot */
        '<circle cx="78" cy="12" r="9" fill="#f97316"/>' +
        /* Bottom arm — angled bar from stem mid to lower-right */
        '<path d="M28 50 L78 88" stroke="url(#lgBot)" stroke-width="15" stroke-linecap="round"/>' +
        /* Bottom dot */
        '<circle cx="78" cy="88" r="9" fill="#7c3aed"/>' +
      '</svg>'
    );
  },

  /** Full wordmark: K icon + "KomunitiKu @ KKBM" text */
  full: function (height) {
    height = height || 36;
    var iconSize = height;
    return (
      '<svg height="' + height + '" viewBox="0 0 340 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="KomunitiKu @ KKBM">' +
        '<defs>' +
          '<linearGradient id="lgStemF" x1="0" y1="0" x2="0" y2="1">' +
            '<stop offset="0%" stop-color="#06b6d4"/>' +
            '<stop offset="100%" stop-color="#0ea5e9"/>' +
          '</linearGradient>' +
          '<linearGradient id="lgTopF" x1="0" y1="1" x2="1" y2="0">' +
            '<stop offset="0%" stop-color="#f97316"/>' +
            '<stop offset="100%" stop-color="#ef4444"/>' +
          '</linearGradient>' +
          '<linearGradient id="lgBotF" x1="0" y1="0" x2="1" y2="1">' +
            '<stop offset="0%" stop-color="#8b5cf6"/>' +
            '<stop offset="100%" stop-color="#6d28d9"/>' +
          '</linearGradient>' +
        '</defs>' +
        /* K-mark */
        '<rect x="14" y="10" width="16" height="80" rx="8" fill="url(#lgStemF)"/>' +
        '<path d="M28 50 L78 12" stroke="url(#lgTopF)" stroke-width="15" stroke-linecap="round"/>' +
        '<circle cx="78" cy="12" r="9" fill="#f97316"/>' +
        '<path d="M28 50 L78 88" stroke="url(#lgBotF)" stroke-width="15" stroke-linecap="round"/>' +
        '<circle cx="78" cy="88" r="9" fill="#7c3aed"/>' +
        /* Wordmark: "Komuniti" dark, "Ku" orange */
        '<text x="104" y="58" font-family="-apple-system,\'Segoe UI\',system-ui,sans-serif" font-size="36" font-weight="800" fill="#e2e8f0">Komuniti</text>' +
        '<text x="276" y="58" font-family="-apple-system,\'Segoe UI\',system-ui,sans-serif" font-size="36" font-weight="800" fill="#f97316">Ku</text>' +
        /* Subtitle: "@ KKBM" */
        '<text x="106" y="80" font-family="-apple-system,\'Segoe UI\',system-ui,sans-serif" font-size="18" font-weight="400" fill="#8b949e">@ KKBM</text>' +
      '</svg>'
    );
  },

  /** Tiny 32px favicon-style icon HTML string */
  favicon: function () {
    return this.icon(32);
  }
};
