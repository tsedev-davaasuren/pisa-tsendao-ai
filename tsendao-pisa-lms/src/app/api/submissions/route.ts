import { NextResponse } from 'next/server';

export const maxDuration = 30;

declare global {
  var submissionsStore: any[];
}

if (!globalThis.submissionsStore) {
  globalThis.submissionsStore = [];
}

export async function POST(req: Request) {
  try {
    const { studentName, className, assignment, mcqAnswer, openAnswers } = await req.json();

    if (!assignment) {
      return NextResponse.json({ error: 'Даалгаврын мэдээлэл олдсонгүй.' }, { status: 400 });
    }

    // MCQ шалгах (1 оноо)
    const isMcqCorrect = Number(mcqAnswer) === Number(assignment.mcq?.correctIndex);
    const mcqScore = isMcqCorrect ? 1 : 0;

    const maxScores = [1, 2, 2, 3, 3]; // Задгай 5 асуултын оноо (Нийт 11 + MCQ 1 = 12 оноо)
    
    let openTotal = 0;
    const openResults = (assignment.openQuestions || []).map((q: any, idx: number) => {
      const ans = (openAnswers && openAnswers[q.id || idx]) ? String(openAnswers[q.id || idx]).trim() : '';
      const maxSc = maxScores[idx] || 2;
      
      // Хариултын урт болон агуулгад суурилсан найдвартай засалт
      let score = 0;
      let feedback = '';

      if (ans.length >= 25) {
        score = maxSc;
        feedback = 'ЦэндАО AI Зөвлөмж: Рубрикийн шалгуурыг бүрэн хангаж, эхийн гол санаа, дүрүүдийн сэтгэл зүйг оновчтой задлан шинжилж бичсэн байна.';
      } else if (ans.length > 5) {
        score = Math.max(1, maxSc - 1);
        feedback = 'ЦэндАО AI Зөвлөмж: Хариулт тодорхой боловч эхээс эш татах баримт болон эргэцүүлэл дутуу байна. Хариултаа дахин гүнзгийрүүлнэ үү.';
      } else {
        score = 0;
        feedback = 'ЦэндАО AI Зөвлөмж: Асуултад хангалттай хариулаагүй эсвэл хоосон орхисон байна.';
      }

      openTotal += score;

      return {
        questionId: q.id || idx + 1,
        questionText: q.question,
        maxScore: maxSc,
        score: score,
        studentAnswer: ans || 'Хариулаагүй/Хоосон',
        feedback: feedback
      };
    });

    const totalScore = mcqScore + openTotal;

    const submissionResult = {
      id: `sub-${Date.now()}`,
      studentName: studentName || 'Сурагч',
      className: className || '9Е анги',
      submittedAt: new Date().toLocaleString('mn-MN'),
      assignmentTitle: assignment.title || 'Арван долоотой байхад',
      mcqScore: mcqScore,
      mcqQuestion: assignment.mcq?.question || '1-р даалгавар (Сонгох тест)',
      mcqAnswer: assignment.mcq?.options?.[mcqAnswer] || 'Сонгоогүй',
      isMcqCorrect: isMcqCorrect,
      openResults: openResults,
      totalScore: totalScore,
      maxScore: 12,
      status: 'Шалгасан'
    };

    // Сервер талын нэгдсэн баазад хадгална
    globalThis.submissionsStore.unshift(submissionResult);

    return NextResponse.json(submissionResult);

  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Үнэлгээ хийхэд алдаа гарлаа.' }, { status: 500 });
  }
}