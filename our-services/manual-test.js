/*************************************************************************
 *  OUR SERVICES – QA (TC019 → TC023)
 *************************************************************************/
(() => {
  /* ---------- editable selectors ---------- */
  const WRAPPER  = '.our-services-banner';      // outer section
  const CARD     = '.our-services-column';      // one per service
  const TITLE    = 'h2';                        // service title tag  ← updated!
  const MORE_LNK = 'a[href]';                   // “More” anchor

  const EXPECTED_TITLES = ['Assessment', 'Training', 'Coaching'];

  const log = (id, ok, msg) =>
    console[ok ? 'log' : 'error'](`${ok ? '✅' : '❌'} ${id} – ${msg}`);

  /* ---------- locate section ---------- */
  const section = document.querySelector(WRAPPER);
  if (!section) return console.error('❌ Our Services wrapper not found – selector may have changed.');

  const cards  = [...section.querySelectorAll(CARD)];

  /**********************************************************************
   * TC019 · All three service titles present
   *********************************************************************/
  const titlesFound = cards.map(c => c.querySelector(TITLE)?.textContent.trim());
  const missing     = EXPECTED_TITLES.filter(t => !titlesFound.includes(t));
  log('TC019', missing.length === 0,
      missing.length
        ? `Missing title(s): ${missing.join(', ')}`
        : 'Assessment, Training, Coaching titles present');

  /**********************************************************************
   * TC020 · Description text present under each title
   *********************************************************************/
  const badDesc = cards.filter(c => {
    const desc = c.querySelector('p');
    return !desc || desc.textContent.trim().length < 10;  // <10 chars ≈ suspect
  });
  log('TC020', badDesc.length === 0,
      badDesc.length
        ? `${badDesc.length} card(s) missing/short description`
        : 'All descriptions look okay');

  /**********************************************************************
   * TC021 · “More” link routes to correct page (and opens in new tab)
   *********************************************************************/
  const badLinks = cards.filter(c => {
    const link  = c.querySelector(MORE_LNK);
    const title = c.querySelector(TITLE)?.textContent.trim().toLowerCase();
    return !(link && link.target === '_blank' && link.href.toLowerCase().includes(title));
  });
  log('TC021', badLinks.length === 0,
      badLinks.length
        ? `${badLinks.length} “More” link(s) missing target="_blank" or wrong href`
        : 'All “More” links open correct detail pages in new tab');

  /**********************************************************************
   * TC022 · Responsive layout – no overflow at current viewport
   *********************************************************************/
  const overflow =
    section.scrollWidth  > section.clientWidth ||
    section.scrollHeight > section.clientHeight;
  log('TC022', !overflow,
      !overflow ? 'No overflow/distortion at this viewport'
                : '⚠️ Layout overflows – check flex/grid');

  /**********************************************************************
   * TC023 · Keyboard and screen-reader accessibility
   *********************************************************************/
  const focusables = [
    ...section.querySelectorAll('a,button,[tabindex]:not([tabindex="-1"])'),
  ].filter(el => !el.disabled && el.offsetParent !== null);

  const unlabeled = focusables.filter(el =>
    /^(A|BUTTON)$/.test(el.tagName) &&
    !el.textContent.trim() &&
    !(el.getAttribute('aria-label') || '').trim()
  );
  log('TC023', unlabeled.length === 0,
      unlabeled.length
        ? `Un-labeled focusable(s): ${unlabeled.length}`
        : 'All links/buttons reachable & labeled');

  console.log('%cOur Services QA suite complete.', 'color:#0b7;font-weight:bold');
})();
