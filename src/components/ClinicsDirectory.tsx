import React, { useState, useMemo } from 'react';
import { ClinicDirectoryItem } from '../types';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Clock, 
  Star, 
  ShieldCheck, 
  Search, 
  PlusCircle, 
  MessageSquare, 
  FlaskConical, 
  Stethoscope, 
  Sprout, 
  CheckCircle2,
  X,
  Map as MapIcon,
  LayoutGrid
} from 'lucide-react';
import { InteractiveClinicsMap } from './InteractiveClinicsMap';

interface ClinicsDirectoryProps {
  directory: ClinicDirectoryItem[];
  onAddClinic: (item: ClinicDirectoryItem) => void;
  initialView?: 'map' | 'cards' | 'both';
}

const REGIONS = ['الكل', 'مصر', 'الأردن', 'السعودية', 'المغرب', 'العراق', 'السودان', 'تونس', 'سلطنة عمان', 'لبنان'];

export const ClinicsDirectory: React.FC<ClinicsDirectoryProps> = ({ 
  directory, 
  onAddClinic,
  initialView = 'both'
}) => {
  const [activeView, setActiveView] = useState<'map' | 'cards' | 'both'>(initialView);

  React.useEffect(() => {
    if (initialView) {
      setActiveView(initialView);
    }
  }, [initialView]);

  const [selectedType, setSelectedType] = useState<'all' | 'veterinary' | 'agricultural' | 'lab'>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('الكل');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Add Clinic Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newClinicName, setNewClinicName] = useState('');
  const [newClinicType, setNewClinicType] = useState<'veterinary' | 'agricultural' | 'lab'>('veterinary');
  const [newClinicRegion, setNewClinicRegion] = useState('مصر');
  const [newClinicCity, setNewClinicCity] = useState('');
  const [newClinicAddress, setNewClinicAddress] = useState('');
  const [newClinicPhone, setNewClinicPhone] = useState('');
  const [newClinicWhatsapp, setNewClinicWhatsapp] = useState('');
  const [newClinicHours, setNewClinicHours] = useState('السبت - الخميس: 8:00 ص - 8:00 م');
  const [newClinicServices, setNewClinicServices] = useState('');

  // Inquiry / Booking Modal
  const [inquiryClinic, setInquiryClinic] = useState<ClinicDirectoryItem | null>(null);
  const [inquirerName, setInquirerName] = useState('');
  const [inquirerPhone, setInquirerPhone] = useState('');
  const [inquiryNotes, setInquiryNotes] = useState('');
  const [inquirySent, setInquirySent] = useState(false);

  const filteredDirectory = useMemo(() => {
    return directory.filter((item) => {
      const matchType = selectedType === 'all' || item.type === selectedType;
      const matchRegion = selectedRegion === 'الكل' || item.region === selectedRegion || item.city.includes(selectedRegion) || item.address.includes(selectedRegion);
      const matchSearch = searchQuery.trim() === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.services.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchType && matchRegion && matchSearch;
    });
  }, [directory, selectedType, selectedRegion, searchQuery]);

  const handleCreateClinic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClinicName || !newClinicCity || !newClinicPhone) return;

    const servicesList = newClinicServices
      ? newClinicServices.split('\n').filter(s => s.trim() !== '')
      : ['كشف وفحص حقلي', 'استشارات متخصصة'];

    const defaultCoords: { [key: string]: { lat: number; lng: number } } = {
      'مصر': { lat: 30.0444, lng: 31.2357 },
      'الأردن': { lat: 31.9539, lng: 35.9106 },
      'السعودية': { lat: 24.7136, lng: 46.6753 },
      'المغرب': { lat: 33.5731, lng: -7.5898 },
      'العراق': { lat: 33.3152, lng: 44.3661 },
      'السودان': { lat: 15.5007, lng: 32.5599 },
      'تونس': { lat: 36.8065, lng: 10.1815 },
      'سلطنة عمان': { lat: 23.5880, lng: 58.3829 },
      'لبنان': { lat: 33.8938, lng: 35.5018 },
    };

    const targetCoords = defaultCoords[newClinicRegion] || { lat: 30.0444, lng: 31.2357 };

    const newFacility: ClinicDirectoryItem = {
      id: `dir-fac-${Date.now()}`,
      name: newClinicName,
      type: newClinicType,
      typeName: newClinicType === 'veterinary' ? 'عيادة بيطرية متقدمة' : newClinicType === 'lab' ? 'مختبر زراعي معتمد' : 'مكتب هندسة ووقاية زراعية',
      region: newClinicRegion,
      city: newClinicCity,
      address: newClinicAddress || `${newClinicRegion} - ${newClinicCity}`,
      phone: newClinicPhone,
      whatsapp: newClinicWhatsapp || newClinicPhone,
      workingHours: newClinicHours,
      services: servicesList,
      rating: 5.0,
      reviewsCount: 1,
      verified: true,
      lat: targetCoords.lat + (Math.random() - 0.5) * 0.05,
      lng: targetCoords.lng + (Math.random() - 0.5) * 0.05,
      notes: 'تم التسجيل حديثاً في دليل ثمار.تك'
    };

    onAddClinic(newFacility);
    setIsAddModalOpen(false);
    setNewClinicName('');
    setNewClinicCity('');
    setNewClinicPhone('');
    setNewClinicServices('');
  };

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquirerName || !inquirerPhone) return;
    setInquirySent(true);
    setTimeout(() => {
      setInquirySent(false);
      setInquiryClinic(null);
      setInquirerName('');
      setInquirerPhone('');
      setInquiryNotes('');
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Title & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 mb-1">
            <span>الدليل الوطني للمرافق الزراعية والبيطرية</span>
            <span aria-hidden="true">·</span>
            <span>عيادات بيطرية · مكاتب وقاية · مختبرات مياه وتربة</span>
          </div>
          <h2 className="text-2xl font-bold text-stone-900 tracking-tight">
            دليل العيادات البيطرية والزراعية والمختبرات
          </h2>
          <p className="text-stone-600 text-sm mt-1">
            دليل جغرافي معتمد يتيح للمزارعين والمربين الوصول المباشر لأقرب المراكز الطبية والمخبرية والهندسية مع أرقام التواصل الفوري وساعات العمل.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View switcher */}
          <div className="flex items-center bg-stone-100 p-1 rounded-lg border border-stone-200 text-xs">
            <button
              onClick={() => setActiveView('both')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-md font-semibold cursor-pointer transition-colors ${
                activeView === 'both' ? 'bg-white text-emerald-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <span>عرض مدمج</span>
            </button>
            <button
              onClick={() => setActiveView('map')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-md font-semibold cursor-pointer transition-colors ${
                activeView === 'map' ? 'bg-white text-emerald-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>الخريطة</span>
            </button>
            <button
              onClick={() => setActiveView('cards')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-md font-semibold cursor-pointer transition-colors ${
                activeView === 'cards' ? 'bg-white text-emerald-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>البطاقات</span>
            </button>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-sm self-start md:self-auto shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>إضافة عيادة للدليل</span>
          </button>
        </div>
      </div>

      {/* 1. Interactive Geospatial Map Component */}
      {(activeView === 'map' || activeView === 'both') && (
        <InteractiveClinicsMap facilities={directory} />
      )}

      {/* 2. Facility Cards & Filtering */}
      {(activeView === 'cards' || activeView === 'both') && (
        <div className="space-y-6">
          <div className="border-t border-stone-200 pt-6">
            <h3 className="text-lg font-bold text-stone-900 mb-1">
              قائمة المراكز والعيادات المعتمدة ({filteredDirectory.length}):
            </h3>
            <p className="text-xs text-stone-500">تصفح الخدمات وتواصل مباشرة عبر الهاتف أو الواتساب</p>
          </div>
        
        {/* Facility Type Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-stone-600 ml-1">نوع المنشأة:</span>
          {[
            { id: 'all', label: 'كافة المراكز', icon: Building2 },
            { id: 'veterinary', label: 'عيادات بيطرية ومواشي', icon: Stethoscope },
            { id: 'agricultural', label: 'عيادات وهندسة زراعية', icon: Sprout },
            { id: 'lab', label: 'مختبرات تربة ومياه وأعلاف', icon: FlaskConical },
          ].map((type) => {
            const Icon = type.icon;
            const isSelected = selectedType === type.id;
            return (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-white text-stone-700 hover:bg-stone-50 border border-stone-200'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-stone-500'}`} />
                <span>{type.label}</span>
              </button>
            );
          })}
        </div>

        {/* Region & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-stone-200/60">
          
          {/* Region selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <span className="text-xs font-semibold text-stone-600 ml-1 whitespace-nowrap">المنطقة:</span>
            {REGIONS.map((reg) => (
              <button
                key={reg}
                onClick={() => setSelectedRegion(reg)}
                className={`px-2.5 py-1 text-xs rounded-md whitespace-nowrap cursor-pointer transition-colors ${
                  selectedRegion === reg
                    ? 'bg-stone-800 text-white font-bold'
                    : 'bg-white text-stone-600 hover:bg-stone-50 border border-stone-200'
                }`}
              >
                {reg}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="بحث بالاسم أو الخدمة أو المدينة..."
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>

        </div>

        {/* Directory Cards Grid */}
      {filteredDirectory.length === 0 ? (
        <div className="text-center py-16 bg-white border border-dashed border-stone-300 rounded-2xl p-8">
          <Building2 className="w-10 h-10 text-stone-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-stone-800 mb-1">لم يتم العثور على مرافق مطابقة</h3>
          <p className="text-xs text-stone-500 mb-4">جرّب اختيار منطقة أخرى أو إعادة ضبط عوامل التصفية.</p>
          <button
            onClick={() => { setSelectedType('all'); setSelectedRegion('الكل'); setSearchQuery(''); }}
            className="px-4 py-2 bg-emerald-800 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer"
          >
            إظهار كافة المرافق
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDirectory.map((clinic) => {
            const isVet = clinic.type === 'veterinary';
            const isLab = clinic.type === 'lab';

            return (
              <div
                key={clinic.id}
                className="bg-white border border-stone-200 rounded-xl overflow-hidden hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar Strip */}
                  <div className={`p-4 border-b ${
                    isVet ? 'bg-amber-50/60 border-amber-100' : isLab ? 'bg-blue-50/60 border-blue-100' : 'bg-emerald-50/60 border-emerald-100'
                  }`}>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className={`font-semibold ${
                        isVet ? 'text-amber-900' : isLab ? 'text-blue-900' : 'text-emerald-900'
                      }`}>
                        {clinic.typeName}
                      </span>
                      {clinic.verified && (
                        <span className="flex items-center gap-1 text-[11px] text-emerald-800 font-semibold bg-emerald-100/80 px-2 py-0.5 rounded">
                          <ShieldCheck className="w-3 h-3 text-emerald-700" />
                          <span>مرخص ومعتمد</span>
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-stone-900 leading-snug">
                      {clinic.name}
                    </h3>
                  </div>

                  {/* Body Info */}
                  <div className="p-4 space-y-3 text-xs text-stone-600">
                    
                    {/* Location & Rating */}
                    <div className="flex items-center justify-between text-stone-500">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-stone-400" />
                        <span className="font-medium text-stone-700">{clinic.region} · {clinic.city}</span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-600 font-semibold tabular-nums">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        {clinic.rating} ({clinic.reviewsCount})
                      </div>
                    </div>

                    {/* Address snippet */}
                    <div className="text-[11px] text-stone-500 leading-relaxed">
                      {clinic.address}
                    </div>

                    {/* Working hours */}
                    <div className="flex items-start gap-1.5 text-[11px] text-stone-700 bg-stone-50 p-2 rounded-lg border border-stone-100">
                      <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                      <span>{clinic.workingHours}</span>
                    </div>

                    {/* Services list */}
                    <div>
                      <div className="font-semibold text-stone-800 text-[11px] mb-1.5">أبرز الخدمات والتحاليل المقدمة:</div>
                      <ul className="space-y-1">
                        {clinic.services.slice(0, 4).map((serv, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 text-[11px] text-stone-600">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{serv}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {clinic.notes && (
                      <p className="text-[11px] text-emerald-800 bg-emerald-50/50 p-2 rounded border border-emerald-100">
                        {clinic.notes}
                      </p>
                    )}

                  </div>
                </div>

                {/* Action Buttons */}
                <div className="p-4 pt-0 grid grid-cols-3 gap-2">
                  <a
                    href={`tel:${clinic.phone}`}
                    className="flex items-center justify-center gap-1 py-2 px-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-stone-600" />
                    <span>اتصال</span>
                  </a>

                  <a
                    href={`https://wa.me/${clinic.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1 py-2 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-semibold transition-colors border border-emerald-200"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                    <span>واتساب</span>
                  </a>

                  <button
                    onClick={() => setInquiryClinic(clinic)}
                    className="py-2 px-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-xs"
                  >
                    طلب موعد
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  )}

      {/* Inquiry / Appointment Modal */}
      {inquiryClinic && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div onClick={() => setInquiryClinic(null)} className="fixed inset-0 bg-black/60 backdrop-blur-xs" />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 space-y-4 border border-stone-200">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <div>
                  <h3 className="text-base font-bold text-stone-900">طلب موعد / فحص مخبري</h3>
                  <p className="text-xs text-stone-500">{inquiryClinic.name}</p>
                </div>
                <button onClick={() => setInquiryClinic(null)} className="p-1 text-stone-400 hover:text-stone-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {!inquirySent ? (
                <form onSubmit={handleSendInquiry} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">اسم المزارع / المربي:</label>
                    <input
                      type="text"
                      required
                      value={inquirerName}
                      onChange={(e) => setInquirerName(e.target.value)}
                      placeholder="الاسم الكامل"
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">رقم الجوال:</label>
                    <input
                      type="tel"
                      required
                      value={inquirerPhone}
                      onChange={(e) => setInquirerPhone(e.target.value)}
                      placeholder="05xxxxxxxx"
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">نوع الخدمة أو التحليل المطلوب:</label>
                    <textarea
                      rows={2}
                      value={inquiryNotes}
                      onChange={(e) => setInquiryNotes(e.target.value)}
                      placeholder="مثال: تحليل ملوحة بئر ارتوازي / فحص سونار لأبقار / استشارة وقاية طماطم"
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setInquiryClinic(null)}
                      className="px-4 py-2 bg-stone-100 text-stone-700 rounded-lg"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-emerald-800 text-white font-bold rounded-lg hover:bg-emerald-900"
                    >
                      إرسال الطلب للمركز
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-6 space-y-2">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h4 className="text-sm font-bold text-stone-900">تم إرسال طلبك للمركز بنجاح!</h4>
                  <p className="text-xs text-stone-500">سيتواصل معك فريق الاستقبال لتحديد الموعد واستلام العينات.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add New Clinic / Lab Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div onClick={() => setIsAddModalOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-xs" />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 space-y-4 border border-stone-200">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <div>
                  <h3 className="text-base font-bold text-stone-900">تسجيل عيادة أو مختبر زراعي جديد</h3>
                  <p className="text-xs text-stone-500">أضف منشأتك إلى الدليل الوطني لمنصة ثمار.تك</p>
                </div>
                <button onClick={() => setIsAddModalOpen(false)} className="p-1 text-stone-400 hover:text-stone-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateClinic} className="space-y-3 text-xs max-h-[70vh] overflow-y-auto">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">اسم العيادة أو المختبر:</label>
                  <input
                    type="text"
                    required
                    value={newClinicName}
                    onChange={(e) => setNewClinicName(e.target.value)}
                    placeholder="مثال: مختبر نماء الزراعي لتحاليل التربة"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">نوع المنشأة:</label>
                    <select
                      value={newClinicType}
                      onChange={(e) => setNewClinicType(e.target.value as any)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    >
                      <option value="veterinary">عيادة بيطرية للمواشي والأنعام</option>
                      <option value="agricultural">عيادة ومكتب وقاية وهندسة زراعية</option>
                      <option value="lab">مختبر تحاليل مياه وتربة وأعلاف</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">المنطقة:</label>
                    <select
                      value={newClinicRegion}
                      onChange={(e) => setNewClinicRegion(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    >
                      {REGIONS.filter(r => r !== 'الكل').map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">المدينة / المحافظة:</label>
                    <input
                      type="text"
                      required
                      value={newClinicCity}
                      onChange={(e) => setNewClinicCity(e.target.value)}
                      placeholder="بريدة / الخرج / حفر الباطن"
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">رقم الهاتف أو الجوال:</label>
                    <input
                      type="tel"
                      required
                      value={newClinicPhone}
                      onChange={(e) => setNewClinicPhone(e.target.value)}
                      placeholder="05xxxxxxxx"
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">العنوان التفصيلي:</label>
                  <input
                    type="text"
                    value={newClinicAddress}
                    onChange={(e) => setNewClinicAddress(e.target.value)}
                    placeholder="الشارع والحي وأقرب معلم بارز"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">ساعات العمل:</label>
                  <input
                    type="text"
                    value={newClinicHours}
                    onChange={(e) => setNewClinicHours(e.target.value)}
                    placeholder="السبت - الخميس: 8:00 ص - 8:00 م"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">قائمة الخدمات والتحاليل (كل خدمة في سطر):</label>
                  <textarea
                    rows={3}
                    value={newClinicServices}
                    onChange={(e) => setNewClinicServices(e.target.value)}
                    placeholder="فحص دم المواشي&#10;تحليل ملوحة مياه الآبار&#10;كشف سوسة النخيل"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2 border-t border-stone-200">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 bg-stone-100 text-stone-700 rounded-lg"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-800 text-white font-bold rounded-lg hover:bg-emerald-900"
                  >
                    إضافة للمنصة فوراً
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
