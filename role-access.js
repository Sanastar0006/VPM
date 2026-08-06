document.addEventListener("DOMContentLoaded", function () {
    // Current user role retrieval (e.g., 'Admin', 'Collection Staff', 'Accountant', 'Management')
    const currentUserRole = (localStorage.getItem("vp_user_role") || "Staff").trim().toLowerCase();

    // --- 1. SIDEBAR ACCESS RESTRICTIONS ---
    const sidebarLinks = document.querySelectorAll("aside nav a");

    sidebarLinks.forEach(link => {
        const text = link.innerText.trim();

        // Admin OR Collection Staff-kku Cash Book & Bank Book marayanum
        if (currentUserRole.includes("admin") || currentUserRole.includes("collection")) {
            if (text.includes("Cash Book") || text.includes("Bank Book")) {
                link.style.display = "none";
            }
        }
    });

    // --- 2. TRANSACTION.HTML SPECIFIC RESTRICTIONS (Collection Staff) ---
    if (window.location.pathname.includes("transaction.html")) {
        if (currentUserRole.includes("collection")) {
            // Hide Account Transaction Tab / Form for Collection Staff
            const accountTransTab = document.querySelector("[data-tab='account']") || 
                                    document.getElementById("accountTransTab") || 
                                    document.getElementById("accountTransactionSection");
            
            if (accountTransTab) {
                accountTransTab.style.display = "none";
            }

            // Dropdown option irundha remove pannanum
            const transTypeSelect = document.getElementById("transactionType");
            if (transTypeSelect) {
                Array.from(transTypeSelect.options).forEach(option => {
                    if (option.value.toLowerCase().includes("account") || option.text.toLowerCase().includes("account")) {
                        option.remove();
                    }
                });
            }
        }
    }

    // --- 3. DELETE BUTTON RESTRICTION LOGIC ---
    function applyDeleteRestrictions() {
        // ONLY Admin and Collection Staff roles-kku delete options block pannanum
        const shouldHideDelete = currentUserRole.includes("admin") || currentUserRole.includes("collection");

        if (shouldHideDelete) {
            // Find all delete buttons (trash icons, title with 'delete', or delete onclicks)
            const deleteButtons = document.querySelectorAll("button[title*='Delete'], .fa-trash, [onclick*='delete']");
            
            deleteButtons.forEach(btn => {
                const targetBtn = btn.tagName === "I" ? btn.closest("button") || btn : btn;
                if (targetBtn) {
                    targetBtn.style.display = "none";
                }
            });
        }
    }

    // Initial run & continuous DOM observer for dynamically rendered tables
    applyDeleteRestrictions();
    
    const observer = new MutationObserver(applyDeleteRestrictions);
    observer.observe(document.body, { childList: true, subtree: true });
});
