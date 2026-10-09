import React, { useState } from 'react';
import { 
  Droplet, 
  Leaf, 
  Sprout, 
  Fish, 
  RotateCcw,
  Check,
  HelpCircle
} from 'lucide-react';

export const EngineeringCalculators: React.FC = () => {
  const [activeTool, setActiveTool] = useState<'drip' | 'fertigation' | 'density' | 'aquaculture'>('drip');

  // Tool 1: Drip Irrigation State
  const [areaSize, setAreaSize] = useState<number>(10000); // 1 hectare default
  const [rowSpacing, setRowSpacing] = useState<number>(1.5); // meters
  const [emitterSpacing, setEmitterSpacing] = useState<number>(0.4); // meters
  const [emitterFlow, setEmitterFlow] = useState<number>(4); // L/h
  const [dailyHours, setDailyHours] = useState<number>(2.5); // hours

  // Tool 2: Fertigation State
  const [cropType, setCropType] = useState<string>('tomato');
  const [fertArea, setFertArea] = useState<number>(1); // hectare
  const [growthStage, setGrowthStage] = useState<'vegetative' | 'flowering' | 'fruiting'>('fruiting');

  // Tool 3: Planting Density State
  const [densityAreaM2, setDensityAreaM2] = useState<number>(4200); // 1 acre
  const [rowDistanceCm, setRowDistanceCm] = useState<number>(75);
  const [plantDistanceCm, setPlantDistanceCm] = useState<number>(30);
  const [seedWeight1000g, setSeedWeight1000g] = useState<number>(40); // 40g per 1000 seeds
  const [germinationPercent, setGerminationPercent] = useState<number>(95);

  // Tool 4: Aquaculture Pond State
  const [pondLength, setPondLength] = useState<number>(30); // meters
  const [pondWidth, setPondWidth] = useState<number>(15); // meters
  const [pondDepth, setPondDepth] = useState<number>(1.5); // meters
  const [targetDensityKgM3, setTargetDensityKgM3] = useState<number>(18); // kg/m3 for tilapia intensive

  // Drip Calculations
  const totalPipeLengthMeters = Math.round(areaSize / rowSpacing);
  const totalEmitters = Math.round(totalPipeLengthMeters / emitterSpacing);
  const totalFlowLitersPerHour = totalEmitters * emitterFlow;
  const totalFlowM3PerHour = Number((totalFlowLitersPerHour / 1000).toFixed(2));
  const dailyWaterConsumptionM3 = Number((totalFlowM3PerHour * dailyHours).toFixed(1));
  const recommendedMainPipeInch = totalFlowM3PerHour <= 10 ? '2 بوصة (63 مم)' : totalFlowM3PerHour <= 25 ? '3 بوصة (90 مم)' : '4 بوصة (110 مم)';

  // Fertigation Calculations
  const getFertigationDoses = () => {
    let nFactor = 1;
    let pFactor = 1;
    let kFactor = 1;

    if (growthStage === 'vegetative') {
      nFactor = 1.4;
      pFactor = 1.2;
      kFactor = 0.8;
    } else if (growthStage === 'flowering') {
      nFactor = 1.0;
      pFactor = 1.5;
      kFactor = 1.2;
    } else {
      // fruiting
      nFactor = 0.9;
      pFactor = 0.8;
      kFactor = 1.8;
    }

    const baseN = cropType === 'tomato' ? 120 : cropType === 'wheat' ? 90 : 150;
    const baseP = cropType === 'tomato' ? 60 : cropType === 'wheat' ? 45 : 70;
    const baseK = cropType === 'tomato' ? 140 : cropType === 'wheat' ? 50 : 180;

    const nTotal = Math.round(baseN * nFactor * fertArea);
    const pTotal = Math.round(baseP * pFactor * fertArea);
    const kTotal = Math.round(baseK * kFactor * fertArea);

    const ureaKg = Math.round(nTotal / 0.46);
    const mapKg = Math.round(pTotal / 0.52);
    const potassiumSulfateKg = Math.round(kTotal / 0.50);

    return { nTotal, pTotal, kTotal, ureaKg, mapKg, potassiumSulfateKg };
  };
  const fertResults = getFertigationDoses();

  // Density Calculations
  const plantAreaM2 = (rowDistanceCm / 100) * (plantDistanceCm / 100);
  const totalPlants = Math.round(densityAreaM2 / plantAreaM2);
  const totalSeedsNeededKg = Number(((totalPlants / (germinationPercent / 100) * seedWeight1000g) / 1000000 * 1.1).toFixed(2));

  // Aquaculture Pond Calculations
  const pondVolumeM3 = Math.round(pondLength * pondWidth * pondDepth);
  const totalHarvestBiomassKg = Math.round(pondVolumeM3 * targetDensityKgM3);
  const fingerlingsNeeded = Math.round((totalHarvestBiomassKg / 0.45) * 1.1); // assuming 450g average fish + 10% mortality buffer
  const dailyFeedKg = Math.round(totalHarvestBiomassKg * 0.025); // 2.5% of body weight daily
  const aerationHpNeeded = Number((pondVolumeM3 / 300).toFixed(1)); // roughly 1 HP per 300 m3 intensive

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Title */}
      <div className="border-b border-stone-200 pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 mb-1">
          <span>حقيبة المهندس الزراعي والمستثمر</span>
          <span aria-hidden="true">·</span>
          <span>معادلات هيدروليكية وتسميدية حقلية</span>
        </div>
        <h2 className="text-2xl font-bold text-stone-900 tracking-tight">
          حاسبات الهندسة الزراعية وتصميم المشاريع
        </h2>
        <p className="text-stone-600 text-sm mt-1 max-w-3xl">
          أدوات حسابية متطورة لتصميم شبكات الري بالتنقيط، موازنة التسميد بالري (Fertigation)، تقدير الكثافة النباتية، وتصميم أحواض الاستزراع السمكي المائي.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTool('drip')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTool === 'drip'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          <Droplet className="w-4 h-4" />
          <span>حاسبة شبكة الري بالتنقيط</span>
        </button>

        <button
          onClick={() => setActiveTool('fertigation')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTool === 'fertigation'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          <Leaf className="w-4 h-4" />
          <span>حاسبة الاحتياج السمادي (NPK)</span>
        </button>

        <button
          onClick={() => setActiveTool('density')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTool === 'density'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          <Sprout className="w-4 h-4" />
          <span>حاسبة كثافة البذار والشتلات</span>
        </button>

        <button
          onClick={() => setActiveTool('aquaculture')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTool === 'aquaculture'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          <Fish className="w-4 h-4" />
          <span>حاسبة أحواض الاستزراع والتهوية</span>
        </button>
      </div>

      {/* Calculator Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Inputs Panel */}
        <div className="lg:col-span-6 bg-white border border-stone-200 rounded-xl p-6 space-y-6">
          
          {/* Tool 1: Drip Irrigation Form */}
          {activeTool === 'drip' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h3 className="text-base font-bold text-stone-900">مدخلات شبكة الري بالتنقيط</h3>
                <span className="text-xs text-stone-500">معايير هيدروليكية حقلية</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  مساحة الأرض المراد ريها (متر مربع):
                </label>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => setAreaSize(1000)}
                    className={`py-1 text-xs rounded border cursor-pointer ${areaSize === 1000 ? 'bg-emerald-50 border-emerald-600 text-emerald-800 font-bold' : 'border-stone-200 text-stone-600'}`}
                  >
                    1,000 م² (دونم)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAreaSize(4200)}
                    className={`py-1 text-xs rounded border cursor-pointer ${areaSize === 4200 ? 'bg-emerald-50 border-emerald-600 text-emerald-800 font-bold' : 'border-stone-200 text-stone-600'}`}
                  >
                    4,200 م² (فدان)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAreaSize(10000)}
                    className={`py-1 text-xs rounded border cursor-pointer ${areaSize === 10000 ? 'bg-emerald-50 border-emerald-600 text-emerald-800 font-bold' : 'border-stone-200 text-stone-600'}`}
                  >
                    10,000 م² (هكتار)
                  </button>
                </div>
                <input
                  type="number"
                  value={areaSize}
                  onChange={(e) => setAreaSize(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs font-semibold text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    المسافة بين خطوط الري (متر):
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={rowSpacing}
                    onChange={(e) => setRowSpacing(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs font-semibold text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                  <span className="text-[11px] text-stone-400 mt-0.5 block">خضار: 1 - 1.8م | أشجار: 3 - 6م</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    المسافة بين النقاطات (متر):
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    value={emitterSpacing}
                    onChange={(e) => setEmitterSpacing(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs font-semibold text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                  <span className="text-[11px] text-stone-400 mt-0.5 block">شائع: 0.3م إلى 0.5م</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    تصرف النقاط الفردي (لتر / ساعة):
                  </label>
                  <select
                    value={emitterFlow}
                    onChange={(e) => setEmitterFlow(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs font-semibold text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600 cursor-pointer"
                  >
                    <option value={2}>2 لتر / ساعة (تربة ثقيلة طينية)</option>
                    <option value={4}>4 لتر / ساعة (تربة متوسطة ورملية)</option>
                    <option value={8}>8 لتر / ساعة (أشجار وبساتين فاكهة)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    ساعات التشغيل اليومية (ساعات):
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={dailyHours}
                    onChange={(e) => setDailyHours(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs font-semibold text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                  <span className="text-[11px] text-stone-400 mt-0.5 block">حسب مرحلة نمو النبات وحرارة الجو</span>
                </div>
              </div>
            </div>
          )}

          {/* Tool 2: Fertigation Form */}
          {activeTool === 'fertigation' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h3 className="text-base font-bold text-stone-900">مدخلات التسميد بالري (Fertigation)</h3>
                <span className="text-xs text-stone-500">موازنة NPK</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">المحصول المستهدف:</label>
                <select
                  value={cropType}
                  onChange={(e) => setCropType(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs font-semibold text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600 cursor-pointer"
                >
                  <option value="tomato">طماطم مكشوفة وبيوت محمية</option>
                  <option value="wheat">قمح وحبوب شتوية</option>
                  <option value="potato">بطاطس صيفية وشتوية</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">المساحة المزروعة (هكتار):</label>
                  <input
                    type="number"
                    step="0.5"
                    value={fertArea}
                    onChange={(e) => setFertArea(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs font-semibold text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">المرحلة الفسيولوجية للنبات:</label>
                  <select
                    value={growthStage}
                    onChange={(e) => setGrowthStage(e.target.value as any)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs font-semibold text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600 cursor-pointer"
                  >
                    <option value="vegetative">النمو الخضري والتفريع</option>
                    <option value="flowering">التزهير والعقد</option>
                    <option value="fruiting">تحجيم ونضج الثمار</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Tool 3: Planting Density Form */}
          {activeTool === 'density' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h3 className="text-base font-bold text-stone-900">مدخلات كثافة البذار والشتل</h3>
                <span className="text-xs text-stone-500">حساب عدد الشتلات وكجم البذور</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">مساحة الحقل (متر مربع):</label>
                <input
                  type="number"
                  value={densityAreaM2}
                  onChange={(e) => setDensityAreaM2(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs font-semibold text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">المسافة بين السطور (سم):</label>
                  <input
                    type="number"
                    value={rowDistanceCm}
                    onChange={(e) => setRowDistanceCm(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs font-semibold text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">المسافة بين الشتلات / الجور (سم):</label>
                  <input
                    type="number"
                    value={plantDistanceCm}
                    onChange={(e) => setPlantDistanceCm(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs font-semibold text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">وزن الألف بذرة (جرام):</label>
                  <input
                    type="number"
                    value={seedWeight1000g}
                    onChange={(e) => setSeedWeight1000g(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs font-semibold text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">نسبة الإنبات المعلنة (%):</label>
                  <input
                    type="number"
                    value={germinationPercent}
                    onChange={(e) => setGerminationPercent(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs font-semibold text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tool 4: Aquaculture Pond Form */}
          {activeTool === 'aquaculture' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h3 className="text-base font-bold text-stone-900">أبعاد ومواصفات حوض الاستزراع</h3>
                <span className="text-xs text-stone-500">حساب الأحجام والتهوية والعلف</span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">طول الحوض (م):</label>
                  <input
                    type="number"
                    value={pondLength}
                    onChange={(e) => setPondLength(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs font-semibold text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">عرض الحوض (م):</label>
                  <input
                    type="number"
                    value={pondWidth}
                    onChange={(e) => setPondWidth(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs font-semibold text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">عمق الماء (م):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={pondDepth}
                    onChange={(e) => setPondDepth(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs font-semibold text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  كثافة التخزين المستهدفة (كجم سمك / م³ ماء):
                </label>
                <select
                  value={targetDensityKgM3}
                  onChange={(e) => setTargetDensityKgM3(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs font-semibold text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600 cursor-pointer"
                >
                  <option value={8}>نظام شبه مكثف (ترابي عادي): 5 - 10 كجم / م³</option>
                  <option value={18}>نظام مكثف (أحواض خرسانية/مبطنة بتهوية): 15 - 20 كجم / م³</option>
                  <option value={30}>نظام فائق التكثيف (تدوير مياه RAS): 25 - 35 كجم / م³</option>
                </select>
              </div>
            </div>
          )}

        </div>

        {/* Right Output Results Panel */}
        <div className="lg:col-span-6 bg-stone-900 text-white rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-emerald-400">المخرجات والتوصيات الهندسية الحسابية</span>
            </div>
            <span className="text-xs text-stone-400">معايير دقيقة</span>
          </div>

          {/* Drip Irrigation Results */}
          {activeTool === 'drip' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-stone-800/90 rounded-lg border border-stone-700">
                  <div className="text-xs text-stone-400 mb-1">تصرف المضخة المطلوب</div>
                  <div className="text-2xl font-bold text-white tabular-nums">
                    {totalFlowM3PerHour} <span className="text-xs font-normal text-emerald-300">م³ / ساعة</span>
                  </div>
                  <div className="text-[11px] text-stone-400 mt-1">يعادل {totalFlowLitersPerHour.toLocaleString()} لتر/ساعة</div>
                </div>

                <div className="p-4 bg-stone-800/90 rounded-lg border border-stone-700">
                  <div className="text-xs text-stone-400 mb-1">الاستهلاك اليومي الكلي</div>
                  <div className="text-2xl font-bold text-emerald-400 tabular-nums">
                    {dailyWaterConsumptionM3} <span className="text-xs font-normal text-stone-300">م³ / يوم</span>
                  </div>
                  <div className="text-[11px] text-stone-400 mt-1">بمعدل تشغيل {dailyHours} ساعات</div>
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-stone-300 pt-2 border-t border-stone-800">
                <div className="flex items-center justify-between py-1 border-b border-stone-800">
                  <span className="text-stone-400">إجمالي عدد النقاطات بالحقل</span>
                  <span className="font-bold text-white tabular-nums">{totalEmitters.toLocaleString()} نقاط</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-stone-800">
                  <span className="text-stone-400">أطوال مواسير الري بالتنقيط (خراطيم)</span>
                  <span className="font-bold text-white tabular-nums">{totalPipeLengthMeters.toLocaleString()} متر طولي</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-stone-400">القطر الاسمي الموصى به للخط الرئيسي</span>
                  <span className="font-bold text-emerald-300">{recommendedMainPipeInch}</span>
                </div>
              </div>

              <div className="p-3 bg-emerald-950/60 border border-emerald-800/60 rounded-lg text-xs text-emerald-200">
                <span className="font-bold">نصيحة هندسية:</span> تأكد من تركيب فلتر هيدروسيكلون + فلتر شبكي في بداية المحطة لتفادي انسداد النقاطات، وضبط ضغط التشغيل على 1.2 إلى 1.5 بار.
              </div>
            </div>
          )}

          {/* Fertigation Results */}
          {activeTool === 'fertigation' && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-stone-800/90 rounded-lg border border-stone-700 text-center">
                  <div className="text-[11px] text-stone-400">نيتروجين N صافي</div>
                  <div className="text-lg font-bold text-emerald-400 tabular-nums mt-1">{fertResults.nTotal} كجم</div>
                </div>
                <div className="p-3 bg-stone-800/90 rounded-lg border border-stone-700 text-center">
                  <div className="text-[11px] text-stone-400">فوسفور P2O5 صافي</div>
                  <div className="text-lg font-bold text-emerald-400 tabular-nums mt-1">{fertResults.pTotal} كجم</div>
                </div>
                <div className="p-3 bg-stone-800/90 rounded-lg border border-stone-700 text-center">
                  <div className="text-[11px] text-stone-400">بوتاسيوم K2O صافي</div>
                  <div className="text-lg font-bold text-emerald-400 tabular-nums mt-1">{fertResults.kTotal} كجم</div>
                </div>
              </div>

              <div className="space-y-2 text-xs text-stone-300 pt-2 border-t border-stone-800">
                <div className="font-semibold text-stone-200 mb-1">الكميات المعادلة من الأسمدة التجارية الشائعة:</div>
                <div className="flex items-center justify-between py-1 border-b border-stone-800">
                  <span className="text-stone-400">يوريا 46% (أو نترات نشادر 33.5%)</span>
                  <span className="font-bold text-white tabular-nums">{fertResults.ureaKg} كجم</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-stone-800">
                  <span className="text-stone-400">سماد أحادي أمونيوم فوسفات MAP 12-61-0</span>
                  <span className="font-bold text-white tabular-nums">{fertResults.mapKg} كجم</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-stone-400">سلفات بوتاسيوم ذواب 0-0-50</span>
                  <span className="font-bold text-white tabular-nums">{fertResults.potassiumSulfateKg} كجم</span>
                </div>
              </div>

              <div className="p-3 bg-emerald-950/60 border border-emerald-800/60 rounded-lg text-xs text-emerald-200">
                <span className="font-bold">توصية الحقن:</span> قسّم هذه الجرعات على ريات الأسبوع (3 ريات أسبوعياً) مع حقن حامض الفوسفوريك دورياً لتنظيف شبكة النقاطات من الأملاح والكلس.
              </div>
            </div>
          )}

          {/* Density Results */}
          {activeTool === 'density' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-stone-800/90 rounded-lg border border-stone-700">
                  <div className="text-xs text-stone-400 mb-1">الكثافة النباتية الإجمالية</div>
                  <div className="text-2xl font-bold text-emerald-400 tabular-nums">
                    {totalPlants.toLocaleString()} <span className="text-xs font-normal text-stone-300">نبات / شتلة</span>
                  </div>
                  <div className="text-[11px] text-stone-400 mt-1">بمساحة {plantAreaM2.toFixed(3)} م² لكل نبات</div>
                </div>

                <div className="p-4 bg-stone-800/90 rounded-lg border border-stone-700">
                  <div className="text-xs text-stone-400 mb-1">كمية البذور المطلوبة</div>
                  <div className="text-2xl font-bold text-white tabular-nums">
                    {totalSeedsNeededKg} <span className="text-xs font-normal text-emerald-300">كجم بذور</span>
                  </div>
                  <div className="text-[11px] text-stone-400 mt-1">شاملة 10% هامش ترقيع وإنبات</div>
                </div>
              </div>

              <div className="p-3 bg-emerald-950/60 border border-emerald-800/60 rounded-lg text-xs text-emerald-200">
                <span className="font-bold">ملاحظة هندسية:</span> عند الزراعة بالشتلات في صواني المشتل (209 عين)، ستحتاج تقريباً إلى {Math.ceil(totalPlants / 200)} صينية شتلات للمساحة المحددة.
              </div>
            </div>
          )}

          {/* Aquaculture Results */}
          {activeTool === 'aquaculture' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-stone-800/90 rounded-lg border border-stone-700">
                  <div className="text-xs text-stone-400 mb-1">حجم الماء بالحوض</div>
                  <div className="text-2xl font-bold text-white tabular-nums">
                    {pondVolumeM3.toLocaleString()} <span className="text-xs font-normal text-emerald-300">متر مكعب</span>
                  </div>
                  <div className="text-[11px] text-stone-400 mt-1">مساحة السطح {(pondLength * pondWidth).toLocaleString()} م²</div>
                </div>

                <div className="p-4 bg-stone-800/90 rounded-lg border border-stone-700">
                  <div className="text-xs text-stone-400 mb-1">الإنتاج المتوقع للحوض</div>
                  <div className="text-2xl font-bold text-emerald-400 tabular-nums">
                    {totalHarvestBiomassKg.toLocaleString()} <span className="text-xs font-normal text-stone-300">كجم سمك</span>
                  </div>
                  <div className="text-[11px] text-stone-400 mt-1">في نهاية دورة التسمين</div>
                </div>
              </div>

              <div className="space-y-2 text-xs text-stone-300 pt-2 border-t border-stone-800">
                <div className="flex items-center justify-between py-1 border-b border-stone-800">
                  <span className="text-stone-400">عدد الزريعة المطلوبة عند البدء</span>
                  <span className="font-bold text-white tabular-nums">{fingerlingsNeeded.toLocaleString()} سمكة</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-stone-800">
                  <span className="text-stone-400">استهلاك العلف اليومي عند ذروة النمو</span>
                  <span className="font-bold text-white tabular-nums">{dailyFeedKg} كجم / يوم</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-stone-400">قدرة بدالات التهوية الميكانيكية الموصى بها</span>
                  <span className="font-bold text-emerald-300 tabular-nums">{aerationHpNeeded} حصان (HP)</span>
                </div>
              </div>

              <div className="p-3 bg-emerald-950/60 border border-emerald-800/60 rounded-lg text-xs text-emerald-200">
                <span className="font-bold">تنبيه جودة المياه:</span> شغل البدالات ليلاً من الساعة 11 مساءً حتى شروق الشمس عندما يتوقف التمثيل الضوئي للنباتات ويهبط الأكسجين الذائب إلى أدنى مستوياته.
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
