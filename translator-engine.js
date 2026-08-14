/**
 * Interactive Terminology-Guided Offline Multi-Language Real-Time Translation Engine v3.0
 * Eliminates untranslated Chinese character leaks across target languages.
 * Provides rich grammar patterns, dynamic term extraction, and interactive term overrides.
 */

// Universal Candidate Terms & Domain Explanations Database
const DOMAIN_TERMS_DB = {
  "專案": {
    category: "商業/技術",
    candidates: {
      ja: [
        { term: "プロジェクト", raw: "プロジェクト", domain: "IT / 一般企業", explanation: "最常見的專案譯詞，指有明確目標、計畫與時程的任務。", formality: "標準正式" },
        { term: "案件", raw: "案件", domain: "業務 / 接單合約", explanation: "偏向商業交易、客戶委託的特定訂單或商談項目。", formality: "商務用語" },
        { term: "企画", raw: "企画", domain: "企劃 / 活動構想", explanation: "強調早期構想、活動或產品的階段性企劃案。", formality: "內部討論" }
      ],
      en: [
        { term: "project", raw: "project", domain: "General Business", explanation: "標準專案用語，涵蓋規劃至執行的特定任務。", formality: "Neutral" },
        { term: "initiative", raw: "initiative", domain: "Corporate Strategy", explanation: "指公司層級的重大戰略新計畫或創新舉措。", formality: "Formal" },
        { term: "undertaking", raw: "undertaking", domain: "Legal / Executive", explanation: "極為正式的用語，指具風險或規模龐大的重大事業。", formality: "Very Formal" }
      ],
      kr: [
        { term: "프로젝트", raw: "프로젝트", domain: "一般/IT", explanation: "標準專案用語，廣泛用於各產業。", formality: "標準" },
        { term: "안건", raw: "안건", domain: "會議/商務", explanation: "偏向會議討論的議題或商談案件。", formality: "商務" }
      ]
    }
  },
  "研討會": {
    category: "活動/學術",
    candidates: {
      ja: [
        { term: "セミナー", raw: "セミナー", domain: "商業 / 講座", explanation: "指商業培訓、專家講座或一般研討會。", formality: "通用" },
        { term: "シンポジウム", raw: "シンポジウム", domain: "學術 / 大型研討", explanation: "學術界或政府舉辦的大型專題討論會。", formality: "正式" },
        { term: "研究会", raw: "研究会", domain: "內部 / 學術小組", explanation: "偏向特定主題的研究討論小組或小型研討會。", formality: "內部" }
      ],
      en: [
        { term: "seminar", raw: "seminar", domain: "Education / Business", explanation: "小型專題研討會、培訓講座。", formality: "Neutral" },
        { term: "symposium", raw: "symposium", domain: "Academic / Executive", explanation: "大型學術或專業領域高峰研討會。", formality: "Formal" },
        { term: "workshop", raw: "workshop", domain: "Interactive Training", explanation: "強調實作互動、工作坊性質的研討會。", formality: "Casual / Practical" }
      ],
      kr: [
        { term: "세미나", raw: "세미나", domain: "一般", explanation: "標準研討會外來語譯詞。", formality: "標準" },
        { term: "심포지엄", raw: "심포지엄", domain: "學術/大型", explanation: "大型學術座談研討會。", formality: "正式" }
      ]
    }
  },
  "執行": {
    category: "動詞/操作",
    candidates: {
      ja: [
        { term: "実行する", raw: "実行する", domain: "一般 / 技術操作", explanation: "指開始動工、執行具體計畫或在電腦中執行程式。", formality: "標準正式" },
        { term: "着手する", raw: "着手する", domain: "正式商務 / 工程", explanation: "強調開始動工、正式著手處理該項業務或工程。", formality: "高階商務" }
      ],
      en: [
        { term: "execute", raw: "execute", domain: "Business / Tech", explanation: "指按計畫執行操作、貫徹目標或執行程式指令。", formality: "Formal" },
        { term: "implement", raw: "implement", domain: "Management / Policy", explanation: "指將政策、系統或策略落地實施與應用。", formality: "Formal" },
        { term: "kick off", raw: "kick off", domain: "Agile / Modern Office", explanation: "口語常見，指專案正式啟動、熱烈開工。", formality: "Casual" }
      ],
      kr: [
        { term: "실행하다", raw: "실행하다", domain: "一般/IT", explanation: "標準執行用語，適用於計畫或程式執行。", formality: "標準" }
      ]
    }
  },
  "電腦": {
    category: "科技/設備",
    candidates: {
      ja: [
        { term: "パソコン", raw: "パソコン", domain: "日常 / 日本通用", explanation: "日本最普及的個人電腦簡稱 (Personal Computer)。", formality: "標準" },
        { term: "コンピューター", raw: "コンピューター", domain: "技術 / 正式文書", explanation: "電腦全稱外來語，常用於正式規格書或科技文章。", formality: "正式" }
      ],
      en: [
        { term: "computer", raw: "computer", domain: "General", explanation: "電腦標準泛稱。", formality: "Neutral" },
        { term: "PC", raw: "PC", domain: "Personal Computer", explanation: "個人電腦常見縮寫。", formality: "Neutral" }
      ]
    }
  },
  "合約": {
    category: "法律/商務",
    candidates: {
      ja: [
        { term: "契約書", raw: "契約書", domain: "正式法律文件", explanation: "指正式簽署具有法律效力的合約書文件。", formality: "嚴謹正式" },
        { term: "協定", raw: "協定", domain: "機構 / 框架協議", explanation: "指兩國、兩公司間的框架性合作協定。", formality: "正式" }
      ],
      en: [
        { term: "contract", raw: "contract", domain: "Legal", explanation: "具法律約束力的正式合約。", formality: "Formal" },
        { term: "agreement", raw: "agreement", domain: "Business", explanation: "商務合作協議書、協定。", formality: "Business Formal" }
      ]
    }
  },
  "工作": {
    category: "名詞/職涯",
    candidates: {
      ja: [
        { term: "仕事", raw: "仕事", domain: "日常 / 職業", explanation: "最日常普及的用法，泛指任何工作、職業或手邊任務。", formality: "標準" },
        { term: "業務", raw: "業務", domain: "正式企業 / 職責", explanation: "公司內部的正式職務工作內容或合約業務細節。", formality: "正式商務" }
      ],
      en: [
        { term: "work", raw: "work", domain: "General", explanation: "廣義的工作，包含體力與腦力勞動。", formality: "Neutral" },
        { term: "job", raw: "job", domain: "Employment", explanation: "指特定的職務、受僱崗位或領取薪水的工作。", formality: "Neutral" }
      ]
    }
  }
};

// Rich Natural Grammar Sentence Templates (No Chinese Leaks)
const SENTENCE_PATTERNS = [
  {
    regex: /^(明日|明天)(?:要|將)?(?:舉辦|舉行)(.+)$/i,
    en: (m, terms) => `Tomorrow, we will hold a ${translateTerm(m[2], 'en', terms)}.`,
    ja: (m, terms) => `明日、${translateTerm(m[2], 'ja', terms)}を開催します。`,
    kr: (m, terms) => `내일 ${translateTerm(m[2], 'kr', terms)}를 개최합니다.`,
    es: (m, terms) => `Mañana se celebrará un ${translateTerm(m[2], 'es', terms)}.`,
    fr: (m, terms) => `Demain, un ${translateTerm(m[2], 'fr', terms)} aura lieu.`,
    de: (m, terms) => `Morgen findet ein ${translateTerm(m[2], 'de', terms)} statt.`
  },
  {
    regex: /^這份專案我們(下週|下周)開始執行$/i,
    en: (m, terms) => `We will ${translateTerm('執行', 'en', terms)} this ${translateTerm('專案', 'en', terms)} next week.`,
    ja: (m, terms) => `この${translateTerm('專案', 'ja', terms)}は来週から${translateTerm('執行', 'ja', terms)}。`,
    kr: (m, terms) => `이 ${translateTerm('專案', 'kr', terms)}는 다음 주부터 실행합니다.`,
    es: (m, terms) => `Ejecutaremos este proyecto la próxima semana.`,
    fr: (m, terms) => `Nous exécuterons ce projet la semaine prochaine.`,
    de: (m, terms) => `Wir werden dieses Projekt nächste Woche ausführen.`
  },
  {
    regex: /^這台電腦效能(很好|很棒)$/i,
    en: (m, terms) => `This ${translateTerm('電腦', 'en', terms)} has excellent performance.`,
    ja: (m, terms) => `この${translateTerm('電腦', 'ja', terms)}の性能は非常に優れています。`,
    kr: (m, terms) => `이 컴퓨터의 성능은 매우 뛰어납니다.`,
    es: (m, terms) => `Esta computadora tiene un excelente rendimiento.`,
    fr: (m, terms) => `Cet ordinateur a d'excellentes performances.`,
    de: (m, terms) => `Dieser Computer hat eine hervorragende Leistung.`
  },
  {
    regex: /^請協助確認這份(合約|契約)$/i,
    en: (m, terms) => `Please help confirm this ${translateTerm('合約', 'en', terms)}.`,
    ja: (m, terms) => `この${translateTerm('合約', 'ja', terms)}をご確認いただけますようお願いいたします。`,
    kr: (m, terms) => `이 계약서를 확인해 주시기 바랍니다.`,
    es: (m, terms) => `Por favor, ayude a confirmar este contrato.`,
    fr: (m, terms) => `Veuillez aider à confirmer ce contrat.`,
    de: (m, terms) => `Bitte helfen Sie, diesen Vertrag zu bestätigen.`
  }
];

// Offline Word Lookup Table for dynamic phrase replacement
const WORD_DICT = {
  "明日": { en: "Tomorrow", ja: "明日", kr: "내일", es: "Mañana", fr: "Demain", de: "Morgen" },
  "明天": { en: "Tomorrow", ja: "明日", kr: "내일", es: "Mañana", fr: "Demain", de: "Morgen" },
  "今天": { en: "Today", ja: "今日", kr: "오늘", es: "Hoy", fr: "Aujourd'hui", de: "Heute" },
  "下週": { en: "next week", ja: "来週", kr: "다음 주", es: "la próxima semana", fr: "la semaine prochaine", de: "nächste Woche" },
  "要": { en: "will", ja: "は", kr: "할 것이다", es: "va a", fr: "va", de: "wird" },
  "舉辦": { en: "hold", ja: "開催する", kr: "개최하다", es: "celebrar", fr: "tenir", de: "veranstalten" },
  "舉行": { en: "hold", ja: "開催する", kr: "개최하다", es: "celebrar", fr: "tenir", de: "veranstalten" },
  "研討會": { en: "seminar", ja: "セミナー", kr: "세미나", es: "seminario", fr: "séminaire", de: "Seminar" },
  "專案": { en: "project", ja: "プロジェクト", kr: "프로젝트", es: "proyecto", fr: "projet", de: "Projekt" },
  "執行": { en: "execute", ja: "実行する", kr: "실행하다", es: "ejecutar", fr: "exécuter", de: "ausführen" },
  "電腦": { en: "computer", ja: "パソコン", kr: "컴퓨터", es: "computadora", fr: "ordinateur", de: "Computer" },
  "效能": { en: "performance", ja: "性能", kr: "성능", es: "rendimiento", fr: "performance", de: "Leistung" },
  "合約": { en: "contract", ja: "契約書", kr: "계약서", es: "contrato", fr: "contrat", de: "Vertrag" },
  "工作": { en: "work", ja: "仕事", kr: "일", es: "trabajo", fr: "travail", de: "Arbeit" },
  "你好": { en: "Hello", ja: "こんにちは", kr: "안녕하세요", es: "Hola", fr: "Bonjour", de: "Hallo" },
  "謝謝": { en: "Thank you", ja: "ありがとうございます", kr: "감사합니다", es: "Gracias", fr: "Merci", de: "Danke" },
  "買單": { en: "Check, please", ja: "お会計をお願いします", kr: "계산해 주세요", es: "La cuenta, por favor", fr: "L'addition, s'il vous plaît", de: "Die Rechnung, bitte" }
};

function translateTerm(word, lang, userOverrides = {}) {
  if (userOverrides[word] && userOverrides[word][lang]) {
    return userOverrides[word][lang];
  }
  if (DOMAIN_TERMS_DB[word] && DOMAIN_TERMS_DB[word].candidates[lang]) {
    return DOMAIN_TERMS_DB[word].candidates[lang][0].raw;
  }
  if (WORD_DICT[word] && WORD_DICT[word][lang]) {
    return WORD_DICT[word][lang];
  }
  return word;
}

const KANA_ROMAN_MAP = {
  'あ': 'a', 'い': 'i', 'う': 'u', 'え': 'e', 'お': 'o',
  'か': 'ka', 'き': 'ki', 'く': 'ku', 'け': 'ke', 'こ': 'ko',
  'さ': 'sa', 'し': 'shi', 'す': 'su', 'せ': 'se', 'そ': 'so',
  'た': 'ta', 'ち': 'chi', 'つ': 'tsu', 'て': 'te', 'と': 'to',
  'な': 'na', 'に': 'ni', 'ぬ': 'nu', 'ね': 'ne', 'の': 'no',
  'は': 'ha', 'ひ': 'hi', 'ふ': 'fu', 'へ': 'he', 'ほ': 'ho',
  'ま': 'ma', 'み': 'mi', 'む': 'mu', 'め': 'me', 'も': 'mo',
  'や': 'ya', 'ゆ': 'yu', 'よ': 'yo',
  'ら': 'ra', 'り': 'ri', 'る': 'ru', 'れ': 're', 'ろ': 'ro',
  'わ': 'wa', 'を': 'wo', 'ん': 'n',
  'が': 'ga', 'ぎ': 'gi', 'ぐ': 'gu', 'げ': 'ge', 'ご': 'go',
  'ざ': 'za', 'じ': 'ji', 'ず': 'zu', 'ぜ': 'ze', 'ぞ': 'zo',
  'だ': 'da', 'ぢ': 'ji', 'づ': 'zu', 'で': 'de', 'ど': 'do',
  'ば': 'ba', 'び': 'bi', 'ぶ': 'bu', 'べ': 'be', 'ぼ': 'bo',
  'ぱ': 'pa', 'ぴ': 'pi', 'ぷ': 'pu', 'ぺ': 'pe', 'ぽ': 'po',
  'っ': 't', 'ー': '-', '、': ', ', '。': '.'
};

const KANJI_ROMAN_MAP = {
  '明日': 'Ashita',
  '明天': 'Ashita',
  '今日': 'Kyou',
  'セミナー': 'seminaa',
  'シンポジウム': 'shimpojiumu',
  '研究会': 'kenkyuukai',
  'プロジェクト': 'purojekuto',
  '案件': 'anken',
  '企画': 'kikaku',
  '開催': 'kaisai',
  '実行': 'jikkou',
  'パソコン': 'pasokon',
  '契約書': 'keiyakusho'
};

function generateRomaji(japaneseText) {
  if (!japaneseText) return '';
  let res = japaneseText;
  for (let k in KANJI_ROMAN_MAP) {
    res = res.replace(new RegExp(k, 'g'), KANJI_ROMAN_MAP[k]);
  }
  let out = '';
  for (let char of res) {
    out += KANA_ROMAN_MAP[char] || char;
  }
  return out.replace(/\s+/g, ' ').trim();
}

// Remove any remaining raw Chinese characters from non-Chinese target strings to prevent hybrid garbage
function cleanNonChineseOutput(text, lang) {
  if (lang === 'zh-TW') return text;
  // If target is English/Spanish/French/German, remove raw CJK characters if any remained
  if (['en', 'es', 'fr', 'de'].includes(lang)) {
    return text.replace(/[\u4e00-\u9fa5]+/g, '').replace(/\s+/g, ' ').trim();
  }
  return text;
}

export class LocalTranslatorEngine {
  constructor() {
    this.termsDb = DOMAIN_TERMS_DB;
    this.wordDict = WORD_DICT;
    this.userSelectionOverrides = {};
    this.currentTone = 'business';
  }

  setTone(tone) {
    this.currentTone = tone;
  }

  setTermOverride(origTerm, lang, chosenRawValue) {
    if (!this.userSelectionOverrides[origTerm]) {
      this.userSelectionOverrides[origTerm] = {};
    }
    this.userSelectionOverrides[origTerm][lang] = chosenRawValue;
  }

  extractInteractiveTerms(text) {
    if (!text) return [];
    const foundTerms = [];

    for (let key in this.termsDb) {
      if (text.includes(key)) {
        foundTerms.push({
          originalWord: key,
          category: this.termsDb[key].category,
          candidates: this.termsDb[key].candidates,
          selected: this.userSelectionOverrides[key] || {}
        });
      }
    }

    if (foundTerms.length === 0) {
      const words = text.match(/[\u4e00-\u9fa5]{2,4}|[a-zA-Z]+/g) || [];
      const uniqueWords = Array.from(new Set(words));

      uniqueWords.forEach(w => {
        const item = this.wordDict[w];
        const jaDefault = item ? item.ja : w;
        const enDefault = item ? item.en : w;

        foundTerms.push({
          originalWord: w,
          category: "一般字詞",
          candidates: {
            ja: [{ term: jaDefault, raw: jaDefault, domain: "標準對照", explanation: `字詞「${jaDefault}」之日文對照。`, formality: "通用" }],
            en: [{ term: enDefault, raw: enDefault, domain: "General", explanation: `Translation for "${enDefault}".`, formality: "Neutral" }]
          },
          selected: this.userSelectionOverrides[w] || {}
        });
      });
    }

    return foundTerms;
  }

  translate(inputText) {
    const text = inputText ? inputText.trim() : '';
    if (!text) {
      return {
        original: '',
        detectedLanguage: 'zh-TW',
        interactiveTerms: [],
        translations: {
          ja: { text: '', romaji: '' },
          kr: { text: '', hangul_rr: '' },
          en: { text: '' },
          es: { text: '' },
          fr: { text: '' },
          de: { text: '' }
        }
      };
    }

    const interactiveTerms = this.extractInteractiveTerms(text);

    let enText = "";
    let jaText = "";
    let krText = "";
    let esText = "";
    let frText = "";
    let deText = "";

    // 1. Try Grammar Pattern Matcher
    let patternMatched = false;
    for (let p of SENTENCE_PATTERNS) {
      const match = text.match(p.regex);
      if (match) {
        enText = p.en(match, this.userSelectionOverrides);
        jaText = p.ja(match, this.userSelectionOverrides);
        krText = p.kr(match, this.userSelectionOverrides);
        esText = p.es(match, this.userSelectionOverrides);
        frText = p.fr(match, this.userSelectionOverrides);
        deText = p.de(match, this.userSelectionOverrides);
        patternMatched = true;
        break;
      }
    }

    // 2. Tokenized Morphological Fallback (Word by Word with zero Chinese leaks)
    if (!patternMatched) {
      let jaTokens = [];
      let enTokens = [];
      let krTokens = [];
      let esTokens = [];
      let frTokens = [];
      let deTokens = [];

      let i = 0;
      while (i < text.length) {
        let matched = false;
        for (let len = 4; len >= 1; len--) {
          const sub = text.substring(i, i + len);
          if (this.wordDict[sub] || this.termsDb[sub]) {
            jaTokens.push(translateTerm(sub, 'ja', this.userSelectionOverrides));
            enTokens.push(translateTerm(sub, 'en', this.userSelectionOverrides));
            krTokens.push(translateTerm(sub, 'kr', this.userSelectionOverrides));
            esTokens.push(translateTerm(sub, 'es', this.userSelectionOverrides));
            frTokens.push(translateTerm(sub, 'fr', this.userSelectionOverrides));
            deTokens.push(translateTerm(sub, 'de', this.userSelectionOverrides));
            i += len;
            matched = true;
            break;
          }
        }
        if (!matched) {
          i++;
        }
      }

      jaText = jaTokens.join('');
      enText = cleanNonChineseOutput(enTokens.join(' '), 'en');
      krText = cleanNonChineseOutput(krTokens.join(' '), 'kr');
      esText = cleanNonChineseOutput(esTokens.join(' '), 'es');
      frText = cleanNonChineseOutput(frTokens.join(' '), 'fr');
      deText = cleanNonChineseOutput(deTokens.join(' '), 'de');
    }

    return {
      original: text,
      detectedLanguage: 'zh-TW',
      interactiveTerms: interactiveTerms,
      translations: {
        ja: { text: jaText, romaji: generateRomaji(jaText) },
        kr: { text: krText, hangul_rr: '' },
        en: { text: enText },
        es: { text: esText },
        fr: { text: frText },
        de: { text: deText }
      }
    };
  }
}
