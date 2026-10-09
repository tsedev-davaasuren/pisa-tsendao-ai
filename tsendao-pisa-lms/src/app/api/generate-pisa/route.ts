import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { readingText, title } = await req.json();

    if (!readingText) {
      return NextResponse.json({ error: 'Эх бичвэр оруулна уу.' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY Vercel дээр тохируулагдаагүй байна.' }, { status: 500 });
    }

    const prompt = `
Та бол PISA (Program for International Student Assessment) унших чадварын сорил боловсруулагч багш юм.
Дараах эх бичвэрт үндэслэн PISA Блюпринтийн дагуу даалгавар ба үнэлгээний рубрик боловсруул.

Гарчиг: ${title || 'PISA Сорил'}
Эх бичвэр:
"""
${readingText}
"""

Шаардлага:
1. 1 Сонгох асуулт (4 сонголттой, зөв хариултын индексийг 0-3 хооронд заана)
2. 5 Задгай асуулт (Сурагчийн уншин ойлгох, шүүмжлэлт сэтгэлгээ, задлан шинжлэх чадварыг сорьсон)
3. Задгай асуулт тус бүрт 0-2 онооны Үнэлгээний рубрик (шалгуур)-ийг тодорхой бичнэ.

Хариултыг заавал дараах цэвэр JSON форматаар буцаана уу (Нэмэлт тайлбар текстгүй):

{
  "mcq": {
    "question": "Сонгох асуултын текст...",
    "options": ["Сонголт А", "Сонголт Б", "Сонголт В", "Сонголт Г"],
    "correctIndex": 0
  },
  "openQuestions": [
    {
      "id": 1,
      "question": "Задгай асуулт 1...",
      "rubric": "2 оноо: Бүрэн зөв тайлбарласан... | 1 оноо: Дутуу тайлбарласан... | 0 оноо: Буруу эсвэл хариулаагүй"
    },
    {
      "id": 2,
      "question": "Задгай асуулт 2...",
      "rubric": "2 оноо: ... | 1 оноо: ... | 0 оноо: ..."
    },
    {
      "id": 3,
      "question": "Задгай асуулт 3...",
      "rubric": "2 оноо: ... | 1 оноо: ... | 0 оноо: ..."
    },
    {
      "id": 4,
      "question": "Задгай асуулт 4...",
      "rubric": "2 оноо: ... | 1 оноо: ... | 0 оноо: ..."
    },
    {
      "id": 5,
      "question": "Задгай асуулт 5...",
      "rubric": "2 оноо: ... | 1 оноо: ... | 0 оноо: ..."
    }
  ]
}
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' }
        }),
      }
    );

    const data = await response.json();

    // Google-ээс ямар нэгэн алдаа буцаасан бол тэрийг мэдээлнэ
    if (data.error) {
      return NextResponse.json({ error: `Gemini API Алдаа: ${data.error.message}` }, { status: 500 });
    }

    const textResult = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textResult) {
      return NextResponse.json({ error: 'AI хариу буцааж чадсангүй.' }, { status: 500 });
    }

    const parsedData = JSON.parse(textResult);
    return NextResponse.json(parsedData);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Алдаа гарлаа.' }, { status: 500 });
  }
}