import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message, taskContext } = await req.json();

    // API Key шаардлагагүй туршилтын Socratic багшийн хариултууд
    const mockResponses = [
      `Таны асуусан "${message}" дээр үндэслэн зааварлахад: Даалгаврын эх бичвэрт байгаа гол баримтуудыг анхааралтай харьцуулж уншаарай.`,
      `Шууд хариултыг хэлэх боломжгүй ч, эх бичвэрийн сүүлийн өгүүлбэрүүд дээрх өөрчлөлтийг ажиглаад хариултаа дахин нэг нягтлаарай.`,
      `Сайн асуулт байна! Сонголтуудаас аль нь эх бичвэрийн агуулгатай ХАМГИЙН ойр тусгагдсан байна вэ?`,
    ];

    // Санамсаргүй байдлаар нэг хариултыг сонгож буцаах
    const randomReply =
      mockResponses[Math.floor(Math.random() * mockResponses.length)];

    return NextResponse.json({
      text: `(Туршилтын горим) ${randomReply}`,
    });
  } catch (error) {
    return NextResponse.json(
      { text: "Алдаа гарлаа. Дахин оролдоно уу." },
      { status: 500 }
    );
  }
}