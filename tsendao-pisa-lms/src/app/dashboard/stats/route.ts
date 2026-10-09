import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const totalStudents = await prisma.student.count();
    const totalTasks = await prisma.pisaTask.count();
    const totalAnswers = await prisma.studentAnswer.count();
    const gradedAnswers = await prisma.studentAnswer.count({
      where: { isGraded: true },
    });

    const avgScoreResult = await prisma.studentAnswer.aggregate({
      _avg: { score: true },
      where: { isGraded: true },
    });

    return NextResponse.json({
      success: true,
      data: {
        totalStudents,
        totalTasks,
        totalAnswers,
        gradedAnswers,
        progressPercentage: totalAnswers > 0 ? Math.round((gradedAnswers / totalAnswers) * 100) : 0,
        averageScore: (avgScoreResult._avg.score || 0).toFixed(1),
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Дата татахад алдаа гарлаа' }, { status: 500 });
  }
}