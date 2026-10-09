import React, { useState } from 'react';
import { Specialist } from '../types';
import { 
  ShieldCheck, 
  Stethoscope, 
  Sprout, 
  Fish, 
  Calendar, 
  CheckCircle, 
  Clock, 
  Star, 
  AlertTriangle,
  Send,
  UserCheck
} from 'lucide-react';

interface ClinicsConsultationsProps {
  specialists: Specialist[];
  onOpenBookingModal: (specialist: Specialist) => void;
  onOpenAiConsultantWithPrompt: (topic: string, prompt: string) => void;
}

export const ClinicsConsultations: React.FC<ClinicsConsultationsProps> = ({
  specialists,
  onOpenBookingModal,
  onOpenAiConsultantWithPrompt
}) => {
  const [activeClinic, setActiveClinic] = useState<'plants' | 'livestock' | 'aquaculture'>('plants');
  
  // Interactive Diagnostic Simulator state
  const [diagSector, setDiagSector] = useState<'plants' | 'livestock' | 'aquaculture'>('plants');
  const [symptomInput, setSymptomInput] = useState('');
  const [diagnosing, setDiagnosing] = useState(false);
  const [diagResult, setDiagResult] = useState<{
    possibleDiagnosis: string;
    urgency: 'منخفضة' | 'متوسطة' | 'عاجلة جداً';
    immediateActions: string[];
    prevention: string;
  } | null>(null);

  const handleRunDiagnosis = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptomInput.trim()) return;

    setDiagnosing(true);
    setTimeout(() => {
      setDiagnosing(false);
      if (diagSector === 'plants') {
        setDiagResult({
          possibleDiagnosis: 'إصابة فطرية محتملة (بياض دقيقي أو لفحة مبكرة) مصحوبة بإجهاد مائي',
          urgency: 'متوسطة',
          immediateActions: [
            'إيقاف الري الغزير فوراً وتخفيف الرطوبة الجوية حول النباتات',
            'رش مادة نحاسية وقائية أو مبيد فطري جهازي مثل (أزوكستروبين 25%) مع الالتزام بفترة الأمان PHI',
            'التخلص من الأوراق السفلية المصابة بحرقها خارج الحقل لمنع انتشار الجراثيم'
          ],
          prevention: 'ضبط مسافات الزراعة للتهوية والاعتماد على الري بالتنقيط بدلاً من الرش العلوي.'
        });
      } else if (diagSector === 'livestock') {
        setDiagResult({
          possibleDiagnosis: 'اشتباه تسمم معوي (Clostridium) أو نخالة/تخمة كربوهيدراتية مع خمول',
          urgency: 'عاجلة جداً',
          immediateActions: [
            'عزل الحيوان فوراً في حظيرة جافة ونظيفة وقطع الحبوب المركزة عنه',
            'حقن مضاد للتسمم المعوي أو مهدئ للمغص والتأكد من توافر ماء شرب نظيف ومعتدل الحرارة',
            'استدعاء الطبيب البيطري فوراً لإعطاء السوائل الوريدية ومضادات التسمم والمضاد الحيوي المناسب'
          ],
          prevention: 'الالتزام بجدول التحصين ضد التسمم المعوي والدموي كل 6 أشهر والتدرج في تغيير العليقة.'
        });
      } else {
        setDiagResult({
          possibleDiagnosis: 'انخفاض حاد في نسبة الأكسجين الذائب (DO < 3 mg/L) أو ارتفاع طفيف في الأمونيا',
          urgency: 'عاجلة جداً',
          immediateActions: [
            'تشغيل بدالات ومضخات التهوية الميكانيكية بأقصى طاقة فوراً',
            'إيقاف إلقاء الأعلاف في الحوض لتجنب تحللها واستهلاك الأكسجين الإضافي',
            'تجديد 20% إلى 30% من مياه الحوض بمياه عذبة جديدة غنية بالأكسجين'
          ],
          prevention: 'قياس الأكسجين الذائب يومياً عند الفجر ومراقبة كثافة التخزين وحجم العلف اليومي.'
        });
      }
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Header */}
      <div className="border-b border-stone-200 pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 mb-1">
          <span>العيادات الافتراضية والاستشارات التخصصية</span>
          <span aria-hidden="true">·</span>
          <span>وقاية النبات · طب بيطري حلال · أحياء مائية</span>
        </div>
        <h2 className="text-2xl font-bold text-stone-900 tracking-tight">
          العيادات والاستشارات الزراعية والبيطرية
        </h2>
        <p className="text-stone-600 text-sm mt-1 max-w-3xl">
          فريق من كبار المهندسين الزراعيين والأطباء البيطريين المعتمدين لخدمة مزرعتك، مع أدوات تشخيص سريعة، وبروتوكولات علاج معتمدة، وحجز زيارات ميدانية واستشارات عن بُعد.
        </p>
      </div>

      {/* 3 Specialized Clinic Portals */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveClinic('plants')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeClinic === 'plants'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Sprout className="w-4 h-4" />
            <span>عيادة صحة ووقاية النبات والمحاصيل</span>
          </button>

          <button
            onClick={() => setActiveClinic('livestock')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeClinic === 'livestock'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            <span>عيادة الطب البيطري ورعاية المواشي والأنعام الحلال</span>
          </button>

          <button
            onClick={() => setActiveClinic('aquaculture')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeClinic === 'aquaculture'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Fish className="w-4 h-4" />
            <span>عيادة الاستزراع السمكي وإدارة الأحواض</span>
          </button>
        </div>

        {/* Plant Clinic Detail Card */}
        {activeClinic === 'plants' && (
          <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-stone-900">عيادة صحة ووقاية النبات والمحاصيل البستانية</h3>
                <p className="text-xs text-stone-500 mt-0.5">تشخيص أعراض الأمراض الفطرية والبكتيرية والفيروسية ونقص العناصر الغذائية الكبرى والصغرى.</p>
              </div>
              <button
                onClick={() => onOpenAiConsultantWithPrompt('وقاية النبات', 'أحتاج استشارة في مكافحة الآفات وأمراض الخضار والأشجار المثمرة.')}
                className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap"
              >
                استشارة الذكاء الاصطناعي للنبات
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-stone-50 rounded-lg border border-stone-200">
                <div className="font-bold text-stone-900 text-xs mb-1">سوسة النخيل الحمراء والحفارات</div>
                <p className="text-xs text-stone-600 leading-relaxed mb-3">بروتوكول الحقن الموضعي بالمبيدات الحشرية الجهازية والرش الوقائي السنوي الدوري.</p>
                <div className="text-[11px] text-emerald-800 font-semibold">المادة الموصى بها: إيميداكلوبريد أو فبرونيل مع المصائد الفيرمونية</div>
              </div>

              <div className="p-4 bg-stone-50 rounded-lg border border-stone-200">
                <div className="font-bold text-stone-900 text-xs mb-1">أعفان الجذور والذبول الفيوزارمي</div>
                <p className="text-xs text-stone-600 leading-relaxed mb-3">معالجة شلل النباتات واصفرار القمة النامية الناتج عن فطريات التربة في البيوت المحمية.</p>
                <div className="text-[11px] text-emerald-800 font-semibold">المادة الموصى بها: هيمكسازول أو ثيوفانات الميثيل مع تقليل مياه الري</div>
              </div>

              <div className="p-4 bg-stone-50 rounded-lg border border-stone-200">
                <div className="font-bold text-stone-900 text-xs mb-1">اصفرار الأوراق الحديثة (نقص الحديد)</div>
                <p className="text-xs text-stone-600 leading-relaxed mb-3">علاج اصفرار النصل وبقاء العروق خضراء في التربة القلوية والجيرية الشائعة.</p>
                <div className="text-[11px] text-emerald-800 font-semibold">الموصى به: شيلات حديد إيدها EDDHA 6% ذائبة مع ماء الري</div>
              </div>
            </div>
          </div>
        )}

        {/* Livestock Clinic Detail Card */}
        {activeClinic === 'livestock' && (
          <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-stone-900">عيادة الطب البيطري ورعاية الأنعام والمواشي الحلال</h3>
                <p className="text-xs text-stone-500 mt-0.5">رعاية صحية وتغذية متخصصة للأغنام، الأبقار، الماعز، الإبل، والخيول والدواجن الحلال حصراً.</p>
              </div>
              <button
                onClick={() => onOpenAiConsultantWithPrompt('الطب البيطري للمواشي', 'أحتاج استشارة في برنامج تحصينات وتغذية الأغنام والأبقار والإبل.')}
                className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap"
              >
                استشارة الذكاء الاصطناعي للمواشي
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-stone-50 rounded-lg border border-stone-200">
                <div className="font-bold text-stone-900 text-xs mb-1">برنامج تحصينات الأغنام والمواليد</div>
                <p className="text-xs text-stone-600 leading-relaxed mb-3">جرعات التسمم المعوي (الكلوستريديا) في عمر شهرين ثم إعادة الجرعة التنشيطية بعد 21 يوماً.</p>
                <div className="text-[11px] text-emerald-800 font-semibold">التطعيمات الأساسية: معوي، دموي، جدري الضأن، والقلاعية</div>
              </div>

              <div className="p-4 bg-stone-50 rounded-lg border border-stone-200">
                <div className="font-bold text-stone-900 text-xs mb-1">التهاب الضرع في الأبقار والحلابات</div>
                <p className="text-xs text-stone-600 leading-relaxed mb-3">فحص كاليفورنيا الميداني (CMT) للتشخيص المبكر وعلاج الانسداد الميكروبي الفوري.</p>
                <div className="text-[11px] text-emerald-800 font-semibold">المعالجة: غمر الحلمات بالمطهر ومضادات حيوية مخصصة للضرع بعد الحلب</div>
              </div>

              <div className="p-4 bg-stone-50 rounded-lg border border-stone-200">
                <div className="font-bold text-stone-900 text-xs mb-1">رعاية هجن وإبل السباق والقنية</div>
                <p className="text-xs text-stone-600 leading-relaxed mb-3">مكافحة الهيام (التريبانوسوما) وعلاج الجرب والحمى وتوازن الأملاح المعدنية وفيتامينات B.</p>
                <div className="text-[11px] text-emerald-800 font-semibold">الفحص الموصى به: مسحة دم مجهرية وقياس بروتين مصل الدم</div>
              </div>
            </div>
          </div>
        )}

        {/* Aquaculture Clinic Detail Card */}
        {activeClinic === 'aquaculture' && (
          <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-stone-900">عيادة المزارع السمكية وإدارة جودة المياه</h3>
                <p className="text-xs text-stone-500 mt-0.5">مراقبة بيئة استزراع البلطي، الدنيس، القاروص، وتشخيص أمراض الخياشيم والبكتيريا ونقص الأكسجين.</p>
              </div>
              <button
                onClick={() => onOpenAiConsultantWithPrompt('الاستزراع السمكي', 'أحتاج استشارة في معايير جودة مياه أحواض الأسماك وتغذية الزريعة.')}
                className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap"
              >
                استشارة الذكاء الاصطناعي للأحواض
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-stone-50 rounded-lg border border-stone-200">
                <div className="font-bold text-stone-900 text-xs mb-1">تسمم الأمونيا غير المتأينة (NH3)</div>
                <p className="text-xs text-stone-600 leading-relaxed mb-3">يحدث عند ارتفاع pH والحرارة؛ تظهر الأسماك تسبح ببطء عند السطح مع احتقان الخياشيم.</p>
                <div className="text-[11px] text-emerald-800 font-semibold">الحل الفوري: تخفيض التغذية، تجديد مياه الحوض وتهوية مكثفة</div>
              </div>

              <div className="p-4 bg-stone-50 rounded-lg border border-stone-200">
                <div className="font-bold text-stone-900 text-xs mb-1">مرض العفن القطني الفطري (Saprolegnia)</div>
                <p className="text-xs text-stone-600 leading-relaxed mb-3">ينتشر بعد الصدمات الحرارية أو الجروح أثناء نقل الزريعة والإصبعيات بين الأحواض.</p>
                <div className="text-[11px] text-emerald-800 font-semibold">المعالجة: حمامات ملحية بتركيز 2-3% أو استخدام برمنجنات البوتاسيوم بحذر</div>
              </div>

              <div className="p-4 bg-stone-50 rounded-lg border border-stone-200">
                <div className="font-bold text-stone-900 text-xs mb-1">معايير مياه الحوض المثالية للبلطي</div>
                <p className="text-xs text-stone-600 leading-relaxed mb-3">أكسجين ذائب DO &gt; 5 ملغم/لتر، حموضة pH 7.2 - 8.2، درجة حرارة 26 - 30 مئوية.</p>
                <div className="text-[11px] text-emerald-800 font-semibold">المراقبة: جهاز قياس الأكسجين الرقمي مرتين يومياً</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Symptom Checker / Diagnostic Simulator */}
      <div className="bg-stone-900 text-white rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
            <span>نظام التشخيص الأولي الفوري</span>
            <span aria-hidden="true">·</span>
            <span>تحليل أعراض الحقل والمزرعة</span>
          </div>
          <h3 className="text-xl font-bold tracking-tight">
            اختبار الأعراض والتشخيص الهندسي والبيطري
          </h3>
          <p className="text-stone-300 text-xs mt-1">
            حدد القطاع واكتب الأعراض المشاهدة (مثل: تغير لون أوراق الطماطم، خمول ونقص شهية في الأغنام، طفو الأسماك على سطح الماء) للحصول على توجيه إرشادي فوري.
          </p>
        </div>

        <form onSubmit={handleRunDiagnosis} className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-xs text-stone-400">القطاع المستهدف:</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setDiagSector('plants')}
                className={`px-3 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                  diagSector === 'plants' ? 'bg-emerald-600 text-white' : 'bg-stone-800 text-stone-400 hover:text-white'
                }`}
              >
                نبات ومحاصيل
              </button>
              <button
                type="button"
                onClick={() => setDiagSector('livestock')}
                className={`px-3 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                  diagSector === 'livestock' ? 'bg-emerald-600 text-white' : 'bg-stone-800 text-stone-400 hover:text-white'
                }`}
              >
                مواشي وأنعام حلال
              </button>
              <button
                type="button"
                onClick={() => setDiagSector('aquaculture')}
                className={`px-3 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                  diagSector === 'aquaculture' ? 'bg-emerald-600 text-white' : 'bg-stone-800 text-stone-400 hover:text-white'
                }`}
              >
                استزراع سمكي
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={symptomInput}
              onChange={(e) => setSymptomInput(e.target.value)}
              placeholder="اكتب الأعراض بالتفصيل هنا (مثال: بقع صفراء بنية على الأوراق السفلية مع احتراق الحواف)..."
              className="flex-1 px-4 py-3 bg-stone-800 border border-stone-700 rounded-xl text-stone-100 placeholder-stone-500 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              disabled={diagnosing || !symptomInput.trim()}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap shadow-sm"
            >
              {diagnosing ? (
                <span>جارٍ تحليل الحالة...</span>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>بدء التشخيص الفوري</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Diagnosis Results Card */}
        {diagResult && (
          <div className="bg-stone-800/90 border border-stone-700 rounded-xl p-5 space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between border-b border-stone-700 pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-stone-200">النتيجة الاسترشادية للحالة:</span>
                <span className="text-xs text-emerald-400 font-semibold">{diagResult.possibleDiagnosis}</span>
              </div>
              <div className="text-xs">
                <span className="text-stone-400 ml-1">درجة الخطورة:</span>
                <span className="text-amber-400 font-bold">{diagResult.urgency}</span>
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold text-stone-300 mb-2">الإجراءات الموصى بها فوراً:</div>
              <ul className="space-y-1.5 text-xs text-stone-300">
                {diagResult.immediateActions.map((action, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 border-t border-stone-700/60 text-xs text-stone-400 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="font-semibold text-stone-300">الوقاية المستدامة: </span>
                {diagResult.prevention}
              </div>
              <button
                onClick={() => onOpenAiConsultantWithPrompt('متابعة تشخيص حالة', symptomInput)}
                className="px-3 py-1.5 bg-emerald-700/80 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap"
              >
                تحليل معمق عبر المستشار الذكي
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Accredited Specialists List & Appointment Booking */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-stone-900 tracking-tight">
              الاستشاريون والأطباء البيطريون المعتمدون
            </h3>
            <p className="text-stone-500 text-xs mt-0.5">
              احجز موعد استشارة ميدانية بمزرعتك أو استشارة فيديو مباشرة مع خبراء موثوقين.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {specialists.map((spec) => (
            <div
              key={spec.id}
              className="bg-white border border-stone-200 rounded-xl p-5 hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-900 font-bold flex items-center justify-center text-sm border border-emerald-200">
                    {spec.avatarInitials}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-stone-900">{spec.name}</h4>
                    <p className="text-[11px] text-stone-500 line-clamp-1">{spec.title}</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-stone-600 border-t border-stone-100 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500">الخبرة الحقلية</span>
                    <span className="font-semibold tabular-nums text-stone-800">{spec.experienceYears} سنة</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500">التقييم العام</span>
                    <span className="flex items-center gap-1 font-semibold text-amber-600 tabular-nums">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      {spec.rating} ({spec.consultationsCount} استشارة)
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500">أيام التواجد</span>
                    <span className="text-stone-800">{spec.availableDays}</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-stone-100">
                  <div className="text-[11px] font-semibold text-stone-500 mb-1.5">أبرز التخصصات:</div>
                  <div className="flex flex-wrap gap-1">
                    {spec.specialties.map((tag, idx) => (
                      <span key={idx} className="text-[10px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-stone-500 block">رسوم الاستشارة</span>
                  <span className="text-sm font-bold text-emerald-900 tabular-nums">${spec.feePerConsultation}</span>
                </div>
                <button
                  onClick={() => onOpenBookingModal(spec)}
                  className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>حجز موعد</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
