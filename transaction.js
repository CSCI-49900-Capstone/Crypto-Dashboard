document.addEventListener('DOMContentLoaded', async ()=> {
  const transaction = await api.getTransactions();
  if (!transaction.ok) return;
  const transactions = transaction.data;
  const table = document.querySelector('#transactions');
  const tbody = table.querySelector('tbody');
  for (const transaction of transactions) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${transaction.ticker}</td>
      <td>${transaction.buy.price}</td>
      <td>${transaction.buy.fee}</td>
      <td>${transaction.buy.quantity}</td>
      <td>${transaction.sell.price}</td>
      <td>${transaction.sell.fee}</td>
      <td>${transaction.sell.quantity}</td>
      <td>${transaction.failureReason ?? ''}</td>
      <td>${new Date(transaction.createdAt).toLocaleString()}</td>
      <td>${new Date(transaction.completedAt).toLocaleString()}</td>
    `;
    tbody.appendChild(tr);
  }
});