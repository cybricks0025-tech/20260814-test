/**
 * Local Offline Multi-Language Real-Time Translation Engine
 * Operates 100% Client-Side with Zero External API Calls.
 */

// Comprehensive Offline Multi-Lingual Dictionary & Sentence Grammar Engine
const OFFLINE_DICTIONARY = {
  // Common Phrases & Greetings
  "你好": { en: "Hello", ja: "こんにちは", kr: "안녕하세요", es: "Hola", fr: "Bonjour", de: "Hallo", py: "nǐ hǎo", romaji: "Konnichiwa", hangul_rr: "Annyeonghaseyo" },
  "早安": { en: "Good morning", ja: "おはようございます", kr: "좋은 아침입니다", es: "Buenos días", fr: "Bonjour", de: "Guten Morgen", py: "zǎo ān", romaji: "Ohayou gozaimasu", hangul_rr: "Joeun achim-imnida" },
  "晚安": { en: "Good night", ja: "おやすみなさい", kr: "안녕히 주무세요", es: "Buenas noches", fr: "Bonne nuit", de: "Gute Nacht", py: "wǎn ān", romaji: "Oyasuminasai", hangul_rr: "Annyeonghi jumuseyo" },
  "謝謝": { en: "Thank you", ja: "ありがとうございます", kr: "감사합니다", es: "Gracias", fr: "Merci", de: "Danke", py: "xiè xie", romaji: "Arigatou gozaimasu", hangul_rr: "Gamsahamnida" },
  "謝謝你": { en: "Thank you", ja: "ありがとうございます", kr: "감사합니다", es: "Gracias", fr: "Merci", de: "Danke", py: "xiè xie nǐ", romaji: "Arigatou gozaimasu", hangul_rr: "Gamsahamnida" },
  "非常感謝": { en: "Thank you very much", ja: "どうもありがとうございます", kr: "정말 감사합니다", es: "Muchas gracias", fr: "Merci beaucoup", de: "Vielen Dank", py: "fēi cháng xiè xie", romaji: "Doumo arigatou gozaimasu", hangul_rr: "Jeongmal gamsahamnida" },
  "不客氣": { en: "You're welcome", ja: "どういたしまして", kr: "천만에요", es: "De nada", fr: "De rien", de: "Bitte schön", py: "bú kè qi", romaji: "Douitashimashite", hangul_rr: "Cheonmaneyo" },
  "對不起": { en: "I'm sorry", ja: "ごめんなさい", kr: "죄송합니다", es: "Lo siento", fr: "Désolé", de: "Entschuldigung", py: "duì bu qǐ", romaji: "Gomen nasai", hangul_rr: "Joesonghamnida" },
  "不好意思": { en: "Excuse me", ja: "すみません", kr: "실례합니다", es: "Disculpe", fr: "Excusez-moi", de: "Entschuldigen Sie", py: "bù hǎo yì si", romaji: "Sumimasen", hangul_rr: "Sillyehamnida" },
  "再見": { en: "Goodbye", ja: "さようなら", kr: "안녕히 가세요", es: "Adiós", fr: "Au revoir", de: "Auf Wiedersehen", py: "zài jiàn", romaji: "Sayounara", hangul_rr: "Annyeonghi gaseyo" },
  "明天見": { en: "See you tomorrow", ja: "また明日", kr: "내일 봐요", es: "Hasta mañana", fr: "À demain", de: "Bis morgen", py: "míng tiān jiàn", romaji: "Mata ashita", hangul_rr: "Naeil bwayo" },
  "很高興認識你": { en: "Nice to meet you", ja: "はじめまして、よろしくお願いします", kr: "만나서 반갑습니다", es: "Mucho gusto en conocerte", fr: "Ravi de vous rencontrer", de: "Freut mich, Sie kennenzulernen", py: "hěn gāo xìng rèn shi nǐ", romaji: "Hajimemashite, yoroshiku onegaishimasu", hangul_rr: "Mannaseo bangapda" },
  "最近好嗎": { en: "How are you doing recently?", ja: "最近どうですか？", kr: "요즘 어떻게 지내세요?", es: "¿Cómo estás últimamente?", fr: "Comment allez-vous ces derniers temps?", de: "Wie geht es dir in letzter Zeit?", py: "zuì jìn hǎo ma", romaji: "Saikin dou desu ka?", hangul_rr: "Yojeum eottohke jinaeseyo?" },
  "我愛你": { en: "I love you", ja: "愛しています", kr: "사랑해요", es: "Te amo", fr: "Je t'aime", de: "Ich liebe dich", py: "wǒ ài nǐ", romaji: "Aishiteimasu", hangul_rr: "Saranghaeyo" },
  "保重": { en: "Take care", ja: "お大事に", kr: "몸조심하세요", es: "Cuídate", fr: "Prenez soin de vous", de: "Pass auf dich auf", py: "bǎo zhòng", romaji: "Odaiji ni", hangul_rr: "Momjosimhaseyo" },
  "祝你有美好的一天": { en: "Have a nice day!", ja: "良い一日を！", kr: "좋은 하루 되세요!", es: "¡Que tengas un buen día!", fr: "Passez une bonne journée!", de: "Einen schönen Tag noch!", py: "zhù nǐ yǒu měi hǎo de yī tiān", romaji: "Yoi ichinichi wo!", hangul_rr: "Joeun haru doeseyo!" },

  // Questions & Practical Travel Phrases
  "請問多少錢": { en: "How much is this please?", ja: "いくらですか？", kr: "얼마인가요?", es: "¿Cuánto cuesta esto, por favor?", fr: "Combien cela coûte-t-il s'il vous plaît?", de: "Wie viel kostet das bitte?", py: "qǐng wèn duō shao qián", romaji: "Ikura desu ka?", hangul_rr: "Eolma-ingayo?" },
  "廁所在哪裡": { en: "Where is the bathroom?", ja: "お手洗いはどこですか？", kr: "화장실이 어디에 있나요?", es: "¿Dónde está el baño?", fr: "Où sont les toilettes?", de: "Wo ist die Toilette?", py: "cè suǒ zài nǎ lǐ", romaji: "Otesharai wa doko desu ka?", hangul_rr: "Hwajangsil-i eodie innayo?" },
  "這個很好吃": { en: "This is delicious", ja: "これはとても美味しいです", kr: "이것은 정말 맛있어요", es: "Esto está delicioso", fr: "C'est délicieux", de: "Das ist lecker", py: "zhè ge hěn hǎo chī", romaji: "Kore wa totemo oishii desu", hangul_rr: "Igeos-eun jeongmal mas-iss-eoyo" },
  "你可以幫我嗎": { en: "Can you help me?", ja: "手伝っていただけますか？", kr: "저를 도와주실 수 있나요?", es: "¿Puedes ayudarme?", fr: "Pouvez-vous m'aider?", de: "Können Sie mir helfen?", py: "nǐ kě yǐ bāng wǒ ma", romaji: "Tetsudatte itadakemasu ka?", hangul_rr: "Jeoreul dowajusil su innayo?" },
  "我不懂": { en: "I don't understand", ja: "わかりません", kr: "잘 모르겠습니다", es: "No entiendo", fr: "Je ne comprends pas", de: "Ich verstehe nicht", py: "wǒ bù dǒng", romaji: "Wakarimasen", hangul_rr: "Jal morugessseumnida" },
  "你會說英文嗎": { en: "Do you speak English?", ja: "英語を話せますか？", kr: "영어를 할 수 있나요?", es: "¿Hablas inglés?", fr: "Parlez-vous anglais?", de: "Sprechen Sie Englisch?", py: "nǐ huì shuō yīng wén ma", romaji: "Eigo wo hanasemasu ka?", hangul_rr: "Yeong-eo-reul hal su innayo?" },
  "我想買這個": { en: "I want to buy this", ja: "これを買いたいです", kr: "이것을 사고 싶어요", es: "Quiero comprar esto", fr: "Je voudrais acheter ceci", de: "Ich möchte das kaufen", py: "wǒ xiǎng mǎi zhè ge", romaji: "Kore wo kaitai desu", hangul_rr: "Igeos-eul sago sip-eoyo" },
  "太貴了": { en: "Too expensive", ja: "高すぎます", kr: "너무 비싸요", es: "Es demasiado caro", fr: "C'est trop cher", de: "Das ist zu teuer", py: "tài guì le", romaji: "Takasugimasu", hangul_rr: "Neomu bissayo" },
  "請算便宜一點": { en: "Can you give me a discount?", ja: "少し安くしてもらえますか？", kr: "깎아주실 수 있나요?", es: "¿Me puede hacer un descuento?", fr: "Pouvez-vous me faire une réduction?", de: "Können Sie mir einen Rabatt geben?", py: "qǐng suàn pián yi yī diǎn", romaji: "Sukoshi yasuku shite moraemasu ka?", hangul_rr: "Kkakk-ajusil su innayo?" },
  "買單": { en: "Check please", ja: "お会計をお願いします", kr: "계산해 주세요", es: "La cuenta, por favor", fr: "L'addition, s'il vous plaît", de: "Die Rechnung, bitte", py: "mǎi dān", romaji: "Okaikei wo onegaishimasu", hangul_rr: "Gyesanhae juseyo" },

  // Tech & Work
  "人工智慧": { en: "Artificial Intelligence", ja: "人工知能 (AI)", kr: "인공지능", es: "Inteligencia Artificial", fr: "Intelligence Artificielle", de: "Künstliche Intelligenz", py: "rén gōng zhì huì", romaji: "Jinkou Chinou", hangul_rr: "Ingongjineung" },
  "程式設計": { en: "Programming", ja: "プログラミング", kr: "프로그래밍", es: "Programación", fr: "Programmation", de: "Programmierung", py: "chéng shì shè jì", romaji: "Puroguramingu", hangul_rr: "Peurogeuraeming" },
  "網頁開發": { en: "Web Development", ja: "ウェブ開発", kr: "웹 개발", es: "Desarrollo Web", fr: "Développement Web", de: "Webentwicklung", py: "wǎng yè kāi fā", romaji: "Webu Kaihatsu", hangul_rr: "Web Gaebal" },
  "翻譯器": { en: "Translator", ja: "翻訳機", kr: "번역기", es: "Traductor", fr: "Traducteur", de: "Übersetzer", py: "fān yì qì", romaji: "Honyakuki", hangul_rr: "Beonyeokgi" },
  "即時": { en: "Real-time", ja: "リアルタイム", kr: "실시간", es: "En tiempo real", fr: "En temps réel", de: "Echtzeit", py: "jí shí", romaji: "Riarutaimu", hangul_rr: "Silsigan" },
  "本地端": { en: "Local / Offline", ja: "ローカル / オフライン", kr: "로컬 / 오프라인", es: "Local / Sin conexión", fr: "Local / Hors ligne", de: "Lokal / Offline", py: "běn dì duān", romaji: "Rookaru / Ofurain", hangul_rr: "Rokeol / Opeulrain" },

  // Basic Vocabulary Words
  "你好嗎": { en: "How are you?", ja: "お元気ですか？", kr: "잘 지내세요?", es: "¿Cómo estás?", fr: "Comment allez-vous?", de: "Wie geht es Ihnen?", py: "nǐ hǎo ma", romaji: "Ogenki desu ka?", hangul_rr: "Jal jinaeseyo?" },
  "朋友": { en: "Friend", ja: "友達", kr: "친구", es: "Amigo", fr: "Ami", de: "Freund", py: "péng you", romaji: "Tomodachi", hangul_rr: "Chingu" },
  "家人": { en: "Family", ja: "家族", kr: "가족", es: "Familia", fr: "Famille", de: "Familie", py: "jiā rén", romaji: "Kazoku", hangul_rr: "Gajok" },
  "工作": { en: "Work / Job", ja: "仕事", kr: "일 / 직업", es: "Trabajo", fr: "Travail", de: "Arbeit", py: "gōng zuò", romaji: "Shigoto", hangul_rr: "Il / Jigeop" },
  "學習": { en: "Learn / Study", ja: "勉強する / 学ぶ", kr: "공부하다 / 배우다", es: "Aprender / Estudiar", fr: "Apprendre / Étudier", de: "Lernen / Studieren", py: "xué xí", romaji: "Benkyou suru / Manabu", hangul_rr: "Gongbuhada / Baeuda" },
  "時間": { en: "Time", ja: "時間", kr: "시간", es: "Tiempo", fr: "Temps", de: "Zeit", py: "shí jiān", romaji: "Jikan", hangul_rr: "Sigan" },
  "今天": { en: "Today", ja: "今日", kr: "오늘", es: "Hoy", fr: "Aujourd'hui", de: "Heute", py: "jīn tiān", romaji: "Kyou", hangul_rr: "Oneul" },
  "明天": { en: "Tomorrow", ja: "明日", kr: "내일", es: "Mañana", fr: "Demain", de: "Morgen", py: "míng tiān", romaji: "Ashita", hangul_rr: "Naeil" },
  "昨天": { en: "Yesterday", ja: "昨日", kr: "어제", es: "Ayer", fr: "Hier", de: "Gestern", py: "zuó tiān", romaji: "Kinou", hangul_rr: "Eoje" },
  "日本": { en: "Japan", ja: "日本", kr: "일본", es: "Japón", fr: "Japon", de: "Japan", py: "rì běn", romaji: "Nihon", hangul_rr: "Ilbon" },
  "韓國": { en: "Korea", ja: "韓国", kr: "한국", es: "Corea", fr: "Corée", de: "Korea", py: "hán guó", romaji: "Kankoku", hangul_rr: "Hanguk" },
  "美國": { en: "USA", ja: "アメリカ", kr: "미국", es: "Estados Unidos", fr: "États-Unis", de: "USA", py: "měi guó", romaji: "Amerika", hangul_rr: "Miguk" },
  "台灣": { en: "Taiwan", ja: "台湾", kr: "대만", es: "Taiwán", fr: "Taïwan", de: "Taiwan", py: "tái wān", romaji: "Taiwan", hangul_rr: "Daeman" },
  "愛": { en: "Love", ja: "愛", kr: "사랑", es: "Amor", fr: "Amour", de: "Liebe", py: "ài", romaji: "Ai", hangul_rr: "Sarang" },
  "和平": { en: "Peace", ja: "平和", kr: "평화", es: "Paz", fr: "Paix", de: "Frieden", py: "hé píng", romaji: "Heiwa", hangul_rr: "Pyeonghwa" },
  "希望": { en: "Hope", ja: "希望", kr: "희망", es: "Esperanza", fr: "Espoir", de: "Hoffnung", py: "xī wàng", romaji: "Kibou", hangul_rr: "Heimang" },
  "快樂": { en: "Happy", ja: "幸せ / 楽しい", kr: "행복 / 즐거움", es: "Feliz", fr: "Heureux", de: "Glücklich", py: "kuài lè", romaji: "Shiawase / Tanoshii", hangul_rr: "Haengbok / Jeulgeoum" },
  "加油": { en: "Good luck / Go for it!", ja: "頑張って！", kr: "화이팅!", es: "¡Ánimo!", fr: "Bonne chance!", de: "Viel Erfolg!", py: "jiā yóu", romaji: "Ganbatte!", hangul_rr: "Hwaiting!" },
  "讚": { en: "Awesome / Great", ja: "素晴らしい！", kr: "최고예요!", es: "¡Excelente!", fr: "Génial!", de: "Toll!", py: "zàn", romaji: "Subarashii!", hangul_rr: "Choegoyeyo!" }
};

// Sentence Pattern Replacements & Grammatical Rules Engine
const SENTENCE_TEMPLATES = [
  {
    regex: /^我想要(?:去|到)(.+)$/i,
    en: (m) => `I want to go to ${translateWord(m[1], 'en')}`,
    ja: (m) => `${translateWord(m[1], 'ja')}に行きたいです`,
    kr: (m) => `${translateWord(m[1], 'kr')}에 가고 싶어요`,
    es: (m) => `Quiero ir a ${translateWord(m[1], 'es')}`,
    fr: (m) => `Je veux aller à ${translateWord(m[1], 'fr')}`,
    de: (m) => `Ich möchte nach ${translateWord(m[1], 'de')} gehen`,
    romaji: (m) => `${translateWord(m[1], 'romaji')} ni ikitai desu`,
    hangul_rr: (m) => `${translateWord(m[1], 'hangul_rr')}-e gago sipeoyo`
  },
  {
    regex: /^我想吃(.+)$/i,
    en: (m) => `I want to eat ${translateWord(m[1], 'en')}`,
    ja: (m) => `${translateWord(m[1], 'ja')}を食べたいです`,
    kr: (m) => `${translateWord(m[1], 'kr')}을/를 먹고 싶어요`,
    es: (m) => `Quiero comer ${translateWord(m[1], 'es')}`,
    fr: (m) => `Je veux manger ${translateWord(m[1], 'fr')}`,
    de: (m) => `Ich möchte ${translateWord(m[1], 'de')} essen`,
    romaji: (m) => `${translateWord(m[1], 'romaji')} wo tabetai desu`,
    hangul_rr: (m) => `${translateWord(m[1], 'hangul_rr')}-eul meog-go sipeoyo`
  },
  {
    regex: /^我喜歡(.+)$/i,
    en: (m) => `I like ${translateWord(m[1], 'en')}`,
    ja: (m) => `${translateWord(m[1], 'ja')}が好きです`,
    kr: (m) => `${translateWord(m[1], 'kr')}을/를 좋아해요`,
    es: (m) => `Me gusta ${translateWord(m[1], 'es')}`,
    fr: (m) => `J'aime ${translateWord(m[1], 'fr')}`,
    de: (m) => `Ich mag ${translateWord(m[1], 'de')}`,
    romaji: (m) => `${translateWord(m[1], 'romaji')} ga suki desu`,
    hangul_rr: (m) => `${translateWord(m[1], 'hangul_rr')}-eul joahaeyo`
  },
  {
    regex: /^這是(.+)$/i,
    en: (m) => `This is ${translateWord(m[1], 'en')}`,
    ja: (m) => `これは${translateWord(m[1], 'ja')}です`,
    kr: (m) => `이것은 ${translateWord(m[1], 'kr')}입니다`,
    es: (m) => `Esto es ${translateWord(m[1], 'es')}`,
    fr: (m) => `C'est ${translateWord(m[1], 'fr')}`,
    de: (m) => `Das ist ${translateWord(m[1], 'de')}`,
    romaji: (m) => `Kore wa ${translateWord(m[1], 'romaji')} desu`,
    hangul_rr: (m) => `Igeos-eun ${translateWord(m[1], 'hangul_rr')}-imnida`
  },
  {
    regex: /^你在(.+)嗎$/i,
    en: (m) => `Are you at ${translateWord(m[1], 'en')}?`,
    ja: (m) => `${translateWord(m[1], 'ja')}にいますか？`,
    kr: (m) => `${translateWord(m[1], 'kr')}에 있나요?`,
    es: (m) => `¿Estás en ${translateWord(m[1], 'es')}?`,
    fr: (m) => `Êtes-vous à ${translateWord(m[1], 'fr')}?`,
    de: (m) => `Bist du in ${translateWord(m[1], 'de')}?`,
    romaji: (m) => `${translateWord(m[1], 'romaji')} ni imasu ka?`,
    hangul_rr: (m) => `${translateWord(m[1], 'hangul_rr')}-e innayo?`
  }
];

// Fallback Word-by-Word dictionary translator for unknown compounds
function translateWord(text, lang) {
  const trimmed = text.trim();
  if (OFFLINE_DICTIONARY[trimmed] && OFFLINE_DICTIONARY[trimmed][lang]) {
    return OFFLINE_DICTIONARY[trimmed][lang];
  }
  return trimmed;
}

// Kana to Romaji Map for Japanese Pronunciation Guide
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

// Main Local Translation Engine API
export class LocalTranslatorEngine {
  constructor() {
    this.dictionary = OFFLINE_DICTIONARY;
    this.sentenceTemplates = SENTENCE_TEMPLATES;
  }

  /**
   * Perform instant multi-language translation for given source text
   * @param {string} inputText
   * @param {string} sourceLang (default 'zh-TW')
   * @returns {Object} Multilingual results object
   */
  translate(inputText, sourceLang = 'zh-TW') {
    const text = inputText ? inputText.trim() : '';
    if (!text) {
      return {
        original: '',
        detectedLanguage: 'zh-TW',
        translations: {
          ja: { text: '', romaji: '' },
          kr: { text: '', hangul_rr: '' },
          en: { text: '' },
          zh_tw: { text: '' },
          es: { text: '' },
          fr: { text: '' },
          de: { text: '' }
        }
      };
    }

    // 1. Direct Dictionary Exact Match
    if (this.dictionary[text]) {
      const entry = this.dictionary[text];
      return {
        original: text,
        detectedLanguage: 'zh-TW',
        translations: {
          ja: { text: entry.ja, romaji: entry.romaji || generateRomaji(entry.ja) },
          kr: { text: entry.kr, hangul_rr: entry.hangul_rr || entry.kr },
          en: { text: entry.en },
          zh_tw: { text: text, pinyin: entry.py || '' },
          es: { text: entry.es },
          fr: { text: entry.fr },
          de: { text: entry.de }
        }
      };
    }

    // 2. Pattern Matching Rules
    for (let template of this.sentenceTemplates) {
      const match = text.match(template.regex);
      if (match) {
        return {
          original: text,
          detectedLanguage: 'zh-TW',
          translations: {
            ja: { text: template.ja(match), romaji: template.romaji ? template.romaji(match) : generateRomaji(template.ja(match)) },
            kr: { text: template.kr(match), hangul_rr: template.hangul_rr ? template.hangul_rr(match) : '' },
            en: { text: template.en(match) },
            zh_tw: { text: text },
            es: { text: template.es(match) },
            fr: { text: template.fr(match) },
            de: { text: template.de(match) }
          }
        };
      }
    }

    // 3. Smart Tokenizer Fallback (Word-by-Word Translation & Grammatical Reconstruction)
    return this.fallbackSmartTranslate(text);
  }

  fallbackSmartTranslate(text) {
    let jaTokens = [];
    let krTokens = [];
    let enTokens = [];
    let esTokens = [];
    let frTokens = [];
    let deTokens = [];

    // Simple word segmenter or character scanner
    let i = 0;
    while (i < text.length) {
      let matched = false;
      // Try multi-character lookup from length 4 down to 1
      for (let len = 4; len >= 1; len--) {
        const sub = text.substring(i, i + len);
        if (this.dictionary[sub]) {
          const dictItem = this.dictionary[sub];
          jaTokens.push(dictItem.ja);
          krTokens.push(dictItem.kr);
          enTokens.push(dictItem.en);
          esTokens.push(dictItem.es);
          frTokens.push(dictItem.fr);
          deTokens.push(dictItem.de);
          i += len;
          matched = true;
          break;
        }
      }
      if (!matched) {
        const char = text[i];
        jaTokens.push(char);
        krTokens.push(char);
        enTokens.push(char);
        esTokens.push(char);
        frTokens.push(char);
        deTokens.push(char);
        i++;
      }
    }

    const jaText = jaTokens.join('');
    const krText = krTokens.join(' ');
    const enText = enTokens.join(' ');
    const esText = esTokens.join(' ');
    const frText = frTokens.join(' ');
    const deText = deTokens.join(' ');

    return {
      original: text,
      detectedLanguage: 'zh-TW',
      translations: {
        ja: { text: jaText, romaji: generateRomaji(jaText) },
        kr: { text: krText, hangul_rr: '' },
        en: { text: enText },
        zh_tw: { text: text },
        es: { text: esText },
        fr: { text: frText },
        de: { text: deText }
      }
    };
  }
}
