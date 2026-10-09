import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Асуулт/Сонголт санамсаргүй холих функц (Fisher-Yates Shuffle)
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export async function POST(request: Request) {
  try {
    const { studentId, taskId } = await request.json();

    // 1. Өнөөдрийн огноог эхлэх болон дуусах хугацаагаар тодорхойлох (00:00 - 23:59)
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // 2. Сурагч өнөөдөр аль нэг сорил өгсөн эсэхийг баазаас шалгах
    const todayAttemptCount = await prisma.testAttempt.count({
      where: {
        studentId: studentId,
        attemptDate: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    });

    // Хэрэв өнөөдөр 1 ба түүнээс дээш сорил өгсөн бол БЛОКЛОНО
    if (todayAttemptCount >= 1) {
      return NextResponse.json({
        success: false,
        error: 'Та өнөөдөр 1 сорил ажилласан байна. Дүрмийн дагуу дараагийн сорилыг маргааш ажиллана уу!',
      }, { status: 403 });
    }

    // 3. Сорилын датаг татаж асуулт, сонголтыг холих
    const task = await prisma.pisaTask.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      return NextResponse.json({ success: false, error: 'Сорил олдсонгүй.' }, { status: 404 });
    }

    // Сорил эхлүүлснийг баазад бүртгэх
    await prisma.testAttempt.create({
      data: {
        studentId: studentId,
        taskId: taskId,
      },
    });

    // Жишээ асуултуудыг тухайн сурагчид зориулж байршлыг нь холих
    const rawQuestions = [
      { id: 1, text: 'Эх сурвалжийн гол далд утгыг сонгоно уу.', options: ['А хувилбар', 'Б хувилбар', 'В хувилбар', 'Г хувилбар'] },
      { id: 2, text: 'Графикаас үзэхэд ямар дүгнэлт хийж болох вэ?', options: ['Загвар 1', 'Загвар 2', 'Загвар 3', 'Загвар 4'] }
    ];

    const randomizedQuestions = rawQuestions.map(q => ({
      ...q,
      options: shuffleArray(q.options) // Сонголтыг холих
    }));

    return NextResponse.json({
      success: true,
      data: {
        task,
        questions: shuffleArray(randomizedQuestions) // Асуултын дарааллыг бас холих
      }
    });

  } catch (error) {
    return NextResponse.json({ success: false, error: 'Серверийн алдаа гарлаа.' }, { status: 500 });
  }
}