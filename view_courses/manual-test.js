(function () {
  console.log('%cCourse Details Page QA Tests', 'color:#0b7;font-weight:bold');

  const tests = [];

  // TC001: Page loads with no JS console errors
  tests.push(['TC001', !window.__hasConsoleErrors, window.__hasConsoleErrors ? 'Console errors present' : 'No console errors']);

  // TC002: Header and Footer present
  const headerOK = !!document.querySelector('header');
  const footerOK = !!document.querySelector('footer');
  tests.push(['TC002', headerOK && footerOK, !headerOK ? 'Header missing' : (!footerOK ? 'Footer missing' : 'Header & Footer OK')]);

  // TC003: Title, date, location
  const title = document.querySelector('h1');
  const date = document.querySelector('[data-testid*="date"]') || document.querySelector('.course-date');
  const location = document.querySelector('[data-testid*="location"]') || document.querySelector('.course-location');
  tests.push(['TC003', !!title && !!date && !!location, !title ? 'Title missing' : !date ? 'Date missing' : !location ? 'Location missing' : 'Course info present']);

  // TC004: Hero image and logo
  const heroImg = document.querySelector('.hero img');
  const logo = document.querySelector('img.course-logo');
  const logoAlt = logo && logo.alt;
  tests.push(['TC004', !!heroImg && !!logo, !heroImg ? 'Hero image missing' : !logo ? 'Logo missing' : 'Images found']);

  // TC005: Register buttons present and clickable
  const registerBtns = [...document.querySelectorAll('button, a')].filter(el => /register/i.test(el.textContent));
  const allEnabled = registerBtns.length > 0 && registerBtns.every(btn => !btn.disabled);
  tests.push(['TC005', allEnabled, registerBtns.length === 0 ? 'Register buttons not found' : 'Buttons OK']);

  // TC006: About This Course text block
  const about = document.querySelector('#about, .course-about');
  tests.push(['TC006', !!about && about.textContent.trim().length > 20, !about ? 'About section missing' : 'About content OK']);

  // TC007: What You’ll Learn (bullets or structured)
  const learnSection = document.querySelector('.what-youll-learn, #learn');
  const learnItems = learnSection ? learnSection.querySelectorAll('li, p') : [];
  tests.push(['TC007', learnItems.length >= 2, !learnSection ? 'Section missing' : 'Learning outcomes listed']);

  // TC008: Instructor info
  const instructors = document.querySelectorAll('.instructor, .teacher');
  const validInstructors = [...instructors].filter(i => i.querySelector('img') && i.querySelector('h4, strong'));
  tests.push(['TC008', validInstructors.length >= 2, 'Instructor count: ' + validInstructors.length]);

  // TC009: Sidebar info (Effort, Price, Duration)
  const sidebar = document.querySelector('.course-sidebar');
  const filled = sidebar && /effort|price|length|duration/i.test(sidebar.textContent);
  tests.push(['TC009', !!sidebar && filled, !sidebar ? 'Sidebar missing' : 'Sidebar populated']);

  // TC010: Reviews visible
  const reviews = document.querySelectorAll('.review');
  const reviewValid = [...reviews].every(r => r.querySelector('img') && r.textContent.length > 20);
  tests.push(['TC010', reviewValid, 'Reviews: ' + reviews.length]);

  // TC011: Accessibility (tabbable, headings, alt)
  const headingsOK = document.querySelectorAll('h1,h2,h3').length >= 3;
  const imgs = document.querySelectorAll('img');
  const missingAlt = [...imgs].filter(i => !i.alt || i.alt.trim() === '');
  const tabbables = [...document.querySelectorAll('a, button, input, select')].filter(el => el.tabIndex >= 0);
  tests.push(['TC011', headingsOK && missingAlt.length === 0 && tabbables.length > 5,
              !headingsOK ? 'Headings missing' : missingAlt.length > 0 ? `${missingAlt.length} img(s) missing alt` : 'Accessibility OK']);

  // Print all results
  tests.forEach(([id, pass, msg]) => {
    console.log(`${pass ? '✅' : '❌'} ${id} — ${msg}`);
  });

  console.log('%cCourse Details QA suite complete.', 'color:#0b7;font-weight:bold');
})();
