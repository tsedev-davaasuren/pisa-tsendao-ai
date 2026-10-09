import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Мэдээллээ бүрэн оруулна уу." },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Энэ имэйл хаяг хэдийн бүртгэгдсэн байна." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || "STUDENT",
      },
    });

    return NextResponse.json({ success: true, userId: user.id });
  } catch (error) {
    return NextResponse.json(
      { error: "Бүртгэхэд алдаа гарлаа." },
      { status: 500 }
    );
  }
}