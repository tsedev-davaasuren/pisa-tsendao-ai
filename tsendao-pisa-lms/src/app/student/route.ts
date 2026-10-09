import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Сурагчдын жагсаалт авах
export async function GET() {
  try {
    const students = await (prisma as any).student.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(students);
  } catch (error) {
    return NextResponse.json(
      { error: "Сурагчдын жагсаалтыг авахад алдаа гарлаа" },
      { status: 500 }
    );
  }
}

// POST: Сурагч шинээр үүсгэх эсвэл олноор нь upsert хийх
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Массив ирвэл олноор нь шинэчлэх/нэмэх
    if (Array.isArray(body)) {
      const results = [];
      for (const st of body) {
        const student = await (prisma as any).student.upsert({
          where: { email: st.email || "" } as any,
          update: { ...st },
          create: { ...st },
        });
        results.push(student);
      }
      return NextResponse.json(results);
    }

    // Нэг сурагч нэмэх
    const student = await (prisma as any).student.create({
      data: body,
    });

    return NextResponse.json(student);
  } catch (error) {
    return NextResponse.json(
      { error: "Сурагчийн мэдээлэл хадгалахад алдаа гарлаа" },
      { status: 500 }
    );
  }
}