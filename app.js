import { LocalTranslatorEngine } from './translator-engine.js';
import { SpeechService } from './speech-service.js';

class TranslatorApp {
  constructor() {
    this.engine = new LocalTranslatorEngine();
    this.speech = new SpeechService();
    this.history = JSON.parse(localStorage.getItem('translator_history') || '[]');
    this.favorites = JSON.parse(localStorage.getItem('translator_favorites') || '[]');
    this.debounceTimer = null;
    this.currentView = 'grid'; // grid, split, list

    this.initDOMElements();
    this.bindEvents();
    this.renderSampleChips();
    this.renderHistory();

    // Default initial translation
    this.inputElement.value = "你好，很高興認識你";
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

    this.renderCards(result);

    if (text.length > 0) {
      this.saveHistory(text, result);
    }
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
            <span>本地即時翻譯</span>
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
    const samples = ["你好", "謝謝", "請問多少錢", "這個很好吃", "人工智慧", "很高興認識你", "加油"];
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
      background: rgba(16, 185, 129, 0.9);
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
    setTimeout(() => toast.remove(), 2000);
  }

  escapeHTML(str) {
    return (str || '').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  window.app = new TranslatorApp();
});
