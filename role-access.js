document.addEventListener("DOMContentLoaded", function () {
    // 1. Get Role safely from LocalStorage
    let currentUserRole = "";
    try {
        currentUserRole = localStorage.getItem("vp_user_role") || "";
        if (!currentUserRole && localStorage.getItem("vp_user")) {
            const u = JSON.parse(localStorage.getItem("vp_user"));
            currentUserRole = u.role || u.userRole || "";
        }
    } catch (e) {
        console.error("Role fetching error:", e);
    }

    // Fallback: Read role from top header text if available
    const headerRoleText = document.body.innerText || "";
    const isCollectionStaff = currentUserRole.toLowerCase().includes("collection") || 
                              headerRoleText.includes("Collection Staff");
    const isAdmin = currentUserRole.toLowerCase().includes("admin") || 
                    headerRoleText.includes("(Admin)");

    // =========================================================
    // RULE 1: DASHBOARD CARDS HIDING (For Collection Staff)
    // =========================================================
    if (window.location.pathname.includes("dashboard.html") || window.location.pathname.endsWith("/VPM/")) {
        if (isCollectionStaff) {
            // Find all dashboard card grid items
            const allDashboardCards = document.querySelectorAll("main .grid > div, main a");
            allDashboardCards.forEach(card => {
                const cardText = (card.innerText || "").toLowerCase();
                
                // Hide restricted modules on Dashboard for Collection Staff
                if (cardText.includes("capital disbursement") || 
                    cardText.includes("add new employee") || 
                    cardText.includes("employee details") || 
                    cardText.includes("cash book") || 
                    cardText.includes("bank book")) {
                    
                    card.style.setProperty("display", "none", "important");
                }
            });
        }
    }

    // =========================================================
    // RULE 2: SIDEBAR NAVIGATION RESTRICTIONS
    // =========================================================
    function applySidebarRestrictions() {
        const sidebarLinks = document.querySelectorAll("aside nav a, #sidebar nav a");
        sidebarLinks.forEach(link => {
            const linkText = (link.innerText || "").toLowerCase();

            // Admin & Collection Staff -> Hide Cash Book & Bank Book
            if (isAdmin || isCollectionStaff) {
                if (linkText.includes("cash book") || linkText.includes("bank book")) {
                    link.style.setProperty("display", "none", "important");
                }
            }

            // Collection Staff -> Hide Disbursal & Employee creation
            if (isCollectionStaff) {
                if (linkText.includes("capital disbursement") || linkText.includes("add employee")) {
                    link.style.setProperty("display", "none", "important");
                }
            }
        });
    }
    applySidebarRestrictions();

    // =========================================================
    // RULE 3: TRANSACTION.HTML TAB & FORM RESTRICTION (Pic 3 Fix)
    // =========================================================
    if (window.location.pathname.includes("transaction.html")) {
        if (isCollectionStaff) {
            // Force hide Accounts Transaction tab/button
            const hideAccountTxnTab = () => {
                const buttonsAndTabs = document.querySelectorAll("button, div, a, li");
                buttonsAndTabs.forEach(elem => {
                    const txt = (elem.innerText || "").toLowerCase();
                    if (txt.includes("accounts transaction") || txt.includes("account transaction")) {
                        elem.style.setProperty("display", "none", "important");
                    }
                });

                // Auto Select & Click Customer Receipt Tab if present
                const receiptBtn = Array.from(document.querySelectorAll("button")).find(b => 
                    (b.innerText || "").toLowerCase().includes("customer receipt")
                );
                if (receiptBtn && !receiptBtn.classList.contains("active")) {
                    receiptBtn.click();
                }
            };

            hideAccountTxnTab();
            setTimeout(hideAccountTxnTab, 300); // Trigger after dynamic JS render
        }
    }

    // =========================================================
    // RULE 4: DELETE BUTTON HIDING (For Admin & Collection Staff)
    // =========================================================
    function applyDeleteRestrictions() {
        if (isAdmin || isCollectionStaff) {
            // Target all trash icons, delete buttons, delete onclicks
            const deleteTargets = document.querySelectorAll(
                "button[title*='Delete'], button[onclick*='delete'], .fa-trash, .fa-trash-can, [onclick*='deleteReceipt']"
            );

            deleteTargets.forEach(el => {
                const targetBtn = el.tagName === "I" ? (el.closest("button") || el) : el;
                if (targetBtn) {
                    targetBtn.style.setProperty("display", "none", "important");
                }
            });
        }
    }

    // Run delete removal continuously for dynamic tables (like Receipts / Ledger)
    applyDeleteRestrictions();
    const observer = new MutationObserver(() => {
        applySidebarRestrictions();
        applyDeleteRestrictions();
    });
    observer.observe(document.body, { childList: true, subtree: true });
});
