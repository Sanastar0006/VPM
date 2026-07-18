/**
 * VP MICROFINANCE PRO 2026 - YONO SBI Luxury Edition
 * Pure Math Engine & Sheets Gateway (customer.js)
 */

const GOOGLE_SCRIPT_WEBAPP_URL = "https://script.google.com/macros/s/AKfycby9Fwl090NE0lUuVmrgiXvFv_V7UGfg4nD9ZezIhabsuEMwS-8QvjE5lkXxQtD3FSZO/exec";

document.addEventListener('DOMContentLoaded', () => {
    // 1. Setup real-time listeners for calculating values
    const trackingInputs = ['principal', 'interestRate', 'frequency', 'duration', 'startDate'];
    trackingInputs.forEach(id => {
        const node = document.getElementById(id);
        if (node) {
            node.addEventListener('input', runMicrofinanceCalculatorEngine);
            node.addEventListener('change', runMicrofinanceCalculatorEngine);
        }
    });

    // 2. Load automatic initial account sequential numbers
    initializeSequentialCLAN();
    
    // 3. Set dynamic default base date
    const startField = document.getElementById('startDate');
    if(startField && !startField.value) {
        startField.value = new Date().toISOString().split('T')[0];
    }
    
    // Initial dynamic baseline run
    runMicrofinanceCalculatorEngine();
});

function initializeSequentialCLAN() {
    const acField = document.getElementById('accountNo');
    if (acField) {
        let currentSeed = localStorage.getItem('vp_clan_seed');
        if (!currentSeed) {
            currentSeed = 1005; // Base sequence layout seed number
        }
        currentSeed = parseInt(currentSeed) + 1;
        localStorage.setItem('vp_clan_seed', currentSeed);
        acField.value = `VP-${currentSeed}`;
    }
}

function runMicrofinanceCalculatorEngine() {
    const principal = parseFloat(document.getElementById('principal').value) || 0;
    const annualRate = parseFloat(document.getElementById('interestRate').value) || 0;
    const durationMonths = parseInt(document.getElementById('duration').value) || 0;
    const frequency = document.getElementById('frequency').value;
    const startDateVal = document.getElementById('startDate').value;

    if (principal <= 0 || annualRate <= 0 || durationMonths <= 0) return;

    // Core Matrix Finance Equation Layer
    const totalInterest = principal * (annualRate / 100) * (durationMonths / 12);
    const totalOutstanding = principal + totalInterest;

    let totalInstallments = durationMonths;
    if (frequency === 'Weekly') totalInstallments = Math.round(durationMonths * 4.34);
    else if (frequency === 'Daily') totalInstallments = durationMonths * 30;

    const emiSplit = totalInstallments > 0 ? totalOutstanding / totalInstallments : 0;

    // Inject values cleanly back into display targets
    document.getElementById('lblTotalInterest').innerText = `₹${totalInterest.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    document.getElementById('lblTotalRepayable').innerText = `₹${totalOutstanding.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    document.getElementById('lblEMI').innerText = `₹${emiSplit.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;

    // Handle automated Maturity End Date logic calculation
    if (startDateVal) {
        const start = new Date(startDateVal);
        start.setMonth(start.getMonth() + durationMonths);
        document.getElementById('endDate').value = start.toISOString().split('T')[0];
    }
}

function saveCustomerDataToServerPipeline() {
    const submitBtn = document.getElementById('submitBtn');
    
    const customerPayload = {
        accountNo: document.getElementById('accountNo').value,
        customerName: document.getElementById('customerName').value,
        mobile: document.getElementById('mobile').value,
        principal: parseFloat(document.getElementById('principal').value) || 0,
        interestRate: parseFloat(document.getElementById('interestRate').value) || 0,
        frequency: document.getElementById('frequency').value,
        duration: parseInt(document.getElementById('duration').value) || 0,
        startDate: document.getElementById('startDate').value,
        endDate: document.getElementById('endDate').value,
        emi: parseFloat(document.getElementById('lblEMI').innerText.replace('₹', '').replace(/,/g, '')) || 0,
        totalOutstanding: parseFloat(document.getElementById('lblTotalRepayable').innerText.replace('₹', '').replace(/,/g, '')) || 0
    };

    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i class="fa-solid fa-spinner animate-spin"></i> Syncing to Google Sheets...`;

    // Instantly queue transaction data array sequence into cache layout buffer
    let localLedger = JSON.parse(localStorage.getItem('vp_local_customers')) || [];
    localLedger.unshift(customerPayload);
    localStorage.setItem('vp_local_customers', JSON.stringify(localLedger));

    // Dynamic direct query injection parameters handling strategy to bypass standard CORS structural constraints 
    const finalEndpointUrl = `${GOOGLE_SCRIPT_WEBAPP_URL}?jsonData=${encodeURIComponent(JSON.stringify({ action: 'saveCustomer', data: customerPayload }))}`;

    fetch(finalEndpointUrl, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache'
    })
    .then(res => res.json())
    .then(result => {
        if(result && result.status === 'success') {
            alert('🎉 Success Machi! Account perfectly registered on Cloud Data Sheet!');
        }
        window.location.href = "customer-list.html";
    })
    .catch(err => {
        console.warn("Bypassed network server check parameters:", err);
        window.location.href = "customer-list.html";
    });
}

window.saveCustomerToSheet = saveCustomerDataToServerPipeline;
