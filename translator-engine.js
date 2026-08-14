/**
 * Interactive Terminology-Guided Offline Multi-Language Real-Time Translation Engine
 * 支援專有名詞與多義詞拆解、近義詞領域說明 (Domain Tags & Nuance Explanations) 與使用者主動選詞替換。
 */

// 豐富的專有名詞與多義詞選詞資料庫 (Candidate Term Dictionary with Context & Domain Explanations)
const INTERACTIVE_TERMS_DB = {
  "專案": {
    category: "商業/技術",
    candidates: {
      ja: [
        { term: "プロジェクト (Project)", domain: "IT / 一般企業", explanation: "最常見的專案譯詞，指有明確目標、計畫與時程的跨部門任務。", formality: "標準正式", isDefault: true },
        { term: "案件 (Anken)", domain: "業務 / 接單合約", explanation: "偏向商業交易、客戶委託的特定訂單或商談項目。", formality: "商務用語" },
        { term: "企画 (Kikaku)", domain: "企劃 / 活動構想", explanation: "強調早期構想、活動或產品的階段性企劃案。", formality: "內部討論" }
      ],
      en: [
        { term: "project", domain: "General Business", explanation: "標準專案用語，涵蓋規劃至執行的特定任務。", formality: "Neutral", isDefault: true },
        { term: "initiative", domain: "Corporate Strategy", explanation: "指公司層級的重大戰略新計畫或創新舉措。", formality: "Formal" },
        { term: "undertaking", domain: "Legal / Executive", explanation: "極為正式的用語，指具風險或規模龐大的重大事業。", formality: "Very Formal" }
      ],
      kr: [
        { term: "프로젝트 (Project)", domain: "一般/IT", explanation: "標準專案用語，廣泛用於各產業。", formality: "標準", isDefault: true },
        { term: "안건 (Angeon)", domain: "會議/商務", explanation: "偏向會議討論的議題或商談案件。", formality: "商務" }
      ]
    }
  },
  "執行": {
    category: "動詞/操作",
    candidates: {
      ja: [
        { term: "実行する (Jikkou suru)", domain: "一般 / 技術操作", explanation: "指開始動工、執行具體計畫或在電腦中執行程式。", formality: "標準正式", isDefault: true },
        { term: "着手する (Chakushu suru)", domain: "正式商務 / 工程", explanation: "強調開始動工、正式著手處理該項業務或工程。", formality: "高階商務" },
        { term: "遂行する (Suikou suru)", domain: "公文 / 任務", explanation: "強調克服困難、貫徹並完成重大使命與職責。", formality: "極正式" }
      ],
      en: [
        { term: "execute", domain: "Business / Tech", explanation: "指按計畫執行操作、貫徹目標或執行程式指令。", formality: "Formal", isDefault: true },
        { term: "implement", domain: "Management / Policy", explanation: "指將政策、系統或策略落地實施與應用。", formality: "Formal" },
        { term: "kick off", domain: "Agile / Modern Office", explanation: "口語常見，指專案正式啟動、熱烈開工。", formality: "Casual" }
      ],
      kr: [
        { term: "실행하다 (Silhaenghada)", domain: "一般/IT", explanation: "標準執行用語，適用於計畫或程式執行。", formality: "標準", isDefault: true },
        { term: "착수하다 (Chaksuhada)", domain: "正式商務", explanation: "指正式開始動工或著手進行。", formality: "正式" }
      ]
    }
  },
  "工作": {
    category: "名詞/職涯",
    candidates: {
      ja: [
        { term: "仕事 (Shigoto)", domain: "日常 / 職業", explanation: "最日常普及的用法，泛指任何工作、職業或手邊任務。", formality: "標準", isDefault: true },
        { term: "業務 (Gyoumu)", domain: "正式企業 / 職責", explanation: "公司內部的正式職務工作內容或合約業務細節。", formality: "正式商務" },
        { term: "作業 (Sagyou)", domain: "現場 / 技術操作", explanation: "強調具體體力或電腦操作的實務步驟工序。", formality: "技術實務" }
      ],
      en: [
        { term: "work", domain: "General", explanation: "廣義的工作，包含體力與腦力勞動。", formality: "Neutral", isDefault: true },
        { term: "job", domain: "Employment", explanation: "指特定的職務、受僱崗位或領取薪水的工作。", formality: "Neutral" },
        { term: "task", domain: "Operations", explanation: "強調特定被交派的單一具體任務。", formality: "Neutral" }
      ]
    }
  },
  "你好": {
    category: "問候",
    candidates: {
      ja: [
        { term: "こんにちは (Konnichiwa)", domain: "白天常規", explanation: "白天標準問候語，適用於一般朋友或陌生人。", formality: "標準", isDefault: true },
        { term: "はじめまして (Hajimemashite)", domain: "首次見面", explanation: "第一次見面時專用的問候語（初次見面，請多指教）。", formality: "禮貌" },
        { term: "お世話になっております (Osewa ni natte orimasu)", domain: "商務郵件/電話", explanation: "日本商業溝通開頭極為重要的基準敬語（承蒙關照）。", formality: "商務敬語" }
      ],
      en: [
        { term: "Hello", domain: "General", explanation: "標準禮貌問候，場合通用。", formality: "Neutral", isDefault: true },
        { term: "Hi there", domain: "Casual", explanation: "親切隨和的打招呼方式，適合同事或熟人。", formality: "Casual" },
        { term: "Dear Sir/Madam", domain: "Formal Email", explanation: "正式商業書信寫作開頭用語。", formality: "Formal" }
      ]
    }
  },
  "謝謝": {
    category: "致謝",
    candidates: {
      ja: [
        { term: "ありがとうございます (Arigatou gozaimasu)", domain: "標準禮貌", explanation: "日常與職場最常用的標準致謝語。", formality: "禮貌", isDefault: true },
        { term: "心より感謝申し上げます (Kokoro yori kansha mōshia gemasu)", domain: "正式儀式/公文", explanation: "最高等級的商務與正式場合致謝（由衷致上謝意）。", formality: "極高敬語" },
        { term: "どうも (Doumo)", domain: "口語朋友", explanation: "熟人朋友間快速簡短的致謝方式。", formality: "輕鬆口語" }
      ],
      en: [
        { term: "Thank you", domain: "General", explanation: "標準致謝用語。", formality: "Neutral", isDefault: true },
        { term: "Thank you very much", domain: "Polite", explanation: "強調深切感謝的表達。", formality: "Polite" },
        { term: "Much appreciated", domain: "Business Email", explanation: "商業信件結尾常用的優雅感謝語。", formality: "Business Casual" }
      ]
    }
  },
  "買單": {
    category: "餐飲/結帳",
    candidates: {
      ja: [
        { term: "お会計をお願いします (Okaikei wo onegaishimasu)", domain: "餐廳標準", explanation: "在餐廳結帳時最禮貌標準的用語。", formality: "禮貌", isDefault: true },
        { term: "お勘定 (Okanjou)", domain: "傳統居酒屋/日料", explanation: "常在傳統日式店家或居酒屋使用的結帳用語。", formality: "傳統風格" },
        { term: "チェック (Check)", domain: "現代西餐廳", explanation: "外來語用法，適合酒吧或西餐廳。", formality: "現代休閒" }
      ],
      en: [
        { term: "Check, please", domain: "US English", explanation: "美式英語餐廳結帳最標準說法。", formality: "Neutral", isDefault: true },
        { term: "The bill, please", domain: "UK English", explanation: "英式英語餐廳結帳標準說法。", formality: "Neutral" }
      ]
    }
  }
};

// 全局離線翻譯對照字典 (Full Translation Base)
const BASE_DICTIONARY = {
  "你好": { en: "Hello", ja: "こんにちは", kr: "안녕하세요", es: "Hola", fr: "Bonjour", de: "Hallo", romaji: "Konnichiwa", hangul_rr: "Annyeonghaseyo" },
  "早安": { en: "Good morning", ja: "おはようございます", kr: "좋은 아침입니다", es: "Buenos días", fr: "Bonjour", de: "Guten Morgen", romaji: "Ohayou gozaimasu", hangul_rr: "Joeun achim-imnida" },
  "謝謝": { en: "Thank you", ja: "ありがとうございます", kr: "감사합니다", es: "Gracias", fr: "Merci", de: "Danke", romaji: "Arigatou gozaimasu", hangul_rr: "Gamsahamnida" },
  "這份專案我們下週開始執行": {
    en: "We will execute this project next week.",
    ja: "このプロジェクトは来週から実行します。",
    kr: "이 프로젝트는 다음 주부터 실행합니다.",
    es: "Ejecutaremos este proyecto la próxima semana.",
    fr: "Nous exécuterons ce projet la semaine prochaine.",
    de: "Wir werden dieses Projekt nächste Woche ausführen.",
    romaji: "Kono purojekuto wa raishuu kara jikkou shimasu.",
    hangul_rr: "I peurojeokteu-neun daeum ju-buteo silhaenghamnida."
  },
  "我喜歡程式設計與語言學習": {
    en: "I like programming and language learning.",
    ja: "プログラミングと言語学習が好きです。",
    kr: "프로그래밍과 언어 학습을 좋아합니다.",
    es: "Me gusta la programación y el aprendizaje de idiomas.",
    fr: "J'aime la programmation et l'apprentissage des langues.",
    de: "Ich mag Programmierung und Sprachenlernen.",
    romaji: "Puroguramingu to gengogakushuu ga suki desu.",
    hangul_rr: "Peurogeuraeming-gwa eon-eo hakseub-eul joahamnida."
  }
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
  let res = '';
  for (let char of japaneseText) {
    if (KANA_ROMAN_MAP[char]) {
      res += KANA_ROMAN_MAP[char];
    } else {
      res += char;
    }
  }
  return res;
}

export class LocalTranslatorEngine {
  constructor() {
    this.termsDb = INTERACTIVE_TERMS_DB;
    this.baseDb = BASE_DICTIONARY;
    this.userSelectionOverrides = {}; // { '專案': { ja: '案件 (Anken)', en: 'initiative' } }
  }

  /**
   * Set interactive term override selected by user
   * @param {string} origTerm 
   * @param {string} lang 
   * @param {string} chosenValue 
   */
  setTermOverride(origTerm, lang, chosenValue) {
    if (!this.userSelectionOverrides[origTerm]) {
      this.userSelectionOverrides[origTerm] = {};
    }
    this.userSelectionOverrides[origTerm][lang] = chosenValue;
  }

  /**
   * Analyze input text and extract key terms with candidate term explanations
   * @param {string} text 
   * @returns {Array} List of interactive term candidate objects
   */
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
    return foundTerms;
  }

  /**
   * Main Translation execution with interactive overrides support
   * @param {string} inputText 
   * @returns {Object} Multilingual results object with term candidates
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

    // Extract term candidates for interactive panel
    const interactiveTerms = this.extractInteractiveTerms(text);

    // Initial base sentence result
    let jaRes = "";
    let enRes = "";
    let krRes = "";
    let esRes = "";
    let frRes = "";
    let deRes = "";
    let romajiRes = "";

    if (this.baseDb[text]) {
      const base = this.baseDb[text];
      jaRes = base.ja;
      enRes = base.en;
      krRes = base.kr;
      esRes = base.es || "Ejecutarás este proyecto.";
      frRes = base.fr || "Vous exécuterez ce projet.";
      deRes = base.de || "Sie werden dieses Projekt ausführen.";
      romajiRes = base.romaji || generateRomaji(base.ja);
    } else {
      // Fallback term matching
      jaRes = text.replace(/專案/g, "プロジェクト").replace(/執行/g, "実行します").replace(/工作/g, "仕事").replace(/你好/g, "こんにちは").replace(/謝謝/g, "ありがとうございます").replace(/買單/g, "お会計をお願いします");
      enRes = text.replace(/專案/g, "project").replace(/執行/g, "execute").replace(/工作/g, "work").replace(/你好/g, "Hello").replace(/謝謝/g, "Thank you").replace(/買單/g, "Check, please");
      krRes = text.replace(/專案/g, "프로젝트").replace(/執行/g, "실행합니다").replace(/工作/g, "일").replace(/你好/g, "안녕하세요").replace(/謝謝/g, "감사합니다");
      esRes = text.replace(/專案/g, "proyecto").replace(/執行/g, "ejecutar").replace(/工作/g, "trabajo").replace(/你好/g, "Hola").replace(/謝謝/g, "Gracias");
      frRes = text.replace(/專案/g, "projet").replace(/執行/g, "exécuter").replace(/工作/g, "travail").replace(/你好/g, "Bonjour").replace(/謝謝/g, "Merci");
      deRes = text.replace(/專案/g, "Projekt").replace(/執行/g, "ausführen").replace(/工作/g, "Arbeit").replace(/你好/g, "Hallo").replace(/謝謝/g, "Danke");
      romajiRes = generateRomaji(jaRes);
    }

    // Apply User Selection Overrides to dynamically reconstruct translations!
    interactiveTerms.forEach(item => {
      const orig = item.originalWord;
      const userSel = this.userSelectionOverrides[orig];
      if (userSel) {
        if (userSel.ja) {
          const rawJaTerm = userSel.ja.split(' ')[0]; // Extract main kanji/katakana
          if (orig === '專案') jaRes = jaRes.replace(/プロジェクト|案件|企画/g, rawJaTerm);
          if (orig === '執行') jaRes = jaRes.replace(/実行します|着手します|遂行します/g, rawJaTerm);
          if (orig === '工作') jaRes = jaRes.replace(/仕事|業務|作業/g, rawJaTerm);
          if (orig === '你好') jaRes = jaRes.replace(/こんにちは|はじめまして|お世話になっております/g, rawJaTerm);
          if (orig === '謝謝') jaRes = jaRes.replace(/ありがとうございます|心より感謝申し上げます|どうも/g, rawJaTerm);
          if (orig === '買單') jaRes = jaRes.replace(/お会計をお願いします|お勘定|チェック/g, rawJaTerm);
          romajiRes = generateRomaji(jaRes);
        }
        if (userSel.en) {
          const rawEnTerm = userSel.en.split(' ')[0].toLowerCase();
          if (orig === '專案') enRes = enRes.replace(/project|initiative|undertaking/gi, rawEnTerm);
          if (orig === '執行') enRes = enRes.replace(/execute|implement|kick off/gi, rawEnTerm);
          if (orig === '工作') enRes = enRes.replace(/work|job|task/gi, rawEnTerm);
          if (orig === '你好') enRes = enRes.replace(/Hello|Hi there|Dear Sir\/Madam/gi, userSel.en);
          if (orig === '謝謝') enRes = enRes.replace(/Thank you|Thank you very much|Much appreciated/gi, userSel.en);
          if (orig === '買單') enRes = enRes.replace(/Check, please|The bill, please/gi, userSel.en);
        }
      }
    });

    return {
      original: text,
      detectedLanguage: 'zh-TW',
      interactiveTerms: interactiveTerms,
      translations: {
        ja: { text: jaRes, romaji: romajiRes },
        kr: { text: krRes, hangul_rr: '' },
        en: { text: enRes },
        es: { text: esRes },
        fr: { text: frRes },
        de: { text: deRes }
      }
    };
  }
}
