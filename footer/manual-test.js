/*************************************************************************
 *  FOOTER QA   –  TC042 → TC047
 *************************************************************************/

(() => {
  /* ---------- configurable bits ---------- */
  const COMPANY_REGEX = /snappylearn|snappy\s*learn/i;  // company text to look for
  const CTA_REGEX     = /(collaborate|schedule\s*assessment|contact\s*us?)/i;
  const SOCIAL_HOSTS  = /(linkedin|facebook|twitter|instagram|youtube|tiktok)/i;

  /* ---------- helper ---------- */
  const log = (id, ok, msg = '') =>
    console[ok ? 'log' : 'error'](`${ok ? '✅' : '❌'} ${id} – ${msg}`);

  /* ---------- grab footer ---------- */
  const footer = document.querySelector('footer');
  if (!footer) { console.error('❌  No <footer> element found.'); return; }

/**********************************************************************
 * TC042 · Company logo is visible (manual match)
 *********************************************************************/
(() => {
  const footer = document.querySelector('footer');
  if (!footer) {
    console.error('❌ TC042 – <footer> not found.');
    return;
  }

  // Gather all candidate logos
  const candidates = footer.querySelectorAll('img, svg, .logo');

  // Check for at least one that's visible and looks like a logo
  const logo = [...candidates].find(el => {
    const alt  = (el.getAttribute('alt') || '').toLowerCase();
    const aria = (el.getAttribute('aria-label') || '').toLowerCase();
    const src  = (el.getAttribute('src') || '').toLowerCase();
    const txt  = el.className?.toLowerCase?.() || '';

    const looksLikeLogo = [alt, aria, src, txt].some(v => v.includes('logo'));

    const visible =
      el.offsetParent !== null &&
      el.getBoundingClientRect().width > 0 &&
      el.getBoundingClientRect().height > 0;

    return looksLikeLogo && visible;
  });

  console[logo ? 'log' : 'error'](
    `${logo ? '✅' : '❌'} TC042 – ` +
    (logo ? 'Logo is visible in footer' : 'No visible logo found in footer')
  );
})();



  /**********************************************************************
   * TC043 · All footer links (same-origin) route correctly
   *********************************************************************/
  (async () => {
    const anchors  = [...footer.querySelectorAll('a[href]')];
    const internal = anchors.filter(a => a.hostname === location.hostname);
    const broken   = [];

    await Promise.all(
      internal.map(a =>
        fetch(a.href, { method: 'HEAD' })
          .then(r => { if (!r.ok) broken.push(a.href); })
          .catch(() => broken.push(a.href))
      )
    );

    log('TC043', broken.length === 0,
        broken.length
          ? `Broken links (${broken.length}):\n${broken.join('\n')}`
          : `${internal.length} internal links OK`);
  })();

  /**********************************************************************
   * TC044 · Social icons open correct pages in a new tab
   *********************************************************************/
  const extAnchors = [...footer.querySelectorAll('a[href]')]
                       .filter(a => a.hostname !== location.hostname);
  const socialOK   = extAnchors.length > 0 &&
                     extAnchors.every(a =>
                       a.target === '_blank' && SOCIAL_HOSTS.test(a.hostname)
                     );
  log('TC044', socialOK,
      socialOK
        ? `${extAnchors.length} social link(s) verified`
        : 'Bad / missing target=_blank or non-social URLs');

  /**********************************************************************
   * TC045 · “Collaborate / Schedule Assessment” CTA routes to Contact - Not deiided completely if to include
   *********************************************************************/
  const ctas = [...footer.querySelectorAll('a,button')]
                 .filter(el => CTA_REGEX.test(el.textContent + (el.getAttribute('aria-label') || '')));
  const contactOK = ctas.length && ctas.every(el => /contact/i.test(el.href || ''));
  log('TC045', contactOK,
      contactOK
        ? `${ctas.length} CTA(s) point to Contact`
        : 'CTA missing or wrong href (design-intent check)');

  /**********************************************************************
   * TC046 · Responsive layout – no horizontal overflow
   *********************************************************************/
  const overflow = document.documentElement.scrollWidth > window.innerWidth;
  log('TC046', !overflow,
      !overflow ? 'No horizontal scroll' : 'Horizontal overflow detected');

  /**********************************************************************
   * TC047 · Keyboard tabbing & screen-reader labels
   *********************************************************************/
  const focusables = [
    ...footer.querySelectorAll(
      'a,button,input,select,textarea,[tabindex]:not([tabindex="-1"])'
    ),
  ].filter(el => !el.disabled && el.offsetParent !== null);

  const labelled = focusables.every(el => {
    if (/^(A|BUTTON)$/.test(el.tagName))
      return el.textContent.trim().length ||
             (el.getAttribute('aria-label') || '').trim().length;
    if (el.tagName === 'IMG')
      return (el.getAttribute('alt') || '').trim().length;
    return true;                    // form fields announce their role/name
  });

  log('TC047', labelled,
      labelled ? 'All focusables labelled for a11y'
               : 'Unlabelled focusable element(s) found');

  console.log('%cFooter QA suite complete.', 'color:#0b7;font-weight:bold');
})();
