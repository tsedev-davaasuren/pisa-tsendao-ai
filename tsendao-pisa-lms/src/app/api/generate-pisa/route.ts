import { NextResponse } from 'next/server';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { readingText, title } = await req.json();

    if (!readingText) {
      return NextResponse.json({ error: 'Эх бичвэр оруулна уу.' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY тохируулагдаагүй байна.' }, { status: 500 });
    }

    // 1. Google API-аас энэ API Key дээр зөвшөөрөгдсөн загваруудын жагсаалтыг авна
    const listRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );
    const listData = await listRes.json();

    if (!listRes.ok) {
      return NextResponse.json(
        { error: `Google API Алдаа (${listRes.status}): ${listData.error?.message || JSON.stringify(listData)}` },
        { status: 500 }
      );
    }

    // Идэвхтэй бөгөөд асуулт үүсгэж чадах загварыг хайж олох
    const availableModels = listData.models || [];
    const validModel = availableModels.find((m: any) =>
      m.supportedGenerationMethods?.includes('generateContent') &&
      (m.name.includes('flash') || m.name.includes('pro'))
    );

    if (!validModel) {
      return NextResponse.json(
        { error: `Таны API түлхүүрт идэвхтэй Gemini загвар олдсонгүй. Боломжит загварууд: ${JSON.stringify(availableModels.map((m: any) => m.name))}` },
        { status: 500 }
      );
    }

    const modelEndpoint = validModel.name; // Жишээ нь: "models/gemini-1.5-flash"

    // 2. Олдсон идэвхтэй загвар руу PISA даалгавар үүсгэх хүсэлт явуулна
    const prompt = `
Та бол PISA унших чадварын сорил боловсруулагч багш юм. Дараах эх бичвэрт үндэслэн PISA асуулт ба үнэлгээний рубрик боловсруул.

Гарчиг: ${title || 'PISA Сорил'}
Эх бичвэр:
"""
${readingText}
"""

Шаардлага:
1. 1 Сонгох асуулт (4 сонголттой, correctIndex: 0-3)
2. 5 Задгай асуулт ба асуулт бүрт 0-2 онооны Үнэлгээний рубрик

Хариултыг заавал дараах цэвэр JSON форматаар буцаа:
{
  "mcq": {
    "question": "Асуулт...",
    "options": ["А", "Б", "В", "Г"],
    "correctIndex": 0
  },
  "openQuestions": [
    { "id": 1, "question": "Задгай 1...", "rubric": "2 оноо: ... | 1 оноо: ... | 0 оноо: ..." },
    { "id": 2, "question": "Задгай 2...", "rubric": "2 оноо: ... | 1 оноо: ... | 0 оноо: ..." },
    { "id": 3, "question": "Задгай 3...", "rubric": "2 оноо: ... | 1 оноо: ... | 0 оноо: ..." },
    { "id": 4, "question": "Задгай 4...", "rubric": "2 оноо: ... | 1 оноо: ... | 0 оноо: ..." },
    { "id": 5, "question": "Задгай 5...", "rubric": "2 оноо: ... | 1 оноо: ... | 0 оноо: ..." }
  ]
}
`;

    const genRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/${modelEndpoint}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' },
        }),
      }
    );

    const genData = await genRes.json();

    if (!genRes.ok) {
      return NextResponse.json(
        { error: `Gemini API Алдаа: ${genData.error?.message || 'Асуулт үүсгэж чадсангүй.'}` },
        { status: 500 }
      );
    }

    const responseText = genData.candidates?.[0]?.content?.parts?.[0]?.text;
    return NextResponse.json(JSON.parse(responseText));

  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Сүлжээний алдаа гарлаа.' }, { status: 500 });
  }
}