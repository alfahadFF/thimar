import React, { useState } from 'react';
import { MarketRate } from '../types';
import { TrendingUp, TrendingDown, Minus, Calculator, RefreshCw } from 'lucide-react';

interface MarketRatesProps {
  rates: MarketRate[];
}

export const MarketRates: React.FC<MarketRatesProps> = ({ rates }) => {
  const [selectedRateId, setSelectedRateId] = useState<string>(rates[0]?.id || '');
  const [quantity, setQuantity] = useState<number>(10);

  const selectedRate = rates.find(r => r.id === selectedRateId) || rates[0];
  const estimatedCost = selectedRate ? selectedRate.currentPrice * quantity : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 mb-1">
            <span>مؤشر الأسعار التداولي اليومي</span>
            <span aria-hidden="true">·</span>
            <span>أسعار الجملة والبورصة الميدانية</span>
          </div>
          <h2 className="text-2xl font-bold text-stone-900 tracking-tight">
            بورصة المحاصيل والمواشي الحلال والأسماك
          </h2>
          <p className="text-stone-600 text-sm mt-1">
            مؤشر استرشادي محدث لأسعار تداول الحبوب، المواشي بالكيلو القائم، أسماك الأحواض، والأعلاف والأسمدة.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-stone-500 bg-stone-100 px-3 py-1.5 rounded-lg shrink-0">
          <RefreshCw className="w-3.5 h-3.5 text-stone-400 animate-spin" style={{ animationDuration: '8s' }} />
          <span>تحديث لحظي لأسواق المنطقة</span>
        </div>
      </div>

      {/* Rates Table Grid */}
      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-stone-50 text-stone-600 border-b border-stone-200 font-semibold">
              <tr>
                <th className="py-3 px-4">السلعة / المحصول</th>
                <th className="py-3 px-4">التصنيف</th>
                <th className="py-3 px-4">السعر الحالي</th>
                <th className="py-3 px-4">التغير 24 ساعة</th>
                <th className="py-3 px-4">أعلى سعر</th>
                <th className="py-3 px-4">أدنى سعر</th>
                <th className="py-3 px-4">وقت التحديث</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-800">
              {rates.map((rate) => {
                const isPositive = rate.changePercent > 0;
                const isNegative = rate.changePercent < 0;

                return (
                  <tr key={rate.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-stone-900">{rate.name}</td>
                    <td className="py-3.5 px-4 text-stone-500">{rate.category}</td>
                    <td className="py-3.5 px-4 font-bold tabular-nums text-stone-900 text-sm">
                      {rate.currentPrice.toLocaleString()} <span className="text-[11px] font-normal text-stone-500">{rate.unit}</span>
                    </td>
                    <td className="py-3.5 px-4 tabular-nums">
                      <div className="flex items-center gap-1 font-semibold">
                        {isPositive && <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />}
                        {isNegative && <TrendingDown className="w-3.5 h-3.5 text-rose-600" />}
                        {!isPositive && !isNegative && <Minus className="w-3.5 h-3.5 text-stone-400" />}
                        <span className={isPositive ? 'text-emerald-700' : isNegative ? 'text-rose-700' : 'text-stone-600'}>
                          {isPositive ? `+${rate.changePercent}%` : `${rate.changePercent}%`}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 tabular-nums text-stone-600">{rate.high24h.toLocaleString()}</td>
                    <td className="py-3.5 px-4 tabular-nums text-stone-600">{rate.low24h.toLocaleString()}</td>
                    <td className="py-3.5 px-4 text-stone-400">{rate.lastUpdated}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Estimator / Cost Calculator */}
      <div className="bg-stone-900 text-white rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-stone-800 pb-3">
          <Calculator className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold">حاسبة تقدير تكاليف الشراء والكميات</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-xs text-stone-400 mb-1.5 font-medium">اختر السلعة أو المحصول:</label>
            <select
              value={selectedRateId}
              onChange={(e) => setSelectedRateId(e.target.value)}
              className="w-full px-3 py-2 bg-stone-800 border border-stone-700 rounded-lg text-xs text-stone-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              {rates.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.currentPrice} {r.unit})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-stone-400 mb-1.5 font-medium">الكمية المطلوبة:</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
              className="w-full px-3 py-2 bg-stone-800 border border-stone-700 rounded-lg text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="p-3 bg-stone-800/80 rounded-lg border border-stone-700 flex items-center justify-between">
            <span className="text-xs text-stone-400">التكلفة التقديرية الإجمالية:</span>
            <span className="text-lg font-bold text-emerald-400 tabular-nums">
              ${estimatedCost.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};
