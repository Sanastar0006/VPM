/**
 * VP MICROFINANCE PRO 2026 - RBAC & Navigation Controller
 */

document.addEventListener("DOMContentLoaded", function () {
    // ----------------------------------------------------
    // 1. DETECT USER ROLE ACCURATELY
    // ----------------------------------------------------
    let userRole = "";
    try {
        const storedRole = localStorage.getItem("vp_user_role");
        if (storedRole) {
            userRole = storedRole.toLowerCase().trim();
        } else if (localStorage.getItem("vp_user")) {
            const u = JSON.parse(localStorage.getItem("vp_user"));
            userRole = (u.role || u.userRole || u.type || u.designation || "").toLowerCase().trim();
        }
    } catch (e) {
        console.error("Role parse error:", e);
    }

    // Header label checking as fallback
    const headerText = (document.body.innerText || "").toLowerCase();

    // STRICT ROLE FLAGS
    const isManagement = userRole.includes("management") || userRole.includes("owner") || headerText.includes("management");
    const isAccountant = userRole.includes("accountant") || userRole.includes("account");
    const isCollection = userRole.includes("collection") || userRole.includes("field") || userRole.includes("collector") || headerText.includes("collection staff");
    
    // Admin is ONLY true if it's explicitly Admin AND NOT Management/Accountant
    const isAdmin = (userRole.includes("admin") || headerText.includes("admin")) && !isManagement && !isAccountant;

    console.log("Current User Role Active:", { isManagement, isAccountant, isAdmin, isCollection, rawRole: userRole });

    // ----------------------------------------------------
    // 2. DYNAMIC SIDEBAR INJECTION (Cash Book & Bank Book)
    // ----------------------------------------------------
    function setupSidebar() {
        // Collection Staff-ukku Cash & Bank Book show aaga koodadhu
        if (isCollection) return;

        const sidebarNav = document.querySelector("aside nav") || 
                           document.querySelector("#sidebar nav") || 
                           document.querySelector("aside .space-y-2") || 
                           document.querySelector("aside");

        if (!sidebarNav) return;

        const existingLinks = Array.from(sidebarNav.querySelectorAll("a"));
        const currentPath = window.location.pathname.toLowerCase();

        const hasCash = existingLinks.some(a => a.href.includes("cash-book.html") || a.innerText.toLowerCase().includes("cash book"));
        const hasBank = existingLinks.some(a => a.href.includes("bank-book.html") || a.innerText.toLowerCase().includes("bank book"));

        function createSidebarLink(href, iconClass, labelText, color) {
            const a = document.createElement("a");
            a.href = href;
            const isActive = currentPath.includes(href);
            a.className = isActive 
                ? `flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm bg-${color}-500/10 text-${color}-400 border border-${color}-500/20 shadow-lg transition-all duration-200`
                : "flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all duration-200";
            
            a.innerHTML = `<i class="${iconClass} text-${color}-400 text-lg"></i><span>${labelText}</span>`;
            return a;
        }

        let targetAnchor = existingLinks.find(a => a.href.includes("passbook.html") || a.innerText.toLowerCase().includes("passbook"));
        if (!targetAnchor) {
            targetAnchor = existingLinks.find(a => a.href.includes("customer-list.html") || a.innerText.toLowerCase().includes("ledger"));
        }

        if (!hasCash) {
            const cashLink = createSidebarLink("cash-book.html", "fa-solid fa-wallet", "Cash Book", "amber");
            if (targetAnchor && targetAnchor.parentNode) {
                targetAnchor.parentNode.insertBefore(cashLink, targetAnchor.nextSibling);
                targetAnchor = cashLink;
            } else {
                sidebarNav.appendChild(cashLink);
            }
        }

        if (!hasBank) {
            const bankLink = createSidebarLink("bank-book.html", "fa-solid fa-building-columns", "Bank Book", "cyan");
            if (targetAnchor && targetAnchor.parentNode) {
                targetAnchor.parentNode.insertBefore(bankLink, targetAnchor.nextSibling);
            } else {
                sidebarNav.appendChild(bankLink);
            }
        }
    }

    setupSidebar();

    // ----------------------------------------------------
    // 3. APPLY ROLE-BASED PERMISSIONS
    // ----------------------------------------------------
    function applyRolePermissions() {
        // --- A. ADMIN ROLE (Edit allowed, Delete HIDDEN) ---
        if (isAdmin) {
            hideDeleteButtons();
        }

        // --- B. COLLECTION STAFF ROLE (Strict Restricted Mode) ---
        if (isCollection) {
            hideDeleteButtons();
            hideEditButtons();

            // Hide non-receipt sidebar links
            const navLinks = document.querySelectorAll("aside a, #sidebar a, nav a");
            navLinks.forEach(link => {
                const href = (link.getAttribute("href") || "").toLowerCase();
                const text = (link.innerText || "").toLowerCase();
                const isReceipt = href.includes("receipt") || text.includes("receipt");
                if (!isReceipt) {
                    link.style.setProperty("display", "none", "important");
                }
            });

            // Block direct URL access to restricted pages
            const currentFile = window.location.pathname.split("/").pop().toLowerCase();
            const allowedPages = ["receipt.html", "receipts-hub.html", "receipt-hub.html", "login.html"];
            if (currentFile && !allowedPages.some(p => currentFile.includes(p))) {
                window.location.href = "receipts-hub.html";
            }
        }

        // --- C. MANAGEMENT & ACCOUNTANT ---
        // (Full access guaranteed - Edit and Delete options remain fully visible!)
    }

    function hideDeleteButtons() {
        const deleteTargets = document.querySelectorAll(
            "button[title*='Delete'], button[title*='delete'], [onclick*='delete'], .fa-trash, .fa-trash-can, .btn-delete"
        );
        deleteTargets.forEach(el => {
            const btn = el.tagName === "I" ? (el.closest("button") || el.closest("a") || el) : el;
            if (btn) btn.style.setProperty("display", "none", "important");
        });
    }

    function hideEditButtons() {
        const editTargets = document.querySelectorAll(
            "button[title*='Edit'], button[title*='edit'], [onclick*='edit'], .fa-pen, .fa-edit, .fa-pen-to-square, .btn-edit"
        );
        editTargets.forEach(el => {
            const btn = el.tagName === "I" ? (el.closest("button") || el.closest("a") || el) : el;
            if (btn) btn.style.setProperty("display", "none", "important");
        });
    }

    applyRolePermissions();

    const observer = new MutationObserver(applyRolePermissions);
    observer.observe(document.body, { childList: true, subtree: true });
});
