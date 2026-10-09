import React, { useState } from 'react';
import { CartItem } from '../types';
import { X, Trash2, Plus, Minus, CheckCircle, ArrowRight } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart
}) => {
  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryCity, setDeliveryCity] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'transfer'>('cod');
  const [orderId, setOrderId] = useState('');

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const deliveryFee = subtotal > 500 ? 0 : 25;
  const grandTotal = subtotal + deliveryFee;

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !deliveryCity) return;

    const newOrderId = `NMA-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderId(newOrderId);
    setStep('success');
  };

  const handleFinish = () => {
    onClearCart();
    setStep('cart');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity" 
      />

      <div className="fixed inset-y-0 left-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-stone-900">
                {step === 'cart' && `سلة المشتريات (${cartItems.length})`}
                {step === 'checkout' && 'إتمام الطلب وتأكيد الشحن'}
                {step === 'success' && 'تم تأكيد طلبك بنجاح'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-stone-400 hover:text-stone-700 rounded-lg cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            
            {/* Step 1: Cart Items */}
            {step === 'cart' && (
              <>
                {cartItems.length === 0 ? (
                  <div className="text-center py-16 text-stone-500 space-y-3">
                    <p className="text-sm font-medium">سلة مشترياتك فارغة حالياً</p>
                    <p className="text-xs text-stone-400">تصفح سوق البذور والأشتال والمواشي والأسماك وأضف ما تحتاجه.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <div 
                        key={item.product.id}
                        className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 flex flex-col gap-2.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] text-stone-500 block">{item.product.subcategory}</span>
                            <h4 className="text-xs font-bold text-stone-900 line-clamp-1">{item.product.title}</h4>
                            <span className="text-xs text-emerald-800 font-semibold tabular-nums mt-0.5 block">
                              {item.product.price.toLocaleString()} {item.product.currency} / {item.product.unit}
                            </span>
                          </div>
                          <button
                            onClick={() => onRemoveItem(item.product.id)}
                            className="text-stone-400 hover:text-rose-600 p-1 cursor-pointer transition-colors"
                            title="حذف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Quantity controls */}
                        <div className="flex items-center justify-between pt-2 border-t border-stone-200/70 text-xs">
                          <span className="text-stone-500">الكمية:</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                              className="w-6 h-6 rounded bg-white border border-stone-300 flex items-center justify-center hover:bg-stone-100 cursor-pointer text-stone-700"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center font-bold tabular-nums text-stone-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, Math.min(item.product.stock, item.quantity + 1))}
                              className="w-6 h-6 rounded bg-white border border-stone-300 flex items-center justify-center hover:bg-stone-100 cursor-pointer text-stone-700"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <span className="font-bold text-stone-900 tabular-nums">
                            {(item.product.price * item.quantity).toLocaleString()} {item.product.currency}
                          </span>
                        </div>

                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Step 2: Checkout Form */}
            {step === 'checkout' && (
              <form id="checkout-form" onSubmit={handleConfirmOrder} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">الاسم الكامل / اسم المزرعة:</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="مثال: فهد الدوسري (مزرعة النخيل)"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">رقم الجوال للتنسيق والشحن:</label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="05xxxxxxxx"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">المدينة / عنوان المزرعة:</label>
                  <input
                    type="text"
                    required
                    value={deliveryCity}
                    onChange={(e) => setDeliveryCity(e.target.value)}
                    placeholder="مثال: القصيم - بريدة - طريق الطرفية"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">طريقة الدفع المعتمدة:</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 p-2.5 bg-stone-50 border border-stone-200 rounded-lg cursor-pointer">
                      <input
                        type="radio"
                        name="pay"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="text-emerald-700"
                      />
                      <span className="text-xs font-medium text-stone-800">الدفع عند الاستلام والفحص الميداني</span>
                    </label>
                    <label className="flex items-center gap-2 p-2.5 bg-stone-50 border border-stone-200 rounded-lg cursor-pointer">
                      <input
                        type="radio"
                        name="pay"
                        checked={paymentMethod === 'transfer'}
                        onChange={() => setPaymentMethod('transfer')}
                        className="text-emerald-700"
                      />
                      <span className="text-xs font-medium text-stone-800">تحويل بنكي رسمي لحساب المؤسسة</span>
                    </label>
                  </div>
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 text-xs">
                  <span className="font-bold">سياسة الفحص:</span> يحق للمشتري فحص البذور والأشتال والمواشي والأسماك والتأكد من مطابقتها للشروط الصحية قبل السداد.
                </div>
              </form>
            )}

            {/* Step 3: Success Confirmation */}
            {step === 'success' && (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-10 h-10" />
                </div>
                
                <div>
                  <h3 className="text-base font-bold text-stone-900">تم تسجيل طلبك بنجاح!</h3>
                  <p className="text-xs text-stone-500 mt-1">سيتواصل معك فريق الدعم والتاجر لتأكيد موعد التسليم والشحن.</p>
                </div>

                <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl text-xs space-y-2 text-stone-700 text-right">
                  <div className="flex justify-between border-b border-stone-200 pb-1.5">
                    <span className="text-stone-500">رقم الفاتورة المرجعي:</span>
                    <span className="font-bold text-emerald-800 tabular-nums">{orderId}</span>
                  </div>
                  <div className="flex justify-between border-b border-stone-200 pb-1.5">
                    <span className="text-stone-500">اسم العميل:</span>
                    <span className="font-semibold">{customerName}</span>
                  </div>
                  <div className="flex justify-between border-b border-stone-200 pb-1.5">
                    <span className="text-stone-500">رقم الجوال:</span>
                    <span className="font-semibold tabular-nums">{customerPhone}</span>
                  </div>
                  <div className="flex justify-between border-b border-stone-200 pb-1.5">
                    <span className="text-stone-500">الوجهة:</span>
                    <span className="font-semibold">{deliveryCity}</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-stone-500">إجمالي المبلغ:</span>
                    <span className="font-bold text-stone-900 tabular-nums">${grandTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Footer Controls */}
          <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50 space-y-3">
            {step === 'cart' && cartItems.length > 0 && (
              <>
                <div className="space-y-1.5 text-xs text-stone-600">
                  <div className="flex items-center justify-between">
                    <span>المجموع الفرعي:</span>
                    <span className="font-semibold text-stone-900 tabular-nums">${subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>رسوم التوصيل الميداني:</span>
                    <span className="font-semibold text-stone-900 tabular-nums">
                      {deliveryFee === 0 ? 'مجاني (للطلبات فوق $500)' : `$${deliveryFee}`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-200">
                    <span>المجموع الكلي:</span>
                    <span className="text-emerald-800 text-base tabular-nums">${grandTotal.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={() => setStep('checkout')}
                  className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-sm"
                >
                  متابعة إلى تأكيد الشحن والدفع
                </button>
              </>
            )}

            {step === 'checkout' && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setStep('cart')}
                  className="px-4 py-2.5 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  الرجوع للسلة
                </button>
                <button
                  type="submit"
                  form="checkout-form"
                  className="flex-1 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-sm"
                >
                  تأكيد الشراء (${grandTotal.toLocaleString()})
                </button>
              </div>
            )}

            {step === 'success' && (
              <button
                onClick={handleFinish}
                className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                العودة للتسوق
              </button>
            )}

          </div>

        </div>
      </div>
    </div>
  );
};
