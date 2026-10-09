import { NextResponse } from 'next/server';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { readingText, title } = await req.json();

    if (!readingText) {
      return NextResponse.json({ error: 'Эх бичвэр оруулна уу.' }, { status: 400 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY?.trim() || process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) {
      return NextResponse.json({ error: 'OPENROUTER_API_KEY Vercel дээр тохируулагдаагүй байна.' }, { status: 500 });
    }

    const prompt = `
Та бол PISA олон улсын суралцагчийн үнэлгээний Унших чадварын ахлах шинжээч, уран зохиолын мэргэжилтэн багш юм.
Дараах уран зохиолын эх бичвэрийг маш анхааралтай уншиж, БОДИТ ДҮРҮҮД (Би/хүү, Бөөдэй, Ойдов, Бөөдэйн ээж/авга г.м) болон БОДИТ ҮЙЛ ЯВДЛУУДЫН ДҮН ШИНЖИЛГЭЭНД ҮНДЭСЛЭН PISA стандартын дагуу 6 даалгавар боловсруул.

Гарчиг: ${title || 'PISA Сорил'}
Эх бичвэр:
"""
${readingText}
"""

[ОНЦГОЙ ХАТУУ ШААРДЛАГА]
1. КВАДРАТ ХААЛТ [ ] ЭСВЭЛ "ОСНОВНОЙ", "ТОДОРХОЙ ТАЙЛБАРЛАСАН" ГЭХ МЭТ ЕРӨНХИЙ АБСТРАКТ ҮГС ХОРИГЛОНО!
2. Асуулт болон үнэлгээний рубрик бүрт зохиолын бодит дүрийн нэрс, бодит үйл явдал, тодорхой хариултын шалгуурыг заавал КӨНКТРЕТ бич.
3. Зөвхөн цэвэр Монгол хэлээр бич. Орос эсвэл англи үг оруулахыг хатуу хориглоно.

[PISA БЛЮПРИНТ БҮТЭЦ]
- mcq: 1 Сонгох асуулт (Мэдээлэл олох / Retrieval). Эхэд дурдагдсан шууд баримтаар 4 сонголт, 1 зөв хариултын индекс (0-3).
- openQuestions[0]: Задгай 1 (Мэдээлэл олох / Access & Retrieve - Эхийн тодорхой баримт)
- openQuestions[1]: Задгай 2 (Мэдээлэл олох ба ойлгох - Дүрүүдийн үйлдэл, шалтгаан)
- openQuestions[2]: Задгай 3 (Ойлгон тайлбарлах / Integrate & Interpret - Дүрүүдийн сэтгэл зүй, харилцааны өөрчлөлт)
- openQuestions[3]: Задгай 4 (Ойлгон тайлбарлах / Integrate & Interpret - Зохиолын далд утга, "Би" дүрийн сэтгэлийн гуниг)
- openQuestions[4]: Задгай 5 (Тусган эргэцүүлэх / Reflect & Evaluate - 17 насны гэгээн дурсамж, залуу насны сэтгэлийн тохиолдол, сургамж)

[JSON БҮТЭЦ]
Заавал дараах цэвэр JSON форматаар хариулна уу:
{
  "mcq": {
    "question": "Эхэд дурдагдсан бодит баримтад суурилсан сонгох асуулт...",
    "options": ["А сонголт", "Б сонголт", "В сонголт", "Г сонголт"],
    "correctIndex": 0
  },
  "openQuestions": [
    {
      "id": 1,
      "question": "Задгай асуулт 1...",
      "rubric": "2 оноо: Зохиолын бодит баримтыг гүйцэд бичсэн бол | 1 оноо: Баримтыг дутуу бичсэн бол | 0 оноо: Буруу эсвэл орхисон бол"
    },
    {
      "id": 2,
      "question": "Задгай асуулт 2...",
      "rubric": "2 оноо: Дүрийн үйлдлийн шалтгааныг эхээс эш татан тайлбарласан бол | 1 оноо: Шалтгааныг өнгөц тайлбарласан бол | 0 оноо: Буруу хариулсан бол"
    },
    {
      "id": 3,
      "question": "Задгай асуулт 3...",
      "rubric": "2 оноо: Бөөдэй болон Ойдовын харилцаа, 'Би' дүрийн сэтгэл зүйн өөрчлөлтийг тодорхой гаргасан бол | 1 оноо: Сэтгэл зүйн өөрчлөлтийг дутуу тайлбарласан бол | 0 оноо: Буруу хариулсан бол"
    },
    {
      "id": 4,
      "question": "Задгай асуулт 4...",
      "rubric": "2 оноо: Зохиолын далд санаа болох 17 насны тохиолдол, тоомжиргүй бөгөөд гэгээн сэтгэлийн гунигийг үндэслэлтэй тайлбарласан бол | 1 оноо: Үндэслэл дулимаг бол | 0 оноо: Буруу хариулсан бол"
    },
    {
      "id": 5,
      "question": "Задгай асуулт 5...",
      "rubric": "2 оноо: Зохиолын гол санааг өөрийн бодол, амьдралын туршлагатай холбон гүнзгий эргэцүүлсэн бол | 1 оноо: Эргэцүүлэл дутуу бол | 0 оноо: Буруу хариулсан бол"
    }
  ]
}
`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://tsendao-pisa-lms.vercel.app',
        'X-Title': 'PISA LMS',
      },
      body: JSON.stringify({
        models: [
          'google/gemini-2.0-flash-001',
          'google/gemini-flash-1.5',
          'openai/gpt-4o-mini'
        ],
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: `OpenRouter API Алдаа: ${data.error?.message || JSON.stringify(data)}` },
        { status: 500 }
      );
    }

    const responseText = data.choices?.[0]?.message?.content;
    if (!responseText) {
      return NextResponse.json({ error: 'AI хариулт хоосон ирлээ.' }, { status: 500 });
    }

    return NextResponse.json(JSON.parse(responseText));

  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Сүлжээний алдаа гарлаа.' }, { status: 500 });
  }
}