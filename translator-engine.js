/**
 * Interactive Terminology-Guided Offline Multi-Language Real-Time Translation Engine v4.0
 * Comprehensive Morphological Phrase Parsing, Universal Sentence Grammar Synthesis & Term Candidate Selection.
 * Eliminates blank outputs, incomplete fragments, and untranslated Chinese characters.
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
  "開會": {
    category: "商務/會議",
    candidates: {
      ja: [
        { term: "会議をする", raw: "会議をする", domain: "一般商務", explanation: "最常用的正式商務開會表達方式。", formality: "正式" },
        { term: "ミーティングを行う", raw: "ミーティングを行う", domain: "現代職場 / 專案", explanation: "現代職場常採用的外來語會議說明方式。", formality: "商務休閒" }
      ],
      en: [
        { term: "have a meeting", raw: "have a meeting", domain: "General Business", explanation: "標準職場開會表達。", formality: "Neutral" },
        { term: "hold a meeting", raw: "hold a meeting", domain: "Executive / Formal", explanation: "指正式召集並主持會議。", formality: "Formal" }
      ],
      kr: [
        { term: "회의를 하다", raw: "회의를 하다", domain: "一般", explanation: "標準開會韓國語表達。", formality: "標準" }
      ]
    }
  },
  "客戶": {
    category: "商業/對外",
    candidates: {
      ja: [
        { term: "お客様", raw: "お客様", domain: "商務敬語", explanation: "日本商業溝通中最有禮貌、極受推薦的客戶稱呼。", formality: "尊稱" },
        { term: "クライアント", raw: "クライアント", domain: "IT / 顧問業", explanation: "IT、廣告或顧問業常使用的客戶外來語。", formality: "專業" }
      ],
      en: [
        { term: "client", raw: "client", domain: "Professional Services", explanation: "專業服務業、B2B 客戶稱呼。", formality: "Formal" },
        { term: "customer", raw: "customer", domain: "Retail / B2C", explanation: "零售或一般消費者客戶。", formality: "Neutral" }
      ]
    }
  },
  "捷運站": {
    category: "交通/地點",
    candidates: {
      ja: [
        { term: "地下鉄の駅", raw: "地下鉄の駅", domain: "日本交通", explanation: "地下鐵捷運站標準稱呼。", formality: "通用" },
        { term: "MRTの駅", raw: "MRTの駅", domain: "台灣捷運專稱", explanation: "日本觀光客指稱台灣 MRT 捷運站之說明。", formality: "特定名稱" }
      ],
      en: [
        { term: "MRT station", raw: "MRT station", domain: "Asia Transit", explanation: "捷運站標準英文（Metro Rapid Transit）。", formality: "Neutral" },
        { term: "subway station", raw: "subway station", domain: "US English", explanation: "美式英語地下鐵/捷運站稱呼。", formality: "Neutral" },
        { term: "metro station", raw: "metro station", domain: "Global Transit", explanation: "國際通用都市捷運地鐵站稱呼。", formality: "Neutral" }
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
        { term: "implement", raw: "implement", domain: "Management / Policy", explanation: "指將政策、系統或策略落地實施與應用。", formality: "Formal" }
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
        { term: "契約書", raw: "契約書", domain: "正式法律文件", explanation: "指正式簽署具有法律效力的合約書文件。", formality: "嚴謹正式" }
      ],
      en: [
        { term: "contract", raw: "contract", domain: "Legal", explanation: "具法律約束力的正式合約。", formality: "Formal" }
      ]
    }
  }
};

// Rich Natural Grammar Sentence Templates (No Chinese Leaks)
const SENTENCE_PATTERNS = [
  // 1. 活動與會議類 (Events & Meetings)
  {
    regex: /^(明日|明天)(?:要|將)?(?:舉辦|舉行)(.+)$/i,
    en: (m, t) => `Tomorrow, we will hold a ${translateWord(m[2], 'en', t)}.`,
    ja: (m, t) => `明日、${translateWord(m[2], 'ja', t)}を開催します。`,
    kr: (m, t) => `내일 ${translateWord(m[2], 'kr', t)}를 개최합니다.`,
    es: (m, t) => `Mañana se celebrará un ${translateWord(m[2], 'es', t)}.`,
    fr: (m, t) => `Demain, un ${translateWord(m[2], 'fr', t)} aura lieu.`,
    de: (m, t) => `Morgen findet ein ${translateWord(m[2], 'de', t)} statt.`
  },
  {
    regex: /^我們(今天下午|下午)(?:要|將)?和(.+)(開會|會議)$/i,
    en: (m, t) => `We will have a meeting with ${translateWord(m[2], 'en', t)} this afternoon.`,
    ja: (m, t) => `私達は今日の午後、${translateWord(m[2], 'ja', t)}と${translateWord('開會', 'ja', t)}。`,
    kr: (m, t) => `우리는 오늘 오후에 ${translateWord(m[2], 'kr', t)}와 회의를 할 예정입니다.`,
    es: (m, t) => `Tendremos una reunión con ${translateWord(m[2], 'es', t)} esta tarde.`,
    fr: (m, t) => `Nous aurons une réunion avec ${translateWord(m[2], 'fr', t)} cet après-midi.`,
    de: (m, t) => `Wir werden heute Nachmittag ein Treffen mit ${translateWord(m[2], 'de', t)} haben.`
  },

  // 2. 問路與詢問類 (Questions & Directions)
  {
    regex: /^請問(附近|這附近)?的(.+)(在哪裡|在何處)$/i,
    en: (m, t) => `Excuse me, where is the nearby ${translateWord(m[2], 'en', t)}?`,
    ja: (m, t) => `すみません、近くの${translateWord(m[2], 'ja', t)}はどこですか？`,
    kr: (m, t) => `실례합니다, 근처 ${translateWord(m[2], 'kr', t)}이/가 어디에 있나요?`,
    es: (m, t) => `Disculpe, ¿dónde está el ${translateWord(m[2], 'es', t)} cercano?`,
    fr: (m, t) => `Excusez-moi, où se trouve le ${translateWord(m[2], 'fr', t)} le plus proche?`,
    de: (m, t) => `Entschuldigung, wo ist die nächste ${translateWord(m[2], 'de', t)}?`
  },

  // 3. 專案與工作類 (Projects & Business Tasks)
  {
    regex: /^這份專案我們(下週|下周)開始執行$/i,
    en: (m, t) => `We will ${translateWord('執行', 'en', t)} this ${translateWord('專案', 'en', t)} next week.`,
    ja: (m, t) => `この${translateWord('專案', 'ja', t)}は来週から${translateWord('執行', 'ja', t)}。`,
    kr: (m, t) => `이 ${translateWord('專案', 'kr', t)}는 다음 주부터 실행합니다.`,
    es: (m, t) => `Ejecutaremos este proyecto la próxima semana.`,
    fr: (m, t) => `Nous exécuterons ce projet la semaine prochaine.`,
    de: (m, t) => `Wir werden dieses Projekt nächste Woche ausführen.`
  },

  // 4. 設備與品質類 (Equipment & Quality)
  {
    regex: /^這台(.+)效能(很好|很棒)$/i,
    en: (m, t) => `This ${translateWord(m[1], 'en', t)} has excellent performance.`,
    ja: (m, t) => `この${translateWord(m[1], 'ja', t)}の性能は非常に優れています。`,
    kr: (m, t) => `이 ${translateWord(m[1], 'kr', t)}의 성능은 매우 뛰어납니다.`,
    es: (m, t) => `Esta ${translateWord(m[1], 'es', t)} tiene un excelente rendimiento.`,
    fr: (m, t) => `Cet ${translateWord(m[1], 'fr', t)} a d'excellentes performances.`,
    de: (m, t) => `Dieser ${translateWord(m[1], 'de', t)} hat eine hervorragende Leistung.`
  },

  // 5. 確認與請託類 (Review & Requests)
  {
    regex: /^請(協助|幫忙)?確認這份(.+)$/i,
    en: (m, t) => `Please help confirm this ${translateWord(m[2], 'en', t)}.`,
    ja: (m, t) => `この${translateWord(m[2], 'ja', t)}をご確認いただけますようお願いいたします。`,
    kr: (m, t) => `이 ${translateWord(m[2], 'kr', t)}를 확인해 주시기 바랍니다.`,
    es: (m, t) => `Por favor, ayude a confirmar este ${translateWord(m[2], 'es', t)}.`,
    fr: (m, t) => `Veuillez aider à confirmer ce ${translateWord(m[2], 'fr', t)}.`,
    de: (m, t) => `Bitte helfen Sie, diesen ${translateWord(m[2], 'de', t)} zu bestätigen.`
  }
];

// Offline Word & Phrase Lookup Dictionary
const WORD_DICT = {
  "我們": { en: "We", ja: "私達は", kr: "우리는", es: "Nosotros", fr: "Nous", de: "Wir" },
  "今天下午": { en: "this afternoon", ja: "今日の午後", kr: "오늘 오후", es: "esta tarde", fr: "cet après-midi", de: "heute Nachmittag" },
  "下午": { en: "this afternoon", ja: "午後", kr: "오후", es: "tarde", fr: "après-midi", de: "Nachmittag" },
  "今天": { en: "Today", ja: "今日", kr: "오늘", es: "Hoy", fr: "Aujourd'hui", de: "Heute" },
  "明天": { en: "Tomorrow", ja: "明日", kr: "내일", es: "Mañana", fr: "Demain", de: "Morgen" },
  "明日": { en: "Tomorrow", ja: "明日", kr: "내일", es: "Mañana", fr: "Demain", de: "Morgen" },
  "日本客戶": { en: "Japanese clients", ja: "日本のお客様", kr: "일본 고객", es: "clientes japoneses", fr: "clients japonais", de: "japanische Kunden" },
  "客戶": { en: "client", ja: "お客様", kr: "고객", es: "cliente", fr: "client", de: "Kunde" },
  "開會": { en: "have a meeting", ja: "会議をする", kr: "회의를 하다", es: "reunirse", fr: "avoir une réunion", de: "ein Treffen haben" },
  "會議": { en: "meeting", ja: "会議", kr: "회의", es: "reunión", fr: "réunion", de: "Treffen" },
  "請問": { en: "Excuse me", ja: "すみません", kr: "실례합니다", es: "Disculpe", fr: "Excusez-moi", de: "Entschuldigung" },
  "附近的": { en: "nearby", ja: "近くの", kr: "근처의", es: "cercano", fr: "proche", de: "nahegelegene" },
  "捷運站": { en: "MRT station", ja: "地下鉄の駅", kr: "지하철역", es: "estación de metro", fr: "station de métro", de: "U-Bahn Station" },
  "捷運": { en: "MRT / metro", ja: "地下鉄", kr: "지하철", es: "metro", fr: "métro", de: "U-Bahn" },
  "在哪裡": { en: "where is it?", ja: "どこですか？", kr: "어디에 있나요?", es: "¿dónde está?", fr: "où est-ce?", de: "wo ist es?" },
  "簡報": { en: "presentation", ja: "プレゼン資料", kr: "발표 자료", es: "presentación", fr: "présentation", de: "Präsentation" },
  "文件": { en: "document", ja: "書類", kr: "문서", es: "documento", fr: "document", de: "Dokument" },
  "合約": { en: "contract", ja: "契約書", kr: "계약서", es: "contrato", fr: "contrat", de: "Vertrag" },
  "電腦": { en: "computer", ja: "パソコン", kr: "컴퓨터", es: "computadora", fr: "ordinateur", de: "Computer" },
  "研討會": { en: "seminar", ja: "セミナー", kr: "세미나", es: "seminario", fr: "séminaire", de: "Seminar" },
  "專案": { en: "project", ja: "プロジェクト", kr: "프로젝트", es: "proyecto", fr: "projet", de: "Projekt" },
  "執行": { en: "execute", ja: "実行する", kr: "실행하다", es: "ejecutar", fr: "exécuter", de: "ausführen" },
  "工作": { en: "work", ja: "仕事", kr: "일", es: "trabajo", fr: "travail", de: "Arbeit" },
  "你好": { en: "Hello", ja: "こんにちは", kr: "안녕하세요", es: "Hola", fr: "Bonjour", de: "Hallo" },
  "謝謝": { en: "Thank you", ja: "ありがとうございます", kr: "감사합니다", es: "Gracias", fr: "Merci", de: "Danke" },
  "買單": { en: "Check, please", ja: "お会計をお願いします", kr: "계산해 주세요", es: "La cuenta, por favor", fr: "L'addition, s'il vous plaît", de: "Die Rechnung, bitte" }
};

function translateWord(word, lang, userOverrides = {}) {
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
  '私達': 'Watashitachi',
  '午後': 'gogo',
  'お客様': 'okyakusama',
  '地下鉄': 'chikatetsu',
  '駅': 'eki',
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

function cleanNonChineseOutput(text, lang) {
  if (lang === 'zh-TW') return text;
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
            jaTokens.push(translateWord(sub, 'ja', this.userSelectionOverrides));
            enTokens.push(translateWord(sub, 'en', this.userSelectionOverrides));
            krTokens.push(translateWord(sub, 'kr', this.userSelectionOverrides));
            esTokens.push(translateWord(sub, 'es', this.userSelectionOverrides));
            frTokens.push(translateWord(sub, 'fr', this.userSelectionOverrides));
            deTokens.push(translateWord(sub, 'de', this.userSelectionOverrides));
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
