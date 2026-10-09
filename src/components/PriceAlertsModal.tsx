import React, { useState } from 'react';
import { PriceAlert, MarketRate } from '../types';
import { Bell, Plus, Trash2, CheckCircle2, TrendingDown, TrendingUp, X } from 'lucide-react';

interface PriceAlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
  rates: MarketRate[];
  alerts: PriceAlert[];
  onAddAlert: (newAlert: PriceAlert) => void;
  onToggleAlert: (id: string) => void;
  onDeleteAlert: (id: string) => void;
}

export const PriceAlertsModal: React.FC<PriceAlertsModalProps> = ({
  isOpen,
  onClose,
  rates,
  alerts,
  onAddAlert,
  onToggleAlert,
  onDeleteAlert
}) => {
  const [selectedCommodityName, setSelectedCommodityName] = useState<string>(rates[0]?.name || 'خراف عواسي حي (قائم)');
  const [targetPrice, setTargetPrice] = useState<number>(27);
  const [condition, setCondition] = useState<'below' | 'above'>('below');
  const [phone, setPhone] = useState<string>('0501234567');
  const [addedSuccess, setAddedSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentRate = rates.find(r => r.name === selectedCommodityName);

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetPrice || !phone) return;

    const newAlert: PriceAlert = {
      id: `alert-${Date.now()}`,
      commodityName: selectedCommodityName,
      targetPrice,
      condition,
      currentPrice: currentRate ? currentRate.currentPrice : targetPrice,
      userPhone: phone,
      active: true,
      createdAt: 'اليوم'
    };

    onAddAlert(newAlert);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-stone-200">
          
          {/* Header */}
          <div className="p-5 bg-gradient-to-r from-stone-900 to-emerald-950 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-600/30 border border-emerald-500/40 rounded-xl text-emerald-300">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">إدارة تنبيهات أسعار المحاصيل والمواشي والأسماك</h2>
                <p className="text-xs text-stone-300">أشعرني تلقائياً عند وصول السلعة إلى السعر المناسب للشراء أو البيع</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-white rounded-lg bg-black/30 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs text-stone-800">
            
            {/* Create New Alert Form */}
            <form onSubmit={handleCreateAlert} className="bg-stone-50 border border-stone-200 p-4 rounded-xl space-y-3">
              <h3 className="font-bold text-stone-900 text-sm">إنشاء تنبيه سعر جديد:</h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">السلعة أو المحصول:</label>
                  <select
                    value={selectedCommodityName}
                    onChange={(e) => {
                      setSelectedCommodityName(e.target.value);
                      const r = rates.find(item => item.name === e.target.value);
                      if (r) setTargetPrice(r.currentPrice);
                    }}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  >
                    {rates.map((r) => (
                      <option key={r.id} value={r.name}>
                        {r.name} (الحالي: {r.currentPrice} {r.unit})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">شرط التنبيه:</label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  >
                    <option value="below">عندما ينخفض السعر عن أو يساوي (شراء)</option>
                    <option value="above">عندما يرتفع السعر عن أو يساوي (بيع)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">السعر المستهدف ($ دولار):</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs font-bold text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">رقم الجوال لتلقي التنبيه:</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="05xxxxxxxx"
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-lg transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>تفعيل هذا التنبيه</span>
                  </button>
                </div>
              </div>

              {addedSuccess && (
                <div className="p-2 bg-emerald-100 text-emerald-900 rounded-lg flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>تم حفظ وتفعيل التنبيه بنجاح! سيتم إشعارك فور تغير الأسعار.</span>
                </div>
              )}
            </form>

            {/* Active Alerts List */}
            <div>
              <h3 className="font-bold text-stone-900 text-sm mb-3">التنبيهات النشطة المسجلة:</h3>
              
              {alerts.length === 0 ? (
                <div className="text-center py-8 text-stone-400 bg-stone-50 rounded-xl border border-dashed border-stone-200">
                  لا توجد تنبيهات أسعار نشطة حالياً. أنشئ تنبيهاً لمراقبة سلعة محددة.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {alerts.map((al) => {
                    const matchedRate = rates.find(r => r.name === al.commodityName);
                    const currentVal = matchedRate ? matchedRate.currentPrice : al.currentPrice;
                    const isConditionMet = al.condition === 'below' 
                      ? currentVal <= al.targetPrice 
                      : currentVal >= al.targetPrice;

                    return (
                      <div
                        key={al.id}
                        className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 ${
                          isConditionMet
                            ? 'bg-emerald-50/80 border-emerald-300'
                            : 'bg-white border-stone-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            al.condition === 'below' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {al.condition === 'below' ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
                          </div>

                          <div>
                            <div className="font-bold text-stone-900 text-xs">{al.commodityName}</div>
                            <div className="text-[11px] text-stone-500 mt-0.5">
                              التنبيه: عند {al.condition === 'below' ? 'الهبوط إلى' : 'الارتفاع إلى'} <span className="font-bold tabular-nums text-stone-800">${al.targetPrice}</span> (السعر الحالي: <span className="font-semibold tabular-nums text-stone-900">${currentVal}</span>)
                            </div>
                            {isConditionMet && (
                              <span className="text-[10px] text-emerald-800 font-bold block mt-0.5">
                                ✓ تحقق الشرط الآن! مؤهل للشراء/البيع
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onToggleAlert(al.id)}
                            className={`px-2.5 py-1 rounded text-[11px] font-semibold cursor-pointer ${
                              al.active
                                ? 'bg-emerald-800 text-white'
                                : 'bg-stone-200 text-stone-600'
                            }`}
                          >
                            {al.active ? 'نشط' : 'معطل'}
                          </button>

                          <button
                            onClick={() => onDeleteAlert(al.id)}
                            className="p-1 text-stone-400 hover:text-rose-600 cursor-pointer"
                            title="حذف التنبيه"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

          {/* Footer */}
          <div className="p-4 border-t border-stone-200 bg-stone-50 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-stone-800 hover:bg-stone-900 text-white text-xs font-semibold rounded-lg cursor-pointer"
            >
              إغلاق
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
