import { LocalTranslatorEngine } from './translator-engine.js';
import { SpeechService } from './speech-service.js';

class TranslatorApp {
  constructor() {
    this.engine = new LocalTranslatorEngine();
    this.speech = new SpeechService();
    this.history = JSON.parse(localStorage.getItem('translator_history') || '[]');
    this.debounceTimer = null;
    this.currentView = 'grid'; // grid, split, list

    this.initDOMElements();
    this.bindEvents();
    this.renderSampleChips();
    this.renderHistory();

    // Default initial sentence with interactive terms
    this.inputElement.value = "這份專案我們下週開始執行";
    this.handleTranslate();
  }

  initDOMElements() {
    this.inputElement = document.getElementById('source-input');
    this.cardsContainer = document.getElementById('cards-container');
    this.micBtn = document.getElementById('mic-btn');
    this.clearBtn = document.getElementById('clear-btn');
    this.themeBtn = document.getElementById('theme-btn');
    this.historyBtn = document.getElementById('history-btn');
    this.drawer = document.getElementById('history-drawer');
    this.closeDrawerBtn = document.getElementById('close-drawer');
    this.historyList = document.getElementById('history-list');
    this.copyAllBtn = document.getElementById('copy-all-btn');
    this.layoutBtns = document.querySelectorAll('.layout-btn');
    this.sampleChipsContainer = document.getElementById('sample-chips');
    this.interactiveSection = document.getElementById('interactive-terms-section');
    this.interactiveContainer = document.getElementById('interactive-terms-container');
  }

  bindEvents() {
    // Real-time input debounced translation (50ms)
    this.inputElement.addEventListener('input', () => {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this.handleTranslate();
      }, 50);
    });

    // Clear input
    this.clearBtn.addEventListener('click', () => {
      this.inputElement.value = '';
      this.handleTranslate();
      this.inputElement.focus();
    });

    // Speech Microphone Input
    this.micBtn.addEventListener('click', () => {
      if (this.speech.isListening) {
        this.speech.stopListening();
        this.micBtn.classList.remove('btn-primary');
        this.micBtn.innerHTML = '🎤 語音輸入';
      } else {
        this.micBtn.classList.add('btn-primary');
        this.micBtn.innerHTML = '🔴 正在聆聽...';
        this.speech.startListening(
          (text) => {
            this.inputElement.value = text;
            this.handleTranslate();
          },
          (err) => {
            alert('語音輸入提醒: ' + err);
            this.micBtn.classList.remove('btn-primary');
            this.micBtn.innerHTML = '🎤 語音輸入';
          },
          () => {
            this.micBtn.classList.remove('btn-primary');
            this.micBtn.innerHTML = '🎤 語音輸入';
          }
        );
      }
    });

    // Theme Switcher
    this.themeBtn.addEventListener('click', () => {
      const isLight = document.body.getAttribute('data-theme') === 'light';
      document.body.setAttribute('data-theme', isLight ? 'dark' : 'light');
      this.themeBtn.innerText = isLight ? '🌙 深色模式' : '☀️ 淺色模式';
    });

    // History Drawer Toggle
    this.historyBtn.addEventListener('click', () => {
      this.drawer.classList.add('open');
    });

    this.closeDrawerBtn.addEventListener('click', () => {
      this.drawer.classList.remove('open');
    });

    // Copy All Translations
    this.copyAllBtn.addEventListener('click', () => {
      const text = this.inputElement.value;
      if (!text) return;
      const res = this.engine.translate(text);
      const allText = `【原文字詞】: ${text}\n` +
        `🇯🇵 日文: ${res.translations.ja.text} (${res.translations.ja.romaji})\n` +
        `🇰🇷 韓文: ${res.translations.kr.text}\n` +
        `🇺🇸 英文: ${res.translations.en.text}\n` +
        `🇪🇸 西文: ${res.translations.es.text}\n` +
        `🇫🇷 法文: ${res.translations.fr.text}\n` +
        `🇩🇪 德文: ${res.translations.de.text}`;

      navigator.clipboard.writeText(allText).then(() => {
        this.showToast('已複製所有多國語言翻譯對照結果！');
      });
    });

    // Layout Toggle (Grid, Split, List)
    this.layoutBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.layoutBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const view = btn.dataset.view;
        this.currentView = view;
        this.cardsContainer.className = `translation-grid ${view}-view`;
      });
    });
  }

  handleTranslate() {
    const text = this.inputElement.value.trim();
    const result = this.engine.translate(text);

    this.renderInteractiveTerms(result.interactiveTerms);
    this.renderCards(result);

    if (text.length > 0) {
      this.saveHistory(text, result);
    }
  }

  renderInteractiveTerms(terms) {
    if (!terms || terms.length === 0) {
      this.interactiveSection.style.display = 'none';
      return;
    }

    this.interactiveSection.style.display = 'block';
    this.interactiveContainer.innerHTML = terms.map(item => {
      const orig = item.originalWord;
      const jaCandidates = item.candidates.ja || [];
      const enCandidates = item.candidates.en || [];
      const selectedJa = item.selected.ja || (jaCandidates[0] ? jaCandidates[0].term : '');
      const selectedEn = item.selected.en || (enCandidates[0] ? enCandidates[0].term : '');

      return `
        <div class="interactive-term-card" style="background: rgba(15, 23, 42, 0.6); border: 1px solid var(--card-border); border-radius: var(--radius-md); padding: 0.75rem 1rem; width: 100%;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <div style="font-weight: 700; font-size: 1rem; color: #818cf8; display: flex; align-items: center; gap: 0.5rem;">
              <span>📌 關鍵詞彙：<strong style="color: #f8fafc; font-size: 1.1rem;">${orig}</strong></span>
              <span class="brand-badge">${item.category}</span>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 0.75rem;">
            <!-- Japanese Candidates Choice -->
            <div style="background: rgba(236, 72, 153, 0.08); border: 1px solid rgba(236, 72, 153, 0.2); border-radius: var(--radius-sm); padding: 0.6rem;">
              <div style="font-size: 0.8rem; color: var(--accent-ja); font-weight: 600; margin-bottom: 0.4rem;">🇯🇵 日文譯詞與近義詞解說：</div>
              ${jaCandidates.map(c => `
                <div class="candidate-option ${selectedJa === c.term ? 'selected' : ''}" 
                     data-orig="${orig}" data-lang="ja" data-term="${this.escapeHTML(c.term)}"
                     style="padding: 0.4rem 0.6rem; border-radius: 6px; margin-bottom: 0.3rem; cursor: pointer; background: ${selectedJa === c.term ? 'rgba(236, 72, 153, 0.25)' : 'rgba(255,255,255,0.03)'}; border: 1px solid ${selectedJa === c.term ? 'var(--accent-ja)' : 'transparent'}; transition: all 0.2s;">
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-weight: 600; font-size: 0.9rem; color: #f8fafc;">${c.term}</span>
                    <span style="font-size: 0.7rem; background: rgba(255,255,255,0.1); padding: 0.1rem 0.4rem; border-radius: 10px; color: #f472b6;">${c.domain}</span>
                  </div>
                  <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.2rem;">💡 ${c.explanation}</div>
                </div>
              `).join('')}
            </div>

            <!-- English Candidates Choice -->
            <div style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: var(--radius-sm); padding: 0.6rem;">
              <div style="font-size: 0.8rem; color: var(--accent-en); font-weight: 600; margin-bottom: 0.4rem;">🇺🇸 英文譯詞與近義詞解說：</div>
              ${enCandidates.map(c => `
                <div class="candidate-option ${selectedEn === c.term ? 'selected' : ''}" 
                     data-orig="${orig}" data-lang="en" data-term="${this.escapeHTML(c.term)}"
                     style="padding: 0.4rem 0.6rem; border-radius: 6px; margin-bottom: 0.3rem; cursor: pointer; background: ${selectedEn === c.term ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255,255,255,0.03)'}; border: 1px solid ${selectedEn === c.term ? 'var(--accent-en)' : 'transparent'}; transition: all 0.2s;">
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-weight: 600; font-size: 0.9rem; color: #f8fafc;">${c.term}</span>
                    <span style="font-size: 0.7rem; background: rgba(255,255,255,0.1); padding: 0.1rem 0.4rem; border-radius: 10px; color: #34d399;">${c.domain}</span>
                  </div>
                  <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.2rem;">💡 ${c.explanation}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Attach click events for selecting term options
    this.interactiveContainer.querySelectorAll('.candidate-option').forEach(opt => {
      opt.addEventListener('click', () => {
        const orig = opt.dataset.orig;
        const lang = opt.dataset.lang;
        const term = opt.dataset.term;
        this.engine.setTermOverride(orig, lang, term);
        this.handleTranslate();
        this.showToast(`已套用「${orig}」在 ${lang === 'ja' ? '日文' : '英文'} 的選詞：${term}`);
      });
    });
  }

  renderCards(res) {
    const languages = [
      { id: 'ja', name: '日文 (Japanese)', flag: '🇯🇵', accentClass: 'card-ja', langCode: 'ja-JP', data: res.translations.ja, guide: res.translations.ja?.romaji ? `Romaji: ${res.translations.ja.romaji}` : '' },
      { id: 'kr', name: '韓文 (Korean)', flag: '🇰🇷', accentClass: 'card-kr', langCode: 'ko-KR', data: res.translations.kr, guide: res.translations.kr?.hangul_rr ? `Romanization: ${res.translations.kr.hangul_rr}` : '' },
      { id: 'en', name: '英文 (English)', flag: '🇺🇸', accentClass: 'card-en', langCode: 'en-US', data: res.translations.en },
      { id: 'es', name: '西班牙文 (Spanish)', flag: '🇪🇸', accentClass: 'card-es', langCode: 'es-ES', data: res.translations.es },
      { id: 'fr', name: '法文 (French)', flag: '🇫🇷', accentClass: 'card-fr', langCode: 'fr-FR', data: res.translations.fr },
      { id: 'de', name: '德文 (German)', flag: '🇩🇪', accentClass: 'card-de', langCode: 'de-DE', data: res.translations.de }
    ];

    this.cardsContainer.innerHTML = languages.map(lang => {
      const translatedText = lang.data ? lang.data.text : '';
      return `
        <div class="lang-card ${lang.accentClass}">
          <div class="card-header">
            <div class="lang-info">
              <span class="flag">${lang.flag}</span>
              <span class="lang-name">${lang.name}</span>
            </div>
            <div class="card-actions">
              <button class="action-btn tts-btn" data-text="${this.escapeHTML(translatedText)}" data-lang="${lang.langCode}" title="發音朗讀">
                🔊
              </button>
              <button class="action-btn copy-btn" data-text="${this.escapeHTML(translatedText)}" title="複製文字">
                📋
              </button>
            </div>
          </div>
          <div class="card-body">
            <div class="translated-text">${translatedText || '<span style="color: var(--text-muted); font-size: 0.95rem;">請輸入文字...</span>'}</div>
            ${lang.guide ? `<div class="phonetic-guide">${lang.guide}</div>` : ''}
          </div>
          <div class="card-footer">
            <span>本地即時對照</span>
            <span>${translatedText.length} 字元</span>
          </div>
        </div>
      `;
    }).join('');

    // Attach card event listeners
    this.cardsContainer.querySelectorAll('.tts-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const text = btn.dataset.text;
        const langCode = btn.dataset.lang;
        this.speech.speak(text, langCode);
      });
    });

    this.cardsContainer.querySelectorAll('.copy-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const text = btn.dataset.text;
        if (!text) return;
        navigator.clipboard.writeText(text).then(() => {
          this.showToast('已複製卡片翻譯內容！');
        });
      });
    });
  }

  renderSampleChips() {
    const samples = ["這份專案我們下週開始執行", "你好", "謝謝", "工作", "買單", "我喜歡程式設計與語言學習"];
    this.sampleChipsContainer.innerHTML = samples.map(s => `<div class="chip" data-phrase="${s}">${s}</div>`).join('');

    this.sampleChipsContainer.querySelectorAll('.chip').forEach(chip => {
      chip.addEventListener('click', () => {
        this.inputElement.value = chip.dataset.phrase;
        this.handleTranslate();
      });
    });
  }

  saveHistory(text, result) {
    if (this.history.length > 0 && this.history[0].text === text) return;
    this.history.unshift({
      text,
      ja: result.translations.ja.text,
      en: result.translations.en.text,
      timestamp: new Date().toLocaleTimeString()
    });
    if (this.history.length > 30) this.history.pop();
    localStorage.setItem('translator_history', JSON.stringify(this.history));
    this.renderHistory();
  }

  renderHistory() {
    if (this.history.length === 0) {
      this.historyList.innerHTML = '<div style="color: var(--text-muted); font-size: 0.9rem; text-align: center; margin-top: 2rem;">尚無翻譯紀錄</div>';
      return;
    }

    this.historyList.innerHTML = this.history.map(item => `
      <div class="history-item" data-text="${this.escapeHTML(item.text)}">
        <div class="orig">${this.escapeHTML(item.text)}</div>
        <div class="trans">🇯🇵 ${this.escapeHTML(item.ja)} | 🇺🇸 ${this.escapeHTML(item.en)}</div>
      </div>
    `).join('');

    this.historyList.querySelectorAll('.history-item').forEach(item => {
      item.addEventListener('click', () => {
        this.inputElement.value = item.dataset.text;
        this.handleTranslate();
        this.drawer.classList.remove('open');
      });
    });
  }

  showToast(msg) {
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      bottom: 30px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(99, 102, 241, 0.95);
      color: white;
      padding: 0.6rem 1.2rem;
      border-radius: 20px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.3);
      z-index: 999;
      font-size: 0.9rem;
      backdrop-filter: blur(8px);
    `;
    toast.innerText = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2200);
  }

  escapeHTML(str) {
    return (str || '').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  window.app = new TranslatorApp();
});
