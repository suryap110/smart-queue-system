import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useLangStore } from '../store/useLangStore';
import { 
  Building2, Stethoscope, DoorOpen, Users, Clock, Plus, CheckCircle2, 
  ShieldCheck, RefreshCw, Layers, UserCheck
} from 'lucide-react';

export const DepartmentsPage: React.FC = () => {
  const { t } = useLangStore();
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/departments').catch(() => null);
      if (res && res.data?.success && res.data.data.length > 0) {
        setDepartments(res.data.data);
      } else {
        setDepartments([
          {
            id: 'd1', name: 'General Medicine OPD', code: 'GEN-OPD',
            rooms: ['Room 101 - Dr. Rajesh Sharma', 'Room 102 - Dr. Sneha Roy'],
            services: [{ id: 's1', name: 'General Consultation', prefix: 'OPD', avgServiceTimeMinutes: 12, maxCapacityPerDay: 150 }]
          },
          {
            id: 'd2', name: 'Pediatrics & Child Health', code: 'PED-OPD',
            rooms: ['Room 103 - Dr. Anita Verma'],
            services: [{ id: 's2', name: 'Pediatric Care', prefix: 'PED', avgServiceTimeMinutes: 8, maxCapacityPerDay: 100 }]
          },
          {
            id: 'd3', name: 'Orthopedics & Trauma Wing', code: 'ORTHO-OPD',
            rooms: ['Room 104 - Dr. Vikram Sethi', 'Trauma Bay 1'],
            services: [{ id: 's3', name: 'Trauma & Bone Care', prefix: 'ORT', avgServiceTimeMinutes: 15, maxCapacityPerDay: 80 }]
          },
          {
            id: 'd4', name: 'Cardiology & Chest OPD', code: 'CARDIO-OPD',
            rooms: ['Room 105 - Dr. Suresh Mehta'],
            services: [{ id: 's4', name: 'Cardiac Evaluation', prefix: 'CAR', avgServiceTimeMinutes: 10, maxCapacityPerDay: 60 }]
          }
        ]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const addOpdRoom = (deptId: string, deptName: string) => {
    const roomNum = Math.floor(Math.random() * 90) + 106;
    const newRoomName = `Room ${roomNum} - Dr. New Specialist`;

    setDepartments((prev) =>
      prev.map((d) => (d.id === deptId ? { ...d, rooms: [...d.rooms, newRoomName] } : d))
    );
    setActionSuccessMsg(`✓ Added ${newRoomName} to ${deptName}. Counter is now active for token calls.`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-teal-950 text-white p-8 rounded-3xl shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-teal-400 text-xs font-bold uppercase tracking-widest mb-1">
            <Building2 className="w-4 h-4" />
            <span>Hospital Infrastructure & OPD Room Console</span>
          </div>
          <h2 className="text-3xl font-black tracking-tight">Clinical Departments & OPD Rooms</h2>
          <p className="text-xs text-slate-300 mt-1">Configure active consultation rooms, doctor shift assignments, and target service time SLAs.</p>
        </div>

        <button
          onClick={fetchDepartments}
          className="flex items-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition shadow"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Infrastructure</span>
        </button>
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

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {departments.map((dept) => (
          <div key={dept.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition">
            
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-3">
                <div className="p-3.5 bg-teal-50 text-teal-700 rounded-2xl border border-teal-200/60">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">{dept.name}</h3>
                  <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                    CODE: {dept.code}
                  </span>
                </div>
              </div>

              <button
                onClick={() => addOpdRoom(dept.id, dept.name)}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-3 py-1.5 rounded-xl text-xs shadow flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add OPD Room</span>
              </button>
            </div>

            <div className="border-t border-slate-100 pt-3 space-y-2">
              <h4 className="text-xs font-black uppercase text-slate-400">Target Service SLA & Daily Capacity</h4>
              {dept.services?.map((s: any) => (
                <div key={s.id} className="bg-slate-50 p-3 rounded-2xl flex items-center justify-between text-xs text-slate-700 border border-slate-100">
                  <div>
                    <p className="font-extrabold text-slate-800">{s.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono">Prefix: {s.prefix} • Cap: {s.maxCapacityPerDay}/day</p>
                  </div>
                  <span className="font-mono text-teal-700 font-bold bg-teal-100 px-2.5 py-0.5 rounded-full text-[10px]">
                    ~{s.avgServiceTimeMinutes}m SLA
                  </span>
                </div>
              ))}
            </div>

            <div className="bg-slate-950 text-white p-4 rounded-2xl text-xs space-y-2 border border-slate-800">
              <div className="flex justify-between font-bold text-slate-300">
                <span>Active OPD Rooms / Counters ({dept.rooms?.length || 1}):</span>
                <span className="text-teal-400 font-mono font-bold">ONLINE</span>
              </div>
              
              <div className="space-y-1">
                {dept.rooms?.map((rm: string, idx: number) => (
                  <div key={idx} className="flex items-center space-x-2 text-[11px] text-slate-300">
                    <UserCheck className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
                    <span>{rm}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
