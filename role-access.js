/**
 * VP MICROFINANCE - Strict Role-Based Access Control (RBAC) System
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Fetch Logged-in Session
    const activeSession = JSON.parse(localStorage.getItem('vp_active_session'));

    if (!activeSession) {
        // Redirect to login if unauthenticated
        if (!window.location.pathname.endsWith('index.html') && !window.location.pathname.endsWith('login.html')) {
            window.location.href = 'index.html';
        }
        return;
    }

    const userRole = (activeSession.role || '').trim();

    console.log(`[RBAC Matrix] User: ${activeUserIdentifier(activeSession)} | Role: ${userRole}`);

    // Helper utilities
    const hide = (selector) => {
        document.querySelectorAll(selector).forEach(el => {
            el.style.display = 'none';
            el.classList.add('hidden');
        });
    };

    const disable = (selector) => {
        document.querySelectorAll(selector).forEach(el => {
            el.disabled = true;
            el.removeAttribute('href');
            el.classList.add('opacity-40', 'cursor-not-allowed', 'pointer-events-none');
        });
    };

    // ----------------------------------------------------------------------
    // 1. COLLECTION STAFF ACCESS RULES
    // ----------------------------------------------------------------------
    if (userRole === 'Collection Staff' || userRole === 'Agent / Staff (View Only)') {
        
        // --- Dashboard Navigation & Cards Restriction ---
        hide('#card-capital-disbursement, .card-capital');
        hide('#card-customer-list, .card-customers');
        hide('#card-add-employee, .card-add-emp');
        hide('#card-employee-details, .card-emp-details');
        hide('#card-cash-book, .card-cashbook');
        hide('#card-bank-book, .card-bankbook');
        hide('#card-reports, .card-reports');

        // Show ONLY permitted menu options
        // Allowed: Passbook, Customer Receipt Entry, Receipts Hub (View/Duplicate only), Passbook Terminal

        // --- Receipts Hub & Collections Registry Restrictions ---
        // Hide Delete & Edit & Export; Show ONLY View & Duplicate Print
        hide('.btn-receipt-delete, .delete-receipt, .btn-delete');
        hide('.btn-receipt-edit, .edit-receipt, .btn-edit');
        hide('.btn-receipt-export, .export-receipt');

        // --- Customer Passbook Terminal Restrictions ---
        // Block/Hide any payment operations if triggered here
        hide('.btn-passbook-pay, .pay-passbook-btn, .action-pay');
    }

    // ----------------------------------------------------------------------
    // 2. ADMIN ACCESS RULES
    // ----------------------------------------------------------------------
    else if (userRole === 'Admin' || userRole === 'Admin (Full Access & Delete Permission)') {
        
        // Admin Allowed Pages:
        // - Capital Disbursement Registry
        // - Customer List (Edit, View, PDF & Excel Downloads)
        // - Receipts Hub & Collections Registry (NO Delete Option)
        // - Customer Passbook Terminal (NO Pay Option)
        // - Add Employee Option
        // - Employee Details Directory (ALL Options)

        // Hide ALL Delete options across Receipts Hub & Collections Registry
        hide('.btn-receipt-delete, .delete-receipt, .btn-delete, .action-delete');

        // Hide Pay option in Customer Passbook Terminal
        hide('.btn-passbook-pay, .pay-passbook-btn, .action-pay');
    }

    // ----------------------------------------------------------------------
    // 3. ACCOUNTANT & 4. MANAGEMENT (SUPER MASTER ACCESS)
    // ----------------------------------------------------------------------
    else if (userRole === 'Accountant' || userRole === 'Management') {
        // Zero Restrictions - Full Access Granted
    }
});

function activeUserIdentifier(user) {
    return user.userId || user.email || 'User';
}
