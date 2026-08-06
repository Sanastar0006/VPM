document.addEventListener("DOMContentLoaded", function () {
    // 1. Fetch exact role safely from LocalStorage ONLY
    let userRole = "";
    try {
        userRole = localStorage.getItem("vp_user_role") || "";
        if (!userRole && localStorage.getItem("vp_user")) {
            const u = JSON.parse(localStorage.getItem("vp_user"));
            userRole = u.role || u.userRole || u.type || "";
        }
    } catch (e) {
        console.error("Role reading error:", e);
    }

    const role = userRole.toLowerCase().trim();

    // Identify role strictly
    const isCollectionStaff = role.includes("collection");

    // If Role is NOT Collection Staff (Admin, Management, Accountant), STOP HERE. 
    // They get FULL ACCESS (Cash Book & Bank Book will show normally)!
    if (!isCollectionStaff) {
        return; 
    }

    // =========================================================
    // RESTRICTIONS BELOW ARE ONLY FOR COLLECTION STAFF
    // =========================================================

    const restrictedKeywords = [
        "cash book",
        "bank book",
        "capital disbursement",
        "add new employee",
        "add employee",
        "employee details"
    ];

    // 1. SIDEBAR RESTRICTIONS (For Collection Staff)
    const sidebarLinks = document.querySelectorAll("aside a, #sidebar a, nav a");
    sidebarLinks.forEach(link => {
        const text = (link.innerText || "").toLowerCase().trim();
        if (restrictedKeywords.some(key => text.includes(key))) {
            link.style.setProperty("display", "none", "important");
        }
    });

    // 2. DASHBOARD CARDS RESTRICTIONS (For Collection Staff)
    const isDashboard = window.location.pathname.includes("dashboard.html") || 
                        window.location.pathname.endsWith("/VPM/") || 
                        window.location.pathname.endsWith("/");

    if (isDashboard) {
        const cards = document.querySelectorAll("main .grid > div, main a, .glass-card");
        cards.forEach(card => {
            const text = (card.innerText || "").toLowerCase();
            if (restrictedKeywords.some(key => text.includes(key))) {
                card.style.setProperty("display", "none", "important");
            }
        });
    }

    // 3. TRANSACTION PAGE TAB RESTRICTION (For Collection Staff)
    if (window.location.pathname.includes("transaction.html")) {
        const buttons = document.querySelectorAll("button, div, a");
        buttons.forEach(btn => {
            const txt = (btn.innerText || "").toLowerCase().trim();
            if (txt.includes("accounts transaction") || txt.includes("account transaction")) {
                btn.style.setProperty("display", "none", "important");
            }
        });

        // Switch automatically to Customer Receipt tab
        if (typeof switchTab === "function") {
            switchTab("receipt");
        }
    }

    // 4. HIDE DELETE BUTTONS (For Collection Staff)
    function hideDeleteButtons() {
        const deleteTargets = document.querySelectorAll(
            "button[title*='Delete'], [onclick*='delete'], .fa-trash, .fa-trash-can"
        );
        deleteTargets.forEach(el => {
            const btn = el.tagName === "I" ? (el.closest("button") || el) : el;
            if (btn) btn.style.setProperty("display", "none", "important");
        });
    }

    hideDeleteButtons();

    // DOM Observer for dynamically loaded collection tables
    const observer = new MutationObserver(hideDeleteButtons);
    observer.observe(document.body, { childList: true, subtree: true });
});
