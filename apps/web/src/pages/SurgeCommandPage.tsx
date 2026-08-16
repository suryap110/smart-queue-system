import React, { useState } from 'react';
import { api } from '../services/api';
import { useAuthStore } from '../store/useAuthStore';
import { useLangStore } from '../store/useLangStore';
import { 
  AlertOctagon, ShieldAlert, Radio, Bell, CheckCircle2, Siren, Zap,
  Activity, HeartPulse, Building2, Flame, ShieldCheck, RefreshCw, AlertTriangle
} from 'lucide-react';

export const SurgeCommandPage: React.FC = () => {
  const { user } = useAuthStore();
  const { t } = useLangStore();

  const [surgeLevel, setSurgeLevel] = useState<'LEVEL_1_ELEVATED' | 'LEVEL_2_MASS_CASUALTY' | 'LEVEL_3_CRITICAL_ICU'>('LEVEL_2_MASS_CASUALTY');
  const [isSurgeActive, setIsSurgeActive] = useState(false);
  const [broadcastText, setBroadcastText] = useState('EMERGENCY SURGE: Mass Casualty Protocol Active. All non-urgent counters re-allocated to Trauma Triage.');
  
  const [icuBedCount, setIcuBedCount] = useState(24);
  const [maxIcuBeds] = useState(30);
  const [ventilatorCount, setVentilatorCount] = useState(12);
  const [maxVentilators] = useState(15);

  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  const handleToggleSurge = async () => {
    setIsSurgeActive(!isSurgeActive);
    if (!isSurgeActive) {
      setActionSuccessMsg('🚨 DISASTER SURGE PROTOCOL ACTIVATED! Re-allocated 10 counters to Trauma Bays, Broadcast sent to all TV displays & Kiosks.');
    } else {
      setActionSuccessMsg('✓ Disaster Surge Protocol Deactivated. Hospital counters reverted to Normal OPD Flow.');
    }
  };

  const allocateEmergencyBeds = () => {
    setIcuBedCount(Math.min(maxIcuBeds, icuBedCount + 2));
    setVentilatorCount(Math.min(maxVentilators, ventilatorCount + 1));
    setActionSuccessMsg('⚡ Emergency ICU Beds & Ventilator Units Dispatched to Trauma Bay.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      
      {/* Disaster Header Banner */}
      <div className={`p-8 rounded-3xl text-white shadow-2xl transition-all border relative overflow-hidden ${
        isSurgeActive
          ? 'bg-gradient-to-r from-rose-950 via-red-900 to-rose-950 border-rose-500 animate-pulse'
          : 'bg-gradient-to-r from-slate-950 via-slate-900 to-rose-950 border-slate-800'
      }`}>
        <div className="absolute right-0 top-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-2">
          <div className="flex items-center space-x-2 text-rose-400 text-xs font-bold uppercase tracking-widest">
            <Siren className="w-5 h-5 text-rose-400 animate-spin" />
            <span>Disaster Preparedness & AI Mass Casualty Surge Console</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-black tracking-tight">
            Hospital Mass Casualty & Disaster Surge Command
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl">
            1-Click emergency counter reallocation, automated public display broadcast ticker, ICU ventilator bed telemetry, and high-priority trauma triage bypass.
          </p>
        </div>
      </div>

      {actionSuccessMsg && (
        <div className="bg-rose-600 text-white p-4 rounded-2xl text-xs font-bold flex items-center justify-between shadow-lg border border-rose-500 animate-in fade-in duration-300">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>{actionSuccessMsg}</span>
          </div>
          <button onClick={() => setActionSuccessMsg(null)} className="text-white hover:underline text-[10px]">Dismiss</button>
        </div>
      )}

      {/* 2-Column Command Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Command Controls (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-8 border border-slate-200 shadow-md space-y-6">
          
          <div className="space-y-3">
            <label className="block text-xs font-black uppercase text-slate-400 tracking-wider">
              Step 1: Select Disaster Emergency Level
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'LEVEL_1_ELEVATED', label: 'Level 1: Elevated OPD', desc: 'Shift 2 counters to Triage' },
                { id: 'LEVEL_2_MASS_CASUALTY', label: 'Level 2: Mass Casualty', desc: 'Shift 6 counters to Trauma' },
                { id: 'LEVEL_3_CRITICAL_ICU', label: 'Level 3: Critical ICU Lock', desc: 'Full Emergency Bypass' }
              ].map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setSurgeLevel(lvl.id as any)}
                  className={`p-4 rounded-2xl border text-left transition ${
                    surgeLevel === lvl.id
                      ? 'border-rose-600 bg-rose-50 text-rose-950 ring-2 ring-rose-500/30 font-extrabold shadow'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-slate-50/50'
                  }`}
                >
                  <h4 className="text-xs font-extrabold text-slate-900">{lvl.label}</h4>
                  <p className="text-[11px] text-slate-500 mt-1">{lvl.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-slate-400 tracking-wider mb-2">
              Step 2: Emergency Ticker Broadcast (All TV Displays & Kiosks)
            </label>
            <textarea
              rows={3}
              value={broadcastText}
              onChange={(e) => setBroadcastText(e.target.value)}
              className="w-full p-4 rounded-2xl border border-slate-300 text-xs font-semibold outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <button
            onClick={handleToggleSurge}
            className={`w-full font-black py-4 rounded-2xl shadow-xl transition text-sm flex items-center justify-center space-x-2 text-white ${
              isSurgeActive
                ? 'bg-slate-900 hover:bg-slate-800'
                : 'bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 hover:from-rose-500 hover:to-red-500'
            }`}
          >
            <AlertOctagon className="w-5 h-5" />
            <span>{isSurgeActive ? 'DEACTIVATE DISASTER SURGE PROTOCOL' : 'ACTIVATE DISASTER SURGE OVERRIDE'}</span>
          </button>

        </div>

        {/* ICU & Ventilator Bed Telemetry (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-950 text-white rounded-3xl p-6 border border-slate-800 shadow-xl space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-[10px] font-mono font-bold text-rose-400 uppercase">ICU & Trauma Bed Live Telemetry</span>

            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-extrabold text-slate-300">ICU Emergency Beds:</span>
                <span className="font-mono font-black text-rose-400 text-sm">{icuBedCount} / {maxIcuBeds} Occupied</span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div className="h-full bg-rose-600 transition-all duration-300" style={{ width: `${(icuBedCount / maxIcuBeds) * 100}%` }} />
              </div>
            </div>

            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-extrabold text-slate-300">Active Ventilator Units:</span>
                <span className="font-mono font-black text-amber-400 text-sm">{ventilatorCount} / {maxVentilators} Active</span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 transition-all duration-300" style={{ width: `${(ventilatorCount / maxVentilators) * 100}%` }} />
              </div>
            </div>
          </div>

          <button
            onClick={allocateEmergencyBeds}
            className="w-full py-3.5 bg-rose-600 hover:bg-rose-500 text-white font-extrabold rounded-2xl text-xs shadow-lg transition flex items-center justify-center space-x-2"
          >
            <Zap className="w-4 h-4" />
            <span>Dispatch Emergency ICU & Ventilator Units</span>
          </button>
        </div>

      </div>

    </div>
  );
};
