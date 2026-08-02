document.addEventListener("DOMContentLoaded", function () {
    // Current user role retrieval (Default 'Staff' / 'Collection Staff' or 'Admin')
    const currentUserRole = localStorage.getItem("vp_user_role") || "Staff"; // e.g., 'Admin', 'Collection Staff', 'Staff'

    // --- 1. SIDEBAR ACCESS RESTRICTIONS ---
    const sidebarLinks = document.querySelectorAll("aside nav a");

    sidebarLinks.forEach(link => {
        const text = link.innerText.trim();

        // If User is ADMIN
        if (currentUserRole.toLowerCase().includes("admin")) {
            // Hide Cash Book & Bank Book for Admin as requested
            if (text.includes("Cash Book") || text.includes("Bank Book")) {
                link.style.display = "none";
            }
        }

        // If User is COLLECTION STAFF
        if (currentUserRole.toLowerCase().includes("collection") || currentUserRole.toLowerCase().includes("staff")) {
            // Hide admin-only menu items if needed
            if (text.includes("Cash Book") || text.includes("Bank Book")) {
                link.style.display = "none";
            }
        }
    });

    // --- 2. TRANSACTION.HTML SPECIFIC RESTRICTIONS ---
    if (window.location.pathname.includes("transaction.html")) {
        if (currentUserRole.toLowerCase().includes("collection") || currentUserRole.toLowerCase().includes("staff")) {
            // Hide Account Transaction Tab / Form Options for Collection Staff
            const accountTransTab = document.querySelector("[data-tab='account']") || 
                                    document.getElementById("accountTransTab") || 
                                    document.getElementById("accountTransactionSection");
            
            if (accountTransTab) {
                accountTransTab.style.display = "none";
            }

            // If there's a dropdown option for Account Transaction, hide or disable it
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

    // --- 3. DELETE BUTTON HIDING (FOR ADMIN & STAFF) ---
    // Function to hide delete buttons dynamically (since tables render via JS)
    function hideDeleteButtons() {
        if (currentUserRole.toLowerCase().includes("admin") || currentUserRole.toLowerCase().includes("staff")) {
            // Select all buttons or icons with 'fa-trash', title 'Delete', or delete onclicks
            const deleteButtons = document.querySelectorAll("button[title*='Delete'], .fa-trash, [onclick*='delete']");
            
            deleteButtons.forEach(btn => {
                const targetBtn = btn.tagName === "I" ? btn.closest("button") || btn : btn;
                if (targetBtn) {
                    targetBtn.style.display = "none";
                }
            });
        }
    }

    // Initial check & continuous check for dynamically loaded tables (like loadReceipts)
    hideDeleteButtons();
    
    // MutationObserver to hide trash buttons when data tables load dynamically
    const observer = new MutationObserver(hideDeleteButtons);
    observer.observe(document.body, { childList: true, subtree: true });
});
