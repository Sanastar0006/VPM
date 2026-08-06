document.addEventListener("DOMContentLoaded", function () {
    // 1. Fetch User Role safely from localStorage
    let rawRole = localStorage.getItem("vp_user_role") || "";
    if (!rawRole && localStorage.getItem("vp_user")) {
        try {
            const userObj = JSON.parse(localStorage.getItem("vp_user"));
            rawRole = userObj.role || "";
        } catch (e) { console.error(e); }
    }
    
    // Also check page text like "Logged in as: ... (Collection Staff)"
    const bodyText = document.body.innerText || "";
    const isCollectionStaff = rawRole.toLowerCase().includes("collection") || 
                              bodyText.includes("(Collection Staff)");
    const isAdmin = rawRole.toLowerCase().includes("admin") || 
                    bodyText.includes("(Admin)");

    // --- RULE A: DASHBOARD CARDS HIDING (For Collection Staff) ---
    if (window.location.pathname.includes("dashboard.html") || window.location.pathname.endsWith("/")) {
        if (isCollectionStaff) {
            // Find all cards on Dashboard
            const cards = document.querySelectorAll(".glass-card, div[class*='rounded'], a[href]");
            cards.forEach(card => {
                const text = card.innerText || "";
                // Hide restricted modules on Dashboard for Collection Staff
                if (text.includes("Capital Disbursement") || 
                    text.includes("Add New Employee") || 
                    text.includes("Employee Details") || 
                    text.includes("Cash Book") || 
                    text.includes("Bank Book")) {
                    
                    // If card is wrapped in anchor or grid container, hide it
                    const parentCard = card.closest("a") || card.closest(".grid > div") || card;
                    if (parentCard) parentCard.style.display = "none";
                }
            });
        }
    }

    // --- RULE B: SIDEBAR MENU RESTRICTIONS ---
    const sidebarLinks = document.querySelectorAll("aside nav a, #sidebar a");
    sidebarLinks.forEach(link => {
        const text = link.innerText.trim();
        
        // Admin & Collection Staff - Cash Book & Bank Book marayanum
        if (isAdmin || isCollectionStaff) {
            if (text.includes("Cash Book") || text.includes("Bank Book")) {
                link.style.display = "none";
            }
        }

        // Collection Staff - Admin pages in sidebar
        if (isCollectionStaff) {
            if (text.includes("Capital Disbursement") || text.includes("Add New Employee")) {
                link.style.display = "none";
            }
        }
    });

    // --- RULE C: TRANSACTION.HTML TAB RESTRICTION (Pic 3 Fix) ---
    if (window.location.pathname.includes("transaction.html")) {
        if (isCollectionStaff) {
            // Find all buttons containing text 'Accounts Transaction'
            const allButtons = document.querySelectorAll("button, div, a");
            allButtons.forEach(btn => {
                if (btn.innerText && btn.innerText.includes("Accounts Transaction")) {
                    btn.style.display = "none"; // Hide Accounts Transaction button/tab
                }
            });

            // Auto-click Customer Receipt Tab if available & show only Receipt Form
            const receiptTabBtn = Array.from(document.querySelectorAll("button")).find(b => b.innerText.includes("Customer Receipt"));
            if (receiptTabBtn) {
                receiptTabBtn.click();
            }
        }
    }

    // --- RULE D: DELETE BUTTON RESTRICTION (For Admin & Collection Staff) ---
    function hideDeleteButtons() {
        if (isAdmin || isCollectionStaff) {
            // Hide trash icons, delete buttons, delete column headers
            const deleteElements = document.querySelectorAll("button[title*='Delete'], .fa-trash, [onclick*='delete'], .fa-trash-can");
            deleteElements.forEach(el => {
                const target = el.tagName === "I" ? (el.closest("button") || el) : el;
                if (target) target.style.display = "none";
            });
        }
    }

    // Run delete cleanup & observe dynamic changes
    hideDeleteButtons();
    const observer = new MutationObserver(hideDeleteButtons);
    observer.observe(document.body, { childList: true, subtree: true });
});
