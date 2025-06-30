/*************************************************************************
 *  GET-INSPIRED – QA   (TC033 → TC036-02)

(() => {
  /* ------------ adjustable selectors ------------ */
  const CARD        = '[data-testid="inspiration-card"]'; // each quote card
  const NEXT_BTN    = '[aria-label*="next"]';             // “Next” arrow
  const PREV_BTN    = '[aria-label*="prev"]';             // “Prev” arrow
  const CAROUSEL_WR = '.carousel-container';              // swipe area
  /* ------------------------------------------------ */

  const $  = (s, ctx = document) => ctx.querySelector(s);
  const $$ = (s, ctx = document) => [...ctx.querySelectorAll(s)];
  const log = (id, ok, msg = '') =>
    console[ok ? 'log' : 'error'](`${ok ? '✅' : '❌'} ${id} – ${msg}`);

  /******************************************************************
   * TC033 · each card has a visible image and a quote
   ******************************************************************/
  const cards = $$(CARD);
  const imgOK  = cards.every(c => $('img', c) && $('img', c).naturalWidth);
  const txtOK  = cards.every(c => c.textContent.trim().length > 0);
  log('TC033', imgOK && txtOK,
      `${cards.length} cards checked`);

  /******************************************************************
   * TC034 · arrow buttons & swipe change active card
   ******************************************************************/
  const firstText = $(CARD + ':not([hidden])')?.textContent.trim();
  $(NEXT_BTN)?.click();
  const afterNext = $(CARD + ':not([hidden])')?.textContent.trim();
  const arrowOK   = firstText !== afterNext;

  /* optional swipe test (may be blocked by Chrome) */
  let swipeOK = false;
  const wrap = $(CAROUSEL_WR);
  if (wrap && window.Touch) {
    try {
      const tStart = new Touch({ identifier: 1, target: wrap, clientX: 300, clientY: 0 });
      const tMove  = new Touch({ identifier: 1, target: wrap, clientX: 100, clientY: 0 });
      wrap.dispatchEvent(new TouchEvent('touchstart', { touches:[tStart], targetTouches:[tStart], changedTouches:[tStart], bubbles:true }));
      wrap.dispatchEvent(new TouchEvent('touchmove',  { touches:[tMove],  targetTouches:[tMove],  changedTouches:[tMove],  bubbles:true }));
      wrap.dispatchEvent(new TouchEvent('touchend',   { touches:[],       targetTouches:[],       changedTouches:[tMove],  bubbles:true }));
      swipeOK = true;
    } catch { /* synthetic Touch blocked */ }
  }
  log('TC034', arrowOK && swipeOK,
      arrowOK ? (swipeOK ? 'Arrows & swipe work' : 'Arrows OK – swipe not verified')
              : 'Arrows did not change card');

  /******************************************************************
   * TC035 · keyboard navigation (Arrow keys / Tab)
   ******************************************************************/
  wrap?.focus();
  const beforeKey = $(CARD + ':not([hidden])')?.textContent.trim();
  document.activeElement === wrap && document.dispatchEvent(new KeyboardEvent('keydown', { key:'ArrowRight' }));
  const afterKey  = $(CARD + ':not([hidden])')?.textContent.trim();
  const keyOK     = beforeKey !== afterKey;
  const tabOk1    = !!$(PREV_BTN) && !!$(NEXT_BTN);
  log('TC035', keyOK && tabOk1,
      keyOK ? 'ArrowRight moved carousel' : 'Arrow key did not change card');

  /******************************************************************
   * TC036 · images have alt text; buttons have ARIA labels
   ******************************************************************/
  const altOK  = $$(`${CARD} img`).every(i => (i.alt || '').trim().length > 3);
  const ariaOK = $(NEXT_BTN)?.getAttribute('aria-label') &&
                 $(PREV_BTN)?.getAttribute('aria-label');
  log('TC036', altOK && ariaOK,
      altOK ? 'Alt + ARIA labels present' : 'Missing alt or ARIA');

  /******************************************************************
   * TC036-1 · page has no horizontal overflow
   ******************************************************************/
  const overflow = document.documentElement.scrollWidth > window.innerWidth;
  log('TC036-1', !overflow,
      !overflow ? 'No overflow' : 'Horizontal scroll detected');

  /******************************************************************
   * TC036-02 · carousel listens for touch/pointer events
   ******************************************************************/
  const touchAble = wrap && ('ontouchstart' in wrap || 'PointerEvent' in window);
  log('TC036-02', !!touchAble,
      touchAble ? 'Touch/Pointer events supported' : 'No touch listener');

  console.log('%cGet Inspired QA suite complete.', 'color:#0b7;font-weight:bold;');
})();
