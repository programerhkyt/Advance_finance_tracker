document.addEventListener('DOMContentLoaded', () => {
  const user = sessionStorage.getItem('loggedInUser');
  if (!user) {
    window.location.href = 'index.html';
    return;
  }

  const transactionsTableBody = document.querySelector('#transactionsTable tbody');
  const addTransactionBtn = document.getElementById('addTransactionBtn');
  const transactionModal = document.getElementById('transactionModal');
  const closeModalBtn = document.getElementById('closeModal');
  const transactionForm = document.getElementById('transactionForm');
  const modalTitle = document.getElementById('modalTitle');

  const startDateInput = document.getElementById('startDate');
  const endDateInput = document.getElementById('endDate');
  const categoryFilter = document.getElementById('categoryFilter');
  const searchInput = document.getElementById('searchInput');
  const filterBtn = document.getElementById('filterBtn');
  const exportCsvBtn = document.getElementById('exportCsvBtn');
  const logoutBtn = document.getElementById('logoutBtn');



  const transaction_text=document.getElementById("transaction_text");
  let transactions = JSON.parse(localStorage.getItem(`transactions_${user}`)) || [];
  let editingId = null;

  function renderTransactions(filterParams = {}) {
    transactionsTableBody.innerHTML = '';
    let filtered = transactions;

    if (filterParams.startDate) {
      filtered = filtered.filter(t => t.date >= filterParams.startDate);
    }
    if (filterParams.endDate) {
      filtered = filtered.filter(t => t.date <= filterParams.endDate);
    }
    if (filterParams.category && filterParams.category !== 'All') {
      filtered = filtered.filter(t => t.category === filterParams.category);
    }
    if (filterParams.search) {
      filtered = filtered.filter(t => t.description.toLowerCase().includes(filterParams.search.toLowerCase()));
    }

    filtered.forEach(t => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${t.date}</td>
        <td>${t.category}</td>
        <td>${t.description}</td>
        <td>$${Number(t.amount).toFixed(2)}</td>
        <td>${t.type}</td>
        <td>
          <button class="editBtn" data-id="${t.id}">Edit</button>
          <button class="deleteBtn" data-id="${t.id}">Delete</button>
        </td>
      `;
      transactionsTableBody.appendChild(tr);
    });

    // Attach event listeners for edit/delete buttons
    document.querySelectorAll('.editBtn').forEach(btn => {
      btn.addEventListener('click', e => {
        const id = e.target.dataset.id;
        startEditTransaction(id);
      });
    });
    document.querySelectorAll('.deleteBtn').forEach(btn => {
      btn.addEventListener('click', e => {
        const id = e.target.dataset.id;
        deleteTransaction(id);
      });
    });
  }

  function startEditTransaction(id) {
    const t = transactions.find(tr => tr.id === id);
    if (!t) return;
    editingId = id;
    modalTitle.textContent = 'Edit Transaction';
    transactionForm.transDate.value = t.date;
    transactionForm.transCategory.value = t.category;
    transactionForm.transDescription.value = t.description;
    transactionForm.transAmount.value = t.amount;
    transactionForm.transType.value = t.type;
    transactionModal.classList.remove('hidden');
  }

  function deleteTransaction(id) {
    if (confirm('Are you sure you want to delete this transaction?')) {
      transactions = transactions.filter(t => t.id !== id);
      saveTransactions();
      renderTransactions();
    }
  }

  function saveTransactions() {
    localStorage.setItem(`transactions_${user}`, JSON.stringify(transactions));
  }

  addTransactionBtn.addEventListener('click', () => {
    editingId = null;
    modalTitle.textContent = 'Add Transaction';
    transactionForm.reset();
    transactionModal.classList.remove('hidden');
  });

  closeModalBtn.addEventListener('click', () => {
    transactionModal.classList.add('hidden');
  });

  transactionForm.addEventListener('submit', e => {
    e.preventDefault();
    const newTrans = {
      id: editingId || generateId(),
      date: transactionForm.transDate.value,
      category: transactionForm.transCategory.value,
      description: transactionForm.transDescription.value.trim(),
      amount: parseFloat(transactionForm.transAmount.value),
      type: transactionForm.transType.value
    };

    if (editingId) {
      const index = transactions.findIndex(t => t.id === editingId);
      if (index !== -1) transactions[index] = newTrans;
    } else {
      transactions.push(newTrans);
    }
    saveTransactions();
    renderTransactions();
    transactionModal.classList.add('hidden');
  });

  filterBtn.addEventListener('click', () => {
    renderTransactions({
      startDate: startDateInput.value,
      endDate: endDateInput.value,
      category: categoryFilter.value,
      search: searchInput.value
    });
  });

  exportCsvBtn.addEventListener('click', () => {
    exportToCSV(transactions, 'transactions.csv');
  });

  logoutBtn.addEventListener('click', e => {
    e.preventDefault();
    sessionStorage.removeItem('loggedInUser');
    window.location.href = 'index.html';
  });

  function exportToCSV(data, filename) {
    if (!data.length) {
      alert('No data to export');
      return;
    }
    const header = Object.keys(data[0]).join(',');
    const rows = data.map(t => Object.values(t).map(v => `"${v}"`).join(',')).join('\n');
    const csvContent = `${header}\n${rows}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
  }

  // Initial render
  renderTransactions();
});


transaction_text.addEventListener("mouseover",function(event){
  transaction_text.textContent="Leazer";

  setTimeout(() => {
    transaction_text.textContent="Transactions";
  }, 1000);

})