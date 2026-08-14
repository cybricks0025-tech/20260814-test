/**
 * Native Browser Web Speech API Service
 * Provides offline voice recognition and multi-lingual SpeechSynthesis (TTS)
 */

export class SpeechService {
  constructor() {
    this.synth = window.speechSynthesis;
    this.voices = [];
    this.isListening = false;
    this.recognition = null;

    this.initVoices();
    this.initRecognition();
  }

  initVoices() {
    if (!this.synth) return;
    const updateVoices = () => {
      this.voices = this.synth.getVoices();
    };
    updateVoices();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = updateVoices;
    }
  }

  initRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = 'zh-TW';
    }
  }

  /**
   * Speak target text in specific language
   * @param {string} text 
   * @param {string} langCode (ja-JP, ko-KR, en-US, es-ES, fr-FR, de-DE, zh-TW)
   */
  speak(text, langCode = 'ja-JP') {
    if (!this.synth || !text) return;

    // Stop current speech
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode;
    utterance.rate = 0.95; // slightly natural tempo
    utterance.pitch = 1.0;

    // Match best available voice for language
    if (this.voices.length > 0) {
      const matchedVoice = this.voices.find(v => v.lang.toLowerCase().includes(langCode.toLowerCase().replace('_', '-')));
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }
    }

    this.synth.speak(utterance);
    return utterance;
  }

  /**
   * Start microphone voice recognition
   * @param {Function} onResultCallback 
   * @param {Function} onErrorCallback 
   * @param {Function} onEndCallback 
   */
  startListening(onResultCallback, onErrorCallback, onEndCallback) {
    if (!this.recognition) {
      if (onErrorCallback) onErrorCallback("您的瀏覽器不支援 Web Speech 語音辨識功能。");
      return;
    }

    if (this.isListening) {
      this.stopListening();
      return;
    }

    this.isListening = true;

    this.recognition.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      if (onResultCallback) onResultCallback(transcript);
    };

    this.recognition.onerror = (event) => {
      this.isListening = false;
      if (onErrorCallback) onErrorCallback(event.error);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (onEndCallback) onEndCallback();
    };

    try {
      this.recognition.start();
    } catch (err) {
      this.isListening = false;
      if (onErrorCallback) onErrorCallback(err.message);
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }
}
