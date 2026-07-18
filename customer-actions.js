/**
 * VP MICROFINANCE PRO 2026 - YONO SBI Luxury Edition
 * Part 7 – Customer Lifecycle Actions (View, Edit, Update, Delete)
 */

// Connects directly with the Web App script defined in Phase 1
const ACTIONS_ENGINE_URL = "https://script.google.com/macros/s/AKfycby9Fwl090NE0lUuVmrgiXvFv_V7UGfg4nD9ZezIhabsuEMwS-8QvjE5lkXxQtD3FSZO/exec";

/**
 * VIEW PROFILE PARAMETERS (Read-Only Mode)
 */
function viewCustomerProfile(accountNo) {
    const customer = findCustomerLocally(accountNo);
    if (!customer) return;

    openActionModal("View Account Profile Structure");
    
    // Populate and Lock fields
    toggleFormFields(true);
    populateModalFields(customer);
    
    // Hide standard submit button since it's just viewing
    document.getElementById('modalSubmitBtn').classList.add('hidden');
}

/**
 * EDIT INITIALIZATION MODAL
 */
function editCustomerProfile(accountNo) {
    const customer = findCustomerLocally(accountNo);
    if (!customer) return;

    openActionModal(`Modify Registry Data [ ${accountNo} ]`);
    
    // Populate and unlock fields for updating
    toggleFormFields(false);
    populateModalFields(customer);
    
    const submitBtn = document.getElementById('modalSubmitBtn');
    submitBtn.classList.remove('hidden');
    submitBtn.innerText = "Save Database Updates";
}

/**
 * DELETE ROUTINE (PURGE RECORD)
 */
function deleteCustomerRecord(accountNo) {
    if (confirm(`⚠️ WARNING: Are you absolutely sure you want to completely delete account ${accountNo} from the Cloud Ledger?`)) {
        
        // Remove locally from structural workspace array instantly
        localRegistryArray = localRegistryArray.filter(profile => profile.accountNo !== accountNo);
        renderCustomerRegistryMatrix(localRegistryArray);
        
        // Dispatches structural delete instruction to Google Web App deployment
        fetch(ACTIONS_ENGINE_URL, {
            method: 'POST',
            mode: 'no-cors',
            cache: 'no-cache',
            body: JSON.stringify({ action: 'deleteCustomer', accountNo: accountNo })
        }).then(() => {
            alert(`🗑️ Account ${accountNo} successfully marked for dynamic purge across cloud sheets.`);
        }).catch(err => {
            console.error("Purge operations disruption matrix:", err);
        });
    }
}

/**
 * UPDATE ACTION SUBMIT HANDLER
 */
function handleModalSubmit(event) {
    event.preventDefault();
    
    const targetAccount = document.getElementById('modalAccountNo').value;
    
    // Create modern updated entity structure package
    const updatedPayload = {
        accountNo: targetAccount,
        customerName: document.getElementById('modalName').value,
        mobile: document.getElementById('modalMobile').value,
        principal: parseFloat(document.getElementById('modalPrincipal').value) || 0,
        emi: parseFloat(document.getElementById('modalEMI').value) || 0
    };

    // Update Local Registry Data Array instantly
    const index = localRegistryArray.findIndex(p => p.accountNo === targetAccount);
    if(index !== -1) {
        localRegistryArray[index] = { ...localRegistryArray[index], ...updatedPayload };
        renderCustomerRegistryMatrix(localRegistryArray);
    }

    closeActionModal();

    // Fire network handshake pipeline request back to Code.gs tracking instance
    fetch(ACTIONS_ENGINE_URL, {
        method: 'POST',
        mode: 'no-cors',
        cache: 'no-cache',
        body: JSON.stringify({ action: 'updateCustomer', data: updatedPayload })
    }).then(() => {
        alert("🎉 Cloud Master Sheet ledger records synced successfully!");
    });
}

/**
 * SYSTEM UI HELPERS
 */
function openActionModal(title) {
    document.getElementById('modalTitle').innerText = title;
    document.getElementById('actionModal').classList.remove('hidden');
}

function closeActionModal() {
    document.getElementById('actionModal').classList.add('hidden');
    document.getElementById('modalForm').reset();
}

function findCustomerLocally(accountNo) {
    return localRegistryArray.find(profile => profile.accountNo === accountNo);
}

function populateModalFields(customer) {
    document.getElementById('modalAccountNo').value = customer.accountNo;
    document.getElementById('modalName').value = customer.customerName;
    document.getElementById('modalMobile').value = customer.mobile;
    document.getElementById('modalPrincipal').value = customer.principal;
    document.getElementById('modalEMI').value = customer.emi;
}

function toggleFormFields(isDisabled) {
    document.getElementById('modalName').disabled = isDisabled;
    document.getElementById('modalMobile').disabled = isDisabled;
    document.getElementById('modalPrincipal').disabled = isDisabled;
    document.getElementById('modalEMI').disabled = isDisabled;
}
