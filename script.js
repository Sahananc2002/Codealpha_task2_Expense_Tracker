const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');

let transactions = [];

// Function to add a transaction
function addTransaction(e) {
  e.preventDefault();

  if (text.value.trim() === '' || amount.value.trim() === '') {
    alert('Please add a text and amount');
  } else {
    const transaction = {
      id: generateID(),
      text: text.value,
      amount: +amount.value
    };

    transactions.push(transaction);

    addTransactionDOM(transaction);

    updateValues();

    updateLocalStorage();

    text.value = '';
    amount.value = '';
  }
}

// Function to generate a random ID
function generateID() {
  return Math.floor(Math.random() * 100000000);
}

// Function to add a transaction to the DOM
function addTransactionDOM(transaction, append = true) {
  const sign = transaction.amount < 0 ? '-' : '+';
  const item = document.createElement('li');
  item.setAttribute('data-id', transaction.id);
  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');
  item.innerHTML = `
    ${transaction.text} <span>${sign}${Math.abs(transaction.amount)}</span> 
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
    <button class="edit-btn" onclick="editTransaction(${transaction.id})">Edit</button>
  `;
  if (append) {
    list.appendChild(item); // Append transaction item
  } else {
    const existingItem = document.querySelector(`#list li[data-id="${transaction.id}"]`);
    if (existingItem) {
      existingItem.innerHTML = item.innerHTML; // Update transaction item
    }
  }
}

// Function to update the balance
function updateValues() {
  const amounts = transactions.map(transaction => transaction.amount);
  const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);
  const income = amounts.filter(item => item > 0).reduce((acc, item) => acc + item, 0).toFixed(2);
  const expense = (amounts.filter(item => item < 0).reduce((acc, item) => acc + item, 0) * -1).toFixed(2);
  balance.innerText = `$${total}`;
  money_plus.innerText = `$${income}`;
  money_minus.innerText = `$${expense}`;
}

// Function to remove a transaction
function removeTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);
  updateLocalStorage();
  init();
}

// Function to update local storage
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Function to initialize the application
function init() {
  const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));
  transactions = localStorageTransactions || [];
  list.innerHTML = '';
  transactions.forEach(addTransactionDOM);
  updateValues();
}

// // Function to edit a transaction
// function editTransaction(id) {
//   console.log('Editing transaction:', id);
//   const transaction = transactions.find(transaction => transaction.id === id);
//   text.value = transaction.text;
//   amount.value = Math.abs(transaction.amount); // Ensure the amount is positive
//   // Remove the transaction from the list
//   transactions = transactions.filter(transaction => transaction.id !== id);
//   updateLocalStorage();
//   updateValues();
// }
// Function to open the edit popup
function openEditPopup(id) {
    const transaction = transactions.find(transaction => transaction.id === id);
    document.getElementById('editId').value = transaction.id;
    document.getElementById('editText').value = transaction.text;
    document.getElementById('editAmount').value = Math.abs(transaction.amount);
    document.getElementById('editPopup').style.display = 'block';
}

// Function to close the edit popup
function closePopup() {
    document.getElementById('editPopup').style.display = 'none';
}

// Function to edit a transaction
function editTransaction(id) {
    openEditPopup(id);
}
// Event listener for edit form submission
document.getElementById('editForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const id = parseInt(document.getElementById('editId').value);
  const newText = document.getElementById('editText').value;
  const newAmount = parseFloat(document.getElementById('editAmount').value);
  
  // Update the transaction in the list
  transactions = transactions.map(transaction => {
      if (transaction.id === id) {
          transaction.text = newText;
          transaction.amount = newAmount;
      }
      return transaction;
  });

  // Update the transaction displayed in the history section
  addTransactionDOM({ id, text: newText, amount: newAmount }, false);

  updateLocalStorage();
  updateValues();
  closePopup();
});

// Initialize the application
init();

// Event listener for form submission
form.addEventListener('submit', addTransaction);