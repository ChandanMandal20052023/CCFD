// ============================================================
//  CCFD Frontend — main.js (Simplified & Clean)
// ============================================================

// --- CONFIG ---
const API_BASE = 'http://127.0.0.1:8000/api';
const POLL_INTERVAL_MS = 5000;

// --- STATE ---
const state = {
    user: JSON.parse(localStorage.getItem('ccfd_user')) || null,
    token: localStorage.getItem('ccfd_token') || null,
    transactions: [],
    mlData: [],
    stats: { total: 0, safe: 0, fraud: 0, accuracy: 0 },
    pollingTimer: null,
    charts: { pie: null, line: null }
};

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    setupEvents();
    showDashboard();
    initCharts();

    if (state.user) {
        updateUserUI();
        startPolling();
    }

    refreshData();
});

// ============================================================
// EVENTS
// ============================================================
function setupEvents() {
    document.getElementById('login-form')?.addEventListener('submit', handleLogin);
    document.getElementById('register-form')?.addEventListener('submit', handleRegister);
    document.getElementById('payment-form')?.addEventListener('submit', handlePayment);
}

// ============================================================
// API HELPER
// ============================================================
async function api(url, method = 'GET', body = null) {
    try {
        const res = await fetch(`${API_BASE}${url}`, {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...(state.token && { Authorization: `Bearer ${state.token}` })
            },
            body: body ? JSON.stringify(body) : null
        });

        if (res.status === 401 || res.status === 403) {
            console.warn('Unauthorized. Logging out...');
            logout();
            return null;
        }

        if (!res.ok) throw new Error('API error');
        return await res.json();
    } catch (err) {
        console.error(`API ${url} error:`, err);
        return null;
    }
}

// ============================================================
// AUTH
// ============================================================
async function handleRegister(e) {
    e.preventDefault();

    const username = reg('username');
    const email = reg('email');
    const password = reg('password');

    if (!username || !email || !password) return notify('Fill all fields', 'error');

    const data = await api('/register/', 'POST', { username, email, password });

    if (data) {
        notify('Registered! Please login.', 'success');
        toggleAuth(false);
    }
}

async function handleLogin(e) {
    e.preventDefault();

    const email = val('login-email');
    const password = val('login-password');

    const data = await api('/login/', 'POST', { email, password });

    if (!data) return notify('Login failed', 'error');

    state.user = data.user;
    state.token = data.token;

    localStorage.setItem('ccfd_user', JSON.stringify(data.user));
    localStorage.setItem('ccfd_token', data.token);

    updateUserUI();
    startPolling();
    refreshData();

    document.getElementById('registration-screen').classList.add('hidden');
    notify('Login successful', 'success');
}

function logout() {
    stopPolling();
    localStorage.clear();

    Object.assign(state, {
        user: null,
        token: null,
        transactions: [],
        mlData: [],
        stats: { total: 0, safe: 0, fraud: 0, accuracy: 0 }
    });

    renderAll();
}

// POLLING

function startPolling() {
    stopPolling();

    state.pollingTimer = setInterval(async () => {
        if (!state.user) return;

        setLoading(true);
        await refreshData();

        const suspicious = state.transactions.filter(
            t => t.status === 'suspicious' && t.user_response === 'pending'
        );

        if (suspicious.length) {
            notify(`⚠️ ${suspicious.length} suspicious transaction(s)!`, 'error');
            const modal = document.getElementById('verify-modal');
            if (modal && modal.classList.contains('hidden')) {
                openVerifyModal(suspicious[0]);
            }
        }

        setLoading(false);
    }, POLL_INTERVAL_MS);
}

function stopPolling() {
    clearInterval(state.pollingTimer);
}

// DATA FETCH

async function refreshData() {
    if (!state.user) {
        state.transactions = [];
        state.mlData = [];
        state.stats = { total: '🔒', safe: '🔒', fraud: '🔒', accuracy: '🔒' };
        return renderAll();
    }

    const [stats, tx, ml] = await Promise.all([
        api('/metrics/'),
        api('/live-transactions/'),
        api('/ml-data/')
    ]);

    if (stats) {
        const total = stats.total_transactions || 0;
        const fraud = stats.fraud_detected || 0;

        state.stats = {
            total,
            fraud,
            safe: total - fraud,
            accuracy: stats.accuracy || 100
        };
    }

    state.transactions = tx?.results || tx || [];
    state.mlData = ml?.results || ml || [];

    renderAll();
}

// RENDER

function renderAll() {
    updateStatsUI();
    updateUserUI();
    renderTable();
    renderMLTable();
    updateCharts();
}

function updateStatsUI() {
    setText('stat-total', state.stats.total);
    setText('stat-safe', state.stats.safe);
    setText('stat-fraud', state.stats.fraud);
    setText('stat-accuracy',
        typeof state.stats.accuracy === 'number'
            ? state.stats.accuracy.toFixed(1) + '%'
            : state.stats.accuracy
    );
}

function updateUserUI() {
    const name = state.user?.username || 'User';
    document.querySelectorAll('.user-name').forEach(el => el.innerText = name);
}

// TABLE

function renderTable() {
    const tbody = document.getElementById('transaction-tbody');
    if (!tbody) return;

    if (!state.user) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center">Login required</td></tr>`;
        return;
    }

    tbody.innerHTML = state.transactions.map(t => {
        const risk = getRiskLevel(t);
        const isFraud = t.status === 'suspicious' || t.prediction === 1;
        const isPending = t.user_response === 'pending';
        
        return `
        <tr class="${isFraud ? 'fraud-row' : ''} ${isPending && isFraud ? 'cursor-pointer hover:bg-red-50' : ''}" 
            onclick="${isPending && isFraud ? `openVerifyModal(${JSON.stringify(t).replace(/"/g, '&quot;')})` : ''}">
            <td>${formatTime(t.timestamp)}</td>
            <td>${t.transaction_type}</td>
            <td>${formatCurrency(t.amount)}</td>
            <td><span class="badge ${risk.class}">${risk.label}</span></td>
            <td class="${isFraud ? 'text-red-600 font-bold' : ''}">${t.status}</td>
            <td>
                ${isPending && isFraud 
                    ? `<button class="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded font-bold">VERIFY</button>`
                    : t.user_response}
            </td>
        </tr>`;
    }).join('');
}

function renderMLTable() {
    const tbody = document.getElementById('ml-tbody');
    if (!tbody) return;

    tbody.innerHTML = state.mlData.map(t => `
        <tr>
            <td>${formatTime(t.transaction_date_time)}</td>
            <td>${t.user_id}</td>
            <td>${formatCurrency(t.transaction_amount)}</td>
            <td>${t.is_fraud ? 'FRAUD' : 'SAFE'}</td>
        </tr>
    `).join('');
}

// ============================================================
// CHARTS
// ============================================================
function initCharts() {
    // --- Doughnut / Pie ---
    const pieCtx = document.getElementById('fraud-pie-chart')?.getContext('2d');
    if (pieCtx) {
        state.charts.pie = new Chart(pieCtx, {
            type: 'doughnut',
            data: {
                labels: ['Safe', 'Fraud'],
                datasets: [{
                    data: [1, 0],
                    backgroundColor: ['#3b82f6', '#f87171'],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'top' }
                },
                cutout: '60%'
            }
        });
    }

    // --- Line chart ---
    const lineCtx = document.getElementById('transaction-line-chart')?.getContext('2d');
    if (lineCtx) {
        state.charts.line = new Chart(lineCtx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Transactions',
                    data: [],
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59,130,246,0.1)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, ticks: { stepSize: 1 } }
                }
            }
        });
    }
}

function updateCharts() {
    // Update pie
    if (state.charts.pie) {
        state.charts.pie.data.datasets[0].data = [
            state.stats.safe || 0,
            state.stats.fraud || 0
        ];
        state.charts.pie.update();
    }

    // Update line chart with rolling transaction count
    if (state.charts.line) {
        const chart = state.charts.line;
        const now = new Date().toLocaleTimeString();
        chart.data.labels.push(now);
        chart.data.datasets[0].data.push(state.stats.total || 0);
        // Keep only last 10 points
        if (chart.data.labels.length > 10) {
            chart.data.labels.shift();
            chart.data.datasets[0].data.shift();
        }
        chart.update();
    }
}

// ============================================================
// PAYMENT
// ============================================================
async function handlePayment(e) {
    e.preventDefault();

    const amount = parseFloat(val('pay-amount'));
    const type = val('pay-type') || 'Unknown';
    const location = val('pay-location') || 'Unknown';
    const device = val('pay-device') || 'Unknown';

    if (!amount) return notify('Invalid amount', 'error');

    const data = await api('/predict-transaction/', 'POST', {
        user_id: state.user.id,
        amount,
        type,
        location,
        device
    });

    document.getElementById('payment-modal').classList.add('hidden');
    document.getElementById('payment-form').reset();

    if (!data) return notify('Failed', 'error');

    if (data.status === 'suspicious') {
        notify('⚠️ Suspicious transaction detected! Action required.', 'warning');
        refreshData().then(() => {
            const tx = state.transactions.find(t => t.id === data.transaction_id);
            if (tx) {
                tx.verification_amount = data.verification_amount;
                openVerifyModal(tx);
            }
        });
    } else {
        notify('✅ Transaction approved', 'success');
        refreshData();
    }
}

// ============================================================
// HELPERS
// ============================================================
const val = id => document.getElementById(id)?.value.trim();
const reg = f => val(`reg-${f}`);

function setText(id, v) {
    const el = document.getElementById(id);
    if (el) el.innerText = v ?? '—';
}

function formatCurrency(v) {
    return `$${parseFloat(v || 0).toFixed(2)}`;
}

function formatTime(ts) {
    return new Date(ts).toLocaleString();
}

function getRiskLevel(t) {
    // If flagged as suspicious (either by AI or behavioral outlier), it's High Risk
    if (t.status === 'suspicious' || t.prediction === 1) {
        return { label: 'High', class: 'text-red-600 bg-red-50' };
    }

    const p = t.probability || 0;
    if (p < 0.3) return { label: 'Low', class: 'text-green-600 bg-green-50' };
    if (p < 0.6) return { label: 'Medium', class: 'text-yellow-600 bg-yellow-50' };
    return { label: 'High', class: 'text-red-600 bg-red-50' };
}

function setLoading(show) {
    document.getElementById('table-loading')?.classList.toggle('hidden', !show);
}

function showDashboard() {
    document.getElementById('registration-screen')?.classList.add('hidden');
}

// NOTIFY

function notify(msg, type = 'info') {
    const colors = {
        success: 'bg-green-50 border-green-400 text-green-800',
        error: 'bg-red-50   border-red-400   text-red-800',
        warning: 'bg-yellow-50 border-yellow-400 text-yellow-800',
        info: 'bg-blue-50  border-blue-400  text-blue-800'
    };
    const container = document.getElementById('notification-container');
    if (!container) { console.log(`[${type}] ${msg}`); return; }

    const el = document.createElement('div');
    el.className = `px-4 py-3 border-l-4 rounded shadow ${colors[type] || colors.info} fade-in cursor-pointer`;
    el.innerText = msg;
    el.onclick = () => el.remove();
    container.appendChild(el);
    setTimeout(() => el.remove(), 6000);
}

// MISSING HELPERS
function toggleAuth(showRegister) {
    document.getElementById('login-form').classList.toggle('hidden', showRegister);
    document.getElementById('register-form').classList.toggle('hidden', !showRegister);
    document.getElementById('login-form').reset();
    document.getElementById('register-form').reset();
}

function protectedAction(fn) {
    if (!state.user) {
        document.getElementById('registration-screen').classList.remove('hidden');
        return;
    }
    fn();
}

function switchView(view) {
    const live = document.getElementById('live-table-container');
    const ml = document.getElementById('ml-table-container');
    const navLive = document.getElementById('nav-live');
    const navMl = document.getElementById('nav-ml');

    if (view === 'live') {
        live?.classList.remove('hidden');
        ml?.classList.add('hidden');
        
        navLive?.classList.remove('text-slate-400');
        navLive?.classList.add('text-blue-600');
        
        navMl?.classList.remove('text-blue-600');
        navMl?.classList.add('text-slate-400');
    } else {
        ml?.classList.remove('hidden');
        live?.classList.add('hidden');
        
        navMl?.classList.remove('text-slate-400');
        navMl?.classList.add('text-blue-600');
        
        navLive?.classList.remove('text-blue-600');
        navLive?.classList.add('text-slate-400');
    }
}

function cancelVerification() {
    document.getElementById('verify-modal').classList.add('hidden');
}

// VERIFICATION ENGINE — Added for Real-Time Security

async function openVerifyModal(tx) {
    const modal = document.getElementById('verify-modal');
    const summary = document.getElementById('verify-tx-summary');
    const options = document.getElementById('verify-options');
    
    if (!modal || !summary || !options) return;

    summary.innerHTML = `
        <div class="bg-slate-50 p-3 rounded-lg border border-slate-200 mb-4">
            <p class="text-xs text-slate-500 uppercase tracking-wider font-bold">Security Check Required</p>
            <p class="text-lg font-bold text-slate-800">${formatCurrency(tx.amount)}</p>
            <p class="text-sm text-slate-600">${tx.transaction_type} @ ${tx.location || 'Unknown'}</p>
        </div>
        <p class="text-sm text-slate-600 mb-4">To verify this is you, please select the amount of your <b>previous</b> successful transaction.</p>
    `;

    // Generate options: 1 correct, 2 decoys
    const correctAmount = parseFloat(tx.verification_amount || 100.00);

    const choices = [
        correctAmount,
        correctAmount * 0.5 + Math.random() * 10,
        correctAmount * 1.5 + Math.random() * 20
    ].sort(() => Math.random() - 0.5);

    options.innerHTML = choices.map(amt => `
        <button onclick="submitVerification(${tx.id}, ${amt}, this)" class="w-full py-3 px-4 border-2 border-slate-200 rounded-xl font-semibold hover:border-blue-500 hover:bg-blue-50 transition-all">
            ${formatCurrency(amt)}
        </button>
    `).join('');

    modal.classList.remove('hidden');
}

async function submitVerification(txId, amount, btn) {
    // Disable all buttons
    const buttons = document.querySelectorAll('#verify-options button');
    buttons.forEach(b => b.disabled = true);
    
    btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Verifying...';

    const res = await api('/verify-last-transaction/', 'POST', { transaction_id: txId, amount });
    
    if (res && res.success) {
        btn.classList.add('correct');
        btn.innerHTML = '✅ Correct!';
        notify('Verification successful!', 'success');
        await markDecision(txId, 'approved');
    } else {
        btn.classList.add('wrong');
        btn.innerHTML = '❌ Incorrect';
        notify('Verification failed. Transaction rejected.', 'error');
        await markDecision(txId, 'rejected');
    }

    setTimeout(() => {
        cancelVerification();
        refreshData();
    }, 1500);
}

async function markDecision(txId, decision) {
    await api('/approve-transaction/', 'POST', { transaction_id: txId, decision });
}