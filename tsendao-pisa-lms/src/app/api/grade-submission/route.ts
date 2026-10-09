import { NextResponse } from 'next/server';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { studentName, className, assignment, mcqAnswer, openAnswers } = await req.json();

    if (!assignment) {
      return NextResponse.json({ error: 'Даалгаврын мэдээлэл олдсонгүй.' }, { status: 400 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY?.trim() || process.env.GEMINI_API_KEY?.trim();

    // MCQ шалгах (1 оноо)
    const isMcqCorrect = mcqAnswer === assignment.mcq.correctIndex;
    const mcqScore = isMcqCorrect ? 1 : 0;

    const maxScores = [1, 2, 2, 3, 3]; // Задгай 5 асуултын оноо (Нийт 11 + MCQ 1 = 12 оноо)
    
    // API Key байхгүй эсвэл сүлжээний доголдолд шууд локал засалт хийх backup
    if (!apiKey) {
      let openTotal = 0;
      const openResults = assignment.openQuestions.map((q: any, idx: number) => {
        const ans = openAnswers[q.id || idx] || '';
        const maxSc = maxScores[idx] || 2;
        const score = ans.trim().length > 15 ? maxSc : ans.trim().length > 0 ? 1 : 0;
        openTotal += score;
        return {
          questionId: q.id || idx + 1,
          questionText: q.question,
          maxScore: maxSc,
          score: score,
          studentAnswer: ans,
          feedback: score === maxSc
            ? 'ЦэндАО AI: Рубрикийн шалгуурыг бүрэн хангаж оновчтой хариулсан байна.'
            : score > 0
            ? 'ЦэндАО AI: Хариулт тодорхой боловч эхээс эш татах баримт дутуу байна.'
            : 'ЦэндАО AI: Хариулт хангалтгүй эсвэл орхисон байна.'
        };
      });

      const totalScore = mcqScore + openTotal;

      return NextResponse.json({
        id: `sub-${Date.now()}`,
        studentName: studentName || 'Сурагч',
        className: className || '9Е анги',
        submittedAt: new Date().toLocaleString(),
        assignmentTitle: assignment.title || 'Арван долоотой байхад',
        mcqScore: mcqScore,
        mcqQuestion: assignment.mcq.question,
        mcqAnswer: assignment.mcq.options[mcqAnswer] || 'Сонгоогүй',
        isMcqCorrect: isMcqCorrect,
        openResults: openResults,
        totalScore: totalScore,
        maxScore: 12,
        status: 'Шалгасан'
      });
    }

    // AI засалт хийх промпт
    const prompt = `
Та бол PISA Унших чадварын олон улсын сорил үнэлээч ахлах багш юм.
Сурагчийн задгай 5 асуултын хариултыг Багшийн Үнэлгээний Рубриктэй тулгаж, асуулт бүрт оноо болон ЦэндАО AI-ийн зөвлөмж тайлбар өгнө үү.

Эх бичвэр:
"""
${assignment.readingText}
"""

[ШАЛГАХ АСУУЛТУУД БА РУБРИК]
${assignment.openQuestions.map((q: any, idx: number) => `
Задгай #${idx + 1} (Макс оноо: ${maxScores[idx]}):${q.question}
Багшийн Рубрик: ${q.rubric}
Сурагчийн хариулт: "${openAnswers[q.id || idx] || 'Хариулаагүй/Хоосон'}"
`).join('\n---\n')}

Заавал дараах цэвэр JSON форматаар хариулна уу:
{
  "evaluatedQuestions": [
    {
      "questionId": 1,
      "score": 1,
      "maxScore": 1,
      "feedback": "ЦэндАО AI Зөвлөмж: ..."
    },
    {
      "questionId": 2,
      "score": 2,
      "maxScore": 2,
      "feedback": "ЦэндАО AI Зөвлөмж: ..."
    },
    {
      "questionId": 3,
      "score": 2,
      "maxScore": 2,
      "feedback": "ЦэндАО AI Зөвлөмж: ..."
    },
    {
      "questionId": 4,
      "score": 3,
      "maxScore": 3,
      "feedback": "ЦэндАО AI Зөвлөмж: ..."
    },
    {
      "questionId": 5,
      "score": 3,
      "maxScore": 3,
      "feedback": "ЦэндАО AI Зөвлөмж: ..."
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
      throw new Error('AI хариулт хоосон ирлээ.');
    }

    const aiEval = JSON.parse(resultText);

    const openResults = assignment.openQuestions.map((q: any, idx: number) => {
      const evalItem = aiEval.evaluatedQuestions?.[idx] || {};
      return {
        questionId: q.id || idx + 1,
        questionText: q.question,
        maxScore: maxScores[idx] || 2,
        score: evalItem.score ?? 1,
        studentAnswer: openAnswers[q.id || idx] || 'Хариулаагүй',
        feedback: evalItem.feedback || 'ЦэндАО AI Зөвлөмж: Рубрикийн шалгуурын дагуу үнэлэв.'
      };
    });

    const openTotal = openResults.reduce((acc: number, curr: any) => acc + curr.score, 0);
    const totalScore = mcqScore + openTotal;

    return NextResponse.json({
      id: `sub-${Date.now()}`,
      studentName: studentName || 'Сурагч',
      className: className || '9Е анги',
      submittedAt: new Date().toLocaleString(),
      assignmentTitle: assignment.title || 'Арван долоотой байхад',
      mcqScore: mcqScore,
      mcqQuestion: assignment.mcq.question,
      mcqAnswer: assignment.mcq.options[mcqAnswer] || 'Сонгоогүй',
      isMcqCorrect: isMcqCorrect,
      openResults: openResults,
      totalScore: totalScore,
      maxScore: 12,
      status: 'Шалгасан'
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Үнэлгээ хийхэд алдаа гарлаа.' }, { status: 500 });
  }
}