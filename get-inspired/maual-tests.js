// tests/get-inspired.spec.ts
import { test, expect } from '@playwright/test';

/*  Edit these if your routes or selectors differ */
const HOME_URL        = '/';                     
const CARD_SELECTOR   = '[data-testid="inspiration-card"]';
const NEXT_BTN        = '[aria-label*="next"]';
const PREV_BTN        = '[aria-label*="prev"]';
const CAROUSEL_WRAP   = '.carousel-container';   /

/**********************************************************
 * TC033 – Validate image and quote display on each card
 **********************************************************/
test('TC033 – every card shows an image and a quote', async ({ page }) => {
  await page.goto(HOME_URL);

  const cards = await page.$$(CARD_SELECTOR);
  expect(cards.length).toBeGreaterThan(0);

  for (const card of cards) {
    const img  = await card.$('img');
    const text = await card.innerText();
    expect(img, 'missing <img>').not.toBeNull();
    expect(await img!.getAttribute('src')).not.toBeNull();
    expect(text.trim().length, 'quote text missing').toBeGreaterThan(0);
  }
});

/**********************************************************
 * TC034 – Arrow navigation & swipe behaviour
 **********************************************************/
test('TC034 – arrows and swipe change active card', async ({ page, browserName }) => {
  await page.goto(HOME_URL);

  // capture first visible quote
  const firstQuote = await page.locator(`${CARD_SELECTOR}:not([hidden])`).innerText();

  // click Next arrow
  await page.click(NEXT_BTN);
  await expect(page.locator(`${CARD_SELECTOR}:not([hidden])`)).not.toHaveText(firstQuote);

  // swipe only on chromium-based browsers (webkit & firefox ignore synthetic touch)
  if (browserName === 'chromium') {
    const carousel = page.locator(CAROUSEL_WRAP);
    const box = await carousel.boundingBox();
    if (box) {
      await page.touchscreen.tap(box.x + box.width - 10, box.y + box.height / 2); // touchstart
      await page.touchscreen.swipe(box.x + box.width - 10, box.y + box.height / 2, box.x + 10, box.y + box.height / 2); // swipe left
      await expect(page.locator(`${CARD_SELECTOR}:not([hidden])`)).not.toHaveText(firstQuote);
    }
  }
});

/**********************************************************
 * TC035 – Keyboard navigation (Arrow keys / Tab)
 **********************************************************/
test('TC035 – user can navigate cards with keyboard', async ({ page }) => {
  await page.goto(HOME_URL);

  // focus carousel wrapper then ArrowRight
  await page.locator(CAROUSEL_WRAP).focus();
  const before = await page.locator(`${CARD_SELECTOR}:not([hidden])`).innerText();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator(`${CARD_SELECTOR}:not([hidden])`)).not.toHaveText(before);

  // Tab cycles to nav buttons
  await page.keyboard.press('Shift+Tab'); // move focus back to Prev
  await expect(page.locator(PREV_BTN)).toBeFocused();
  await page.keyboard.press('Tab');       // Next
  await expect(page.locator(NEXT_BTN)).toBeFocused();
});

/**********************************************************
 * TC036 – Alt text & ARIA labels
 **********************************************************/
test('TC036 – all images have alt text; nav buttons have accessible labels', async ({ page }) => {
  await page.goto(HOME_URL);

  const imgs = await page.$$(CARD_SELECTOR + ' img');
  for (const img of imgs) {
    const alt = await img.getAttribute('alt');
    expect(alt?.trim().length, 'missing/empty alt').toBeGreaterThan(0);
  }
  await expect(page.locator(NEXT_BTN)).toHaveAttribute('aria-label', /next/i);
  await expect(page.locator(PREV_BTN)).toHaveAttribute('aria-label', /prev|previous/i);
});

/**********************************************************
 * TC036-1 – Layout overflow check
 **********************************************************/
test('TC036-1 – no horizontal scroll/overflow in Get Inspired section', async ({ page }) => {
  await page.goto(HOME_URL);

  const hasOverflow = await page.evaluate(() =>
    document.documentElement.scrollWidth > window.innerWidth
  );
  expect(hasOverflow, 'page overflows horizontally').toBeFalsy();
});

/**********************************************************
 * TC036-02 – Touch event listener present on carousel
 **********************************************************/
test('TC036-02 – carousel listens for touch events', async ({ page }) => {
  await page.goto(HOME_URL);

  const touchSupported = await page.evaluate(sel => {
    const el = document.querySelector(sel);
    return !!el && ('ontouchstart' in el || el instanceof HTMLElement && el.addEventListener.toString().includes('touch'));
  }, CAROUSEL_WRAP);

  expect(touchSupported, 'touch events not detected on carousel').toBeTruthy();
});
