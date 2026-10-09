import { NextResponse } from 'next/server';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { studentName, assignment, mcqAnswer, openAnswers } = await req.json();

    if (!assignment) {
      return NextResponse.json({ error: 'Даалгаврын мэдээлэл олдсонгүй.' }, { status: 400 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY?.trim() || process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) {
      return NextResponse.json({ error: 'OPENROUTER_API_KEY тохируулагдаагүй байна.' }, { status: 500 });
    }

    // 1. Сонгох тест (MCQ) шалгах
    const mcqCorrect = mcqAnswer === assignment.mcq.correctIndex;
    const mcqScore = mcqCorrect ? 1 : 0;

    // 2. Задгай асуултуудыг AI ба Рубрикаар шалгах промпт
    const prompt = `
Та бол PISA Унших чадварын сорил үнэлээч ахлах багш юм.
Сурагчийн задгай асуултуудад бичсэн хариултыг Багшийн Үнэлгээний Рубриктэй яг таг тулгаж, асуулт бүрт оноо болон тодорхой тайлбар (feedback) өгнө үү.

Унших эх:
"""
${assignment.readingText}
"""

[ШАЛГАХ АСУУЛТУУД БА СУРАГЧИЙН ХАРИУЛТУУД]
${assignment.openQuestions.map((q: any, idx: number) => `
Асуулт #${idx + 1} (${q.category \vert{}\vert{} 'Задгай'}): ${q.question}
Багшийн Рубрик (Шалгуур):
${q.rubric}
Сурагчийн хариулт: "${openAnswers[q.id || idx] || 'Хариулаагүй/Хоосон'}"
`).join('\n---\n')}

[ҮНЭЛГЭЭНИЙ ДҮРЭМ]
- Задгай #1 (Асуулт 1): Максимал 1 оноо (1 эсвэл 0)
- Задгай #2 ба #3 (Асуулт 2, 3): Максимал 2 оноо (2, 1, 0)
- Задгай #4 ба #5 (Асуулт 4, 5): Максимал 3 оноо (3, 2, 1, 0)
- Тайлбарыг сурагчид ойлгомжтой, Монгол хэлээр найруулж бичнэ.

Заавал дараах цэвэр JSON форматаар хариулна уу:
{
  "evaluatedQuestions": [
    {
      "questionId": 1,
      "score": 1,
      "maxScore": 1,
      "feedback": "Эхээс баримтыг тодорхой заан оновчтой хариулсан."
    },
    {
      "questionId": 2,
      "score": 2,
      "maxScore": 2,
      "feedback": "Бөөдэйн ааш зангийн өөрчлөлтийг эхийн агуулгаар задлан шинжилсэн."
    },
    {
      "questionId": 3,
      "score": 2,
      "maxScore": 2,
      "feedback": "Хүүгийн сэтгэл зүйн өөрчлөлт, атаархлыг тодорхой бичсэн."
    },
    {
      "questionId": 4,
      "score": 3,
      "maxScore": 3,
      "feedback": "Манан шиг сарнисан далд утгыг гүнзгий эргэцүүлэн дүгнэсэн."
    },
    {
      "questionId": 5,
      "score": 3,
      "maxScore": 3,
      "feedback": "Өөрийн туршлагатай холбон амьдралын сургамжийг оновчтой дүгнэсэн."
    }
  ]
}
`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json; charset=utf-8',
        'HTTP-Referer': 'https://tsendao-pisa-lms.vercel.app',
        'X-Title': 'PISA LMS',
      },
      body: JSON.stringify({
        models: ['google/gemini-2.0-flash-001', 'google/gemini-flash-1.5'],
        temperature: 0.1,
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' }
      })
    });

    const data = await response.json();
    const resultText = data.choices?.[0]?.message?.content;

    if (!resultText) {
      return NextResponse.json({ error: 'AI үнэлгээ гаргаж чадсангүй.' }, { status: 500 });
    }

    const aiEval = JSON.parse(resultText);

    // Нийт оноо тооцох (MCQ 1 оноо + Задгай 11 оноо = Нийт 12 оноо)
    const openTotal = aiEval.evaluatedQuestions.reduce((acc: number, curr: any) => acc + curr.score, 0);
    const totalScore = mcqScore + openTotal;

    const submissionResult = {
      id: `sub-${Date.now()}`,
      studentName: studentName || 'Сурагч',
      submittedAt: new Date().toLocaleString(),
      assignmentTitle: assignment.title,
      totalScore,
      maxScore: 12,
      percentage: Math.round((totalScore / 12) * 100),
      mcqResult: {
        selected: mcqAnswer,
        correctIndex: assignment.mcq.correctIndex,
        isCorrect: mcqCorrect,
        score: mcqScore
      },
      openResults: aiEval.evaluatedQuestions,
      openAnswers
    };

    return NextResponse.json(submissionResult);

  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Үнэлгээ хийхэд алдаа гарлаа.' }, { status: 500 });
  }
}