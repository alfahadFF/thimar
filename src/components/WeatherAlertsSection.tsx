import React, { useState } from 'react';
import { WeatherAlert } from '../types';
import { 
  CloudRain, 
  Wind, 
  Snowflake, 
  Sun, 
  AlertTriangle, 
  Bell, 
  Check, 
  ShieldCheck, 
  Droplet, 
  Info 
} from 'lucide-react';

interface WeatherAlertsSectionProps {
  alerts: WeatherAlert[];
}

export const WeatherAlertsSection: React.FC<WeatherAlertsSectionProps> = ({ alerts }) => {
  const [selectedRegion, setSelectedRegion] = useState<string>('الكل');
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [phoneForAlerts, setPhoneForAlerts] = useState<string>('');
  const [showSubscriptionModal, setShowSubscriptionModal] = useState<boolean>(false);

  const filteredAlerts = alerts.filter(a => selectedRegion === 'الكل' || a.region.includes(selectedRegion));

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneForAlerts) return;
    setIsSubscribed(true);
    setShowSubscriptionModal(false);
  };

  const getWeatherIcon = (type: WeatherAlert['weatherType']) => {
    switch (type) {
      case 'rain':
        return <CloudRain className="w-5 h-5 text-blue-400" />;
      case 'frost':
        return <Snowflake className="w-5 h-5 text-cyan-300" />;
      case 'dust_wind':
        return <Wind className="w-5 h-5 text-amber-300" />;
      default:
        return <Sun className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 mb-1">
            <span>المرصد الزراعي والإنذار المبكر</span>
            <span aria-hidden="true">·</span>
            <span>أمطار · سيول · صقيع · رياح مثيرة للغبار</span>
          </div>
          <h2 className="text-2xl font-bold text-stone-900 tracking-tight">
            التنبيهات الجوية والأمطار الزراعية
          </h2>
          <p className="text-stone-600 text-sm mt-1">
            إرشادات وقائية مرتبطة بالتقلبات الجوية لحماية المحاصيل الحقلية، الحظائر والمواشي الحلال، وأحواض الاستزراع السمكي.
          </p>
        </div>

        <button
          onClick={() => setShowSubscriptionModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-sm self-start md:self-auto shrink-0"
        >
          <Bell className="w-4 h-4" />
          <span>{isSubscribed ? 'تم تفعيل التنبيهات لمزرعتك ✓' : 'تفعيل إشعارات الأمطار والطقس'}</span>
        </button>
      </div>

      {/* Region Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none bg-stone-100 p-2.5 rounded-xl border border-stone-200 text-xs">
        <span className="font-semibold text-stone-600 ml-1">تصفية حسب المنطقة:</span>
        {['الكل', 'القصيم', 'الرياض', 'حائل', 'الجوف', 'المنطقة الشرقية'].map((reg) => (
          <button
            key={reg}
            onClick={() => setSelectedRegion(reg)}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              selectedRegion === reg
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white text-stone-700 hover:bg-stone-50 border border-stone-200'
            }`}
          >
            {reg}
          </button>
        ))}
      </div>

      {/* Alert Cards */}
      <div className="space-y-6">
        {filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-xs hover:border-emerald-300 transition-all"
          >
            {/* Alert Header Banner */}
            <div className={`p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-white ${
              alert.severity === 'warning'
                ? 'bg-gradient-to-r from-blue-950 via-stone-900 to-blue-900'
                : alert.severity === 'alert'
                ? 'bg-gradient-to-r from-cyan-950 via-stone-900 to-sky-900'
                : 'bg-gradient-to-r from-stone-900 to-amber-950'
            }`}>
              <div className="flex items-start sm:items-center gap-3">
                <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20">
                  {getWeatherIcon(alert.weatherType)}
                </div>
                <div>
                  <div className="flex items-center gap-2 text-xs text-stone-300 mb-1">
                    <span className="font-semibold text-emerald-300">{alert.region}</span>
                    <span>·</span>
                    <span>{alert.period}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                    {alert.title}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs bg-black/30 p-2.5 rounded-xl self-start sm:self-auto backdrop-blur-xs">
                <div>
                  <span className="text-[10px] text-stone-400 block">الحرارة المتوقعة</span>
                  <span className="font-bold tabular-nums text-white">{alert.tempRange}</span>
                </div>
                {alert.expectedRainMm && (
                  <div className="pr-3 border-r border-white/20">
                    <span className="text-[10px] text-stone-400 block">كمية الأمطار</span>
                    <span className="font-bold tabular-nums text-blue-300">~{alert.expectedRainMm} ملم</span>
                  </div>
                )}
                {alert.windSpeedKmh && (
                  <div className="pr-3 border-r border-white/20">
                    <span className="text-[10px] text-stone-400 block">سرعة الرياح</span>
                    <span className="font-bold tabular-nums text-amber-300">{alert.windSpeedKmh} كم/س</span>
                  </div>
                )}
              </div>
            </div>

            {/* Practical Advice Grid (3 Sectors) */}
            <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-6 bg-stone-50/50">
              
              {/* Sector 1: Plant & Crops */}
              <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 border-b border-stone-100 pb-2">
                  <Droplet className="w-4 h-4 text-emerald-700" />
                  <span>إرشادات المحاصيل والري والبيوت المحمية:</span>
                </div>
                <ul className="space-y-2 text-xs text-stone-700">
                  {alert.farmAdvice.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
                      <span className="text-emerald-700 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Sector 2: Halal Livestock */}
              <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-900 border-b border-stone-100 pb-2">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  <span>إرشادات الأغنام والأبقار والإبل الحلال:</span>
                </div>
                <ul className="space-y-2 text-xs text-stone-700">
                  {alert.livestockAdvice.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
                      <span className="text-amber-700 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Sector 3: Aquaculture */}
              <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-900 border-b border-stone-100 pb-2">
                  <CloudRain className="w-4 h-4 text-blue-700" />
                  <span>إرشادات أحواض ومزارع الأسماك:</span>
                </div>
                <ul className="space-y-2 text-xs text-stone-700">
                  {alert.aquacultureAdvice.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
                      <span className="text-blue-700 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Subscription Modal */}
      {showSubscriptionModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div onClick={() => setShowSubscriptionModal(false)} className="fixed inset-0 bg-black/60 backdrop-blur-xs" />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 space-y-4 border border-stone-200">
              <div className="flex items-center gap-3 border-b border-stone-200 pb-3">
                <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-900">تفعيل الإنذار المبكر للأمطار والطقس</h3>
                  <p className="text-xs text-stone-500">تلقى رسائل تنبيهية مجانية قبل 24 ساعة من الحالة الجوية</p>
                </div>
              </div>

              <form onSubmit={handleSubscribe} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">رقم الجوال لتلقي التنبيهات:</label>
                  <input
                    type="tel"
                    required
                    value={phoneForAlerts}
                    onChange={(e) => setPhoneForAlerts(e.target.value)}
                    placeholder="05xxxxxxxx"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">منطقة مزرعتك الأساسية:</label>
                  <select className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600">
                    <option>القصيم (بريدة، عنيزة، الرس)</option>
                    <option>الرياض والخرج ووادي الدواسر</option>
                    <option>حائل والجوف وتبوك</option>
                    <option>المنطقة الشرقية وحفر الباطن</option>
                    <option>جازان وعسير والساحل الغربي</option>
                  </select>
                </div>

                <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg text-[11px] text-stone-600">
                  تتضمن التنبيهات: كمية الأمطار بالساعة، شدة الرياح وسرعتها، وموجات الصقيع الشتوي المصحوبة بإرشادات فورية.
                </div>

                <div className="pt-2 flex justify-end gap-2 border-t border-stone-200">
                  <button
                    type="button"
                    onClick={() => setShowSubscriptionModal(false)}
                    className="px-4 py-2 bg-stone-100 text-stone-700 rounded-lg"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-800 text-white font-bold rounded-lg hover:bg-emerald-900"
                  >
                    تأكيد التفعيل
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
