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
Та бол PISA унших чадварын олон улсын сорил боловсруулагч, туршлагатай шинжээч багш юм.
Өгөгдсөн эх бичвэрт ЖИНХЭНЭ АГУУЛГЫН ДҮН ШИНЖИЛГЭЭ хийж, PISA стандартын дагуу 6 даалгавар боловсруул.

Гарчиг: ${title || 'PISA Сорил'}
Эх бичвэр:
"""
${readingText}
"""

[PISA БЛЮПРИНТ БА ДААЛГАВРЫН СТРУКТУР]
1. Сонгох асуулт (1 ширхэг): Мэдээлэл олох түвшин (Retrieval). Эхээс шууд харах боломжтой баримтад суурилна. 4 сонголттой, 1 зөв хариулттай.
2. Задгай асуулт #1 & #2: Эх бичвэрээс тодорхой мэдээлэл олох, агуулгыг шууд ойлгох (Access & Retrieve).
3. Задгай асуулт #3 & #4: Дүрүүдийн сэтгэл зүй, үйлдэл, далд утгыг тайлбарлах, нэгтгэн дүгнэх (Integrate & Interpret).
4. Задгай асуулт #5: Эх бичвэрийн санаа, хэлбэрт дүгнэлт хийж, өөрийн амьдрал болон нийгэмтэй холбон эргэцүүлэн тусгах (Reflect & Evaluate).

[ҮНЭЛГЭЭНИЙ РУБРИК ДҮРЭМ]
Задгай асуулт бүрийн рубрикт "Тодорхой тайлбарласан", "Сайн хариулсан" гэх мэт ЕРӨНХИЙ ҮГ ЧАПТАРУУЛЖ БОЛОХГҮЙ!
Заавал тухайн өгүүллэгийн дүрүүдийн нэр, эхэд гарч буй бодит баримт, тодорхой санааг шалгуур болгон бичнэ.
- 2 оноо: [Эхийн бодит баримт болон гол санааг оновчтой тусгасан тодорхой хариултын түлхүүр]
- 1 оноо: [Эхийн санааг дутуу эсвэл хагас талыг нь тусгасан хариулт]
- 0 оноо: [Буруу, хамааралгүй эсвэл орхисон хариулт]

Заавал дараах цэвэр JSON форматаар хариулна уу:
{
  "mcq": {
    "question": "Сонгох асуулт...",
    "options": ["А сонголт", "Б сонголт", "В сонголт", "Г сонголт"],
    "correctIndex": 0
  },
  "openQuestions": [
    { "id": 1, "question": "Задгай асуулт 1...", "rubric": "2 оноо: [Өгүүллэгийн тодорхой баримт дурдсан бол] | 1 оноо: [Хагас дутуу бичсэн бол] | 0 оноо: [Буруу/хамааралгүй]" },
    { "id": 2, "question": "Задгай асуулт 2...", "rubric": "2 оноо: [Өгүүллэгийн тодорхой баримт дурдсан бол] | 1 оноо: [Хагас дутуу бичсэн бол] | 0 оноо: [Буруу/хамааралгүй]" },
    { "id": 3, "question": "Задгай асуулт 3...", "rubric": "2 оноо: [Дүрүүдийн харилцаа, сэтгэл зүйг оновчтой тайлбарласан бол] | 1 оноо: [Өнгөц тайлбарласан бол] | 0 оноо: [Буруу/хамааралгүй]" },
    { "id": 4, "question": "Задгай асуулт 4...", "rubric": "2 оноо: [Дүрүүдийн харилцаа, сэтгэл зүйг оновчтой тайлбарласан бол] | 1 оноо: [Өнгөц тайлбарласан бол] | 0 оноо: [Буруу/хамааралгүй]" },
    { "id": 5, "question": "Задгай асуулт 5...", "rubric": "2 оноо: [Зохиолын далд санаа, эргэцүүллийг үндэслэлтэй гаргасан бол] | 1 оноо: [Үндэслэл дулимаг бол] | 0 оноо: [Буруу/хамааралгүй]" }
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