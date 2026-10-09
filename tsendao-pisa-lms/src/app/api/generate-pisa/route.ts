import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const maxDuration = 30;

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

    const genAI = new GoogleGenerativeAI(apiKey);

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

    // Идэвхтэй байж болох загваруудыг дараалуулан турших
    const candidateModels = [
      'gemini-2.0-flash',
      'gemini-1.5-flash-latest',
      'gemini-1.5-flash-002',
      'gemini-1.5-pro'
    ];

    let responseText = '';
    let lastError = null;

    for (const modelName of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            responseMimeType: 'application/json',
          },
        });
        const result = await model.generateContent(prompt);
        responseText = result.response.text();
        if (responseText) break;
      } catch (err: any) {
        lastError = err.message;
      }
    }

    if (!responseText) {
      return NextResponse.json({ error: `Gemini SDK Алдаа: ${lastError}` }, { status: 500 });
    }

    return NextResponse.json(JSON.parse(responseText));
  } catch (error: any) {
    console.error('Gemini SDK Error:', error);
    return NextResponse.json(
      { error: `Gemini SDK Алдаа: ${error.message || 'Алдаа гарлаа.'}` },
      { status: 500 }
    );
  }
}