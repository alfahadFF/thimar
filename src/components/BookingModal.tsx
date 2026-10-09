import React, { useState } from 'react';
import { Specialist, ConsultationBooking } from '../types';
import { X, Calendar, CheckCircle } from 'lucide-react';

interface BookingModalProps {
  specialist: Specialist | null;
  onClose: () => void;
  onConfirmBooking: (booking: ConsultationBooking) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  specialist,
  onClose,
  onConfirmBooking
}) => {
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [farmLocation, setFarmLocation] = useState('');
  const [consultationType, setConsultationType] = useState<'field_visit' | 'video_call' | 'written_report'>('field_visit');
  const [scheduledDate, setScheduledDate] = useState('2026-10-15');
  const [problemSummary, setProblemSummary] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [bookingId, setBookingId] = useState('');

  if (!specialist) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientPhone || !farmLocation) return;

    const id = `CN-${Math.floor(10000 + Math.random() * 90000)}`;
    const newBooking: ConsultationBooking = {
      id,
      clientName,
      clientPhone,
      specialistId: specialist.id,
      specialistName: specialist.name,
      consultationType,
      farmLocation,
      problemSummary,
      scheduledDate,
      status: 'confirmed'
    };

    setBookingId(id);
    setIsConfirmed(true);
    onConfirmBooking(newBooking);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" 
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-stone-200">
          
          <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
            <div>
              <h2 className="text-base font-bold text-stone-900">
                {isConfirmed ? 'تم تأكيد حجز الاستشارة بنجاح' : `حجز استشارة مع ${specialist.name}`}
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">{specialist.title}</p>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-stone-400 hover:text-stone-700 rounded-lg cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {!isConfirmed ? (
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
                <span className="text-stone-600">رسوم الاستشارة المعتمدة:</span>
                <span className="font-bold text-emerald-900 text-sm tabular-nums">${specialist.feePerConsultation}</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">اسم المزارع / المربي:</label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="الاسم الكامل"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">رقم الجوال:</label>
                <input
                  type="tel"
                  required
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="05xxxxxxxx"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">موقع المزرعة أو المشروع:</label>
                <input
                  type="text"
                  required
                  value={farmLocation}
                  onChange={(e) => setFarmLocation(e.target.value)}
                  placeholder="المنطقة والمدينة والموقع التقريبي"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">نوع الاستشارة:</label>
                  <select
                    value={consultationType}
                    onChange={(e) => setConsultationType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600 cursor-pointer"
                  >
                    <option value="field_visit">زيارة حقلية ميدانية</option>
                    <option value="video_call">استشارة فيديو مباشرة</option>
                    <option value="written_report">تقرير فني معتمد</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">التاريخ المفضل:</label>
                  <input
                    type="date"
                    required
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">ملخص الحالة أو الاستفسار:</label>
                <textarea
                  rows={3}
                  value={problemSummary}
                  onChange={(e) => setProblemSummary(e.target.value)}
                  placeholder="اشرح المشكلة الزراعية أو أعراض الماشية أو تفاصيل الحوض السمكي..."
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

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
                  تأكيد حجز الموعد
                </button>
              </div>

            </form>
          ) : (
            <div className="p-6 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-base font-bold text-stone-900">تم حجز موعد الاستشارة بنجاح</h3>
                <p className="text-xs text-stone-500 mt-1">تم إشعار الخبير وسيتصل بك خلال ساعتين لتنسيق التفاصيل الفنية.</p>
              </div>

              <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl text-xs space-y-2 text-stone-700 text-right">
                <div className="flex justify-between border-b border-stone-200 pb-1.5">
                  <span className="text-stone-500">رقم الحجز:</span>
                  <span className="font-bold text-emerald-800 tabular-nums">{bookingId}</span>
                </div>
                <div className="flex justify-between border-b border-stone-200 pb-1.5">
                  <span className="text-stone-500">الخبير الاستشاري:</span>
                  <span className="font-semibold">{specialist.name}</span>
                </div>
                <div className="flex justify-between border-b border-stone-200 pb-1.5">
                  <span className="text-stone-500">تاريخ الموعد:</span>
                  <span className="font-semibold tabular-nums">{scheduledDate}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-stone-500">الموقع:</span>
                  <span className="font-semibold">{farmLocation}</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                إغلاق النافذة
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
