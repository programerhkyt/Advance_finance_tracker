// Simple client-side "database" using localStorage for demo purposes

const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const showLoginBtn = document.getElementById('showLogin');
const showSignupBtn = document.getElementById('showSignup');
const passwordInput = document.getElementById('signupPassword');
const passwordStrengthMeter = document.getElementById('passwordStrength');
const passwordStrengthText = document.getElementById('passwordStrengthText');
const loginError = document.getElementById('loginError');
const signupError = document.getElementById('signupError');
const rememberMeCheckbox = document.getElementById('rememberMe');

showLoginBtn.addEventListener('click', () => {
  showLoginBtn.classList.add('active');
  showSignupBtn.classList.remove('active');
  loginForm.classList.remove('hidden');
  signupForm.classList.add('hidden');
  clearErrors();
});

showSignupBtn.addEventListener('click', () => {
  showSignupBtn.classList.add('active');
  showLoginBtn.classList.remove('active');
  signupForm.classList.remove('hidden');
  loginForm.classList.add('hidden');
  clearErrors();
});

function clearErrors() {
  loginError.textContent = '';
  signupError.textContent = '';
}

passwordInput.addEventListener('input', () => {
  const val = passwordInput.value;
  const strength = calculatePasswordStrength(val);
  passwordStrengthMeter.value = strength;
  passwordStrengthText.textContent = ['Very Weak', 'Weak', 'Medium', 'Strong', 'Very Strong'][strength];
});

// Simple password strength function (0-4)
function calculatePasswordStrength(pw) {
  let strength = 0;
  if (pw.length >= 6) strength++;
  if (/[A-Z]/.test(pw)) strength++;
  if (/[0-9]/.test(pw)) strength++;
  if (/[\W]/.test(pw)) strength++;
  return strength;
}

signupForm.addEventListener('submit', e => {
  e.preventDefault();
  const email = document.getElementById('signupEmail').value.trim();
  const password = passwordInput.value;

  if (!validateEmail(email)) {
    signupError.textContent = 'Invalid email format.';
    return;
  }
  if (calculatePasswordStrength(password) < 2) {
    signupError.textContent = 'Password is too weak.';
    return;
  }

  // Save user to localStorage
  let users = JSON.parse(localStorage.getItem('users')) || {};
  if (users[email]) {
    signupError.textContent = 'User already exists.';
    return;
  }
  users[email] = {
    password, // In real apps, hash this!
    created: new Date().toISOString()
  };
  localStorage.setItem('users', JSON.stringify(users));
  alert('Signup successful! Please login.');
  showLoginBtn.click();
  signupForm.reset();
  passwordStrengthMeter.value = 0;
  passwordStrengthText.textContent = '';
});

loginForm.addEventListener('submit', e => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;

  let users = JSON.parse(localStorage.getItem('users')) || {};
  if (!users[email] || users[email].password !== password) {
    loginError.textContent = 'Invalid email or password.';
    return;
  }
  // Save session (demo)
  sessionStorage.setItem('loggedInUser', email);

  if (rememberMeCheckbox.checked) {
    localStorage.setItem('rememberMe', email);
  } else {
    localStorage.removeItem('rememberMe');
  }

  window.location.href = 'dashboard.html';
});

// Prefill login if rememberMe is set
window.addEventListener('load', () => {
  const remembered = localStorage.getItem('rememberMe');
  if (remembered) {
    document.getElementById('loginEmail').value = remembered;
    rememberMeCheckbox.checked = true;
  }
});

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
