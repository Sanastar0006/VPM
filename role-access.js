/**
 * VP MICROFINANCE PRO 2026 - RBAC & Navigation Controller
 */

document.addEventListener("DOMContentLoaded", function () {
    // ----------------------------------------------------
    // 1. GET & NORMALIZE USER ROLE
    // ----------------------------------------------------
    let userRole = "management"; 
    try {
        const rawRole = localStorage.getItem("vp_user_role");
        if (rawRole) {
            userRole = rawRole.toLowerCase().trim();
        } else if (localStorage.getItem("vp_user")) {
            const u = JSON.parse(localStorage.getItem("vp_user"));
            userRole = (u.role || u.userRole || u.type || u.designation || "management").toLowerCase().trim();
        }
    } catch (e) {
        console.error("Role parse error:", e);
    }

    const isManagement = userRole.includes("manage") || userRole.includes("owner");
    const isAdmin = userRole.includes("admin") && !isManagement;
    const isAccountant = userRole.includes("account");
    const isCollection = userRole.includes("collection") || userRole.includes("field") || userRole.includes("collector");

    // ----------------------------------------------------
    // 2. DYNAMIC SIDEBAR INJECTION (Cash Book & Bank Book)
    // ----------------------------------------------------
    function setupSidebar() {
        if (isCollection) return; // Collection Staff-ukku Cash & Bank Book vara koodadhu

        const sidebarNav = document.querySelector("aside nav") || 
                           document.querySelector("#sidebar nav") || 
                           document.querySelector("aside .space-y-2") || 
                           document.querySelector("aside div") ||
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

        // Passbook or Ledger link-kku keela insert pannum
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
    // 3. ROLE-BASED ACCESS CONTROL (RBAC)
    // ----------------------------------------------------
    function applyRolePermissions() {
        
        // --- A. ADMIN ROLE (Edit allowed, Delete BLOCKED) ---
        if (isAdmin) {
            hideDeleteButtons();
        }

        // --- B. COLLECTION STAFF ROLE (Strict Restricted Mode) ---
        if (isCollection) {
            hideDeleteButtons();
            hideEditButtons();

            // 1. Hide non-receipt sidebar links
            const navLinks = document.querySelectorAll("aside a, #sidebar a, nav a");
            navLinks.forEach(link => {
                const href = (link.getAttribute("href") || "").toLowerCase();
                const text = (link.innerText || "").toLowerCase();
                const isReceipt = href.includes("receipt") || text.includes("receipt");
                if (!isReceipt) {
                    link.style.setProperty("display", "none", "important");
                }
            });

            // 2. Block direct URL access to restricted pages
            const currentFile = window.location.pathname.split("/").pop().toLowerCase();
            const allowedPages = ["receipt.html", "receipts-hub.html", "receipt-hub.html", "login.html"];
            if (currentFile && !allowedPages.some(p => currentFile.includes(p))) {
                window.location.href = "receipts-hub.html";
            }
        }

        // --- C. MANAGEMENT & ACCOUNTANT (Full Edit & Delete Allowed) ---
        // Management & Accountant-kku automatic-a all Edit & Delete buttons show aagum.
    }

    // Helper: Hide Delete Buttons Across DOM
    function hideDeleteButtons() {
        const deleteTargets = document.querySelectorAll(
            "button[title*='Delete'], button[title*='delete'], [onclick*='delete'], .fa-trash, .fa-trash-can, .btn-delete"
        );
        deleteTargets.forEach(el => {
            const btn = el.tagName === "I" ? (el.closest("button") || el.closest("a") || el) : el;
            if (btn) btn.style.setProperty("display", "none", "important");
        });
    }

    // Helper: Hide Edit Buttons Across DOM
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

    // DOM dynamic-a update aagumpodhu (Table filter, Modals) permissions enforce panna
    const observer = new MutationObserver(applyRolePermissions);
    observer.observe(document.body, { childList: true, subtree: true });
});
