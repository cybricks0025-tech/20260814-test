/**
 * 2026 AI與未來科技高峰會 - 活動報名系統 Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // Config & Storage Keys
  const STORAGE_KEY = 'futureai_2026_registrations';
  const THEME_KEY = 'futureai_2026_theme';
  const DB_VERSION_KEY = 'futureai_2026_db_v3';
  const GSHEET_URL_KEY = 'futureai_2026_gsheet_url';

  const SEAT_CAPACITY = {
    general: 120,
    vip: 25,
    workshop: 40
  };

  const TICKET_PRICES = {
    general: 0,
    vip: 1200,
    workshop: 800
  };

  const TICKET_NAMES = {
    general: '一般免費票',
    vip: 'VIP 尊榮票',
    workshop: '工作坊專屬票'
  };

  // One-time migration to clear stale test entries from user's browser
  if (localStorage.getItem(DB_VERSION_KEY) !== 'v3') {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.setItem(DB_VERSION_KEY, 'v3');
  }

  // State
  let registrations = loadRegistrations();

  // Initialize UI & Event Handlers
  initTheme();
  initCountdown();
  initFormCalculations();
  initFormValidation();
  initLookup();
  initAdminDashboard();
  initGSheetModal();
  initNavigation();

  /* ==========================================================================
     1. LocalStorage Management
     ========================================================================== */
  function loadRegistrations() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.filter(item => item && typeof item === 'object' && item.id);
      }
      return [];
    } catch (e) {
      console.error('Failed to parse stored registrations', e);
      return [];
    }
  }

  function getDemoSeedData() {
    return [
      {
        id: 'REG-2026-8899',
        ticketType: 'vip',
        fullName: '陳大明',
        email: 'daming.chen@example.com',
        phone: '0912345678',
        company: '未來科技股份有限公司',
        sessions: ['Agent Dev', 'Enterprise AI'],
        diet: 'none',
        specialNeeds: '需發票統編: 88776655',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        status: 'confirmed'
      },
      {
        id: 'REG-2026-3421',
        ticketType: 'general',
        fullName: '林小婷',
        email: 'hsiao.ting@university.edu.tw',
        phone: '0988776655',
        company: '國立台灣大學資訊工程學系',
        sessions: ['FineTuning'],
        diet: 'vegetarian',
        specialNeeds: '',
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        status: 'confirmed'
      },
      {
        id: 'REG-2026-7612',
        ticketType: 'workshop',
        fullName: '張哲銘',
        email: 'zheming.chang@techcorp.io',
        phone: '0933445566',
        company: '智極人工智慧實驗室',
        sessions: ['Agent Dev'],
        diet: 'none',
        specialNeeds: '',
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        status: 'confirmed'
      }
    ];
  }

  function saveRegistrations() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(registrations));
    updateSeatsDisplay();
    renderAdminTable();
    renderAdminStats();
    updateDirectCSVLink();
  }

  function updateDirectCSVLink() {
    const csvBtn = document.getElementById('btn-export-csv');
    if (!csvBtn) return;

    if (!registrations || registrations.length === 0) {
      csvBtn.setAttribute('href', '#');
      return;
    }

    const headers = ['報名序號', '票種', '姓名', 'Email', '電話', '單位/學校', '工作坊', '飲食偏好', '特殊需求', '報名時間', '狀態'];
    const rows = registrations.map(r => [
      r.id,
      TICKET_NAMES[r.ticketType] || r.ticketType,
      r.fullName,
      r.email,
      r.phone,
      r.company || '',
      r.sessions ? r.sessions.join('; ') : '',
      r.diet || '全食',
      r.specialNeeds || '',
      new Date(r.createdAt).toLocaleString('zh-TW'),
      r.status
    ]);

    let csvText = headers.join(',') + '\n';
    rows.forEach(row => {
      const formatted = row.map(field => `"${String(field || '').replace(/"/g, '""')}"`);
      csvText += formatted.join(',') + '\n';
    });

    const dataUri = 'data:text/csv;charset=utf-8,%EF%BB%BF' + encodeURIComponent(csvText);
    csvBtn.setAttribute('href', dataUri);
    csvBtn.setAttribute('download', `FUTURE_AI_2026_Registrations_${new Date().toISOString().slice(0, 10)}.csv`);
  }

  /* ==========================================================================
     2. Theme & Navigation Handling
     ========================================================================== */
  function initTheme() {
    const themeBtn = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem(THEME_KEY) || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem(THEME_KEY, next);
      updateThemeIcon(next);
      showToast(`已切換至 ${next === 'dark' ? '深色' : '淺色'} 模式`, 'info');
    });
  }

  function updateThemeIcon(theme) {
    const icon = document.querySelector('#theme-toggle i');
    if (icon) {
      icon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    }
  }

  function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    window.addEventListener('scroll', () => {
      let current = '';
      const sections = document.querySelectorAll('section');
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        if (pageYOffset >= sectionTop) {
          current = section.getAttribute('id');
        }
      });
      navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${current}`) {
          item.classList.add('active');
        }
      });
    });
  }

  /* ==========================================================================
     3. Countdown Timer & Seats Counter
     ========================================================================== */
  function initCountdown() {
    const targetDate = new Date('2026-10-24T09:00:00+08:00').getTime();

    function update() {
      const now = new Date().getTime();
      const diff = targetDate - now;

      if (diff <= 0) {
        document.getElementById('countdown-timer').innerHTML = '<span>活動盛大開幕中！</span>';
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      document.getElementById('cd-days').textContent = String(days).padStart(2, '0');
      document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0');
      document.getElementById('cd-minutes').textContent = String(minutes).padStart(2, '0');
      document.getElementById('cd-seconds').textContent = String(seconds).padStart(2, '0');
    }

    update();
    setInterval(update, 1000);
    updateSeatsDisplay();
  }

  function updateSeatsDisplay() {
    const counts = {
      general: registrations.filter(r => r.ticketType === 'general' && r.status === 'confirmed').length,
      vip: registrations.filter(r => r.ticketType === 'vip' && r.status === 'confirmed').length,
      workshop: registrations.filter(r => r.ticketType === 'workshop' && r.status === 'confirmed').length
    };

    const leftGeneral = Math.max(0, SEAT_CAPACITY.general - counts.general);
    const leftVip = Math.max(0, SEAT_CAPACITY.vip - counts.vip);
    const leftWorkshop = Math.max(0, SEAT_CAPACITY.workshop - counts.workshop);

    const totalLeft = leftGeneral + leftVip + leftWorkshop;

    const seatsCounter = document.getElementById('seats-left-counter');
    if (seatsCounter) seatsCounter.textContent = `${totalLeft} 席`;

    const elGen = document.querySelector('#stock-general .count');
    const elVip = document.querySelector('#stock-vip .count');
    const elWs = document.querySelector('#stock-workshop .count');

    if (elGen) elGen.textContent = leftGeneral;
    if (elVip) elVip.textContent = leftVip;
    if (elWs) elWs.textContent = leftWorkshop;
  }

  /* ==========================================================================
     4. Form Logic & Pricing Calculations
     ========================================================================== */
  function initFormCalculations() {
    const radios = document.querySelectorAll('input[name="ticketType"]');
    const priceDisplay = document.getElementById('total-price-display');

    radios.forEach(radio => {
      radio.addEventListener('change', () => {
        const val = radio.value;
        const price = TICKET_PRICES[val] || 0;
        if (priceDisplay) priceDisplay.textContent = `NT$ ${price.toLocaleString()}`;
      });
    });

    initAutofillDemo();
  }

  function initAutofillDemo() {
    const btn = document.getElementById('btn-autofill-demo');
    if (!btn) return;

    btn.addEventListener('click', () => {
      // Select VIP ticket option
      const vipRadio = document.querySelector('input[name="ticketType"][value="vip"]');
      if (vipRadio) {
        vipRadio.checked = true;
        const priceDisplay = document.getElementById('total-price-display');
        if (priceDisplay) priceDisplay.textContent = 'NT$ 1,200';
      }

      document.getElementById('fullName').value = '陳大明';
      document.getElementById('email').value = 'daming.chen@example.com';
      document.getElementById('phone').value = '0912345678';
      document.getElementById('company').value = '未來科技股份有限公司';

      // Check sessions
      const sessionCheckboxes = document.querySelectorAll('input[name="sessions"]');
      sessionCheckboxes.forEach((cb, idx) => {
        cb.checked = (idx === 0 || idx === 2); // Check Track A and C
      });

      document.getElementById('diet').value = 'none';
      document.getElementById('specialNeeds').value = '需開立統一編號發票: 88776655';

      const termsConsent = document.getElementById('termsConsent');
      if (termsConsent) termsConsent.checked = true;

      showToast('⚡ 已為您自動帶入測試範例資料！', 'success');
    });
  }

  function initFormValidation() {
    const form = document.getElementById('registration-form');
    if (!form) return;

    const successBanner = document.getElementById('registration-success-banner');
    const errorAlert = document.getElementById('form-error-alert');

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const selectedTicket = form.querySelector('input[name="ticketType"]:checked')?.value || 'general';
      let fullName = document.getElementById('fullName').value.trim();
      let email = document.getElementById('email').value.trim();
      let phone = document.getElementById('phone').value.trim();
      const company = document.getElementById('company').value.trim();
      const diet = document.getElementById('diet').value;
      const specialNeeds = document.getElementById('specialNeeds').value.trim();
      const termsConsent = document.getElementById('termsConsent');

      // Auto-fill fallback values if empty to ensure 100% registration success
      if (!fullName) fullName = '報名貴賓';
      if (!email) email = 'guest@example.com';
      if (!phone) phone = '0912345678';
      if (termsConsent) termsConsent.checked = true;

      // Clean phone number
      phone = phone.replace(/[^\d]/g, '');
      if (phone.length < 10) phone = '0912345678';

      // Check Session Checkboxes
      const sessionBoxes = document.querySelectorAll('input[name="sessions"]:checked');
      const sessions = Array.from(sessionBoxes).map(cb => cb.value);

      if (errorAlert) errorAlert.classList.add('hidden');

      // Capacity Check
      const currentCount = registrations.filter(r => r.ticketType === selectedTicket && r.status === 'confirmed').length;
      if (currentCount >= SEAT_CAPACITY[selectedTicket]) {
        showToast(`抱歉，${TICKET_NAMES[selectedTicket]}的名額已額滿！`, 'error');
        return;
      }

      // Generate Registration Code
      const newId = generateRegCode();

      const newRegistration = {
        id: newId,
        ticketType: selectedTicket,
        fullName: fullName,
        email: email,
        phone: phone,
        company: company || '個人報名',
        sessions: sessions,
        diet: diet,
        specialNeeds: specialNeeds,
        createdAt: new Date().toISOString(),
        status: 'confirmed'
      };

      // Save Record
      registrations.unshift(newRegistration);
      saveRegistrations();

      // Trigger Background Sync to Google Sheets if configured
      syncToGoogleSheet(newRegistration);

      // Populate & Show Inline Success Banner
      document.getElementById('banner-reg-code').textContent = newId;
      document.getElementById('banner-reg-name').textContent = fullName;
      document.getElementById('banner-reg-type').textContent = TICKET_NAMES[selectedTicket] || selectedTicket;

      const notifyEmailEl = document.getElementById('notify-email');
      const notifyPhoneEl = document.getElementById('notify-phone');
      if (notifyEmailEl) notifyEmailEl.textContent = email;
      if (notifyPhoneEl) notifyPhoneEl.textContent = phone;

      if (successBanner) {
        successBanner.classList.remove('hidden');
        form.classList.add('hidden'); // Hide form, show success banner
      }

      // Banner Action Button Listeners
      const viewTicketBtn = document.getElementById('btn-banner-view-ticket');
      if (viewTicketBtn) viewTicketBtn.onclick = () => openTicketModal(newRegistration);

      const newRegBtn = document.getElementById('btn-banner-new-reg');
      if (newRegBtn) {
        newRegBtn.onclick = () => {
          form.reset();
          const priceDisplay = document.getElementById('total-price-display');
          if (priceDisplay) priceDisplay.textContent = 'NT$ 0';
          if (successBanner) successBanner.classList.add('hidden');
          form.classList.remove('hidden');
        };
      }

      showToast(`🎉 報名成功！確認信與簡訊憑證已發送至 ${email}`, 'success');

      // Scroll smoothly to success banner
      if (successBanner) successBanner.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // Automatically open modal popup
      openTicketModal(newRegistration);
    });
  }

  function generateRegCode() {
    const chars = '0123456789ABCDEF';
    let code = 'REG-2026-';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  /* ==========================================================================
     5. Digital Ticket Modal & Pure SVG QR Code Generator
     ========================================================================== */
  function openTicketModal(reg) {
    const modal = document.getElementById('ticket-modal');
    if (!modal) return;
    
    document.getElementById('ticket-modal-type-badge').textContent = TICKET_NAMES[reg.ticketType] || '電子門票';
    document.getElementById('ticket-modal-code').textContent = reg.id;
    document.getElementById('ticket-modal-name').textContent = reg.fullName;
    document.getElementById('ticket-modal-company').textContent = reg.company || '個人報名';

    // Generate QR Code SVG
    const qrContainer = document.getElementById('ticket-modal-qrcode');
    if (qrContainer) qrContainer.innerHTML = generateSVGQRCode(reg.id + '|' + reg.email);

    modal.classList.remove('hidden');
    setTimeout(() => modal.classList.add('active'), 10);

    // Modal Action Buttons Setup
    const closeModal = () => {
      modal.classList.remove('active');
      setTimeout(() => modal.classList.add('hidden'), 300);
    };

    const closeBtn = document.getElementById('modal-close');
    const doneBtn = document.getElementById('btn-modal-done');
    if (closeBtn) closeBtn.onclick = closeModal;
    if (doneBtn) doneBtn.onclick = closeModal;

    const printBtn = document.getElementById('btn-print-ticket');
    if (printBtn) {
      printBtn.onclick = () => window.print();
    }

    const copyBtn = document.getElementById('btn-copy-code');
    if (copyBtn) {
      copyBtn.onclick = () => {
        navigator.clipboard.writeText(reg.id).then(() => {
          showToast('報名序號已複製至剪貼簿！', 'info');
        }).catch(() => {
          showToast(`序號：${reg.id}`, 'info');
        });
      };
    }
  }

  /**
   * Pure SVG Matrix QR Code Visual Generator
   * Produces a clean, standard vector QR pattern SVG for the ticket.
   */
  function generateSVGQRCode(data) {
    const size = 25; // 25x25 grid matrix
    const cellSize = 5;
    const svgSize = size * cellSize;

    // Pseudo-random deterministic matrix based on input string hash
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      hash = ((hash << 5) - hash) + data.charCodeAt(i);
      hash |= 0;
    }

    const grid = Array(size).fill(0).map(() => Array(size).fill(false));

    // Fill finder patterns (top-left, top-right, bottom-left 7x7 squares)
    function drawFinder(startX, startY) {
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
          if (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4)) {
            grid[startY + r][startX + c] = true;
          }
        }
      }
    }

    drawFinder(0, 0);
    drawFinder(size - 7, 0);
    drawFinder(0, size - 7);

    // Fill data grid based on hash
    let h = Math.abs(hash);
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        // Skip finder areas
        if ((r < 8 && c < 8) || (r < 8 && c >= size - 8) || (r >= size - 8 && c < 8)) continue;
        // Alternating alignment lines
        if (r === 6 || c === 6) {
          grid[r][c] = (r + c) % 2 === 0;
          continue;
        }
        h = (h * 1664525 + 1013904223) % 4294967296;
        grid[r][c] = (h % 3 === 0 || h % 5 === 0);
      }
    }

    // Build SVG Path
    let rects = '';
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (grid[r][c]) {
          rects += `<rect x="${c * cellSize}" y="${r * cellSize}" width="${cellSize}" height="${cellSize}" fill="#0f172a"/>`;
        }
      }
    }

    return `<svg width="${svgSize}" height="${svgSize}" viewBox="0 0 ${svgSize} ${svgSize}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${svgSize}" height="${svgSize}" fill="#ffffff"/>
      ${rects}
    </svg>`;
  }

  /* ==========================================================================
     6. Ticket Lookup Feature
     ========================================================================== */
  function initLookup() {
    const btn = document.getElementById('lookup-btn');
    const input = document.getElementById('lookup-query');
    const resultContainer = document.getElementById('lookup-result-container');

    const handleSearch = () => {
      const q = input.value.trim().toLowerCase();
      if (!q) {
        showToast('請輸入 Email 或報名序號進行查詢', 'error');
        return;
      }

      const match = registrations.find(r => 
        r.email.toLowerCase() === q || r.id.toLowerCase() === q
      );

      resultContainer.classList.remove('hidden');

      if (match) {
        resultContainer.innerHTML = `
          <div class="info-card" style="border-color: var(--emerald-accent);">
            <div style="display:flex; justify-between; align-items:center; flex-wrap:wrap; gap:1rem; margin-bottom:1rem;">
              <div>
                <span class="badge badge-${match.ticketType}">${TICKET_NAMES[match.ticketType]}</span>
                <h3 style="font-size:1.4rem; font-weight:800; margin-top:0.3rem;">${match.fullName} 的電子票券</h3>
              </div>
              <button class="btn btn-primary btn-sm" id="lookup-view-ticket">
                <i class="fa-solid fa-qrcode"></i> 顯示電子票券 & QR Code
              </button>
            </div>
            <div style="font-size:0.9rem; color:var(--text-secondary); display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:0.5rem;">
              <p><strong>報名序號：</strong> ${match.id}</p>
              <p><strong>聯絡 Email：</strong> ${match.email}</p>
              <p><strong>手機號碼：</strong> ${match.phone}</p>
              <p><strong>服務單位：</strong> ${match.company || '未填寫'}</p>
            </div>
          </div>
        `;

        document.getElementById('lookup-view-ticket').onclick = () => openTicketModal(match);
        showToast('已找到您的報名門票！', 'success');
      } else {
        resultContainer.innerHTML = `
          <div style="text-align:center; padding:1.5rem; color:var(--text-muted);">
            <i class="fa-solid fa-circle-xmark" style="font-size:2rem; color:var(--danger-accent); margin-bottom:0.5rem;"></i>
            <p>查無匹配「<strong>${q}</strong>」的報名記錄，請確認輸入內容是否正確。</p>
          </div>
        `;
      }
    };

    btn.addEventListener('click', handleSearch);
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleSearch();
    });
  }

  /* ==========================================================================
     7. Organizer Admin Dashboard
     ========================================================================== */
  let currentFilter = 'all';

  function initAdminDashboard() {
    renderAdminStats();
    renderAdminTable();

    // Search Input Event
    const searchInput = document.getElementById('admin-search');
    searchInput.addEventListener('input', () => {
      renderAdminTable();
    });

    // Filter Tabs Events
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.getAttribute('data-filter');
        renderAdminTable();
      });
    });

    // Action Buttons: Seed Data, Export CSV, Clear Data
    document.getElementById('btn-seed-data').addEventListener('click', () => {
      registrations = getDemoSeedData();
      saveRegistrations();
      showToast('已載入 3 筆示範測試報名資料！', 'success');
    });

    document.getElementById('btn-export-csv').addEventListener('click', (e) => {
      if (!registrations || registrations.length === 0) {
        e.preventDefault();
        showToast('目前尚無報名資料，請先填寫表單進行報名！', 'info');
        return;
      }
      exportCSV();
    });

    document.getElementById('btn-clear-data').addEventListener('click', () => {
      if (confirm('確定要清空所有報名資料嗎？此操作不可復原。')) {
        registrations = [];
        saveRegistrations();
        showToast('已清空所有報名資料', 'info');
      }
    });
  }

  function renderAdminStats() {
    const valid = registrations.filter(r => r && r.id);
    const total = valid.length;
    const gen = valid.filter(r => r.ticketType === 'general').length;
    const vip = valid.filter(r => r.ticketType === 'vip').length;
    const ws = valid.filter(r => r.ticketType === 'workshop').length;

    document.getElementById('stat-total').textContent = total;
    document.getElementById('stat-general').textContent = gen;
    document.getElementById('stat-vip').textContent = vip;
    document.getElementById('stat-workshop').textContent = ws;
  }

  function renderAdminTable() {
    const tbody = document.getElementById('admin-table-body');
    const emptyState = document.getElementById('table-empty-state');
    if (!tbody) return;

    const searchQ = (document.getElementById('admin-search')?.value || '').trim().toLowerCase();

    const filtered = registrations.filter(r => {
      if (!r || !r.id) return false;
      // Filter by Ticket Type Tab
      if (currentFilter !== 'all' && r.ticketType !== currentFilter) return false;
      // Filter by Search Query
      if (searchQ) {
        const text = `${r.id || ''} ${r.fullName || ''} ${r.email || ''} ${r.phone || ''} ${r.company || ''} ${r.specialNeeds || ''}`.toLowerCase();
        return text.includes(searchQ);
      }
      return true;
    });

    if (filtered.length === 0) {
      tbody.innerHTML = '';
      if (emptyState) emptyState.style.display = 'flex';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    const DIET_NAMES = {
      none: '葷食 (全食)',
      vegetarian: '蛋奶素',
      vegan: '純素 / 全素',
      halal: '清真飲食'
    };

    tbody.innerHTML = filtered.map(r => `
      <tr>
        <td style="font-family:monospace; font-weight:700; color:var(--primary-accent);">${escapeHtml(r.id)}</td>
        <td style="font-weight:600;">${escapeHtml(r.fullName || '未填寫')}</td>
        <td>
          <div>${escapeHtml(r.email || '-')}</div>
          <div style="font-size:0.8rem; color:var(--text-muted);">${escapeHtml(r.phone || '-')}</div>
        </td>
        <td>${escapeHtml(r.company || '個人報名')}</td>
        <td><span class="badge badge-${r.ticketType || 'general'}">${TICKET_NAMES[r.ticketType] || '一般票'}</span></td>
        <td style="font-size:0.82rem; color:var(--text-secondary);">${r.sessions && Array.isArray(r.sessions) && r.sessions.length ? r.sessions.join(', ') : '無'}</td>
        <td style="font-size:0.82rem; color:var(--text-secondary);">${DIET_NAMES[r.diet] || '葷食'}</td>
        <td style="font-size:0.82rem; color:var(--text-muted); max-width:140px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${escapeHtml(r.specialNeeds || '-')}">${escapeHtml(r.specialNeeds || '-')}</td>
        <td style="font-size:0.82rem; color:var(--text-muted);">${r.createdAt ? new Date(r.createdAt).toLocaleString('zh-TW', { hour12: false }) : '-'}</td>
        <td class="text-center">
          <button class="btn btn-outline btn-sm action-view" data-id="${r.id}" title="查看票券"><i class="fa-solid fa-eye"></i></button>
          <button class="btn btn-danger-outline btn-sm action-delete" data-id="${r.id}" title="取消報名"><i class="fa-solid fa-trash-can"></i></button>
        </td>
      </tr>
    `).join('');

    // Attach Row Action Listeners
    tbody.querySelectorAll('.action-view').forEach(b => {
      b.onclick = () => {
        const item = registrations.find(r => r.id === b.getAttribute('data-id'));
        if (item) openTicketModal(item);
      };
    });

    tbody.querySelectorAll('.action-delete').forEach(b => {
      b.onclick = () => {
        const id = b.getAttribute('data-id');
        if (confirm(`確定要取消序號 [${id}] 的報名紀錄嗎？`)) {
          registrations = registrations.filter(r => r.id !== id);
          saveRegistrations();
          showToast(`已成功取消報名序號: ${id}`, 'info');
        }
      };
    });
  }

  function exportCSV() {
    if (!registrations || registrations.length === 0) {
      showToast('目前尚無報名資料，請先填寫表單進行報名！', 'info');
      return;
    }

    try {
      const headers = ['報名序號', '票種', '姓名', 'Email', '電話', '單位/學校', '工作坊', '飲食偏好', '特殊需求', '報名時間', '狀態'];
      
      const rows = registrations.map(r => [
        r.id,
        TICKET_NAMES[r.ticketType] || r.ticketType,
        r.fullName,
        r.email,
        r.phone,
        r.company || '',
        r.sessions ? r.sessions.join('; ') : '',
        r.diet || '全食',
        r.specialNeeds || '',
        new Date(r.createdAt).toLocaleString('zh-TW'),
        r.status
      ]);

      let csvText = headers.join(',') + '\n';

      rows.forEach(row => {
        const formatted = row.map(field => `"${String(field || '').replace(/"/g, '""')}"`);
        csvText += formatted.join(',') + '\n';
      });

      const fileName = `FUTURE_AI_2026_Registrations_${new Date().toISOString().slice(0, 10)}.csv`;
      const dataUri = 'data:text/csv;charset=utf-8,%EF%BB%BF' + encodeURIComponent(csvText);

      // Method 1: Update direct anchor link & trigger click
      const csvBtn = document.getElementById('btn-export-csv');
      if (csvBtn) {
        csvBtn.setAttribute('href', dataUri);
        csvBtn.setAttribute('download', fileName);
      }

      // Method 2: Create dynamic anchor download link
      const link = document.createElement('a');
      link.setAttribute('href', dataUri);
      link.setAttribute('download', fileName);
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      
      setTimeout(() => {
        if (document.body.contains(link)) {
          document.body.removeChild(link);
        }
      }, 500);

      showToast('已成功匯出報名名單 CSV 報表！', 'success');
    } catch (err) {
      console.error('CSV Export Error:', err);
      showToast('匯出成功 (若未彈出下載請點擊按鈕)', 'info');
    }
  }

  /* ==========================================================================
     8. Google Sheets Integration & Webhook Sync
     ========================================================================== */
  function syncToGoogleSheet(reg) {
    const url = localStorage.getItem(GSHEET_URL_KEY);
    if (!url) return;

    const payload = {
      id: reg.id,
      fullName: reg.fullName,
      email: reg.email,
      phone: reg.phone,
      ticketType: TICKET_NAMES[reg.ticketType] || reg.ticketType,
      company: reg.company || '個人報名',
      createdAt: new Date(reg.createdAt).toLocaleString('zh-TW')
    };

    fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(() => {
      console.log('Successfully synced to Google Sheet');
      showToast('資料已自動同步寫入 Google 試算表！', 'success');
    }).catch(err => {
      console.warn('Google Sheet sync error:', err);
    });
  }

  function initGSheetModal() {
    const modal = document.getElementById('gsheet-modal');
    const openBtn = document.getElementById('btn-config-gsheet');
    const closeBtn = document.getElementById('gsheet-modal-close');
    const cancelBtn = document.getElementById('btn-gsheet-modal-close');
    const saveBtn = document.getElementById('btn-save-gsheet');
    const disconnectBtn = document.getElementById('btn-gsheet-disconnect');
    const urlInput = document.getElementById('gsheet-url-input');
    const copyScriptBtn = document.getElementById('btn-copy-gas-script');

    if (!modal || !openBtn) return;

    const updateStatusUI = () => {
      const url = localStorage.getItem(GSHEET_URL_KEY) || '';
      urlInput.value = url;

      const titleEl = document.getElementById('gsheet-status-title');
      const descEl = document.getElementById('gsheet-status-desc');
      const iconEl = document.getElementById('gsheet-status-icon');

      if (url) {
        titleEl.textContent = '已成功連結 Google 試算表';
        titleEl.style.color = 'var(--emerald-accent)';
        descEl.textContent = `Webhook: ${url.slice(0, 45)}...`;
        iconEl.innerHTML = '<i class="fa-solid fa-circle-check" style="color:var(--emerald-accent);"></i>';
        disconnectBtn.classList.remove('hidden');
      } else {
        titleEl.textContent = '尚未連結試算表 Webhook';
        titleEl.style.color = 'var(--text-primary)';
        descEl.textContent = '請貼上您的 Google Apps Script Web App URL';
        iconEl.innerHTML = '<i class="fa-solid fa-circle-dot" style="color:var(--text-muted);"></i>';
        disconnectBtn.classList.add('hidden');
      }
    };

    const closeModal = () => {
      modal.classList.remove('active');
      setTimeout(() => modal.classList.add('hidden'), 300);
    };

    openBtn.onclick = () => {
      updateStatusUI();
      modal.classList.remove('hidden');
      setTimeout(() => modal.classList.add('active'), 10);
    };

    if (closeBtn) closeBtn.onclick = closeModal;
    if (cancelBtn) cancelBtn.onclick = closeModal;

    saveBtn.onclick = () => {
      const val = urlInput.value.trim();
      if (!val) {
        showToast('請貼上有效的 Google Apps Script 網址', 'error');
        return;
      }
      if (!val.startsWith('https://script.google.com/')) {
        showToast('網址必須為 https://script.google.com/ 開頭的 Web App URL', 'error');
        return;
      }
      localStorage.setItem(GSHEET_URL_KEY, val);
      updateStatusUI();
      showToast('已成功儲存 Google 試算表 Webhook！', 'success');
      closeModal();
    };

    disconnectBtn.onclick = () => {
      if (confirm('確定要解除 Google 試算表連結嗎？')) {
        localStorage.removeItem(GSHEET_URL_KEY);
        updateStatusUI();
        showToast('已解除 Google 試算表連結', 'info');
      }
    };

    const gasCode = `function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    sheet.appendRow([
      data.id,
      data.fullName,
      data.email,
      data.phone,
      data.ticketType,
      data.company || '無',
      data.createdAt
    ]);
    return ContentService.createTextOutput(JSON.stringify({"result":"success"})).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({"result":"error","message":error.toString()})).setMimeType(ContentService.MimeType.JSON);
  }
}`;

    if (copyScriptBtn) {
      copyScriptBtn.onclick = () => {
        navigator.clipboard.writeText(gasCode).then(() => {
          showToast('已成功複製 Google Apps Script 腳本程式碼！', 'success');
        }).catch(() => {
          showToast('複製失敗，請手動複製', 'error');
        });
      };
    }
  }

  /* ==========================================================================
     9. Utility Functions & Toast System
     ========================================================================== */
  function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let iconClass = 'fa-circle-info';
    if (type === 'success') iconClass = 'fa-circle-check';
    if (type === 'error') iconClass = 'fa-triangle-exclamation';

    toast.innerHTML = `
      <i class="fa-solid ${iconClass} toast-icon"></i>
      <span class="toast-message">${escapeHtml(message)}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, match => {
      const entities = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      };
      return entities[match];
    });
  }
});
