import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';
import { socketService } from '../services/socket';
import { useLangStore } from '../store/useLangStore';
import QRCode from 'qrcode.react';
import { Clock, Users, Bell, AlertCircle, CheckCircle2, ArrowRight, Activity, MapPin, RefreshCw } from 'lucide-react';

export const LiveTokenPage: React.FC = () => {
  const { codeOrId } = useParams<{ codeOrId: string }>();
  const { t } = useLangStore();

  const [tokenData, setTokenData] = useState<any>(null);
  const [peopleAhead, setPeopleAhead] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [smsSubscribed, setSmsSubscribed] = useState(false);

  useEffect(() => {
    if (codeOrId) {
      fetchTokenStatus();
    }
  }, [codeOrId]);

  const fetchTokenStatus = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/kiosk/track/${codeOrId}`);
      if (res.data.success) {
        setTokenData(res.data.data.token);
        setPeopleAhead(res.data.data.peopleAhead);

        // Join Socket.io room for live updates
        socketService.joinToken(res.data.data.token.id);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Token not found.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleTokenCalled = (updatedToken: any) => {
      setTokenData(updatedToken);
      setPeopleAhead(0);
    };

    const handleTokenTransferred = (updatedToken: any) => {
      setTokenData(updatedToken);
      fetchTokenStatus();
    };

    socketService.socket.on('token:called', handleTokenCalled);
    socketService.socket.on('token:transferred', handleTokenTransferred);

    return () => {
      socketService.socket.off('token:called', handleTokenCalled);
      socketService.socket.off('token:transferred', handleTokenTransferred);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
        <RefreshCw className="w-8 h-8 text-hospital-600 animate-spin mb-3" />
        <p className="text-sm font-semibold text-slate-600">{t('Loading Live Queue Position...', 'लाइव स्थिति लोड हो रही है...')}</p>
      </div>
    );
  }

  if (error || !tokenData) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 bg-white rounded-3xl shadow border text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h3 className="text-xl font-bold text-slate-800">{t('Token Not Found', 'टोकन नहीं मिला')}</h3>
        <p className="text-sm text-slate-500">{error || 'Please verify your token code.'}</p>
      </div>
    );
  }

  const isCalled = tokenData.status === 'CALLED';
  const isCompleted = tokenData.status === 'COMPLETED';

  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-6">
      
      {/* Status Hero Card */}
      <div className={`rounded-3xl p-6 shadow-xl text-white transition-all ${
        isCalled
          ? 'bg-gradient-to-br from-emerald-600 to-teal-800 ring-4 ring-emerald-400/50 animate-pulse-subtle'
          : isCompleted
          ? 'bg-gradient-to-br from-slate-700 to-slate-900'
          : 'bg-gradient-to-br from-hospital-800 via-hospital-700 to-hospital-900'
      }`}>
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-bold uppercase tracking-widest text-sky-200">
            {tokenData.department?.name || 'Department'}
          </span>
          <span className={`text-[11px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
            isCalled ? 'bg-white text-emerald-800' : 'bg-sky-900/60 text-sky-200'
          }`}>
            {tokenData.status}
          </span>
        </div>

        <div className="text-center my-4">
          <h2 className="text-5xl font-black tracking-tight">{tokenData.displayCode}</h2>
          <p className="text-xs text-sky-100 mt-1">{tokenData.patientName}</p>
        </div>

        {/* Counter Info Banner */}
        {isCalled && tokenData.counter && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 mt-4 text-center border border-white/20">
            <p className="text-xs font-semibold text-emerald-200 uppercase">{t('PROCEED IMMEDIATELY TO', 'तुरंत पहुंचें')}</p>
            <h4 className="text-xl font-extrabold text-white mt-0.5">{tokenData.counter.name}</h4>
          </div>
        )}
      </div>

      {/* People Ahead & Wait Time Countdown */}
      {!isCalled && !isCompleted && (
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
            <Users className="w-5 h-5 text-hospital-600 mx-auto mb-1" />
            <p className="text-xs text-slate-500 font-semibold">{t('People Ahead', 'आगे प्रतीक्षा में')}</p>
            <h3 className="text-3xl font-extrabold text-slate-800 mt-1">{peopleAhead}</h3>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
            <Clock className="w-5 h-5 text-amber-500 mx-auto mb-1" />
            <p className="text-xs text-slate-500 font-semibold">{t('Est. Wait Time', 'अनुमानित समय')}</p>
            <h3 className="text-3xl font-extrabold text-slate-800 mt-1">~{tokenData.estimatedWaitMinutes || 15} <span className="text-xs font-normal">min</span></h3>
          </div>
        </div>
      )}

      {/* Patient Journey Timeline */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
          {t('Clinical Journey Pipeline', 'उपचार प्रक्रिया स्थिति')}
        </h4>

        <div className="space-y-3 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {[
            { step: 'Registration', status: 'COMPLETED' },
            { step: 'Doctor OPD Consultation', status: tokenData.status === 'CALLED' || tokenData.status === 'IN_SERVICE' ? 'ACTIVE' : tokenData.status === 'COMPLETED' ? 'COMPLETED' : 'WAITING' },
            { step: 'Lab Diagnostic / Pharmacy', status: tokenData.status === 'TRANSFERRED' ? 'ACTIVE' : 'WAITING' }
          ].map((item, idx) => (
            <div key={idx} className="flex items-center space-x-3 relative z-10">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                item.status === 'ACTIVE'
                  ? 'bg-hospital-600 text-white ring-4 ring-sky-100'
                  : item.status === 'COMPLETED'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-200 text-slate-500'
              }`}>
                {item.status === 'COMPLETED' ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
              </div>
              <span className={`text-sm font-semibold ${item.status === 'ACTIVE' ? 'text-hospital-800 font-bold' : 'text-slate-600'}`}>
                {item.step}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Notification Alert Toggle */}
      <div className="bg-sky-50 border border-sky-200 p-4 rounded-2xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Bell className="w-5 h-5 text-hospital-600" />
          <div>
            <p className="text-xs font-bold text-hospital-900">{t('SMS Notification Alert', 'एसएमएस सूचनाएं')}</p>
            <p className="text-[11px] text-slate-500">{t('Alert when 3 tokens away', '3 टोकन दूर होने पर अलर्ट')}</p>
          </div>
        </div>
        <button
          onClick={() => setSmsSubscribed(!smsSubscribed)}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
            smsSubscribed ? 'bg-emerald-600 text-white' : 'bg-hospital-600 text-white hover:bg-hospital-700'
          }`}
        >
          {smsSubscribed ? 'Subscribed ✓' : 'Subscribe'}
        </button>
      </div>

      {/* QR Code Container */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-center">
        <div className="inline-block p-2 bg-slate-50 rounded-xl border border-slate-200 mb-2">
          <QRCode value={window.location.href} size={140} />
        </div>
        <p className="text-xs text-slate-400 font-mono">{tokenData.displayCode}</p>
      </div>

    </div>
  );
};
