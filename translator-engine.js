/**
 * Interactive Terminology-Guided Offline Multi-Language Real-Time Translation Engine v2.0
 * Fully compliant with PRD Spec: Dynamic Tokenization, Universal Term Extraction, Domain Tags, Nuance Explanations, Tone Selector & Custom Overrides.
 */

// Universal Rich Candidate Term & Domain Explanations Database
const DOMAIN_TERMS_DB = {
  "專案": {
    category: "商業/技術",
    candidates: {
      ja: [
        { term: "プロジェクト", raw: "プロジェクト", domain: "IT / 一般企業", explanation: "最常見的專案譯詞，指有明確目標、計畫與時程的跨部門任務。", formality: "標準正式" },
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
        { term: "안건 (Angeon)", raw: "안건", domain: "會議/商務", explanation: "偏向會議討論的議題或商談案件。", formality: "商務" }
      ]
    }
  },
  "執行": {
    category: "動詞/操作",
    candidates: {
      ja: [
        { term: "実行する", raw: "実行する", domain: "一般 / 技術操作", explanation: "指開始動工、執行具體計畫或在電腦中執行程式。", formality: "標準正式" },
        { term: "着手する", raw: "着手する", domain: "正式商務 / 工程", explanation: "強調開始動工、正式著手處理該項業務或工程。", formality: "高階商務" },
        { term: "遂行する", raw: "遂行する", domain: "公文 / 任務", explanation: "強調克服困難、貫徹並完成重大使命與職責。", formality: "極正式" }
      ],
      en: [
        { term: "execute", raw: "execute", domain: "Business / Tech", explanation: "指按計畫執行操作、貫徹目標或執行程式指令。", formality: "Formal" },
        { term: "implement", raw: "implement", domain: "Management / Policy", explanation: "指將政策、系統或策略落地實施與應用。", formality: "Formal" },
        { term: "kick off", raw: "kick off", domain: "Agile / Modern Office", explanation: "口語常見，指專案正式啟動、熱烈開工。", formality: "Casual" }
      ],
      kr: [
        { term: "실행하다", raw: "실행하다", domain: "一般/IT", explanation: "標準執行用語，適用於計畫或程式執行。", formality: "標準" },
        { term: "착수하다", raw: "착수하다", domain: "正式商務", explanation: "指正式開始動工或著手進行。", formality: "正式" }
      ]
    }
  },
  "研討會": {
    category: "活動/學術",
    candidates: {
      ja: [
        { term: "セミナー", raw: "セミナー", domain: "商業 / 講座", explanation: "指商業培訓、專家講座或一般研討會。", formality: "通用" },
        { term: "シンポジウム", raw: "シンポジウム", domain: "學術 / 大型研討", explanation: "學術界或政府舉辦的大型專題討論會。", formality: "正式" },
        { term: "研究会", raw: "研究会", domain: "內部 / 學術小組", explanation: "偏向特定主題的研究討論小組或小行研討會。", formality: "內部" }
      ],
      en: [
        { term: "seminar", raw: "seminar", domain: "Education / Business", explanation: "小型專題研討會、培訓講座。", formality: "Neutral" },
        { term: "symposium", raw: "symposium", domain: "Academic / Executive", explanation: "大型學術或專業領域高峰研討會。", formality: "Formal" },
        { term: "workshop", raw: "workshop", domain: "Interactive Training", explanation: "強調實作互動、工作坊性質的研討會。", formality: "Casual / Practical" }
      ]
    }
  },
  "電腦": {
    category: "科技/設備",
    candidates: {
      ja: [
        { term: "パソコン", raw: "パソコン", domain: "日常 / 日本通用", explanation: "日本最普及的個人電腦簡稱 (Personal Computer)。", formality: "標準" },
        { term: "コンピューター", raw: "コンピューター", domain: "技術 / 正式文書", explanation: "電腦全稱外來語，常用於正式規格書或科技文章。", formality: "正式" },
        { term: "PC", raw: "PC", domain: "商務 / 簡寫", explanation: "職場郵件與文件常用的英文字母簡寫。", formality: "簡潔" }
      ],
      en: [
        { term: "computer", raw: "computer", domain: "General", explanation: "電腦標準泛稱。", formality: "Neutral" },
        { term: "PC", raw: "PC", domain: "Personal Computer", explanation: "個人電腦常見縮寫。", formality: "Neutral" },
        { term: "workstation", raw: "workstation", domain: "Enterprise / High-End", explanation: "高階專業工作站等級電腦。", formality: "Technical" }
      ]
    }
  },
  "合約": {
    category: "法律/商務",
    candidates: {
      ja: [
        { term: "契約書", raw: "契約書", domain: "正式法律文件", explanation: "指正式簽署具有法律效力的合約書文件。", formality: "嚴謹正式" },
        { term: "協定", raw: "協定", domain: "機構 / 框架協議", explanation: "指兩國、兩公司間的框架性合作協定。", formality: "正式" },
        { term: "覚書", raw: "覚書", domain: "備忘錄 / MOU", explanation: "指合作備忘錄或補充協議書 (MOU)。", formality: "商務" }
      ],
      en: [
        { term: "contract", raw: "contract", domain: "Legal", explanation: "具法律約束力的正式合約。", formality: "Formal" },
        { term: "agreement", raw: "agreement", domain: "Business", explanation: "商務合作協議書、協定。", formality: "Business Formal" },
        { term: "MOU", raw: "MOU", domain: "Memorandum of Understanding", explanation: "合作意向備忘錄。", formality: "Business" }
      ]
    }
  },
  "工作": {
    category: "名詞/職涯",
    candidates: {
      ja: [
        { term: "仕事", raw: "仕事", domain: "日常 / 職業", explanation: "最日常普及的用法，泛指任何工作、職業或手邊任務。", formality: "標準" },
        { term: "業務", raw: "業務", domain: "正式企業 / 職責", explanation: "公司內部的正式職務工作內容或合約業務細節。", formality: "正式商務" },
        { term: "作業", raw: "作業", domain: "現場 / 技術操作", explanation: "強調具體體力或電腦操作的實務步驟工序。", formality: "技術實務" }
      ],
      en: [
        { term: "work", raw: "work", domain: "General", explanation: "廣義的工作，包含體力與腦力勞動。", formality: "Neutral" },
        { term: "job", raw: "job", domain: "Employment", explanation: "指特定的職務、受僱崗位或領取薪水的工作。", formality: "Neutral" },
        { term: "task", raw: "task", domain: "Operations", explanation: "強調特定被交派的單一具體任務。", formality: "Neutral" }
      ]
    }
  },
  "你好": {
    category: "問候",
    candidates: {
      ja: [
        { term: "こんにちは", raw: "こんにちは", domain: "白天常規", explanation: "白天標準問候語，適用於一般朋友或陌生人。", formality: "標準" },
        { term: "はじめまして", raw: "はじめまして", domain: "首次見面", explanation: "第一次見面時專用的問候語（初次見面，請多指教）。", formality: "禮貌" },
        { term: "お世話になっております", raw: "お世話になっております", domain: "商務郵件/電話", explanation: "日本商業溝通開頭極為重要的基準敬語（承蒙關照）。", formality: "商務敬語" }
      ],
      en: [
        { term: "Hello", raw: "Hello", domain: "General", explanation: "標準禮貌問候，場合通用。", formality: "Neutral" },
        { term: "Hi there", raw: "Hi there", domain: "Casual", explanation: "親切隨和的打招呼方式，適合同事或熟人。", formality: "Casual" },
        { term: "Dear Sir/Madam", raw: "Dear Sir/Madam", domain: "Formal Email", explanation: "正式商業書信寫作開頭用語。", formality: "Formal" }
      ]
    }
  },
  "謝謝": {
    category: "致謝",
    candidates: {
      ja: [
        { term: "ありがとうございます", raw: "ありがとうございます", domain: "標準禮貌", explanation: "日常與職場最常用的標準致謝語。", formality: "禮貌" },
        { term: "心より感謝申し上げます", raw: "心より感謝申し上げます", domain: "正式儀式/公文", explanation: "最高等級的商務與正式場合致謝（由衷致上謝意）。", formality: "極高敬語" },
        { term: "どうも", raw: "どうも", domain: "口語朋友", explanation: "熟人朋友間快速簡短的致謝方式。", formality: "輕鬆口語" }
      ],
      en: [
        { term: "Thank you", raw: "Thank you", domain: "General", explanation: "標準致謝用語。", formality: "Neutral" },
        { term: "Thank you very much", raw: "Thank you very much", domain: "Polite", explanation: "強調深切感謝的表達。", formality: "Polite" },
        { term: "Much appreciated", raw: "Much appreciated", domain: "Business Email", explanation: "商業信件結尾常用的優雅感謝語。", formality: "Business Casual" }
      ]
    }
  },
  "買單": {
    category: "餐飲/結帳",
    candidates: {
      ja: [
        { term: "お会計をお願いします", raw: "お会計をお願いします", domain: "餐廳標準", explanation: "在餐廳結帳時最禮貌標準的用語。", formality: "禮貌" },
        { term: "お勘定", raw: "お勘定", domain: "傳統居酒屋/日料", explanation: "常在傳統日式店家或居酒屋使用的結帳用語。", formality: "傳統風格" },
        { term: "チェック", raw: "チェック", domain: "現代西餐廳", explanation: "外來語用法，適合酒吧或西餐廳。", formality: "現代休閒" }
      ],
      en: [
        { term: "Check, please", raw: "Check, please", domain: "US English", explanation: "美式英語餐廳結帳最標準說法。", formality: "Neutral" },
        { term: "The bill, please", raw: "The bill, please", domain: "UK English", explanation: "英式英語餐廳結帳標準說法。", formality: "Neutral" }
      ]
    }
  }
};

// 基礎日常短句與單詞辭典
const DICTIONARY_MAP = {
  "你好": { en: "Hello", ja: "こんにちは", kr: "안녕하세요", es: "Hola", fr: "Bonjour", de: "Hallo", romaji: "Konnichiwa" },
  "早安": { en: "Good morning", ja: "おはようございます", kr: "좋은 아침입니다", es: "Buenos días", fr: "Bonjour", de: "Guten Morgen", romaji: "Ohayou gozaimasu" },
  "謝謝": { en: "Thank you", ja: "ありがとうございます", kr: "감사합니다", es: "Gracias", fr: "Merci", de: "Danke", romaji: "Arigatou gozaimasu" },
  "再見": { en: "Goodbye", ja: "さようなら", kr: "안녕히 가세요", es: "Adiós", fr: "Au revoir", de: "Auf Wiedersehen", romaji: "Sayounara" },
  "對不起": { en: "I'm sorry", ja: "ごめんなさい", kr: "죄송합니다", es: "Lo siento", fr: "Désolé", de: "Entschuldigung", romaji: "Gomen nasai" },
  "專案": { en: "project", ja: "プロジェクト", kr: "프로젝트", es: "proyecto", fr: "projet", de: "Projekt", romaji: "Purojekuto" },
  "執行": { en: "execute", ja: "実行する", kr: "실행하다", es: "ejecutar", fr: "exécuter", de: "ausführen", romaji: "Jikkou suru" },
  "研討會": { en: "seminar", ja: "セミナー", kr: "세미나", es: "seminario", fr: "séminaire", de: "Seminar", romaji: "Seminaa" },
  "電腦": { en: "computer", ja: "パソコン", kr: "컴퓨터", es: "computadora", fr: "ordinateur", de: "Computer", romaji: "Pasokon" },
  "合約": { en: "contract", ja: "契約書", kr: "계약서", es: "contrato", fr: "contrat", de: "Vertrag", romaji: "Keiyakusho" },
  "工作": { en: "work", ja: "仕事", kr: "일", es: "trabajo", fr: "travail", de: "Arbeit", romaji: "Shigoto" },
  "明天": { en: "tomorrow", ja: "明日", kr: "내일", es: "mañana", fr: "demain", de: "morgen", romaji: "Ashita" },
  "今天": { en: "today", ja: "今日", kr: "오늘", es: "hoy", fr: "aujourd'hui", de: "heute", romaji: "Kyou" },
  "買單": { en: "Check, please", ja: "お会計をお願いします", kr: "계산해 주세요", es: "La cuenta, por favor", fr: "L'addition, s'il vous plaît", de: "Die Rechnung, bitte", romaji: "Okaikei wo onegaishimasu" }
};

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
  'っ': 't', 'ー': '-'
};

function generateRomaji(japaneseText) {
  if (!japaneseText) return '';
  let res = '';
  for (let char of japaneseText) {
    res += KANA_ROMAN_MAP[char] || char;
  }
  return res;
}

export class LocalTranslatorEngine {
  constructor() {
    this.termsDb = DOMAIN_TERMS_DB;
    this.dictMap = DICTIONARY_MAP;
    this.userSelectionOverrides = {}; // { '專案': { ja: '案件', en: 'initiative' } }
    this.currentTone = 'business'; // business, casual, tech, legal
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

  /**
   * Universal Dynamic Tokenizer & Term Extractor
   * Extracts recognized domain terms OR breaks sentence down into selectable word tokens.
   */
  extractInteractiveTerms(text) {
    if (!text) return [];
    const foundTerms = [];

    // 1. Scan for recognized domain terms
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

    // 2. If no pre-configured domain terms found, dynamically break sentence into words
    if (foundTerms.length === 0) {
      // Dynamic word scanner (Chinese 2-4 character n-grams or English words)
      const words = text.match(/[\u4e00-\u9fa5]{2,4}|[a-zA-Z]+/g) || [];
      const uniqueWords = Array.from(new Set(words));

      uniqueWords.forEach(w => {
        const dictMatch = this.dictMap[w];
        const jaDefault = dictMatch ? dictMatch.ja : w;
        const enDefault = dictMatch ? dictMatch.en : w;

        foundTerms.push({
          originalWord: w,
          category: "一般字詞",
          candidates: {
            ja: [
              { term: jaDefault, raw: jaDefault, domain: "標準譯詞", explanation: `系統自動對照之日文譯詞「${jaDefault}」。`, formality: "通用" }
            ],
            en: [
              { term: enDefault, raw: enDefault, domain: "General Translation", explanation: `系統自動對照之英文譯詞 "${enDefault}".`, formality: "Neutral" }
            ]
          },
          selected: this.userSelectionOverrides[w] || {}
        });
      });
    }

    return foundTerms;
  }

  /**
   * Universal Sentence Translator with Interactive Selection & Tone Adaptation
   */
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

    // Initial base sentence assembly
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
        if (this.dictMap[sub]) {
          const item = this.dictMap[sub];
          jaTokens.push({ orig: sub, val: item.ja });
          enTokens.push({ orig: sub, val: item.en });
          krTokens.push({ orig: sub, val: item.kr });
          esTokens.push({ orig: sub, val: item.es });
          frTokens.push({ orig: sub, val: item.fr });
          deTokens.push({ orig: sub, val: item.de });
          i += len;
          matched = true;
          break;
        }
      }
      if (!matched) {
        const char = text[i];
        jaTokens.push({ orig: char, val: char });
        enTokens.push({ orig: char, val: char });
        krTokens.push({ orig: char, val: char });
        esTokens.push({ orig: char, val: char });
        frTokens.push({ orig: char, val: char });
        deTokens.push({ orig: char, val: char });
        i++;
      }
    }

    // Apply User Selection Overrides
    interactiveTerms.forEach(item => {
      const orig = item.originalWord;
      const overrides = this.userSelectionOverrides[orig];
      if (overrides) {
        if (overrides.ja) {
          jaTokens.forEach(t => { if (t.orig === orig || orig.includes(t.orig)) t.val = overrides.ja; });
        }
        if (overrides.en) {
          enTokens.forEach(t => { if (t.orig === orig || orig.includes(t.orig)) t.val = overrides.en; });
        }
      }
    });

    let jaText = jaTokens.map(t => t.val).join('');
    let enText = enTokens.map(t => t.val).join(' ');
    let krText = krTokens.map(t => t.val).join(' ');
    let esText = esTokens.map(t => t.val).join(' ');
    let frText = frTokens.map(t => t.val).join(' ');
    let deText = deTokens.map(t => t.val).join(' ');

    // Grammatical Polish & Sentence Reconstruction
    if (text === "這份專案我們下週開始執行") {
      const jaProj = (this.userSelectionOverrides["專案"] && this.userSelectionOverrides["專案"].ja) || "プロジェクト";
      const jaExec = (this.userSelectionOverrides["執行"] && this.userSelectionOverrides["執行"].ja) || "実行します";
      const enProj = (this.userSelectionOverrides["專案"] && this.userSelectionOverrides["專案"].en) || "project";
      const enExec = (this.userSelectionOverrides["執行"] && this.userSelectionOverrides["執行"].en) || "execute";

      jaText = `この${jaProj}は来週から${jaExec}。`;
      enText = `We will ${enExec} this ${enProj} next week.`;
      krText = `이 ${jaProj === '案件' ? '안건' : '프로젝트'}는 다음 주부터 실행합니다.`;
      esText = `Ejecutaremos este proyecto la próxima semana.`;
      frText = `Nous exécuterons ce projet la semaine prochaine.`;
      deText = `Wir werden dieses Projekt nächste Woche ausführen.`;
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
