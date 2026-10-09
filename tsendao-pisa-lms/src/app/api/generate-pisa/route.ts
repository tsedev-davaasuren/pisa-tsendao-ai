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
Та бол PISA Унших чадварын олон улсын сорил боловсруулагч ахлах шинжээч, уран зохиолын мэргэжилтэн багш юм.
Дараах уран зохиолын эх бичвэрийг анхааралтай шинжлэн уншиж, PISA Блюпринтийн 3 чадварын дагуу 6 даалгавар ба үнэлгээний рубрик боловсруул.

Гарчиг: ${title || 'PISA Сорил'}
Эх бичвэр:
"""
${readingText}
"""

[PISA БЛЮПРИНТ БА ДААЛГАВРЫН АНГИЛАЛ]
1. Сонгох асуулт (mcq): "Мэдээлэл олох" (Access & Retrieve). Эхийн тодорхой баримтад суурилсан 4 сонголт, 1 зөв хариулт (correctIndex: 0-3).
2. Задгай #1 (openQuestions[0]): "Мэдээлэл олох" (Access & Retrieve - Эхийн бодит баримт, 1 оноо).
3. Задгай #2 (openQuestions[1]): "Мэдээлэл олох" (Access & Retrieve - Дүрүүдийн үйлдэл, шалтгаан, 2 оноо).
4. Задгай #3 (openQuestions[2]): "Ойлгон тайлбарлах" (Integrate & Interpret - Дүрүүдийн сэтгэл зүй, харилцааны өөрчлөлт, 2 оноо).
5. Задгай #4 (openQuestions[3]): "Ойлгон тайлбарлах" (Integrate & Interpret - Зохиолын далд утга, сэтгэлийн гуниг, 2 оноо).
6. Задгай #5 (openQuestions[4]): "Тусган эргэцүүлэх" (Reflect & Evaluate - 17 насны дурсамж, сургамж, амьдралын эргэцүүлэл, 2 оноо).

[ХАТУУ ШААРДЛАГА]
- Квадрат хаалт [ ] болон "основной", "тодорхой тайлбарласан" гэх мэт абстракт ерөнхий үг огт ашиглаж болохгүй!
- Рубрикт зохиолын бодит дүрийн нэрс (Бөөдэй, Ойдов, Хүү/"Би"), бодит үйл явдал, тодорхой шалгуурыг монгол хэлээр тодорхой бич.

Хариултыг заавал дараах цэвэр JSON форматаар хариулна уу:
{
  "mcq": {
    "question": "Эх бичвэрийн бодит баримтад суурилсан сонгох асуулт...",
    "options": ["А сонголт", "Б сонголт", "В сонголт", "Г сонголт"],
    "correctIndex": 0,
    "category": "Мэдээлэл олох",
    "points": 1
  },
  "openQuestions": [
    {
      "id": 1,
      "category": "Мэдээлэл олох",
      "points": 1,
      "question": "Задгай асуулт 1...",
      "rubric": "1 оноо: Эхээс тодорхой баримтыг оновчтой заан бичсэн бол.\n0 оноо: Буруу эсвэл хамааралгүй хариулт."
    },
    {
      "id": 2,
      "category": "Мэдээлэл олох",
      "points": 2,
      "question": "Задгай асуулт 2...",
      "rubric": "2 оноо: Бөөдэй болон 'Би' дүрийн үйлдлийг эхээс эш татан бүрэн тайлбарласан бол.\n1 оноо: Түүнийг дутуу тайлбарласан бол.\n0 оноо: Буруу хариулсан бол."
    },
    {
      "id": 3,
      "category": "Ойлгон тайлбарлах",
      "points": 2,
      "question": "Задгай асуулт 3...",
      "rubric": "2 оноо: Ойдов ирснээр Бөөдэйн хандлага болон 'Би' дүрийн сэтгэл зүйд гарсан өөрчлөлтийг тодорхой бичсэн бол.\n1 оноо: Өөрчлөлтийг дутуу тайлбарласан бол.\n0 оноо: Буруу хариулсан бол."
    },
    {
      "id": 4,
      "category": "Ойлгон тайлбарлах",
      "points": 2,
      "question": "Задгай асуулт 4...",
      "rubric": "2 оноо: Зохиолын далд санаа болох 17 насны гэгээн хэдий ч гунигтай дурсамжийг үндэслэлтэй тайлбарласан бол.\n1 оноо: Үндэслэл дулимаг бол.\n0 оноо: Буруу хариулсан бол."
    },
    {
      "id": 5,
      "category": "Тусган эргэцүүлэх",
      "points": 2,
      "question": "Задгай асуулт 5...",
      "rubric": "2 оноо: Эхийн гол санааг өөрийн амьдралын туршлага, залуу насны сэтгэл зүйтэй холбон гүнзгий эргэцүүлсэн бол.\n1 оноо: Эргэцүүлэл дутуу бол.\n0 оноо: Буруу хариулсан бол."
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
      return NextResponse.json({ error: `OpenRouter API Алдаа: ${data.error?.message || JSON.stringify(data)}` }, { status: 500 });
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