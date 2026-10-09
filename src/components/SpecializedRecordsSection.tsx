import React, { useState } from 'react';
import { 
  AgronomyFieldRecord, 
  LivestockHerdRecord, 
  AquaculturePondRecord, 
  LabAnalysisRecord 
} from '../types';
import { 
  Sprout, 
  ShieldCheck, 
  Fish, 
  FlaskConical, 
  Plus, 
  Trash2, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  Droplet, 
  X,
  FileText,
  Activity,
  Layers
} from 'lucide-react';

interface SpecializedRecordsSectionProps {
  fieldRecords: AgronomyFieldRecord[];
  livestockRecords: LivestockHerdRecord[];
  aquacultureRecords: AquaculturePondRecord[];
  labRecords: LabAnalysisRecord[];
  onAddFieldRecord: (rec: AgronomyFieldRecord) => void;
  onAddLivestockRecord: (rec: LivestockHerdRecord) => void;
  onAddAquacultureRecord: (rec: AquaculturePondRecord) => void;
  onAddLabRecord: (rec: LabAnalysisRecord) => void;
  onDeleteRecord: (type: 'field' | 'livestock' | 'aquaculture' | 'lab', id: string) => void;
}

export const SpecializedRecordsSection: React.FC<SpecializedRecordsSectionProps> = ({
  fieldRecords,
  livestockRecords,
  aquacultureRecords,
  labRecords,
  onAddFieldRecord,
  onAddLivestockRecord,
  onAddAquacultureRecord,
  onAddLabRecord,
  onDeleteRecord
}) => {
  const [activeTab, setActiveTab] = useState<'field' | 'livestock' | 'aquaculture' | 'lab'>('field');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states for Field
  const [fCropName, setFCropName] = useState('');
  const [fVariety, setFVariety] = useState('');
  const [fPlot, setFPlot] = useState('');
  const [fAreaSize, setFAreaSize] = useState<number>(10);
  const [fAreaUnit, setFAreaUnit] = useState<'هكتار' | 'فدان' | 'دونم'>('هكتار');
  const [fIrrigation, setFIrrigation] = useState<'drip' | 'pivot' | 'sprinkler' | 'flood'>('drip');
  const [fPlantDate, setFPlantDate] = useState('2026-10-15');
  const [fHarvestDate, setFHarvestDate] = useState('2027-04-10');
  const [fSoilType, setFSoilType] = useState('طميية رملية جيدة الصرف');
  const [fTargetYieldTon, setFTargetYieldTon] = useState<number>(35);
  const [fCountry, setFCountry] = useState('مصر - وادي النطرون');
  const [fNotes, setFNotes] = useState('');

  // Form states for Livestock
  const [lAnimalType, setLAnimalType] = useState<'sheep' | 'cattle' | 'camel' | 'goat' | 'poultry'>('sheep');
  const [lBreed, setLBreed] = useState('عواسي بلدي نقي');
  const [lHeadCount, setLHeadCount] = useState<number>(100);
  const [lPurpose, setLPurpose] = useState<'meat_fattening' | 'dairy' | 'breeding'>('meat_fattening');
  const [lBarn, setLBarn] = useState('حظيرة 1');
  const [lIntakeDate, setLIntakeDate] = useState('2026-10-09');
  const [lAvgWeight, setLAvgWeight] = useState<number>(30);
  const [lTargetWeight, setLTargetWeight] = useState<number>(55);
  const [lVaccination, setLVaccination] = useState('برنامج تحصينات معتمد');
  const [lDailyRation, setLDailyRation] = useState<number>(1.5);
  const [lCountry, setLCountry] = useState('السعودية - القصيم وحائل');
  const [lNotes, setLNotes] = useState('');

  // Form states for Aquaculture
  const [aPondId, setAPondId] = useState('');
  const [aFishSpecies, setAFishSpecies] = useState<'tilapia' | 'seabream' | 'seabass' | 'carp' | 'shrimp'>('tilapia');
  const [aPondVolume, setAPondVolume] = useState<number>(2000);
  const [aFingerlings, setAFingerlings] = useState<number>(15000);
  const [aStockingDate, setAStockingDate] = useState('2026-05-01');
  const [aAvgWeightGrams, setAAvgWeightGrams] = useState<number>(300);
  const [aTargetWeightGrams, setATargetWeightGrams] = useState<number>(450);
  const [aDoLevel, setADoLevel] = useState<number>(5.8);
  const [aPhLevel, setAPhLevel] = useState<number>(7.6);
  const [aFcrRatio, setAFcrRatio] = useState<number>(1.4);
  const [aExpectedBiomass, setAExpectedBiomass] = useState<number>(6000);
  const [aCountry, setACountry] = useState('مصر - كفر الشيخ والشرقية');
  const [aNotes, setANotes] = useState('');

  // Form states for Lab
  const [sSampleType, setSSampleType] = useState<'soil' | 'well_water' | 'feed' | 'plant_tissue'>('soil');
  const [sSampleCode, setSSampleCode] = useState(`SAMPLE-${Date.now().toString().slice(-4)}`);
  const [sLocation, setSLocation] = useState('');
  const [sDate, setSDate] = useState('2026-10-09');
  const [sEcSalinity, setSEcSalinity] = useState<number>(2.2);
  const [sPhLevel, setSPhLevel] = useState<number>(7.5);
  const [sSuitability, setSSuitability] = useState<'ممتازة' | 'صالحة مع معالجة' | 'مرتفعة الملوحة' | 'غير صالحة'>('ممتازة');
  const [sRecommendations, setSRecommendations] = useState('');
  const [sCountry, setSCountry] = useState('المغرب - سوس ماسة ومكناس');

  const handleCreateFieldRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fCropName) return;
    const rec: AgronomyFieldRecord = {
      id: `field-${Date.now()}`,
      cropName: fCropName,
      variety: fVariety || 'صنف معتمد',
      fieldPlot: fPlot || 'حقل رقم 1',
      areaSize: fAreaSize,
      areaUnit: fAreaUnit,
      irrigationType: fIrrigation,
      plantingDate: fPlantDate,
      expectedHarvestDate: fHarvestDate,
      soilType: fSoilType,
      targetYieldTon: fTargetYieldTon,
      country: fCountry,
      notes: fNotes || 'تم التسجيل في مفكرة ثمار.تك'
    };
    onAddFieldRecord(rec);
    setIsAddModalOpen(false);
    setFCropName('');
  };

  const handleCreateLivestockRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lBreed) return;
    const rec: LivestockHerdRecord = {
      id: `live-${Date.now()}`,
      animalType: lAnimalType,
      breed: lBreed,
      headCount: lHeadCount,
      purpose: lPurpose,
      barnIdentifier: lBarn || 'حظيرة رئيسية',
      intakeDate: lIntakeDate,
      currentAvgWeightKg: lAvgWeight,
      targetWeightKg: lTargetWeight,
      vaccinationScheduleStatus: lVaccination,
      dailyFeedRationKg: lDailyRation,
      country: lCountry,
      notes: lNotes || 'سجل دورة تربية وتسمين'
    };
    onAddLivestockRecord(rec);
    setIsAddModalOpen(false);
  };

  const handleCreateAquaRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aPondId) return;
    const rec: AquaculturePondRecord = {
      id: `aqua-${Date.now()}`,
      pondIdentifier: aPondId,
      fishSpecies: aFishSpecies,
      pondVolumeM3: aPondVolume,
      fingerlingCount: aFingerlings,
      stockingDate: aStockingDate,
      avgWeightGrams: aAvgWeightGrams,
      targetHarvestWeightGrams: aTargetWeightGrams,
      dissolvedOxygenMgL: aDoLevel,
      phLevel: aPhLevel,
      fcrRatio: aFcrRatio,
      expectedBiomassKg: aExpectedBiomass,
      country: aCountry,
      notes: aNotes || 'حوض استزراع مائي مكثف'
    };
    onAddAquacultureRecord(rec);
    setIsAddModalOpen(false);
  };

  const handleCreateLabRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sLocation) return;
    const rec: LabAnalysisRecord = {
      id: `lab-${Date.now()}`,
      sampleType: sSampleType,
      sampleCode: sSampleCode,
      sourceLocation: sLocation,
      collectionDate: sDate,
      ecSalinity: sEcSalinity,
      phLevel: sPhLevel,
      suitabilityStatus: sSuitability,
      recommendations: sRecommendations || 'فحص مخبري مطابق للمعايير',
      country: sCountry
    };
    onAddLabRecord(rec);
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header and Specialty Selector */}
      <div className="bg-white border border-stone-200 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 mb-1">
            <Layers className="w-4 h-4 text-emerald-700" />
            <span>نماذج التسجيل المتوافقة مع الاختصاصات الزراعية</span>
          </div>
          <h3 className="text-xl font-bold text-stone-900 tracking-tight">
            سجلات تفصيلية للمحاصيل، المواشي، الأسماك، والمختبرات
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            نماذج قياسية للمزارعين والمهندسين والأطباء البيطريين لتوثيق العمليات الحقلية والمخبرية.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs self-start lg:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>
            {activeTab === 'field' && 'تسجيل حقل أو محصول جديد'}
            {activeTab === 'livestock' && 'تسجيل قطيع مواشي جديد'}
            {activeTab === 'aquaculture' && 'تسجيل حوض استزراع سمكي'}
            {activeTab === 'lab' && 'تسجيل فحص مخبري جديد'}
          </span>
        </button>
      </div>

      {/* Specialty Tab Buttons */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        {[
          { id: 'field', label: '1. الهندسة والمحاصيل الحقلية', icon: Sprout, count: fieldRecords.length, color: 'text-emerald-700' },
          { id: 'livestock', label: '2. الثروة الحيوانية والبيطرة', icon: ShieldCheck, count: livestockRecords.length, color: 'text-amber-700' },
          { id: 'aquaculture', label: '3. الاستزراع السمكي والمصائد', icon: Fish, count: aquacultureRecords.length, color: 'text-cyan-700' },
          { id: 'lab', label: '4. مختبرات التربة والمياه', icon: FlaskConical, count: labRecords.length, color: 'text-blue-700' },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`p-3.5 rounded-xl border text-right transition-all cursor-pointer flex items-center justify-between ${
                isSelected
                  ? 'bg-emerald-900 text-white border-emerald-900 shadow-xs'
                  : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-300' : tab.color}`} />
                <span className="text-xs font-bold">{tab.label}</span>
              </div>
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold tabular-nums ${
                isSelected ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-600'
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Specialty 1: Agronomy & Field Crops */}
      {activeTab === 'field' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {fieldRecords.map((rec) => (
              <div key={rec.id} className="bg-white border border-stone-200 rounded-xl p-5 hover:border-emerald-300 transition-all flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {rec.cropName} ({rec.variety})
                    </span>
                    <span className="text-stone-400 font-semibold">{rec.fieldPlot}</span>
                  </div>

                  <h4 className="text-sm font-extrabold text-stone-900">
                    {rec.areaSize} {rec.areaUnit} · نظام ري {rec.irrigationType === 'pivot' ? 'محوري بيفوت' : rec.irrigationType === 'drip' ? 'تنقيط موضعي' : 'رشاشات'}
                  </h4>

                  <div className="text-xs text-stone-600 space-y-1 bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                    <div className="flex justify-between">
                      <span className="text-stone-500">الدولة والمنطقة:</span>
                      <span className="font-medium text-stone-800">{rec.country}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">نوع التربة:</span>
                      <span className="font-medium text-stone-800">{rec.soilType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">الإنتاج المستهدف:</span>
                      <span className="font-bold text-emerald-800 tabular-nums">{rec.targetYieldTon} طن</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-stone-500 pt-1 border-t border-stone-200">
                      <span>الزراعة: {rec.plantingDate}</span>
                      <span>الحصاد: {rec.expectedHarvestDate}</span>
                    </div>
                  </div>

                  <p className="text-xs text-stone-500 line-clamp-2 italic">
                    ملاحظات: {rec.notes}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className="text-emerald-700 font-semibold flex items-center gap-1 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    سجل حقلي معتمد
                  </span>
                  <button
                    onClick={() => onDeleteRecord('field', rec.id)}
                    className="p-1 text-stone-400 hover:text-rose-600 rounded cursor-pointer"
                    title="حذف السجل"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Specialty 2: Livestock & Veterinary */}
      {activeTab === 'livestock' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {livestockRecords.map((rec) => (
              <div key={rec.id} className="bg-white border border-stone-200 rounded-xl p-5 hover:border-amber-300 transition-all flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {rec.breed}
                    </span>
                    <span className="font-bold text-stone-800 tabular-nums">{rec.headCount} رأس</span>
                  </div>

                  <h4 className="text-sm font-extrabold text-stone-900">
                    {rec.purpose === 'meat_fattening' ? 'دورة تسمين لحوم' : rec.purpose === 'dairy' ? 'إنتاج ألبان ومحلب' : 'إكثار وتحسين سلالات'} · {rec.barnIdentifier}
                  </h4>

                  <div className="text-xs text-stone-600 space-y-1 bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                    <div className="flex justify-between">
                      <span className="text-stone-500">الموقع الجغرافي:</span>
                      <span className="font-medium text-stone-800">{rec.country}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">متوسط الوزن:</span>
                      <span className="font-bold text-stone-900 tabular-nums">{rec.currentAvgWeightKg} كجم (المستهدف: {rec.targetWeightKg} كجم)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">العليقة اليومية:</span>
                      <span className="font-medium text-stone-800 tabular-nums">{rec.dailyFeedRationKg} كجم / رأس</span>
                    </div>
                    <div className="text-[11px] text-emerald-800 font-semibold pt-1 border-t border-stone-200">
                      التحصينات: {rec.vaccinationScheduleStatus}
                    </div>
                  </div>

                  <p className="text-xs text-stone-500 line-clamp-2 italic">
                    ملاحظات: {rec.notes}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className="text-amber-700 font-semibold flex items-center gap-1 text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    قطيع حلال ومفحوص بيطرياً
                  </span>
                  <button
                    onClick={() => onDeleteRecord('livestock', rec.id)}
                    className="p-1 text-stone-400 hover:text-rose-600 rounded cursor-pointer"
                    title="حذف السجل"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Specialty 3: Aquaculture */}
      {activeTab === 'aquaculture' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {aquacultureRecords.map((rec) => (
              <div key={rec.id} className="bg-white border border-stone-200 rounded-xl p-5 hover:border-cyan-300 transition-all flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-cyan-900 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                      {rec.fishSpecies === 'tilapia' ? 'بلطي نيلي' : rec.fishSpecies === 'seabream' ? 'دنيس بحري' : 'سيباس / جمبري'}
                    </span>
                    <span className="font-bold text-stone-800">{rec.pondIdentifier}</span>
                  </div>

                  <h4 className="text-sm font-extrabold text-stone-900">
                    حجم الحوض: {rec.pondVolumeM3} م³ · {rec.fingerlingCount.toLocaleString()} إصبعية
                  </h4>

                  <div className="text-xs text-stone-600 space-y-1 bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                    <div className="flex justify-between">
                      <span className="text-stone-500">الموقع والمزرعة:</span>
                      <span className="font-medium text-stone-800">{rec.country}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">متوسط الوزن:</span>
                      <span className="font-bold text-stone-900 tabular-nums">{rec.avgWeightGrams} جم (المستهدف: {rec.targetHarvestWeightGrams} جم)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">الأكسجين الذائب (DO):</span>
                      <span className="font-bold text-cyan-800 tabular-nums">{rec.dissolvedOxygenMgL} ملغم/لتر (pH: {rec.phLevel})</span>
                    </div>
                    <div className="flex justify-between text-[11px] pt-1 border-t border-stone-200">
                      <span>الكتلة الحيوية المتوقعة: {rec.expectedBiomassKg.toLocaleString()} كجم</span>
                      <span className="font-semibold text-stone-700">FCR: {rec.fcrRatio}</span>
                    </div>
                  </div>

                  <p className="text-xs text-stone-500 line-clamp-2 italic">
                    ملاحظات: {rec.notes}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className="text-cyan-800 font-semibold flex items-center gap-1 text-[11px]">
                    <Fish className="w-3.5 h-3.5" />
                    استزراع سمكي مكثف
                  </span>
                  <button
                    onClick={() => onDeleteRecord('aquaculture', rec.id)}
                    className="p-1 text-stone-400 hover:text-rose-600 rounded cursor-pointer"
                    title="حذف السجل"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Specialty 4: Agri & Soil Labs */}
      {activeTab === 'lab' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {labRecords.map((rec) => (
              <div key={rec.id} className="bg-white border border-stone-200 rounded-xl p-5 hover:border-blue-300 transition-all flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {rec.sampleType === 'soil' ? 'عينة تربة' : rec.sampleType === 'well_water' ? 'مياه بئر ارتوازي' : 'أعلاف ونبات'}
                    </span>
                    <span className="font-mono text-stone-400 text-[11px]">{rec.sampleCode}</span>
                  </div>

                  <h4 className="text-sm font-extrabold text-stone-900">
                    {rec.sourceLocation}
                  </h4>

                  <div className="text-xs text-stone-600 space-y-1 bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                    <div className="flex justify-between">
                      <span className="text-stone-500">الدولة والمنطقة:</span>
                      <span className="font-medium text-stone-800">{rec.country}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">الملوحة (EC):</span>
                      <span className="font-bold text-stone-900 tabular-nums">{rec.ecSalinity} dS/m (الحموضة: {rec.phLevel} pH)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">حالة الصلاحية:</span>
                      <span className="font-bold text-emerald-800">{rec.suitabilityStatus}</span>
                    </div>
                  </div>

                  <div className="text-xs bg-amber-50/60 p-2 rounded border border-amber-200/60 text-amber-900">
                    <span className="font-semibold block mb-0.5">التوصية المخبرية:</span>
                    <span className="line-clamp-2">{rec.recommendations}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className="text-blue-800 font-semibold flex items-center gap-1 text-[11px]">
                    <FlaskConical className="w-3.5 h-3.5" />
                    تقرير مخبري معتمد
                  </span>
                  <button
                    onClick={() => onDeleteRecord('lab', rec.id)}
                    className="p-1 text-stone-400 hover:text-rose-600 rounded cursor-pointer"
                    title="حذف السجل"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Unified Modal to Add Specialized Record depending on active tab */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div onClick={() => setIsAddModalOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-xs" />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 space-y-4 border border-stone-200">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <h3 className="text-base font-bold text-stone-900">
                  {activeTab === 'field' && 'إضافة سجل محصول وحقل جديد'}
                  {activeTab === 'livestock' && 'إضافة سجل قطيع مواشي وبيطرة'}
                  {activeTab === 'aquaculture' && 'إضافة سجل حوض استزراع سمكي'}
                  {activeTab === 'lab' && 'إضافة تقرير تحليل تربة ومياه'}
                </h3>
                <button onClick={() => setIsAddModalOpen(false)} className="p-1 text-stone-400 hover:text-stone-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form 1: Field */}
              {activeTab === 'field' && (
                <form onSubmit={handleCreateFieldRecord} className="space-y-3.5 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">اسم المحصول:</label>
                      <input
                        type="text"
                        required
                        value={fCropName}
                        onChange={(e) => setFCropName(e.target.value)}
                        placeholder="مثال: قمح صلب / طماطم / زيتون"
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">الصنف أو الهجين:</label>
                      <input
                        type="text"
                        value={fVariety}
                        onChange={(e) => setFVariety(e.target.value)}
                        placeholder="مثال: جيزة 171 / Super Regina F1"
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">المساحة:</label>
                      <input
                        type="number"
                        min="0.1"
                        step="any"
                        value={fAreaSize}
                        onChange={(e) => setFAreaSize(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">الوحدة:</label>
                      <select
                        value={fAreaUnit}
                        onChange={(e) => setFAreaUnit(e.target.value as any)}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900"
                      >
                        <option value="هكتار">هكتار</option>
                        <option value="فدان">فدان</option>
                        <option value="دونم">دونم</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">نظام الري:</label>
                      <select
                        value={fIrrigation}
                        onChange={(e) => setFIrrigation(e.target.value as any)}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900"
                      >
                        <option value="drip">تنقيط موضعي</option>
                        <option value="pivot">محوري (بيفوت)</option>
                        <option value="sprinkler">رشاشات</option>
                        <option value="flood">غمر محكم</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">الدولة والمنطقة:</label>
                      <input
                        type="text"
                        value={fCountry}
                        onChange={(e) => setFCountry(e.target.value)}
                        placeholder="مصر / الأردن / المغرب / السعودية"
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">الإنتاج المستهدف (طن):</label>
                      <input
                        type="number"
                        value={fTargetYieldTon}
                        onChange={(e) => setFTargetYieldTon(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">ملاحظات العمليات الحقلية:</label>
                    <textarea
                      rows={2}
                      value={fNotes}
                      onChange={(e) => setFNotes(e.target.value)}
                      placeholder="تسميد أساس، مبيدات وقائية، عمق الحرث..."
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900"
                    />
                  </div>

                  <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                    <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 border rounded-lg">إلغاء</button>
                    <button type="submit" className="px-5 py-2 bg-emerald-800 text-white rounded-lg font-bold">حفظ السجل</button>
                  </div>
                </form>
              )}

              {/* Form 2: Livestock */}
              {activeTab === 'livestock' && (
                <form onSubmit={handleCreateLivestockRecord} className="space-y-3.5 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">نوع الماشية:</label>
                      <select
                        value={lAnimalType}
                        onChange={(e) => setLAnimalType(e.target.value as any)}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900"
                      >
                        <option value="sheep">أغنام وخراف</option>
                        <option value="cattle">أبقار وعجول</option>
                        <option value="camel">إبل وهجن</option>
                        <option value="goat">ماعز</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">السلالة:</label>
                      <input
                        type="text"
                        required
                        value={lBreed}
                        onChange={(e) => setLBreed(e.target.value)}
                        placeholder="عواسي / هولشتاين / شامي"
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">عدد الرؤوس:</label>
                      <input
                        type="number"
                        min="1"
                        value={lHeadCount}
                        onChange={(e) => setLHeadCount(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">الغرض:</label>
                      <select
                        value={lPurpose}
                        onChange={(e) => setLPurpose(e.target.value as any)}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900"
                      >
                        <option value="meat_fattening">تسمين ولحوم</option>
                        <option value="dairy">إنتاج حليب</option>
                        <option value="breeding">إكثار وتحسين وراثي</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">الحظيرة / العنبر:</label>
                      <input
                        type="text"
                        value={lBarn}
                        onChange={(e) => setLBarn(e.target.value)}
                        placeholder="حظيرة ب-1"
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">متوسط الوزن الحالي (كجم):</label>
                      <input
                        type="number"
                        value={lAvgWeight}
                        onChange={(e) => setLAvgWeight(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">الوزن المستهدف (كجم):</label>
                      <input
                        type="number"
                        value={lTargetWeight}
                        onChange={(e) => setLTargetWeight(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">الدولة والمنطقة:</label>
                    <input
                      type="text"
                      value={lCountry}
                      onChange={(e) => setLCountry(e.target.value)}
                      placeholder="السعودية / مصر / الأردن / العراق"
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900"
                    />
                  </div>

                  <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                    <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 border rounded-lg">إلغاء</button>
                    <button type="submit" className="px-5 py-2 bg-emerald-800 text-white rounded-lg font-bold">حفظ السجل</button>
                  </div>
                </form>
              )}

              {/* Form 3: Aquaculture */}
              {activeTab === 'aquaculture' && (
                <form onSubmit={handleCreateAquaRecord} className="space-y-3.5 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">معرّف الحوض:</label>
                      <input
                        type="text"
                        required
                        value={aPondId}
                        onChange={(e) => setAPondId(e.target.value)}
                        placeholder="حوض بلطي ترابي 2"
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">نوع السمك:</label>
                      <select
                        value={aFishSpecies}
                        onChange={(e) => setAFishSpecies(e.target.value as any)}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900"
                      >
                        <option value="tilapia">بلطي نيلي</option>
                        <option value="seabream">دنيس بحري</option>
                        <option value="seabass">قاروص (سيباس)</option>
                        <option value="shrimp">جمبري (روبيان)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">حجم الحوض (م³):</label>
                      <input
                        type="number"
                        value={aPondVolume}
                        onChange={(e) => setAPondVolume(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">عدد الزريعة / الإصبعيات:</label>
                      <input
                        type="number"
                        value={aFingerlings}
                        onChange={(e) => setAFingerlings(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 font-bold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">الأكسجين الذائب DO (ملغم/لتر):</label>
                      <input
                        type="number"
                        step="0.1"
                        value={aDoLevel}
                        onChange={(e) => setADoLevel(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">الكتلة الحيوية المتوقعة (كجم):</label>
                      <input
                        type="number"
                        value={aExpectedBiomass}
                        onChange={(e) => setAExpectedBiomass(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 font-bold"
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                    <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 border rounded-lg">إلغاء</button>
                    <button type="submit" className="px-5 py-2 bg-emerald-800 text-white rounded-lg font-bold">حفظ السجل</button>
                  </div>
                </form>
              )}

              {/* Form 4: Lab */}
              {activeTab === 'lab' && (
                <form onSubmit={handleCreateLabRecord} className="space-y-3.5 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">نوع العينة:</label>
                      <select
                        value={sSampleType}
                        onChange={(e) => setSSampleType(e.target.value as any)}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900"
                      >
                        <option value="soil">عينة تربة حقلية</option>
                        <option value="well_water">مياه بئر ارتوازي</option>
                        <option value="feed">أعلاف ومخصبات</option>
                        <option value="plant_tissue">أنسجة نباتية وأوراق</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">مصدر وموقع العينة:</label>
                      <input
                        type="text"
                        required
                        value={sLocation}
                        onChange={(e) => setSLocation(e.target.value)}
                        placeholder="حقل القمح - بئر رقم 2"
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">الملوحة EC (dS/m):</label>
                      <input
                        type="number"
                        step="0.1"
                        value={sEcSalinity}
                        onChange={(e) => setSEcSalinity(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">الحموضة (pH):</label>
                      <input
                        type="number"
                        step="0.1"
                        value={sPhLevel}
                        onChange={(e) => setSPhLevel(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">حالة الصلاحية:</label>
                    <select
                      value={sSuitability}
                      onChange={(e) => setSSuitability(e.target.value as any)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 font-bold"
                    >
                      <option value="ممتازة">ممتازة وصالحة لكافة المحاصيل</option>
                      <option value="صالحة مع معالجة">صالحة مع معالجة وتسميد مدروس</option>
                      <option value="مرتفعة الملوحة">مرتفعة الملوحة تتطلب غسيل تربة</option>
                      <option value="غير صالحة">غير صالحة للزراعات الحساسة</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">التوصية المخبرية:</label>
                    <textarea
                      rows={2}
                      value={sRecommendations}
                      onChange={(e) => setSRecommendations(e.target.value)}
                      placeholder="توصيات المهندس الزراعي أو الكيميائي..."
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900"
                    />
                  </div>

                  <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                    <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 border rounded-lg">إلغاء</button>
                    <button type="submit" className="px-5 py-2 bg-emerald-800 text-white rounded-lg font-bold">حفظ السجل</button>
                  </div>
                </form>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
};
