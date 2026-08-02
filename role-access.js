document.addEventListener('DOMContentLoaded', () => {
    // Get currently logged-in user
    const activeUser = JSON.parse(localStorage.getItem('vp_active_session'));

    if (!activeUser) {
        // If not logged in, redirect to login page
        window.location.href = 'index.html';
        return;
    }

    const role = activeUser.role || 'Collection Staff';

    console.log(`[VP Microfinance RBAC] Active User: ${activeUser.userId} | Role: ${role}`);

    // Helper to hide elements by class or selector
    const hideElements = (selector) => {
        document.querySelectorAll(selector).forEach(el => el.style.display = 'none');
    };

    // Helper to disable buttons
    const disableElements = (selector) => {
        document.querySelectorAll(selector).forEach(el => {
            el.disabled = true;
            el.classList.add('opacity-50', 'cursor-not-allowed');
        });
    };

    // 1. COLLECTION STAFF RESTRICTIONS
    if (role === 'Collection Staff') {
        // Block all menu items/pages except: Passbook, Customer Receipt, Receipts Hub, Passbook Terminal
        hideElements('.menu-capital-disbursement');
        hideElements('.menu-customer-list');
        hideElements('.menu-add-employee');
        hideElements('.menu-employee-directory');
        hideElements('.menu-reports');
        hideElements('.menu-settings');

        // On Receipts Hub: Allow View & Duplicate Print only. Hide Edit, Delete, or Export options.
        hideElements('.receipt-delete-btn');
        hideElements('.receipt-edit-btn');
        hideElements('.receipt-export-btn');

        // On Customer Passbook Terminal: Block any Payment triggers or adjustment buttons if present
        hideElements('.passbook-pay-btn');
        hideElements('.passbook-adjust-btn');
    }

    // 2. ADMIN RESTRICTIONS
    else if (role === 'Admin') {
        // Allowed:
        // - Capital Disbursement Registry
        // - Customer List (Edit, View, PDF & Excel Download)
        // - Receipts Hub (All options EXCEPT Delete)
        // - Customer Passbook Terminal (Pay option MUST BE HIDDEN)
        // - Add Employee Option
        // - Employee Details Directory (All options)

        // Hide Delete option in Receipts Hub & Collections Registry
        hideElements('.receipt-delete-btn');
        hideElements('.delete-btn');

        // Hide Pay option in Customer Passbook Terminal
        hideElements('.passbook-pay-btn');
    }

    // 3. ACCOUNTANT & 4. MANAGEMENT (FULL ACCESS)
    else if (role === 'Accountant' || role === 'Management') {
        // No restrictions applied. Everything visible.
    }
});
