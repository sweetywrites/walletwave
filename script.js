const balance = document.getElementById('balance');
const income = document.getElementById('income');
const expense = document.getElementById('expense');
const description = document.getElementById('description');
const amountInt = document.getElementById('amount');
const list = document.getElementById('list');
const form = document.getElementById('form');

let data = JSON.parse(localStorage.getItem('transactions')) || [];

let incomeTotal = 0;
let expenseTotal = 0;

let myChart;

function addTransaction() {

    const item = description.value.trim();
    const price = parseFloat(amountInt.value);

    if (item === "" || isNaN(price) || price === 0) return;

    const obj = {
        id: Date.now(),
        text: item,
        amount: price
    };

    data.push(obj);

    localStorage.setItem("transactions", JSON.stringify(data));

    showTransaction(obj);
    updateValues();
    updateChart();

    description.value = "";
    amountInt.value = "";
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    addTransaction();
});

function showTransaction(obj) {

    const li = document.createElement('li');

    li.classList.add(obj.amount >= 0 ? "income-item" : "expense-item");

    li.innerHTML = `
        ${obj.text} ${obj.amount >= 0 ? '+' : '-'} ₹${Math.abs(obj.amount)}
    `;

    const deleteBtn = document.createElement('button');

    deleteBtn.innerHTML = "🗑";

    deleteBtn.classList.add('delete-btn');

    deleteBtn.addEventListener('click', () => {

        data = data.filter(item => item.id !== obj.id);

        li.remove();

        localStorage.setItem("transactions", JSON.stringify(data));

        updateValues();
        updateChart();
    });

    li.appendChild(deleteBtn);

    list.appendChild(li);
}

function updateValues() {

    incomeTotal = 0;
    expenseTotal = 0;

    data.forEach(obj => {

        if (obj.amount >= 0) {
            incomeTotal += obj.amount;
        } else {
            expenseTotal += Math.abs(obj.amount);
        }
    });

    income.innerText = incomeTotal;
    expense.innerText = expenseTotal;
    balance.innerText = incomeTotal - expenseTotal;
}

function init() {

    list.innerHTML = "";

    data.forEach(obj => showTransaction(obj));

    updateValues();
    updateChart();
}

function updateChart() {

    const ctx = document.getElementById('myChart');

    if (!ctx) return;

    if (myChart) {
        myChart.destroy();
    }

    myChart = new Chart(ctx, {

        type: 'pie',

        data: {

            labels: ['Income', 'Expense'],

            datasets: [{

                data: [incomeTotal, expenseTotal],

                backgroundColor: [
                    '#23c76a',
                    '#c94444'
                ],

                borderWidth: 1
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

window.addEventListener("DOMContentLoaded", () => {
    init();
});