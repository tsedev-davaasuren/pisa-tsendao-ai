import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const taskId = parseInt(params.id);
    const body = await request.json(); // { status: "approved" | "under_review" | "draft" }

    const updatedTask = await prisma.pisaTask.update({
      where: { id: taskId },
      data: { status: body.status },
    });

    return NextResponse.json({ success: true, data: updatedTask });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Блюпринт шинэчлэхэд алдаа гарлаа' }, { status: 500 });
  }
}