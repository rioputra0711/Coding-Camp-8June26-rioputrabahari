// ─── State ────────────────────────────────────────────────
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let categories   = JSON.parse(localStorage.getItem('categories'))   || ['Food', 'Transport', 'Fun', 'Bills', 'Health'];
let isDark       = JSON.parse(localStorage.getItem('darkMode'))      || false;
let chartInstance = null;

// Category icons (fallback to emoji)
const CAT_ICONS = {
    food:      '🍜', transport: '🚗', fun: '🎮', bills: '📄',
    health:    '💊', shopping:  '🛍️', coffee: '☕', travel: '✈️',
};
function iconFor(cat) {
    return CAT_ICONS[cat.toLowerCase()] || '💳';
}

// Color palette cycling per category
const PALETTE = [
    '#2563EB','#8B5CF6','#10B981','#F59E0B',
    '#EF4444','#EC4899','#06B6D4','#84CC16',
];
const catColorCache = {};
let colorIndex = 0;
function colorFor(cat) {
    if (!catColorCache[cat]) {
        catColorCache[cat] = PALETTE[colorIndex % PALETTE.length];
        colorIndex++;
    }
    return catColorCache[cat];
}

// ─── DOM refs ─────────────────────────────────────────────
const balanceEl     = document.getElementById('totalBalance');
const txCountEl     = document.getElementById('txCount');
const listEl        = document.getElementById('transactionList');
const emptyEl       = document.getElementById('emptyState');
const categorySelect= document.getElementById('category');
const sortSelect    = document.getElementById('sortSelect');
const themeToggle   = document.getElementById('themeToggle');
const addCatBtn     = document.getElementById('addCategoryBtn');
const submitBtn     = document.getElementById('submitBtn');
const chartCenterVal= document.getElementById('chartCenterVal');
const chartCenterSub= document.getElementById('chartCenterSub');

// ─── Init ─────────────────────────────────────────────────
function init() {
    applyTheme();
    renderCategories();
    // Pre-seed category colors
    categories.forEach(c => colorFor(c));
    updateUI();
}

// ─── Theme ────────────────────────────────────────────────
function applyTheme() {
    document.body.classList.toggle('dark', isDark);
    const icon  = themeToggle.querySelector('.theme-icon');
    const label = themeToggle.querySelector('.theme-label');
    icon.textContent  = isDark ? '☀️' : '🌙';
    label.textContent = isDark ? 'Light' : 'Dark';
    if (chartInstance) renderChart();
}

themeToggle.addEventListener('click', () => {
    isDark = !isDark;
    localStorage.setItem('darkMode', JSON.stringify(isDark));
    applyTheme();
});

// ─── Categories ───────────────────────────────────────────
function renderCategories() {
    categorySelect.innerHTML = '';
    categories.forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat;
        opt.textContent = `${iconFor(cat)} ${cat}`;
        categorySelect.appendChild(opt);
    });
}

addCatBtn.addEventListener('click', () => {
    const input = document.getElementById('newCategory');
    const val   = input.value.trim();
    if (!val || categories.includes(val)) { input.value = ''; return; }
    categories.push(val);
    colorFor(val); // assign color now
    localStorage.setItem('categories', JSON.stringify(categories));
    renderCategories();
    categorySelect.value = val;
    input.value = '';
});

// ─── Add Transaction ──────────────────────────────────────
submitBtn.addEventListener('click', () => {
    const name   = document.getElementById('itemName').value.trim();
    const amount = parseFloat(document.getElementById('amount').value);
    const cat    = categorySelect.value;

    if (!name || isNaN(amount) || amount <= 0 || !cat) {
        // Shake the button
        submitBtn.style.animation = 'none';
        submitBtn.offsetHeight;
        submitBtn.style.animation = '';
        return;
    }

    transactions.push({ id: Date.now(), name, amount, category: cat, date: new Date().toISOString() });
    saveData();
    updateUI();

    // Reset fields
    document.getElementById('itemName').value = '';
    document.getElementById('amount').value   = '';
});

// ─── Delete ───────────────────────────────────────────────
function deleteTransaction(id) {
    transactions = transactions.filter(t => t.id !== id);
    saveData();
    updateUI();
}

function saveData() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// ─── UI ───────────────────────────────────────────────────
function updateUI() {
    updateHero();
    renderList();
    renderChart();
}

function updateHero() {
    const total = transactions.reduce((s, t) => s + t.amount, 0);
    balanceEl.textContent = formatRupiah(total);

    const n = transactions.length;
    txCountEl.textContent = n === 0 ? 'No transactions yet'
        : n === 1 ? '1 transaction recorded'
        : `${n} transactions recorded`;
}

function getSorted() {
    const sorted = [...transactions];
    const type = sortSelect.value;
    if (type === 'newest')   sorted.sort((a,b) => b.id - a.id);
    if (type === 'highest')  sorted.sort((a,b) => b.amount - a.amount);
    if (type === 'lowest')   sorted.sort((a,b) => a.amount - b.amount);
    if (type === 'category') sorted.sort((a,b) => a.category.localeCompare(b.category));
    return sorted;
}

function renderList() {
    listEl.innerHTML = '';
    const sorted = getSorted();

    if (sorted.length === 0) {
        emptyEl.classList.add('visible');
        return;
    }
    emptyEl.classList.remove('visible');

    sorted.forEach(t => {
        const color = colorFor(t.category);
        const icon  = iconFor(t.category);
        const li = document.createElement('li');
        li.className = 'transaction-item';
        li.innerHTML = `
            <div class="tx-icon" style="background:${color}22; color:${color}">${icon}</div>
            <div class="tx-info">
                <div class="tx-name">${escHtml(t.name)}</div>
                <div class="tx-category">${escHtml(t.category)}</div>
            </div>
            <div class="tx-right">
                <div class="tx-amount">${formatRupiah(t.amount)}</div>
                <button class="btn-delete" onclick="deleteTransaction(${t.id})">✕</button>
            </div>
        `;
        listEl.appendChild(li);
    });
}

sortSelect.addEventListener('change', renderList);

// ─── Chart ────────────────────────────────────────────────
function renderChart() {
    const ctx = document.getElementById('expenseChart').getContext('2d');

    const totals = {};
    transactions.forEach(t => {
        totals[t.category] = (totals[t.category] || 0) + t.amount;
    });

    const labels = Object.keys(totals);
    const data   = Object.values(totals);
    const colors = labels.map(l => colorFor(l));
    const textColor = isDark ? '#E8EAF4' : '#1A1D2E';
    const mutedColor= isDark ? '#8890B0' : '#7B82A0';

    // Center label
    if (labels.length === 0) {
        chartCenterVal.textContent = '—';
        chartCenterSub.textContent = 'categories';
    } else {
        chartCenterVal.textContent = labels.length;
        chartCenterSub.textContent = labels.length === 1 ? 'category' : 'categories';
    }

    if (chartInstance) chartInstance.destroy();

    if (labels.length === 0) {
        // Draw empty placeholder
        chartCenterVal.textContent = '';
        chartCenterSub.textContent = 'No data yet';
        chartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Empty'],
                datasets: [{ data: [1], backgroundColor: [isDark ? '#2E3347' : '#E4E7EF'], borderWidth: 0 }]
            },
            options: { cutout: '68%', plugins: { legend: { display: false }, tooltip: { enabled: false } } }
        });
        return;
    }

    chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels,
            datasets: [{
                data,
                backgroundColor: colors,
                hoverBackgroundColor: colors.map(c => c + 'DD'),
                borderWidth: 3,
                borderColor: isDark ? '#1C1F2E' : '#FFFFFF',
                hoverOffset: 6,
            }]
        },
        options: {
            cutout: '68%',
            responsive: true,
            animation: { animateRotate: true, duration: 500 },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: mutedColor,
                        font: { family: "'Inter', sans-serif", size: 12, weight: '600' },
                        padding: 16,
                        usePointStyle: true,
                        pointStyleWidth: 8,
                    }
                },
                tooltip: {
                    callbacks: {
                        label: ctx => ` ${formatRupiah(ctx.parsed)}`
                    },
                    bodyFont: { family: "'Inter', sans-serif" },
                    titleFont: { family: "'Inter', sans-serif", weight: '700' },
                }
            }
        }
    });
}

// ─── Util ─────────────────────────────────────────────────
function formatRupiah(amount) {
    return 'Rp' + Math.round(amount).toLocaleString('id-ID');
}

function escHtml(str) {
    return str.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}

// ─── Start ────────────────────────────────────────────────
init();