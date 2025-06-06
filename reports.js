document.addEventListener('DOMContentLoaded', () => {
  const user = sessionStorage.getItem('loggedInUser');
  if (!user) {
    window.location.href = 'index.html';
    return;
  }

  // Fetch transactions for reports
  const transactions = JSON.parse(localStorage.getItem(`transactions_${user}`)) || [];

  // Group by category (both Income and Expense)
  const categorySums = {};
  transactions.forEach(t => {
    if (!categorySums[t.category]) categorySums[t.category] = 0;
    categorySums[t.category] += t.type === 'Income' ? Number(t.amount) : -Number(t.amount);
  });

  const categoryLabels = Object.keys(categorySums);
  const categoryData = Object.values(categorySums);

  // Monthly totals (expenses)
  const monthlySums = {};
  transactions.forEach(t => {
    const month = t.date.substring(0,7);
    if (!monthlySums[month]) monthlySums[month] = 0;
    monthlySums[month] += t.type === 'Expense' ? Number(t.amount) : 0;
  });
  const months = Object.keys(monthlySums).sort();
  const monthlyData = months.map(m => monthlySums[m]);

  // Category report chart (doughnut)
  const ctxCat = document.getElementById('categoryReportChart').getContext('2d');
  new Chart(ctxCat, {
    type: 'doughnut',
    data: {
      labels: categoryLabels,
      datasets: [{
        label: 'Category Net Amount',
        data: categoryData,
        backgroundColor: [
          '#3498db', '#e74c3c', '#2ecc71', '#f1c40f', '#9b59b6', '#e67e22'
        ],
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' }
      }
    }
  });

  // Monthly report chart (line)
  const ctxMonth = document.getElementById('monthlyReportChart').getContext('2d');
  new Chart(ctxMonth, {
    type: 'line',
    data: {
      labels: months,
      datasets: [{
        label: 'Monthly Expenses',
        data: monthlyData,
        borderColor: '#e74c3c',
        fill: false,
        tension: 0.1
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });

  document.getElementById('logoutBtn').addEventListener('click', e => {
    e.preventDefault();
    sessionStorage.removeItem('loggedInUser');
    window.location.href = 'index.html';
  });
});
