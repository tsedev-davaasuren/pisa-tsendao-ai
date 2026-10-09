import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Хариултуудын жагсаалт авах
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId");
    const taskId = searchParams.get("taskId");

    const whereFilter: any = {};
    if (studentId) whereFilter.studentId = Number(studentId);
    if (taskId) whereFilter.taskId = Number(taskId);

    const submissions = await (prisma as any).submission.findMany({
      where: whereFilter,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(submissions);
  } catch (error) {
    return NextResponse.json(
      { error: "Хариултуудыг авахад алдаа гарлаа" },
      { status: 500 }
    );
  }
}

// POST: Шинэ хариулт үүсгэх эсвэл үнэлгээ хадгалах
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      studentId,
      taskId,
      score,
      feedback,
      gradedBy,
      questionTitle,
      studentAnswer,
      aiRecommendation,
      maxScore,
    } = body;

    const dataPayload: any = {
      studentId: Number(studentId) || 0,
      taskId: Number(taskId) || 0,
      score: Number(score) || 0,
      feedback: feedback || "",
      gradedBy: gradedBy || "",
      isGraded: true,
      questionTitle: questionTitle || "",
      studentAnswer: studentAnswer || "",
      aiRecommendation: aiRecommendation || "",
      maxScore: Number(maxScore) || 0,
    };

    const submission = await (prisma as any).submission.create({
      data: dataPayload,
    });

    return NextResponse.json(submission);
  } catch (error) {
    return NextResponse.json(
      { error: "Хариулт хадгалахад алдаа гарлаа" },
      { status: 500 }
    );
  }
}