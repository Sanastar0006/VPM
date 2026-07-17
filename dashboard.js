/**
 * VP MICROFINANCE PRO 2026 - YONO SBI Luxury Edition
 * Part 11 – Dynamic Dashboard Analytics Engine Pipeline
 */

// Core App Script Integration Endpoint Matrix Link
const DASHBOARD_WEBAPP_URL = "https://script.google.com/macros/s/AKfycby9Fwl090NE0lUuVmrgiXvFv_V7UGfg4nD9ZezIhabsuEMwS-8QvjE5lkXxQtD3FSZO/exec";

// Local structural fallback store for initial UI rendering validation
let structuralMockArray = [
    { accountNo: 'VP-1001', customerName: 'Muthu Kumar', principal: 40000, totalOutstanding: 45000 },
    { accountNo: 'VP-1002', customerName: 'Anitha Raj', principal: 15000, totalOutstanding: 16400 },
    { accountNo: 'VP-1003', customerName: 'Selvam S.', principal: 60000, totalOutstanding: 66000 }
];

document.addEventListener('DOMContentLoaded', () => {
    // Automatically trigger telemetry initialization routine on viewport load
    syncDashboardRealtimeMetrics();
});

/**
 * TELEMETRY SYNCHRONIZATION PIPELINE ROUTINE
 */
async function syncDashboardRealtimeMetrics() {
    const logElement = document.getElementById('diagnosticsLog');
    
    // UI state indicators update phase
    logElement.innerText = `[${new Date().toLocaleTimeString()}] 🔄 Dispatching handshakes to cloud data arrays...`;
    
    try {
        // Fallback framework evaluation path for standalone testing environments
        if (DASHBOARD_WEBAPP_URL.includes("YOUR_APPS_SCRIPT")) {
            processAnalyticsDatastream(structuralMockArray);
            logElement.innerHTML += `<br><span class="text-amber-400">[SIMULATION] Running isolated UI components mode. Sandbox metrics loaded.</span>`;
            return;
        }

        // Production web app server-side query payload execution
        const response = await fetch(`${DASHBOARD_WEBAPP_URL}?action=getCustomerList`);
        
        // Edge check handle for cross-origin tracking policies
        if (!response.ok) throw new Error('Network stream pipeline responded with execution faults.');
        
        const responseData = await response.json();

        if (responseData.status === 'success' && Array.isArray(responseData.data)) {
            processAnalyticsDatastream(responseData.data);
            logElement.innerHTML += `<br><span class="text-emerald-400">[SUCCESS] Operational array matrix synced. Real-time metrics stable.</span>`;
        } else {
            throw new Error(responseData.message || 'Payload format schema mismatched.');
        }

    } catch (error) {
        console.warn("Analytics bridge routing disruption:", error);
        // Seamless fallback integration recovery route
        processAnalyticsDatastream(structuralMockArray);
        logElement.innerHTML += `<br><span class="text-rose-400">[DISRUPTION] Telemetry error: ${error.message}. Loaded local simulation cache layers.</span>`;
    }
}

/**
 * CALCULATES AND RENDERS LEDGER VALUATIONS INTUITIVELY
 */
function processAnalyticsDatastream(dataset) {
    let aggregateOutstanding = 0;
    let aggregatePrincipal = 0;
    let totalProfilesCount = dataset.length;

    // Computational aggregation iterations loop
    dataset.forEach(profile => {
        aggregateOutstanding += parseFloat(profile.totalOutstanding) || 0;
        aggregatePrincipal += parseFloat(profile.principal) || 0;
    });

    // Animate UI DOM text metrics safely into localized formatting
    document.getElementById('dashOutstanding').innerText = `₹${aggregateOutstanding.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    document.getElementById('dashPrincipal').innerText = `₹${aggregatePrincipal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    document.getElementById('dashAccounts').innerText = `${totalProfilesCount} Profile${totalProfilesCount !== 1 ? 's' : ''}`;
}