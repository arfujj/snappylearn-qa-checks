// === Calendar & Filters QA Console Tests ===
const testResults = {};

// 1. Page Elements Load Check
testResults.pageElementsLoaded = [
  !!document.querySelector('header'),
  !!document.querySelector('footer'),
  !!document.querySelector('.calendar-toggle'),
  !!document.querySelector('.filter-panel')
].every(Boolean);

// 2. Toggle Calendar Views (Month/Day)
const monthBtn = document.querySelector('button[data-view="month"]');
const dayBtn = document.querySelector('button[data-view="day"]');

if (monthBtn && dayBtn) {
  monthBtn.click();
  testResults.monthToggleClicked = true;

  dayBtn.click();
  testResults.dayToggleClicked = true;
} else {
  testResults.viewToggleExists = false;
}

// 3. Test Category Filter
const filterCategory = document.querySelector('select[name="category"]');
if (filterCategory) {
  filterCategory.value = filterCategory.options[1]?.value || '';
  filterCategory.dispatchEvent(new Event('change'));
  testResults.categoryFilterTest = true;
} else {
  testResults.categoryFilterTest = false;
}

// 4. Test “All Courses” Filter
const allCoursesOption = [...document.querySelectorAll('option')].find(opt =>
  opt.textContent.toLowerCase().includes('all courses')
);
if (allCoursesOption) {
  allCoursesOption.selected = true;
  allCoursesOption.parentElement.dispatchEvent(new Event('change'));
  testResults.allCoursesFilter = true;
}

// 5. Test City Filter
const cityFilter = document.querySelector('select[name="city"]');
if (cityFilter) {
  cityFilter.value = cityFilter.options[1]?.value || '';
  cityFilter.dispatchEvent(new Event('change'));
  testResults.cityFilterTest = true;
}

// 6. Clear Filters Button
const clearBtn = document.querySelector('button.clear-filters');
if (clearBtn) {
  clearBtn.click();
  testResults.clearFilterClicked = true;
}

// 7. Course Card Content
const cards = document.querySelectorAll('.course-card');
testResults.cardCount = cards.length;
testResults.minCardCount = cards.length >= 3;

cards.forEach((card, i) => {
  const name = card.querySelector('.course-name');
  const location = card.querySelector('.course-location');
  const instructor = card.querySelector('.instructor-name');
  testResults[`card${i+1}`] = !!(name && location && instructor);
});

// 8. Instructor Text Alignment (basic)
const instructorText = document.querySelector('.instructor-name');
if (instructorText) {
  const style = window.getComputedStyle(instructorText);
  testResults.instructorTextVisible = style.visibility !== 'hidden' && style.display !== 'none';
  testResults.instructorTextAligned = style.textAlign !== '';
}

// 9. Keyboard Navigation - Manual Prompt
testResults.keyboardNavigation = "Use Tab key manually to verify logical focus order";

// Output summary
console.log("📋 Calendar & Filter QA Test Results:", testResults);
