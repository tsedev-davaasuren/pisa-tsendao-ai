import { NextResponse } from 'next/server';

// Vercel хугацааны хязгаарлалтыг уртасгах
export const maxDuration = 15;

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
Та бол PISA унших чадварын сорил боловсруулагч багш юм. Дараах эхэд үндэслэн PISA асуулт ба үнэлгээний рубрик боловсруул.

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

    // Шууд Gemini API руу залгах
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
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

    if (data.error) {
      return NextResponse.json({ error: `Gemini API: ${data.error.message}` }, { status: 500 });
    }

    const textResult = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!textResult) {
      return NextResponse.json({ error: 'AI хариу буцаасангүй.' }, { status: 500 });
    }

    return NextResponse.json(JSON.parse(textResult));
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Сүлжээний алдаа гарлаа.' }, { status: 500 });
  }
}