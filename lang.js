(() => {
  const KEY = 'kto_lang';

  // Allow sharing links like ...?lang=ru
  try {
    const params = new URLSearchParams(window.location.search);
    const forced = params.get('lang');
    if (forced === 'ru' || forced === 'en') localStorage.setItem(KEY, forced);
  } catch (_) {}

  function detectDefault() {
    const n = (navigator.language || '').toLowerCase();
    return n.startsWith('ru') ? 'ru' : 'en';
  }

  function getLang() {
    let stored = null;
    try { stored = localStorage.getItem(KEY); } catch (_) {}
    if (stored === 'ru' || stored === 'en') return stored;
    const d = detectDefault();
    try { localStorage.setItem(KEY, d); } catch (_) {}
    return d;
  }

  function setLang(lang) {
    if (lang !== 'ru' && lang !== 'en') return;
    try { localStorage.setItem(KEY, lang); } catch (_) {}
  }

  function applyBilingual() {
    const lang = getLang();
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-lang]').forEach((el) => {
      el.style.display = (el.getAttribute('data-lang') === lang) ? '' : 'none';
    });

    const btn = document.getElementById('langToggle');
    if (btn) {
      btn.textContent = (lang === 'ru') ? 'RU' : 'EN';
      btn.setAttribute('aria-label', (lang === 'ru') ? 'Switch to English' : 'Переключить на русский');
      btn.onclick = () => {
        setLang(lang === 'ru' ? 'en' : 'ru');
        applyBilingual();
      };
    }
  }

  window.KTO_LANG = { get: getLang, set: setLang, apply: applyBilingual, key: KEY };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyBilingual);
  } else {
    applyBilingual();
  }
})();
