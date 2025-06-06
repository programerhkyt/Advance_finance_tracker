document.addEventListener('DOMContentLoaded', () => {
  const user = sessionStorage.getItem('loggedInUser');
  if (!user) {
    window.location.href = 'index.html';
    return;
  }

  const goalForm = document.getElementById('goalForm');
  const goalsList = document.getElementById('goalsList');

  let goals = JSON.parse(localStorage.getItem(`goals_${user}`)) || [];

  function renderGoals() {
    goalsList.innerHTML = '';
    if (goals.length === 0) {
      goalsList.textContent = 'No goals added yet.';
      return;
    }

    goals.forEach((goal, index) => {
      const div = document.createElement('div');
      div.className = 'goal-item';
      div.innerHTML = `
        <strong>${goal.name}</strong><br>
        Target Amount: $${Number(goal.amount).toFixed(2)}<br>
        Target Date: ${goal.date}
        <button data-index="${index}" class="deleteGoalBtn">Delete</button>
      `;
      goalsList.appendChild(div);
    });

    // Add delete event listeners
    document.querySelectorAll('.deleteGoalBtn').forEach(btn => {
      btn.addEventListener('click', e => {
        const idx = e.target.getAttribute('data-index');
        goals.splice(idx, 1);
        localStorage.setItem(`goals_${user}`, JSON.stringify(goals));
        renderGoals();
      });
    });
  }

  goalForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('goalName').value.trim();
    const amount = document.getElementById('goalAmount').value;
    const date = document.getElementById('goalDate').value;

    if (!name || !amount || !date) return;

    goals.push({ name, amount, date });
    localStorage.setItem(`goals_${user}`, JSON.stringify(goals));
    renderGoals();
    goalForm.reset();
  });

  renderGoals();

  // Logout handler same as others
  document.getElementById('logoutBtn').addEventListener('click', e => {
    e.preventDefault();
    sessionStorage.removeItem('loggedInUser');
    window.location.href = 'index.html';
  });
});
