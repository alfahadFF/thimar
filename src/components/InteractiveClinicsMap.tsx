import React, { useState, useMemo } from 'react';
import { ClinicDirectoryItem } from '../types';
import { 
  MapPin, 
  Navigation, 
  Stethoscope, 
  FlaskConical, 
  Sprout, 
  Phone, 
  ExternalLink, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  CheckCircle2, 
  Building2,
  X,
  Compass
} from 'lucide-react';

interface InteractiveClinicsMapProps {
  facilities: ClinicDirectoryItem[];
  onSelectFacility?: (facility: ClinicDirectoryItem) => void;
}

// Preset regions for quick manual location selection if GPS permission is skipped
const PRESET_LOCATIONS: { name: string; lat: number; lng: number }[] = [
  { name: 'مصر (القاهرة والجيزة)', lat: 30.0131, lng: 31.2089 },
  { name: 'مصر (الدلتا وكفر الشيخ)', lat: 31.1107, lng: 30.9388 },
  { name: 'الأردن (الأغوار ودير علا)', lat: 32.1932, lng: 35.6172 },
  { name: 'الأردن (المفرق وعمان)', lat: 32.3421, lng: 36.2081 },
  { name: 'المغرب (أكادير وسوس)', lat: 30.4278, lng: -9.5981 },
  { name: 'المغرب (سهل الغرب والقنيطرة)', lat: 34.2610, lng: -6.5802 },
  { name: 'العراق (الموصل ونينوى)', lat: 36.3400, lng: 43.1300 },
  { name: 'السعودية (القصيم وبريدة)', lat: 26.3592, lng: 43.9818 },
  { name: 'السعودية (الرياض والخرج)', lat: 24.7136, lng: 46.6753 },
  { name: 'السعودية (حفر الباطن)', lat: 28.4328, lng: 45.9708 },
  { name: 'سلطنة عمان (صحار والباطنة)', lat: 24.3639, lng: 56.7458 },
  { name: 'السودان (ود مدني والجزيرة)', lat: 14.4012, lng: 33.5199 },
  { name: 'لبنان (زحلة وسهل البقاع)', lat: 33.8463, lng: 35.9020 },
];

// Haversine formula to calculate distance between two coordinates in Kilometers
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export const InteractiveClinicsMap: React.FC<InteractiveClinicsMapProps> = ({ facilities }) => {
  // User Location State (Defaults to central regional hub)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; label: string }>({
    lat: 30.0131,
    lng: 31.2089,
    label: 'مصر (موقع افتراضي)'
  });
  const [detectingGps, setDetectingGps] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Map Filter and View Controls
  const [typeFilter, setTypeFilter] = useState<'all' | 'veterinary' | 'agricultural' | 'lab'>('all');
  const [maxDistanceKm, setMaxDistanceKm] = useState<number>(3000); // 3000km = all regional
  const [selectedFacility, setSelectedFacility] = useState<ClinicDirectoryItem | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Map boundary configuration for coordinate transformation across Arab & Mediterranean countries
  const mapBounds = {
    minLat: 13.0,
    maxLat: 37.5,
    minLng: -11.0,
    maxLng: 60.0,
  };

  const projectToMap = (lat: number, lng: number) => {
    // Normalizes to 0-100% inside SVG viewBox (800 x 550)
    const x = ((lng - mapBounds.minLng) / (mapBounds.maxLng - mapBounds.minLng)) * 760 + 20;
    const y = ((mapBounds.maxLat - lat) / (mapBounds.maxLat - mapBounds.minLat)) * 500 + 25;
    return { x: Math.max(15, Math.min(785, x)), y: Math.max(15, Math.min(535, y)) };
  };

  // Detect real GPS
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setGpsError('متصفحك لا يدعم تحديد الموقع الجغرافي.');
      return;
    }
    setDetectingGps(true);
    setGpsError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setDetectingGps(false);
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          label: 'موقعك الحالي الفعلي (GPS)'
        });
      },
      (err) => {
        setDetectingGps(false);
        setGpsError('تعذر الحصول على إذن الموقع. يمكنك اختيار منطقتك يدوياً من القائمة أدناه.');
      },
      { timeout: 8000 }
    );
  };

  // Calculate distance for all facilities & filter
  const facilitiesWithDistance = useMemo(() => {
    return facilities
      .filter((f) => typeFilter === 'all' || f.type === typeFilter)
      .map((f) => {
        const dist = calculateDistanceKm(userLocation.lat, userLocation.lng, f.lat, f.lng);
        return { ...f, distanceKm: dist };
      })
      .filter((f) => f.distanceKm <= maxDistanceKm)
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [facilities, userLocation, typeFilter, maxDistanceKm]);

  const userPoint = projectToMap(userLocation.lat, userLocation.lng);

  return (
    <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-xs space-y-0">
      
      {/* Top Map Control Bar */}
      <div className="p-4 sm:p-5 border-b border-stone-200 bg-stone-50/80 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 mb-1">
            <Compass className="w-4 h-4 text-emerald-700" />
            <span>الخريطة التفاعلية والمسافات الجغرافية</span>
          </div>
          <h3 className="text-base font-bold text-stone-900">
            أماكن العيادات والمختبرات الزراعية الأقرب لمزرعتك
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            موقعك المعتمد: <span className="font-semibold text-stone-800">{userLocation.label}</span>
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* GPS Auto-detect button */}
          <button
            onClick={handleDetectLocation}
            disabled={detectingGps}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer disabled:opacity-50 shadow-xs"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>{detectingGps ? 'جارٍ تحديد موقعك...' : 'تحديد موقعي الحالي'}</span>
          </button>

          {/* Quick preset selector */}
          <select
            value={userLocation.label}
            onChange={(e) => {
              const found = PRESET_LOCATIONS.find(p => p.name === e.target.value);
              if (found) {
                setUserLocation({ lat: found.lat, lng: found.lng, label: found.name });
              }
            }}
            className="px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs text-stone-700 focus:outline-none focus:ring-1 focus:ring-emerald-600 cursor-pointer"
          >
            <option disabled value="">اختر منطقتك الحقلية...</option>
            {PRESET_LOCATIONS.map((loc) => (
              <option key={loc.name} value={loc.name}>مزرعتي في {loc.name}</option>
            ))}
          </select>

          {/* Max Distance filter */}
          <select
            value={maxDistanceKm}
            onChange={(e) => setMaxDistanceKm(Number(e.target.value))}
            className="px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs text-stone-700 focus:outline-none focus:ring-1 focus:ring-emerald-600 cursor-pointer"
          >
            <option value={3000}>كافة المسافات (المستوى الإقليمي والدولي)</option>
            <option value={100}>الأقرب: ضمن 100 كم</option>
            <option value={300}>ضمن 300 كم</option>
            <option value={600}>ضمن 600 كم</option>
            <option value={1500}>ضمن 1500 كم</option>
          </select>
        </div>

      </div>

      {gpsError && (
        <div className="p-3 bg-amber-50 border-b border-amber-200 text-amber-900 text-xs flex items-center justify-between">
          <span>{gpsError}</span>
          <button onClick={() => setGpsError(null)} className="text-stone-400 hover:text-stone-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter Tabs by Facility Type */}
      <div className="px-4 py-2.5 bg-stone-100/70 border-b border-stone-200 flex items-center gap-2 overflow-x-auto text-xs">
        <span className="font-semibold text-stone-600 ml-1">تصفية العلامات:</span>
        {[
          { id: 'all', label: 'كافة المراكز', color: 'bg-stone-800 text-white' },
          { id: 'veterinary', label: 'عيادات بيطرية (مواشي)', color: 'bg-amber-600 text-white' },
          { id: 'agricultural', label: 'عيادات وقاية وهندسة', color: 'bg-emerald-700 text-white' },
          { id: 'lab', label: 'مختبرات تربة ومياه', color: 'bg-blue-600 text-white' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setTypeFilter(tab.id as any)}
            className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
              typeFilter === tab.id
                ? tab.color
                : 'bg-white text-stone-700 hover:bg-stone-50 border border-stone-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Interactive Map Canvas and Proximity List Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
        
        {/* Left Side: Geospatial Map Canvas (8 Columns) */}
        <div className="lg:col-span-8 relative bg-slate-950 overflow-hidden flex items-center justify-center min-h-[420px] select-none">
          
          {/* Subtle Grid Coordinates Background */}
          <div 
            className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:28px_28px]" 
            aria-hidden="true" 
          />

          {/* SVG Geospatial Canvas */}
          <div 
            className="w-full h-full flex items-center justify-center p-4 transition-transform duration-200"
            style={{
              transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
              transformOrigin: 'center center'
            }}
          >
            <svg 
              viewBox="0 0 800 550" 
              className="w-full h-auto max-h-[520px] filter drop-shadow-md"
              style={{ overflow: 'visible' }}
            >
              {/* Regional Outline representation (Arabian Peninsula contour) */}
              <path
                d="M 120 120 C 180 90, 280 80, 420 85 C 520 90, 600 110, 680 160 C 720 200, 750 260, 710 320 C 680 370, 620 420, 560 450 C 480 490, 380 480, 300 460 C 240 440, 200 400, 180 340 C 160 280, 140 220, 110 160 Z"
                fill="#0f172a"
                stroke="#1e293b"
                strokeWidth="2.5"
              />

              {/* Internal Regional Dashes */}
              <path
                d="M 280 180 Q 420 220 540 250"
                fill="none"
                stroke="#334155"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <path
                d="M 380 140 Q 420 300 440 440"
                fill="none"
                stroke="#334155"
                strokeWidth="1"
                strokeDasharray="4 4"
              />

              {/* Regional Labels */}
              <text x="320" y="190" fill="#64748b" fontSize="11" fontWeight="bold" textAnchor="middle">منطقة حائل والجوف</text>
              <text x="390" y="240" fill="#64748b" fontSize="11" fontWeight="bold" textAnchor="middle">منطقة القصيم</text>
              <text x="460" y="290" fill="#64748b" fontSize="11" fontWeight="bold" textAnchor="middle">منطقة الرياض والخرج</text>
              <text x="590" y="240" fill="#64748b" fontSize="11" fontWeight="bold" textAnchor="middle">المنطقة الشرقية</text>
              <text x="360" y="470" fill="#64748b" fontSize="11" fontWeight="bold" textAnchor="middle">منطقة جازان وعسير</text>

              {/* Distance lines connecting user location to facilities */}
              {facilitiesWithDistance.map((fac) => {
                const p = projectToMap(fac.lat, fac.lng);
                const isSelected = selectedFacility?.id === fac.id;
                return (
                  <line
                    key={`line-${fac.id}`}
                    x1={userPoint.x}
                    y1={userPoint.y}
                    x2={p.x}
                    y2={p.y}
                    stroke={isSelected ? '#10b981' : '#334155'}
                    strokeWidth={isSelected ? '2' : '0.8'}
                    strokeDasharray={isSelected ? 'none' : '3 3'}
                    opacity={isSelected ? 0.9 : 0.35}
                  />
                );
              })}

              {/* Facility Markers */}
              {facilitiesWithDistance.map((fac) => {
                const p = projectToMap(fac.lat, fac.lng);
                const isSelected = selectedFacility?.id === fac.id;
                const pinColor = fac.type === 'veterinary' ? '#f59e0b' : fac.type === 'lab' ? '#3b82f6' : '#10b981';

                return (
                  <g 
                    key={fac.id} 
                    transform={`translate(${p.x}, ${p.y})`}
                    onClick={() => setSelectedFacility(fac)}
                    className="cursor-pointer group"
                  >
                    {/* Pulsing ring on selection */}
                    {isSelected && (
                      <circle r="18" fill={pinColor} opacity="0.3" className="animate-ping" />
                    )}

                    {/* Pin base circle */}
                    <circle
                      r={isSelected ? '12' : '9'}
                      fill={pinColor}
                      stroke="#ffffff"
                      strokeWidth="2"
                      className="transition-transform group-hover:scale-125"
                    />

                    {/* Center Dot */}
                    <circle r="3" fill="#ffffff" />

                    {/* Facility label on hover or select */}
                    <text
                      x="0"
                      y={isSelected ? '-16' : '-13'}
                      fill="#f8fafc"
                      fontSize="10"
                      fontWeight="bold"
                      textAnchor="middle"
                      className="bg-black pointer-events-none drop-shadow-md"
                    >
                      {fac.name.split(' ')[0]} ({fac.distanceKm} كم)
                    </text>
                  </g>
                );
              })}

              {/* User Location Marker (Pulse Icon) */}
              <g transform={`translate(${userPoint.x}, ${userPoint.y})`}>
                <circle r="14" fill="#059669" opacity="0.4" className="animate-ping" />
                <circle r="8" fill="#10b981" stroke="#ffffff" strokeWidth="2.5" />
                <circle r="3" fill="#ffffff" />
                <text x="0" y="20" fill="#34d399" fontSize="10" fontWeight="bold" textAnchor="middle">
                  موقعك ({userLocation.label})
                </text>
              </g>

            </svg>
          </div>

          {/* Map Controls Floating Toolbar (Zoom & Reset) */}
          <div className="absolute left-3 bottom-3 flex flex-col gap-1.5 bg-stone-900/90 p-1.5 rounded-xl border border-stone-700 backdrop-blur-xs text-white">
            <button
              onClick={() => setZoomLevel(prev => Math.min(2.2, prev + 0.25))}
              className="p-2 hover:bg-stone-800 rounded-lg cursor-pointer"
              title="تكبير الخريطة"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel(prev => Math.max(0.8, prev - 0.25))}
              className="p-2 hover:bg-stone-800 rounded-lg cursor-pointer"
              title="تصغير الخريطة"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => { setZoomLevel(1); setPanOffset({ x: 0, y: 0 }); }}
              className="p-2 hover:bg-stone-800 rounded-lg cursor-pointer"
              title="إعادة ضبط الرؤية"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Legend Overlay */}
          <div className="absolute right-3 top-3 bg-stone-900/90 border border-stone-700/80 p-2.5 rounded-xl text-[11px] text-stone-300 space-y-1.5 backdrop-blur-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>موقعك المعتمد</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>عيادة بيطرية للمواشي</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span>مختبر تربة ومياه وأعلاف</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              <span>عيادة وهندسة زراعية</span>
            </div>
          </div>

          {/* Floating Detail Popup when a facility is selected */}
          {selectedFacility && (
            <div className="absolute bottom-4 inset-x-4 sm:inset-x-auto sm:right-4 sm:max-w-sm bg-white text-stone-900 rounded-xl p-4 shadow-xl border border-stone-200 animate-in fade-in duration-200">
              <div className="flex items-start justify-between gap-2 border-b border-stone-100 pb-2 mb-2">
                <div>
                  <span className="text-[10px] font-bold text-emerald-800 block">{selectedFacility.typeName}</span>
                  <h4 className="text-xs font-bold text-stone-900 line-clamp-1">{selectedFacility.name}</h4>
                </div>
                <button 
                  onClick={() => setSelectedFacility(null)}
                  className="p-1 text-stone-400 hover:text-stone-700 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">المسافة من موقعك:</span>
                  <span className="font-bold text-emerald-800 tabular-nums">
                    {calculateDistanceKm(userLocation.lat, userLocation.lng, selectedFacility.lat, selectedFacility.lng)} كم
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">المدينة:</span>
                  <span className="font-semibold text-stone-800">{selectedFacility.city} ({selectedFacility.region})</span>
                </div>
                <div className="text-[11px] text-stone-500 line-clamp-1">
                  {selectedFacility.address}
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center gap-2">
                <a
                  href={`tel:${selectedFacility.phone}`}
                  className="flex-1 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded text-center text-xs font-bold"
                >
                  اتصال: {selectedFacility.phone}
                </a>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${selectedFacility.lat},${selectedFacility.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded flex items-center gap-1 text-xs font-semibold"
                  title="فتح مسار الملاحة"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>المسار</span>
                </a>
              </div>
            </div>
          )}

        </div>

        {/* Right Side: Proximity Facilities List (4 Columns) */}
        <div className="lg:col-span-4 p-4 sm:p-5 bg-stone-50/50 border-t lg:border-t-0 lg:border-r border-stone-200 flex flex-col justify-between max-h-[520px] overflow-y-auto">
          
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <span className="text-xs font-bold text-stone-900">
                المراكز المرتبة حسب الأقرب لمزرعتك ({facilitiesWithDistance.length}):
              </span>
              <span className="text-[11px] text-emerald-800 font-semibold">حساب المسافة المباشرة</span>
            </div>

            {facilitiesWithDistance.length === 0 ? (
              <div className="text-center py-8 text-stone-400 text-xs">
                لا توجد مرافق ضمن نطاق المسافة المحدد ({maxDistanceKm} كم). وسّع نطاق المسافة من الأعلى.
              </div>
            ) : (
              <div className="space-y-2.5">
                {facilitiesWithDistance.map((fac) => {
                  const isSelected = selectedFacility?.id === fac.id;
                  return (
                    <div
                      key={fac.id}
                      onClick={() => setSelectedFacility(fac)}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-emerald-50/90 border-emerald-400 shadow-xs'
                          : 'bg-white border-stone-200 hover:border-emerald-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <span className="text-[10px] font-bold text-emerald-900">{fac.typeName}</span>
                        <span className="font-extrabold text-emerald-800 tabular-nums text-xs">
                          {fac.distanceKm} كم
                        </span>
                      </div>

                      <h5 className="font-bold text-stone-900 line-clamp-1">{fac.name}</h5>
                      <p className="text-[11px] text-stone-500 mt-0.5 line-clamp-1">{fac.city} · {fac.address}</p>

                      <div className="mt-2 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px]">
                        <span className="text-stone-600 font-medium">{fac.phone}</span>
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${fac.lat},${fac.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1 text-emerald-800 hover:underline font-semibold"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>خريطة جوجل</span>
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-stone-200 text-[11px] text-stone-400 text-center">
            تُحسب المسافات تلقائياً بمعادلة Haversine الجغرافية استناداً لإحداثيات المزرعة.
          </div>

        </div>

      </div>

    </div>
  );
};
