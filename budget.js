document.addEventListener('DOMContentLoaded', () => {
  const user = sessionStorage.getItem('loggedInUser');
  if (!user) {
    window.location.href = 'index.html';
    return;
  }

  const budgetForm = document.getElementById('budgetForm');
  const budgetList = document.getElementById('budgetList');

  let budgets = JSON.parse(localStorage.getItem(`budgets_${user}`)) || [];

  function renderBudgets() {
    budgetList.innerHTML = '';
    if (budgets.length === 0) {
      budgetList.textContent = 'No budget categories added yet.';
      return;
    }

    budgets.forEach((budget, index) => {
      const div = document.createElement('div');
      div.className = 'budget-item';
      div.innerHTML = `
        <strong>${budget.category}</strong>: $${Number(budget.amount).toFixed(2)}
        <button data-index="${index}" class="deleteBudgetBtn">Delete</button>
      `;
      budgetList.appendChild(div);
    });

    document.querySelectorAll('.deleteBudgetBtn').forEach(btn => {
      btn.addEventListener('click', e => {
        const idx = e.target.getAttribute('data-index');
        budgets.splice(idx, 1);
        localStorage.setItem(`budgets_${user}`, JSON.stringify(budgets));
        renderBudgets();
      });
    });
  }

  budgetForm.addEventListener('submit', e => {
    e.preventDefault();
    const category = document.getElementById('budgetCategory').value.trim();
    const amount = document.getElementById('budgetAmount').value;

    if (!category || !amount) return;

    budgets.push({ category, amount });
    localStorage.setItem(`budgets_${user}`, JSON.stringify(budgets));
    renderBudgets();
    budgetForm.reset();
  });

  renderBudgets();

  document.getElementById('logoutBtn').addEventListener('click', e => {
    e.preventDefault();
    sessionStorage.removeItem('loggedInUser');
    window.location.href = 'index.html';
  });
});
