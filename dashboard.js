document.addEventListener('DOMContentLoaded', () => {
  const userEmailSpan = document.getElementById('userEmail');
  const balanceAmount = document.getElementById('balanceAmount');
  const logoutBtn = document.getElementById('logoutBtn');
  const recentTransactionsList = document.getElementById('recentTransactionsList');
  const logo_img =document.getElementById("logo_img");

  logo_img.addEventListener("mouseover",function(event){
    event.target.style.borderRadius="2px";

    setTimeout(() => {
      event.target.style.borderRadius="50px";
    }, 1000);
  })
  // Check session
  const user = sessionStorage.getItem('loggedInUser');
  if (!user) {
    window.location.href = 'index.html';
    return;
  }
  userEmailSpan.textContent = user;

  // Dummy data for demo
  const transactions = JSON.parse(localStorage.getItem(`transactions_${user}`)) || [];

  // Calculate balance
  let balance = 0;
  transactions.forEach(t => {
    balance += t.type === 'Income' ? Number(t.amount) : -Number(t.amount);
  });
  balanceAmount.textContent = `$${balance.toFixed(2)}`;

  // Show recent 5 transactions
  recentTransactionsList.innerHTML = '';
  transactions.slice(-5).reverse().forEach(t => {
    const li = document.createElement('li');
    li.textContent = `${t.date} - ${t.category} - ${t.description} - ${t.type} $${t.amount}`;
    recentTransactionsList.appendChild(li);
  });

  // Setup charts using Chart.js
  // Pie chart of expenses by category
  const ctxPie = document.getElementById('expensePieChart').getContext('2d');
  const expenseByCategory = {};
  transactions.filter(t => t.type === 'Expense').forEach(t => {
    expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + Number(t.amount);
  });

  new Chart(ctxPie, {
    type: 'pie',
    data: {
      labels: Object.keys(expenseByCategory),
      datasets: [{
        data: Object.values(expenseByCategory),
        backgroundColor: ['#e74c3c', '#3498db', '#f1c40f', '#2ecc71', '#9b59b6']
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' }
      }
    }
  });

  // Monthly bar chart of spending
  const ctxBar = document.getElementById('monthlyBarChart').getContext('2d');
  const monthlySpending = {};

  transactions.forEach(t => {
    const month = t.date.substring(0, 7); // YYYY-MM
    if (t.type === 'Expense') {
      monthlySpending[month] = (monthlySpending[month] || 0) + Number(t.amount);
    }
  });

  const months = Object.keys(monthlySpending).sort();
  const spendings = months.map(m => monthlySpending[m]);

  new Chart(ctxBar, {
    type: 'bar',
    data: {
      labels: months,
      datasets: [{
        label: 'Monthly Spending',
        data: spendings,
        backgroundColor: '#e67e22'
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });

  logoutBtn.addEventListener('click', e => {
    e.preventDefault();
    sessionStorage.removeItem('loggedInUser');
    window.location.href = 'index.html';
  });

  // Add Income and Expense buttons could open modals or redirect to transactions page
  document.getElementById('addIncomeBtn').addEventListener('click', () => {
    window.location.href = 'transactions.html#addIncome';
  });
  document.getElementById('addExpenseBtn').addEventListener('click', () => {
    window.location.href = 'transactions.html#addExpense';
  });
});
