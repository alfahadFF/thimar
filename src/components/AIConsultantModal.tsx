import React, { useState } from 'react';
import { X, Send, Sparkles, Copy, Check, AlertCircle } from 'lucide-react';

interface AIConsultantModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTopic?: string;
  initialPrompt?: string;
}

export const AIConsultantModal: React.FC<AIConsultantModalProps> = ({
  isOpen,
  onClose,
  initialTopic = 'استشارة عامة',
  initialPrompt = ''
}) => {
  const [topic, setTopic] = useState<string>(initialTopic);
  const [query, setQuery] = useState<string>(initialPrompt);
  const [loading, setLoading] = useState<boolean>(false);
  const [reply, setReply] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isOpen) return null;

  const quickQuestions = [
    {
      label: 'جدول تحصينات الأغنام العواسي',
      topic: 'الطب البيطري للمواشي',
      text: 'ما هو جدول التحصينات الوقائية الأساسية للأغنام العواسي ومواليد البهم ضد التسمم المعوي والدموي والحمى القلاعية؟'
    },
    {
      label: 'علاج اصفرار أوراق الطماطم',
      topic: 'وقاية وصحة النبات',
      text: 'عندي اصفرار في القمم النامية لأوراق الطماطم مع بقاء العروق خضراء في تربة قلوية، ما التشخيص وكيف أعالجه بالتسميد؟'
    },
    {
      label: 'هبوط أكسجين أحواض البلطي',
      topic: 'الاستزراع السمكي',
      text: 'لاحظت طفو أسماك البلطي على سطح الماء وفتح فمها في الصباح الباكر، ما الإجراءات الفورية لإنقاذ الحوض؟'
    },
    {
      label: 'تصميم شبكة ري بالتنقيط',
      topic: 'الهندسة الزراعية',
      text: 'كيف أحسب تصرف المضخة وقطر الأنبوب الرئيسي المطلوب لري هكتار بطاطس بالتنقيط بنقاطات 4 لتر/ساعة؟'
    }
  ];

  const handleAsk = async (customText?: string, customTopic?: string) => {
    const textToSend = customText || query;
    const topicToSend = customTopic || topic;

    if (!textToSend.trim()) return;

    setLoading(true);
    setErrorMsg('');
    setReply('');

    try {
      const res = await fetch('/api/consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topicToSend,
          query: textToSend,
          context: { platform: 'Namaa AgriTech Platform' }
        })
      });

      if (!res.ok) {
        throw new Error('تعذر إتمام الاستشارة. تأكد من الاتصال بالخادم.');
      }

      const data = await res.json();
      setReply(data.reply || 'تمت معالجة الاستشارة بنجاح.');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'حدث خطأ أثناء معالجة الاستشارة.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!reply) return;
    navigator.clipboard.writeText(reply);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" 
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-stone-200 flex flex-col max-h-[88vh]">
          
          {/* Header */}
          <div className="p-5 bg-gradient-to-r from-emerald-950 via-stone-900 to-emerald-900 text-white flex items-center justify-between border-b border-stone-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">المستشار الزراعي والبيطري الذكي</h2>
                <p className="text-xs text-emerald-300">مدعوم بنماذج الذكاء الاصطناعي للهندسة الزراعية وصحة النبات والمواشي الحلال والأسماك</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-white rounded-lg bg-black/30 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6 overflow-y-auto flex-1 text-stone-800">
            
            {/* Sector / Topic Tabs */}
            <div>
              <span className="text-xs font-semibold text-stone-500 block mb-2">مجال الاستشارة:</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'وقاية وصحة النبات',
                  'الهندسة الزراعية والري',
                  'الطب البيطري للمواشي',
                  'الاستزراع السمكي والأحواض',
                  'بذور وأشتال وأشجار'
                ].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTopic(t)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                      topic === t
                        ? 'bg-emerald-800 text-white'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Templates */}
            <div>
              <span className="text-xs font-semibold text-stone-500 block mb-2">استفسارات شائعة سريعة:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {quickQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setTopic(q.topic);
                      setQuery(q.text);
                      handleAsk(q.text, q.topic);
                    }}
                    className="p-2.5 text-right bg-stone-50 hover:bg-emerald-50 border border-stone-200 hover:border-emerald-300 rounded-xl text-xs text-stone-800 transition-colors cursor-pointer group"
                  >
                    <span className="font-bold text-emerald-900 block group-hover:text-emerald-700">{q.label}</span>
                    <span className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">{q.text}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Input form */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-stone-700">
                اكتب سؤالك أو صف حالة المزرعة / المحصول / القطيع:
              </label>
              <textarea
                rows={3}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="اكتب بالتفصيل: مثلاً عمر النبات، نوع المحصول أو الحيوان، الأعراض المشاهدة، نوع مياه الري أو التغذية..."
                className="w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
              />

              <div className="flex justify-end">
                <button
                  type="button"
                  disabled={loading || !query.trim()}
                  onClick={() => handleAsk()}
                  className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  {loading ? (
                    <span>جارٍ صياغة التوصية العلمية...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>إرسال الاستشارة الآن</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Response Area */}
            {reply && (
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-5 space-y-3 animate-in fade-in duration-300">
                <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                  <span className="text-xs font-bold text-emerald-900">
                    التوصية الهندسية والبيطرية المعتمدة:
                  </span>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-[11px] font-semibold text-stone-600 hover:text-emerald-800 cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>تم النسخ</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>نسخ التقرير</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="text-xs text-stone-800 leading-relaxed whitespace-pre-wrap font-sans">
                  {reply}
                </div>

                <div className="pt-2 border-t border-stone-200 text-[11px] text-stone-500">
                  تنبيه: الاستشارة مخصصة للأغراض الإرشادية والهندسية، ويُنصح دوماً بالمعاينة الحقلية الميدانية في الحالات الحرجة.
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
};
