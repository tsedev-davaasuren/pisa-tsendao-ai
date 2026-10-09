// @ts-nocheck
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Build үед static ачаалахаас сэргийлж dynamic горимд оруулна
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const answers = await (prisma as any).pisaAnswer.findMany();
    return NextResponse.json(answers);
  } catch (error) {
    return NextResponse.json(
      { error: "Өгөгдөл татахад алдаа гарлаа" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const answer = await (prisma as any).pisaAnswer.create({
      data: body,
    });
    return NextResponse.json(answer);
  } catch (error) {
    return NextResponse.json(
      { error: "Хариулт хадгалахад алдаа гарлаа" },
      { status: 500 }
    );
  }
}