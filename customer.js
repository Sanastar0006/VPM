// Unga kotha Web App URL-ah inga paste pannunga machi
const GOOGLE_SCRIPT_WEBAPP_URL = "https://script.google.com/macros/s/AKfycby9Fwl090NE0lUuVmrgiXvFv_V7UGfg4nD9ZezIhabsuEMwS-8QvjE5lkXxQtD3FSZO/exec";

function saveCustomerDataToServerPipeline() {
    const submitBtn = document.getElementById('submitBtn');
    
    const customerPayload = {
        accountNo: document.getElementById('accountNo').value,
        customerName: document.getElementById('customerName').value,
        mobile: document.getElementById('mobile').value,
        principal: parseFloat(document.getElementById('principal').value),
        interestRate: parseFloat(document.getElementById('interestRate').value),
        frequency: document.getElementById('frequency').value,
        duration: parseInt(document.getElementById('duration').value),
        startDate: document.getElementById('startDate').value,
        endDate: document.getElementById('endDate').value,
        emi: parseFloat(document.getElementById('lblEMI').innerText.replace('₹', '').replace(/,/g, '')),
        totalOutstanding: parseFloat(document.getElementById('lblTotalRepayable').innerText.replace('₹', '').replace(/,/g, ''))
    };

    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i class="fa-solid fa-spinner animate-spin"></i> Dispatching to Cloud Server...`;

    // Local Storage Ledger Cache instantly
    let localLedger = JSON.parse(localStorage.getItem('vp_local_customers')) || [];
    localLedger.unshift(customerPayload);
    localStorage.setItem('vp_local_customers', JSON.stringify(localLedger));

    // URLSearchParams Method format parsing to clear no-cors issue
    const targetPayloadUrl = `${GOOGLE_SCRIPT_WEBAPP_URL}?jsonData=${encodeURIComponent(JSON.stringify({ action: 'saveCustomer', data: customerPayload }))}`;

    fetch(targetPayloadUrl, {
        method: 'GET', 
        mode: 'cors',
        cache: 'no-cache'
    })
    .then(res => res.json())
    .then(result => {
        if(result && result.status === 'success') {
            alert('🎉 Success Machi! Data perfectly recorded into Google Sheets Database!');
        }
        window.location.href = "customer-list.html";
    })
    .catch(err => {
        console.warn("Network response bypass active:", err);
        window.location.href = "customer-list.html";
    });
}

window.saveCustomerToSheet = saveCustomerDataToServerPipeline;
