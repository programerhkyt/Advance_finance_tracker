document.addEventListener('DOMContentLoaded', () => {
  const user = sessionStorage.getItem('loggedInUser');
  if (!user) {
    window.location.href = 'index.html';
    return;
  }

  const emailInput = document.getElementById('settingsEmail');
  const passwordInput = document.getElementById('settingsPassword');
  const settingsForm = document.getElementById('settingsForm');

  // Show current email (read-only)
  emailInput.value = user;

  settingsForm.addEventListener('submit', e => {
    e.preventDefault();
    const newPassword = passwordInput.value.trim();
    if (!newPassword) {
      alert('Please enter a new password to change it.');
      return;
    }

    // Update stored password for this user in localStorage
    const users = JSON.parse(localStorage.getItem('users')) || {};

    if (users[user]) {
      users[user].password = newPassword;
      localStorage.setItem('users', JSON.stringify(users));
      alert('Password updated successfully!');
      passwordInput.value = '';
    } else {
      alert('User not found. Please login again.');
      sessionStorage.removeItem('loggedInUser');
      window.location.href = 'index.html';
    }
  });

  document.getElementById('logoutBtn').addEventListener('click', e => {
    e.preventDefault();
    sessionStorage.removeItem('loggedInUser');
    window.location.href = 'index.html';
  });
});
