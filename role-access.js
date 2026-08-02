/**
 * VP MICROFINANCE - Strict Role-Based Access Control (RBAC) System
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Fetch Logged-in Session
    const activeSession = JSON.parse(localStorage.getItem('vp_active_session'));

    if (!activeSession) {
        const currentPage = window.location.pathname.split('/').pop();
        if (currentPage !== 'index.html' && currentPage !== 'login.html' && currentPage !== '') {
            window.location.href = 'index.html';
        }
        return;
    }

    const userRole = (activeSession.role || '').trim().toLowerCase();
    const currentPage = window.location.pathname.split('/').pop();

    console.log(`[RBAC System Active] User Role detected: ${activeSession.role}`);

    // Core Hide Function
    const hideSelectors = (selectors) => {
        document.querySelectorAll(selectors).forEach(el => {
            el.style.display = 'none';
            el.classList.add('hidden');
        });
    };

    // Helper: Hide Sidebar menu items by checking link text or href
    const filterSidebarMenu = (unauthorizedKeywords) => {
        // Target sidebar links, nav anchors, and list items
        const menuItems = document.querySelectorAll('aside a, nav a, .sidebar a, ul li a');
        
        menuItems.forEach(link => {
            const linkText = link.innerText.trim().toLowerCase();
            const linkHref = link.getAttribute('href') || '';

            unauthorizedKeywords.forEach(keyword => {
                if (linkText.includes(keyword.toLowerCase()) || linkHref.includes(keyword.toLowerCase())) {
                    // Hide the parent element (or anchor itself)
                    const targetEl = link.closest('li') || link;
                    targetEl.style.display = 'none';
                    targetEl.classList.add('hidden');
                }
            });
        });
    };

    // ----------------------------------------------------------------------
    // 1. COLLECTION STAFF ACCESS RULES
    // ----------------------------------------------------------------------
    if (userRole.includes('collection staff') || userRole.includes('agent')) {
        
        // A. Direct URL Protection Guard (If Staff types restricted URL directly)
        const restrictedPagesForStaff = [
            'customer-add.html',
            'customer-list.html',
            'user-add.html',
            'employee-details.html',
            'cash-book.html',
            'bank-book.html',
            'reports.html'
        ];

        if (restrictedPagesForStaff.includes(currentPage)) {
            alert('Access Denied: You do not have permission to access this module.');
            window.location.href = 'dashboard.html';
            return;
        }

        // B. Dashboard Card Selectors Hide
        hideSelectors('#card-capital-disbursement, #card-customer-list, #card-add-employee, #card-employee-details, #card-cash-book, #card-bank-book, #card-reports');

        // C. Sidebar Navigation Menu Text Restrictions
        // Restricts: Capital Disbursement, Customer Ledger/List, Cash Book, Bank Book, Add Employee, Reports
        const staffRestrictedMenus = [
            'capital disbursement',
            'customer ledger',
            'customer list',
            'cash book',
            'bank book',
            'add employee',
            'employee details',
            'reports',
            'customer-add',
            'customer-list',
            'cash-book',
            'bank-book'
        ];
        filterSidebarMenu(staffRestrictedMenus);

        // D. Inner Page Action Buttons Restriction
        hideSelectors('.btn-receipt-delete, .delete-receipt, .btn-delete, .action-delete');
        hideSelectors('.btn-receipt-edit, .edit-receipt, .btn-edit');
        hideSelectors('.btn-receipt-export, .export-receipt');
        hideSelectors('.btn-passbook-pay, .pay-passbook-btn, .action-pay');
    }

    // ----------------------------------------------------------------------
    // 2. ADMIN ACCESS RULES
    // ----------------------------------------------------------------------
    else if (userRole.includes('admin')) {
        
        // Hide ALL Delete options across Receipts Hub & Collections Registry
        hideSelectors('.btn-receipt-delete, .delete-receipt, .btn-delete, .action-delete');

        // Hide Pay option in Customer Passbook Terminal
        hideSelectors('.btn-passbook-pay, .pay-passbook-btn, .action-pay');
    }

    // ----------------------------------------------------------------------
    // 3. ACCOUNTANT & 4. MANAGEMENT (FULL ACCESS)
    // ----------------------------------------------------------------------
    else if (userRole.includes('accountant') || userRole.includes('management')) {
        // Full unrestricted access granted
    }
});

function activeUserIdentifier(user) {
    return user.userId || user.email || 'User';
}
