import React, { useState } from 'react';
import { MarketItem, CategoryId } from '../types';
import { X, ShieldCheck } from 'lucide-react';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (newItem: MarketItem) => void;
}

const REGIONS = ['مصر', 'الأردن', 'السعودية', 'المغرب', 'العراق', 'السودان', 'تونس', 'سلطنة عمان', 'لبنان'];

export const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onAddProduct
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CategoryId>('crops');
  const [subcategory, setSubcategory] = useState('');
  const [sellerType, setSellerType] = useState<'farmer' | 'breeder' | 'nursery' | 'vendor'>('farmer');
  const [region, setRegion] = useState('مصر');
  const [city, setCity] = useState('القاهرة والدلتا');
  const [price, setPrice] = useState<number>(25);
  const [unit, setUnit] = useState('كجم');
  const [stock, setStock] = useState<number>(100);
  const [sellerName, setSellerName] = useState('');
  const [sellerPhone, setSellerPhone] = useState('');
  const [description, setDescription] = useState('');
  const [halalPledge, setHalalPledge] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !sellerName || !sellerPhone) return;

    if (category === 'livestock' && !halalPledge) {
      alert('يجب الموافقة على ميثاق الثروة الحيوانية الحلال لعرض المواشي.');
      return;
    }

    const newItem: MarketItem = {
      id: `prod-${Date.now()}`,
      title,
      category,
      categoryName: category === 'crops' ? 'محاصيل زراعية' : category === 'seeds' ? 'بذور وتقاوي' : category === 'seedlings' ? 'أشتال ونباتات' : category === 'livestock' ? 'مواشي وأنعام حلال' : category === 'aquaculture' ? 'استزراع سمكي ومفرخات' : category === 'engineering' ? 'هندسة زراعية ومعدات' : 'أسمدة ومبيدات معتمدة',
      subcategory: subcategory || 'منتج زراعي وحيواني مباشر',
      price,
      currency: '$',
      unit,
      stock,
      location: `${region} - ${city}`,
      region,
      sellerName,
      sellerPhone,
      sellerType,
      rating: 5.0,
      reviewsCount: 1,
      badge: 'عرض جديد موثق',
      description: description || 'منتج زراعي عالي الجودة متوفر للطلب المباشر من صاحب المزرعة أو المنشأة.',
      specs: {
        'المنطقة': region,
        'المدينة': city,
        'نوع البائع': sellerType === 'farmer' ? 'مزارع مباشر' : sellerType === 'breeder' ? 'مربي مواشي معتمد' : sellerType === 'nursery' ? 'مشتل معتمد' : 'مؤسسة زراعية',
        'الحالة': 'طازج وجاهز للتسليم'
      },
      isHalalLivestock: category === 'livestock',
      featured: true,
      iconName: 'Package'
    };

    onAddProduct(newItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" 
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-stone-200">
          
          <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
            <div>
              <h2 className="text-base font-bold text-stone-900">عرض منتجاتك في سوق ثمار.تك</h2>
              <p className="text-xs text-stone-500 mt-0.5">اعرض محاصيلك، بذورك، أشتالك، مواشيك، أو أسماكك للبيع المباشر</p>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-stone-400 hover:text-stone-700 rounded-lg cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">عنوان المنتج أو المحصول المعروض:</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثال: محصول تمور خلاص الأحساء / شتلات زيتون / خراف عواسي حري"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">القسم الرئيسي:</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CategoryId)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600 cursor-pointer"
                >
                  <option value="crops">محاصيل زراعية وتمور</option>
                  <option value="seeds">بذور وتقاوي</option>
                  <option value="seedlings">أشتال ونخيل وبساتين</option>
                  <option value="livestock">مواشي وأنعام حلال</option>
                  <option value="aquaculture">استزراع سمكي ومفرخات</option>
                  <option value="engineering">هندسة زراعية ومعدات</option>
                  <option value="fertilizers_protection">أسمدة ومبيدات معتمدة</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">صفة البائع:</label>
                <select
                  value={sellerType}
                  onChange={(e) => setSellerType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600 cursor-pointer"
                >
                  <option value="farmer">مزارع مباشر (إنتاج حقل)</option>
                  <option value="breeder">مربي مواشي وأنعام</option>
                  <option value="nursery">صاحب مشتل زراعي</option>
                  <option value="vendor">شركة أو تاجر معتمد</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">المنطقة الجغرافية:</label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600 cursor-pointer"
                >
                  {REGIONS.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">المدينة أو المحافظة:</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="بريدة / الخرج / الهفوف"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">السعر ($ دولار):</label>
                <input
                  type="number"
                  required
                  min="0.5"
                  step="0.5"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs font-bold text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">الوحدة المباعة:</label>
                <input
                  type="text"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="كجم / للرأس / كيس"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">الكمية المتاحة:</label>
                <input
                  type="number"
                  min="1"
                  value={stock}
                  onChange={(e) => setStock(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs font-bold text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">اسم المزرعة أو البائع:</label>
                <input
                  type="text"
                  required
                  value={sellerName}
                  onChange={(e) => setSellerName(e.target.value)}
                  placeholder="مثال: مزرعة النخيل المباركة"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">رقم الجوال للتواصل والطلب:</label>
                <input
                  type="tel"
                  required
                  value={sellerPhone}
                  onChange={(e) => setSellerPhone(e.target.value)}
                  placeholder="+9665xxxxxxxx"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">تفاصيل ومواصفات المنتج:</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="اكتب تفاصيل المحصول، طريقة التعبئة، التحصينات، إمكانية المعاينة قبل الاستلام..."
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>

            {category === 'livestock' && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={halalPledge}
                    onChange={(e) => setHalalPledge(e.target.checked)}
                    className="mt-0.5 text-emerald-700 rounded"
                  />
                  <span className="text-xs text-emerald-950 font-semibold leading-relaxed">
                    أتعهد شرعياً وقانونياً بأن المواشي المعروضة تقتصر على الأنعام والمواشي المباحة حلالاً (أغنام، أبقار، ماعز، إبل، دواجن)، وخالية تماماً من الخنازير أو أي محظورات بيطرية وشرعية.
                  </span>
                </label>
              </div>
            )}

            <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-sm"
              >
                نشر العرض فوراً في السوق
              </button>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
};
