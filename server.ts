import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini Client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

// API Endpoint for Agricultural & Veterinary AI Consultation
app.post('/api/consult', async (req: Request, res: Response) => {
  try {
    const { topic, query, context } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'الرجاء إدخال الاستفسار أو وصف الحالة' });
    }

    const ai = getGeminiClient();

    if (!ai) {
      // Provide intelligent fallback knowledge response if API key is not configured
      return res.json({
        reply: `مرحباً بك في المستشار الزراعي والبيطري الذكي لنماء.

بناءً على المعايير العلمية والهندسية الزراعية والبيطرية المعتمدة:
- موضوع الاستشارة: ${topic || 'استشارة عامة'}
- التوصية الهندسية/البيطرية الأولية: يُنصح بفحص رطوبة التربة وملوحتها (EC) ودرجة الحموضة (pH)، والتأكد من برنامج التحصين المسبق أو التهوية الكافية للأحواض المائية.
- لمزيد من الدقة: يُرجى تزويدنا بصور الأعراض أو القراءات الحقلية المباشرة للتأكد من الحالة عبر الفحص المعملي.

(ملاحظة: يمكنك إعداد مفتاح GEMINI_API_KEY للاستفادة الكاملة من التحليل الفوري المتقدم بالذكاء الاصطناعي).`,
        mode: 'fallback'
      });
    }

    const systemInstruction = `أنت كبير مهندسي الزراعة والأطباء البيطريين واستشاريي الاستزراع السمكي في منصة "نماء" الزراعية العربية الشاملة.
اختصاصاتك تشمل بدقة:
1. الهندسة الزراعية: تصميم شبكات الري بالتنقيط والمحوري، التسميد الكيميائي والعضوي (NPK)، حساب الاحتياجات المائية، البيوت المحمية، وميكنة الحقول.
2. عيادة صحة النبات والمحاصيل: تشخيص الآفات الحشرية والأمراض الفطرية والبكتيرية والفيروسية ونقص العناصر الصغرى والكبرى وعلاجها.
3. تجارة البذور والأشتال: التوصية بأفضل الأصناف والتقاوي ومسافات الزراعة ومواعيد البذار والشتل.
4. الطب البيطري ورعاية المواشي والأنعام الحلال: الأبقار، الأغنام، الماعز، الإبل، والخيول، والدواجن والطيور (مع الالتزام الصارم بالثروة الحيوانية الحلال واستبعاد الخنازير تماماً). تشخيص الأعراض، برامج التحصينات الوقائية، خلطات الأعلاف المتوازنة، ومكافحة الطفيليات.
5. مزارع الأسماك والاستزراع السمكي: جودة المياه (الأكسجين الذائب، الأمونيا، pH)، أمراض الأسماك، أعلاف التسمين، وكثافة الأحواض.

القواعد:
- أجب باللغة العربية الفصحى العلمية الرصينة والمبسطة والمشجعة للمزارع والمربي والمهندس.
- نسق إجابتك بنقاط واضحة وعناوين فرعية: (التشخيص المرجح / السبب العلمي / خطة العلاج الفورية / الإجراء الوقائي طويل الأمد).
- لا تذكر الخنازير أو أي منتجات متعلقة بها أبداً، وركز فقط على المواشي والأنعام والطيور والأسماك الحلال.
- عند تقديم وصفات مبيدات أو أدوية، اذكر المادة الفعالة مع التنبيه على فترة الأمان قبل الحصاد (PHI) واستشارة الطبيب البيطري أو المهندس الزراعي ميدانياً.`;

    const promptText = `نوع الاستشارة: ${topic || 'استشارة زراعية وبيطرية عامة'}
السياق الإضافي: ${context ? JSON.stringify(context) : 'لا يوجد'}
استفسار المزارع أو المهندس:
${query}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptText,
      config: {
        systemInstruction,
        temperature: 0.4,
      },
    });

    const reply = response.text || 'عذراً، لم نتمكن من الحصول على رد مفصل حالياً. يرجى إعادة المحاولة.';
    return res.json({ reply, mode: 'live' });
  } catch (error: any) {
    console.error('Error generating consultation:', error);
    return res.status(500).json({
      error: 'حدث خطأ أثناء معالجة الاستشارة الذكية.',
      details: error.message || String(error),
    });
  }
});

// Setup Vite in development or serve static in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`نماء | الخادم يعمل بنجاح على المنفذ: http://localhost:${port}`);
  });
}

startServer();
