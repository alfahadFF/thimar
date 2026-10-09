import React, { useState, useMemo } from 'react';
import { 
  MarketItem, 
  CategoryId 
} from '../types';
import { 
  Search, 
  PlusCircle, 
  Check, 
  Sprout, 
  Trees, 
  Fish, 
  Sun, 
  Leaf, 
  Layers,
  MapPin,
  Phone,
  ShieldCheck,
  Star,
  Package,
  SlidersHorizontal,
  RotateCcw
} from 'lucide-react';

interface MarketplaceProps {
  products: MarketItem[];
  onAddToCart: (product: MarketItem) => void;
  onOpenProductDetail: (product: MarketItem) => void;
  onOpenAddProduct: () => void;
  selectedCategory: CategoryId;
  setSelectedCategory: (cat: CategoryId) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

const CATEGORIES: { id: CategoryId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'all', label: 'جميع الأقسام', icon: Layers },
  { id: 'crops', label: 'محاصيل زراعية وتمور', icon: Package },
  { id: 'seeds', label: 'بذور وتقاوي', icon: Sprout },
  { id: 'seedlings', label: 'أشتال ونخيل وبساتين', icon: Trees },
  { id: 'livestock', label: 'مواشي وأنعام حلال', icon: ShieldCheck },
  { id: 'aquaculture', label: 'استزراع سمكي ومفرخات', icon: Fish },
  { id: 'engineering', label: 'هندسة زراعية ومعدات', icon: Sun },
  { id: 'fertilizers_protection', label: 'أسمدة ومبيدات معتمدة', icon: Leaf },
];

const REGIONS = ['الكل', 'مصر', 'الأردن', 'السعودية', 'المغرب', 'العراق', 'السودان', 'تونس', 'سلطنة عمان', 'لبنان'];

export const Marketplace: React.FC<MarketplaceProps> = ({
  products,
  onAddToCart,
  onOpenProductDetail,
  onOpenAddProduct,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
}) => {
  const [selectedRegion, setSelectedRegion] = useState<string>('الكل');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [sellerTypeFilter, setSellerTypeFilter] = useState<'all' | 'farmer' | 'breeder' | 'nursery' | 'vendor'>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price_asc' | 'price_desc' | 'rating'>('featured');
  const [addedIds, setAddedIds] = useState<{ [key: string]: boolean }>({});
  const [showFiltersBar, setShowFiltersBar] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
      const matchRegion = selectedRegion === 'الكل' || item.region === selectedRegion || item.location.includes(selectedRegion);
      const matchSeller = sellerTypeFilter === 'all' || item.sellerType === sellerTypeFilter;
      
      const min = minPrice !== '' ? Number(minPrice) : 0;
      const max = maxPrice !== '' ? Number(maxPrice) : Infinity;
      const matchPrice = item.price >= min && item.price <= max;

      const matchSearch = searchQuery.trim() === '' || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subcategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sellerName.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCat && matchRegion && matchSeller && matchPrice && matchSearch;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [products, selectedCategory, selectedRegion, sellerTypeFilter, minPrice, maxPrice, searchQuery, sortBy]);

  const handleQuickAdd = (product: MarketItem) => {
    onAddToCart(product);
    setAddedIds(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds(prev => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  const getProductVisualTheme = (cat: CategoryId) => {
    switch(cat) {
      case 'crops':
        return { bg: 'from-amber-950 to-emerald-950', accent: 'text-amber-300', tag: 'محاصيل وتمور' };
      case 'seeds':
        return { bg: 'from-amber-900 to-emerald-900', accent: 'text-amber-300', tag: 'تقاوي وبذور' };
      case 'seedlings':
        return { bg: 'from-emerald-900 to-teal-900', accent: 'text-emerald-300', tag: 'مشاتل وبساتين' };
      case 'livestock':
        return { bg: 'from-stone-900 to-amber-950', accent: 'text-amber-200', tag: 'أنعام ومواشي حلال' };
      case 'aquaculture':
        return { bg: 'from-cyan-950 to-blue-900', accent: 'text-cyan-300', tag: 'مزارع سمكية' };
      case 'engineering':
        return { bg: 'from-slate-900 to-emerald-950', accent: 'text-emerald-400', tag: 'معدات وهندسة' };
      case 'fertilizers_protection':
        return { bg: 'from-lime-950 to-emerald-950', accent: 'text-lime-300', tag: 'تغذية ووقاية' };
      default:
        return { bg: 'from-stone-900 to-emerald-950', accent: 'text-emerald-300', tag: 'مدخلات زراعية' };
    }
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedRegion('الكل');
    setSellerTypeFilter('all');
    setMinPrice('');
    setMaxPrice('');
    setSearchQuery('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Section Header & Vendor Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 mb-1">
            <span>سوق ثمار.تك للتجارة المباشرة بين المزارعين والتجار</span>
            <span aria-hidden="true">·</span>
            <span>محاصيل · بذور · أشتال · مواشي حلال · أسماك</span>
          </div>
          <h2 className="text-2xl font-bold text-stone-900 tracking-tight">
            سوق المنتجات والمدخلات الزراعية والحيوانية
          </h2>
          <p className="text-stone-600 text-xs mt-1">
            اشترِ مباشرة من المزارع أو اعرض محاصيلك وبذورك ومواشيك وأسماكك للبيع بأسعار عادلة وتواصل فوري.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenAddProduct}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>عرض منتجاتي للبيع في السوق</span>
          </button>
        </div>
      </div>

      {/* Primary Category Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
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

      {/* Comprehensive Filter and Search Bar */}
      <div className="bg-stone-100/80 p-4 rounded-xl border border-stone-200 space-y-3">
        
        {/* Main Row: Search, Region, Sort, and Advanced Toggle */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          
          {/* Search box */}
          <div className="sm:col-span-5 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن محصول، بذور، شتلات، مواشي، أو اسم المزرعة..."
              className="w-full pl-8 pr-3 py-2 bg-white border border-stone-300 rounded-lg text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>

          {/* Region selector */}
          <div className="sm:col-span-3">
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs text-stone-700 focus:outline-none focus:ring-1 focus:ring-emerald-600 cursor-pointer"
            >
              <option value="الكل">كافة المناطق (المملكة والخليج)</option>
              {REGIONS.filter(r => r !== 'الكل').map(r => (
                <option key={r} value={r}>منطقة {r}</option>
              ))}
            </select>
          </div>

          {/* Sort selector */}
          <div className="sm:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs text-stone-700 focus:outline-none focus:ring-1 focus:ring-emerald-600 cursor-pointer"
            >
              <option value="featured">المميز أولاً</option>
              <option value="price_asc">السعر: من الأقل</option>
              <option value="price_desc">السعر: من الأعلى</option>
              <option value="rating">الأعلى تقييماً</option>
            </select>
          </div>

          {/* Advanced toggle */}
          <div className="sm:col-span-2 flex items-center gap-2">
            <button
              onClick={() => setShowFiltersBar(!showFiltersBar)}
              className={`w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold cursor-pointer border transition-colors ${
                showFiltersBar ? 'bg-stone-800 text-white border-stone-800' : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>نطاق السعر والنوع</span>
            </button>
          </div>

        </div>

        {/* Expandable Price & Seller Filter Row */}
        {showFiltersBar && (
          <div className="pt-3 border-t border-stone-200/80 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center text-xs text-stone-700 animate-in fade-in duration-200">
            
            {/* Price Range */}
            <div className="sm:col-span-5 flex items-center gap-2">
              <span className="font-semibold text-stone-600 whitespace-nowrap">نطاق السعر ($):</span>
              <input
                type="number"
                placeholder="من"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-24 px-2 py-1.5 bg-white border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
              <span className="text-stone-400">-</span>
              <input
                type="number"
                placeholder="إلى"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-24 px-2 py-1.5 bg-white border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>

            {/* Seller Type Filter */}
            <div className="sm:col-span-5 flex items-center gap-2">
              <span className="font-semibold text-stone-600 whitespace-nowrap">نوع البائع:</span>
              <select
                value={sellerTypeFilter}
                onChange={(e) => setSellerTypeFilter(e.target.value as any)}
                className="px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs text-stone-700 focus:outline-none focus:ring-1 focus:ring-emerald-600 cursor-pointer"
              >
                <option value="all">كافة البائعين</option>
                <option value="farmer">مزارعون مباشرون (محاصيل وبذور)</option>
                <option value="breeder">مربو مواشي وأنعام حلال</option>
                <option value="nursery">مشاتل نخيل وأشجار معتمدة</option>
                <option value="vendor">شركات ومؤسسات زراعية</option>
              </select>
            </div>

            {/* Reset button */}
            <div className="sm:col-span-2 flex justify-end">
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1 text-xs text-stone-500 hover:text-rose-600 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>إعادة ضبط</span>
              </button>
            </div>

          </div>
        )}

      </div>

      {/* Halal Livestock Statement Banner */}
      {selectedCategory === 'livestock' && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3 text-emerald-950 text-xs leading-relaxed">
          <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">ميثاق الثروة الحيوانية الحلال المعتمد في ثمار.تك:</span> تلتزم المنصة بحصر تجارة وتداول الثروة الحيوانية بالأنواع المباحة شرعاً (الأغنام والماعز والأبقار والإبل والخيول والدواجن والطيور)، وتخلو المنصة تماماً من الخنازير أو أي مشتقات لها، مع اشتراط الفحص البيطري الرسمي لكافة الشحنات.
          </div>
        </div>
      )}

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-white border border-dashed border-stone-300 rounded-2xl p-8">
          <Leaf className="w-10 h-10 text-stone-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-stone-800 mb-1">لم يتم العثور على منتجات مطابقة لخيارات البحث والتصفية</h3>
          <p className="text-xs text-stone-500 mb-4">جرب توسيع نطاق السعر أو اختيار منطقة أخرى.</p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-emerald-800 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer"
          >
            إعادة ضبط كافة الفلاتر
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((item) => {
            const theme = getProductVisualTheme(item.category);
            const isAdded = addedIds[item.id];

            return (
              <div 
                key={item.id}
                className="group bg-white border border-stone-200 rounded-xl overflow-hidden hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Resilient Visual Banner Slot */}
                  <div className={`relative h-44 bg-gradient-to-br ${theme.bg} p-5 flex flex-col justify-between text-white overflow-hidden`}>
                    <div 
                      className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" 
                      aria-hidden="true" 
                    />
                    
                    <div className="relative z-10 flex items-center justify-between text-xs">
                      <span className={`font-semibold ${theme.accent} tracking-wide`}>
                        {item.subcategory}
                      </span>
                      {item.badge && (
                        <span className="text-[11px] font-medium text-stone-200 bg-black/40 px-2 py-0.5 rounded backdrop-blur-xs">
                          {item.badge}
                        </span>
                      )}
                    </div>

                    <div className="relative z-10 flex items-end justify-between">
                      <div>
                        <div className="text-xs text-stone-300">الكمية المتاحة</div>
                        <div className="text-lg font-bold text-white tabular-nums">
                          {item.stock} <span className="text-xs font-normal text-stone-200">{item.unit.split(' ')[0]}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xs text-stone-300">السعر</div>
                        <div className="text-2xl font-extrabold text-white tabular-nums">
                          {item.price.toLocaleString()} <span className="text-xs font-normal text-emerald-300">{item.currency}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Body Information */}
                  <div className="p-4 space-y-3">
                    
                    {/* Unboxed Metadata Line */}
                    <div className="flex items-center gap-2 text-xs text-stone-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-stone-400" />
                        {item.location}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1 text-amber-600 font-semibold tabular-nums">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        {item.rating} ({item.reviewsCount})
                      </span>
                    </div>

                    {/* Title */}
                    <h3 
                      onClick={() => onOpenProductDetail(item)}
                      className="text-base font-bold text-stone-900 hover:text-emerald-800 transition-colors cursor-pointer line-clamp-2 leading-snug"
                    >
                      {item.title}
                    </h3>

                    {/* Brief Description */}
                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Seller details */}
                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                      <span className="truncate max-w-[170px]">{item.sellerName}</span>
                      <a 
                        href={`tel:${item.sellerPhone}`}
                        className="flex items-center gap-1 text-emerald-800 hover:text-emerald-900 font-medium"
                      >
                        <Phone className="w-3 h-3" />
                        <span>اتصال</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onOpenProductDetail(item)}
                    className="w-full py-2 px-3 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
                  >
                    تفاصيل ومواصفات
                  </button>

                  <button
                    onClick={() => handleQuickAdd(item)}
                    className={`w-full py-2 px-3 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                      isAdded
                        ? 'bg-emerald-700 text-white'
                        : 'bg-emerald-800 hover:bg-emerald-900 text-white shadow-xs'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>تمت الإضافة</span>
                      </>
                    ) : (
                      <span>أضف للسلة</span>
                    )}
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
