document.addEventListener("DOMContentLoaded", function () {
    // 1. Fetch User Data from LocalStorage
    let currentUserRole = "";
    try {
        const storedRole = localStorage.getItem("vp_user_role");
        if (storedRole) {
            currentUserRole = storedRole;
        } else {
            const storedUser = localStorage.getItem("vp_user");
            if (storedUser) {
                const parsed = JSON.parse(storedUser);
                currentUserRole = parsed.role || parsed.userRole || "";
            }
        }
    } catch (e) {
        console.error("Error reading role:", e);
    }

    const roleLower = currentUserRole.toLowerCase().trim();
    const bodyText = (document.body.innerText || "").toLowerCase();

    const isCollectionStaff = roleLower.includes("collection") || bodyText.includes("(collection staff)");
    const isAdmin = roleLower.includes("admin") || bodyText.includes("(admin)");

    // ==========================================
    // 2. DASHBOARD CARDS RESTRICTIONS
    // ==========================================
    if (window.location.pathname.includes("dashboard.html") || window.location.pathname.endsWith("/VPM/")) {
        if (isCollectionStaff) {
            const cards = document.querySelectorAll(".glass-card, main .grid > div, main a");
            cards.forEach(card => {
                const text = (card.innerText || "").toLowerCase();
                if (
                    text.includes("capital disbursement") ||
                    text.includes("add new employee") ||
                    text.includes("employee details") ||
                    text.includes("cash book") ||
                    text.includes("bank book")
                ) {
                    card.style.setProperty("display", "none", "important");
                }
            });
        }
    }

    // ==========================================
    // 3. SIDEBAR NAVIGATION RESTRICTIONS
    // ==========================================
    function enforceSidebar() {
        const sidebarLinks = document.querySelectorAll("aside nav a, #sidebar nav a, nav a");
        sidebarLinks.forEach(link => {
            const text = (link.innerText || "").toLowerCase();

            // Admin AND Collection Staff -> Hide Cash Book & Bank Book
            if (isAdmin || isCollectionStaff) {
                if (text.includes("cash book") || text.includes("bank book")) {
                    link.style.setProperty("display", "none", "important");
                }
            }

            // Collection Staff -> Hide Disbursal and Employee Setup
            if (isCollectionStaff) {
                if (text.includes("capital disbursement") || text.includes("add new employee") || text.includes("add employee")) {
                    link.style.setProperty("display", "none", "important");
                }
            }
        });
    }
    enforceSidebar();

    // ==========================================
    // 4. TRANSACTION.HTML TAB RESTRICTION (Fix for Pic 3)
    // ==========================================
    if (window.location.pathname.includes("transaction.html")) {
        if (isCollectionStaff) {
            function restrictTransactionTabs() {
                // Hide Accounts Transaction Tab/Button
                const allButtons = document.querySelectorAll("button, div, a, li");
                allButtons.forEach(btn => {
                    const txt = (btn.innerText || "").toLowerCase().trim();
                    if (txt.includes("accounts transaction") || txt.includes("account transaction")) {
                        btn.style.setProperty("display", "none", "important");
                    }
                });

                // Ensure Customer Receipt form/tab is active
                const receiptTab = Array.from(document.querySelectorAll("button")).find(b => 
                    (b.innerText || "").toLowerCase().includes("customer receipt")
                );
                if (receiptTab && typeof switchTab === "function") {
                    switchTab("receipt");
                }
            }
            restrictTransactionTabs();
            setTimeout(restrictTransactionTabs, 200);
        }
    }

    // ==========================================
    // 5. DELETE BUTTON RESTRICTIONS (Admin & Collection Staff)
    // ==========================================
    function enforceDeleteRestrictions() {
        if (isAdmin || isCollectionStaff) {
            // Hide all trash icons and delete buttons dynamically
            const deleteTargets = document.querySelectorAll(
                "button[title*='Delete'], [onclick*='delete'], .fa-trash, .fa-trash-can, button.bg-rose-500\\/20, button.hover\\:bg-rose-500\\/20"
            );

            deleteTargets.forEach(el => {
                const btn = el.tagName === "I" ? (el.closest("button") || el) : el;
                if (btn) {
                    btn.style.setProperty("display", "none", "important");
                }
            });
        }
    }

    enforceDeleteRestrictions();

    // Continuous DOM Observer for dynamic loading tables
    const observer = new MutationObserver(() => {
        enforceSidebar();
        enforceDeleteRestrictions();
    });
    observer.observe(document.body, { childList: true, subtree: true });
});
