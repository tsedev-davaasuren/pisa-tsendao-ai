import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const answers = await prisma.studentAnswer.findMany({
      include: {
        student: true,
        task: true,
      },
      orderBy: { studentId: 'asc' },
    });
    return NextResponse.json({ success: true, data: answers });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Алдаа гарлаа' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { studentId, taskId, score, feedback, gradedBy } = body;

    const answer = await prisma.studentAnswer.upsert({
      where: {
        studentId_taskId: { studentId, taskId },
      },
      update: {
        score,
        feedback,
        gradedBy: gradedBy || 'Цэндао багш',
        isGraded: true,
      },
      create: {
        studentId,
        taskId,
        questionTitle: `PISA Сорил #${taskId} хариулт`,
        studentAnswerText: 'Сурагчийн ирүүлсэн хариулт...',
        score,
        feedback,
        gradedBy: gradedBy || 'Цэндао багш',
        isGraded: true,
      },
    });

    return NextResponse.json({ success: true, data: answer });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Зөвлөмж хадгалахад алдаа гарлаа' }, { status: 500 });
  }
}