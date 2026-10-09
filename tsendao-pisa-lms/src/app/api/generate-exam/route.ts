import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { passageTitle, passageContent } = await req.json();

    // API холболт шаардлагагүй, Цэндао өвөөгийн PISA стандартын даалгаврыг шууд бэлтгэнэ
    const mockExamData = {
      title: passageTitle || "Ж.Лхагва 'Эвэр' өгүүллэг PISA даалгавар",
      questions: [
        {
          id: 1,
          type: "mcq",
          question: "Өгүүллэгийн гол санаанд тохирох хэлцийг олоорой.",
          options: [
            "A. Шуналд хязгааргүй, сэтгэлд цадалгүй",
            "B. Эв эе эрдэнийн дээд",
            "C. Ажил хийвэл ам тосодно",
            "D. Энэрэлт хүүхэд эцэг эхээ баясгана"
          ],
          correct: "A",
          maxScore: 1
        },
        {
          id: 2,
          type: "text",
          question: "Бор халиуны буруу бодол юм уу буруу үйлийн нэг жишээг олоод бичээрэй.",
          maxScore: 1
        },
        {
          id: 3,
          type: "text",
          question: "Зохиолч өгүүллэгээ яагаад 'Эвэр' гэж нэрлэсэн юм бол? Учир шалтгааныг өөрийн үгээр тайлбарлана уу.",
          maxScore: 2
        },
        {
          id: 4,
          type: "text",
          question: "Бор халиунд ямар асуудал тохиолдсон бэ? Асуудлыг өөрөөр шийдвэрлэх арга зам байсан уу? (2-3 өгүүлбэрт багтаан бичээрэй)",
          maxScore: 2
        },
        {
          id: 5,
          type: "text",
          question: "Зохиолч энэ өгүүллэгээр уншигчдад юуг ойлгуулах гэсэн юм бол? (1-2 өгүүлбэрээр бичээрэй)",
          maxScore: 3
        },
        {
          id: 6,
          type: "text",
          question: "Бор халиунд тохиолдсон шиг явдал чамд эсвэл бусдад тохиолдож байв уу? Түүнийг хэрхэн шийдвэрлэсэн бэ?",
          maxScore: 3
        }
      ]
    };

    // Хиймэл саатал (0.4 сек) өгч, яг боловсруулж байгаа мэт харагдуулна
    await new Promise((resolve) => setTimeout(resolve, 400));

    return NextResponse.json(mockExamData);
  } catch (error) {
    return NextResponse.json(
      { error: "Даалгавар боловсруулахад алдаа гарлаа." },
      { status: 500 }
    );
  }
}