import React from 'react';
import { ShoppingBag, Bell, CloudRain, Sparkles, FileCheck } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenAiConsultant: () => void;
  onOpenPriceAlerts: () => void;
  onOpenSpecialistRegistration?: () => void;
  activeAlertsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  cartCount,
  onOpenCart,
  onOpenAiConsultant,
  onOpenPriceAlerts,
  onOpenSpecialistRegistration,
  activeAlertsCount
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => setActiveTab('overview')}
          className="text-xl font-extrabold tracking-tight text-emerald-900 whitespace-nowrap shrink-0 text-right hover:text-emerald-800 transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <span>ثِمَار.تِك</span>
        </button>

        {/* Zone 2: 5 clean single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-stone-600">
          <button
            onClick={() => setActiveTab('overview')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              activeTab === 'overview'
                ? 'text-emerald-800 font-bold border-b-2 border-emerald-600 pb-0.5'
                : 'hover:text-stone-900'
            }`}
          >
            الرئيسية
          </button>
          
          <button
            onClick={() => setActiveTab('market')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              activeTab === 'market'
                ? 'text-emerald-800 font-bold border-b-2 border-emerald-600 pb-0.5'
                : 'hover:text-stone-900'
            }`}
          >
            سوق المنتجات والمحاصيل
          </button>

          <button
            onClick={() => setActiveTab('directory')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              activeTab === 'directory'
                ? 'text-emerald-800 font-bold border-b-2 border-emerald-600 pb-0.5'
                : 'hover:text-stone-900'
            }`}
          >
            دليل العيادات
          </button>

          <button
            onClick={() => setActiveTab('map')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              activeTab === 'map'
                ? 'text-emerald-800 font-bold border-b-2 border-emerald-600 pb-0.5'
                : 'hover:text-stone-900'
            }`}
          >
            الخريطة التفاعلية
          </button>

          <button
            onClick={() => setActiveTab('diary')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              activeTab === 'diary'
                ? 'text-emerald-800 font-bold border-b-2 border-emerald-600 pb-0.5'
                : 'hover:text-stone-900'
            }`}
          >
            مفكرة المزارع
          </button>

          <button
            onClick={() => setActiveTab('articles')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              activeTab === 'articles'
                ? 'text-emerald-800 font-bold border-b-2 border-emerald-600 pb-0.5'
                : 'hover:text-stone-900'
            }`}
          >
            المقالات العلمية
          </button>

          <button
            onClick={() => setActiveTab('engineering')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              activeTab === 'engineering'
                ? 'text-emerald-800 font-bold border-b-2 border-emerald-600 pb-0.5'
                : 'hover:text-stone-900'
            }`}
          >
            حاسبات الهندسة
          </button>

          <button
            onClick={() => setActiveTab('weather')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              activeTab === 'weather'
                ? 'text-emerald-800 font-bold border-b-2 border-emerald-600 pb-0.5'
                : 'hover:text-stone-900'
            }`}
          >
            تنبيهات الأمطار
          </button>
        </nav>

        {/* Zone 3: 1 primary action cluster */}
        <div className="flex items-center gap-2.5 shrink-0">
          
          {/* Specialist & Discipline Registration Button */}
          {onOpenSpecialistRegistration && (
            <button
              onClick={onOpenSpecialistRegistration}
              title="نماذج التسجيل المتوافقة مع الاختصاصات"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-950 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-colors cursor-pointer whitespace-nowrap shadow-2xs"
            >
              <FileCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>تسجيل اختصاص</span>
            </button>
          )}

          {/* Price Alerts Button */}
          <button
            onClick={onOpenPriceAlerts}
            title="تنبيهات الأسعار"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
          >
            <Bell className="w-3.5 h-3.5 text-stone-600" />
            <span className="hidden sm:inline">تنبيهات الأسعار</span>
            {activeAlertsCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-emerald-700 text-white text-[10px] flex items-center justify-center tabular-nums">
                {activeAlertsCount}
              </span>
            )}
          </button>

          {/* Cart Button */}
          <button
            onClick={onOpenCart}
            aria-label="سلة المشتريات"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-950 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-emerald-700" />
            <span>السلة</span>
            {cartCount > 0 && (
              <span className="bg-emerald-700 text-white text-[11px] font-bold rounded-full w-5 h-5 flex items-center justify-center tabular-nums">
                {cartCount}
              </span>
            )}
          </button>

          {/* AI Consultant */}
          <button
            onClick={onOpenAiConsultant}
            className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-colors whitespace-nowrap cursor-pointer shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>المستشار الذكي</span>
          </button>
        </div>

      </div>

      {/* Mobile Submenu Strip */}
      <div className="lg:hidden flex items-center gap-2 overflow-x-auto px-4 py-2 border-t border-stone-200 bg-stone-50 text-xs scrollbar-none">
        {[
          { id: 'overview', label: 'الرئيسية' },
          { id: 'market', label: 'سوق المنتجات' },
          { id: 'map', label: 'الخريطة التفاعلية' },
          { id: 'directory', label: 'دليل العيادات' },
          { id: 'diary', label: 'مفكرة المزارع' },
          { id: 'articles', label: 'المقالات' },
          { id: 'engineering', label: 'حاسبات الري' },
          { id: 'weather', label: 'تنبيهات الأمطار' },
          { id: 'rates', label: 'بورصة الأسعار' }
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`px-2.5 py-1 rounded-md whitespace-nowrap font-medium cursor-pointer ${
              activeTab === item.id ? 'bg-emerald-800 text-white font-bold' : 'text-stone-700 hover:bg-stone-200'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
