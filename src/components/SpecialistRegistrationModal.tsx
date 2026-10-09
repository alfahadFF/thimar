import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  Sprout, 
  Fish, 
  Sun, 
  FlaskConical, 
  Award, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Printer, 
  CheckSquare,
  FileCheck,
  Building2,
  Phone,
  Briefcase
} from 'lucide-react';
import { ClinicDirectoryItem, Specialist } from '../types';

export type DisciplineRegistrationType = 
  | 'agronomy_engineer'
  | 'veterinarian'
  | 'lab_analyst'
  | 'commercial_farmer'
  | 'livestock_breeder'
  | 'aquaculture_expert';

interface SpecialistRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisteredFacility?: (facility: ClinicDirectoryItem) => void;
  onRegisteredSpecialist?: (specialist: Specialist) => void;
  defaultDiscipline?: DisciplineRegistrationType;
}

const COUNTRIES_LIST = [
  'مصر',
  'الأردن',
  'السعودية',
  'المغرب',
  'العراق',
  'السودان',
  'سلطنة عمان',
  'تونس',
  'لبنان',
  'سوريا',
  'الإمارات',
  'الجزائر',
  'ليبيا',
  'اليمن',
  'فلسطين',
  'الكويت',
  'قطر',
  'البحرين',
  'تركيا'
];

export const SpecialistRegistrationModal: React.FC<SpecialistRegistrationModalProps> = ({
  isOpen,
  onClose,
  onRegisteredFacility,
  onRegisteredSpecialist,
  defaultDiscipline = 'agronomy_engineer'
}) => {
  const [selectedDiscipline, setSelectedDiscipline] = useState<DisciplineRegistrationType>(defaultDiscipline);
  const [isSuccess, setIsSuccess] = useState(false);
  const [registrationCertificate, setRegistrationCertificate] = useState<{
    regNumber: string;
    fullName: string;
    title: string;
    country: string;
    disciplineLabel: string;
    date: string;
  } | null>(null);

  // Common Fields
  const [fullName, setFullName] = useState('');
  const [facilityName, setFacilityName] = useState('');
  const [country, setCountry] = useState('مصر');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [experienceYears, setExperienceYears] = useState<number>(8);
  const [consultationFeeUsd, setConsultationFeeUsd] = useState<number>(35);
  const [bio, setBio] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');

  // 1. Agronomy Engineer Specifics
  const [agriSubSpecialty, setAgriSubSpecialty] = useState('ري وتسميد ومكافحة متكاملة');
  const [syndicateMembershipNo, setSyndicateMembershipNo] = useState('');
  const [agriServices, setAgriServices] = useState('تصميم شبكات ري بالتنقيط، برامج تسميد، مكافحة سوسة النخيل والآفات');

  // 2. Veterinarian Specifics
  const [vetClinicalFocus, setVetClinicalFocus] = useState('مجترات كبيرة وأغنام وإبل');
  const [vetCouncilRegNo, setVetCouncilRegNo] = useState('');
  const [hasMobileEmergencyClinic, setHasMobileEmergencyClinic] = useState(true);
  const [surgicalCapabilities, setSurgicalCapabilities] = useState('ولادات قيصرية، سونار، تحصينات ومكافحة طفيليات');

  // 3. Lab Analyst Specifics
  const [labAccreditationBody, setLabAccreditationBody] = useState('اعتماد أيزو 17025 وهيئة سلامة الغذاء');
  const [labTestingScopes, setLabTestingScopes] = useState('تحليل ملوحة وخصوبة التربة EC/pH، صلاحية مياه الآبار، تحليل الأعلاف');
  const [sampleTurnaroundDays, setSampleTurnaroundDays] = useState<number>(2);

  // 4. Commercial Farmer Specifics
  const [farmAcreage, setFarmAcreage] = useState<number>(25);
  const [farmAcreageUnit, setFarmAcreageUnit] = useState<'هكتار' | 'فدان' | 'دونم'>('هكتار');
  const [mainCropsProduced, setMainCropsProduced] = useState('قمح صلب، طماطم محمية، نخيل تمور');
  const [irrigationSystemType, setIrrigationSystemType] = useState('ري محوري وبالتنقيط موفر للمياه');

  // 5. Livestock Breeder Specifics
  const [livestockBreeds, setLivestockBreeds] = useState('أغنام عواسي بلدي نقية وعجول تسمين');
  const [herdCapacityHeads, setHerdCapacityHeads] = useState<number>(300);
  const [halalFeedPledge, setHalalFeedPledge] = useState(true);
  const [biosecurityCertified, setBiosecurityCertified] = useState(true);

  // 6. Aquaculture Expert Specifics
  const [aquacultureSpecies, setAquacultureSpecies] = useState('سمك بلطي نيلي ودنيس وقاروص');
  const [farmingSystemType, setFarmingSystemType] = useState('أحواض ترابية مدعمة ببدالات تهوية ونظام شبه مكثف');
  const [annualCapacityTons, setAnnualCapacityTons] = useState<number>(25);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !city) return;

    const regNumber = `THIMAR-${selectedDiscipline.toUpperCase().slice(0, 4)}-${Date.now().toString().slice(-6)}`;
    const today = new Date().toISOString().split('T')[0];

    let disciplineLabel = '';
    if (selectedDiscipline === 'agronomy_engineer') disciplineLabel = 'مهندس زراعي / استشاري هندسة زراعية';
    if (selectedDiscipline === 'veterinarian') disciplineLabel = 'طبيب بيطري / عيادة بيطرية متخصصة';
    if (selectedDiscipline === 'lab_analyst') disciplineLabel = 'مختبر تحاليل زراعية وتربة ومياه';
    if (selectedDiscipline === 'commercial_farmer') disciplineLabel = 'مزارع تجاري ومنتج محاصيل';
    if (selectedDiscipline === 'livestock_breeder') disciplineLabel = 'مربي ثروة حيوانية وداجنة (حلال)';
    if (selectedDiscipline === 'aquaculture_expert') disciplineLabel = 'مستزرع سمكي وأحياء مائية';

    // If discipline is vet or lab or engineer with a clinic/office, optionally push to directory
    if (onRegisteredFacility && (selectedDiscipline === 'veterinarian' || selectedDiscipline === 'lab_analyst' || selectedDiscipline === 'agronomy_engineer')) {
      const newFacility: ClinicDirectoryItem = {
        id: `dir-user-${Date.now()}`,
        name: facilityName || `${disciplineLabel} - ${fullName}`,
        type: selectedDiscipline === 'veterinarian' ? 'veterinary' : selectedDiscipline === 'lab_analyst' ? 'lab' : 'agricultural',
        typeName: disciplineLabel,
        region: country,
        city,
        address: address || `${country} - ${city}`,
        phone,
        mobile: phone,
        whatsapp: whatsapp || phone,
        workingHours: 'السبت - الخميس: 8:00 ص - 6:00 م',
        services: (selectedDiscipline === 'veterinarian' ? surgicalCapabilities : selectedDiscipline === 'lab_analyst' ? labTestingScopes : agriServices).split('،'),
        rating: 5.0,
        reviewsCount: 1,
        verified: true,
        lat: 30.0444 + (Math.random() - 0.5) * 0.1,
        lng: 31.2357 + (Math.random() - 0.5) * 0.1,
        notes: `عضوية رقم ${regNumber} - مسجل ومعتمد عبر بوابة ثمار.تك`
      };
      onRegisteredFacility(newFacility);
    }

    // If consultant, push to specialists roster
    if (onRegisteredSpecialist && (selectedDiscipline === 'agronomy_engineer' || selectedDiscipline === 'veterinarian' || selectedDiscipline === 'aquaculture_expert')) {
      const newSpec: Specialist = {
        id: `spec-user-${Date.now()}`,
        name: fullName,
        title: `${disciplineLabel} (${country})`,
        discipline: selectedDiscipline === 'veterinarian' ? 'veterinary' : selectedDiscipline === 'aquaculture_expert' ? 'aquaculture' : 'engineering',
        experienceYears,
        rating: 5.0,
        consultationsCount: 1,
        availableDays: 'طوال أيام الأسبوع',
        feePerConsultation: consultationFeeUsd,
        avatarInitials: fullName.slice(0, 2),
        specialties: (selectedDiscipline === 'agronomy_engineer' ? agriServices : selectedDiscipline === 'veterinarian' ? surgicalCapabilities : aquacultureSpecies).split('،')
      };
      onRegisteredSpecialist(newSpec);
    }

    setRegistrationCertificate({
      regNumber,
      fullName,
      title: disciplineLabel,
      country: `${country} - ${city}`,
      disciplineLabel,
      date: today
    });
    setIsSuccess(true);
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  const disciplinesOptions = [
    {
      id: 'agronomy_engineer' as const,
      label: 'مهندس زراعي / استشاري',
      sub: 'وقاية، ري، محاصيل، بيوت محمية',
      icon: Sun,
      color: 'text-amber-700 bg-amber-50 border-amber-200'
    },
    {
      id: 'veterinarian' as const,
      label: 'طبيب بيطري / عيادة',
      sub: 'عناية بالأنعام، جراحة، تحصينات',
      icon: ShieldCheck,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200'
    },
    {
      id: 'lab_analyst' as const,
      label: 'مختبر تحاليل زراعية',
      sub: 'فحص ملوحة، تربة، مياه، أعلاف',
      icon: FlaskConical,
      color: 'text-blue-700 bg-blue-50 border-blue-200'
    },
    {
      id: 'commercial_farmer' as const,
      label: 'مزارع تجاري ومنتج',
      sub: 'حبوب، خضار، بساتين، بذور وأشتال',
      icon: Sprout,
      color: 'text-emerald-800 bg-emerald-50 border-emerald-200'
    },
    {
      id: 'livestock_breeder' as const,
      label: 'مربي ثروة حيوانية (حلال)',
      sub: 'أغنام، أبقار، إبل، دواجن وتسمين',
      icon: Award,
      color: 'text-stone-700 bg-stone-100 border-stone-300'
    },
    {
      id: 'aquaculture_expert' as const,
      label: 'مستزرع سمكي وأحياء مائية',
      sub: 'بلطي، دنيس، مفرخات وتغذية',
      icon: Fish,
      color: 'text-cyan-700 bg-cyan-50 border-cyan-200'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-emerald-950 via-stone-900 to-emerald-900 text-white flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
              <FileCheck className="w-4 h-4" />
              <span>بوابة ثمار.تك الدولية للمهنيين والمشاريع</span>
              <span aria-hidden="true">·</span>
              <span>اعتماد دولي وأسعار بالدولار ($)</span>
            </div>
            <h3 className="text-xl font-extrabold tracking-tight">
              نماذج التسجيل المتوافقة مع الاختصاصات الزراعية والبيطرية
            </h3>
            <p className="text-xs text-stone-300 mt-0.5">
              انضم كمهندس زراعي، طبيب بيطري، مختبر فحص، مزارع تجاري، أو مربي معتمد في شبكة ثمار.تك عبر الوطن العربي.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {isSuccess && registrationCertificate ? (
            /* Registration Certificate View */
            <div className="space-y-6 text-center animate-in fade-in duration-300">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h4 className="text-2xl font-black text-stone-900">
                  تم اعتماد وتسجيل اختصاصك بنجاح في ثمار.تك!
                </h4>
                <p className="text-sm text-stone-600 mt-1 max-w-lg mx-auto">
                  تم إدراج بياناتك في قاعدة الخبراء والمراكز المعتمدة. يمكنك الآن استقبال طلبات الاستشارات والمزارعين والعملاء من مختلف الدول.
                </p>
              </div>

              {/* Printable Certificate Card */}
              <div className="bg-gradient-to-br from-stone-50 via-white to-emerald-50/40 border-2 border-emerald-600/40 rounded-2xl p-6 sm:p-8 text-right max-w-2xl mx-auto shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-stone-200 pb-4 mb-5">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-lg text-emerald-900">ثِمَار.تِك</span>
                    <span className="text-xs text-stone-500">| بطاقة اعتماد مهني</span>
                  </div>
                  <span className="px-3 py-1 bg-emerald-800 text-white rounded-md text-xs font-bold font-mono">
                    {registrationCertificate.regNumber}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs mb-6">
                  <div>
                    <span className="text-stone-500 block mb-0.5">الاسم والصفة المعتمدة:</span>
                    <span className="text-base font-bold text-stone-900">{registrationCertificate.fullName}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block mb-0.5">مجال الاختصاص:</span>
                    <span className="text-sm font-bold text-emerald-800">{registrationCertificate.disciplineLabel}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block mb-0.5">الدولة والمنطقة الميدانية:</span>
                    <span className="font-semibold text-stone-800">{registrationCertificate.country}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block mb-0.5">تاريخ التوثيق والاعتماد:</span>
                    <span className="font-semibold text-stone-800">{registrationCertificate.date}</span>
                  </div>
                </div>

                <div className="bg-emerald-900/5 border border-emerald-800/20 rounded-xl p-3 flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
                  <p className="text-[11px] text-emerald-900 leading-relaxed">
                    هذا الحساب موثق رسميًا بملف اختصاص زراعي/بيطري متكامل متوافق مع معايير الجودة والسلامة المهنية لمنصة ثمار.تك.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={handlePrintCertificate}
                  className="flex items-center gap-2 px-5 py-2.5 bg-stone-800 hover:bg-stone-900 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>طباعة بطاقة الاعتماد</span>
                </button>
                <button
                  onClick={onClose}
                  className="flex items-center gap-2 px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  <span>العودة إلى المنصة</span>
                </button>
              </div>
            </div>
          ) : (
            /* Registration Form View */
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Step 1: Select Discipline */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-2">
                  1. اختر اختصاصك المهني أو نوع منشأتك الزراعية والبيطرية:
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {disciplinesOptions.map((opt) => {
                    const Icon = opt.icon;
                    const isSelected = selectedDiscipline === opt.id;
                    return (
                      <button
                        type="button"
                        key={opt.id}
                        onClick={() => setSelectedDiscipline(opt.id)}
                        className={`p-3.5 rounded-xl border text-right transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50/70 shadow-xs ring-1 ring-emerald-600'
                            : 'border-stone-200 bg-stone-50/50 hover:bg-white hover:border-stone-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className={`p-1.5 rounded-lg border ${opt.color}`}>
                            <Icon className="w-4 h-4" />
                          </span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-700" />}
                        </div>
                        <div>
                          <div className={`text-xs font-bold ${isSelected ? 'text-emerald-950' : 'text-stone-900'}`}>
                            {opt.label}
                          </div>
                          <div className="text-[11px] text-stone-500 mt-0.5 line-clamp-1">
                            {opt.sub}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Common Identity & Regional Location (International) */}
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-4">
                <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                  <span className="text-xs font-bold text-stone-800">
                    2. البيانات الشخصية وبيانات التواصل والموقع الميداني (الدولي)
                  </span>
                  <span className="text-[11px] text-emerald-800 font-semibold">متاح لكافة الدول العربية</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                      الاسم الكامل / اسم المسؤول: *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="مثال: د. يوسف النجار أو م. سارة القاضي"
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                      اسم المنشأة / العيادة / المكتب / المزرعة:
                    </label>
                    <input
                      type="text"
                      value={facilityName}
                      onChange={(e) => setFacilityName(e.target.value)}
                      placeholder="مثال: مركز النيل للهندسة الزراعية"
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                      الدولة: *
                    </label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600 cursor-pointer"
                    >
                      {COUNTRIES_LIST.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                      المدينة / المحافظة / المنطقة: *
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="مثال: وادي النطرون، المفرق، سوس، نينوى..."
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                      رقم الهاتف / الاتصال: *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="مثال: 00201012345678"
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                      رقم الواتساب للاستشارات السريعة:
                    </label>
                    <input
                      type="tel"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="مثال: 00962791234567"
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>
                </div>
              </div>

              {/* Step 3: Discipline-Specific Detailed Form */}
              <div className="p-4 bg-emerald-50/40 rounded-xl border border-emerald-200/80 space-y-4">
                <div className="flex items-center justify-between border-b border-emerald-200/60 pb-2">
                  <span className="text-xs font-bold text-emerald-950">
                    3. الحقول التخصصية الدقيقة (المتطابقة مع اختصاص {disciplinesOptions.find(d => d.id === selectedDiscipline)?.label})
                  </span>
                  <span className="text-[11px] font-mono text-emerald-800">USD ($) Standard</span>
                </div>

                {/* 1. Agronomy Engineer Fields */}
                {selectedDiscipline === 'agronomy_engineer' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                        رقم القيد بنقابة المهن الزراعية / الترخيص:
                      </label>
                      <input
                        type="text"
                        value={syndicateMembershipNo}
                        onChange={(e) => setSyndicateMembershipNo(e.target.value)}
                        placeholder="مثال: نقابة الزراعيين 44921"
                        className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                        سنوات الخبرة الحقلية:
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={experienceYears}
                        onChange={(e) => setExperienceYears(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                        تسعيرة الاستشارة الحقلية بالدولار ($):
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-stone-400 font-bold">$</span>
                        <input
                          type="number"
                          min="10"
                          value={consultationFeeUsd}
                          onChange={(e) => setConsultationFeeUsd(Number(e.target.value))}
                          className="w-full pl-8 pr-3 py-2 bg-white border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600 font-bold"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2 lg:col-span-3">
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                        الخدمات والاستشارات الهندسية المقدمة (مفصولة بفواصل):
                      </label>
                      <input
                        type="text"
                        value={agriServices}
                        onChange={(e) => setAgriServices(e.target.value)}
                        placeholder="مثال: دراسات جدوى، تصميم ري بالتنقيط، فحص أمراض نبات، زراعة مائية"
                        className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                      />
                    </div>
                  </div>
                )}

                {/* 2. Veterinarian Fields */}
                {selectedDiscipline === 'veterinarian' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                        رقم ترخيص مزاولة المهنة البيطرية:
                      </label>
                      <input
                        type="text"
                        value={vetCouncilRegNo}
                        onChange={(e) => setVetCouncilRegNo(e.target.value)}
                        placeholder="مثال: VET-REG-2026-781"
                        className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                        نطاق التخصص الإكلينيكي:
                      </label>
                      <select
                        value={vetClinicalFocus}
                        onChange={(e) => setVetClinicalFocus(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600 cursor-pointer"
                      >
                        <option value="مجترات كبيرة وأغنام وإبل">مجترات كبيرة (أبقار، إبل، أغنام، ماعز)</option>
                        <option value="طب وصحة الدواجن والتسمين">طب وصحة الدواجن والمزارع الداجنة</option>
                        <option value="أمراض وجراحة الخيول والهجن">أمراض وجراحة الخيول والهجن الأصايل</option>
                        <option value="عيادة شاملة متعددة التخصصات">عيادة بيطرية شاملة ومختبر دم</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                        رسوم الكشف / الاستشارة البيطرية ($):
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-stone-400 font-bold">$</span>
                        <input
                          type="number"
                          min="10"
                          value={consultationFeeUsd}
                          onChange={(e) => setConsultationFeeUsd(Number(e.target.value))}
                          className="w-full pl-8 pr-3 py-2 bg-white border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600 font-bold"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2 lg:col-span-2">
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                        الخدمات الجراحية والتشخيصية المتوفرة:
                      </label>
                      <input
                        type="text"
                        value={surgicalCapabilities}
                        onChange={(e) => setSurgicalCapabilities(e.target.value)}
                        placeholder="مثال: سونار، ولادة قيصرية، فحص بروسيلا، تحصينات معتمدة"
                        className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-5">
                      <input
                        type="checkbox"
                        id="mobileVet"
                        checked={hasMobileEmergencyClinic}
                        onChange={(e) => setHasMobileEmergencyClinic(e.target.checked)}
                        className="w-4 h-4 text-emerald-800 rounded-sm focus:ring-emerald-600"
                      />
                      <label htmlFor="mobileVet" className="text-xs font-semibold text-stone-800 cursor-pointer">
                        يتوفر إسعاف بيطري وزيارات ميدانية طارئة للحظائر 24/7
                      </label>
                    </div>
                  </div>
                )}

                {/* 3. Lab Analyst Fields */}
                {selectedDiscipline === 'lab_analyst' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                        جهة الاعتماد وترخيص الجودة المخبرية:
                      </label>
                      <input
                        type="text"
                        value={labAccreditationBody}
                        onChange={(e) => setLabAccreditationBody(e.target.value)}
                        placeholder="مثال: ISO 17025، هيئة سلامة الغذاء"
                        className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                        مدة تسليم نتائج التحليل المخبري (بالأيام):
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="14"
                        value={sampleTurnaroundDays}
                        onChange={(e) => setSampleTurnaroundDays(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                        متوسط تكلفة فحص العينة الأساسية ($):
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-stone-400 font-bold">$</span>
                        <input
                          type="number"
                          min="15"
                          value={consultationFeeUsd}
                          onChange={(e) => setConsultationFeeUsd(Number(e.target.value))}
                          className="w-full pl-8 pr-3 py-2 bg-white border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600 font-bold"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2 lg:col-span-3">
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                        نطاق الفحوصات والتحاليل المخبرية المعتمدة:
                      </label>
                      <input
                        type="text"
                        value={labTestingScopes}
                        onChange={(e) => setLabTestingScopes(e.target.value)}
                        placeholder="مثال: فحص ملوحة EC، قلوية pH، نترات، معادن ثقيلة، متبقيات مبيدات، بروتين أعلاف"
                        className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                      />
                    </div>
                  </div>
                )}

                {/* 4. Commercial Farmer Fields */}
                {selectedDiscipline === 'commercial_farmer' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                        مساحة الحيازات / المزرعة:
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          min="1"
                          value={farmAcreage}
                          onChange={(e) => setFarmAcreage(Number(e.target.value))}
                          className="w-2/3 px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                        />
                        <select
                          value={farmAcreageUnit}
                          onChange={(e) => setFarmAcreageUnit(e.target.value as any)}
                          className="w-1/3 px-2 py-2 bg-white border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600 cursor-pointer"
                        >
                          <option value="هكتار">هكتار</option>
                          <option value="فدان">فدان</option>
                          <option value="دونم">دونم</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                        نظام الري المعتمد:
                      </label>
                      <input
                        type="text"
                        value={irrigationSystemType}
                        onChange={(e) => setIrrigationSystemType(e.target.value)}
                        placeholder="مثال: ري محوري Pivot، شبكة تنقيط، طاقة شمسية"
                        className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                      />
                    </div>

                    <div className="sm:col-span-2 lg:col-span-3">
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                        المحاصيل والمنتجات الرئيسية المتاحة للتوريد بالجملة:
                      </label>
                      <input
                        type="text"
                        value={mainCropsProduced}
                        onChange={(e) => setMainCropsProduced(e.target.value)}
                        placeholder="مثال: قمح صلب، بطاطس تصديري، تمور برحي ومجدول، خضار بيوت محمية"
                        className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                      />
                    </div>
                  </div>
                )}

                {/* 5. Livestock Breeder Fields */}
                {selectedDiscipline === 'livestock_breeder' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                        السلالات والأنواع المرباة (حلال حصراً):
                      </label>
                      <input
                        type="text"
                        value={livestockBreeds}
                        onChange={(e) => setLivestockBreeds(e.target.value)}
                        placeholder="مثال: خراف عواسي، أبقار هولشتاين، إبل مجاهيم"
                        className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                        سعة القطيع الإجمالية (عدد الرؤوس):
                      </label>
                      <input
                        type="number"
                        min="10"
                        value={herdCapacityHeads}
                        onChange={(e) => setHerdCapacityHeads(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                      />
                    </div>

                    <div className="flex flex-col justify-center space-y-2 pt-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="halalPledge"
                          checked={halalFeedPledge}
                          onChange={(e) => setHalalFeedPledge(e.target.checked)}
                          className="w-4 h-4 text-emerald-800 rounded-sm focus:ring-emerald-600"
                        />
                        <label htmlFor="halalPledge" className="text-xs font-semibold text-stone-800 cursor-pointer">
                          تغذية حلال نقية خالية من الهرمونات والبروتينات المحرمة
                        </label>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="bioSec"
                          checked={biosecurityCertified}
                          onChange={(e) => setBiosecurityCertified(e.target.checked)}
                          className="w-4 h-4 text-emerald-800 rounded-sm focus:ring-emerald-600"
                        />
                        <label htmlFor="bioSec" className="text-xs font-semibold text-stone-800 cursor-pointer">
                          تطبيق إجراءات الأمان الحيوي والتحصين الوقائي
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. Aquaculture Expert Fields */}
                {selectedDiscipline === 'aquaculture_expert' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                        الأنواع المستزرعة والزريعة:
                      </label>
                      <input
                        type="text"
                        value={aquacultureSpecies}
                        onChange={(e) => setAquacultureSpecies(e.target.value)}
                        placeholder="مثال: بلطي نيلي وحيد جنس، دنيس، قاروص، جمبري"
                        className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                        الطاقة الإنتاجية السنوية (بالطن):
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={annualCapacityTons}
                        onChange={(e) => setAnnualCapacityTons(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                        طبيعة نظام الاستزراع المائي:
                      </label>
                      <input
                        type="text"
                        value={farmingSystemType}
                        onChange={(e) => setFarmingSystemType(e.target.value)}
                        placeholder="مثال: أحواض ترابية، أقفاص عائمة، نظام RAS مغلق"
                        className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                      />
                    </div>
                  </div>
                )}

              </div>

              {/* Step 4: Submission Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 text-stone-600 hover:text-stone-900 text-xs font-semibold transition-colors cursor-pointer"
                >
                  إلغاء
                </button>

                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-sm"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>تأكيد التسجيل وإصدار بطاقة الاختصاص</span>
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
