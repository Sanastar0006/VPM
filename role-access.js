/**
 * VP MICROFINANCE - Strict Role-Based Access Control (RBAC) System
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Fetch Logged-in Session
    const activeSession = JSON.parse(localStorage.getItem('vp_active_session'));

    if (!activeSession) {
        // Redirect to login if unauthenticated
        const currentPage = window.location.pathname.split('/').pop();
        if (currentPage !== 'index.html' && currentPage !== 'login.html' && currentPage !== '') {
            window.location.href = 'index.html';
        }
        return;
    }

    const userRole = (activeSession.role || '').trim().toLowerCase();
    const currentPage = window.location.pathname.split('/').pop();

    console.log(`[RBAC Matrix] User: ${activeUserIdentifier(activeSession)} | Role: ${activeSession.role}`);

    // Helper utilities
    const hide = (selector) => {
        document.querySelectorAll(selector).forEach(el => {
            el.style.display = 'none';
            el.classList.add('hidden');
        });
    };

    // ----------------------------------------------------------------------
    // 1. COLLECTION STAFF ACCESS RULES
    // ----------------------------------------------------------------------
    if (userRole.includes('collection staff') || userRole.includes('agent')) {
        
        // --- Security Guard: Page-level direct URL Block ---
        const restrictedPagesForStaff = [
            'customer-add.html',
            'customer-list.html',
            'user-add.html',
            'employee-details.html',
            'cash-book.html',
            'bank-book.html'
        ];

        if (restrictedPagesForStaff.includes(currentPage)) {
            alert('Access Denied: You do not have permission to view this page.');
            window.location.href = 'dashboard.html';
            return;
        }

        // --- Dashboard Navigation & Cards Restriction ---
        hide('#card-capital-disbursement, .card-capital');
        hide('#card-customer-list, .card-customers');
        hide('#card-add-employee, .card-add-emp');
        hide('#card-employee-details, .card-emp-details');
        hide('#card-cash-book, .card-cashbook');
        hide('#card-bank-book, .card-bankbook');
        hide('#card-reports, .card-reports');

        // --- Receipts Hub & Collections Registry Restrictions ---
        hide('.btn-receipt-delete, .delete-receipt, .btn-delete');
        hide('.btn-receipt-edit, .edit-receipt, .btn-edit');
        hide('.btn-receipt-export, .export-receipt');

        // --- Customer Passbook Terminal Restrictions ---
        hide('.btn-passbook-pay, .pay-passbook-btn, .action-pay');
    }

    // ----------------------------------------------------------------------
    // 2. ADMIN ACCESS RULES
    // ----------------------------------------------------------------------
    else if (userRole.includes('admin')) {
        
        // Hide ALL Delete options across Receipts Hub & Collections Registry
        hide('.btn-receipt-delete, .delete-receipt, .btn-delete, .action-delete');

        // Hide Pay option in Customer Passbook Terminal
        hide('.btn-passbook-pay, .pay-passbook-btn, .action-pay');
    }

    // ----------------------------------------------------------------------
    // 3. ACCOUNTANT & 4. MANAGEMENT (SUPER MASTER ACCESS)
    // ----------------------------------------------------------------------
    else if (userRole.includes('accountant') || userRole.includes('management')) {
        // Zero Restrictions - Full Access Granted
    }
});

function activeUserIdentifier(user) {
    return user.userId || user.email || 'User';
}
