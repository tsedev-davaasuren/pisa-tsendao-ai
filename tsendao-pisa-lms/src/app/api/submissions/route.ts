import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const submissions = await prisma.studentAnswer.findMany({
      include: {
        student: true,
        task: true,
      },
    });
    return NextResponse.json({ success: true, data: submissions });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Илгээсэн хариултуудыг татахад алдаа гарлаа' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { studentId, taskId, score, feedback, gradedBy } = body;

    const updated = await prisma.studentAnswer.upsert({
      where: {
        studentId_taskId: {
          studentId: Number(studentId),
          taskId: Number(taskId),
        },
      },
      update: {
        score: Number(score),
        feedback: feedback || '',
        gradedBy: gradedBy || 'Багш',
        isGraded: true,
      },
      create: {
        studentId: Number(studentId),
        taskId: Number(taskId),
        score: Number(score),
        feedback: feedback || '',
        gradedBy: gradedBy || 'Багш',
        isGraded: true,
        studentAnswerText: body.studentAnswerText || '',
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Дүн хадгалахад алдаа гарлаа' },
      { status: 500 }
    );
  }
}