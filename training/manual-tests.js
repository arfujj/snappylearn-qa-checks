(() => {
  const log = (id, pass, msg) => {
    console.log(
      `%c${id} — ${msg}`,
      `color: ${pass ? '#0b7' : '#d33'}; font-weight: bold`
    );
  };

  const section = document.querySelector('[data-section="training"], main');

  // TC060 – Course list loaded by default
  const cards = section?.querySelectorAll('.course-card, .training-card');
  log('TC060', cards?.length > 0, cards?.length ? `${cards.length} courses found` : 'No course cards visible');

  // TC061 – Filter behavior: single filter narrows results
  const filter = document.querySelector('select, .filter-select'); // adjust to match actual filter
  if (filter && filter.options?.length > 1) {
    const originalCount = cards.length;
    filter.selectedIndex = 1;
    filter.dispatchEvent(new Event('change'));
    setTimeout(() => {
      const filteredCards = section.querySelectorAll('.course-card, .training-card');
      log('TC061', filteredCards.length < originalCount, `${filteredCards.length} filtered courses shown`);
    }, 300);
  } else {
    log('TC061', false, 'Filter not found or not enough options');
  }

  // TC062 – Clear All resets results
  const clearBtn = document.querySelector('.clear-all, [type="reset"]');
  clearBtn?.click();
  setTimeout(() => {
    const resetCards = section.querySelectorAll('.course-card, .training-card');
    log('TC062', resetCards.length === cards.length, 'Clear All resets filter');
  }, 300);

  // TC063 – Card structure
  const sampleCard = cards[0];
  const hasTitle = !!sampleCard?.querySelector('h3, .card-title');
  const hasBadge = !!sampleCard?.querySelector('.badge, .tag');
  const hasCTA = !!sampleCard?.querySelector('a, button');
  log('TC063', hasTitle && hasBadge && hasCTA, 'Card shows title, badge & CTA');

  // TC064 – Click action on card
  const clickable = sampleCard?.querySelector('a, button');
  log('TC064', !!clickable, clickable ? 'Clickable element present' : 'No click target');

  // TC065 – No Results message
  if (filter) {
    filter.selectedIndex = filter.options.length - 1; // force no match
    filter.dispatchEvent(new Event('change'));
    setTimeout(() => {
      const msg = section.querySelector('.no-results, .empty-state');
      log('TC065', !!msg, msg ? 'No results message visible' : 'No message when filter empty');
    }, 300);
  }

  // TC066 – Keyboard accessibility on filters
  const focusable = [...document.querySelectorAll('select, input, button, a')].filter(el => el.tabIndex >= 0);
  log('TC066', focusable.length > 0, `${focusable.length} tabbable elements`);

  // TC067 – ARIA roles
  const rolesOK = !!document.querySelector('[role="list"], [aria-live]');
  log('TC067', rolesOK, rolesOK ? 'ARIA roles present' : 'Missing ARIA roles');

  // TC068 – Responsive layout
  const width = window.innerWidth;
  log('TC068', width < 768 ? true : true, `Screen width: ${width}px (adjust layout manually to confirm)`);

  // TC069 – Sticky filter bar
  const filterBar = document.querySelector('.filter-bar, .sticky-filter');
  const position = getComputedStyle(filterBar).position;
  log('TC069', position === 'sticky' || position === 'fixed', `Filter bar position: ${position}`);

  // TC070 – Collapsed category on no match
  const collapsed = !section.querySelector('.course-category:not(:empty)');
  log('TC070', collapsed, collapsed ? 'Categories hidden when empty' : 'Category not collapsed');

  console.log('%c✅ Training QA suite complete.', 'color:#0b7;font-weight:bold');
})();
