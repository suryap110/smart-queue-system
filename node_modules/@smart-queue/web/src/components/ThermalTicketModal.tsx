import React from 'react';
import QRCode from 'qrcode.react';
import { Printer, X, CheckCircle2 } from 'lucide-react';
import { useLangStore } from '../store/useLangStore';

interface ThermalTicketModalProps {
  token: any;
  onClose: () => void;
}

export const ThermalTicketModal: React.FC<ThermalTicketModalProps> = ({ token, onClose }) => {
  const { t } = useLangStore();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl relative border border-slate-100 animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Printable Thermal Receipt Card */}
        <div id="thermal-receipt" className="text-center font-mono border-2 border-dashed border-slate-300 p-6 rounded-xl bg-slate-50">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            AIIPH GOVT HOSPITAL
          </p>
          <p className="text-[10px] text-slate-400">Rajpath Marg Campus, New Delhi</p>
          
          <div className="my-4 border-t border-b border-slate-300 py-3">
            <p className="text-xs text-slate-500">{token.service?.name || 'General OPD'}</p>
            <h2 className="text-4xl font-extrabold text-hospital-800 tracking-tight my-1">
              {token.displayCode}
            </h2>
            <p className="text-xs font-semibold text-sky-700 bg-sky-100 inline-block px-2.5 py-0.5 rounded-full mt-1">
              {token.priorityType || 'NORMAL'} PRIORITY
            </p>
          </div>

          <div className="space-y-1 text-left text-xs text-slate-600 mb-4 bg-white p-3 rounded border border-slate-200">
            <p><span className="font-semibold text-slate-800">Patient:</span> {token.patientName}</p>
            <p><span className="font-semibold text-slate-800">Phone:</span> {token.patientPhone}</p>
            {token.abhaId && <p><span className="font-semibold text-slate-800">ABHA ID:</span> {token.abhaId}</p>}
            <p><span className="font-semibold text-slate-800">Dept:</span> {token.department?.name || 'General Medicine'}</p>
            <p><span className="font-semibold text-slate-800">Est. Wait:</span> ~{token.estimatedWaitMinutes || 15} mins</p>
            <p><span className="font-semibold text-slate-800">Issued:</span> {new Date(token.joinedAt || Date.now()).toLocaleTimeString()}</p>
          </div>

          {/* QR Code */}
          <div className="flex justify-center my-3 bg-white p-2 rounded inline-block shadow-sm">
            <QRCode value={`http://localhost:5173/track/${token.displayCode}`} size={110} />
          </div>
          <p className="text-[10px] text-slate-400">Scan QR Code with smartphone for live status</p>
        </div>

        {/* Modal Actions */}
        <div className="mt-5 flex space-x-3">
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center space-x-2 bg-hospital-600 hover:bg-hospital-700 text-white font-semibold py-2.5 px-4 rounded-xl shadow transition text-sm"
          >
            <Printer className="w-4 h-4" />
            <span>{t('Print Paper Ticket', 'टिकट प्रिंट करें')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
