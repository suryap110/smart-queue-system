export const speakTokenCall = (displayCode: string, roomOrCounterName: string, lang: 'en' | 'hi' = 'en') => {
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported on this browser.');
    return;
  }

  // Play audio chime alert first
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5 chime
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.4);
  } catch (e) {
    // Ignore audio context autoplay errors
  }

  setTimeout(() => {
    window.speechSynthesis.cancel(); // Clear previous speech queue

    const formattedCode = displayCode.split('').join(' ');

    let text = '';
    if (lang === 'hi') {
      text = `ध्यान दें: टोकन नंबर ${formattedCode}, कृपया ${roomOrCounterName} पर जाएं।`;
    } else {
      text = `Attention please: Token number ${formattedCode}, please report to ${roomOrCounterName}.`;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-US';

    window.speechSynthesis.speak(utterance);
  }, 450);
};
