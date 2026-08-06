/**
 * Dynamic Access Control Matrix Controller
 */

const ALL_PAGES = [
    { id: "customer-add.html", label: "Customer Add" },
    { id: "customer-list.html", label: "Customer List" },
    { id: "employee-details.html", label: "Employee Details" },
    { id: "user-add.html", label: "User Add" },
    { id: "receipt.html", label: "Receipt Entry" },
    { id: "receipts-hub.html", label: "Receipts Hub" },
    { id: "transaction.html", label: "Transaction Matrix" },
    { id: "passbook.html", label: "Customer Passbook" },
    { id: "cash-book.html", label: "Cash Book" },
    { id: "bank-book.html", label: "Bank Book" }
];

// Default Matrix Setup
const DEFAULT_MATRIX = {
    "Management": {
        pages: ALL_PAGES.map(p => p.id),
        canEdit: true,
        canDelete: true,
        canPrint: true,
        canWhatsApp: true
    },
    "Admin": {
        pages: ["employee-details.html", "user-add.html", "customer-add.html", "customer-list.html", "receipt.html", "passbook.html", "receipts-hub.html", "cash-book.html", "bank-book.html"],
        canEdit: true,
        canDelete: false,
        canPrint: true,
        canWhatsApp: true
    },
    "Accountant": {
        pages: ALL_PAGES.map(p => p.id),
        canEdit: true,
        canDelete: true,
        canPrint: true,
        canWhatsApp: true
    },
    "Collection Staff": {
        pages: ["receipt.html", "receipts-hub.html"],
        canEdit: false,
        canDelete: false,
        canPrint: true,
        canWhatsApp: true
    }
};

function getPermissionsMatrix() {
    const saved = localStorage.getItem("vp_role_permissions_matrix");
    return saved ? JSON.parse(saved) : DEFAULT_MATRIX;
}

function renderPagesGrid(selectedPages) {
    const grid = document.getElementById("permissionsGrid");
    grid.innerHTML = "";

    ALL_PAGES.forEach(page => {
        const isChecked = selectedPages.includes(page.id) ? "checked" : "";
        const html = `
            <label class="flex items-center gap-3 p-3 bg-slate-900/60 rounded-xl border border-slate-800 hover:border-slate-700 cursor-pointer transition-all">
                <input type="checkbox" value="${page.id}" class="page-checkbox w-4 h-4 accent-amber-500 rounded" ${isChecked}>
                <span class="text-sm font-medium text-slate-300">${page.label}</span>
            </label>
        `;
        grid.innerHTML += html;
    });
}

function loadRolePermissions() {
    const selectedRole = document.getElementById("roleSelect").value;
    const matrix = getPermissionsMatrix();
    const roleData = matrix[selectedRole] || DEFAULT_MATRIX[selectedRole];

    renderPagesGrid(roleData.pages);
    document.getElementById("permEdit").checked = roleData.canEdit;
    document.getElementById("permDelete").checked = roleData.canDelete;
    document.getElementById("permPrint").checked = roleData.canPrint;
    document.getElementById("permWhatsApp").checked = roleData.canWhatsApp;
}

function savePermissions() {
    const selectedRole = document.getElementById("roleSelect").value;
    const matrix = getPermissionsMatrix();

    const checkedPages = Array.from(document.querySelectorAll(".page-checkbox:checked")).map(cb => cb.value);
    
    matrix[selectedRole] = {
        pages: checkedPages,
        canEdit: document.getElementById("permEdit").checked,
        canDelete: document.getElementById("permDelete").checked,
        canPrint: document.getElementById("permPrint").checked,
        canWhatsApp: document.getElementById("permWhatsApp").checked
    };

    localStorage.setItem("vp_role_permissions_matrix", JSON.stringify(matrix));
    alert(`🎉 Permissions matrix for [${selectedRole}] saved successfully!`);
}

document.addEventListener("DOMContentLoaded", loadRolePermissions);
