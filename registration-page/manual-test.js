// --- Registration Page Manual QA Console Test ---

const results = {};

// 1. Check if all required fields exist
results.fieldsPresent = [
  !!document.querySelector('input[name="fullName"]'),
  !!document.querySelector('input[type="email"]'),
  !!document.querySelector('input[name="password"]'),
  !!document.querySelector('input[name="confirmPassword"]'),
  !!document.querySelector('select[name="course"]'),
  !!document.querySelector('input[name="payment"]'),
  !!document.querySelector('button[type="reset"]'),
  !!document.querySelector('button[type="submit"]')
].every(Boolean);

// 2. Required field validation test
document.querySelector('form').dispatchEvent(new Event('submit', { cancelable: true }));
results.requiredFieldValidation = "Check for visible validation errors manually";

// 3. Invalid email format test
document.querySelector('input[type="email"]').value = 'invalidEmail';
document.querySelector('form').dispatchEvent(new Event('submit', { cancelable: true }));
results.invalidEmailValidation = "Check for email format error message";

// 4. Password mismatch test
document.querySelector('input[name="password"]').value = 'abc123';
document.querySelector('input[name="confirmPassword"]').value = '123abc';
document.querySelector('form').dispatchEvent(new Event('submit', { cancelable: true }));
results.passwordMismatch = "Should show mismatch error";

// 5. Reset button test
document.querySelector('input[name="fullName"]').value = 'Test User';
document.querySelector('button[type="reset"]').click();
results.resetFunctionality = "Verify that fields are cleared";

// 6. Dropdown test
const dropdown = document.querySelector('select[name="course"]');
results.dropdownExists = !!dropdown;
results.dropdownHasOptions = dropdown?.options?.length > 1;

// 7. Payment input test
const paymentInput = document.querySelector('input[name="payment"]');
paymentInput.value = '12345';
results.paymentFieldValue = paymentInput.value;

// 8. Submit button enabled test
const submitBtn = document.querySelector('button[type="submit"]');
results.registerButtonEnabled = !submitBtn.disabled;

// 9. Mock form submit
document.querySelector('form').dispatchEvent(new Event('submit', { cancelable: true }));
results.formSubmit = "Check for success message or redirect";

// 10. Keyboard navigation reminder
results.keyboardNavigation = "Use Tab key manually to check logical field focus order";

// Output all test results
console.log("Registration QA Console Test Results:", results);
