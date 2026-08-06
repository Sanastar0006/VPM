document.addEventListener("DOMContentLoaded", function () {
    // 1. Get Role safely from LocalStorage
    let userRole = "";
    try {
        userRole = localStorage.getItem("vp_user_role") || "";
        if (!userRole && localStorage.getItem("vp_user")) {
            const u = JSON.parse(localStorage.getItem("vp_user"));
            userRole = u.role || u.userRole || u.type || u.designation || "";
        }
    } catch (e) {
        console.error("Error reading user role:", e);
    }

    const roleLower = userRole.toLowerCase().trim();
    const isCollectionStaff = roleLower.includes("collection") || roleLower.includes("field") || roleLower.includes("collector");

    // =========================================================
    // STEP 1: UNIFY SIDEBAR FOR ALL PAGES (Add Cash/Bank Book for Management)
    // =========================================================
    function unifySidebar() {
        const navContainer = document.querySelector("aside nav") || document.querySelector("aside") || document.querySelector("#sidebar nav");
        if (!navContainer) return;

        const allNavLinks = Array.from(navContainer.querySelectorAll("a"));
        const hasCashBook = allNavLinks.some(a => a.href.includes("cash-book.html") || a.innerText.toLowerCase().includes("cash book"));
        const hasBankBook = allNavLinks.some(a => a.href.includes("bank-book.html") || a.innerText.toLowerCase().includes("bank book"));

        // If NOT collection staff and Cash/Bank book links are missing in HTML, inject them dynamically!
        if (!isCollectionStaff) {
            if (!hasCashBook) {
                const cashLink = document.createElement("a");
                cashLink.href = "cash-book.html";
                const isCurrent = window.location.pathname.includes("cash-book.html");
                cashLink.className = isCurrent 
                    ? "flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-lg shadow-amber-500/5 transition-all duration-200" 
                    : "flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all duration-200";
                cashLink.innerHTML = `<i class="fa-solid fa-wallet text-amber-400 text-lg"></i><span>Cash Book</span>`;
                navContainer.appendChild(cashLink);
            }

            if (!hasBankBook) {
                const bankLink = document.createElement("a");
                bankLink.href = "bank-book.html";
                const isCurrent = window.location.pathname.includes("bank-book.html");
                bankLink.className = isCurrent 
                    ? "flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-lg shadow-cyan-500/5 transition-all duration-200" 
                    : "flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all duration-200";
                bankLink.innerHTML = `<i class="fa-solid fa-building-columns text-cyan-400 text-lg"></i><span>Bank Book</span>`;
                navContainer.appendChild(bankLink);
            }
        }
    }

    unifySidebar();

    // =========================================================
    // STEP 2: APPLY COLLECTION STAFF RESTRICTIONS
    // =========================================================
    if (isCollectionStaff) {
        // A. Hide Sidebar Links for Collection Staff
        const sidebarLinks = document.querySelectorAll("aside a, #sidebar a, nav a");
        sidebarLinks.forEach(link => {
            const text = (link.innerText || "").toLowerCase().trim();
            if (
                text.includes("capital disbursement") ||
                text.includes("add new employee") ||
                text.includes("add employee") ||
                text.includes("cash book") ||
                text.includes("bank book")
            ) {
                link.style.setProperty("display", "none", "important");
            }
        });

        // B. Hide Dashboard Cards for Collection Staff
        const isDashboard = window.location.pathname.includes("dashboard.html") || 
                            window.location.pathname.includes("index.html") ||
                            window.location.pathname.endsWith("/VPM/") || 
                            window.location.pathname.endsWith("/");

        if (isDashboard) {
            const cards = document.querySelectorAll("main .grid > div, main a, .glass-card");
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

        // C. Transaction Page Tab Restrictions (transaction.html)
        if (window.location.pathname.includes("transaction.html")) {
            const hideAccountTab = () => {
                const buttons = document.querySelectorAll("button, div, a");
                buttons.forEach(btn => {
                    const txt = (btn.innerText || "").toLowerCase().trim();
                    if (txt.includes("accounts transaction") || txt.includes("account transaction")) {
                        btn.style.setProperty("display", "none", "important");
                    }
                });
                if (typeof switchTab === "function") {
                    switchTab("receipt");
                }
            };
            hideAccountTab();
            setTimeout(hideAccountTab, 300);
        }

        // D. Delete Button Restrictions for Collection Staff
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
        const observer = new MutationObserver(hideDeleteButtons);
        observer.observe(document.body, { childList: true, subtree: true });
    }
});
