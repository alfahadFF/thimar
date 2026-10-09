import React from 'react';
import { ShieldCheck, Phone, Mail, MapPin } from 'lucide-react';
import { CategoryId } from '../types';

interface FooterProps {
  onNavigateTab: (tab: string, category?: CategoryId) => void;
  onOpenAiConsultant: () => void;
  onOpenPriceAlerts: () => void;
}

export const Footer: React.FC<FooterProps> = ({ 
  onNavigateTab, 
  onOpenAiConsultant,
  onOpenPriceAlerts 
}) => {
  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand & Mission */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-white tracking-tight">ثِمَار.تِك</h3>
            <p className="text-stone-400 leading-relaxed text-xs">
              المنصة المتكاملة الرائدة في الهندسة الزراعية وتجارة المحاصيل والبذور والأشتال، دليل العيادات والمختبرات المعتمدة، الثروة الحيوانية الحلال، والاستزراع السمكي، مع تنبيهات الأسعار والطقس.
            </p>
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold pt-1">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>ثروة حيوانية حلال 100% وخالية تماماً من الخنازير</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2.5">
            <h4 className="text-sm font-bold text-white">سوق المنتجات والتجارة</h4>
            <ul className="space-y-1.5 text-stone-400">
              <li>
                <button onClick={() => onNavigateTab('market', 'crops')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  محاصيل زراعية وتمور
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('market', 'seeds')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  بذور وتقاوي معتمدة
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('market', 'seedlings')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  أشتال ونخيل وبساتين
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('market', 'livestock')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  أغنام وأبقار وإبل حلال
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('market', 'aquaculture')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  مفرخات وأسماك وأعلاف
                </button>
              </li>
            </ul>
          </div>

          {/* Directory & Articles */}
          <div className="space-y-2.5">
            <h4 className="text-sm font-bold text-white">الخدمات والأدلة والمعرفة</h4>
            <ul className="space-y-1.5 text-stone-400">
              <li>
                <button onClick={() => onNavigateTab('directory')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  دليل العيادات والمختبرات الزراعية
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('articles')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  المقالات العلمية والإرشادية
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('engineering')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  حاسبات شبكات الري والتسميد
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('weather')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  تنبيهات الأمطار والطقس الزراعي
                </button>
              </li>
              <li>
                <button onClick={onOpenPriceAlerts} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  تنبيهات أسعار السلع الحية
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-2.5">
            <h4 className="text-sm font-bold text-white">التواصل والدعم الفني</h4>
            <div className="space-y-2 text-stone-400">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span className="tabular-nums font-mono">+966 800 124 9900</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <span>support@thimar.tech</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>المملكة العربية السعودية والخليج العربي</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 border-t border-stone-800 text-stone-500 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-[11px]">
          <div>
            جميع الحقوق محفوظة © {new Date().getFullYear()} منصة ثِمَار.تِك للحلول الزراعية والبيطرية والهندسة الحديثة.
          </div>
          <div className="flex items-center gap-4">
            <span>الالتزام الصارم بالثروة الحيوانية الحلال</span>
            <span>·</span>
            <span>معايير الهيئة العامة للغذاء والدواء والزراعة</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
