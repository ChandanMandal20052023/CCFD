// --- CONFIG ---
const API_BASE = 'http://127.0.0.1:8000/api';

// --- STATE ---
const state = {
    user: JSON.parse(localStorage.getItem('ccfd_user')),
    transactions: [],
    mlData: [],
    currentView: 'live',
    stats: { total: 0, safe: 0, fraud: 0 }
};

// --- INIT ---
document.addEventListener('DOMContentLoaded', () => {
    setupEvents();
    showDashboard();
    refreshData();
    if (state.user) {
        updateUserUI();
    }
});

async function refreshData() {
    if (state.user) {
        await fetchStats();
        await fetchTransactions();
        await fetchMLData();
    } else {
        state.transactions = [];
        state.mlData = [];
        state.stats = { total: '🔒', safe: '🔒', fraud: '🔒' };
    }
    renderAll();
}

// --- PROTECTED ACTION ---
let pendingAction = null;

function protectedAction(action) {
    if (state.user) {
        action();
    } else {
        pendingAction = action;
        document.getElementById('registration-screen').classList.remove('hidden');
        notify('Please login to continue', 'info');
    }
}

// --- EVENTS ---
function setupEvents() {
    document.querySelector('#login-form')?.addEventListener('submit', handleLogin);
    document.querySelector('#register-form')?.addEventListener('submit', handleRegister);
    document.getElementById('payment-form')?.addEventListener('submit', handlePayment);
}

// --- AUTH ---
function toggleAuth(isRegister) {
    document.getElementById('login-form').classList.toggle('hidden', isRegister);
    document.getElementById('register-form').classList.toggle('hidden', !isRegister);
}

async function handleRegister(e) {
    e.preventDefault();
    const username = document.getElementById('reg-username').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;

    if (!username || !email || !password) return notify('Please fill all fields', 'error');

    try {
        const response = await fetch(`${API_BASE}/register/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });

        if (response.ok) {
            notify('Registration successful! Please login.', 'success');
            toggleAuth(false);
        } else {
            const err = await response.json();
            notify(err.error || 'Registration failed', 'error');
        }
    } catch (err) {
        notify('Network Error', 'error');
    }
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    if (!email) return;

    state.user = { name: email.split('@')[0], email };
    localStorage.setItem('ccfd_user', JSON.stringify(state.user));
    
    document.getElementById('registration-screen').classList.add('hidden');
    updateUserUI();
    notify('Login successful', 'success');

    if (pendingAction) {
        pendingAction();
        pendingAction = null;
    }
}

function logout() {
    localStorage.clear();
    location.reload();
}

// --- API CALLS ---
async function fetchStats() {
    try {
        const response = await fetch(`${API_BASE}/metrics/`);
        const m = await response.json();
        // m contains total_transactions, fraud_detected, false_positives, accuracy
        // We will map these nicely to our UI
        state.stats = {
            total: m.total_transactions,
            fraud: m.fraud_detected,
            accordion: m.accuracy, // mapped accuracy
            false_positives: m.false_positives
        };
    } catch (err) {
        console.error('Error fetching stats:', err);
    }
}

async function fetchTransactions() {
    try {
        const response = await fetch(`${API_BASE}/live-transactions/`);
        const data = await response.json();
        state.transactions = data.results || data; // handle pagination
    } catch (err) {
        console.error('Error fetching transactions:', err);
    }
}

async function fetchMLData() {
    try {
        const response = await fetch(`${API_BASE}/ml-data/`);
        state.mlData = await response.json();
    } catch (err) {
        console.error('Error fetching ML data:', err);
    }
}

// --- DASHBOARD ---
function renderAll() {
    renderTable();
    renderMLTable();
    updateStatsUI();
    updateUserUI();
}

function switchView(view) {
    state.currentView = view;
    
    // Toggle Nav Styles
    const navLive = document.getElementById('nav-live');
    const navMl = document.getElementById('nav-ml');
    
    if (view === 'live') {
        navLive.className = 'text-blue-600';
        navMl.className = 'text-slate-400 hover:text-blue-600';
        document.getElementById('live-table-container').classList.remove('hidden');
        document.getElementById('ml-table-container').classList.add('hidden');
        document.getElementById('dashboard-title').innerText = 'Security Dashboard';
    } else {
        navLive.className = 'text-slate-400 hover:text-blue-600';
        navMl.className = 'text-blue-600';
        document.getElementById('live-table-container').classList.add('hidden');
        document.getElementById('ml-table-container').classList.remove('hidden');
        document.getElementById('dashboard-title').innerText = 'ML Training Data';
    }
}

function updateStatsUI() {
    setText('stat-total', state.stats.total);
    setText('stat-safe', `${state.stats.accordion}%`); // Repurposed for accuracy
    setText('stat-fraud', state.stats.fraud);
    // You might want to repurpose a 4th box for false_positives
}

function updateUserUI() {
    document.querySelectorAll('.user-name').forEach(el => el.innerText = state.user.name);
}

function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.innerText = value;
}

// --- TRANSACTIONS & MODALS ---
let pendingTransactionId = null;

async function handlePayment(e) {
    e.preventDefault();

    if (!state.user) return notify('Please login first', 'error');

    const amount = document.getElementById('pay-amount').value;
    const type = document.getElementById('pay-type').value || 'Shopping';
    const location = document.getElementById('pay-location').value || 'Unknown';
    const device = document.getElementById('pay-device').value || 'Web';

    if (!amount) return notify('Amount is required', 'error');

    try {
        const response = await fetch(`${API_BASE}/predict-transaction/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: 1, // Default guest user
                amount: amount,
                type: type,
                location: location,
                device: device
            })
        });

        if (response.ok) {
            const data = await response.json();
            document.getElementById('payment-modal').classList.add('hidden');
            document.getElementById('payment-form').reset();
            
            if (data.status === 'suspicious') {
                // Open approval modal
                pendingTransactionId = data.transaction_id;
                document.getElementById('approval-modal').classList.remove('hidden');
            } else {
                notify('Transaction Processed Sucessfully', 'success');
                refreshData();
            }
        }
    } catch (err) {
        notify('Network Error', 'error');
    }
}

// Hook up approval buttons
document.getElementById('btn-approve')?.addEventListener('click', () => handleApproval('approved'));
document.getElementById('btn-reject')?.addEventListener('click', () => handleApproval('rejected'));

async function handleApproval(decision) {
    if (!pendingTransactionId) return;

    try {
        const response = await fetch(`${API_BASE}/approve-transaction/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                transaction_id: pendingTransactionId,
                decision: decision
            })
        });

        if (response.ok) {
            notify(`Transaction marked as ${decision}`, 'success');
            document.getElementById('approval-modal').classList.add('hidden');
            pendingTransactionId = null;
            refreshData();
        }
    } catch (err) {
        notify('Network error approving transaction', 'error');
    }
}


function renderTable() {
    const tbody = document.getElementById('transaction-tbody');
    if (!tbody) return;

    if (!state.user) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="p-10 text-center text-slate-400">
                    <i class="fas fa-lock mb-2 text-2xl"></i><br>
                    Please <a href="#" onclick="protectedAction(() => {})" class="text-blue-600 hover:underline">login</a> to view transaction history
                </td>
            </tr>
        `;
        document.getElementById('empty-state')?.classList.add('hidden');
        return;
    }

    tbody.innerHTML = state.transactions.map(t => `
        <tr class="border-b hover:bg-slate-50 transition-colors">
            <td class="p-3 text-xs text-slate-500">${new Date(t.timestamp).toLocaleDateString()}</td>
            <td class="p-3 font-medium text-slate-700">
                <div class="text-sm">${t.transaction_type}</div>
                <div class="text-xs text-slate-400">${t.location} | ${t.device_type}</div>
            </td>
            <td class="p-3 text-slate-600 font-bold">$${t.amount}</td>
            <td class="p-3">
                <div class="text-[10px] text-slate-400">P(fraud) = ${parseFloat(t.probability).toFixed(2)}</div>
            </td>
            <td class="p-3">
                <span class="px-2 py-1 rounded-full text-[10px] font-bold ${t.status === 'suspicious' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}">
                    ${t.status.toUpperCase()}
                </span>
            </td>
            <td class="p-3">
                <span class="px-2 py-1 rounded-md text-[10px] uppercase font-bold text-slate-600 bg-slate-100">
                    ${t.user_response}
                </span>
            </td>
        </tr>
    `).join('');

    document.getElementById('empty-state')?.classList.toggle('hidden', state.transactions.length);
}

function renderMLTable() {
    const tbody = document.getElementById('ml-tbody');
    if (!tbody) return;

    if (!state.user) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="p-10 text-center text-slate-400">
                    <i class="fas fa-lock mb-2 text-2xl"></i><br>
                    Please <a href="#" onclick="protectedAction(() => {})" class="text-blue-600 hover:underline">login</a> to view training data
                </td>
            </tr>
        `;
        document.getElementById('ml-empty-state')?.classList.add('hidden');
        return;
    }

    tbody.innerHTML = state.mlData.map(t => `
        <tr class="border-b hover:bg-slate-50 transition-colors">
            <td class="p-3 text-xs text-slate-500">${new Date(t.transaction_date_time).toLocaleString()}</td>
            <td class="p-3 font-medium text-slate-700">User ${t.user_id}</td>
            <td class="p-3 text-slate-400 text-xs">**** ${t.card_number_last4}</td>
            <td class="p-3 text-xs font-medium text-slate-500">${t.transaction_type}</td>
            <td class="p-3 text-slate-600 font-bold">$${t.transaction_amount}</td>
            <td class="p-3">
                <span class="px-2 py-1 rounded-full text-[10px] font-bold ${t.is_fraud ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}">
                    ${t.is_fraud ? 'FRAUD' : 'SAFE'}
                </span>
            </td>
        </tr>
    `).join('');

    document.getElementById('ml-empty-state')?.classList.toggle('hidden', state.mlData.length);
}

// --- HELPERS ---
function notify(msg, type = 'info') {
    const box = document.getElementById('notification-container');
    const el = document.createElement('div');
    el.className = `p-3 rounded-lg text-white shadow-lg fade-in ${type === 'error' ? 'bg-red-500' : 'bg-green-500'}`;
    el.innerText = msg;
    box.appendChild(el);
    setTimeout(() => el.remove(), 3000);
}

function showDashboard() {
    document.getElementById('registration-screen')?.classList.add('hidden');
    document.getElementById('dashboard-screen')?.classList.remove('hidden');
}