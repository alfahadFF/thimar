import React from 'react';
import { ArrowLeft, Search, ShieldCheck, Bell, CloudRain, BookOpen, Building2, MapPin, Calendar, DollarSign, FileCheck } from 'lucide-react';

interface HeroProps {
  onExploreMarket: () => void;
  onOpenDirectory: () => void;
  onOpenMap?: () => void;
  onOpenDiary?: () => void;
  onOpenBudget?: () => void;
  onOpenSpecialistRegistration?: () => void;
  onOpenArticles: () => void;
  onOpenWeather: () => void;
  onOpenPriceAlerts: () => void;
  onOpenAiConsultant: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreMarket,
  onOpenDirectory,
  onOpenMap,
  onOpenDiary,
  onOpenBudget,
  onOpenSpecialistRegistration,
  onOpenArticles,
  onOpenWeather,
  onOpenPriceAlerts,
  onOpenAiConsultant,
  searchQuery,
  setSearchQuery,
  onSearchSubmit,
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-stone-900 via-stone-900 to-emerald-950 text-white pt-14 pb-16 px-4 sm:px-6 lg:px-8 border-b border-stone-800">
      {/* Organic pattern overlay */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px]" 
        aria-hidden="true" 
      />

      <div className="relative max-w-5xl mx-auto text-center space-y-7">
        
        {/* Editorial kicker */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-semibold text-emerald-300">
          <span>منظومة ثِمَار.تِك الزراعية والبيطرية</span>
          <span aria-hidden="true">·</span>
          <span>دليل العيادات والمختبرات</span>
          <span aria-hidden="true">·</span>
          <span>تنبيهات الأسعار والأمطار</span>
          <span aria-hidden="true">·</span>
          <span>ثروة حيوانية حلال واستزراع سمكي</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight max-w-4xl mx-auto" style={{ textWrap: 'balance' }}>
          كل ما يحتاجه المزارع والمربي والمهندس الزراعي في منصة واحدة موثوقة
        </h1>

        {/* Hero Subtitle */}
        <p className="text-sm sm:text-base text-stone-300 max-w-3xl mx-auto leading-relaxed">
          سوق شامل لتجارة المحاصيل والبذور والأشتال ومستلزمات المواشي والأسماك، دليل كامل للعيادات البيطرية والزراعية ومختبرات التحليل بمختلف المناطق، مكتبة مقالات إرشادية علمية، وتنبيهات فورية لأسعار السلع والأحوال الجوية.
        </p>

        {/* Search Bar */}
        <form onSubmit={onSearchSubmit} className="max-w-2xl mx-auto relative flex items-center mt-4">
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن محاصيل، بذور، أشتال، عيادة بيطرية، مختبر مياه، أو استشارة..."
              className="w-full pl-28 pr-12 py-3.5 bg-stone-800/90 border border-stone-700 rounded-xl text-stone-100 placeholder-stone-400 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
            <Search className="w-4 h-4 text-stone-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <button
              type="submit"
              className="absolute left-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              بحث في السوق
            </button>
          </div>
        </form>

        {/* Action Buttons Row */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
          <button
            onClick={onExploreMarket}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-sm"
          >
            <span>سوق المنتجات والمحاصيل</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>

          {onOpenBudget && (
            <button
              onClick={onOpenBudget}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-900/90 hover:bg-emerald-800 border border-emerald-500/70 text-emerald-200 text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              <DollarSign className="w-3.5 h-3.5 text-emerald-300" />
              <span>ميزانية المحاصيل والمواسم ($)</span>
            </button>
          )}

          {onOpenSpecialistRegistration && (
            <button
              onClick={onOpenSpecialistRegistration}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-stone-800 hover:bg-stone-700 border border-emerald-700/80 text-emerald-300 text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>تسجيل الاختصاصات</span>
            </button>
          )}

          {onOpenMap && (
            <button
              onClick={onOpenMap}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-800/90 hover:bg-emerald-700 border border-emerald-600/80 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-300" />
              <span>الخريطة التفاعلية للعيادات</span>
            </button>
          )}

          {onOpenDiary && (
            <button
              onClick={onOpenDiary}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-200 text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <span>مفكرة المزارع اليومية</span>
            </button>
          )}

          <button
            onClick={onOpenDirectory}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-200 text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            <Building2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>دليل العيادات والمختبرات</span>
          </button>

          <button
            onClick={onOpenArticles}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-200 text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span>المقالات العلمية</span>
          </button>

          <button
            onClick={onOpenWeather}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-950/80 hover:bg-blue-900 border border-blue-700/60 text-blue-200 text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            <CloudRain className="w-3.5 h-3.5 text-blue-400" />
            <span>تنبيهات الأمطار والطقس</span>
          </button>

          <button
            onClick={onOpenPriceAlerts}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-amber-950/80 hover:bg-amber-900 border border-amber-700/60 text-amber-200 text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            <Bell className="w-3.5 h-3.5 text-amber-400" />
            <span>تنبيهات الأسعار</span>
          </button>
        </div>

        {/* Trust Badges Strip */}
        <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-stone-800/80 text-stone-400 text-xs">
          <div className="flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>ثروة حيوانية حلال 100%</span>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <span className="font-bold text-white tabular-nums">28+</span>
            <span>عيادة ومختبر معتمد بالدليل</span>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <span className="font-bold text-white tabular-nums">100%</span>
            <span>فحص بيطري وهندسي موثق</span>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <span className="font-bold text-white tabular-nums">لحظي</span>
            <span>تنبيهات للأمطار والأسعار</span>
          </div>
        </div>

      </div>
    </section>
  );
};
