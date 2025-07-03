/*************************************************************************
 *  OUR PARTNERS – QA  (TC029 → TC032)
 *************************************************************************/
(() => {
  /* ---------- constants / selectors ---------- */
  const WRAPPER  = '.our-services-banner';        // section container
  const LOGOS    = '.our-services-column img';    // all partner logos

  const log = (id, ok, msg) =>
    console[ok ? 'log' : 'error'](`${ok ? '✅' : '❌'} ${id} – ${msg}`);

  /* ---------- locate section ---------- */
  const section = document.querySelector(WRAPPER);
  if (!section) return console.error('❌ Partners section not found – selector may have changed.');

  const logos = [...section.querySelectorAll(LOGOS)];

  /**********************************************************************
   * TC029 - Logos load correctly & meet visual quality
   *********************************************************************/
  const broken = logos.filter(img =>
    !img.complete || img.naturalWidth === 0 || img.naturalHeight === 0
  );
  log('TC029', broken.length === 0,
      broken.length
        ? `Broken / missing logos: ${broken.length}`
        : `${logos.length} logo(s) loaded with non-zero dimensions`);

  /**********************************************************************
   * TC030 - Layout adjusts for current viewport (no overflow)
   *        → rerun in Device-Toolbar to validate mobile vs desktop
   *********************************************************************/
  const overflow =
    section.scrollWidth  > section.clientWidth ||
    section.scrollHeight > section.clientHeight;
  log('TC030', !overflow,
      !overflow ? 'No overflow/distortion at this viewport'
                : '⚠️ Logos overflow – check flex/wrap rules');

  /**********************************************************************
   * TC031 - Partner links open in new tab
   * NOTE: In PartnerSection.astro the logos are NOT wrapped in <a>.
   *       This test will flag that so devs know if links are missing.
   *********************************************************************/
  const anchors   = logos.map(img => img.closest('a')).filter(Boolean);
  const missing   = logos.length && anchors.length === 0;
  const wrongTab  = anchors.filter(a => a.target !== '_blank');
  log(
    'TC031',
    !missing && wrongTab.length === 0,
    missing
      ? 'No <a> links around logos (design spec?)'
      : wrongTab.length
          ? `${wrongTab.length} link(s) missing target="_blank"`
          : `${anchors.length} partner link(s) open in new tab`
  );

  /**********************************************************************
   * TC032 - Keyboard access to partner logos / links
   *********************************************************************/
  const focusables = anchors.length
    ? anchors
    : logos.filter(img => img.tabIndex >= 0);

  const unfocusable = logos.filter(img =>
    !focusables.includes(img) &&
    img.offsetParent !== null                // visible
  );
  log(
    'TC032',
    unfocusable.length === 0,
    unfocusable.length
      ? `${unfocusable.length} logo(s) not reachable with Tab`
      : 'All partner logos/links reachable via Tab'
  );

  console.log('%cOur Partners QA suite complete.', 'color:#0b7;font-weight:bold');
})();
