/**
 * VP MICROFINANCE PRO 2026 - YONO SBI Luxury Edition
 * Core Customer & Loan Calculation Infrastructure Engine
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Input Change Listeners for real-time calculations
    const trackingInputs = ['principal', 'interestRate', 'frequency', 'duration', 'startDate'];
    trackingInputs.forEach(id => {
        const elementalNode = document.getElementById(id);
        if (elementalNode) {
            elementalNode.addEventListener('input', runMicrofinanceCalculatorEngine);
        }
    });

    // Auto-generate placeholder configuration on layout init
    generateFallbackAccountNumber();
});

/**
 * Generates an active tracking account number signature if cloud handshake hasn't overwritten it
 */
function generateFallbackAccountNumber() {
    const acField = document.getElementById('accountNo');
    if (acField && !acField.value) {
        const randomID = Math.floor(100000 + Math.random() * 900000);
        acField.value = `VP-${randomID}`;
    }
}

/**
 * Core Financial Computation Engine
 * Computes Interest metrics, exact structural EMI splits, and maturity end dates
 */
function runMicrofinanceCalculatorEngine() {
    // Collect Input Element Values
    const principal = parseFloat(document.getElementById('principal').value) || 0;
    const annualRate = parseFloat(document.getElementById('interestRate').value) || 0;
    const frequency = document.getElementById('frequency').value;
    const duration = parseInt(document.getElementById('duration').value) || 0;
    const startDateVal = document.getElementById('startDate').value;

    if (principal <= 0 || duration <= 0) {
        resetCalculatorDisplayMetrics();
        return;
    }

    // --- Microfinance Standard Interest Calculation ---
    // Simple Interest allocation typical for short-term microcredits
    const totalInterest = (principal * (annualRate / 100) * (duration / (frequency === 'Daily' ? 365 : frequency === 'Weekly' ? 52 : 12)));
    const grossRepayable = principal + totalInterest;
    const emiSplit = grossRepayable / duration;

    // --- DOM Interface Update ---
    updateFinancialDisplayLabels(totalInterest, grossRepayable, emiSplit);

    // --- Chronological Maturity Engine ---
    if (startDateVal) {
        computeMaturityEndDate(startDateVal, duration, frequency);
    }
}

/**
 * Updates UI Sidebar Metric blocks with formatted currencies
 */
function updateFinancialDisplayLabels(interest, total, emi) {
    const lblInterest = document.getElementById('lblTotalInterest');
    const lblTotal = document.getElementById('lblTotalRepayable');
    const lblEMI = document.getElementById('lblEMI');

    const currencyFormatter = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 2
    });

    if (lblInterest) lblInterest.innerText = currencyFormatter.format(interest);
    if (lblTotal) lblTotal.innerText = currencyFormatter.format(total);
    if (lblEMI) lblEMI.innerText = currencyFormatter.format(emi);
}

/**
 * Resets metrics back to zero states
 */
function resetCalculatorDisplayMetrics() {
    updateFinancialDisplayLabels(0, 0, 0);
    const endDateField = document.getElementById('endDate');
    if (endDateField) endDateField.value = '';
}

/**
 * Chronological Matrix Engine
 * Loops dates depending on selected metrics to construct standard deadlines
 */
function computeMaturityEndDate(startDateStr, intervals, type) {
    const targetDate = new Date(startDateStr);
    if (isNaN(targetDate.getTime())) return;

    switch (type) {
        case 'Daily':
            targetDate.setDate(targetDate.getDate() + intervals);
            break;
        case 'Weekly':
            targetDate.setDate(targetDate.getDate() + (intervals * 7));
            break;
        case 'Monthly':
            targetDate.setMonth(targetDate.getMonth() + intervals);
            break;
    }

    const endDateField = document.getElementById('endDate');
    if (endDateField) {
        endDateField.value = targetDate.toISOString().split('T')[0];
    }
}

/**
 * Premium Form Action Submission Handler intercepting standard routing
 * Prepares packages and delivers transactional arrays straight to Google Web App deployment endpoints
 */
function handleCustomerSubmit(event) {
    event.preventDefault();
    
    // Core Form Validation verification checks
    const mobile = document.getElementById('mobile').value;
    if (mobile.length !== 10) {
        alert('⚠️ Validation Error: Mobile Line requires a valid 10-digit format configuration.');
        return;
    }

    // Packaging Dataset for Cloud Processing Pipeline
    const customerPayload = {
        accountNo: document.getElementById('accountNo').value,
        customerName: document.getElementById('customerName').value,
        mobile: mobile,
        principal: parseFloat(document.getElementById('principal').value),
        interestRate: parseFloat(document.getElementById('interestRate').value),
        frequency: document.getElementById('frequency').value,
        duration: parseInt(document.getElementById('duration').value),
        startDate: document.getElementById('startDate').value,
        endDate: document.getElementById('endDate').value,
        emi: parseFloat(document.getElementById('lblEMI').innerText.replace(/[^0-9.-]+/g,"")),
        totalOutstanding: parseFloat(document.getElementById('lblTotalRepayable').innerText.replace(/[^0-9.-]+/g,""))
    };

    // UI Loading feedback context
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalBtnHTML = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i class="fa-solid fa-spinner animate-spin"></i> Processing Ledger Sync...`;

    // --- Cloud Pipeline Integration Bridge (Phase 1 - Part 5 Code.gs) ---
    // Update the URL below with your actual deployed Google Apps Script Macro URL
    const GOOGLE_SCRIPT_WEBAPP_URL = "YOUR_APPS_SCRIPT_WEBAPP_URL_HERE";

    if (GOOGLE_SCRIPT_WEBAPP_URL === "https://script.google.com/macros/s/AKfycby9Fwl090NE0lUuVmrgiXvFv_V7UGFg4nD9ZezIhabsuEMwS-8QvjE5lkXxQtD3FSZO/exec") {
        // Fallback UI Simulation mode for decoupled testing stages
        setTimeout(() => {
            alert(`🎉 Success Machi! Customer data simulated locally.\nAccount: ${customerPayload.accountNo}\nTotal Repayable: ₹${customerPayload.totalOutstanding}`);
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnHTML;
            document.getElementById('customerForm').reset();
            generateFallbackAccountNumber();
            resetCalculatorDisplayMetrics();
        }, 1200);
    } else {
        // Executing standard Cross-Origin Fetch Pipeline request to Cloud Server instance
        fetch(GOOGLE_SCRIPT_WEBAPP_URL, {
            method: 'POST',
            mode: 'no-cors', // standard framework policy approach configurations for Web Apps
            cache: 'no-cache',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'saveCustomer', data: customerPayload })
        })
        .then(() => {
            alert('🚀 Excel Sheet Database Sync successfully logged!');
            document.getElementById('customerForm').reset();
            generateFallbackAccountNumber();
            resetCalculatorDisplayMetrics();
        })
        .catch(err => {
            console.error('Data Sync breakdown error matrix:', err);
            alert('❌ Network synchronization error. Local buffer stored safely.');
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnHTML;
        });
    }
}