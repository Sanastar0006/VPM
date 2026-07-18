// Unga kotha Apps Script Deployment URL-ai inga paste pannunga machi!
const GOOGLE_SCRIPT_WEBAPP_URL = "https://script.google.com/macros/s/AKfycby9Fwl090NE0lUuVmrgiXvFv_V7UGfg4nD9ZezIhabsuEMwS-8QvjE5lkXxQtD3FSZO/exec";

document.addEventListener('DOMContentLoaded', () => {
    // Math listener engine dynamic triggers setup
    const inputIds = ['principal', 'interestRate', 'frequency', 'duration', 'startDate'];
    inputIds.forEach(id => {
        const inputNode = document.getElementById(id);
        if (inputNode) {
            inputNode.addEventListener('input', executeLiveFinancialEngine);
            inputNode.addEventListener('change', executeLiveFinancialEngine);
        }
    });

    // Generate functional automated tracking sequential id
    generateAutomatedCLAN();

    // Default current time baseline date
    const startField = document.getElementById('startDate');
    if (startField && !startField.value) {
        startField.value = new Date().toISOString().split('T')[0];
    }
    
    executeLiveFinancialEngine();
});

function generateAutomatedCLAN() {
    const acNode = document.getElementById('accountNo');
    if (acNode) {
        let currentSeed = localStorage.getItem('vp_clan_seed');
        if (!currentSeed) {
            currentSeed = 1005; // Starting dynamic benchmark seed row
        }
        currentSeed = parseInt(currentSeed) + 1;
        localStorage.setItem('vp_clan_seed', currentSeed);
        acNode.value = `VP-${currentSeed}`;
    }
}

function executeLiveFinancialEngine() {
    const principal = parseFloat(document.getElementById('principal').value) || 0;
    const rate = parseFloat(document.getElementById('interestRate').value) || 0;
    const duration = parseInt(document.getElementById('duration').value) || 0;
    const frequency = document.getElementById('frequency').value;
    const startDate = document.getElementById('startDate').value;

    if (principal <= 0 || rate <= 0 || duration <= 0) return;

    // Financial calculations matrix
    const computedInterest = principal * (rate / 100) * (duration / 12);
    const totalRepayable = principal + computedInterest;

    let installmentsCount = duration;
    if (frequency === 'Weekly') installmentsCount = Math.round(duration * 4.34);
    else if (frequency === 'Daily') installmentsCount = duration * 30;

    const finalEmi = installmentsCount > 0 ? totalRepayable / installmentsCount : 0;

    // DOM UI Injection
    document.getElementById('lblTotalInterest').innerText = `₹${computedInterest.toLocaleString('en-IN', {minimumFractionDigits:2})}`;
    document.getElementById('lblTotalRepayable').innerText = `₹${totalRepayable.toLocaleString('en-IN', {minimumFractionDigits:2})}`;
    document.getElementById('lblEMI').innerText = `₹${finalEmi.toLocaleString('en-IN', {minimumFractionDigits:2})}`;

    // Automated End Date Computation
    if (startDate) {
        const calculatedDate = new Date(startDate);
        calculatedDate.setMonth(calculatedDate.getMonth() + duration);
        document.getElementById('endDate').value = calculatedDate.toISOString().split('T')[0];
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
    submitBtn.innerHTML = `<i class="fa-solid fa-spinner animate-spin"></i> Sending Data to Cloud...`;

    // Local Storage dynamic fallback synchronization matrix layout array push
    let localLedger = JSON.parse(localStorage.getItem('vp_local_customers')) || [];
    localLedger.unshift(customerPayload);
    localStorage.setItem('vp_local_customers', JSON.stringify(localLedger));

    // GET query request payload configuration architecture rules
    const targetUrl = `${GOOGLE_SCRIPT_WEBAPP_URL}?jsonData=${encodeURIComponent(JSON.stringify({ action: 'saveCustomer', data: customerPayload }))}`;

    fetch(targetUrl, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache'
    })
    .then(res => res.json())
    .then(result => {
        if(result && result.status === 'success') {
            alert('🎉 Perfect Machi! Data accurately recorded in Google Sheets Database!');
        }
        window.location.href = "customer-list.html";
    })
    .catch(err => {
        console.warn("Bypassed server check parameters node direct route integration:", err);
        window.location.href = "customer-list.html";
    });
}

window.saveCustomerToSheet = saveCustomerDataToServerPipeline;
