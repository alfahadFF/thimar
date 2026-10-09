import React, { useState, useMemo } from 'react';
import { ScientificArticle } from '../types';
import { 
  BookOpen, 
  Clock, 
  Calendar, 
  Search, 
  UserCheck, 
  CheckCircle2, 
  ArrowLeft, 
  X, 
  Share2, 
  Copy, 
  Check, 
  Sprout, 
  Droplet, 
  Fish, 
  Sun, 
  ShieldAlert 
} from 'lucide-react';

interface ScientificArticlesProps {
  articles: ScientificArticle[];
}

export const ScientificArticles: React.FC<ScientificArticlesProps> = ({ articles }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [readingArticle, setReadingArticle] = useState<ScientificArticle | null>(null);
  const [copied, setCopied] = useState(false);

  const categories = [
    { id: 'all', label: 'كافة المقالات والأدلة', icon: BookOpen },
    { id: 'agri_engineering', label: 'الهندسة الزراعية والري', icon: Droplet },
    { id: 'livestock_best_practices', label: 'تربية المواشي والأنعام الحلال', icon: Sprout },
    { id: 'aquaculture', label: 'الاستزراع السمكي وجودة المياه', icon: Fish },
    { id: 'modern_farming', label: 'التقنيات والبيوت المحمية', icon: Sun },
    { id: 'pest_control', label: 'مكافحة الآفات ووقاية النبات', icon: ShieldAlert },
  ];

  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      const matchCat = selectedCategory === 'all' || art.category === selectedCategory;
      const matchSearch = searchQuery.trim() === '' ||
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [articles, selectedCategory, searchQuery]);

  const handleCopyLink = () => {
    if (!readingArticle) return;
    navigator.clipboard.writeText(`${window.location.origin}#article-${readingArticle.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="border-b border-stone-200 pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 mb-1">
          <span>المكتبة الإرشادية والمعرفية المعتمدة</span>
          <span aria-hidden="true">·</span>
          <span>هندسة زراعية · ثروة حيوانية حلال · استزراع سمكي</span>
        </div>
        <h2 className="text-2xl font-bold text-stone-900 tracking-tight">
          المقالات والأدلة العلمية الحقلية
        </h2>
        <p className="text-stone-600 text-sm mt-1 max-w-3xl">
          مقالات تطبيقية ومبسطة كُتبت بأقلام كبار المهندسين الزراعيين والأطباء البيطريين لتقديم أفضل الممارسات في الري، التسميد، إدارة قطعان الأغنام والأبقار والإبل، ومزارع الأسماك الحديثة.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-stone-100/80 p-4 rounded-xl border border-stone-200 space-y-3">
        
        {/* Category Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-white text-stone-700 hover:bg-stone-50 border border-stone-200'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-stone-500'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative pt-1 border-t border-stone-200/60 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن موضوع: ري، تسمين عواسي، أكسجين بلطي، سوسة النخيل..."
            className="w-full pl-8 pr-3 py-2 bg-white border border-stone-300 rounded-lg text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-emerald-600"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2 mt-0.5" />
        </div>

      </div>

      {/* Articles Grid */}
      {filteredArticles.length === 0 ? (
        <div className="text-center py-16 bg-white border border-dashed border-stone-300 rounded-2xl p-8">
          <BookOpen className="w-10 h-10 text-stone-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-stone-800 mb-1">لم يتم العثور على مقالات مطابقة للبحث</h3>
          <p className="text-xs text-stone-500 mb-4">جرب البحث بكلمات أخرى أو اختر قسماً علمياً آخر.</p>
          <button
            onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
            className="px-4 py-2 bg-emerald-800 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer"
          >
            إظهار كافة المقالات
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <div
              key={article.id}
              className="bg-white border border-stone-200 rounded-xl overflow-hidden hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="p-5 space-y-3">
                
                {/* Meta kicker (Zero-pill text) */}
                <div className="flex items-center gap-2 text-xs text-stone-500">
                  <span className="font-semibold text-emerald-800">{article.categoryName}</span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-stone-400" />
                    <span>قراءة {article.readTimeMinutes} دقائق</span>
                  </span>
                </div>

                {/* Article Title */}
                <h3
                  onClick={() => setReadingArticle(article)}
                  className="text-base font-bold text-stone-900 hover:text-emerald-800 transition-colors cursor-pointer leading-snug line-clamp-2"
                >
                  {article.title}
                </h3>

                {/* Summary */}
                <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                  {article.summary}
                </p>

                {/* Author Info */}
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-stone-900 block">{article.authorName}</span>
                    <span className="text-[11px] text-stone-400">{article.authorTitle}</span>
                  </div>
                  <span className="text-[11px] text-stone-400 tabular-nums">{article.publishDate}</span>
                </div>

              </div>

              {/* Bottom Action */}
              <div className="p-4 pt-0">
                <button
                  onClick={() => setReadingArticle(article)}
                  className="w-full py-2 px-3 bg-stone-50 hover:bg-emerald-50 text-emerald-900 border border-stone-200 hover:border-emerald-300 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>قراءة المقال والدليل كاملاً</span>
                  <ArrowLeft className="w-3.5 h-3.5 text-emerald-700" />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Article Reader Modal */}
      {readingArticle && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div onClick={() => setReadingArticle(null)} className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" />
          
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-stone-200">
              
              {/* Header */}
              <div className="p-6 bg-gradient-to-r from-stone-900 to-emerald-950 text-white relative">
                <button
                  onClick={() => setReadingArticle(null)}
                  className="absolute left-4 top-4 p-1.5 text-stone-400 hover:text-white rounded-lg bg-black/30 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="text-xs font-semibold text-emerald-300 mb-2">{readingArticle.categoryName}</div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug mb-3 max-w-2xl">
                  {readingArticle.title}
                </h1>

                <div className="flex flex-wrap items-center gap-3 text-xs text-stone-300">
                  <span className="font-semibold text-emerald-200">{readingArticle.authorName} ({readingArticle.authorTitle})</span>
                  <span>·</span>
                  <span className="tabular-nums">{readingArticle.publishDate}</span>
                  <span>·</span>
                  <span>زمن القراءة: {readingArticle.readTimeMinutes} دقائق</span>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto text-stone-800 leading-relaxed text-sm">
                
                {/* Executive Summary */}
                <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl text-emerald-950 text-xs leading-relaxed font-medium">
                  <span className="font-bold block mb-1">الخلاصة الإرشادية للمزارع والمربي:</span>
                  {readingArticle.summary}
                </div>

                {/* Article Content Sections */}
                {readingArticle.contentSections.map((sec, idx) => (
                  <div key={idx} className="space-y-3 pt-2">
                    <h3 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-2">
                      {sec.subtitle}
                    </h3>
                    
                    <p className="text-xs text-stone-700 leading-relaxed whitespace-pre-line">
                      {sec.body}
                    </p>

                    {sec.keyTakeaways && sec.keyTakeaways.length > 0 && (
                      <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-2 text-xs">
                        <div className="font-bold text-stone-900 text-[11px]">نقاط حرجة يجب مراعاتها ميدانياً:</div>
                        <ul className="space-y-1.5">
                          {sec.keyTakeaways.map((point, pIdx) => (
                            <li key={pIdx} className="flex items-start gap-2 text-stone-700">
                              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}

              </div>

              {/* Footer */}
              <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-700 hover:text-emerald-800 rounded-lg cursor-pointer transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>تم نسخ الرابط</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>مشاركة المقال</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setReadingArticle(null)}
                  className="px-5 py-2 bg-emerald-800 text-white rounded-lg text-xs font-bold hover:bg-emerald-900 cursor-pointer"
                >
                  إغلاق القارئ
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};
