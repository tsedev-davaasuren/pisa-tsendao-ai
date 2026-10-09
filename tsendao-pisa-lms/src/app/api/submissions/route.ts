import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/lib/auth";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Нэвтрэх шаардлагатай." },
        { status: 401 }
      );
    }

    const { taskId, selectedOptionId } = await req.json();

    if (!taskId || !selectedOptionId) {
      return NextResponse.json(
        { error: "Мэдээлэл дутуу байна." },
        { status: 400 }
      );
    }

    // Сонгосон сонголт зөв эсэхийг шалгах
    const option = await prisma.option.findUnique({
      where: { id: selectedOptionId },
    });

    if (!option) {
      return NextResponse.json(
        { error: "Сонголт олдсонгүй." },
        { status: 404 }
      );
    }

    // Хариултыг DB-д хадгалах
    const submission = await prisma.submission.create({
      data: {
        userId: (session.user as any).id,
        taskId,
        selectedOptionId,
        isCorrect: option.isCorrect,
      },
    });

    return NextResponse.json({
      success: true,
      isCorrect: option.isCorrect,
      submissionId: submission.id,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Хариулт хадгалахад алдаа гарлаа." },
      { status: 500 }
    );
  }
}