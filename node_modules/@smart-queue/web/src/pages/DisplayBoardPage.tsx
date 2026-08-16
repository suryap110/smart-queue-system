import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useLangStore } from '../store/useLangStore';
import { 
  Volume2, VolumeX, Radio, Sparkles, Building2, Bell, AlertTriangle, 
  CheckCircle2, Clock, Volume1, Play, RefreshCw, ShieldAlert, Monitor,
  Maximize2, Wind, Navigation, Languages, Flame, Sliders, RotateCcw, Check
} from 'lucide-react';

export const DisplayBoardPage: React.FC = () => {
  const { lang, setLang, t } = useLangStore();
  const [nowServing, setNowServing] = useState<any | null>(null);
  const [calledHistory, setCalledHistory] = useState<any[]>([]);
  const [departmentCalls, setDepartmentCalls] = useState<any[]>([]);

  // Voice & Audio Controls - MANDATORY FULL DUAL VOICE (TAMIL + ENGLISH)
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [voiceMode, setVoiceMode] = useState<'FULL_TAMIL_ENGLISH' | 'TAMIL_ONLY' | 'ENGLISH_ONLY'>('FULL_TAMIL_ENGLISH');
  const [speechRate, setSpeechRate] = useState(0.85);
  const [speechPitch, setSpeechPitch] = useState(1.0);
  
  // Available Voices List
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>('');

  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [fullScreen, setFullScreen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Load Browser Speech Synthesis Voices
  useEffect(() => {
    const loadVoices = () => {
      if ('speechSynthesis' in window) {
        const voices = window.speechSynthesis.getVoices();
        setAvailableVoices(voices);
        
        const tamilVoice = voices.find(v => v.lang.startsWith('ta') || v.name.toLowerCase().includes('tamil'));
        const inVoice = voices.find(v => v.lang.includes('IN'));
        
        if (tamilVoice) {
          setSelectedVoiceURI(tamilVoice.voiceURI);
        } else if (inVoice) {
          setSelectedVoiceURI(inVoice.voiceURI);
        }
      }
    };

    loadVoices();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  useEffect(() => {
    fetchLiveDisplayData();
    const interval = setInterval(fetchLiveDisplayData, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchLiveDisplayData = async () => {
    try {
      const mockServing = nowServing || {
        displayCode: 'OPD-041',
        patientName: 'Surya Kumar',
        counterName: 'Room 101 - General Medicine',
        roomNumber: '101',
        doctorName: 'Dr. Rajesh Sharma',
        direction: 'Left Corridor - Room 101',
        priorityType: 'NORMAL',
        triageLevel: 'GREEN_ROUTINE',
        calledAt: new Date().toISOString()
      };

      const mockHistory = [
        { displayCode: 'OPD-040', counterName: 'Room 101', doctorName: 'Dr. Rajesh Sharma', time: '03:15 AM' },
        { displayCode: 'PED-008', counterName: 'Room 102', doctorName: 'Dr. Anita Verma', time: '03:12 AM' },
        { displayCode: 'EMG-001', counterName: 'Trauma Triage', doctorName: 'Dr. Vikram Sethi', time: '03:05 AM' }
      ];

      const mockDepts = [
        { room: 'Room 101', dept: 'General Medicine OPD', doctor: 'Dr. Rajesh Sharma', currentToken: 'OPD-041', status: 'IN_SERVICE', direction: '⬅️ Corridor A' },
        { room: 'Room 102', dept: 'Pediatrics OPD', doctor: 'Dr. Anita Verma', currentToken: 'PED-008', status: 'IN_SERVICE', direction: '⬅️ Corridor A' },
        { room: 'Room 103', dept: 'Orthopedics & Trauma', doctor: 'Dr. Vikram Sethi', currentToken: 'EMG-001', status: 'TRIAGED', direction: '➡️ Emergency Wing' },
        { room: 'Room 104', dept: 'Cardiology OPD', doctor: 'Dr. Suresh Mehta', currentToken: 'CARDIO-003', status: 'CALLED', direction: '⬅️ Corridor B' },
        { room: 'Lab Hall B', dept: 'Pathology Diagnostics', doctor: 'Lab Staff B', currentToken: 'LAB-015', status: 'PROCESSING', direction: '⬇️ Basement 1' },
        { room: 'Counter 3', dept: 'Dispensary Pharmacy', doctor: 'Pharm Staff', currentToken: 'PHARM-022', status: 'READY_PICKUP', direction: '➡️ Main Gate' }
      ];

      setNowServing(mockServing);
      setCalledHistory(mockHistory);
      setDepartmentCalls(mockDepts);

    } catch (e) {
      console.error(e);
    }
  };

  // Play Web Audio Chime Sound (Airport Gong Effect)
  const playAudioChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5 note
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3); // A5 note
      gain.gain.setValueAtTime(0.5, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } catch (e) {}
  };

  // FULL DUAL SPEECH ANNOUNCEMENT ENGINE (FULL TAMIL + FULL ENGLISH)
  const triggerVoiceAnnouncement = (tokenCode: string, roomName: string, doctorName: string) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel(); // Clear audio queue
    playAudioChime(); // Play airport chime first!

    const voices = window.speechSynthesis.getVoices();
    const tamilNativeVoice = voices.find(v => v.lang.startsWith('ta') || v.name.toLowerCase().includes('tamil'));
    const chosenVoice = voices.find(v => v.voiceURI === selectedVoiceURI) || tamilNativeVoice || voices.find(v => v.lang.includes('IN'));

    // 1. FULL TAMIL ANNOUNCEMENT (முழுமையான தமிழ் ஒலி)
    const textTamilNative = `தயவுசெய்து கவனிக்கவும். டோக்கன் எண் ${tokenCode.split('').join(' ')}, மருத்துவர் ${doctorName} அவர்களின் ${roomName}-க்கு செல்லவும். நன்றி.`;
    const textTamilPhonetic = `Tayavuseythu kavanikkavum. Token Number ${tokenCode.split('').join(' ')}, please proceed to ${roomName}, Doctor ${doctorName}. Nandri.`;

    const msgTamil = new SpeechSynthesisUtterance(tamilNativeVoice ? textTamilNative : textTamilPhonetic);
    if (chosenVoice) msgTamil.voice = chosenVoice;
    msgTamil.lang = tamilNativeVoice ? 'ta-IN' : 'en-IN';
    msgTamil.rate = speechRate;
    msgTamil.pitch = speechPitch;

    // 2. FULL ENGLISH ANNOUNCEMENT
    const textEn = `Attention please. Token Number ${tokenCode.split('').join(' ')}, please proceed to ${roomName}, Doctor ${doctorName}. Thank you.`;
    const msgEn = new SpeechSynthesisUtterance(textEn);
    msgEn.lang = 'en-IN';
    msgEn.rate = speechRate;
    msgEn.pitch = speechPitch;

    if (voiceMode === 'FULL_TAMIL_ENGLISH') {
      // FULL TAMIL FIRST, THEN FULL ENGLISH!
      window.speechSynthesis.speak(msgTamil);
      setTimeout(() => {
        window.speechSynthesis.speak(msgEn);
      }, 4200);
    } else if (voiceMode === 'TAMIL_ONLY') {
      // FULL TAMIL ONLY
      window.speechSynthesis.speak(msgTamil);
    } else {
      // FULL ENGLISH ONLY
      window.speechSynthesis.speak(msgEn);
    }
  };

  const simulateCallToken = (code: string, room: string, doc: string, priority = 'NORMAL', direction = 'Left Corridor - Room 101') => {
    const newCall = {
      displayCode: code,
      patientName: 'Demo Patient',
      counterName: room,
      roomNumber: room.replace('Room ', ''),
      doctorName: doc,
      direction,
      priorityType: priority,
      triageLevel: priority === 'EMERGENCY' ? 'RED_CRITICAL' : 'GREEN_ROUTINE',
      calledAt: new Date().toISOString()
    };

    setNowServing(newCall);
    setCalledHistory((prev) => [{ displayCode: code, counterName: room, doctorName: doc, time: new Date().toLocaleTimeString() }, ...prev.slice(0, 4)]);
    triggerVoiceAnnouncement(code, room, doc);
  };

  const speakTamilOnly = () => {
    const mode = voiceMode;
    setVoiceMode('TAMIL_ONLY');
    if (nowServing) {
      triggerVoiceAnnouncement(nowServing.displayCode, nowServing.counterName, nowServing.doctorName);
    } else {
      triggerVoiceAnnouncement('OPD-041', 'Room 101', 'Dr. Rajesh Sharma');
    }
    setTimeout(() => setVoiceMode(mode), 5000);
  };

  const speakEnglishOnly = () => {
    const mode = voiceMode;
    setVoiceMode('ENGLISH_ONLY');
    if (nowServing) {
      triggerVoiceAnnouncement(nowServing.displayCode, nowServing.counterName, nowServing.doctorName);
    } else {
      triggerVoiceAnnouncement('OPD-041', 'Room 101', 'Dr. Rajesh Sharma');
    }
    setTimeout(() => setVoiceMode(mode), 5000);
  };

  const speakDualFull = () => {
    setVoiceMode('FULL_TAMIL_ENGLISH');
    if (nowServing) {
      triggerVoiceAnnouncement(nowServing.displayCode, nowServing.counterName, nowServing.doctorName);
    } else {
      triggerVoiceAnnouncement('OPD-041', 'Room 101', 'Dr. Rajesh Sharma');
    }
  };

  const toggleFullScreenMode = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setFullScreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setFullScreen(false);
    }
  };

  return (
    <div className="w-full space-y-6 bg-slate-950 min-h-screen text-white p-4 sm:p-6 rounded-3xl border border-slate-800 shadow-2xl overflow-x-hidden">
      
      {/* Top Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3.5">
          <div className="bg-gradient-to-tr from-teal-600 via-sky-600 to-teal-400 p-3 rounded-2xl text-white shadow-lg shadow-teal-500/20 flex-shrink-0">
            <Monitor className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2 flex-wrap gap-1">
              <h1 className="font-black text-xl sm:text-2xl tracking-tight text-white">AIIPH PUBLIC OPD WAITING HALL</h1>
              <span className="bg-teal-500/20 text-teal-300 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-teal-400/30">
                MANDATORY FULL TAMIL + ENGLISH VOICE (தமிழ் + ENGLISH)
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Full Bilingual Audio Announcer • All India Institute of Public Health</p>
          </div>
        </div>

        {/* Top Controls & Instant Audio Test Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          
          <button
            onClick={speakDualFull}
            className="flex items-center space-x-1.5 bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-500 hover:to-sky-500 text-white font-extrabold px-3.5 py-2 rounded-xl text-xs shadow-lg transition"
          >
            <Volume2 className="w-4 h-4 text-white animate-pulse" />
            <span>FULL DUAL VOICE (TAMIL + ENGLISH)</span>
          </button>

          <button
            onClick={speakTamilOnly}
            className="flex items-center space-x-1 bg-sky-900 hover:bg-sky-800 text-sky-200 font-bold px-3 py-2 rounded-xl text-xs border border-sky-700 transition"
          >
            <span>🔊 Full Tamil (தமிழ்)</span>
          </button>

          <button
            onClick={speakEnglishOnly}
            className="flex items-center space-x-1 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold px-3 py-2 rounded-xl text-xs border border-slate-700 transition"
          >
            <span>🔊 Full English</span>
          </button>

          <button
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className={`p-2 rounded-xl border ${voiceEnabled ? 'bg-teal-950 text-teal-300 border-teal-800' : 'bg-slate-900 text-slate-400 border-slate-800'}`}
            title="Toggle Audio"
          >
            {voiceEnabled ? <Volume2 className="w-4 h-4 text-teal-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          <button
            onClick={toggleFullScreenMode}
            className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-800"
            title="Toggle Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          <div className="bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-xl text-right">
            <p className="font-mono font-black text-sky-400 text-xs sm:text-sm">{currentTime}</p>
          </div>

        </div>
      </div>

      {/* Voice Mode Selector & Voice Config Toolbar */}
      <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-xs">
          
          <div className="flex items-center space-x-2 flex-wrap gap-2">
            <Languages className="w-4 h-4 text-teal-400 flex-shrink-0" />
            <span className="font-extrabold text-slate-200">Mandatory Audio Mode:</span>
            
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 font-bold">
              <button
                onClick={() => setVoiceMode('FULL_TAMIL_ENGLISH')}
                className={`px-3 py-1 rounded-lg transition ${voiceMode === 'FULL_TAMIL_ENGLISH' ? 'bg-gradient-to-r from-teal-600 to-sky-600 text-white shadow' : 'text-slate-400'}`}
              >
                ✓ FULL TAMIL + ENGLISH (தமிழ் + English)
              </button>
              <button
                onClick={() => setVoiceMode('TAMIL_ONLY')}
                className={`px-3 py-1 rounded-lg transition ${voiceMode === 'TAMIL_ONLY' ? 'bg-sky-600 text-white shadow' : 'text-slate-400'}`}
              >
                FULL TAMIL ONLY (தமிழ்)
              </button>
              <button
                onClick={() => setVoiceMode('ENGLISH_ONLY')}
                className={`px-3 py-1 rounded-lg transition ${voiceMode === 'ENGLISH_ONLY' ? 'bg-slate-800 text-slate-200' : 'text-slate-500'}`}
              >
                FULL ENGLISH ONLY
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-400 font-semibold">Active Voice Engine:</span>
            <select
              value={selectedVoiceURI}
              onChange={(e) => setSelectedVoiceURI(e.target.value)}
              className="bg-slate-950 text-teal-300 border border-slate-700 font-bold text-xs px-2.5 py-1 rounded-xl outline-none max-w-xs truncate"
            >
              {availableVoices.map((v) => (
                <option key={v.voiceURI} value={v.voiceURI}>
                  {v.name} ({v.lang})
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Instant Voice Call Simulator Buttons */}
        <div className="flex items-center space-x-2 pt-2 border-t border-slate-800/80 flex-wrap gap-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Simulate Patient Call:</span>
          
          <button
            onClick={() => simulateCallToken('OPD-041', 'Room 101', 'Dr. Rajesh Sharma')}
            className="bg-teal-600 hover:bg-teal-500 text-white font-black px-3.5 py-1.5 rounded-xl text-xs shadow transition flex items-center space-x-1"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Call OPD-041 (Room 101) [FULL TAMIL + ENGLISH]</span>
          </button>

          <button
            onClick={() => simulateCallToken('EMG-001', 'Trauma Triage', 'Dr. Vikram Sethi', 'EMERGENCY')}
            className="bg-rose-600 hover:bg-rose-500 text-white font-black px-3.5 py-1.5 rounded-xl text-xs shadow transition flex items-center space-x-1"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Call Red-Tag EMG-001 (Trauma) 🚨</span>
          </button>

          <button
            onClick={() => simulateCallToken('LAB-015', 'Lab Hall B', 'Lab Staff B')}
            className="bg-purple-600 hover:bg-purple-500 text-white font-black px-3 py-1.5 rounded-xl text-xs shadow transition flex items-center space-x-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Call LAB-015 (Pathology)</span>
          </button>
        </div>
      </div>

      {/* Main Grid: NOW SERVING (8 Cols) vs HISTORY (4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* NOW SERVING SPOTLIGHT CARD (8 Cols) */}
        <div className={`lg:col-span-8 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden flex flex-col justify-between min-h-[380px] border transition-all duration-500 ${
          nowServing?.priorityType === 'EMERGENCY'
            ? 'bg-gradient-to-tr from-rose-950 via-slate-950 to-red-950 border-rose-500 animate-pulse-subtle'
            : 'bg-gradient-to-tr from-slate-900 via-slate-950 to-teal-950/80 border-teal-500/40'
        }`}>
          <div className="absolute right-0 top-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex justify-between items-center relative z-10 flex-wrap gap-2">
            <span className="text-xs font-black uppercase tracking-widest text-teal-400 bg-teal-950/90 px-3.5 py-1.5 rounded-full border border-teal-800 flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-ping" />
              <span>NOW SERVING / தற்போது அழைக்கப்படுகிறது</span>
            </span>

            {nowServing?.priorityType === 'EMERGENCY' && (
              <span className="text-xs font-black bg-rose-600 text-white px-3.5 py-1.5 rounded-full uppercase animate-bounce shadow-xl flex items-center space-x-1">
                <Flame className="w-4 h-4 fill-white" />
                <span>RED EMERGENCY TRIAGE</span>
              </span>
            )}
          </div>

          {nowServing ? (
            <div className="text-center space-y-3 relative z-10 py-2">
              <h1 className="text-7xl sm:text-8xl lg:text-9xl font-black text-white tracking-tight drop-shadow-2xl animate-pulse-subtle">
                {nowServing.displayCode}
              </h1>

              <div className="bg-slate-900/95 p-4 rounded-3xl border border-slate-800 inline-block space-y-1 shadow-xl">
                <h3 className="text-2xl font-black text-teal-300">{nowServing.counterName}</h3>
                <p className="text-sm font-bold text-slate-200">{nowServing.doctorName}</p>
                <div className="pt-2 flex items-center justify-center space-x-1 text-xs text-sky-400 font-extrabold">
                  <Navigation className="w-4 h-4 text-sky-400" />
                  <span>Direction: {nowServing.direction}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 space-y-2 text-slate-400">
              <Clock className="w-12 h-12 mx-auto text-slate-600 animate-pulse-subtle" />
              <p className="text-sm font-bold text-slate-300">Awaiting Next Patient Call</p>
              <p className="text-xs text-slate-500">Tokens called by OPD Doctors will flash here automatically.</p>
            </div>
          )}

          <div className="bg-slate-950/80 p-3.5 rounded-2xl text-center text-xs text-slate-300 border border-slate-800/80 relative z-10 font-medium">
            Please keep physical ticket ready. • அறைக்கு நுழையும் போது டிக்கெட்டை தயாராக வைக்கவும்.
          </div>
        </div>

        {/* RECENTLY CALLED HISTORY (4 Cols) */}
        <div className="lg:col-span-4 bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center space-x-2 border-b border-slate-800 pb-3">
              <Clock className="w-4 h-4 text-sky-400" />
              <span>Recently Called Tokens</span>
            </h3>

            <div className="space-y-2">
              {calledHistory.map((item, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-black text-lg text-white">{item.displayCode}</span>
                    <p className="text-[11px] text-teal-400 font-bold">{item.counterName}</p>
                    <p className="text-[10px] text-slate-400">{item.doctorName}</p>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded-lg">
                    {item.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* ALL OPD ROOMS LIVE STATUS GRID */}
      <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 space-y-4">
        <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center space-x-2 border-b border-slate-800 pb-3">
          <Building2 className="w-4 h-4 text-teal-400" />
          <span>All OPD Consultation Rooms & Direction Guidance</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {departmentCalls.map((d, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-black text-slate-200 text-sm">{d.room}</span>
                  <p className="text-[11px] text-slate-400 font-semibold">{d.dept}</p>
                </div>
                <span className="font-mono font-black text-teal-300 bg-teal-950 px-2.5 py-1 rounded-xl border border-teal-800 text-sm">
                  {d.currentToken}
                </span>
              </div>
              <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1 border-t border-slate-900">
                <span>{d.doctor}</span>
                <span className="text-sky-400 font-bold">{d.direction}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rotating Trilingual Announcement Ticker */}
      <div className="bg-teal-950 text-teal-200 p-3 rounded-2xl border border-teal-800 text-xs font-bold flex items-center space-x-3 overflow-hidden">
        <span className="bg-teal-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase flex-shrink-0">
          ANNOUNCEMENT
        </span>
        <marquee className="truncate font-medium">
          Senior citizens and emergency red-tag patients receive priority routing. • முதியவர்கள் மற்றும் அவசர நோயாளிகளுக்கு முன்னுரிமை வழங்கப்படும். • Ayushman Bharat helpdesk Counter 1.
        </marquee>
      </div>

    </div>
  );
};
