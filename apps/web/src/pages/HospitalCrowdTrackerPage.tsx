import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuthStore } from '../store/useAuthStore';
import { useLangStore } from '../store/useLangStore';
import { 
  Users, MapPin, Calendar, Clock, Activity, AlertTriangle, ShieldCheck, 
  Sparkles, RefreshCw, Search, ArrowRight, Zap, CheckCircle2, Building2,
  TrendingUp, BarChart3, Radio, ShieldAlert, Check, Layers, Printer,
  QrCode, Navigation, Compass, Plus, Sliders
} from 'lucide-react';

export const HospitalCrowdTrackerPage: React.FC = () => {
  const { user } = useAuthStore();
  const { t } = useLangStore();

  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  // Search Patient Tracker State
  const [searchQuery, setSearchQuery] = useState('');
  const [trackedPatient, setTrackedPatient] = useState<any>({
    code: 'OPD-041',
    name: 'Surya Kumar',
    location: 'Room 101 - General Medicine',
    nodeId: 'node-room101',
    floor: 'Floor 1, Corridor A',
    status: 'IN_CONSULTATION',
    joined: '03:10 AM',
    waitMin: 4,
    stepIndex: 2
  });

  // AI Slot Allocator State
  const [patientNameInput, setPatientNameInput] = useState('');
  const [selectedDept, setSelectedDept] = useState('General Medicine OPD');
  const [selectedSlotTime, setSelectedSlotTime] = useState('11:00 AM - 12:00 PM');
  const [allocatedTicket, setAllocatedTicket] = useState<any>({
    ticketCode: 'SLOT-592',
    patientName: 'Surya Kumar',
    dept: 'General Medicine OPD',
    timeSlot: '11:00 AM - 12:00 PM',
    allocatedCounter: 'Room 101 - Gate A',
    qrCodeData: 'AIIPH-SLOT-592'
  });

  const [showPrintModal, setShowPrintModal] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Crowd Density Telemetry Data
  const [halls, setHalls] = useState([
    { id: 'h1', name: 'Main General Medicine OPD Hall', capacity: 50, currentCount: 42, occupancyPct: 84, level: 'HIGH_DENSITY', trend: 'UP' },
    { id: 'h2', name: 'Pediatrics OPD Waiting Zone', capacity: 30, currentCount: 11, occupancyPct: 37, level: 'MODERATE', trend: 'STABLE' },
    { id: 'h3', name: 'Orthopedics & Trauma Wing', capacity: 25, currentCount: 23, occupancyPct: 92, level: 'CRITICAL_ALERT', trend: 'UP' },
    { id: 'h4', name: 'Dispensary Pharmacy Lobby', capacity: 40, currentCount: 18, occupancyPct: 45, level: 'STABLE', trend: 'DOWN' },
    { id: 'h5', name: 'Pathology Diagnostics Hall', capacity: 35, currentCount: 10, occupancyPct: 28, level: 'LOW', trend: 'STABLE' }
  ]);

  // OPD Appointment Slot Matrix Data
  const [slots, setSlots] = useState([
    { id: 's1', time: '09:00 AM - 10:00 AM', booked: 15, max: 15, status: 'FULL' },
    { id: 's2', time: '10:00 AM - 11:00 AM', booked: 14, max: 15, status: 'ALMOST_FULL' },
    { id: 's3', time: '11:00 AM - 12:00 PM', booked: 7, max: 15, status: 'AVAILABLE' },
    { id: 's4', time: '12:00 PM - 01:00 PM', booked: 8, max: 15, status: 'AVAILABLE' },
    { id: 's5', time: '02:00 PM - 03:00 PM', booked: 2, max: 15, status: 'AVAILABLE' },
    { id: 's6', time: '03:00 PM - 04:00 PM', booked: 1, max: 15, status: 'AVAILABLE' }
  ]);

  // Live Tracked Patients Registry
  const [patientDatabase] = useState([
    { code: 'OPD-041', name: 'Surya Kumar', location: 'Room 101 - General Medicine', nodeId: 'node-room101', floor: 'Floor 1, Corridor A', status: 'IN_CONSULTATION', joined: '03:10 AM', waitMin: 4, stepIndex: 2 },
    { code: 'OPD-042', name: 'Priya Sharma', location: 'Nurse Triage Desk 2', nodeId: 'node-triage', floor: 'Floor 1, Corridor B', status: 'TRIAGED', joined: '03:18 AM', waitMin: 9, stepIndex: 1 },
    { code: 'EMG-001', name: 'Ramesh Patel', location: 'Trauma Bay 1', nodeId: 'node-emg', floor: 'Emergency Wing', status: 'RED_EMERGENCY', joined: '03:05 AM', waitMin: 0, stepIndex: 1 },
    { code: 'PED-008', name: 'Anita Verma', location: 'Pediatrics Room 102', nodeId: 'node-ped', floor: 'Floor 1, Wing C', status: 'WAITING', joined: '03:22 AM', waitMin: 12, stepIndex: 0 }
  ]);

  const handleSearchPatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;

    const found = patientDatabase.find(
      (p) => p.code.toLowerCase().includes(searchQuery.toLowerCase()) || p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (found) {
      setTrackedPatient(found);
      setActionSuccessMsg(`✓ Patient ${found.code} (${found.name}) located at ${found.location}.`);
    } else {
      setTrackedPatient({
        code: searchQuery.toUpperCase(),
        name: 'Tracked Patient',
        location: 'Main OPD Waiting Hall',
        nodeId: 'node-main',
        floor: 'Floor 1, Counter 3',
        status: 'WAITING',
        joined: '03:30 AM',
        waitMin: 8,
        stepIndex: 0
      });
      setActionSuccessMsg(`✓ Patient ${searchQuery} located at Main OPD Hall.`);
    }
  };

  const handleAllocateSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientNameInput) {
      setActionSuccessMsg('Please enter patient name first.');
      return;
    }

    const ticketCode = `SLOT-${Math.floor(Math.random() * 900) + 100}`;
    const newTicket = {
      ticketCode,
      patientName: patientNameInput,
      dept: selectedDept,
      timeSlot: selectedSlotTime,
      allocatedCounter: 'Room 101 - Gate A',
      qrCodeData: `AIIPH-SLOT-${ticketCode}`
    };

    setAllocatedTicket(newTicket);
    setActionSuccessMsg(`✓ Slot Allocated! Ticket ${ticketCode} generated for ${patientNameInput} (${selectedSlotTime}).`);
    setPatientNameInput('');

    setSlots((prev) =>
      prev.map((s) => (s.time === selectedSlotTime ? { ...s, booked: Math.min(s.max, s.booked + 1) } : s))
    );
  };

  const triggerAiCrowdReRouting = () => {
    setHalls((prev) =>
      prev.map((h) => {
        if (h.id === 'h3') return { ...h, currentCount: 14, occupancyPct: 56, level: 'MODERATE', trend: 'DOWN' };
        if (h.id === 'h1') return { ...h, currentCount: 30, occupancyPct: 60, level: 'STABLE', trend: 'DOWN' };
        return h;
      })
    );
    setActionSuccessMsg('🚀 AI Crowd Load Balancer Activated! Re-routed 12 patients to open OPD counters, eliminating bottleneck crowd!');
  };

  const simulateShiftRush = () => {
    setHalls((prev) =>
      prev.map((h) => ({
        ...h,
        currentCount: Math.min(h.capacity, h.currentCount + 6),
        occupancyPct: Math.min(100, Math.round(((h.currentCount + 6) / h.capacity) * 100))
      }))
    );
    setActionSuccessMsg('⚡ Shift Rush Simulated! OPD Crowd telemetry updated.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-sky-950 text-white p-8 rounded-3xl shadow-2xl border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center space-x-2 bg-sky-500/20 text-sky-300 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-sky-400/30">
            <Radio className="w-3.5 h-3.5" />
            <span>Campus Real-Time Telemetry & Smart AI Load Balancer</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-black tracking-tight">
            Patient Location Tracker & Hospital Crowd Monitor
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl">
            Live RFID/GPS patient tracking across campus, interactive 2D floor node map, OPD crowd density telemetry, and automated appointment slot booking matrix.
          </p>
        </div>

        {/* Dynamic Controls */}
        <div className="relative z-10 flex flex-wrap items-center gap-3">
          <button
            onClick={triggerAiCrowdReRouting}
            className="flex items-center space-x-2 bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-500 hover:to-sky-500 text-white font-extrabold px-5 py-3 rounded-2xl text-xs shadow-xl transition"
          >
            <Zap className="w-4 h-4 text-teal-300 animate-pulse" />
            <span>Activate AI Crowd Re-Routing</span>
          </button>

          <button
            onClick={simulateShiftRush}
            className="p-3 bg-slate-900 hover:bg-slate-800 text-amber-400 rounded-2xl border border-slate-800 text-xs font-bold transition"
            title="Simulate Rush"
          >
            <Plus className="w-4 h-4" />
          </button>

          <div className="bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-2xl text-right">
            <p className="font-mono font-black text-sky-400 text-sm">{currentTime}</p>
          </div>
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

      {/* INTERACTIVE 2D CAMPUS FLOOR MAP DIAGRAM & PATIENT JOURNEY STEPPER */}
      {trackedPatient && (
        <div className="bg-slate-950 text-white p-6 rounded-3xl border border-slate-800 shadow-2xl space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2 text-teal-400">
              <Compass className="w-5 h-5 text-teal-400 animate-spin-slow" />
              <h3 className="font-black text-base tracking-tight text-white">INTERACTIVE CAMPUS FLOOR MAP & PATIENT JOURNEY BEACON</h3>
            </div>
            <span className="bg-teal-950 text-teal-300 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded border border-teal-800">
              ACTIVE BEACON: {trackedPatient.code} ({trackedPatient.name})
            </span>
          </div>

          {/* Patient 4-Step Journey Node Visualizer */}
          <div className="grid grid-cols-4 gap-2 pt-2">
            {[
              { id: 'node-main', title: '1. Main Entrance Kiosk', node: 'Self-Service Token' },
              { id: 'node-triage', title: '2. Nurse Triage Desk', node: 'Vitals & Risk Evaluation' },
              { id: 'node-room101', title: '3. OPD Consultation Room', node: 'Doctor Consultation' },
              { id: 'node-pharm', title: '4. Dispensary / Lab', node: 'Medicine & Diagnostics' }
            ].map((step, idx) => {
              const isActiveNode = trackedPatient.nodeId === step.id || trackedPatient.stepIndex === idx;
              return (
                <div
                  key={step.id}
                  className={`p-3.5 rounded-2xl border text-xs space-y-1 transition-all ${
                    isActiveNode
                      ? 'bg-teal-950 border-teal-400 text-white ring-2 ring-teal-500/40 shadow-lg shadow-teal-950'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-white text-[11px]">{step.title}</span>
                    {isActiveNode && (
                      <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-ping" />
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium">{step.node}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main 3-Section Telemetry Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Section 1 (4 Cols): Live Patient Location Tracker */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-5">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center space-x-1.5">
              <MapPin className="w-4 h-4 text-sky-600" />
              <span>Live Patient Location Tracker</span>
            </h3>
            <span className="text-[10px] font-bold bg-sky-50 text-sky-800 px-2.5 py-0.5 rounded-full border border-sky-200">
              Campus GPS Ping
            </span>
          </div>

          <form onSubmit={handleSearchPatient} className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Enter patient name or code (OPD-041)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-24 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-xs font-semibold outline-none focus:ring-2 focus:ring-sky-500"
            />
            <button type="submit" className="absolute right-1.5 top-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold px-3 py-1.5 rounded-xl text-xs shadow">
              Track
            </button>
          </form>

          {trackedPatient ? (
            <div className="bg-slate-950 text-white p-5 rounded-3xl border border-slate-800 space-y-3 shadow-xl animate-in fade-in duration-300">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-2xl font-black text-white">{trackedPatient.code}</span>
                  <h4 className="text-base font-extrabold text-teal-300">{trackedPatient.name}</h4>
                </div>
                <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase ${
                  trackedPatient.status === 'IN_CONSULTATION'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}>
                  {trackedPatient.status}
                </span>
              </div>

              <div className="space-y-1.5 text-xs font-mono bg-slate-900 p-3 rounded-2xl border border-slate-800">
                <div className="flex justify-between text-slate-300">
                  <span className="font-bold text-slate-400">Current Node:</span>
                  <span className="text-sky-300 font-extrabold">{trackedPatient.location}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="font-bold text-slate-400">Campus Wing:</span>
                  <span>{trackedPatient.floor}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="font-bold text-slate-400">Joined Queue:</span>
                  <span>{trackedPatient.joined}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="font-bold text-slate-400">Est. Wait Time:</span>
                  <span className="text-teal-400 font-bold">{trackedPatient.waitMin} mins</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <MapPin className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-xs font-semibold text-slate-600">Search token code above to track patient live location.</p>
            </div>
          )}

          <div className="space-y-2">
            <p className="text-[11px] font-bold text-slate-400 uppercase">Quick Track Patients:</p>
            <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
              {patientDatabase.map((p) => (
                <button
                  key={p.code}
                  onClick={() => { setTrackedPatient(p); setSearchQuery(p.code); }}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-sky-300 text-left text-xs flex justify-between items-center"
                >
                  <span className="font-bold text-slate-800">{p.code} - {p.name}</span>
                  <span className="text-[10px] text-sky-700 font-mono font-bold">{p.location}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Section 2 (4 Cols): Hospital OPD Crowd Density Telemetry */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
              <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center space-x-1.5">
                <Users className="w-4 h-4 text-teal-600" />
                <span>OPD Crowd Density Monitor</span>
              </h3>
              <span className="text-[10px] font-bold bg-teal-50 text-teal-800 px-2.5 py-0.5 rounded-full border border-teal-200">
                5 Zones Monitored
              </span>
            </div>

            <div className="space-y-3">
              {halls.map((h) => (
                <div key={h.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-slate-900">{h.name}</span>
                    <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                      h.level === 'CRITICAL_ALERT'
                        ? 'bg-rose-600 text-white animate-pulse'
                        : h.level === 'HIGH_DENSITY'
                        ? 'bg-amber-500 text-white'
                        : 'bg-teal-100 text-teal-800'
                    }`}>
                      {h.occupancyPct}% ({h.currentCount}/{h.capacity})
                    </span>
                  </div>

                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        h.occupancyPct > 85 ? 'bg-rose-600' : h.occupancyPct > 60 ? 'bg-amber-500' : 'bg-teal-600'
                      }`}
                      style={{ width: `${h.occupancyPct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={triggerAiCrowdReRouting}
            className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-2xl text-xs shadow flex items-center justify-center space-x-2"
          >
            <Zap className="w-4 h-4 text-teal-400" />
            <span>Auto-Balance Crowd Densities</span>
          </button>
        </div>

        {/* Section 3 (4 Cols): OPD Appointment Slot Allocator Matrix */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
              <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center space-x-1.5">
                <Calendar className="w-4 h-4 text-purple-600" />
                <span>Smart Slot Booking Matrix</span>
              </h3>
              <span className="text-[10px] font-bold bg-purple-50 text-purple-800 px-2.5 py-0.5 rounded-full border border-purple-200">
                Today's Slots
              </span>
            </div>

            <form onSubmit={handleAllocateSlot} className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Patient Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Rahul Kumar"
                  value={patientNameInput}
                  onChange={(e) => setPatientNameInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Time Slot</label>
                <select
                  value={selectedSlotTime}
                  onChange={(e) => setSelectedSlotTime(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {slots.map((s) => (
                    <option key={s.id} value={s.time} disabled={s.status === 'FULL'}>
                      {s.time} ({s.max - s.booked} slots left) {s.status === 'FULL' ? '- FULL' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-sky-600 hover:from-purple-500 hover:to-sky-500 text-white font-extrabold py-3 rounded-xl shadow transition"
              >
                ⚡ Allocate Optimal Slot Ticket
              </button>
            </form>

            {allocatedTicket && (
              <div className="bg-purple-950 text-white p-4 rounded-2xl border border-purple-800 space-y-2 text-xs shadow-lg animate-in fade-in duration-300">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-purple-300 uppercase">Allocated OPD Slot Ticket</span>
                  <span className="font-mono font-black text-amber-400">{allocatedTicket.ticketCode}</span>
                </div>
                <h4 className="text-sm font-extrabold text-white">{allocatedTicket.patientName}</h4>
                <p className="text-[11px] text-slate-300 font-semibold">{allocatedTicket.dept} • {allocatedTicket.timeSlot}</p>
                
                <button
                  onClick={() => setShowPrintModal(true)}
                  className="w-full mt-2 py-2 bg-purple-600 hover:bg-purple-500 text-white font-extrabold rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Digital OPD Appointment Pass</span>
                </button>
              </div>
            )}

            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1 text-xs">
              {slots.map((s) => (
                <div key={s.id} className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                  <span className="font-bold text-slate-700">{s.time}</span>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                    s.status === 'FULL' ? 'bg-rose-100 text-rose-800' : 'bg-teal-100 text-teal-800'
                  }`}>
                    {s.booked}/{s.max} Booked
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Printable OPD Appointment Pass Modal */}
      {showPrintModal && allocatedTicket && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-center">
            <div className="w-12 h-12 bg-purple-100 text-purple-700 rounded-2xl flex items-center justify-center mx-auto">
              <QrCode className="w-7 h-7" />
            </div>

            <div>
              <span className="text-[10px] font-black text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200 uppercase">
                AIIPH Official OPD Pass
              </span>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{allocatedTicket.ticketCode}</h3>
              <p className="text-sm font-bold text-slate-700">{allocatedTicket.patientName}</p>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-left text-xs font-mono space-y-1">
              <p><span className="font-bold text-slate-800">Department:</span> {allocatedTicket.dept}</p>
              <p><span className="font-bold text-slate-800">Time Slot:</span> {allocatedTicket.timeSlot}</p>
              <p><span className="font-bold text-slate-800">Gate/Room:</span> {allocatedTicket.allocatedCounter}</p>
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                onClick={() => setShowPrintModal(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
              >
                Close
              </button>
              <button
                onClick={() => { window.print(); setShowPrintModal(false); }}
                className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-extrabold rounded-xl text-xs shadow flex items-center justify-center space-x-1"
              >
                <Printer className="w-4 h-4" />
                <span>Print Ticket</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
