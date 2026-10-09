import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Тухайн Blueprint-ийг ID-аар авах
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const blueprint = await prisma.blueprint.findUnique({
      where: { id },
    });

    if (!blueprint) {
      return NextResponse.json(
        { error: "Blueprint олдсонгүй" },
        { status: 404 }
      );
    }

    return NextResponse.json(blueprint);
  } catch (error) {
    return NextResponse.json(
      { error: "Серверийн алдаа гарлаа" },
      { status: 500 }
    );
  }
}

// PATCH: Blueprint мэдээллийг шинэчлэх
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updatedBlueprint = await prisma.blueprint.update({
      where: { id },
      data: { ...body },
    });

    return NextResponse.json(updatedBlueprint);
  } catch (error) {
    return NextResponse.json(
      { error: "Blueprint шинэчлэхэд алдаа гарлаа" },
      { status: 500 }
    );
  }
}

// DELETE: Blueprint устгах
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.blueprint.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Амжилттай устгагдлаа" });
  } catch (error) {
    return NextResponse.json(
      { error: "Blueprint устгахад алдаа гарлаа" },
      { status: 500 }
    );
  }
}