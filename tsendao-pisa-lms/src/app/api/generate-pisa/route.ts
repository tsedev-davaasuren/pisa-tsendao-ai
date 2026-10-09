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

    // 1. Google API-аас идэвхтэй загваруудыг авах
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

    // generateContent дэмждэг бүх загваруудыг шүүж авах
    const availableModels = (listData.models || [])
      .filter((m: any) => m.supportedGenerationMethods?.includes('generateContent'))
      .map((m: any) => m.name);

    if (availableModels.length === 0) {
      return NextResponse.json(
        { error: 'Таны API түлхүүрт ажиллах боломжтой Gemini загвар олдсонгүй.' },
        { status: 500 }
      );
    }

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

    let responseText = '';
    let lastError = '';

    // 2. Олдсон загваруудыг ажиллах хүртэл нь дараалуулан турших
    for (const modelName of availableModels) {
      try {
        const genRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/${modelName}:generateContent?key=${apiKey}`,
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

        if (genRes.ok && genData.candidates?.[0]?.content?.parts?.[0]?.text) {
          responseText = genData.candidates[0].content.parts[0].text;
          break; // Амжилттай үүссэн бол давталтыг зогсооно
        } else {
          lastError = genData.error?.message || `Status: ${genRes.status}`;
        }
      } catch (err: any) {
        lastError = err.message;
      }
    }

    if (!responseText) {
      return NextResponse.json(
        { error: `Gemini API Алдаа: ${lastError}` },
        { status: 500 }
      );
    }

    return NextResponse.json(JSON.parse(responseText));

  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Сүлжээний алдаа гарлаа.' }, { status: 500 });
  }
}