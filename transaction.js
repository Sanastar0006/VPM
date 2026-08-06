function switchTab(tabType) {
    // Check if Collection Staff is trying to access Accounts Transaction
    const storedRole = (localStorage.getItem("vp_user_role") || "").toLowerCase();
    const bodyText = (document.body.innerText || "").toLowerCase();
    const isCollection = storedRole.includes("collection") || bodyText.includes("(collection staff)");

    if (isCollection && tabType === "account") {
        tabType = "receipt"; // Force to Customer Receipt
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
