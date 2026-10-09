import React, { useState } from 'react';
import { MarketItem } from '../types';
import { X, MapPin, Phone, ShieldCheck, Check, ShoppingBag, Star, Share2 } from 'lucide-react';

interface ProductDetailModalProps {
  product: MarketItem | null;
  onClose: () => void;
  onAddToCart: (product: MarketItem, qty: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart
}) => {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" 
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-stone-200">
          
          {/* Header Banner */}
          <div className="p-6 bg-gradient-to-r from-stone-900 to-emerald-950 text-white relative">
            <button
              onClick={onClose}
              className="absolute left-4 top-4 p-1.5 text-stone-400 hover:text-white rounded-lg bg-black/30 backdrop-blur-xs cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-xs font-semibold text-emerald-300 mb-1">{product.categoryName} · {product.subcategory}</div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-2 leading-snug">
              {product.title}
            </h2>

            <div className="flex flex-wrap items-center gap-3 text-xs text-stone-300">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                {product.location}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1 text-amber-300 font-semibold tabular-nums">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {product.rating} ({product.reviewsCount} تقييم موثق)
              </span>
              {product.badge && (
                <>
                  <span>·</span>
                  <span className="text-emerald-300 font-medium">{product.badge}</span>
                </>
              )}
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-6 max-h-[65vh] overflow-y-auto">
            
            {/* Halal Banner if Livestock */}
            {product.isHalalLivestock && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-xs text-emerald-900 font-medium">
                <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
                <span>ثروة حيوانية حلال معتمدة: خالية تماماً من الخنازير أو المشتقات المحظورة، ومفحوصة بيطرياً بموجب إشعار سلامة رسمي.</span>
              </div>
            )}

            {/* Description */}
            <div>
              <h3 className="text-xs font-bold text-stone-500 mb-1.5">الوصف والخصائص الإنتاجية:</h3>
              <p className="text-xs text-stone-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Technical Specifications */}
            <div>
              <h3 className="text-xs font-bold text-stone-500 mb-2">المواصفات الفنية والهندسية:</h3>
              <div className="bg-stone-50 border border-stone-200 rounded-xl overflow-hidden divide-y divide-stone-200 text-xs">
                {Object.entries(product.specs).map(([key, val]) => (
                  <div key={key} className="flex items-center justify-between py-2 px-3.5">
                    <span className="text-stone-500 font-medium">{key}</span>
                    <span className="text-stone-900 font-semibold text-left">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Seller Contact Strip */}
            <div className="p-4 bg-stone-100/80 rounded-xl flex items-center justify-between text-xs border border-stone-200">
              <div>
                <span className="text-stone-500 block text-[11px]">الجهة البائعة / المزرعة:</span>
                <span className="font-bold text-stone-900">{product.sellerName}</span>
              </div>
              <a
                href={`tel:${product.sellerPhone}`}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-stone-300 hover:border-emerald-600 rounded-lg text-emerald-800 font-semibold transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span className="tabular-nums">{product.sellerPhone}</span>
              </a>
            </div>

          </div>

          {/* Modal Footer */}
          <div className="p-5 border-t border-stone-200 bg-stone-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] text-stone-500 block">سعر الوحدة ({product.unit}):</span>
              <div className="text-2xl font-bold text-stone-900 tabular-nums">
                {product.price.toLocaleString()} <span className="text-xs font-semibold text-emerald-800">{product.currency}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center border border-stone-300 rounded-lg bg-white overflow-hidden text-xs">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-2.5 py-2 hover:bg-stone-100 text-stone-700 cursor-pointer"
                >
                  -
                </button>
                <span className="px-3 font-bold tabular-nums text-stone-900">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-2.5 py-2 hover:bg-stone-100 text-stone-700 cursor-pointer"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAdd}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-sm whitespace-nowrap"
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>تمت الإضافة للسلة</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>إضافة للسلة ({((product.price * quantity)).toLocaleString()} {product.currency})</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
