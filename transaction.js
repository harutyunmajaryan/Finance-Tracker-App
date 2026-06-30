// GUARD: Stop this script immediately if we aren't on the transactions page
if (!document.getElementById('transaction-rows-transaction')) {
    console.log("Not on transactions page. Skipping transaction.js execution.");
} else {
    const AddTransactionButton = document.getElementById('add-transaction');

    function parsingBalance() {
        let balanceElement = document.getElementById('transaction-balance-price') || 
                             document.getElementById("balance-price-value");
        if (balanceElement) {
            let BalanceText = (balanceElement.innerText || balanceElement.textContent).trim();
            let clearedText = BalanceText.replace(/[^0-9.]/g, "");
            let floatBalance = parseFloat(clearedText);
            return isNaN(floatBalance) ? 0 : floatBalance; 
        }
        return 0; 
    }

    function saveToLocalStorage() {
        const tbody = document.getElementById('transaction-rows-transaction');
        const transactions = [];
        
        if (tbody) {
            const rows = tbody.querySelectorAll('tr');
            rows.forEach(row => {
                if(row.cells.length >= 5) {
                    const txTypeEl = row.cells[1].querySelector('.tx-type');
                    const rowData = {
                        date: row.cells[0].innerText,
                        typeClass: txTypeEl ? txTypeEl.className : 'tx-type',
                        typeText: txTypeEl ? txTypeEl.innerText : row.cells[1].innerText,
                        account: row.cells[2].innerHTML,
                        reference: row.cells[3].innerText,
                        amount: row.cells[4].innerText,
                        amountClass: row.cells[4].className,
                        destination: row.cells[5] ? row.cells[5].innerText : "To Bank Account"
                    };
                    transactions.push(rowData);
                }
            });
            localStorage.setItem('saved_transactions_tx', JSON.stringify(transactions));
        }
        
        const currentBalanceText = document.getElementById('transaction-balance-price')?.textContent ||
                                   document.getElementById("balance-price-value")?.textContent;
        if (currentBalanceText) {
            localStorage.setItem('saved_balance', currentBalanceText);
        }
    }

    function loadFromLocalStorage() {
        let savedBalance = localStorage.getItem('saved_balance');
        
        if (!savedBalance || savedBalance === "$0.00") {
            savedBalance = "$2470.00";
            localStorage.setItem('saved_balance', savedBalance);
        }

        const transactionBalanceEl = document.getElementById('transaction-balance-price') || 
                                     document.getElementById("balance-price-value");
        if (transactionBalanceEl) {
            transactionBalanceEl.textContent = savedBalance;
        }

        const savedTransactions = localStorage.getItem('saved_transactions_tx');
        const tbody = document.getElementById('transaction-rows-transaction');
        
        if (tbody && savedTransactions) {
            const transactions = JSON.parse(savedTransactions);
            tbody.innerHTML = '';
            transactions.forEach(tx => {
                const rowString = `
                    <tr class="transactionform">
                        <td>${tx.date}</td>
                        <td><span class="${tx.typeClass}">${tx.typeText}</span></td>
                        <td>${tx.account}</td>
                        <td>${tx.reference}</td>
                        <td class="${tx.amountClass}">${tx.amount}</td>
                        <td>${tx.destination || 'To Bank Account'}</td>
                    </tr>
                `;
                tbody.insertAdjacentHTML('beforeend', rowString);
            });
        }
    }

    function addTransaction(ElementButton) {
        if (ElementButton) {
            ElementButton.addEventListener('click', () => {
                const section = document.createElement('div');
                section.id = 'dynamic-section';
                section.innerHTML = `
                    <div class="pop-up-window" id="pop-up-window">
                        <button class="close-button">X</button>
                        <h3 class="pop-up-text">Fill your credentials below</h3>
                        <h3 class="account-number-transaction">Account Number: </h3>
                        <input class="input-acc-num-transaction" type="text" id="acc-number-transaction" placeholder="e.g. 90347859">
                        <h3 class="sort-code-transaction">Sort Code: </h3>
                        <input class="input-sort-code-transaction" type="text" id="sort-code-transaction" placeholder="e.g. 34-55-76">
                        <h3 class="reason-transaction">Reason: </h3>
                        <input class="input-reason-transaction" type="text" id="reason-id-transaction" placeholder="e.g. groceries">
                        <input class="input-price2-transaction" type="text" placeholder="Enter price (e.g. 2000)" id="input-price-transaction">
                        <button class="submit-btn-transaction" id="submit-btn-transaction">Submit</button>
                    </div>
                `;

                Object.assign(section.style, {
                    position: 'fixed', top: '0', left: '0', width: '100vw', height: '100vh',
                    backgroundColor: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(3px)',
                    display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: '9999'
                });

                document.body.appendChild(section);

                section.querySelector('.close-button').addEventListener('click', () => section.remove());

                section.querySelector('#submit-btn-transaction').addEventListener('click', () => {
                    const Reason = section.querySelector('#reason-id-transaction').value.trim() || "Transfer";
                    const DefaultDate = new Date().toLocaleDateString('hy-AM');
                    const Actions = "Bank Transfer";
                    const AccountNumber = section.querySelector('#acc-number-transaction').value.trim();
                    const SortCode = section.querySelector('#sort-code-transaction').value.trim();

                    const AccountNumberChecker = AccountNumber;
                    const SortCodeChecker = SortCode.replace(/[\s\-]/g, '');
                    
                    const rawPriceValue = section.querySelector('#input-price-transaction').value || "";
                    const TransferredMoney = parseFloat(rawPriceValue.replace(/[^0-9.]/g, ''));

                    if (isNaN(TransferredMoney) || TransferredMoney <= 0) {
                        alert("Please enter a valid amount.");
                        return;
                    }

                    let FloatCurrentBalancePrice = parsingBalance();

                    if (TransferredMoney > FloatCurrentBalancePrice) {
                        alert("You do not have enough balance.");
                        return;
                    }

                    if (AccountNumberChecker.length === 8 && SortCodeChecker.length === 6 && AccountNumber && SortCode) {
                        let UpdatedBalance = FloatCurrentBalancePrice - TransferredMoney;
                        
                        const balEl = document.getElementById('transaction-balance-price') || 
                                      document.getElementById("balance-price-value");
                        if (balEl) balEl.textContent = "$" + UpdatedBalance.toFixed(2);

                        const tbody = document.getElementById('transaction-rows-transaction');
                        const TransactionForm = `
                            <tr class="transactionform">
                                <td>${DefaultDate}</td>
                                <td><span class="tx-type transfer">${Actions}</span></td>
                                <td>Acc: ${AccountNumber}<br><small>Sort: ${SortCode}</small></td>
                                <td>${Reason}</td>
                                <td class="amount-negative">-$${TransferredMoney.toFixed(2)}</td>
                                <td>To Bank Account</td>
                            </tr>
                        `;

                        if(tbody) tbody.insertAdjacentHTML('afterbegin', TransactionForm);
                        
                        saveToLocalStorage();
                        section.remove();
                    } else {
                        alert('Wrong Account Number or Sort Code, try again!');
                    }
                });
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            loadFromLocalStorage();
            if (AddTransactionButton) addTransaction(AddTransactionButton);
        });
    } else {
        loadFromLocalStorage();
        if (AddTransactionButton) addTransaction(AddTransactionButton);
    }
}
