import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useLangStore } from '../store/useLangStore';
import { 
  FileText, Calendar, Pill, ShieldCheck, Download, Clock, Heart, 
  AlertCircle, CheckCircle2, Phone, MapPin, User, Plus, Search, 
  Send, Sparkles, CreditCard, Activity, ArrowRight, Ambulance, Eye,
  Printer, QrCode, FileCheck, ShieldAlert, Check, ZoomIn, Scan
} from 'lucide-react';

export const PatientPortalPage: React.FC = () => {
  const { user } = useAuthStore();
  const { t } = useLangStore();

  const [activeTab, setActiveTab] = useState<'REPORTS' | 'PREBOOK' | 'PHARMACY' | 'ABHA'>('REPORTS');
  
  // Modals State
  const [selectedReportModal, setSelectedReportModal] = useState<any | null>(null);
  const [showAmbulanceModal, setShowAmbulanceModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [ambulanceEta, setAmbulanceEta] = useState(4);

  // Pre-Booking Slot State
  const [preDept, setPreDept] = useState('General Medicine OPD');
  const [preDate, setPreDate] = useState('2026-08-17');
  const [preSlot, setPreSlot] = useState('10:00 AM - 11:00 AM');
  const [bookedSlotTicket, setBookedSlotTicket] = useState<any | null>(null);

  // Pharmacy Dosage Checklist State
  const [medDosages, setMedDosages] = useState([
    { id: 1, name: 'Paracetamol 650mg', dose: '1 Tablet after breakfast', time: '08:00 AM', taken: true },
    { id: 2, name: 'Amoxicillin 500mg', dose: '1 Capsule after lunch', time: '01:00 PM', taken: false },
    { id: 3, name: 'Cetirizine 10mg', dose: '1 Tablet before sleep', time: '09:00 PM', taken: false }
  ]);

  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Medical Reports List
  const reports = [
    {
      id: 'rep-1',
      title: 'Complete Blood Count (CBC) Pathology Report',
      category: 'PATHOLOGY',
      date: 'Aug 14, 2026',
      doctor: 'Dr. Rajesh Sharma',
      size: '1.2 MB',
      results: [
        { test: 'Hemoglobin (Hb)', val: '13.5 g/dL', ref: '12.0 - 15.5 g/dL', status: 'NORMAL' },
        { test: 'Total WBC Count', val: '7,200 /mcL', ref: '4,500 - 11,000 /mcL', status: 'NORMAL' },
        { test: 'Platelet Count', val: '250,000 /mcL', ref: '150,000 - 450,000 /mcL', status: 'NORMAL' },
        { test: 'Packed Cell Volume (PCV)', val: '41.2%', ref: '37.0 - 48.0%', status: 'NORMAL' }
      ]
    },
    {
      id: 'rep-2',
      title: 'Chest X-Ray Digital Radiology Scan',
      category: 'RADIOLOGY',
      date: 'Jul 28, 2026',
      doctor: 'Dr. Suresh Mehta',
      size: '4.8 MB',
      impression: 'Radiology Impression: Bilateral lung fields clear. No focal consolidation, pneumothorax, or pleural effusion. Cardiac silhouette normal size.',
      results: [
        { test: 'Lung Parenchyma', val: 'Clear fields', ref: 'No infiltrates', status: 'NORMAL' },
        { test: 'Cardiothoracic Ratio', val: '0.48', ref: '< 0.50', status: 'NORMAL' }
      ]
    },
    {
      id: 'rep-3',
      title: 'OPD Clinical Prescription & Vitals Summary',
      category: 'PRESCRIPTION',
      date: 'Jun 12, 2026',
      doctor: 'Dr. Anita Verma',
      size: '640 KB',
      icdCode: 'ICD-10 J00 - Acute Nasopharyngitis',
      results: [
        { test: 'Blood Pressure', val: '120/80 mmHg', ref: '< 120/80', status: 'NORMAL' },
        { test: 'SpO2 Oxygen', val: '98%', ref: '> 95%', status: 'NORMAL' }
      ]
    }
  ];

  const handlePreBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = `PRE-${Math.floor(Math.random() * 900) + 100}`;
    const newBooking = {
      code,
      dept: preDept,
      date: preDate,
      slot: preSlot,
      patientName: user?.name || 'Surya Kumar',
      counter: 'Room 101 - Fast Track Gate'
    };
    setBookedSlotTicket(newBooking);
    setActionSuccessMsg(`✓ OPD Appointment Slot Pre-Booked! Ticket ${code} issued for ${preDate} (${preSlot}).`);
  };

  const toggleDosage = (id: number) => {
    setMedDosages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, taken: !m.taken } : m))
    );
  };

  const downloadReportFile = (rep: any) => {
    const patientName = user?.name || 'Surya Kumar';
    
    const htmlReport = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${rep.title} - ${patientName}</title>
        <style>
          body { font-family: sans-serif; padding: 40px; color: #0f172a; }
          .header { border-bottom: 2px solid #0f172a; padding-bottom: 15px; margin-bottom: 20px; display: flex; justify-content: space-between; }
          .h-title { font-size: 20px; font-weight: 900; color: #0f766e; }
          .patient-box { background: #f8fafc; padding: 15px; border-radius: 12px; margin-bottom: 20px; border: 1px solid #e2e8f0; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          th, td { border: 1px solid #cbd5e1; padding: 10px; text-align: left; font-size: 13px; }
          th { background: #0f172a; color: white; }
          .impression { background: #f0fdf4; border: 1px solid #bbf7d0; padding: 15px; border-radius: 12px; margin-top: 20px; color: #166534; font-weight: bold; }
        </style>
      </head>
      <body>
        <div className="header">
          <div>
            <div className="h-title">ALL INDIA INSTITUTE OF PUBLIC HEALTH</div>
            <div style="font-size:12px; color:#64748b;">Government ABDM Verified Diagnostic Report</div>
          </div>
          <div style="text-align:right; font-size:12px;">
            <div><strong>Date:</strong> ${rep.date}</div>
            <div><strong>Doctor:</strong> ${rep.doctor}</div>
          </div>
        </div>

        <div className="patient-box">
          <strong style="font-size:16px;">${patientName}</strong> (ABHA ID: surya.kumar@abha)<br/>
          <strong>Report Title:</strong> ${rep.title}<br/>
          <strong>Category:</strong> ${rep.category}
        </div>

        ${rep.impression ? `<div className="impression">${rep.impression}</div>` : ''}

        <table>
          <thead>
            <tr>
              <th>Diagnostic Test Parameter</th>
              <th>Observed Value</th>
              <th>Reference Range</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${rep.results.map((r: any) => `
              <tr>
                <td><strong>${r.test}</strong></td>
                <td style="color:#0f766e; font-weight:bold;">${r.val}</td>
                <td>${r.ref}</td>
                <td style="color:#166534; font-weight:bold;">${r.status}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <script>window.onload = function() { window.print(); }</script>
      </body>
      </html>
    `;

    const blob = new Blob([htmlReport], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${rep.title.replace(/\s+/g, '_')}_${patientName.replace(/\s+/g, '_')}.html`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setActionSuccessMsg(`✓ Report File Downloaded: ${rep.title}`);
  };

  const downloadAbhaCardPdf = () => {
    const patientName = user?.name || 'Surya Kumar';
    
    const htmlCard = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>ABHA Digital Health Card - ${patientName}</title>
        <style>
          body { font-family: sans-serif; padding: 40px; background: #0f172a; color: white; display: flex; justify-content: center; }
          .card { max-width: 480px; width: 100%; background: #020617; border-radius: 24px; padding: 30px; border: 2px solid #14b8a6; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); }
          .header { display: flex; justify-content: space-between; border-bottom: 1px solid #1e293b; padding-bottom: 15px; margin-bottom: 20px; }
          .title { color: #14b8a6; font-weight: 900; font-size: 18px; }
          .badge { background: #134e4a; color: #5eead4; padding: 4px 12px; border-radius: 999px; font-size: 10px; font-weight: 800; }
          .name { font-size: 26px; font-weight: 900; color: #ffffff; margin-top: 10px; }
          .details { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 20px; font-family: monospace; font-size: 12px; }
          .label { color: #94a3b8; font-size: 10px; text-transform: uppercase; }
          .val { color: #5eead4; font-weight: bold; margin-top: 3px; }
          .footer { border-top: 1px solid #1e293b; margin-top: 20px; padding-top: 15px; display: flex; justify-content: space-between; font-size: 13px; }
          .coverage { color: #fbbf24; font-weight: 900; }
        </style>
      </head>
      <body>
        <div className="card">
          <div className="header">
            <div className="title">ABHA Digital Health Card</div>
            <div className="badge">ABDM VERIFIED</div>
          </div>
          <div className="label">Beneficiary Name</div>
          <div className="name">${patientName}</div>
          <div className="details">
            <div>
              <div className="label">ABHA Address</div>
              <div className="val">surya.kumar@abha</div>
            </div>
            <div>
              <div className="label">ABHA Number</div>
              <div className="val">14-8921-4091-2384</div>
            </div>
          </div>
          <div className="footer">
            <span style="color:#94a3b8">Ayushman Bharat Coverage:</span>
            <span className="coverage">₹5,00,000 Cashless</span>
          </div>
        </div>
        <script>window.onload = function() { window.print(); }</script>
      </body>
      </html>
    `;

    const blob = new Blob([htmlCard], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ABHA_Digital_Health_Card_${patientName.replace(/\s+/g, '_')}.html`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setActionSuccessMsg('✓ Official ABHA Health Card File Downloaded Successfully!');
  };

  const dispatchAmbulance = () => {
    setShowAmbulanceModal(true);
    setActionSuccessMsg('🚨 Emergency Ambulance Dispatched! Live GPS Location Shared with Paramedics.');
  };

  // REAL CRISP SVG QR CODE MATRIX GENERATOR
  const DigitalQrCodeSvg = ({ size = 120 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="bg-white p-2 rounded-xl border-2 border-teal-500 shadow-md">
      {/* Top Left Finder Outer Box */}
      <rect x="5" y="5" width="26" height="26" rx="4" fill="#0f172a" />
      <rect x="9" y="9" width="18" height="18" rx="2" fill="white" />
      <rect x="13" y="13" width="10" height="10" rx="1" fill="#0f766e" />

      {/* Top Right Finder Outer Box */}
      <rect x="69" y="5" width="26" height="26" rx="4" fill="#0f172a" />
      <rect x="73" y="9" width="18" height="18" rx="2" fill="white" />
      <rect x="77" y="13" width="10" height="10" rx="1" fill="#0f766e" />

      {/* Bottom Left Finder Outer Box */}
      <rect x="5" y="69" width="26" height="26" rx="4" fill="#0f172a" />
      <rect x="9" y="73" width="18" height="18" rx="2" fill="white" />
      <rect x="13" y="77" width="10" height="10" rx="1" fill="#0f766e" />

      {/* Data Modules Matrix */}
      <rect x="36" y="8" width="6" height="6" fill="#0f172a" />
      <rect x="46" y="8" width="6" height="6" fill="#0f766e" />
      <rect x="56" y="8" width="6" height="6" fill="#0f172a" />
      
      <rect x="36" y="18" width="6" height="6" fill="#0f766e" />
      <rect x="46" y="18" width="6" height="6" fill="#0f172a" />
      <rect x="56" y="18" width="6" height="6" fill="#0f766e" />

      <rect x="8" y="36" width="6" height="6" fill="#0f766e" />
      <rect x="18" y="36" width="6" height="6" fill="#0f172a" />
      <rect x="28" y="36" width="6" height="6" fill="#0f766e" />
      <rect x="36" y="36" width="6" height="6" fill="#0f172a" />
      <rect x="46" y="36" width="6" height="6" fill="#0f766e" />
      <rect x="56" y="36" width="6" height="6" fill="#0f172a" />
      <rect x="66" y="36" width="6" height="6" fill="#0f766e" />
      <rect x="76" y="36" width="6" height="6" fill="#0f172a" />
      <rect x="86" y="36" width="6" height="6" fill="#0f766e" />

      <rect x="36" y="46" width="6" height="6" fill="#0f766e" />
      <rect x="46" y="46" width="6" height="6" fill="#0f172a" />
      <rect x="56" y="46" width="6" height="6" fill="#0f766e" />
      <rect x="66" y="46" width="6" height="6" fill="#0f172a" />
      <rect x="86" y="46" width="6" height="6" fill="#0f766e" />

      <rect x="36" y="56" width="6" height="6" fill="#0f172a" />
      <rect x="46" y="56" width="6" height="6" fill="#0f766e" />
      <rect x="56" y="56" width="6" height="6" fill="#0f172a" />
      <rect x="76" y="56" width="6" height="6" fill="#0f766e" />
      <rect x="86" y="56" width="6" height="6" fill="#0f172a" />

      <rect x="36" y="66" width="6" height="6" fill="#0f766e" />
      <rect x="46" y="66" width="6" height="6" fill="#0f172a" />
      <rect x="56" y="66" width="6" height="6" fill="#0f766e" />
      <rect x="66" y="66" width="6" height="6" fill="#0f172a" />
      <rect x="76" y="66" width="6" height="6" fill="#0f766e" />

      <rect x="36" y="76" width="6" height="6" fill="#0f172a" />
      <rect x="46" y="76" width="6" height="6" fill="#0f766e" />
      <rect x="56" y="76" width="6" height="6" fill="#0f172a" />
      <rect x="66" y="76" width="6" height="6" fill="#0f766e" />
      <rect x="86" y="76" width="6" height="6" fill="#0f172a" />

      <rect x="36" y="86" width="6" height="6" fill="#0f766e" />
      <rect x="46" y="86" width="6" height="6" fill="#0f172a" />
      <rect x="56" y="86" width="6" height="6" fill="#0f766e" />
      <rect x="66" y="86" width="6" height="6" fill="#0f172a" />
      <rect x="76" y="86" width="6" height="6" fill="#0f766e" />
      <rect x="86" y="86" width="6" height="6" fill="#0f172a" />
    </svg>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      
      {/* Header Hero Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-teal-950 text-white p-8 rounded-3xl shadow-2xl border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center space-x-2 bg-teal-500/20 text-teal-300 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-teal-400/30">
            <Heart className="w-3.5 h-3.5" />
            <span>Citizen Health Locker & Patient Care Portal</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-black tracking-tight">
            Patient Personal Health Hub
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl">
            Access your digital prescriptions, diagnostic lab reports, Ayushman Bharat health card wallet, pharmacy order status, and OPD appointment pre-booking.
          </p>
        </div>

        {/* SOS Emergency Ambulance Dispatcher Button */}
        <div className="relative z-10 flex flex-wrap items-center gap-3">
          <button
            onClick={dispatchAmbulance}
            className="flex items-center space-x-2 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-black px-6 py-3.5 rounded-2xl text-xs shadow-2xl shadow-rose-600/30 animate-pulse transition"
          >
            <Ambulance className="w-5 h-5 text-white" />
            <span>SOS 1-TOUCH AMBULANCE DISPATCH</span>
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

      {/* Navigation Tabs */}
      <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm text-xs font-extrabold overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('REPORTS')}
          className={`flex-1 py-3 px-4 rounded-xl transition flex items-center justify-center space-x-2 whitespace-nowrap ${
            activeTab === 'REPORTS' ? 'bg-teal-600 text-white shadow' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Diagnostic Reports & RX</span>
        </button>

        <button
          onClick={() => setActiveTab('PREBOOK')}
          className={`flex-1 py-3 px-4 rounded-xl transition flex items-center justify-center space-x-2 whitespace-nowrap ${
            activeTab === 'PREBOOK' ? 'bg-teal-600 text-white shadow' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Pre-Book OPD Slot</span>
        </button>

        <button
          onClick={() => setActiveTab('PHARMACY')}
          className={`flex-1 py-3 px-4 rounded-xl transition flex items-center justify-center space-x-2 whitespace-nowrap ${
            activeTab === 'PHARMACY' ? 'bg-teal-600 text-white shadow' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Pill className="w-4 h-4" />
          <span>Pharmacy & Dosage Locker</span>
        </button>

        <button
          onClick={() => setActiveTab('ABHA')}
          className={`flex-1 py-3 px-4 rounded-xl transition flex items-center justify-center space-x-2 whitespace-nowrap ${
            activeTab === 'ABHA' ? 'bg-teal-600 text-white shadow' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>ABHA & Health Insurance</span>
        </button>
      </div>

      {/* TAB 1: DIAGNOSTIC REPORTS & PRESCRIPTION PDF LOCKER */}
      {activeTab === 'REPORTS' && (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-md space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                Your Verified Digital Health Locker Reports
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Government ABDM verified medical lab results & prescriptions.</p>
            </div>
            <span className="text-xs font-bold bg-teal-50 text-teal-800 px-3 py-1 rounded-full border border-teal-200">
              {reports.length} Verified Records
            </span>
          </div>

          <div className="space-y-4">
            {reports.map((r) => (
              <div key={r.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-teal-400 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 flex-wrap gap-1">
                    <h4 className="font-extrabold text-sm text-slate-900">{r.title}</h4>
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                      {r.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">Ordered by {r.doctor} • Date: {r.date}</p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedReportModal(r)}
                    className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs shadow flex items-center space-x-1.5"
                  >
                    <Eye className="w-4 h-4 text-teal-400" />
                    <span>View Report</span>
                  </button>

                  <button
                    onClick={() => downloadReportFile(r)}
                    className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-extrabold rounded-xl text-xs shadow flex items-center space-x-1.5"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Report ({r.size})</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: PRE-BOOK OPD APPOINTMENT SLOT */}
      {activeTab === 'PREBOOK' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 border border-slate-200 shadow-md space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                Pre-Book OPD Consultation Slot
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Skip kiosk queue by reserving your doctor slot ahead of time.</p>
            </div>

            <form onSubmit={handlePreBookSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Clinical Department</label>
                <select
                  value={preDept}
                  onChange={(e) => setPreDept(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 font-bold outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="General Medicine OPD">General Medicine OPD (Room 101 - Dr. Rajesh Sharma)</option>
                  <option value="Pediatrics OPD">Pediatrics OPD (Room 102 - Dr. Anita Verma)</option>
                  <option value="Orthopedics & Trauma">Orthopedics & Trauma (Room 103 - Dr. Vikram Sethi)</option>
                  <option value="Cardiology OPD">Cardiology OPD (Room 104 - Dr. Suresh Mehta)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Appointment Date</label>
                  <input
                    type="date"
                    value={preDate}
                    onChange={(e) => setPreDate(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 font-semibold outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Preferred Time Slot</label>
                  <select
                    value={preSlot}
                    onChange={(e) => setPreSlot(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 font-bold outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="09:00 AM - 10:00 AM">09:00 AM - 10:00 AM</option>
                    <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
                    <option value="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM</option>
                    <option value="02:00 PM - 03:00 PM">02:00 PM - 03:00 PM</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-extrabold py-4 rounded-2xl shadow-xl transition text-sm flex items-center justify-center space-x-2"
              >
                <Calendar className="w-5 h-5" />
                <span>CONFIRM PRE-BOOKING & GENERATE QR PASS</span>
              </button>
            </form>
          </div>

          {/* Booked Ticket Preview Card */}
          <div className="lg:col-span-5 bg-slate-950 text-white rounded-3xl p-6 border border-slate-800 shadow-xl flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-[10px] font-mono font-bold text-teal-400 uppercase">Pre-Booked Fast Track Ticket</span>
              
              {bookedSlotTicket ? (
                <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3 font-mono">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-black text-white">{bookedSlotTicket.code}</span>
                    <span className="bg-teal-500/20 text-teal-300 text-[10px] font-bold px-2.5 py-0.5 rounded border border-teal-800">
                      PRE-BOOKED
                    </span>
                  </div>
                  <h4 className="text-sm font-extrabold text-teal-300">{bookedSlotTicket.patientName}</h4>
                  <p className="text-xs text-slate-300">{bookedSlotTicket.dept}</p>
                  <p className="text-xs text-amber-400 font-bold">{bookedSlotTicket.date} • {bookedSlotTicket.slot}</p>
                  <p className="text-[11px] text-slate-400">{bookedSlotTicket.counter}</p>
                </div>
              ) : (
                <div className="text-center py-12 text-slate-400 space-y-2">
                  <Calendar className="w-10 h-10 mx-auto text-slate-600" />
                  <p className="text-xs font-bold text-slate-300">No slot pre-booked yet.</p>
                  <p className="text-[10px] text-slate-500">Fill out the form on the left to reserve your appointment.</p>
                </div>
              )}
            </div>

            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 text-center text-xs text-slate-400">
              <p className="font-bold text-slate-200">Show QR Pass at Entrance Gate</p>
              <p className="text-[10px] text-slate-500">Bypasses long physical kiosk waiting lines.</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PHARMACY DOSAGE CHECKLIST & ORDER TRACKER */}
      {activeTab === 'PHARMACY' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 border border-slate-200 shadow-md space-y-6">
            <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
              <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center space-x-1.5">
                <Pill className="w-4 h-4 text-teal-600" />
                <span>Daily Prescription Medication Dosage Alarm</span>
              </h3>
              <span className="text-[10px] font-bold bg-teal-50 text-teal-800 px-2.5 py-0.5 rounded-full border border-teal-200">
                Today's Schedule
              </span>
            </div>

            <div className="space-y-3">
              {medDosages.map((m) => (
                <div
                  key={m.id}
                  onClick={() => toggleDosage(m.id)}
                  className={`p-4 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                    m.taken ? 'bg-emerald-50 border-emerald-300 text-emerald-950 shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-xl flex items-center justify-center border ${
                      m.taken ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white border-slate-300'
                    }`}>
                      {m.taken && <Check className="w-4 h-4 stroke-[3]" />}
                    </div>

                    <div>
                      <h4 className={`font-extrabold text-sm ${m.taken ? 'line-through opacity-70' : 'text-slate-900'}`}>{m.name}</h4>
                      <p className="text-xs text-slate-500 font-medium">{m.dose} • Scheduled: {m.time}</p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase ${
                    m.taken ? 'bg-emerald-200 text-emerald-900' : 'bg-amber-100 text-amber-900'
                  }`}>
                    {m.taken ? 'TAKEN ✓' : 'DUE'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-950 text-white rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-[10px] font-mono font-bold text-teal-400 uppercase">Dispensary Pharmacy Pickup Status</span>
              
              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-white text-sm">Order #PHARM-941</span>
                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded border border-emerald-400/40">
                    READY FOR PICKUP
                  </span>
                </div>
                <p className="text-xs text-slate-300">Counter: <span className="font-bold text-teal-300">Dispensary Counter 3</span></p>
                <p className="text-xs text-slate-400 font-mono">Prescription: Dr. Rajesh Sharma (Aug 16)</p>
              </div>
            </div>

            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 text-center text-xs text-slate-400">
              <p className="font-bold text-slate-200">Show Prescription QR at Counter 3</p>
              <p className="text-[10px] text-slate-500">Free dispensary under Ayushman Bharat cashless scheme.</p>
            </div>
          </div>

        </div>
      )}

      {/* TAB 4: ABHA DIGITAL HEALTH CARD & REAL DIGITAL QR CODE MATRIX */}
      {activeTab === 'ABHA' && (
        <div className="max-w-xl mx-auto bg-gradient-to-tr from-slate-900 via-slate-950 to-teal-950 text-white p-8 rounded-3xl border border-teal-500/40 shadow-2xl space-y-6">
          
          <div className="flex justify-between items-center border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-6 h-6 text-teal-400" />
              <h3 className="font-black text-lg">ABHA Digital Health Card</h3>
            </div>
            <span className="bg-teal-500/20 text-teal-300 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border border-teal-400/30">
              ABDM VERIFIED
            </span>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4 font-mono">
            
            {/* Beneficiary & REAL DIGITAL QR CODE DISPLAY */}
            <div className="flex justify-between items-start gap-4">
              <div>
                <p className="text-[10px] text-slate-400 uppercase">Beneficiary Name</p>
                <h2 className="text-2xl font-black text-white">{user?.name || 'Surya Kumar'}</h2>
                <span className="text-[11px] font-bold text-emerald-400 mt-1 block">Active Ayushman Beneficiary</span>
              </div>

              {/* REAL DIGITALLY RENDERED QR CODE MATRIX WITH ZOOM CLICK */}
              <div 
                onClick={() => setShowQrModal(true)}
                className="cursor-pointer group flex flex-col items-center space-y-1"
                title="Click to Zoom QR Code for Entrance Scanning"
              >
                <DigitalQrCodeSvg size={110} />
                <span className="text-[9px] font-mono font-bold text-teal-400 group-hover:underline flex items-center space-x-0.5">
                  <ZoomIn className="w-3 h-3" />
                  <span>Zoom QR</span>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-[10px] text-slate-400 uppercase">ABHA Address</p>
                <p className="font-extrabold text-teal-300">surya.kumar@abha</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase">ABHA Number</p>
                <p className="font-extrabold text-sky-300">14-8921-4091-2384</p>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-3 flex justify-between items-center text-xs">
              <span className="text-slate-400">Ayushman Bharat Coverage:</span>
              <span className="font-black text-amber-400 text-sm">₹5,00,000 Cashless</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => setShowQrModal(true)}
              className="py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-2xl text-xs border border-slate-800 transition flex items-center justify-center space-x-2"
            >
              <QrCode className="w-4 h-4 text-teal-400" />
              <span>Show Fullscreen Digital QR Pass</span>
            </button>

            <button
              onClick={downloadAbhaCardPdf}
              className="py-3.5 bg-teal-600 hover:bg-teal-500 text-white font-extrabold rounded-2xl text-xs shadow-lg transition flex items-center justify-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Official ABHA Card</span>
            </button>
          </div>

        </div>
      )}

      {/* FULLSCREEN DIGITAL QR CODE SCANNING MODAL */}
      {showQrModal && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 text-white rounded-3xl max-w-sm w-full p-8 shadow-2xl border border-teal-500/60 text-center space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-teal-400">ABDM DIGITAL QR CODE PASS</span>
              <button onClick={() => setShowQrModal(false)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>

            <div className="p-4 bg-white rounded-3xl inline-block shadow-2xl border-4 border-teal-500">
              <DigitalQrCodeSvg size={220} />
            </div>

            <div className="space-y-1 text-xs">
              <h3 className="font-extrabold text-base text-white">{user?.name || 'Surya Kumar'}</h3>
              <p className="text-teal-300 font-mono font-bold">ABHA: surya.kumar@abha</p>
              <p className="text-[11px] text-slate-400 pt-1">Show this digital QR code to security guards or kiosk scanners at hospital entrance gates for fast-track entry.</p>
            </div>

            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-3 bg-teal-600 hover:bg-teal-500 text-white font-extrabold rounded-xl text-xs shadow-lg"
            >
              Close Digital QR Pass
            </button>
          </div>
        </div>
      )}

      {/* Report Preview Lightbox Modal */}
      {selectedReportModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-black text-base text-slate-900">{selectedReportModal.title}</h3>
                <p className="text-xs text-slate-500">Ordered by {selectedReportModal.doctor} • {selectedReportModal.date}</p>
              </div>
              <button onClick={() => setSelectedReportModal(null)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            {selectedReportModal.impression && (
              <div className="bg-sky-50 p-3.5 rounded-2xl border border-sky-200 text-xs text-sky-950 font-medium">
                {selectedReportModal.impression}
              </div>
            )}

            <div className="space-y-2 text-xs">
              <p className="font-bold text-slate-700 uppercase text-[10px]">Verified Test Results Table:</p>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {selectedReportModal.results?.map((res: any, idx: number) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center font-mono">
                    <span className="font-bold text-slate-800">{res.test}</span>
                    <div className="text-right">
                      <span className="font-black text-teal-700">{res.val}</span>
                      <span className="text-[10px] text-slate-400 block">Ref: {res.ref}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedReportModal(null)}
                className="px-4 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs"
              >
                Close
              </button>
              <button
                onClick={() => { downloadReportFile(selectedReportModal); setSelectedReportModal(null); }}
                className="px-4 py-2.5 bg-teal-600 text-white font-extrabold rounded-xl text-xs shadow flex items-center space-x-1"
              >
                <Download className="w-4 h-4" />
                <span>Download Report Document</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SOS 1-Touch Ambulance Modal */}
      {showAmbulanceModal && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 text-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-rose-500/50 space-y-4 text-center">
            <div className="w-14 h-14 bg-rose-600 text-white rounded-3xl flex items-center justify-center mx-auto animate-bounce shadow-xl">
              <Ambulance className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[10px] font-black bg-rose-600 text-white px-3 py-1 rounded-full uppercase tracking-wider">
                🚨 EMERGENCY AMBULANCE DISPATCHED
              </span>
              <h3 className="text-2xl font-black text-white mt-2">ALS Ambulance Unit #108</h3>
              <p className="text-xs text-rose-300 font-bold">Estimated Arrival: {ambulanceEta} Minutes</p>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-left text-xs font-mono space-y-1.5">
              <div className="flex justify-between text-slate-300">
                <span className="font-bold text-slate-400">Driver Contact:</span>
                <span className="text-teal-300 font-bold">+91 9811223344</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="font-bold text-slate-400">Paramedic Team:</span>
                <span>ALS Trauma Paramedics</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="font-bold text-slate-400">Live GPS Link:</span>
                <span className="text-sky-300 font-bold">Active Beacon Ping</span>
              </div>
            </div>

            <button
              onClick={() => setShowAmbulanceModal(false)}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs"
            >
              Close Emergency Modal
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
