/**
 * Dynamic Role Execution Engine
 */

document.addEventListener("DOMContentLoaded", function () {
    // 1. Fetch Active User Role
    let userRole = "Management";
    try {
        const storedRole = localStorage.getItem("vp_user_role");
        if (storedRole) {
            userRole = storedRole.trim();
        } else if (localStorage.getItem("vp_user")) {
            const u = JSON.parse(localStorage.getItem("vp_user"));
            userRole = u.role || u.userRole || u.type || u.designation || "Management";
        }
    } catch (e) {
        console.error("Role parse error:", e);
    }

    // Role Key Matching
    let matchedRoleKey = "Management";
    const rLower = userRole.toLowerCase();
    if (rLower.includes("collection") || rLower.includes("field")) matchedRoleKey = "Collection Staff";
    else if (rLower.includes("account")) matchedRoleKey = "Accountant";
    else if (rLower.includes("admin") && !rLower.includes("manage")) matchedRoleKey = "Admin";
    else matchedRoleKey = "Management";

    // 2. Load Permissions Matrix
    const matrixString = localStorage.getItem("vp_role_permissions_matrix");
    let permissions = null;
    if (matrixString) {
        try {
            const fullMatrix = JSON.parse(matrixString);
            permissions = fullMatrix[matchedRoleKey];
        } catch (e) {}
    }

    // Default Fallbacks
    if (!permissions) {
        if (matchedRoleKey === "Admin") {
            permissions = { pages: ["employee-details.html", "user-add.html", "customer-add.html", "customer-list.html", "receipt.html", "passbook.html", "receipts-hub.html", "cash-book.html", "bank-book.html"], canEdit: true, canDelete: false };
        } else if (matchedRoleKey === "Collection Staff") {
            permissions = { pages: ["receipt.html", "receipts-hub.html"], canEdit: false, canDelete: false };
        } else {
            permissions = { pages: ["customer-add.html", "customer-list.html", "employee-details.html", "user-add.html", "receipt.html", "receipts-hub.html", "transaction.html", "passbook.html", "cash-book.html", "bank-book.html"], canEdit: true, canDelete: true };
        }
    }

    // 3. Enforce Sidebar Navigation Rules
    const currentFile = window.location.pathname.split("/").pop().toLowerCase();
    const sidebarLinks = document.querySelectorAll("aside a, #sidebar a, nav a");

    sidebarLinks.forEach(link => {
        const href = (link.getAttribute("href") || "").toLowerCase();
        if (href) {
            const isAllowed = permissions.pages.some(p => href.includes(p.toLowerCase()));
            if (!isAllowed && !href.includes("dashboard")) {
                link.style.setProperty("display", "none", "important");
            }
        }
    });

    // 4. Enforce Action Permissions (Edit / Delete)
    if (!permissions.canDelete) {
        hideElements("button[title*='Delete'], [onclick*='delete'], .fa-trash, .fa-trash-can, .btn-delete");
    }

    if (!permissions.canEdit) {
        hideElements("button[title*='Edit'], [onclick*='edit'], .fa-pen, .fa-edit, .btn-edit");
    }

    function hideElements(selector) {
        document.querySelectorAll(selector).forEach(el => {
            const target = el.tagName === "I" ? (el.closest("button") || el.closest("a") || el) : el;
            if (target) target.style.setProperty("display", "none", "important");
        });
    }

    // Observer for dynamic elements
    const observer = new MutationObserver(() => {
        if (!permissions.canDelete) hideElements("button[title*='Delete'], [onclick*='delete'], .fa-trash, .fa-trash-can, .btn-delete");
        if (!permissions.canEdit) hideElements("button[title*='Edit'], [onclick*='edit'], .fa-pen, .fa-edit, .btn-edit");
    });
    observer.observe(document.body, { childList: true, subtree: true });
});
