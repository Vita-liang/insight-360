// DOM Elements
const roleSwitcher = document.getElementById('roleSwitcher');
const roleDropdown = document.getElementById('roleDropdown');
const addInsightBtn = document.getElementById('addInsightBtn');
const fab = document.getElementById('fab');
const addInsightModal = document.getElementById('addInsightModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const closeDetailModalBtn = document.getElementById('closeDetailModalBtn');
const insightDetailModal = document.getElementById('insightDetailModal');
const insightForm = document.getElementById('insightForm');
const navItems = document.querySelectorAll('.nav-item');
const screens = document.querySelectorAll('.screen');
const insightTiles = document.querySelectorAll('.insight-tile');
const insightItems = document.querySelectorAll('.insight-item');
const filterChips = document.querySelectorAll('.filter-chip');

// State
let currentRole = 'msl';
let currentScreen = 'home';

// Initialize app
function initApp() {
    setupEventListeners();
    loadInitialData();
}

// Setup event listeners
function setupEventListeners() {
    // Role switcher
    roleSwitcher.addEventListener('click', toggleRoleDropdown);
    document.addEventListener('click', (e) => {
        if (!roleSwitcher.contains(e.target) && !roleDropdown.contains(e.target)) {
            roleDropdown.classList.remove('show');
        }
    });
    
    // Role selection
    document.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const role = e.currentTarget.dataset.role;
            const name = e.currentTarget.dataset.name;
            switchRole(role, name);
            roleDropdown.classList.remove('show');
        });
    });
    
    // Navigation
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const target = e.currentTarget.dataset.target;
            switchScreen(target);
        });
    });
    
    // Insight tiles and items
    [...insightTiles, ...insightItems].forEach(item => {
        item.addEventListener('click', (e) => {
            const insightId = e.currentTarget.dataset.insightId;
            showInsightDetail(insightId);
        });
    });
    
    // Filter chips
    filterChips.forEach(chip => {
        chip.addEventListener('click', (e) => {
            filterChips.forEach(c => c.classList.remove('active'));
            e.currentTarget.classList.add('active');
            // Add filtering logic here
            const filter = e.currentTarget.textContent;
            filterInsights(filter);
        });
    });
    
    // KOL items
    document.querySelectorAll('.kol-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const kolName = e.currentTarget.querySelector('.kol-name').textContent;
            showKolDetail(kolName);
        });
    });
    
    // Period filters
    document.querySelectorAll('.filter-chip[data-period]').forEach(chip => {
        chip.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-chip[data-period]').forEach(c => c.classList.remove('active'));
            e.currentTarget.classList.add('active');
            const period = e.currentTarget.dataset.period;
            updateKpiData(period);
        });
    });
    
    // View toggle
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            const view = e.currentTarget.dataset.view;
            switchKpiView(view);
        });
    });
    
    // Modals
    addInsightBtn.addEventListener('click', () => {
        addInsightModal.classList.add('show');
    });
    
    fab.addEventListener('click', () => {
        addInsightModal.classList.add('show');
    });
    
    closeModalBtn.addEventListener('click', () => {
        addInsightModal.classList.remove('show');
    });
    
    closeDetailModalBtn.addEventListener('click', () => {
        insightDetailModal.classList.remove('show');
    });
    
    // Form submission
    insightForm.addEventListener('submit', (e) => {
        e.preventDefault();
        submitInsight();
    });
}

// Toggle role dropdown
function toggleRoleDropdown() {
    roleDropdown.classList.toggle('show');
}

// Switch role
function switchRole(role, name) {
    currentRole = role;
    document.querySelector('.role-text').textContent = role === 'msl' ? 'MSL' : '医学经理';
    document.querySelector('.role-name').textContent = `- ${name}`;
    
    // Update active state
    document.querySelectorAll('.dropdown-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.role === role) {
            item.classList.add('active');
        }
    });
    
    // Refresh data based on role
    loadInitialData();
}

// Switch screen
function switchScreen(screenId) {
    currentScreen = screenId;
    
    // Update navigation
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.dataset.target === screenId) {
            item.classList.add('active');
        }
    });
    
    // Update screens
    screens.forEach(screen => {
        screen.classList.remove('active');
        if (screen.id === screenId) {
            screen.classList.add('active');
        }
    });
}

// Show insight detail
function showInsightDetail(insightId) {
    // Mock data for now
    const insights = {
        '1': {
            kolName: '王教授',
            hospital: '北京协和医院',
            date: '2026-03-28',
            type: '临床实践',
            content: '王教授认为当前治疗方案中，AureliMab™的用药频率可能影响患者依从性，建议优化给药方案。具体来说，当前的每周两次给药方案对于部分老年患者来说负担较重，可能导致漏药情况发生。',
            gritGoal: '优化AureliMab™的给药方案，提高患者依从性，从而提升治疗效果。',
            gritReview: '通过与王教授的交流，发现当前每周两次的给药方案在临床实践中存在依从性问题，特别是对于老年患者群体。',
            gritInsight: '给药频率是影响患者依从性的重要因素，优化给药方案可能显著提升治疗效果和患者满意度。',
            gritTrack: '1. 与研发部门沟通，评估调整给药方案的可行性；2. 设计相关临床研究验证新方案的有效性；3. 更新产品说明书和患者教育材料。',
            status: '已跟进',
            department: '医学部、研发部',
            deadline: '2026-04-15'
        },
        '2': {
            kolName: '李主任',
            hospital: '上海瑞金医院',
            date: '2026-03-25',
            type: '联合治疗',
            content: '李主任分享了LymphoAxis™与PD-1抑制剂联合治疗霍奇金淋巴瘤的初步临床经验，效果显著。具体表现为肿瘤缩小速度加快，患者生活质量提升明显。',
            gritGoal: '探索LymphoAxis™与免疫检查点抑制剂的联合治疗方案，提高霍奇金淋巴瘤的治疗效果。',
            gritReview: '通过与李主任的交流，了解到LymphoAxis™与PD-1抑制剂联合使用在临床实践中显示出协同效应，值得进一步研究。',
            gritInsight: '免疫治疗与靶向治疗的联合应用可能成为淋巴瘤治疗的新方向，需要开展更大规模的临床研究验证。',
            gritTrack: '1. 设计联合治疗的临床研究方案；2. 与市场部沟通，更新产品推广策略；3. 准备相关学术资料，支持临床医生的联合用药决策。',
            status: '处理中',
            department: '医学部、市场部',
            deadline: '2026-04-30'
        },
        '3': {
            kolName: '张教授',
            hospital: '广州中山医院',
            date: '2026-03-20',
            type: '指南更新',
            content: '张教授建议在指南更新中增加CardioAureli™作为高风险患者的一线治疗选择。基于其临床经验，CardioAureli™在降低LDL-C方面表现优异，特别适合心血管高风险人群。',
            gritGoal: '推动CardioAureli™纳入相关临床指南，提升其在高胆固醇血症治疗中的地位。',
            gritReview: '通过与张教授的交流，了解到临床医生对CardioAureli™的临床效果认可度较高，有潜力成为一线治疗选择。',
            gritInsight: '指南地位是影响药物临床应用的重要因素，积极参与指南更新流程可以显著提升产品的市场竞争力。',
            gritTrack: '1. 收集CardioAureli™的临床证据，准备指南申请材料；2. 与相关学会沟通，支持指南更新；3. 开展相关学术活动，提升产品在专家中的认知度。',
            status: '待处理',
            department: '医学部、政府事务部',
            deadline: '2026-05-15'
        }
    };
    
    const insight = insights[insightId] || insights['1'];
    
    // Update modal content
    document.getElementById('detailKolName').textContent = insight.kolName;
    document.getElementById('detailHospital').textContent = insight.hospital;
    document.getElementById('detailDate').textContent = insight.date;
    document.getElementById('detailType').textContent = insight.type;
    document.getElementById('detailContent').textContent = insight.content;
    document.getElementById('detailGritGoal').textContent = insight.gritGoal;
    document.getElementById('detailGritReview').textContent = insight.gritReview;
    document.getElementById('detailGritInsight').textContent = insight.gritInsight;
    document.getElementById('detailGritTrack').textContent = insight.gritTrack;
    
    const statusElement = document.getElementById('detailStatus');
    statusElement.textContent = insight.status;
    statusElement.className = 'status-value';
    
    if (insight.status === '已跟进') {
        statusElement.classList.add('green');
    } else if (insight.status === '处理中') {
        statusElement.classList.add('yellow');
    } else {
        statusElement.classList.add('red');
    }
    
    document.getElementById('detailDepartment').textContent = insight.department;
    document.getElementById('detailDeadline').textContent = insight.deadline;
    
    // Show modal
    insightDetailModal.classList.add('show');
}

// Submit insight
function submitInsight() {
    const kolName = document.getElementById('kolName').value;
    const hospital = document.getElementById('hospital').value;
    const insightTitle = document.getElementById('insightTitle').value;
    const insightContent = document.getElementById('insightContent').value;
    const insightType = document.getElementById('insightType').value;
    const gritGoal = document.getElementById('gritGoal').value;
    const gritReview = document.getElementById('gritReview').value;
    const gritInsight = document.getElementById('gritInsight').value;
    const gritTrack = document.getElementById('gritTrack').value;
    
    // Validate form
    if (!kolName || !hospital || !insightTitle || !insightContent) {
        alert('请填写必填字段');
        return;
    }
    
    // Mock submission
    console.log('Submitting insight:', {
        kolName,
        hospital,
        insightTitle,
        insightContent,
        insightType,
        gritGoal,
        gritReview,
        gritInsight,
        gritTrack
    });
    
    // Show success message
    alert('洞见提交成功！');
    
    // Reset form
    insightForm.reset();
    
    // Close modal
    addInsightModal.classList.remove('show');
    
    // Refresh data
    loadInitialData();
}

// Filter insights
function filterInsights(filter) {
    console.log('Filtering insights by:', filter);
    // In a real app, this would filter the insights based on the selected filter
    // For now, we'll just show an alert
    if (filter !== '全部') {
        alert(`已筛选 ${filter} 类型的洞见`);
    }
}

// Show KOL detail
function showKolDetail(kolName) {
    // Mock KOL data
    const kols = {
        '王教授': {
            name: '王教授',
            hospital: '北京协和医院',
            specialty: '血液科',
            level: '国家级',
            expertise: '多发性骨髓瘤、淋巴瘤的诊断与治疗',
            publications: '发表学术论文100余篇，其中SCI论文50余篇',
            interactions: '已进行12次学术交流，贡献8条高质量洞见'
        },
        '李主任': {
            name: '李主任',
            hospital: '上海瑞金医院',
            specialty: '血液科',
            level: '国家级',
            expertise: '淋巴瘤、白血病的靶向治疗',
            publications: '发表学术论文80余篇，其中SCI论文40余篇',
            interactions: '已进行10次学术交流，贡献6条高质量洞见'
        },
        '张教授': {
            name: '张教授',
            hospital: '广州中山医院',
            specialty: '心血管科',
            level: '省级',
            expertise: '高胆固醇血症、冠心病的治疗',
            publications: '发表学术论文60余篇，其中SCI论文30余篇',
            interactions: '已进行8次学术交流，贡献4条高质量洞见'
        }
    };
    
    const kol = kols[kolName] || kols['王教授'];
    
    // Create KOL detail modal
    const modal = document.createElement('div');
    modal.className = 'modal show';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>KOL详情</h3>
                <button class="close-button" onclick="this.parentElement.parentElement.parentElement.remove()">×</button>
            </div>
            <div class="modal-body">
                <div class="detail-section">
                    <h4>基本信息</h4>
                    <div class="detail-item">
                        <span class="label">姓名：</span>
                        <span class="value">${kol.name}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">医院：</span>
                        <span class="value">${kol.hospital}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">专科：</span>
                        <span class="value">${kol.specialty}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">等级：</span>
                        <span class="value">${kol.level}</span>
                    </div>
                </div>
                <div class="detail-section">
                    <h4>专业领域</h4>
                    <div class="detail-content">${kol.expertise}</div>
                </div>
                <div class="detail-section">
                    <h4>学术成就</h4>
                    <div class="detail-content">${kol.publications}</div>
                </div>
                <div class="detail-section">
                    <h4>互动记录</h4>
                    <div class="detail-content">${kol.interactions}</div>
                </div>
                <div class="action-buttons">
                    <button class="action-btn" onclick="this.parentElement.parentElement.parentElement.parentElement.remove()">关闭</button>
                    <button class="action-btn">安排拜访</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Update KPI data based on period
function updateKpiData(period) {
    console.log('Updating KPI data for period:', period);
    // In a real app, this would fetch data for the selected period
    // For now, we'll just show an alert
    alert(`已切换到${document.querySelector(`.filter-chip[data-period="${period}"]`).textContent}`);
    
    // Here we could update the KPI data based on the selected period
    // For example, fetch data from an API and update the tables
}

// Switch KPI view
function switchKpiView(view) {
    console.log('Switching KPI view to:', view);
    // In a real app, this would switch between personal and team views
    // For now, we'll just show an alert
    const viewName = view === 'personal' ? '个人' : '团队';
    alert(`已切换到${viewName}视图`);
    
    // Here we could update the KPI data based on the selected view
    // For example, show personal KPI or team KPI
    updateKpiViewData(view);
}

// Update KPI view data
function updateKpiViewData(view) {
    // In a real app, this would update the KPI data based on the selected view
    // For example, fetch personal or team data from an API
    console.log('Updating KPI view data for:', view);
    
    // Simulate data update
    const kpiCategories = document.querySelectorAll('.kpi-category');
    kpiCategories.forEach(category => {
        // Add animation to indicate data update
        category.style.opacity = '0.7';
        setTimeout(() => {
            category.style.opacity = '1';
        }, 300);
    });
}

// Load initial data
function loadInitialData() {
    // Mock data loading
    console.log('Loading data for role:', currentRole);
    // In a real app, this would fetch data from an API
}

// Initialize the app
initApp();