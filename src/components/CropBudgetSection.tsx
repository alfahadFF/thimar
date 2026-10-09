import React, { useState } from 'react';
import { CropSeasonBudget, BudgetItem, CropRevenueItem, BudgetCostCategory } from '../types';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Plus, 
  Trash2, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  FileSpreadsheet, 
  Printer, 
  X,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  ShoppingBag,
  Percent
} from 'lucide-react';

interface CropBudgetSectionProps {
  budgets: CropSeasonBudget[];
  onAddSeason: (newSeason: CropSeasonBudget) => void;
  onAddCostItem: (seasonId: string, item: BudgetItem) => void;
  onAddRevenueItem: (seasonId: string, item: CropRevenueItem) => void;
  onDeleteCostItem: (seasonId: string, itemId: string) => void;
  onDeleteRevenueItem: (seasonId: string, itemId: string) => void;
}

const COST_CATEGORIES: { id: BudgetCostCategory; label: string }[] = [
  { id: 'seeds_seedlings', label: 'بذور وأشتال معتمدة' },
  { id: 'fertilizers', label: 'أسمدة ومخصبات زراعية' },
  { id: 'pest_control', label: 'مبيدات ووقاية ومكافحة' },
  { id: 'irrigation_energy', label: 'ري وطاقة ومحروقات' },
  { id: 'labor', label: 'عمالة زراعية وإشراف' },
  { id: 'feed_veterinary', label: 'أعلاف ورعاية بيطرية' },
  { id: 'machinery_rent', label: 'ميكنة وحصاد وإيجار معدات' },
  { id: 'packaging_logistics', label: 'تعبئة وتغليف ونقل' },
  { id: 'other', label: 'مصاريف تشغيلية متنوعة' },
];

export const CropBudgetSection: React.FC<CropBudgetSectionProps> = ({
  budgets,
  onAddSeason,
  onAddCostItem,
  onAddRevenueItem,
  onDeleteCostItem,
  onDeleteRevenueItem
}) => {
  const [selectedSeasonId, setSelectedSeasonId] = useState<string>(budgets[0]?.id || '');
  
  // Modals state
  const [isNewSeasonModalOpen, setIsNewSeasonModalOpen] = useState(false);
  const [isAddCostModalOpen, setIsAddCostModalOpen] = useState(false);
  const [isAddRevenueModalOpen, setIsAddRevenueModalOpen] = useState(false);

  // New Season Form
  const [seasonName, setSeasonName] = useState('');
  const [cropOrSector, setCropOrSector] = useState('');
  const [areaOrUnits, setAreaOrUnits] = useState('');
  const [countryRegion, setCountryRegion] = useState('مصر - وادي النطرون');
  const [startDate, setStartDate] = useState('2026-10-15');
  const [harvestOrEndDate, setHarvestOrEndDate] = useState('2027-04-20');
  const [targetYield, setTargetYield] = useState('');

  // New Cost Form
  const [costCategory, setCostCategory] = useState<BudgetCostCategory>('fertilizers');
  const [costDescription, setCostDescription] = useState('');
  const [costPlanned, setCostPlanned] = useState<number>(0);
  const [costActual, setCostActual] = useState<number>(0);
  const [costStatus, setCostStatus] = useState<'planned' | 'paid' | 'pending'>('paid');
  const [costDate, setCostDate] = useState('2026-10-09');

  // New Revenue Form
  const [revProductName, setRevProductName] = useState('');
  const [revQuantity, setRevQuantity] = useState<number>(0);
  const [revUnit, setRevUnit] = useState('طن');
  const [revPricePerUnit, setRevPricePerUnit] = useState<number>(0);
  const [revBuyer, setRevBuyer] = useState('');
  const [revDate, setRevDate] = useState('2026-10-09');
  const [revPaymentStatus, setRevPaymentStatus] = useState<'received' | 'partial' | 'pending'>('received');

  const currentSeason = budgets.find(b => b.id === selectedSeasonId) || budgets[0];

  if (!currentSeason) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center border border-stone-200">
        <p className="text-stone-500">لا توجد مواسم زراعية مسجلة حالياً.</p>
        <button
          onClick={() => setIsNewSeasonModalOpen(true)}
          className="mt-4 px-4 py-2 bg-emerald-800 text-white rounded-lg text-xs font-bold"
        >
          إنشاء أول موسم زراعي
        </button>
      </div>
    );
  }

  // Calculate financials in USD ($)
  const totalPlannedCost = currentSeason.costItems.reduce((acc, curr) => acc + curr.plannedCost, 0);
  const totalActualCost = currentSeason.costItems.reduce((acc, curr) => acc + curr.actualCost, 0);
  const totalRevenue = currentSeason.revenueItems.reduce((acc, curr) => acc + curr.totalRevenue, 0);
  const netProfit = totalRevenue - totalActualCost;
  const costVariance = totalPlannedCost - totalActualCost;
  const roiPercentage = totalActualCost > 0 ? Math.round((netProfit / totalActualCost) * 100) : 0;
  const profitMargin = totalRevenue > 0 ? Math.round((netProfit / totalRevenue) * 100) : 0;

  const handleCreateSeason = (e: React.FormEvent) => {
    e.preventDefault();
    if (!seasonName || !cropOrSector) return;
    const newSeason: CropSeasonBudget = {
      id: `budget-season-${Date.now()}`,
      seasonName,
      cropOrSector,
      areaOrUnits: areaOrUnits || '10 هكتار',
      countryRegion: countryRegion || 'مصر / الأردن / المغرب / السعودية',
      startDate,
      harvestOrEndDate,
      targetYield: targetYield || 'محصول مستهدف نخب أول',
      costItems: [],
      revenueItems: []
    };
    onAddSeason(newSeason);
    setSelectedSeasonId(newSeason.id);
    setIsNewSeasonModalOpen(false);
    setSeasonName('');
    setCropOrSector('');
    setAreaOrUnits('');
    setTargetYield('');
  };

  const handleCreateCostItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!costDescription || costPlanned <= 0) return;
    const catLabel = COST_CATEGORIES.find(c => c.id === costCategory)?.label || 'مصاريف';
    const item: BudgetItem = {
      id: `cost-${Date.now()}`,
      category: costCategory,
      categoryName: catLabel,
      description: costDescription,
      plannedCost: costPlanned,
      actualCost: costActual > 0 ? costActual : costPlanned,
      status: costStatus,
      date: costDate
    };
    onAddCostItem(currentSeason.id, item);
    setIsAddCostModalOpen(false);
    setCostDescription('');
    setCostPlanned(0);
    setCostActual(0);
  };

  const handleCreateRevenueItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revProductName || revQuantity <= 0 || revPricePerUnit <= 0) return;
    const item: CropRevenueItem = {
      id: `rev-${Date.now()}`,
      productName: revProductName,
      quantitySold: revQuantity,
      unit: revUnit,
      pricePerUnit: revPricePerUnit,
      totalRevenue: revQuantity * revPricePerUnit,
      buyerName: revBuyer || 'مشتري / سوق الجملة',
      saleDate: revDate,
      paymentStatus: revPaymentStatus
    };
    onAddRevenueItem(currentSeason.id, item);
    setIsAddRevenueModalOpen(false);
    setRevProductName('');
    setRevQuantity(0);
    setRevPricePerUnit(0);
    setRevBuyer('');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Header and Season Selector Bar */}
      <div className="bg-white border border-stone-200 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 mb-1">
            <DollarSign className="w-4 h-4 text-emerald-700" />
            <span>إدارة ميزانية المحاصيل والمواسم الزراعية الدولية</span>
            <span aria-hidden="true">·</span>
            <span className="text-stone-500">الأسعار بالدولار الأمريكي ($)</span>
          </div>
          <h3 className="text-xl font-bold text-stone-900 tracking-tight">
            متابعة التكاليف المتوقعة مقابل المبيعات المحققة
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            حساب الرصيد المالي لكل موسم، نسبة وفر الميزانية، وصافي الأرباح لمزارعك في مصر، الأردن، المغرب، الخليج وغيرها.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Season Switcher Dropdown */}
          <select
            value={currentSeason.id}
            onChange={(e) => setSelectedSeasonId(e.target.value)}
            className="px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer"
          >
            {budgets.map((b) => (
              <option key={b.id} value={b.id}>
                {b.seasonName} ({b.countryRegion})
              </option>
            ))}
          </select>

          <button
            onClick={() => setIsNewSeasonModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>موسم زراعي جديد</span>
          </button>
        </div>
      </div>

      {/* Season Profile Card */}
      <div className="bg-stone-900 text-white rounded-2xl p-5 sm:p-6 border border-stone-800 relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px]" 
          aria-hidden="true" 
        />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2 text-xs text-emerald-400">
              <span className="font-bold">{currentSeason.cropOrSector}</span>
              <span>·</span>
              <span>المساحة / السعة: {currentSeason.areaOrUnits}</span>
            </div>
            <h4 className="text-xl font-extrabold text-white">{currentSeason.seasonName}</h4>
            <div className="flex flex-wrap items-center gap-3 text-xs text-stone-400 pt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                {currentSeason.countryRegion}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-stone-400" />
                من {currentSeason.startDate} إلى {currentSeason.harvestOrEndDate}
              </span>
              <span>·</span>
              <span className="text-emerald-300">الإنتاج المستهدف: {currentSeason.targetYield}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => window.print()}
              className="px-3 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-stone-700"
              title="طباعة تقرير الميزانية"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>طباعة كشف الحساب</span>
            </button>
          </div>
        </div>
      </div>

      {/* Financial KPIs 5-Card Dashboard */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        
        {/* Planned Cost */}
        <div className="p-4 bg-white border border-stone-200 rounded-xl">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <span>التكاليف المقدرة</span>
            <Clock className="w-3.5 h-3.5 text-stone-400" />
          </div>
          <div className="text-xl font-extrabold text-stone-800 tabular-nums">
            ${totalPlannedCost.toLocaleString()}
          </div>
          <div className="text-[11px] text-stone-400 mt-0.5">الميزانية المرصودة للموسم</div>
        </div>

        {/* Actual Cost */}
        <div className="p-4 bg-white border border-stone-200 rounded-xl">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <span>التكاليف الفعلية المنفقة</span>
            <ArrowDownRight className="w-3.5 h-3.5 text-rose-500" />
          </div>
          <div className="text-xl font-extrabold text-rose-700 tabular-nums">
            ${totalActualCost.toLocaleString()}
          </div>
          <div className="text-[11px] text-stone-500 mt-0.5">
            {costVariance >= 0 ? (
              <span className="text-emerald-700 font-semibold">وفر بالميزانية: +${costVariance.toLocaleString()}</span>
            ) : (
              <span className="text-rose-600 font-semibold">تجاوز الميزانية: -${Math.abs(costVariance).toLocaleString()}</span>
            )}
          </div>
        </div>

        {/* Realized Sales */}
        <div className="p-4 bg-white border border-stone-200 rounded-xl">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <span>المبيعات والإيرادات</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="text-xl font-extrabold text-emerald-800 tabular-nums">
            ${totalRevenue.toLocaleString()}
          </div>
          <div className="text-[11px] text-stone-400 mt-0.5">
            {currentSeason.revenueItems.length} عملية بيع مسجلة
          </div>
        </div>

        {/* Net Profit Balance */}
        <div className={`p-4 rounded-xl border ${netProfit >= 0 ? 'bg-emerald-50/70 border-emerald-300' : 'bg-rose-50 border-rose-300'}`}>
          <div className="flex items-center justify-between text-xs font-semibold mb-1">
            <span className={netProfit >= 0 ? 'text-emerald-900' : 'text-rose-900'}>الرصيد المالي (صافي الأرباح)</span>
            <TrendingUp className={`w-3.5 h-3.5 ${netProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`} />
          </div>
          <div className={`text-xl font-extrabold tabular-nums ${netProfit >= 0 ? 'text-emerald-800' : 'text-rose-700'}`}>
            {netProfit >= 0 ? `+$${netProfit.toLocaleString()}` : `-$${Math.abs(netProfit).toLocaleString()}`}
          </div>
          <div className="text-[11px] font-semibold mt-0.5">
            {netProfit >= 0 ? (
              <span className="text-emerald-700">موسم رابح (هامش {profitMargin}%)</span>
            ) : (
              <span className="text-rose-600">عجز مؤقت قبل الحصاد</span>
            )}
          </div>
        </div>

        {/* ROI % */}
        <div className="p-4 bg-white border border-stone-200 rounded-xl col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <span>عائد الاستثمار (ROI)</span>
            <Percent className="w-3.5 h-3.5 text-stone-400" />
          </div>
          <div className="text-xl font-extrabold text-stone-900 tabular-nums">
            {roiPercentage}%
          </div>
          <div className="text-[11px] text-stone-400 mt-0.5">صافي العائد على رأس المال</div>
        </div>

      </div>

      {/* Section 1: Detailed Costs vs Planned */}
      <div className="bg-white border border-stone-200 rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
          <div>
            <h4 className="text-base font-bold text-stone-900">
              1. سجل تكاليف الموسم (المتوقعة مقابل المنفقة)
            </h4>
            <p className="text-xs text-stone-500">
              بذور، أسمدة، ري، مبيدات، عمالة ومعدات بالدولار الأمريكي
            </p>
          </div>

          <button
            onClick={() => setIsAddCostModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>إضافة بند تكلفة جديد</span>
          </button>
        </div>

        {currentSeason.costItems.length === 0 ? (
          <div className="text-center py-8 text-stone-400 text-xs">
            لا توجد تكاليف مسجلة لهذا الموسم بعد. انقر على &quot;إضافة بند تكلفة جديد&quot;.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500 font-semibold bg-stone-50">
                  <th className="py-2.5 px-3">التصنيف</th>
                  <th className="py-2.5 px-3">بيان المصروف</th>
                  <th className="py-2.5 px-3">المتوقع ($)</th>
                  <th className="py-2.5 px-3">الفعلي المنفق ($)</th>
                  <th className="py-2.5 px-3">الفارق</th>
                  <th className="py-2.5 px-3">الحالة</th>
                  <th className="py-2.5 px-3">التاريخ</th>
                  <th className="py-2.5 px-3 text-center">حذف</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {currentSeason.costItems.map((item) => {
                  const diff = item.plannedCost - item.actualCost;
                  return (
                    <tr key={item.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-3 px-3 font-semibold text-emerald-900 whitespace-nowrap">
                        {item.categoryName}
                      </td>
                      <td className="py-3 px-3 text-stone-800 font-medium">
                        {item.description}
                      </td>
                      <td className="py-3 px-3 tabular-nums font-semibold text-stone-600 whitespace-nowrap">
                        ${item.plannedCost.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 tabular-nums font-bold text-stone-900 whitespace-nowrap">
                        ${item.actualCost.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 tabular-nums whitespace-nowrap font-medium">
                        {diff >= 0 ? (
                          <span className="text-emerald-700">وفر +${diff}</span>
                        ) : (
                          <span className="text-rose-600">زيادة -${Math.abs(diff)}</span>
                        )}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {item.status === 'paid' ? 'مدفوع' : 'معلق / مستحق'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-stone-400 tabular-nums whitespace-nowrap">
                        {item.date}
                      </td>
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <button
                          onClick={() => onDeleteCostItem(currentSeason.id, item.id)}
                          className="p-1 text-stone-400 hover:text-rose-600 rounded cursor-pointer"
                          title="حذف البند"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Section 2: Realized Sales / Revenues */}
      <div className="bg-white border border-stone-200 rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
          <div>
            <h4 className="text-base font-bold text-stone-900">
              2. سجل المبيعات والإيرادات المحققة
            </h4>
            <p className="text-xs text-stone-500">
              كميات المحاصيل المباعة، أسعار البيع للوحدة، والمحصلات المالية
            </p>
          </div>

          <button
            onClick={() => setIsAddRevenueModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>تسجيل عملية بيع جديدة</span>
          </button>
        </div>

        {currentSeason.revenueItems.length === 0 ? (
          <div className="text-center py-8 text-stone-400 text-xs">
            لا توجد مبيعات مسجلة لهذا الموسم بعد. سجل مبيعات الحصاد لمتابعة أرباحك.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500 font-semibold bg-stone-50">
                  <th className="py-2.5 px-3">المنتج / المحصول</th>
                  <th className="py-2.5 px-3">الكمية المباعة</th>
                  <th className="py-2.5 px-3">سعر الوحدة ($)</th>
                  <th className="py-2.5 px-3">إجمالي الإيراد ($)</th>
                  <th className="py-2.5 px-3">المشتري / العميل</th>
                  <th className="py-2.5 px-3">تاريخ البيع</th>
                  <th className="py-2.5 px-3">حالة السداد</th>
                  <th className="py-2.5 px-3 text-center">حذف</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {currentSeason.revenueItems.map((rev) => (
                  <tr key={rev.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3 px-3 font-semibold text-stone-900">
                      {rev.productName}
                    </td>
                    <td className="py-3 px-3 tabular-nums font-bold text-stone-800 whitespace-nowrap">
                      {rev.quantitySold} {rev.unit}
                    </td>
                    <td className="py-3 px-3 tabular-nums text-stone-700 whitespace-nowrap">
                      ${rev.pricePerUnit} / {rev.unit}
                    </td>
                    <td className="py-3 px-3 tabular-nums font-extrabold text-emerald-800 whitespace-nowrap">
                      ${rev.totalRevenue.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-stone-600 whitespace-nowrap">
                      {rev.buyerName}
                    </td>
                    <td className="py-3 px-3 text-stone-400 tabular-nums whitespace-nowrap">
                      {rev.saleDate}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        rev.paymentStatus === 'received' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {rev.paymentStatus === 'received' ? 'مقبوض بالكامل' : 'دفعة جزئية / آجل'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <button
                        onClick={() => onDeleteRevenueItem(currentSeason.id, rev.id)}
                        className="p-1 text-stone-400 hover:text-rose-600 rounded cursor-pointer"
                        title="حذف عملية البيع"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal 1: Create New Season */}
      {isNewSeasonModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div onClick={() => setIsNewSeasonModalOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-xs" />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 space-y-4 border border-stone-200">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <h3 className="text-base font-bold text-stone-900">إنشاء موسم زراعي / دورة إنتاج جديدة</h3>
                <button onClick={() => setIsNewSeasonModalOpen(false)} className="p-1 text-stone-400 hover:text-stone-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateSeason} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">اسم الموسم أو العروة:</label>
                  <input
                    type="text"
                    required
                    value={seasonName}
                    onChange={(e) => setSeasonName(e.target.value)}
                    placeholder="مثال: موسم القمح الشتوي 2026 / عروة الطماطم الخريفية"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">المحصول أو القطاع:</label>
                    <input
                      type="text"
                      required
                      value={cropOrSector}
                      onChange={(e) => setCropOrSector(e.target.value)}
                      placeholder="مثال: قمح صلب / خراف عواسي / بلطي"
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">المساحة أو السعة:</label>
                    <input
                      type="text"
                      value={areaOrUnits}
                      onChange={(e) => setAreaOrUnits(e.target.value)}
                      placeholder="مثال: 20 هكتار / 300 رأس"
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">الدولة والمنطقة:</label>
                    <input
                      type="text"
                      value={countryRegion}
                      onChange={(e) => setCountryRegion(e.target.value)}
                      placeholder="مثال: مصر - وادي النطرون / الأردن - الأغوار"
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">الإنتاج المستهدف:</label>
                    <input
                      type="text"
                      value={targetYield}
                      onChange={(e) => setTargetYield(e.target.value)}
                      placeholder="مثال: 60 طن / 18,000 كجم"
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">تاريخ البدء:</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">تاريخ الحصاد / الانتهاء المتوقع:</label>
                    <input
                      type="date"
                      value={harvestOrEndDate}
                      onChange={(e) => setHarvestOrEndDate(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsNewSeasonModalOpen(false)}
                    className="px-4 py-2 border border-stone-300 rounded-lg text-stone-700 font-semibold"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-bold shadow-sm"
                  >
                    حفظ الموسم
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Add Cost Item */}
      {isAddCostModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div onClick={() => setIsAddCostModalOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-xs" />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 space-y-4 border border-stone-200">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <h3 className="text-base font-bold text-stone-900">إضافة بند تكلفة / مصروف</h3>
                <button onClick={() => setIsAddCostModalOpen(false)} className="p-1 text-stone-400 hover:text-stone-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateCostItem} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">تصنيف المصروف:</label>
                  <select
                    value={costCategory}
                    onChange={(e) => setCostCategory(e.target.value as BudgetCostCategory)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  >
                    {COST_CATEGORIES.map(c => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">بيان المصروف وتفاصيله:</label>
                  <input
                    type="text"
                    required
                    value={costDescription}
                    onChange={(e) => setCostDescription(e.target.value)}
                    placeholder="مثال: شراء سماد NPK ذواب + سلفات نشادر 2 طن"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">التكلفة المتوقعة ($):</label>
                    <input
                      type="number"
                      required
                      min="1"
                      step="any"
                      value={costPlanned || ''}
                      onChange={(e) => setCostPlanned(Number(e.target.value))}
                      placeholder="1200"
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">التكلفة الفعلية المنفقة ($):</label>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={costActual || ''}
                      onChange={(e) => setCostActual(Number(e.target.value))}
                      placeholder="إذا صُرفت بالفعل"
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600 font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">حالة السداد:</label>
                    <select
                      value={costStatus}
                      onChange={(e) => setCostStatus(e.target.value as any)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    >
                      <option value="paid">تم الصرف والوفاء</option>
                      <option value="planned">مخطط مستقبلاً</option>
                      <option value="pending">مستحق لم يدفع بعد</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">تاريخ البند:</label>
                    <input
                      type="date"
                      value={costDate}
                      onChange={(e) => setCostDate(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddCostModalOpen(false)}
                    className="px-4 py-2 border border-stone-300 rounded-lg text-stone-700 font-semibold"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-bold shadow-sm"
                  >
                    حفظ البند
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Add Revenue Item */}
      {isAddRevenueModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div onClick={() => setIsAddRevenueModalOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-xs" />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 space-y-4 border border-stone-200">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <h3 className="text-base font-bold text-stone-900">تسجيل عملية بيع وإيراد محقق</h3>
                <button onClick={() => setIsAddRevenueModalOpen(false)} className="p-1 text-stone-400 hover:text-stone-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateRevenueItem} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">اسم المحصول / الصنف المباع:</label>
                  <input
                    type="text"
                    required
                    value={revProductName}
                    onChange={(e) => setRevProductName(e.target.value)}
                    placeholder="مثال: قمح صلب نخب أول / طماطم فرز أول"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">الكمية المباعة:</label>
                    <input
                      type="number"
                      required
                      min="0.1"
                      step="any"
                      value={revQuantity || ''}
                      onChange={(e) => setRevQuantity(Number(e.target.value))}
                      placeholder="مثال: 25"
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">وحدة القياس:</label>
                    <select
                      value={revUnit}
                      onChange={(e) => setRevUnit(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    >
                      <option value="طن">طن</option>
                      <option value="كجم">كجم</option>
                      <option value="صندوق">صندوق / قفص</option>
                      <option value="رأس">رأس (مواشي)</option>
                      <option value="لتر">لتر (حليب)</option>
                      <option value="بالة">بالة (أعلاف وقش)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">سعر الوحدة بالدولار ($):</label>
                  <input
                    type="number"
                    required
                    min="0.01"
                    step="any"
                    value={revPricePerUnit || ''}
                    onChange={(e) => setRevPricePerUnit(Number(e.target.value))}
                    placeholder="مثال: 320"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600 font-bold"
                  />
                  {revQuantity > 0 && revPricePerUnit > 0 && (
                    <div className="text-[11px] text-emerald-800 font-bold mt-1 bg-emerald-50 p-1.5 rounded">
                      إجمالي الإيراد المتوقع: ${(revQuantity * revPricePerUnit).toLocaleString()}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">جهة الشراء / العميل:</label>
                    <input
                      type="text"
                      value={revBuyer}
                      onChange={(e) => setRevBuyer(e.target.value)}
                      placeholder="مثال: شركة الصوامع / سوق الجملة"
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">حالة الدفع:</label>
                    <select
                      value={revPaymentStatus}
                      onChange={(e) => setRevPaymentStatus(e.target.value as any)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    >
                      <option value="received">تم التحصيل بالكامل</option>
                      <option value="partial">تحصيل جزئي</option>
                      <option value="pending">آجل قيد التحصيل</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">تاريخ البيع:</label>
                  <input
                    type="date"
                    value={revDate}
                    onChange={(e) => setRevDate(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>

                <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddRevenueModalOpen(false)}
                    className="px-4 py-2 border border-stone-300 rounded-lg text-stone-700 font-semibold"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-bold shadow-sm"
                  >
                    تسجيل البيع
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
