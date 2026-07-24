/**
 * VP MICROFINANCE PRO 2026
 * Core Customer Operations & Math Engine (customer.js)
 */

const GOOGLE_SCRIPT_WEBAPP_URL = "https://script.google.com/macros/s/AKfycby9Fwl090NE0lUuVmrgiXvFv_V7UGfg4nD9ZezIhabsuEMwS-8QvjE5lkXxQtD3FSZO/exec";

document.addEventListener('DOMContentLoaded', () => {
    // 1. Setup real-time calculations event listeners
    const inputIds = ['principal', 'interestRate', 'frequency', 'duration', 'startDate'];
    inputIds.forEach(id => {
        const node = document.getElementById(id);
        if (node) {
            node.addEventListener('input', runLiveMicrofinanceCalculator);
            node.addEventListener('change', runLiveMicrofinanceCalculator);
        }
    });

    // 2. Automated Sequential Tracking AC Number Execution
    initializeTrackingAccountNumber();

    // 3. Set default dynamic baseline date
    const startField = document.getElementById('startDate');
    if (startField && !startField.value) {
        startField.value = new Date().toISOString().split('T')[0];
    }
    
    runLiveMicrofinanceCalculator();
});

function initializeTrackingAccountNumber() {
    const acField = document.getElementById('accountNo');
    if (acField) {
        let lastSeed = localStorage.getItem('vp_clan_seed');
        if (!lastSeed) {
            lastSeed = 1005; // Starting index number sequence layout
        }
        let nextSeed = parseInt(lastSeed) + 1;
        localStorage.setItem('vp_clan_seed', nextSeed);
        acField.value = `VP-${nextSeed}`;
    }
}

function runLiveMicrofinanceCalculator() {
    const principal = parseFloat(document.getElementById('principal').value) || 0;
    const rate = parseFloat(document.getElementById('interestRate').value) || 0; 
    const duration = parseInt(document.getElementById('duration').value) || 0;
    const frequency = document.getElementById('frequency').value;
    const startDateVal = document.getElementById('startDate').value;

    if (principal <= 0 || rate <= 0 || duration <= 0) {
        return;
    }

    // Core Interest Equation Calculations
    const calculatedInterest = principal * (rate / 100) * (duration / 12);
    const totalRepayable = principal + calculatedInterest;

    let totalInstallments = duration;
    if (frequency === 'Weekly') totalInstallments = Math.round(duration * 4.34);
    else if (frequency === 'Daily') totalInstallments = duration * 30;

    const preciseEmi = totalInstallments > 0 ? totalRepayable / totalInstallments : 0;

    // Push calculation metrics smoothly back to UI elements
    document.getElementById('lblTotalInterest').innerText = `₹${calculatedInterest.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    document.getElementById('lblTotalRepayable').innerText = `₹${totalRepayable.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    document.getElementById('lblEMI').innerText = `₹${preciseEmi.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;

    // Compute Automated Maturity End Date
    if (startDateVal) {
        const start = new Date(startDateVal);
        start.setMonth(start.getMonth() + duration);
        document.getElementById('endDate').value = start.toISOString().split('T')[0];
    }
}

// Helper utility to convert file inputs into Base64 strings safely
function fileToBase64(fileInput) {
    return new Promise((resolve) => {
        if (!fileInput || !fileInput.files || !fileInput.files[0]) {
            resolve('');
            return;
        }
        const file = fileInput.files[0];
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => resolve('');
        reader.readAsDataURL(file);
    });
}

async function saveCustomerDataToServerPipeline() {
    const submitBtn = document.getElementById('submitBtn');
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i class="fa-solid fa-spinner animate-spin"></i> Processing Images & Dispatching...`;

    try {
        // Read uploaded images concurrently using Base64 helper
        const [appImgData, aadharImgData, panImgData] = await Promise.all([
            fileToBase64(document.getElementById('imgApplication')),
            fileToBase64(document.getElementById('imgAadhar')),
            fileToBase64(document.getElementById('imgPan'))
        ]);

        const aadharInput = document.getElementById('aadharNo');
        const panInput = document.getElementById('panNo');
        const addressInput = document.getElementById('customerAddress');
        const landmarkInput = document.getElementById('customerLandmark');

        const customerPayload = {
            accountNo: document.getElementById('accountNo').value,
            customerName: document.getElementById('customerName').value,
            mobile: document.getElementById('mobile').value,
            aadharNo: aadharInput ? aadharInput.value.trim() : '',
            panNo: panInput ? panInput.value.trim().toUpperCase() : '',
            address: addressInput ? addressInput.value.trim() : '',
            landmark: landmarkInput ? landmarkInput.value.trim() : '',
            principal: parseFloat(document.getElementById('principal').value) || 0,
            interestRate: parseFloat(document.getElementById('interestRate').value) || 0,
            frequency: document.getElementById('frequency').value,
            duration: parseInt(document.getElementById('duration').value) || 0,
            startDate: document.getElementById('startDate').value,
            endDate: document.getElementById('endDate').value,
            emi: parseFloat(document.getElementById('lblEMI').innerText.replace('₹', '').replace(/,/g, '')) || 0,
            totalOutstanding: parseFloat(document.getElementById('lblTotalRepayable').innerText.replace('₹', '').replace(/,/g, '')) || 0,
            
            // Base64 Encoded Image Records
            imgApplication: appImgData,
            imgAadhar: aadharImgData,
            imgPan: panImgData
        };

        // Local Storage dynamic fallback cache injection protocol
        let localLedger = JSON.parse(localStorage.getItem('vp_local_customers')) || [];
        localLedger.unshift(customerPayload);
        localStorage.setItem('vp_local_customers', JSON.stringify(localLedger));

        // Send payload via POST/GET fetch request
        const finalEndpointUrl = `${GOOGLE_SCRIPT_WEBAPP_URL}?jsonData=${encodeURIComponent(JSON.stringify({ action: 'saveCustomer', data: customerPayload }))}`;

        fetch(finalEndpointUrl, {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache'
        })
        .then(res => res.json())
        .then(result => {
            if (result && result.status === 'success') {
                alert('🎉 Success Machi! Customer details and uploaded images pushed successfully!');
            }
            window.location.href = "customer-list.html";
        })
        .catch(err => {
            console.warn("Server response active status routing bypass:", err);
            window.location.href = "customer-list.html";
        });

    } catch (error) {
        console.error("Error saving customer pipeline:", error);
        alert("Something went wrong while processing images. Please try again.");
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<i class="fa-solid fa-cloud-arrow-up"></i> Disburse to Cloud Sheets`;
    }
}

window.saveCustomerToSheet = saveCustomerDataToServerPipeline;
