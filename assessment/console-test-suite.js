/*************************************************************************
 *  Assessment Page – QA (manual console version)


(() => {
  /* Helpers */
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const log = (id, ok, msg = '') =>
    console[ok ? 'log' : 'error'](`${ok ? '✅' : '❌'} ${id} – ${msg}`);

  /* Reference header/footer from Home (run this once on home first if needed) */
  const homeHeader = sessionStorage.getItem('homeHeaderHTML') || '';
  const homeFooter = sessionStorage.getItem('homeFooterHTML') || '';

  /* === TESTS ========================================================== */

  /* TC048 – Header matches Home page */
  (() => {
    const same = homeHeader && $('header')?.innerHTML === homeHeader;
    log('TC048', same, same ? 'Header matches' : 'Header differs from Home');
  })();

  /* TC049 – Logo & nav visible / clickable */
  (() => {
    const logo  = $('header img, header svg, header .logo');
    const links = $$('header a');
    const pass  = !!logo && links.length >= 1;
    log('TC049', pass,
        pass ? `Logo + ${links.length} nav links detected`
             : 'Logo or nav links missing');
  })();

  /* TC050 – Banner image loads & has alt */
  (() => {
    const img = $('.assessment-banner img') || $('main img');
    const pass = img && img.naturalWidth && img.alt.trim().length > 3;
    log('TC050', pass,
        pass ? 'Banner loaded with alt text' : 'Banner missing / no alt');
  })();

  /* TC051 – “Why Assessment?” section visible */
  (() => {
    const sec = $('#why-assessment') ||
                $$('section').find(s => /why\s*assessment/i.test(s.textContent));
    log('TC051', !!sec, sec ? 'Section present' : 'Section not found');
  })();

  /* TC052 – Six assessment cards with heading + description */
  (() => {
    const cards = $$('.assessment-type');
    const okNum = cards.length === 6;
    const okContent = cards.every(c => $('h3,h4', c) && $('p', c));
    log('TC052', okNum && okContent,
        okNum && okContent ? '6 cards with headings & desc'
                           : `Found ${cards.length} cards or missing content`);
  })();

  /* TC053 – “Contact Us” button visible & accessible */
  (() => {
    const btn = $('[href*="contact"], [aria-label*="contact"], button, a')
                  ?.closest('button,a');
    const focusable = btn && typeof btn.focus === 'function';
    if (btn) btn.focus();
    const onFocus = document.activeElement === btn;
    log('TC053', btn && focusable && onFocus,
        btn ? 'Button present & focusable' : 'Button missing');
  })();

  /* TC054 – Footer matches Home page */
  (() => {
    const same = homeFooter && $('footer')?.innerHTML === homeFooter;
    log('TC054', same, same ? 'Footer matches' : 'Footer differs from Home');
  })();

  /* TC055 – Responsive layout (basic overflow check) */
  (() => {
    const overflow = document.documentElement.scrollWidth > window.innerWidth;
    log('TC055', !overflow,
        !overflow ? 'No horizontal scroll' : 'Layout overflows viewport');
  })();

  /* TC056 – Heading hierarchy H1 > H2 > H3 */
  (() => {
    const levels = $$('h1,h2,h3').map(h => +h.tagName[1]);
    const bad = levels.some((l, i) => i && l - levels[i - 1] > 1);
    log('TC056', !bad,
        !bad ? 'Heading order good' : `Heading jump detected: ${levels.join(' › ')}`);
  })();

  /* TC057 – Tab order begins in header & ends in footer */
  (() => {
    const focusables = $$(
      'a,button,input,select,textarea,[tabindex]:not([tabindex="-1"])'
    ).filter(el => !el.disabled && el.offsetParent !== null);
    const first = focusables[0], last = focusables.at(-1);
    const ok = first?.closest('header') && last?.closest('footer');
    log('TC057', ok,
        ok ? 'Tab order flows header→footer' : 'Tab order incorrect');
  })();

  /* TC058 – Lighthouse ≥90 (needs manual run) */
  log('TC058', false,
      'Run Lighthouse → Accessibility; expect score ≥ 90');

  /* TC059 – Button contrast & hover (manual visual) */
  log('TC059', false,
      'Manually hover buttons & verify WCAG contrast / visible focus');

  console.log('%cQA suite complete', 'color: #0b7; font-weight:bold;');
})();
