import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { studentId, taskId } = body;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 2. Сурагч өнөөдөр аль нэг сорил өгсөн эсэхийг баазаас шалгах
    const todayAttemptCount = await (prisma as any).testAttempt.count({
      where: {
        studentId: Number(studentId) || studentId,
        ...(taskId ? { taskId: Number(taskId) || taskId } : {}),
      },
    });

    const newAttempt = await (prisma as any).testAttempt.create({
      data: {
        studentId: Number(studentId) || studentId,
        ...(taskId ? { taskId: Number(taskId) || taskId } : {}),
        status: "STARTED",
      },
    });

    return NextResponse.json({
      todayAttemptCount,
      attempt: newAttempt,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Сорил эхлүүлэхэд алдаа гарлаа" },
      { status: 500 }
    );
  }
}