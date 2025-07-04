Top navigation:
// === Utility Functions ===
function isInViewport(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= window.innerHeight &&
    rect.right <= window.innerWidth
  );
}
function testElement(label, selector, shouldClick = false) {
  const el = document.querySelector(selector);
  if (!el) {
    console.error("FAIL:", label, "not found (" + selector + ")");
    return;
  }
 const visible = isInViewport(el);
  console.log(label + ":", visible ? "✅ Visible" : "❌ Not fully visible");
 if (el.href) {
    console.log(label + " href:", el.href); // e.g., http://localhost:4321/courses
  }
 if (shouldClick) {
    console.log("Clicking", label, "to test navigation...");
    // el.click(); // Optional: enable this to auto-click links
  }
}
// === Desktop Navigation Tests ===
testElement("Logo", 'img[src*="mainLogo.svg"]', true);
// Expected: "Logo: ✅ Visible"
testElement("Desktop View Courses", 'a.alt[href="/courses"]', true);
// Expected: "Desktop View Courses: ✅ Visible", "href: http://localhost:4321/courses"
// === Mobile Navigation Tests ===
testElement("Mobile Assessment", 'button.mobile-nav-link-button:nth-of-type(1)', true);
testElement("Mobile Coaching", 'button.mobile-nav-link-button:nth-of-type(2)', true);
testElement("Mobile Training", 'button.mobile-nav-link-button:nth-of-type(3)', true);
testElement("Mobile View Courses", 'button.mobile-nav-link-button:nth-of-type(4)', true);
// Expected: All buttons return "✅ Visible" if in mobile view
// === Sticky Navigation Check ===
console.log("Scrolling down to test sticky nav...");
window.scrollTo(0, document.body.scrollHeight);
setTimeout(() => {
  const nav = document.querySelector("nav");
  if (!nav) {
    console.error("FAIL: Nav bar not found");
    return;
  }
 const sticky = ["sticky", "fixed"].includes(getComputedStyle(nav).position);
  console.log("Sticky Nav:", sticky ? "✅ Working" : "❌ Not sticky");
  // Expected: "Sticky Nav: ✅ Working"
}, 1000);
// === Accessibility: Keyboard Focus Test ===
console.log("Testing Tab navigation (keyboard focus)...");
let focusable = Array.from(document.querySelectorAll('a, button')).filter(el => el.tabIndex !== -1);
focusable.slice(0, 5).forEach((el, i) => {
  setTimeout(() => {
    el.focus();
    console.log("Focused:", el.tagName, el.textContent.trim() || el.innerText.trim());
    // Expected: "Focused: A Home", "Focused: BUTTON View Courses", etc.
  }, i * 800);
});

