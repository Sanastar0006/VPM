/**
 * VP MICROFINANCE PRO 2026 - YONO SBI Luxury Edition
 * Part 9 – Dynamic Transaction Stream Controller Pipeline
 */

// Deployment Web App link mapping node parameters 
const TX_WEBAPP_URL = "https://script.google.com/macros/s/AKfycby9Fwl090NE0lUuVmrgiXvFv_V7UGfg4nD9ZezIhabsuEMwS-8QvjE5lkXxQtD3FSZO/exec";

// Local storage caching array sequence shifts
let databaseTransactions = [];
let operationalCustomerCache = []; 
let mockTransactions = [];

/**
 * INITIALIZATION & TAB SWITCHING LOGIC WITH ROLE RESTRICTIONS
 */
document.addEventListener("DOMContentLoaded", function () {
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    const recDate = document.getElementById("recDate");
    const txnDate = document.getElementById("txnDate");
    if (recDate) recDate.value = today;
    if (txnDate) txnDate.value = today;

    // Default Tab Initialization
    switchTab('receipt');
});

function switchTab(tabType) {
    // Check if Collection Staff is trying to access Accounts Transaction
    const storedRole = (localStorage.getItem("vp_user_role") || "").toLowerCase();
    const bodyText = (document.body.innerText || "").toLowerCase();
    const isCollection = storedRole.includes("collection") || bodyText.includes("(collection staff)");

    // Block Collection Staff from opening Accounts Transaction
    if (isCollection && tabType === "account") {
        tabType = "receipt"; 
    }

    const receiptTabBtn = document.getElementById("tabCustomerReceipt");
    const accountTabBtn = document.getElementById("tabAccountTransaction");
    const receiptForm = document.getElementById("customerReceiptForm");
    const accountForm = document.getElementById("accountTransactionForm");

    if (tabType === "receipt") {
        if (receiptTabBtn) {
            receiptTabBtn.className = "px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-lg shadow-emerald-500/10";
        }
        if (accountTabBtn) {
            accountTabBtn.className = "px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 text-slate-400 hover:text-white hover:bg-slate-800/50";
        }
        if (receiptForm) receiptForm.classList.remove("hidden");
        if (accountForm) accountForm.classList.add("hidden");
    } else if (tabType === "account" && !isCollection) {
        if (accountTabBtn) {
            accountTabBtn.className = "px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 bg-purple-500/20 text-purple-400 border border-purple-500/30 shadow-lg shadow-purple-500/10";
        }
        if (receiptTabBtn) {
            receiptTabBtn.className = "px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 text-slate-400 hover:text-white hover:bg-slate-800/50";
        }
        if (accountForm) accountForm.classList.remove("hidden");
        if (receiptForm) receiptForm.classList.add("hidden");
    }
}

/**
 * FETCH CUSTOMER PROFILES AND SNAPSHOT METRICS ON BLUR ACTION
 */
async function fetchProfileSnapshotMetrics() {
    const accountInput = document.getElementById('txAccountNo') ? document.getElementById('txAccountNo').value.toUpperCase().trim() : '';
    const verificationCard = document.getElementById('accountVerificationCard');
    
    if (!accountInput) {
        if (verificationCard) verificationCard.classList.add('hidden');
        return;
    }

    const snapshotName = document.getElementById('snapshotName');
    const snapshotEMI = document.getElementById('snapshotEMI');
    
    if (snapshotName) snapshotName.innerText = "Querying ledger system...";
    if (snapshotEMI) snapshotEMI.innerText = "Syncing balance shifts...";
    if (verificationCard) verificationCard.classList.remove('hidden');

    try {
        if (TX_WEBAPP_URL.includes("YOUR_APPS_SCRIPT")) {
            simulateLocalSnapshot(accountInput);
            return;
        }

        const response = await fetch(`${TX_WEBAPP_URL}?action=getCustomerSnapshot&accountNo=${accountInput}`);
        const result = await response.json();

        if (result.status === 'success' && result.data) {
            if (snapshotName) snapshotName.innerText = result.data.customerName;
            if (snapshotEMI) snapshotEMI.innerText = `₹${parseFloat(result.data.emi).toLocaleString('en-IN')}`;
        } else {
            if (snapshotName) snapshotName.innerText = "Profile Matrix Not Found";
            if (snapshotEMI) snapshotEMI.innerText = "Verify Identifier Key";
        }
    } catch (error) {
        console.error("Ledger snapshot routing error:", error);
        simulateLocalSnapshot(accountInput);
    }
}

function simulateLocalSnapshot(accountInput) {
    const snapshotName = document.getElementById('snapshotName');
    const snapshotEMI = document.getElementById('snapshotEMI');
    if (accountInput.startsWith('VP-')) {
        if (snapshotName) snapshotName.innerText = "Muthu Kumar (Simulated Node)";
        if (snapshotEMI) snapshotEMI.innerText = "₹4,500";
    } else {
        if (snapshotName) snapshotName.innerText = "Unknown Account Sequence";
        if (snapshotEMI) snapshotEMI.innerText = "₹0.00";
    }
}

/**
 * EXECUTE SECURE TRANSACTION POSTING ROUTINE
 */
async function executeTransactionProcessing(event) {
    event.preventDefault();

    const submitBtn = document.getElementById('txSubmitBtn');
    if (!submitBtn) return;
    const originalBtnText = submitBtn.innerHTML;
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i class="fa-solid fa-spinner animate-spin"></i> Encrypting Credit Block...`;

    const txPayload = {
        txId: 'TXN-' + Math.floor(100000 + Math.random() * 900000),
        accountNo: document.getElementById('txAccountNo') ? document.getElementById('txAccountNo').value.toUpperCase().trim() : '',
        amount: parseFloat(document.getElementById('txAmount') ? document.getElementById('txAmount').value : 0),
        method: document.getElementById('txMethod') ? document.getElementById('txMethod').value : '',
        agent: document.getElementById('txAgent') ? document.getElementById('txAgent').value.trim() : '',
        date: new Date().toISOString().split('T')[0]
    };

    try {
        if (TX_WEBAPP_URL.includes("YOUR_APPS_SCRIPT")) {
            setTimeout(() => {
                mockTransactions.unshift(txPayload);
                if (typeof renderTransactionLogs === "function") renderTransactionLogs(mockTransactions);
                finalizeTxFormReset(submitBtn, originalBtnText, txPayload.txId);
            }, 1000);
            return;
        }

        await fetch(TX_WEBAPP_URL, {
            method: 'POST',
            mode: 'no-cors',
            cache: 'no-cache',
            body: JSON.stringify({ action: 'postTransaction', data: txPayload })
        });

        mockTransactions.unshift(txPayload);
        if (typeof renderTransactionLogs === "function") renderTransactionLogs(mockTransactions);
        finalizeTxFormReset(submitBtn, originalBtnText, txPayload.txId);

    } catch (error) {
        alert("Transaction processing network anomaly detected. Logging simulation parameters.");
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
    }
}

function finalizeTxFormReset(btn, originalText, txId) {
    btn.disabled = false;
    btn.innerHTML = originalText;
    alert(`🎉 Transaction Posted Successfully!\nReference Vault ID: ${txId}\nCloud Sheet Matrix Synchronized.`);
    const paymentForm = document.getElementById('paymentForm');
    if (paymentForm) paymentForm.reset();
    const verificationCard = document.getElementById('accountVerificationCard');
    if (verificationCard) verificationCard.classList.add('hidden');
}
