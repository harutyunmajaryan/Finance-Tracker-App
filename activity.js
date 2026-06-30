if (!document.getElementById('transaction-rows')) {
    console.log("Not on activity page. Skipping activity.js execution.");
} else {
    const AddMoney = document.getElementById("add-money");
    const WithdrawMoney = document.getElementById("withdraw-money");
    const clearAllButton = document.getElementById('clear-all');
    const SearchButton = document.getElementById('search-button');
    const RefreshButton = document.getElementById('refresh');

    function parsingBalance() {
       let balanceElement = document.getElementById("balance-price-value") || 
                            document.getElementById('transaction-balance-price');
       if (balanceElement) {
           let BalanceText = balanceElement.innerText.trim();
           let clearedText = BalanceText.replace(/[^0-9.]/g, "");
           let floatBalance = parseFloat(clearedText);
           return isNaN(floatBalance) ? 0 : floatBalance; 
       }
       return 0; 
    }

    function updateProfit() {
        const balance = parsingBalance();
        const totalPriceEl = document.getElementById('total-price-value');
        const totalExpenses = totalPriceEl ? parseFloat(totalPriceEl.innerText.replace(/[^0-9.]/g, "")) || 0 : 0;
        const profit = balance - totalExpenses;
        const profitEl = document.getElementById('profit-price-value');
        if (profitEl) {
            profitEl.textContent = (profit >= 0 ? "+$" : "-$") + Math.abs(profit).toFixed(2);
        }
    }

    function saveToLocalStorage() {
        const tbody = document.getElementById('transaction-rows');
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
                        destination: row.cells[5] ? row.cells[5].innerText : "Your Own Account"
                    };
                    transactions.push(rowData);
                }
            });
            localStorage.setItem('saved_transactions_act', JSON.stringify(transactions));
        }
        
        const balanceEl = document.getElementById("balance-price-value") || 
                          document.getElementById('transaction-balance-price');
        if (balanceEl) localStorage.setItem('saved_balance', balanceEl.textContent);
        
        const totalEl = document.getElementById("total-price-value");
        if (totalEl) localStorage.setItem('saved_totalexpenses', totalEl.textContent);
    }

    function loadFromLocalStorage() {
        let savedBalance = localStorage.getItem('saved_balance');
        if (!savedBalance || savedBalance === "$0.00") {
            savedBalance = "$2470.00";
            localStorage.setItem('saved_balance', savedBalance);
        }

        const balanceEl = document.getElementById("balance-price-value") || 
                          document.getElementById('transaction-balance-price');
        if (balanceEl) balanceEl.textContent = savedBalance;

        const savedTotalExpenses = localStorage.getItem('saved_totalexpenses');
        const totalEl = document.getElementById("total-price-value");
        if (totalEl && savedTotalExpenses) totalEl.textContent = savedTotalExpenses;

        const savedTransactions = localStorage.getItem('saved_transactions_act');
        const tbody = document.getElementById('transaction-rows');
        
        if (tbody && savedTransactions) {
            const transactions = JSON.parse(savedTransactions);
            tbody.innerHTML = '';
            transactions.forEach(tx => {
                const rowString = `
                    <tr class="activity-form-row">
                        <td>${tx.date}</td>
                        <td><span class="${tx.typeClass}">${tx.typeText}</span></td>
                        <td>${tx.account}</td>
                        <td>${tx.reference}</td>
                        <td class="${tx.amountClass}">${tx.amount}</td>
                        <td>${tx.destination || 'Your Own Account'}</td>
                    </tr>
                `;
                tbody.insertAdjacentHTML('beforeend', rowString);
            });
        }

        updateProfit();
    }

    function addMoney(buttonElement1) { 
        if (buttonElement1) {
            buttonElement1.addEventListener('click', () => {
                const modalOverlay = document.createElement('div');
                modalOverlay.id = 'dynamic-modal-overlay';
                modalOverlay.innerHTML = `
                   <div class="pop-up-window" id="pop-up-window">
                      <button class="close">X</button>
                      <h3 class="pop-up-text">Fill your credentials below</h3>
                      <h3 class="account-number">Account Number: </h3>
                      <input class="input-acc-num" type="text" id="acc-number" placeholder="e.g. 90347859">
                      <h3 class="sort-code">Sort Code: </h3>
                      <input class="input-sort-code" type="text" id="sort-code" placeholder="e.g. 34-55-76">
                      <h3 class="reason">Reason: </h3>
                      <input class="input-reason" type="text" id="reason-id" placeholder="e.g. groceries">
                      <input class="input-price2" type="text" placeholder="Enter price (e.g. 2000)" id="input-price">
                      <button class="submit-btn" id="submit-btn">Submit</button>
                   </div>
                `;
                
                document.body.appendChild(modalOverlay);
                Object.assign(modalOverlay.style, {
                    position: 'fixed', top: '0', left: '0', width: '100vw', height: '100vh',
                    backgroundColor: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(3px)',
                    display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: '9999'
                });

                modalOverlay.querySelector('.close').addEventListener('click', () => modalOverlay.remove());

                const errorMsg = document.createElement('p');
                errorMsg.style.cssText = 'color:#c0392b;font-size:13px;margin:6px 0 0;text-align:center;';
                modalOverlay.querySelector('#pop-up-window').appendChild(errorMsg);

                modalOverlay.querySelector("#submit-btn").addEventListener('click', () => {
                    errorMsg.textContent = '';
                    let rawInput = modalOverlay.querySelector("#input-price").value; 
                    let InputPriceFloat = parseFloat(rawInput.replace(/[$,]/g, ""));  
                    let floatBalance = parsingBalance(); 
                    
                    const PersonalAccNumber = "90347859";
                    const PersonalSortCode = "345576";
                    const Actions = "Bank Transfer";

                    const InputAccNumber = modalOverlay.querySelector("#acc-number").value.trim();
                    const InputSortCode = modalOverlay.querySelector("#sort-code").value.replace(/[\s\-]/g, "");
                    const credsOk = InputAccNumber === PersonalAccNumber && InputSortCode === PersonalSortCode;

                    if (!credsOk) {
                        errorMsg.textContent = "Credentials error! Please match the Account details listed on screen.";
                        return; 
                    }
                    if (isNaN(InputPriceFloat) || InputPriceFloat <= 0) {
                        errorMsg.textContent = "Please enter a valid amount greater than 0.";
                        return;
                    }
                    if (InputPriceFloat > 20000.0) {
                        errorMsg.textContent = "Amount must be £20,000 or less per transaction.";
                        return;
                    }

                    let finalBalance = floatBalance + InputPriceFloat;
                    const balEl = document.getElementById("balance-price-value") || document.getElementById('transaction-balance-price');
                    if (balEl) balEl.textContent = "$" + finalBalance.toFixed(2);

                    const tbody = document.getElementById('transaction-rows');
                    const Reason = modalOverlay.querySelector('#reason-id').value.trim() || "Deposit";
                    const DefaultDate = new Date().toLocaleDateString('hy-AM');

                    const ActivityForm = `
                    <tr class="activity-form-row">
                        <td>${DefaultDate}</td>
                        <td><span class="tx-type deposit">${Actions}</span></td>
                        <td>Acc: ${PersonalAccNumber}<br><small>Sort: 34-55-76</small></td>
                        <td>${Reason}</td>
                        <td class="amount-positive">+$${InputPriceFloat.toFixed(2)}</td>
                        <td>Your Own Account</td>
                    </tr>
                    `;

                    if(tbody) tbody.insertAdjacentHTML('afterbegin', ActivityForm);
                    updateProfit();
                    saveToLocalStorage();
                    modalOverlay.remove(); 
                });
            });
        }
    }

    function withdrawMoney(buttonElement2) { 
        if (buttonElement2) {
            buttonElement2.addEventListener('click', () => {
                const modalOverlay = document.createElement('div');
                modalOverlay.id = 'dynamic-modal-overlay';
                modalOverlay.innerHTML = `
                   <div class="pop-up-window" id="pop-up-window">
                      <button class="close">X</button>
                      <h3 class="pop-up-text">Withdraw Funds</h3>
                      <h3 class="reason">Reason: </h3>
                      <input class="input-reason" type="text" id="withdraw-reason-id" placeholder="e.g. cash out">
                      <input class="input-price2" type="text" placeholder="Enter price (e.g. 2000)" id="input-price">
                      <button class="submit-btn" id="submit-btn" style="background-color: #9e392e;">Submit</button>
                   </div>
                `;
                
                document.body.appendChild(modalOverlay);
                Object.assign(modalOverlay.style, {
                    position: 'fixed', top: '0', left: '0', width: '100vw', height: '100vh',
                    backgroundColor: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(3px)',
                    display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: '9999'
                });

                modalOverlay.querySelector('.close').addEventListener('click', () => modalOverlay.remove());

                modalOverlay.querySelector("#submit-btn").addEventListener('click', () => {
                    let InputPriceFloat = parseFloat(modalOverlay.querySelector("#input-price").value.replace(/[$,]/g, ""));
                    let floatBalance = parsingBalance();

                    if (!isNaN(InputPriceFloat) && InputPriceFloat > 0 && InputPriceFloat <= 20000.0) {
                        if (InputPriceFloat > floatBalance) {
                            alert("You do not have enough money");
                        } else {
                            const totalPriceEl = document.getElementById('total-price-value');
                            let TotalExpensesFloat = totalPriceEl ? parseFloat(totalPriceEl.innerText.replace(/[$,]/g, "")) || 0 : 0;

                            let finalBalance = floatBalance - InputPriceFloat;
                            TotalExpensesFloat = TotalExpensesFloat + InputPriceFloat;

                            const balEl = document.getElementById("balance-price-value") || document.getElementById('transaction-balance-price');
                            if (balEl) balEl.textContent = "$" + finalBalance.toFixed(2);
                            if (totalPriceEl) totalPriceEl.textContent = "$" + TotalExpensesFloat.toFixed(2);

                            const tbody = document.getElementById('transaction-rows');
                            const Reason = modalOverlay.querySelector('#withdraw-reason-id').value.trim() || "Withdrawal";
                            const DefaultDate = new Date().toLocaleDateString('hy-AM');

                            const ActivityFormWithdrawal = `
                            <tr class="activity-form-row">
                                <td>${DefaultDate}</td>
                                <td><span class="tx-type transfer">Withdrawal</span></td>
                                <td>Acc: 90347859<br><small>Sort: 34-55-76</small></td>
                                <td>${Reason}</td>
                                <td class="amount-negative">-$${InputPriceFloat.toFixed(2)}</td>
                                <td>Your Own Account</td>
                            </tr>
                            `;

                            if(tbody) tbody.insertAdjacentHTML('afterbegin', ActivityFormWithdrawal);
                            updateProfit();
                            saveToLocalStorage();
                            modalOverlay.remove();
                        }
                    } else {
                        alert("Enter a valid number");
                    }
                });
            });
        }
    }

    function clearAll(buttonElement3){
        if (buttonElement3){
            buttonElement3.addEventListener('click', () => {
                const transRows = document.getElementById('transaction-rows');
                if (transRows) transRows.innerHTML = '';
                const balanceEl = document.getElementById("balance-price-value") || document.getElementById('transaction-balance-price');
                const totalEl = document.getElementById("total-price-value");
                const profitEl = document.getElementById("profit-price-value");
                if (balanceEl) balanceEl.textContent = "$0.00";
                if (totalEl) totalEl.textContent = "$0.00";
                if (profitEl) profitEl.textContent = "+$0.00";
                localStorage.removeItem('saved_transactions_act');
                localStorage.removeItem('saved_balance');
                localStorage.removeItem('saved_totalexpenses');
            });
        }
    }

    function SearchEngine(buttonElement4) {
        if (buttonElement4) {
            buttonElement4.addEventListener('click', () => {
                const transRows = document.querySelectorAll('#transaction-rows tr');
                const searchText = document.getElementById('tx-search').value.trim();
                const matchedRows = [];

                transRows.forEach(row => {
                    if (row.cells[0] && row.cells[0].innerText === searchText) {
                        matchedRows.push(row);
                    }
                });

                const modalOverlay = document.createElement('div');
                modalOverlay.id = 'search-modal-overlay';

                if (matchedRows.length === 0) {
                    modalOverlay.innerHTML = `
                        <div class="pop-up-window2" id="pop-up-window-transaction">
                            <button class="close-search2">X</button>
                            <h3 class="pop-up-text2">No transactions found for ${searchText}</h3>
                        </div>
                    `;
                } else {
                    let sectionsHTML = '';
                    matchedRows.forEach(row => {
                        sectionsHTML += `
                            <div class="small-section-of-transaction"> 
                                <h3 class="pop-up-text2">Transaction on ${searchText}</h3>
                                <h3 class="transaction-date">Date: ${row.cells[0].innerText}</h3>
                                <h3 class="transaction-type">Type: ${row.cells[1].innerText}</h3>
                                <h3 class="transaction-accdetails">Account Details: ${row.cells[2].innerText}</h3>
                                <h3 class="transaction-reference">Reference: ${row.cells[3].innerText}</h3>
                                <h3 class="transaction-amount">Amount: ${row.cells[4].innerText}</h3>
                                <h3 class="transaction-to">${row.cells[5].innerText}</h3>
                            </div>
                        `;
                    });

                    modalOverlay.innerHTML = `
                        <div class="pop-up-window2" id="pop-up-window-transaction">
                            <button class="close-search2">X</button>
                            <h3 class="pop-up-text2">All transactions on ${searchText}</h3>
                            ${sectionsHTML}
                        </div>
                    `;
                }

                document.body.appendChild(modalOverlay);

                Object.assign(modalOverlay.style, {
                    position: 'fixed', top: '0', left: '0', width: '100vw', height: '100vh',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex',
                    justifyContent: 'center', alignItems: 'center', zIndex: '9999'
                });

                modalOverlay.addEventListener('click', (e) => {
                    if (e.target.classList.contains('close-search2')) {
                        modalOverlay.remove();
                    }
                });
            }); 
        }
    }

    function Refresh(buttonElement5){
        if(buttonElement5){
            buttonElement5.addEventListener('click', () => {
                const BalancePrice = document.getElementById('balance-price-value') || document.getElementById('transaction-balance-price');
                const TotalPrice = document.getElementById('total-price-value');
                const transRows = document.getElementById('transaction-rows');

                if(BalancePrice) BalancePrice.textContent = "$0.00";
                if(TotalPrice) TotalPrice.textContent = "$0.00";
                if(transRows) transRows.innerHTML = '';

                localStorage.removeItem('saved_balance');
                localStorage.removeItem('saved_totalexpenses');
                localStorage.removeItem('saved_transactions_act');

                updateProfit();
            });
        }
    }

    if (RefreshButton) Refresh(RefreshButton);
    if (AddMoney) addMoney(AddMoney);
    if (WithdrawMoney) withdrawMoney(WithdrawMoney);
    if (clearAllButton) clearAll(clearAllButton);
    if (SearchButton) SearchEngine(SearchButton);

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadFromLocalStorage);
    } else {
        loadFromLocalStorage();
    }
}
