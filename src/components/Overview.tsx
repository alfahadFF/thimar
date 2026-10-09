import React from 'react';
import { 
  MarketItem, 
  Specialist, 
  MarketRate, 
  CategoryId, 
  ClinicDirectoryItem, 
  ScientificArticle, 
  WeatherAlert,
  FarmerDiaryTask
} from '../types';
import { 
  Sprout, 
  Trees, 
  Fish, 
  Sun, 
  ShieldCheck, 
  Stethoscope, 
  Droplet, 
  ArrowLeft, 
  TrendingUp,
  MapPin,
  Star,
  CheckCircle2,
  Building2,
  BookOpen,
  CloudRain,
  Bell,
  Package,
  Calendar,
  Compass,
  CheckSquare,
  Square,
  Navigation
} from 'lucide-react';

interface OverviewProps {
  products: MarketItem[];
  specialists: Specialist[];
  rates: MarketRate[];
  directory: ClinicDirectoryItem[];
  articles: ScientificArticle[];
  weatherAlerts: WeatherAlert[];
  diaryTasks?: FarmerDiaryTask[];
  onToggleDiaryTask?: (id: string) => void;
  onNavigateTab: (tab: string, category?: CategoryId) => void;
  onOpenProductDetail: (product: MarketItem) => void;
  onAddToCart: (product: MarketItem) => void;
  onOpenAiConsultant: () => void;
  onOpenPriceAlerts: () => void;
}

export const Overview: React.FC<OverviewProps> = ({
  products,
  specialists,
  rates,
  directory,
  articles,
  weatherAlerts,
  diaryTasks = [],
  onToggleDiaryTask,
  onNavigateTab,
  onOpenProductDetail,
  onAddToCart,
  onOpenAiConsultant,
  onOpenPriceAlerts
}) => {
  const featuredProducts = products.filter(p => p.featured).slice(0, 6);
  const topClinics = directory.slice(0, 3);
  const topArticles = articles.slice(0, 3);
  const activeWeather = weatherAlerts[0];
  const pendingDiaryTasks = diaryTasks.filter(t => !t.completed).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* 1. Quick Weather Emergency Banner if any active */}
      {activeWeather && (
        <div className="bg-gradient-to-r from-blue-950 via-stone-900 to-blue-900 text-white rounded-2xl p-5 border border-blue-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/20 border border-blue-400/30 text-blue-300 shrink-0">
              <CloudRain className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs text-blue-200">
                <span className="font-bold">تنبيه طقس زراعي نشط:</span>
                <span>{activeWeather.region}</span>
                <span>·</span>
                <span>{activeWeather.period}</span>
              </div>
              <h4 className="text-sm font-bold text-white mt-0.5">{activeWeather.title}</h4>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onNavigateTab('weather')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              عرض الإرشادات الزراعية للحالة
            </button>
          </div>
        </div>
      )}

      {/* 2. Quick Sector Navigators */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-stone-900 tracking-tight">قطاعات منصة ثمار.تك الرئيسية</h2>
            <p className="text-xs text-stone-500 mt-0.5">وصول سريع لكافة خدمات الزراعة والمواشي الحلال والاستزراع والمختبرات</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {[
            { id: 'crops', label: 'محاصيل وتمور', icon: Package, count: 'بيع مباشر', color: 'bg-amber-50 text-amber-900 border-amber-200', tab: 'market' },
            { id: 'seeds', label: 'بذور وتقاوي', icon: Sprout, count: 'معتمدة ومفحوصة', color: 'bg-emerald-50 text-emerald-800 border-emerald-200', tab: 'market' },
            { id: 'livestock', label: 'مواشي حلال', icon: ShieldCheck, count: 'سلالات نقية', color: 'bg-orange-50 text-orange-900 border-orange-200', tab: 'market' },
            { id: 'aquaculture', label: 'مزارع أسماك', icon: Fish, count: 'زريعة وأعلاف', color: 'bg-cyan-50 text-cyan-900 border-cyan-200', tab: 'market' },
            { id: 'map', label: 'الخريطة التفاعلية', icon: Compass, count: 'حسب موقعك', color: 'bg-emerald-800 text-white border-emerald-700', tab: 'map' },
            { id: 'directory', label: 'دليل العيادات', icon: Building2, count: 'بمختلف المناطق', color: 'bg-blue-50 text-blue-900 border-blue-200', tab: 'directory' },
            { id: 'diary', label: 'مفكرة المزارع', icon: Calendar, count: 'مهام وجدول ري', color: 'bg-stone-800 text-white border-stone-700', tab: 'diary' },
            { id: 'articles', label: 'المقالات العلمية', icon: BookOpen, count: 'أدلة إرشادية', color: 'bg-stone-100 text-stone-900 border-stone-200', tab: 'articles' },
          ].map((sec) => {
            const Icon = sec.icon;
            return (
              <button
                key={sec.id}
                onClick={() => {
                  if (sec.tab === 'market') {
                    onNavigateTab('market', sec.id as CategoryId);
                  } else {
                    onNavigateTab(sec.tab);
                  }
                }}
                className={`p-3 sm:p-4 rounded-xl border text-right transition-all hover:shadow-xs hover:scale-[1.01] cursor-pointer ${sec.color} flex flex-col justify-between`}
              >
                <Icon className="w-5 h-5 mb-2" />
                <div>
                  <div className="font-bold text-xs">{sec.label}</div>
                  <div className="text-[11px] opacity-80">{sec.count}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Featured Market Products */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-stone-200 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 mb-0.5">
              <span>سوق ثمار.تك المباشر</span>
              <span aria-hidden="true">·</span>
              <span>عروض المزارعين والمربين والمشاتل</span>
            </div>
            <h3 className="text-xl font-bold text-stone-900 tracking-tight">
              أبرز المحاصيل والمدخلات والمواشي المتاحة حالياً
            </h3>
          </div>

          <button
            onClick={() => onNavigateTab('market')}
            className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-900 cursor-pointer"
          >
            <span>دخول السوق كاملاً</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-stone-200 rounded-xl overflow-hidden hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="p-4 bg-stone-900 text-white flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-emerald-400 font-semibold block">{item.categoryName}</span>
                    <span className="text-xs text-stone-300">{item.subcategory}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-white tabular-nums">{item.price.toLocaleString()}</span>
                    <span className="text-xs text-emerald-300 mr-1">{item.currency}</span>
                  </div>
                </div>

                <div className="p-4 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs text-stone-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-stone-400" />
                      {item.location}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1 text-amber-600 font-semibold tabular-nums">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      {item.rating}
                    </span>
                  </div>

                  <h4 
                    onClick={() => onOpenProductDetail(item)}
                    className="text-sm font-bold text-stone-900 hover:text-emerald-800 transition-colors cursor-pointer line-clamp-1"
                  >
                    {item.title}
                  </h4>

                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                <button
                  onClick={() => onOpenProductDetail(item)}
                  className="py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg cursor-pointer transition-colors"
                >
                  معاينة المواصفات
                </button>
                <button
                  onClick={() => onAddToCart(item)}
                  className="py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg cursor-pointer transition-colors"
                >
                  أضف للسلة
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Clinics Directory Highlight */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 mb-1">
              <Building2 className="w-4 h-4 text-emerald-700" />
              <span>دليل المرافق الطبية والمخبرية بمختلف المناطق</span>
            </div>
            <h3 className="text-xl font-bold text-stone-900 tracking-tight">
              عيادات بيطرية ومختبرات زراعية موثوقة بالقرب منك
            </h3>
          </div>

          <button
            onClick={() => onNavigateTab('directory')}
            className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-900 cursor-pointer self-start sm:self-auto"
          >
            <span>استعراض الدليل الكامل</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topClinics.map((clinic) => (
            <div key={clinic.id} className="p-4 bg-stone-50 rounded-xl border border-stone-200 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-emerald-900">{clinic.typeName}</span>
                  <span className="text-stone-500">{clinic.region}</span>
                </div>
                <h4 className="text-sm font-bold text-stone-900">{clinic.name}</h4>
                <p className="text-xs text-stone-500 line-clamp-1">{clinic.address}</p>
                <div className="text-[11px] text-stone-600 bg-white p-2 rounded border border-stone-100">
                  {clinic.workingHours}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-200 flex items-center justify-between text-xs">
                <a href={`tel:${clinic.phone}`} className="font-bold text-emerald-800 hover:underline">
                  اتصال: {clinic.phone}
                </a>
                <button
                  onClick={() => onNavigateTab('directory')}
                  className="px-3 py-1 bg-emerald-800 text-white rounded text-[11px] font-semibold"
                >
                  التفاصيل
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4.5. Interactive Proximity Map Spotlight */}
      <div className="bg-gradient-to-br from-slate-950 via-stone-900 to-emerald-950 text-white rounded-2xl p-6 sm:p-8 border border-emerald-900/60 shadow-md relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px]" 
          aria-hidden="true" 
        />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-400/30 rounded-full text-xs font-bold text-emerald-300">
              <Compass className="w-3.5 h-3.5" />
              <span>الخريطة التفاعلية والمسافات الحقلية</span>
            </div>
            <h3 className="text-2xl font-extrabold text-white tracking-tight">
              اعثر على أقرب عيادة بيطرية ومختبر زراعي لمزرعتك
            </h3>
            <p className="text-sm text-stone-300 leading-relaxed">
              تحديد تلقائي لموقع مزرعتك عبر الـ GPS وحساب المسافة المباشرة بالكيلومتر لأقرب المراكز التخصصية، مع إمكانية الاتصال الفوري والتوجيه الملاحي المباشر.
            </p>
            <div className="flex flex-wrap gap-4 pt-1 text-xs text-stone-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                عيادات بيطرية للمواشي
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                مختبرات فحص مياه وتربة
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                عيادات وقاية نباتية
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <button
              onClick={() => onNavigateTab('map')}
              className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Navigation className="w-4 h-4" />
              <span>فتح الخريطة التفاعلية لموقعي</span>
            </button>
            <button
              onClick={() => onNavigateTab('directory')}
              className="px-6 py-3 bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-200 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Building2 className="w-4 h-4 text-emerald-400" />
              <span>استعراض كافة العيادات ({directory.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4.6. Farmer Diary Daily Chores Spotlight */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 mb-1">
              <Calendar className="w-4 h-4 text-emerald-700" />
              <span>مفكرة المزارع والمربي الميدانية</span>
            </div>
            <h3 className="text-xl font-bold text-stone-900 tracking-tight">
              جدول المهام الحقلية اليومية (ري، تسميد، تحصين)
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              متابعة مباشرة لعمليات المزرعة والحظائر وأحواض الأسماك لليوم الحالي
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('diary')}
            className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-900 cursor-pointer self-start sm:self-auto"
          >
            <span>فتح المفكرة الكاملة والسجلات</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

        {pendingDiaryTasks.length === 0 ? (
          <div className="p-8 text-center bg-stone-50 rounded-xl border border-dashed border-stone-300">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <p className="text-sm font-bold text-stone-800">أحسنت! لا توجد مهام حقلية معلقة لليوم</p>
            <button
              onClick={() => onNavigateTab('diary')}
              className="mt-3 px-4 py-2 bg-emerald-800 text-white rounded-lg text-xs font-semibold"
            >
              إضافة عملية ري أو تسميد جديدة
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {pendingDiaryTasks.map((task) => (
              <div
                key={task.id}
                onClick={() => onToggleDiaryTask && onToggleDiaryTask(task.id)}
                className="p-4 rounded-xl border border-stone-200 hover:border-emerald-300 bg-stone-50/50 hover:bg-stone-50 transition-all cursor-pointer flex items-start gap-3"
              >
                <button
                  type="button"
                  aria-label="تحديد المهمة كمكتملة"
                  className="mt-0.5 text-stone-400 hover:text-emerald-700 shrink-0"
                >
                  <Square className="w-5 h-5" />
                </button>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-emerald-900">
                      {task.sector === 'crops' ? 'محاصيل ونخيل' : task.sector === 'livestock' ? 'مواشي وأنعام' : task.sector === 'aquaculture' ? 'استزراع سمكي' : 'هندسة وري'}
                    </span>
                    <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {task.timeSlot || 'اليوم'}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-stone-900">{task.title}</h4>
                  <p className="text-[11px] text-stone-500 line-clamp-1">{task.targetName}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. Scientific Articles Spotlight */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-stone-200 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 mb-0.5">
              <BookOpen className="w-4 h-4 text-emerald-700" />
              <span>المقالات والأدلة الإرشادية</span>
            </div>
            <h3 className="text-xl font-bold text-stone-900 tracking-tight">
              أحدث المقالات العلمية والممارسات الحقلية
            </h3>
          </div>

          <button
            onClick={() => onNavigateTab('articles')}
            className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-900 cursor-pointer"
          >
            <span>تصفح كافة المقالات</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topArticles.map((art) => (
            <div
              key={art.id}
              onClick={() => onNavigateTab('articles')}
              className="bg-white border border-stone-200 rounded-xl p-5 hover:border-emerald-300 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="text-[11px] font-semibold text-emerald-800">{art.categoryName}</div>
                <h4 className="text-sm font-bold text-stone-900 line-clamp-2 leading-snug">{art.title}</h4>
                <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">{art.summary}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                <span>{art.authorName}</span>
                <span>قراءة {art.readTimeMinutes} د</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Live Market Rates and Price Alerts */}
      <div className="bg-stone-900 text-white rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
              <TrendingUp className="w-4 h-4" />
              <span>بورصة وتنبيهات الأسعار اليومية</span>
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              مؤشرات الأسعار اللحظية للمحاصيل والمواشي والأسماك
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenPriceAlerts}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>ضبط تنبيهات الأسعار لمزرعتك</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {rates.slice(0, 4).map((rate) => (
            <div key={rate.id} className="p-3.5 bg-stone-800/90 rounded-xl border border-stone-700 text-xs">
              <span className="text-stone-400 block truncate text-[11px]">{rate.name}</span>
              <div className="font-bold text-white text-sm tabular-nums mt-1">
                {rate.currentPrice} <span className="text-[10px] font-normal text-stone-400">{rate.unit}</span>
              </div>
              <div className={`text-[10px] font-semibold mt-1 ${rate.changePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {rate.changePercent >= 0 ? `+${rate.changePercent}%` : `${rate.changePercent}%`}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
