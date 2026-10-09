import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = Number(searchParams.get('userId'));

    // Багшийн мэдээллийг татах
    const teacher = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!teacher) {
      return NextResponse.json({ success: false, error: 'Багш олдсонгүй' }, { status: 404 });
    }

    let answers;

    // 1. АРГА ЗҮЙЧ БАГШ: Зөвхөн өөрийн заадаг хичээлийн сорил, дүнг харна
    if (teacher.role === 'METHODOLOGIST' && teacher.subject) {
      answers = await prisma.studentAnswer.findMany({
        where: {
          task: {
            subject: teacher.subject, // Зөвхөн тухайн багшийн хичээл
          },
        },
        include: { student: true, task: true },
      });
    } 
    // 2. АУБ болон БАГИЙН АХЛАГЧ (Цэндао багш): Бүх хичээлийн 20 сурагчийн дүнг харна
    else if (teacher.role === 'CLASS_TEACHER' || teacher.role === 'TEAM_LEAD') {
      answers = await prisma.studentAnswer.findMany({
        include: { student: true, task: true },
      });
    }

    return NextResponse.json({
      success: true,
      role: teacher.role,
      subjectFilter: teacher.subject || 'ALL_SUBJECTS',
      data: answers,
    });

  } catch (error) {
    return NextResponse.json({ success: false, error: 'Дата татахад алдаа гарлаа' }, { status: 500 });
  }
}