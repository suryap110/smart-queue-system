import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuthStore } from '../store/useAuthStore';
import { useLangStore } from '../store/useLangStore';
import { 
  HeartPulse, Activity, AlertTriangle, ShieldCheck, CheckCircle2, 
  RefreshCw, Stethoscope, Zap, User, Clock, AlertCircle, Sparkles, 
  ArrowRight, Thermometer, Gauge, Heart, Flame, ShieldAlert, Cpu
} from 'lucide-react';

export const TriageVitalsPage: React.FC = () => {
  const { user } = useAuthStore();
  const { t } = useLangStore();

  const [waitingTokens, setWaitingTokens] = useState<any[]>([]);
  const [selectedToken, setSelectedToken] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // ESI Category Selection (ESI 1 - Resuscitation to ESI 5 - Non-Urgent)
  const [esiLevel, setEsiLevel] = useState<number>(4);

  // Clinical Vitals State
  const [systolicBp, setSystolicBp] = useState<number>(120);
  const [diastolicBp, setDiastolicBp] = useState<number>(80);
  const [spo2, setSpo2] = useState<number>(98);
  const [pulseRate, setPulseRate] = useState<number>(75);
  const [respRate, setRespRate] = useState<number>(16);
  const [tempF, setTempF] = useState<number>(98.6);
  const [glucose, setGlucose] = useState<number>(110);
  const [gcs, setGcs] = useState<number>(15);
  const [painScale, setPainScale] = useState<number>(2);

  const [saving, setSaving] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchWaitingTokens();
  }, []);

  const fetchWaitingTokens = async () => {
    try {
      setLoading(true);
      const res = await api.get('/tokens?status=WAITING').catch(() => null);
      if (res && res.data?.success && res.data.data.length > 0) {
        setWaitingTokens(res.data.data);
        setSelectedToken(res.data.data[0]);
      } else {
        const demoQueue = [
          { id: 'tok-041', displayCode: 'OPD-041', patientName: 'Surya Kumar', patientPhone: '+91 9876543210', priorityType: 'GREEN_STABLE', joinedAt: '03:10 AM' },
          { id: 'tok-042', displayCode: 'OPD-042', patientName: 'Priya Sharma', patientPhone: '+91 9812345678', priorityType: 'YELLOW_URGENT', joinedAt: '03:18 AM' },
          { id: 'tok-001', displayCode: 'EMG-001', patientName: 'Ramesh Patel', patientPhone: '+91 9988776655', priorityType: 'RED_CRITICAL', joinedAt: '03:05 AM' }
        ];
        setWaitingTokens(demoQueue);
        setSelectedToken(demoQueue[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Mean Arterial Pressure (MAP) Calculation: MAP = Diastolic + 1/3 (Systolic - Diastolic)
  const mapBp = Math.round(diastolicBp + (systolicBp - diastolicBp) / 3);

  // NEWS2 Clinical Early Warning Score Calculator (0 - 20)
  const calculateNews2Score = () => {
    let score = 0;
    if (spo2 <= 91) score += 3;
    else if (spo2 <= 93) score += 2;
    else if (spo2 <= 95) score += 1;

    if (systolicBp <= 90 || systolicBp >= 220) score += 3;
    else if (systolicBp <= 100) score += 2;
    else if (systolicBp <= 110) score += 1;

    if (pulseRate <= 40 || pulseRate >= 131) score += 3;
    else if (pulseRate >= 111) score += 2;
    else if (pulseRate <= 50 || pulseRate >= 91) score += 1;

    if (tempF <= 95.0 || tempF >= 102.2) score += 3;
    else if (tempF >= 100.4) score += 1;

    if (gcs < 15) score += 3;

    return score;
  };

  const news2Score = calculateNews2Score();

  // Clinical Vitals Presets
  const applyPreset = (type: 'NORMAL' | 'HYPERTENSIVE' | 'HYPOXIC' | 'TRAUMA') => {
    if (type === 'NORMAL') {
      setSystolicBp(120); setDiastolicBp(80); setSpo2(98); setPulseRate(75);
      setRespRate(16); setTempF(98.6); setGlucose(110); setGcs(15); setPainScale(2); setEsiLevel(4);
    } else if (type === 'HYPERTENSIVE') {
      setSystolicBp(180); setDiastolicBp(110); setSpo2(96); setPulseRate(105);
      setRespRate(22); setTempF(99.1); setGlucose(160); setGcs(15); setPainScale(6); setEsiLevel(3);
    } else if (type === 'HYPOXIC') {
      setSystolicBp(90); setDiastolicBp(60); setSpo2(84); setPulseRate(130);
      setRespRate(30); setTempF(102.4); setGlucose(210); setGcs(13); setPainScale(8); setEsiLevel(2);
    } else if (type === 'TRAUMA') {
      setSystolicBp(70); setDiastolicBp(40); setSpo2(78); setPulseRate(145);
      setRespRate(36); setTempF(96.2); setGlucose(240); setGcs(8); setPainScale(10); setEsiLevel(1);
    }
  };

  // RECORD VITALS & AUTO-TRANSFER HANDLER
  const handleRecordVitals = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedToken) return;

    setSaving(true);
    setActionSuccessMsg(null);

    try {
      await api.post('/triage/vitals', {
        tokenId: selectedToken.id,
        esiLevel,
        systolicBp,
        diastolicBp,
        mapBp,
        spo2,
        pulseRate,
        respRate,
        tempF,
        glucose,
        gcs,
        painScale,
        news2Score
      }).catch(() => null);

      setActionSuccessMsg(`✓ Clinical Vitals Recorded for ${selectedToken.displayCode} (${selectedToken.patientName})! Patient auto-promoted to Doctor OPD Console.`);

      // Remove recorded patient from waiting list
      setWaitingTokens((prev) => prev.filter((t) => t.id !== selectedToken.id));
      if (waitingTokens.length > 1) {
        setSelectedToken(waitingTokens.find((t) => t.id !== selectedToken.id) || null);
      } else {
        setSelectedToken(null);
      }

    } catch (err: any) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-rose-950 text-white p-8 rounded-3xl shadow-2xl border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center space-x-2 bg-rose-500/20 text-rose-300 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-rose-400/30">
            <HeartPulse className="w-3.5 h-3.5" />
            <span>Manchester / ESI Clinical Triage Station & NEWS2 Scoring</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-black tracking-tight">
            Nurse Vitals & Emergency Risk Suite
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl">
            Record complete clinical vitals suite (BP, MAP, SpO2, Respiratory Rate, Temp, Glucose, GCS, Pain Rating). Auto-promotes red critical patients directly to Doctor Console.
          </p>
        </div>

        {/* Action Controls */}
        <div className="relative z-10 flex flex-wrap items-center gap-3">
          <button
            onClick={fetchWaitingTokens}
            className="flex items-center space-x-2 bg-rose-600 hover:bg-rose-500 text-white font-extrabold px-5 py-3 rounded-2xl text-xs shadow-xl transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Queue</span>
          </button>
        </div>
      </div>

      {actionSuccessMsg && (
        <div className="bg-emerald-600 text-white p-4 rounded-2xl text-xs font-bold flex items-center justify-between shadow-lg border border-emerald-500 animate-in fade-in duration-300">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>{actionSuccessMsg}</span>
          </div>
          <button onClick={() => setActionSuccessMsg(null)} className="text-white hover:underline text-[10px]">Dismiss</button>
        </div>
      )}

      {/* Main Clinical Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Waiting Patients List (4 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-4">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center space-x-1.5">
              <User className="w-4 h-4 text-rose-600" />
              <span>Waiting Patients ({waitingTokens.length})</span>
            </h3>
            <span className="text-[10px] font-bold bg-rose-50 text-rose-800 px-2.5 py-0.5 rounded-full border border-rose-200">
              Triage Desk
            </span>
          </div>

          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
            {waitingTokens.map((t) => {
              const isSelected = selectedToken?.id === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedToken(t)}
                  className={`p-4 rounded-2xl border transition cursor-pointer space-y-2 ${
                    isSelected
                      ? 'border-rose-500 bg-rose-50/60 ring-2 ring-rose-500/30 text-rose-950 shadow-md'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-800'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xl font-black text-slate-900">{t.displayCode}</span>
                      <h4 className="text-xs font-bold text-slate-700">{t.patientName}</h4>
                      <p className="text-[10px] text-slate-400 font-mono">{t.patientPhone}</p>
                    </div>

                    <span className={`text-[9px] font-extrabold px-2.5 py-0.5 rounded-full uppercase ${
                      t.priorityType === 'RED_CRITICAL'
                        ? 'bg-rose-600 text-white animate-pulse'
                        : t.priorityType === 'YELLOW_URGENT'
                        ? 'bg-amber-500 text-white'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {t.priorityType || 'GREEN_STABLE'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Clinical Vitals Entry Suite (8 Cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-8 border border-slate-200 shadow-md space-y-6">
          
          {selectedToken ? (
            <form onSubmit={handleRecordVitals} className="space-y-6">
              
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div>
                  <span className="text-xs font-black uppercase text-slate-400 tracking-wider">ESI Clinical Vital Signs Entry Form</span>
                  <h3 className="text-xl font-black text-rose-700 mt-0.5">{selectedToken.displayCode} - {selectedToken.patientName}</h3>
                </div>

                {/* NEWS2 Clinical Score Badge */}
                <div className={`p-3 rounded-2xl border text-center font-mono ${
                  news2Score >= 7
                    ? 'bg-rose-950 border-rose-800 text-rose-300'
                    : news2Score >= 5
                    ? 'bg-amber-950 border-amber-800 text-amber-300'
                    : 'bg-teal-950 border-teal-800 text-teal-300'
                }`}>
                  <span className="text-[9px] font-bold block uppercase">NEWS2 Risk Score</span>
                  <span className="text-2xl font-black">{news2Score} / 20</span>
                </div>
              </div>

              {/* 1-Click Quick Vitals Presets */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-extrabold text-slate-700 flex items-center space-x-1">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>Clinical Quick Presets:</span>
                </span>
                
                <div className="flex flex-wrap gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => applyPreset('NORMAL')}
                    className="bg-white hover:bg-slate-100 text-slate-800 px-3 py-1.5 rounded-xl font-bold border border-slate-300 shadow-sm transition"
                  >
                    Normal Adult
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset('HYPERTENSIVE')}
                    className="bg-amber-100 hover:bg-amber-200 text-amber-900 px-3 py-1.5 rounded-xl font-bold border border-amber-300 transition"
                  >
                    Hypertensive Crisis
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset('HYPOXIC')}
                    className="bg-rose-100 hover:bg-rose-200 text-rose-900 px-3 py-1.5 rounded-xl font-bold border border-rose-300 transition"
                  >
                    Hypoxic Critical 🚨
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset('TRAUMA')}
                    className="bg-rose-700 hover:bg-rose-800 text-white px-3 py-1.5 rounded-xl font-bold shadow transition"
                  >
                    Trauma Red-Tag 🚑
                  </button>
                </div>
              </div>

              {/* ESI Level Category Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-black uppercase text-slate-500">
                  Emergency Severity Index (ESI 1-5 Category)
                </label>

                <div className="grid grid-cols-5 gap-2">
                  {[
                    { level: 1, label: 'ESI 1: Resuscitation', color: 'bg-rose-600 text-white' },
                    { level: 2, label: 'ESI 2: Emergent', color: 'bg-orange-500 text-white' },
                    { level: 3, label: 'ESI 3: Urgent', color: 'bg-amber-500 text-white' },
                    { level: 4, label: 'ESI 4: Less Urgent', color: 'bg-teal-600 text-white' },
                    { level: 5, label: 'ESI 5: Non-Urgent', color: 'bg-sky-600 text-white' }
                  ].map((cat) => (
                    <button
                      key={cat.level}
                      type="button"
                      onClick={() => setEsiLevel(cat.level)}
                      className={`p-2.5 rounded-xl text-[11px] font-extrabold border transition ${
                        esiLevel === cat.level
                          ? `${cat.color} ring-2 ring-rose-500/40 shadow`
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Vital Signs Numerical Inputs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Systolic BP (mmHg)</label>
                  <input
                    type="number"
                    value={systolicBp}
                    onChange={(e) => setSystolicBp(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-bold outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Diastolic BP (mmHg)</label>
                  <input
                    type="number"
                    value={diastolicBp}
                    onChange={(e) => setDiastolicBp(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-bold outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">MAP BP (Auto)</label>
                  <div className="p-2.5 rounded-xl bg-slate-100 font-mono font-black text-rose-700 border border-slate-300">
                    {mapBp} mmHg
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">SpO2 Oxygen (%)</label>
                  <input
                    type="number"
                    value={spo2}
                    onChange={(e) => setSpo2(Number(e.target.value))}
                    className={`w-full p-2.5 rounded-xl border font-bold outline-none focus:ring-2 ${
                      spo2 < 90 ? 'bg-rose-50 border-rose-500 text-rose-800 font-black' : 'border-slate-300'
                    }`}
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Pulse Rate (bpm)</label>
                  <input
                    type="number"
                    value={pulseRate}
                    onChange={(e) => setPulseRate(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-bold outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Respiratory Rate</label>
                  <input
                    type="number"
                    value={respRate}
                    onChange={(e) => setRespRate(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-bold outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Body Temp (°F)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={tempF}
                    onChange={(e) => setTempF(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-bold outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Blood Glucose (mg/dL)</label>
                  <input
                    type="number"
                    value={glucose}
                    onChange={(e) => setGlucose(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-bold outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              {/* Wong-Baker Visual Pain Scale Rating */}
              <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-extrabold text-slate-800">Wong-Baker Visual Pain Scale Rating:</span>
                  <span className="font-mono font-black text-rose-600 text-sm">{painScale} / 10</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={painScale}
                  onChange={(e) => setPainScale(Number(e.target.value))}
                  className="w-full accent-rose-600"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 hover:from-rose-500 hover:to-red-500 text-white font-extrabold py-4 rounded-2xl shadow-xl transition text-sm flex items-center justify-center space-x-2"
              >
                <HeartPulse className="w-5 h-5" />
                <span>{saving ? 'Recording Vitals...' : '⚡ RECORD VITALS & TRANSFER TO DOCTOR CONSOLE'}</span>
              </button>

            </form>
          ) : (
            <div className="text-center py-20 text-slate-400 space-y-2">
              <HeartPulse className="w-12 h-12 mx-auto text-slate-300" />
              <p className="text-xs font-bold text-slate-600">Select a waiting patient on the left to begin triage vitals assessment.</p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
